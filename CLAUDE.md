# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static research project homepage for the paper "PixelWizard: Towards Efficient High-Fidelity Video Generation at Ultra-Large Spatial Resolution." No build step, no dependencies — open `index.html` in a browser to preview.

## Development

```bash
# Preview locally
open index.html

# Or serve with any static file server
python3 -m http.server 8000
```

## Architecture

Single-page static site with three source files, dark-themed (inspired by MoCha/Nerfies academic project templates):

- **`index.html`** — Page content: navbar, hero, teaser figure, highlights, abstract, method steps, results, demo videos, BibTeX. Sections use anchor links (`#abstract`, `#method`, `#results`, `#media`, `#citation`).
- **`styles.css`** — Dark theme via CSS custom properties (`--bg: #020202`, `--ink: #f5f5f5`, `--accent: #6fb0ff`). Uses Inter + Playfair Display fonts. Layout uses CSS Grid with responsive breakpoints at 860px and 640px. Cache-busting query string (`?v=...`) must be bumped when editing.
- **`script.js`** — Scroll fade-in (IntersectionObserver on `.fade-in` elements), navbar shadow, BibTeX copy-to-clipboard (`[data-copy]` buttons), toast notifications.
- **`assets/`** — `logo.png`, `teaser/teaser.jpeg`, `videos/34.mov` (demo video).

## Key Patterns

- **BibTeX sync**: BibTeX text lives in `<pre><code id="bibtex">`. JS reads it at load via `bibtex?.textContent.trim()`. Edit the HTML block — JS picks it up automatically.
- **Scroll animations**: Elements with class `.fade-in` animate in on scroll. No JS class toggling needed on body — the observer handles it directly.
- **Video files**: Place mp4/mov files in `assets/videos/` and reference them in `<video src="...">` tags in the media section. Note: `.mov` works in Safari; `.mp4` is safer for cross-browser.
- **Deploy**: Push to `main`; GitHub Pages serves from repo root. `.nojekyll` prevents Jekyll processing.
