# Poster Images

Place high-quality MCU poster images here.

## Recommended
- File naming must match the `thumbnail` field in `data/movies.json` exactly.
- Recommended size: 600×900px (2:3 ratio) or higher.
- Use JPG or WebP for best performance.
- All images should feel premium (official theatrical posters preferred).

## Current Expected Files (examples)
- captain-america-first-avenger.jpg
- iron-man.jpg
- the-avengers.jpg
- avengers-endgame.jpg
- ... (see data/movies.json for full list)

## Fallback Behavior
The site includes a **stunning cinematic poster fallback** component.

If an image is missing:
- A beautifully designed dark gradient poster with elegant typography, phase, year, and subtle red/gold accents is shown automatically.
- This fallback is intentionally premium so the site looks world-class even before you add real artwork.

## How to add images later
1. Drop the correctly named files into this folder.
2. No code changes required — the Poster component will pick them up instantly.
3. For best results, optimize images (use `cwebp` or Next.js image optimization in production).

Enjoy the timeline.
