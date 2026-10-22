import 'dart:math' as math;
import 'dart:typed_data';

import 'bytes.dart';
import 'font.dart';
import 'layout.dart';

/// One glyph as shaping carries it: where it came from, what the lookups
/// have made of it, and where it sits.
class ShapingGlyph {
  ShapingGlyph(this.codepoint, this.glyph);

  int codepoint;
  int glyph;

  /// The features that apply to this glyph, a bit each.
  int mask = 0;

  /// [glyphBase], [glyphLigature], [glyphMark], [glyphComponent] or 0, and
  /// for a mark its attachment class.
  int glyphClass = 0, markClass = 0;

  bool substituted = false, ligated = false, multiplied = false;

  /// The ligature this glyph belongs to, as a mark on one of its
  /// components or as the ligature itself, which has [ligComps] > 0.
  int ligId = 0, ligComp = 0, ligComps = 0;

  /// Unicode properties: default ignorable, a combining mark, a
  /// nonspacing mark, and the combining class marks are ordered by.
  bool ignorable = false, unicodeMark = false, nonspacing = false;
  int combining = 0;

  /// A space the font lacks, drawn as its plain space set to the width
  /// this space should have.
  bool spaceFallback = false;

  double xAdvance = 0, yAdvance = 0, xOffset = 0, yOffset = 0;

  /// The glyph this one is attached to, as an offset in the buffer, and
  /// how: [attachMark] or [attachCursive].
  int attachChain = 0, attachType = 0;

  static const attachMark = 1, attachCursive = 2;

  bool get isMark => glyphClass == glyphMark;

  bool get isBase => glyphClass == glyphBase;

  bool get isZwnj => codepoint == 0x200C;

  bool get isZwj => codepoint == 0x200D;

  /// Combining grapheme joiner, Mongolian free variation selectors and
  /// tags, which only positioning steps over unseen.
  bool get hidden =>
      codepoint == 0x034F ||
      codepoint >= 0x180B && codepoint <= 0x180D ||
      codepoint == 0x180F ||
      codepoint >= 0xE0020 && codepoint <= 0xE007F;

  /// The components of the ligature this glyph is, 1 for any other.
  int get componentCount =>
      ligComps > 0 && glyphClass == glyphLigature ? ligComps : 1;

  /// The ligature component this mark sits on, 0 for none.
  int get component => ligComps > 0 ? 0 : ligComp;

  ShapingGlyph copy() => ShapingGlyph(codepoint, glyph)
    ..mask = mask
    ..glyphClass = glyphClass
    ..markClass = markClass
    ..substituted = substituted
    ..ligated = ligated
    ..multiplied = multiplied
    ..ligId = ligId
    ..ligComp = ligComp
    ..ligComps = ligComps
    ..ignorable = ignorable
    ..unicodeMark = unicodeMark
    ..nonspacing = nonspacing
    ..combining = combining
    ..spaceFallback = spaceFallback;
}

/// A lookup's verdict on a glyph it steps over.
enum _Skip { yes, no, maybe }

/// Applies the lookups of one layout table to a run of glyphs: the
/// matching both tables share, with the subtables each table has left to
/// [applySubtable].
abstract class LookupApplier {
  LookupApplier(this.font, this.table, this.glyphs);

  final Font font;
  final LayoutTable table;
  final List<ShapingGlyph> glyphs;

  ByteData get data => font.file.data;

  Gdef? get gdef => font.file.gdef;

  bool get positioning;

  late Lookup lookup;
  int mask = 0;
  bool autoZwj = true, autoZwnj = true;

  /// The glyph the lookup is at.
  int index = 0;
  int _nesting = 0;

  /// Applies subtable [at] of lookup [type] at [index], moving [index] on
  /// when it applies.
  bool applySubtable(int type, int at);

  /// Applies lookup [lookupIndex] to every glyph with a bit of [mask].
  void apply(
    int lookupIndex,
    int mask, {
    bool autoZwj = true,
    bool autoZwnj = true,
  }) {
    lookup = table.lookup(lookupIndex);
    this.mask = mask;
    this.autoZwj = autoZwj;
    this.autoZwnj = autoZwnj;
    if (!positioning && lookup.type == 8) {
      for (index = glyphs.length - 1; index >= 0; index--) {
        if (_eligible(glyphs[index])) _applyHere();
      }
      return;
    }
    index = 0;
    while (index < glyphs.length) {
      if (_eligible(glyphs[index]) && _applyHere()) continue;
      index++;
    }
  }

  bool _eligible(ShapingGlyph g) => g.mask & mask != 0 && !ignored(g);

  bool _applyHere() {
    for (final s in lookup.subtables) {
      if (applySubtable(lookup.type, s)) return true;
    }
    return false;
  }

  /// Whether the lookup's flags step over [g].
  bool ignored(ShapingGlyph g, [int? flag]) {
    final f = flag ?? lookup.flag;
    switch (g.glyphClass) {
      case glyphBase:
        return f & Lookup.ignoreBase != 0;
      case glyphLigature:
        return f & Lookup.ignoreLigatures != 0;
      case glyphMark:
        if (f & Lookup.ignoreMarks != 0) return true;
        if (f & Lookup.useMarkSet != 0) {
          return !(gdef?.inMarkSet(lookup.markSet, g.glyph) ?? false);
        }
        final type = f >> 8;
        return type != 0 && type != g.markClass;
    }
    return false;
  }

  _Skip _skip(ShapingGlyph g, bool context, int? flag) {
    if (ignored(g, flag)) return _Skip.yes;
    final ignoreZwnj = positioning || context && autoZwnj;
    final ignoreZwj = positioning || context || autoZwj;
    if (g.ignorable &&
        !g.substituted &&
        (ignoreZwnj || !g.isZwnj) &&
        (ignoreZwj || !g.isZwj) &&
        (positioning || !g.hidden)) {
      return _Skip.maybe;
    }
    return _Skip.no;
  }

  /// The glyph [step] away from [from], forward or back, that the lookup
  /// does not step over: one [matches], or with no test any glyph. Null
  /// when a glyph it may not step over fails, or the run ends.
  int? step(
    int from,
    int step, {
    bool Function(ShapingGlyph g)? matches,
    bool context = false,
    int? flag,
  }) {
    for (var i = from + step; i >= 0 && i < glyphs.length; i += step) {
      final g = glyphs[i];
      final skip = _skip(g, context, flag);
      if (skip == _Skip.yes) continue;
      final masked = context || g.mask & mask != 0;
      final bool? match = !masked
          ? false
          : matches == null
          ? null
          : matches(g);
      if (match == true || match == null && skip == _Skip.no) return i;
      if (skip == _Skip.no) return null;
    }
    return null;
  }

  /// Positions of the input sequence starting at [index] whose glyphs
  /// after the first pass [matches] by their index, or null; with the
  /// total components of any ligatures among them.
  (List<int>, int)? matchInput(
    int count,
    bool Function(ShapingGlyph g, int k) matches,
  ) {
    final positions = [index];
    final first = glyphs[index];
    final firstId = first.ligId, firstComp = first.component;
    var components = first.componentCount;
    bool? baseMaySkip;
    var at = index;
    for (var k = 1; k < count; k++) {
      final next = step(at, 1, matches: (g) => matches(g, k));
      if (next == null) return null;
      at = next;
      positions.add(at);
      final g = glyphs[at];
      if (firstId != 0 && firstComp != 0) {
        if (firstId != g.ligId || firstComp != g.component) {
          baseMaySkip ??= _ligatureBaseSkipped(firstId);
          if (!baseMaySkip) return null;
        }
      } else if (g.ligId != 0 && g.component != 0 && g.ligId != firstId) {
        return null;
      }
      components += g.componentCount;
    }
    return (positions, components);
  }

  bool _ligatureBaseSkipped(int ligId) {
    for (var j = index - 1; j >= 0 && glyphs[j].ligId == ligId; j--) {
      if (glyphs[j].component == 0) {
        return _skip(glyphs[j], false, null) == _Skip.yes;
      }
    }
    return false;
  }

  bool _matchBack(int count, bool Function(ShapingGlyph g, int k) matches) {
    var at = index;
    for (var k = 0; k < count; k++) {
      final prev = step(at, -1, matches: (g) => matches(g, k), context: true);
      if (prev == null) return false;
      at = prev;
    }
    return true;
  }

  bool _matchAhead(
    int from,
    int count,
    bool Function(ShapingGlyph g, int k) matches,
  ) {
    var at = from;
    for (var k = 0; k < count; k++) {
      final next = step(at, 1, matches: (g) => matches(g, k), context: true);
      if (next == null) return false;
      at = next;
    }
    return true;
  }

  /// Contextual lookups, GSUB types 5 and 6 and GPOS types 7 and 8, the
  /// chained form when [chained].
  bool applyContext(int at, {required bool chained}) {
    final g = glyphs[index];
    switch (data.u16(at)) {
      case 1:
        final i = coverageIndex(data, at + data.u16(at + 2), g.glyph);
        if (i < 0 || i >= data.u16(at + 4)) return false;
        final setOffset = data.u16(at + 6 + i * 2);
        if (setOffset == 0) return false;
        final set = at + setOffset;
        for (var r = 0; r < data.u16(set); r++) {
          final rule = set + data.u16(set + 2 + r * 2);
          bool glyphIs(ShapingGlyph x, int field) => x.glyph == data.u16(field);
          if (_rule(rule, chained, glyphIs, glyphIs, glyphIs)) return true;
        }
        return false;
      case 2:
        if (coverageIndex(data, at + data.u16(at + 2), g.glyph) < 0) {
          return false;
        }
        final int back, input, ahead, sets;
        if (chained) {
          back = at + data.u16(at + 4);
          input = at + data.u16(at + 6);
          ahead = at + data.u16(at + 8);
          sets = at + 10;
        } else {
          back = ahead = input = at + data.u16(at + 4);
          sets = at + 6;
        }
        final c = classOf(data, input, g.glyph);
        if (c >= data.u16(sets)) return false;
        final setOffset = data.u16(sets + 2 + c * 2);
        if (setOffset == 0) return false;
        final set = at + setOffset;
        for (var r = 0; r < data.u16(set); r++) {
          final rule = set + data.u16(set + 2 + r * 2);
          if (_rule(
            rule,
            chained,
            (x, field) => classOf(data, back, x.glyph) == data.u16(field),
            (x, field) => classOf(data, input, x.glyph) == data.u16(field),
            (x, field) => classOf(data, ahead, x.glyph) == data.u16(field),
          )) {
            return true;
          }
        }
        return false;
      case 3:
        return _coverageRule(at, chained);
    }
    return false;
  }

  /// A format 1 or 2 rule at [rule]: its sequences of glyph ids or classes
  /// tested by [back], [input] and [ahead] against the field they are in.
  bool _rule(
    int rule,
    bool chained,
    bool Function(ShapingGlyph g, int field) back,
    bool Function(ShapingGlyph g, int field) input,
    bool Function(ShapingGlyph g, int field) ahead,
  ) {
    var p = rule;
    var backCount = 0, backAt = 0, aheadCount = 0, aheadAt = 0;
    final int inputCount, inputAt, recordCount, records;
    if (chained) {
      backCount = data.u16(p);
      backAt = p + 2;
      p += 2 + backCount * 2;
      inputCount = data.u16(p);
      inputAt = p + 2;
      p += 2 + math.max(0, inputCount - 1) * 2;
      aheadCount = data.u16(p);
      aheadAt = p + 2;
      p += 2 + aheadCount * 2;
      recordCount = data.u16(p);
      records = p + 2;
    } else {
      inputCount = data.u16(p);
      recordCount = data.u16(p + 2);
      inputAt = p + 4;
      records = inputAt + math.max(0, inputCount - 1) * 2;
    }
    if (inputCount == 0) return false;
    final matched = matchInput(
      inputCount,
      (g, k) => input(g, inputAt + (k - 1) * 2),
    );
    if (matched == null) return false;
    final (positions, _) = matched;
    if (!_matchBack(backCount, (g, k) => back(g, backAt + k * 2))) {
      return false;
    }
    if (!_matchAhead(
      positions.last,
      aheadCount,
      (g, k) => ahead(g, aheadAt + k * 2),
    )) {
      return false;
    }
    _applyRecords(positions, records, recordCount);
    return true;
  }

  bool _coverageRule(int at, bool chained) {
    var p = at + 2;
    var backCount = 0, backAt = 0;
    if (chained) {
      backCount = data.u16(p);
      backAt = p + 2;
      p += 2 + backCount * 2;
    }
    final inputCount = data.u16(chained ? p : at + 2);
    final int inputAt;
    if (chained) {
      inputAt = p + 2;
      p += 2 + inputCount * 2;
    } else {
      inputAt = at + 6;
    }
    if (inputCount == 0) return false;
    bool covered(ShapingGlyph g, int field) =>
        coverageIndex(data, at + data.u16(field), g.glyph) >= 0;
    if (!covered(glyphs[index], inputAt)) return false;
    var aheadCount = 0, aheadAt = 0;
    final int recordCount, records;
    if (chained) {
      aheadCount = data.u16(p);
      aheadAt = p + 2;
      p += 2 + aheadCount * 2;
      recordCount = data.u16(p);
      records = p + 2;
    } else {
      recordCount = data.u16(at + 4);
      records = inputAt + inputCount * 2;
    }
    final matched = matchInput(
      inputCount,
      (g, k) => covered(g, inputAt + k * 2),
    );
    if (matched == null) return false;
    final (positions, _) = matched;
    if (!_matchBack(backCount, (g, k) => covered(g, backAt + k * 2))) {
      return false;
    }
    if (!_matchAhead(
      positions.last,
      aheadCount,
      (g, k) => covered(g, aheadAt + k * 2),
    )) {
      return false;
    }
    _applyRecords(positions, records, recordCount);
    return true;
  }

  /// Runs the nested lookups of [count] sequence lookup records at
  /// [records] on the matched [positions], keeping later positions in step
  /// as nested lookups add or remove glyphs.
  void _applyRecords(List<int> positions, int records, int count) {
    var end = positions.last + 1;
    for (var r = 0; r < count; r++) {
      final seq = data.u16(records + r * 4);
      final nested = data.u16(records + r * 4 + 2);
      if (seq >= positions.length) continue;
      final before = glyphs.length;
      if (positions[seq] >= before) continue;
      index = positions[seq];
      if (!_recurse(nested)) continue;
      var delta = glyphs.length - before;
      if (delta == 0) continue;
      end += delta;
      if (end < positions[seq]) {
        delta += positions[seq] - end;
        end = positions[seq];
      }
      final from = seq + 1;
      if (delta > 0) {
        positions.insertAll(from, List.filled(delta, 0));
        for (var j = from; j < from + delta; j++) {
          positions[j] = positions[j - 1] + 1;
        }
        for (var j = from + delta; j < positions.length; j++) {
          positions[j] += delta;
        }
      } else {
        final removed = math.min(-delta, positions.length - from);
        positions.removeRange(from, from + removed);
        for (var j = from; j < positions.length; j++) {
          positions[j] -= removed;
        }
      }
    }
    index = end;
  }

  bool _recurse(int lookupIndex) {
    if (_nesting >= 64 || lookupIndex >= table.lookupCount) return false;
    final saved = lookup;
    lookup = table.lookup(lookupIndex);
    _nesting++;
    try {
      if (!positioning && lookup.type == 8) return false;
      return _applyHere();
    } finally {
      _nesting--;
      lookup = saved;
    }
  }
}
