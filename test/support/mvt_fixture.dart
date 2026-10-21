import 'dart:typed_data';

import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/tiles/tile_builder.dart';

/// Geometry types of a vector tile feature.
const point = 1;
const line = 2;
const polygon = 3;

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
      if (type == polygon) geometry.addAll(_varint(1 << 3 | 7));
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

BuiltTile build(
  List<Map<String, Object?>> layers,
  Uint8List bytes, {
  bool gpu = false,
}) => TileBuilder(
  StyleSheet.compile({
    'version': 8,
    'sources': {
      'omt': {'type': 'vector', 'url': 'https://example.org/planet'},
    },
    'layers': [
      for (final l in layers) {'source': 'omt', ...l},
    ],
  }),
  gpu: gpu,
).build(bytes, 14);
