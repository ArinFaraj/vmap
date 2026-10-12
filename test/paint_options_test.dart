import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/geojson.dart';
import 'package:vmap/src/raster_style.dart';
import 'package:vmap/src/style_model.dart';

Map<String, Object?> _point(Object? id, String code) => {
  'type': 'Feature',
  'id': ?id,
  'properties': {'code': code},
  'geometry': {
    'type': 'Point',
    'coordinates': [10.0, 10.0],
  },
};

void main() {
  test('a raster layer left alone has no colour filter', () {
    expect(rasterColorMatrix(0, 0, 0, 0, 1), [
      for (var row = 0; row < 3; row++)
        for (var col = 0; col < 5; col++)
          row == col ? closeTo(1, 1e-9) : closeTo(0, 1e-9),
      0, 0, 0, 1, 0, //
    ]);
  });

  test('no saturation makes every channel the mean of the three', () {
    final m = rasterColorMatrix(0, -1, 0, 0, 1);
    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
        expect(m[row * 5 + col], closeTo(1 / 3, 1e-9));
      }
    }
  });

  test('brightness squeezes colours between its two ends', () {
    final m = rasterColorMatrix(0, 0, 0, 0.2, 0.6);
    expect(m[0], closeTo(0.4, 1e-9));
    expect(m[4], closeTo(0.2 * 255, 1e-9));
  });

  test('a raster layer reads its colour options and translate is kept', () {
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'photos': {
          'type': 'raster',
          'tiles': ['https://example.org/{z}/{x}/{y}.png'],
        },
        'mine': {'type': 'geojson', 'data': _point(1, 'a')},
      },
      'layers': [
        {
          'id': 'photos',
          'type': 'raster',
          'source': 'photos',
          'paint': {'raster-saturation': -0.5},
        },
        {
          'id': 'dots',
          'type': 'circle',
          'source': 'mine',
          'paint': {
            'circle-translate': [4, -6],
          },
        },
      ],
    });
    final context = EvalContext();
    expect(
      (sheet.rasters.single as PictureTileLayer).adjust!.filter(context),
      isNotNull,
    );
    expect(sheet.layers.single.translate!(context), [4, -6]);
  });

  test('features are numbered or named by a property when asked', () {
    final data = {
      'type': 'FeatureCollection',
      'features': [_point(null, 'a'), _point(50, 'b')],
    };
    Object? idOf(GeoJsonTiles tiles, int index) {
      final layer = tiles.tile(0, 0, 0).single;
      return layer.features[index].allTags(layer)[r'$id'];
    }

    final own = GeoJsonTiles(data);
    expect(idOf(own, 0), isNull);
    expect(idOf(own, 1), 50);
    final numbered = GeoJsonTiles(data, generateId: true);
    expect(idOf(numbered, 0), 0);
    expect(idOf(numbered, 1), 1);
    final named = GeoJsonTiles(data, promoteId: 'code');
    expect(idOf(named, 0), 'a');
    expect(idOf(named, 1), 'b');
  });

  test('a vector source names the id property per source layer', () {
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'base': {
          'type': 'vector',
          'url': 'https://example.org/planet',
          'promoteId': {'roads': 'osm_id'},
        },
      },
      'layers': [
        {
          'id': 'roads',
          'type': 'line',
          'source': 'base',
          'source-layer': 'roads',
        },
      ],
    });
    expect(sheet.sources.single.idKey('roads'), 'osm_id');
    expect(sheet.sources.single.idKey('water'), isNull);
  });
}
