# Brand assets

`logo_watermark.py` renders the Future Ride logo from the same SVG paths used by
`src/components/Logo.tsx` and stamps it onto the site photography.

```bash
pip install pillow
python3 scripts/brand/logo_watermark.py
```

What it does:

- **`public/brand/logo-mark.png`** — the tile mark (navy square, forward-leaning F, green plug).
- **`public/brand/logo-white.png`** — mark + wordmark lockup in white, for dark artwork.
- **`public/brand/logo-navy.png`** — the same lockup in navy, for light artwork.
- **Every JPEG in `public/images/`** gets the lockup stamped into it. The script measures the
  brightness behind the logo and picks white or navy ink automatically, and it places the
  logo inside the area that survives the `object-cover` crops used on the home hero, Ekon,
  battery swap, fleet and about pages — so the mark is never cut off.

Space Grotesk (OFL) is bundled in `fonts/` so the script runs without network access; it is
the same display face the site loads from Google Fonts.
