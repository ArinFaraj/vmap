import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/geojson.dart';
import 'package:vmap/src/style_model.dart';
import 'package:vmap/src/tile_builder.dart';

Map<String, Object?> _square(double west, int key) => {
  'type': 'Feature',
  'properties': {'key': key},
  'geometry': {
    'type': 'Polygon',
    'coordinates': [
      [
        [west, 0.0],
        [west + 10, 0.0],
        [west + 10, 10.0],
        [west, 10.0],
        [west, 0.0],
      ],
    ],
  },
};

void main() {
  test('a fill-sort-key builds its features lowest key first', () {
    final data = {
      'type': 'FeatureCollection',
      'features': [_square(-100, 2), _square(50, 1)],
    };
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'mine': {'type': 'geojson', 'data': data},
      },
      'layers': [
        {
          'id': 'squares',
          'type': 'fill',
          'source': 'mine',
          'layout': {
            'fill-sort-key': ['get', 'key'],
          },
        },
      ],
    });
    final tiles = GeoJsonTiles(data);
    final built = TileBuilder(sheet).buildLayers(tiles.tile(0, 0, 0), 0);
    final positions = built.meshes.single.chunk.positions;
    expect(positions.first, greaterThan(tileExtent / 2));
    expect(positions[positions.length - 2], lessThan(tileExtent / 2));
  });
}
