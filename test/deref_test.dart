import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style/style_model.dart';

void main() {
  test('a layer with ref takes its source, filter and layout from it', () {
    final style = derefLayers({
      'layers': [
        {
          'id': 'a',
          'type': 'line',
          'source': 's',
          'source-layer': 'roads',
          'filter': ['==', 'class', 'main'],
          'layout': {'line-cap': 'round'},
          'paint': {'line-color': 'red'},
        },
        {
          'id': 'b',
          'ref': 'a',
          'paint': {'line-color': 'blue'},
        },
      ],
    });
    final b = (style['layers']! as List)[1] as Map<String, Object?>;
    expect(b['type'], 'line');
    expect(b['source'], 's');
    expect(b['source-layer'], 'roads');
    expect(b['filter'], ['==', 'class', 'main']);
    expect(b['layout'], {'line-cap': 'round'});
    expect(b['paint'], {'line-color': 'blue'});
    expect(b.containsKey('ref'), isFalse);
  });

  test('a style without ref is returned as it is', () {
    final style = <String, Object?>{
      'layers': [
        {'id': 'a', 'type': 'background'},
      ],
    };
    expect(derefLayers(style), same(style));
  });
}
