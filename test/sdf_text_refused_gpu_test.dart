@Tags(['gpu'])
library;

import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/gpu/gpu_buffers.dart';
import 'package:vmap/src/gpu/gpu_map.dart';
import 'package:vmap/src/labels/sdf_text.dart';
import 'package:vmap/src/text/glyphs/glyph_pbf.dart';

import 'support/gpu.dart';

/// Past every GPU's largest texture, so the device refuses the image the
/// text is drawn into.
const _past = 1 << 17;

void main() {
  test(
    'a device that refuses the text hands the map to the canvas, and the '
    'pass held for the text is sent',
    skip: gpuSkip,
    () async {
      final (library, _) = await gpuDevice();
      final heap = GpuHeap();
      final map = GpuMap.withShaders(library, heap);
      final failures = <Object>[];
      map.onFailure = failures.add;
      final frame = blankFrame(squareView(64));
      final canvas = ui.Canvas(ui.PictureRecorder());

      map.paint(canvas, frame);
      expect(map.textIntoMap(), isTrue);
      final text = map.sdfText!;
      final submitted = heap.submitted;
      final look = SdfLook(SdfLook.rgba(0xFF000000, 1), null, 0, 0, 1);
      text
        ..begin(
          ui.Size(_past.toDouble(), _past.toDouble()),
          1,
          SquareGlyphs(10),
          squareView(_past.toDouble()),
        )
        ..glyph(GlyphPbf.firstFace, 0x6C, 4, 32, 1, 0, 0, 1, look, 0);

      expect(text.end(canvas, drawnBelow: true), same(canvas));
      expect(failures, hasLength(1));
      expect(heap.submitted, submitted + 1, reason: 'the held pass is sent');
      expect(map.sdfText, isNull);
      expect(map.supports(frame.sheet), isFalse);
      expect(map.textIntoMap(), isFalse);
      expect(map.presentUntil(canvas, frame.sheet.runs.length), isFalse);
      map.dispose();
    },
  );
}
