import 'dart:typed_data';

import 'gpu_buffers.dart' show BuildingGpu;
import '../tiles/built_tile.dart';
import 'gpu_shim/gpu.dart' as gpu;

/// The render pipelines vmap's shader bundle makes, with the uniform slots
/// each draws with. The raised ground, globe, stencil and heatmap pipelines
/// are null where the bundle lacks their shaders.
class GpuPipelines {
  GpuPipelines(gpu.ShaderLibrary library) {
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
    _mapVertex = mapVertex;
    _mapFragment = mapFragment;
    flatFrame = mapVertex.getUniformSlot('FrameInfo');
    flatSlots = mapVertex.getUniformSlot('SlotInfo');
    flatDem = mapVertex.getUniformSlot('DemInfo');
    flatHeightsSlot = mapVertex.getUniformSlot('heights');
    flatFrag = mapFragment.getUniformSlot('FragInfo');
    flatSprites = mapFragment.getUniformSlot('sprite_sheet');
    flatRamp = mapFragment.getUniformSlot('gradient_ramp');
    _buildingVertex = buildingVertex;
    _buildingFragment = buildingFragment;
    buildingFrame = buildingVertex.getUniformSlot('FrameInfo');
    buildingDem = buildingVertex.getUniformSlot('DemInfo');
    buildingHeights = buildingVertex.getUniformSlot('heights');
    buildingTile = buildingVertex.getUniformSlot('TileInfo');
    buildingPatterns = buildingVertex.getUniformSlot('PatternInfo');
    buildingSheet = buildingFragment.getUniformSlot('SheetInfo');
    buildingSprites = buildingFragment.getUniformSlot('sprite_sheet');
    final groundVertex = library['TerrainVertex'];
    final groundFragment = library['TerrainFragment'];
    if (groundVertex != null && groundFragment != null) {
      _ground = (groundVertex, groundFragment);
      groundFrame = groundVertex.getUniformSlot('FrameInfo');
      groundDem = groundVertex.getUniformSlot('DemInfo');
      groundHeights = groundVertex.getUniformSlot('heights');
      groundDrape = groundFragment.getUniformSlot('drape');
      final globeVertex = library['GlobeVertex'];
      final globeFragment = library['GlobeFragment'];
      if (globeVertex != null && globeFragment != null) {
        _globe = (globeVertex, globeFragment);
        globeFrame = globeVertex.getUniformSlot('FrameInfo');
        globeDrape = globeFragment.getUniformSlot('drape');
      }
    }
    final stencilVertex = library['StencilVertex'];
    final stencilFragment = library['StencilFragment'];
    if (stencilVertex != null && stencilFragment != null) {
      _stencil = (stencilVertex, stencilFragment);
      stencilFrame = stencilVertex.getUniformSlot('FrameInfo');
      const e = tileExtent;
      quad = gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(
          Float32List.fromList([0, 0, e, 0, e, e, 0, 0, e, e, 0, e]),
        ),
      );
    }
    final heatVertex = library['HeatVertex'];
    final heatFragment = library['HeatFragment'];
    if (heatVertex != null && heatFragment != null) {
      _heat = (heatVertex, heatFragment);
      heatInfo = heatFragment.getUniformSlot('HeatInfo');
      heatDensity = heatFragment.getUniformSlot('density');
      heatRamp = heatFragment.getUniformSlot('ramp');
      screen = gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(
          Float32List.fromList([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]),
        ),
      );
      final compositeFragment = library['CompositeFragment'];
      if (compositeFragment != null) {
        _composite = (heatVertex, compositeFragment);
        compositeInfo = compositeFragment.getUniformSlot('CompositeInfo');
        compositeLayer = compositeFragment.getUniformSlot('layer');
      }
    }
  }

  late final gpu.Shader _mapVertex,
      _mapFragment,
      _buildingVertex,
      _buildingFragment;
  (gpu.Shader, gpu.Shader)? _ground, _globe, _stencil, _heat, _composite;

  /// Whether the bundle has the shaders of [ground], [globe], [stencil],
  /// [heat] and [composite], told without making them.
  bool get hasGround => _ground != null;
  bool get hasGlobe => _globe != null;
  bool get hasStencil => _stencil != null;
  bool get hasHeat => _heat != null;
  bool get hasComposite => _composite != null;

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

  late final gpu.RenderPipeline? ground = _onPositions(_ground);
  late final gpu.RenderPipeline? globe = _onPositions(_globe);
  late final gpu.RenderPipeline? stencil = _onPositions(_stencil);
  late final gpu.RenderPipeline? heat = _onPositions(_heat);

  /// Lays an image drawn whole over the map at an opacity.
  late final gpu.RenderPipeline? composite = _onPositions(_composite);

  /// A pipeline of [shaders] whose vertices are positions alone, two
  /// floats each; null without them.
  static gpu.RenderPipeline? _onPositions((gpu.Shader, gpu.Shader)? shaders) {
    if (shaders == null) return null;
    final (vertex, fragment) = shaders;
    return gpu.gpuContext.createRenderPipeline(
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
  }

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
      buildingSprites;
  gpu.UniformSlot? groundFrame,
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
  gpu.DeviceBuffer? quad;

  /// The screen in clip space, two triangles, which a heatmap's density is
  /// coloured over.
  gpu.DeviceBuffer? screen;
}
