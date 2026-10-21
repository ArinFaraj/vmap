import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/canvas/raster.dart';
import 'package:vmap/src/style/raster_style.dart';
import 'package:vmap/src/style/style_model.dart';

void main() {
  test('heights take the ramp blended between its stops, held at its ends', () {
    // Mapbox Terrain-RGB: 0.1 m a step from -10000 m.
    Uint8List pixel(double metres) {
      final v = ((metres + 10000) * 10).round();
      return Uint8List.fromList([v >> 16, v >> 8 & 255, v & 255, 255]);
    }

    final pixels = Uint8List.fromList([
      for (final m in const <double>[-50, 0, 50, 100, 500]) ...pixel(m),
    ]);
    final out = colorHeights(
      pixels,
      5,
      1,
      DemEncoding.mapbox,
      Float64List.fromList([0, 100]),
      Float64List.fromList([1, 0, 0, 1, 0, 0, 1, 1]),
    );
    expect(out, [
      255, 0, 0, 255, //
      255, 0, 0, 255,
      128, 0, 128, 255,
      0, 0, 255, 255,
      0, 0, 255, 255,
    ]);
  });

  test('a color-relief layer reads its ramp and the source encoding', () {
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'dem': {
          'type': 'raster-dem',
          'tiles': ['https://example.com/{z}/{x}/{y}.png'],
          'encoding': 'terrarium',
        },
      },
      'layers': [
        {
          'id': 'relief',
          'type': 'color-relief',
          'source': 'dem',
          'paint': {
            'color-relief-color': [
              'interpolate', ['linear'], ['elevation'], //
              0, 'black', 1000, 'rgba(255, 255, 255, 0.5)',
            ],
          },
        },
      ],
    });
    final layer = sheet.rasters.single as ColorReliefLayer;
    expect(layer.encoding, same(DemEncoding.terrarium));
    expect(layer.elevations, [0, 1000]);
    expect(layer.colors, [0, 0, 0, 1, 0.5, 0.5, 0.5, 0.5]);
    expect(sheet.runs.single.raster, 0);
  });
}
