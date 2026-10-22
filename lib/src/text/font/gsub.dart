import 'apply.dart';
import 'bytes.dart';
import 'layout.dart';

/// Applies `GSUB` lookups.
class Substitution extends LookupApplier {
  Substitution(super.font, super.table, super.glyphs);

  int _nextLigId = 1;

  @override
  bool get positioning => false;

  @override
  bool applySubtable(int type, int at) => switch (type) {
    1 => _single(at),
    2 => _multiple(at),
    3 => _alternate(at),
    4 => _ligature(at),
    5 => applyContext(at, chained: false),
    6 => applyContext(at, chained: true),
    8 => _reverse(at),
    _ => false,
  };

  int _covered(int at) =>
      coverageIndex(data, at + data.u16(at + 2), glyphs[index].glyph);

  /// Gives glyph [g] the substitute [glyph], with GDEF's class for it, or
  /// [guess] when the font has no classes.
  void _replace(
    ShapingGlyph g,
    int glyph, {
    int guess = 0,
    bool ligature = false,
    bool component = false,
  }) {
    g
      ..glyph = glyph
      ..substituted = true;
    if (ligature) {
      g
        ..ligated = true
        ..multiplied = false;
    }
    if (component) g.multiplied = true;
    final gdef = this.gdef;
    if (gdef != null && gdef.hasGlyphClasses) {
      g
        ..glyphClass = gdef.glyphClass(glyph)
        ..markClass = gdef.markClass(glyph);
    } else if (guess != 0) {
      g.glyphClass = guess;
    }
  }

  bool _single(int at) {
    final i = _covered(at);
    if (i < 0) return false;
    final g = glyphs[index];
    switch (data.u16(at)) {
      case 1:
        _replace(g, (g.glyph + data.i16(at + 4)) & 0xFFFF);
      case 2:
        if (i >= data.u16(at + 4)) return false;
        _replace(g, data.u16(at + 6 + i * 2));
      default:
        return false;
    }
    index++;
    return true;
  }

  bool _multiple(int at) {
    final i = _covered(at);
    if (i < 0 || i >= data.u16(at + 4)) return false;
    final seq = at + data.u16(at + 6 + i * 2);
    final count = data.u16(seq);
    final g = glyphs[index];
    if (count == 1) {
      _replace(g, data.u16(seq + 2));
      index++;
      return true;
    }
    if (count == 0) {
      glyphs.removeAt(index);
      return true;
    }
    final guess = g.glyphClass == glyphLigature ? glyphBase : 0;
    final keepLigature = g.ligId != 0;
    final out = <ShapingGlyph>[];
    for (var k = 0; k < count; k++) {
      final c = g.copy();
      if (!keepLigature) {
        c
          ..ligId = 0
          ..ligComp = k
          ..ligComps = 0;
      }
      _replace(c, data.u16(seq + 2 + k * 2), guess: guess, component: true);
      out.add(c);
    }
    glyphs.replaceRange(index, index + 1, out);
    index += count;
    return true;
  }

  bool _alternate(int at) {
    final i = _covered(at);
    if (i < 0 || i >= data.u16(at + 4)) return false;
    final set = at + data.u16(at + 6 + i * 2);
    if (data.u16(set) == 0) return false;
    _replace(glyphs[index], data.u16(set + 2));
    index++;
    return true;
  }

  bool _ligature(int at) {
    final i = _covered(at);
    if (i < 0 || i >= data.u16(at + 4)) return false;
    final set = at + data.u16(at + 6 + i * 2);
    for (var l = 0; l < data.u16(set); l++) {
      final lig = set + data.u16(set + 2 + l * 2);
      final count = data.u16(lig + 2);
      if (count == 0) continue;
      final matched = matchInput(
        count,
        (g, k) => g.glyph == data.u16(lig + 4 + (k - 1) * 2),
      );
      if (matched == null) continue;
      _ligate(data.u16(lig), matched.$1, matched.$2);
      return true;
    }
    return false;
  }

  /// Joins the glyphs at [positions] into [glyph], keeping the marks
  /// stepped over between them on the component they followed.
  void _ligate(int glyph, List<int> positions, int components) {
    final first = glyphs[positions.first];
    var baseLigature = first.isBase, markLigature = first.isMark;
    for (final p in positions.skip(1)) {
      if (!glyphs[p].isMark) {
        baseLigature = markLigature = false;
        break;
      }
    }
    final ligature = !baseLigature && !markLigature;
    final id = ligature ? _nextLigId++ : 0;
    var lastId = first.ligId;
    var lastComponents = first.componentCount;
    var soFar = lastComponents;
    if (ligature) {
      first
        ..ligId = id
        ..ligComp = 0
        ..ligComps = components;
      if (first.nonspacing) first.nonspacing = false;
    }
    _replace(first, glyph, guess: ligature ? glyphLigature : 0, ligature: true);
    final removed = <int>{};
    for (var k = 1; k < positions.length; k++) {
      for (var j = positions[k - 1] + 1; j < positions[k]; j++) {
        if (!ligature) continue;
        final mark = glyphs[j];
        var comp = mark.component;
        if (comp == 0) comp = lastComponents;
        mark
          ..ligId = id
          ..ligComp = soFar - lastComponents + _min(comp, lastComponents)
          ..ligComps = 0;
      }
      final g = glyphs[positions[k]];
      lastId = g.ligId;
      lastComponents = g.componentCount;
      soFar += lastComponents;
      removed.add(positions[k]);
    }
    if (!markLigature && lastId != 0) {
      for (var j = positions.last + 1; j < glyphs.length; j++) {
        final g = glyphs[j];
        if (g.ligId != lastId || g.component == 0) break;
        g
          ..ligId = id
          ..ligComp = soFar - lastComponents + _min(g.component, lastComponents)
          ..ligComps = 0;
      }
    }
    for (final p in removed.toList()..sort((a, b) => b - a)) {
      glyphs.removeAt(p);
    }
    index = positions.last + 1 - removed.length;
  }

  static int _min(int a, int b) => a < b ? a : b;

  bool _reverse(int at) {
    final g = glyphs[index];
    final i = coverageIndex(data, at + data.u16(at + 2), g.glyph);
    if (i < 0) return false;
    final backCount = data.u16(at + 4);
    final back = at + 6;
    final aheadCount = data.u16(back + backCount * 2);
    final ahead = back + backCount * 2 + 2;
    final substitutes = ahead + aheadCount * 2;
    if (i >= data.u16(substitutes)) return false;
    bool covered(ShapingGlyph x, int field) =>
        coverageIndex(data, at + data.u16(field), x.glyph) >= 0;
    var p = index;
    for (var k = 0; k < backCount; k++) {
      final prev = step(
        p,
        -1,
        matches: (x) => covered(x, back + k * 2),
        context: true,
      );
      if (prev == null) return false;
      p = prev;
    }
    p = index;
    for (var k = 0; k < aheadCount; k++) {
      final next = step(
        p,
        1,
        matches: (x) => covered(x, ahead + k * 2),
        context: true,
      );
      if (next == null) return false;
      p = next;
    }
    _replace(g, data.u16(substitutes + 2 + i * 2));
    return true;
  }
}
