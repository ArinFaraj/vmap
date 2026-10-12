import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style.dart';
import 'package:vmap/src/style_model.dart';

Map<String, Object?> _document() => {
  'version': 8,
  'sources': {
    'mine': {
      'type': 'geojson',
      'data': {'type': 'FeatureCollection', 'features': <Object>[]},
    },
  },
  'layers': [
    {
      'id': 'area',
      'type': 'fill',
      'source': 'mine',
      'filter': ['==', 'kind', 'park'],
      'paint': {'fill-color': '#00ff00', 'fill-opacity': 0.5},
    },
    {
      'id': 'road',
      'type': 'line',
      'source': 'mine',
      'minzoom': 4,
      'layout': {'line-cap': 'round'},
    },
  ],
};

Map<String, Object?> _layer(Map<String, Object?> document, String id) =>
    (document['layers']! as List).cast<Map<String, Object?>>().firstWhere(
      (l) => l['id'] == id,
    );

void main() {
  test('an edit changes its layer and leaves the style given alone', () {
    final document = _document();
    final edited = VmapStyleEdit.applyAll([
      const VmapStyleEdit.paint('area', 'fill-color', '#ff0000'),
      const VmapStyleEdit.paint('area', 'fill-opacity', null),
      const VmapStyleEdit.filter('area', null),
      const VmapStyleEdit.layout('road', 'line-join', 'bevel'),
      const VmapStyleEdit.visible('road', false),
      VmapStyleEdit.zoomRange('road', max: 12),
      const VmapStyleEdit.paint('missing', 'fill-color', '#000000'),
    ], document);
    expect(_layer(edited, 'area')['paint'], {'fill-color': '#ff0000'});
    expect(_layer(edited, 'area').containsKey('filter'), isFalse);
    expect(_layer(edited, 'road')['layout'], {
      'line-cap': 'round',
      'line-join': 'bevel',
      'visibility': 'none',
    });
    expect(_layer(edited, 'road').containsKey('minzoom'), isFalse);
    expect(_layer(edited, 'road')['maxzoom'], 12);
    expect(document, _document());
  });

  test('a colour keeps the tiles built and a filter does not', () {
    final plain = StyleSheet.compile(_document());
    final recoloured = StyleSheet.compile(
      VmapStyleEdit.applyAll([
        const VmapStyleEdit.paint('area', 'fill-color', '#ff0000'),
      ], _document()),
    );
    final refiltered = StyleSheet.compile(
      VmapStyleEdit.applyAll([
        const VmapStyleEdit.filter('area', ['==', 'kind', 'wood']),
      ], _document()),
    );
    expect(recoloured.shape, plain.shape);
    expect(refiltered.shape, isNot(plain.shape));
  });

  test('two lists of edits are the same when they say the same', () {
    expect(
      VmapStyleEdit.same(
        [VmapStyleEdit.zoomRange('road', min: 3)],
        [VmapStyleEdit.zoomRange('road', min: 3)],
      ),
      isTrue,
    );
    expect(
      VmapStyleEdit.same(
        const [VmapStyleEdit.paint('area', 'fill-color', '#ff0000')],
        const [VmapStyleEdit.paint('area', 'fill-color', '#00ff00')],
      ),
      isFalse,
    );
    expect(
      VmapStyleEdit.same(const [
        VmapStyleEdit.visible('road', false),
      ], const []),
      isFalse,
    );
  });
}
