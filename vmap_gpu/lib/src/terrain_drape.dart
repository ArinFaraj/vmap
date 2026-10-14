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
    final all = view.cover(maxZoom: view.zoom.ceil(), variableZoom: true);
    _slots = _layout(all, view, _map._frameInfo[26]);
    _tiles = all.sublist(0, _slots.length);
    if (_tiles.isEmpty) return;
    _fit();
    final commands = gpu.gpuContext.createCommandBuffer();
    buffers.add(commands);
    final pass = commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        // Clear: where no vector layer is drawn, the canvas's background
        // and raster layers, drawn under the GPU's picture, show through.
        // They lie flat until rasters are draped too.
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
      _map._frameInfo[26] = size / span;
      bool inSlot(TileDraw d) =>
          d.left < left + span &&
          d.left + d.size > left &&
          d.top < top + span &&
          d.top + d.size > top;
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
