import 'dart:math' as math;
import 'dart:typed_data';

import 'package:payv/payv.dart';
// ignore: implementation_imports
import 'package:payv/src/font/glyph_path.dart';

/// Texels per em in the atlas, and how many texels the distance reaches
/// past a glyph's edge on either side.
const emTexels = 32.0;
const spread = 8;

/// One glyph's signed distance field: alpha 0.5 on the outline, rising
/// inside and falling outside by 0.5 over [spread] texels.
class GlyphField {
  GlyphField(
    this.glyphId,
    this.width,
    this.height,
    this.left,
    this.top,
    this.alpha,
  );

  final int glyphId;
  final int width, height;

  /// The field's top left relative to the glyph's origin on the baseline,
  /// in texels, y down.
  final double left, top;
  final Uint8List alpha;
}

/// Flattens [path] in font units into line segments in texels, y down.
List<double> _segments(GlyphPath path, double scale) {
  final out = <double>[];
  var sx = 0.0, sy = 0.0, x = 0.0, y = 0.0;
  void line(double nx, double ny) {
    out.addAll([x, y, nx, ny]);
    x = nx;
    y = ny;
  }

  for (final c in path.commands) {
    switch (c) {
      case MoveTo():
        if (x != sx || y != sy) line(sx, sy);
        x = sx = c.x * scale;
        y = sy = -c.y * scale;
      case LineTo():
        line(c.x * scale, -c.y * scale);
      case QuadTo():
        final x0 = x, y0 = y;
        final cx = c.cx * scale, cy = -c.cy * scale;
        final ex = c.x * scale, ey = -c.y * scale;
        const n = 6;
        for (var i = 1; i <= n; i++) {
          final t = i / n, u = 1 - t;
          line(
            u * u * x0 + 2 * u * t * cx + t * t * ex,
            u * u * y0 + 2 * u * t * cy + t * t * ey,
          );
        }
      case CubicTo():
        final x0 = x, y0 = y;
        final c1x = c.c1x * scale, c1y = -c.c1y * scale;
        final c2x = c.c2x * scale, c2y = -c.c2y * scale;
        final ex = c.x * scale, ey = -c.y * scale;
        const n = 10;
        for (var i = 1; i <= n; i++) {
          final t = i / n, u = 1 - t;
          line(
            u * u * u * x0 +
                3 * u * u * t * c1x +
                3 * u * t * t * c2x +
                t * t * t * ex,
            u * u * u * y0 +
                3 * u * u * t * c1y +
                3 * u * t * t * c2y +
                t * t * t * ey,
          );
        }
      case ClosePath():
        if (x != sx || y != sy) line(sx, sy);
    }
  }
  if (x != sx || y != sy) line(sx, sy);
  return out;
}

/// The field of [glyphId] in [font], or null for a glyph with no outline
/// such as a space.
GlyphField? glyphField(OpenTypeFont font, int glyphId) {
  final path = font.outline(glyphId);
  if (path == null || path.isEmpty) return null;
  final seg = _segments(path, emTexels / font.unitsPerEm);
  if (seg.isEmpty) return null;
  var minX = double.infinity, minY = double.infinity;
  var maxX = -double.infinity, maxY = -double.infinity;
  for (var i = 0; i < seg.length; i += 2) {
    minX = math.min(minX, seg[i]);
    maxX = math.max(maxX, seg[i]);
    minY = math.min(minY, seg[i + 1]);
    maxY = math.max(maxY, seg[i + 1]);
  }
  final left = minX.floorToDouble() - spread;
  final top = minY.floorToDouble() - spread;
  final w = (maxX.ceilToDouble() + spread - left).toInt();
  final h = (maxY.ceilToDouble() + spread - top).toInt();
  final alpha = Uint8List(w * h);
  final n = seg.length ~/ 4;
  for (var j = 0; j < h; j++) {
    final py = top + j + 0.5;
    for (var i = 0; i < w; i++) {
      final px = left + i + 0.5;
      var best = double.infinity;
      var winding = 0;
      for (var k = 0; k < n; k++) {
        final ax = seg[k * 4], ay = seg[k * 4 + 1];
        final bx = seg[k * 4 + 2], by = seg[k * 4 + 3];
        final dx = bx - ax, dy = by - ay;
        final len2 = dx * dx + dy * dy;
        var t = len2 == 0 ? 0.0 : ((px - ax) * dx + (py - ay) * dy) / len2;
        t = t < 0 ? 0 : (t > 1 ? 1 : t);
        final qx = ax + dx * t - px, qy = ay + dy * t - py;
        final d2 = qx * qx + qy * qy;
        if (d2 < best) best = d2;
        if ((ay <= py) != (by <= py)) {
          final cross = dx * (py - ay) - (px - ax) * dy;
          if (by > ay ? cross > 0 : cross < 0) {
            winding += by > ay ? 1 : -1;
          }
        }
      }
      final d = math.sqrt(best) * (winding != 0 ? 1 : -1);
      final a = (0.5 + d / (2 * spread)).clamp(0.0, 1.0);
      alpha[j * w + i] = (a * 255).round();
    }
  }
  return GlyphField(glyphId, w, h, left, top, alpha);
}
