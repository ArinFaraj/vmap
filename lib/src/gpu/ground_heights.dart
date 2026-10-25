import 'dart:math' as math;
import 'dart:typed_data';

import '../camera/mercator.dart';
import '../terrain/terrain.dart';
import '../tiles/tile_id.dart';
import 'gpu_buffers.dart';
import 'gpu_pipelines.dart';
import 'gpu_shim/gpu.dart' as gpu;

/// The raised ground's heights on the GPU, tile by tile, and where a tile
/// lies in its tile of heights, as the shaders' DemInfo reads it.
class GroundHeights {
  final Float32List _info = Float32List(12);

  /// The DemInfo of the tile last asked for: [heightsFor], or [flat].
  late final ByteData bytes = ByteData.sublistView(_info);

  /// Each tile of heights on the GPU, sent again when a neighbour has
  /// filled its border since.
  final Expando<(gpu.Texture, int)> _uploaded = Expando();
  late final gpu.Texture _flat = gpu.gpuContext.createTexture(
    gpu.StorageMode.hostVisible,
    1,
    1,
    format: gpu.PixelFormat.r32Float,
  )..overwrite(ByteData(4));

  /// Where in the drape's atlas the ground's colour is read: corners as
  /// fractions of it, left, top, right, bottom.
  void setDrapeBounds(double left, double top, double right, double bottom) =>
      _info
        ..[8] = left
        ..[9] = top
        ..[10] = right
        ..[11] = bottom;

  /// Binds the ground under building tile [id] to the building pipeline,
  /// or with [flat] the map's: flat at sea level without [terrain].
  void bind(
    gpu.RenderPass pass,
    GpuPipelines p,
    UniformArena host,
    Terrain? terrain,
    TileId? id, {
    bool flat = false,
  }) {
    final heights = terrain == null || id == null
        ? this.flat(0, 0)
        : heightsFor(id.z, id.x, id.y, terrain, 10);
    pass
      ..bindTexture(
        flat ? p.flatHeightsSlot : p.buildingHeights,
        heights,
        sampler: gpu.SamplerOptions(
          minFilter: gpu.MinMagFilter.nearest,
          magFilter: gpu.MinMagFilter.nearest,
        ),
      )
      ..bindUniform(flat ? p.flatDem : p.buildingDem, host.emplace(bytes));
  }

  /// Ground standing [centre] metres up everywhere, a building's foot
  /// going [sink] metres below it.
  gpu.Texture flat(double centre, double sink) {
    _info
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

  /// The tile of heights tile [tz], [tx], [ty] is raised from, on the GPU,
  /// with where the tile lies in it written to [bytes], and [sink] the
  /// metres a building's foot goes below the ground; a flat one where none
  /// is loaded.
  gpu.Texture heightsFor(int tz, int tx, int ty, Terrain terrain, double sink) {
    final n = 1 << tz;
    tx %= n;
    final found = terrain.heights.locate(
      (tx + 0.5) / n,
      (ty + 0.5) / n,
      terrain.zoomFor(tz),
    );
    if (found == null) return flat(terrain.centre, sink);
    final (dem, z, x, y) = found;
    // The tile is this share of the heights tile, deeper zooms being
    // smaller shares.
    final share = 1 / (1 << (tz - z));
    final x0 = tx * share - x, y0 = ty * share - y;
    final metres =
        earthCircumference *
        math.cos(latitudeAt((y + 0.5) / (1 << z)) * math.pi / 180) /
        (1 << z) /
        dem.dim;
    _info
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
}
