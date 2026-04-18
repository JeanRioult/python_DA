"""Generate PWA icon PNGs in `assets/img/`.

Uses Pillow. If not installed:
    pip install Pillow

Run from project root:
    python tools/make_icons.py

Produces:
    icon-192.png        — standard, rounded square
    icon-512.png        — standard, rounded square
    icon-512-maskable.png — full square (OS clips to shape on Android)
    apple-touch-icon.png — 180x180 for iOS
    favicon.png         — 32x32 for browser tab
"""
from __future__ import annotations

from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    raise SystemExit(
        "Pillow is required. Install it with: pip install Pillow"
    )

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
IMG.mkdir(parents=True, exist_ok=True)

ACCENT = (44, 94, 138, 255)          # #2c5e8a (matches CSS accent)
LIGHT = (253, 251, 247, 255)         # #fdfbf7 (matches CSS bg)


def make_icon(size: int, *, maskable: bool = False) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Maskable icons are clipped by the OS — use a solid square with a
    # safe-zone margin so the shape is never cropped out.
    # Standard icons get a rounded square.
    if maskable:
        draw.rectangle([0, 0, size, size], fill=ACCENT)
        inner_scale = 0.72
    else:
        radius = int(size * 0.20)
        draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=ACCENT)
        inner_scale = 1.0

    # Three ascending bars (data chart motif).
    # Proportions match icon.svg so rasterized and vector icons look identical.
    margin = int(size * 0.22)
    usable = size - 2 * margin
    bar_w = int(usable * 72 / 288)            # 72 of 288 from SVG
    gap = int(usable * 36 / 288)
    base_y = int(size * 0.75)

    if maskable:
        # Shrink & re-center to honor the safe zone.
        center = size / 2
        margin = int((size - usable * inner_scale) / 2)
        bar_w = int(bar_w * inner_scale)
        gap = int(gap * inner_scale)
        base_y = int(center + (base_y - center) * inner_scale)

    heights_frac = [112 / 512, 184 / 512, 256 / 512]

    for i, h_frac in enumerate(heights_frac):
        h = int(size * h_frac * inner_scale)
        x = margin + i * (bar_w + gap)
        y = base_y - h
        draw.rectangle([x, y, x + bar_w, base_y], fill=LIGHT)

    return img


def main() -> None:
    targets = [
        ("icon-192.png", 192, False),
        ("icon-512.png", 512, False),
        ("icon-512-maskable.png", 512, True),
        ("apple-touch-icon.png", 180, False),
        ("favicon.png", 32, False),
    ]
    for name, size, maskable in targets:
        img = make_icon(size, maskable=maskable)
        out = IMG / name
        img.save(out, optimize=True)
        print(f"wrote {out.relative_to(ROOT)}  ({size}x{size}{', maskable' if maskable else ''})")


if __name__ == "__main__":
    main()
