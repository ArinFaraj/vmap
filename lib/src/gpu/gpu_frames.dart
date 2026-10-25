import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:vector_math/vector_math.dart' show Vector4;

import '../camera/view.dart';
import '../style/style_model.dart' show StyleRun;
import '../render/frame_planes.dart';
import 'frame_layers.dart';
import 'gpu_buffers.dart';
import 'gpu_device.dart';
import 'gpu_map_pass.dart';
import 'gpu_shim/gpu.dart' as gpu;

/// The textures frames are drawn into, the screen's size, and the canvas
/// showing them: a ring of three, so the GPU draws one while the canvas
/// shows another.
class GpuFrames {
  GpuFrames({required this._multisample});

  final bool _multisample;
  late final bool _msaa =
      _multisample && !kIsWeb && gpu.gpuContext.doesSupportOffscreenMSAA;

  int width = 0, height = 0;
  List<_FrameTarget> _ring = const [];
  int _next = 0;
  gpu.Texture? _depth, _samples, _singleDepth;

  /// A heatmap layer's density, a quarter of the screen across as
  /// MapLibre's, and the depth and stencil its pass is drawn with.
  gpu.Texture? _density, _densityDepth;

  /// Whether this frame is multisampled: only the globe, raised ground and
  /// standing buildings are. A flat map's edges are cut at pixel centres,
  /// as MapLibre draws without its `antialias` option, where its fills'
  /// outlines and its lines' faded edges are what smooth them.
  bool sampled = false;

  /// Whether the device multisamples at all.
  bool get multisamples => _msaa;

  /// Frames the GPU has been given and not finished.
  int _inFlight = 0;

  /// Shows the last frame again every other frame, as a GPU that cannot
  /// keep up does, to see the map stay with its labels.
  bool debugReuseFrames = false;

  /// The last frame drawn, shown again while the GPU catches up.
  _Shown? _last;

  /// The camera [_last] was drawn for.
  MapView? _lastView;

  /// The camera of the frame being shown: [_lastView] unless [_last] is
  /// shown again for a camera that has moved on, which it is warped to.
  MapView? _showView;

  /// Where a background or raster run comes between [_last]'s images, as
  /// [FrameLayers.splits]. Then how many of them are on the canvas.
  List<(int, int)> _splits = const [];
  int _presented = 0;

  /// The images of the last frame taken on the web, let go a frame later.
  List<ui.Image> _snapshots = const [];

  final ui.Paint _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;
  final ui.Paint _overlayPaint = ui.Paint()
    ..filterQuality = ui.FilterQuality.low;

  /// Makes the textures for a screen [width] by [height], when it changed.
  void size(GpuDevice device, int width, int height) {
    if (width == this.width && height == this.height && _ring.isNotEmpty) {
      return;
    }
    this.width = width;
    this.height = height;
    for (final frame in _ring) {
      frame.dispose();
    }
    _ring = [for (var i = 0; i < 3; i++) _FrameTarget(target(device))];
    _last = null;
    _density = _densityDepth = null;
    final samples = _msaa ? 4 : 1;
    _depth = device.scratch(
      width,
      height,
      gpu.gpuContext.defaultDepthStencilFormat,
      samples,
    );
    _samples = _msaa
        ? device.scratch(width, height, device.color, samples)
        : null;
    _singleDepth = _msaa
        ? device.scratch(
            width,
            height,
            gpu.gpuContext.defaultDepthStencilFormat,
            1,
          )
        : null;
  }

  /// A texture a frame draws into, the size of the screen.
  gpu.Texture target(GpuDevice device) => gpu.gpuContext.createTexture(
    gpu.StorageMode.devicePrivate,
    width,
    height,
    format: device.color,
  );

  /// The texture and depth a heatmap's density is added up in.
  (gpu.Texture, gpu.Texture) density(GpuDevice device) {
    final w = math.max(1, width ~/ 4), h = math.max(1, height ~/ 4);
    return (
      _density ??= gpu.gpuContext.createTexture(
        gpu.StorageMode.devicePrivate,
        w,
        h,
        format: device.densityFormat,
      ),
      _densityDepth ??= device.scratch(
        w,
        h,
        gpu.gpuContext.defaultDepthStencilFormat,
        1,
      ),
    );
  }

  /// The texture the device's state is warmed up in.
  gpu.Texture get spare => _ring.last.map;

  gpu.RenderPass beginPass(gpu.CommandBuffer commands, gpu.Texture target) {
    final samples = sampled ? _samples : null;
    return commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        samples == null
            ? gpu.ColorAttachment(texture: target, clearValue: Vector4.zero())
            : gpu.ColorAttachment(
                texture: samples,
                resolveTexture: target,
                storeAction: gpu.StoreAction.multisampleResolve,
                clearValue: Vector4.zero(),
              ),
        depthStencilAttachment: gpu.DepthStencilAttachment(
          texture: samples == null && _msaa ? _singleDepth! : _depth!,
          depthClearValue: 1,
        ),
      ),
    );
  }

  /// Shows the last frame again for [view] when the GPU has fallen behind:
  /// a GPU that falls behind blocks the thread that queues more work for
  /// it, so while two frames are still in flight the last image is shown
  /// again and the frame comes back once one finishes.
  bool showAgain(MapView view, int frame) {
    if (_last == null ||
        !(_inFlight >= 2 || (debugReuseFrames && frame.isOdd))) {
      return false;
    }
    _presented = 0;
    _showView = view;
    return true;
  }

  /// The next frame of the ring to draw into, with what [device] makes
  /// its overlays from.
  FrameLayers begin(
    GpuDevice device, {
    required MapPass Function(gpu.Texture target) passOn,
    required Heat? Function(StyleRun run) heatOf,
  }) {
    final frame = _ring[_next];
    _next = (_next + 1) % _ring.length;
    var overlays = 0;
    return FrameLayers(
      (frame.map, frame.image),
      passOn: passOn,
      next: () => frame.overlay(overlays++, () => target(device)),
      heatOf: heatOf,
    );
  }

  /// Hands [buffers] to the GPU in order, counting them in [heap].
  void submit(List<gpu.CommandBuffer> buffers, GpuHeap heap) {
    _inFlight++;
    heap.submitted++;
    for (final b in buffers.take(buffers.length - 1)) {
      b.submit();
    }
    buffers.last.submit(
      completionCallback: (_) {
        _inFlight--;
        heap.completed++;
      },
    );
  }

  /// The textures behind [_last]'s images.
  List<gpu.Texture> _textures = const [];

  /// The last frame's images as browser bitmaps, their opacity, where
  /// background and raster runs come between them, and the camera they
  /// were drawn for.
  ({List<(Object, double)> images, List<(int, int)> splits, MapView view})?
  _taken;

  /// Takes the last frame's images out of their textures for the page to
  /// show, moved to the camera of a frame that shows them again.
  void takeLast() {
    final last = _last, view = _lastView;
    if (last == null || view == null || _textures.length != last.length) {
      _taken = null;
      return;
    }
    _taken = (
      images: [
        for (var i = 0; i < last.length; i++)
          (gpu.gpuHost.textureToBitmap(_textures[i])!, last[i].$2),
      ],
      splits: _splits,
      view: view,
    );
  }

  /// Keeps [layers], drawn for [view], as the frame to show. On the web
  /// with [snapshot], its images are copied out of their textures now.
  void drawn(FrameLayers layers, MapView view, {bool snapshot = true}) {
    final shown = layers.shown;
    if (kIsWeb && snapshot) _snapshot(shown, layers.textures);
    _last = shown;
    _textures = layers.textures;
    _splits = layers.splits;
    _presented = 0;
    _lastView = _showView = view;
  }

  /// On the web a texture's image is a copy taken when it is asked for,
  /// not the texture itself as on Impeller: [shown] takes fresh copies of
  /// [textures] once they are drawn.
  void _snapshot(_Shown shown, List<gpu.Texture> textures) {
    for (final image in _snapshots) {
      image.dispose();
    }
    _snapshots = [for (final t in textures) t.asImage()];
    for (var i = 0; i < shown.length; i++) {
      shown[i] = (_snapshots[i], shown[i].$2);
    }
  }

  /// Lays the last frame's images before style run [run] on [canvas]. With
  /// [warps], a frame shown again for a camera that has moved is moved
  /// with it, so the map keeps up with the labels drawn for the new camera.
  void presentUntil(
    ui.Canvas canvas,
    int run, {
    required bool warps,
    FramePlanes? planes,
  }) {
    if (planes != null) return _hand(planes, run, warps: warps);
    final last = _last, view = _lastView;
    if (last == null || view == null) return;
    var upTo = last.length;
    for (final (at, image) in _splits) {
      if (at >= run) {
        upTo = math.min(upTo, image);
        break;
      }
    }
    if (upTo <= _presented) return;
    _present(canvas, last.getRange(_presented, upTo), view, warps: warps);
    _presented = upTo;
  }

  /// [presentUntil] on the web: hands the images [takeLast] took before
  /// style run [run] to [planes].
  void _hand(FramePlanes planes, int run, {required bool warps}) {
    final taken = _taken;
    if (taken == null) return;
    var upTo = taken.images.length;
    for (final (at, image) in taken.splits) {
      if (at >= run) {
        upTo = math.min(upTo, image);
        break;
      }
    }
    if (upTo <= _presented) return;
    planes.hand(
      taken.images.sublist(_presented, upTo),
      _warp(taken.view, warps),
    );
    _presented = upTo;
  }

  void _present(
    ui.Canvas canvas,
    Iterable<(ui.Image, double)> shown,
    MapView view, {
    required bool warps,
  }) {
    _lastView = view;
    final from = ui.Rect.fromLTWH(0, 0, width.toDouble(), height.toDouble());
    final to = ui.Rect.fromLTWH(0, 0, view.width, view.height);
    final warp = _warp(view, warps);
    if (warp != null) {
      canvas
        ..save()
        ..transform(warp);
    }
    for (final (image, opacity) in shown) {
      final paint = opacity >= 1
          ? _paint
          : (_overlayPaint..color = ui.Color.fromRGBO(255, 255, 255, opacity));
      canvas.drawImageRect(image, from, to, paint);
    }
    if (warp != null) canvas.restore();
  }

  /// How a frame drawn for [view] moves to show the camera now, or null
  /// when it need not.
  Float64List? _warp(MapView view, bool warps) {
    final now = _showView;
    if (now == null || identical(now, view) || !warps) return null;
    final warp = now.warpFrom(view);
    return warp == null || _identity(warp) ? null : warp;
  }

  static bool _identity(Float64List m) {
    for (var i = 0; i < 16; i++) {
      if ((m[i] - (i % 5 == 0 ? 1 : 0)).abs() > 1e-9) return false;
    }
    return true;
  }

  void dispose() {
    for (final frame in _ring) {
      frame.dispose();
    }
    _ring = const [];
    _last = null;
    _depth = null;
    _samples = null;
    _singleDepth = null;
  }
}

/// A frame as the canvas shows it: images laid over each other in order,
/// each at its opacity. The first is the map; a layer drawn whole at an
/// opacity and see-through buildings add more.
typedef _Shown = List<(ui.Image, double)>;

/// What one frame of the ring draws into: the map's texture and, for each
/// see-through building layer, one more. Building layers are drawn opaque
/// into their own and laid over the map at their opacity, as MapLibre
/// draws them, so a see-through building shows the ground behind it and
/// its walls do not darken where they overlap.
class _FrameTarget {
  _FrameTarget(this.map) : image = map.asImage();

  final gpu.Texture map;
  final ui.Image image;
  final List<FrameImage> _overlays = [];

  /// The [i]th overlay's texture and image, made with [make] the first time.
  FrameImage overlay(int i, gpu.Texture Function() make) {
    while (_overlays.length <= i) {
      final texture = make();
      _overlays.add((texture, texture.asImage()));
    }
    return _overlays[i];
  }

  void dispose() {
    image.dispose();
    for (final (_, overlay) in _overlays) {
      overlay.dispose();
    }
  }
}
