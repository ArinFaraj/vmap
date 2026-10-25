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
    buildingGlobe = buildingVertex.getUniformSlot('GlobeInfo');
    buildingPatterns = buildingVertex.getUniformSlot('PatternInfo');
    buildingSheet = buildingFragment.getUniformSlot('SheetInfo');
    buildingSprites = buildingFragment.getUniformSlot('sprite_sheet');
    final groundVertex = library['TerrainVertex'];
    final groundFragment = library['TerrainFragment'];
    if (groundVertex != null && groundFragment != null) {
      ground = gpu.gpuContext.createRenderPipeline(
        groundVertex,
        groundFragment,
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
      groundFrame = groundVertex.getUniformSlot('FrameInfo');
      groundDem = groundVertex.getUniformSlot('DemInfo');
      groundHeights = groundVertex.getUniformSlot('heights');
      groundDrape = groundFragment.getUniformSlot('drape');
      final globeVertex = library['GlobeVertex'];
      final globeFragment = library['GlobeFragment'];
      if (globeVertex != null && globeFragment != null) {
        globe = gpu.gpuContext.createRenderPipeline(
          globeVertex,
          globeFragment,
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
        globeFrame = globeVertex.getUniformSlot('FrameInfo');
        globeDrape = globeFragment.getUniformSlot('drape');
      }
    }
    final stencilVertex = library['StencilVertex'];
    final stencilFragment = library['StencilFragment'];
    if (stencilVertex != null && stencilFragment != null) {
      stencil = gpu.gpuContext.createRenderPipeline(
        stencilVertex,
        stencilFragment,
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
      heat = gpu.gpuContext.createRenderPipeline(
        heatVertex,
        heatFragment,
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
      heatInfo = heatFragment.getUniformSlot('HeatInfo');
      heatDensity = heatFragment.getUniformSlot('density');
      heatRamp = heatFragment.getUniformSlot('ramp');
      screen = gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(
          Float32List.fromList([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]),
        ),
      );
    }
  }

  late final gpu.RenderPipeline flat, buildings;
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
      buildingGlobe,
      buildingPatterns,
      buildingSheet,
      buildingSprites;
  gpu.RenderPipeline? ground, globe, stencil, heat;
  gpu.UniformSlot? groundFrame,
      groundDem,
      groundHeights,
      groundDrape,
      globeFrame,
      globeDrape,
      stencilFrame,
      heatInfo,
      heatDensity,
      heatRamp;

  /// A tile's square in tile units, two triangles.
  gpu.DeviceBuffer? quad;

  /// The screen in clip space, two triangles, which a heatmap's density is
  /// coloured over.
  gpu.DeviceBuffer? screen;
}
