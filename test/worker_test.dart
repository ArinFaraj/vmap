@TestOn('vm')
library;

import 'dart:async';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/mercator.dart';
import 'package:vmap/src/style.dart';
import 'package:vmap/src/tile_builder.dart';
import 'package:vmap/src/worker.dart';

import 'support/mvt_fixture.dart';

Map<String, Object?> _place(double lon, double lat, String name) => {
  'type': 'Feature',
  'properties': {'name': name},
  'geometry': {
    'type': 'Point',
    'coordinates': [lon, lat],
  },
};

Map<String, Object?> _style(Map<String, Object?> source, String layer) => {
  'version': 8,
  'sources': {'data': source},
  'layers': [
    {'id': 'dots', 'type': 'circle', 'source': 'data', 'source-layer': layer},
  ],
};

TilePool _pool(
  Map<String, Object?> style, {
  TileLoaded? onLoaded,
  TileFailed? onFailed,
}) {
  final pool = TilePool(
    const TileSourceConfig(workers: 1),
    style: style,
    nameKeys: null,
    sheet: StyleSheet.compile(style),
    source: 0,
    onLoaded: onLoaded ?? (_, _) {},
    onFailed: onFailed ?? (_, _) {},
  );
  addTearDown(pool.close);
  return pool;
}

void main() {
  setUp(() => HttpOverrides.global = null);

  final clustered = _style({
    'type': 'geojson',
    'cluster': true,
    'clusterMaxZoom': 5,
    'data': {
      'type': 'FeatureCollection',
      'features': [
        _place(44.000, 36.000, 'a'),
        _place(44.001, 36.000, 'b'),
        _place(44.000, 36.001, 'c'),
        _place(10.000, 50.000, 'far'),
      ],
    },
  }, '');
  const z = 2;
  final n = 1 << z;
  final x = tileColumn(44, z), y = tileRow(36, z);
  final px = (worldX(44) * n - x) * tileExtent;
  final py = (worldY(36) * n - y) * tileExtent;

  test('a worker builds the tile it is asked for', () async {
    final built = Completer<(TileId, BuiltTile)>();
    final pool = _pool(
      clustered,
      onLoaded: (id, tile) => built.complete((id, tile)),
    );
    pool.want([TileId(z, x, y)]);
    final (id, tile) = await built.future.timeout(const Duration(seconds: 5));
    expect(id, TileId(z, x, y));
    expect(tile.meshes, isNotEmpty);
  });

  test('a lookup finds what is drawn at a point and in a box', () async {
    final pool = _pool(clustered);
    final near = await pool.query(TileId(z, x, y), px, py, 64, z.toDouble());
    expect(near, hasLength(1));
    expect(near.single.layers, ['dots']);
    expect(near.single.properties['point_count'], 3);

    final boxed = await pool.query(
      TileId(z, x, y),
      px,
      py,
      0,
      z.toDouble(),
      box: (64, 64),
    );
    expect(boxed, hasLength(1));
    final away = await pool.query(TileId(z, x, y), 10, 10, 4, z.toDouble());
    expect(away, isEmpty);
  });

  test('a cluster answers its zoom, its children and its points', () async {
    final pool = _pool(clustered);
    final hit = (await pool.query(
      TileId(z, x, y),
      px,
      py,
      64,
      z.toDouble(),
    )).single;
    final id = hit.properties['cluster_id']! as int;

    expect(await pool.clusterZoom(id), isNotNull);
    expect(await pool.clusterMembers(ClusterQuestion.children, id), isNotEmpty);
    final leaves = await pool.clusterMembers(
      ClusterQuestion.leaves,
      id,
      limit: 10,
    );
    final names = [for (final leaf in leaves) leaf.props['name']]..sort();
    expect(names, ['a', 'b', 'c']);
    expect(
      await pool.clusterMembers(ClusterQuestion.leaves, id, limit: 2),
      hasLength(2),
    );
  });

  test('a cluster that does not exist answers nothing', () async {
    final pool = _pool(clustered);
    expect(await pool.clusterZoom(999999), isNull);
    expect(
      await pool.clusterMembers(ClusterQuestion.leaves, 999999, limit: 10),
      isEmpty,
    );
  });

  test('a tile from the network is built, and a refused one is told', () async {
    final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
    addTearDown(() => server.close(force: true));
    server.listen((request) {
      if (request.uri.path == '/1/0/0') {
        request.response.add(
          tile('roads', [
            (
              point,
              {'name': 'here'},
              [
                [100, 100],
              ],
            ),
          ]),
        );
      } else {
        request.response.statusCode = 500;
      }
      request.response.close();
    });
    final loaded = <TileId>[];
    final failed = <TileId>[];
    final pool = _pool(
      _style({
        'type': 'vector',
        'tiles': ['http://127.0.0.1:${server.port}/{z}/{x}/{y}'],
      }, 'roads'),
      onLoaded: (id, _) => loaded.add(id),
      onFailed: (id, _) => failed.add(id),
    );
    pool.want(const [TileId(1, 0, 0), TileId(1, 1, 0)]);
    final watch = Stopwatch()..start();
    while (loaded.isEmpty || failed.isEmpty) {
      if (watch.elapsed > const Duration(seconds: 5)) fail('timed out');
      await Future<void>.delayed(const Duration(milliseconds: 20));
    }
    expect(loaded, [const TileId(1, 0, 0)]);
    expect(failed, [const TileId(1, 1, 0)]);
  });
}
