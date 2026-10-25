import 'dart:developer' show Timeline;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';

import 'gpu_shim/gpu.dart' as gpu;

import 'package:vector_math/vector_math.dart' show Vector4;

import '../style/expr.dart';
import '../labels/sdf_text.dart';
import '../render/map_renderer.dart';
import '../style/style_model.dart';
import '../tiles/tiles.dart';

import 'gpu_buffers.dart';
import 'frame_layers.dart';
import 'gpu_device.dart';
import 'gpu_frames.dart';
import 'gpu_map_pass.dart';
import 'gpu_pipelines.dart';
import 'sdf_text_gpu.dart';
import 'terrain_drape.dart';

/// What the renderer draws with once the device has made its pipelines.
typedef _Ready = ({GpuDevice device, Drape drape, SdfTextGpu sdf});

const _bundle = 'packages/vmap/build/shaderbundles/vmap_gpu.shaderbundle';

/// Draws vmap's fill and line layers and its buildings on the GPU: every
/// tile in one call (or a few, past 80 style slots), lines widened in the
/// shader, buildings with a depth buffer. Set it as the engine's renderer;
/// where Flutter GPU is missing, [create] gives null and the canvas draws.
class GpuMap extends MapRenderer {
  GpuMap._(bool multisample) : _frames = GpuFrames(multisample: multisample) {
    _load();
  }

  /// A renderer when this device runs Flutter GPU, otherwise null. With
  /// [multisample] false edges are cut at pixel centres, as MapLibre draws
  /// without its `antialias` option; the web never multisamples.
  static GpuMap? create({bool multisample = true}) {
    try {
      gpu.gpuContext;
      return GpuMap._(multisample);
    } catch (_) {
      return null;
    }
  }

  gpu.ShaderLibrary? _library;

  /// Made with the first frame drawn.
  _Ready? _made;

  @override
  SdfText? get sdfText {
    final sdf = _ready()?.sdf;
    return sdf != null && sdf.ready ? sdf : null;
  }

  final _heap = GpuHeap();
  final GpuFrames _frames;
  int _frame = 0;

  /// Shows the last frame again every other frame, as a GPU that cannot
  /// keep up does, to see the map stay with its labels.
  @visibleForTesting
  set debugReuseFrames(bool reuse) => _frames.debugReuseFrames = reuse;

  /// What the last frame was drawn from; a tile uploaded before the next
  /// is painted from it too.
  RenderFrame? _in;

  @override
  bool get drawsIn3d => true;

  Future<void> _load() async {
    try {
      _library = await gpu.loadShaderLibraryAsync(_bundle);
      if (_library == null) throw StateError('no shader bundle at $_bundle');
    } catch (e) {
      _failed = true;
      onFailure?.call(e);
    }
  }

  @override
  bool supports(StyleSheet sheet) => _library != null && !_failed;

  @override
  bool get loading => _library == null && !_failed;

  /// Set when the shaders or pipelines could not be made on this device,
  /// so the canvas draws the map.
  bool _failed = false;

  /// Made on the first frame drawn, never before: on OpenGL ES a pipeline
  /// made before the app has a surface can deadlock (flutter/flutter#193890).
  _Ready? _ready() {
    if (_made case final made?) return made;
    if (_failed) return null;
    final library = _library;
    if (library == null) return null;
    try {
      final device = GpuDevice(
        GpuPipelines(library),
        _heap,
        fail: (e) => onFailure?.call(e),
      );
      return _made = (
        device: device,
        drape: Drape(device),
        sdf: SdfTextGpu(device, library),
      );
    } catch (e) {
      onFailure?.call(e);
      _failed = true;
      return null;
    }
  }

  @override
  bool canBuild(LoadedTile tile) => tile.gpu != null;

  @override
  bool makeReady(LoadedTile tile, double scale, Stopwatch clock, int deadline) {
    var data = tile.rendererData as TileGpu?;
    if (data == null) {
      data = TileGpu(tile, _heap);
      tile.keepForRenderer(data);
    }
    final sending = data;
    return Timeline.timeSync(
      'vmap.gpu.upload',
      () => sending.send(clock, deadline),
    );
  }

  /// Past three quarters of the heap's cap, lets the tiles drawn longest
  /// ago, and not in the last ten seconds, give their memory back; such a
  /// tile is sent again if it shows again, a tile standing in meanwhile.
  void _trim() {
    if (_heap.used <= GpuHeap.capBytes * 3 ~/ 4) return;
    final idle = [
      for (final data in _heap.tiles)
        if (_frame - data.drawnFrame > 1200) data,
    ]..sort((a, b) => a.drawnFrame - b.drawnFrame);
    for (final data in idle) {
      if (_heap.used <= GpuHeap.capBytes ~/ 2) break;
      data.tile.releaseRenderer();
    }
  }

  @override
  void trimMemory() {
    for (final data in [..._heap.tiles]) {
      if (data.drawnFrame != _frame) data.tile.releaseRenderer();
    }
    _shrinking = true;
  }

  /// Whether slabs freed by [trimMemory] are still to be let go, once the
  /// GPU finishes the frames that may read them.
  bool _shrinking = false;

  @override
  bool paint(ui.Canvas canvas, RenderFrame f) {
    final RenderFrame(
      :view,
      :origin,
      :sheet,
      :fallback,
      :ideal,
      :context,
      :styleZoom,
      :devicePixelRatio,
    ) = f;
    _in = f;
    final made = _ready();
    if (made == null) return true;
    final (:device, :drape, :sdf) = made;
    sdf.planes = f.planes;
    final GpuDevice(
      pipelines: p,
      :host,
      :blocks,
      :sprites,
      :reveal,
      :presence,
      :paints,
      :ramps,
    ) = device;
    final terrain = f.terrain;
    sprites.sheet = f.sprites;
    _frame++;
    _heap
      ..frame = _frame
      ..topUp();
    _trim();
    if (_shrinking) _shrinking = !_heap.shrink();
    final width = (view.width * devicePixelRatio).round();
    final height = (view.height * devicePixelRatio).round();
    if (width <= 0 || height <= 0) return false;
    _frames
      ..size(device, width, height)
      ..sampled =
          _frames.multisamples &&
          (view.globe != null ||
              terrain != null ||
              (view.pitch > 0 &&
                  sheet.extrusions.any(
                    (e) => styleZoom >= e.minZoom && styleZoom < e.maxZoom,
                  )));
    if (!_warm) _warmUp(device);
    if (_frames.showAgain(view, _frame)) {
      f.stats.gpuFramesReused++;
      if (f.planes != null) _frames.takeLast();
      return true;
    }
    // A render pass encodes into a command buffer of its own: Metal allows
    // one open encoder per buffer. They run in the order submitted.
    final buffers = <gpu.CommandBuffer>[];
    host.reset();
    blocks
      ..fog(sheet, context, view)
      ..light(sheet.light, view)
      ..clipPerPixel = (2 / view.width, 2 / view.height);
    blocks.frame
      ..[26] = devicePixelRatio
      ..[27] = 1;
    reveal.begin(sheet, styleZoom);
    presence.begin(sheet, styleZoom, ideal);
    paints.begin(f.states, f.dashFade);
    ramps.update(sheet, context);
    // Past 60 degrees MapLibre's far plane ends the ground short of the
    // horizon; raised ground nearer than it still rises above that line.
    final clip = view.clipMatrix(
      originX: origin.dx,
      originY: origin.dy,
      far: view.pitch > 60
          ? view.farDistance / view.cameraToCenterDistance
          : 20,
    );
    final layers = _frames.begin(
      device,
      passOn: (target, {keeps = false}) => MapPass(
        device,
        _frames.beginPass(
          (buffers..add(gpu.gpuContext.createCommandBuffer())).last,
          target,
          keeps: keeps,
        ),
        f,
        clip,
      ),
      heatOf: (run) => _heat(device, buffers, run, f, clip),
    );
    final globe = p.globe == null ? null : view.globe;
    final raised = (terrain != null || globe != null) && p.ground != null;
    layers.composites = !raised && !_frames.sampled && p.composite != null;
    if (raised) {
      // The raised ground holds every vector layer, laid after the
      // backgrounds and rasters under the labels.
      layers.splits.add((sheet.labelsRun - 1, 0));
      Timeline.timeSync('vmap.gpu.drape', () => drape.drawAtlas(buffers, f));
    }
    Timeline.timeSync('vmap.gpu.draw', () {
      if (!raised) return _layOut(layers, f, _Layout.flat);
      // The flat layers are in the drape; the ground and buildings stand
      // in the frame with depth. With terrain MapLibre draws the map into
      // a texture laid over the ground, as the drape is; without, onto
      // the sphere.
      final pass = layers.pass.renderPass;
      if (globe != null) {
        drape.drawGlobe(pass, globe, view, origin, clip);
      } else {
        drape.drawGround(pass, terrain!, view, origin, clip);
      }
      if (globe != null && terrain == null) {
        layers.setUpPasses((pass) => pass.globe = globe);
        _layOut(layers, f, _Layout.globe);
      } else {
        // Circles and heatmaps stand on raised ground.
        layers.setUpPasses(
          (pass) => pass
            ..raise = true
            ..standing = true
            ..globe = globe,
        );
        _layOut(layers, f, _Layout.standing);
      }
      for (final building in sheet.extrusions) {
        if (reveal.shows(building)) layers.pass.drawBuildings(building);
      }
    });
    Timeline.timeSync('vmap.gpu.submit', () => _frames.submit(buffers, _heap));
    _frames.drawn(layers, view, snapshot: f.planes == null);
    if (f.planes != null) _frames.takeLast();
    return reveal.animating ||
        presence.animating ||
        sprites.loading ||
        drape.sending;
  }

  /// Draws the style's runs into [layers] in order, as [layout] lays them.
  void _layOut(FrameLayers layers, RenderFrame f, _Layout layout) {
    final RenderFrame(:sheet, :context) = f;
    final reveal = _made!.device.reveal;
    var drawnSinceSplit = false;
    for (final (index, run) in sheet.runs.indexed) {
      if (layout == _Layout.flat) {
        // A background or raster after vector layers is laid by the canvas
        // between their images, and what comes after the style's last
        // symbol layer over the labels, so the style's order holds.
        if (drawnSinceSplit && (run.source < 0 || index == sheet.labelsRun)) {
          layers.split();
          drawnSinceSplit = false;
        }
        if (run.source >= 0 && !drawnSinceSplit) {
          layers.splits.add((
            index,
            layers.splits.isEmpty ? 0 : layers.shown.length - 1,
          ));
          drawnSinceSplit = true;
        }
      }
      if (run.source < 0) continue;
      if (layout == _Layout.flat) {
        if (sheet.extrusionAt(run) case final building?) {
          if (!reveal.shows(building)) continue;
          final opacity = (asNumber(building.opacity(context)) ?? 1).clamp(
            0.0,
            1.0,
          );
          layers.within(
            opacity,
            (into) => into.drawBuildings(building, opacity: opacity),
          );
          continue;
        }
      }
      if (sheet.layers[run.first] is HeatmapLayer) {
        layers.heat(run);
        continue;
      }
      layers.add(
        run,
        layout == _Layout.standing ? null : sheet.runOpacity(run, context),
      );
    }
    layers.flush();
  }

  /// Heatmap [run]'s points added up in a texture of its own, when the
  /// layer shows.
  Heat? _heat(
    GpuDevice device,
    List<gpu.CommandBuffer> buffers,
    StyleRun run,
    RenderFrame f,
    Float64List clip,
  ) {
    final heat = f.sheet.layers[run.first] as HeatmapLayer;
    final row = device.ramps.gradientOf(run.first);
    final opacity = (asNumber(heat.opacity(f.context)) ?? 1).clamp(0.0, 1.0);
    if (row == null || opacity <= 0 || device.pipelines.heat == null) {
      return null;
    }
    return (
      density: _drawDensity(device, buffers, run, f, clip),
      row: row,
      opacity: opacity,
    );
  }

  bool _warm = false;

  /// Draws nothing in every state a frame uses, once: a GPU makes a
  /// pipeline variant the first time a state is drawn in, which stalls that
  /// frame for several milliseconds. Tile memory is set aside here too.
  void _warmUp(GpuDevice device) {
    _warm = true;
    final GpuDevice(pipelines: p, :host, :blocks, :sprites, :paints) = device;
    final commands = gpu.gpuContext.createCommandBuffer();
    final pass = _frames.beginPass(commands, _frames.spare);
    const size = 3 * BuildingGpu.stride > 96 ? 3 * BuildingGpu.stride : 96;
    final zeros = gpu.gpuContext.createDeviceBufferWithCopy(ByteData(size));
    final vertices = gpu.BufferView(
      zeros,
      offsetInBytes: 0,
      lengthInBytes: size,
    );
    final frame = host.emplace(ByteData(blocks.mapBytes.lengthInBytes));
    final equal = gpu.StencilConfig(compareFunction: gpu.CompareFunction.equal);
    final stencil = p.stencil;
    if (stencil != null) {
      pass
        ..bindPipeline(stencil)
        ..setCullMode(gpu.CullMode.none)
        ..setDepthWriteEnable(false)
        ..setDepthCompareOperation(gpu.CompareFunction.always)
        ..setColorBlendEnable(true)
        ..setColorBlendEquation(overBlend)
        ..setStencilConfig(
          gpu.StencilConfig(
            depthStencilPassOperation: gpu.StencilOperation.setToReferenceValue,
          ),
        )
        ..bindVertexBuffer(vertices)
        ..bindUniform(p.stencilFrame!, frame)
        ..draw(3)
        ..clearBindings();
    }
    pass
      ..bindPipeline(p.flat)
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(overBlend);
    sprites.bind(pass, p, host);
    pass
      ..bindVertexBuffer(vertices)
      ..bindUniform(p.flatFrame, frame)
      ..bindUniform(
        p.flatSlots,
        host.emplace(ByteData(paints.slotBytes.lengthInBytes)),
      );
    for (final config in [gpu.StencilConfig(), equal]) {
      pass
        ..setStencilConfig(config)
        ..draw(3);
    }
    pass
      ..clearBindings()
      ..bindPipeline(p.buildings)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setDepthWriteEnable(true)
      ..setDepthCompareOperation(gpu.CompareFunction.lessEqual)
      ..bindVertexBuffer(vertices)
      ..bindUniform(p.buildingFrame, frame)
      ..bindUniform(
        p.buildingPatterns,
        host.emplace(ByteData(sprites.patternBytes.lengthInBytes)),
      );
    sprites.bindBuildings(pass, p, host);
    device.heights.bind(pass, p, host, null, null);
    for (final config in [gpu.StencilConfig(), equal]) {
      pass
        ..setStencilConfig(config)
        ..draw(3);
    }
    _frames.submit([commands], _heap);
  }

  /// Adds up the kernels of heatmap [run]'s points into the density
  /// texture, in a command buffer of its own added to [buffers].
  gpu.Texture _drawDensity(
    GpuDevice device,
    List<gpu.CommandBuffer> buffers,
    StyleRun run,
    RenderFrame f,
    Float64List clip,
  ) {
    final (density, depth) = _frames.density(device);
    final commands = gpu.gpuContext.createCommandBuffer();
    buffers.add(commands);
    final pass = commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        gpu.ColorAttachment(texture: density, clearValue: Vector4.zero()),
        depthStencilAttachment: gpu.DepthStencilAttachment(
          texture: depth,
          depthClearValue: 1,
        ),
      ),
    );
    MapPass(device, pass, f, clip)
      ..adding = true
      ..raise = f.terrain != null
      ..globe = f.view.globe
      ..drawRuns([run]);
    return density;
  }

  @override
  bool presentUntil(ui.Canvas canvas, int run) {
    _frames.presentUntil(
      canvas,
      run,
      warps: _in?.terrain == null,
      planes: _in?.planes,
    );
    return false;
  }

  @override
  void dispose() {
    for (final data in [..._heap.tiles]) {
      data.tile.releaseRenderer();
    }
    _heap.clear();
    _frames.dispose();
  }
}

/// How a frame's runs are laid out: flat, standing on raised ground, or
/// drawn onto the globe's sphere.
enum _Layout { flat, standing, globe }
