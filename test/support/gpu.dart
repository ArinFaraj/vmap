import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:vmap/src/camera/view.dart';
import 'package:vmap/src/gpu/gpu_buffers.dart';
import 'package:vmap/src/gpu/gpu_device.dart';
import 'package:vmap/src/gpu/gpu_map.dart';
import 'package:vmap/src/gpu/gpu_pipelines.dart';
import 'package:vmap/src/gpu/gpu_shim/gpu.dart' as gpu;
import 'package:vmap/src/render/map_renderer.dart';
import 'package:vmap/src/stats.dart';
import 'package:vmap/src/style/expr.dart';
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/text/glyphs/glyph_pbf.dart';

/// Whether Flutter GPU is there, as it is under `tool/gpu_tests.sh`.
final bool hasGpu = () {
  try {
    gpu.gpuContext;
    return true;
  } catch (_) {
    return false;
  }
}();

/// What a test that draws on the GPU passes as its `skip`.
final Object gpuSkip = hasGpu
    ? false
    : 'needs Flutter GPU: run tool/gpu_tests.sh';

/// The shaders `tool/gpu_tests.sh` builds, and a device that draws with
/// them and counts its frames in [heap].
Future<(gpu.ShaderLibrary, GpuDevice)> gpuDevice([GpuHeap? heap]) async {
  const bundle = 'build/shaderbundles/vmap_gpu.shaderbundle';
  final library = await gpu.loadShaderLibraryAsync(bundle);
  if (library == null) throw StateError('no shader bundle at $bundle');
  return (
    library,
    GpuDevice(GpuPipelines(library), heap ?? GpuHeap(), fail: (e) => throw e),
  );
}

/// Runs a GPU text's [draw] with no guard, so a refusal fails the test.
T unguarded<T>(T lost, T Function() draw) => draw();

/// The flat map at zoom 3, [side] logical pixels square.
MapView squareView(double side) =>
    MapView(centerX: 0.5, centerY: 0.5, zoom: 3, width: side, height: side);

/// A frame of a style with no sources or layers, seen through [view].
RenderFrame blankFrame(MapView view) => RenderFrame(
  view: view,
  origin: ui.Offset.zero,
  sheet: StyleSheet.compile({
    'version': 8,
    'sources': <String, Object?>{},
    'layers': <Object?>[],
  }),
  fallback: const [],
  ideal: const [],
  context: EvalContext(),
  styleZoom: 3,
  devicePixelRatio: 1,
  stats: VmapStats(),
);

/// One glyph, a square of ink [ink] pixels a side standing on the
/// baseline, its left edge at the pen.
class SquareGlyphs implements PbfGlyphs {
  SquareGlyphs(int ink) {
    const b = GlyphPbf.border;
    final w = ink + 2 * b;
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

/// Paints [frame] with [map] once the GPU has finished the frames counted
/// in [heap], as a device that keeps up does: painted back to back, frames
/// still in flight are shown again instead of drawn.
Future<bool> paintAfterGpu(
  GpuMap map,
  GpuHeap heap,
  ui.Canvas canvas,
  RenderFrame frame,
) async {
  while (heap.completed < heap.submitted) {
    await Future<void>.delayed(const Duration(milliseconds: 1));
  }
  return map.paint(canvas, frame);
}
