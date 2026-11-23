@Tags(['gpu'])
library;

import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/camera/view.dart';
import 'package:vmap/src/gpu/gpu_buffers.dart';
import 'package:vmap/src/gpu/gpu_frames.dart';
import 'package:vmap/src/gpu/gpu_map_pass.dart';
import 'package:vmap/src/gpu/sdf_text_gpu.dart';
import 'package:vmap/src/labels/sdf_text.dart';
import 'package:vmap/src/render/map_renderer.dart';
import 'package:vmap/src/stats.dart';
import 'package:vmap/src/style/expr.dart';
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/text/glyphs/glyph_pbf.dart';

import 'support/gpu.dart';

/// Past every GPU's largest texture, so the device refuses the image the
/// text is drawn into.
const _past = 1 << 17;

class _Square implements PbfGlyphs {
  _Square() {
    const ink = 10, b = GlyphPbf.border, w = ink + 2 * b;
    final field = Uint8List(w * w);
    for (var y = b; y < b + ink; y++) {
      field.fillRange(y * w + b, y * w + b + ink, 255);
    }
    _glyph = PbfGlyph(0x6C, field, ink, ink, 0, ink, ink);
  }

  late final PbfGlyph _glyph;

  @override
  PbfGlyph? glyph(int face, int codePoint) => _glyph;
}

void main() {
  test(
    'a device that refuses the text loses that text, not the frame, '
    'and the text is given up from then on',
    skip: gpuSkip,
    () async {
      final (library, device) = await gpuDevice();
      final lost = <Object>[];
      final text = SdfTextGpu(device, library, lost: lost.add);
      expect(text.ready, isTrue);

      final view = MapView(
        centerX: 0.5,
        centerY: 0.5,
        zoom: 3,
        width: _past.toDouble(),
        height: _past.toDouble(),
      );
      final look = SdfLook(SdfLook.rgba(0xFF000000, 1), null, 0, 0, 1);
      final canvas = ui.Canvas(ui.PictureRecorder());
      text
        ..begin(ui.Size(_past.toDouble(), _past.toDouble()), 1, _Square(), view)
        ..glyph(GlyphPbf.firstFace, 0x6C, 4, 32, 1, 0, 0, 1, look, 0);

      expect(text.end(canvas), same(canvas));
      expect(lost, hasLength(1));
      expect(text.ready, isFalse);

      expect(text.end(canvas), same(canvas));
      expect(text.layKept(canvas), same(canvas));
      expect(lost, hasLength(1));
    },
  );

  test(
    'text refused while it holds the map pass under the labels sends that '
    'pass, which no later frame would',
    skip: gpuSkip,
    () async {
      final heap = GpuHeap();
      final (library, device) = await gpuDevice(heap);
      final lost = <Object>[];
      final text = SdfTextGpu(device, library, lost: lost.add);
      const side = 64;
      final small = MapView(
        centerX: 0.5,
        centerY: 0.5,
        zoom: 3,
        width: side.toDouble(),
        height: side.toDouble(),
      );
      final sheet = StyleSheet.compile({
        'version': 8,
        'sources': <String, Object?>{},
        'layers': <Object?>[],
      });
      final frame = RenderFrame(
        view: small,
        origin: ui.Offset.zero,
        sheet: sheet,
        fallback: const [],
        ideal: const [],
        context: EvalContext(),
        styleZoom: 3,
        devicePixelRatio: 1,
        stats: VmapStats(),
      );
      final frames = GpuFrames(multisample: false)..size(device, side, side);
      final layers = frames.begin(
        passOn: (pass, {required before}) =>
            MapPass(device, pass, frame, Float64List(16)),
      );
      frames.finish(layers, small, const [], heap, textRun: sheet.labelsRun);
      final held = frames.shown.textPass!;
      final sent = heap.submitted;

      final look = SdfLook(SdfLook.rgba(0xFF000000, 1), null, 0, 0, 1);
      final canvas = ui.Canvas(ui.PictureRecorder());
      text
        ..begin(
          ui.Size(_past.toDouble(), _past.toDouble()),
          1,
          _Square(),
          MapView(
            centerX: 0.5,
            centerY: 0.5,
            zoom: 3,
            width: _past.toDouble(),
            height: _past.toDouble(),
          ),
        )
        ..glyph(GlyphPbf.firstFace, 0x6C, 4, 32, 1, 0, 0, 1, look, 0)
        ..drawInto(held);

      expect(text.end(canvas, drawnBelow: true), same(canvas));
      expect(lost, hasLength(1));
      expect(held.sent, isTrue);
      expect(heap.submitted, sent + 1);
      expect(frames.shown.textPass, isNull);
      frames.dispose();
    },
  );
}
