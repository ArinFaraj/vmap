import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:vector_math/vector_math.dart' show Vector4;

import '../camera/globe.dart';
import '../camera/view.dart';
import '../platform.dart' show imagePixels;
import '../render/map_renderer.dart';
import '../style/expr.dart';
import '../style/style_model.dart';
import '../terrain/terrain.dart';
import '../tiles/built_tile.dart';
import '../tiles/tiles.dart';
import 'gpu_device.dart';
import 'gpu_map_pass.dart';
import 'gpu_shim/gpu.dart' as gpu;
import 'terrain_grid.dart';

/// The map laid over raised ground, as MapLibre draws terrain: each tile's
/// flat layers are drawn from above into a slot of one atlas texture in one
/// pass, then a grid per tile, raised by the heights, is drawn with depth
/// and coloured from its slot. Only the Flutter GPU tier draws terrain.
class Drape {
  Drape(this._device);

  final GpuDevice _device;

  /// The atlas's width and tallest height, and the sizes a slot may take in
  /// device pixels, largest first.
  static const _width = 4096, _maxHeight = 4096;
  static const _sizes = [1024, 512, 256];

  gpu.Texture? _atlas, _atlasDepth;

  /// A second atlas, for a layer drawn whole at an opacity.
  gpu.Texture? _layerAtlas;
  int _height = 0;

  /// The tiles of ground drawn this frame, nearest first, and their slots:
  /// corner and size in the atlas.
  List<CoverTile> _tiles = const [];
  List<(int, int, int)> _slots = const [];

  /// The grid every tile of ground is drawn with, raised in the vertex
  /// shader from its tile of heights.
  gpu.DeviceBuffer? _corners, _indices;

  /// Each raster tile's picture on the GPU, with the colour filter it was
  /// drawn through.
  final Expando<(ui.ColorFilter?, gpu.Texture, int, int)> _pictures = Expando();
  final Expando<bool> _inFlight = Expando();

  /// Whether a picture the last atlas wanted is still on its way.
  bool sending = false;

  /// Each of [tiles]' slots: as many device pixels on a side as the tile
  /// covers on the screen, rounded up to a size in [_sizes], so the map
  /// laid over the ground is as sharp as the flat map. Slots are packed in
  /// rows of one size, largest first; when they do not fit, the farthest
  /// tiles take smaller slots, and the farthest of all are left out.
  List<(int, int, int)> _layout(
    List<CoverTile> tiles,
    MapView view,
    double dpr,
  ) {
    final want = [
      for (final t in tiles)
        () {
          final span = view.worldSize / (1 << t.z);
          final onScreen =
              span * view.cameraToCenterDistance / t.distance * dpr;
          final size = _sizes.lastIndexWhere((s) => s >= onScreen * 0.85);
          return size < 0 ? 0 : size;
        }(),
    ];
    int height() {
      var total = 0;
      for (var k = 0; k < _sizes.length; k++) {
        final count = want.where((w) => w == k).length;
        total += (count / (_width ~/ _sizes[k])).ceil() * _sizes[k];
      }
      return total;
    }

    while (want.isNotEmpty && height() > _maxHeight) {
      final larger = want.lastIndexWhere((w) => w < _sizes.length - 1);
      if (larger < 0) {
        want.removeLast();
      } else {
        want[larger]++;
      }
    }
    final out = <(int, int, int)>[];
    final rowTop = <int>[];
    var top = 0;
    for (var k = 0; k < _sizes.length; k++) {
      rowTop.add(top);
      final count = want.where((w) => w == k).length;
      top += (count / (_width ~/ _sizes[k])).ceil() * _sizes[k];
    }
    final used = List.filled(_sizes.length, 0);
    for (final k in want) {
      final size = _sizes[k];
      final across = _width ~/ size;
      final n = used[k]++;
      out.add(((n % across) * size, rowTop[k] + (n ~/ across) * size, size));
    }
    return out;
  }

  /// Grows the atlas to hold [_slots].
  void _fit() {
    var bottom = 0;
    for (final (_, y, size) in _slots) {
      bottom = math.max(bottom, y + size);
    }
    final height = (bottom / 512).ceil() * 512;
    if (_atlas != null && height <= _height) return;
    _height = height;
    _atlas = gpu.gpuContext.createTexture(
      gpu.StorageMode.devicePrivate,
      _width,
      height,
      format: _device.color,
    );
    _layerAtlas = gpu.gpuContext.createTexture(
      gpu.StorageMode.devicePrivate,
      _width,
      height,
      format: _device.color,
    );
    _atlasDepth = _device.scratch(
      _width,
      height,
      gpu.gpuContext.defaultDepthStencilFormat,
      1,
    );
  }

  /// Draws the flat layers of every tile of ground under [view] into its
  /// slot, in a command buffer added to [buffers] ahead of the frame's.
  void drawAtlas(List<gpu.CommandBuffer> buffers, RenderFrame frame) {
    final RenderFrame(:view, :origin, :sheet, :context, :fallback, :ideal) =
        frame;
    // As deep as the view, past the data's own zoom: a tile drawn from
    // zoom 14 data into a deeper slot is as sharp as the flat map.
    // Ground past the screen's top as well: hills there rise into view.
    final all = view.cover(
      maxZoom: view.zoom.ceil(),
      variableZoom: true,
      beyond: view.height,
    );
    _slots = _layout(all, view, _device.blocks.frame[26]);
    _tiles = all.sublist(0, _slots.length);
    sending = false;
    if (_tiles.isEmpty) return;
    _fit();
    gpu.RenderPass begin(gpu.Texture target, {bool keep = false}) {
      final commands = gpu.gpuContext.createCommandBuffer();
      buffers.add(commands);
      return commands.createRenderPass(
        gpu.RenderTarget.singleColor(
          // Clear: where no layer is drawn, the canvas's background, drawn
          // under the GPU's picture, shows through.
          gpu.ColorAttachment(
            texture: target,
            loadAction: keep ? gpu.LoadAction.load : gpu.LoadAction.clear,
            clearValue: Vector4.zero(),
          ),
          depthStencilAttachment: gpu.DepthStencilAttachment(
            texture: _atlasDepth!,
            depthClearValue: 1,
          ),
        ),
      );
    }

    final dpr = _device.blocks.frame[26];
    // Each tile's slot in turn: its viewport, and the matrix that draws the
    // tile's square from above into it, north up.
    void inSlots(
      gpu.RenderPass pass,
      void Function(
        int i,
        Float64List clip,
        double left,
        double top,
        double span,
      )
      draw,
    ) {
      for (final (i, t) in _tiles.indexed) {
        final span = view.worldSize / (1 << t.z);
        final left = t.x * span - origin.dx, top = t.y * span - origin.dy;
        final (x, y, size) = _slots[i];
        pass
          ..setViewport(gpu.Viewport(x: x, y: y, width: size, height: size))
          ..setScissor(gpu.Scissor(x: x, y: y, width: size, height: size));
        final clip = Float64List(16)
          ..[0] = 2 / span
          ..[5] = -2 / span
          ..[12] = -1 - 2 * left / span
          ..[13] = 1 + 2 * top / span
          ..[14] = 0.5
          ..[15] = 1;
        draw(i, clip, left, top, span);
      }
    }

    void vector(
      gpu.RenderPass pass,
      List<StyleRun> runs,
      int i,
      Float64List clip,
      double left,
      double top,
      double span,
    ) {
      // On the globe without terrain the vector layers are laid on the
      // sphere directly, as MapLibre draws them.
      if (runs.isEmpty || (view.globe != null && frame.terrain == null)) {
        return;
      }
      _device.blocks.frame[26] = _slots[i].$3 / span;
      bool inSlot(TileDraw d) =>
          d.left < left + span &&
          d.left + d.size > left &&
          d.top < top + span &&
          d.top + d.size > top;
      final slotIdeal = [
        for (final tiles in ideal) tiles.where(inSlot).toList(),
      ];
      // Whether a source's ready tiles fill the slot, which leaves its
      // stand-ins nothing to show there: they would be drawn whole for
      // nothing, a coarse one into every slot it reaches.
      bool filled(List<TileDraw> tiles) {
        var area = 0.0;
        for (final d in tiles) {
          final w =
              math.min(d.left + d.size, left + span) - math.max(d.left, left);
          final h = math.min(d.top + d.size, top + span) - math.max(d.top, top);
          if (w > 0 && h > 0) area += w * h;
        }
        return area >= span * span * 0.9999;
      }

      // Stand-ins too, clipped as the flat map clips them, so a tile still
      // loading leaves no hole in the ground.
      MapPass(
          _device,
          pass,
          frame,
          clip,
          fallback: [
            for (final (s, tiles) in fallback.indexed)
              filled(slotIdeal[s])
                  ? const <TileDraw>[]
                  : tiles.where(inSlot).toList(),
          ],
          ideal: slotIdeal,
        )
        ..standing = false
        ..drawRuns(runs);
      _device.blocks.frame[26] = dpr;
    }

    // As on the flat map, a layer drawn whole at an opacity is drawn apart,
    // into a second atlas, and laid over its slot at that opacity before
    // the layers above it are drawn.
    final groups = <(StyleRun?, List<StyleRun>)>[(null, [])];
    for (final run in sheet.runs) {
      if (sheet.runOpacity(run, context) == null) {
        groups.last.$2.add(run);
      } else {
        groups.add((run, []));
      }
    }
    var pass = begin(_atlas!);
    for (final (index, (apart, runs)) in groups.indexed) {
      if (apart != null) {
        final opacity = sheet.runOpacity(apart, context)!;
        if (opacity > 0) {
          final alone = begin(_layerAtlas!);
          inSlots(alone, (i, clip, left, top, span) {
            vector(alone, [apart], i, clip, left, top, span);
          });
          pass = begin(_atlas!, keep: true);
          final into = pass;
          inSlots(into, (i, clip, left, top, span) {
            _lay(into, i, clip, left, top, span, opacity);
          });
        } else if (runs.isNotEmpty) {
          pass = begin(_atlas!, keep: true);
        }
      }
      final p = pass;
      inSlots(p, (i, clip, left, top, span) {
        if (index == 0) {
          for (final run in sheet.runs) {
            if (run.background >= 0) {
              _drawBackground(
                p,
                clip,
                left,
                top,
                span,
                sheet.backgrounds[run.background],
                context,
                worldLeft: left + origin.dx,
                worldTop: top + origin.dy,
                zoom: view.zoom,
              );
            } else if (run.raster >= 0 && run.raster < frame.rasters.length) {
              _drawPictures(
                p,
                frame.rasters[run.raster],
                clip,
                left,
                top,
                span,
              );
            }
          }
        }
        vector(p, runs, i, clip, left, top, span);
      });
    }
  }

  /// Lays slot [i] of the second atlas over the same slot of the atlas at
  /// [opacity], with the ground's pipeline drawing flat.
  void _lay(
    gpu.RenderPass pass,
    int i,
    Float64List clip,
    double left,
    double top,
    double span,
    double opacity,
  ) {
    final (x, y, size) = _slots[i];
    final height = _height.toDouble();
    _bindFlatGround(pass);
    _device.blocks.times(clip, span / tileExtent, 0, left, top, 0);
    _device.blocks.frame
      ..[16] = x / _width
      ..[17] = y / height
      ..[18] = size / _width
      ..[19] = size / height
      ..[27] = opacity;
    pass
      ..bindTexture(
        _device.pipelines.groundDrape!,
        _layerAtlas!,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.nearest,
          magFilter: gpu.MinMagFilter.nearest,
        ),
      )
      ..bindUniform(
        _device.pipelines.groundFrame!,
        _device.host.emplace(_device.blocks.frameBytes),
      )
      ..bindUniform(
        _device.pipelines.groundDem!,
        _device.host.emplace(_device.heights.bytes),
      )
      ..drawIndexed(gridIndexCount);
    _device.blocks.frame[27] = 1;
  }

  /// Draws the raster tiles over the slot whose clip matrix is [clip] and
  /// whose tile spans [span] from [left], [top], under its other layers, as
  /// flat ground with the ground's pipeline.
  void _drawPictures(
    gpu.RenderPass pass,
    List<RasterPiece> pieces,
    Float64List clip,
    double left,
    double top,
    double span,
  ) {
    var bound = false;
    for (final piece in pieces) {
      final target = piece.target;
      if (target.left >= left + span ||
          target.right <= left ||
          target.top >= top + span ||
          target.bottom <= top) {
        continue;
      }
      var picture = _pictureOf(piece);
      var source = piece.source;
      if (picture == null) {
        final meanwhile = piece.meanwhile;
        if (meanwhile == null) continue;
        picture = _pictures[meanwhile.$1];
        if (picture == null) continue;
        source = meanwhile.$2;
      }
      final (_, texture, width, height) = picture;
      if (!bound) {
        _bindFlatGround(pass);
        bound = true;
      }
      _device.blocks.times(
        clip,
        target.width / tileExtent,
        0,
        target.left,
        target.top,
        0,
      );
      for (var r = 0; r < 4; r++) {
        _device.blocks.frame[4 + r] = clip[4 + r] * target.height / tileExtent;
      }
      _device.blocks.frame
        ..[16] = source.left / width
        ..[17] = source.top / height
        ..[18] = source.width / width
        ..[19] = source.height / height
        ..[27] = piece.opacity;
      final filter = piece.smooth
          ? gpu.MinMagFilter.linear
          : gpu.MinMagFilter.nearest;
      pass
        ..bindTexture(
          _device.pipelines.groundDrape!,
          texture,
          sampler: gpu.SamplerOptions(minFilter: filter, magFilter: filter),
        )
        ..bindUniform(
          _device.pipelines.groundFrame!,
          _device.host.emplace(_device.blocks.frameBytes),
        )
        ..bindUniform(
          _device.pipelines.groundDem!,
          _device.host.emplace(_device.heights.bytes),
        )
        ..drawIndexed(gridIndexCount);
    }
    _device.blocks.frame[27] = 1;
  }

  /// Binds the ground pipeline drawing flat into a slot, for pictures and
  /// background colours.
  void _bindFlatGround(gpu.RenderPass pass) {
    final corners = _corners ??= gridCorners();
    final indices = _indices ??= gridIndices();
    pass
      ..clearBindings()
      ..bindPipeline(_device.pipelines.ground!)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(overBlend)
      ..setStencilConfig(gpu.StencilConfig())
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..bindVertexBuffer(
        gpu.BufferView(
          corners,
          offsetInBytes: 0,
          lengthInBytes: corners.sizeInBytes,
        ),
      )
      ..bindIndexBuffer(
        gpu.BufferView(
          indices,
          offsetInBytes: 0,
          lengthInBytes: indices.sizeInBytes,
        ),
        gpu.IndexType.int16,
      )
      ..bindTexture(
        _device.pipelines.groundHeights!,
        _device.heights.flat(0, 0),
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.nearest,
          magFilter: gpu.MinMagFilter.nearest,
        ),
      );
    _device.heights.setDrapeBounds(0, 0, 1, 1);
  }

  /// One pixel textures of the background colours drawn, by colour.
  final Map<int, gpu.Texture> _colours = {};

  /// Each background pattern on its own, by name, cut from the sprite
  /// sheet's pixels [_patternPixels] held.
  final Map<String, gpu.Texture?> _patterns = {};
  ByteData? _patternPixels;

  /// Background pattern [name] as a texture of its own, which repeats.
  gpu.Texture? _patternTexture(String name) {
    final pixels = _device.sprites.pixels;
    final entry = _device.sprites.sheet?.entries[name];
    if (pixels == null || entry == null) return null;
    if (!identical(pixels, _patternPixels)) {
      _patternPixels = pixels;
      _patterns.clear();
    }
    return _patterns.putIfAbsent(name, () {
      final sheetWidth = _device.sprites.image!.width;
      final source = entry.source;
      final x0 = source.left.round(), y0 = source.top.round();
      final w = source.width.round(), h = source.height.round();
      if (w <= 0 || h <= 0) return null;
      final cut = Uint8List(w * h * 4);
      final from = pixels.buffer.asUint8List(pixels.offsetInBytes);
      for (var y = 0; y < h; y++) {
        final at = ((y0 + y) * sheetWidth + x0) * 4;
        cut.setRange(y * w * 4, (y + 1) * w * 4, from, at);
      }
      return gpu.gpuContext.createTexture(
        gpu.StorageMode.hostVisible,
        w,
        h,
        format: gpu.PixelFormat.r8g8b8a8UNormInt,
      )..overwrite(ByteData.sublistView(cut));
    });
  }

  /// Fills the slot whose clip matrix is [clip] and whose tile spans [span]
  /// from [left], [top] with background [layer]'s colour, as the canvas
  /// fills the flat map's, or its pattern laid from the world's corner,
  /// [worldLeft], [worldTop] the tile's, as MapLibre's
  /// `background_pattern`: each image its size at the whole [zoom] below,
  /// grown with the map until the next.
  void _drawBackground(
    gpu.RenderPass pass,
    Float64List clip,
    double left,
    double top,
    double span,
    BackgroundLayer layer,
    EvalContext context, {
    required double worldLeft,
    required double worldTop,
    required double zoom,
  }) {
    if (layer.pattern?.call(context) case final Object name) {
      if (context.zoom < layer.minZoom || context.zoom >= layer.maxZoom) return;
      final entry = _device.sprites.sheet?.entries['$name'];
      final texture = _patternTexture('$name');
      if (entry == null || texture == null) return;
      final growth = math.pow(2, zoom - zoom.floorToDouble()).toDouble();
      final w = entry.source.width / entry.pixelRatio * growth;
      final h = entry.source.height / entry.pixelRatio * growth;
      double frac(double v) => v - v.floorToDouble();
      _bindFlatGround(pass);
      _device.heights.setDrapeBounds(-1e4, -1e4, 1e4, 1e4);
      _device.blocks.times(clip, span / tileExtent, 0, left, top, 0);
      _device.blocks.frame
        ..[16] = frac(worldLeft / w)
        ..[17] = frac(worldTop / h)
        ..[18] = span / w
        ..[19] = span / h
        ..[27] = (asNumber(layer.opacity(context)) ?? 1).clamp(0.0, 1.0);
      pass
        ..bindTexture(
          _device.pipelines.groundDrape!,
          texture,
          sampler: gpu.SamplerOptions(
            minFilter: gpu.MinMagFilter.linear,
            magFilter: gpu.MinMagFilter.linear,
            widthAddressMode: gpu.SamplerAddressMode.repeat,
            heightAddressMode: gpu.SamplerAddressMode.repeat,
          ),
        )
        ..bindUniform(
          _device.pipelines.groundFrame!,
          _device.host.emplace(_device.blocks.frameBytes),
        )
        ..bindUniform(
          _device.pipelines.groundDem!,
          _device.host.emplace(_device.heights.bytes),
        )
        ..drawIndexed(gridIndexCount);
      return;
    }
    final color = layer.colorAt(context);
    if (color == null || color.a <= 0) return;
    final argb = color.toArgb();
    final texture = _colours[argb] ??= () {
      final a = color.a.clamp(0.0, 1.0);
      int byte(double v) => (v.clamp(0.0, 1.0) * a * 255).round();
      final pixel = ByteData(4)
        ..setUint8(0, byte(color.r))
        ..setUint8(1, byte(color.g))
        ..setUint8(2, byte(color.b))
        ..setUint8(3, (a * 255).round());
      return gpu.gpuContext.createTexture(
        gpu.StorageMode.hostVisible,
        1,
        1,
        format: gpu.PixelFormat.r8g8b8a8UNormInt,
      )..overwrite(pixel);
    }();
    _bindFlatGround(pass);
    _device.blocks.times(clip, span / tileExtent, 0, left, top, 0);
    _device.blocks.frame
      ..[16] = 0.5
      ..[17] = 0.5
      ..[18] = 0
      ..[19] = 0
      ..[27] = 1;
    pass
      ..bindTexture(
        _device.pipelines.groundDrape!,
        texture,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.nearest,
          magFilter: gpu.MinMagFilter.nearest,
        ),
      )
      ..bindUniform(
        _device.pipelines.groundFrame!,
        _device.host.emplace(_device.blocks.frameBytes),
      )
      ..bindUniform(
        _device.pipelines.groundDem!,
        _device.host.emplace(_device.heights.bytes),
      )
      ..drawIndexed(gridIndexCount);
  }

  /// [piece]'s picture on the GPU, sent there when it is not yet; until it
  /// arrives, the one it had under another colour filter, or null.
  (ui.ColorFilter?, gpu.Texture, int, int)? _pictureOf(RasterPiece piece) {
    final kept = _pictures[piece.image];
    if (kept != null && kept.$1 == piece.filter) return kept;
    sending = true;
    if (_inFlight[piece.image] != true) _send(piece);
    return kept;
  }

  /// Copies [piece]'s picture, through its colour filter, into a texture.
  /// Read back on the raster thread off the frame, as the sprites are.
  Future<void> _send(RasterPiece piece) async {
    final image = piece.image;
    _inFlight[image] = true;
    ui.Image? filtered;
    try {
      if (piece.filter case final filter?) {
        final recorder = ui.PictureRecorder();
        ui.Canvas(recorder)
            .drawImage(image, ui.Offset.zero, ui.Paint()..colorFilter = filter);
        final picture = recorder.endRecording();
        filtered = await picture.toImage(image.width, image.height);
        picture.dispose();
      }
      final pixels = await (filtered?.toByteData() ?? imagePixels(image));
      if (pixels == null) return;
      _pictures[image] = (
        piece.filter,
        gpu.gpuContext.createTexture(
          gpu.StorageMode.hostVisible,
          image.width,
          image.height,
          format: gpu.PixelFormat.r8g8b8a8UNormInt,
        )..overwrite(pixels),
        image.width,
        image.height,
      );
      onGpu[image] = true;
    } catch (e) {
      _device.fail(e);
    } finally {
      filtered?.dispose();
      _inFlight[image] = false;
    }
  }

  /// Draws the raised ground of every tile [drawAtlas] drew, coloured from
  /// its slot, writing depth.
  void drawGround(
    gpu.RenderPass pass,
    Terrain terrain,
    MapView view,
    ui.Offset origin,
    Float64List clip,
  ) {
    final pipeline = _device.pipelines.ground;
    final atlas = _atlas;
    if (pipeline == null || atlas == null || _tiles.isEmpty) return;
    final corners = _corners ??= gridCorners();
    final indices = _indices ??= gridIndices();
    final perMetre = perMetreAt(view);
    final nearest = gpu.SamplerOptions(
      minFilter: gpu.MinMagFilter.nearest,
      magFilter: gpu.MinMagFilter.nearest,
    );
    pass
      ..clearBindings()
      ..bindPipeline(pipeline)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(false)
      ..setStencilConfig(gpu.StencilConfig())
      ..setDepthWriteEnable(true)
      ..setDepthCompareOperation(gpu.CompareFunction.lessEqual)
      ..bindVertexBuffer(
        gpu.BufferView(
          corners,
          offsetInBytes: 0,
          lengthInBytes: corners.sizeInBytes,
        ),
      )
      ..bindIndexBuffer(
        gpu.BufferView(
          indices,
          offsetInBytes: 0,
          lengthInBytes: indices.sizeInBytes,
        ),
        gpu.IndexType.int16,
      )
      ..bindTexture(
        _device.pipelines.groundDrape!,
        atlas,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.linear,
          magFilter: gpu.MinMagFilter.linear,
        ),
      );
    final height = _height.toDouble();
    for (final (i, t) in _tiles.indexed) {
      final (x, y, size) = _slots[i];
      final span = view.worldSize / (1 << t.z);
      _device.blocks.times(
        clip,
        span / tileExtent,
        perMetre,
        t.x * span - origin.dx,
        t.y * span - origin.dy,
        1,
      );
      _device.blocks.frame
        ..[16] = x / _width
        ..[17] = y / height
        ..[18] = size / _width
        ..[19] = size / height;
      final heights = _device.heights.heightsFor(t.z, t.x, t.y, terrain, 0);
      _device.heights.setDrapeBounds(
        (x + 0.5) / _width,
        (y + 0.5) / height,
        (x + size - 0.5) / _width,
        (y + size - 0.5) / height,
      );
      pass
        ..bindTexture(
          _device.pipelines.groundHeights!,
          heights,
          sampler: nearest,
        )
        ..bindUniform(
          _device.pipelines.groundFrame!,
          _device.host.emplace(_device.blocks.frameBytes),
        )
        ..bindUniform(
          _device.pipelines.groundDem!,
          _device.host.emplace(_device.heights.bytes),
        )
        ..drawIndexed(gridIndexCount);
    }
  }

  /// The grid tiles are laid on the globe with: rows of corners, then a
  /// corner at the north pole under each corner of the top edge and one at
  /// the south pole under each of the bottom edge.
  gpu.DeviceBuffer? _globeCorners, _globeIndices;
  final Float32List _globeInfo = Float32List(48);
  late final ByteData _globeBytes = ByteData.sublistView(_globeInfo);

  /// Draws every tile [drawAtlas] drew on [globe], coloured from its slot,
  /// the tiles at the top and bottom of the world stretched to the poles,
  /// as MapLibre covers them. Between the flat map and the globe, each
  /// point is drawn that far between where each puts it.
  void drawGlobe(
    gpu.RenderPass pass,
    Globe globe,
    MapView view,
    ui.Offset origin,
    Float64List clip,
  ) {
    final pipeline = _device.pipelines.globe;
    final atlas = _atlas;
    if (pipeline == null || atlas == null || _tiles.isEmpty) return;
    final corners = _globeCorners ??= globeGridCorners();
    final indices = _globeIndices ??= globeGridIndices();
    pass
      ..clearBindings()
      ..bindPipeline(pipeline)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(overBlend)
      ..setStencilConfig(gpu.StencilConfig())
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..bindVertexBuffer(
        gpu.BufferView(
          corners,
          offsetInBytes: 0,
          lengthInBytes: corners.sizeInBytes,
        ),
      )
      ..bindTexture(
        _device.pipelines.globeDrape!,
        atlas,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.linear,
          magFilter: gpu.MinMagFilter.linear,
        ),
      );
    final out = _globeInfo;
    final unit = 1 / view.cameraToCenterDistance;
    for (var i = 0; i < 16; i++) {
      out[i] = globe.matrix[i] * unit;
    }
    for (var i = 0; i < 4; i++) {
      out[40 + i] = globe.plane[i];
    }
    final height = _height.toDouble();
    out
      ..[44] = 1
      ..[45] = 0.5 / _width
      ..[46] = 0.5 / height;
    for (final (i, t) in _tiles.indexed) {
      final (x, y, size) = _slots[i];
      final n = 1 << t.z;
      final span = view.worldSize / n;
      _device.blocks.times(
        clip,
        span / tileExtent,
        0,
        t.x * span - origin.dx,
        t.y * span - origin.dy,
        1,
      );
      for (var k = 0; k < 16; k++) {
        out[16 + k] = _device.blocks.frame[k];
      }
      out
        ..[32] = x / _width
        ..[33] = y / height
        ..[34] = size / _width
        ..[35] = size / height
        ..[36] = (t.x % n) / n
        ..[37] = t.y / n
        ..[38] = 1 / n
        ..[39] = globe.transition;
      pass.bindUniform(
        _device.pipelines.globeFrame!,
        _device.host.emplace(_globeBytes),
      );
      void draw(int first, int count) => pass
        ..bindIndexBuffer(
          gpu.BufferView(
            indices,
            offsetInBytes: first * 2,
            lengthInBytes: count * 2,
          ),
          gpu.IndexType.int16,
        )
        ..drawIndexed(count);
      draw(0, globeMainCount);
      if (t.y == 0) draw(globeMainCount, globeCapCount);
      if (t.y == n - 1) draw(globeMainCount + globeCapCount, globeCapCount);
    }
  }
}
