import 'dart:typed_data';

/// How a GeoJSON source gathers its points into clusters, as its `cluster`
/// options say.
class ClusterOptions {
  const ClusterOptions({
    this.radius = 50,
    this.maxZoom = 17,
    this.minPoints = 2,
  });

  /// How close points are gathered, in pixels of a 512 pixel tile.
  final double radius;

  /// The deepest zoom that still clusters. Beyond it every point is drawn.
  final int maxZoom;

  /// The fewest points that make a cluster.
  final int minPoints;

  String get signature => '$radius|$maxZoom|$minPoints';
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
}

/// Points gathered into clusters for every zoom, each zoom built from the
/// one below it the way supercluster does.
class PointClusters {
  PointClusters(List<ClusterPoint> points, this.options) {
    _levels = List.filled(options.maxZoom + 2, const []);
    _levels[options.maxZoom + 1] = points;
    for (var z = options.maxZoom; z >= 0; z--) {
      _levels[z] = _gather(_levels[z + 1], z);
    }
  }

  final ClusterOptions options;
  late final List<List<ClusterPoint>> _levels;
  int _nextId = 1;

  /// What a tile at zoom [z] shows.
  List<ClusterPoint> at(int z) => _levels[z.clamp(0, options.maxZoom + 1)];

  List<ClusterPoint> _gather(List<ClusterPoint> from, int z) {
    final reach = options.radius / (512 * (1 << z));
    final cells = <int, List<int>>{};
    int cell(double x, double y) =>
        ((x / reach).floor() << 26) | ((y / reach).floor() & 0x3ffffff);
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
        ClusterPoint(x / count, y / count, count, {
          r'$id': id,
          'cluster': true,
          'cluster_id': id,
          'point_count': count,
          'point_count_abbreviated': count >= 10000
              ? '${(count / 1000).round()}k'
              : count >= 1000
              ? '${(count / 100).round() / 10}k'
              : count,
        }),
      );
    }
    return out;
  }
}
