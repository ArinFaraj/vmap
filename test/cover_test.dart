import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style.dart';

void main() {
  test('a source has only the tiles inside its bounds and zooms', () {
    final cover = TileCover.of({
      'minzoom': 4,
      'bounds': [42.0, 34.0, 47.0, 38.0],
    });
    expect(cover.has(3, 4, 3), isFalse);
    // Erbil at zoom 10 is tile 637, 400.
    expect(cover.has(10, 637, 400), isTrue);
    expect(cover.has(10, 600, 400), isFalse);
    expect(cover.has(10, 637, 300), isFalse);
    expect(cover.has(4, 9, 6), isTrue);
    expect(const TileCover().has(0, 0, 0), isTrue);
  });

  test('a TMS source numbers its rows from the south', () {
    final cover = TileCover.of({'scheme': 'tms'});
    expect(cover.row(3, 0), 7);
    expect(cover.row(3, 7), 0);
    expect(const TileCover().row(3, 2), 2);
  });

  test('the style keeps what its sources say about their tiles', () {
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'roads': {
          'type': 'vector',
          'tiles': ['https://example.com/{z}/{x}/{y}.pbf'],
          'minzoom': 5,
          'scheme': 'tms',
          'attribution': 'Roads by us',
        },
        'photos': {
          'type': 'raster',
          'tiles': ['https://example.com/{z}/{x}/{y}.png'],
          'bounds': [42, 34, 47, 38],
          'attribution': 'Roads by us',
        },
      },
      'layers': [
        {'id': 'photos', 'type': 'raster', 'source': 'photos'},
        {
          'id': 'roads',
          'type': 'line',
          'source': 'roads',
          'source-layer': 'road',
        },
      ],
    });
    expect(sheet.sources.single.cover.minZoom, 5);
    expect(sheet.sources.single.cover.tms, isTrue);
    expect(sheet.rasters.single.cover.bounds, [42, 34, 47, 38]);
    expect(sheet.attributions, ['Roads by us']);
  });
}
