import '../tiles/tiles.dart' show TileDraw;
import 'building_reveal.dart';
import 'gpu_buffers.dart';
import 'gpu_pipelines.dart';
import 'gpu_shim/gpu.dart' as gpu;
import 'gpu_uniforms.dart';
import 'ground_heights.dart';
import 'layer_presence.dart';
import 'line_ramps.dart';

/// Premultiplied source over, which also leaves the colour untouched where
/// the stencil pass writes its transparent squares.
final overBlend = gpu.ColorBlendEquation(
  sourceColorBlendFactor: gpu.BlendFactor.one,
  destinationColorBlendFactor: gpu.BlendFactor.oneMinusSourceAlpha,
  sourceAlphaBlendFactor: gpu.BlendFactor.one,
  destinationAlphaBlendFactor: gpu.BlendFactor.oneMinusSourceAlpha,
);

/// Draws that add up, as a heatmap's density does.
final addBlend = gpu.ColorBlendEquation(
  sourceColorBlendFactor: gpu.BlendFactor.one,
  destinationColorBlendFactor: gpu.BlendFactor.one,
  sourceAlphaBlendFactor: gpu.BlendFactor.one,
  destinationAlphaBlendFactor: gpu.BlendFactor.one,
);

/// What the GPU renderer draws with once the device has made its
/// pipelines: everything a frame's passes share and keep between frames.
class GpuDevice {
  GpuDevice(this.pipelines, this.heap, {required this.fail});

  final GpuPipelines pipelines;

  /// Where the tiles' vertices live; a tile's last draw is stamped with
  /// its frame.
  final GpuHeap heap;

  /// Told of what could not be made on the device.
  final void Function(Object error) fail;

  final UniformArena host = UniformArena();
  final FrameBlocks blocks = FrameBlocks();
  final GroundHeights heights = GroundHeights();
  final Stopwatch _clock = Stopwatch()..start();
  late final LineRamps ramps = LineRamps(fail);
  late final SpriteTextures sprites = SpriteTextures(ramps, fail);
  late final BuildingReveal reveal = BuildingReveal(_clock);
  late final LayerPresence presence = LayerPresence(_clock);
  late final LayerSlots paints = LayerSlots(presence, reveal, ramps, sprites);

  /// The format a frame is drawn in.
  late final gpu.PixelFormat color =
      gpu.gpuContext.defaultColorFormat == gpu.PixelFormat.unknown
      ? gpu.PixelFormat.r8g8b8a8UNormInt
      : gpu.gpuContext.defaultColorFormat;

  /// Half floats where the GPU draws into them, as MapLibre's heatmap
  /// density is, else [color]: the density then saturates at one.
  late final gpu.PixelFormat densityFormat = () {
    try {
      gpu.gpuContext.createTexture(
        gpu.StorageMode.devicePrivate,
        1,
        1,
        format: gpu.PixelFormat.r16g16b16a16Float,
      );
      return gpu.PixelFormat.r16g16b16a16Float;
    } catch (_) {
      return color;
    }
  }();

  bool _transient = true;

  /// A texture only the GPU touches within a pass: kept in tile memory where
  /// the GPU has it, which desktop GPUs do not.
  gpu.Texture scratch(
    int width,
    int height,
    gpu.PixelFormat format,
    int samples,
  ) {
    for (final mode in [
      if (_transient) gpu.StorageMode.deviceTransient,
      gpu.StorageMode.devicePrivate,
    ]) {
      try {
        return gpu.gpuContext.createTexture(
          mode,
          width,
          height,
          format: format,
          sampleCount: samples,
          enableShaderReadUsage: false,
        );
      } catch (_) {
        _transient = false;
      }
    }
    throw StateError('vmap: no texture for the map pass');
  }

  /// [d]'s data on the GPU, stamped as drawn this frame. The engine hands
  /// over only tiles it uploaded, so this is null only for a tile with
  /// nothing for the GPU.
  TileGpu? drawn(TileDraw d) => switch (d.tile.rendererData) {
    final TileGpu data when data.ready => data..drawnFrame = heap.frame,
    _ => null,
  };
}
