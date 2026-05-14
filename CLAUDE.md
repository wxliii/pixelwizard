# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static research project homepage for the paper "PixelWizard: Towards Efficient High-Fidelity Video Generation at Ultra-Large Spatial Resolution." No build step, no dependencies — open `index.html` in a browser to preview.

## Development

```bash
# Preview locally — just open the file
open index.html

# Or serve with any static file server for live reload
python3 -m http.server 8000
```

## Architecture

Single-page static site with three source files:

- **`index.html`** — All page content: hero with teaser image, abstract, method steps, results cards, media placeholders, BibTeX citation block, and sticky navigation. Sections are connected via anchor links (`#abstract`, `#method`, `#results`, `#media`, `#citation`).
- **`styles.css`** — CSS custom properties (`--bg`, `--ink`, `--accent`, etc.) define the color scheme. Layout uses CSS Grid with responsive breakpoints at 980px, 760px, and 540px. The `styles.css` link in HTML includes a cache-busting query string (e.g. `?v=20260511-5`) — bump this when changing styles.
- **`script.js`** — Handles BibTeX copy-to-clipboard for all `[data-copy]` buttons and manages the toast notification. Citations are keyed by the `data-copy` attribute value (currently `"pixelwizard"`).
- **`assets/`** — `logo.png` (favicon + brand), `teaser/teaser.jpeg` (hero image), `hero-teaser.svg`.

## Key Patterns

- **BibTeX sync**: The BibTeX text lives in the `<pre><code id="bibtex">` block in HTML. `script.js` reads it at load time via `bibtex?.textContent.trim()`. If you change the BibTeX, edit the HTML block — the JS will pick it up automatically.
- **Cache busting**: The CSS file version query string (`?v=...`) must be updated manually when editing `styles.css`, otherwise browsers may serve a cached version on GitHub Pages.
- **Responsive grid**: Multi-column layouts collapse to 2-col at 980px and 1-col at 760px. The `.media-placeholder.wide` spans full width on desktop but reverts to single cell on mobile.
- **Deploy**: Push to `main` branch; GitHub Pages serves from repo root. The `.nojekyll` file prevents Jekyll processing.
