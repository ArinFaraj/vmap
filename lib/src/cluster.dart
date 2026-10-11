import 'dart:convert';
import 'dart:typed_data';

import 'expr.dart';

/// How a GeoJSON source gathers its points into clusters, as its `cluster`
/// options say.
class ClusterOptions {
  const ClusterOptions({
    this.radius = 50,
    this.maxZoom = 17,
    this.minPoints = 2,
    this.properties = const {},
  });

  /// How close points are gathered, in pixels of a 512 pixel tile.
  final double radius;

  /// The deepest zoom that still clusters. Beyond it every point is drawn.
  final int maxZoom;

  /// The fewest points that make a cluster.
  final int minPoints;

  /// `clusterProperties`: for each name, how a cluster works its value out
  /// from its points, as the style wrote it.
  final Map<String, Object?> properties;

  String get signature =>
      '$radius|$maxZoom|$minPoints|${jsonEncode(properties)}';
}

/// One of a clustered source's `clusterProperties`: [map] reads a point's
/// value and [reduce] adds a value to what the cluster has so far.
class _Tally {
  _Tally(this.name, Object? json) {
    final parts = json is List ? json : const <Object?>[];
    final first = parts.isEmpty ? null : parts.first;
    map = compileExpr(parts.length > 1 ? parts[1] : null);
    reduce = compileExpr(
      first is String
          ? [
              first,
              ['accumulated'],
              ['get', name],
            ]
          : first,
    );
  }

  final String name;
  late final Expr map;
  late final Expr reduce;
}

/// A point of a clustered source at one zoom: a cluster, or a point of the
/// data left on its own.
class ClusterPoint {
  ClusterPoint(this.x, this.y, this.count, this.props);

  /// As fractions of the world.
  final double x;
  final double y;

  /// How many points of the data it stands for.
  final int count;
  final Map<String, Object?> props;

  /// What a cluster was gathered from, one zoom deeper than [zoom].
  List<ClusterPoint>? children;

  /// The deepest zoom a cluster is still one point at.
  int zoom = 0;
}

/// Points gathered into clusters for every zoom, each zoom built from the
/// one below it the way supercluster does.
class PointClusters {
  PointClusters(List<ClusterPoint> points, this.options)
    : _tallies = [
        for (final e in options.properties.entries) _Tally(e.key, e.value),
      ] {
    _levels = List.filled(options.maxZoom + 2, const []);
    _levels[options.maxZoom + 1] = points;
    for (var z = options.maxZoom; z >= 0; z--) {
      _levels[z] = _gather(_levels[z + 1], z);
    }
  }

  final ClusterOptions options;
  late final List<List<ClusterPoint>> _levels;
  final List<_Tally> _tallies;
  final EvalContext _context = EvalContext();
  int _nextId = 1;
  final Map<int, ClusterPoint> _byId = {};

  /// The zoom at which cluster [id] comes apart, or null when there is no
  /// such cluster.
  int? expansionZoom(int id) {
    final cluster = _byId[id];
    return cluster == null ? null : cluster.zoom + 1;
  }

  /// What cluster [id] comes apart into, one zoom deeper.
  List<ClusterPoint> children(int id) => _byId[id]?.children ?? const [];

  /// The points of the data in cluster [id], [limit] of them from [offset].
  List<ClusterPoint> leaves(int id, {int limit = 10, int offset = 0}) {
    final out = <ClusterPoint>[];
    var skipped = 0;
    void walk(ClusterPoint point) {
      if (out.length >= limit) return;
      final below = point.children;
      if (below != null) {
        below.forEach(walk);
      } else if (skipped++ >= offset) {
        out.add(point);
      }
    }

    children(id).forEach(walk);
    return out;
  }

  Object? _valueOf(ClusterPoint p, _Tally tally) {
    if (p.props['cluster'] == true) return p.props[tally.name];
    _context.props = p.props;
    return tally.map(_context);
  }

  Map<String, Object?> _tally(ClusterPoint first, List<ClusterPoint> rest) {
    final out = <String, Object?>{};
    for (final tally in _tallies) {
      var total = _valueOf(first, tally);
      for (final p in rest) {
        final value = _valueOf(p, tally);
        _context
          ..accumulated = total
          ..props = {tally.name: value};
        total = tally.reduce(_context);
      }
      out[tally.name] = total;
    }
    return out;
  }

  /// What a tile at zoom [z] shows.
  List<ClusterPoint> at(int z) => _levels[z.clamp(0, options.maxZoom + 1)];

  List<ClusterPoint> _gather(List<ClusterPoint> from, int z) {
    final reach = options.radius / (512 * (1 << z));
    final cells = <int, List<int>>{};
    int cell(double x, double y) =>
        (x / reach).floor() * 0x4000000 + (y / reach).floor();
    for (var i = 0; i < from.length; i++) {
      (cells[cell(from[i].x, from[i].y)] ??= []).add(i);
    }
    final taken = Uint8List(from.length);
    final out = <ClusterPoint>[];
    final near = <int>[];
    for (var i = 0; i < from.length; i++) {
      if (taken[i] != 0) continue;
      final p = from[i];
      near.clear();
      var count = p.count;
      for (var cy = -1; cy <= 1; cy++) {
        for (var cx = -1; cx <= 1; cx++) {
          final found = cells[cell(p.x + cx * reach, p.y + cy * reach)];
          if (found == null) continue;
          for (final j in found) {
            if (j == i || taken[j] != 0) continue;
            final dx = from[j].x - p.x, dy = from[j].y - p.y;
            if (dx * dx + dy * dy > reach * reach) continue;
            near.add(j);
            count += from[j].count;
          }
        }
      }
      taken[i] = 1;
      if (near.isEmpty || count < options.minPoints) {
        out.add(p);
        continue;
      }
      var x = p.x * p.count, y = p.y * p.count;
      for (final j in near) {
        taken[j] = 1;
        x += from[j].x * from[j].count;
        y += from[j].y * from[j].count;
      }
      final id = _nextId++;
      out.add(
        _byId[id] =
            ClusterPoint(x / count, y / count, count, {
                ...?(_tallies.isEmpty
                    ? null
                    : _tally(p, [for (final j in near) from[j]])),
                r'$id': id,
                'cluster': true,
                'cluster_id': id,
                'point_count': count,
                'point_count_abbreviated': count >= 10000
                    ? '${(count / 1000).round()}k'
                    : count >= 1000
                    ? '${(count / 100).round() / 10}k'
                    : count,
              })
              ..children = [p, for (final j in near) from[j]]
              ..zoom = z,
      );
    }
    return out;
  }
}
