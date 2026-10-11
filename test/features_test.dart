import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style.dart';
import 'package:vmap/src/tile_builder.dart';

const _point = 1;
const _line = 2;
const _polygon = 3;

List<int> _varint(int v) {
  final out = <int>[];
  while (v > 127) {
    out.add((v & 127) | 128);
    v >>= 7;
  }
  return out..add(v);
}

List<int> _field(int number, List<int> bytes) => [
  ..._varint(number << 3 | 2),
  ..._varint(bytes.length),
  ...bytes,
];

int _zigzag(int v) => (v << 1) ^ (v >> 31);

/// One vector tile layer of extent 4096. Each feature is its geometry type,
/// its properties and its rings of x,y pairs.
Uint8List tile(
  String layer,
  List<(int, Map<String, String>, List<List<int>>)> features,
) {
  final keys = <String>[];
  final values = <String>[];
  final body = <int>[..._field(1, layer.codeUnits)];
  for (final (type, props, rings) in features) {
    final tags = <int>[];
    for (final e in props.entries) {
      if (!keys.contains(e.key)) keys.add(e.key);
      if (!values.contains(e.value)) values.add(e.value);
      tags
        ..addAll(_varint(keys.indexOf(e.key)))
        ..addAll(_varint(values.indexOf(e.value)));
    }
    final geometry = <int>[];
    var cx = 0;
    var cy = 0;
    for (final ring in rings) {
      final count = ring.length ~/ 2;
      for (var i = 0; i < count; i++) {
        if (i == 0) geometry.addAll(_varint(1 << 3 | 1));
        if (i == 1) geometry.addAll(_varint((count - 1) << 3 | 2));
        geometry
          ..addAll(_varint(_zigzag(ring[i * 2] - cx)))
          ..addAll(_varint(_zigzag(ring[i * 2 + 1] - cy)));
        cx = ring[i * 2];
        cy = ring[i * 2 + 1];
      }
      if (type == _polygon) geometry.addAll(_varint(1 << 3 | 7));
    }
    body.addAll(
      _field(2, [
        ..._field(2, tags),
        ..._varint(3 << 3),
        type,
        ..._field(4, geometry),
      ]),
    );
  }
  for (final k in keys) {
    body.addAll(_field(3, k.codeUnits));
  }
  for (final v in values) {
    body.addAll(_field(4, _field(1, v.codeUnits)));
  }
  body
    ..addAll(_varint(5 << 3))
    ..addAll(_varint(4096))
    ..addAll(_varint(15 << 3))
    ..add(2);
  return Uint8List.fromList(_field(3, body));
}

BuiltTile build(List<Map<String, Object?>> layers, Uint8List bytes) =>
    TileBuilder(
      StyleSheet.compile({
        'version': 8,
        'sources': {
          'omt': {'type': 'vector', 'url': 'https://example.org/planet'},
        },
        'layers': [
          for (final l in layers) {'source': 'omt', ...l},
        ],
      }),
    ).build(bytes, 14);

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
          _line,
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
        (_polygon, {}, [square]),
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
          _line,
          {'class': 'motorway'},
          [
            [0, 0, 500, 0],
          ],
        ),
        (
          _line,
          {'class': 'street'},
          [
            [0, 100, 500, 100],
          ],
        ),
        (
          _line,
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
          _point,
          {},
          [
            [300, 400],
          ],
        ),
        (
          _point,
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
          _point,
          {'class': 'cafe', 'name': 'Machko'},
          [
            [300, 400],
          ],
        ),
        (
          _point,
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
          _line,
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
}
