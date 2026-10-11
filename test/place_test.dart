import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/geojson.dart';
import 'package:vmap/src/place.dart';
import 'package:vmap/src/style.dart';
import 'package:vmap/src/tile_builder.dart';

const _towns = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {'name': 'near'},
      'geometry': {
        'type': 'Point',
        'coordinates': [10.0, 10.0],
      },
    },
    {
      'type': 'Feature',
      'properties': {'name': 'far'},
      'geometry': {
        'type': 'Point',
        'coordinates': [40.0, 10.0],
      },
    },
  ],
};

const _west = {
  'type': 'Polygon',
  'coordinates': [
    [
      [0.0, 0.0],
      [20.0, 0.0],
      [20.0, 20.0],
      [0.0, 20.0],
      [0.0, 0.0],
    ],
  ],
};

Set<String> _shown(Object filter, {int z = 0, int x = 0, int y = 0}) {
  final sheet = StyleSheet.compile({
    'version': 8,
    'sources': {
      'mine': {'type': 'geojson', 'data': _towns},
    },
    'layers': [
      {
        'id': 'towns',
        'type': 'symbol',
        'source': 'mine',
        'filter': filter,
        'layout': {
          'text-field': ['get', 'name'],
        },
      },
    ],
  });
  final built = TileBuilder(sheet)
      .buildLayers(GeoJsonTiles(_towns).tile(z, x, y), z, x: x, y: y);
  return {for (final l in built.labels) l.text};
}

void main() {
  test('within keeps the features inside the polygon', () {
    expect(_shown(['within', _west]), {'near'});
    expect(
      _shown([
        '!',
        ['within', _west],
      ]),
      {'far'},
    );
  });

  test('within reads the place of a feature in a deeper tile', () {
    expect(_shown(['within', _west], z: 3, x: 4, y: 3), {'near'});
  });

  test('distance is measured in metres', () {
    const here = {
      'type': 'Point',
      'coordinates': [10.0, 11.0],
    };
    expect(
      _shown([
        '<',
        ['distance', here],
        200000,
      ]),
      {'near'},
    );
    final place = Place.of(here)!;
    expect(place.distanceTo([10, 10], joined: false), closeTo(111319, 200));
    expect(Place.of(_west)!.distanceTo([10, 10], joined: false), 0);
    expect(
      Place.of(_west)!.distanceTo([21, 0], joined: false),
      closeTo(111319, 200),
    );
  });

  test('a geometry with nothing in it is no place', () {
    expect(Place.of({'type': 'Polygon'}), isNull);
    expect(Place.of('x'), isNull);
  });
}
