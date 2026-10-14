part of 'gpu_map.dart';

/// The map laid over raised ground, as MapLibre draws terrain: each tile's
/// flat layers are drawn from above into a slot of one atlas texture in one
/// pass, then a grid per tile, raised by the heights, is drawn with depth
/// and coloured from its slot. Only the Flutter GPU tier draws terrain.
class _Drape {
  _Drape(this._map);

  final GpuMap _map;

  /// Device pixels on a side of one tile's slot, slots across the atlas,
  /// and grid cells on a side of the ground every tile shares.
  static const _slot = 512, _columns = 8, _grid = 32;

  gpu.Texture? _atlas, _atlasDepth;
  int _rows = 0;

  /// The tiles of ground drawn this frame, nearest first, and their slots.
  List<CoverTile> _tiles = const [];

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

  int get _capacity => _columns * 8;

  /// Grows the atlas to hold [count] slots, up to its [_capacity].
  void _fit(int count) {
    final rows = (count / _columns).ceil().clamp(1, 8);
    if (_atlas != null && rows <= _rows) return;
    _rows = rows;
    final width = _columns * _slot, height = rows * _slot;
    _atlas = gpu.gpuContext.createTexture(
      gpu.StorageMode.devicePrivate,
      width,
      height,
      format: _map._color,
    );
    _atlasDepth = _map._scratch(
      width,
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
    final all = view.cover(maxZoom: 14);
    _tiles = all.length > _capacity ? all.sublist(0, _capacity) : all;
    _fit(_tiles.length);
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
      final x = (i % _columns) * _slot, y = (i ~/ _columns) * _slot;
      pass
        ..setViewport(gpu.Viewport(x: x, y: y, width: _slot, height: _slot))
        ..setScissor(gpu.Scissor(x: x, y: y, width: _slot, height: _slot));
      // From above: the tile's square fills the slot, north up.
      final clip = Float64List(16)
        ..[0] = 2 / span
        ..[5] = -2 / span
        ..[12] = -1 - 2 * left / span
        ..[13] = 1 + 2 * top / span
        ..[14] = 0.5
        ..[15] = 1;
      _map._frameInfo[26] = _slot / span;
      _MapPass(
        _map,
        pass,
        view,
        clip,
        sheet,
        context,
        styleZoom,
        fallback,
        ideal,
      ).drape(
        sheet.runs,
        (d) =>
            d.left < left + span &&
            d.left + d.size > left &&
            d.top < top + span &&
            d.top + d.size > top,
      );
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
    final width = (_columns * _slot).toDouble();
    final height = (_rows * _slot).toDouble();
    for (final (i, t) in _tiles.indexed) {
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
        ..[16] = (i % _columns) * _slot / width
        ..[17] = (i ~/ _columns) * _slot / height
        ..[18] = _slot / width
        ..[19] = _slot / height;
      pass
        ..bindTexture(
          map._groundHeights!,
          _heightsFor(t, terrain),
          sampler: nearest,
        )
        ..bindUniform(map._groundFrame!, map._host!.emplace(map._frameBytes))
        ..bindUniform(map._groundDem!, map._host!.emplace(_demBytes))
        ..drawIndexed(_grid * _grid * 6);
    }
  }

  /// The tile of heights ground tile [t] is raised from, on the GPU, with
  /// where [t] lies in it written to the shader's DemInfo; a flat one where
  /// none is loaded.
  gpu.Texture _heightsFor(CoverTile t, Terrain terrain) {
    final n = 1 << t.z;
    final found = terrain.heights.locate(
      (t.x + 0.5) / n,
      (t.y + 0.5) / n,
      math.min(t.z, terrain.maxZoom),
    );
    if (found == null) {
      _demInfo
        ..[0] = 0.5
        ..[1] = 0.5
        ..[2] = 0
        ..[3] = 1
        ..[4] = 0
        ..[5] = 1;
      return _flat;
    }
    final (dem, z, x, y) = found;
    // The ground tile is this share of the heights tile, deeper zooms
    // being smaller shares.
    final share = 1 / (1 << (t.z - z));
    final x0 = t.x * share - x, y0 = t.y * share - y;
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
      ..[5] = metres;
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

  static gpu.DeviceBuffer _gridCorners() {
    final out = Float32List((_grid + 1) * (_grid + 1) * 2);
    var o = 0;
    for (var j = 0; j <= _grid; j++) {
      for (var i = 0; i <= _grid; i++) {
        out
          ..[o++] = i / _grid
          ..[o++] = j / _grid;
      }
    }
    return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
  }

  static gpu.DeviceBuffer _gridIndices() {
    final out = Uint16List(_grid * _grid * 6);
    var o = 0;
    for (var j = 0; j < _grid; j++) {
      for (var i = 0; i < _grid; i++) {
        final a = j * (_grid + 1) + i, b = a + 1;
        final c = a + _grid + 1, d = c + 1;
        out
          ..[o++] = a
          ..[o++] = c
          ..[o++] = d
          ..[o++] = a
          ..[o++] = d
          ..[o++] = b;
      }
    }
    return gpu.gpuContext.createDeviceBufferWithCopy(ByteData.sublistView(out));
  }

  /// The ground's height under building tile [d], exaggerated, in metres.
  double liftOf(TileDraw d, Terrain terrain) {
    final id = d.tile.id;
    final n = 1 << id.z;
    return terrain.at((id.x + 0.5) / n, (id.y + 0.5) / n, id.z);
  }
}
