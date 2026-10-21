import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/mlt.dart';
import 'package:vmap/src/mvt.dart';
import 'package:vmap/src/style_model.dart';

// The tile is from MapLibre GL JS's render tests (BSD-3-Clause); the
// reference is what @maplibre/mlt 1.3.0 decodes it to, polygon rings
// without their closing point and a feature's points as one ring.
final _tile = File('test/support/mlt/14-8717-5679.mlt').readAsBytesSync();
final _reference = jsonDecode(
  utf8.decode(
    gzip.decode(
      File('test/support/mlt/14-8717-5679.json.gz').readAsBytesSync(),
    ),
  ),
) as List<Object?>;

Map<String, Object?> _feature(TileLayer layer, TileFeature f) {
  final tags = f.allTags(layer);
  final id = tags.remove(r'$id');
  final sink = GeometrySink();
  f.readGeometry(sink);
  return {
    'id': id,
    'type': f.type,
    'props': {
      for (final k in tags.keys.toList()..sort())
        k: switch (tags[k]) {
          final double d => (d * 1e4).round() / 1e4,
          final v => v,
        },
    },
    'rings': [
      for (var r = 0; r < sink.ringCount; r++)
        [
          for (var v = sink.ringStart(r); v < sink.ringEnd(r); v++)
            [sink.coords[v * 2].toInt(), sink.coords[v * 2 + 1].toInt()],
        ],
    ],
  };
}

void main() {
  test('a tile reads as MapLibre reads it', () {
    final layers = decodeMltTile(_tile);
    expect(layers.map((l) => l.name), [
      for (final l in _reference) (l as Map)['name'],
    ]);
    for (final (i, layer) in layers.indexed) {
      final expected = _reference[i] as Map<String, Object?>;
      expect(layer.extent, expected['extent'], reason: layer.name);
      final features = expected['features'] as List<Object?>;
      expect(layer.features, hasLength(features.length), reason: layer.name);
      for (final (j, f) in layer.features.indexed) {
        final want = features[j] as Map<String, Object?>;
        final props = {
          for (final e in (want['props'] as Map<String, Object?>).entries)
            e.key: switch (e.value) {
              final double d => (d * 1e4).round() / 1e4,
              final v => v,
            },
        };
        expect(_feature(layer, f), {
          ...want,
          'props': props,
        }, reason: '${layer.name} $j');
      }
    }
  });

  test('nested properties read as MapLibre reads them', () {
    // Encoded by @maplibre/mlt 1.3.0; the expected tags are its decoding.
    final layer = decodeMltTile(
      File('test/support/mlt/nested.mlt').readAsBytesSync(),
    ).single;
    final expected = jsonDecode(
      r'''[{"$id": 1, "name": "a", "tags": {"kind": "cafe", "open": true, "seats": 12, "rating": 4.5, "langs": ["en", "ku"]}, "rank": 3}, {"$id": 2, "name": "b", "rank": 7}, {"$id": 3, "name": "c", "tags": {"kind": "road", "lanes": -2, "nested": {"deep": {"x": 1}}, "empty": []}, "rank": 1}, {"$id": 4, "name": "d", "tags": ["plain", "list", 3], "rank": 2}]''',
    ) as List<Object?>;
    expect([for (final f in layer.features) f.allTags(layer)], expected);
  });

  test('a cut off tile is refused', () {
    expect(
      () => decodeMltTile(Uint8List.sublistView(_tile, 0, _tile.length ~/ 2)),
      throwsFormatException,
    );
  });

  test('a stream claiming more values than any tile holds is refused', () {
    // A layer "a" with a geometry column whose types stream claims 2^31
    // values.
    final block = [
      1,
      1,
      0x61,
      0x80,
      0x20,
      1,
      4,
      2,
      0x10,
      0,
      0x80,
      0x80,
      0x80,
      0x80,
      8,
      0,
    ];
    expect(
      () => decodeMltTile(Uint8List.fromList([block.length, ...block])),
      throwsFormatException,
    );
  });

  test('a source with "encoding": "mlt" is read as MLT', () {
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'mlt': {
          'type': 'vector',
          'encoding': 'mlt',
          'tiles': ['https://example.org/{z}/{x}/{y}.mlt'],
        },
        'mvt': {
          'type': 'vector',
          'tiles': ['https://example.org/{z}/{x}/{y}.pbf'],
        },
      },
      'layers': [
        {'id': 'a', 'type': 'fill', 'source': 'mlt', 'source-layer': 'a'},
        {'id': 'b', 'type': 'fill', 'source': 'mvt', 'source-layer': 'b'},
      ],
    });
    expect(
      [for (final s in sheet.sources) (s as TiledSource).mlt],
      [true, false],
    );
    expect(sheet.sources[0].signature, isNot(sheet.sources[1].signature));
  });
}
