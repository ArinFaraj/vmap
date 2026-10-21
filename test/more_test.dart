import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style/expr.dart';
import 'package:vmap/src/style/raster_style.dart';
import 'package:vmap/src/style/style.dart';
import 'package:vmap/src/style/style_model.dart';

import 'support/mvt_fixture.dart';

Object? eval(Object? json, [Map<String, Object?> props = const {}]) =>
    compileExpr(json)(EvalContext()..props = props);

void main() {
  test('let binds a value that var reads', () {
    expect(
      eval(
        [
          'let',
          'a',
          ['get', 'n'],
          [
            '+',
            ['var', 'a'],
            ['var', 'a'],
          ],
        ],
        {'n': 4},
      ),
      8,
    );
  });

  test('slice and index-of work on strings and lists', () {
    expect(eval(['slice', 'vector', 1, 4]), 'ect');
    expect(eval(['slice', 'vector', -3]), 'tor');
    expect(eval(['index-of', 'c', 'abc']), 2);
    expect(
      eval([
        'index-of',
        2,
        [
          'literal',
          [1, 2, 3],
        ],
      ]),
      1,
    );
  });

  test('a cubic-bezier interpolation is eased', () {
    final at = eval(
      [
        'interpolate',
        ['cubic-bezier', 0.42, 0, 1, 1],
        ['get', 'x'],
        0,
        0,
        10,
        100,
      ],
      {'x': 2.5},
    );
    expect(at, lessThan(25));
    expect(at, greaterThan(0));
  });

  test('a polygon is named at a point inside it', () {
    final built = build(
      [
        {
          'type': 'symbol',
          'source-layer': 'parks',
          'layout': {'text-field': '{name}'},
        },
      ],
      tile('parks', [
        (
          3,
          {'name': 'Park'},
          [
            [
              1000,
              1000,
              3000,
              1000,
              3000,
              1400,
              1400,
              1400,
              1400,
              3000,
              1000,
              3000,
            ],
          ],
        ),
      ]),
    );
    final label = built.labels.single;
    expect(label.text, 'Park');
    final inArm =
        (label.y < 1400 && label.x > 1000 && label.x < 3000) ||
        (label.x < 1400 && label.y > 1000 && label.y < 3000);
    expect(inArm, isTrue);
  });

  test('a patterned line keeps where each vertex sits across it', () {
    final built = build(
      [
        {
          'type': 'line',
          'source-layer': 'roads',
          'paint': {'line-pattern': 'rail'},
        },
      ],
      tile('roads', [
        (
          2,
          <String, String>{},
          [
            [0, 100, 1000, 100],
          ],
        ),
      ]),
    );
    final across = [
      for (var i = 1; i < built.meshes.single.chunk.distances!.length; i += 2)
        built.meshes.single.chunk.distances![i],
    ];
    expect(across.toSet(), {0, 1});
  });

  test('hillshade and heatmap layers are read', () {
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'dem': {
          'type': 'raster-dem',
          'tiles': ['https://example.org/{z}/{x}/{y}.png'],
          'encoding': 'terrarium',
        },
        'points': {
          'type': 'geojson',
          'data': {'type': 'FeatureCollection', 'features': <Object>[]},
        },
      },
      'layers': [
        {'id': 'hills', 'type': 'hillshade', 'source': 'dem'},
        {'id': 'heat', 'type': 'heatmap', 'source': 'points'},
      ],
    });
    expect((sheet.rasters.single as HillshadeLayer).relief.terrarium, isTrue);
    expect(sheet.layers.single, isA<HeatmapLayer>());
    expect(sheet.runs.map((r) => r.raster), [0, -1]);
  });

  test('an overlay adds its layers on top, or under a named layer', () {
    const overlay = VmapOverlay(
      sources: {
        'mine': {'type': 'geojson', 'data': <String, Object?>{}},
      },
      layers: [
        {'id': 'top', 'type': 'line', 'source': 'mine'},
        {'id': 'under', 'type': 'line', 'source': 'mine', 'before': 'b'},
      ],
    );
    final merged = overlay.applyTo({
      'sources': {
        'base': {'type': 'vector'},
      },
      'layers': [
        {'id': 'a'},
        {'id': 'b'},
      ],
    });
    expect((merged['sources']! as Map).keys, ['base', 'mine']);
    expect(
      [for (final l in merged['layers']! as List) (l as Map)['id']],
      ['a', 'under', 'b', 'top'],
    );
  });
}
