@Tags(['gpu'])
library;

import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/gpu/gpu_buffers.dart';
import 'package:vmap/src/gpu/gpu_map.dart';

import 'support/gpu.dart';

void main() {
  test(
    "the first frame makes only the map's pipelines, the second warms up, "
    "and the third makes the text's, its labels on the canvas until then",
    skip: gpuSkip,
    () async {
      final (library, _) = await gpuDevice();
      final heap = GpuHeap();
      final map = GpuMap.withShaders(library, heap);
      final frame = blankFrame(squareView(64));
      final canvas = ui.Canvas(ui.PictureRecorder());
      Future<bool> paint() => paintAfterGpu(map, heap, canvas, frame);

      for (final reason in ['the warm up to come', 'the text to come']) {
        expect(await paint(), isTrue, reason: reason);
        expect(map.sdfText, isNull);
        expect(map.textIntoMap(), isFalse);
      }

      expect(await paint(), isFalse);
      expect(map.sdfText, isNotNull);
      expect(map.textIntoMap(), isTrue);
      map.dispose();
    },
  );
}
