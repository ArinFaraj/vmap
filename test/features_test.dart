import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/extrusion.dart';

import 'support/mvt_fixture.dart';

void main() {
  const square = [1000, 1000, 2000, 1000, 2000, 2000, 1000, 2000];

  test('a dashed line carries the distance along it', () {
    final built = build(
      [
        {
          'type': 'line',
          'source-layer': 'roads',
          'paint': {
            'line-dasharray': [2, 1],
          },
        },
      ],
      tile('roads', [
        (
          line,
          {},
          [
            [100, 100, 400, 100, 400, 500],
          ],
        ),
      ]),
    );
    final chunk = built.meshes.single.chunk;
    expect(chunk.distances, hasLength(chunk.positions.length));
    final furthest = chunk.distances!.reduce((a, b) => a > b ? a : b);
    expect(furthest, 700);
  });

  test('an outlined fill builds the polygon and its edge', () {
    final built = build(
      [
        {
          'type': 'fill',
          'source-layer': 'building',
          'paint': {'fill-color': '#ddd', 'fill-outline-color': '#999'},
        },
      ],
      tile('building', [
        (polygon, {}, [square]),
      ]),
    );
    expect(built.meshes, hasLength(2));
    expect(built.meshes[0].chunk.extrusions, isNull);
    expect(built.meshes[1].chunk.extrusions, isNotNull);
  });

  test('paint that reads a property gets one mesh per value', () {
    final built = build(
      [
        {
          'type': 'line',
          'source-layer': 'roads',
          'paint': {
            'line-color': [
              'match',
              ['get', 'class'],
              'motorway',
              '#f00',
              '#fff',
            ],
          },
        },
      ],
      tile('roads', [
        (
          line,
          {'class': 'motorway'},
          [
            [0, 0, 500, 0],
          ],
        ),
        (
          line,
          {'class': 'street'},
          [
            [0, 100, 500, 100],
          ],
        ),
        (
          line,
          {'class': 'street', 'name': 'A'},
          [
            [0, 200, 500, 200],
          ],
        ),
      ]),
    );
    expect(built.meshes.map((m) => m.props), [
      {'class': 'motorway'},
      {'class': 'street'},
    ]);
  });

  test('a circle layer keeps the points inside the tile', () {
    final built = build(
      [
        {'type': 'circle', 'source-layer': 'stops'},
      ],
      tile('stops', [
        (
          point,
          {},
          [
            [300, 400],
          ],
        ),
        (
          point,
          {},
          [
            [5000, 400],
          ],
        ),
      ]),
    );
    expect(built.meshes.single.chunk.positions, [300, 400]);
  });

  test('a point symbol carries its icon and its text', () {
    final built = build(
      [
        {
          'type': 'symbol',
          'source-layer': 'poi',
          'layout': {
            'icon-image': ['get', 'class'],
            'text-field': '{name}',
          },
        },
      ],
      tile('poi', [
        (
          point,
          {'class': 'cafe', 'name': 'Machko'},
          [
            [300, 400],
          ],
        ),
        (
          point,
          {'class': 'bank'},
          [
            [900, 400],
          ],
        ),
      ]),
    );
    expect(built.labels.map((l) => (l.icon, l.text)), [
      ('cafe', 'Machko'),
      ('bank', ''),
    ]);
  });

  test('an icon along a line repeats and turns with it', () {
    final built = build(
      [
        {
          'type': 'symbol',
          'source-layer': 'roads',
          'layout': {
            'icon-image': 'arrow',
            'symbol-placement': 'line',
            'symbol-spacing': 100,
          },
        },
      ],
      tile('roads', [
        (
          line,
          {},
          [
            [100, 0, 100, 2400],
          ],
        ),
      ]),
    );
    expect(built.labels, hasLength(3));
    expect(built.labels.map((l) => l.y), [400, 1200, 2000]);
    expect(built.labels.first.angle, closeTo(1.5708, 0.001));
    expect(built.labels.every((l) => l.spaced && l.icon == 'arrow'), isTrue);
  });

  test('a level name along a line skips anchors near one of the same text', () {
    const shields = [
      {
        'type': 'symbol',
        'source-layer': 'roads',
        'layout': {
          'text-field': ['get', 'ref'],
          'symbol-placement': 'line',
          'symbol-spacing': 250,
          'text-rotation-alignment': 'viewport',
        },
      },
    ];
    final roads = tile('roads', [
      (
        line,
        {'ref': '406'},
        [
          [100, 1000, 3000, 1000],
        ],
      ),
      (
        line,
        {'ref': '406'},
        [
          [3000, 1040, 100, 1040],
        ],
      ),
    ]);
    final one = build(
      shields,
      tile('roads', [
        (
          line,
          {'ref': '406'},
          [
            [100, 1000, 3000, 1000],
          ],
        ),
      ]),
    );
    final both = build(shields, roads);
    expect(one.labels, isNotEmpty);
    expect(both.labels, hasLength(one.labels.length));
  });

  test('a building shares its corners for the GPU and none without it', () {
    const buildings = [
      {
        'type': 'fill-extrusion',
        'source-layer': 'building',
        'paint': {'fill-extrusion-height': 10},
      },
    ];
    final bytes = tile('building', [
      (polygon, {}, [square]),
    ]);
    final gpu = build(buildings, bytes, gpu: true).extrusions.single;
    expect(gpu.vertices.length ~/ BuiltExtrusion.floatsPerVertex, 4 * 4 + 4);
    expect(gpu.indices, hasLength(4 * 6 + 2 * 3));
    final drawn = build(buildings, bytes).extrusions.single;
    expect(drawn.vertices, isEmpty);
    expect(drawn.walls, gpu.walls);
  });
}
