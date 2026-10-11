import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/raster.dart';

void main() {
  test('an even slope is shaded the same up to the edge of the tile', () {
    const size = 8;
    final pixels = Uint8List(size * size * 4);
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        // Terrarium heights rising 40 m per cell to the east.
        final metres = 32768 + x * 40;
        pixels[(y * size + x) * 4] = metres >> 8;
        pixels[(y * size + x) * 4 + 1] = metres & 255;
      }
    }
    final shaded = shadeHeights(pixels, size, size, true, 30, 1, 335, const [
      0, 0, 0, 1, //
      1, 1, 1, 1,
    ]);
    const ring = size + 2;
    expect(shaded, hasLength(ring * ring * 4));
    final middle = shaded[(4 * ring + 4) * 4 + 3];
    expect(middle, greaterThan(0));
    for (var i = 3; i < shaded.length; i += 4) {
      expect(shaded[i], middle, reason: 'cell ${i ~/ 4}');
    }
  });

  test('the edge is shaded with the heights of the tile beside it', () {
    const size = 8;
    Uint8List flat(int count) {
      final out = Uint8List(count * 4);
      for (var i = 0; i < count; i++) {
        out[i * 4] = 128;
      }
      return out;
    }

    final right = Uint8List(size * 2 * 4);
    for (var i = 0; i < size * 2; i++) {
      right[i * 4] = 129;
    }
    const colours = <double>[0, 0, 0, 1, 1, 1, 1, 1];
    final alone = shadeHeights(
      flat(size * size),
      size,
      size,
      true,
      30,
      1,
      335,
      colours,
    );
    final beside = shadeHeights(
      flat(size * size),
      size,
      size,
      true,
      30,
      1,
      335,
      colours,
      sides: [null, null, null, right],
    );
    const ring = size + 2;
    int alpha(Uint8List from, int x, int y) => from[(y * ring + x) * 4 + 3];
    expect(alpha(alone, size, 4), 0);
    expect(alpha(beside, size, 4), greaterThan(0));
    expect(alpha(beside, 2, 4), 0);
  });

  test('an accent colour tints steep ground under the shading', () {
    const size = 8;
    final pixels = Uint8List(size * size * 4);
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        final metres = 32768 + x * 40;
        pixels[(y * size + x) * 4] = metres >> 8;
        pixels[(y * size + x) * 4 + 1] = metres & 255;
      }
    }
    Uint8List shade(List<double> colours) =>
        shadeHeights(pixels, size, size, true, 30, 1, 335, colours);
    const two = <double>[0, 0, 0, 0.2, 1, 1, 1, 0.2];
    final plain = shade(two);
    final tinted = shade([...two, 1, 0, 0, 1]);
    const at = (4 * (size + 2) + 4) * 4;
    expect(tinted[at + 3], greaterThan(plain[at + 3]));
    expect(tinted[at], greaterThan(plain[at]));
    expect(tinted[at + 1], plain[at + 1]);
  });
}
