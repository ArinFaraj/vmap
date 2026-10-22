import 'dart:typed_data';

import 'package:latlong2/latlong.dart';

import '../style/expr.dart';
import '../style/json_equals.dart';
import 'mvt.dart';
import 'protocol.dart' show TileHit;
import '../style/style_model.dart';

/// One map feature found at a point.
class VmapFeature {
  /// A feature as [VmapController.featuresAt] finds it.
  const VmapFeature({
    required this.source,
    required this.sourceLayer,
    required this.layers,
    required this.geometryType,
    required this.properties,
    this.geometry = const [],
    this.id,
  });

  /// The name of the style source it comes from.
  final String source;

  /// The layer of its vector tile, or empty for a GeoJSON source.
  final String sourceLayer;

  /// The ids of the style layers that draw it, topmost first.
  final List<String> layers;

  /// `Point`, `LineString` or `Polygon`.
  final String geometryType;

  /// Its properties, such as `name` and `class`.
  final Map<String, Object?> properties;

  /// Where it is, as lists of places: for a Point one list of its points,
  /// for a LineString its lines, for a Polygon its rings, outer rings
  /// followed by their holes. As MapLibre's query gives it, it is the part
  /// in the tile it was read from, which may stop at the tile's edge a
  /// little past what the screen shows.
  final List<List<LatLng>> geometry;

  /// The feature's id in its source, or null when it has none. It is what a
  /// [VmapFeatureState] names the feature by.
  final Object? id;

  @override
  String toString() =>
      'VmapFeature($source/$sourceLayer $id $layers $properties)';
}

/// How a download of a region for use offline went.
class VmapDownload {
  /// How a region download ended, in tiles.
  const VmapDownload({
    required this.tiles,
    required this.fetched,
    required this.failed,
  });

  /// The tiles the region takes. Those neither [fetched] nor [failed] were
  /// in the cache already or do not exist.
  final int tiles;

  /// The tiles fetched from the network.
  final int fetched;

  /// The tiles that could not be fetched.
  final int failed;
}

/// What a cluster of a clustered source holds: a smaller cluster, or one of
/// the points of the data.
class VmapClusterMember {
  /// A point or cluster inside a cluster.
  const VmapClusterMember({
    required this.point,
    required this.properties,
    this.id,
  });

  /// Where it is: a point of the data, or a cluster's centre.
  final LatLng point;

  /// The point's properties, or a cluster's `cluster_id`, `point_count` and
  /// the properties the source sums up.
  final Map<String, Object?> properties;

  /// The point's id in the data, or null.
  final Object? id;

  /// It is a cluster itself, with a `cluster_id` to ask about in turn.
  bool get isCluster => properties['cluster'] == true;

  @override
  String toString() => 'VmapClusterMember($point $properties)';
}

/// State an app gives one feature, which the style reads with
/// `['feature-state', name]` in a paint property: the way to highlight what
/// was tapped without rebuilding anything.
class VmapFeatureState {
  /// [state] for the feature with [id] in [source].
  const VmapFeatureState({
    required this.source,
    required this.id,
    required this.state,
  });

  /// State for a feature found by a tap.
  VmapFeatureState.of(VmapFeature feature, this.state)
    : source = feature.source,
      id = feature.id;

  /// The name of the style source the feature is in.
  final String source;

  /// The feature's id: the `id` of a GeoJSON feature, or the id the tiles
  /// carry.
  final Object? id;

  /// The values the style reads with `['feature-state', name]`.
  final Map<String, Object?> state;

  @override
  bool operator ==(Object other) =>
      other is VmapFeatureState &&
      other.source == source &&
      other.id == id &&
      jsonEquals(other.state, state);

  @override
  int get hashCode => Object.hash(source, id, state.length);
}

/// The features of [layers] within [radius] tile units of ([px], [py]) that a
/// style layer of [source] draws at [styleZoom]. Each comes with the highest
/// position among the layers drawing it, for ordering across tiles.
///
/// With a [box] of half a width and half a height, it is the features that
/// touch the box of that size around the point instead.
List<TileHit> queryTile(
  Iterable<TileLayer> layers,
  StyleSheet sheet,
  int source,
  double px,
  double py,
  double radius,
  double styleZoom, {
  (double, double)? box,
}) {
  final context = EvalContext()..zoom = styleZoom;
  final sink = GeometrySink();
  final found = <TileHit>[];
  bool shown(double minZoom, double maxZoom) =>
      styleZoom >= minZoom && styleZoom < maxZoom;
  for (final layer in layers) {
    final paints = <int>[
      for (var i = 0; i < sheet.layers.length; i++)
        if (sheet.buckets[sheet.layers[i].bucket].source == source &&
            sheet.buckets[sheet.layers[i].bucket].sourceLayer == layer.name &&
            shown(sheet.layers[i].minZoom, sheet.layers[i].maxZoom))
          i,
    ];
    final symbols = <int>[
      for (var i = 0; i < sheet.symbols.length; i++)
        if (sheet.symbols[i].source == source &&
            sheet.symbols[i].sourceLayer == layer.name &&
            shown(sheet.symbols[i].minZoom, sheet.symbols[i].maxZoom))
          i,
    ];
    if (paints.isEmpty && symbols.isEmpty) continue;
    final scale = 4096 / layer.extent;
    final x = px / scale;
    final y = py / scale;
    final reach = radius / scale;
    final from = sheet.sources[source];
    final idKey = from is GeoJsonSource ? null : from.idKey(layer.name);
    for (final f in layer.features) {
      sink.clear();
      f.readGeometry(sink);
      final hit = switch (box) {
        (final halfWidth, final halfHeight) => _touches(
          f.type,
          sink,
          x - halfWidth / scale,
          y - halfHeight / scale,
          x + halfWidth / scale,
          y + halfHeight / scale,
        ),
        null => _hit(f.type, sink, x, y, reach),
      };
      if (!hit) continue;
      final tags = f.allTags(layer);
      if (idKey != null && tags[idKey] != null) tags[r'$id'] = tags[idKey];
      context
        ..props = tags
        ..geometryType = switch (f.type) {
          mvtPoint => 'Point',
          mvtLine => 'LineString',
          _ => 'Polygon',
        };
      final ids = <String>[];
      var order = -1;
      for (final s in symbols.reversed) {
        if (!sheet.symbols[s].filter(context)) continue;
        ids.add(sheet.symbols[s].id);
        if (order < 0) order = sheet.layers.length + s;
      }
      for (final p in paints.reversed) {
        final paint = sheet.layers[p];
        final bucket = sheet.buckets[paint.bucket];
        final fits = switch (bucket.kind) {
          BucketKind.fill || BucketKind.extrusion => f.type == mvtPolygon,
          BucketKind.circle => f.type == mvtPoint,
          BucketKind.line => f.type != mvtPoint,
        };
        if (!fits || !bucket.filter(context)) continue;
        if (!ids.contains(paint.id)) ids.add(paint.id);
        if (order < 0) order = p;
      }
      if (ids.isEmpty) continue;
      found.add(
        TileHit(
          order: order,
          sourceLayer: layer.name,
          geometryType: context.geometryType,
          layers: ids,
          properties: context.props,
          rings: [
            for (var r = 0; r < sink.ringCount; r++)
              Float64List.fromList([
                for (
                  var i = sink.ringStart(r) * 2;
                  i < sink.ringEnd(r) * 2;
                  i++
                )
                  sink.coords[i] * scale,
              ]),
          ],
        ),
      );
    }
  }
  return found;
}

bool _hit(int type, GeometrySink sink, double x, double y, double reach) {
  final c = sink.coords;
  if (type == mvtPoint) {
    for (var i = 0; i < sink.coordCount; i += 2) {
      final dx = c[i] - x, dy = c[i + 1] - y;
      if (dx * dx + dy * dy <= reach * reach) return true;
    }
    return false;
  }
  var inside = false;
  for (var r = 0; r < sink.ringCount; r++) {
    final start = sink.ringStart(r);
    final end = sink.ringEnd(r);
    if (end - start < 2) continue;
    final closed = type == mvtPolygon;
    var ax = c[closed ? end * 2 - 2 : start * 2];
    var ay = c[closed ? end * 2 - 1 : start * 2 + 1];
    for (var i = closed ? start : start + 1; i < end; i++) {
      final bx = c[i * 2], by = c[i * 2 + 1];
      if (closed) {
        if ((ay > y) != (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) {
          inside = !inside;
        }
      } else {
        final dx = bx - ax, dy = by - ay;
        final length = dx * dx + dy * dy;
        var t = length == 0 ? 0.0 : ((x - ax) * dx + (y - ay) * dy) / length;
        t = t.clamp(0.0, 1.0);
        final qx = ax + dx * t - x, qy = ay + dy * t - y;
        if (qx * qx + qy * qy <= reach * reach) return true;
      }
      ax = bx;
      ay = by;
    }
  }
  return inside;
}

/// Whether a feature touches the box from ([l], [t]) to ([r], [b]): a point
/// inside it, a line through it, or an area over any part of it.
bool _touches(
  int type,
  GeometrySink sink,
  double l,
  double t,
  double r,
  double b,
) {
  final c = sink.coords;
  bool within(double x, double y) => x >= l && x <= r && y >= t && y <= b;
  if (type == mvtPoint) {
    for (var i = 0; i < sink.coordCount; i += 2) {
      if (within(c[i], c[i + 1])) return true;
    }
    return false;
  }
  // A side of the shape crosses a side of the box when each has its ends on
  // opposite sides of the other.
  bool crosses(
    double ax,
    double ay,
    double bx,
    double by,
    double px,
    double py,
    double qx,
    double qy,
  ) {
    double side(
      double ox,
      double oy,
      double ux,
      double uy,
      double x,
      double y,
    ) => (ux - ox) * (y - oy) - (uy - oy) * (x - ox);
    final d1 = side(px, py, qx, qy, ax, ay), d2 = side(px, py, qx, qy, bx, by);
    final d3 = side(ax, ay, bx, by, px, py), d4 = side(ax, ay, bx, by, qx, qy);
    return (d1 > 0) != (d2 > 0) && (d3 > 0) != (d4 > 0);
  }

  final closed = type == mvtPolygon;
  var cornerInside = false;
  for (var ring = 0; ring < sink.ringCount; ring++) {
    final start = sink.ringStart(ring);
    final end = sink.ringEnd(ring);
    if (end - start < 2) continue;
    var ax = c[closed ? end * 2 - 2 : start * 2];
    var ay = c[closed ? end * 2 - 1 : start * 2 + 1];
    for (var i = closed ? start : start + 1; i < end; i++) {
      final bx = c[i * 2], by = c[i * 2 + 1];
      if (within(ax, ay) ||
          within(bx, by) ||
          crosses(ax, ay, bx, by, l, t, r, t) ||
          crosses(ax, ay, bx, by, r, t, r, b) ||
          crosses(ax, ay, bx, by, r, b, l, b) ||
          crosses(ax, ay, bx, by, l, b, l, t)) {
        return true;
      }
      if (closed &&
          (ay > t) != (by > t) &&
          l < (bx - ax) * (t - ay) / (by - ay) + ax) {
        cornerInside = !cornerInside;
      }
      ax = bx;
      ay = by;
    }
  }
  return cornerInside;
}
