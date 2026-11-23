@Tags(['gpu'])
library;

import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/gpu/gpu_buffers.dart';
import 'package:vmap/src/gpu/gpu_map.dart';

import 'support/gpu.dart';

void main() {
  test(
    "the first frame makes only the map's pipelines, the second the "
    "text's, its labels on the canvas until then, and the third warms up",
    skip: gpuSkip,
    () async {
      final (library, _) = await gpuDevice();
      final heap = GpuHeap();
      final map = GpuMap.withShaders(library, heap);
      final frame = blankFrame(squareView(64));
      final canvas = ui.Canvas(ui.PictureRecorder());

      /// Paints a frame once the GPU has finished the ones before, as a
      /// device that keeps up does.
      Future<bool> paint() async {
        while (heap.completed < heap.submitted) {
          await Future<void>.delayed(const Duration(milliseconds: 1));
        }
        return map.paint(canvas, frame);
      }

      expect(await paint(), isTrue, reason: 'the text to come');
      expect(map.sdfText, isNull);
      expect(map.textIntoMap(), isFalse);

      expect(await paint(), isTrue, reason: 'the warm up to come');
      expect(map.sdfText, isNotNull);
      expect(map.textIntoMap(), isTrue);

      expect(await paint(), isFalse);
      map.dispose();
    },
  );
}
