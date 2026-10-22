import 'font/apply.dart';
import 'font/font.dart';
import 'unicode.dart';

/// A glyph for code point [c], [glyph] in the font, with the Unicode
/// properties shaping reads.
ShapingGlyph shapingGlyph(int c, int glyph) => ShapingGlyph(c, glyph)
  ..ignorable = isDefaultIgnorable(c)
  ..unicodeMark = isMark(c)
  ..nonspacing = isNonspacingMark(c)
  ..combining = _orderingClass(c);

/// Combining classes rearranged so marks sort the way fonts expect: the
/// Hebrew points and Arabic harakat in their visual order, shadda first,
/// and a few marks no reordering should move.
const _reordered = {
  10: 22, 11: 15, 12: 16, 13: 17, 14: 23, 15: 18, 16: 19, 17: 20, 18: 21, //
  19: 14, 20: 24, 21: 12, 22: 25, 23: 13, 24: 10, 25: 11,
  27: 28, 28: 29, 29: 30, 30: 31, 31: 32, 32: 33, 33: 27,
  84: 0, 91: 0, 103: 3, 130: 132, 132: 131,
};

int _orderingClass(int c) {
  if (c == 0x1A60 || c == 0x0FC6) return 254;
  if (c == 0x0F39) return 127;
  final ccc = combiningClassOf(c);
  return _reordered[ccc] ?? ccc;
}

bool _isVariationSelector(int c) =>
    c >= 0xFE00 && c <= 0xFE0F ||
    c >= 0xE0100 && c <= 0xE01EF ||
    c >= 0x180B && c <= 0x180D ||
    c == 0x180F;

/// Marks Arabic shaping moves to the front of a run of marks of their
/// class: hamza and madda above and below, and marks like them.
const _modifierMarks = {
  0x0654, 0x0655, 0x0658, 0x06DC, 0x06E3, 0x06E7, 0x06E8, 0x08CA, 0x08CB, //
  0x08CD, 0x08CE, 0x08CF, 0x08D3, 0x08F3,
};

/// [text] as glyphs of [font], composed or decomposed to what the font
/// has: a character the font lacks is split into parts it has, marks are
/// put in canonical order, and a base and mark it has a composed glyph for
/// are joined.
List<ShapingGlyph> normalize(Font font, List<int> text, {bool arabic = false}) {
  final out = <ShapingGlyph>[];
  var simple = true;
  var i = 0;
  while (i < text.length) {
    var end = i + 1;
    while (end < text.length && isMark(text[end])) {
      end++;
    }
    if (end == i + 1) {
      _decomposeChar(font, text[i], true, out);
    } else {
      simple = false;
      if (text.sublist(i, end).any(_isVariationSelector)) {
        _variationCluster(font, text, i, end, out);
      } else {
        for (var k = i; k < end; k++) {
          _decomposeChar(font, text[k], false, out);
        }
      }
    }
    i = end;
  }
  if (simple) return out;
  _reorderMarks(out, arabic);
  return _recompose(font, out);
}

void _decomposeChar(Font font, int c, bool shortest, List<ShapingGlyph> out) {
  final glyph = font.glyphOf(c);
  if (shortest && glyph != 0) {
    out.add(shapingGlyph(c, glyph));
    return;
  }
  if (_decompose(font, c, shortest, out) > 0) return;
  if (glyph != 0) {
    out.add(shapingGlyph(c, glyph));
    return;
  }
  if (_spaceWidths.containsKey(c)) {
    final space = font.glyphOf(0x20);
    if (space != 0) {
      out.add(shapingGlyph(c, space)..spaceFallback = true);
      return;
    }
  }
  if (c == 0x2011) {
    final hyphen = font.glyphOf(0x2010);
    if (hyphen != 0) {
      out.add(shapingGlyph(c, hyphen));
      return;
    }
  }
  out.add(shapingGlyph(c, 0));
}

/// Writes the parts of [c] the font has, splitting the first part further
/// as needed; the number written, 0 when it cannot.
int _decompose(Font font, int c, bool shortest, List<ShapingGlyph> out) {
  final parts = decompose(c);
  if (parts == null) return 0;
  final (a, b) = parts;
  final bGlyph = b == 0 ? 0 : font.glyphOf(b);
  if (b != 0 && bGlyph == 0) return 0;
  final aGlyph = font.glyphOf(a);
  if (shortest && aGlyph != 0) {
    out.add(shapingGlyph(a, aGlyph));
    if (b == 0) return 1;
    out.add(shapingGlyph(b, bGlyph));
    return 2;
  }
  final written = _decompose(font, a, shortest, out);
  if (written > 0) {
    if (b == 0) return written;
    out.add(shapingGlyph(b, bGlyph));
    return written + 1;
  }
  if (aGlyph != 0) {
    out.add(shapingGlyph(a, aGlyph));
    if (b == 0) return 1;
    out.add(shapingGlyph(b, bGlyph));
    return 2;
  }
  return 0;
}

/// A base with marks among which are variation selectors: a pair the font
/// has a variant for becomes that glyph, and everything else is passed on
/// as it is for the layout tables.
void _variationCluster(
  Font font,
  List<int> text,
  int from,
  int end,
  List<ShapingGlyph> out,
) {
  var i = from;
  while (i < end) {
    final c = text[i];
    if (i + 1 < end && _isVariationSelector(text[i + 1])) {
      final variant = font.variantOf(c, text[i + 1]);
      if (variant != null) {
        out.add(shapingGlyph(c, variant));
        i += 2;
      } else {
        out.add(shapingGlyph(c, font.glyphOf(c)));
        i++;
      }
      while (i < end && _isVariationSelector(text[i])) {
        out.add(shapingGlyph(text[i], font.glyphOf(text[i])));
        i++;
      }
    } else {
      out.add(shapingGlyph(c, font.glyphOf(c)));
      i++;
    }
  }
}

/// Sorts each run of marks by combining class, keeping equal classes in
/// order; in Arabic, then moves modifier marks to the front of their class.
void _reorderMarks(List<ShapingGlyph> glyphs, bool arabic) {
  for (var i = 0; i < glyphs.length; i++) {
    if (glyphs[i].combining == 0) continue;
    var end = i + 1;
    while (end < glyphs.length && glyphs[end].combining != 0) {
      end++;
    }
    if (end - i <= 32) {
      final run = glyphs.sublist(i, end);
      _stableSort(run);
      glyphs.setRange(i, end, run);
      if (arabic) _moveModifierMarks(glyphs, i, end);
    }
    i = end;
  }
}

void _stableSort(List<ShapingGlyph> run) {
  for (var i = 1; i < run.length; i++) {
    final g = run[i];
    var j = i - 1;
    while (j >= 0 && run[j].combining > g.combining) {
      run[j + 1] = run[j];
      j--;
    }
    run[j + 1] = g;
  }
}

void _moveModifierMarks(List<ShapingGlyph> glyphs, int start, int end) {
  var i = start;
  for (var cc = 220; cc <= 230; cc += 10) {
    while (i < end && glyphs[i].combining < cc) {
      i++;
    }
    if (i == end) break;
    if (glyphs[i].combining > cc) continue;
    var j = i;
    while (j < end &&
        glyphs[j].combining == cc &&
        _modifierMarks.contains(glyphs[j].codepoint)) {
      j++;
    }
    if (i == j) continue;
    final moved = glyphs.sublist(i, j);
    final rest = glyphs.sublist(start, i);
    glyphs
      ..setRange(start, start + moved.length, moved)
      ..setRange(start + moved.length, j, rest);
    final renumbered = cc == 220 ? 22 : 26;
    for (var k = start; k < start + moved.length; k++) {
      glyphs[k].combining = renumbered;
    }
    start += moved.length;
    i = j;
  }
}

/// Joins each mark to the base before it when they compose to a character
/// the font has, unless a mark of the same or a higher class sits between.
List<ShapingGlyph> _recompose(Font font, List<ShapingGlyph> glyphs) {
  if (glyphs.isEmpty) return glyphs;
  final out = [glyphs.first];
  var starter = 0;
  for (var i = 1; i < glyphs.length; i++) {
    final g = glyphs[i];
    if (g.unicodeMark &&
        (starter == out.length - 1 || out.last.combining < g.combining)) {
      final composed = compose(out[starter].codepoint, g.codepoint);
      if (composed != null) {
        final glyph = font.glyphOf(composed);
        if (glyph != 0) {
          out[starter] = shapingGlyph(composed, glyph);
          continue;
        }
      }
    }
    out.add(g);
    if (g.combining == 0) starter = out.length - 1;
  }
  return out;
}

/// Spaces that may be drawn as the plain space when the font lacks them:
/// the width each is set to, a fraction of the em when positive, and
/// otherwise the plain space's own width (0), half of it (-1), a digit's
/// (-2) or a full stop's (-3).
const _spaceWidths = <int, double>{
  0x0020: 0,
  0x00A0: 0,
  0x2000: 1 / 2,
  0x2001: 1,
  0x2002: 1 / 2,
  0x2003: 1,
  0x2004: 1 / 3,
  0x2005: 1 / 4,
  0x2006: 1 / 6,
  0x2007: -2,
  0x2008: -3,
  0x2009: 1 / 5,
  0x200A: 1 / 16,
  0x202F: -1,
  0x205F: 4 / 18,
  0x3000: 1,
};

/// The advance of space [c] drawn as the font's plain space, whose advance
/// is [space].
double fallbackSpaceAdvance(Font font, int c, double space) {
  final w = _spaceWidths[c] ?? 0;
  if (w > 0) return (font.unitsPerEm * w).roundToDouble();
  if (w == -1) return (space / 2).floorToDouble();
  if (w == 0) return space;
  final candidates = w == -2
      ? [for (var d = 0x30; d <= 0x39; d++) d]
      : const [0x2E, 0x2C];
  for (final c in candidates) {
    final g = font.glyphOf(c);
    if (g != 0) return font.advance(g).toDouble();
  }
  return space;
}
