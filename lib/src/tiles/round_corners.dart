import 'dart:math' as math;
import 'dart:typed_data';

import 'built_tile.dart';

/// Tile units, of a tile at [z] whose row is [y], to [metres] at its middle.
double tileUnitsForMeters(double metres, int z, int y) {
  final n = math.pi - 2 * math.pi * (y + 0.5) / (1 << z);
  final lat = math.atan(0.5 * (math.exp(n) - math.exp(-n)));
  return metres / (40075016.68557849 * math.cos(lat)) * (1 << z) * tileExtent;
}

/// Whether a wall lies along a tile's clipped edge, outside the tile.
bool isBoundaryEdge(double x0, double y0, double x1, double y1) =>
    (x0 == x1 && (x0 < 0 || x0 > tileExtent)) ||
    (y0 == y1 && (y0 < 0 || y0 > tileExtent));

/// [ring], open, as x, y pairs, as MapLibre's `round_polygon_corners.ts`
/// rounds it for `fill-extrusion-rounded-corner-distance`: each corner turned into an arc
/// [distance] tile units from it. Points land on MapLibre's grid, half a
/// tile unit here as its tiles have twice as many, since its triangulation
/// merges points between grid positions.
Float64List roundRing(Float64List ring, double distance) {
  final count = ring.length ~/ 2;
  if (distance <= 0 || count < 3) return ring;
  final out = <double>[];
  void corner(int p, int c, int n) {
    final cx = ring[c * 2], cy = ring[c * 2 + 1];
    var ax = ring[p * 2] - cx, ay = ring[p * 2 + 1] - cy;
    var bx = ring[n * 2] - cx, by = ring[n * 2 + 1] - cy;
    final la = math.sqrt(ax * ax + ay * ay), lb = math.sqrt(bx * bx + by * by);
    if (la < 1e-6 || lb < 1e-6) {
      out
        ..add(cx)
        ..add(cy);
      return;
    }
    ax /= la;
    ay /= la;
    bx /= lb;
    by /= lb;
    final dot = ax * bx + ay * by;
    if (dot.abs() > math.cos(5 * math.pi / 180)) {
      out
        ..add(cx)
        ..add(cy);
      return;
    }
    final r = math.min(distance, math.min(la * 0.2, lb * 0.2));
    final tax = cx + ax * r, tay = cy + ay * r;
    final tbx = cx + bx * r, tby = cy + by * r;
    var hx = ax + bx, hy = ay + by;
    final hl = math.sqrt(hx * hx + hy * hy);
    final k = r / math.sqrt((1 + dot) / 2) / hl;
    hx = cx + hx * k;
    hy = cy + hy * k;
    final ux = tax - hx, uy = tay - hy, vx = tbx - hx, vy = tby - hy;
    final sweep = math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
    final steps = math.max(2, (sweep.abs() / (math.pi / 6) - 1e-6).ceil());
    for (var s = 0; s <= steps; s++) {
      final t = sweep * s / steps, c = math.cos(t), si = math.sin(t);
      out
        ..add(hx + ux * c - uy * si)
        ..add(hy + ux * si + uy * c);
    }
  }

  var before = isBoundaryEdge(
    ring[(count - 1) * 2],
    ring[(count - 1) * 2 + 1],
    ring[0],
    ring[1],
  );
  for (var i = 0; i < count; i++) {
    final n = (i + 1) % count;
    final after = isBoundaryEdge(
      ring[i * 2],
      ring[i * 2 + 1],
      ring[n * 2],
      ring[n * 2 + 1],
    );
    if (before || after) {
      out
        ..add(ring[i * 2])
        ..add(ring[i * 2 + 1]);
    } else {
      corner((i - 1 + count) % count, i, n);
    }
    before = after;
  }
  final snapped = <double>[];
  for (var i = 0; i < out.length; i += 2) {
    final x = (out[i] * 2).roundToDouble() / 2;
    final y = (out[i + 1] * 2).roundToDouble() / 2;
    final m = snapped.length;
    if (m > 0 && snapped[m - 2] == x && snapped[m - 1] == y) continue;
    snapped
      ..add(x)
      ..add(y);
  }
  while (snapped.length > 2 &&
      snapped[0] == snapped[snapped.length - 2] &&
      snapped[1] == snapped[snapped.length - 1]) {
    snapped.length -= 2;
  }
  if (snapped.length < 6) return ring;
  return Float64List.fromList(snapped);
}

/// The normals at the start and end of each wall of a rounded [ring], open,
/// whose wall i runs from point i to the next, so the light blends across
/// an arc: nx0, ny0, nx1, ny1 per wall, from [perps], each wall's outward
/// perpendicular as long as the wall, zero for no wall.
Float64List smoothNormals(Float64List perps) {
  final count = perps.length ~/ 2;
  final out = Float64List(count * 4);
  void smooth(int w, int o, int at) {
    final px = perps[w * 2], py = perps[w * 2 + 1];
    final qx = perps[o * 2], qy = perps[o * 2 + 1];
    final length = math.sqrt(px * px + py * py);
    final other = math.sqrt(qx * qx + qy * qy);
    var nx = px, ny = py;
    final sharp =
        px * qx + py * qy < math.cos(35 * math.pi / 180) * length * other;
    if (other > 0 && !sharp && length < 2 * other) {
      if (other >= 2 * length) {
        nx = qx;
        ny = qy;
      } else {
        nx = px + qx;
        ny = py + qy;
      }
    }
    final l = math.sqrt(nx * nx + ny * ny);
    out[at] = l == 0 ? 0 : nx / l;
    out[at + 1] = l == 0 ? 0 : ny / l;
  }

  for (var w = 0; w < count; w++) {
    smooth(w, (w - 1 + count) % count, w * 4);
    smooth(w, (w + 1) % count, w * 4 + 2);
  }
  return out;
}
