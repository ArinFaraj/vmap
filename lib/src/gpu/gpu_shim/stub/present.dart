part of '_gpu.dart';

Future<ui.Image> presentTextureAsImage(
  Texture texture, {
  bool transferOwnership = false,
}) => _stub();

PixelFormat get reversedDepthStencilFormat =>
    gpuContext.defaultDepthStencilFormat;

/// The buffers one mesh upload needs. Native has no per-role restriction, so
/// this is the single shared buffer it always was, indices after vertices.
({DeviceBuffer vertex, DeviceBuffer index, int indexBaseOffset})
createGeometryBuffers(int vertexBytes, int indexBytes) {
  final buffer = gpuContext.createDeviceBuffer(
    StorageMode.hostVisible,
    vertexBytes + indexBytes,
  );
  return (vertex: buffer, index: buffer, indexBaseOffset: vertexBytes);
}

/// A host-visible buffer for uniform data rewritten every frame.
DeviceBuffer createUniformBuffer(int sizeInBytes) =>
    gpuContext.createDeviceBuffer(StorageMode.hostVisible, sizeInBytes);

/// Writes mesh data into a buffer from [createGeometryBuffers] (or an arena's).
/// The web backend uses [source]'s element type; here bytes are bytes.
bool writeGeometryData(
  DeviceBuffer buffer,
  TypedData source, {
  required int destinationOffsetInBytes,
}) => buffer.overwrite(
  source is ByteData ? source : ByteData.sublistView(source),
  destinationOffsetInBytes: destinationOffsetInBytes,
);

/// Whether each mesh is better in buffers of its own than in ranges of
/// shared ones: no, as the native backends write a range without waiting
/// on the GPU.
const bool geometryInOwnBuffers = false;

/// Lets go of a buffer from [createGeometryBuffers] the GPU has finished
/// with: here its memory goes when it is no longer referenced.
void releaseGeometryBuffer(DeviceBuffer buffer) {}
