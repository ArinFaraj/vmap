import 'dart:typed_data';

import '../text/glyphs/glyph_layout.dart';
import 'gpu_stream.dart';
import 'extrusion.dart';
import '../platform.dart';
import 'tessellate.dart';

const double tileExtent = 4096;

class BuiltMesh {
  BuiltMesh(this.bucket, this.chunk, [this.props]);

  /// Index into the style's buckets.
  final int bucket;
  final MeshChunk chunk;

  /// The property values every feature in the mesh shares, for a bucket
  /// whose paint reads them.
  final Map<String, Object?>? props;
}

class BuiltLabel {
  BuiltLabel(
    this.layer,
    this.priority,
    this.text,
    this.x,
    this.y,
    this.line, {
    this.icon = '',
    this.angle = 0,
    this.spaced = false,
    this.turns = false,
  });

  /// Index into the style's symbol layers. Negative for a label the app
  /// supplies.
  final int layer;

  /// Lower wins a collision.
  final int priority;
  final String text;
  final double x;
  final double y;

  /// The line the text runs along, as x,y pairs in tile units. Null for point
  /// labels.
  final Float32List? line;

  /// The name of the sprite image drawn at the anchor. Empty for none.
  final String icon;

  /// How far the icon is turned, in radians.
  final double angle;

  /// The icon's angle is measured on the map, so it turns with the map.
  final bool turns;

  /// One of several placed along a line, which keeps its distance from
  /// others with the same text.
  final bool spaced;

  /// What makes this label the same label in another tile: its layer, text
  /// and place for a point, its tile and number otherwise.
  String key = '';

  /// The feature's values of what its layer's paint reads. Null when the
  /// paint reads nothing from the feature.
  Map<String, Object?>? props;

  /// The text shaped by the worker, or null when it was not.
  ShapedText? shaped;
}

class BuiltTile {
  BuiltTile(this.meshes, this.labels, [this.extrusions = const [], this.gpu]);

  /// The tile's fill and line layers for the GPU renderer, when asked for.
  final GpuStream? gpu;

  final List<BuiltMesh> meshes;
  final List<BuiltLabel> labels;
  final List<BuiltExtrusion> extrusions;

  /// Names every label for the tile at [z], [x], [y]. A point's place is
  /// taken to [grid] steps across the world: coarse for vector tiles, where
  /// a place sits a little differently from zoom to zoom, fine for an app's
  /// own points, where two a few pixels apart can carry the same text.
  void keyLabels(int z, int x, int y, {int grid = 1024}) {
    final span = 1 / (1 << z);
    final tx = x * span;
    final ty = y * span;
    for (var i = 0; i < labels.length; i++) {
      final l = labels[i];
      l.key = l.line != null || l.spaced || l.text.isEmpty
          ? 'r|$z/$x/$y|${l.layer}|$i'
          : 'p|${l.layer}|${l.text}|${((tx + l.x / tileExtent * span) * grid).floor()}|${((ty + l.y / tileExtent * span) * grid).floor()}';
    }
  }

  /// A sendable form whose buffers move between isolates without a copy on
  /// the receiving side.
  List<Object?> toMessage() => [
    [
      for (final m in meshes)
        [
          m.bucket,
          pack(m.chunk.positions),
          if (m.chunk.extrusions case final e?) pack(e) else null,
          pack(m.chunk.indices),
          if (m.chunk.distances case final d?) pack(d) else null,
          m.props,
          if (m.chunk.offsets case final o?) pack(o) else null,
        ],
    ],
    [
      for (final l in labels)
        [
          l.layer,
          l.priority,
          l.text,
          l.x,
          l.y,
          l.line,
          l.icon,
          l.angle,
          l.spaced,
          l.key,
          l.turns,
          l.props,
          if (l.shaped case final s?)
            [s.width, s.height, s.lines, s.glyphs.length]
          else
            null,
        ],
    ],
    [for (final e in extrusions) e.toMessage()],
    _glyphMessage(),
    gpu?.toMessage(),
  ];

  /// Every label's shaped glyphs in one buffer, so a tile of hundreds of
  /// labels crosses to the page as one transfer, not one per label.
  Object? _glyphMessage() {
    var n = 0;
    for (final l in labels) {
      n += l.shaped?.glyphs.length ?? 0;
    }
    if (n == 0) return null;
    final all = Float32List(n);
    var at = 0;
    for (final l in labels) {
      final g = l.shaped?.glyphs;
      if (g == null) continue;
      all.setAll(at, g);
      at += g.length;
    }
    return pack(all);
  }

  /// The tile [toMessage] sent, read field by field in the order it writes
  /// them.
  static BuiltTile fromMessage(List<Object?> message) {
    if (message case [
      final List meshes,
      final List labels,
      final List extrusions,
      final glyphPack,
      final gpu,
    ]) {
      final glyphs = glyphPack == null ? null : unpackFloats(glyphPack);
      var glyphAt = 0;
      ShapedText? shapedOf(List? s) {
        if (s
            case [
              final num width,
              final num height,
              final int lines,
              final int length,
            ]
            when glyphs != null) {
          final view = Float32List.sublistView(
            glyphs,
            glyphAt,
            glyphAt + length,
          );
          glyphAt += length;
          return ShapedText(view, width.toDouble(), height.toDouble(), lines);
        }
        return null;
      }

      return BuiltTile(
        [
          for (final m in meshes)
            switch (m) {
              [
                final int bucket,
                final Object positions,
                final extrusions,
                final Object indices,
                final distances,
                final Map? props,
                final offsets,
              ] =>
                BuiltMesh(
                  bucket,
                  MeshChunk(
                    unpackFloats(positions),
                    _floats(extrusions),
                    unpackShorts(indices),
                    _floats(distances),
                    _floats(offsets),
                  ),
                  props?.cast<String, Object?>(),
                ),
              _ => throw FormatException('Not a mesh of a built tile: $m'),
            },
        ],
        [
          for (final l in labels)
            switch (l) {
              [
                final int layer,
                final int priority,
                final String text,
                final num x,
                final num y,
                final Float32List? line,
                final String icon,
                final num angle,
                final bool spaced,
                final String key,
                final bool turns,
                final Map? props,
                final List? shaped,
              ] =>
                BuiltLabel(
                    layer,
                    priority,
                    text,
                    x.toDouble(),
                    y.toDouble(),
                    line,
                    icon: icon,
                    angle: angle.toDouble(),
                    spaced: spaced,
                    turns: turns,
                  )
                  ..key = key
                  ..props = props?.cast<String, Object?>()
                  ..shaped = shapedOf(shaped),
              _ => throw FormatException('Not a label of a built tile: $l'),
            },
        ],
        [
          for (final e in extrusions)
            BuiltExtrusion.fromMessage(e as List<Object?>),
        ],
        gpu == null ? null : GpuStream.fromMessage(gpu as List<Object?>),
      );
    }
    throw FormatException('Not a built tile: ${message.length} fields');
  }
}

Float32List? _floats(Object? packed) =>
    packed == null ? null : unpackFloats(packed);
