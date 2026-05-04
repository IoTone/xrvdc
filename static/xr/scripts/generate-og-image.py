#!/usr/bin/env python3
"""
Generate the 1200x630 Open Graph share card.

Matches the cyberpunk theme: black background with a magenta glow on the
left, yellow HUD corner brackets, magenta REC dot, the project's logo on
the right, and event copy on the left. Mirrors the look of the badge
generator in static/xr/js/badge.js.

Run from anywhere:
    python3 static/xr/scripts/generate-og-image.py
Outputs:
    static/images/og-share.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[3]
LOGO = ROOT / "static" / "images" / "logo.png"
OUT = ROOT / "static" / "images" / "og-share.png"

W, H = 1200, 630

# Palette (sRGB)
BG = (5, 5, 5)
YELLOW = (255, 234, 0)
MAGENTA = (255, 0, 110)
INK = (237, 237, 237)
AMBER = (255, 184, 107)
MUTED = (122, 122, 133)
GREEN = (0, 255, 157)

# ── Font lookup (macOS system fonts; degrade to Pillow default) ────────────
def find_font(*candidates, size=48):
    for name in candidates:
        for base in (
            "/System/Library/Fonts/Supplemental",
            "/System/Library/Fonts",
            "/Library/Fonts",
        ):
            p = Path(base) / name
            if p.exists():
                try:
                    return ImageFont.truetype(str(p), size)
                except Exception:
                    pass
    return ImageFont.load_default()

FONT_TITLE  = find_font("HelveticaNeue.ttc", "Helvetica.ttc", "Arial.ttf", size=98)
FONT_SUB    = find_font("HelveticaNeue.ttc", "Helvetica.ttc", "Arial.ttf", size=46)
FONT_MONO_B = find_font("Menlo.ttc", "Courier.ttc", size=34)
FONT_MONO_S = find_font("Menlo.ttc", "Courier.ttc", size=22)
FONT_MONO_T = find_font("Menlo.ttc", "Courier.ttc", size=18)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img, "RGBA")

# ── Magenta radial glow on left ───────────────────────────────────────────
def add_radial_glow(img, cx, cy, radius, color, max_alpha=70):
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    steps = 18
    for i in range(steps):
        a = int(max_alpha * (1 - i / steps) ** 2)
        r = int(radius * (i + 1) / steps)
        gd.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*color, a))
    glow = glow.filter(ImageFilter.GaussianBlur(40))
    img.alpha_composite(glow.convert("RGBA"))

img = img.convert("RGBA")
add_radial_glow(img, int(W * 0.20), int(H * 0.55), int(W * 0.55), MAGENTA, max_alpha=78)
add_radial_glow(img, int(W * 0.85), int(H * 0.85), int(W * 0.40), AMBER,   max_alpha=42)
d = ImageDraw.Draw(img, "RGBA")

# ── Scanlines ─────────────────────────────────────────────────────────────
for y in range(0, H, 3):
    d.line([(0, y), (W, y)], fill=(255, 255, 255, 7), width=1)

# ── Yellow HUD corner brackets ────────────────────────────────────────────
def bracket(x, y, leg, corner, w=4):
    # corner ∈ {tl, tr, bl, br}
    if corner == "tl":
        d.line([(x, y + leg), (x, y), (x + leg, y)], fill=YELLOW, width=w)
    elif corner == "tr":
        d.line([(x, y + leg), (x, y), (x - leg, y)], fill=YELLOW, width=w)
    elif corner == "bl":
        d.line([(x, y - leg), (x, y), (x + leg, y)], fill=YELLOW, width=w)
    elif corner == "br":
        d.line([(x, y - leg), (x, y), (x - leg, y)], fill=YELLOW, width=w)

M, L = 36, 64
bracket(M, M, L, "tl")
bracket(W - M, M, L, "tr")
bracket(M, H - M, L, "bl")
bracket(W - M, H - M, L, "br")

# ── Top-left node ID, top-right REC dot ──────────────────────────────────
d.text((78, 56), "[ NODE_ID :: FUK_01 // 06.26.26 ]", font=FONT_MONO_T, fill=GREEN)
# REC dot (drawn as a circle so we don't depend on font glyph) + label
rec_label_x = W - 130
d.ellipse((rec_label_x - 22, 64, rec_label_x - 6, 80), fill=MAGENTA)
d.text((rec_label_x, 60), "REC", font=FONT_MONO_T, fill=MAGENTA)

# ── Headline: "XR VisionDevCamp" ─────────────────────────────────────────
d.text((78, 158), "XR VisionDevCamp", font=FONT_TITLE, fill=YELLOW)

# ── Sub: Fukuoka · 2026 ──────────────────────────────────────────────────
d.text((80, 268), "Fukuoka  ·  2026", font=FONT_SUB, fill=INK)

# ── Magenta divider rule ─────────────────────────────────────────────────
d.line([(80, 350), (380, 350)], fill=MAGENTA, width=3)

# ── Date and venue ───────────────────────────────────────────────────────
d.text((80, 372), "// 26 - 28 JUNE 2026", font=FONT_MONO_B, fill=MAGENTA)
d.text((80, 422), "@ Engineer Cafe  ::  CIC Fukuoka", font=FONT_MONO_S, fill=AMBER)

# ── URL bottom-left ──────────────────────────────────────────────────────
d.text((80, H - 78), "// xrvdc.pages.dev", font=FONT_MONO_S, fill=AMBER)

# ── Logo on the right ────────────────────────────────────────────────────
if LOGO.exists():
    logo = Image.open(LOGO).convert("RGBA")
    # fit within ~ 380x380 keeping aspect
    target = 280
    lw, lh = logo.size
    s = target / max(lw, lh)
    logo = logo.resize((int(lw * s), int(lh * s)), Image.LANCZOS)
    # add a soft magenta glow behind
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gx, gy = int(W * 0.82), int(H * 0.50)
    for i in range(12):
        a = 60 - i * 4
        if a < 0: a = 0
        r = 40 + i * 14
        gd.ellipse((gx - r, gy - r, gx + r, gy + r), fill=(255, 0, 110, a))
    glow = glow.filter(ImageFilter.GaussianBlur(20))
    img.alpha_composite(glow)
    img.alpha_composite(
        logo,
        dest=(gx - logo.size[0] // 2, gy - logo.size[1] // 2),
    )

# ── Faint kana flourish bottom-right ─────────────────────────────────────
d2 = ImageDraw.Draw(img, "RGBA")
JP = find_font(
    "Hiragino Sans GB.ttc",
    "AppleSDGothicNeo.ttc",
    "AquaKana.ttc",
    size=20,
)
d2.text(
    (W - 80, H - 124),
    "ヴィジョンデブキャンプ ／ XR",
    font=JP,
    fill=(255, 0, 110, 230),
    anchor="rm",
)

# Final flatten and save
img.convert("RGB").save(OUT, "PNG", optimize=True)
print(f"Wrote {OUT}  ({OUT.stat().st_size:,} bytes)")
