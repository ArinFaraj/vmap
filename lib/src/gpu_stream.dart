import 'dart:typed_data';

import 'platform.dart';
import 'style_model.dart';
import 'tessellate.dart' show LineMesher, MeshChunk;
import 'tile_builder.dart' show BuiltMesh;
import 'typed_buffer.dart';

/// One tile's fill and line layers as a single stream the GPU draws in one
/// call per [segments] entry: every layer's geometry in the style's order,
/// each vertex naming its style slot, so the tile comes out in order and a
/// frame changes only the slots' paint.
///
/// A vertex is six floats, every one exact, so the shader can unpack them
/// with arithmetic alone: OpenGL ES 2 shaders have no integers or bit
/// operations.
/// - x and y in tile units;
/// - a line vertex's extrusion from its centre line, x and y in 1/128ths
///   plus 2048, the second times 4096, zero for a fill;
/// - an offset line's sideways vector, packed as the extrusion is;
/// - the slot within its segment, plus 16384 times its kind, plus for a
///   line 131072 times where the vertex sits across it (see [_edgeCode]);
/// - the distance along the line in tile units, or for a gradient line its
///   share of the whole line times [progressSpan].
class GpuStream {
  GpuStream(
    this.vertices,
    this.indices,
    this.slots,
    this.segments,
    this.layerFirst,
  );

  /// For each of the style's paint layers, the first index of its geometry,
  /// and one more entry for the end: a run of the style's layers is the
  /// indices from its first layer's entry to the entry after its last.
  final Int32List layerFirst;

  final Float32List vertices;
  final Uint32List indices;

  static const floatsPerVertex = 6;

  /// Per slot: the style layer it paints and the feature values its paint
  /// reads, null when it reads none.
  final List<(int, Map<String, Object?>?)> slots;

  /// Per draw: first index, index count, and the first slot it uses.
  final Int32List segments;

  /// Slots one draw can name, the size of the shader's slot table.
  static const slotsPerDraw = 120;

  /// The packed form of a 2D vector for the shader.
  static double packPair(double x, double y) {
    int q(double v) => ((v * 128).round().clamp(-2048, 2047)) + 2048;
    return (q(x) + q(y) * 4096).toDouble();
  }

  static const fill = 0,
      line = 1,
      patterned = 2,
      circle = 3,
      patternedLine = 4,
      gradientLine = 5;

  static bool isLine(int kind) =>
      kind == line || kind == patternedLine || kind == gradientLine;

  /// The kind [layer] is drawn as, or -1 for one the stream leaves out.
  static int kindOf(PaintLayer layer) => switch (layer) {
    FillLayer(pattern: null, extruded: false) => fill,
    FillLayer(extruded: false) => patterned,
    CircleLayer() => circle,
    LineLayer(pattern: null, gradient: null) => line,
    LineLayer(gradient: null) => patternedLine,
    LineLayer() => gradientLine,
    _ => -1,
  };

  /// Where a line vertex sits across its line: 0 or 127 on its left or
  /// right edge, 64 for a vertex of a round cap or join, and 1, 2, 125 or
  /// 126 for one the shader moves past a butt end, ahead or behind it.
  static int _edgeCode(Uint8List? edges, int v) => switch (edges?[v]) {
    MeshChunk.edgeLeft => 0,
    MeshChunk.edgeRight => 127,
    MeshChunk.edgeLeftAhead => 1,
    MeshChunk.edgeLeftBehind => 2,
    MeshChunk.edgeRightAhead => 125,
    MeshChunk.edgeRightBehind => 126,
    _ => 64,
  };

  /// What a gradient line's distance along it is at its end.
  static const progressSpan = LineMesher.shareSpan;

  List<Object?> toMessage() => [
    pack(vertices),
    pack(
      Float32List.view(indices.buffer, indices.offsetInBytes, indices.length),
    ),
    [
      for (final (layer, props) in slots) [layer, props],
    ],
    segments,
    layerFirst,
  ];

  static GpuStream fromMessage(List<Object?> m) {
    Uint32List words(Object packed) {
      final f = unpackFloats(packed);
      return f.buffer.asUint32List(f.offsetInBytes, f.length);
    }

    return GpuStream(
      unpackFloats(m[0]!),
      words(m[1]!),
      [
        for (final s in m[2]! as List)
          ((s as List)[0]! as int, (s[1] as Map?)?.cast<String, Object?>()),
      ],
      m[3]! as Int32List,
      m[4]! as Int32List,
    );
  }

  /// Builds the stream for [meshes] in [sheet]'s layer order, leaving out
  /// the layers the GPU does not draw: extrusions, heatmaps and symbols.
  static GpuStream? build(StyleSheet sheet, List<BuiltMesh> meshes) {
    final byBucket = <int, List<BuiltMesh>>{};
    for (final m in meshes) {
      (byBucket[m.bucket] ??= []).add(m);
    }
    final vertices = DoubleBuffer(1 << 14);
    final indices = IndexBuffer(1 << 14);
    final slots = <(int, Map<String, Object?>?)>[];
    final segments = <int>[];
    var segmentStart = 0, segmentSlot = 0;
    final layerFirst = Int32List(sheet.layers.length + 1);

    for (var p = 0; p < sheet.layers.length; p++) {
      layerFirst[p] = indices.length;
      final layer = sheet.layers[p];
      final kind = kindOf(layer);
      if (kind < 0) continue;
      for (final m in byBucket[layer.bucket] ?? const <BuiltMesh>[]) {
        final chunk = m.chunk;
        if (kind != circle && chunk.indices.isEmpty) continue;
        if (kind == circle && chunk.positions.isEmpty) continue;
        if (slots.length - segmentSlot >= slotsPerDraw) {
          segments.addAll([
            segmentStart,
            indices.length - segmentStart,
            segmentSlot,
          ]);
          segmentStart = indices.length;
          segmentSlot = slots.length;
        }
        final slot = slots.length - segmentSlot;
        slots.add((p, m.props));
        final base = vertices.length ~/ floatsPerVertex;
        final pos = chunk.positions;
        final stroked = isLine(kind);
        final ext = stroked ? chunk.extrusions : null;
        final off = stroked ? chunk.offsets : null;
        final along = stroked ? chunk.distances : null;
        final edges = stroked ? chunk.edges : null;
        final n = pos.length ~/ 2;
        if (kind == circle) {
          // A circle is a square around its centre, each corner carrying
          // where it lies in the square, which the shader scales by the
          // radius and cuts round.
          for (var v = 0; v < n; v++) {
            final at = vertices.length ~/ floatsPerVertex;
            for (final (cx, cy) in const [
              (-1.0, -1.0),
              (1.0, -1.0),
              (1.0, 1.0),
              (-1.0, 1.0),
            ]) {
              vertices
                ..add4(pos[v * 2], pos[v * 2 + 1], packPair(cx, cy), 0)
                ..add2((slot + kind * 16384).toDouble(), 0);
            }
            for (final i in const [0, 1, 2, 0, 2, 3]) {
              indices.add(at + i);
            }
          }
          continue;
        }
        for (var v = 0; v < n; v++) {
          vertices
            ..add4(
              pos[v * 2],
              pos[v * 2 + 1],
              ext == null ? 0 : packPair(ext[v * 2], ext[v * 2 + 1]),
              off == null ? 0 : packPair(off[v * 2], off[v * 2 + 1]),
            )
            ..add2(
              (slot + kind * 16384 + _edgeCode(edges, v) * 131072).toDouble(),
              along == null ? 0 : along[v * 2],
            );
        }
        for (final i in chunk.indices) {
          indices.add(base + i);
        }
      }
    }
    if (indices.isEmpty) return null;
    layerFirst[sheet.layers.length] = indices.length;
    segments.addAll([segmentStart, indices.length - segmentStart, segmentSlot]);
    return GpuStream(
      vertices.toFloat32List(),
      indices.toList(),
      slots,
      Int32List.fromList(segments),
      layerFirst,
    );
  }
}
