import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/style.dart';

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
      expect(sheet.tileJsonUrl, 'https://example.org/planet');
      expect(sheet.layers, hasLength(3));
      expect(sheet.buckets, hasLength(2));
      expect(sheet.layers[0].bucket, sheet.layers[1].bucket);
      expect(sheet.layers[2].coverage, 0.25);
      expect(sheet.symbols.single.weight, 700);
      expect(Rgba.of(sheet.background(at(0)))!.toArgb(), 0xFFEEEEEE);
    });

    test('name keys replace the names a style asks for', () {
      final sheet = StyleSheet.compile(style, nameKeys: ['name:en', 'name']);
      final props = {'name': 'Hewler', 'name:en': 'Erbil'};
      expect(sheet.symbols.single.text(at(0, props)), 'Erbil');
      expect(sheet.shape, isNot(StyleSheet.compile(style).shape));
    });
  });

  test('the built in light and dark styles build tiles the same way', () {
    final light = StyleSheet.compile(VmapStyle.light.document!);
    final dark = StyleSheet.compile(VmapStyle.dark.document!);
    expect(light.shape, dark.shape);
    expect(light.layers, isNotEmpty);
    expect(light.symbols, hasLength(13));
    final casing = light.layers.firstWhere((l) => l.isLine && l.width != null);
    expect(casing.width!(at(14)), isA<double>());
  });
}
