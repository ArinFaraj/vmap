import 'dart:math' as math;
import 'dart:typed_data';

import 'package:dart_earcut/dart_earcut.dart';

/// Indices are 16 bit, so a mesh is cut into chunks below this many vertices.
const int _maxVertices = 65000;

/// A mesh is cut once it holds this many vertices, so no single upload or
/// re-widening takes more than a fraction of a frame.
const int _chunkVertices = 16000;

/// How a line turns a corner.
enum LineJoin { round, bevel, miter, none }

class MeshChunk {
  MeshChunk(
    this.positions,
    this.extrusions,
    this.indices, [
    this.distances,
    this.offsets,
  ]);

  final Float32List positions;

  /// Per-vertex offset direction for lines: the drawn position is
  /// `position + extrusion * halfWidth`. Null for fills.
  final Float32List? extrusions;
  final Uint16List indices;

  /// Per-vertex distance along its line as x, and as y where the vertex sits
  /// across the line from 0 to 1: the texture coordinates dashes and line
  /// patterns are drawn by. Null when not asked for.
  final Float32List? distances;

  /// Per-vertex direction a line moves in when it is drawn beside its centre
  /// line: the drawn position gains `offset * distance`. Null when not asked
  /// for.
  final Float32List? offsets;
}

class _Buffers {
  _Buffers(
    this.withExtrusions, {
    this.withDistances = false,
    this.withOffsets = false,
  });

  final bool withExtrusions;
  final bool withDistances;
  final bool withOffsets;
  Float32List dst = Float32List(0);
  Float32List off = Float32List(0);
  Float32List pos = Float32List(2048);
  Float32List ext = Float32List(0);
  Uint16List idx = Uint16List(4096);
  int vertexCount = 0;
  int indexCount = 0;
  final List<MeshChunk> chunks = [];

  void reserve(int vertices, int indices) {
    if (vertexCount > 0 && vertexCount + vertices > _chunkVertices) flush();
    reserveRaw(vertices);
    final needIdx = indexCount + indices;
    if (needIdx > idx.length) {
      idx = Uint16List(math.max(needIdx, idx.length * 2))
        ..setRange(0, indexCount, idx);
    }
  }

  void reserveRaw(int vertices) {
    final needPos = (vertexCount + vertices) * 2;
    if (needPos > pos.length) {
      pos = Float32List(math.max(needPos, pos.length * 2))
        ..setRange(0, vertexCount * 2, pos);
    }
    if (withExtrusions && needPos > ext.length) {
      ext = Float32List(math.max(needPos, pos.length))
        ..setRange(0, vertexCount * 2, ext);
    }
    if (withDistances && needPos > dst.length) {
      dst = Float32List(math.max(needPos, pos.length))
        ..setRange(0, vertexCount * 2, dst);
    }
    if (withOffsets && needPos > off.length) {
      off = Float32List(math.max(needPos, pos.length))
        ..setRange(0, vertexCount * 2, off);
    }
  }

  void flush() {
    if (withExtrusions && vertexCount.isOdd) {
      reserveRaw(1);
      pos[vertexCount * 2] = 0;
      pos[vertexCount * 2 + 1] = 0;
      ext[vertexCount * 2] = 0;
      ext[vertexCount * 2 + 1] = 0;
      if (withDistances) dst[vertexCount * 2] = 0;
      if (withOffsets) {
        off[vertexCount * 2] = 0;
        off[vertexCount * 2 + 1] = 0;
      }
      vertexCount++;
    }
    if (indexCount > 0) {
      chunks.add(
        MeshChunk(
          Float32List.fromList(
            Float32List.sublistView(pos, 0, vertexCount * 2),
          ),
          withExtrusions
              ? Float32List.fromList(
                  Float32List.sublistView(ext, 0, vertexCount * 2),
                )
              : null,
          Uint16List.fromList(Uint16List.sublistView(idx, 0, indexCount)),
          withDistances
              ? Float32List.fromList(
                  Float32List.sublistView(dst, 0, vertexCount * 2),
                )
              : null,
          withOffsets
              ? Float32List.fromList(
                  Float32List.sublistView(off, 0, vertexCount * 2),
                )
              : null,
        ),
      );
    }
    vertexCount = 0;
    indexCount = 0;
  }
}

class FillMesher {
  final _Buffers _b = _Buffers(false);

  /// Adds one polygon: an outer ring followed by its holes, as flat x,y pairs
  /// in [coords] from point [start] to [end]. [holeStarts] are point indices
  /// relative to [start].
  void addPolygon(
    Float64List coords,
    int start,
    int end,
    List<int> holeStarts,
  ) {
    final count = end - start;
    if (count < 3 || count > _maxVertices) return;
    final flat = Float64List.sublistView(coords, start * 2, end * 2);
    final triangles = Earcut.triangulateRaw(flat, holeIndices: holeStarts);
    if (triangles.isEmpty) return;
    _b.reserve(count, triangles.length);
    final base = _b.vertexCount;
    final pos = _b.pos;
    var o = base * 2;
    for (var i = 0; i < count * 2; i++) {
      pos[o++] = flat[i];
    }
    final idx = _b.idx;
    var k = _b.indexCount;
    for (var i = 0; i < triangles.length; i++) {
      idx[k++] = base + triangles[i];
    }
    _b.vertexCount += count;
    _b.indexCount = k;
  }

  List<MeshChunk> finish() {
    _b.flush();
    return _b.chunks;
  }
}

/// Turns polylines into triangles. Gentle bends share mitred vertices, sharp
/// ones are joined the way [join] says, and ends get round caps. Every vertex
/// keeps the centre-line point and an offset vector, so one mesh serves any
/// stroke width.
class LineMesher {
  LineMesher({
    bool distances = false,
    bool offsets = false,
    this.edged = false,
    this.join = LineJoin.round,
  }) : _b = _Buffers(true, withDistances: distances, withOffsets: offsets);

  final _Buffers _b;
  final LineJoin join;

  /// The rim of a cap or join sits on the line's edge across its width
  /// instead of on its middle.
  final bool edged;

  /// The direction the vertices being added move in for a line offset.
  double _ox = 0;
  double _oy = 0;

  /// How far along the current line the vertices being added are.
  double _along = 0;

  static const double _arcStep = math.pi / 5;
  static const int _fanVertices = 7;
  static const int _maxPoints = 4000;

  /// Bends turning less than this (as a cosine) are mitred. A mitre join
  /// reaches as far as MapLibre's default limit of twice the line's width.
  double _miterCos(LineJoin join) => switch (join) {
    LineJoin.miter => -0.5,
    LineJoin.bevel => 0.8,
    _ => 0.5,
  };

  Float64List _pts = Float64List(512);

  void addLine(
    Float64List coords,
    int start,
    int end,
    double minDistance, {
    bool caps = true,
    LineJoin? join,
  }) {
    join ??= this.join;
    if (end - start < 2) return;
    if (end - start > _maxPoints) {
      final mid = start + _maxPoints - 1;
      addLine(coords, start, mid + 1, minDistance, caps: caps, join: join);
      addLine(coords, mid, end, minDistance, caps: caps, join: join);
      return;
    }
    final miterCos = _miterCos(join);
    if ((end - start) * 2 > _pts.length) _pts = Float64List((end - start) * 4);
    final pts = _pts;
    final minSq = minDistance * minDistance;
    var n = 0;
    for (var i = start; i < end; i++) {
      final x = coords[i * 2];
      final y = coords[i * 2 + 1];
      if (n > 0) {
        final dx = x - pts[n * 2 - 2];
        final dy = y - pts[n * 2 - 1];
        final dSq = dx * dx + dy * dy;
        if (dSq == 0 || (dSq < minSq && i != end - 1)) continue;
      }
      pts[n * 2] = x;
      pts[n * 2 + 1] = y;
      n++;
    }
    if (n < 2) return;
    _b.reserve(n * (4 + _fanVertices) + 2 * _fanVertices, n * 21 + 30);

    var dx = pts[2] - pts[0];
    var dy = pts[3] - pts[1];
    var len = math.sqrt(dx * dx + dy * dy);
    dx /= len;
    dy /= len;
    _along = 0;
    _ox = -dy;
    _oy = dx;
    var segment = len;
    if (caps) _fan(pts[0], pts[1], -dy, dx, math.pi, 1);
    var left = _vertex(pts[0], pts[1], -dy, dx, 0);
    var right = _vertex(pts[0], pts[1], dy, -dx, 1);

    for (var i = 1; i < n; i++) {
      final x = pts[i * 2];
      final y = pts[i * 2 + 1];
      _along += segment;
      if (i == n - 1) {
        _ox = -dy;
        _oy = dx;
        final l = _vertex(x, y, -dy, dx, 0);
        final r = _vertex(x, y, dy, -dx, 1);
        _quad(left, right, l, r);
        if (caps) _fan(x, y, -dy, dx, math.pi, -1);
        break;
      }
      var ex = pts[i * 2 + 2] - x;
      var ey = pts[i * 2 + 3] - y;
      len = math.sqrt(ex * ex + ey * ey);
      segment = len;
      ex /= len;
      ey /= len;
      final dot = dx * ex + dy * ey;
      final reach = math.min(1 / (1 + dot), 2.0);
      _ox = (-dy - ey) * reach;
      _oy = (dx + ex) * reach;
      if (dot > miterCos) {
        final k = 1 / (1 + dot);
        final mx = (-dy - ey) * k;
        final my = (dx + ex) * k;
        final l = _vertex(x, y, mx, my, 0);
        final r = _vertex(x, y, -mx, -my, 1);
        _quad(left, right, l, r);
        left = l;
        right = r;
      } else {
        final l = _vertex(x, y, -dy, dx, 0);
        final r = _vertex(x, y, dy, -dx, 1);
        _quad(left, right, l, r);
        if (join != LineJoin.none) {
          final cross = dx * ey - dy * ex;
          final side = cross > 0 ? -1.0 : 1.0;
          _fan(
            x,
            y,
            -dy * side,
            dx * side,
            math.atan2(cross.abs(), dot),
            cross > 0 ? 1 : -1,
            flat: join != LineJoin.round,
          );
        }
        left = _vertex(x, y, -ey, ex, 0);
        right = _vertex(x, y, ey, -ex, 1);
      }
      dx = ex;
      dy = ey;
    }
  }

  void _quad(int a, int b, int c, int d) {
    final idx = _b.idx;
    var k = _b.indexCount;
    idx[k++] = a;
    idx[k++] = b;
    idx[k++] = c;
    idx[k++] = b;
    idx[k++] = d;
    idx[k++] = c;
    _b.indexCount = k;
  }

  /// A fan around ([cx], [cy]) from the offset ([ex], [ey]) through [angle]
  /// radians, turning in [direction].
  void _fan(
    double cx,
    double cy,
    double ex,
    double ey,
    double angle,
    int direction, {
    bool flat = false,
  }) {
    final steps = flat ? 1 : math.max(1, (angle / _arcStep).ceil());
    final v = _vertex(cx, cy, 0, 0);
    final step = angle / steps * direction;
    for (var j = 0; j <= steps; j++) {
      final a = step * j;
      final c = math.cos(a);
      final s = math.sin(a);
      _vertex(cx, cy, ex * c - ey * s, ex * s + ey * c, edged ? 0 : 0.5);
    }
    final idx = _b.idx;
    var k = _b.indexCount;
    for (var j = 0; j < steps; j++) {
      idx[k++] = v;
      idx[k++] = v + 1 + j;
      idx[k++] = v + 2 + j;
    }
    _b.indexCount = k;
  }

  /// [across] is where the vertex sits over the line's width: 0 on its left
  /// edge, 1 on its right.
  int _vertex(double x, double y, double ex, double ey, [double across = 0.5]) {
    final v = _b.vertexCount;
    final o = v * 2;
    _b.pos[o] = x;
    _b.pos[o + 1] = y;
    _b.ext[o] = ex;
    _b.ext[o + 1] = ey;
    if (_b.withDistances) {
      _b.dst[o] = _along;
      _b.dst[o + 1] = across;
    }
    if (_b.withOffsets) {
      _b.off[o] = _ox;
      _b.off[o + 1] = _oy;
    }
    _b.vertexCount = v + 1;
    return v;
  }

  List<MeshChunk> finish() {
    _b.flush();
    return _b.chunks;
  }
}
