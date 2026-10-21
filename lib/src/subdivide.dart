import 'dart:math' as math;
import 'dart:typed_data';

/// MapLibre's subdivision granularity on the globe, in cells across a tile
/// at zoom [z]: fills are cut finer than 128 cells at zoom 0 and never
/// coarser than 2, lines 512 at zoom 0 and not at all from zoom 10.
int fillCells(int z) => math.max(128 >> math.min(z, 30), 2);
int lineCells(int z) => 512 >> math.min(z, 30);

/// Cuts triangles along a grid of [cell] tile units, as MapLibre
/// subdivides geometry for the globe, so no piece spans more than a cell
/// and a sphere can bend them. Each vertex carries [width] floats, its x and
/// y in tile units first; the rest are interpolated with them, so a line
/// vertex, its centre and extrusion, stays on the flat line it drew. A
/// triangle edge is cut where it crosses a grid line, the same for both
/// triangles sharing it, so the pieces meet without cracks.
class Subdivider {
  Subdivider(this.width, this.cell);

  final int width;
  final double cell;

  final List<double> vertices = [];
  final List<int> indices = [];

  int get vertexCount => vertices.length ~/ width;

  /// Adds the triangle of vertices [a], [b] and [c] of [source], each
  /// [width] floats.
  void add(Float32List source, int a, int b, int c) {
    final polygon = [_take(source, a), _take(source, b), _take(source, c)];
    var minX = double.infinity, maxX = -double.infinity;
    for (final v in polygon) {
      minX = math.min(minX, v[0]);
      maxX = math.max(maxX, v[0]);
    }
    var rest = polygon;
    for (var k = (minX / cell).floor() + 1; k * cell < maxX; k++) {
      final (left, right) = _split(rest, 0, k * cell);
      _rows(left);
      rest = right;
      if (rest.length < 3) return;
    }
    _rows(rest);
  }

  List<double> _take(Float32List source, int i) => [
    for (var k = 0; k < width; k++) source[i * width + k].toDouble(),
  ];

  void _rows(List<List<double>> polygon) {
    if (polygon.length < 3) return;
    if (polygon.any(_atPole)) {
      _emit(polygon);
      return;
    }
    var minY = double.infinity, maxY = -double.infinity;
    for (final v in polygon) {
      minY = math.min(minY, v[1]);
      maxY = math.max(maxY, v[1]);
    }
    var rest = polygon;
    for (var k = (minY / cell).floor() + 1; k * cell < maxY; k++) {
      final (above, below) = _split(rest, 1, k * cell);
      _emit(above);
      rest = below;
      if (rest.length < 3) return;
    }
    _emit(rest);
  }

  /// [polygon] cut by the line where coordinate [axis] is [at]: the part
  /// below it and the part above.
  (List<List<double>>, List<List<double>>) _split(
    List<List<double>> polygon,
    int axis,
    double at,
  ) {
    final low = <List<double>>[], high = <List<double>>[];
    final n = polygon.length;
    for (var i = 0; i < n; i++) {
      final p = polygon[i], q = polygon[(i + 1) % n];
      if (_atPole(p)) {
        low.add(p);
        high.add(p);
        continue;
      }
      final pv = p[axis], qv = q[axis];
      if (pv <= at) low.add(p);
      if (pv >= at) high.add(p);
      if (_atPole(q)) continue;
      if ((pv < at && qv > at) || (pv > at && qv < at)) {
        final cut = _cross(p, q, axis, at);
        low.add(cut);
        high.add(cut);
      }
    }
    return (low, high);
  }

  /// Where the edge from [p] to [q] crosses the grid line, worked out from
  /// the edge's ends in one order whichever way it is walked.
  List<double> _cross(List<double> p, List<double> q, int axis, double at) {
    final swap = p[0] > q[0] || (p[0] == q[0] && p[1] > q[1]);
    final a = swap ? q : p, b = swap ? p : q;
    final t = (at - a[axis]) / (b[axis] - a[axis]);
    return [
      for (var k = 0; k < width; k++) k == axis ? at : a[k] + (b[k] - a[k]) * t,
    ];
  }

  /// A fill's vertex at a pole, which a line of longitude cannot cross:
  /// MapLibre's pole vertices.
  static bool _atPole(List<double> v) => v[1] < -32767.5 || v[1] > 32766.5;

  void _emit(List<List<double>> polygon) {
    if (polygon.length < 3) return;
    final base = vertexCount;
    for (final v in polygon) {
      vertices.addAll(v);
    }
    for (var i = 1; i + 1 < polygon.length; i++) {
      indices
        ..add(base)
        ..add(base + i)
        ..add(base + i + 1);
    }
  }
}

/// The points of [coords] from [start] to [end], with one added wherever
/// a segment crosses a grid line [cell] tile units apart, as MapLibre's
/// subdivideVertexLine cuts a line for the globe before it is stroked.
Float64List cutLine(Float64List coords, int start, int end, double cell) {
  final out = <double>[];
  final cuts = <double>[];
  void crossings(double a, double b) {
    if (a == b) return;
    final lo = math.min(a, b), hi = math.max(a, b);
    for (var k = (lo / cell).floor() + 1; k * cell < hi; k++) {
      cuts.add((k * cell - a) / (b - a));
    }
  }

  for (var i = start; i < end; i++) {
    final x = coords[i * 2], y = coords[i * 2 + 1];
    if (i > start) {
      final px = coords[i * 2 - 2], py = coords[i * 2 - 1];
      cuts.clear();
      crossings(px, x);
      crossings(py, y);
      cuts.sort();
      for (final t in cuts) {
        out
          ..add(px + (x - px) * t)
          ..add(py + (y - py) * t);
      }
    }
    out
      ..add(x)
      ..add(y);
  }
  return Float64List.fromList(out);
}
