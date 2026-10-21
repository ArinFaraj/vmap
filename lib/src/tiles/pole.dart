import 'dart:math' as math;

import 'mvt.dart';

/// Where a polygon feature in [sink] is labelled: one point per polygon,
/// each its pole of inaccessibility found to [precision] tile units, as
/// MapLibre's classifyRings and findPoleOfInaccessibility find them.
List<(double, double)> polygonLabelPoints(
  GeometrySink sink, {
  double precision = 8,
}) {
  final out = <(double, double)>[];
  for (final polygon in _classifyRings(sink)) {
    out.add(_pole(polygon, precision));
  }
  return out;
}

/// The rings of [sink] grouped into polygons, each an outer ring and then
/// its holes: a ring wound the way the first ring is starts a polygon.
List<List<List<double>>> _classifyRings(GeometrySink sink) {
  final c = sink.coords;
  final polygons = <List<List<double>>>[];
  List<List<double>>? polygon;
  bool? ccw;
  for (var r = 0; r < sink.ringCount; r++) {
    final start = sink.ringStart(r), end = sink.ringEnd(r);
    final ring = [for (var i = start * 2; i < end * 2; i++) c[i]];
    final area = _signedArea(ring);
    if (area == 0) continue;
    ccw ??= area < 0;
    if (ccw == area < 0) {
      if (polygon != null) polygons.add(polygon);
      polygon = [ring];
    } else {
      polygon?.add(ring);
    }
  }
  if (polygon != null) polygons.add(polygon);
  return polygons;
}

double _signedArea(List<double> ring) {
  var sum = 0.0;
  for (var i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
    sum += (ring[j] - ring[i]) * (ring[i + 1] + ring[j + 1]);
  }
  return sum;
}

class _Cell {
  _Cell(this.x, this.y, this.h, List<List<double>> polygon)
    : d = _distance(x, y, polygon) {
    max = d + h * math.sqrt2;
  }

  final double x, y, h, d;
  late final double max;
}

(double, double) _pole(List<List<double>> polygon, double precision) {
  final outer = polygon[0];
  var minX = double.infinity, minY = double.infinity;
  var maxX = double.negativeInfinity, maxY = double.negativeInfinity;
  for (var i = 0; i < outer.length; i += 2) {
    minX = math.min(minX, outer[i]);
    maxX = math.max(maxX, outer[i]);
    minY = math.min(minY, outer[i + 1]);
    maxY = math.max(maxY, outer[i + 1]);
  }
  final cellSize = math.min(maxX - minX, maxY - minY);
  if (cellSize == 0) return (minX, minY);
  var h = cellSize / 2;
  final queue = _Heap();
  for (var x = minX; x < maxX; x += cellSize) {
    for (var y = minY; y < maxY; y += cellSize) {
      queue.push(_Cell(x + h, y + h, h, polygon));
    }
  }
  final centroid = _centroid(polygon);
  var best = centroid;
  while (queue.isNotEmpty) {
    final cell = queue.pop();
    if (cell.d > best.d || best.d == 0 || best.d.isNaN) best = cell;
    if (cell.max - best.d <= precision) continue;
    h = cell.h / 2;
    queue
      ..push(_Cell(cell.x - h, cell.y - h, h, polygon))
      ..push(_Cell(cell.x + h, cell.y - h, h, polygon))
      ..push(_Cell(cell.x - h, cell.y + h, h, polygon))
      ..push(_Cell(cell.x + h, cell.y + h, h, polygon));
  }
  // As MapLibre: a centroid inside the polygon and nearly as deep as the
  // pole reads better, for a polygon close to convex.
  if (centroid.d > 0 && best.d - centroid.d <= precision) {
    return (centroid.x, centroid.y);
  }
  return (best.x, best.y);
}

_Cell _centroid(List<List<double>> polygon) {
  final points = polygon[0];
  var area = 0.0, x = 0.0, y = 0.0;
  for (var i = 0, j = points.length - 2; i < points.length; j = i, i += 2) {
    final ax = points[i], ay = points[i + 1];
    final bx = points[j], by = points[j + 1];
    final f = ax * by - bx * ay;
    x += (ax + bx) * f;
    y += (ay + by) * f;
    area += f * 3;
  }
  return _Cell(x / area, y / area, 0, polygon);
}

/// How far ([x], [y]) is from the polygon's outline: positive inside.
double _distance(double x, double y, List<List<double>> polygon) {
  var inside = false;
  var minSq = double.infinity;
  for (final ring in polygon) {
    for (var i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
      final ax = ring[i], ay = ring[i + 1];
      final bx = ring[j], by = ring[j + 1];
      if ((ay > y) != (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) {
        inside = !inside;
      }
      minSq = math.min(minSq, _segmentSq(x, y, ax, ay, bx, by));
    }
  }
  return (inside ? 1 : -1) * math.sqrt(minSq);
}

double _segmentSq(
  double px,
  double py,
  double ax,
  double ay,
  double bx,
  double by,
) {
  var x = ax, y = ay;
  final dx = bx - ax, dy = by - ay;
  if (dx != 0 || dy != 0) {
    final t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = bx;
      y = by;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  return (px - x) * (px - x) + (py - y) * (py - y);
}

/// The cells, the one that could hold the deepest point first.
class _Heap {
  final List<_Cell> _items = [];

  bool get isNotEmpty => _items.isNotEmpty;

  void push(_Cell cell) {
    _items.add(cell);
    var i = _items.length - 1;
    while (i > 0) {
      final parent = (i - 1) >> 1;
      if (_items[parent].max >= cell.max) break;
      _items[i] = _items[parent];
      i = parent;
    }
    _items[i] = cell;
  }

  _Cell pop() {
    final top = _items.first;
    final last = _items.removeLast();
    if (_items.isNotEmpty) {
      var i = 0;
      final n = _items.length;
      while (true) {
        final l = i * 2 + 1, r = l + 1;
        var m = i;
        var mMax = last.max;
        if (l < n && _items[l].max > mMax) {
          m = l;
          mMax = _items[l].max;
        }
        if (r < n && _items[r].max > mMax) m = r;
        if (m == i) break;
        _items[i] = _items[m];
        i = m;
      }
      _items[i] = last;
    }
    return top;
  }
}
