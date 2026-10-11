import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/cluster.dart';
import 'package:vmap/src/geojson.dart';
import 'package:vmap/src/mvt.dart';
import 'package:vmap/src/style.dart';

Map<String, Object?> _point(double lon, double lat, String name) => {
  'type': 'Feature',
  'properties': {'name': name},
  'geometry': {
    'type': 'Point',
    'coordinates': [lon, lat],
  },
};

final _data = {
  'type': 'FeatureCollection',
  'features': [
    _point(44.000, 36.000, 'a'),
    _point(44.001, 36.000, 'b'),
    _point(44.000, 36.001, 'c'),
    _point(10.000, 50.000, 'far'),
  ],
};

List<Map<String, Object?>> _shown(GeoJsonTiles tiles, int z) {
  final n = 1 << z;
  return [
    for (var x = 0; x < n; x++)
      for (var y = 0; y < n; y++)
        for (final layer in tiles.tile(z, x, y))
          for (final f in layer.features)
            if (_inside(f)) f.allTags(layer),
  ];
}

bool _inside(TileFeature f) {
  final sink = GeometrySink();
  f.readGeometry(sink);
  final x = sink.coords[0], y = sink.coords[1];
  return x >= 0 && x < 4096 && y >= 0 && y < 4096;
}

void main() {
  final tiles = GeoJsonTiles(_data, cluster: const ClusterOptions(maxZoom: 5));

  test('points close together are one cluster, the far one stays itself', () {
    final shown = _shown(tiles, 2);
    expect(shown, hasLength(2));
    final cluster = shown.firstWhere((p) => p['cluster'] == true);
    expect(cluster['point_count'], 3);
    expect(cluster['point_count_abbreviated'], 3);
    expect(shown.firstWhere((p) => p['cluster'] != true)['name'], 'far');
  });

  test('past the deepest clustered zoom every point is drawn', () {
    final names = [for (final p in _shown(tiles, 6)) p['name']]..sort();
    expect(names, ['a', 'b', 'c', 'far']);
  });

  test('every zoom accounts for every point', () {
    final clusters = PointClusters([
      for (var i = 0; i < 500; i++)
        ClusterPoint((i * 37 % 500) / 500, (i * 91 % 500) / 500, 1, const {}),
    ], const ClusterOptions(maxZoom: 8));
    for (var z = 0; z <= 9; z++) {
      final total = clusters.at(z).fold(0, (sum, p) => sum + p.count);
      expect(total, 500, reason: 'zoom $z');
    }
    expect(clusters.at(0).length, lessThan(clusters.at(9).length));
  });

  test('a style source asks for clusters with the MapLibre options', () {
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'mine': {
          'type': 'geojson',
          'data': _data,
          'cluster': true,
          'clusterRadius': 30,
          'clusterMaxZoom': 12,
        },
      },
      'layers': [
        {'id': 'dots', 'type': 'circle', 'source': 'mine'},
      ],
    });
    final options = sheet.sources.single.cluster!;
    expect(options.radius, 30);
    expect(options.maxZoom, 12);
    expect(options.minPoints, 2);
  });

  test('a cluster adds up what its points carry', () {
    final counted = GeoJsonTiles(
      _data,
      cluster: const ClusterOptions(
        maxZoom: 5,
        properties: {
          'weight': [
            '+',
            [
              'case',
              [
                '==',
                ['get', 'name'],
                'a',
              ],
              5,
              1,
            ],
          ],
          'names': [
            [
              'concat',
              ['accumulated'],
              ['get', 'names'],
            ],
            ['get', 'name'],
          ],
        },
      ),
    );
    for (final z in [0, 2, 5]) {
      final cluster = _shown(
        counted,
        z,
      ).firstWhere((p) => p['cluster'] == true);
      expect(cluster['weight'], 7, reason: 'zoom $z');
      expect(('${cluster['names']}'.split('')..sort()).join(), 'abc');
    }
  });

  test('a source reads its cluster properties', () {
    final sheet = StyleSheet.compile({
      'version': 8,
      'sources': {
        'mine': {
          'type': 'geojson',
          'data': _data,
          'cluster': true,
          'clusterProperties': {
            'most': [
              'max',
              ['get', 'size'],
            ],
          },
        },
      },
      'layers': [
        {'id': 'dots', 'type': 'circle', 'source': 'mine'},
      ],
    });
    expect(sheet.sources.single.cluster!.properties.keys, ['most']);
  });
}
