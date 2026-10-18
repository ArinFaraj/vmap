import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/geojson.dart';
import 'package:vmap/src/mvt.dart';
import 'package:vmap/src/style_model.dart';
import 'package:vmap/src/tessellate.dart';
import 'package:vmap/src/tile_builder.dart' show tileExtent;

void main() {
  test('each piece of a cut line knows its share of the whole line', () {
    final tiles = GeoJsonTiles({
      'type': 'Feature',
      'properties': <String, Object?>{},
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [-90, 0],
          [90, 0],
        ],
      },
    });
    // At zoom 1 the line runs from the middle of the left tile to the
    // middle of the right one. A tile keeps a quarter tile of a line past
    // its edge, so the right piece starts a quarter of the way along.
    final left = tiles.tile(1, 0, 1).single.features.single as MeasuredFeature;
    final right = tiles.tile(1, 1, 1).single.features.single as MeasuredFeature;
    expect(left.lineMetrics![0], 0);
    expect(right.lineMetrics![0], closeTo(0.25, 0.01));
    expect(left.lineMetrics![1], closeTo(1 / tileExtent, 1e-9));
    expect(right.lineMetrics![1], left.lineMetrics![1]);
  });

  test('a mesh built by share runs from nought to the picture width', () {
    final mesher = LineMesher(distances: true)
      ..addLine(
        Float64List.fromList([0, 0, 100, 0, 200, 0]),
        0,
        3,
        0,
        cap: LineCap.butt,
        shareBefore: 0.25,
        sharePer: 0.5 / 200,
      );
    final along = [
      for (final chunk in mesher.finish())
        for (var i = 0; i < chunk.distances!.length; i += 2)
          chunk.distances![i],
    ];
    expect(along.reduce((a, b) => a < b ? a : b), 0.25 * LineMesher.shareSpan);
    expect(along.reduce((a, b) => a > b ? a : b), 0.75 * LineMesher.shareSpan);
  });

  test('the style reads line-gradient into a mesh of its own', () {
    StyleSheet sheet(Map<String, Object?> paint) => StyleSheet.compile({
      'version': 8,
      'sources': {
        'mine': {
          'type': 'geojson',
          'data': {'type': 'FeatureCollection', 'features': <Object>[]},
        },
      },
      'layers': [
        {'id': 'route', 'type': 'line', 'source': 'mine', 'paint': paint},
      ],
    });
    final plain = sheet({'line-color': '#f00'});
    expect((plain.layers.single as LineLayer).gradient, isNull);
    expect(plain.buckets.single.metered, isFalse);

    final ramp = sheet({
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0,
        '#000',
        1,
        '#fff',
      ],
    });
    expect((ramp.layers.single as LineLayer).gradient, isNotNull);
    expect(ramp.buckets.single.metered, isTrue);
    expect(ramp.buckets.single.dashed, isTrue);
  });
}
