import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/geojson.dart';
import 'package:vmap/src/mvt.dart';
import 'package:vmap/src/tile_id.dart';
import 'package:vmap/src/tile_slice.dart';

List<List<double>> _rings(TileFeature f) {
  final sink = GeometrySink();
  f.readGeometry(sink);
  return [
    for (var r = 0; r < sink.ringCount; r++)
      [
        for (var i = sink.ringStart(r) * 2; i < sink.ringEnd(r) * 2; i++)
          sink.coords[i],
      ],
  ];
}

void main() {
  test('a deeper tile is cut from its ancestor with a buffer', () {
    final parent = GeoJsonTiles({
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {'name': 'road'},
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [-170.0, 10.0],
              [170.0, 10.0],
            ],
          },
        },
      ],
    }).tile(0, 0, 0);
    final sliced = sliceLayers(
      parent,
      const TileId(0, 0, 0),
      const TileId(2, 1, 1),
    );
    final feature = sliced.single.features.single;
    expect(feature.allTags(sliced.single)['name'], 'road');
    final [line] = _rings(feature);
    // Clipped 128 units past the child tile's left and right edges.
    expect(line.first, -128);
    expect(line[line.length - 2], 4096 + 128);
  });

  test('a feature outside the deeper tile and its buffer is left out', () {
    final parent = GeoJsonTiles({
      'type': 'Point',
      'coordinates': [-170.0, 80.0],
    }).tile(0, 0, 0);
    expect(
      sliceLayers(parent, const TileId(0, 0, 0), const TileId(2, 3, 3)),
      isEmpty,
    );
  });
}
