@TestOn('vm')
library;

import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/engine.dart';
import 'package:vmap/src/errors.dart';
import 'package:vmap/src/tiles/net.dart';
import 'package:vmap/src/style/style.dart';
import 'package:vmap/src/options.dart';

Future<HttpServer> serve(void Function(HttpRequest request) answer) async {
  final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
  server.listen(answer);
  addTearDown(() => server.close(force: true));
  return server;
}

void main() {
  setUp(() => HttpOverrides.global = null);

  test('a source keeps every address it lists and spells out {s}', () {
    expect(tileTemplate(null), isNull);
    expect(tileTemplate(const <Object>[]), isNull);
    expect(
      tileTemplate(const ['https://one/{z}/{x}/{y}']),
      'https://one/{z}/{x}/{y}',
    );
    expect(tileTemplate(const ['https://{s}.tiles/{z}/{x}/{y}'])!.split(' '), [
      'https://a.tiles/{z}/{x}/{y}',
      'https://b.tiles/{z}/{x}/{y}',
      'https://c.tiles/{z}/{x}/{y}',
    ]);
  });

  test('tiles are spread over the addresses, each with the rest behind it', () {
    const template = 'https://a/{z}/{x}/{y} https://b/{z}/{x}/{y}';
    expect(tileUrls(template, 5, 2, 2), ['https://a/5/2/2', 'https://b/5/2/2']);
    expect(tileUrls(template, 5, 3, 2), ['https://b/5/3/2', 'https://a/5/3/2']);
    expect(tileUrls('https://a/{z}/{x}/{y}', 1, 0, 1), ['https://a/1/0/1']);
  });

  test('a tile comes from the next address when one fails', () async {
    final asked = <String>[];
    final bad = await serve((request) {
      asked.add('bad');
      request.response
        ..statusCode = 503
        ..close();
    });
    final good = await serve((request) {
      asked.add('good ${request.headers.value('x-key')}');
      request.response
        ..write('tile')
        ..close();
    });
    final client = Net();
    addTearDown(client.close);
    final template =
        'http://127.0.0.1:${bad.port}/{z}/{x}/{y} '
        'http://127.0.0.1:${good.port}/{z}/{x}/{y}';
    final (url, response) = await getTile(client, template, 3, 1, 1, const {
      'x-key': 'secret',
    });
    expect(response.status, 200);
    expect(utf8.decode(response.bytes), 'tile');
    expect(url, 'http://127.0.0.1:${good.port}/3/1/1');
    expect(asked, ['bad', 'good secret']);
  });

  test('the answer of the last address stands when all fail', () async {
    final bad = await serve((request) {
      request.response
        ..statusCode = 503
        ..close();
    });
    final client = Net();
    addTearDown(client.close);
    final (_, response) = await getTile(
      client,
      'http://127.0.0.1:${bad.port}/{z}/{x}/{y}',
      3,
      1,
      1,
      const {},
    );
    expect(response.status, 503);
  });

  test(
    'the style is asked for with the headers, and a failure is told',
    () async {
      var fail = true;
      final keys = <String?>[];
      final server = await serve((request) {
        keys.add(request.headers.value('authorization'));
        if (fail) {
          request.response.statusCode = 500;
        } else {
          request.response.write('{"version":8,"sources":{},"layers":[]}');
        }
        request.response.close();
      });
      final cache = await Directory.systemTemp.createTemp('vmap-net');
      addTearDown(() => cache.delete(recursive: true));
      final errors = <Object>[];
      final loaded = Completer<void>();
      final engine =
          VmapEngine(
              style: VmapStyle.url(
                'http://127.0.0.1:${server.port}/style.json',
              ),
              network: VmapNetworkOptions(
                cacheDirectory: cache.path,
                headers: const {'authorization': 'Bearer token'},
              ),
            )
            ..onError = (e) {
              if (e.kind != VmapErrorKind.style) return;
              errors.add(e);
              if (!loaded.isCompleted) loaded.complete();
            };
      addTearDown(engine.dispose);
      await loaded.future.timeout(const Duration(seconds: 5));
      expect(keys, ['Bearer token']);
      expect((errors.single as VmapError).cause, isA<HttpFailure>());
      expect(engine.error, isNotNull);

      fail = false;
      engine.reload();
      await _until(() => cache.listSync().isNotEmpty);
      expect(engine.error, isNull);

      File('${cache.path}/mine.txt').writeAsStringSync('keep');
      Directory('${cache.path}/raster-abc/1').createSync(recursive: true);
      await engine.clearCache();
      final left = [
        for (final entry in cache.listSync())
          if (!entry.path.contains('style-')) entry.uri.pathSegments.last,
      ];
      expect(left, ['mine.txt']);
    },
  );
}

Future<void> _until(bool Function() done) async {
  final watch = Stopwatch()..start();
  while (!done()) {
    if (watch.elapsed > const Duration(seconds: 5)) fail('timed out');
    await Future<void>.delayed(const Duration(milliseconds: 20));
  }
}
