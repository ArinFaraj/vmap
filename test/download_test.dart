@TestOn('vm')
library;

import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/engine.dart';
import 'package:vmap/src/style/style.dart';
import 'package:vmap/src/options.dart';

void main() {
  setUp(() => HttpOverrides.global = null);

  test('a region is fetched into the cache once', () async {
    final asked = <String>[];
    final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
    addTearDown(() => server.close(force: true));
    server.listen((request) {
      asked.add(request.uri.path);
      request.response
        ..statusCode = request.uri.path == '/2/2/1' ? 500 : 200
        ..write('tile')
        ..close();
    });
    final cache = await Directory.systemTemp.createTemp('vmap-download');
    addTearDown(() => cache.delete(recursive: true));
    final engine = VmapEngine(
      style: VmapStyle.json({
        'version': 8,
        'sources': {
          'roads': {
            'type': 'vector',
            'tiles': ['http://127.0.0.1:${server.port}/{z}/{x}/{y}'],
            'maxzoom': 2,
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
      }),
      network: VmapNetworkOptions(cacheDirectory: cache.path),
    );
    addTearDown(engine.dispose);
    for (var i = 0; i < 100 && engine.backgroundColor == null; i++) {
      await Future<void>.delayed(const Duration(milliseconds: 20));
    }

    final steps = <int>[];
    final first = await engine.downloadRegion(
      west: 1,
      south: 1,
      east: 60,
      north: 60,
      minZoom: 0,
      maxZoom: 8,
      onProgress: (done, total) => steps.add(done),
    );
    // One tile at each of the source's three zooms, the deepest of which
    // fails. The source goes no deeper, so deeper map zooms add nothing.
    expect(first.tiles, 3);
    expect(first.fetched, 2);
    expect(first.failed, 1);
    expect(steps.last, 3);
    expect(asked.toSet(), {'/0/0/0', '/1/1/0', '/2/2/1'});

    asked.clear();
    final again = await engine.downloadRegion(
      west: 1,
      south: 1,
      east: 60,
      north: 60,
      minZoom: 0,
      maxZoom: 2,
    );
    expect(again.fetched, 0);
    expect(asked, ['/2/2/1']);
  });
}
