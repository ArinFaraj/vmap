@TestOn('vm')
library;

import 'dart:async';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/options.dart';
import 'package:vmap/src/raster.dart';
import 'package:vmap/src/raster_style.dart';

/// A PNG of [size] pixels filled with [color].
Future<List<int>> _png(int size, ui.Color color) async {
  final recorder = ui.PictureRecorder();
  ui.Canvas(recorder).drawColor(color, ui.BlendMode.src);
  final image = await recorder.endRecording().toImage(size, size);
  final data = await image.toByteData(format: ui.ImageByteFormat.png);
  image.dispose();
  return data!.buffer.asUint8List();
}

Future<HttpServer> _serve(List<int> body) async {
  final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
  server.listen((request) {
    request.response
      ..add(body)
      ..close();
  });
  addTearDown(() => server.close(force: true));
  return server;
}

/// Paints [drawing] over the world at zoom 0 until it has loaded, and
/// returns how many times it said so.
Future<int> _paintUntilLoaded(
  RasterDrawing drawing,
  Completer<void> loaded,
) async {
  final context = EvalContext()..zoom = 0;
  for (var i = 0; i < 50 && !loaded.isCompleted; i++) {
    final recorder = ui.PictureRecorder();
    drawing.paint(
      ui.Canvas(recorder),
      context,
      0,
      ui.Offset.zero,
      const ui.Size(256, 256),
    );
    recorder.endRecording().dispose();
    await Future<void>.delayed(const Duration(milliseconds: 50));
  }
  return loaded.isCompleted ? 1 : 0;
}

RasterDrawing _drawing(RasterLayer layer, Completer<void> loaded) {
  final drawing = RasterDrawing.of(
    layer,
    config: const VmapNetworkOptions(userAgent: 'test'),
    onLoaded: () {
      if (!loaded.isCompleted) loaded.complete();
    },
  );
  addTearDown(drawing.close);
  return drawing;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() => HttpOverrides.global = null);

  test('each kind of raster layer gets its own drawing', () {
    Object? opacity(EvalContext _) => 1;
    RasterDrawing of(RasterLayer layer) => _drawing(layer, Completer());
    final tiled = PictureTileLayer(
      minZoom: 0,
      maxZoom: 24,
      opacity: opacity,
      tileJsonUrl: null,
      tiles: null,
      tileSize: 256,
      sourceMaxZoom: 0,
    );
    expect(of(tiled), isA<PictureTiles>());
    expect(
      of(
        HillshadeLayer(
          minZoom: 0,
          maxZoom: 24,
          opacity: opacity,
          tileJsonUrl: null,
          tiles: null,
          tileSize: 256,
          sourceMaxZoom: 0,
          relief: ReliefPaint(
            terrarium: true,
            exaggeration: opacity,
            shadow: opacity,
            highlight: opacity,
            direction: 335,
          ),
        ),
      ),
      isA<ShadedTiles>(),
    );
  });

  test('a picture tile is fetched and drawn', () async {
    final server = await _serve(await _png(256, const ui.Color(0xFF3366CC)));
    final loaded = Completer<void>();
    final drawing = _drawing(
      PictureTileLayer(
        minZoom: 0,
        maxZoom: 24,
        opacity: (_) => 1,
        tileJsonUrl: null,
        tiles: 'http://127.0.0.1:${server.port}/{z}/{x}/{y}.png',
        tileSize: 256,
        sourceMaxZoom: 0,
      ),
      loaded,
    );
    expect(await _paintUntilLoaded(drawing, loaded), 1);
  });

  test('a tile of heights is fetched and shaded', () async {
    final server = await _serve(await _png(16, const ui.Color(0xFF800000)));
    final loaded = Completer<void>();
    final drawing = _drawing(
      HillshadeLayer(
        minZoom: 0,
        maxZoom: 24,
        opacity: (_) => 1,
        tileJsonUrl: null,
        tiles: 'http://127.0.0.1:${server.port}/{z}/{x}/{y}.png',
        tileSize: 256,
        sourceMaxZoom: 0,
        relief: ReliefPaint(
          terrarium: true,
          exaggeration: (_) => 0.5,
          shadow: (_) => '#000000',
          highlight: (_) => '#ffffff',
          direction: 335,
        ),
      ),
      loaded,
    );
    expect(await _paintUntilLoaded(drawing, loaded), 1);
  });
}
