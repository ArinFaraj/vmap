import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/geojson.dart';
import 'package:vmap/src/labels/glyphs/glyph_pbf.dart';
import 'package:vmap/src/tiles/mvt.dart';
import 'package:vmap/src/style/style_model.dart';

/// A field of wire type 2 with tag [tag] whose length is ten bytes of 0xff:
/// past 64 bits, it reads back negative.
Uint8List _overflowingLength(int tag) =>
    Uint8List.fromList([tag, ...List.filled(9, 0xff), 0x7f, 1, 2, 3]);

void main() {
  test('a tile whose length overflows is refused, not read forever', () {
    expect(
      () => MvtTile.decode(_overflowingLength(0x1a)),
      throwsFormatException,
    );
  });

  test('a tile with a varint over ten bytes is refused', () {
    expect(
      () => MvtTile.decode(Uint8List.fromList([...List.filled(11, 0xff), 0])),
      throwsFormatException,
    );
  });

  test('a length past the end of its message is refused', () {
    expect(
      () => MvtTile.decode(Uint8List.fromList([0x1a, 100, 0x0a, 1, 0x61])),
      throwsFormatException,
    );
  });

  test('a glyph sheet whose length overflows is refused', () {
    expect(
      () => GlyphPbf.parse(_overflowingLength(0x0a)),
      throwsFormatException,
    );
  });

  test('a GeoJSON position that is not two numbers is passed over', () {
    final layers = GeoJsonTiles({
      'type': 'MultiPoint',
      'coordinates': [
        ['a', 'b'],
        [1.0, 1.0],
      ],
    }).tile(0, 0, 0);
    expect(layers.single.features, hasLength(1));
  });

  test('a style with parts of the wrong kind compiles what it can', () {
    const line = {
      'id': 'roads',
      'type': 'line',
      'source': 'tiles',
      'source-layer': 'roads',
    };
    final styles = <Map<String, Object?>>[
      {'version': 8, 'sources': <Object?>[], 'layers': 'x'},
      {
        'version': 8,
        'glyphs': <Object?>['x'],
        'layers': <Object?>[],
      },
      {
        'version': 8,
        'sources': {
          'tiles': {
            'type': 'vector',
            'url': <String, Object?>{},
            'maxzoom': double.nan,
          },
        },
        'layers': [
          {
            ...line,
            'paint': <Object?>['match'],
            'layout': 'x',
          },
          {
            ...line,
            'filter': ['==', 'x', double.nan],
          },
        ],
      },
    ];
    for (final style in styles) {
      expect(() => StyleSheet.compile(style), returnsNormally);
    }
    expect(StyleSheet.compile(styles.last).buckets, isNotEmpty);
  });
}
