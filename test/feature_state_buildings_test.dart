import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/geojson.dart';
import 'package:vmap/src/tiles/protocol.dart';
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/tiles/tile_builder.dart';

Map<String, Object?> _style(Object? color) => {
  'version': 8,
  'sources': {
    'mine': {
      'type': 'geojson',
      'promoteId': 'foo',
      'data': {
        'type': 'Feature',
        'properties': {'foo': 'a'},
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [
              [-10.0, -10.0],
              [-10.0, 10.0],
              [10.0, 10.0],
              [10.0, -10.0],
              [-10.0, -10.0],
            ],
          ],
        },
      },
    },
  },
  'layers': [
    {
      'id': 'buildings',
      'type': 'fill-extrusion',
      'source': 'mine',
      'paint': {'fill-extrusion-height': 10, 'fill-extrusion-color': color},
    },
  ],
};

void main() {
  final stateful = StyleSheet.compile(
    _style([
      'coalesce',
      ['feature-state', 'color'],
      'black',
    ]),
  );

  test('only sources whose buildings read feature-state are marked', () {
    expect(stateful.stateBuiltSources, {0});
    expect(StyleSheet.compile(_style('red')).stateBuiltSources, isEmpty);
  });

  test('a building is coloured by the state of its feature', () {
    final tiles = GeoJsonTiles(
      (stateful.sources[0] as GeoJsonSource).data,
      promoteId: 'foo',
    );
    List<double> colour(Map<Object?, Map<String, Object?>> states) {
      final builder = TileBuilder(stateful, source: 0)..states = states;
      final info = builder
          .buildLayers(tiles.tile(0, 0, 0), 0)
          .extrusions
          .single
          .info;
      return info.sublist(8, 11);
    }

    expect(colour(const {}), [0, 0, 0]);
    expect(
      colour({
        'a': {'color': 'red'},
      }),
      [1, 0, 0],
    );
    expect(
      colour({
        'b': {'color': 'red'},
      }),
      [0, 0, 0],
    );
  });

  test('states cross to a worker with their ids as they were', () {
    final wire = UseStates(3, [
      (7, {'color': 'red'}),
      ('7', {'color': 'blue'}),
    ]).toWire();
    final back = WorkerRequest.fromWire(wire) as UseStates;
    expect(back.job, 3);
    expect(
      [
        for (final (id, state) in back.states) [id, state],
      ],
      [
        [
          7,
          {'color': 'red'},
        ],
        [
          '7',
          {'color': 'blue'},
        ],
      ],
    );
  });
}
