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

    final mapVertex = shader('MapVertex');
    final mapFragment = shader('MapFragment');
    flat = gpu.gpuContext.createRenderPipeline(
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
    flatFrame = mapVertex.getUniformSlot('FrameInfo');
    flatSlots = mapVertex.getUniformSlot('SlotInfo');
    flatDem = mapVertex.getUniformSlot('DemInfo');
    flatHeightsSlot = mapVertex.getUniformSlot('heights');
    flatFrag = mapFragment.getUniformSlot('FragInfo');
    flatSprites = mapFragment.getUniformSlot('sprite_sheet');
    flatRamp = mapFragment.getUniformSlot('gradient_ramp');

    final buildingVertex = shader('BuildingVertex');
    final buildingFragment = shader('BuildingFragment');
    buildings = gpu.gpuContext.createRenderPipeline(
      buildingVertex,
      buildingFragment,
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
    buildingFrame = buildingVertex.getUniformSlot('FrameInfo');
    buildingDem = buildingVertex.getUniformSlot('DemInfo');
    buildingHeights = buildingVertex.getUniformSlot('heights');
    buildingTile = buildingVertex.getUniformSlot('TileInfo');
    buildingPatterns = buildingVertex.getUniformSlot('PatternInfo');
    buildingSheet = buildingFragment.getUniformSlot('SheetInfo');
    buildingSprites = buildingFragment.getUniformSlot('sprite_sheet');

    final groundVertex = shader('TerrainVertex');
    final groundFragment = shader('TerrainFragment');
    ground = _onPositions(groundVertex, groundFragment);
    groundFrame = groundVertex.getUniformSlot('FrameInfo');
    groundDem = groundVertex.getUniformSlot('DemInfo');
    groundHeights = groundVertex.getUniformSlot('heights');
    groundDrape = groundFragment.getUniformSlot('drape');

    final globeVertex = shader('GlobeVertex');
    final globeFragment = shader('GlobeFragment');
    globe = _onPositions(globeVertex, globeFragment);
    globeFrame = globeVertex.getUniformSlot('FrameInfo');
    globeDrape = globeFragment.getUniformSlot('drape');

    final stencilVertex = shader('StencilVertex');
    stencil = _onPositions(stencilVertex, shader('StencilFragment'));
    stencilFrame = stencilVertex.getUniformSlot('FrameInfo');

    final heatVertex = shader('HeatVertex');
    final heatFragment = shader('HeatFragment');
    heat = _onPositions(heatVertex, heatFragment);
    heatInfo = heatFragment.getUniformSlot('HeatInfo');
    heatDensity = heatFragment.getUniformSlot('density');
    heatRamp = heatFragment.getUniformSlot('ramp');

    final compositeFragment = shader('CompositeFragment');
    composite = _onPositions(heatVertex, compositeFragment);
    compositeInfo = compositeFragment.getUniformSlot('CompositeInfo');
    compositeLayer = compositeFragment.getUniformSlot('layer');
  }

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

  late final gpu.RenderPipeline flat, buildings, ground, globe, stencil, heat;

  /// Lays an image drawn whole over the map at an opacity.
  late final gpu.RenderPipeline composite;

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
