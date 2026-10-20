import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/geojson.dart';

void main() {
  test("a GeoJSON source's filter leaves out the features it turns away", () {
    Map<String, Object?> point(String kind) => {
      'type': 'Feature',
      'properties': {'kind': kind},
      'geometry': {
        'type': 'Point',
        'coordinates': [1.0, 1.0],
      },
    };
    final tiles = GeoJsonTiles(
      {
        'type': 'FeatureCollection',
        'features': [point('cape'), point('bay'), point('cape')],
      },
      filter: [
        '==',
        ['get', 'kind'],
        'cape',
      ],
    );
    expect(tiles.featureCount, 2);
  });
}
