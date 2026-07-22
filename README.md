# Personal website

Static portfolio, browser games, and Steam Signal dashboard for GitHub Pages.

## Local preview

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Steam Signal data

The SQLite collector tracks Steam releases from the last 90 days. The Pages
workflow refreshes it every Monday at 05:17 UTC, removes expired releases,
exports browser-readable JSON, commits both data files, and deploys the site.

Run the export locally after changing the database:

```powershell
python scripts\export_steam_data.py
```
