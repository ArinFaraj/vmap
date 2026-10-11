import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/style.dart';

StyleSheet _sheet(
  String type,
  Map<String, Object?> layout,
  Map<String, Object?> paint,
) => StyleSheet.compile({
  'version': 8,
  'sources': {
    'mine': {
      'type': 'geojson',
      'data': {'type': 'FeatureCollection', 'features': <Object>[]},
    },
  },
  'layers': [
    {
      'id': 'one',
      'type': type,
      'source': 'mine',
      'layout': layout,
      'paint': paint,
    },
  ],
});

void main() {
  test('a translate is along the map unless the style says the screen', () {
    for (final type in ['fill', 'line', 'circle']) {
      final onMap = _sheet(type, {}, {
        '$type-translate': [4, 2],
      });
      expect(onMap.layers.single.translate, isNotNull);
      expect(onMap.layers.single.translateOnScreen, isFalse);
      final onScreen = _sheet(type, {}, {
        '$type-translate': [4, 2],
        '$type-translate-anchor': 'viewport',
      });
      expect(onScreen.layers.single.translateOnScreen, isTrue);
    }
  });

  test('a symbol layer reads its translates, bend limit and icon rim', () {
    final plain = _sheet('symbol', {'text-field': 'a'}, {}).symbols.single;
    expect(plain.textTranslate, isNull);
    expect(plain.iconHaloBlur, isNull);
    expect(plain.maxBend, isNull);
    expect(plain.iconHaloColor, isNull);

    final set = _sheet(
      'symbol',
      {'text-field': 'a', 'icon-image': 'dot', 'text-max-angle': 90},
      {
        'text-translate': [3, -5],
        'text-translate-anchor': 'viewport',
        'icon-translate': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          [
            'literal',
            [1, 2],
          ],
          12,
          [
            'literal',
            [3, 6],
          ],
        ],
        'icon-halo-blur': 1,
        'icon-halo-color': '#fff',
        'icon-halo-width': 2,
      },
    ).symbols.single;
    final at = EvalContext()..zoom = 11;
    expect(set.textTranslate!(at), [3, -5]);
    expect(set.textTranslateOnScreen, isTrue);
    expect(set.iconTranslate!(at), [2, 4]);
    expect(set.iconHaloBlur!(at), 1);
    expect(set.iconTranslateOnScreen, isFalse);
    expect(set.maxBend, closeTo(1.5708, 0.0001));
    expect(set.iconHaloColor, isNotNull);
    expect(set.iconHaloWidth, isNotNull);
  });
}
