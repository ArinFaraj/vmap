import 'dart:math' as math;
import 'dart:typed_data';

import 'bytes.dart';

/// A variation axis from the `fvar` table, in user units.
class FontAxis {
  const FontAxis(this.tag, this.min, this.defaultValue, this.max);

  final String tag;
  final double min, defaultValue, max;
}

/// The `fvar` axes and `avar` maps: user axis values to the normalized
/// coordinates every variation table is read at.
class Axes {
  Axes._(this.axes, this._maps);

  static Axes? read(ByteData data, int? fvar, int? avar) {
    if (fvar == null) return null;
    final axesOffset = fvar + data.u16(fvar + 4);
    final count = data.u16(fvar + 8), size = data.u16(fvar + 10);
    final axes = [
      for (var i = 0; i < count; i++)
        FontAxis(
          data.tag(axesOffset + i * size),
          data.fixed(axesOffset + i * size + 4),
          data.fixed(axesOffset + i * size + 8),
          data.fixed(axesOffset + i * size + 12),
        ),
    ];
    final maps = <List<(double, double)>>[];
    if (avar != null && data.u16(avar) == 1) {
      var p = avar + 8;
      for (var i = 0; i < data.u16(avar + 6) && i < count; i++) {
        final n = data.u16(p);
        maps.add([
          for (var j = 0; j < n; j++)
            (data.f2dot14(p + 2 + j * 4), data.f2dot14(p + 4 + j * 4)),
        ]);
        p += 2 + n * 4;
      }
    }
    return Axes._(axes, maps);
  }

  final List<FontAxis> axes;
  final List<List<(double, double)>> _maps;

  /// Normalized coordinates for [values], user values by axis tag; an axis
  /// left out stays at its default. Each coordinate is rounded to the 2.14
  /// fixed point the tables store, as rasterizers round it.
  Float64List normalize(Map<String, double> values) {
    final out = Float64List(axes.length);
    for (var i = 0; i < axes.length; i++) {
      final a = axes[i];
      final v = (values[a.tag] ?? a.defaultValue).clamp(a.min, a.max);
      var n = v < a.defaultValue
          ? (v - a.defaultValue) / (a.defaultValue - a.min)
          : v > a.defaultValue
          ? (v - a.defaultValue) / (a.max - a.defaultValue)
          : 0.0;
      n = _f2dot14(n);
      if (i < _maps.length) n = _f2dot14(_map(_maps[i], n));
      out[i] = n;
    }
    return out;
  }

  static double _f2dot14(double v) => (v * 16384).round() / 16384;

  static double _map(List<(double, double)> map, double v) {
    if (map.length < 2) return v;
    if (v <= map.first.$1) return map.first.$2;
    for (var i = 1; i < map.length; i++) {
      final (x1, y1) = map[i];
      if (v > x1) continue;
      final (x0, y0) = map[i - 1];
      return x1 == x0 ? y1 : y0 + (v - x0) * (y1 - y0) / (x1 - x0);
    }
    return map.last.$2;
  }
}

/// How much a region of the design space applies at [coords], its tuple
/// given per axis by [peak], [start] and [end]. Without [start] and [end]
/// the region runs from zero to its peak.
double regionScalar(
  Float64List coords,
  double Function(int axis) peak,
  double Function(int axis)? start,
  double Function(int axis)? end,
) {
  var scalar = 1.0;
  for (var a = 0; a < coords.length; a++) {
    final p = peak(a);
    if (p == 0) continue;
    final c = coords[a];
    if (c == p) continue;
    if (start != null && end != null) {
      final s = start(a), e = end(a);
      if (s > p || p > e || s < 0 && e > 0 && p != 0) {
        continue;
      }
      if (c <= s || c >= e) return 0;
      scalar *= c < p ? (c - s) / (p - s) : (e - c) / (e - p);
    } else {
      if (c == 0 || c < math.min(0, p) || c > math.max(0, p)) return 0;
      scalar *= c / p;
    }
  }
  return scalar;
}

/// An `ItemVariationStore`: deltas for values that vary, each found by an
/// outer and an inner index.
class ItemVariationStore {
  ItemVariationStore(this.data, this.offset);

  final ByteData data;
  final int offset;

  late final int _regions = offset + data.u32(offset + 2);
  late final int _axisCount = data.u16(_regions);

  /// The delta for item [outer], [inner] at [coords], or 0.
  double delta(int outer, int inner, Float64List coords) {
    if (coords.isEmpty || outer >= data.u16(offset + 6)) return 0;
    final sub = offset + data.u32(offset + 8 + outer * 4);
    final itemCount = data.u16(sub);
    if (inner >= itemCount) return 0;
    final wordCount = data.u16(sub + 2);
    final longWords = wordCount & 0x8000 != 0;
    final words = wordCount & 0x7FFF;
    final regionCount = data.u16(sub + 4);
    final rowSize = longWords
        ? words * 4 + (regionCount - words) * 2
        : words * 2 + (regionCount - words);
    var p = sub + 6 + regionCount * 2 + inner * rowSize;
    var sum = 0.0;
    for (var r = 0; r < regionCount; r++) {
      final int d;
      if (r < words) {
        d = longWords ? data.i32(p) : data.i16(p);
        p += longWords ? 4 : 2;
      } else {
        d = longWords ? data.i16(p) : data.i8(p);
        p += longWords ? 2 : 1;
      }
      if (d == 0) continue;
      final region = data.u16(sub + 6 + r * 2);
      final base = _regions + 4 + region * _axisCount * 6;
      final s = regionScalar(
        coords,
        (a) => data.f2dot14(base + a * 6 + 2),
        (a) => data.f2dot14(base + a * 6),
        (a) => data.f2dot14(base + a * 6 + 4),
      );
      sum += d * s;
    }
    return sum;
  }
}

/// A `DeltaSetIndexMap`: which outer and inner store index an item reads.
class DeltaSetIndexMap {
  DeltaSetIndexMap(this.data, this.offset);

  final ByteData data;
  final int offset;

  (int, int) operator [](int item) {
    final format = data.u8(offset);
    final entryFormat = data.u8(offset + 1);
    final count = format == 0 ? data.u16(offset + 2) : data.u32(offset + 2);
    final start = offset + (format == 0 ? 4 : 6);
    if (count == 0) return (0, item);
    final i = math.min(item, count - 1);
    final size = ((entryFormat >> 4) & 3) + 1;
    var v = 0;
    for (var b = 0; b < size; b++) {
      v = v << 8 | data.u8(start + i * size + b);
    }
    final innerBits = (entryFormat & 0x0F) + 1;
    return (v >> innerBits, v & ((1 << innerBits) - 1));
  }
}
