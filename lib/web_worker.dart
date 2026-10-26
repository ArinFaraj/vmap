/// The other half of [VmapEngine.useWebWorker]: what the worker script runs.
///
/// A browser gives Dart one thread, so without a worker tiles are built and
/// label glyphs drawn on the page's own. `tool/build_web_worker.dart` compiles this into the
/// `assets/vmap_worker.js` vmap ships. Only a web build can import this
/// library.
library;

import 'dart:async';
import 'dart:js_interop';

import 'package:web/web.dart' as web;

import 'src/platform/web_codec.dart';
import 'src/raster/raster_dem.dart' show ShadeWorker, shadeWorkerMain;
import 'src/text/glyphs/glyph_raster.dart'
    show GlyphRasterWorker, glyphWorkerMain;
import 'src/tiles/worker.dart' show tileWorkerMain;

/// Builds tiles, draws label glyphs or shades heights for the page that
/// started this worker, as the first message it is sent asks.
void runVmapWorker() {
  final scope = globalContext as web.DedicatedWorkerGlobalScope;
  StreamController<Object?>? inbox;
  scope.onmessage = ((web.MessageEvent event) {
    final message = decodeMessage(event.data);
    final open = inbox;
    if (open != null) return open.add(message);
    final box = inbox = StreamController<Object?>();
    scope.postMessage(null);
    final init = message! as List<Object?>;
    final main = switch (init.isEmpty ? null : init[0]) {
      GlyphRasterWorker.glyphWorkerTag => glyphWorkerMain,
      ShadeWorker.tag => shadeWorkerMain,
      _ => tileWorkerMain,
    };
    unawaited(
      main(init, (answer) {
        final moved = <JSObject>[];
        scope.postMessage(encodeMessage(answer, moved), moved.toJS);
      }, box.stream),
    );
  }).toJS;
}
