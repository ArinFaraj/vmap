import 'dart:typed_data';
import 'dart:ui' as ui;

import '../render/map_renderer.dart';
import '../style/style_model.dart';
import '../tiles/built_tile.dart';
import '../tiles/tessellate.dart';

class MeshStroke {
  MeshStroke(this.pass, this.halfWidth, this.offset, this.vertices);

  final int pass;
  final double halfWidth;
  final double offset;
  final ui.Vertices vertices;
}

class TileMesh {
  TileMesh.fill(MeshChunk chunk, this.props)
    : fill = ui.Vertices.raw(
        ui.VertexMode.triangles,
        chunk.positions,
        indices: chunk.indices,
      ),
      points = null,
      _base = null,
      _ext = null,
      _off = null,
      _along = null,
      _indices = null;

  TileMesh.points(MeshChunk chunk, this.props)
    : fill = null,
      points = chunk.positions,
      _base = null,
      _ext = null,
      _off = null,
      _along = null,
      _indices = null;

  TileMesh.line(MeshChunk chunk, this.props)
    : fill = null,
      points = null,
      _along = chunk.distances,
      _base = chunk.positions.buffer.asFloat32x4List(
        chunk.positions.offsetInBytes,
        chunk.positions.length >> 2,
      ),
      _ext = chunk.extrusions!.buffer.asFloat32x4List(
        chunk.extrusions!.offsetInBytes,
        chunk.positions.length >> 2,
      ),
      _off = chunk.offsets?.buffer.asFloat32x4List(
        chunk.offsets!.offsetInBytes,
        chunk.positions.length >> 2,
      ),
      _indices = chunk.indices;

  final ui.Vertices? fill;

  /// The centres of a circle layer's circles.
  final Float32List? points;

  /// What the features in the mesh have in common, for paint that reads it.
  final Map<String, Object?>? props;
  final Float32List? _along;
  final Float32x4List? _base;
  final Float32x4List? _ext;
  final Float32x4List? _off;
  final Uint16List? _indices;
  final List<MeshStroke> _strokes = [];

  static Float32x4List _scratch = Float32x4List(0);

  MeshStroke? existing(int pass) {
    for (final s in _strokes) {
      if (s.pass == pass) return s;
    }
    return null;
  }

  /// Widens the line mesh to [halfWidth] tile units for [pass], [offset] tile
  /// units to the right of its centre line, replacing whatever that pass had.
  ui.Vertices build(int pass, double halfWidth, [double offset = 0]) {
    for (var i = 0; i < _strokes.length; i++) {
      if (_strokes[i].pass == pass) {
        _strokes.removeAt(i).vertices.dispose();
        break;
      }
    }
    final base = _base!;
    final ext = _ext!;
    final n = base.length;
    if (_scratch.length < n) _scratch = Float32x4List(n);
    final out = _scratch;
    final w = Float32x4.splat(halfWidth);
    final off = _off;
    if (off == null || offset == 0) {
      for (var i = 0; i < n; i++) {
        out[i] = base[i] + ext[i] * w;
      }
    } else {
      final o = Float32x4.splat(offset);
      for (var i = 0; i < n; i++) {
        out[i] = base[i] + ext[i] * w + off[i] * o;
      }
    }
    final vertices = ui.Vertices.raw(
      ui.VertexMode.triangles,
      out.buffer.asFloat32List(0, n * 4),
      indices: _indices,
      textureCoordinates: _along,
    );
    _strokes.add(MeshStroke(pass, halfWidth, offset, vertices));
    return vertices;
  }

  void dispose() {
    fill?.dispose();
    for (final s in _strokes) {
      s.vertices.dispose();
    }
    _strokes.clear();
  }
}

/// What the canvas draws a tile from: its meshes by bucket, each line
/// widened for the layers that draw it.
class CanvasTile implements RendererTileData {
  CanvasTile(this._built, this._sheet)
    : groups = List.filled(_sheet.buckets.length, null);

  /// The worker's meshes, let go once they are made.
  List<BuiltMesh> _built;
  final StyleSheet _sheet;
  final List<List<TileMesh>?> groups;

  /// 0 makes the meshes, 1..layers widen one line layer each.
  int _step = 0;
  int _at = 0;

  /// Makes the meshes, every line widened to [widths] at [scale], in steps
  /// until [clock] passes [deadline]; true once all are made.
  bool build(Float64List widths, double scale, Stopwatch clock, int deadline) {
    if (_step == 0) {
      while (_at < _built.length) {
        if (_at > 0 && clock.elapsedMicroseconds > deadline) return false;
        final m = _built[_at++];
        (groups[m.bucket] ??= []).add(switch (_sheet.buckets[m.bucket].kind) {
          BucketKind.line => TileMesh.line(m.chunk, m.props),
          BucketKind.circle => TileMesh.points(m.chunk, m.props),
          BucketKind.fill ||
          BucketKind.extrusion => TileMesh.fill(m.chunk, m.props),
        });
      }
      _step = 1;
      _built = const [];
      if (clock.elapsedMicroseconds > deadline) return false;
    }
    while (_step <= _sheet.layers.length) {
      final p = _step - 1;
      final layer = _sheet.layers[p];
      final meshes = groups[layer.bucket];
      _step++;
      if (layer is! LineLayer ||
          layer.perFeature ||
          meshes == null ||
          widths[p] <= 0) {
        continue;
      }
      final halfWidth = widths[p] / 2 / scale;
      for (final m in meshes) {
        m.build(p, halfWidth);
      }
      if (clock.elapsedMicroseconds > deadline) return false;
    }
    return true;
  }

  @override
  void dispose() {
    for (final g in groups) {
      if (g == null) continue;
      for (final m in g) {
        m.dispose();
      }
    }
  }
}
