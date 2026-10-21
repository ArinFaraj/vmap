import 'dart:math' as math;
import 'dart:typed_data';

import 'tile_builder.dart' show tileExtent;

/// One tile's buildings in a 16 by 16 grid of cells by their bounds, made
/// with them on the tile worker, for asking what a line on the ground runs
/// into without walking every wall.
class BuildingIndex {
  BuildingIndex(this.bounds, this.cellStart, this.cellItems, this.cellTallest);

  /// Indexes the buildings described by [info], with their [walls], as
  /// [BuiltExtrusion] holds them.
  factory BuildingIndex.of(Float32List walls, Float32List info) {
    final n = info.length ~/ _stride;
    final bounds = Float32List(n * 4);
    final cellTallest = Float32List(_cells * _cells);
    final counts = Int32List(_cells * _cells);
    for (var b = 0; b < n; b++) {
      final i = b * _stride;
      final first = info[i + 4].toInt(), count = info[i + 5].toInt();
      var x0 = double.infinity, y0 = double.infinity;
      var x1 = -double.infinity, y1 = -double.infinity;
      for (var w = first; w < first + count; w++) {
        x0 = math.min(x0, walls[w * 4]);
        x1 = math.max(x1, walls[w * 4]);
        y0 = math.min(y0, walls[w * 4 + 1]);
        y1 = math.max(y1, walls[w * 4 + 1]);
      }
      bounds
        ..[b * 4] = x0
        ..[b * 4 + 1] = y0
        ..[b * 4 + 2] = x1
        ..[b * 4 + 3] = y1;
      for (var cy = _cell(y0); cy <= _cell(y1); cy++) {
        for (var cx = _cell(x0); cx <= _cell(x1); cx++) {
          final c = cy * _cells + cx;
          counts[c]++;
          cellTallest[c] = math.max(cellTallest[c], info[i]);
        }
      }
    }
    final cellStart = Float32List(_cells * _cells + 1);
    for (var c = 0; c < _cells * _cells; c++) {
      cellStart[c + 1] = cellStart[c] + counts[c];
    }
    final cellItems = Float32List(cellStart[_cells * _cells].toInt());
    final filled = Int32List(_cells * _cells);
    for (var b = 0; b < n; b++) {
      for (
        var cy = _cell(bounds[b * 4 + 1]);
        cy <= _cell(bounds[b * 4 + 3]);
        cy++
      ) {
        for (
          var cx = _cell(bounds[b * 4]);
          cx <= _cell(bounds[b * 4 + 2]);
          cx++
        ) {
          final c = cy * _cells + cx;
          cellItems[cellStart[c].toInt() + filled[c]++] = b.toDouble();
        }
      }
    }
    return BuildingIndex(bounds, cellStart, cellItems, cellTallest);
  }

  static const _stride = 12;

  /// Per building its bounds as x0, y0, x1, y1 in tile units.
  final Float32List bounds;

  /// Per cell, where its buildings start in [cellItems], and one more entry
  /// for the end.
  final Float32List cellStart;
  final Float32List cellItems;

  /// Per cell, the height in metres of its tallest building.
  final Float32List cellTallest;

  late final double tallest = cellTallest.fold(0.0, math.max);
  late final Int32List _seen = Int32List(bounds.length ~/ 4);
  int _stamp = 0;

  static const _cells = 16;
  static const _cellSize = tileExtent / _cells;

  static int _cell(double v) =>
      (v / tileExtent * _cells).floor().clamp(0, _cells - 1);

  /// The height in metres of the building that ground point [x], [y], in
  /// tile units, stands in, or 0.
  double roofAt(Float32List walls, Float32List info, double x, double y) {
    if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) return 0;
    var roof = 0.0;
    final c = _cell(y) * _cells + _cell(x);
    for (var k = cellStart[c].toInt(); k < cellStart[c + 1].toInt(); k++) {
      final b = cellItems[k].toInt();
      if (x < bounds[b * 4] ||
          y < bounds[b * 4 + 1] ||
          x > bounds[b * 4 + 2] ||
          y > bounds[b * 4 + 3]) {
        continue;
      }
      if (_inside(walls, info, b, x, y)) {
        roof = math.max(roof, info[b * _stride]);
      }
    }
    return roof;
  }

  /// Whether a wall crosses the stretch from [ax], [ay] to [bx], [by] in
  /// tile units above the line's height there, which [lineAt] gives in
  /// world pixels for a distance along the stretch in tile units.
  bool blocks(
    Float32List walls,
    Float32List info,
    double ax,
    double ay,
    double bx,
    double by,
    double Function(double along) lineAt,
    double perMetre,
  ) {
    final minX = math.min(ax, bx), maxX = math.max(ax, bx);
    final minY = math.min(ay, by), maxY = math.max(ay, by);
    if (maxX < 0 || maxY < 0 || minX >= tileExtent || minY >= tileExtent) {
      return false;
    }
    _stamp++;
    final ex = bx - ax, ey = by - ay;
    final length = math.sqrt(ex * ex + ey * ey);
    if (length == 0) return false;
    // The line only rises away from the point, so a building, or a cell of
    // them, lower than the line at its nearest edge cannot reach over it.
    double nearest(double x0, double y0, double x1, double y1) {
      final dx = math.max(math.max(x0 - ax, ax - x1), 0.0);
      final dy = math.max(math.max(y0 - ay, ay - y1), 0.0);
      return math.sqrt(dx * dx + dy * dy);
    }

    for (var cy = _cell(minY); cy <= _cell(maxY); cy++) {
      for (var cx = _cell(minX); cx <= _cell(maxX); cx++) {
        final c = cy * _cells + cx;
        final cellNear = nearest(
          cx * _cellSize,
          cy * _cellSize,
          (cx + 1) * _cellSize,
          (cy + 1) * _cellSize,
        );
        if (cellTallest[c] * perMetre <= lineAt(cellNear)) continue;
        for (var k = cellStart[c].toInt(); k < cellStart[c + 1].toInt(); k++) {
          final b = cellItems[k].toInt();
          if (_seen[b] == _stamp) continue;
          _seen[b] = _stamp;
          if (maxX < bounds[b * 4] ||
              maxY < bounds[b * 4 + 1] ||
              minX > bounds[b * 4 + 2] ||
              minY > bounds[b * 4 + 3]) {
            continue;
          }
          final i = b * _stride;
          final height = info[i] * perMetre;
          final near = nearest(
            bounds[b * 4],
            bounds[b * 4 + 1],
            bounds[b * 4 + 2],
            bounds[b * 4 + 3],
          );
          if (height <= lineAt(near)) continue;
          final first = info[i + 4].toInt(), count = info[i + 5].toInt();
          for (var w = first; w < first + count; w++) {
            final t = _cross(
              ax,
              ay,
              ex,
              ey,
              walls[w * 4],
              walls[w * 4 + 1],
              walls[w * 4 + 2],
              walls[w * 4 + 3],
            );
            if (t >= 0 && height > lineAt(t * length)) return true;
          }
        }
      }
    }
    return false;
  }

  /// Where along the stretch from ([ax], [ay]) by ([ex], [ey]) it crosses
  /// the segment from ([x0], [y0]) to ([x1], [y1]), from 0 to 1, or -1.
  static double _cross(
    double ax,
    double ay,
    double ex,
    double ey,
    double x0,
    double y0,
    double x1,
    double y1,
  ) {
    final fx = x1 - x0, fy = y1 - y0;
    final den = ex * fy - ey * fx;
    if (den == 0) return -1;
    final gx = x0 - ax, gy = y0 - ay;
    final t = (gx * fy - gy * fx) / den;
    final s = (gx * ey - gy * ex) / den;
    if (t <= 0 || t > 1 || s < 0 || s > 1) return -1;
    return t;
  }

  /// Even-odd test of [x], [y] against building [b]'s walls.
  static bool _inside(
    Float32List walls,
    Float32List info,
    int b,
    double x,
    double y,
  ) {
    final i = b * _stride;
    final first = info[i + 4].toInt(), count = info[i + 5].toInt();
    var inside = false;
    for (var w = first; w < first + count; w++) {
      final x0 = walls[w * 4], y0 = walls[w * 4 + 1];
      final x1 = walls[w * 4 + 2], y1 = walls[w * 4 + 3];
      if ((y0 > y) != (y1 > y) && x < (x1 - x0) * (y - y0) / (y1 - y0) + x0) {
        inside = !inside;
      }
    }
    return inside;
  }
}
