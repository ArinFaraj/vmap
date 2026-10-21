import 'dart:math' as math;

import 'mvt.dart';
import 'tile_id.dart';

/// The zoom down to which a vector source's tiles past its own deepest
/// zoom are cut from that deepest tile rather than drawn from it scaled:
/// MapLibre's default map maxZoom of 22 less its zoomLevelsToOverscale of 4.
const int splitZoom = 18;

/// [layers] of the tile [from], cut to its descendant [to], as MapLibre's
/// sliceVectorTileLayer: scaled into [to]'s units and clipped to it with a
/// buffer of 128 units on a 4096 unit tile.
List<TileLayer> sliceLayers(
  Iterable<TileLayer> layers,
  TileId from,
  TileId to,
) {
  final scale = 1 << (to.z - from.z);
  final out = <TileLayer>[];
  for (final layer in layers) {
    final extent = layer.extent;
    final offsetX = ((to.x - from.x * scale) * extent).toDouble();
    final offsetY = ((to.y - from.y * scale) * extent).toDouble();
    final buffer = math.max(128, (128 * extent / 4096).round()).toDouble();
    final features = <TileFeature>[];
    final sink = GeometrySink();
    for (final feature in layer.features) {
      sink.clear();
      feature.readGeometry(sink);
      var rings = <List<double>>[
        for (var r = 0; r < sink.ringCount; r++)
          [
            for (var i = sink.ringStart(r); i < sink.ringEnd(r); i++) ...[
              sink.coords[i * 2] * scale - offsetX,
              sink.coords[i * 2 + 1] * scale - offsetY,
            ],
          ],
      ];
      final type = feature.type;
      // A ring read from a tile leaves out its closing point, which the
      // clipping expects.
      if (type == mvtPolygon) {
        rings = [
          for (final r in rings)
            if (r.length >= 2) [...r, r[0], r[1]],
        ];
      }
      rings = _clip(rings, type, -buffer, extent + buffer, 0);
      rings = _clip(rings, type, -buffer, extent + buffer, 1);
      if (rings.isEmpty) continue;
      features.add(
        _SlicedFeature(type, feature.allTags(layer), _encoded(rings, type)),
      );
    }
    if (features.isNotEmpty) {
      out.add(_SlicedLayer(layer.name, extent, features));
    }
  }
  return out;
}

/// [rings] as the reader gives them, polygons without their closing point.
/// The points stay as cut: MapLibre lays out the cut tile from them, not
/// from its encoding.
List<List<double>> _encoded(List<List<double>> rings, int type) => [
  for (final ring in rings)
    type == mvtPolygon ? ring.sublist(0, ring.length - 2) : ring,
];

/// [rings] clipped to [start] to [end] along [axis], 0 for x and 1 for y,
/// as MapLibre's clipGeometryOnAxis.
List<List<double>> _clip(
  List<List<double>> rings,
  int type,
  double start,
  double end,
  int axis,
) {
  final out = <List<double>>[];
  if (type == mvtPoint) {
    for (final ring in rings) {
      for (var i = 0; i < ring.length; i += 2) {
        final a = ring[i + axis];
        if (a >= start && a <= end) out.add([ring[i], ring[i + 1]]);
      }
    }
    return out;
  }
  if (type != mvtLine && type != mvtPolygon) return out;
  final polygon = type == mvtPolygon;
  for (final line in rings) {
    final n = line.length ~/ 2;
    if (n == 0) continue;
    var slice = <double>[];
    void cut(int i, int j, double at) {
      final t =
          (at - line[i * 2 + axis]) / (line[j * 2 + axis] - line[i * 2 + axis]);
      final other = 1 - axis;
      final o =
          line[i * 2 + other] + (line[j * 2 + other] - line[i * 2 + other]) * t;
      if (axis == 0) {
        slice.addAll([at, o]);
      } else {
        slice.addAll([o, at]);
      }
    }

    for (var i = 0; i < n - 1; i++) {
      final pos1 = line[i * 2 + axis], pos2 = line[i * 2 + 2 + axis];
      var exited = false;
      if (pos1 < start) {
        if (pos2 > start) cut(i, i + 1, start);
      } else if (pos1 > end) {
        if (pos2 < end) cut(i, i + 1, end);
      } else {
        slice.addAll([line[i * 2], line[i * 2 + 1]]);
      }
      if (pos2 < start && pos1 >= start) {
        cut(i, i + 1, start);
        exited = true;
      }
      if (pos2 > end && pos1 <= end) {
        cut(i, i + 1, end);
        exited = true;
      }
      if (!polygon && exited) {
        out.add(slice);
        slice = [];
      }
    }
    final lastPos = line[(n - 1) * 2 + axis];
    if (lastPos >= start && lastPos <= end) {
      slice.addAll([line[(n - 1) * 2], line[(n - 1) * 2 + 1]]);
    }
    if (polygon &&
        slice.isNotEmpty &&
        (slice[0] != slice[slice.length - 2] ||
            slice[1] != slice[slice.length - 1])) {
      slice.addAll([slice[0], slice[1]]);
    }
    if (slice.isNotEmpty) out.add(slice);
  }
  return out;
}

class _SlicedLayer implements TileLayer {
  _SlicedLayer(this.name, this.extent, this.features);

  @override
  final String name;
  @override
  final int extent;
  @override
  final List<TileFeature> features;
}

class _SlicedFeature implements TileFeature {
  _SlicedFeature(this.type, this._tags, this._rings);

  @override
  final int type;
  final Map<String, Object?> _tags;
  final List<List<double>> _rings;

  @override
  Map<String, Object?> allTags(TileLayer layer) => _tags;

  @override
  void readGeometry(GeometrySink out) {
    if (type == mvtPoint) out.beginRing();
    for (final ring in _rings) {
      if (type != mvtPoint) out.beginRing();
      for (var i = 0; i < ring.length; i += 2) {
        out.addPoint(ring[i], ring[i + 1]);
      }
    }
    out.end();
  }
}
