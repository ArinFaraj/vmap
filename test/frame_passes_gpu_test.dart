@Tags(['gpu'])
library;

import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/gpu/gpu_buffers.dart';
import 'package:vmap/src/gpu/frame_show.dart';
import 'package:vmap/src/gpu/gpu_frames.dart';
import 'package:vmap/src/gpu/gpu_map_pass.dart';
import 'package:vmap/src/gpu/sdf_text_gpu.dart';
import 'package:vmap/src/labels/sdf_text.dart';
import 'package:vmap/src/text/glyphs/glyph_pbf.dart';

import 'support/gpu.dart';

const _side = 64.0, _ink = 10, _baseline = 32.0;

void main() {
  // Impeller on Vulkan begins every pass on a texture as the first one made
  // for it, so a second pass that asks to keep the texture clears it. A
  // frame draws all of an image in one pass.
  test(
    'an image keeps what was drawn before a layer laid over it and its text',
    skip: gpuSkip,
    () async {
      final heap = GpuHeap();
      final (library, device) = await gpuDevice(heap);
      final text = SdfTextGpu(device, library, guard: unguarded)..build();
      final glyphs = SquareGlyphs(_ink);
      final view = squareView(_side);
      final frame = blankFrame(view);
      final sheet = frame.sheet;
      final canvas = ui.Canvas(ui.PictureRecorder());

      /// A black square drawn in [pass] with its left edge at [x].
      void square(TextPass pass, double x) {
        text.begin(const ui.Size(_side, _side), 1, glyphs, view);
        final look = SdfLook(SdfLook.rgba(0xFF000000, 1), null, 0, 0, 1);
        text
          ..glyph(GlyphPbf.firstFace, 0x6C, x, _baseline, 1, 0, 0, 1, look, 0)
          ..drawInto(pass)
          ..end(canvas);
      }

      void squareIn(MapPass pass, double x) =>
          square(TextPass.on(pass.renderPass), x);

      final frames = GpuFrames(multisample: false)
        ..size(device, _side.toInt(), _side.toInt());
      final layers = frames.begin(
        passOn: (pass) => MapPass(device, pass, frame, Float64List(16)),
      )..composites = true;
      squareIn(layers.pass, 4);
      layers.apart(0.5, (into) => squareIn(into, 20));
      squareIn(layers.pass, 36);
      frames.finish(layers, view, const [], heap, textRun: sheet.labelsRun);
      square(frames.shown.textPass!, 50);

      final recorder = ui.PictureRecorder();
      frames.shown.presentUntil(
        ui.Canvas(recorder),
        sheet.runs.length,
        warps: false,
      );
      expect(frames.shown.textPass, isNull);
      final image = await recorder.endRecording().toImage(
        _side.toInt(),
        _side.toInt(),
      );
      final pixels = (await image.toByteData())!;
      int alpha(double x) {
        final column = (x + _ink / 2).floor();
        final row = (_baseline - _ink / 2).floor();
        return pixels.getUint8((row * _side.toInt() + column) * 4 + 3);
      }

      expect(alpha(4), 255, reason: 'drawn before the layer laid over');
      expect(alpha(20), closeTo(128, 2), reason: 'the layer, half there');
      expect(alpha(36), 255, reason: 'drawn after the layer');
      expect(alpha(50), 255, reason: 'the text');
      expect(alpha(-6), 0);
    },
  );
}
