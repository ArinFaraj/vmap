import 'dart:math' as math;
import 'dart:typed_data';

import '../style/expr.dart';

import '../platform.dart';
import '../style/style_model.dart';
import '../camera/subdivide.dart';
import 'tessellate.dart' show LineMesher, MeshChunk;
import 'built_tile.dart';
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
    this.layerFirst, [
    Int32List? outlines,
  ]) : outlines = outlines ?? Int32List(0);

  /// The outlines of fills, drawn as one pixel lines through the fills'
  /// own vertices, after the triangles in [indices]: per run of them, its
  /// style layer, the segment whose slots it reads, its first index and
  /// its index count, two indices a line.
  final Int32List outlines;

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
  static const slotsPerDraw = 80;

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
      gradientLine = 5,
      heat = 6;

  static bool isLine(int kind) =>
      kind == line || kind == patternedLine || kind == gradientLine;

  /// The kind [layer] is drawn as, or -1 for one the stream leaves out.
  static int kindOf(PaintLayer layer) => switch (layer) {
    FillLayer(pattern: null, extruded: false) => fill,
    FillLayer(extruded: false) => patterned,
    CircleLayer() => circle,
    HeatmapLayer() => heat,
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
    outlines,
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
      m[5]! as Int32List,
    );
  }

  /// Builds the stream for [meshes] in [sheet]'s layer order, leaving out
  /// the layers the GPU does not draw: extrusions and symbols.
  ///
  /// With [fillCells] or [lineCells], fills or lines are cut along a grid
  /// of that many cells across the tile, for the globe to bend them.
  static GpuStream? build(
    StyleSheet sheet,
    List<BuiltMesh> meshes, {
    double zoom = 0,
    int fillCells = 0,
    int lineCells = 0,
  }) {
    final context = EvalContext()..zoom = zoom;
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
    final edged = <(int, int, List<int>)>[];

    for (var p = 0; p < sheet.layers.length; p++) {
      layerFirst[p] = indices.length;
      final layer = sheet.layers[p];
      final kind = kindOf(layer);
      if (kind < 0) continue;
      for (final m in byBucket[layer.bucket] ?? const <BuiltMesh>[]) {
        final chunk = m.chunk;
        final points = kind == circle || kind == heat;
        if (!points && chunk.indices.isEmpty) continue;
        if (points && chunk.positions.isEmpty) continue;
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
        // A dashed gradient line without an offset keeps its share of the
        // line where the offset would be and its distance where a plain
        // line keeps it.
        final dashedRamp =
            kind == gradientLine &&
            off == null &&
            ((layer as LineLayer).dash != null || layer.dashChoices.isNotEmpty);
        final edges = stroked ? chunk.edges : null;
        final n = pos.length ~/ 2;
        if (points) {
          // A circle is a square around its centre, each corner carrying
          // where it lies in the square, which the shader scales by the
          // radius and cuts round. The last float: 1 when it faces the
          // screen, plus 2 when it keeps its size however far it is. A
          // heatmap's point is a square on the map the shader scales to
          // where its kernel fades to nothing.
          var facing = 0, blur = 0.0;
          if (layer case final CircleLayer circleLayer) {
            facing =
                (circleLayer.pitchWithMap ? 0 : 1) +
                (circleLayer.scaleWithMap ? 0 : 2);
            context.props = m.props ?? const {};
            blur = math.max(
              0.0,
              (asNumber(circleLayer.blur?.call(context)) ?? 0).toDouble(),
            );
          }
          for (var v = 0; v < n; v++) {
            final at = vertices.length ~/ floatsPerVertex;
            for (final (cx, cy) in const [
              (-1.0, -1.0),
              (1.0, -1.0),
              (1.0, 1.0),
              (-1.0, 1.0),
            ]) {
              vertices
                ..add4(pos[v * 2], pos[v * 2 + 1], packPair(cx, cy), blur)
                ..add2((slot + kind * 16384).toDouble(), facing.toDouble());
            }
            for (final i in const [0, 1, 2, 0, 2, 3]) {
              indices.add(at + i);
            }
          }
          continue;
        }
        final cells = isLine(kind) ? lineCells : fillCells;
        if (cells > 0) {
          final cut = Subdivider(8, tileExtent / cells);
          final src = Float32List(n * 8);
          for (var v = 0; v < n; v++) {
            src
              ..[v * 8] = pos[v * 2]
              ..[v * 8 + 1] = pos[v * 2 + 1];
            if (ext != null) {
              src
                ..[v * 8 + 2] = ext[v * 2]
                ..[v * 8 + 3] = ext[v * 2 + 1];
            }
            if (off != null) {
              src
                ..[v * 8 + 4] = off[v * 2]
                ..[v * 8 + 5] = off[v * 2 + 1];
            }
            if (along != null) {
              src[v * 8 + 6] = along[v * 2 + (dashedRamp ? 1 : 0)];
              if (dashedRamp) src[v * 8 + 4] = along[v * 2];
            }
            src[v * 8 + 7] = _edgeCode(edges, v).toDouble();
          }
          final tri = chunk.indices;
          for (var i = 0; i + 2 < tri.length; i += 3) {
            cut.add(src, tri[i], tri[i + 1], tri[i + 2]);
          }
          final out = cut.vertices;
          for (var v = 0; v < cut.vertexCount; v++) {
            final o = v * 8;
            vertices
              ..add4(
                out[o],
                out[o + 1],
                ext == null ? 0 : packPair(out[o + 2], out[o + 3]),
                dashedRamp
                    ? out[o + 4]
                    : off == null
                    ? 0
                    : packPair(out[o + 4], out[o + 5]),
              )
              ..add2(
                (slot +
                        kind * 16384 +
                        out[o + 7].round().clamp(0, 127) * 131072)
                    .toDouble(),
                along == null ? 0 : out[o + 6],
              );
          }
          for (final i in cut.indices) {
            indices.add(base + i);
          }
          continue;
        }
        for (var v = 0; v < n; v++) {
          vertices
            ..add4(
              pos[v * 2],
              pos[v * 2 + 1],
              ext == null ? 0 : packPair(ext[v * 2], ext[v * 2 + 1]),
              dashedRamp
                  ? along![v * 2]
                  : off == null
                  ? 0
                  : packPair(off[v * 2], off[v * 2 + 1]),
            )
            ..add2(
              (slot + kind * 16384 + _edgeCode(edges, v) * 131072).toDouble(),
              along == null ? 0 : along[v * 2 + (dashedRamp ? 1 : 0)],
            );
        }
        for (final i in chunk.indices) {
          indices.add(base + i);
        }
        final outline = chunk.outline;
        if ((kind == fill || kind == patterned) &&
            outline != null &&
            (layer as FillLayer).outline != null) {
          final segment = segments.length ~/ 3;
          final lines =
              edged.isNotEmpty && edged.last.$1 == p && edged.last.$2 == segment
              ? edged.last.$3
              : (edged..add((p, segment, <int>[]))).last.$3;
          for (final i in outline) {
            lines.add(base + i);
          }
        }
      }
    }
    if (indices.isEmpty) return null;
    layerFirst[sheet.layers.length] = indices.length;
    segments.addAll([segmentStart, indices.length - segmentStart, segmentSlot]);
    final outlines = <int>[];
    for (final (layer, segment, lines) in edged) {
      if (lines.isEmpty) continue;
      outlines.addAll([layer, segment, indices.length, lines.length]);
      for (final i in lines) {
        indices.add(i);
      }
    }
    return GpuStream(
      vertices.toFloat32List(),
      indices.toList(),
      slots,
      Int32List.fromList(segments),
      layerFirst,
      Int32List.fromList(outlines),
    );
  }
}
