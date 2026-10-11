import 'dart:math' as math;
import 'dart:typed_data';

import 'mvt.dart';
import 'tile_builder.dart' show tileExtent;

/// GeoJSON cut into tiles on demand, in the shape vector tiles arrive in.
class GeoJsonTiles {
  GeoJsonTiles(Object? data) {
    _read(data);
  }

  final List<_Feature> _features = [];

  /// Kept around a tile so lines and outlines do not end at its edge.
  static const double _buffer = 128;

  int get featureCount => _features.length;

  void _read(Object? json) {
    if (json is! Map) return;
    switch (json['type']) {
      case 'FeatureCollection':
        final features = json['features'];
        if (features is List) features.forEach(_read);
      case 'Feature':
        final properties = json['properties'];
        final props = <String, Object?>{
          if (properties is Map)
            for (final e in properties.entries) '${e.key}': e.value,
        };
        final id = json['id'];
        if (id != null) props.putIfAbsent(r'$id', () => id);
        _geometry(json['geometry'], props);
      default:
        _geometry(json, const {});
    }
  }

  void _geometry(Object? json, Map<String, Object?> props) {
    if (json is! Map) return;
    final c = json['coordinates'];
    switch (json['type']) {
      case 'Point':
        _add(mvtPoint, props, [
          _ring([c]),
        ]);
      case 'MultiPoint':
        if (c is List) _add(mvtPoint, props, [_ring(c)]);
      case 'LineString':
        if (c is List) _add(mvtLine, props, [_ring(c)]);
      case 'MultiLineString':
        if (c is List) {
          _add(mvtLine, props, [
            for (final l in c)
              if (l is List) _ring(l),
          ]);
        }
      case 'Polygon':
        if (c is List) _add(mvtPolygon, props, _polygon(c));
      case 'MultiPolygon':
        if (c is List) {
          _add(mvtPolygon, props, [
            for (final p in c)
              if (p is List) ..._polygon(p),
          ]);
        }
      case 'GeometryCollection':
        final parts = json['geometries'];
        if (parts is List) {
          for (final g in parts) {
            _geometry(g, props);
          }
        }
    }
  }

  /// The rings of one polygon wound the way vector tiles wind them: the
  /// outer ring one way, its holes the other.
  List<Float64List> _polygon(List<Object?> rings) {
    final out = <Float64List>[];
    for (var i = 0; i < rings.length; i++) {
      final raw = rings[i];
      if (raw is! List) continue;
      final ring = _ring(raw);
      if (ring.length < 6) continue;
      final outer = i == 0;
      if ((_area(ring) > 0) != outer) {
        for (var a = 0, b = ring.length - 2; a < b; a += 2, b -= 2) {
          final x = ring[a], y = ring[a + 1];
          ring[a] = ring[b];
          ring[a + 1] = ring[b + 1];
          ring[b] = x;
          ring[b + 1] = y;
        }
      }
      out.add(ring);
    }
    return out;
  }

  static double _area(Float64List ring) {
    var area = 0.0;
    var px = ring[ring.length - 2];
    var py = ring[ring.length - 1];
    for (var i = 0; i < ring.length; i += 2) {
      area += px * ring[i + 1] - ring[i] * py;
      px = ring[i];
      py = ring[i + 1];
    }
    return area;
  }

  /// Positions as fractions of the world, x then y.
  static Float64List _ring(List<Object?> positions) {
    final out = Float64List(positions.length * 2);
    var n = 0;
    for (final p in positions) {
      if (p is! List || p.length < 2) continue;
      final lon = (p[0] as num).toDouble();
      final lat = (p[1] as num).toDouble().clamp(-85.0511, 85.0511);
      final rad = lat * math.pi / 180;
      out[n++] = (lon + 180) / 360;
      out[n++] =
          (1 - math.log(math.tan(rad) + 1 / math.cos(rad)) / math.pi) / 2;
    }
    return n == out.length ? out : Float64List.sublistView(out, 0, n);
  }

  void _add(int type, Map<String, Object?> props, List<Float64List> rings) {
    var minX = double.infinity, minY = double.infinity;
    var maxX = -double.infinity, maxY = -double.infinity;
    for (final r in rings) {
      for (var i = 0; i < r.length; i += 2) {
        if (r[i] < minX) minX = r[i];
        if (r[i] > maxX) maxX = r[i];
        if (r[i + 1] < minY) minY = r[i + 1];
        if (r[i + 1] > maxY) maxY = r[i + 1];
      }
    }
    if (minX > maxX) return;
    _features.add(_Feature(type, props, rings, minX, minY, maxX, maxY));
  }

  /// The features that touch tile [z]/[x]/[y], clipped to it, as one layer
  /// with an empty name.
  List<TileLayer> tile(int z, int x, int y) {
    final n = (1 << z).toDouble();
    final pad = _buffer / tileExtent / n;
    final left = x / n, top = y / n;
    final right = (x + 1) / n, bottom = (y + 1) / n;
    final out = <TileFeature>[];
    for (final f in _features) {
      if (f.maxX < left - pad ||
          f.minX > right + pad ||
          f.maxY < top - pad ||
          f.minY > bottom + pad) {
        continue;
      }
      final rings = <Float64List>[];
      for (final ring in f.rings) {
        final local = Float64List(ring.length);
        for (var i = 0; i < ring.length; i += 2) {
          local[i] = (ring[i] * n - x) * tileExtent;
          local[i + 1] = (ring[i + 1] * n - y) * tileExtent;
        }
        switch (f.type) {
          case mvtPoint:
            rings.add(local);
          case mvtLine:
            _clipLine(local, rings);
          default:
            final clipped = _clipRing(local);
            if (clipped.length >= 6) rings.add(clipped);
        }
      }
      if (rings.isNotEmpty) out.add(_Clipped(f.type, f.props, rings));
    }
    return out.isEmpty ? const [] : [_Layer(out)];
  }

  static const double _lo = -_buffer;
  static const double _hi = tileExtent + _buffer;

  /// Cuts a line at the padded tile edge into the pieces inside it.
  static void _clipLine(Float64List line, List<Float64List> into) {
    var piece = <double>[];
    void flush() {
      if (piece.length >= 4) into.add(Float64List.fromList(piece));
      piece = <double>[];
    }

    for (var i = 2; i < line.length; i += 2) {
      final x0 = line[i - 2], y0 = line[i - 1];
      final dx = line[i] - x0, dy = line[i + 1] - y0;
      var t0 = 0.0, t1 = 1.0;
      var inside = true;
      void edge(double p, double q) {
        if (!inside) return;
        if (p == 0) {
          if (q < 0) inside = false;
          return;
        }
        final r = q / p;
        if (p < 0) {
          if (r > t1) {
            inside = false;
          } else if (r > t0) {
            t0 = r;
          }
        } else {
          if (r < t0) {
            inside = false;
          } else if (r < t1) {
            t1 = r;
          }
        }
      }

      edge(-dx, x0 - _lo);
      edge(dx, _hi - x0);
      edge(-dy, y0 - _lo);
      edge(dy, _hi - y0);
      if (!inside) {
        flush();
        continue;
      }
      if (t0 > 0 || piece.isEmpty) {
        flush();
        piece
          ..add(x0 + dx * t0)
          ..add(y0 + dy * t0);
      }
      piece
        ..add(x0 + dx * t1)
        ..add(y0 + dy * t1);
      if (t1 < 1) flush();
    }
    flush();
  }

  /// Cuts a polygon ring to the padded tile, keeping its winding.
  static Float64List _clipRing(Float64List ring) {
    var points = ring;
    for (var side = 0; side < 4; side++) {
      final out = <double>[];
      bool keep(double x, double y) => switch (side) {
        0 => x >= _lo,
        1 => x <= _hi,
        2 => y >= _lo,
        _ => y <= _hi,
      };
      final n = points.length;
      if (n < 6) return Float64List(0);
      var px = points[n - 2], py = points[n - 1];
      var pin = keep(px, py);
      for (var i = 0; i < n; i += 2) {
        final x = points[i], y = points[i + 1];
        final cin = keep(x, y);
        if (cin != pin) {
          final t = switch (side) {
            0 => (_lo - px) / (x - px),
            1 => (_hi - px) / (x - px),
            2 => (_lo - py) / (y - py),
            _ => (_hi - py) / (y - py),
          };
          out
            ..add(px + (x - px) * t)
            ..add(py + (y - py) * t);
        }
        if (cin) {
          out
            ..add(x)
            ..add(y);
        }
        px = x;
        py = y;
        pin = cin;
      }
      points = Float64List.fromList(out);
    }
    return points;
  }
}

class _Feature {
  _Feature(
    this.type,
    this.props,
    this.rings,
    this.minX,
    this.minY,
    this.maxX,
    this.maxY,
  );

  final int type;
  final Map<String, Object?> props;
  final List<Float64List> rings;
  final double minX;
  final double minY;
  final double maxX;
  final double maxY;
}

class _Layer implements TileLayer {
  _Layer(this.features);

  @override
  String get name => '';

  @override
  int get extent => tileExtent.toInt();

  @override
  final List<TileFeature> features;
}

class _Clipped implements TileFeature {
  _Clipped(this.type, this._props, this._rings);

  @override
  final int type;
  final Map<String, Object?> _props;
  final List<Float64List> _rings;

  @override
  Map<String, Object?> allTags(TileLayer layer) => _props;

  @override
  void readGeometry(GeometrySink out) {
    for (final ring in _rings) {
      out.beginRing();
      for (var i = 0; i < ring.length; i += 2) {
        out.addPoint(ring[i], ring[i + 1]);
      }
    }
    out.end();
  }
}
