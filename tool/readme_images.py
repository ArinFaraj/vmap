"""Composes the README pictures from screenshots of the example app.

    python3 tool/readme_images.py <screenshots dir> [bench.json]

The screenshots come from running the example on a desktop with
--dart-define=SHOT=<file>, which saves one 1170x2532 picture and exits.
"""

import json
import os
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "doc", "images")
FONT = os.path.join(HERE, "..", "example", "assets", "fonts", "GoogleSansFlex.ttf")

PAPER = (246, 247, 249)
INK = (23, 26, 31)
MUTED = (104, 112, 124)
LINE = (226, 229, 234)
BLUE = (26, 115, 232)
GREY = (176, 183, 194)


def font(size, weight=400):
    f = ImageFont.truetype(FONT, size)
    try:
        axes = f.get_variation_axes()
        values = []
        for axis in axes:
            name = axis["name"]
            name = name.decode() if isinstance(name, bytes) else name
            values.append(weight if "eight" in name else axis["default"])
        f.set_variation_by_axes(values)
    except Exception:
        pass
    return f


def rounded(image, radius):
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, image.width - 1, image.height - 1), radius, fill=255
    )
    out = Image.new("RGBA", image.size)
    out.paste(image.convert("RGBA"), (0, 0), mask)
    return out


def shadowed(canvas, layer, at, blur=40, offset=24, strength=70):
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    alpha = layer.getchannel("A").point(lambda v: v * strength // 255)
    tint = Image.new("RGBA", layer.size, (20, 30, 50, 0))
    tint.putalpha(alpha)
    shadow.paste(tint, (at[0], at[1] + offset), tint)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(layer, at)


def phone(shot, width):
    """A screenshot inside a plain dark bezel."""
    screen = shot.resize(
        (width, round(shot.height * width / shot.width)), Image.LANCZOS
    )
    bezel = round(width * 0.028)
    radius = round(width * 0.135)
    body = Image.new(
        "RGBA", (screen.width + bezel * 2, screen.height + bezel * 2), (0, 0, 0, 0)
    )
    ImageDraw.Draw(body).rounded_rectangle(
        (0, 0, body.width - 1, body.height - 1), radius + bezel, fill=(18, 19, 22)
    )
    body.alpha_composite(rounded(screen, radius), (bezel, bezel))
    island = (round(width * 0.3), round(width * 0.085))
    ImageDraw.Draw(body).rounded_rectangle(
        (
            body.width // 2 - island[0] // 2,
            bezel + round(width * 0.03),
            body.width // 2 + island[0] // 2,
            bezel + round(width * 0.03) + island[1],
        ),
        island[1] // 2,
        fill=(18, 19, 22),
    )
    return body


def crop(shot, width, height, focus=0.46):
    """The middle of a screenshot at its own pixel size, so text stays crisp."""
    scale = max(width / shot.width, height / shot.height)
    if scale > 1:
        shot = shot.resize(
            (round(shot.width * scale), round(shot.height * scale)), Image.LANCZOS
        )
    left = (shot.width - width) // 2
    top = max(0, min(shot.height - height, round(shot.height * focus - height / 2)))
    return shot.crop((left, top, left + width, top + height))


def load(directory, name):
    return Image.open(os.path.join(directory, name + ".png")).convert("RGB")


def hero(directory):
    canvas = Image.new("RGBA", (2400, 1500), PAPER + (255,))
    side = 520
    middle = 600
    left = phone(load(directory, "hero-liberty"), side)
    centre = phone(load(directory, "hero-default"), middle)
    right = phone(load(directory, "hero-night"), side)
    gap = 110
    total = left.width + centre.width + right.width + gap * 2
    x = (canvas.width - total) // 2
    shadowed(canvas, left, (x, (canvas.height - left.height) // 2 + 40))
    shadowed(
        canvas,
        right,
        (x + left.width + centre.width + gap * 2, (canvas.height - right.height) // 2 + 40),
    )
    shadowed(canvas, centre, (x + left.width + gap, (canvas.height - centre.height) // 2))
    canvas.convert("RGB").save(os.path.join(OUT, "hero.png"), optimize=True)


def panels(directory, name, items, columns, size, radius=44, gap=48, margin=96):
    """A grid of captioned crops."""
    caption = font(40, 560)
    note = font(32, 400)
    rows = (len(items) + columns - 1) // columns
    text_height = 150 if any(len(i) > 2 for i in items) else 104
    width = margin * 2 + columns * size[0] + (columns - 1) * gap
    height = margin * 2 + rows * (size[1] + text_height) + (rows - 1) * gap - 24
    canvas = Image.new("RGBA", (width, height), PAPER + (255,))
    draw = ImageDraw.Draw(canvas)
    for index, item in enumerate(items):
        x = margin + (index % columns) * (size[0] + gap)
        y = margin + (index // columns) * (size[1] + text_height + gap)
        tile = rounded(crop(load(directory, item[0]), *size), radius)
        shadowed(canvas, tile, (x, y), blur=28, offset=14, strength=46)
        draw.text((x + 6, y + size[1] + 30), item[1], font=caption, fill=INK)
        if len(item) > 2:
            draw.text((x + 6, y + size[1] + 86), item[2], font=note, fill=MUTED)
    canvas.convert("RGB").save(os.path.join(OUT, name + ".png"), optimize=True)


def chart(bench):
    """Frames lost during the tour: one row per run, one bar per renderer."""
    title = font(46, 600)
    label = font(36, 500)
    small = font(32, 400)
    number = font(40, 600)
    rows = bench["rows"]
    width = 2400
    margin = 110
    row_height = 190
    height = margin * 2 + 150 + len(rows) * row_height
    canvas = Image.new("RGB", (width, height), PAPER)
    draw = ImageDraw.Draw(canvas)
    draw.text((margin, margin - 20), bench["title"], font=title, fill=INK)
    draw.text((margin, margin + 46), bench["subtitle"], font=small, fill=MUTED)
    left = margin + 640
    span = width - margin - left - 190
    top = margin + 150
    most = max(max(r["vmap"], r["other"]) for r in rows) or 1
    for i, row in enumerate(rows):
        y = top + i * row_height
        draw.line((margin, y - 22, width - margin, y - 22), fill=LINE, width=2)
        draw.text((margin, y + 8), row["name"], font=label, fill=INK)
        draw.text((margin, y + 58), row["note"], font=small, fill=MUTED)
        for k, (key, color) in enumerate((("vmap", BLUE), ("other", GREY))):
            value = row[key]
            by = y + 6 + k * 62
            length = max(10, round(span * value / most))
            draw.rounded_rectangle((left, by, left + length, by + 44), 10, fill=color)
            draw.text(
                (left + length + 22, by - 3),
                str(value),
                font=number,
                fill=INK if key == "vmap" else MUTED,
            )
    y = top + len(rows) * row_height
    draw.line((margin, y - 22, width - margin, y - 22), fill=LINE, width=2)
    x = margin
    for name, color in (("vmap", BLUE), (bench["other"], GREY)):
        draw.rounded_rectangle((x, y + 14, x + 36, y + 50), 8, fill=color)
        draw.text((x + 52, y + 10), name, font=small, fill=MUTED)
        x += 52 + round(draw.textlength(name, font=small)) + 70
    canvas.save(os.path.join(OUT, "bench.png"), optimize=True)


def main():
    directory = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    hero(directory)
    panels(
        directory,
        "styles",
        [
            ("plain-default", "Default"),
            ("plain-liberty", "Liberty"),
            ("plain-bright", "Bright"),
            ("plain-night", "Night"),
            ("plain-positron", "Positron"),
            ("plain-fiord", "Fiord"),
        ],
        columns=3,
        size=(704, 760),
    )
    panels(
        directory,
        "compare",
        [
            ("plain-liberty-deep", "vmap", "The Liberty style, with zoomOffset: 1"),
            ("vmt-liberty", "vector_map_tiles", "The same style and camera"),
        ],
        columns=2,
        size=(1080, 1180),
    )
    panels(
        directory,
        "labels",
        [
            ("names-local", "Local names", "nameKeys: ['name']"),
            ("names-en", "English first", "nameKeys: ['name:en', 'name']"),
        ],
        columns=2,
        size=(1080, 900),
    )
    if len(sys.argv) > 2:
        with open(sys.argv[2]) as f:
            chart(json.load(f))


if __name__ == "__main__":
    main()
