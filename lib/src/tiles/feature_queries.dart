import 'dart:math' as math;

import 'package:latlong2/latlong.dart' show LatLng;

import '../camera/camera.dart';
import '../camera/mercator.dart';
import '../style/style_model.dart';
import 'protocol.dart';
import 'query.dart';
import 'built_tile.dart';
import 'tile_id.dart';
import 'tiles.dart';
import 'worker.dart';

/// What the map shows at a point or in an area, and what its clusters hold,
/// read from the tiles of the engine's sources off the UI thread.
class FeatureQueries {
  FeatureQueries(this._sources, this._frame, this._sheet);

  final List<TileSource> Function() _sources;

  /// The frame last drawn, whose zoom picks the tiles read.
  final MapFrame? Function() _frame;
  final StyleSheet? Function() _sheet;

  /// What the map shows at [point]: the features the style draws within
  /// [radius] logical pixels of it, topmost first. It reads the tiles again
  /// off the UI thread, so it answers a moment later.
  Future<List<VmapFeature>> featuresAt(
    LatLng point, {
    double radius = 6,
  }) async {
    final camera = _frame();
    final sheet = _sheet();
    if (camera == null || sheet == null) return const [];
    final wx = worldX(point.longitude);
    final wy = worldY(point.latitude);
    final styleZoom = camera.zoom - 1 + sheet.zoomOffset;
    final found = <(int, VmapFeature)>[];
    await Future.wait([
      for (final s in List.of(_sources()))
        () async {
          final z = tileZoomAt(camera.zoom, s.pool.maxZoom);
          final n = 1 << z;
          final x = (wx * n).floor().clamp(0, n - 1);
          final y = (wy * n).floor().clamp(0, n - 1);
          final unit = tileExtent / (256.0 * math.pow(2, camera.zoom - z));
          final hits = await s.pool.query(
            TileId(z, x, y),
            (wx * n - x) * tileExtent,
            (wy * n - y) * tileExtent,
            radius * unit,
            styleZoom,
          );
          for (final hit in hits) {
            found.add(_feature(s.def.name, TileId(z, x, y), hit));
          }
        }(),
    ]);
    found.sort((a, b) => b.$1 - a.$1);
    return [for (final f in found) f.$2];
  }

  static (int, VmapFeature) _feature(String source, TileId tile, TileHit hit) {
    final n = 1 << tile.z;
    return (
      hit.order,
      VmapFeature(
        source: source,
        sourceLayer: hit.sourceLayer,
        geometryType: hit.geometryType,
        layers: hit.layers,
        geometry: [
          for (final ring in hit.rings)
            [
              for (var i = 0; i + 1 < ring.length; i += 2)
                LatLng(
                  latitudeAt((tile.y + ring[i + 1] / 4096) / n),
                  longitudeAt((tile.x + ring[i] / 4096) / n),
                ),
            ],
        ],
        id: hit.properties[r'$id'],
        properties: {
          for (final e in hit.properties.entries)
            if (e.key != r'$id') e.key: e.value,
        },
      ),
    );
  }

  /// What the map shows between [southWest] and [northEast]: the features
  /// the style draws that touch the box, topmost first. It reads the tiles
  /// again off the UI thread, so it answers a moment later.
  ///
  /// A feature with an id comes once. One without, lying over the edge of a
  /// tile, comes once for each tile it is in. A
  /// box much larger than the screen is read from shallower tiles, which
  /// carry less.
  Future<List<VmapFeature>> featuresIn(
    LatLng southWest,
    LatLng northEast,
  ) async {
    final camera = _frame();
    final sheet = _sheet();
    if (camera == null || sheet == null) return const [];
    final west = worldX(southWest.longitude);
    final east = worldX(northEast.longitude);
    final north = worldY(northEast.latitude);
    final south = worldY(southWest.latitude);
    if (east < west || south < north) return const [];
    final styleZoom = camera.zoom - 1 + sheet.zoomOffset;
    final found = <String, (int, VmapFeature)>{};
    await Future.wait([
      for (final s in List.of(_sources()))
        () async {
          TileRange at(int z) =>
              TileRange(z, west, north, east, south, tileSpan: 1 / (1 << z));
          var range = at(tileZoomAt(camera.zoom, s.pool.maxZoom));
          while (range.z > 0 && range.count > _maxQueryTiles) {
            range = at(range.z - 1);
          }
          final TileRange(:z, :n, :x0, :x1, :y0, :y1) = range;
          final asked = <Future<void>>[];
          for (var y = y0; y <= y1; y++) {
            for (var x = x0; x <= x1; x++) {
              if (x < 0 || x >= n) continue;
              asked.add(() async {
                final hits = await s.pool.query(
                  TileId(z, x, y),
                  ((west + east) / 2 * n - x) * tileExtent,
                  ((north + south) / 2 * n - y) * tileExtent,
                  0,
                  styleZoom,
                  box: (
                    (east - west) / 2 * n * tileExtent,
                    (south - north) / 2 * n * tileExtent,
                  ),
                );
                for (final hit in hits) {
                  final (order, feature) = _feature(
                    s.def.name,
                    TileId(z, x, y),
                    hit,
                  );
                  // A feature lying over a tile edge is in both tiles, and
                  // only an id tells its two halves from two features.
                  final key = feature.id == null
                      ? '${found.length}'
                      : '${feature.source}|${feature.sourceLayer}|${feature.id}';
                  final before = found[key];
                  if (before == null || before.$1 < order) {
                    found[key] = (order, feature);
                  }
                }
              }());
            }
          }
          await Future.wait(asked);
        }(),
    ]);
    final sorted = found.values.toList()..sort((a, b) => b.$1 - a.$1);
    return [for (final f in sorted) f.$2];
  }

  static const int _maxQueryTiles = 16;

  TilePool? _clustered(String source) {
    for (final s in _sources()) {
      if (s.def case GeoJsonSource(:final name, cluster: _?)
          when name == source) {
        return s.pool;
      }
    }
    return null;
  }

  /// The zoom at which cluster [clusterId] of the clustered GeoJSON source
  /// named [source] comes apart, for zooming in on a tapped cluster. Null
  /// when there is no such cluster.
  Future<double?> clusterExpansionZoom(String source, int clusterId) async {
    final zoom = await _clustered(source)?.clusterZoom(clusterId);
    return zoom?.toDouble();
  }

  /// What cluster [clusterId] comes apart into at its expansion zoom.
  Future<List<VmapClusterMember>> clusterChildren(
    String source,
    int clusterId,
  ) async => _members(
    await _clustered(source)
        ?.clusterMembers(ClusterQuestion.children, clusterId),
  );

  /// The points of the data inside cluster [clusterId], [limit] of them
  /// starting at [offset].
  Future<List<VmapClusterMember>> clusterLeaves(
    String source,
    int clusterId, {
    int limit = 10,
    int offset = 0,
  }) async => _members(
    await _clustered(source)?.clusterMembers(
      ClusterQuestion.leaves,
      clusterId,
      limit: limit,
      offset: offset,
    ),
  );

  static List<VmapClusterMember> _members(List<ClusterMember>? found) => [
    for (final member in found ?? const <ClusterMember>[])
      VmapClusterMember(
        point: LatLng(latitudeAt(member.y), longitudeAt(member.x)),
        id: member.properties[r'$id'],
        properties: {
          for (final e in member.properties.entries)
            if (e.key != r'$id') e.key: e.value,
        },
      ),
  ];
}
