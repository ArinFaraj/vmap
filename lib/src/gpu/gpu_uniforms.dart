import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../camera/globe.dart';
import '../camera/mercator.dart';
import '../camera/view.dart';
import '../render/pattern_growth.dart';
import '../render/zoom_history.dart';
import '../style/expr.dart';
import '../style/sprites.dart';
import '../style/style_model.dart';
import '../tiles/extrusion.dart';
import '../tiles/gpu_stream.dart';
import '../tiles/tile_id.dart';
import '../tiles/tiles.dart';
import 'building_reveal.dart';
import 'gpu_buffers.dart';
import 'gpu_pipelines.dart';
import 'gpu_shim/gpu.dart' as gpu;
import 'layer_paint.dart';
import 'layer_presence.dart';
import 'line_ramps.dart';

/// The style's sprite sheet on the GPU, for patterned fills, buildings and
/// icons, and the uniform blocks that say where its patterns are.
class SpriteTextures {
  SpriteTextures(this._ramps, this._onFailure);

  final LineRamps _ramps;
  final void Function(Object error) _onFailure;

  SpriteSheet? sheet;
  ui.Image? image;
  gpu.Texture? texture;

  /// The sheet's pixels once they are read, which a background's pattern
  /// on the drape is cut from.
  ByteData? pixels;

  /// The sheet's pixels are on their way to the GPU.
  bool loading = false;

  late final gpu.Texture blank = gpu.gpuContext.createTexture(
    gpu.StorageMode.hostVisible,
    1,
    1,
    format: gpu.PixelFormat.r8g8b8a8UNormInt,
  )..overwrite(ByteData(4));

  /// The sheet's size and the line ramps' size, as flat.frag takes them.
  final Float32List _frag = Float32List(4);
  late final ByteData _fragBytes = ByteData.sublistView(_frag);

  /// A building layer's patterns as building.vert takes them: 16 places in
  /// the sprite sheet, then 16 ratios.
  final Float32List _patterns = Float32List(32 * 4);
  late final ByteData patternBytes = ByteData.sublistView(_patterns);

  /// Copies the sprite sheet's pixels into a texture. Read back on the
  /// raster thread off the frame, since making a texture from an image
  /// directly stalls the frame that asks.
  Future<void> _load(ui.Image from) async {
    loading = true;
    try {
      final read = await from.toByteData();
      if (read == null || !identical(from, image)) return;
      pixels = read;
      texture = gpu.gpuContext.createTexture(
        gpu.StorageMode.hostVisible,
        from.width,
        from.height,
        format: gpu.PixelFormat.r8g8b8a8UNormInt,
      )..overwrite(read);
    } catch (e) {
      _onFailure(e);
    } finally {
      loading = false;
    }
  }

  /// The style's sprite sheet as a texture, sent to the GPU when it is new,
  /// a blank one until it is there; the fragment block starts with its size.
  gpu.Texture current() {
    final now = sheet?.image;
    if (!identical(now, image)) {
      image = now;
      texture = null;
      pixels = null;
      if (now != null) _load(now);
    }
    final shown = texture ?? blank;
    _frag
      ..[0] = shown.width.toDouble()
      ..[1] = shown.height.toDouble();
    return shown;
  }

  /// The style's sprite sheet as a texture, for patterned fills.
  void bind(gpu.RenderPass pass, GpuPipelines p, UniformArena host) {
    final texture = current();
    final ramp = _ramps.texture ?? blank;
    _frag
      ..[2] = ramp.width.toDouble()
      ..[3] = ramp.height.toDouble();
    final sampler = gpu.SamplerOptions(
      minFilter: gpu.MinMagFilter.linear,
      magFilter: gpu.MinMagFilter.linear,
    );
    pass
      ..bindUniform(p.flatFrag, host.emplace(_fragBytes))
      ..bindTexture(p.flatSprites, texture, sampler: sampler)
      ..bindTexture(p.flatRamp, ramp, sampler: sampler);
  }

  /// The sprite sheet for patterned buildings.
  void bindBuildings(gpu.RenderPass pass, GpuPipelines p, UniformArena host) {
    final texture = current();
    pass
      ..bindUniform(p.buildingSheet, host.emplace(_fragBytes))
      ..bindTexture(
        p.buildingSprites,
        texture,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.linear,
          magFilter: gpu.MinMagFilter.linear,
        ),
      );
  }

  /// Where [extrusion]'s patterns are in the sprite sheet, for a tile
  /// [scale] screen pixels a tile unit across with patterns grown by
  /// [growth]: sheet pixels a tile unit is, as a patterned fill takes them.
  /// A pattern the sheet lacks has a negative width, and as MapLibre its
  /// buildings are not drawn. Last, how far up a wall a metre moves its
  /// pattern, as the tile was built with.
  ///
  /// As MapLibre's `u_pixel_coord`, patterns are laid from the world's
  /// corner, not the tile's: the tile [id]'s corner in world pixels at the
  /// whole zoom [zoom], in each pattern's pixels, less whole repeats.
  ByteData patternsOf(
    BuiltExtrusion extrusion,
    double scale,
    double growth,
    TileId id,
    int zoom,
  ) {
    final tilePixels = 512 * math.pow(2, zoom - id.z).toDouble();
    final cornerX = id.x * tilePixels, cornerY = id.y * tilePixels;
    final out = _patterns..fillRange(0, _patterns.length, 0);
    final names = extrusion.patterns;
    for (var i = 0; i < names.length && i < 16; i++) {
      final entry = sheet?.entries[names[i]];
      if (entry == null) {
        out[i * 4 + 2] = -1;
        continue;
      }
      final source = entry.source;
      out
        ..[i * 4] = source.left
        ..[i * 4 + 1] = source.top
        ..[i * 4 + 2] = source.width
        ..[i * 4 + 3] = source.height
        ..[64 + i * 4] = entry.pixelRatio / growth * scale
        ..[64 + i * 4 + 1] = (cornerX * entry.pixelRatio) % source.width
        ..[64 + i * 4 + 2] = (cornerY * entry.pixelRatio) % source.height
        ..[64 + i * 4 + 3] = -(1 << id.z) / 8192;
    }
    return patternBytes;
  }
}

/// The uniform blocks the GPU renderer's shaders read, as their structs lay
/// them out: the frame's, written once a frame and then per tile, the map
/// shader's, and the buildings' on the globe.
class FrameBlocks {
  final Float32List frame = Float32List(40);
  late final ByteData frameBytes = ByteData.sublistView(frame);
  final Float32List map = Float32List(64);
  late final ByteData mapBytes = ByteData.sublistView(map);
  final Float32List _globe = Float32List(32);
  late final ByteData _globeBytes = ByteData.sublistView(_globe);

  /// How far one screen pixel reaches across clip space, each way.
  (double, double) clipPerPixel = (0, 0);

  /// The fog raised ground fades into, as MapLibre's: with a sky in the
  /// style and the map pitched past 60 degrees, by depth between the
  /// camera's distance to sea level ([39]) and the far plane ([23]), both
  /// in camera distances, to the sky's fog colour and then its horizon
  /// colour ([28..30]), as strong as [31]. None otherwise.
  void fog(StyleSheet sheet, EvalContext context, MapView view) {
    final out = frame;
    final sky = sheet.sky;
    final opacity = sky == null
        ? 0.0
        : ((view.pitch - 60) / 10).clamp(0.0, 1.0);
    out[31] = opacity;
    if (sky == null || opacity == 0) return;
    final fog = Rgba.of(sky.fogColor(context)) ?? const Rgba(1, 1, 1, 1);
    final horizon =
        Rgba.of(sky.horizonColor(context)) ?? const Rgba(1, 1, 1, 1);
    out
      ..[20] = fog.r
      ..[21] = fog.g
      ..[22] = fog.b
      ..[23] = view.farDistance / view.cameraToCenterDistance
      ..[39] = view.seaLevelDistance / view.cameraToCenterDistance
      ..[24] = (asNumber(sky.fogGroundBlend(context)) ?? 0.5).toDouble()
      ..[25] = (asNumber(sky.horizonFogBlend(context)) ?? 0.8).toDouble()
      ..[28] = horizon.r
      ..[29] = horizon.g
      ..[30] = horizon.b;
  }

  /// The style's light for buildings, as MapLibre's fill-extrusion shader
  /// takes it: [32..34] the direction it falls from, turned with the map
  /// when it keeps to the screen, [35] its intensity, [36..38] its colour.
  void light(ExtrusionLight light, MapView view) {
    final (x, y, z) = light.direction(view.bearing);
    frame
      ..[32] = x
      ..[33] = y
      ..[34] = z
      ..[35] = light.intensity
      ..[36] = light.color.r
      ..[37] = light.color.g
      ..[38] = light.color.b;
  }

  /// [clip] times a tile's placement into the frame info block: tile units
  /// scaled by [scale] and moved to [left], [top], heights by [perMetre].
  void times(
    Float64List clip,
    double scale,
    double perMetre,
    double left,
    double top,
    double fade,
  ) {
    final out = frame;
    for (var r = 0; r < 4; r++) {
      out[r] = clip[r] * scale;
      out[4 + r] = clip[4 + r] * scale;
      out[8 + r] = clip[8 + r] * perMetre;
      out[12 + r] = clip[r] * left + clip[4 + r] * top + clip[12 + r];
    }
    out[16] = fade;
    out[17] = scale;
    out[18] = clipPerPixel.$1;
    out[19] = clipPerPixel.$2;
  }

  /// building.vert's GlobeInfo for tile [id], zero off the globe.
  ///
  /// [shiftX], [shiftY] are the layer's translate in tile units.
  ByteData buildingGlobe(
    Globe? globe,
    TileId id, [
    double shiftX = 0,
    double shiftY = 0,
  ]) {
    final out = _globe;
    if (globe == null) {
      out.fillRange(0, 32, 0);
      return _globeBytes;
    }
    final n = 1 << id.z;
    out
      ..[0] = (id.x % n) / n
      ..[1] = id.y / n
      ..[2] = 1 / n
      ..[3] = globe.transition;
    final unit = 1 / globe.view.cameraToCenterDistance;
    for (var i = 0; i < 16; i++) {
      out[4 + i] = globe.matrix[i] * unit;
    }
    out
      ..[20] = globe.camera[0]
      ..[21] = globe.camera[1]
      ..[22] = globe.camera[2]
      ..[24] = shiftX
      ..[25] = shiftY;
    // MapLibre's transformLightDirection: the light turned to the map's
    // middle on the sphere.
    final lng = (globe.view.centerX * 360 - 180) * math.pi / 180;
    final lat = latitudeAt(globe.view.centerY) * math.pi / 180;
    final px = math.sin(lng) * math.cos(lat), py = math.sin(lat);
    final pz = math.cos(lng) * math.cos(lat);
    var rx = pz, ry = 0.0, rz = -px;
    var dx = ry * pz - rz * py, dy = rz * px - rx * pz, dz = rx * py - ry * px;
    final rl = math.sqrt(rx * rx + rz * rz),
        dl = math.sqrt(dx * dx + dy * dy + dz * dz);
    rx /= rl;
    rz /= rl;
    dx /= dl;
    dy /= dl;
    dz /= dl;
    final lx = frame[32], ly = -frame[33], lz = frame[34];
    out
      ..[28] = rx * lx + dx * ly + px * lz
      ..[29] = ry * lx + dy * ly + py * lz
      ..[30] = rz * lx + dz * ly + pz * lz;
    return _globeBytes;
  }

  /// The frame info block map.vert reads for a tile [id]: [frame]'s first
  /// 28 floats, then where it lays the tile on [globe], zero on the flat
  /// map, and the frame's dash cross-fade [dashMix] and ramp rows.
  ByteData mapFor(
    Globe? globe,
    TileId id,
    int zoom, {
    required double dashMix,
    required int rampRows,
  }) {
    final out = map;
    for (var i = 0; i < 28; i++) {
      out[i] = frame[i];
    }
    final tilePixels = 512 * math.pow(2, zoom - id.z).toDouble();
    final cornerX = (id.x * tilePixels).floor(),
        cornerY = (id.y * tilePixels).floor();
    out
      ..[56] = (cornerX >> 16).toDouble()
      ..[57] = (cornerY >> 16).toDouble()
      ..[58] = (cornerX & 0xFFFF).toDouble()
      ..[59] = (cornerY & 0xFFFF).toDouble()
      ..[60] = 0
      ..[61] = dashMix
      ..[62] = rampRows.toDouble();
    if (globe == null) {
      out.fillRange(28, 56, 0);
      return mapBytes;
    }
    final n = 1 << id.z;
    out
      ..[28] = (id.x % n) / n
      ..[29] = id.y / n
      ..[30] = 1 / n
      ..[31] = globe.transition
      ..[52] = math.cos(latitudeAt(globe.view.centerY) * math.pi / 180);
    for (var i = 0; i < 4; i++) {
      out[32 + i] = globe.plane[i];
    }
    // In clip space the flat map's w is 1 at the centre; the globe's is
    // brought to the same scale so the two mix and widths agree.
    final unit = 1 / globe.view.cameraToCenterDistance;
    for (var i = 0; i < 16; i++) {
      out[36 + i] = globe.matrix[i] * unit;
    }
    return mapBytes;
  }
}

/// Each style layer's paint for the tiles drawn this frame, written into
/// the slot table flat.vert reads per draw.
class LayerSlots {
  LayerSlots(this._presence, this._reveal, this._ramps, this._sprites);

  final LayerPresence _presence;
  final BuildingReveal _reveal;
  final LineRamps _ramps;
  final SpriteTextures _sprites;

  List<Map<Object, Map<String, Object?>>?> _states = const [];
  DashFade _dashFade = ZoomHistory.settled;

  final Float32List slots = Float32List(240 * 4);
  late final ByteData slotBytes = ByteData.sublistView(slots);

  /// One layer's paint this frame, in screen pixels, before a tile's scale.
  final Map<int, LayerPaint> _layerPaint = {};

  /// The slots of a tile's segment at a scale as written this frame: over
  /// raised ground a tile is drawn into every slot of the atlas it reaches,
  /// with the same paint each time.
  final Map<(TileGpu, int, double), gpu.BufferView> _written = {};

  /// The slots [write] puts in place for segment [segment] of [data] at
  /// [scale], written once a frame.
  gpu.BufferView written(
    TileGpu data,
    int segment,
    double scale,
    gpu.BufferView Function() write,
  ) => _written[(data, segment, scale)] ??= write();

  /// Forgets the last frame's paint, for a frame with the features'
  /// [states] by source and its [dashFade].
  void begin(
    List<Map<Object, Map<String, Object?>>?> states,
    DashFade dashFade,
  ) {
    _layerPaint.clear();
    _written.clear();
    _states = states;
    _dashFade = dashFade;
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
    final source = sheet.buckets[layer.bucket].source;
    context.state = props == null || source >= _states.length
        ? const {}
        : _states[source]?[featureStateKey(props[r'$id'])] ?? const {};
    final building = sheet.footprints[layerIndex];
    if (building == null) {
      final present = _presence.of(layerIndex);
      if (present <= 0) return LayerPaint.clear;
      if (present >= 1) {
        return LayerPaint.of(layer, context, styleZoom, props, _dashFade);
      }
      final zoom = styleZoom.clamp(layer.minZoom, layer.maxZoom - 1e-3);
      return LayerPaint.of(
        layer,
        context,
        zoom,
        props,
        _dashFade,
      ).scaled(present);
    }
    final shown =
        _presence.of(layerIndex) * (1 - _standingIn(d, data, building));
    if (shown <= 0) return LayerPaint.clear;
    final zoom = styleZoom.clamp(layer.minZoom, layer.maxZoom - 1e-3);
    return LayerPaint.of(layer, context, zoom, props, _dashFade).scaled(shown);
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
  /// tile units for a tile [scale] screen pixels to the unit on a map
  /// turned [bearing] degrees.
  /// Writes slots [from] to [to] of [d]'s stream from the start of
  /// [slots], and returns their bytes.
  ByteData fill(
    StyleSheet sheet,
    TileDraw d,
    TileGpu data,
    int from,
    int to,
    double scale,
    EvalContext context,
    double styleZoom,
    double bearing,
  ) {
    final out = slots;
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
        (i - from) * LayerPaint.slotFloats,
        GpuStream.kindOf(sheet.layers[layerIndex]),
        scale,
        _sprites.sheet,
        _ramps.gradientRowOf(layerIndex),
        _ramps.dashOf(layerIndex, styleZoom, choice: paint.dashChoice),
        dashBeforeRow: paint.dashBefore > 0
            ? _ramps.dashOf(
                layerIndex,
                _dashFade.fromZoom,
                choice: paint.dashChoice,
              )
            : null,
        rampRows: _ramps.rowCount,
        growth: patternGrowth(styleZoom),
        bearing: bearing,
      );
    }
    return ByteData.sublistView(slots, 0, (to - from) * LayerPaint.slotFloats);
  }
}
