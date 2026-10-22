import 'apply.dart';
import 'bytes.dart';
import 'layout.dart';

/// Applies `GPOS` lookups, leaving attachments as offsets from the glyph
/// attached to, for [Positioning.resolveAttachments] to settle.
class Positioning extends LookupApplier {
  Positioning(super.font, super.table, super.glyphs, {required this.rtl});

  /// Whether the run is set right to left.
  final bool rtl;

  @override
  bool get positioning => true;

  @override
  bool applySubtable(int type, int at) => switch (type) {
    1 => _single(at),
    2 => _pair(at),
    3 => _cursive(at),
    4 => _markToBase(at),
    5 => _markToLigature(at),
    6 => _markToMark(at),
    7 => applyContext(at, chained: false),
    8 => applyContext(at, chained: true),
    _ => false,
  };

  static int _valueSize(int format) {
    var n = 0;
    for (var f = format & 0xFF; f != 0; f >>= 1) {
      n += f & 1;
    }
    return n * 2;
  }

  /// Adds the value record at [at], of [format], to [g]; device offsets
  /// count from [base].
  void _value(ShapingGlyph g, int format, int at, int base) {
    var p = at;
    int field() {
      final v = data.i16(p);
      p += 2;
      return v;
    }

    int device() {
      final v = _device(base, data.u16(p));
      p += 2;
      return v;
    }

    if (format & 0x01 != 0) g.xOffset += field();
    if (format & 0x02 != 0) g.yOffset += field();
    if (format & 0x04 != 0) g.xAdvance += field();
    if (format & 0x08 != 0) field();
    if (format & 0x10 != 0) g.xOffset += device();
    if (format & 0x20 != 0) g.yOffset += device();
    if (format & 0x40 != 0) g.xAdvance += device();
  }

  /// The delta of the device or variation index table at [offset] from
  /// [base], rounded; hinting deltas apply only at a size, so not here.
  int _device(int base, int offset) {
    if (offset == 0) return 0;
    final at = base + offset;
    if (data.u16(at + 4) != 0x8000) return 0;
    final store = gdef?.store;
    if (store == null) return 0;
    return store.delta(data.u16(at), data.u16(at + 2), font.coords).round();
  }

  (double, double) _anchor(int at) {
    var x = data.i16(at + 2).toDouble(), y = data.i16(at + 4).toDouble();
    if (data.u16(at) == 3) {
      x += _device(at, data.u16(at + 6));
      y += _device(at, data.u16(at + 8));
    }
    return (x, y);
  }

  int _covered(int at) =>
      coverageIndex(data, at + data.u16(at + 2), glyphs[index].glyph);

  bool _single(int at) {
    final i = _covered(at);
    if (i < 0) return false;
    final format = data.u16(at + 4);
    switch (data.u16(at)) {
      case 1:
        _value(glyphs[index], format, at + 6, at);
      case 2:
        if (i >= data.u16(at + 6)) return false;
        _value(glyphs[index], format, at + 8 + i * _valueSize(format), at);
      default:
        return false;
    }
    index++;
    return true;
  }

  bool _pair(int at) {
    final i = _covered(at);
    if (i < 0) return false;
    final second = step(index, 1);
    if (second == null) return false;
    final f1 = data.u16(at + 4), f2 = data.u16(at + 6);
    final s1 = _valueSize(f1), s2 = _valueSize(f2);
    final first = glyphs[index], other = glyphs[second];
    switch (data.u16(at)) {
      case 1:
        if (i >= data.u16(at + 8)) return false;
        final set = at + data.u16(at + 10 + i * 2);
        final record = 2 + s1 + s2;
        var lo = 0, hi = data.u16(set) - 1;
        var found = -1;
        while (lo <= hi) {
          final mid = (lo + hi) >> 1;
          final g = data.u16(set + 2 + mid * record);
          if (other.glyph < g) {
            hi = mid - 1;
          } else if (other.glyph > g) {
            lo = mid + 1;
          } else {
            found = set + 2 + mid * record;
            break;
          }
        }
        if (found < 0) return false;
        _value(first, f1, found + 2, set);
        _value(other, f2, found + 2 + s1, set);
      case 2:
        final c1 = classOf(data, at + data.u16(at + 8), first.glyph);
        final c2 = classOf(data, at + data.u16(at + 10), other.glyph);
        final count1 = data.u16(at + 12), count2 = data.u16(at + 14);
        if (c1 >= count1 || c2 >= count2) return false;
        final record = at + 16 + (c1 * count2 + c2) * (s1 + s2);
        _value(first, f1, record, at);
        _value(other, f2, record + s1, at);
      default:
        return false;
    }
    index = f2 != 0 ? second + 1 : second;
    return true;
  }

  bool _cursive(int at) {
    final cover = at + data.u16(at + 2);
    final cur = glyphs[index];
    final i = coverageIndex(data, cover, cur.glyph);
    if (i < 0 || i >= data.u16(at + 4)) return false;
    final entry = data.u16(at + 6 + i * 4);
    if (entry == 0) return false;
    final p = step(index, -1);
    if (p == null) return false;
    final prev = glyphs[p];
    final k = coverageIndex(data, cover, prev.glyph);
    if (k < 0 || k >= data.u16(at + 4)) return false;
    final exit = data.u16(at + 6 + k * 4 + 2);
    if (exit == 0) return false;
    final (exitX, exitY) = _anchor(at + exit);
    final (entryX, entryY) = _anchor(at + entry);
    if (rtl) {
      final d = exitX.roundToDouble() + prev.xOffset;
      prev
        ..xAdvance -= d
        ..xOffset -= d;
      cur.xAdvance = entryX.roundToDouble() + cur.xOffset;
    } else {
      prev.xAdvance = exitX.roundToDouble() + prev.xOffset;
      final d = entryX.roundToDouble() + cur.xOffset;
      cur
        ..xAdvance -= d
        ..xOffset -= d;
    }
    var child = p, parent = index;
    var y = entryY - exitY;
    if (lookup.flag & Lookup.rightToLeft == 0) {
      (child, parent) = (parent, child);
      y = -y;
    }
    _breakCursiveChain(child, parent);
    glyphs[child]
      ..attachType = ShapingGlyph.attachCursive
      ..attachChain = parent - child
      ..yOffset = y;
    if (glyphs[parent].attachChain == -glyphs[child].attachChain) {
      glyphs[parent]
        ..attachChain = 0
        ..yOffset = 0;
    }
    index++;
    return true;
  }

  /// Turns the cursive chain hanging from [i] around, so it hangs from
  /// [newParent] instead, as a glyph can be the child of only one.
  void _breakCursiveChain(int i, int newParent) {
    final g = glyphs[i];
    final chain = g.attachChain;
    if (chain == 0 || g.attachType & ShapingGlyph.attachCursive == 0) return;
    g.attachChain = 0;
    final j = i + chain;
    if (j == newParent) return;
    _breakCursiveChain(j, newParent);
    glyphs[j]
      ..yOffset = -g.yOffset
      ..attachChain = -chain
      ..attachType = g.attachType;
  }

  /// The glyph before the mark at [index] that marks attach to: the
  /// nearest one the lookup does not step over as a mark.
  int? _baseBefore({bool checkSequence = false, int? baseCoverage}) {
    for (var j = index - 1; j >= 0; j--) {
      final g = glyphs[j];
      if (ignored(g, Lookup.ignoreMarks)) continue;
      if (g.mask & mask == 0) continue;
      if (g.ignorable && !g.substituted) continue;
      if (checkSequence &&
          !_firstOfSequence(j) &&
          coverageIndex(data, baseCoverage!, g.glyph) < 0) {
        continue;
      }
      return j;
    }
    return null;
  }

  /// Whether the glyph at [j] is the first of a multiple substitution's
  /// glyphs, or not from one: marks attach to the first.
  bool _firstOfSequence(int j) {
    final g = glyphs[j];
    if (!g.multiplied || g.component == 0 || j == 0) return true;
    final p = glyphs[j - 1];
    return p.isMark ||
        !p.multiplied ||
        g.ligId != p.ligId ||
        g.component != p.component + 1;
  }

  /// Attaches the mark at [index], number [markIndex] in the mark array at
  /// [marks], to [anchor] of the glyph at [target].
  bool _attach(int marks, int markIndex, int? anchor, int target) {
    if (anchor == null) return false;
    final record = marks + 2 + markIndex * 4;
    final markAnchor = marks + data.u16(record + 2);
    final (mx, my) = _anchor(markAnchor);
    final (bx, by) = _anchor(anchor);
    glyphs[index]
      ..xOffset = (bx - mx).roundToDouble()
      ..yOffset = (by - my).roundToDouble()
      ..attachType = ShapingGlyph.attachMark
      ..attachChain = target - index;
    index++;
    return true;
  }

  /// The anchor in row [row] of the anchor matrix at [matrix], for the
  /// mark class of mark [markIndex] in [marks], or null.
  int? _anchorIn(int matrix, int row, int marks, int markIndex, int classes) {
    if (row >= data.u16(matrix)) return null;
    final cls = data.u16(marks + 2 + markIndex * 4);
    if (cls >= classes) return null;
    final offset = data.u16(matrix + 2 + (row * classes + cls) * 2);
    return offset == 0 ? null : matrix + offset;
  }

  bool _markToBase(int at) {
    final markIndex = coverageIndex(
      data,
      at + data.u16(at + 2),
      glyphs[index].glyph,
    );
    if (markIndex < 0) return false;
    final baseCoverage = at + data.u16(at + 4);
    final base = _baseBefore(checkSequence: true, baseCoverage: baseCoverage);
    if (base == null) return false;
    final baseIndex = coverageIndex(data, baseCoverage, glyphs[base].glyph);
    if (baseIndex < 0) return false;
    final classes = data.u16(at + 6);
    final marks = at + data.u16(at + 8);
    final bases = at + data.u16(at + 10);
    return _attach(
      marks,
      markIndex,
      _anchorIn(bases, baseIndex, marks, markIndex, classes),
      base,
    );
  }

  bool _markToLigature(int at) {
    final mark = glyphs[index];
    final markIndex = coverageIndex(data, at + data.u16(at + 2), mark.glyph);
    if (markIndex < 0) return false;
    final lig = _baseBefore();
    if (lig == null) return false;
    final ligIndex = coverageIndex(
      data,
      at + data.u16(at + 4),
      glyphs[lig].glyph,
    );
    if (ligIndex < 0) return false;
    final classes = data.u16(at + 6);
    final marks = at + data.u16(at + 8);
    final ligatures = at + data.u16(at + 10);
    if (ligIndex >= data.u16(ligatures)) return false;
    final attach = ligatures + data.u16(ligatures + 2 + ligIndex * 2);
    final count = data.u16(attach);
    if (count == 0) return false;
    final id = glyphs[lig].ligId;
    final row = id != 0 && id == mark.ligId && mark.component > 0
        ? (mark.component < count ? mark.component : count) - 1
        : count - 1;
    return _attach(
      marks,
      markIndex,
      _anchorIn(attach, row, marks, markIndex, classes),
      lig,
    );
  }

  bool _markToMark(int at) {
    final mark = glyphs[index];
    final markIndex = coverageIndex(data, at + data.u16(at + 2), mark.glyph);
    if (markIndex < 0) return false;
    final j = step(index, -1, flag: lookup.flag & ~0x000E);
    if (j == null || !glyphs[j].isMark) return false;
    final other = glyphs[j];
    final id1 = mark.ligId, id2 = other.ligId;
    final c1 = mark.component, c2 = other.component;
    final same = id1 == id2
        ? id1 == 0 || c1 == c2
        : id1 > 0 && c1 == 0 || id2 > 0 && c2 == 0;
    if (!same) return false;
    final mark2Index = coverageIndex(data, at + data.u16(at + 4), other.glyph);
    if (mark2Index < 0) return false;
    final classes = data.u16(at + 6);
    final marks = at + data.u16(at + 8);
    final marks2 = at + data.u16(at + 10);
    return _attach(
      marks,
      markIndex,
      _anchorIn(marks2, mark2Index, marks, markIndex, classes),
      j,
    );
  }

  /// Turns attachments into offsets from each glyph's own pen position,
  /// the run still in logical order.
  static void resolveAttachments(List<ShapingGlyph> glyphs, bool rtl) {
    for (var i = 0; i < glyphs.length; i++) {
      _settle(glyphs, i, rtl, 0);
    }
  }

  static void _settle(List<ShapingGlyph> glyphs, int i, bool rtl, int depth) {
    final g = glyphs[i];
    final chain = g.attachChain;
    if (chain == 0) return;
    g.attachChain = 0;
    final j = i + chain;
    if (j < 0 || j >= glyphs.length || depth > 64) return;
    _settle(glyphs, j, rtl, depth + 1);
    final parent = glyphs[j];
    if (g.attachType & ShapingGlyph.attachCursive != 0) {
      g.yOffset += parent.yOffset;
      return;
    }
    g
      ..xOffset += parent.xOffset
      ..yOffset += parent.yOffset;
    if (rtl) {
      for (var k = j + 1; k <= i; k++) {
        g.xOffset += glyphs[k].xAdvance;
      }
    } else {
      for (var k = j; k < i; k++) {
        g.xOffset -= glyphs[k].xAdvance;
      }
    }
  }
}
