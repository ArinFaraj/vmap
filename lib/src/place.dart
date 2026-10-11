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

  static const double _metresPerDegree = 111319.49079327357;

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

  /// Whether every one of [lonLats] is inside one of the polygons.
  bool holds(List<double> lonLats) {
    if (lonLats.isEmpty || _polygons.isEmpty) return false;
    for (var i = 0; i < lonLats.length; i += 2) {
      if (!_inside(lonLats[i], lonLats[i + 1])) return false;
    }
    return true;
  }

  bool _inside(double x, double y) {
    for (final rings in _polygons) {
      var inside = false;
      for (final ring in rings) {
        for (var i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
          final xi = ring[i], yi = ring[i + 1];
          final xj = ring[j], yj = ring[j + 1];
          if ((yi > y) != (yj > y) &&
              x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
            inside = !inside;
          }
        }
      }
      if (inside) return true;
    }
    return false;
  }

  /// The least distance in metres between the feature drawn through
  /// [lonLats] and this geometry. [joined] says the points are a line or a
  /// ring, not points of their own.
  double distanceTo(List<double> lonLats, {required bool joined}) {
    if (lonLats.isEmpty) return double.infinity;
    final k = math.cos(lonLats[1] * math.pi / 180);
    var least = double.infinity;
    void weigh(double d) {
      if (d < least) least = d;
    }

    for (var i = 0; i < lonLats.length; i += 2) {
      final x = lonLats[i], y = lonLats[i + 1];
      if (_inside(x, y)) return 0;
      for (var p = 0; p < _points.length; p += 2) {
        weigh(_between(x, y, _points[p], _points[p + 1], k));
      }
      for (final line in _lines) {
        weigh(_toLine(x, y, line, k));
      }
      for (final rings in _polygons) {
        for (final ring in rings) {
          weigh(_toLine(x, y, ring, k));
        }
      }
    }
    if (joined) {
      void corners(List<double> of) {
        for (var p = 0; p < of.length; p += 2) {
          weigh(_toLine(of[p], of[p + 1], lonLats, k));
        }
      }

      corners(_points);
      _lines.forEach(corners);
      for (final rings in _polygons) {
        rings.forEach(corners);
      }
    }
    return least * _metresPerDegree;
  }

  static double _between(double x, double y, double ax, double ay, double k) {
    final dx = (x - ax) * k;
    final dy = y - ay;
    return math.sqrt(dx * dx + dy * dy);
  }

  static double _toLine(double x, double y, List<double> line, double k) {
    if (line.length < 4) {
      return line.length < 2
          ? double.infinity
          : _between(x, y, line[0], line[1], k);
    }
    var least = double.infinity;
    for (var i = 0; i + 3 < line.length; i += 2) {
      final ax = line[i], ay = line[i + 1];
      final bx = (line[i + 2] - ax) * k, by = line[i + 3] - ay;
      final px = (x - ax) * k, py = y - ay;
      final length = bx * bx + by * by;
      final t = length == 0
          ? 0.0
          : ((px * bx + py * by) / length).clamp(0.0, 1.0);
      final dx = px - bx * t, dy = py - by * t;
      final d = math.sqrt(dx * dx + dy * dy);
      if (d < least) least = d;
    }
    return least;
  }
}
