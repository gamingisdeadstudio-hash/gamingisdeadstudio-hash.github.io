#!/usr/bin/env python3
"""Export the Steam Signal SQLite database as static JSON for GitHub Pages."""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path


CATEGORIES = {
    "rising": (500, 1_000),
    "hits": (1_000, 10_000),
    "megahits": (10_000, None),
}


def category_for(reviews: int) -> str | None:
    for name, (lower, upper) in CATEGORIES.items():
        if reviews >= lower and (upper is None or reviews < upper):
            return name
    return None


def export(database: Path, output: Path) -> None:
    db = sqlite3.connect(database)
    db.row_factory = sqlite3.Row
    try:
        latest = db.execute(
            """
            SELECT started_at, finished_at, cutoff_date
            FROM collection_runs
            WHERE status = 'complete' AND finished_at IS NOT NULL
            ORDER BY id DESC LIMIT 1
            """
        ).fetchone()
        if latest is None:
            raise RuntimeError("No completed collection run found")

        rows = db.execute(
            """
            SELECT appid, name, release_date, total_reviews, total_positive,
                   price_cents, capsule_url, tags_json, owners_estimated,
                   revenue_estimated_cents, first_seen_at
            FROM games
            WHERE in_window = 1 AND qualifies = 1 AND release_date >= ?
            ORDER BY total_reviews DESC, release_date DESC
            """,
            (latest["cutoff_date"],),
        ).fetchall()

        counts = {name: 0 for name in CATEGORIES}
        games = []
        for row in rows:
            reviews = row["total_reviews"] or 0
            category = category_for(reviews)
            if category is None:
                continue
            counts[category] += 1
            positive = row["total_positive"] or 0
            try:
                tags = json.loads(row["tags_json"] or "[]")
            except json.JSONDecodeError:
                tags = []
            appid = row["appid"]
            games.append(
                {
                    "appid": appid,
                    "title": row["name"],
                    "steam_url": f"https://store.steampowered.com/app/{appid}",
                    "release_date": row["release_date"],
                    "reviews_total": reviews,
                    "reviews_score": round(positive / reviews * 100) if reviews else 0,
                    "price_cents": row["price_cents"],
                    "capsule_url": row["capsule_url"],
                    "tags": tags,
                    "owners_estimated": row["owners_estimated"],
                    "revenue_estimated_cents": row["revenue_estimated_cents"],
                    "category": category,
                    "is_new": row["first_seen_at"] >= latest["started_at"],
                }
            )

        payload = {
            "updated_at": latest["finished_at"],
            "cutoff_date": latest["cutoff_date"],
            "counts": counts,
            "games": games,
        }
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=Path("data/steam_recent_games.sqlite3"))
    parser.add_argument("--output", type=Path, default=Path("data/steam_games.json"))
    args = parser.parse_args()
    export(args.database, args.output)


if __name__ == "__main__":
    main()
