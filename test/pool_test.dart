@TestOn('vm')
library;

import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style.dart';
import 'package:vmap/src/worker.dart';

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
        const TileSourceConfig(workers: 1),
        style: style,
        nameKeys: null,
        sheet: StyleSheet.compile(style),
        source: 0,
        onLoaded: (_, _) {},
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
}
