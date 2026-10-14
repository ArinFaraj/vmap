import 'dart:developer' show Timeline;
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter_gpu/gpu.dart' as gpu;
import 'package:vector_math/vector_math.dart' show Vector4;
import 'package:vmap/renderer.dart';

import 'building_reveal.dart';
import 'gpu_buffers.dart';
import 'line_ramps.dart';
import 'layer_paint.dart';
import 'layer_presence.dart';

part 'terrain_drape.dart';

const _bundle = 'packages/vmap_gpu/build/shaderbundles/vmap_gpu.shaderbundle';

/// Draws vmap's fill and line layers and its buildings on the GPU: every
/// tile in one call (or a few, past 120 style slots), lines widened in the
/// shader, buildings with a depth buffer. Set it as the engine's renderer;
/// where Flutter GPU is missing, [create] gives null and the canvas draws.
class GpuMap implements MapRenderer {
  GpuMap._() {
    _load();
  }

  /// A renderer when this device runs Flutter GPU, otherwise null.
  static GpuMap? create() {
    try {
      gpu.gpuContext;
      return GpuMap._();
    } catch (e) {
      debugPrint('vmap_gpu: no Flutter GPU, the canvas draws the map: $e');
      return null;
    }
  }

  gpu.ShaderLibrary? _library;
  gpu.RenderPipeline? _flat, _buildings, _stencil, _ground;
  gpu.UniformSlot? _groundFrame, _groundDrape, _groundDem, _groundHeights;
  late final _drape = _Drape(this);
  gpu.UniformSlot? _flatFrame, _flatSlots, _buildingFrame, _stencilFrame;
  gpu.UniformSlot? _buildingDem, _buildingHeights;
  gpu.UniformSlot? _flatFrag, _flatSprites, _flatRamp;
  SpriteSheet? _sheet;
  ui.Image? _sheetImage;
  gpu.Texture? _sheetTexture;
  late final gpu.Texture _blank = gpu.gpuContext.createTexture(
    gpu.StorageMode.hostVisible,
    1,
    1,
    format: gpu.PixelFormat.r8g8b8a8UNormInt,
  )..overwrite(ByteData(4));
  final Float32List _fragInfo = Float32List(4);
  late final ByteData _fragBytes = ByteData.sublistView(_fragInfo);

  /// A tile's square in tile units, two triangles.
  gpu.DeviceBuffer? _quad;
  UniformArena? _host;
  final _heap = GpuHeap();
  List<_FrameTarget> _ring = const [];

  /// The last frame drawn, shown again while the GPU catches up.
  _Shown? _last;
  final ui.Paint _overlayPaint = ui.Paint()
    ..filterQuality = ui.FilterQuality.low;
  int _inFlight = 0;
  gpu.Texture? _depth, _samples;
  int _next = 0, _width = 0, _height = 0, _frame = 0;
  bool _transient = true;
  late final bool _msaa = gpu.gpuContext.doesSupportOffscreenMSAA;
  late final gpu.PixelFormat _color =
      gpu.gpuContext.defaultColorFormat == gpu.PixelFormat.unknown
      ? gpu.PixelFormat.r8g8b8a8UNormInt
      : gpu.gpuContext.defaultColorFormat;
  final Stopwatch _clock = Stopwatch()..start();
  late final _reveal = BuildingReveal(_clock);
  late final _presence = LayerPresence(_clock);
  final ui.Paint _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;

  final Float32List _frameInfo = Float32List(28);
  late final ByteData _frameBytes = ByteData.sublistView(_frameInfo);
  final Float32List _slots = Float32List(240 * 4);
  late final ByteData _slotBytes = ByteData.sublistView(_slots);

  /// One layer's paint this frame, in screen pixels, before a tile's scale.
  final Map<int, LayerPaint> _layerPaint = {};
  final _ramps = LineRamps();

  @override
  Terrain? terrain;

  @override
  List<RasterPiece> rasters = const [];

  /// Premultiplied source over, which also leaves the colour untouched
  /// where the stencil pass writes its transparent squares.
  static final _over = gpu.ColorBlendEquation(
    sourceColorBlendFactor: gpu.BlendFactor.one,
    destinationColorBlendFactor: gpu.BlendFactor.oneMinusSourceAlpha,
    sourceAlphaBlendFactor: gpu.BlendFactor.one,
    destinationAlphaBlendFactor: gpu.BlendFactor.oneMinusSourceAlpha,
  );

  Future<void> _load() async {
    try {
      _library = await gpu.ShaderLibrary.fromAsset(_bundle);
    } catch (e) {
      debugPrint('vmap_gpu: shaders did not load: $e');
    }
  }

  @override
  bool supports(StyleSheet sheet) {
    var meshSeen = false;
    for (final run in sheet.runs) {
      if (run.raster >= 0) {
        if (meshSeen) return false;
        continue;
      }
      meshSeen = true;
    }
    for (final layer in sheet.layers) {
      if (layer is HeatmapLayer) return false;
    }
    return _library != null && !_failed;
  }

  /// Set when the shaders or pipelines could not be made on this device,
  /// so the canvas draws the map.
  bool _failed = false;

  /// Made on the first frame drawn, never before: on OpenGL ES a pipeline
  /// made before the app has a surface can deadlock (flutter/flutter#193890).
  bool _ready() {
    if (_host != null) return true;
    if (_failed) return false;
    final library = _library;
    if (library == null) return false;
    try {
      return _makePipelines(library);
    } catch (e) {
      debugPrint('vmap_gpu: no pipelines on this device, the canvas draws: $e');
      _flat = _buildings = _stencil = null;
      _failed = true;
      return false;
    }
  }

  bool _makePipelines(gpu.ShaderLibrary library) {
    final mapVertex = library['MapVertex'],
        mapFragment = library['MapFragment'];
    final buildingVertex = library['BuildingVertex'];
    final buildingFragment = library['BuildingFragment'];
    if (mapVertex == null ||
        mapFragment == null ||
        buildingVertex == null ||
        buildingFragment == null) {
      throw StateError('the shader bundle lacks the map shaders');
    }
    _flat = gpu.gpuContext.createRenderPipeline(
      mapVertex,
      mapFragment,
      vertexLayout: const gpu.VertexLayout(
        buffers: [
          gpu.VertexBuffer(
            strideInBytes: 24,
            attributes: [
              gpu.VertexAttribute(
                name: 'position',
                format: gpu.VertexFormat.float32x2,
              ),
              gpu.VertexAttribute(
                name: 'packed_data',
                format: gpu.VertexFormat.float32x4,
                offsetInBytes: 8,
              ),
            ],
          ),
        ],
      ),
    );
    _flatFrame = mapVertex.getUniformSlot('FrameInfo');
    _flatSlots = mapVertex.getUniformSlot('SlotInfo');
    _flatFrag = mapFragment.getUniformSlot('FragInfo');
    _flatSprites = mapFragment.getUniformSlot('sprite_sheet');
    _flatRamp = mapFragment.getUniformSlot('gradient_ramp');
    _buildings = gpu.gpuContext.createRenderPipeline(
      buildingVertex,
      buildingFragment,
      vertexLayout: const gpu.VertexLayout(
        buffers: [
          gpu.VertexBuffer(
            strideInBytes: 20,
            attributes: [
              gpu.VertexAttribute(
                name: 'position',
                format: gpu.VertexFormat.float32x3,
              ),
              gpu.VertexAttribute(
                name: 'color_data',
                format: gpu.VertexFormat.float32x2,
                offsetInBytes: 12,
              ),
            ],
          ),
        ],
      ),
    );
    _buildingFrame = buildingVertex.getUniformSlot('FrameInfo');
    _buildingDem = buildingVertex.getUniformSlot('DemInfo');
    _buildingHeights = buildingVertex.getUniformSlot('heights');
    final groundVertex = library['TerrainVertex'];
    final groundFragment = library['TerrainFragment'];
    if (groundVertex != null && groundFragment != null) {
      _ground = gpu.gpuContext.createRenderPipeline(
        groundVertex,
        groundFragment,
        vertexLayout: const gpu.VertexLayout(
          buffers: [
            gpu.VertexBuffer(
              strideInBytes: 8,
              attributes: [
                gpu.VertexAttribute(
                  name: 'position',
                  format: gpu.VertexFormat.float32x2,
                ),
              ],
            ),
          ],
        ),
      );
      _groundFrame = groundVertex.getUniformSlot('FrameInfo');
      _groundDem = groundVertex.getUniformSlot('DemInfo');
      _groundHeights = groundVertex.getUniformSlot('heights');
      _groundDrape = groundFragment.getUniformSlot('drape');
    }
    final stencilVertex = library['StencilVertex'];
    final stencilFragment = library['StencilFragment'];
    if (stencilVertex != null && stencilFragment != null) {
      _stencil = gpu.gpuContext.createRenderPipeline(
        stencilVertex,
        stencilFragment,
        vertexLayout: const gpu.VertexLayout(
          buffers: [
            gpu.VertexBuffer(
              strideInBytes: 8,
              attributes: [
                gpu.VertexAttribute(
                  name: 'position',
                  format: gpu.VertexFormat.float32x2,
                ),
              ],
            ),
          ],
        ),
      );
      _stencilFrame = stencilVertex.getUniformSlot('FrameInfo');
      const e = tileExtent;
      _quad = gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(
          Float32List.fromList([0, 0, e, 0, e, e, 0, 0, e, e, 0, e]),
        ),
      );
    }
    _host = UniformArena();
    return true;
  }

  void _size(int width, int height) {
    if (width == _width && height == _height && _ring.isNotEmpty) return;
    _width = width;
    _height = height;
    for (final frame in _ring) {
      frame.dispose();
    }
    _ring = [for (var i = 0; i < 3; i++) _FrameTarget(_target())];
    _last = null;
    final samples = _msaa ? 4 : 1;
    _depth = _scratch(
      width,
      height,
      gpu.gpuContext.defaultDepthStencilFormat,
      samples,
    );
    _samples = _msaa ? _scratch(width, height, _color, samples) : null;
  }

  /// A texture a frame draws into, the size of the screen.
  gpu.Texture _target() => gpu.gpuContext.createTexture(
    gpu.StorageMode.devicePrivate,
    _width,
    _height,
    format: _color,
  );

  /// A texture only the GPU touches within a pass: kept in tile memory where
  /// the GPU has it, which desktop GPUs do not.
  gpu.Texture _scratch(
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
    throw StateError('vmap_gpu: no texture for the map pass');
  }

  /// Every tile holding GPU memory.
  final Set<TileGpu> _held = Set.identity();

  @override
  bool upload(LoadedTile tile, Stopwatch clock, int deadline) {
    var data = tile.rendererData;
    if (data is! TileGpu) {
      data = TileGpu(tile, _heap);
      tile.rendererData = data;
      _held.add(data);
    }
    final sending = data;
    return Timeline.timeSync(
      'vmap.gpu.upload',
      () => sending.send(clock, deadline),
    );
  }

  /// [d]'s data on the GPU. The engine hands over only tiles it uploaded,
  /// so this is null only for a tile with nothing for the GPU.
  TileGpu? _gpuOf(TileDraw d) => switch (d.tile.rendererData) {
    final TileGpu data when data.ready => data..drawnFrame = _frame,
    _ => null,
  };

  /// Past three quarters of the heap's cap, lets the tiles drawn longest
  /// ago, and not in the last ten seconds, give their memory back; such a
  /// tile is sent again if it shows again, a tile standing in meanwhile.
  void _trim() {
    _held.removeWhere((data) => !identical(data.tile.rendererData, data));
    if (_heap.used <= GpuHeap.capBytes * 3 ~/ 4) return;
    final idle = [
      for (final data in _held)
        if (_frame - data.drawnFrame > 1200) data,
    ]..sort((a, b) => a.drawnFrame - b.drawnFrame);
    for (final data in idle) {
      if (_heap.used <= GpuHeap.capBytes ~/ 2) break;
      _held.remove(data);
      data.tile
        ..rendererData = null
        ..uploadAgain();
      data.dispose();
    }
  }

  @override
  bool paint(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    StyleSheet sheet,
    List<List<TileDraw>> fallback,
    List<List<TileDraw>> ideal,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
    SpriteSheet? sprites,
  ) {
    if (!_ready()) return true;
    _sheet = sprites;
    _frame++;
    _heap
      ..frame = _frame
      ..topUp();
    _trim();
    final width = (view.width * devicePixelRatio).round();
    final height = (view.height * devicePixelRatio).round();
    if (width <= 0 || height <= 0) return false;
    _size(width, height);
    if (!_warm) _warmUp();
    // A GPU that falls behind blocks the thread that queues more work for
    // it, so while two frames are still in flight the last image is shown
    // again and the frame comes back once one finishes.
    final last = _last;
    if (_inFlight >= 2 && last != null) {
      _present(canvas, last, view);
      return true;
    }
    final frame = _ring[_next];
    _next = (_next + 1) % _ring.length;
    // A render pass encodes into a command buffer of its own: Metal allows
    // one open encoder per buffer. They run in the order submitted.
    final buffers = <gpu.CommandBuffer>[];
    _host!.reset();
    _setFog(sheet, context, view);
    _frameInfo
      ..[26] = devicePixelRatio
      ..[27] = 1;
    _reveal.begin(sheet, styleZoom);
    _presence.begin(sheet, styleZoom, ideal);
    _layerPaint.clear();
    _ramps.update(sheet, context);
    final clip = view.clipMatrix(originX: origin.dx, originY: origin.dy);
    _MapPass passOn(gpu.Texture target) => _MapPass(
      this,
      _beginPass(
        (buffers..add(gpu.gpuContext.createCommandBuffer())).last,
        target,
      ),
      view,
      clip,
      sheet,
      context,
      styleZoom,
      fallback,
      ideal,
    );
    // Layers are drawn in the style's order into the frame's texture. A
    // layer drawn whole at an opacity, and a see-through building layer,
    // go into a texture of their own and what is above them into another,
    // so the canvas lays them over each other in order.
    final shown = <(ui.Image, double)>[(frame.image, 1)];
    var overlays = 0;
    (gpu.Texture, ui.Image) next() => frame.overlay(overlays++, _target);
    final ground = terrain;
    final raised = ground != null && _ground != null;
    if (raised) {
      Timeline.timeSync(
        'vmap.gpu.drape',
        () => _drape.drawAtlas(
          buffers,
          view,
          origin,
          sheet,
          context,
          styleZoom,
          fallback,
          ideal,
        ),
      );
    }
    var pass = passOn(frame.map);
    var below = <StyleRun>[];
    void apart(double opacity, void Function(_MapPass into) draw) {
      pass.drawRuns(below);
      below = [];
      if (opacity <= 0) return;
      if (opacity >= 1) {
        draw(pass);
        return;
      }
      final (alone, aloneImage) = next();
      draw(passOn(alone));
      final (above, aboveImage) = next();
      pass = passOn(above);
      shown
        ..add((aloneImage, opacity))
        ..add((aboveImage, 1));
    }

    Timeline.timeSync('vmap.gpu.draw', () {
      if (raised) {
        // The flat layers are in the drape; the ground and buildings stand
        // in the frame with depth.
        _drape.drawGround(pass._pass, ground, view, origin, clip);
        for (final building in sheet.extrusions) {
          if (_reveal.shows(building)) pass.drawBuildings(building);
        }
        return;
      }
      for (final run in sheet.runs) {
        final building = sheet.extrusionAt(run);
        if (building != null) {
          if (!_reveal.shows(building)) continue;
          final opacity = (asNumber(building.opacity(context)) ?? 1).clamp(
            0.0,
            1.0,
          );
          apart(opacity, (into) => into.drawBuildings(building));
          continue;
        }
        final whole = sheet.runOpacity(run, context);
        if (whole == null) {
          below.add(run);
        } else {
          apart(whole, (into) => into.drawRuns([run]));
        }
      }
      pass.drawRuns(below);
    });
    _inFlight++;
    _heap.submitted++;
    Timeline.timeSync('vmap.gpu.submit', () {
      for (final b in buffers.take(buffers.length - 1)) {
        b.submit();
      }
      buffers.last.submit(completionCallback: (_) => _finished());
    });
    _present(canvas, _last = shown, view);
    return _reveal.animating ||
        _presence.animating ||
        _spritesLoading ||
        _drape.sending;
  }

  bool _warm = false;

  /// Draws nothing in every state a frame uses, once: a GPU makes a
  /// pipeline variant the first time a state is drawn in, which stalls that
  /// frame for several milliseconds. Tile memory is set aside here too.
  void _warmUp() {
    _warm = true;
    final commands = gpu.gpuContext.createCommandBuffer();
    final pass = _beginPass(commands, _ring.last.map);
    final host = _host!;
    final zeros = gpu.gpuContext.createDeviceBufferWithCopy(ByteData(96));
    final vertices = gpu.BufferView(zeros, offsetInBytes: 0, lengthInBytes: 96);
    final frame = host.emplace(ByteData(_frameBytes.lengthInBytes));
    final equal = gpu.StencilConfig(compareFunction: gpu.CompareFunction.equal);
    final stencil = _stencil;
    if (stencil != null) {
      pass
        ..bindPipeline(stencil)
        ..setCullMode(gpu.CullMode.none)
        ..setDepthWriteEnable(false)
        ..setDepthCompareOperation(gpu.CompareFunction.always)
        ..setColorBlendEnable(true)
        ..setColorBlendEquation(_over)
        ..setStencilConfig(
          gpu.StencilConfig(
            depthStencilPassOperation: gpu.StencilOperation.setToReferenceValue,
          ),
        )
        ..bindVertexBuffer(vertices)
        ..bindUniform(_stencilFrame!, frame)
        ..draw(3)
        ..clearBindings();
    }
    pass
      ..bindPipeline(_flat!)
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(_over);
    _bindSprites(pass);
    pass
      ..bindVertexBuffer(vertices)
      ..bindUniform(_flatFrame!, frame)
      ..bindUniform(
        _flatSlots!,
        host.emplace(ByteData(_slotBytes.lengthInBytes)),
      );
    for (final config in [gpu.StencilConfig(), equal]) {
      pass
        ..setStencilConfig(config)
        ..draw(3);
    }
    pass
      ..clearBindings()
      ..bindPipeline(_buildings!)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setDepthWriteEnable(true)
      ..setDepthCompareOperation(gpu.CompareFunction.lessEqual)
      ..bindVertexBuffer(vertices)
      ..bindUniform(_buildingFrame!, frame);
    _drape.bindGround(pass, null, null);
    for (final config in [gpu.StencilConfig(), equal]) {
      pass
        ..setStencilConfig(config)
        ..draw(3);
    }
    _inFlight++;
    _heap.submitted++;
    commands.submit(completionCallback: (_) => _finished());
  }

  void _finished() {
    _inFlight--;
    _heap.completed++;
  }

  gpu.RenderPass _beginPass(gpu.CommandBuffer commands, gpu.Texture target) {
    final samples = _samples;
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
          texture: _depth!,
          depthClearValue: 1,
        ),
      ),
    );
  }

  void _present(ui.Canvas canvas, _Shown shown, MapView view) {
    final from = ui.Rect.fromLTWH(0, 0, _width.toDouble(), _height.toDouble());
    final to = ui.Rect.fromLTWH(0, 0, view.width, view.height);
    for (final (image, opacity) in shown) {
      final paint = opacity >= 1
          ? _paint
          : (_overlayPaint..color = ui.Color.fromRGBO(255, 255, 255, opacity));
      canvas.drawImageRect(image, from, to, paint);
    }
  }

  /// Copies the sprite sheet's pixels into a texture. Read back on the
  /// raster thread off the frame, since making a texture from an image
  /// directly stalls the frame that asks.
  Future<void> _loadSprites(ui.Image image) async {
    _spritesLoading = true;
    try {
      final pixels = await image.toByteData();
      if (pixels == null || !identical(image, _sheetImage)) return;
      _sheetTexture = gpu.gpuContext.createTexture(
        gpu.StorageMode.hostVisible,
        image.width,
        image.height,
        format: gpu.PixelFormat.r8g8b8a8UNormInt,
      )..overwrite(pixels);
    } catch (e) {
      debugPrint('vmap_gpu: the sprite sheet is not on the GPU: $e');
    } finally {
      _spritesLoading = false;
    }
  }

  bool _spritesLoading = false;

  /// The style's sprite sheet as a texture, for patterned fills.
  void _bindSprites(gpu.RenderPass pass) {
    final image = _sheet?.image;
    if (!identical(image, _sheetImage)) {
      _sheetImage = image;
      _sheetTexture = null;
      if (image != null) _loadSprites(image);
    }
    final texture = _sheetTexture ?? _blank;
    final ramp = _ramps.texture ?? _blank;
    _fragInfo
      ..[0] = texture.width.toDouble()
      ..[1] = texture.height.toDouble()
      ..[2] = ramp.width.toDouble()
      ..[3] = ramp.height.toDouble();
    final sampler = gpu.SamplerOptions(
      minFilter: gpu.MinMagFilter.linear,
      magFilter: gpu.MinMagFilter.linear,
    );
    pass
      ..bindUniform(_flatFrag!, _host!.emplace(_fragBytes))
      ..bindTexture(_flatSprites!, texture, sampler: sampler)
      ..bindTexture(_flatRamp!, ramp, sampler: sampler);
  }

  /// A layer's paint for tile [d]: faded in and out as the zoom enters and
  /// leaves its range, and for footprints, kept past their range and faded
  /// as the tile's own buildings rise out of them, so they stay until those
  /// buildings are there.
  LayerPaint _paintOf(
    StyleSheet sheet,
    int layerIndex,
    EvalContext context,
    double styleZoom,
    Map<String, Object?>? props,
    TileDraw d,
    TileGpu data,
  ) {
    final layer = sheet.layers[layerIndex];
    final building = sheet.footprints[layerIndex];
    if (building == null) {
      final present = _presence.of(layerIndex);
      if (present <= 0) return LayerPaint.clear;
      if (present >= 1) return LayerPaint.of(layer, context, styleZoom, props);
      final zoom = styleZoom.clamp(layer.minZoom, layer.maxZoom - 1e-3);
      return LayerPaint.of(layer, context, zoom, props).scaled(present);
    }
    final shown =
        _presence.of(layerIndex) * (1 - _standingIn(d, data, building));
    if (shown <= 0) return LayerPaint.clear;
    final zoom = styleZoom.clamp(layer.minZoom, layer.maxZoom - 1e-3);
    return LayerPaint.of(layer, context, zoom, props).scaled(shown);
  }

  /// How far [layer]'s buildings in tile [d] have faded in: 0 where the
  /// tile has none.
  double _standingIn(TileDraw d, TileGpu data, ExtrusionLayer layer) {
    if (!_reveal.shows(layer)) return 0;
    for (final b in data.buildings) {
      if (b.extrusion.bucket != layer.bucket) continue;
      return _reveal.opacity(d.tile, layer, b);
    }
    return 0;
  }

  /// Writes the slots [from] to [to] of [stream] into the slot table, in
  /// tile units for a tile [scale] screen pixels to the unit.
  void _fillSlots(
    StyleSheet sheet,
    TileDraw d,
    TileGpu data,
    int from,
    int to,
    double scale,
    EvalContext context,
    double styleZoom,
  ) {
    final out = _slots;
    final stream = data.stream!;
    for (var i = from; i < to; i++) {
      final (layerIndex, props) = stream.slots[i];
      final paint = props == null && !sheet.footprints.containsKey(layerIndex)
          ? (_layerPaint[layerIndex] ??= _paintOf(
              sheet,
              layerIndex,
              context,
              styleZoom,
              null,
              d,
              data,
            ))
          : _paintOf(sheet, layerIndex, context, styleZoom, props, d, data);
      paint.writeSlot(
        out,
        (i - from) * 8,
        GpuStream.kindOf(sheet.layers[layerIndex]),
        scale,
        _sheet,
        _ramps.gradientOf(layerIndex),
        _ramps.dashOf(layerIndex),
      );
    }
  }

  /// Distance haze in the style's background colour: none on a flat map,
  /// growing with pitch, from 1.25 times the camera's distance to the
  /// centre to 2.6 times, about where the far edge of a 60 degree view on a
  /// phone held upright lies.
  void _setFog(StyleSheet sheet, EvalContext context, MapView view) {
    final background =
        Rgba.of(sheet.background(context)) ?? const Rgba(1, 1, 1, 1);
    final strength = ((view.pitch - 20) / 40).clamp(0.0, 1.0) * 0.75;
    _frameInfo
      ..[20] = background.r
      ..[21] = background.g
      ..[22] = background.b
      ..[23] = strength
      ..[24] = 1.25
      ..[25] = 2.6;
  }

  /// [clip] times a tile's placement into the frame info block: tile units
  /// scaled by [scale] and moved to [left], [top], heights by [perMetre].
  void _times(
    Float64List clip,
    double scale,
    double perMetre,
    double left,
    double top,
    double fade,
  ) {
    final out = _frameInfo;
    for (var r = 0; r < 4; r++) {
      out[r] = clip[r] * scale;
      out[4 + r] = clip[4 + r] * scale;
      out[8 + r] = clip[8 + r] * perMetre;
      out[12 + r] = clip[r] * left + clip[4 + r] * top + clip[12 + r];
    }
    out[16] = fade;
    out[17] = scale;
  }

  @override
  void dispose() {
    for (final data in _held) {
      if (identical(data.tile.rendererData, data))
        data.tile.rendererData = null;
    }
    _held.clear();
    _heap.clear();
    for (final frame in _ring) {
      frame.dispose();
    }
    _ring = const [];
    _last = null;
    _depth = null;
    _samples = null;
  }
}

/// One frame's render pass: the style's runs in order, then the buildings.
class _MapPass {
  _MapPass(
    this._map,
    this._pass,
    this._view,
    this._clip,
    this._sheet,
    this._context,
    this._styleZoom,
    this._fallback,
    this._ideal,
  );

  final GpuMap _map;
  final gpu.RenderPass _pass;
  final MapView _view;
  final Float64List _clip;
  final StyleSheet _sheet;
  final EvalContext _context;
  final double _styleZoom;

  /// Per source, the tiles standing in for missing ones and the tiles
  /// wanted, both indexed by the style's sources.
  final List<List<TileDraw>> _fallback, _ideal;

  /// The source whose tiles' numbers are in the stencil, or -1.
  int _marked = -1;

  bool _clips(int source) =>
      _map._stencil != null && _ideal[source].length < 255;

  /// Each tile writes its number over its square, and draws only where its
  /// number is: a tile's data runs a little past its square, and a
  /// translucent fill drawn twice there shows a seam. A tile standing in
  /// for a missing one draws where no number is. Tilted, a square is no
  /// rectangle on the screen, so scissors cannot do it. Sources tile the
  /// map apart, so the numbers are rewritten when the source changes.
  void _mark(int source) {
    if (source == _marked) return;
    final map = _map;
    _pass
      ..clearBindings()
      ..bindPipeline(map._stencil!)
      ..setCullMode(gpu.CullMode.none)
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(GpuMap._over)
      ..setStencilConfig(
        gpu.StencilConfig(
          depthStencilPassOperation: gpu.StencilOperation.setToReferenceValue,
        ),
      )
      ..bindVertexBuffer(
        gpu.BufferView(map._quad!, offsetInBytes: 0, lengthInBytes: 48),
      );
    void cover(List<TileDraw> tiles, bool clear) {
      for (final (i, d) in tiles.indexed) {
        if (_map._gpuOf(d) == null) continue;
        map._times(_clip, d.size / tileExtent, 1, d.left, d.top, 1);
        _pass
          ..setStencilReference(clear ? 0 : i + 1)
          ..bindUniform(map._stencilFrame!, map._host!.emplace(map._frameBytes))
          ..draw(6);
      }
    }

    if (_marked >= 0) cover(_ideal[_marked], true);
    cover(_ideal[source], false);
    _marked = source;
    _pass.clearBindings();
  }

  void _stencilEquals(int reference) => _pass
    ..setStencilReference(reference)
    ..setStencilConfig(
      gpu.StencilConfig(compareFunction: gpu.CompareFunction.equal),
    );

  /// Draws the paint layers of [runs] into this pass.
  void drawRuns(Iterable<StyleRun> runs) {
    var bound = false;
    for (final run in runs) {
      if (run.source < 0 || run.source >= _ideal.length) continue;
      final source = run.source;
      final clipped = _clips(source);
      if (clipped && _marked != source) {
        _mark(source);
        bound = false;
      }
      if (!bound) {
        _pass
          ..bindPipeline(_map._flat!)
          ..setDepthWriteEnable(false)
          ..setDepthCompareOperation(gpu.CompareFunction.always)
          ..setCullMode(gpu.CullMode.none)
          ..setColorBlendEnable(true)
          ..setColorBlendEquation(GpuMap._over);
        _map._bindSprites(_pass);
        bound = true;
      }
      if (clipped) {
        _stencilEquals(0);
        for (final d in _fallback[source]) {
          _drawFlat(d, run);
        }
      }
      for (final (i, d) in _ideal[source].indexed) {
        if (clipped) _stencilEquals(i + 1);
        _drawFlat(d, run);
      }
      _pass.setStencilConfig(gpu.StencilConfig());
    }
  }

  /// Draws [run]'s layers of tile [d].
  void _drawFlat(TileDraw d, StyleRun run) {
    final data = _map._gpuOf(d);
    final stream = data?.stream;
    if (data == null || stream == null) return;
    final from = stream.layerFirst[run.first];
    final to = stream.layerFirst[run.end];
    if (from == to) return;
    final map = _map;
    final host = map._host!;
    final scale = d.size / tileExtent;
    map._times(_clip, scale, 1, d.left, d.top, 1);
    _pass
      ..bindVertexBuffer(
        gpu.BufferView(
          data.buffer!,
          offsetInBytes: data.vertexOffset,
          lengthInBytes: stream.vertices.lengthInBytes,
        ),
      )
      ..bindUniform(map._flatFrame!, host.emplace(map._frameBytes));
    final segments = stream.segments;
    for (var s = 0; s < segments.length; s += 3) {
      final first = math.max(segments[s], from);
      final count = math.min(segments[s] + segments[s + 1], to) - first;
      if (count <= 0) continue;
      final slotBase = segments[s + 2];
      final slotEnd = s + 5 < segments.length
          ? segments[s + 5]
          : stream.slots.length;
      map._fillSlots(
        _sheet,
        d,
        data,
        slotBase,
        slotEnd,
        scale,
        _context,
        _styleZoom,
      );
      _pass
        ..bindUniform(map._flatSlots!, host.emplace(map._slotBytes))
        ..bindIndexBuffer(
          gpu.BufferView(
            data.buffer!,
            offsetInBytes: data.indexOffset + first * 4,
            lengthInBytes: count * 4,
          ),
          gpu.IndexType.int32,
        )
        ..drawIndexed(count);
    }
  }

  /// Buildings after the flat layers, with depth. The flat layers leave an
  /// index buffer bound, cleared first, or these draws would read their
  /// vertices through it.
  /// Draws building layer [layer], standing, depth tested.
  void drawBuildings(ExtrusionLayer layer) {
    bool built(List<TileDraw> tiles) =>
        tiles.any((d) => d.tile.extrusions.isNotEmpty);
    for (var source = 0; source < _ideal.length; source++) {
      final standIn = built(_fallback[source]) && _clips(source);
      if (!built(_ideal[source]) && !standIn) continue;
      if (standIn) _mark(source);
      _pass
        ..clearBindings()
        ..bindPipeline(_map._buildings!)
        ..setCullMode(gpu.CullMode.none)
        ..setColorBlendEnable(true)
        ..setStencilConfig(gpu.StencilConfig())
        ..setDepthWriteEnable(true)
        ..setDepthCompareOperation(gpu.CompareFunction.lessEqual);
      _drawBuildingsOf(layer, _ideal[source]);
      if (standIn) {
        _stencilEquals(0);
        _drawBuildingsOf(layer, _fallback[source]);
      }
    }
  }

  void _drawBuildingsOf(ExtrusionLayer layer, List<TileDraw> tiles) {
    final map = _map;
    final view = _view;
    final perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
    final host = map._host!;
    for (final d in tiles) {
      final data = _map._gpuOf(d);
      if (data == null) continue;
      if (data.buildings.every((b) => b.extrusion.bucket != layer.bucket)) {
        continue;
      }
      map._drape.bindGround(_pass, map.terrain, d.tile.id);
      for (final b in data.buildings) {
        if (b.extrusion.bucket != layer.bucket) continue;
        final fade = map._reveal.opacity(d.tile, layer, b);
        map._times(_clip, d.size / tileExtent, perMetre, d.left, d.top, fade);
        _pass
          ..bindVertexBuffer(
            gpu.BufferView(
              data.buffer!,
              offsetInBytes: b.offset,
              lengthInBytes: b.vertexCount * BuildingGpu.stride,
            ),
          )
          ..bindUniform(map._buildingFrame!, host.emplace(map._frameBytes))
          ..draw(b.vertexCount);
      }
    }
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
  final List<(gpu.Texture, ui.Image)> _overlays = [];

  /// The [i]th overlay's texture and image, made with [make] the first time.
  (gpu.Texture, ui.Image) overlay(int i, gpu.Texture Function() make) {
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
