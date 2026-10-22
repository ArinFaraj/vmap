@TestOn('vm')
library;

import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/tiles/net.dart';
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/options.dart';
import 'package:vmap/src/tiles/worker.dart';

Future<HttpServer> _serve(void Function(HttpRequest request) answer) async {
  final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
  server.listen(answer);
  addTearDown(() => server.close(force: true));
  return server;
}

Future<void> _until(bool Function() done) async {
  final watch = Stopwatch()..start();
  while (!done()) {
    if (watch.elapsed > const Duration(seconds: 5)) fail('timed out');
    await Future<void>.delayed(const Duration(milliseconds: 20));
  }
}

void main() {
  setUp(() => HttpOverrides.global = null);

  test(
    'a source that starts after failing no longer reports the failure',
    () async {
      var fail = true;
      final server = await _serve((request) {
        if (fail) {
          request.response.statusCode = 500;
        } else {
          request.response.write(
            '{"tiles":["http://127.0.0.1:1/{z}/{x}/{y}"],"maxzoom":3}',
          );
        }
        request.response.close();
      });
      final style = <String, Object?>{
        'version': 8,
        'sources': {
          'roads': {
            'type': 'vector',
            'url': 'http://127.0.0.1:${server.port}/tiles.json',
          },
        },
        'layers': [
          {
            'id': 'road',
            'type': 'line',
            'source': 'roads',
            'source-layer': 'road',
          },
        ],
      };
      final pool = TilePool(
        const VmapNetworkOptions(workers: 1),
        style: style,
        nameKeys: null,
        sheet: StyleSheet.compile(style),
        source: 0,
        onLoaded: (_, _) {},
        shared: SharedFetches().fetch,
        onFailed: (_, _) {},
      );
      addTearDown(pool.close);
      await _until(() => pool.startError != null);

      fail = false;
      pool.want(const []);
      await _until(() => pool.maxZoom == 3);
      expect(pool.startError, isNull);
    },
  );

  test('a tile set the server replaced is deleted from the cache', () async {
    const before = 'http://127.0.0.1:1/old/{z}/{x}/{y}';
    final server = await _serve((request) {
      request.response
        ..write('{"tiles":["http://127.0.0.1:1/new/{z}/{x}/{y}"]}')
        ..close();
    });
    final address = 'http://127.0.0.1:${server.port}/tiles.json';
    final cache = await Directory.systemTemp.createTemp('vmap-pool');
    addTearDown(() => cache.delete(recursive: true));
    File('${cache.path}/source-${cacheKey(address)}.txt')
        .writeAsStringSync('$before\n14');
    final stale = Directory('${cache.path}/tiles-${cacheKey(before)}/1/0')
      ..createSync(recursive: true);
    final style = <String, Object?>{
      'version': 8,
      'sources': {
        'roads': {'type': 'vector', 'url': address},
      },
      'layers': [
        {
          'id': 'road',
          'type': 'line',
          'source': 'roads',
          'source-layer': 'road',
        },
      ],
    };
    final pool = TilePool(
      VmapNetworkOptions(cacheDirectory: cache.path, workers: 1),
      style: style,
      nameKeys: null,
      sheet: StyleSheet.compile(style),
      source: 0,
      onLoaded: (_, _) {},
      shared: SharedFetches().fetch,
      onFailed: (_, _) {},
    );
    addTearDown(pool.close);
    await _until(() => !stale.parent.existsSync());
  });

  test('a cache name is the same in every run', () {
    expect(cacheKey(''), 'ztntfp');
    expect(cacheKey('https://tiles.example/{z}/{x}/{y}'), 'ihc08t');
  });
}
