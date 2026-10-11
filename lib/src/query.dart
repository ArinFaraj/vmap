import 'expr.dart';
import 'mvt.dart';
import 'style.dart';

/// One map feature found at a point.
class VmapFeature {
  const VmapFeature({
    required this.source,
    required this.sourceLayer,
    required this.layers,
    required this.geometryType,
    required this.properties,
    this.id,
  });

  /// The name of the style source it comes from.
  final String source;
  final String sourceLayer;

  /// The ids of the style layers that draw it, topmost first.
  final List<String> layers;

  /// `Point`, `LineString` or `Polygon`.
  final String geometryType;
  final Map<String, Object?> properties;

  /// The feature's id in its source, or null when it has none. It is what a
  /// [VmapFeatureState] names the feature by.
  final Object? id;

  @override
  String toString() =>
      'VmapFeature($source/$sourceLayer $id $layers $properties)';
}

/// What a cluster of a clustered source holds: a smaller cluster, or one of
/// the points of the data.
class VmapClusterMember {
  const VmapClusterMember({
    required this.latitude,
    required this.longitude,
    required this.properties,
    this.id,
  });

  final double latitude;
  final double longitude;
  final Map<String, Object?> properties;
  final Object? id;

  /// It is a cluster itself, with a `cluster_id` to ask about in turn.
  bool get isCluster => properties['cluster'] == true;

  @override
  String toString() => 'VmapClusterMember($latitude, $longitude $properties)';
}

/// State an app gives one feature, which the style reads with
/// `['feature-state', name]` in a paint property: the way to highlight what
/// was tapped without rebuilding anything.
class VmapFeatureState {
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
  final Map<String, Object?> state;
}

/// The features of [layers] within [radius] tile units of ([px], [py]) that a
/// style layer of [source] draws at [styleZoom]. Each comes with the highest
/// position among the layers drawing it, for ordering across tiles.
List<List<Object?>> queryTile(
  Iterable<TileLayer> layers,
  StyleSheet sheet,
  int source,
  double px,
  double py,
  double radius,
  double styleZoom,
) {
  final context = EvalContext()..zoom = styleZoom;
  final sink = GeometrySink();
  final found = <List<Object?>>[];
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
    final idKey = from.geoJson ? null : from.idKey(layer.name);
    for (final f in layer.features) {
      sink.clear();
      f.readGeometry(sink);
      if (!_hit(f.type, sink, x, y, reach)) continue;
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
          BucketKind.fill => f.type == mvtPolygon,
          BucketKind.circle => f.type == mvtPoint,
          BucketKind.line => f.type != mvtPoint,
        };
        if (!fits || !bucket.filter(context)) continue;
        if (!ids.contains(paint.id)) ids.add(paint.id);
        if (order < 0) order = p;
      }
      if (ids.isEmpty) continue;
      found.add([order, layer.name, context.geometryType, ids, context.props]);
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
