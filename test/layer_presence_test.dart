import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/gpu/layer_presence.dart';
import 'package:vmap/src/style/style_model.dart';

void main() {
  final sheet = StyleSheet.compile({
    'version': 8,
    'sources': {
      'roads': {'type': 'vector', 'tiles': <String>[]},
    },
    'layers': [
      {
        'id': 'paths',
        'type': 'line',
        'source': 'roads',
        'source-layer': 'road',
        'minzoom': 14,
      },
    ],
  });

  test('a layer already in range shows at once on the first load', () {
    final presence = LayerPresence(Stopwatch()..start());
    presence.begin(sheet, 15, const []);
    expect(presence.of(0), 1);
    expect(presence.animating, isFalse);
  });

  test('a layer fades in when the zoom crosses into its range', () {
    final clock = Stopwatch()..start();
    final presence = LayerPresence(clock)..begin(sheet, 13, const []);
    expect(presence.of(0), 0);
    presence.begin(sheet, 14.5, const []);
    expect(presence.of(0), 0, reason: 'nothing of the layer has arrived');
  });
}
