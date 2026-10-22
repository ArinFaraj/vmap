import 'dart:math' as math;
import 'dart:typed_data';

import 'bytes.dart';
import 'variations.dart';

/// A glyph's TrueType outline in font units, y up: closed contours of
/// points, each on the curve or a quadratic control point. Two control
/// points in a row have an on-curve point implied halfway between them.
class GlyphOutline {
  GlyphOutline(this.points, this.onCurve, this.contourEnds);

  /// x, y pairs.
  final Float64List points;
  final Uint8List onCurve;

  /// The index of each contour's last point.
  final Uint16List contourEnds;

  bool get isEmpty => contourEnds.isEmpty;

  /// Walks each contour as a path: [moveTo] its start, then [lineTo] and
  /// [quadTo] around it and back to the start.
  void walk({
    required void Function(double x, double y) moveTo,
    required void Function(double x, double y) lineTo,
    required void Function(double cx, double cy, double x, double y) quadTo,
  }) {
    var first = 0;
    for (final last in contourEnds) {
      final n = last - first + 1;
      if (n >= 2) {
        double x(int k) => points[(first + k % n) * 2];
        double y(int k) => points[(first + k % n) * 2 + 1];
        bool on(int k) => onCurve[first + k % n] != 0;
        var start = 0;
        while (start < n && !on(start)) {
          start++;
        }
        final double sx, sy;
        if (start < n) {
          sx = x(start);
          sy = y(start);
        } else {
          start = n - 1;
          sx = (x(n - 1) + x(0)) / 2;
          sy = (y(n - 1) + y(0)) / 2;
        }
        moveTo(sx, sy);
        final steps = on(start) ? n : n + 1;
        var curved = false;
        var cx = 0.0, cy = 0.0;
        for (var k = 1; k <= steps; k++) {
          final atStart = k == steps;
          final px = atStart ? sx : x(start + k);
          final py = atStart ? sy : y(start + k);
          if (atStart || on(start + k)) {
            if (curved) {
              quadTo(cx, cy, px, py);
            } else {
              lineTo(px, py);
            }
            curved = false;
          } else {
            if (curved) quadTo(cx, cy, (cx + px) / 2, (cy + py) / 2);
            cx = px;
            cy = py;
            curved = true;
          }
        }
      }
      first = last + 1;
    }
  }
}

class _Points {
  _Points(this.x, this.y, this.on, this.ends, this.phantoms);

  final List<double> x, y;
  final List<bool> on;
  final List<int> ends;

  /// Left, right, top and bottom phantom points, x then y.
  final Float64List phantoms;
}

/// Outlines from `glyf` and `loca`, varied by `gvar`.
class Glyphs {
  Glyphs(
    this.data, {
    required this._loca,
    required this._glyf,
    required this.longOffsets,
    required this.glyphCount,
    required this._hmtx,
    required this._metricCount,
    this._gvar,
  });

  final ByteData data;
  final bool longOffsets;
  final int glyphCount;
  final int _loca, _glyf, _hmtx, _metricCount;
  final int? _gvar;

  /// [glyph]'s advance from `hmtx`, unvaried.
  int advance(int glyph) =>
      data.u16(_hmtx + math.min(glyph, _metricCount - 1) * 4);

  int _leftBearing(int glyph) => glyph < _metricCount
      ? data.i16(_hmtx + glyph * 4 + 2)
      : data.i16(_hmtx + _metricCount * 4 + (glyph - _metricCount) * 2);

  /// [glyph]'s outline at [coords], or null for a glyph out of range.
  GlyphOutline? outline(int glyph, Float64List coords) {
    if (glyph >= glyphCount) return null;
    final p = _load(glyph, coords, 0);
    final shift = -p.phantoms[0];
    final points = Float64List(p.x.length * 2);
    for (var i = 0; i < p.x.length; i++) {
      points[i * 2] = p.x[i] + shift;
      points[i * 2 + 1] = p.y[i];
    }
    return GlyphOutline(
      points,
      Uint8List.fromList([for (final o in p.on) o ? 1 : 0]),
      Uint16List.fromList(p.ends),
    );
  }

  /// [glyph]'s ink box at [coords] in font units, y up: its left and top
  /// edges, width, and height as a negative number, as rasterizers report
  /// it. At the default instance that is the box the glyph header stores,
  /// from the left side bearing; varied, the box of its varied points.
  (double, double, double, double) extents(int glyph, Float64List coords) {
    if (glyph >= glyphCount) return (0, 0, 0, 0);
    final (from, to) = _range(glyph);
    if (to <= from) return (0, 0, 0, 0);
    if (coords.isEmpty) {
      final at = _glyf + from;
      final xMin = data.i16(at + 2), yMin = data.i16(at + 4);
      final xMax = data.i16(at + 6), yMax = data.i16(at + 8);
      return (
        _leftBearing(glyph).toDouble(),
        math.max(yMin, yMax).toDouble(),
        (xMax - xMin).abs().toDouble(),
        -(yMax - yMin).abs().toDouble(),
      );
    }
    final outline = this.outline(glyph, coords)!;
    if (outline.isEmpty) return (0, 0, 0, 0);
    final p = outline.points;
    var minX = p[0], maxX = p[0], minY = p[1], maxY = p[1];
    for (var i = 2; i < p.length; i += 2) {
      minX = math.min(minX, p[i]);
      maxX = math.max(maxX, p[i]);
      minY = math.min(minY, p[i + 1]);
      maxY = math.max(maxY, p[i + 1]);
    }
    final left = minX.roundToDouble(), top = maxY.roundToDouble();
    return (
      left,
      top,
      (maxX - left).roundToDouble(),
      (minY - top).roundToDouble(),
    );
  }

  /// [glyph]'s advance at [coords] from its varied phantom points, for a
  /// font without `HVAR`.
  int variedAdvance(int glyph, Float64List coords) {
    if (glyph >= glyphCount) return 0;
    final p = _load(glyph, coords, 0).phantoms;
    return math.max(0, (p[2] - p[0]).round());
  }

  (int, int) _range(int glyph) => longOffsets
      ? (data.u32(_loca + glyph * 4), data.u32(_loca + glyph * 4 + 4))
      : (data.u16(_loca + glyph * 2) * 2, data.u16(_loca + glyph * 2 + 2) * 2);

  _Points _load(int glyph, Float64List coords, int depth) {
    final (from, to) = _range(glyph);
    final at = _glyf + from;
    final empty = to <= from;
    final xMin = empty ? 0 : data.i16(at + 2);
    final left = (xMin - _leftBearing(glyph)).toDouble();
    final phantoms = Float64List(8)
      ..[0] = left
      ..[2] = left + advance(glyph);
    if (empty) {
      final p = _Points([], [], [], [], phantoms);
      _vary(glyph, coords, p, null);
      return p;
    }
    final contours = data.i16(at);
    return contours >= 0
        ? _simple(glyph, at, contours, coords, phantoms)
        : _composite(glyph, at, coords, phantoms, depth);
  }

  _Points _simple(
    int glyph,
    int at,
    int contours,
    Float64List coords,
    Float64List phantoms,
  ) {
    final ends = [for (var i = 0; i < contours; i++) data.u16(at + 10 + i * 2)];
    final count = ends.isEmpty ? 0 : ends.last + 1;
    var p = at + 10 + contours * 2;
    p += 2 + data.u16(p);
    final flags = Uint8List(count);
    for (var i = 0; i < count;) {
      final f = data.u8(p++);
      flags[i++] = f;
      if (f & 0x08 != 0) {
        for (var r = data.u8(p++); r > 0 && i < count; r--) {
          flags[i++] = f;
        }
      }
    }
    final x = List<double>.filled(count, 0), y = List<double>.filled(count, 0);
    var v = 0;
    for (var i = 0; i < count; i++) {
      final f = flags[i];
      if (f & 0x02 != 0) {
        final d = data.u8(p++);
        v += f & 0x10 != 0 ? d : -d;
      } else if (f & 0x10 == 0) {
        v += data.i16(p);
        p += 2;
      }
      x[i] = v.toDouble();
    }
    v = 0;
    for (var i = 0; i < count; i++) {
      final f = flags[i];
      if (f & 0x04 != 0) {
        final d = data.u8(p++);
        v += f & 0x20 != 0 ? d : -d;
      } else if (f & 0x20 == 0) {
        v += data.i16(p);
        p += 2;
      }
      y[i] = v.toDouble();
    }
    final points = _Points(
      x,
      y,
      [for (final f in flags) f & 1 != 0],
      ends,
      phantoms,
    );
    _vary(glyph, coords, points, ends);
    return points;
  }

  _Points _composite(
    int glyph,
    int at,
    Float64List coords,
    Float64List phantoms,
    int depth,
  ) {
    final parts =
        <
          ({
            int flags,
            int glyph,
            int arg1,
            int arg2,
            double a,
            double b,
            double c,
            double d,
          })
        >[];
    var p = at + 10;
    while (true) {
      final flags = data.u16(p), component = data.u16(p + 2);
      p += 4;
      final words = flags & 0x0001 != 0, xy = flags & 0x0002 != 0;
      final int arg1, arg2;
      if (words) {
        arg1 = xy ? data.i16(p) : data.u16(p);
        arg2 = xy ? data.i16(p + 2) : data.u16(p + 2);
        p += 4;
      } else {
        arg1 = xy ? data.i8(p) : data.u8(p);
        arg2 = xy ? data.i8(p + 1) : data.u8(p + 1);
        p += 2;
      }
      var a = 1.0, b = 0.0, c = 0.0, d = 1.0;
      if (flags & 0x0008 != 0) {
        a = d = data.f2dot14(p);
        p += 2;
      } else if (flags & 0x0040 != 0) {
        a = data.f2dot14(p);
        d = data.f2dot14(p + 2);
        p += 4;
      } else if (flags & 0x0080 != 0) {
        a = data.f2dot14(p);
        b = data.f2dot14(p + 2);
        c = data.f2dot14(p + 4);
        d = data.f2dot14(p + 6);
        p += 8;
      }
      parts.add((
        flags: flags,
        glyph: component,
        arg1: arg1,
        arg2: arg2,
        a: a,
        b: b,
        c: c,
        d: d,
      ));
      if (flags & 0x0020 == 0) break;
    }
    final offsets = _Points(
      [for (final part in parts) part.flags & 2 != 0 ? part.arg1 * 1.0 : 0.0],
      [for (final part in parts) part.flags & 2 != 0 ? part.arg2 * 1.0 : 0.0],
      [],
      [],
      phantoms,
    );
    _vary(glyph, coords, offsets, null);
    final out = _Points([], [], [], [], offsets.phantoms);
    if (depth > 8) return out;
    for (final (i, part) in parts.indexed) {
      final child = _load(part.glyph, coords, depth + 1);
      final base = out.x.length;
      for (var k = 0; k < child.x.length; k++) {
        final x = child.x[k], y = child.y[k];
        out.x.add(part.a * x + part.c * y);
        out.y.add(part.b * x + part.d * y);
      }
      out.on.addAll(child.on);
      for (final e in child.ends) {
        out.ends.add(base + e);
      }
      double dx, dy;
      if (part.flags & 0x0002 != 0) {
        dx = offsets.x[i];
        dy = offsets.y[i];
        if (part.flags & 0x0800 != 0 && part.flags & 0x1000 == 0) {
          (dx, dy) = (part.a * dx + part.c * dy, part.b * dx + part.d * dy);
        }
        if (part.flags & 0x0004 != 0) {
          dx = dx.roundToDouble();
          dy = dy.roundToDouble();
        }
      } else {
        final mine = part.arg1, theirs = base + part.arg2;
        if (mine >= base || theirs >= out.x.length) {
          dx = dy = 0;
        } else {
          dx = out.x[mine] - out.x[theirs];
          dy = out.y[mine] - out.y[theirs];
        }
      }
      for (var k = base; k < out.x.length; k++) {
        out.x[k] += dx;
        out.y[k] += dy;
      }
      if (part.flags & 0x0200 != 0) out.phantoms.setAll(0, child.phantoms);
    }
    return out;
  }

  /// Adds [glyph]'s `gvar` deltas at [coords] to [points] and its phantom
  /// points, inferring those of untouched points from their neighbours
  /// along each of [ends]' contours, when given.
  void _vary(int glyph, Float64List coords, _Points points, List<int>? ends) {
    final gvar = _gvar;
    if (gvar == null || coords.isEmpty) return;
    final axisCount = data.u16(gvar + 4);
    if (axisCount != coords.length || glyph >= data.u16(gvar + 12)) return;
    final long = data.u16(gvar + 14) & 1 != 0;
    final offsets = gvar + 20;
    final from = long
        ? data.u32(offsets + glyph * 4)
        : data.u16(offsets + glyph * 2) * 2;
    final to = long
        ? data.u32(offsets + glyph * 4 + 4)
        : data.u16(offsets + glyph * 2 + 2) * 2;
    if (to <= from) return;
    final start = gvar + data.u32(gvar + 16) + from;
    final shared = gvar + data.u32(gvar + 8);

    final n = points.x.length;
    final total = n + 4;
    final origX = List.of(points.x), origY = List.of(points.y);
    final tuples = data.u16(start);
    var serialized = start + data.u16(start + 2);
    List<int>? sharedPoints;
    if (tuples & 0x8000 != 0) {
      (sharedPoints, serialized) = _readPoints(serialized);
    }
    var header = start + 4;
    for (var t = 0; t < (tuples & 0x0FFF); t++) {
      final size = data.u16(header), index = data.u16(header + 2);
      header += 4;
      final int peak;
      if (index & 0x8000 != 0) {
        peak = header;
        header += axisCount * 2;
      } else {
        peak = shared + (index & 0x0FFF) * axisCount * 2;
      }
      int? lo, hi;
      if (index & 0x4000 != 0) {
        lo = header;
        hi = header + axisCount * 2;
        header += axisCount * 4;
      }
      final scalar = regionScalar(
        coords,
        (a) => data.f2dot14(peak + a * 2),
        lo == null ? null : (a) => data.f2dot14(lo! + a * 2),
        hi == null ? null : (a) => data.f2dot14(hi! + a * 2),
      );
      var q = serialized;
      serialized += size;
      if (scalar == 0) continue;
      var which = sharedPoints;
      if (index & 0x2000 != 0) (which, q) = _readPoints(q);
      final count = which?.length ?? total;
      final List<int> dx, dy;
      (dx, q) = _readDeltas(q, count);
      (dy, q) = _readDeltas(q, count);
      if (which == null) {
        for (var i = 0; i < total; i++) {
          _add(points, n, i, dx[i] * scalar, dy[i] * scalar);
        }
        continue;
      }
      final tx = Float64List(total), ty = Float64List(total);
      final touched = List<bool>.filled(total, false);
      for (var k = 0; k < which.length; k++) {
        final i = which[k];
        if (i >= total) continue;
        tx[i] += dx[k];
        ty[i] += dy[k];
        touched[i] = true;
      }
      if (ends != null) _infer(origX, origY, ends, tx, ty, touched);
      for (var i = 0; i < total; i++) {
        if (tx[i] != 0 || ty[i] != 0) {
          _add(points, n, i, tx[i] * scalar, ty[i] * scalar);
        }
      }
    }
  }

  static void _add(_Points p, int n, int i, double dx, double dy) {
    if (i < n) {
      p.x[i] += dx;
      p.y[i] += dy;
    } else {
      p.phantoms[(i - n) * 2] += dx;
      p.phantoms[(i - n) * 2 + 1] += dy;
    }
  }

  (List<int>?, int) _readPoints(int q) {
    var count = data.u8(q++);
    if (count == 0) return (null, q);
    if (count & 0x80 != 0) count = (count & 0x7F) << 8 | data.u8(q++);
    final out = <int>[];
    var last = 0;
    while (out.length < count) {
      final control = data.u8(q++);
      final words = control & 0x80 != 0;
      for (var r = (control & 0x7F) + 1; r > 0 && out.length < count; r--) {
        last += words ? data.u16(q) : data.u8(q);
        q += words ? 2 : 1;
        out.add(last);
      }
    }
    return (out, q);
  }

  (List<int>, int) _readDeltas(int q, int count) {
    final out = <int>[];
    while (out.length < count) {
      final control = data.u8(q++);
      final run = (control & 0x3F) + 1;
      for (var r = 0; r < run && out.length < count; r++) {
        if (control & 0x80 != 0) {
          out.add(0);
        } else if (control & 0x40 != 0) {
          out.add(data.i16(q));
          q += 2;
        } else {
          out.add(data.i8(q));
          q += 1;
        }
      }
    }
    return (out, q);
  }

  /// Interpolates the deltas of untouched points from the touched points
  /// on either side of them along their contour, by their original
  /// coordinates, x and y apart.
  static void _infer(
    List<double> x,
    List<double> y,
    List<int> ends,
    Float64List dx,
    Float64List dy,
    List<bool> touched,
  ) {
    var first = 0;
    for (final end in ends) {
      final touchedHere = [
        for (var i = first; i <= end; i++)
          if (touched[i]) i,
      ];
      if (touchedHere.isNotEmpty && touchedHere.length <= end - first) {
        for (var k = 0; k < touchedHere.length; k++) {
          final a = touchedHere[k];
          final b = touchedHere[(k + 1) % touchedHere.length];
          for (var i = a + 1; ; i++) {
            if (i > end) i = first;
            if (i == b) break;
            dx[i] = _between(x[i], x[a], x[b], dx[a], dx[b]);
            dy[i] = _between(y[i], y[a], y[b], dy[a], dy[b]);
          }
        }
      }
      first = end + 1;
    }
  }

  static double _between(double v, double a, double b, double da, double db) {
    if (a == b) return da == db ? da : 0;
    final (lo, hi, dlo, dhi) = a < b ? (a, b, da, db) : (b, a, db, da);
    if (v <= lo) return dlo;
    if (v >= hi) return dhi;
    return dlo + (v - lo) * (dhi - dlo) / (hi - lo);
  }
}
