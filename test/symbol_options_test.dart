import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
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

StyleSheet _sheet(
  Map<String, Object?> layout, [
  Map<String, Object?> paint = const {},
]) => StyleSheet.compile({
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
      'paint': paint,
    },
  ],
});

void main() {
  test('a label carries what its layer\'s paint reads from the feature', () {
    final sheet = _sheet({}, {
      'text-color': [
        'case',
        [
          '>',
          ['get', 'weight'],
          5,
        ],
        '#d00',
        '#333',
      ],
    });
    expect(sheet.symbols.single.paintKeys, ['weight']);
    final built = TileBuilder(sheet)
        .buildLayers(GeoJsonTiles(_shops).tile(0, 0, 0), 0);
    final sent = BuiltTile.fromMessage(built.toMessage());
    expect(
      {for (final l in sent.labels) l.text: l.props},
      {
        'late': {'weight': 9},
        'early': {'weight': 2},
      },
    );
  });

  test('a label of a layer reading feature-state carries its id', () {
    final sheet = _sheet({}, {
      'text-opacity': [
        'case',
        [
          'boolean',
          ['feature-state', 'picked'],
          false,
        ],
        1,
        0.4,
      ],
    });
    expect(sheet.symbols.single.paintKeys, [r'$id']);
    expect(sheet.shape, isNot(_sheet({}).shape));
  });

  test('a label carries what its layer\'s sizes read', () {
    final sheet = _sheet({
      'text-size': [
        'interpolate',
        ['linear'],
        ['get', 'weight'],
        0,
        10,
        10,
        30,
      ],
    });
    final symbol = sheet.symbols.single;
    expect(symbol.paintKeys, ['weight']);
    final built = TileBuilder(sheet)
        .buildLayers(GeoJsonTiles(_shops).tile(0, 0, 0), 0);
    final sizes = {
      for (final l in built.labels)
        l.text: symbol.size(EvalContext()..props = l.props!),
    };
    expect(sizes, {'late': 28, 'early': 14});
  });

  test('a label of a layer with plain paint carries nothing', () {
    final sheet = _sheet({}, {'text-color': '#333'});
    expect(sheet.symbols.single.paintKeys, isEmpty);
    final built = TileBuilder(sheet)
        .buildLayers(GeoJsonTiles(_shops).tile(0, 0, 0), 0);
    expect(built.labels.every((l) => l.props == null), isTrue);
  });

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
