import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/geojson.dart';
import 'package:vmap/src/mvt.dart';
import 'package:vmap/src/query.dart';
import 'package:vmap/src/style.dart';
import 'package:vmap/src/tile_builder.dart';

final _style = {
  'version': 8,
  'sources': {
    'base': {'type': 'vector', 'url': 'https://example.org/planet'},
    'relief': {
      'type': 'raster',
      'tiles': ['https://example.org/{z}/{x}/{y}.png'],
    },
    'mine': {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': {'name': 'Route'},
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [-10.0, 0.0],
                [10.0, 0.0],
              ],
            },
          },
          {
            'type': 'Feature',
            'properties': {'name': 'Area'},
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
                [
                  [20.0, 20.0],
                  [20.0, 30.0],
                  [30.0, 30.0],
                  [30.0, 20.0],
                  [20.0, 20.0],
                ],
              ],
            },
          },
        ],
      },
    },
  },
  'layers': [
    {'id': 'land', 'type': 'fill', 'source': 'base', 'source-layer': 'land'},
    {'id': 'relief', 'type': 'raster', 'source': 'relief'},
    {'id': 'roads', 'type': 'line', 'source': 'base', 'source-layer': 'roads'},
    {'id': 'area', 'type': 'fill', 'source': 'mine'},
    {'id': 'route', 'type': 'line', 'source': 'mine'},
    {'id': 'rail', 'type': 'line', 'source': 'base', 'source-layer': 'rail'},
  ],
};

void main() {
  final sheet = StyleSheet.compile(_style);

  test('every vector and GeoJSON source is kept, in order of first use', () {
    expect(sheet.sources.map((s) => s.name), ['base', 'mine']);
    expect(sheet.sources[1], isA<GeoJsonSource>());
  });

  test('layers are drawn in runs that follow the style order', () {
    expect(
      [
        for (final r in sheet.runs)
          r.raster >= 0 ? 'raster' : '${r.source}:${r.first}-${r.end}',
      ],
      ['0:0-1', 'raster', '0:1-2', '1:2-4', '0:4-5'],
    );
  });

  test('GeoJSON is cut into the tiles it touches', () {
    final tiles = GeoJsonTiles((sheet.sources[1] as GeoJsonSource).data);
    expect(tiles.featureCount, 2);
    final west = tiles.tile(1, 0, 0);
    final features = west.single.features;
    expect(features, hasLength(1));
    final sink = GeometrySink();
    features.single.readGeometry(sink);
    expect(sink.coords[0], closeTo(4096 * (170 / 180), 1));
    expect(sink.coords[2], 4096 + 128);
    expect(tiles.tile(2, 3, 3), isEmpty);
  });

  test('a GeoJSON tile builds meshes for its own layers only', () {
    final tiles = GeoJsonTiles((sheet.sources[1] as GeoJsonSource).data);
    final built = TileBuilder(
      sheet,
      source: 1,
    ).buildLayers(tiles.tile(0, 0, 0), 0);
    final kinds = {for (final m in built.meshes) sheet.buckets[m.bucket].kind};
    expect(kinds, {BucketKind.fill, BucketKind.line});
    expect(
      built.meshes.every((m) => sheet.buckets[m.bucket].source == 1),
      isTrue,
    );
  });

  test('a lookup finds the features under a point and their layers', () {
    final tiles = GeoJsonTiles((sheet.sources[1] as GeoJsonSource).data);
    final onLine = queryTile(tiles.tile(0, 0, 0), sheet, 1, 2048, 2050, 8, 0);
    expect(onLine.single.layers, ['route']);
    expect(onLine.single.properties['name'], 'Route');
    final x = 4096 * (205 / 360);
    final inArea = queryTile(tiles.tile(0, 0, 0), sheet, 1, x, 1750, 1, 0);
    expect(inArea.map((f) => f.properties['name']), contains('Area'));
    expect(queryTile(tiles.tile(0, 0, 0), sheet, 1, 100, 100, 8, 0), isEmpty);
  });

  test('a lookup finds the features that touch a box', () {
    final tiles = GeoJsonTiles((sheet.sources[1] as GeoJsonSource).data);
    List<Object?> names(
      double x,
      double y,
      double halfWidth,
      double halfHeight,
    ) => [
      for (final f in queryTile(
        tiles.tile(0, 0, 0),
        sheet,
        1,
        x,
        y,
        0,
        0,
        box: (halfWidth, halfHeight),
      ))
        f.properties['name'],
    ];
    expect(names(2048, 2048, 20, 20), ['Route'], reason: 'a line through it');
    expect(names(2330, 1750, 5, 5), ['Area'], reason: 'wholly inside an area');
    expect(names(2330, 1750, 150, 150), ['Area'], reason: 'an area inside it');
    expect(names(2200, 1900, 100, 200), unorderedEquals(['Route', 'Area']));
    expect(names(100, 100, 50, 50), isEmpty);
    expect(names(2048, 2100, 20, 20), isEmpty, reason: 'beside the line');
  });
}
