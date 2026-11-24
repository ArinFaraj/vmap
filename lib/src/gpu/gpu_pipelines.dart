import 'dart:typed_data';

import 'gpu_buffers.dart' show BuildingGpu;
import '../tiles/built_tile.dart';
import 'gpu_shim/gpu.dart' as gpu;

/// The render pipelines vmap's shader bundle makes, with the uniform slots
/// each draws with.
class GpuPipelines {
  GpuPipelines(gpu.ShaderLibrary library) {
    gpu.Shader shader(String name) =>
        library[name] ?? (throw StateError('the shader bundle lacks $name'));

    _mapVertex = shader('MapVertex');
    _mapFragment = shader('MapFragment');
    flatFrame = _mapVertex.getUniformSlot('FrameInfo');
    flatSlots = _mapVertex.getUniformSlot('SlotInfo');
    flatDem = _mapVertex.getUniformSlot('DemInfo');
    flatHeightsSlot = _mapVertex.getUniformSlot('heights');
    flatFrag = _mapFragment.getUniformSlot('FragInfo');
    flatSprites = _mapFragment.getUniformSlot('sprite_sheet');
    flatRamp = _mapFragment.getUniformSlot('gradient_ramp');

    _buildingVertex = shader('BuildingVertex');
    _buildingFragment = shader('BuildingFragment');
    buildingFrame = _buildingVertex.getUniformSlot('FrameInfo');
    buildingDem = _buildingVertex.getUniformSlot('DemInfo');
    buildingHeights = _buildingVertex.getUniformSlot('heights');
    buildingTile = _buildingVertex.getUniformSlot('TileInfo');
    buildingPatterns = _buildingVertex.getUniformSlot('PatternInfo');
    buildingSheet = _buildingFragment.getUniformSlot('SheetInfo');
    buildingSprites = _buildingFragment.getUniformSlot('sprite_sheet');

    _groundVertex = shader('TerrainVertex');
    _groundFragment = shader('TerrainFragment');
    groundFrame = _groundVertex.getUniformSlot('FrameInfo');
    groundDem = _groundVertex.getUniformSlot('DemInfo');
    groundHeights = _groundVertex.getUniformSlot('heights');
    groundDrape = _groundFragment.getUniformSlot('drape');

    _globeVertex = shader('GlobeVertex');
    _globeFragment = shader('GlobeFragment');
    globeFrame = _globeVertex.getUniformSlot('FrameInfo');
    globeDrape = _globeFragment.getUniformSlot('drape');

    _stencilVertex = shader('StencilVertex');
    _stencilFragment = shader('StencilFragment');
    stencilFrame = _stencilVertex.getUniformSlot('FrameInfo');

    _heatVertex = shader('HeatVertex');
    _heatFragment = shader('HeatFragment');
    heatInfo = _heatFragment.getUniformSlot('HeatInfo');
    heatDensity = _heatFragment.getUniformSlot('density');
    heatRamp = _heatFragment.getUniformSlot('ramp');

    _compositeFragment = shader('CompositeFragment');
    compositeInfo = _compositeFragment.getUniformSlot('CompositeInfo');
    compositeLayer = _compositeFragment.getUniformSlot('layer');
  }

  late final gpu.Shader _mapVertex,
      _mapFragment,
      _buildingVertex,
      _buildingFragment,
      _groundVertex,
      _groundFragment,
      _globeVertex,
      _globeFragment,
      _stencilVertex,
      _stencilFragment,
      _heatVertex,
      _heatFragment,
      _compositeFragment;

  // Each pipeline is made the first time it is drawn with, as making one
  // compiles its shaders on the thread that asks.
  late final gpu.RenderPipeline flat = gpu.gpuContext.createRenderPipeline(
    _mapVertex,
    _mapFragment,
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

  late final gpu.RenderPipeline buildings = gpu.gpuContext.createRenderPipeline(
    _buildingVertex,
    _buildingFragment,
    vertexLayout: const gpu.VertexLayout(
      buffers: [
        gpu.VertexBuffer(
          strideInBytes: BuildingGpu.stride,
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
            gpu.VertexAttribute(
              name: 'normal_data',
              format: gpu.VertexFormat.float32x3,
              offsetInBytes: 20,
            ),
            gpu.VertexAttribute(
              name: 'pattern_data',
              format: gpu.VertexFormat.float32x3,
              offsetInBytes: 32,
            ),
            gpu.VertexAttribute(
              name: 'middle',
              format: gpu.VertexFormat.float32x2,
              offsetInBytes: 44,
            ),
          ],
        ),
      ],
    ),
  );

  late final gpu.RenderPipeline ground = _onPositions(
    _groundVertex,
    _groundFragment,
  );

  late final gpu.RenderPipeline globe = _onPositions(
    _globeVertex,
    _globeFragment,
  );

  late final gpu.RenderPipeline stencil = _onPositions(
    _stencilVertex,
    _stencilFragment,
  );

  late final gpu.RenderPipeline heat = _onPositions(_heatVertex, _heatFragment);

  /// Lays an image drawn whole over the map at an opacity.
  late final gpu.RenderPipeline composite = _onPositions(
    _heatVertex,
    _compositeFragment,
  );

  /// Makes every pipeline now. On the web making one only starts its
  /// shaders compiling and linking, in parallel with the others, and its
  /// first bind takes the result; on native it compiles on this thread, so
  /// there pipelines are made as frames first draw with them.
  void start() => [flat, buildings, ground, globe, stencil, heat, composite];

  /// A pipeline whose vertices are positions alone, two floats each.
  static gpu.RenderPipeline _onPositions(
    gpu.Shader vertex,
    gpu.Shader fragment,
  ) => gpu.gpuContext.createRenderPipeline(
    vertex,
    fragment,
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

  late final gpu.UniformSlot flatFrame,
      flatSlots,
      flatDem,
      flatHeightsSlot,
      flatFrag,
      flatSprites,
      flatRamp,
      buildingFrame,
      buildingDem,
      buildingHeights,
      buildingTile,
      buildingPatterns,
      buildingSheet,
      buildingSprites,
      groundFrame,
      groundDem,
      groundHeights,
      groundDrape,
      globeFrame,
      globeDrape,
      stencilFrame,
      heatInfo,
      heatDensity,
      heatRamp,
      compositeInfo,
      compositeLayer;

  /// A tile's square in tile units, two triangles.
  final gpu.DeviceBuffer quad = _triangles(const [
    0, 0, tileExtent, 0, tileExtent, tileExtent, //
    0, 0, tileExtent, tileExtent, 0, tileExtent,
  ]);

  /// The screen in clip space, two triangles, which a heatmap's density is
  /// coloured over.
  final gpu.DeviceBuffer screen = _triangles(const [
    -1, -1, 1, -1, 1, 1, //
    -1, -1, 1, 1, -1, 1,
  ]);

  static gpu.DeviceBuffer _triangles(List<double> corners) =>
      gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(Float32List.fromList(corners)),
      );
}
