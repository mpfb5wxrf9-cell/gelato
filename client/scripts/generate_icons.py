"""Genera le icone PWA/iOS per Aria (richiede Pillow: pip install Pillow).
Uso: python3 scripts/generate_icons.py
"""
import math
import os
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(OUT, exist_ok=True)

GRAD_TOP = (94, 92, 255)      # indaco
GRAD_BOTTOM = (0, 199, 190)   # teal — gradiente "Liquid Glass"


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def rounded_mask(size, radius):
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return mask


def gradient_square(size):
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        t = y / (size - 1)
        color = lerp(GRAD_TOP, GRAD_BOTTOM, t)
        for x in range(size):
            px[x, y] = color
    return img


def add_glass_highlight(img):
    size = img.size[0]
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.ellipse(
        [size * -0.15, size * -0.55, size * 1.15, size * 0.55],
        fill=(255, 255, 255, 70),
    )
    overlay = overlay.filter(ImageFilter.GaussianBlur(size * 0.03))
    base = img.convert("RGBA")
    return Image.alpha_composite(base, overlay)


def draw_bubble_lock(draw, size, scale=1.0, offset=(0, 0)):
    ox, oy = offset
    s = size * scale

    # Bolla di messaggio (rounded rect + coda)
    bw, bh = s * 0.62, s * 0.46
    bx = ox + (size - bw) / 2
    by = oy + size * 0.24
    draw.rounded_rectangle(
        [bx, by, bx + bw, by + bh], radius=bh * 0.32, fill=(255, 255, 255, 235)
    )
    tail = [
        (bx + bw * 0.28, by + bh * 0.98),
        (bx + bw * 0.46, by + bh * 0.98),
        (bx + bw * 0.22, by + bh * 1.28),
    ]
    draw.polygon(tail, fill=(255, 255, 255, 235))

    # Lucchetto al centro della bolla
    lock_w, lock_h = bw * 0.34, bh * 0.42
    lx = bx + (bw - lock_w) / 2
    ly = by + bh * 0.30
    shackle_r = lock_w * 0.42
    shackle_box = [
        lx + lock_w / 2 - shackle_r,
        ly - shackle_r * 1.15,
        lx + lock_w / 2 + shackle_r,
        ly + shackle_r * 0.85,
    ]
    draw.arc(shackle_box, start=180, end=360, fill=GRAD_TOP, width=max(2, int(lock_w * 0.16)))
    draw.rounded_rectangle(
        [lx, ly + lock_h * 0.15, lx + lock_w, ly + lock_h * 0.15 + lock_h * 0.7],
        radius=lock_w * 0.18,
        fill=GRAD_TOP,
    )


def make_icon(size, maskable=False, out_name=None):
    img = gradient_square(size)
    img = add_glass_highlight(img)

    if maskable:
        # Zona sicura: contenuto entro l'80% centrale, sfondo pieno (nessun bordo arrotondato).
        draw = ImageDraw.Draw(img)
        draw_bubble_lock(draw, size, scale=0.62, offset=(0, size * 0.02))
        img.save(os.path.join(OUT, out_name), "PNG")
        return

    radius = size * 0.225  # continuous corner iOS-like
    mask = rounded_mask(size, radius)
    draw = ImageDraw.Draw(img)
    draw_bubble_lock(draw, size, scale=0.72)
    rounded = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rounded.paste(img, (0, 0), mask)
    rounded.save(os.path.join(OUT, out_name), "PNG")


make_icon(192, maskable=False, out_name="icon-192.png")
make_icon(512, maskable=False, out_name="icon-512.png")
make_icon(192, maskable=True, out_name="icon-maskable-192.png")
make_icon(512, maskable=True, out_name="icon-maskable-512.png")
make_icon(180, maskable=False, out_name="apple-touch-icon.png")
make_icon(32, maskable=False, out_name="favicon-32.png")
make_icon(16, maskable=False, out_name="favicon-16.png")

print("Icone generate in", OUT)
