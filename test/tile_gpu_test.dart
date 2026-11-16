@Tags(['gpu'])
library;

import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/gpu/gpu_buffers.dart';
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/tiles/built_tile.dart';
import 'package:vmap/src/tiles/gpu_stream.dart';
import 'package:vmap/src/tiles/tile_id.dart';
import 'package:vmap/src/tiles/tiles.dart';

import 'support/gpu.dart';

void main() {
  test(
    'a tile sent to the GPU holds its geometry there alone',
    skip: gpuSkip,
    () {
      final sheet = StyleSheet.compile({
        'version': 8,
        'sources': <String, Object?>{},
        'layers': <Object?>[],
      });
      final stream = GpuStream(
        Float32List(3 * GpuStream.floatsPerVertex),
        Uint32List.fromList([0, 1, 2]),
        [(0, null)],
        Int32List.fromList([0, 3, 0]),
        Int32List.fromList([0, 3]),
      );
      final tile = LoadedTile(
        const TileId(3, 0, 0),
        BuiltTile(const [], const [], const [], stream),
        sheet,
      );
      final heap = GpuHeap();
      final data = TileGpu(tile, heap);
      final clock = Stopwatch()..start();

      expect(stream.held, isTrue);
      expect(data.send(clock, 1 << 40), isTrue);
      expect(stream.held, isFalse);
      expect(data.ready, isTrue);
      expect(data.send(clock, 1 << 40), isTrue);
      expect(heap.used, greaterThan(0));
      data.dispose();
      expect(heap.used, 0);
    },
  );
}
