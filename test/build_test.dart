import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/raster_style.dart';
import 'package:vmap/src/style.dart';
import 'package:vmap/src/style_model.dart';

EvalContext at(double zoom, [Map<String, Object?> props = const {}]) =>
    EvalContext()
      ..zoom = zoom
      ..props = props
      ..geometryType = 'LineString';

void main() {
  test('colours parse from hex, rgb, hsl and names', () {
    expect(Rgba.of('#fc8')!.toArgb(), 0xFFFFCC88);
    expect(Rgba.of('rgba(255, 0, 0, 0.5)')!.toArgb(), 0x80FF0000);
    expect(Rgba.of('hsl(0, 0%, 100%)')!.toArgb(), 0xFFFFFFFF);
    expect(Rgba.of('black')!.toArgb(), 0xFF000000);
    expect(Rgba.of('RoyalBlue')!.toArgb(), 0xFF4169E1);
    expect(Rgba.of('lime')!.toArgb(), 0xFF00FF00);
    expect(Rgba.of('no such colour'), isNull);
  });

  test('interpolate is linear by default and exponential with a base', () {
    final linear = compileExpr([
      'interpolate',
      ['linear'],
      ['zoom'],
      10,
      1,
      12,
      3,
    ]);
    expect(linear(at(9)), 1);
    expect(linear(at(11)), 2);
    expect(linear(at(13)), 3);
    final exponential = compileExpr([
      'interpolate',
      ['exponential', 2],
      ['zoom'],
      10,
      1,
      12,
      4,
    ]);
    expect(exponential(at(11)), closeTo(2, 1e-9));
  });

  test('interpolate mixes colours', () {
    final color = compileExpr([
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      '#000000',
      10,
      '#ffffff',
    ]);
    expect(Rgba.of(color(at(5)))!.toArgb(), 0xFF808080);
  });

  test('a legacy property function blends pairs of numbers', () {
    final offset = compileExpr({
      'property': 'rank',
      'stops': [
        [
          0,
          [0, 10],
        ],
        [
          50,
          [20, 10],
        ],
      ],
    });
    expect(offset(at(14, {'rank': 25})), [10.0, 10.0]);
  });

  test('a legacy stops function reads like an exponential interpolate', () {
    final width = compileExpr({
      'base': 2,
      'stops': [
        [10, 1],
        [12, 4],
      ],
    });
    expect(width(at(11)), closeTo(2, 1e-9));
  });

  test('match, case, coalesce and step choose by property and zoom', () {
    final match = compileExpr([
      'match',
      ['get', 'class'],
      ['primary', 'trunk'],
      'big',
      'minor',
      'small',
      'none',
    ]);
    expect(match(at(0, {'class': 'trunk'})), 'big');
    expect(match(at(0, {'class': 'minor'})), 'small');
    expect(match(at(0, {'class': 'path'})), 'none');
    final step = compileExpr([
      'step',
      ['zoom'],
      'point',
      11,
      'line',
    ]);
    expect(step(at(10)), 'point');
    expect(step(at(11)), 'line');
    final name = compileExpr([
      'coalesce',
      ['get', 'name:en'],
      ['get', 'name'],
    ]);
    expect(name(at(0, {'name': 'Hewler'})), 'Hewler');
  });

  test('filters read in the expression and the legacy syntax', () {
    final modern = compileFilter([
      'all',
      [
        '==',
        ['get', 'class'],
        'motorway',
      ],
      [
        '!=',
        ['get', 'ramp'],
        1,
      ],
      [
        'match',
        ['geometry-type'],
        ['LineString'],
        true,
        false,
      ],
    ]);
    expect(modern(at(0, {'class': 'motorway'})), isTrue);
    expect(modern(at(0, {'class': 'motorway', 'ramp': 1})), isFalse);
    final legacy = compileFilter([
      'all',
      ['==', r'$type', 'LineString'],
      ['in', 'class', 'minor', 'service'],
      ['!has', 'toll'],
    ]);
    expect(legacy(at(0, {'class': 'service'})), isTrue);
    expect(legacy(at(0, {'class': 'service', 'toll': 1})), isFalse);
    expect(legacy(at(0, {'class': 'primary'})), isFalse);
  });

  test('a text field takes tokens or an expression', () {
    expect(
      compileText('{name:latin} {ref}')(at(0, {'name:latin': 'Erbil'})),
      'Erbil',
    );
    expect(
      compileText([
        'concat',
        ['get', 'name'],
        ' ',
        ['get', 'ref'],
      ])(at(0, {'name': 'A', 'ref': 4})),
      'A 4',
    );
  });

  group('compiling a style', () {
    final style = <String, Object?>{
      'version': 8,
      'sources': {
        'omt': {'type': 'vector', 'url': 'https://example.org/planet'},
        'shade': {'type': 'raster', 'tiles': <String>[]},
      },
      'layers': [
        {
          'id': 'bg',
          'type': 'background',
          'paint': {'background-color': '#eee'},
        },
        {'id': 'shade', 'type': 'raster', 'source': 'shade'},
        {
          'id': 'casing',
          'type': 'line',
          'source': 'omt',
          'source-layer': 'transportation',
          'filter': ['==', 'class', 'primary'],
          'paint': {'line-color': '#999', 'line-width': 6},
        },
        {
          'id': 'road',
          'type': 'line',
          'source': 'omt',
          'source-layer': 'transportation',
          'filter': ['==', 'class', 'primary'],
          'paint': {'line-color': '#fff', 'line-width': 4},
        },
        {
          'id': 'rail',
          'type': 'line',
          'source': 'omt',
          'source-layer': 'transportation',
          'filter': ['==', 'class', 'rail'],
          'paint': {
            'line-color': '#000',
            'line-dasharray': [1, 3],
          },
        },
        {
          'id': 'hidden',
          'type': 'fill',
          'source': 'omt',
          'source-layer': 'water',
          'layout': {'visibility': 'none'},
        },
        {
          'id': 'names',
          'type': 'symbol',
          'source': 'omt',
          'source-layer': 'place',
          'layout': {
            'text-field': '{name}',
            'text-font': ['Noto Sans Bold'],
          },
        },
      ],
    };

    test('layers that select the same features share one mesh', () {
      final sheet = StyleSheet.compile(style);
      expect(
        (sheet.sources.single as TiledSource).tileJsonUrl,
        'https://example.org/planet',
      );
      expect(sheet.layers, hasLength(3));
      expect(sheet.buckets, hasLength(2));
      expect(sheet.layers[0].bucket, sheet.layers[1].bucket);
      expect((sheet.layers[2] as LineLayer).dash, [1, 3]);
      expect(sheet.buckets[sheet.layers[2].bucket].dashed, isTrue);
      expect(sheet.buckets[sheet.layers[0].bucket].dashed, isFalse);
      expect(sheet.symbols.single.weight, 700);
      expect(Rgba.of(sheet.background(at(0)))!.toArgb(), 0xFFEEEEEE);
    });

    test('name keys replace the names a style asks for', () {
      final sheet = StyleSheet.compile(style, nameKeys: ['name:en', 'name']);
      final props = {'name': 'Hewler', 'name:en': 'Erbil'};
      expect(sheet.symbols.single.build.text(at(0, props)), 'Erbil');
      expect(sheet.shape, isNot(StyleSheet.compile(style).shape));
    });
  });

  group('what a style asks for beyond plain fills and lines', () {
    StyleSheet compile(List<Map<String, Object?>> layers) =>
        StyleSheet.compile({
          'version': 8,
          'sprite': 'https://example.org/sprites/basic',
          'sources': {
            'omt': {'type': 'vector', 'url': 'https://example.org/planet'},
            'relief': {
              'type': 'raster',
              'tiles': ['https://example.org/relief/{z}/{x}/{y}.png'],
              'tileSize': 256,
              'maxzoom': 6,
            },
          },
          'layers': [
            for (final l in layers) {'source': 'omt', ...l},
          ],
        });

    test('a fill with an outline colour also draws its edges', () {
      final sheet = compile([
        {
          'type': 'fill',
          'source-layer': 'building',
          'paint': {'fill-color': '#ddd', 'fill-outline-color': '#999'},
        },
      ]);
      expect(sheet.layers, hasLength(2));
      final edge = sheet.layers[1] as LineLayer;
      expect(edge, isA<LineLayer>());
      expect(edge.width(at(15)), 1);
      expect(sheet.buckets[edge.bucket].outline, isTrue);
      expect(Rgba.of(edge.color(at(15)))!.toArgb(), 0xFF999999);
    });

    test('paint that reads a property splits its bucket by that property', () {
      final sheet = compile([
        {
          'type': 'line',
          'source-layer': 'transportation',
          'paint': {
            'line-color': [
              'match',
              ['get', 'class'],
              'motorway',
              '#f00',
              '#fff',
            ],
            'line-width': 2,
          },
        },
        {
          'type': 'line',
          'source-layer': 'transportation',
          'paint': {'line-color': '#000', 'line-width': 2},
        },
      ]);
      expect(sheet.layers[0].perFeature, isTrue);
      expect(sheet.layers[1].perFeature, isFalse);
      expect(sheet.buckets[sheet.layers[0].bucket].variantKeys, ['class']);
      expect(sheet.layers[0].bucket, isNot(sheet.layers[1].bucket));
      expect(
        Rgba.of(sheet.layers[0].color(at(10, {'class': 'motorway'})))!.toArgb(),
        0xFFFF0000,
      );
    });

    test('the layers after the last symbol layer are drawn over labels', () {
      final sheet = compile([
        {'type': 'fill', 'source-layer': 'water'},
        {
          'type': 'symbol',
          'source-layer': 'place',
          'layout': {'text-field': '{name}'},
        },
        {'type': 'circle', 'source-layer': 'poi'},
      ]);
      expect(sheet.aboveLabels, 1);
      expect(sheet.runs.map(sheet.overLabels), [false, true]);
    });

    test('a style without symbols has nothing over labels', () {
      final sheet = compile([
        {'type': 'fill', 'source-layer': 'water'},
      ]);
      expect(sheet.aboveLabels, -1);
      expect(sheet.runs.any(sheet.overLabels), isFalse);
    });

    test('dashes that change with the zoom hold from each stop', () {
      final sheet = compile([
        {
          'type': 'line',
          'source-layer': 'transportation',
          'paint': {
            'line-dasharray': {
              'stops': [
                [
                  0,
                  [1, 1],
                ],
                [
                  2,
                  [2, 2],
                ],
              ],
            },
          },
        },
        {
          'type': 'line',
          'source-layer': 'transportation',
          'paint': {
            'line-dasharray': [
              'step',
              ['zoom'],
              [
                'literal',
                [3, 1],
              ],
              5,
              [
                'literal',
                [1, 3],
              ],
            ],
          },
        },
      ]);
      final legacy = sheet.layers[0] as LineLayer;
      expect(legacy.dashAt(1), [1, 1]);
      expect(legacy.dashAt(2), [2, 2]);
      final step = sheet.layers[1] as LineLayer;
      expect(step.dashAt(4.9), [3, 1]);
      expect(step.dashAt(5), [1, 3]);
    });

    test('a symbol layer keeps its icon, anchor and offset', () {
      final sheet = compile([
        {
          'type': 'symbol',
          'source-layer': 'poi',
          'layout': {
            'icon-image': ['get', 'class'],
            'icon-size': 0.7,
            'text-field': '{name}',
            'text-anchor': 'top',
            'text-offset': [0, 0.6],
            'text-optional': true,
          },
        },
        {
          'type': 'symbol',
          'source-layer': 'transportation',
          'layout': {'icon-image': 'arrow', 'symbol-placement': 'line'},
        },
      ]);
      expect(sheet.sprite, 'https://example.org/sprites/basic');
      final poi = sheet.symbols[0];
      expect(poi.build.icon!(at(15, {'class': 'cafe'})), 'cafe');
      expect(poi.iconSize(at(15)), 0.7);
      expect(poi.anchor, 'top');
      expect(poi.offsetY, 0.6);
      expect(poi.textOptional, isTrue);
      expect(sheet.symbols[1].build.text(at(16)), '');
      expect(sheet.symbols[1].build.icon!(at(16)), 'arrow');
    });

    test('circle, pattern and raster layers are kept', () {
      final sheet = compile([
        {'type': 'raster', 'source': 'relief', 'maxzoom': 7},
        {
          'type': 'fill',
          'source-layer': 'landcover',
          'paint': {'fill-pattern': 'wetland'},
        },
        {
          'type': 'circle',
          'source-layer': 'poi',
          'paint': {
            'circle-radius': 4,
            'circle-color': '#06c',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        },
      ]);
      final relief = sheet.rasters.single as TiledRasterLayer;
      expect(relief.tiles, contains('relief'));
      expect(relief.sourceMaxZoom, 6);
      expect((sheet.layers[0] as FillLayer).pattern!(at(12)), 'wetland');
      final circle = sheet.layers[1] as CircleLayer;
      expect(circle.width(at(12)), 8);
      expect(circle.ring!.width(at(12)), 1);
    });
  });

  test('the built in light and dark styles build tiles the same way', () {
    final light = StyleSheet.compile(VmapStyle.light.document!);
    final dark = StyleSheet.compile(VmapStyle.dark.document!);
    expect(light.shape, dark.shape);
    expect(light.layers, isNotEmpty);
    expect(light.symbols, hasLength(14));
    final casing = light.layers.whereType<LineLayer>().first;
    expect(casing.width(at(14)), isA<double>());
  });
}
