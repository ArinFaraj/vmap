import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/geojson.dart';
import 'package:vmap/src/style.dart';
import 'package:vmap/src/tile_builder.dart';

const _shops = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {'name': 'late', 'weight': 9},
      'geometry': {
        'type': 'Point',
        'coordinates': [10.0, 10.0],
      },
    },
    {
      'type': 'Feature',
      'properties': {'name': 'early', 'weight': 2},
      'geometry': {
        'type': 'Point',
        'coordinates': [40.0, 10.0],
      },
    },
  ],
};

StyleSheet _sheet(Map<String, Object?> layout) => StyleSheet.compile({
  'version': 8,
  'sources': {
    'mine': {'type': 'geojson', 'data': _shops},
  },
  'layers': [
    {
      'id': 'shops',
      'type': 'symbol',
      'source': 'mine',
      'layout': {
        'text-field': ['get', 'name'],
        ...layout,
      },
    },
  ],
});

void main() {
  test('a symbol layer reads where its text and icon may sit', () {
    final symbol = _sheet({
      'text-variable-anchor': ['top', 'left', 'bottom-right'],
      'text-radial-offset': 0.8,
      'icon-anchor': 'bottom',
      'icon-offset': [3, -4],
    }).symbols.single;
    expect(symbol.anchors, ['top', 'left', 'bottom-right']);
    expect(symbol.radialOffset, 0.8);
    expect(symbol.iconAnchor, 'bottom');
    expect(symbol.iconOffsetX, 3);
    expect(symbol.iconOffsetY, -4);
  });

  test('a symbol layer with one anchor tries no others', () {
    final symbol = _sheet({'text-anchor': 'left'}).symbols.single;
    expect(symbol.anchors, isEmpty);
    expect(symbol.anchor, 'left');
    expect(symbol.sortKey, isNull);
  });

  test('the lower sort key is placed first', () {
    final sheet = _sheet({
      'symbol-sort-key': ['get', 'weight'],
    });
    final layers = GeoJsonTiles(_shops).tile(0, 0, 0);
    final built = TileBuilder(sheet).buildLayers(layers, 0);
    final found = {for (final l in built.labels) l.text: l.priority};
    expect(found.keys, containsAll(['late', 'early']));
    expect(found['early']! < found['late']!, isTrue);
  });
}
