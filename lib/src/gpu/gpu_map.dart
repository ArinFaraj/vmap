import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';

import 'gpu_shim/gpu.dart' as gpu;

import '../style/expr.dart';
import '../labels/sdf_text.dart';
import '../render/map_renderer.dart';
import '../style/style_model.dart';
import '../tiles/tiles.dart';
import '../trace.dart';

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
    if (_failed) return null;
    if (_made case final made?) return made;
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
        sdf: SdfTextGpu(device, library, lost: _lose),
      );
    } catch (e) {
      onFailure?.call(e);
      _failed = true;
      return null;
    }
  }

  @override
  bool canBuild(LoadedTile tile) => tile.gpu?.held ?? false;

  @override
  bool makeReady(LoadedTile tile, double scale, Stopwatch clock, int deadline) {
    var data = tile.rendererData as TileGpu?;
    if (data == null) {
      data = TileGpu(tile, _heap);
      tile.keepForRenderer(data);
    }
    final sending = data;
    return traced('vmap.gpu.upload', () => sending.send(clock, deadline));
  }

  /// Frames a tile goes undrawn before [_trim] may take its memory: ten
  /// seconds at 120 frames a second.
  static const _idleFrames = 1200;

  /// Past three quarters of the heap's cap, lets the tiles drawn longest
  /// ago, and not lately, give their memory back; such a tile is fetched
  /// again if it shows again, a tile standing in meanwhile.
  void _trim() {
    if (_heap.used <= GpuHeap.capBytes * 3 ~/ 4) return;
    final idle = [
      for (final data in _heap.tiles)
        if (_frame - data.drawnFrame > _idleFrames && !data.tile.standsIn) data,
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

  /// A device that refuses a texture or a command buffer mid-frame hands
  /// the map to the canvas from the next frame on, as a shader library
  /// that would not load does. Nothing is drawn on [canvas] here, so the
  /// frame needs no unwinding.
  @override
  bool paint(ui.Canvas canvas, RenderFrame f) {
    try {
      return _paint(canvas, f);
    } catch (e) {
      _lose(e);
      return true;
    }
  }

  void _lose(Object error) {
    _failed = true;
    onFailure?.call(error);
  }

  bool _paint(ui.Canvas canvas, RenderFrame f) {
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
    sdf.aimApart(f.planes);
    final GpuDevice(pipelines: p, :host, :blocks, :sprites, :paints, :ramps) =
        device;
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
    final globe = p.globe == null ? null : view.globe;
    final raised = (terrain != null || globe != null) && p.ground != null;
    // The drape is drawn before the frame's own pass, which samples it.
    if (raised) {
      traced('vmap.gpu.drape', () => drape.drawAtlas(buffers, f));
    }
    final heats = _heats(device, buffers, f, clip);
    final layers = _frames.begin(
      passOn: (pass) => MapPass(device, pass, f, clip),
    )..composites = p.composite != null;
    // The raised ground holds every vector layer, laid after the
    // backgrounds and rasters under the labels.
    if (raised) layers.splits.add((sheet.labelsRun - 1, 0));
    traced('vmap.gpu.draw', () {
      if (!raised) return _layOut(layers, f, heats, _Layout.flat);
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
        _layOut(layers, f, heats, _Layout.globe);
      } else {
        // Circles and heatmaps stand on raised ground.
        layers.setUpPasses(
          (pass) => pass
            ..raise = true
            ..standing = true
            ..globe = globe,
        );
        _layOut(layers, f, heats, _Layout.standing);
      }
      for (final building in sheet.extrusions) {
        if (building.showsAt(styleZoom)) {
          layers.pass.drawBuildings(building);
        }
      }
    });
    traced(
      'vmap.gpu.submit',
      () => _frames.finish(
        layers,
        view,
        buffers,
        _heap,
        textRun: sheet.labelsRun,
        snapshot: f.planes == null,
      ),
    );
    return sprites.loading || drape.sending;
  }

  /// Draws the style's runs into [layers] in order, as [layout] lays them,
  /// each heatmap run coloured from its density in [heats].
  void _layOut(
    FrameLayers layers,
    RenderFrame f,
    Map<StyleRun, Heat> heats,
    _Layout layout,
  ) {
    final RenderFrame(:sheet, :context) = f;
    final flat = layout == _Layout.flat;
    final splits = flat ? _FlatSplits(layers, sheet.labelsRun) : null;
    for (final (index, run) in sheet.runs.indexed) {
      final vector = run.source >= 0;
      final heat = heats[run];
      if (vector && heat == null && sheet.layers[run.first] is HeatmapLayer) {
        continue;
      }
      final building = flat && vector ? sheet.extrusionAt(run) : null;
      // An image over the labels is handed to the canvas whole every frame,
      // so a layer there with nothing in view takes none. Buildings are held
      // apart from a tile's layers, and a heatmap colours the view where
      // nothing adds up too.
      if (flat &&
          vector &&
          index >= sheet.labelsRun &&
          building == null &&
          heat == null &&
          !layers.pass.holds(run)) {
        continue;
      }
      splits?.before(index, run);
      if (!vector) continue;
      if (building != null) {
        if (!building.showsAt(context.zoom)) continue;
        final opacity = (asNumber(building.opacity(context)) ?? 1).clamp(
          0.0,
          1.0,
        );
        layers.within(
          opacity,
          (into) => into.drawBuildings(building, opacity: opacity),
        );
      } else if (heat != null) {
        layers.heat(heat);
      } else {
        layers.add(
          run,
          layout == _Layout.standing ? null : sheet.runOpacity(run, context),
        );
      }
    }
    layers.flush();
  }

  static const Map<StyleRun, Heat> _noHeats = {};

  /// The points of each heatmap run that shows, added up in a texture of
  /// its own. They are drawn before the frame's own passes, which sample
  /// them.
  Map<StyleRun, Heat> _heats(
    GpuDevice device,
    List<gpu.CommandBuffer> buffers,
    RenderFrame f,
    Float64List clip,
  ) {
    if (device.pipelines.heat == null) return _noHeats;
    var heats = _noHeats;
    for (final run in f.sheet.runs) {
      if (run.source < 0) continue;
      final heat = f.sheet.layers[run.first];
      if (heat is! HeatmapLayer) continue;
      final row = device.ramps.gradientOf(run.first);
      final opacity = (asNumber(heat.opacity(f.context)) ?? 1).clamp(0.0, 1.0);
      if (row == null || opacity <= 0) continue;
      if (identical(heats, _noHeats)) heats = {};
      heats[run] = (
        density: _drawDensity(device, buffers, run, heats.length, f, clip),
        row: row,
        opacity: opacity,
      );
    }
    return heats;
  }

  bool _warm = false;

  /// Draws nothing in every state a frame uses, once: a GPU makes a
  /// pipeline variant the first time a state is drawn in, which stalls that
  /// frame for several milliseconds. Tile memory is set aside here too.
  void _warmUp(GpuDevice device) {
    _warm = true;
    final GpuDevice(pipelines: p, :host, :blocks, :sprites, :paints) = device;
    final commands = gpu.gpuContext.createCommandBuffer();
    final pass = _frames.spare.begin(commands, multisample: _frames.sampled);
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
    _frames.submit(commands, _heap);
  }

  /// Adds up the kernels of heatmap [run]'s points into the frame's
  /// density texture [index], in a command buffer of its own added to
  /// [buffers].
  gpu.Texture _drawDensity(
    GpuDevice device,
    List<gpu.CommandBuffer> buffers,
    StyleRun run,
    int index,
    RenderFrame f,
    Float64List clip,
  ) {
    final density = _frames.density(device, index);
    final commands = gpu.gpuContext.createCommandBuffer();
    buffers.add(commands);
    MapPass(device, density.begin(commands), f, clip)
      ..adding = true
      ..raise = f.terrain != null
      ..globe = f.view.globe
      ..drawRuns([run]);
    return density.texture;
  }

  @override
  bool textIntoMap() {
    if (_failed) return false;
    final sdf = _made?.sdf;
    final pass = _frames.shown.textPass;
    if (sdf == null || !sdf.ready || pass == null) return false;
    sdf.drawInto(pass);
    return true;
  }

  /// The held text pass goes to the GPU here, and a device that refuses it
  /// hands the map to the canvas as one refusing [paint] does.
  @override
  bool presentUntil(ui.Canvas canvas, int run) {
    if (_failed) return false;
    try {
      _frames.shown.presentUntil(
        canvas,
        run,
        warps: _in?.terrain == null,
        planes: _in?.planes,
      );
    } catch (e) {
      _lose(e);
      return true;
    }
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

/// Where a flat frame's images end. A background or raster after vector
/// layers is laid by the canvas between their images, and what comes after
/// the style's last symbol layer over the labels, so the style's order
/// holds.
class _FlatSplits {
  _FlatSplits(this._layers, this._labelsRun);

  final FrameLayers _layers;
  final int _labelsRun;
  bool _drawnSinceSplit = false, _underLabels = true;

  /// Ends the image drawn so far when the canvas draws between it and run
  /// [index], and notes each image's first vector run.
  void before(int index, StyleRun run) {
    final over = index >= _labelsRun;
    if (_drawnSinceSplit && (run.source < 0 || (over && _underLabels))) {
      _layers.split();
      _drawnSinceSplit = false;
    }
    _underLabels = !over;
    if (run.source >= 0 && !_drawnSinceSplit) {
      _layers.splits.add((
        index,
        _layers.splits.isEmpty ? 0 : _layers.images.length - 1,
      ));
      _drawnSinceSplit = true;
    }
  }
}

/// How a frame's runs are laid out: flat, standing on raised ground, or
/// drawn onto the globe's sphere.
enum _Layout { flat, standing, globe }
