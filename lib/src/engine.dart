import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';

import 'labels.dart';
import 'style.dart';
import 'tessellate.dart';
import 'tile_builder.dart';
import 'worker.dart';

const int _maxDataZoom = 14;

class VmapCamera {
  const VmapCamera({
    required this.zoom,
    required this.origin,
    required this.size,
    required this.rotation,
    required this.devicePixelRatio,
  });

  /// Slippy-map zoom: the world is `256 * 2^zoom` logical pixels wide.
  final double zoom;

  /// World pixel at the canvas origin.
  final ui.Offset origin;
  final ui.Size size;
  final double rotation;
  final double devicePixelRatio;
}

class _Stroke {
  _Stroke(this.pass, this.halfWidth, this.vertices);

  final int pass;
  final double halfWidth;
  final ui.Vertices vertices;
}

class _Mesh {
  _Mesh.fill(MeshChunk chunk)
    : fill = ui.Vertices.raw(
        ui.VertexMode.triangles,
        chunk.positions,
        indices: chunk.indices,
      ),
      path = null,
      _base = null,
      _ext = null,
      _indices = null;

  _Mesh.line(MeshChunk chunk)
    : fill = null,
      path = null,
      _base = chunk.positions.buffer.asFloat32x4List(
        chunk.positions.offsetInBytes,
        chunk.positions.length >> 2,
      ),
      _ext = chunk.extrusions!.buffer.asFloat32x4List(
        chunk.extrusions!.offsetInBytes,
        chunk.positions.length >> 2,
      ),
      _indices = chunk.indices;

  _Mesh.polyline(MeshChunk chunk)
    : fill = null,
      path = _buildPath(chunk),
      _base = null,
      _ext = null,
      _indices = null;

  static ui.Path _buildPath(MeshChunk chunk) {
    final path = ui.Path();
    final pos = chunk.positions;
    var o = 0;
    for (final count in chunk.indices) {
      path.moveTo(pos[o], pos[o + 1]);
      o += 2;
      for (var i = 1; i < count; i++) {
        path.lineTo(pos[o], pos[o + 1]);
        o += 2;
      }
    }
    return path;
  }

  final ui.Vertices? fill;
  final ui.Path? path;
  final Float32x4List? _base;
  final Float32x4List? _ext;
  final Uint16List? _indices;
  final List<_Stroke> _strokes = [];

  static Float32x4List _scratch = Float32x4List(0);

  _Stroke? existing(int pass) {
    for (final s in _strokes) {
      if (s.pass == pass) return s;
    }
    return null;
  }

  /// Widens the line mesh to [halfWidth] tile units for [pass], replacing
  /// whatever width that pass had.
  ui.Vertices build(int pass, double halfWidth) {
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
    for (var i = 0; i < n; i++) {
      out[i] = base[i] + ext[i] * w;
    }
    final vertices = ui.Vertices.raw(
      ui.VertexMode.triangles,
      out.buffer.asFloat32List(0, n * 4),
      indices: _indices,
    );
    _strokes.add(_Stroke(pass, halfWidth, vertices));
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

class _Tile {
  _Tile(this.id, BuiltTile built) : _built = built;

  final TileId id;
  BuiltTile? _built;
  final List<List<_Mesh>?> groups = List.filled(Group.count, null);
  final List<LabelCandidate> labels = [];
  int usedFrame = 0;

  bool get prepared => _step < 0;

  /// 0 uploads the geometry, 1..passes widen one pass each, then labels.
  int _step = 0;
  int _uploaded = 0;

  /// Uploads the geometry and widens every line for [styleZoom], so the first
  /// frame that draws this tile has nothing left to compute. Works in steps
  /// and returns once [clock] passes [deadline]; call again to continue.
  void prepare(double styleZoom, double scale, Stopwatch clock, int deadline) {
    final built = _built!;
    if (_step == 0) {
      while (_uploaded < built.meshes.length) {
        if (_uploaded > 0 && clock.elapsedMicroseconds > deadline) return;
        final m = built.meshes[_uploaded++];
        (groups[m.group] ??= []).add(
          m.isPolyline
              ? _Mesh.polyline(m.chunk)
              : Group.isLine(m.group)
              ? _Mesh.line(m.chunk)
              : _Mesh.fill(m.chunk),
        );
      }
      _step = 1;
      if (clock.elapsedMicroseconds > deadline) return;
    }
    while (_step <= passes.length) {
      final p = _step - 1;
      final pass = passes[p];
      final width = pass.width;
      final meshes = groups[pass.group];
      _step++;
      if (width == null || meshes == null) continue;
      final halfWidth = width.at(styleZoom) / 2 / scale;
      for (final m in meshes) {
        if (m.path == null) m.build(p, halfWidth);
      }
      if (clock.elapsedMicroseconds > deadline) return;
    }
    final span = 1 / (1 << id.z);
    final tx = id.x * span;
    final ty = id.y * span;
    for (var i = 0; i < built.labels.length; i++) {
      final l = built.labels[i];
      final key = l.kind == LabelKind.road
          ? 'r|$id|$i'
          : 'p|${l.text}|${((tx + l.x / tileExtent * span) * 1024).floor()}|${((ty + l.y / tileExtent * span) * 1024).floor()}';
      labels.add(LabelCandidate(key, l, tx, ty, span));
    }
    _built = null;
    _step = -1;
  }

  void dispose() {
    for (final g in groups) {
      if (g == null) continue;
      for (final m in g) {
        m.dispose();
      }
    }
  }
}

class _Draw {
  _Draw(this.tile, this.left, this.top, this.size);

  final _Tile tile;
  final double left;
  final double top;
  final double size;
  List<ui.Rect>? clips;
}

/// Something the app draws above the map at a place, with an optional name
/// for the map to show beside it.
class VmapMarker {
  const VmapMarker(
    this.latitude,
    this.longitude, {
    this.label,
    this.width = 40,
    this.height = 40,
    this.dx = 0,
    this.dy = 0,
  });

  final double latitude;
  final double longitude;
  final String? label;

  /// The marker's size on screen, which labels stay out of.
  final double width;
  final double height;

  /// How far the marker's centre is drawn from its place, in screen pixels.
  final double dx;
  final double dy;

  @override
  bool operator ==(Object other) =>
      other is VmapMarker &&
      other.latitude == latitude &&
      other.longitude == longitude &&
      other.label == label &&
      other.width == width &&
      other.height == height &&
      other.dx == dx &&
      other.dy == dy;

  @override
  int get hashCode =>
      Object.hash(latitude, longitude, label, width, height, dx, dy);
}

class VmapStats {
  int tilesDrawn = 0;
  int fallbackTiles = 0;
  int tilesCached = 0;
  int tilesLoading = 0;
  int labelsShown = 0;
  int drawCalls = 0;

  /// Time spent on the UI thread, in microseconds, summed since [resetTimers].
  int paintMicros = 0;
  int strokeMicros = 0;
  int labelMicros = 0;
  int tileSetupMicros = 0;
  int maxPaintMicros = 0;
  int maxLabelMicros = 0;
  int maxTileSetupMicros = 0;
  int strokesBuilt = 0;
  int frames = 0;
  int paintsOver4ms = 0;
  int paintsOver8ms = 0;
  int maxPrepMicros = 0;
  int maxPlaceMicros = 0;
  int maxLabelRasterMicros = 0;
  int maxDrawMicros = 0;
  int placeMicros = 0;
  int labelStates = 0;
  int maxUnpackMicros = 0;

  /// One line per paint that took over 5 ms, newest last.
  final List<String> slowPaints = [];
  int labelSprites = 0;

  void resetTimers() {
    paintMicros = strokeMicros = labelMicros = tileSetupMicros = 0;
    maxPaintMicros = maxLabelMicros = maxTileSetupMicros = strokesBuilt =
        frames = 0;
    paintsOver4ms = paintsOver8ms = maxPrepMicros = maxPlaceMicros =
        maxLabelRasterMicros = maxDrawMicros = placeMicros = 0;
  }
}

/// Owns the tiles and labels and draws one frame of the map for a camera.
class VmapEngine extends ChangeNotifier {
  VmapEngine({
    TileSourceConfig source = const TileSourceConfig(),
    this._palette = VmapPalette.light,
    VmapLabelFont font = const VmapLabelFont(),
    this.maxCachedTiles = 56,
    this.showLabels = true,
  }) : _labels = LabelEngine(font) {
    _pool = TilePool(source, onLoaded: _onLoaded, onFailed: _onFailed);
    _nameKeys = source.nameKeys;
  }

  final int maxCachedTiles;
  bool showLabels;
  late final TilePool _pool;
  final LabelEngine _labels;
  final Map<TileId, _Tile> _tiles = {};
  final Map<TileId, int> _failedAt = {};
  final ui.Paint _paint = ui.Paint()..isAntiAlias = true;
  final ui.Paint _strokePaint = ui.Paint()
    ..isAntiAlias = true
    ..style = ui.PaintingStyle.stroke
    ..strokeCap = ui.StrokeCap.round
    ..strokeJoin = ui.StrokeJoin.round;
  final VmapStats stats = VmapStats();
  late List<String> _nameKeys;
  VmapPalette _palette;
  int _frame = 0;
  int _lastPaintMicros = 0;
  bool _framePending = false;
  bool _disposed = false;
  final Stopwatch _clock = Stopwatch()..start();

  /// Markers the app draws above the map. Labels keep clear of each one, and
  /// a marker's own name is placed beside it ahead of every map label; when
  /// there is no room the name hides and the marker stays.
  set markers(List<VmapMarker> value) {
    final areas = <(double, double, double, double, double, double)>[];
    _markerLabels.clear();
    for (var i = 0; i < value.length; i++) {
      final m = value[i];
      final lat = m.latitude * math.pi / 180;
      final wx = (m.longitude + 180) / 360;
      final wy =
          (1 - math.log(math.tan(lat) + 1 / math.cos(lat)) / math.pi) / 2;
      areas.add((wx, wy, m.width, m.height, m.dx, m.dy));
      final label = m.label;
      if (label == null || label.isEmpty) continue;
      _markerLabels.add(
        LabelCandidate(
          'm|$i|$label',
          BuiltLabel(
            LabelKind.place,
            LabelClasses.marker,
            -1000 + i,
            label,
            0,
            0,
            null,
          ),
          wx,
          wy,
          0,
        ),
      );
    }
    _labels.obstacles = areas;
    notifyListeners();
  }

  final List<LabelCandidate> _markerLabels = [];

  VmapPalette get palette => _palette;
  set palette(VmapPalette value) {
    if (identical(value, _palette)) return;
    _palette = value;
    _labels.clear();
    notifyListeners();
  }

  set font(VmapLabelFont value) {
    _labels
      ..font = value
      ..clear();
    notifyListeners();
  }

  /// Feature properties tried in order for label text, for example
  /// `['name:en', 'name:latin', 'name']`.
  List<String> get nameKeys => _nameKeys;
  set nameKeys(List<String> value) {
    if (listEquals(value, _nameKeys)) return;
    _nameKeys = value;
    _labels.clear();
    for (final t in _tiles.values) {
      t.dispose();
    }
    _tiles.clear();
    notifyListeners();
  }

  Object? get sourceError => _pool.startError;

  void _onLoaded(TileId id, List<String> nameKeys, BuiltTile built) {
    if (_disposed || !listEquals(nameKeys, _nameKeys)) return;
    _tiles[id]?.dispose();
    _tiles[id] = _Tile(id, built)..usedFrame = _frame;
    _failedAt.remove(id);
    notifyListeners();
  }

  void _onFailed(TileId id, Object error) {
    _failedAt[id] = _clock.elapsedMilliseconds;
  }

  void _requestFrame() {
    if (_framePending || _disposed) return;
    _framePending = true;
    SchedulerBinding.instance.scheduleFrameCallback((_) {
      _framePending = false;
      if (!_disposed) notifyListeners();
    });
  }

  final List<_Draw> _ideal = [];
  final List<_Draw> _fallback = [];
  final Map<int, _Draw> _fallbackByKey = {};
  final List<TileId> _wanted = [];
  final List<(TileId, double)> _missing = [];

  void paint(ui.Canvas canvas, VmapCamera camera) {
    _frame++;
    final now = _clock.elapsedMicroseconds;
    final dt = _lastPaintMicros == 0
        ? 0.0
        : math.min(0.1, (now - _lastPaintMicros) / 1e6);
    _lastPaintMicros = now;

    final size = camera.size;
    canvas.drawRect(
      ui.Offset.zero & size,
      _paint..color = ui.Color(_palette.colors[Tone.background]),
    );

    final styleZoom = camera.zoom - 1;
    final tz = styleZoom.floor().clamp(0, _maxDataZoom);
    final tileSize = 256.0 * math.pow(2, camera.zoom - tz);
    final n = 1 << tz;
    final x0 = (camera.origin.dx / tileSize).floor();
    final x1 = ((camera.origin.dx + size.width) / tileSize).floor();
    final y0 = math.max(0, (camera.origin.dy / tileSize).floor());
    final y1 = math.min(
      n - 1,
      ((camera.origin.dy + size.height) / tileSize).floor(),
    );
    final centerX = (camera.origin.dx + size.width / 2) / tileSize - 0.5;
    final centerY = (camera.origin.dy + size.height / 2) / tileSize - 0.5;

    _ideal.clear();
    _fallback.clear();
    _fallbackByKey.clear();
    _missing.clear();
    _prepSpent = 0;
    _stale = false;
    var waiting = false;
    _zooming = (camera.zoom - _lastZoom).abs() > 0.002;
    _lastZoom = camera.zoom;
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        final id = TileId(tz, x % n, y);
        final left = x * tileSize - camera.origin.dx;
        final top = y * tileSize - camera.origin.dy;
        final tile = _tiles[id];
        if (tile != null) {
          tile.usedFrame = _frame;
          if (!tile.prepared) _prepare(tile, styleZoom, tileSize / tileExtent);
          if (tile.prepared) {
            _ideal.add(_Draw(tile, left, top, tileSize));
            continue;
          }
          waiting = true;
        } else {
          final dx = x - centerX;
          final dy = y - centerY;
          _missing.add((id, dx * dx + dy * dy));
        }
        _addFallback(id, x, y, left, top, tileSize, camera.origin);
      }
    }

    _updateWanted(tz, camera, size);

    if (!waiting) _prepareBackdrop(camera.zoom);
    var triangles = 0;
    for (final d in _fallback) {
      triangles += _drawTile(canvas, d, styleZoom);
    }
    for (final d in _ideal) {
      triangles += _drawTile(canvas, d, styleZoom);
    }

    var animating = false;
    final labelsStarted = _clock.elapsedMicroseconds;
    if (showLabels) {
      animating = _labels.paint(
        canvas,
        sources: [_markerLabels]
            .followedBy(_ideal.followedBy(_fallback).map((d) => d.tile.labels)),
        sourcesKey:
            Object.hashAll(
              _ideal
                  .followedBy(_fallback)
                  .map((d) => Object.hash(d.tile.id, d.tile.labels.length)),
            ) ^
            _markerLabels.length,
        palette: _palette,
        zoom: camera.zoom,
        origin: camera.origin,
        size: size,
        rotation: camera.rotation,
        devicePixelRatio: camera.devicePixelRatio,
        dt: dt,
        rasterBudgetMicros: math.max(300, _frameBudgetMicros - _prepSpent),
        zooming: _zooming,
      );
    }
    final finished = _clock.elapsedMicroseconds;
    stats
      ..frames += 1
      ..labelMicros += finished - labelsStarted
      ..paintMicros += finished - now;
    if (finished - labelsStarted > stats.maxLabelMicros) {
      stats.maxLabelMicros = finished - labelsStarted;
    }
    if (finished - now > stats.maxPaintMicros) {
      stats.maxPaintMicros = finished - now;
    }
    if (finished - now > 5000) {
      if (stats.slowPaints.length >= 300) stats.slowPaints.removeAt(0);
      stats.slowPaints.add(
        't=${now ~/ 1000} paint=${finished - now} prep=$_prepSpent place=${_labels.lastPlaceMicros} '
        'lraster=${_labels.lastRasterMicros} labels=${finished - labelsStarted} z=${camera.zoom.toStringAsFixed(2)} '
        'tiles=${_ideal.length}+${_fallback.length} cached=${_tiles.length}',
      );
    }
    if (finished - now > 4000) stats.paintsOver4ms++;
    if (finished - now > 8000) stats.paintsOver8ms++;
    if (_prepSpent > stats.maxPrepMicros) stats.maxPrepMicros = _prepSpent;
    if (_labels.lastPlaceMicros > stats.maxPlaceMicros) {
      stats.maxPlaceMicros = _labels.lastPlaceMicros;
    }
    if (_labels.lastRasterMicros > stats.maxLabelRasterMicros) {
      stats.maxLabelRasterMicros = _labels.lastRasterMicros;
    }
    stats.placeMicros += _labels.lastPlaceMicros;
    if (labelsStarted - now - _prepSpent > stats.maxDrawMicros) {
      stats.maxDrawMicros = labelsStarted - now - _prepSpent;
    }
    if (animating || waiting || _stale) {
      _requestFrame();
    } else {
      _lastPaintMicros = 0;
    }

    stats
      ..tilesDrawn = _ideal.length
      ..fallbackTiles = _fallback.length
      ..tilesCached = _tiles.length
      ..maxUnpackMicros = _pool.maxUnpackMicros
      ..labelStates = _labels.stateCount
      ..labelSprites = _labels.spriteCount
      ..tilesLoading = _missing.length
      ..drawCalls = triangles;
    _evict();
  }

  /// Covers a missing tile with the nearest loaded ancestor, or failing that
  /// with whichever of its children are loaded.
  void _addFallback(
    TileId id,
    int x,
    int y,
    double left,
    double top,
    double tileSize,
    ui.Offset origin,
  ) {
    var ancestor = id;
    for (var dz = 1; dz <= 6 && ancestor.z > 0; dz++) {
      ancestor = ancestor.parent;
      final tile = _tiles[ancestor];
      if (tile == null) continue;
      tile.usedFrame = _frame;
      if (!tile.prepared) continue;
      final ax = x >> dz;
      final ay = y >> dz;
      final key = (ancestor.z << 50) | ((ax & 0x1ffffff) << 25) | ay;
      final big = tileSize * (1 << dz);
      final draw = _fallbackByKey[key] ??= () {
        final d = _Draw(tile, ax * big - origin.dx, ay * big - origin.dy, big)
          ..clips = [];
        _fallback.add(d);
        return d;
      }();
      draw.clips!.add(ui.Rect.fromLTWH(left, top, tileSize, tileSize));
      return;
    }
    if (id.z >= _maxDataZoom) return;
    final half = tileSize / 2;
    for (var cy = 0; cy < 2; cy++) {
      for (var cx = 0; cx < 2; cx++) {
        final child = _tiles[TileId(id.z + 1, id.x * 2 + cx, id.y * 2 + cy)];
        if (child == null || !child.prepared) continue;
        child.usedFrame = _frame;
        _fallback.add(_Draw(child, left + cx * half, top + cy * half, half));
      }
    }
  }

  void _updateWanted(int tz, VmapCamera camera, ui.Size size) {
    _wanted.clear();
    final nowMs = _clock.elapsedMilliseconds;
    _missing.sort((a, b) => a.$2.compareTo(b.$2));
    for (final (id, _) in _missing) {
      final failed = _failedAt[id];
      if (failed != null && nowMs - failed < 3000) {
        _requestFrameLater();
        continue;
      }
      _wanted.add(id);
    }
    final bz = math.max(0, tz - 3);
    if (bz < tz) {
      final big = 256.0 * math.pow(2, camera.zoom - bz);
      final bn = 1 << bz;
      final bx0 = (camera.origin.dx / big).floor();
      final bx1 = ((camera.origin.dx + size.width) / big).floor();
      final by0 = math.max(0, (camera.origin.dy / big).floor());
      final by1 = math.min(
        bn - 1,
        ((camera.origin.dy + size.height) / big).floor(),
      );
      for (var y = by0; y <= by1; y++) {
        for (var x = bx0; x <= bx1; x++) {
          final id = TileId(bz, x % bn, y);
          final tile = _tiles[id];
          if (tile != null) {
            tile.usedFrame = _frame;
          } else if (!_wanted.contains(id)) {
            _wanted.add(id);
          }
        }
      }
    }
    _wantAhead(tz, camera, size);
    if (_wanted.isNotEmpty || _hadWanted) {
      _pool.want(List.of(_wanted), _nameKeys);
    }
    _hadWanted = _wanted.isNotEmpty;
  }

  bool _hadWanted = false;

  /// Keeps the level above the view alive and, past the middle of a zoom
  /// level, fetches the level below it, so crossing into the next level in
  /// either direction finds its tiles ready.
  void _wantAhead(int tz, VmapCamera camera, ui.Size size) {
    void cover(int z, {required bool fetch}) {
      final span = 256.0 * math.pow(2, camera.zoom - z);
      final n = 1 << z;
      final x0 = (camera.origin.dx / span).floor();
      final x1 = ((camera.origin.dx + size.width) / span).floor();
      final y0 = math.max(0, (camera.origin.dy / span).floor());
      final y1 = math.min(
        n - 1,
        ((camera.origin.dy + size.height) / span).floor(),
      );
      for (var y = y0; y <= y1; y++) {
        for (var x = x0; x <= x1; x++) {
          final id = TileId(z, x % n, y);
          final tile = _tiles[id];
          if (tile != null) {
            tile.usedFrame = _frame;
          } else if (fetch && !_wanted.contains(id)) {
            _wanted.add(id);
          }
        }
      }
    }

    if (tz > 0) cover(tz - 1, fetch: false);
    final styleZoom = camera.zoom - 1;
    if (tz < _maxDataZoom && styleZoom - tz > 0.55) cover(tz + 1, fetch: true);
  }

  bool _retryPending = false;

  void _requestFrameLater() {
    if (_retryPending || _disposed) return;
    _retryPending = true;
    Future<void>.delayed(const Duration(seconds: 3), () {
      _retryPending = false;
      if (!_disposed) notifyListeners();
    });
  }

  int _drawTile(ui.Canvas canvas, _Draw d, double styleZoom) {
    final scale = d.size / tileExtent;
    canvas.save();
    final clips = d.clips;
    if (clips == null) {
      canvas.clipRect(
        ui.Rect.fromLTWH(d.left, d.top, d.size, d.size),
        doAntiAlias: false,
      );
    } else if (clips.length == 1) {
      canvas.clipRect(clips.first, doAntiAlias: false);
    } else {
      final path = ui.Path();
      for (final r in clips) {
        path.addRect(r);
      }
      canvas.clipPath(path, doAntiAlias: false);
    }
    canvas
      ..translate(d.left, d.top)
      ..scale(scale);
    final groups = d.tile.groups;
    final colors = _palette.colors;
    var triangles = 0;
    for (var p = 0; p < passes.length; p++) {
      final pass = passes[p];
      final meshes = groups[pass.group];
      if (meshes == null ||
          styleZoom < pass.minZoom ||
          styleZoom > pass.maxZoom) {
        continue;
      }
      var color = colors[pass.tone];
      if (pass.fadeIn > 0) {
        final t = (styleZoom - pass.minZoom) / pass.fadeIn;
        if (t < 1) {
          color = (color & 0x00ffffff) | (((color >>> 24) * t).round() << 24);
        }
      }
      _paint.color = ui.Color(color);
      final width = pass.width;
      if (width == null) {
        for (final m in meshes) {
          canvas.drawVertices(m.fill!, ui.BlendMode.srcOver, _paint);
          triangles++;
        }
      } else {
        final halfWidth = width.at(styleZoom) / 2 / scale;
        for (final m in meshes) {
          final path = m.path;
          if (path != null) {
            _strokePaint
              ..color = _paint.color
              ..strokeWidth = halfWidth * 2;
            canvas.drawPath(path, _strokePaint);
          } else {
            canvas.drawVertices(
              _stroke(m, p, halfWidth),
              ui.BlendMode.srcOver,
              _paint,
            );
          }
          triangles++;
        }
      }
    }
    canvas.restore();
    return triangles;
  }

  /// UI-thread time a frame may spend preparing tiles and re-widening lines
  /// before the rest waits for the next frame.
  static const int _prepBudgetMicros = 1500;
  static const int _frameBudgetMicros = 2200;
  bool _zooming = false;
  double _lastZoom = 0;
  int _prepSpent = 0;
  bool _stale = false;

  void _prepare(_Tile tile, double styleZoom, double scale) {
    if (_prepSpent >= _prepBudgetMicros) return;
    final started = _clock.elapsedMicroseconds;
    tile.prepare(
      styleZoom,
      scale,
      _clock,
      started + _prepBudgetMicros - _prepSpent,
    );
    final spent = _clock.elapsedMicroseconds - started;
    _prepSpent += spent;
    stats.tileSetupMicros += spent;
    if (spent > stats.maxTileSetupMicros) stats.maxTileSetupMicros = spent;
  }

  void _prepareBackdrop(double zoom) {
    if (_prepSpent >= _prepBudgetMicros) return;
    for (final tile in _tiles.values) {
      if (tile.prepared) continue;
      _prepare(
        tile,
        zoom - 1,
        256.0 * math.pow(2, zoom - tile.id.z) / tileExtent,
      );
      _stale = true;
      return;
    }
  }

  /// The mesh widened for [pass]. A width a few percent off is kept when the
  /// frame's budget is spent, and corrected on a later frame.
  ui.Vertices _stroke(_Mesh mesh, int pass, double halfWidth) {
    final current = mesh.existing(pass);
    if (current != null) {
      final ratio = halfWidth / current.halfWidth;
      final exact = ratio > 0.96 && ratio < 1.04;
      if (exact) return current.vertices;
      final slack = _zooming ? 0.22 : 0;
      if ((ratio > 1 - slack && ratio < 1 + slack) ||
          _prepSpent >= _prepBudgetMicros) {
        _stale = true;
        return current.vertices;
      }
    }
    final started = _clock.elapsedMicroseconds;
    final vertices = mesh.build(pass, halfWidth);
    final spent = _clock.elapsedMicroseconds - started;
    _prepSpent += spent;
    stats
      ..strokeMicros += spent
      ..strokesBuilt += 1;
    return vertices;
  }

  void _evict() {
    if (_tiles.length <= maxCachedTiles) return;
    final stale = _tiles.values.where((t) => t.usedFrame != _frame).toList()
      ..sort((a, b) => a.usedFrame - b.usedFrame);
    for (final t in stale) {
      if (_tiles.length <= maxCachedTiles) break;
      _tiles.remove(t.id);
      t.dispose();
    }
  }

  @override
  void dispose() {
    _disposed = true;
    _pool.close();
    _labels.clear();
    for (final t in _tiles.values) {
      t.dispose();
    }
    _tiles.clear();
    super.dispose();
  }
}
