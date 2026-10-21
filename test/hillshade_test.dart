import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/canvas/raster.dart';

ShadeLight light({int method = 0, List<double> accent = const [0, 0, 0, 1]}) =>
    ShadeLight(
      method: method,
      intensity: 0.5,
      zoom: 12,
      north: 0,
      south: 0,
      accent: accent,
      lights: const [
        335 * 3.141592653589793 / 180, 45 * 3.141592653589793 / 180, //
        0, 0, 0, 1, // shadow
        1, 1, 1, 1, // highlight
      ],
    );

/// Terrarium heights rising [rise] metres per cell to the east.
Uint8List slope(int size, int rise) {
  final pixels = Uint8List(size * size * 4);
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      final metres = 32768 + x * rise;
      pixels[(y * size + x) * 4] = metres >> 8;
      pixels[(y * size + x) * 4 + 1] = metres & 255;
    }
  }
  return pixels;
}

void main() {
  test('an even slope is shaded the same up to the edge of the tile', () {
    const size = 8;
    final shaded = shadeHeights(slope(size, 40), size, size, true, light());
    const ring = size + 2;
    expect(shaded, hasLength(ring * ring * 4));
    final middle = shaded[(4 * ring + 4) * 4 + 3];
    expect(middle, greaterThan(0));
    for (var i = 3; i < shaded.length; i += 4) {
      expect(shaded[i], middle, reason: 'cell ${i ~/ 4}');
    }
  });

  test('flat ground is clear', () {
    const size = 8;
    final shaded = shadeHeights(slope(size, 0), size, size, true, light());
    for (var i = 3; i < shaded.length; i += 4) {
      expect(shaded[i], 0);
    }
  });

  test('the edge is shaded with the heights of the tile beside it', () {
    const size = 8;
    final right = Uint8List(size * 2 * 4);
    for (var i = 0; i < size * 2; i++) {
      right[i * 4] = 129;
    }
    final flat = slope(size, 0);
    final alone = shadeHeights(flat, size, size, true, light());
    final beside = shadeHeights(
      flat,
      size,
      size,
      true,
      light(),
      sides: [null, null, null, right],
    );
    const ring = size + 2;
    int alpha(Uint8List from, int x, int y) => from[(y * ring + x) * 4 + 3];
    expect(alpha(alone, size, 4), 0);
    expect(alpha(beside, size, 4), greaterThan(0));
    expect(alpha(beside, 2, 4), 0);
  });

  test('the accent colour tints steep ground', () {
    const size = 8;
    final pixels = slope(size, 40);
    final black = shadeHeights(pixels, size, size, true, light());
    final red = shadeHeights(
      pixels,
      size,
      size,
      true,
      light(accent: const [1, 0, 0, 1]),
    );
    const at = (4 * (size + 2) + 4) * 4;
    expect(red[at], greaterThan(black[at]));
  });

  test('every method shades a slope', () {
    const size = 8;
    for (var method = 0; method < ShadeLight.methods.length; method++) {
      final shaded = shadeHeights(
        slope(size, 40),
        size,
        size,
        true,
        light(method: method),
      );
      expect(
        shaded[(4 * (size + 2) + 4) * 4 + 3],
        greaterThan(0),
        reason: ShadeLight.methods[method],
      );
    }
  });
}
