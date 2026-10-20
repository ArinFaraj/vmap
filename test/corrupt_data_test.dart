import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/glyphs/glyph_pbf.dart';
import 'package:vmap/src/mvt.dart';

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
}
