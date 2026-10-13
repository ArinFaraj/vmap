# Text shaping

What a shaper that "supports everything" has to do, using HarfBuzz as the
reference. Checked 2026-10-13 against harfbuzz/harfbuzz on main.

## The pipeline

1. Split text into grapheme clusters (UAX #29), so a cursor or a cut never
   lands inside a letter and its marks.
2. Resolve direction with the bidi algorithm (UAX #9): Kurdish with Latin
   numbers and names inside it.
3. Itemise into runs by script (UAX #24 and Script_Extensions), direction,
   font and language.
4. Pick a font per run, falling back through a chain when the font lacks a
   character.
5. Shape each run: normalise, map to glyphs, run the script's shaper, apply
   `GSUB` lookups, then `GPOS` (kerning, mark attachment, cursive
   attachment), in the feature order the script requires.
6. Break lines (UAX #14) for multi line labels.

## Script shapers in HarfBuzz

`src/hb-ot-shaper-*.cc`: arabic, default, hangul, hebrew, indic, khmer,
myanmar, thai, use (the Universal Shaping Engine, which covers most other
complex scripts), plus syllabic and vowel-constraints helpers.

## Font data

- Outlines: TrueType `glyf`, `CFF` and `CFF2`.
- Variable fonts: `fvar`, `gvar`, `avar`, `HVAR`, `MVAR`.
- Colour: `COLR` v0 and v1 with `CPAL`, for emoji and icons in labels.
- Layout: `GSUB`, `GPOS`, `GDEF`, `kern` for old fonts, `BASE`.
- AAT (`morx`, `kerx`, `trak`) is Apple's own system; HarfBuzz supports it,
  it matters only for Apple system fonts.

## Proving it

- HarfBuzz's suite in `test/shape/data`: `aots` (128 files), `in-house` (86)
  and `text-rendering-tests` (94). Each line is a font, a string, options and
  the exact glyphs and positions expected. In-house file names include
  `arabic-fallback-shaping`, `arabic-mark-order`, `cursive-positioning`,
  `emoji-clusters`, `indic-*`, `khmer-*`, `myanmar-*`, `mark-filtering-sets`.
- Differential testing: every place name in a region's tiles, in every
  script, shaped by ours and by `hb-shape`, glyph for glyph.

## Order

1. Arabic, Hebrew, Latin, Cyrillic, Greek, with bidi: everything Kurdistan's
   maps show.
2. `CFF`/`CFF2`, variable fonts, `COLR` emoji.
3. USE, Indic, Khmer, Myanmar, Thai, Hangul.
4. Vertical CJK text, for maps of East Asia.

## Existing pure Dart work

`payv` 0.1.2 (armanicdev, Apache-2.0) runs `GSUB` and `GPOS` with bidi and
line breaking and reads `glyf` outlines and `gvar`. No `CFF` table reader was
found in its source.
