#!/usr/bin/env python3
"""Find recently released Steam games above a review-count threshold.

The script reads Steam's public store-search results, checks each recent game's
review summary, and stores both the current game state and daily snapshots in
SQLite. It uses only Python's standard library.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import random
import sqlite3
import sys
import time
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


SEARCH_URL = "https://store.steampowered.com/search/results/"
REVIEWS_URL = "https://store.steampowered.com/appreviews/{appid}"
HOVER_URL = "https://store.steampowered.com/apphoverpublic/{appid}"
DEFAULT_USER_AGENT = "steam-recent-review-tracker/1.0 (personal research)"


@dataclass(frozen=True)
class Game:
    appid: int
    name: str
    release_date: date
    price_cents: int | None
    tag_ids: tuple[int, ...]
    capsule_url: str | None


class SearchResultsParser(HTMLParser):
    """Extract game rows from the HTML fragment returned by Steam search."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.games: list[
            tuple[int, str, str, int | None, tuple[int, ...], str | None]
        ] = []
        self._in_row = False
        self._appid: int | None = None
        self._title_parts: list[str] = []
        self._date_parts: list[str] = []
        self._capture: str | None = None
        self._price_cents: int | None = None
        self._tag_ids: tuple[int, ...] = ()
        self._capsule_url: str | None = None

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = dict(attrs_list)
        classes = set((attrs.get("class") or "").split())

        if tag == "a" and "search_result_row" in classes:
            raw_appid = (attrs.get("data-ds-appid") or "").split(",", 1)[0]
            if raw_appid.isdigit():
                self._in_row = True
                self._appid = int(raw_appid)
                self._title_parts = []
                self._date_parts = []
                self._price_cents = None
                self._capsule_url = None
                try:
                    parsed_tags = json.loads(attrs.get("data-ds-tagids") or "[]")
                    self._tag_ids = tuple(int(tag) for tag in parsed_tags)
                except (TypeError, ValueError, json.JSONDecodeError):
                    self._tag_ids = ()
            return

        if self._in_row:
            image_src = attrs.get("src")
            if tag == "img" and image_src and "capsule_" in image_src:
                self._capsule_url = image_src
            raw_price = attrs.get("data-price-final")
            if self._price_cents is None and raw_price and raw_price.isdigit():
                self._price_cents = int(raw_price)
            if "title" in classes:
                self._capture = "title"
            elif "search_released" in classes:
                self._capture = "date"

    def handle_endtag(self, tag: str) -> None:
        if not self._in_row:
            return
        if tag == "a" and self._appid is not None:
            name = " ".join("".join(self._title_parts).split())
            released = " ".join("".join(self._date_parts).split())
            if name and released:
                self.games.append(
                    (
                        self._appid,
                        name,
                        released,
                        self._price_cents,
                        self._tag_ids,
                        self._capsule_url,
                    )
                )
            self._appid = None
            self._in_row = False
        self._capture = None

    def handle_data(self, data: str) -> None:
        if self._capture == "title":
            self._title_parts.append(data)
        elif self._capture == "date":
            self._date_parts.append(data)


def parse_release_date(value: str) -> date | None:
    value = html.unescape(value).strip()
    for fmt in ("%b %d, %Y", "%d %b, %Y", "%b %Y", "%Y-%m-%d"):
        try:
            parsed = datetime.strptime(value, fmt).date()
            if fmt == "%b %Y":
                return parsed.replace(day=1)
            return parsed
        except ValueError:
            pass
    return None


class HoverTagsParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.tags: list[str] = []
        self._capture = False

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = dict(attrs_list)
        classes = set((attrs.get("class") or "").split())
        if "app_tag" in classes:
            self._capture = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "div":
            self._capture = False

    def handle_data(self, data: str) -> None:
        value = " ".join(data.split())
        if self._capture and value:
            self.tags.append(value)


class SteamClient:
    def __init__(self, user_agent: str, delay: float, timeout: float = 30.0) -> None:
        self.user_agent = user_agent
        self.delay = max(0.0, delay)
        self.timeout = timeout
        self._last_request_at = 0.0

    def _throttle(self) -> None:
        remaining = self.delay - (time.monotonic() - self._last_request_at)
        if remaining > 0:
            time.sleep(remaining + random.uniform(0, min(0.1, self.delay)))

    def get_text(self, url: str, params: dict[str, Any]) -> str:
        full_url = f"{url}?{urlencode(params)}"
        max_attempts = 8
        last_error = "unknown error"
        for attempt in range(max_attempts):
            self._throttle()
            request = Request(
                full_url,
                headers={"User-Agent": self.user_agent, "Accept": "application/json"},
            )
            try:
                with urlopen(request, timeout=self.timeout) as response:
                    body = response.read().decode("utf-8")
                self._last_request_at = time.monotonic()
                return body
            except HTTPError as exc:
                self._last_request_at = time.monotonic()
                if exc.code != 429 and not 500 <= exc.code < 600:
                    raise
                retry_after = exc.headers.get("Retry-After")
                if exc.code == 429:
                    wait = max(
                        _retry_after_seconds(retry_after) or 0,
                        min(120.0, 30.0 * (attempt + 1)),
                    )
                else:
                    wait = min(60.0, float(2**attempt))
                last_error = f"HTTP {exc.code}"
            except (URLError, TimeoutError) as exc:
                self._last_request_at = time.monotonic()
                wait = min(60.0, float(2**attempt))
                last_error = type(exc).__name__
            if attempt == max_attempts - 1:
                raise RuntimeError(
                    f"Steam request failed after {max_attempts} attempts "
                    f"({last_error}): {full_url}"
                )
            print(
                f"Steam request retry {attempt + 1}/{max_attempts} after "
                f"{last_error}; waiting {wait:.1f}s",
                file=sys.stderr,
            )
            time.sleep(wait + random.uniform(0, 0.5))
        raise AssertionError("unreachable")

    def get_json(self, url: str, params: dict[str, Any]) -> Any:
        full_url = f"{url}?{urlencode(params)}"
        try:
            return json.loads(self.get_text(url, params))
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"Steam returned invalid JSON: {full_url}") from exc


def _retry_after_seconds(value: str | None) -> float | None:
    if not value:
        return None
    try:
        return max(0.0, float(value))
    except ValueError:
        try:
            retry_at = parsedate_to_datetime(value)
            return max(0.0, (retry_at - datetime.now(timezone.utc)).total_seconds())
        except (TypeError, ValueError):
            return None


def discover_recent_games(
    client: SteamClient,
    cutoff: date,
    today: date,
    page_size: int,
    max_games: int | None,
    search_delay: float,
) -> tuple[list[Game], bool]:
    games: dict[int, Game] = {}
    start = 0
    complete = False

    while True:
        payload = client.get_json(
            SEARCH_URL,
            {
                "query": "",
                "start": start,
                "count": page_size,
                "dynamic_data": "",
                "sort_by": "Released_DESC",
                "category1": 998,
                "ignore_preferences": 1,
                "infinite": 1,
                "l": "english",
                "cc": "us",
            },
        )
        parser = SearchResultsParser()
        parser.feed(payload.get("results_html", ""))
        if not parser.games:
            if start == 0:
                raise RuntimeError("Steam search returned no parseable game rows")
            complete = True
            break

        reached_cutoff = False
        for appid, name, raw_date, price_cents, tag_ids, capsule_url in parser.games:
            released = parse_release_date(raw_date)
            if released is None:
                continue
            if released < cutoff:
                reached_cutoff = True
                break
            if released <= today:
                games[appid] = Game(
                    appid, name, released, price_cents, tag_ids, capsule_url
                )
                if max_games is not None and len(games) >= max_games:
                    return list(games.values()), False

        print(f"Discovered {len(games)} games through search offset {start}", file=sys.stderr)
        if reached_cutoff:
            complete = True
            break
        start += len(parser.games)
        if search_delay > 0:
            time.sleep(search_delay + random.uniform(0, min(0.25, search_delay)))

    return list(games.values()), complete


def fetch_review_summary(client: SteamClient, appid: int, purchase_type: str) -> dict[str, Any]:
    payload = client.get_json(
        REVIEWS_URL.format(appid=appid),
        {
            "json": 1,
            "filter": "recent",
            "language": "all",
            "purchase_type": purchase_type,
            "num_per_page": 1,
        },
    )
    if payload.get("success") != 1 or "query_summary" not in payload:
        raise RuntimeError(f"Invalid review response for app {appid}")
    return payload["query_summary"]


def fetch_tags(client: SteamClient, appid: int) -> list[str]:
    parser = HoverTagsParser()
    parser.feed(
        client.get_text(
            HOVER_URL.format(appid=appid),
            {"l": "english", "pagev6": "true"},
        )
    )
    return list(dict.fromkeys(parser.tags))


SCHEMA = """
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS games (
    appid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    release_date TEXT NOT NULL,
    total_reviews INTEGER,
    total_positive INTEGER,
    total_negative INTEGER,
    review_score INTEGER,
    review_score_desc TEXT,
    price_cents INTEGER,
    capsule_url TEXT,
    tags_json TEXT NOT NULL DEFAULT '[]',
    owners_estimated INTEGER,
    revenue_estimated_cents INTEGER,
    qualifies INTEGER NOT NULL DEFAULT 0,
    in_window INTEGER NOT NULL DEFAULT 1,
    first_seen_at TEXT NOT NULL,
    last_checked_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS review_snapshots (
    appid INTEGER NOT NULL REFERENCES games(appid),
    captured_date TEXT NOT NULL,
    captured_at TEXT NOT NULL,
    purchase_type TEXT NOT NULL,
    total_reviews INTEGER NOT NULL,
    total_positive INTEGER NOT NULL,
    total_negative INTEGER NOT NULL,
    review_score INTEGER,
    review_score_desc TEXT,
    PRIMARY KEY (appid, captured_date, purchase_type)
);

CREATE TABLE IF NOT EXISTS collection_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL,
    finished_at TEXT,
    cutoff_date TEXT NOT NULL,
    minimum_reviews INTEGER NOT NULL,
    purchase_type TEXT NOT NULL,
    games_discovered INTEGER,
    games_checked INTEGER,
    games_qualified INTEGER,
    status TEXT NOT NULL,
    error TEXT
);

CREATE INDEX IF NOT EXISTS idx_games_qualified
ON games(in_window, qualifies, total_reviews DESC);
"""


def initialize_database(path: Path) -> sqlite3.Connection:
    connection = sqlite3.connect(path)
    connection.execute("PRAGMA busy_timeout = 5000")
    connection.executescript(SCHEMA)
    existing = {row[1] for row in connection.execute("PRAGMA table_info(games)")}
    migrations = {
        "price_cents": "ALTER TABLE games ADD COLUMN price_cents INTEGER",
        "capsule_url": "ALTER TABLE games ADD COLUMN capsule_url TEXT",
        "tags_json": "ALTER TABLE games ADD COLUMN tags_json TEXT NOT NULL DEFAULT '[]'",
        "owners_estimated": "ALTER TABLE games ADD COLUMN owners_estimated INTEGER",
        "revenue_estimated_cents": (
            "ALTER TABLE games ADD COLUMN revenue_estimated_cents INTEGER"
        ),
    }
    for column, statement in migrations.items():
        if column not in existing:
            connection.execute(statement)
    connection.commit()
    return connection


def save_game_summary(
    db: sqlite3.Connection,
    game: Game,
    summary: dict[str, Any],
    checked_at: str,
    purchase_type: str,
    minimum_reviews: int,
    tags: list[str],
    owners_per_review: float,
    revenue_factor: float,
) -> bool:
    total = int(summary.get("total_reviews", 0))
    positive = int(summary.get("total_positive", 0))
    negative = int(summary.get("total_negative", 0))
    score = summary.get("review_score")
    description = summary.get("review_score_desc")
    qualifies = total >= minimum_reviews
    owners_estimated = round(total * owners_per_review)
    revenue_estimated_cents = round(
        owners_estimated * (game.price_cents or 0) * revenue_factor
    )

    db.execute(
        """
        INSERT INTO games (
            appid, name, release_date, total_reviews, total_positive,
            total_negative, review_score, review_score_desc, price_cents,
            capsule_url, tags_json, owners_estimated, revenue_estimated_cents, qualifies,
            in_window, first_seen_at, last_checked_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        ON CONFLICT(appid) DO UPDATE SET
            name=excluded.name,
            release_date=excluded.release_date,
            total_reviews=excluded.total_reviews,
            total_positive=excluded.total_positive,
            total_negative=excluded.total_negative,
            review_score=excluded.review_score,
            review_score_desc=excluded.review_score_desc,
            price_cents=excluded.price_cents,
            capsule_url=excluded.capsule_url,
            tags_json=excluded.tags_json,
            owners_estimated=excluded.owners_estimated,
            revenue_estimated_cents=excluded.revenue_estimated_cents,
            qualifies=excluded.qualifies,
            in_window=1,
            last_checked_at=excluded.last_checked_at
        """,
        (
            game.appid,
            game.name,
            game.release_date.isoformat(),
            total,
            positive,
            negative,
            score,
            description,
            game.price_cents,
            game.capsule_url,
            json.dumps(tags, ensure_ascii=False),
            owners_estimated,
            revenue_estimated_cents,
            int(qualifies),
            checked_at,
            checked_at,
        ),
    )
    db.execute(
        """
        INSERT INTO review_snapshots (
            appid, captured_date, captured_at, purchase_type, total_reviews,
            total_positive, total_negative, review_score, review_score_desc
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(appid, captured_date, purchase_type) DO UPDATE SET
            captured_at=excluded.captured_at,
            total_reviews=excluded.total_reviews,
            total_positive=excluded.total_positive,
            total_negative=excluded.total_negative,
            review_score=excluded.review_score,
            review_score_desc=excluded.review_score_desc
        """,
        (
            game.appid,
            checked_at[:10],
            checked_at,
            purchase_type,
            total,
            positive,
            negative,
            score,
            description,
        ),
    )
    return qualifies


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=Path("steam_recent_games.sqlite3"))
    parser.add_argument("--days", type=int, default=90, help="Rolling release window (default: 90)")
    parser.add_argument(
        "--min-reviews",
        type=int,
        default=500,
        help="Require at least this many reviews (default: 500)",
    )
    parser.add_argument(
        "--purchase-type",
        choices=("steam", "all", "non_steam_purchase"),
        default="steam",
        help="Which reviews to count (default: steam)",
    )
    parser.add_argument("--delay", type=float, default=0.5, help="Minimum delay between requests")
    parser.add_argument(
        "--search-delay",
        type=float,
        default=1.0,
        help="Extra pause between large search-result pages (default: 1 second)",
    )
    parser.add_argument("--page-size", type=int, default=100)
    parser.add_argument(
        "--owners-per-review",
        type=float,
        default=30.0,
        help="Owner estimate multiplier (default: 30)",
    )
    parser.add_argument(
        "--revenue-factor",
        type=float,
        default=0.412,
        help="Estimated realized share of gross list-price revenue (default: 0.412)",
    )
    parser.add_argument(
        "--max-games",
        type=int,
        help="Testing option: stop discovery after this many games",
    )
    parser.add_argument(
        "--user-agent",
        default=os.environ.get("STEAM_USER_AGENT", DEFAULT_USER_AGENT),
    )
    args = parser.parse_args()
    if args.days < 1 or args.min_reviews < 0 or args.page_size < 1 or args.page_size > 100:
        parser.error("days/page-size must be positive; min-reviews cannot be negative")
    if args.owners_per_review < 0 or not 0 <= args.revenue_factor <= 1:
        parser.error("owners-per-review must be positive and revenue-factor must be 0..1")
    if args.max_games is not None and args.max_games < 1:
        parser.error("max-games must be positive")
    if args.delay < 0 or args.search_delay < 0:
        parser.error("delays cannot be negative")
    return args


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="backslashreplace")
    args = parse_args()
    now = datetime.now(timezone.utc)
    today = now.date()
    cutoff = today - timedelta(days=args.days)
    started_at = now.isoformat(timespec="seconds")
    client = SteamClient(args.user_agent, args.delay)
    db = initialize_database(args.database)
    run_id = db.execute(
        """
        INSERT INTO collection_runs (
            started_at, cutoff_date, minimum_reviews, purchase_type, status
        ) VALUES (?, ?, ?, ?, 'running')
        """,
        (started_at, cutoff.isoformat(), args.min_reviews, args.purchase_type),
    ).lastrowid
    db.commit()

    try:
        games, discovery_complete = discover_recent_games(
            client,
            cutoff,
            today,
            args.page_size,
            args.max_games,
            args.search_delay,
        )
        if discovery_complete:
            db.execute("UPDATE games SET in_window = 0")

        qualified: list[tuple[Game, int]] = []
        checked = 0
        for index, game in enumerate(games, start=1):
            try:
                summary = fetch_review_summary(client, game.appid, args.purchase_type)
            except Exception as exc:
                print(f"Warning: skipping {game.appid} ({game.name}): {exc}", file=sys.stderr)
                continue
            checked_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
            tags: list[str] = []
            if int(summary.get("total_reviews", 0)) >= args.min_reviews:
                try:
                    tags = fetch_tags(client, game.appid)
                except Exception as exc:
                    print(f"Warning: tags unavailable for {game.appid}: {exc}", file=sys.stderr)
            if save_game_summary(
                db,
                game,
                summary,
                checked_at,
                args.purchase_type,
                args.min_reviews,
                tags,
                args.owners_per_review,
                args.revenue_factor,
            ):
                qualified.append((game, int(summary["total_reviews"])))
            checked += 1
            if index % 25 == 0:
                db.commit()
                print(f"Checked reviews for {index}/{len(games)} games", file=sys.stderr)

        purged = 0
        if discovery_complete:
            expired = db.execute(
                "SELECT appid FROM games WHERE release_date < ?",
                (cutoff.isoformat(),),
            ).fetchall()
            if expired:
                appids = [row[0] for row in expired]
                placeholders = ",".join("?" for _ in appids)
                db.execute(
                    f"DELETE FROM review_snapshots WHERE appid IN ({placeholders})",
                    appids,
                )
                purged = db.execute(
                    f"DELETE FROM games WHERE appid IN ({placeholders})",
                    appids,
                ).rowcount

        finished_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
        db.execute(
            """
            UPDATE collection_runs SET
                finished_at=?, games_discovered=?, games_checked=?,
                games_qualified=?, status='complete'
            WHERE id=?
            """,
            (finished_at, len(games), checked, len(qualified), run_id),
        )
        db.commit()

        print(f"\nQualified games: {len(qualified)}")
        for game, total in sorted(qualified, key=lambda item: item[1], reverse=True):
            print(f"{total:>8}  {game.release_date}  {game.appid:<10}  {game.name}")
        print(f"\nSaved data to {args.database.resolve()}")
        print(f"Removed {purged} games released before {cutoff.isoformat()}")
        return 0
    except Exception as exc:
        finished_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
        db.execute(
            "UPDATE collection_runs SET finished_at=?, status='failed', error=? WHERE id=?",
            (finished_at, str(exc), run_id),
        )
        db.commit()
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
