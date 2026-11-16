import 'dart:math' as math;
import 'dart:typed_data';

import '../../tiles/typed_buffer.dart';
import '../font/font.dart';
import 'glyph_pbf.dart';

/// The outline as polylines in pixels, y down: flat pairs of points,
/// each contour closed, consecutive points joined.
DoubleBuffer flattenOutline(GlyphOutline outline, double s, double slant) {
  final out = DoubleBuffer();
  var cx = 0.0, cy = 0.0;
  outline.walk(
    moveTo: (x, y) {
      cx = x * s + y * slant;
      cy = -y * s;
    },
    lineTo: (x, y) {
      final nx = x * s + y * slant, ny = -y * s;
      out.add4(cx, cy, nx, ny);
      cx = nx;
      cy = ny;
    },
    quadTo: (qx0, qy0, x0, y0) {
      final qx = qx0 * s + qy0 * slant, qy = -qy0 * s;
      final x = x0 * s + y0 * slant, y = -y0 * s;
      final dd = _len(cx - 2 * qx + x, cy - 2 * qy + y);
      final n = math.max(1, math.min(32, math.sqrt(dd * 2).ceil()));
      var lx = cx, ly = cy;
      for (var i = 1; i <= n; i++) {
        final t = i / n, u = 1 - t;
        final nx = u * u * cx + 2 * u * t * qx + t * t * x;
        final ny = u * u * cy + 2 * u * t * qy + t * t * y;
        out.add4(lx, ly, nx, ny);
        lx = nx;
        ly = ny;
      }
      cx = x;
      cy = y;
    },
  );
  return out;
}

double _len(double x, double y) => math.sqrt(x * x + y * y);

/// Exact area coverage of the outline, nonzero, clamped to one: each
/// edge adds its signed area to the cells it crosses, and a running sum
/// along each row turns that into coverage.
Float32List coverageOf(
  DoubleBuffer segments,
  int w,
  int h,
  double dx,
  double dy,
) {
  final acc = Float32List(w * h + 2);
  for (var i = 0; i < segments.length; i += 4) {
    _line(
      acc,
      w,
      h,
      segments[i] + dx,
      segments[i + 1] + dy,
      segments[i + 2] + dx,
      segments[i + 3] + dy,
    );
  }
  final out = Float32List(w * h);
  var sum = 0.0;
  for (var i = 0; i < out.length; i++) {
    sum += acc[i];
    final a = sum.abs();
    // Rounding leaves crumbs where there is no ink, which the halo's
    // distance transform would take for edges.
    out[i] = a < 1 / 512 ? 0 : (a > 1 - 1 / 512 ? 1 : a);
  }
  return out;
}

void _line(
  Float32List acc,
  int w,
  int h,
  double x0,
  double y0,
  double x1,
  double y1,
) {
  if (y0 == y1) return;
  double dir;
  if (y0 < y1) {
    dir = 1;
  } else {
    dir = -1;
    final tx = x0, ty = y0;
    x0 = x1;
    y0 = y1;
    x1 = tx;
    y1 = ty;
  }
  final dxdy = (x1 - x0) / (y1 - y0);
  var x = x0;
  if (y0 < 0) x -= y0 * dxdy;
  final yEnd = math.min(h, y1.ceil());
  for (var y = math.max(0, y0.floor()); y < yEnd; y++) {
    final ls = y * w;
    final dy = math.min(y + 1.0, y1) - math.max(y.toDouble(), y0);
    final xNext = x + dxdy * dy;
    final d = dy * dir;
    final xa = x < xNext ? x : xNext, xb = x < xNext ? xNext : x;
    final xaFloor = xa.floorToDouble();
    final xai = xaFloor.toInt();
    final xbCeil = xb.ceilToDouble();
    final xbi = xbCeil.toInt();
    if (xbi <= xai + 1) {
      final xmf = 0.5 * (x + xNext) - xaFloor;
      acc[ls + xai] += d - d * xmf;
      acc[ls + xai + 1] += d * xmf;
    } else {
      final s = 1 / (xb - xa);
      final xaf = xa - xaFloor;
      final a0 = 0.5 * s * (1 - xaf) * (1 - xaf);
      final xbf = xb - xbCeil + 1;
      final am = 0.5 * s * xbf * xbf;
      acc[ls + xai] += d * a0;
      if (xbi == xai + 2) {
        acc[ls + xai + 1] += d * (1 - a0 - am);
      } else {
        final a1 = s * (1.5 - xaf);
        acc[ls + xai + 1] += d * (a1 - a0);
        for (var xi = xai + 2; xi < xbi - 1; xi++) {
          acc[ls + xi] += d * s;
        }
        final a2 = a1 + (xbi - xai - 3) * s;
        acc[ls + xbi - 1] += d * (1 - a2 - am);
      }
      acc[ls + xbi] += d * am;
    }
    x = xNext;
  }
}

/// The box around [lines], as [flattenOutline] gives them: its left, top,
/// right and bottom.
(double, double, double, double) boundsOf(DoubleBuffer lines) {
  var minX = double.infinity, minY = double.infinity;
  var maxX = -double.infinity, maxY = -double.infinity;
  for (var i = 0; i < lines.length; i += 2) {
    minX = math.min(minX, lines[i]);
    maxX = math.max(maxX, lines[i]);
    minY = math.min(minY, lines[i + 1]);
    maxY = math.max(maxY, lines[i + 1]);
  }
  return (minX, minY, maxX, maxY);
}

const _far = 1e20;

/// How far each cell of [coverage], [w] by [h], is from the edge of its
/// ink, in cells: above zero outside the ink, below it inside.
Float64List signedDistances(Float32List coverage, int w, int h) {
  final n = w * h;
  final outer = Float64List(n), inner = Float64List(n);
  for (var i = 0; i < n; i++) {
    final a = coverage[i];
    if (a >= 1) {
      inner[i] = _far;
    } else if (a <= 0) {
      outer[i] = _far;
    } else {
      final d = 0.5 - a;
      outer[i] = d > 0 ? d * d : 0;
      inner[i] = d < 0 ? d * d : 0;
    }
  }
  final size = math.max(w, h);
  final f = Float64List(size), z = Float64List(size + 1);
  final v = Int32List(size);
  _edt(outer, w, h, f, v, z);
  _edt(inner, w, h, f, v, z);
  for (var i = 0; i < n; i++) {
    outer[i] = math.sqrt(outer[i]) - math.sqrt(inner[i]);
  }
  return outer;
}

/// The halo: everything within [width] pixels of the ink, its edge
/// softened over about three [blur] sigmas, as a blurred stroke would be.
Uint8List haloOf(
  Float32List coverage,
  int w,
  int h,
  double width,
  double blur,
) {
  final distance = signedDistances(coverage, w, h);
  final out = Uint8List(w * h);
  final soft = math.max(0.5, blur * 1.5);
  for (var i = 0; i < out.length; i++) {
    var a = (width + soft - distance[i]) / (2 * soft);
    a = a < 0 ? 0 : (a > 1 ? 1 : a);
    a = a * a * (3 - 2 * a);
    out[i] = (a * 255 + 0.5).toInt();
  }
  return out;
}

/// How many times finer than a field's texels its outline is drawn
/// before distances are measured, so a thin stroke keeps its width.
const _fieldDetail = 4;

/// The distance field of glyph [glyph], whose [outline] has [unitsPerEm]
/// font units to the em, as a glyph range holds one: [GlyphPbf.em] pixels
/// to the em with [GlyphPbf.border] of margin, 192 on the glyph's edge and
/// a step of 255 over eight pixels, placed from the glyph's origin on the
/// baseline. Null for an outline with no ink.
PbfGlyph? fieldOf(
  int glyph,
  GlyphOutline outline,
  double unitsPerEm, {
  required bool italic,
}) {
  const k = _fieldDetail, border = GlyphPbf.border;
  final s = GlyphPbf.em / unitsPerEm * k;
  final lines = flattenOutline(outline, s, italic ? 0.2 * s : 0.0);
  if (lines.isEmpty) return null;
  final (minX, minY, maxX, maxY) = boundsOf(lines);
  final left = (minX / k).floor(), top = (minY / k).floor();
  final width = math.max(1, (maxX / k).ceil() - left);
  final height = math.max(1, (maxY / k).ceil() - top);
  final w = width + 2 * border, h = height + 2 * border;
  final fineW = w * k, fineH = h * k;
  final distance = signedDistances(
    coverageOf(
      lines,
      fineW,
      fineH,
      ((border - left) * k).toDouble(),
      ((border - top) * k).toDouble(),
    ),
    fineW,
    fineH,
  );
  final field = Uint8List(w * h);
  const half = k ~/ 2;
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      // The texel's middle falls on the corner of four fine cells.
      var d = 0.0;
      for (var fy = y * k + half - 1; fy <= y * k + half; fy++) {
        for (var fx = x * k + half - 1; fx <= x * k + half; fx++) {
          d += distance[fy * fineW + fx];
        }
      }
      final value = 255 - 255 * (d / 4 / k / 8 + 0.25);
      field[y * w + x] = value < 0 ? 0 : (value > 255 ? 255 : value.round());
    }
  }
  return PbfGlyph(glyph, field, width, height, left, -top, 0);
}

void _edt(
  Float64List grid,
  int w,
  int h,
  Float64List f,
  Int32List v,
  Float64List z,
) {
  for (var x = 0; x < w; x++) {
    _edt1(grid, x, w, h, f, v, z);
  }
  for (var y = 0; y < h; y++) {
    _edt1(grid, y * w, 1, w, f, v, z);
  }
}

/// Felzenszwalb and Huttenlocher's squared distance transform along one
/// row or column.
void _edt1(
  Float64List grid,
  int offset,
  int stride,
  int length,
  Float64List f,
  Int32List v,
  Float64List z,
) {
  for (var q = 0; q < length; q++) {
    f[q] = grid[offset + q * stride];
  }
  v[0] = 0;
  z[0] = -_far;
  z[1] = _far;
  var k = 0;
  for (var q = 1; q < length; q++) {
    double s;
    do {
      final r = v[k];
      s = (f[q] - f[r] + q * q - r * r) / (q - r) / 2;
    } while (s <= z[k] && --k > -1);
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = _far;
  }
  k = 0;
  for (var q = 0; q < length; q++) {
    while (z[k + 1] < q) {
      k++;
    }
    final r = v[k];
    grid[offset + q * stride] = f[r] + (q - r) * (q - r);
  }
}
