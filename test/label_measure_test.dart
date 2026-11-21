import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/text/glyphs/glyph_layout.dart';
import 'package:vmap/src/text/glyphs/glyph_ranges.dart';
import 'package:vmap/src/tiles/label_measure.dart';

final _fonts = GlyphFonts([
  File('assets/fonts/Vazirmatn-Variable.ttf').readAsBytesSync(),
]);

SymbolLayer _roads(Map<String, Object?> layout) => StyleSheet.compile({
  'version': 8,
  'sources': {
    'streets': {'type': 'vector', 'url': 'https://example.org/planet'},
  },
  'layers': [
    {
      'id': 'roads',
      'type': 'symbol',
      'source': 'streets',
      'source-layer': 'road',
      'layout': {
        'text-field': ['get', 'name'],
        'symbol-placement': 'line',
        ...layout,
      },
    },
  ],
}).symbols.single;

void main() {
  test(
    'a name in a font the server lacks is as long as vmap sets it',
    () async {
      final asked = <String>[];
      final ranges = GlyphRanges(
        'https://example.org/{fontstack}/{range}.pbf',
        onLoaded: (_, _) {},
        fetch: (url) async {
          asked.add(url);
          return null;
        },
      );
      final measure = LabelMeasure(fonts: _fonts, ranges: ranges);
      final roads = _roads({
        'text-font': ['Nowhere Sans'],
      });
      final own = layoutText(_fonts, 'Citadel Road', singleLine: true)!.width;

      measure.textEms(roads, 'Citadel Road');
      expect(measure.missedGlyphs, isTrue);
      await Future<void>.delayed(Duration.zero);
      expect(asked, ['https://example.org/Nowhere%20Sans/0-255.pbf']);
      expect(measure.textEms(roads, 'Citadel Road'), closeTo(own, 1e-9));
    },
  );

  test('a layer whose fonts an expression picks asks for no range', () {
    final asked = <String>[];
    final ranges = GlyphRanges(
      'https://example.org/{fontstack}/{range}.pbf',
      onLoaded: (_, _) {},
      fetch: (url) async {
        asked.add(url);
        return null;
      },
    );
    final measure = LabelMeasure(fonts: _fonts, ranges: ranges);
    final roads = _roads({
      'text-font': [
        'case',
        ['has', 'bold'],
        [
          'literal',
          ['Noto Sans Bold'],
        ],
        [
          'literal',
          ['Noto Sans Regular'],
        ],
      ],
    });
    expect(measure.textEms(roads, 'Citadel Road'), greaterThan(1));
    expect(measure.missedGlyphs, isFalse);
    expect(asked, isEmpty);
  });
}
