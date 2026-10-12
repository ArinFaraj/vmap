import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/geojson.dart';
import 'package:vmap/src/query.dart';
import 'package:vmap/src/style.dart';
import 'package:vmap/src/tile_builder.dart';

Map<String, Object?> _square(int id, double west) => {
  'type': 'Feature',
  'id': id,
  'properties': {'name': 'Square $id'},
  'geometry': {
    'type': 'Polygon',
    'coordinates': [
      [
        [west, 10.0],
        [west, 20.0],
        [west + 10, 20.0],
        [west + 10, 10.0],
        [west, 10.0],
      ],
    ],
  },
};

final _data = {
  'type': 'FeatureCollection',
  'features': [_square(7, 10), _square(8, 30)],
};

final _style = {
  'version': 8,
  'sources': {
    'mine': {'type': 'geojson', 'data': _data},
  },
  'layers': [
    {
      'id': 'squares',
      'type': 'fill',
      'source': 'mine',
      'paint': {
        'fill-color': [
          'case',
          [
            '==',
            ['feature-state', 'picked'],
            true,
          ],
          '#ff0000',
          '#0000ff',
        ],
      },
    },
  ],
};

void main() {
  final sheet = StyleSheet.compile(_style);
  final layers = GeoJsonTiles(_data).tile(0, 0, 0);

  test('a layer painted by state gets a mesh per feature, named by its id', () {
    expect(sheet.layers.single.perFeature, isTrue);
    final built = TileBuilder(sheet).buildLayers(layers, 0);
    expect([for (final m in built.meshes) m.props?[r'$id']], [7, 8]);
  });

  test('the colour follows the state of the feature being drawn', () {
    final context = EvalContext();
    final color = sheet.layers.single.color;
    expect(Rgba.of(color(context))!.toArgb(), 0xFF0000FF);
    context.state = const {'picked': true};
    expect(Rgba.of(color(context))!.toArgb(), 0xFFFF0000);
  });

  test('a feature found at a point carries its id', () {
    final hits = queryTile(layers, sheet, 0, 2218, 1875, 4, 0);
    expect(hits, hasLength(1));
    expect(hits.single.properties[r'$id'], 7);
  });
}
