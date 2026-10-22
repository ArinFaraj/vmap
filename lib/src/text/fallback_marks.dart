import 'font/apply.dart';
import 'font/font.dart';

/// Combining classes by where a mark sits on its base.
const _attachedBelowLeft = 200, _attachedBelow = 202, _attachedAbove = 214;
const _attachedAboveRight = 216, _belowLeft = 218, _below = 220;
const _belowRight = 222, _aboveLeft = 228, _above = 230, _aboveRight = 232;
const _doubleBelow = 233, _doubleAbove = 234;

/// Where marks whose classes only order them sit: the Hebrew points,
/// Arabic and Syriac harakat, and Thai, Lao and Tibetan vowels, by the
/// ordering class marks carry while shaping.
const _placeOf = {
  22: _below, 15: _below, 16: _below, 17: _below, 23: _below, 18: _below, //
  19: _below, 20: _below, 21: _below, 24: _below, 25: _below,
  13: _attachedAbove, 10: _aboveRight, 11: _aboveLeft, 14: _aboveLeft,
  26: _above,
  28: _above, 29: _above, 31: _above, 32: _above, 27: _above, 34: _above,
  35: _above, 36: _above, 30: _below, 33: _below,
  3: _belowRight, 107: _aboveRight, 118: _below, 122: _above,
  129: _below, 132: _above, 131: _below,
};

int _place(ShapingGlyph g) {
  final c = g.codepoint, klass = g.combining;
  if (klass >= 200) return klass;
  if (c & ~0xFF == 0x0E00) {
    if (klass == 0) {
      if (c == 0x0E31 || c >= 0x0E34 && c <= 0x0E37 || c == 0x0E47) {
        return _aboveRight;
      }
      if (c >= 0x0E4C && c <= 0x0E4E) return _aboveRight;
      if (c == 0x0EB1 || c >= 0x0EB4 && c <= 0x0EB7 || c == 0x0EBB) {
        return _above;
      }
      if (c == 0x0ECC || c == 0x0ECD) return _above;
      if (c == 0x0EBC) return _below;
    } else if (c == 0x0E3A) {
      return _belowRight;
    }
  }
  return _placeOf[klass] ?? klass;
}

/// A glyph box: left, top, width, and height as a negative number.
class _Box {
  _Box(this.left, this.top, this.width, this.height);

  _Box.of(Font font, int glyph) : this._fromRecord(font.extents(glyph));

  _Box._fromRecord((double, double, double, double) e)
    : this(e.$1, e.$2, e.$3, e.$4);

  double left, top, width, height;

  _Box copy() => _Box(left, top, width, height);
}

/// Places the marks of a font with no `GPOS` around their bases by the
/// glyphs' boxes and where each mark's combining class says it sits:
/// above or below, centred, or to one side.
void placeMarksWithoutLayout(
  Font font,
  List<ShapingGlyph> glyphs, {
  required bool rtl,
}) {
  var start = 0;
  for (var i = 1; i <= glyphs.length; i++) {
    if (i < glyphs.length && glyphs[i].unicodeMark) continue;
    _cluster(font, glyphs, start, i, rtl);
    start = i;
  }
}

void _cluster(
  Font font,
  List<ShapingGlyph> glyphs,
  int start,
  int end,
  bool rtl,
) {
  if (end - start < 2) return;
  for (var i = start; i < end; i++) {
    if (glyphs[i].unicodeMark) continue;
    var j = i + 1;
    while (j < end && glyphs[j].unicodeMark) {
      j++;
    }
    _aroundBase(font, glyphs, i, j, rtl);
    i = j - 1;
  }
}

void _aroundBase(
  Font font,
  List<ShapingGlyph> glyphs,
  int base,
  int end,
  bool rtl,
) {
  final b = glyphs[base];
  final baseBox = _Box.of(font, b.glyph)
    ..top += b.yOffset
    ..left = 0
    ..width = font.advance(b.glyph).toDouble();
  final ligId = b.ligId;
  final components = b.componentCount;
  var x = 0.0, y = 0.0;
  if (!rtl) {
    x -= b.xAdvance;
    y -= b.yAdvance;
  }
  var componentBox = baseBox.copy();
  var lastComponent = -1, lastClass = 255;
  var clusterBox = baseBox.copy();
  for (var i = base + 1; i < end; i++) {
    final g = glyphs[i];
    final klass = _place(g);
    if (klass == 0) {
      if (!rtl) {
        x -= g.xAdvance;
        y -= g.yAdvance;
      } else {
        x += g.xAdvance;
        y += g.yAdvance;
      }
      continue;
    }
    if (components > 1) {
      var component = g.component - 1;
      if (ligId == 0 || ligId != g.ligId || component >= components) {
        component = components - 1;
      }
      if (lastComponent != component) {
        lastComponent = component;
        lastClass = 255;
        componentBox = baseBox.copy();
        final slot = rtl ? components - 1 - component : component;
        componentBox
          ..left += (slot * componentBox.width) / components
          ..width /= components;
      }
    }
    if (lastClass != klass) {
      lastClass = klass;
      clusterBox = componentBox.copy();
    }
    _placeMark(font, g, clusterBox, klass, rtl);
    g
      ..xAdvance = 0
      ..yAdvance = 0
      ..xOffset += x
      ..yOffset += y;
  }
}

/// Places mark [g] of [klass] on [base], growing [base] by it so the next
/// mark of the same class stacks beyond it.
void _placeMark(Font font, ShapingGlyph g, _Box base, int klass, bool rtl) {
  final mark = _Box.of(font, g.glyph);
  final gap = (font.unitsPerEm ~/ 16).toDouble();
  g
    ..xOffset = 0
    ..yOffset = 0;
  switch (klass) {
    case _doubleBelow || _doubleAbove:
      g.xOffset = rtl
          ? base.left - mark.width / 2 - mark.left
          : base.left + base.width - mark.width / 2 - mark.left;
    case _attachedBelowLeft || _belowLeft || _aboveLeft:
      g.xOffset = base.left - mark.left;
    case _attachedAboveRight || _belowRight || _aboveRight:
      g.xOffset = base.left + base.width - mark.width - mark.left;
    default:
      g.xOffset = base.left + (base.width - mark.width) / 2 - mark.left;
  }
  g.xOffset = g.xOffset.truncateToDouble();
  switch (klass) {
    case _doubleBelow || _belowLeft || _below || _belowRight:
      base.height -= gap;
      _placeBelow(g, base, mark, gap);
    case _attachedBelowLeft || _attachedBelow:
      _placeBelow(g, base, mark, gap);
    case _doubleAbove || _aboveLeft || _above || _aboveRight:
      base
        ..top += gap
        ..height -= gap;
      _placeAbove(g, base, mark, gap);
    case _attachedAbove || _attachedAboveRight:
      _placeAbove(g, base, mark, gap);
  }
}

void _placeBelow(ShapingGlyph g, _Box base, _Box mark, double gap) {
  g.yOffset = base.top + base.height - mark.top;
  if ((gap > 0) == (g.yOffset > 0)) {
    base.height -= g.yOffset;
    g.yOffset = 0;
  }
  base.height += mark.height;
}

void _placeAbove(ShapingGlyph g, _Box base, _Box mark, double gap) {
  g.yOffset = base.top - (mark.top + mark.height);
  if ((gap > 0) != (g.yOffset > 0)) {
    final correction = (-g.yOffset / 2).truncateToDouble();
    base
      ..top += correction
      ..height -= correction;
    g.yOffset += correction;
  }
  base
    ..top -= mark.height
    ..height += mark.height;
}
