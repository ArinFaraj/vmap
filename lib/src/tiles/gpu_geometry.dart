import 'dart:typed_data';

/// Vertices and the indices of their triangles, built for the GPU. A
/// renderer that has them on the GPU lets them go: a tile's geometry is
/// most of its memory, and a second copy here doubles it.
abstract class GpuGeometry {
  GpuGeometry(Float32List vertices, Uint32List indices)
    : _vertices = vertices,
      _indices = indices,
      vertexBytes = vertices.lengthInBytes,
      indexCount = indices.length;

  Float32List? _vertices;
  Uint32List? _indices;

  /// The vertices and the indices of their triangles, while [held].
  Float32List get vertices => _vertices!;
  Uint32List get indices => _indices!;

  /// The size of [vertices] and the length of [indices], which outlast
  /// them.
  final int vertexBytes, indexCount;

  /// Whether [vertices] and [indices] are here to draw from.
  bool get held => _vertices != null;

  void letGo() => _vertices = _indices = null;
}
