
# SIT223 Sprint 1 — Prototype

This prototype implements the Sprint 1 scope:
- **US1**: Home page search that routes to `/search?q=...`.
- **US2**: News & Events block (≥4 items) sorted newest-first with "Read more" links.
- **US3**: Security & Privacy hardening (client-side).

## Run
Open `public/index.html` in a browser (no server needed).

## Security / Privacy / Accessibility
- All user-controlled content and URL params are rendered via `textContent` *(plain text — no HTML insertion)*.
- **XSS tests** like `<script>alert(1)</script>` and `"><img src=x onerror=alert(1)>` appear as text and do not execute.
- Minimal **CSP** meta tag included: `default-src 'self'; object-src 'none'`.
- Search input is **labelled**; Tab/Enter works; focus states are visible.
- Search ignores inputs `< 2` characters and **trims** whitespace.
- No tracking or personal data storage; search terms remain client-side.

## Structure
```
public/
  index.html        # Home with search + news preview
  search.html       # Search results page
  news-detail.html  # Placeholder detail page
src/
  css/styles.css
  js/app.js         # helpers + safe rendering
```

## Dev notes
- `NEWS_DATA` is in-memory to avoid `fetch()` limitations on `file://`.
- Dates use `DD Mon YYYY` format for display and are sorted newest-first.
