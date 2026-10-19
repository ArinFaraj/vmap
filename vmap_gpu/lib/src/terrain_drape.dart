part of 'gpu_map.dart';

/// The map laid over raised ground, as MapLibre draws terrain: each tile's
/// flat layers are drawn from above into a slot of one atlas texture in one
/// pass, then a grid per tile, raised by the heights, is drawn with depth
/// and coloured from its slot. Only the Flutter GPU tier draws terrain.
class _Drape {
  _Drape(this._map);

  final GpuMap _map;

  /// The atlas's width and tallest height, the sizes a slot may take in
  /// device pixels, largest first, and grid cells on a side of the ground
  /// every tile shares.
  static const _width = 4096, _maxHeight = 4096, _grid = 32;
  static const _sizes = [1024, 512, 256];

  gpu.Texture? _atlas, _atlasDepth;
  int _height = 0;

  /// The tiles of ground drawn this frame, nearest first, and their slots:
  /// corner and size in the atlas.
  List<CoverTile> _tiles = const [];
  List<(int, int, int)> _slots = const [];

  /// The grid every tile of ground is drawn with, raised in the vertex
  /// shader from its tile of heights.
  gpu.DeviceBuffer? _corners, _indices;

  /// Each tile of heights on the GPU, sent again when a neighbour has
  /// filled its border since.
  final Expando<(gpu.Texture, int)> _uploaded = Expando();
  late final gpu.Texture _flat = gpu.gpuContext.createTexture(
    gpu.StorageMode.hostVisible,
    1,
    1,
    format: gpu.PixelFormat.r32Float,
  )..overwrite(ByteData(4));
  final Float32List _demInfo = Float32List(8);
  late final ByteData _demBytes = ByteData.sublistView(_demInfo);

  /// Each raster tile's picture on the GPU, with the colour filter it was
  /// drawn through.
  final Expando<(ui.ColorFilter?, gpu.Texture)> _pictures = Expando();
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
      format: _map._color,
    );
    _atlasDepth = _map._scratch(
      _width,
      height,
      gpu.gpuContext.defaultDepthStencilFormat,
      1,
    );
  }

  /// Draws the flat layers of every tile of ground under [view] into its
  /// slot, in a command buffer added to [buffers] ahead of the frame's.
  void drawAtlas(
    List<gpu.CommandBuffer> buffers,
    MapView view,
    ui.Offset origin,
    StyleSheet sheet,
    EvalContext context,
    double styleZoom,
    List<List<TileDraw>> fallback,
    List<List<TileDraw>> ideal,
  ) {
    // As deep as the view, past the data's own zoom: a tile drawn from
    // zoom 14 data into a deeper slot is as sharp as the flat map.
    // Ground past the screen's top as well: hills there rise into view.
    final all = view.cover(
      maxZoom: view.zoom.ceil(),
      variableZoom: true,
      beyond: view.height,
    );
    _slots = _layout(all, view, _map._frameInfo[26]);
    _tiles = all.sublist(0, _slots.length);
    sending = false;
    if (_tiles.isEmpty) return;
    _fit();
    final commands = gpu.gpuContext.createCommandBuffer();
    buffers.add(commands);
    final pass = commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        // Clear: where no layer is drawn, the canvas's background, drawn
        // under the GPU's picture, shows through.
        gpu.ColorAttachment(texture: _atlas!, clearValue: Vector4.zero()),
        depthStencilAttachment: gpu.DepthStencilAttachment(
          texture: _atlasDepth!,
          depthClearValue: 1,
        ),
      ),
    );
    final dpr = _map._frameInfo[26];
    for (final (i, t) in _tiles.indexed) {
      final span = view.worldSize / (1 << t.z);
      final left = t.x * span - origin.dx, top = t.y * span - origin.dy;
      final (x, y, size) = _slots[i];
      pass
        ..setViewport(gpu.Viewport(x: x, y: y, width: size, height: size))
        ..setScissor(gpu.Scissor(x: x, y: y, width: size, height: size));
      // From above: the tile's square fills the slot, north up.
      final clip = Float64List(16)
        ..[0] = 2 / span
        ..[5] = -2 / span
        ..[12] = -1 - 2 * left / span
        ..[13] = 1 + 2 * top / span
        ..[14] = 0.5
        ..[15] = 1;
      for (final run in sheet.runs) {
        if (run.background >= 0 && view.globe != null) {
          _drawBackground(
            pass,
            clip,
            left,
            top,
            span,
            sheet.backgrounds[run.background],
            context,
          );
        } else if (run.raster >= 0 && run.raster < _map.rasters.length) {
          _drawPictures(pass, _map.rasters[run.raster], clip, left, top, span);
        }
      }
      _map._frameInfo[26] = size / span;
      bool inSlot(TileDraw d) =>
          d.left < left + span &&
          d.left + d.size > left &&
          d.top < top + span &&
          d.top + d.size > top;
      // On the globe without terrain the vector layers are laid on the
      // sphere directly, as MapLibre draws them.
      if (view.globe != null && _map.terrain == null) continue;
      // Stand-ins too, clipped as the flat map clips them, so a tile still
      // loading leaves no hole in the ground.
      _MapPass(
        _map,
        pass,
        view,
        clip,
        sheet,
        context,
        styleZoom,
        [for (final tiles in fallback) tiles.where(inSlot).toList()],
        [for (final tiles in ideal) tiles.where(inSlot).toList()],
      ).drawRuns(sheet.runs);
    }
    _map._frameInfo[26] = dpr;
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
    final map = _map;
    var bound = false;
    for (final piece in pieces) {
      final target = piece.target;
      if (target.left >= left + span ||
          target.right <= left ||
          target.top >= top + span ||
          target.bottom <= top) {
        continue;
      }
      final texture = _pictureOf(piece);
      if (texture == null) continue;
      if (!bound) {
        _bindFlatGround(pass);
        bound = true;
      }
      final source = piece.source;
      final width = piece.image.width, height = piece.image.height;
      map._times(
        clip,
        target.width / tileExtent,
        0,
        target.left,
        target.top,
        0,
      );
      for (var r = 0; r < 4; r++) {
        map._frameInfo[4 + r] = clip[4 + r] * target.height / tileExtent;
      }
      map._frameInfo
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
          map._groundDrape!,
          texture,
          sampler: gpu.SamplerOptions(minFilter: filter, magFilter: filter),
        )
        ..bindUniform(map._groundFrame!, map._host!.emplace(map._frameBytes))
        ..bindUniform(map._groundDem!, map._host!.emplace(_demBytes))
        ..drawIndexed(_indexCount);
    }
    map._frameInfo[27] = 1;
  }

  /// Binds the ground pipeline drawing flat into a slot, for pictures and
  /// background colours.
  void _bindFlatGround(gpu.RenderPass pass) {
    final map = _map;
    final corners = _corners ??= _gridCorners();
    final indices = _indices ??= _gridIndices();
    pass
      ..clearBindings()
      ..bindPipeline(map._ground!)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(GpuMap._over)
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
        map._groundHeights!,
        _flatHeights(0, 0),
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.nearest,
          magFilter: gpu.MinMagFilter.nearest,
        ),
      );
  }

  /// One pixel textures of the background colours drawn, by colour.
  final Map<int, gpu.Texture> _colours = {};

  /// Fills the slot whose clip matrix is [clip] and whose tile spans [span]
  /// from [left], [top] with background [layer]'s colour, as the canvas
  /// fills the flat map's.
  void _drawBackground(
    gpu.RenderPass pass,
    Float64List clip,
    double left,
    double top,
    double span,
    BackgroundLayer layer,
    EvalContext context,
  ) {
    final map = _map;
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
    map._times(clip, span / tileExtent, 0, left, top, 0);
    map._frameInfo
      ..[16] = 0.5
      ..[17] = 0.5
      ..[18] = 0
      ..[19] = 0
      ..[27] = 1;
    pass
      ..bindTexture(
        map._groundDrape!,
        texture,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.nearest,
          magFilter: gpu.MinMagFilter.nearest,
        ),
      )
      ..bindUniform(map._groundFrame!, map._host!.emplace(map._frameBytes))
      ..bindUniform(map._groundDem!, map._host!.emplace(_demBytes))
      ..drawIndexed(_indexCount);
  }

  /// [piece]'s picture on the GPU, sent there when it is not yet; until it
  /// arrives, the one it had under another colour filter, or null.
  gpu.Texture? _pictureOf(RasterPiece piece) {
    final kept = _pictures[piece.image];
    if (kept != null && kept.$1 == piece.filter) return kept.$2;
    sending = true;
    if (_inFlight[piece.image] != true) _send(piece);
    return kept?.$2;
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
      final pixels = await (filtered ?? image).toByteData();
      if (pixels == null) return;
      _pictures[image] = (
        piece.filter,
        gpu.gpuContext.createTexture(
          gpu.StorageMode.hostVisible,
          image.width,
          image.height,
          format: gpu.PixelFormat.r8g8b8a8UNormInt,
        )..overwrite(pixels),
      );
    } catch (e) {
      debugPrint('vmap_gpu: a raster tile is not on the GPU: $e');
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
    final map = _map;
    final pipeline = map._ground;
    final atlas = _atlas;
    if (pipeline == null || atlas == null || _tiles.isEmpty) return;
    final corners = _corners ??= _gridCorners();
    final indices = _indices ??= _gridIndices();
    final perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
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
        map._groundDrape!,
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
      map._times(
        clip,
        span / tileExtent,
        perMetre,
        t.x * span - origin.dx,
        t.y * span - origin.dy,
        1,
      );
      map._frameInfo
        ..[16] = x / _width
        ..[17] = y / height
        ..[18] = size / _width
        ..[19] = size / height;
      pass
        ..bindTexture(
          map._groundHeights!,
          _heightsFor(t.z, t.x, t.y, terrain, 0),
          sampler: nearest,
        )
        ..bindUniform(map._groundFrame!, map._host!.emplace(map._frameBytes))
        ..bindUniform(map._groundDem!, map._host!.emplace(_demBytes))
        ..drawIndexed(_indexCount);
    }
  }

  /// The grid tiles are laid on the globe with: rows of corners, then a
  /// corner at the north pole under each corner of the top edge and one at
  /// the south pole under each of the bottom edge.
  gpu.DeviceBuffer? _globeCorners, _globeIndices;
  static const _globeMain = _grid * _grid * 6, _globeCap = _grid * 6;
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
    final map = _map;
    final pipeline = map._globe;
    final atlas = _atlas;
    if (pipeline == null || atlas == null || _tiles.isEmpty) return;
    final corners = _globeCorners ??= _globeGridCorners();
    final indices = _globeIndices ??= _globeGridIndices();
    pass
      ..clearBindings()
      ..bindPipeline(pipeline)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(GpuMap._over)
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
        map._globeDrape!,
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
      map._times(
        clip,
        span / tileExtent,
        0,
        t.x * span - origin.dx,
        t.y * span - origin.dy,
        1,
      );
      for (var k = 0; k < 16; k++) {
        out[16 + k] = map._frameInfo[k];
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
      pass.bindUniform(map._globeFrame!, map._host!.emplace(_globeBytes));
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
      draw(0, _globeMain);
      if (t.y == 0) draw(_globeMain, _globeCap);
      if (t.y == n - 1) draw(_globeMain + _globeCap, _globeCap);
    }
  }

  static gpu.DeviceBuffer _globeGridCorners() {
    const side = _grid + 1;
    final out = Float32List((side * side + 2 * side) * 2);
    var o = 0;
    for (var j = 0; j <= _grid; j++) {
      for (var i = 0; i <= _grid; i++) {
        out
          ..[o++] = i / _grid
          ..[o++] = j / _grid;
      }
    }
    for (final pole in const [-1.0, 2.0]) {
      for (var i = 0; i <= _grid; i++) {
        out
          ..[o++] = i / _grid
          ..[o++] = pole;
      }
    }
    return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
  }

  static gpu.DeviceBuffer _globeGridIndices() {
    const side = _grid + 1;
    final out = Uint16List(_globeMain + 2 * _globeCap);
    var o = 0;
    void quad(int a, int b, int c, int d) => out
      ..[o++] = a
      ..[o++] = c
      ..[o++] = d
      ..[o++] = a
      ..[o++] = d
      ..[o++] = b;
    for (var j = 0; j < _grid; j++) {
      for (var i = 0; i < _grid; i++) {
        final a = j * side + i;
        quad(a, a + 1, a + side, a + side + 1);
      }
    }
    const north = side * side, south = north + side;
    for (var i = 0; i < _grid; i++) {
      quad(north + i, north + i + 1, i, i + 1);
    }
    for (var i = 0; i < _grid; i++) {
      final edge = _grid * side + i;
      quad(edge, edge + 1, south + i, south + i + 1);
    }
    return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
  }

  /// Binds the ground under building tile [id] to the building pipeline:
  /// flat at sea level without [terrain].
  void bindGround(gpu.RenderPass pass, Terrain? terrain, TileId? id) {
    final map = _map;
    final heights = terrain == null || id == null
        ? _flatHeights(0, 0)
        : _heightsFor(id.z, id.x, id.y, terrain, 2);
    pass
      ..bindTexture(
        map._buildingHeights!,
        heights,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.nearest,
          magFilter: gpu.MinMagFilter.nearest,
        ),
      )
      ..bindUniform(map._buildingDem!, map._host!.emplace(_demBytes));
  }

  gpu.Texture _flatHeights(double centre, double sink) {
    _demInfo
      ..[0] = 0.5
      ..[1] = 0.5
      ..[2] = 0
      ..[3] = 2
      ..[4] = 0
      ..[5] = 1
      ..[6] = centre
      ..[7] = sink;
    return _flat;
  }

  /// The tile of heights tile [z], [x], [y] is raised from, on the GPU,
  /// with where the tile lies in it written to the shaders' DemInfo, and
  /// [sink] the metres a building's foot goes below the ground; a flat one
  /// where none is loaded.
  gpu.Texture _heightsFor(
    int tz,
    int tx,
    int ty,
    Terrain terrain,
    double sink,
  ) {
    final n = 1 << tz;
    tx %= n;
    final found = terrain.heights.locate(
      (tx + 0.5) / n,
      (ty + 0.5) / n,
      math.min(tz, terrain.maxZoom),
    );
    if (found == null) return _flatHeights(terrain.centre, sink);
    final (dem, z, x, y) = found;
    // The tile is this share of the heights tile, deeper zooms being
    // smaller shares.
    final share = 1 / (1 << (tz - z));
    final x0 = tx * share - x, y0 = ty * share - y;
    final metres =
        40075016.686 *
        math.cos(latitudeAt((y + 0.5) / (1 << z)) * math.pi / 180) /
        (1 << z) /
        dem.dim;
    _demInfo
      ..[0] = 1 + (x0 - x0.floorToDouble()) * dem.dim
      ..[1] = 1 + (y0 - y0.floorToDouble()) * dem.dim
      ..[2] = share * dem.dim
      ..[3] = dem.dim + 2
      ..[4] = terrain.exaggeration
      ..[5] = metres
      ..[6] = terrain.centre
      ..[7] = sink;
    final kept = _uploaded[dem];
    if (kept != null && kept.$2 == dem.version) return kept.$1;
    final texture = gpu.gpuContext.createTexture(
      gpu.StorageMode.hostVisible,
      dem.dim + 2,
      dem.dim + 2,
      format: gpu.PixelFormat.r32Float,
    )..overwrite(ByteData.sublistView(dem.heights));
    _uploaded[dem] = (texture, dem.version);
    return texture;
  }

  static const _indexCount = _grid * _grid * 6 + 4 * _grid * 6;

  /// The grid's corners in rows, then a skirt corner under each corner of
  /// the edge, walking it round: top, right, bottom, left.
  static List<(int, int)> get _edge => [
    for (var i = 0; i < _grid; i++) (i, 0),
    for (var j = 0; j < _grid; j++) (_grid, j),
    for (var i = _grid; i > 0; i--) (i, _grid),
    for (var j = _grid; j > 0; j--) (0, j),
  ];

  static gpu.DeviceBuffer _gridCorners() {
    final edge = _edge;
    final out = Float32List(((_grid + 1) * (_grid + 1) + edge.length) * 2);
    var o = 0;
    for (var j = 0; j <= _grid; j++) {
      for (var i = 0; i <= _grid; i++) {
        out
          ..[o++] = i / _grid
          ..[o++] = j / _grid;
      }
    }
    for (final (i, j) in edge) {
      out
        ..[o++] = 2 + i / _grid
        ..[o++] = j / _grid;
    }
    return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
  }

  static gpu.DeviceBuffer _gridIndices() {
    final out = Uint16List(_indexCount);
    var o = 0;
    void quad(int a, int b, int c, int d) => out
      ..[o++] = a
      ..[o++] = c
      ..[o++] = d
      ..[o++] = a
      ..[o++] = d
      ..[o++] = b;
    for (var j = 0; j < _grid; j++) {
      for (var i = 0; i < _grid; i++) {
        final a = j * (_grid + 1) + i;
        quad(a, a + 1, a + _grid + 1, a + _grid + 2);
      }
    }
    final edge = _edge;
    final skirts = (_grid + 1) * (_grid + 1);
    for (var k = 0; k < edge.length; k++) {
      final next = (k + 1) % edge.length;
      int top(int k) => edge[k].$2 * (_grid + 1) + edge[k].$1;
      quad(top(k), top(next), skirts + k, skirts + next);
    }
    return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
  }
}
