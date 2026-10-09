#!/usr/bin/env python3
"""
Future Ride brand tooling — render the site logo and stamp it onto the site photography.

The logo lives in code as `src/components/Logo.tsx` (the same paths are used here, so the
rasterised artwork always matches the mark in the navigation bar). This script:

  1. renders the Future Ride mark (navy tile + forward-leaning F + green plug) from those
     SVG paths,
  2. builds two lockups — mark + "Future Ride" wordmark + tagline — one white (for dark
     photos), one navy (for light photos),
  3. stamps the right lockup onto every photo in `public/images/`, positioned inside the
     area that survives the `object-cover` crops used across the site,
  4. writes the reusable brand assets to `public/brand/`.

Requires Python 3 with Pillow:

    pip install pillow
    python3 scripts/brand/logo_watermark.py

Fonts: Space Grotesk (OFL) is bundled in `scripts/brand/fonts/` so the script is
self-contained. It is the same display face the site loads from Google Fonts.
"""

from __future__ import annotations

import math
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
BRAND_DIR = ROOT / "scripts" / "brand"
FONT_DIR = BRAND_DIR / "fonts"
IMAGE_DIR = ROOT / "public" / "images"
OUT_BRAND = ROOT / "public" / "brand"

NAVY = (10, 31, 68, 255)      # --color-navy
GREEN = (34, 197, 94, 255)    # --color-brand-bright
WHITE = (255, 255, 255, 255)

# Same geometry as src/components/Logo.tsx (viewBox 0 0 64 64).
F_PATH = "M20 14h20l-3 8H28l-2 7h12l-3 8H24l-4 13h-8l8-36z"
PLUG_PATH = (
    "M42 30v-6h4v6h5v-6h4v6h3a2 2 0 0 1 2 2v5a9 9 0 0 1-7 8.8V52h-4v-6.2"
    "A9 9 0 0 1 42 37v-5a2 2 0 0 1 2-2h-2z"
)

# --------------------------------------------------------------------------- path flattening


def _arc_points(p0, rx, ry, phi_deg, large_arc, sweep, p1, steps=64):
    """Sample an SVG elliptical arc into line segments (endpoint parameterisation)."""
    if rx == 0 or ry == 0:
        return [p1]
    phi = math.radians(phi_deg)
    cos_p, sin_p = math.cos(phi), math.sin(phi)

    x1, y1 = p0
    x2, y2 = p1
    dx2, dy2 = (x1 - x2) / 2.0, (y1 - y2) / 2.0
    x1p = cos_p * dx2 + sin_p * dy2
    y1p = -sin_p * dx2 + cos_p * dy2

    rx, ry = abs(rx), abs(ry)
    lam = (x1p / rx) ** 2 + (y1p / ry) ** 2
    if lam > 1:
        scale = math.sqrt(lam)
        rx *= scale
        ry *= scale

    num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    coef = math.sqrt(max(num / den, 0.0))
    if large_arc == sweep:
        coef = -coef
    cxp = coef * rx * y1p / ry
    cyp = -coef * ry * x1p / rx

    cx = cos_p * cxp - sin_p * cyp + (x1 + x2) / 2.0
    cy = sin_p * cxp + cos_p * cyp + (y1 + y2) / 2.0

    def angle(ux, uy, vx, vy):
        dot = ux * vx + uy * vy
        norm = math.sqrt(ux * ux + uy * uy) * math.sqrt(vx * vx + vy * vy) or 1.0
        a = math.acos(max(-1.0, min(1.0, dot / norm)))
        return -a if (ux * vy - uy * vx) < 0 else a

    theta1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
    dtheta = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
    if not sweep and dtheta > 0:
        dtheta -= 2 * math.pi
    elif sweep and dtheta < 0:
        dtheta += 2 * math.pi

    pts = []
    for i in range(1, steps + 1):
        t = theta1 + dtheta * (i / steps)
        ct, st = math.cos(t), math.sin(t)
        x = cos_p * rx * ct - sin_p * ry * st + cx
        y = sin_p * rx * ct + cos_p * ry * st + cy
        pts.append((x, y))
    return pts


_TOKEN = re.compile(r"[MmLlHhVvAaZz]|-?\d*\.?\d+(?:[eE][-+]?\d+)?")


def flatten_path(d: str, steps=64):
    """Flatten the SVG subset used by the logo (M/L/H/V/A + relative forms + Z)."""
    tokens = _TOKEN.findall(d)
    points: list[tuple[float, float]] = []
    subpaths: list[list[tuple[float, float]]] = []
    i = 0
    x = y = 0.0
    start = (0.0, 0.0)
    cmd = None

    def num():
        nonlocal i
        value = float(tokens[i])
        i += 1
        return value

    while i < len(tokens):
        token = tokens[i]
        if token.isalpha():
            cmd = token
            i += 1
            if cmd in "Zz":
                if points:
                    points.append(start)
                    subpaths.append(points)
                    points = []
                x, y = start
            continue

        if cmd in "Mm":
            px, py = num(), num()
            x, y = (px, py) if cmd == "M" else (x + px, y + py)
            start = (x, y)
            points = [(x, y)]
        elif cmd in "Ll":
            px, py = num(), num()
            x, y = (px, py) if cmd == "L" else (x + px, y + py)
            points.append((x, y))
        elif cmd in "Hh":
            px = num()
            x = px if cmd == "H" else x + px
            points.append((x, y))
        elif cmd in "Vv":
            py = num()
            y = py if cmd == "V" else y + py
            points.append((x, y))
        elif cmd in "Aa":
            rx, ry = num(), num()
            phi = num()
            large = int(round(num()))
            sweep = int(round(num()))
            px, py = num(), num()
            end = (px, py) if cmd == "A" else (x + px, y + py)
            points.extend(_arc_points((x, y), rx, ry, phi, large, sweep, end, steps))
            x, y = end
        else:
            raise ValueError(f"unsupported path command {cmd!r}")

    if points:
        subpaths.append(points)
    return subpaths


# ----------------------------------------------------------------------------- logo rendering


def _polygon(draw, subpaths, fill, scale, transform=lambda p: p):
    for pts in subpaths:
        scaled = [(transform((px, py))[0] * scale, transform((px, py))[1] * scale) for px, py in pts]
        draw.polygon(scaled, fill=fill)


def render_mark(size: int) -> Image.Image:
    """The Future Ride tile: navy rounded square, white leaning F, green plug."""
    ss = 8  # supersample for clean edges
    side = 64 * ss
    img = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, side - 1, side - 1], radius=14 * ss, fill=NAVY)

    # forward-leaning F: skewX(-6) => x' = x + y * tan(-6deg)
    tan = math.tan(math.radians(-6))
    _polygon(draw, flatten_path(F_PATH), WHITE, ss, transform=lambda p: (p[0] + p[1] * tan, p[1]))
    # plug: translate(-6 0) scale(0.92)
    _polygon(draw, flatten_path(PLUG_PATH), GREEN, ss, transform=lambda p: (p[0] * 0.92 - 6, p[1] * 0.92))

    return img.resize((size, size), Image.LANCZOS)


def _text_width(draw, text, font, tracking):
    return sum(draw.textlength(ch, font=font) + tracking for ch in text) - tracking


def _draw_text(draw, xy, text, font, tracking, fill):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def render_lockup(mark_size: int, ink: tuple[int, int, int, int], opacity: float = 1.0) -> Image.Image:
    """Mark + wordmark + tagline, rendered on a transparent canvas."""
    ss = 4
    word_size = round(mark_size * 0.46 * ss)
    tag_size = round(mark_size * 0.175 * ss)
    word_tracking = round(mark_size * 0.03 * ss)
    tag_tracking = round(mark_size * 0.055 * ss)
    gap = round(mark_size * 0.26 * ss)
    line_gap = round(mark_size * 0.12 * ss)

    bold = ImageFont.truetype(str(FONT_DIR / "SpaceGrotesk-Bold.ttf"), word_size)
    regular = ImageFont.truetype(str(FONT_DIR / "SpaceGrotesk-Regular.ttf"), tag_size)

    probe = ImageDraw.Draw(Image.new("RGBA", (8, 8)))
    word = "Future Ride"
    tag = "SPIRO DISTRIBUTOR · GHANA"
    word_w = _text_width(probe, word, bold, word_tracking)
    tag_w = _text_width(probe, tag, regular, tag_tracking)

    mark = render_mark(mark_size * ss)
    text_w = max(word_w, tag_w)
    word_h = word_size * 0.78
    text_h = word_h + line_gap + tag_size * 0.95

    w = mark.width + gap + round(text_w)
    h = max(mark.height, round(text_h))
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    canvas.alpha_composite(mark, dest=(0, (h - mark.height) // 2))

    draw = ImageDraw.Draw(canvas)
    tx = mark.width + gap
    ty = (h - text_h) / 2
    tag_ink = (ink[0], ink[1], ink[2], int(round(ink[3] * 0.72)))
    _draw_text(draw, (tx, ty), word, bold, word_tracking, ink)
    _draw_text(draw, (tx, ty + word_h + line_gap), tag, regular, tag_tracking, tag_ink)

    canvas = canvas.resize((max(1, w // ss), max(1, h // ss)), Image.LANCZOS)
    if opacity < 1.0:
        alpha = canvas.split()[3].point(lambda v: int(v * opacity))
        canvas.putalpha(alpha)
    return canvas


def with_shadow(layer: Image.Image, blur: float, offset: float, strength: float) -> Image.Image:
    pad = int(blur * 3) + 8
    dx = int(offset)
    canvas = Image.new("RGBA", (layer.width + pad * 2 + dx, layer.height + pad * 2 + dx), (0, 0, 0, 0))
    alpha = layer.split()[3].point(lambda v: int(v * strength))
    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 255))
    shadow.putalpha(alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(shadow, dest=(pad + dx, pad + dx))
    canvas.alpha_composite(layer, dest=(pad, pad))
    return canvas


# --------------------------------------------------------------------------------- stamping

# Where the logo goes, as a fraction of the photo. Kept inside the area that survives the
# `object-cover` crops used on the home hero, Ekon, battery swap, fleet and about pages.
ANCHOR_X = 0.90        # right edge of the lockup
ANCHOR_Y = 0.66        # vertical centre of the lockup
MAX_WIDTH_RATIO = 0.30  # lockup never wider than this share of the photo


def region_luminance(img: Image.Image, box) -> float:
    """Mean brightness of a region — decides whether the logo is stamped white or navy."""
    pixels = img.crop(box).convert("L").tobytes()
    return sum(pixels) / len(pixels)


def stamp(photo: Path) -> None:
    base = Image.open(photo).convert("RGB")
    W, H = base.size

    mark_size = max(28, round(H * 0.085))
    lock_w_guess = mark_size * 5.2
    scale = min(1.0, (W * MAX_WIDTH_RATIO) / lock_w_guess)
    mark_size = max(28, round(mark_size * scale))

    right = round(W * ANCHOR_X)
    cy = round(H * ANCHOR_Y)

    probe_box = (max(0, right - lock_w_guess), max(0, cy - mark_size), W, min(H, cy + mark_size))
    dark_bg = region_luminance(base, probe_box) < 150
    ink = WHITE if dark_bg else NAVY

    lockup = render_lockup(mark_size, ink)
    stamp_img = with_shadow(lockup, blur=max(2.0, mark_size * 0.10), offset=max(1, mark_size * 0.03),
                            strength=0.55 if dark_bg else 0.32)

    x = right - stamp_img.width
    y = cy - stamp_img.height // 2
    x = max(0, min(x, W - stamp_img.width))
    y = max(0, min(y, H - stamp_img.height))

    out = base.convert("RGBA")
    out.alpha_composite(stamp_img, dest=(x, y))
    out.convert("RGB").save(photo, quality=92, subsampling=0, optimize=True)
    print(f"  ✓ {photo.name}: logo {lockup.width}x{lockup.height}px at ({x}, {y}) · "
          f"{'white' if dark_bg else 'navy'} ink")


def main() -> None:
    OUT_BRAND.mkdir(parents=True, exist_ok=True)

    print("Brand assets → public/brand/")
    mark = render_mark(512)
    mark.save(OUT_BRAND / "logo-mark.png")
    lock_white = with_shadow(render_lockup(96, WHITE), blur=9, offset=3, strength=0.55)
    lock_white.save(OUT_BRAND / "logo-white.png")
    lock_navy = with_shadow(render_lockup(96, NAVY), blur=9, offset=3, strength=0.32)
    lock_navy.save(OUT_BRAND / "logo-navy.png")
    print(f"  ✓ logo-mark.png ({mark.width}x{mark.height})")
    print(f"  ✓ logo-white.png ({lock_white.width}x{lock_white.height})")
    print(f"  ✓ logo-navy.png  ({lock_navy.width}x{lock_navy.height})")

    print("Stamping photography → public/images/")
    for photo in sorted(IMAGE_DIR.glob("*.jpg")):
        if photo.name.endswith(".orig.jpg"):
            continue
        stamp(photo)


if __name__ == "__main__":
    main()
