import 'dart:math' as math;

/// A GeoJSON geometry a style compares features with, in `within` and
/// `distance`.
class Place {
  Place._(this._points, this._lines, this._polygons);

  /// Reads a geometry, a feature or a feature collection. Null when [json]
  /// holds none.
  static Place? of(Object? json) {
    final place = Place._([], [], []);
    place._read(json);
    final empty =
        place._points.isEmpty &&
        place._lines.isEmpty &&
        place._polygons.isEmpty;
    return empty ? null : place;
  }

  /// Longitude and latitude in turn.
  final List<double> _points;
  final List<List<double>> _lines;

  /// Each polygon as its rings, the outer one first.
  final List<List<List<double>>> _polygons;

  // MapLibre's cheap ruler: WGS84's radius and flattening.
  static const double _radius = 6378137;
  static const double _flattening = 1 / 298.257223563;

  void _read(Object? json) {
    if (json is! Map) return;
    final coordinates = json['coordinates'];
    switch (json['type']) {
      case 'FeatureCollection':
        final features = json['features'];
        if (features is List) features.forEach(_read);
      case 'Feature':
        _read(json['geometry']);
      case 'GeometryCollection':
        final parts = json['geometries'];
        if (parts is List) parts.forEach(_read);
      case 'Point':
        _points.addAll(_flat([coordinates]));
      case 'MultiPoint':
        _points.addAll(_flat(coordinates));
      case 'LineString':
        _lines.add(_flat(coordinates));
      case 'MultiLineString':
        if (coordinates is List) _lines.addAll(coordinates.map(_flat));
      case 'Polygon':
        if (coordinates is List) _polygons.add(coordinates.map(_flat).toList());
      case 'MultiPolygon':
        if (coordinates is List) {
          for (final p in coordinates) {
            if (p is List) _polygons.add(p.map(_flat).toList());
          }
        }
    }
  }

  static List<double> _flat(Object? ring) => [
    if (ring is List)
      for (final p in ring)
        if (p is List && p.length >= 2 && p[0] is num && p[1] is num) ...[
          (p[0] as num).toDouble(),
          (p[1] as num).toDouble(),
        ],
  ];

  /// Whether every point of the feature's [parts] is inside one of the
  /// polygons, off its edges, as MapLibre's `within`. The parts of a [line]
  /// also may not cross an edge.
  bool holds(List<List<double>> parts, {bool line = false}) {
    if (parts.every((p) => p.isEmpty) || _polygons.isEmpty) return false;
    for (final lonLats in parts) {
      for (var i = 0; i < lonLats.length; i += 2) {
        if (!_insideWrapped(lonLats[i], lonLats[i + 1])) return false;
      }
    }
    if (!line) return true;
    for (final lonLats in parts) {
      if (!_clearOfEdges(lonLats)) return false;
    }
    return true;
  }

  bool _clearOfEdges(List<double> lonLats) {
    for (var i = 0; i + 3 < lonLats.length; i += 2) {
      for (final rings in _polygons) {
        for (final ring in rings) {
          for (var j = 0; j + 3 < ring.length; j += 2) {
            if (_cross(
              lonLats[i],
              lonLats[i + 1],
              lonLats[i + 2],
              lonLats[i + 3],
              ring[j],
              ring[j + 1],
              ring[j + 2],
              ring[j + 3],
            )) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  /// Whether the point is inside, also a world over either way, which a
  /// polygon across the antimeridian reaches.
  bool _insideWrapped(double x, double y) =>
      _strictlyInside(x, y) ||
      _strictlyInside(x + 360, y) ||
      _strictlyInside(x - 360, y);

  bool _strictlyInside(double x, double y) {
    for (final rings in _polygons) {
      for (final ring in rings) {
        for (var i = 0; i + 3 < ring.length; i += 2) {
          if (_toSegment(
                x,
                y,
                ring[i],
                ring[i + 1],
                ring[i + 2],
                ring[i + 3],
              ) ==
              0) {
            return false;
          }
        }
      }
    }
    return _inside(x, y);
  }

  bool _inside(double x, double y) {
    for (final rings in _polygons) {
      var inside = false;
      for (final ring in rings) {
        if (_inRing(x, y, ring)) inside = !inside;
      }
      if (inside) return true;
    }
    return false;
  }

  static bool _cross(
    double ax,
    double ay,
    double bx,
    double by,
    double cx,
    double cy,
    double dx,
    double dy,
  ) {
    double side(
      double ox,
      double oy,
      double px,
      double py,
      double qx,
      double qy,
    ) => (px - ox) * (qy - oy) - (py - oy) * (qx - ox);
    final d1 = side(cx, cy, dx, dy, ax, ay), d2 = side(cx, cy, dx, dy, bx, by);
    final d3 = side(ax, ay, bx, by, cx, cy), d4 = side(ax, ay, bx, by, dx, dy);
    return d1 * d2 < 0 && d3 * d4 < 0;
  }

  /// The least distance in metres between the feature drawn through
  /// [parts] and this geometry. [shape] is the feature's geometry type:
  /// a `LineString`'s parts are lines, a `Polygon`'s rings.
  double distanceTo(List<List<double>> parts, {required String shape}) {
    final lonLats = [for (final p in parts) ...p];
    if (lonLats.isEmpty) return double.infinity;
    // Metres per degree east and north at the first point's latitude.
    const e2 = _flattening * (2 - _flattening);
    const m = _radius * math.pi / 180;
    final cos = math.cos(lonLats[1] * math.pi / 180);
    final w2 = 1 / (1 - e2 * (1 - cos * cos));
    final kx = m * math.sqrt(w2) * cos;
    final ky = m * math.sqrt(w2) * w2 * (1 - e2);
    final k = kx / ky;
    final mine = shape == 'Point'
        ? [
            for (var i = 0; i < lonLats.length; i += 2)
              [lonLats[i], lonLats[i + 1]],
          ]
        : parts;
    final theirs = [
      for (var p = 0; p < _points.length; p += 2) [_points[p], _points[p + 1]],
      ..._lines,
      for (final rings in _polygons) ...rings,
    ];
    for (var i = 0; i < lonLats.length; i += 2) {
      if (_inside(lonLats[i], lonLats[i + 1])) return 0;
    }
    if (shape == 'Polygon') {
      for (final line in theirs) {
        for (var i = 0; i + 1 < line.length; i += 2) {
          if (parts
              .where((r) => _inRing(line[i], line[i + 1], r))
              .length
              .isOdd) {
            return 0;
          }
        }
      }
    }
    var least = double.infinity;
    for (final a in mine) {
      for (final b in theirs) {
        final d = _apart(a, b, k);
        if (d < least) least = d;
      }
    }
    return least * ky;
  }

  static bool _inRing(double x, double y, List<double> ring) {
    var inside = false;
    for (var i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
      final xi = ring[i], yi = ring[i + 1];
      final xj = ring[j], yj = ring[j + 1];
      if ((yi > y) != (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  /// The least distance between the polylines [a] and [b], in degrees of
  /// latitude, with longitudes scaled by [k].
  static double _apart(List<double> a, List<double> b, double k) {
    if (a.length < 2 || b.length < 2) return double.infinity;
    var least = double.infinity;
    final na = a.length < 4 ? 1 : a.length - 2;
    final nb = b.length < 4 ? 1 : b.length - 2;
    for (var i = 0; i < na; i += 2) {
      final ax = a[i] * k, ay = a[i + 1];
      final bx = a.length < 4 ? ax : a[i + 2] * k;
      final by = a.length < 4 ? ay : a[i + 3];
      for (var j = 0; j < nb; j += 2) {
        final cx = b[j] * k, cy = b[j + 1];
        final dx = b.length < 4 ? cx : b[j + 2] * k;
        final dy = b.length < 4 ? cy : b[j + 3];
        final d = _segments(ax, ay, bx, by, cx, cy, dx, dy);
        if (d < least) least = d;
      }
    }
    return least;
  }

  static double _segments(
    double ax,
    double ay,
    double bx,
    double by,
    double cx,
    double cy,
    double dx,
    double dy,
  ) {
    double cross(
      double ox,
      double oy,
      double px,
      double py,
      double qx,
      double qy,
    ) => (px - ox) * (qy - oy) - (py - oy) * (qx - ox);
    final d1 = cross(cx, cy, dx, dy, ax, ay),
        d2 = cross(cx, cy, dx, dy, bx, by);
    final d3 = cross(ax, ay, bx, by, cx, cy),
        d4 = cross(ax, ay, bx, by, dx, dy);
    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
        ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
      return 0;
    }
    return math.min(
      math.min(
        _toSegment(ax, ay, cx, cy, dx, dy),
        _toSegment(bx, by, cx, cy, dx, dy),
      ),
      math.min(
        _toSegment(cx, cy, ax, ay, bx, by),
        _toSegment(dx, dy, ax, ay, bx, by),
      ),
    );
  }

  static double _toSegment(
    double x,
    double y,
    double ax,
    double ay,
    double bx,
    double by,
  ) {
    final ux = bx - ax, uy = by - ay;
    final length = ux * ux + uy * uy;
    final t = length == 0
        ? 0.0
        : (((x - ax) * ux + (y - ay) * uy) / length).clamp(0.0, 1.0);
    final ex = x - ax - ux * t, ey = y - ay - uy * t;
    return math.sqrt(ex * ex + ey * ey);
  }
}
