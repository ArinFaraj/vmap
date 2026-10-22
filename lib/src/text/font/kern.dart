import 'dart:typed_data';

import 'apply.dart';
import 'bytes.dart';
import 'layout.dart';

/// The `kern` table, in its OpenType and Apple versions: pairs of glyphs
/// and how much to move the second, for fonts that kern without `GPOS`.
/// Only pair lists (format 0) are read, and neither minimum nor varied
/// kerning.
class LegacyKern {
  LegacyKern._(this.data, this._pairs, this.hasCrossStream);

  static LegacyKern? read(ByteData data, int at) {
    final apple = data.u16(at) == 1;
    final count = apple ? data.u32(at + 4) : data.u16(at + 2);
    var p = at + (apple ? 8 : 4);
    final pairs = <(int, bool)>[];
    var crossStream = false;
    for (var i = 0; i < count; i++) {
      final int length, format, body;
      final bool horizontal, skipped, cross;
      if (apple) {
        length = data.u32(p);
        final coverage = data.u16(p + 4);
        format = coverage & 0xFF;
        horizontal = coverage & 0x8000 == 0;
        cross = coverage & 0x4000 != 0;
        skipped = coverage & 0x2000 != 0;
        body = p + 8;
      } else {
        length = data.u16(p + 2);
        final coverage = data.u16(p + 4);
        format = coverage >> 8;
        horizontal = coverage & 1 != 0;
        skipped = coverage & 2 != 0;
        cross = coverage & 4 != 0;
        body = p + 6;
      }
      if (format == 0 && horizontal && !skipped) {
        pairs.add((body, cross));
        crossStream |= cross;
      }
      if (length == 0) break;
      p += length;
    }
    return pairs.isEmpty ? null : LegacyKern._(data, pairs, crossStream);
  }

  final ByteData data;

  /// Each pair list's start and whether it moves glyphs up and down rather
  /// than along the line.
  final List<(int, bool)> _pairs;
  final bool hasCrossStream;

  int _value(int list, int left, int right) {
    final key = left << 16 | right;
    var lo = 0, hi = data.u16(list) - 1;
    while (lo <= hi) {
      final mid = (lo + hi) >> 1;
      final r = list + 8 + mid * 6;
      final k = data.u32(r);
      if (key < k) {
        hi = mid - 1;
      } else if (key > k) {
        lo = mid + 1;
      } else {
        return data.i16(r + 4);
      }
    }
    return 0;
  }

  /// Kerns each pair of [glyphs] with a bit of [mask], marks stepped over,
  /// half of the amount on either glyph of the pair. Pairs are left to
  /// right as drawn, so a right-to-left run, [rtl], is read backwards.
  void apply(List<ShapingGlyph> logical, int mask, {required bool rtl}) {
    final glyphs = rtl ? logical.reversed.toList() : logical;
    for (final (list, cross) in _pairs) {
      var i = 0;
      while (i < glyphs.length) {
        if (glyphs[i].mask & mask == 0) {
          i++;
          continue;
        }
        var j = i + 1;
        while (j < glyphs.length && glyphs[j].glyphClass == glyphMark) {
          j++;
        }
        if (j >= glyphs.length) break;
        final kern = _value(list, glyphs[i].glyph, glyphs[j].glyph);
        if (kern != 0) {
          if (cross) {
            glyphs[j].yOffset = kern.toDouble();
          } else {
            final first = kern >> 1, second = kern - first;
            glyphs[i].xAdvance += first;
            glyphs[j]
              ..xAdvance += second
              ..xOffset += second;
          }
        }
        i = j;
      }
    }
  }
}
