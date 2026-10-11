import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style.dart';

StyleSheet _sheet(
  Object? coordinates, [
  Map<String, Object?> paint = const {},
]) => StyleSheet.compile({
  'version': 8,
  'sources': {
    'scan': {
      'type': 'image',
      'url': 'https://example.org/scan.png',
      'coordinates': coordinates,
    },
  },
  'layers': [
    {'id': 'scan', 'type': 'raster', 'source': 'scan', 'paint': paint},
  ],
});

void main() {
  test('an image source is one picture held by its four corners', () {
    final layer = _sheet([
      [-180, 85.0511],
      [0, 85.0511],
      [0, 0],
      [-180, 0],
    ]).rasters.single;
    expect(layer.picture, 'https://example.org/scan.png');
    expect(layer.tileJsonUrl, isNull);
    expect(layer.nearest, isFalse);
    final corners = layer.corners!;
    const want = [0, 0, 0.5, 0, 0.5, 0.5, 0, 0.5];
    for (var i = 0; i < 8; i++) {
      expect(corners[i], closeTo(want[i], 1e-5), reason: 'number $i');
    }
  });

  test('an image source without four corners is left out', () {
    expect(_sheet(null).rasters, isEmpty);
    expect(
      _sheet([
        [0, 0],
        [1, 1],
      ]).rasters,
      isEmpty,
    );
  });

  test('raster-resampling nearest keeps the pixels square', () {
    final layer = _sheet(
      [
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
      {'raster-resampling': 'nearest'},
    ).rasters.single;
    expect(layer.nearest, isTrue);
  });
}
