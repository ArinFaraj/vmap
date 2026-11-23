import 'dart:math' as math;

import 'package:flutter/foundation.dart';

import '../camera/view.dart';
import 'frame_layers.dart';
import 'frame_show.dart';
import 'gpu_buffers.dart';
import 'gpu_device.dart';
import 'gpu_map_pass.dart';
import 'gpu_shim/gpu.dart' as gpu;
import 'pass_target.dart';

/// The textures frames are drawn into and the screen's size: a ring of
/// three, so the GPU draws one while the canvas shows another, which
/// [shown] lays down.
class GpuFrames {
  GpuFrames({required this._multisample});

  final bool _multisample;
  late final bool _msaa =
      _multisample && !kIsWeb && gpu.gpuContext.doesSupportOffscreenMSAA;

  int width = 0, height = 0;
  List<_FrameTarget> _ring = const [];
  int _next = 0;

  /// The depth and stencil of the images the canvas shows, and of the
  /// images a pass reads: on the web a pass read by another is drawn
  /// while that other is still drawing, so the two cannot share them.
  gpu.Texture? _depth, _fedDepth;

  /// The samples and their depth, when the device multisamples. Every
  /// image shares them: only the native backends multisample, and they run
  /// a frame's passes one after another.
  ({gpu.Texture samples, gpu.Texture depth})? _multisampled;

  /// Each heatmap layer's density, a quarter of the screen across as
  /// MapLibre's, and the depth and stencil their passes are drawn with.
  final List<PassTarget> _densities = [];
  gpu.Texture? _densityDepth;

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

  /// The last frame drawn, as the canvas shows it.
  final FrameShow shown = FrameShow();

  /// Makes the textures for a screen [width] by [height], when it changed.
  void size(GpuDevice device, int width, int height) {
    if (width == this.width && height == this.height && _ring.isNotEmpty) {
      return;
    }
    this.width = width;
    this.height = height;
    shown.drop();
    final old = _ring;
    _ring = const [];
    for (final frame in old) {
      frame.dispose();
    }
    _densities.clear();
    _densityDepth = null;
    _fedDepth = null;
    gpu.Texture depth(int samples) => device.scratch(
      width,
      height,
      gpu.gpuContext.defaultDepthStencilFormat,
      samples,
    );
    _depth = depth(1);
    _multisampled = _msaa
        ? (
            samples: device.scratch(width, height, device.color, 4),
            depth: depth(4),
          )
        : null;
    _ring = [
      for (var i = 0; i < 3; i++)
        _FrameTarget(_shown(device), () => _shown(device), () => _fed(device)),
    ];
    for (final frame in _ring) {
      gpu.gpuHost.page?.showsOnce(frame.map.target.texture);
    }
  }

  gpu.Texture _texture(GpuDevice device) => gpu.gpuContext.createTexture(
    gpu.StorageMode.devicePrivate,
    width,
    height,
    format: device.color,
  );

  /// A texture for an image the canvas shows, the size of the screen.
  FrameTexture _shown(GpuDevice device) {
    final texture = _texture(device);
    return (
      target: PassTarget(texture, depth: _depth, multisampled: _multisampled),
      image: texture.asImage(),
    );
  }

  /// A texture for an image a pass reads, the size of the screen.
  PassTarget _fed(GpuDevice device) => PassTarget(
    _texture(device),
    depth: _fedDepth ??= device.scratch(
      width,
      height,
      gpu.gpuContext.defaultDepthStencilFormat,
      1,
    ),
    multisampled: _multisampled,
  );

  /// What the frame's heatmap [index] adds its density up in.
  PassTarget density(GpuDevice device, int index) {
    final w = math.max(1, width ~/ 4), h = math.max(1, height ~/ 4);
    while (_densities.length <= index) {
      _densities.add(
        PassTarget(
          gpu.gpuContext.createTexture(
            gpu.StorageMode.devicePrivate,
            w,
            h,
            format: device.densityFormat,
          ),
          depth: _densityDepth ??= device.scratch(
            w,
            h,
            gpu.gpuContext.defaultDepthStencilFormat,
            1,
          ),
        ),
      );
    }
    return _densities[index];
  }

  /// What the device's state is warmed up in.
  PassTarget get spare => _ring.last.map.target;

  /// Shows the last frame again for [view] when the GPU has fallen behind:
  /// a GPU that falls behind blocks the thread that queues more work for
  /// it, so while two frames are still in flight the last image is shown
  /// again and the frame comes back once one finishes.
  bool showAgain(MapView view, int frame) {
    if (!shown.hasFrame ||
        !(_inFlight >= 2 || (debugReuseFrames && frame.isOdd))) {
      return false;
    }
    shown.again(view);
    return true;
  }

  /// The next frame of the ring to draw into, each of its passes made a
  /// [MapPass] by [passOn].
  FrameLayers begin({required MapPass Function(gpu.RenderPass pass) passOn}) {
    // A frame never laid down, as when painting it threw, still sends the
    // pass it began.
    shown.sendText();
    final frame = _ring[_next]..rewind();
    _next = (_next + 1) % _ring.length;
    return FrameLayers(
      frame,
      passOn: (target) {
        final commands = gpu.gpuContext.createCommandBuffer();
        return (
          pass: passOn(target.begin(commands, multisample: sampled)),
          commands: commands,
        );
      },
    );
  }

  /// Keeps [layers], drawn for [view], as the frame to show, and hands the
  /// GPU its commands after [before], each image's after those of the
  /// images its pass reads. The pass of the opaque image laid down at
  /// style run [textRun] is held back as [FrameShow.textPass], and goes
  /// last, when its image is laid down. On the web with [snapshot], each
  /// image is copied out of its texture when it is first laid down.
  void finish(
    FrameLayers layers,
    MapView view,
    List<gpu.CommandBuffer> before,
    GpuHeap heap, {
    required int textRun,
    bool snapshot = true,
  }) {
    final images = layers.images;
    final under = FrameShow.upTo(textRun, images.length, layers.splits) - 1;
    final held = under >= 0 && images[under].opacity >= 1
        ? images[under]
        : null;
    final last = held ?? images.last;
    for (final commands in before) {
      commands.submit();
    }
    for (final image in images) {
      for (final commands in image.before) {
        commands.submit();
      }
      if (!identical(image, last)) image.commands.submit();
    }
    void send() => submit(last.commands, heap);
    shown.keep(
      images,
      layers.splits,
      view,
      text: held == null ? null : TextPass(held.pass.renderPass, under, send),
      copies: kIsWeb && snapshot,
    );
    if (held == null) send();
  }

  /// Hands the GPU [commands], a frame's last, counting the frame in
  /// [heap] until the GPU has finished it.
  void submit(gpu.CommandBuffer commands, GpuHeap heap) {
    _inFlight++;
    heap.submitted++;
    commands.submit(
      completionCallback: (_) {
        _inFlight--;
        heap.completed++;
      },
    );
  }

  void dispose() {
    shown.dispose();
    for (final frame in _ring) {
      frame.dispose();
    }
    _ring = const [];
    _depth = null;
    _fedDepth = null;
    _multisampled = null;
  }
}

/// What one frame of the ring draws into: the map's texture, one more for
/// each image laid over it, and one for each image a pass reads, each made
/// the first time a frame asks for it.
class _FrameTarget implements FrameTextures {
  _FrameTarget(this.map, this._makeShown, this._makeFed);

  @override
  final FrameTexture map;
  final FrameTexture Function() _makeShown;
  final PassTarget Function() _makeFed;
  final List<FrameTexture> _overlays = [];
  final List<PassTarget> _fed = [];
  int _nextOverlay = 0, _nextFed = 0;

  /// Starts a frame, which takes the textures from the first again.
  void rewind() => _nextOverlay = _nextFed = 0;

  @override
  FrameTexture nextShown() {
    if (_nextOverlay == _overlays.length) _overlays.add(_makeShown());
    return _overlays[_nextOverlay++];
  }

  @override
  PassTarget nextFed() {
    if (_nextFed == _fed.length) _fed.add(_makeFed());
    return _fed[_nextFed++];
  }

  void dispose() {
    map.image.dispose();
    for (final overlay in _overlays) {
      overlay.image.dispose();
    }
  }
}
