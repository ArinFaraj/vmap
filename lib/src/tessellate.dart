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

/// How a line ends.
enum LineCap { butt, round, square }

enum _Join { round, bevel, miter, none, fakeround, flipbevel, butt, square }

class MeshChunk {
  MeshChunk(
    this.positions,
    this.extrusions,
    this.indices, [
    this.distances,
    this.offsets,
    this.edges,
    this.outline,
  ]);

  /// A fill's rings as pairs of vertex indices, one pair an edge, for the
  /// outline drawn round it. Kept by the tile builder only, never sent
  /// between isolates; null when no layer outlines the fill.
  final Uint16List? outline;

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

  /// Per line vertex, what the GPU fades its edge by: [edgeLeft] or
  /// [edgeRight] for a vertex on that side of its line, faded by how far
  /// across the line a pixel is, or [edgeRound] for one of a round cap or
  /// join, faded by its distance from the centre line point. A butt end
  /// is followed by a pair the GPU moves a pixel past it, [edgeLeftAhead]
  /// to [edgeRightBehind], and draws nothing beyond the end, so under
  /// multisampling the end is cut at pixel centres as MapLibre's is. Kept
  /// by the tile builder only, never sent between isolates.
  final Uint8List? edges;

  static const edgeLeft = 0,
      edgeRight = 1,
      edgeRound = 2,
      edgeLeftAhead = 3,
      edgeLeftBehind = 4,
      edgeRightAhead = 5,
      edgeRightBehind = 6;
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
  Uint8List edge = Uint8List(0);
  Uint16List idx = Uint16List(4096);
  Uint16List lines = Uint16List(0);
  int lineCount = 0;
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
    if (withExtrusions && needPos ~/ 2 > edge.length) {
      edge = Uint8List(math.max(needPos, pos.length) ~/ 2)
        ..setRange(0, vertexCount, edge);
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
      edge[vertexCount] = MeshChunk.edgeRound;
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
          withExtrusions
              ? Uint8List.fromList(Uint8List.sublistView(edge, 0, vertexCount))
              : null,
          lines.isEmpty
              ? null
              : Uint16List.fromList(
                  Uint16List.sublistView(lines, 0, lineCount),
                ),
        ),
      );
    }
    vertexCount = 0;
    indexCount = 0;
    lineCount = 0;
  }
}

class FillMesher {
  FillMesher({this.outlines = false});

  final _Buffers _b = _Buffers(false);

  /// Its rings are kept as edges too, for an outline.
  final bool outlines;

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
    if (outlines) _ring(base, count, holeStarts);
    _b.vertexCount += count;
    _b.indexCount = k;
  }

  void _ring(int base, int count, List<int> holeStarts) {
    if (_b.lines.length < _b.lineCount + count * 2) {
      _b.lines = Uint16List(
        math.max(_b.lineCount + count * 2, _b.lines.length * 2),
      )..setRange(0, _b.lineCount, _b.lines);
    }
    final lines = _b.lines;
    var k = _b.lineCount;
    for (var r = 0; r <= holeStarts.length; r++) {
      final from = r == 0 ? 0 : holeStarts[r - 1];
      final to = r < holeStarts.length ? holeStarts[r] : count;
      for (var i = from; i < to; i++) {
        lines[k++] = base + i;
        lines[k++] = base + (i + 1 < to ? i + 1 : from);
      }
    }
    _b.lineCount = k;
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
    this.miterLimit = 2,
    this.roundLimit = 1.05,
    this.sharpCorner = 120,
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

  /// Set while a line is added by its share of a longer line: the share
  /// before it, and the share one unit of its length is.
  double? _shareBefore;
  double _sharePer = 0;

  /// The width of the picture a line is drawn through by its share.
  static const double shareSpan = 256;

  static const double _arcStep = math.pi / 6;
  static const int _fanVertices = 9;
  static const int _maxPoints = 1800;

  /// `line-miter-limit` and `line-round-limit`: the longest mitre, in
  /// line widths, before a mitre join is bevelled, and the shortest before
  /// a round join is rounded.
  final double miterLimit;
  final double roundLimit;

  /// How far from a sharp corner a vertex is added, in tile units, so a
  /// dash tilts over a shorter part of the line: MapLibre's 15 pixels.
  final double sharpCorner;

  static final double _cosHalfSharpCorner = math.cos(75 / 2 * math.pi / 180);
  static const double _degPerTriangle = 20;
  static const double _maxOffsetMiter = 2;
  static const double _offsetFallbackStart = 3;
  static const double _offsetFallbackEnd = 8;

  Float64List _pts = Float64List(512);

  void addLine(
    Float64List coords,
    int start,
    int end,
    double minDistance, {
    LineCap cap = LineCap.butt,
    bool closed = false,
    LineJoin? join,
    double? shareBefore,
    double sharePer = 0,
  }) {
    join ??= this.join;
    if (end - start < 2) return;
    if (end - start > _maxPoints) {
      final mid = start + _maxPoints - 1;
      var first = 0.0;
      if (shareBefore != null) {
        for (var i = start + 1; i <= mid; i++) {
          final dx = coords[i * 2] - coords[i * 2 - 2];
          final dy = coords[i * 2 + 1] - coords[i * 2 - 1];
          first += math.sqrt(dx * dx + dy * dy);
        }
      }
      addLine(
        coords,
        start,
        mid + 1,
        minDistance,
        cap: cap,
        join: join,
        shareBefore: shareBefore,
        sharePer: sharePer,
      );
      addLine(
        coords,
        mid,
        end,
        minDistance,
        cap: cap,
        join: join,
        shareBefore: shareBefore == null
            ? null
            : shareBefore + first * sharePer,
        sharePer: sharePer,
      );
      return;
    }
    _shareBefore = shareBefore;
    _sharePer = sharePer;
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
    _b.reserve(n * 32 + 2 * _fanVertices, n * 96 + 6 * _fanVertices);
    _along = 0;
    _e1 = _e2 = -1;
    if (closed) {
      while (n > 2 && pts[n * 2 - 2] == pts[0] && pts[n * 2 - 1] == pts[1]) {
        n--;
      }
      if (n < 3) return;
      pts[n * 2] = pts[0];
      pts[n * 2 + 1] = pts[1];
      n++;
    }
    final miterLimit = join == LineJoin.bevel ? 1.05 : this.miterLimit;
    final last = n - 1;

    double cx = 0, cy = 0;
    var hasCurrent = false;
    double px = 0, py = 0;
    var hasPrev = false;
    double pnx = 0, pny = 0;
    double nnx = 0, nny = 0;
    var hasNext = false;
    if (closed) {
      cx = pts[last * 2 - 2];
      cy = pts[last * 2 - 1];
      hasCurrent = true;
      (nnx, nny) = _normal(cx, cy, pts[0], pts[1]);
      hasNext = true;
    }

    for (var i = 0; i < n; i++) {
      final hasFollowing = i < last || closed;
      final fx = i < last ? pts[i * 2 + 2] : pts[2];
      final fy = i < last ? pts[i * 2 + 3] : pts[3];
      if (hasNext) {
        pnx = nnx;
        pny = nny;
      }
      if (hasCurrent) {
        px = cx;
        py = cy;
        hasPrev = true;
      }
      cx = pts[i * 2];
      cy = pts[i * 2 + 1];
      hasCurrent = true;
      if (hasFollowing) {
        (nnx, nny) = _normal(cx, cy, fx, fy);
      } else {
        nnx = pnx;
        nny = pny;
      }
      if (!hasNext) {
        pnx = nnx;
        pny = nny;
      }
      hasNext = true;

      var jx = pnx + nnx;
      var jy = pny + nny;
      final jl = math.sqrt(jx * jx + jy * jy);
      if (jl > 0) {
        jx /= jl;
        jy /= jl;
      }
      final cosAngle = pnx * nnx + pny * nny;
      final cosHalf = jx * nnx + jy * nny;
      final miterLength = cosHalf != 0 ? 1 / cosHalf : double.infinity;
      final approxAngle = 2 * math.sqrt(math.max(0, 2 - 2 * cosHalf));
      final sharp = cosHalf < _cosHalfSharpCorner && hasPrev && hasFollowing;
      final turnsLeft = pnx * nny - pny * nnx > 0;
      final reach = math.min(miterLength, _maxOffsetMiter);
      final ojx = jx * reach;
      final ojy = jy * reach;
      final fallback =
          ((miterLength - _offsetFallbackStart) /
                  (_offsetFallbackEnd - _offsetFallbackStart))
              .clamp(0.0, 1.0);

      if (sharp && i > 0) {
        final ddx = cx - px;
        final ddy = cy - py;
        final prevLength = math.sqrt(ddx * ddx + ddy * ddy);
        if (prevLength > 2 * sharpCorner) {
          final k = sharpCorner / prevLength;
          final nx = cx - (ddx * k).roundToDouble();
          final ny = cy - (ddy * k).roundToDouble();
          _along += _dist(px, py, nx, ny);
          _pair(nx, ny, pnx, pny, 0, 0, pnx, pny);
          px = nx;
          py = ny;
        }
      }

      final middle = hasPrev && hasFollowing;
      var current = middle
          ? (join == LineJoin.none ? _Join.none : _Join.values[join.index])
          : closed
          ? _Join.butt
          : cap == LineCap.round
          ? _Join.round
          : cap == LineCap.square
          ? _Join.square
          : _Join.butt;
      if (middle && current == _Join.round) {
        if (miterLength < roundLimit) {
          current = _Join.miter;
        } else if (miterLength <= 2) {
          current = _Join.fakeround;
        }
      }
      if (current == _Join.miter && miterLength > miterLimit) {
        current = _Join.bevel;
      }
      if (current == _Join.bevel) {
        if (miterLength > 2) current = _Join.flipbevel;
        if (miterLength < miterLimit) current = _Join.miter;
      }

      if (hasPrev) _along += _dist(px, py, cx, cy);

      switch (current) {
        case _Join.miter:
          _pair(cx, cy, jx * miterLength, jy * miterLength, 0, 0, ojx, ojy);
        case _Join.flipbevel:
          double bx, by;
          if (miterLength > 100) {
            bx = -nnx;
            by = -nny;
          } else {
            final sx = pnx + nnx, sy = pny + nny;
            final dx = pnx - nnx, dy = pny - nny;
            final bevel =
                miterLength *
                math.sqrt(sx * sx + sy * sy) /
                math.sqrt(dx * dx + dy * dy);
            final k = bevel * (turnsLeft ? -1 : 1);
            bx = -jy * k;
            by = jx * k;
          }
          final (ox, oy) = _eased(ojx, ojy, bx, by, fallback);
          _pair(cx, cy, bx, by, 0, 0, ox, oy);
          final (ox2, oy2) = _eased(ojx, ojy, -bx, -by, fallback);
          _pair(cx, cy, -bx, -by, 0, 0, ox2, oy2);
        case _Join.bevel || _Join.fakeround:
          final shift = -math.sqrt(miterLength * miterLength - 1);
          final shiftA = turnsLeft ? shift : 0.0;
          final shiftB = turnsLeft ? 0.0 : shift;
          if (hasPrev) _pair(cx, cy, pnx, pny, shiftA, shiftB, ojx, ojy);
          if (current == _Join.fakeround) {
            final steps = (approxAngle * 180 / math.pi / _degPerTriangle)
                .round();
            for (var m = 1; m < steps; m++) {
              var t = m / steps;
              if (t != 0.5) {
                final t2 = t - 0.5;
                final a =
                    1.0904 +
                    cosAngle *
                        (-3.2452 + cosAngle * (3.55645 - cosAngle * 1.43519));
                final b =
                    0.848013 + cosAngle * (-1.06021 + cosAngle * 0.215638);
                t = t + t * t2 * (t - 1) * (a * t2 * t2 + b);
              }
              var ex = (nnx - pnx) * t + pnx;
              var ey = (nny - pny) * t + pny;
              final el = math.sqrt(ex * ex + ey * ey);
              final k = (turnsLeft ? -1 : 1) / el;
              ex *= k;
              ey *= k;
              _ox = turnsLeft ? -ojx : ojx;
              _oy = turnsLeft ? -ojy : ojy;
              _strip(_vertex(cx, cy, ex, ey, turnsLeft ? 1 : 0), turnsLeft);
            }
          }
          if (hasFollowing) {
            _pair(cx, cy, nnx, nny, -shiftA, -shiftB, ojx, ojy);
          }
        case _Join.butt:
          if (!hasPrev) _past(cx, cy, jx, jy, ojx, ojy, ahead: false);
          _pair(cx, cy, jx, jy, 0, 0, ojx, ojy);
          if (hasPrev) _past(cx, cy, jx, jy, ojx, ojy, ahead: true);
        case _Join.square:
          final k = hasPrev ? 1.0 : -1.0;
          _pair(cx, cy, jx, jy, k, k, ojx, ojy);
        case _Join.none:
          _pair(cx, cy, pnx, pny, 0, 0, pnx, pny);
          _e1 = _e2 = -1;
          _pair(cx, cy, nnx, nny, 0, 0, nnx, nny);
        case _Join.round:
          if (hasPrev) {
            final (ox, oy) = _eased(ojx, ojy, pnx, pny, fallback);
            _pair(cx, cy, pnx, pny, 0, 0, ox, oy);
            _ox = ox;
            _oy = oy;
            _fan(cx, cy, pnx, pny, math.pi, -1);
          }
          if (hasFollowing) {
            final (ox, oy) = _eased(ojx, ojy, nnx, nny, fallback);
            _ox = ox;
            _oy = oy;
            _fan(cx, cy, nnx, nny, math.pi, 1);
            _e1 = _e2 = -1;
            _pair(cx, cy, nnx, nny, 0, 0, ox, oy);
          }
      }

      if (sharp && i < last) {
        final ddx = fx - cx;
        final ddy = fy - cy;
        final nextLength = math.sqrt(ddx * ddx + ddy * ddy);
        if (nextLength > 2 * sharpCorner) {
          final k = sharpCorner / nextLength;
          final nx = cx + (ddx * k).roundToDouble();
          final ny = cy + (ddy * k).roundToDouble();
          _along += _dist(cx, cy, nx, ny);
          _pair(nx, ny, nnx, nny, 0, 0, nnx, nny);
          cx = nx;
          cy = ny;
        }
      }
    }
  }

  static (double, double) _normal(double ax, double ay, double bx, double by) {
    final dx = bx - ax;
    final dy = by - ay;
    final l = math.sqrt(dx * dx + dy * dy);
    return (-dy / l, dx / l);
  }

  static double _dist(double ax, double ay, double bx, double by) {
    final dx = bx - ax;
    final dy = by - ay;
    return math.sqrt(dx * dx + dy * dy);
  }

  static (double, double) _eased(
    double ox,
    double oy,
    double nx,
    double ny,
    double k,
  ) => (ox + (nx - ox) * k, oy + (ny - oy) * k);

  /// The last two vertices of the strip being added, on the line's left and
  /// right: each new vertex makes a triangle with them, as MapLibre's line
  /// bucket strings its vertices.
  int _e1 = -1;
  int _e2 = -1;

  void _strip(int v, bool right) {
    if (_e1 >= 0 && _e2 >= 0) {
      final idx = _b.idx;
      var k = _b.indexCount;
      idx[k++] = _e1;
      idx[k++] = v;
      idx[k++] = _e2;
      _b.indexCount = k;
    }
    if (right) {
      _e2 = v;
    } else {
      _e1 = v;
    }
  }

  /// The pair past a butt end at ([x], [y]), [ahead] of it or behind.
  void _past(
    double x,
    double y,
    double nx,
    double ny,
    double ox,
    double oy, {
    required bool ahead,
  }) {
    _ox = ox;
    _oy = oy;
    final l = _vertex(x, y, nx, ny, 0);
    _b.edge[l] = ahead ? MeshChunk.edgeLeftAhead : MeshChunk.edgeLeftBehind;
    _strip(l, false);
    final r = _vertex(x, y, -nx, -ny, 1);
    _b.edge[r] = ahead ? MeshChunk.edgeRightAhead : MeshChunk.edgeRightBehind;
    _strip(r, true);
  }

  /// Adds a vertex either side of ([x], [y]) along the normal ([nx], [ny]),
  /// each moved along the line by [endLeft] and [endRight] half widths, as
  /// MapLibre's addCurrentVertex; ([ox], [oy]) is where a line offset moves
  /// them.
  void _pair(
    double x,
    double y,
    double nx,
    double ny,
    double endLeft,
    double endRight,
    double ox,
    double oy,
  ) {
    _ox = ox;
    _oy = oy;
    _strip(_vertex(x, y, nx + ny * endLeft, ny - nx * endLeft, 0), false);
    _strip(_vertex(x, y, -nx + ny * endRight, -ny - nx * endRight, 1), true);
  }

  /// A round fan around ([cx], [cy]) from the offset ([ex], [ey]) through
  /// [angle] radians, turning in [direction]: the polygon around the arc, so
  /// the GPU can cut the true arc out of it.
  void _fan(
    double cx,
    double cy,
    double ex,
    double ey,
    double angle,
    int direction,
  ) {
    final across = edged ? 0.0 : 0.5;
    final v = _vertex(cx, cy, 0, 0, 0.5, true);
    final steps = math.max(1, (angle / _arcStep).ceil());
    final step = angle / steps * direction;
    final reach = 1 / math.cos(step / 2);
    _vertex(cx, cy, ex, ey, across, true);
    for (var j = 0; j < steps; j++) {
      final a = step * (j + 0.5);
      final c = math.cos(a) * reach;
      final s = math.sin(a) * reach;
      _vertex(cx, cy, ex * c - ey * s, ex * s + ey * c, across, true);
    }
    final c = math.cos(angle * direction);
    final s = math.sin(angle * direction);
    _vertex(cx, cy, ex * c - ey * s, ex * s + ey * c, across, true);
    final idx = _b.idx;
    var k = _b.indexCount;
    for (var j = 0; j <= steps; j++) {
      idx[k++] = v;
      idx[k++] = v + 1 + j;
      idx[k++] = v + 2 + j;
    }
    _b.indexCount = k;
  }

  /// [across] is where the vertex sits over the line's width: 0 on its left
  /// edge, 1 on its right.
  int _vertex(
    double x,
    double y,
    double ex,
    double ey, [
    double across = 0.5,
    bool round = false,
  ]) {
    final v = _b.vertexCount;
    final o = v * 2;
    _b.pos[o] = x;
    _b.pos[o + 1] = y;
    _b.ext[o] = ex;
    _b.ext[o + 1] = ey;
    _b.edge[v] = round
        ? MeshChunk.edgeRound
        : across < 0.5
        ? MeshChunk.edgeLeft
        : MeshChunk.edgeRight;
    if (_b.withDistances) {
      final before = _shareBefore;
      _b.dst[o] = before == null
          ? _along
          : (before + _along * _sharePer) * shareSpan;
      // A gradient line keeps its distance where another keeps where the
      // vertex sits across it, for dashes over the gradient.
      _b.dst[o + 1] = before == null ? across : _along;
    }
    if (_b.withOffsets) {
      _b.off[o] = _ox;
      _b.off[o + 1] = _oy;
    }
    _b.vertexCount = v + 1;
    return v;
  }

  /// A fill's outline round the ring of [coords] from [start] to [end]:
  /// a quad on each edge and nothing at its corners, as MapLibre draws the
  /// outline as one pixel lines that need no joins.
  void addOutline(Float64List coords, int start, int end) {
    if (end - start < 2) return;
    _along = 0;
    _ox = _oy = 0;
    _shareBefore = null;
    for (var i = start; i + 1 < end; i++) {
      final x0 = coords[i * 2], y0 = coords[i * 2 + 1];
      final x1 = coords[i * 2 + 2], y1 = coords[i * 2 + 3];
      final dx = x1 - x0, dy = y1 - y0;
      final length = math.sqrt(dx * dx + dy * dy);
      if (length == 0) continue;
      final nx = -dy / length, ny = dx / length;
      _b.reserve(4, 6);
      final a = _vertex(x0, y0, nx, ny, 0);
      final b = _vertex(x0, y0, -nx, -ny, 1);
      final c = _vertex(x1, y1, nx, ny, 0);
      final d = _vertex(x1, y1, -nx, -ny, 1);
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
  }

  List<MeshChunk> finish() {
    _b.flush();
    return _b.chunks;
  }
}
