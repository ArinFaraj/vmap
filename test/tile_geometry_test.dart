@TestOn('vm')
library;

import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/net/net.dart';
import 'package:vmap/src/options.dart';
import 'package:vmap/src/render/map_renderer.dart';
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/tiles/built_tile.dart';
import 'package:vmap/src/tiles/gpu_stream.dart';
import 'package:vmap/src/tiles/tile_id.dart';
import 'package:vmap/src/tiles/tiles.dart';
import 'package:vmap/src/tiles/worker.dart';

/// Makes a tile ready at once, and can make one ready again while its
/// stream is held, as the GPU renderer does.
class _Renderer extends MapRenderer {
  @override
  bool supports(StyleSheet sheet) => true;

  @override
  bool paint(ui.Canvas canvas, RenderFrame frame) => false;

  @override
  bool makeReady(LoadedTile tile, double scale, Stopwatch clock, int deadline) {
    return true;
  }

  @override
  bool canBuild(LoadedTile tile) => tile.gpu?.held ?? false;

  @override
  void dispose() {}
}

GpuStream _stream() => GpuStream(
  Float32List(3 * GpuStream.floatsPerVertex),
  Uint32List.fromList([0, 1, 2]),
  [(0, null)],
  Int32List.fromList([0, 3, 0]),
  Int32List.fromList([0, 3]),
);

void main() {
  const style = <String, Object?>{
    'version': 8,
    'sources': {
      'roads': {
        'type': 'vector',
        'tiles': ['http://127.0.0.1:9/{z}/{x}/{y}'],
      },
    },
    'layers': [
      {'id': 'road', 'type': 'line', 'source': 'roads', 'source-layer': 'road'},
    ],
  };
  final sheet = StyleSheet.compile(style);

  test('a stream keeps its size when its vertices are let go', () {
    final stream = _stream();
    expect(stream.held, isTrue);
    stream.letGo();
    expect(stream.held, isFalse);
    expect(stream.vertexBytes, 3 * GpuStream.floatsPerVertex * 4);
  });

  test('a tile let go of with nothing to draw it from leaves the cache', () {
    final pool = TilePool(
      const VmapNetworkOptions(workers: 1),
      style: style,
      nameKeys: null,
      sheet: sheet,
      source: 0,
      onLoaded: (_, _) {},
      shared: SharedFetches().fetch,
      onFailed: (_, _) {},
    );
    addTearDown(pool.close);
    final source = TileSource(sheet.sources.first, pool);
    final renderer = _Renderer();
    final clock = Stopwatch()..start();
    LoadedTile tile(int x, {bool ready = true, bool held = true}) {
      final made = LoadedTile(
        TileId(3, x, 0),
        BuiltTile(const [], const [], const [], _stream()),
        sheet,
      );
      if (ready) made.prepare(1, clock, 1 << 40, renderer: renderer);
      if (!held) made.gpu!.letGo();
      return made;
    }

    final fresh = tile(0, ready: false);
    final shown = tile(1);
    final resent = tile(2)..releaseRenderer();
    final spent = tile(3, held: false)..releaseRenderer();
    for (final t in [fresh, shown, resent, spent]) {
      source.tiles[t.id] = t;
    }
    final before = tile(4, held: false)..releaseRenderer();
    source.previous[before.id] = before;

    source.dropSpent(renderer.canBuild);

    expect(source.tiles.values, [fresh, shown, resent]);
    expect(source.previous, isEmpty);
  });
}
