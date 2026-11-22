@TestOn('vm')
library;

import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/engine.dart';
import 'package:vmap/src/net/net.dart';
import 'package:vmap/src/options.dart';
import 'package:vmap/src/style/style.dart';
import 'package:vmap/src/text/glyphs/glyph_files.dart';
import 'package:vmap/src/text/glyphs/glyph_pbf.dart';

/// One font stack holding the glyph of `A`, ten wide.
final _range = Uint8List.fromList([
  0x0A, 0x06, 0x1A, 0x04, 0x08, 0x41, 0x38, 0x0A, //
]);

void main() {
  setUp(() => HttpOverrides.global = null);

  late Directory cache;
  late HttpServer server;
  late List<String> asked;
  late List<int> answer;
  late String template;

  setUp(() async {
    cache = await Directory.systemTemp.createTemp('vmap-glyphs');
    addTearDown(() => cache.delete(recursive: true));
    asked = [];
    answer = _range;
    server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
    addTearDown(() => server.close(force: true));
    server.listen((request) {
      asked.add(request.uri.path);
      request.response
        ..add(answer)
        ..close();
    });
    template =
        'http://127.0.0.1:${server.port}/fonts/{fontstack}/{range}.pbf?key=1';
  });

  String url(String stack, String range) => template
      .replaceAll('{fontstack}', Uri.encodeComponent(stack))
      .replaceAll('{range}', range);

  SharedFetches fetches() {
    final shared = SharedFetches()..kept = GlyphFiles(cache.path, template);
    addTearDown(shared.close);
    return shared;
  }

  Future<void> written(String path) async {
    final watch = Stopwatch()..start();
    while (!File(path).existsSync()) {
      if (watch.elapsed > const Duration(seconds: 5)) fail('not written');
      await Future<void>.delayed(const Duration(milliseconds: 10));
    }
  }

  test('the fixture is a glyph range', () {
    final glyph = GlyphPbf.parse(_range).single;
    expect((glyph.id, glyph.advance), (0x41, 10));
  });

  test('a glyph range is kept and not asked for on the next start', () async {
    final files = GlyphFiles(cache.path, template);
    final range = url('Noto Sans Regular,Noto Sans Arabic Regular', '0-255');
    final file = files.fileOf(range)!;
    expect(
      file,
      endsWith(
        '/Noto%20Sans%20Regular%2CNoto%20Sans%20Arabic'
        '%20Regular/0-255.pbf',
      ),
    );

    expect(await fetches().fetch(range), _range);
    await written(file);
    expect(asked, hasLength(1));

    await server.close(force: true);
    expect(await fetches().fetch(range), _range);
    expect(asked, hasLength(1));
  });

  test('what a server answers in a range\'s place is not kept', () async {
    answer = '<html>Sign in</html>'.codeUnits;
    final range = url('Noto Sans Regular', '0-255');
    expect(await fetches().fetch(range), answer);
    await Future<void>.delayed(const Duration(milliseconds: 100));
    expect(cache.listSync(), isEmpty);
  });

  test('a kept range that cannot be read is fetched again', () async {
    final range = url('Noto Sans Regular', '256-511');
    final file = File(GlyphFiles(cache.path, template).fileOf(range)!);
    file
      ..createSync(recursive: true)
      ..writeAsBytesSync(_range.sublist(0, 5));

    expect(await fetches().fetch(range), _range);
    expect(asked, hasLength(1));
    await Future<void>.delayed(const Duration(milliseconds: 100));
    expect(file.readAsBytesSync(), _range);
  });

  VmapEngine map() {
    final engine = VmapEngine(
      style: VmapStyle.json({
        'version': 8,
        'glyphs': template,
        'sources': {
          'places': {
            'type': 'geojson',
            'data': {'type': 'FeatureCollection', 'features': <Object?>[]},
          },
        },
        'layers': [
          {
            'id': 'names',
            'type': 'symbol',
            'source': 'places',
            'layout': {
              'text-field': ['get', 'name'],
              'text-font': ['Test Font'],
            },
          },
        ],
      }),
      network: VmapNetworkOptions(cacheDirectory: cache.path),
    );
    addTearDown(engine.dispose);
    return engine;
  }

  test('a map keeps the ranges its style\'s labels ask for', () async {
    final file = GlyphFiles(
      cache.path,
      template,
    ).fileOf(url('Test Font', '0-255'))!;
    map();
    await written(file);
    expect(asked, ['/fonts/Test%20Font/0-255.pbf']);

    final again = map();
    final watch = Stopwatch()..start();
    while (!again.styleLoaded || again.stats.busy) {
      if (watch.elapsed > const Duration(seconds: 5)) fail('still loading');
      await Future<void>.delayed(const Duration(milliseconds: 20));
    }
    expect(asked, hasLength(1));
  });

  test('a map whose cache is cleared asks for its ranges again', () async {
    final file = GlyphFiles(
      cache.path,
      template,
    ).fileOf(url('Test Font', '0-255'))!;
    final engine = map();
    await written(file);
    expect(asked, hasLength(1));

    await engine.clearCache();
    await written(file);
    expect(asked, hasLength(2));
  });

  test('only the style\'s glyph ranges are kept', () async {
    final files = GlyphFiles(cache.path, template);
    final base = 'http://127.0.0.1:${server.port}';
    expect(files.fileOf('$base/sprite.json'), isNull);
    expect(files.fileOf('$base/fonts/a/b/0-255.pbf?key=1'), isNull);
    expect(files.fileOf(url('..', '0-255')), isNot(contains('/../')));

    expect(await fetches().fetch('$base/sprite.json'), _range);
    await Future<void>.delayed(const Duration(milliseconds: 100));
    expect(cache.listSync(), isEmpty);
  });
}
