part of 'gpu_map.dart';

/// The map laid over raised ground, as MapLibre draws terrain: each tile's
/// flat layers are drawn from above into a slot of one atlas texture in one
/// pass, then a grid per tile, raised by the heights, is drawn with depth
/// and coloured from its slot. Only the Flutter GPU tier draws terrain.
class _Drape {
  _Drape(this._map);

  final GpuMap _map;

  /// Device pixels on a side of one tile's slot, slots across the atlas,
  /// and grid cells on a side of one tile's ground.
  static const _slot = 512, _columns = 8, _grid = 32;

  gpu.Texture? _atlas, _atlasDepth;
  int _rows = 0;

  /// The tiles of ground drawn this frame, nearest first, and their slots.
  List<CoverTile> _tiles = const [];
  final Map<int, _Ground> _grounds = {};
  gpu.DeviceBuffer? _indices;
  int _frame = 0;

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
    _frame++;
    final all = view.cover(maxZoom: 14);
    _tiles = all.length > _capacity ? all.sublist(0, _capacity) : all;
    _fit(_tiles.length);
    final background =
        Rgba.of(sheet.background(context)) ?? const Rgba(1, 1, 1, 1);
    final commands = gpu.gpuContext.createCommandBuffer();
    buffers.add(commands);
    final pass = commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        gpu.ColorAttachment(
          texture: _atlas!,
          clearValue: Vector4(
            background.r * background.a,
            background.g * background.a,
            background.b * background.a,
            background.a,
          ),
        ),
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
    final indices = _indices ??= _gridIndices();
    final perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
    pass
      ..clearBindings()
      ..bindPipeline(pipeline)
      ..setCullMode(gpu.CullMode.none)
      ..setColorBlendEnable(false)
      ..setStencilConfig(gpu.StencilConfig())
      ..setDepthWriteEnable(true)
      ..setDepthCompareOperation(gpu.CompareFunction.lessEqual)
      ..bindTexture(
        map._groundDrape!,
        atlas,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.linear,
          magFilter: gpu.MinMagFilter.linear,
        ),
      )
      ..bindIndexBuffer(
        gpu.BufferView(
          indices,
          offsetInBytes: 0,
          lengthInBytes: indices.sizeInBytes,
        ),
        gpu.IndexType.int16,
      );
    final width = (_columns * _slot).toDouble();
    final height = (_rows * _slot).toDouble();
    for (final (i, t) in _tiles.indexed) {
      final ground = _groundOf(t, terrain);
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
        ..bindVertexBuffer(
          gpu.BufferView(
            ground.vertices,
            offsetInBytes: 0,
            lengthInBytes: ground.vertices.sizeInBytes,
          ),
        )
        ..bindUniform(map._groundFrame!, map._host!.emplace(map._frameBytes))
        ..drawIndexed(_grid * _grid * 6);
    }
    _grounds.removeWhere((_, g) => _frame - g.usedFrame > 120);
  }

  /// Tile [t]'s grid, its heights in metres from [terrain], made again when
  /// new heights arrive.
  _Ground _groundOf(CoverTile t, Terrain terrain) {
    final key = tileKey(t.z, t.x, t.y);
    final made = _grounds[key];
    final generation = terrain.heights.generation;
    if (made != null && made.generation == generation) {
      return made..usedFrame = _frame;
    }
    final n = 1 << t.z;
    final positions = Float32List((_grid + 1) * (_grid + 1) * 3);
    var o = 0;
    for (var j = 0; j <= _grid; j++) {
      for (var i = 0; i <= _grid; i++) {
        positions
          ..[o++] = i * tileExtent / _grid
          ..[o++] = j * tileExtent / _grid
          ..[o++] = terrain.at(
            (t.x + i / _grid) / n,
            (t.y + j / _grid) / n,
            t.z,
          );
      }
    }
    final ground = _Ground(
      gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(positions),
      ),
      generation,
    )..usedFrame = _frame;
    return _grounds[key] = ground;
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

class _Ground {
  _Ground(this.vertices, this.generation);

  final gpu.DeviceBuffer vertices;
  final int generation;
  int usedFrame = 0;
}
