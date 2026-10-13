import 'dart:typed_data';

import 'platform.dart';
import 'style_model.dart';
import 'tile_builder.dart' show BuiltMesh;

/// One tile's fill and line layers as a single stream the GPU draws in one
/// call per [segments] entry: every layer's geometry in the style's order,
/// each vertex naming its style slot, so the tile comes out in order and a
/// frame changes only the slots' paint.
///
/// A vertex is four 32 bit words:
/// - x and y, 16 bits each, in half tile units plus 16384;
/// - a line vertex's extrusion from its centre line, x and y as signed 16
///   bit numbers in 1/2048ths, zero for a fill;
/// - the slot within its segment in the low 14 bits, the kind (0 fill,
///   1 line) in the next 2, and the distance along the line, in half tile
///   units, in the high 16;
/// - an offset line's sideways vector, as the extrusion is.
class GpuStream {
  GpuStream(this.vertices, this.indices, this.slots, this.segments);

  final Uint32List vertices;
  final Uint32List indices;

  /// Per slot: the style layer it paints and the feature values its paint
  /// reads, null when it reads none.
  final List<(int, Map<String, Object?>?)> slots;

  /// Per draw: first index, index count, and the first slot it uses.
  final Int32List segments;

  /// Slots one draw can name, the size of the shader's slot table.
  static const slotsPerDraw = 120;

  static const fill = 0, line = 1;

  List<Object?> toMessage() => [
    pack(
      Float32List.view(
        vertices.buffer,
        vertices.offsetInBytes,
        vertices.length,
      ),
    ),
    pack(
      Float32List.view(indices.buffer, indices.offsetInBytes, indices.length),
    ),
    [
      for (final (layer, props) in slots) [layer, props],
    ],
    segments,
  ];

  static GpuStream fromMessage(List<Object?> m) {
    Uint32List words(Object packed) {
      final f = unpackFloats(packed);
      return f.buffer.asUint32List(f.offsetInBytes, f.length);
    }

    return GpuStream(words(m[0]!), words(m[1]!), [
      for (final s in m[2]! as List)
        ((s as List)[0]! as int, (s[1] as Map?)?.cast<String, Object?>()),
    ], m[3]! as Int32List);
  }

  /// Builds the stream for [meshes] in [sheet]'s layer order, leaving out
  /// layers the GPU does not draw yet: patterns, gradients, circles and
  /// heatmaps.
  static GpuStream? build(StyleSheet sheet, List<BuiltMesh> meshes) {
    final byBucket = <int, List<BuiltMesh>>{};
    for (final m in meshes) {
      (byBucket[m.bucket] ??= []).add(m);
    }
    final vertices = <int>[];
    final indices = <int>[];
    final slots = <(int, Map<String, Object?>?)>[];
    final segments = <int>[];
    var segmentStart = 0, segmentSlot = 0;
    int coord(double v) => ((v + 8192) * 2).round().clamp(0, 0xFFFF);
    int signed(double v) => (v * 2048).round().clamp(-32768, 32767) & 0xFFFF;

    for (var p = 0; p < sheet.layers.length; p++) {
      final layer = sheet.layers[p];
      final kind = switch (layer) {
        FillLayer(pattern: null, extruded: false) => fill,
        LineLayer(pattern: null, gradient: null) => line,
        _ => -1,
      };
      if (kind < 0) continue;
      for (final m in byBucket[layer.bucket] ?? const <BuiltMesh>[]) {
        final chunk = m.chunk;
        if (chunk.indices.isEmpty) continue;
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
        final base = vertices.length ~/ 4;
        final pos = chunk.positions;
        final ext = kind == line ? chunk.extrusions : null;
        final off = kind == line ? chunk.offsets : null;
        final along = kind == line ? chunk.distances : null;
        final n = pos.length ~/ 2;
        for (var v = 0; v < n; v++) {
          final x = pos[v * 2], y = pos[v * 2 + 1];
          vertices
            ..add(coord(x) | coord(y) << 16)
            ..add(
              ext == null
                  ? 0
                  : signed(ext[v * 2]) | signed(ext[v * 2 + 1]) << 16,
            )
            ..add(
              slot |
                  kind << 14 |
                  (along == null
                          ? 0
                          : (along[v * 2] * 2).round().clamp(0, 0xFFFF)) <<
                      16,
            )
            ..add(
              off == null
                  ? 0
                  : signed(off[v * 2]) | signed(off[v * 2 + 1]) << 16,
            );
        }
        for (final i in chunk.indices) {
          indices.add(base + i);
        }
      }
    }
    if (indices.isEmpty) return null;
    segments.addAll([segmentStart, indices.length - segmentStart, segmentSlot]);
    return GpuStream(
      Uint32List.fromList(vertices),
      Uint32List.fromList(indices),
      slots,
      Int32List.fromList(segments),
    );
  }
}
