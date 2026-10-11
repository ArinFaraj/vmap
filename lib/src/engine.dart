import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_map/flutter_map.dart' show Marker;
import 'package:latlong2/latlong.dart' show LatLng;

import 'expr.dart';
import 'labels.dart';
import 'pins.dart';
import 'query.dart';
import 'layer.dart' show NamedMarker;
import 'raster.dart';
import 'sprites.dart';
import 'style.dart';
import 'tessellate.dart';
import 'tile_builder.dart';
import 'worker.dart';

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
  _Mesh.fill(MeshChunk chunk, this.props)
    : fill = ui.Vertices.raw(
        ui.VertexMode.triangles,
        chunk.positions,
        indices: chunk.indices,
      ),
      points = null,
      _base = null,
      _ext = null,
      _along = null,
      _indices = null;

  _Mesh.points(MeshChunk chunk, this.props)
    : fill = null,
      points = chunk.positions,
      _base = null,
      _ext = null,
      _along = null,
      _indices = null;

  _Mesh.line(MeshChunk chunk, this.props)
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
      _indices = chunk.indices;

  final ui.Vertices? fill;

  /// The centres of a circle layer's circles.
  final Float32List? points;

  /// What the features in the mesh have in common, for paint that reads it.
  final Map<String, Object?>? props;
  final Float32List? _along;
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
      textureCoordinates: _along,
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
  _Tile(this.id, BuiltTile built, this.sheet)
    : _built = built,
      groups = List.filled(sheet.buckets.length, null);

  final TileId id;
  final StyleSheet sheet;
  BuiltTile? _built;
  final List<List<_Mesh>?> groups;
  final List<LabelCandidate> labels = [];
  int usedFrame = 0;

  bool get prepared => _step < 0;

  /// 0 uploads the geometry, 1..layers widen one line layer each, then
  /// labels.
  int _step = 0;
  int _uploaded = 0;
  int _labelAt = 0;

  /// Uploads the geometry and widens every line to [widths], so the first
  /// frame that draws this tile has nothing left to compute. Works in steps
  /// and returns once [clock] passes [deadline]; call again to continue.
  void prepare(
    Float64List widths,
    double scale,
    Stopwatch clock,
    int deadline,
  ) {
    final built = _built!;
    if (_step == 0) {
      while (_uploaded < built.meshes.length) {
        if (_uploaded > 0 && clock.elapsedMicroseconds > deadline) return;
        final m = built.meshes[_uploaded++];
        (groups[m.bucket] ??= []).add(switch (sheet.buckets[m.bucket].kind) {
          BucketKind.line => _Mesh.line(m.chunk, m.props),
          BucketKind.circle => _Mesh.points(m.chunk, m.props),
          BucketKind.fill => _Mesh.fill(m.chunk, m.props),
        });
      }
      _step = 1;
      if (clock.elapsedMicroseconds > deadline) return;
    }
    while (_step <= sheet.layers.length) {
      final p = _step - 1;
      final layer = sheet.layers[p];
      final meshes = groups[layer.bucket];
      _step++;
      if (!layer.isLine ||
          layer.perFeature ||
          meshes == null ||
          widths[p] <= 0) {
        continue;
      }
      final halfWidth = widths[p] / 2 / scale;
      for (final m in meshes) {
        m.build(p, halfWidth);
      }
      if (clock.elapsedMicroseconds > deadline) return;
    }
    final span = 1 / (1 << id.z);
    final tx = id.x * span;
    final ty = id.y * span;
    while (_labelAt < built.labels.length) {
      final l = built.labels[_labelAt++];
      labels.add(LabelCandidate(l.key, l, tx, ty, span));
      if (_labelAt & 127 == 0 && clock.elapsedMicroseconds > deadline) return;
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

/// The tiles of one of the style's sources.
class _Source {
  _Source(this.def);

  final VectorSource def;
  late TilePool pool;
  final Map<TileId, _Tile> tiles = {};
  final Map<TileId, int> failedAt = {};
  final List<_Draw> ideal = [];
  final List<_Draw> fallback = [];
  final Map<int, _Draw> fallbackByKey = {};
  final List<TileId> wanted = [];
  final List<(TileId, double)> missing = [];
  bool hadWanted = false;
  int maxDataZoom = 14;

  void dispose() {
    pool.close();
    for (final t in tiles.values) {
      t.dispose();
    }
    tiles.clear();
  }
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
  int labelRasterMicros = 0;
  int labelsRasterized = 0;
  int labelStatesWalked = 0;
  int labelsResized = 0;
  int labelsEvicted = 0;
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
    this._style = VmapStyle.light,
    this.source = const TileSourceConfig(),
    VmapTextStyle text = const VmapTextStyle(),
    this.maxCachedTiles = 56,
    this.showLabels = true,
    VmapPins? pins,
    VmapOverlay? overlay,
  }) : _overlay = overlay,
       _labels = LabelEngine(text)..pins = pins {
    _loadStyle();
  }

  final TileSourceConfig source;
  final int maxCachedTiles;

  bool showLabels;
  StyleSheet? _sheet;
  final LabelEngine _labels;
  final List<_Source> _sources = [];
  final ui.Paint _paint = ui.Paint()..isAntiAlias = true;
  final ui.Paint _pointPaint = ui.Paint()
    ..isAntiAlias = true
    ..strokeCap = ui.StrokeCap.round;
  SpriteSheet? _sprites;
  String? _spriteUrl;
  final List<RasterTiles> _rasters = [];
  final Map<String, ui.Image> _dashImages = {};
  final Map<(PaintLayer, double, double), ui.ImageShader> _shaders = {};
  final Float64List _shaderMatrix = Float64List(16)
    ..[5] = 1
    ..[10] = 1
    ..[15] = 1;
  final VmapStats stats = VmapStats();
  final EvalContext _context = EvalContext();
  VmapStyle _style;
  Int32List _colors = Int32List(0);
  Float64List _widths = Float64List(0);
  int _frame = 0;
  int _lastPaintMicros = 0;
  bool _framePending = false;
  bool _disposed = false;
  final Stopwatch _clock = Stopwatch()..start();

  /// What went wrong loading the style or the tile source, if anything.
  Object? get error {
    if (_styleError != null) return _styleError;
    for (final s in _sources) {
      if (s.pool.startError != null) return s.pool.startError;
    }
    return null;
  }

  Object? _styleError;

  VmapStyle get style => _style;
  set style(VmapStyle value) {
    if (value == _style) return;
    _style = value;
    _loadStyle();
  }

  /// The style's background colour, once the style has loaded.
  ui.Color? get backgroundColor {
    final sheet = _sheet;
    if (sheet == null) return null;
    final color = Rgba.of(sheet.background(_context));
    return color == null ? null : ui.Color(color.toArgb());
  }

  File? _styleFile(String url) => source.cacheDirectory == null
      ? null
      : File(
          '${source.cacheDirectory}/style-${url.hashCode.toRadixString(36)}.json',
        );

  /// Uses the style right away when it is at hand. One named by address is
  /// drawn from the copy kept from the last run while the current one
  /// downloads.
  Future<void> _loadStyle() async {
    final wanted = _style;
    _styleError = null;
    final document = wanted.document;
    if (document != null) {
      _apply(document, wanted);
      return;
    }
    final url = wanted.url!;
    final file = _styleFile(url);
    String? remembered;
    try {
      if (file != null && file.existsSync()) {
        remembered = await file.readAsString();
        if (_disposed || wanted != _style) return;
        _apply(jsonDecode(remembered) as Map<String, Object?>, wanted);
      }
    } catch (_) {
      remembered = null;
    }
    final client = HttpClient()..userAgent = source.userAgent;
    try {
      final request = await client
          .getUrl(Uri.parse(url))
          .timeout(const Duration(seconds: 10));
      final response = await request.close().timeout(
        const Duration(seconds: 10),
      );
      if (response.statusCode != 200) {
        throw HttpException('HTTP ${response.statusCode}', uri: Uri.parse(url));
      }
      final body = await utf8.decodeStream(response);
      if (_disposed || wanted != _style || body == remembered) return;
      _apply(jsonDecode(body) as Map<String, Object?>, wanted);
      if (file != null) {
        await file.parent.create(recursive: true);
        await file.writeAsString(body);
      }
    } catch (e) {
      if (remembered == null && wanted == _style && !_disposed) {
        _styleError = e;
        notifyListeners();
      }
    } finally {
      client.close();
    }
  }

  Map<String, Object?>? _base;
  VmapOverlay? _overlay;

  /// Sources and layers of the app's own, drawn with the style.
  VmapOverlay? get overlay => _overlay;
  set overlay(VmapOverlay? value) {
    if (identical(value, _overlay)) return;
    _overlay = value;
    final base = _base;
    if (base != null) _apply(base, _style);
  }

  void _apply(Map<String, Object?> base, VmapStyle from) {
    _base = base;
    final document = _overlay?.applyTo(base) ?? base;
    final sheet = StyleSheet.compile(
      document,
      nameKeys: from.nameKeys,
      zoomOffset: from.zoomOffset,
    );
    final sameShape = _sheet != null && _sheet!.shape == sheet.shape;
    final rasterKey = [
      for (final r in sheet.rasters)
        '${r.tileJsonUrl}|${r.tiles}|${r.tileSize}',
    ].join('\n');
    final rasters = _sheet == null || rasterKey != _rasterKey;
    _rasterKey = rasterKey;
    _sheet = sheet;
    if (rasters) {
      for (final r in _rasters) {
        r.close();
      }
      _rasters
        ..clear()
        ..addAll([
          for (final layer in sheet.rasters)
            RasterTiles(
              layer,
              cacheDirectory: source.cacheDirectory,
              userAgent: source.userAgent,
              onLoaded: _requestFrame,
            ),
        ]);
    } else {
      for (var i = 0; i < _rasters.length; i++) {
        _rasters[i].layer = sheet.rasters[i];
      }
    }
    if (sheet.sprite != _spriteUrl) _loadSprites(sheet.sprite);
    _colors = Int32List(sheet.layers.length);
    _widths = Float64List(sheet.layers.length);
    _labels
      ..symbols = sheet.symbols
      ..zoomOffset = sheet.zoomOffset
      ..clear();
    final kept = <String, _Source>{
      if (sameShape)
        for (final s in _sources) s.def.signature: s,
    };
    final next = <_Source>[];
    for (var i = 0; i < sheet.sources.length; i++) {
      final def = sheet.sources[i];
      final reused = kept.remove(def.signature);
      if (reused != null) {
        next.add(reused);
        continue;
      }
      final made = _Source(def);
      made.pool = TilePool(
        source,
        style: document,
        nameKeys: from.nameKeys,
        sheet: sheet,
        source: i,
        onLoaded: (id, built) => _onLoaded(made, id, built),
        onFailed: (id, _) => made.failedAt[id] = _clock.elapsedMilliseconds,
      );
      next.add(made);
    }
    for (final s in _sources) {
      if (!next.contains(s)) s.dispose();
    }
    _sources
      ..clear()
      ..addAll(next);
    notifyListeners();
  }

  String? _rasterKey;

  Future<void> _loadSprites(String? url) async {
    _spriteUrl = url;
    _sprites?.dispose();
    _sprites = null;
    _labels.sheet = null;
    if (url == null) return;
    SpriteSheet? loaded;
    try {
      loaded = await SpriteSheet.load(
        url,
        cacheDirectory: source.cacheDirectory,
        userAgent: source.userAgent,
      );
    } catch (_) {}
    if (loaded == null) return;
    if (_disposed || url != _spriteUrl) {
      loaded.dispose();
      return;
    }
    _sprites = loaded;
    _labels.sheet = loaded;
    notifyListeners();
  }

  /// Markers the app draws above the map with a `MarkerLayer`. Map labels
  /// keep clear of each one, and a [NamedMarker]'s name is placed beside it
  /// ahead of every map label; when there is no room the name hides and the
  /// marker stays.
  set markers(List<Marker> value) {
    final areas = <(double, double, double, double, double, double)>[];
    _markerLabels.clear();
    for (var i = 0; i < value.length; i++) {
      final m = value[i];
      final lat = m.point.latitude * math.pi / 180;
      final wx = (m.point.longitude + 180) / 360;
      final wy =
          (1 - math.log(math.tan(lat) + 1 / math.cos(lat)) / math.pi) / 2;
      areas.add((
        wx,
        wy,
        m.width,
        m.height,
        (m.alignment?.x ?? 0) * m.width / 2,
        (m.alignment?.y ?? 0) * m.height / 2,
      ));
      final name = m is NamedMarker ? m.name : null;
      if (name == null || name.isEmpty) continue;
      _markerLabels.add(
        LabelCandidate(
          'm|$i|$name',
          BuiltLabel(-1, -1000000 + i, name, 0, 0, null),
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

  /// Pins drawn in place of the style's icons for places of interest. Null
  /// draws the style's own icons.
  VmapPins? get pins => _labels.pins;
  set pins(VmapPins? value) {
    if (identical(value, _labels.pins)) return;
    _labels.pins = value;
    notifyListeners();
  }

  set text(VmapTextStyle value) {
    if (value == _labels.text) return;
    _labels
      ..text = value
      ..clear();
    notifyListeners();
  }

  void _onLoaded(_Source from, TileId id, BuiltTile built) {
    if (_disposed || !_sources.contains(from)) return;
    from.tiles[id]?.dispose();
    from.tiles[id] = _Tile(id, built, _sheet!)..usedFrame = _frame;
    from.failedAt.remove(id);
    notifyListeners();
  }

  VmapCamera? _camera;

  /// What the map shows at [point]: the features the style draws within
  /// [radius] logical pixels of it, topmost first. It reads the tiles again
  /// off the UI thread, so it answers a moment later.
  Future<List<VmapFeature>> featuresAt(
    LatLng point, {
    double radius = 6,
  }) async {
    final camera = _camera;
    final sheet = _sheet;
    if (camera == null || sheet == null) return const [];
    final lat = point.latitude.clamp(-85.0511, 85.0511) * math.pi / 180;
    final wx = (point.longitude + 180) / 360;
    final wy = (1 - math.log(math.tan(lat) + 1 / math.cos(lat)) / math.pi) / 2;
    final styleZoom = camera.zoom - 1 + sheet.zoomOffset;
    final found = <(int, VmapFeature)>[];
    await Future.wait([
      for (final s in List.of(_sources))
        () async {
          final z = (camera.zoom - 1).floor().clamp(0, s.pool.maxZoom);
          final n = 1 << z;
          final x = (wx * n).floor().clamp(0, n - 1);
          final y = (wy * n).floor().clamp(0, n - 1);
          final unit = tileExtent / (256.0 * math.pow(2, camera.zoom - z));
          final hits = await s.pool.query(
            TileId(z, x, y),
            (wx * n - x) * tileExtent,
            (wy * n - y) * tileExtent,
            radius * unit,
            styleZoom,
          );
          for (final hit in hits) {
            final h = hit! as List<Object?>;
            found.add((
              h[0]! as int,
              VmapFeature(
                source: s.def.name,
                sourceLayer: h[1]! as String,
                geometryType: h[2]! as String,
                layers: (h[3]! as List).cast<String>(),
                properties: (h[4]! as Map).cast<String, Object?>(),
              ),
            ));
          }
        }(),
    ]);
    found.sort((a, b) => b.$1 - a.$1);
    return [for (final f in found) f.$2];
  }

  void _requestFrame() {
    if (_framePending || _disposed) return;
    _framePending = true;
    SchedulerBinding.instance.scheduleFrameCallback((_) {
      _framePending = false;
      if (!_disposed) notifyListeners();
    });
  }

  void paint(ui.Canvas canvas, VmapCamera camera) {
    _frame++;
    _camera = camera;
    final now = _clock.elapsedMicroseconds;
    final dt = _lastPaintMicros == 0
        ? 0.0
        : math.min(0.1, (now - _lastPaintMicros) / 1e6);
    _lastPaintMicros = now;

    final size = camera.size;
    final sheet = _sheet;
    if (sheet == null) return;
    final dataZoom = camera.zoom - 1;
    final styleZoom = dataZoom + sheet.zoomOffset;
    _context.zoom = styleZoom;
    final background = Rgba.of(sheet.background(_context));
    if (background != null) {
      canvas.drawRect(
        ui.Offset.zero & size,
        _paint..color = ui.Color(background.toArgb()),
      );
    }
    for (var i = 0; i < sheet.layers.length; i++) {
      final layer = sheet.layers[i];
      _colors[i] = 0;
      _widths[i] = 0;
      if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) continue;
      if (layer.perFeature) {
        _colors[i] = 0xFF000000;
        continue;
      }
      final color = Rgba.of(layer.color(_context));
      if (color == null) continue;
      _colors[i] = color.toArgb(asNumber(layer.opacity(_context)) ?? 1);
      if (layer.width != null) {
        _widths[i] = asNumber(layer.width!(_context)) ?? 0;
      }
    }
    for (final s in _shaders.values) {
      s.dispose();
    }
    _shaders.clear();

    _prepSpent = 0;
    _stale = false;
    var waiting = false;
    _zooming = (camera.zoom - _lastZoom).abs() > 0.002;
    _lastZoom = camera.zoom;
    for (final s in _sources) {
      if (_cover(s, camera, dataZoom)) waiting = true;
    }
    if (!waiting) _prepareBackdrop(camera.zoom);

    var draws = 0;
    for (final run in sheet.runs) {
      if (run.raster >= 0) {
        _rasters[run.raster].paint(
          canvas,
          _context,
          camera.zoom,
          camera.origin,
          size,
        );
        continue;
      }
      final s = _sources[run.source];
      for (final d in s.fallback) {
        draws += _drawTile(canvas, sheet, d, run.first, run.end);
      }
      for (final d in s.ideal) {
        draws += _drawTile(canvas, sheet, d, run.first, run.end);
      }
    }

    var animating = false;
    final labelsStarted = _clock.elapsedMicroseconds;
    if (showLabels) {
      final shown = [
        for (final s in _sources) ...[...s.ideal, ...s.fallback],
      ];
      animating = _labels.paint(
        canvas,
        sources: [_markerLabels].followedBy(shown.map((d) => d.tile.labels)),
        sourcesKey:
            Object.hashAll(
              shown.map(
                (d) =>
                    Object.hash(identityHashCode(d.tile), d.tile.labels.length),
              ),
            ) ^
            _markerLabels.length,
        background: background?.toArgb() ?? 0xFFFFFFFF,
        zoom: camera.zoom,
        origin: camera.origin,
        size: size,
        rotation: camera.rotation,
        devicePixelRatio: camera.devicePixelRatio,
        dt: dt,
        rasterBudgetMicros: _prepSpent > 1000 ? 1 : _labelBudgetMicros,
        zooming: _zooming,
      );
    }
    final finished = _clock.elapsedMicroseconds;
    var ideal = 0, fallback = 0, cached = 0, loading = 0, unpack = 0;
    for (final s in _sources) {
      ideal += s.ideal.length;
      fallback += s.fallback.length;
      cached += s.tiles.length;
      loading += s.missing.length;
      unpack = math.max(unpack, s.pool.maxUnpackMicros);
    }
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
        'tiles=$ideal+$fallback cached=$cached',
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
    stats
      ..labelRasterMicros += _labels.lastRasterMicros
      ..labelsRasterized = _labels.rasterizedTotal
      ..labelStatesWalked = _labels.statesWalked
      ..labelsResized = _labels.resizedTotal
      ..labelsEvicted = _labels.evictedTotal;
    if (labelsStarted - now - _prepSpent > stats.maxDrawMicros) {
      stats.maxDrawMicros = labelsStarted - now - _prepSpent;
    }
    if (animating || waiting || _stale) {
      _requestFrame();
    } else {
      _lastPaintMicros = 0;
    }

    stats
      ..tilesDrawn = ideal
      ..fallbackTiles = fallback
      ..tilesCached = cached
      ..maxUnpackMicros = unpack
      ..labelStates = _labels.stateCount
      ..labelSprites = _labels.spriteCount
      ..tilesLoading = loading
      ..drawCalls = draws;
    for (final s in _sources) {
      _evict(s);
    }
  }

  /// Works out which of the source's tiles cover the view, asks for the
  /// missing ones, and returns whether a tile is still being prepared.
  bool _cover(_Source s, VmapCamera camera, double dataZoom) {
    final size = camera.size;
    s.maxDataZoom = s.pool.maxZoom;
    final tz = dataZoom.floor().clamp(0, s.maxDataZoom);
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

    s.ideal.clear();
    s.fallback.clear();
    s.fallbackByKey.clear();
    s.missing.clear();
    var waiting = false;
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        final id = TileId(tz, x % n, y);
        final left = x * tileSize - camera.origin.dx;
        final top = y * tileSize - camera.origin.dy;
        final tile = s.tiles[id];
        if (tile != null) {
          tile.usedFrame = _frame;
          if (!tile.prepared) _prepare(tile, tileSize / tileExtent);
          if (tile.prepared) {
            s.ideal.add(_Draw(tile, left, top, tileSize));
            continue;
          }
          waiting = true;
        } else {
          final dx = x - centerX;
          final dy = y - centerY;
          s.missing.add((id, dx * dx + dy * dy));
        }
        _addFallback(s, id, x, y, left, top, tileSize, camera.origin);
      }
    }
    _updateWanted(s, tz, camera, size);
    return waiting;
  }

  /// Covers a missing tile with the nearest loaded ancestor, or failing that
  /// with whichever of its children are loaded.
  void _addFallback(
    _Source s,
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
      final tile = s.tiles[ancestor];
      if (tile == null) continue;
      tile.usedFrame = _frame;
      if (!tile.prepared) continue;
      final ax = x >> dz;
      final ay = y >> dz;
      final key = (ancestor.z << 50) | ((ax & 0x1ffffff) << 25) | ay;
      final big = tileSize * (1 << dz);
      final draw = s.fallbackByKey[key] ??= () {
        final d = _Draw(tile, ax * big - origin.dx, ay * big - origin.dy, big)
          ..clips = [];
        s.fallback.add(d);
        return d;
      }();
      draw.clips!.add(ui.Rect.fromLTWH(left, top, tileSize, tileSize));
      return;
    }
    if (id.z >= s.maxDataZoom) return;
    final half = tileSize / 2;
    for (var cy = 0; cy < 2; cy++) {
      for (var cx = 0; cx < 2; cx++) {
        final child = s.tiles[TileId(id.z + 1, id.x * 2 + cx, id.y * 2 + cy)];
        if (child == null || !child.prepared) continue;
        child.usedFrame = _frame;
        s.fallback.add(_Draw(child, left + cx * half, top + cy * half, half));
      }
    }
  }

  void _updateWanted(_Source s, int tz, VmapCamera camera, ui.Size size) {
    final wanted = s.wanted..clear();
    final nowMs = _clock.elapsedMilliseconds;
    s.missing.sort((a, b) => a.$2.compareTo(b.$2));
    for (final (id, _) in s.missing) {
      final failed = s.failedAt[id];
      if (failed != null && nowMs - failed < 3000) {
        _requestFrameLater();
        continue;
      }
      wanted.add(id);
    }
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
          final tile = s.tiles[id];
          if (tile != null) {
            tile.usedFrame = _frame;
          } else if (fetch && !wanted.contains(id)) {
            wanted.add(id);
          }
        }
      }
    }

    final bz = math.max(0, tz - 3);
    if (bz < tz) cover(bz, fetch: true);
    // The level above the view is kept alive and, past the middle of a zoom
    // level, the level below is fetched, so crossing into the next level in
    // either direction finds its tiles ready.
    if (tz > 0) cover(tz - 1, fetch: false);
    if (tz < s.maxDataZoom && camera.zoom - 1 - tz > 0.55) {
      cover(tz + 1, fetch: true);
    }
    if (wanted.isNotEmpty || s.hadWanted) {
      s.pool.want(List.of(wanted));
    }
    s.hadWanted = wanted.isNotEmpty;
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

  int _drawTile(
    ui.Canvas canvas,
    StyleSheet sheet,
    _Draw d,
    int first,
    int end,
  ) {
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
    final layers = sheet.layers;
    var draws = 0;
    for (var p = first; p < end; p++) {
      if (_colors[p] >>> 24 == 0) continue;
      final layer = layers[p];
      final meshes = groups[layer.bucket];
      if (meshes == null) continue;
      var color = _colors[p];
      var width = _widths[p];
      ui.ImageShader? shader;
      if (!layer.perFeature) {
        shader = _shaderFor(layer, width, scale);
        if (shader == null && (layer.pattern != null)) continue;
      }
      for (final m in meshes) {
        if (layer.perFeature) {
          _context.props = m.props ?? const {};
          final own = Rgba.of(layer.color(_context));
          if (own == null) continue;
          color = own.toArgb(asNumber(layer.opacity(_context)) ?? 1);
          if (color >>> 24 == 0) continue;
          if (layer.width != null) {
            width = asNumber(layer.width!(_context)) ?? 0;
          }
          shader = _shaderFor(layer, width, scale);
          if (shader == null && layer.pattern != null) continue;
        }
        switch (layer.kind) {
          case BucketKind.fill:
            _paint
              ..color = ui.Color(color)
              ..shader = shader;
            canvas.drawVertices(m.fill!, ui.BlendMode.srcOver, _paint);
          case BucketKind.line:
            if (width <= 0) continue;
            if (shader == null) {
              _paint.color = ui.Color(color);
            } else {
              _paint
                ..color = const ui.Color(0xFFFFFFFF)
                ..shader = shader
                ..colorFilter = ui.ColorFilter.mode(
                  ui.Color(color),
                  ui.BlendMode.srcIn,
                );
            }
            canvas.drawVertices(
              _stroke(m, p, width / 2 / scale),
              ui.BlendMode.srcOver,
              _paint,
            );
          case BucketKind.circle:
            if (width <= 0) continue;
            final ring = layer.strokeWidth == null
                ? 0.0
                : asNumber(layer.strokeWidth!(_context)) ?? 0;
            if (ring > 0) {
              final ringColor = Rgba.of(layer.strokeColor!(_context));
              if (ringColor != null) {
                _pointPaint
                  ..color = ui.Color(
                    ringColor.toArgb(
                      asNumber(layer.strokeOpacity!(_context)) ?? 1,
                    ),
                  )
                  ..strokeWidth = (width + ring * 2) / scale;
                canvas.drawRawPoints(
                  ui.PointMode.points,
                  m.points!,
                  _pointPaint,
                );
              }
            }
            _pointPaint
              ..color = ui.Color(color)
              ..strokeWidth = width / scale;
            canvas.drawRawPoints(ui.PointMode.points, m.points!, _pointPaint);
        }
        draws++;
        if (shader != null) {
          _paint
            ..shader = null
            ..colorFilter = null;
        }
      }
      if (layer.perFeature) _context.props = const {};
    }
    canvas.restore();
    return draws;
  }

  /// The repeating picture a layer is drawn through: its dashes, or the
  /// pattern that fills it. Null for a plain colour, and for a pattern whose
  /// sprite sheet has not loaded.
  ui.ImageShader? _shaderFor(PaintLayer layer, double width, double scale) {
    if (layer.dash == null && layer.pattern == null) return null;
    final key = (layer, width, scale);
    final made = _shaders[key];
    if (made != null) return made;
    final ui.Image image;
    final double stretch;
    final dash = layer.dash;
    if (dash != null) {
      if (width <= 0) return null;
      var total = 0.0;
      for (final d in dash) {
        total += d;
      }
      image = _dashImages[dash.join(',')] ??= _dashImage(dash, total);
      stretch = total * width / scale / image.width;
    } else {
      final sheet = _sprites;
      if (sheet == null) return null;
      final name = layer.pattern!(_context) as String;
      final found = sheet.pattern(name);
      if (found == null) return null;
      image = found;
      stretch = 1 / (sheet.entries[name]!.pixelRatio * scale);
    }
    _shaderMatrix
      ..[0] = stretch
      ..[5] = dash != null ? 1 : stretch;
    final shader = ui.ImageShader(
      image,
      ui.TileMode.repeated,
      dash != null ? ui.TileMode.clamp : ui.TileMode.repeated,
      _shaderMatrix,
      filterQuality: ui.FilterQuality.low,
    );
    return _shaders[key] = shader;
  }

  static const int _dashImageWidth = 256;

  /// One period of a dash pattern as a strip of white and clear.
  ui.Image _dashImage(Float64List dash, double total) {
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder);
    final paint = ui.Paint()..color = const ui.Color(0xFFFFFFFF);
    var at = 0.0;
    for (var i = 0; i < dash.length; i++) {
      final length = dash[i] / total * _dashImageWidth;
      if (i.isEven) {
        canvas.drawRect(ui.Rect.fromLTWH(at, 0, math.max(1, length), 2), paint);
      }
      at += length;
    }
    final picture = recorder.endRecording();
    final image = picture.toImageSync(_dashImageWidth, 2);
    picture.dispose();
    return image;
  }

  /// UI-thread time a frame may spend preparing tiles and re-widening lines
  /// before the rest waits for the next frame.
  static const int _prepBudgetMicros = 1500;
  static const int _labelBudgetMicros = 1000;
  bool _zooming = false;
  double _lastZoom = 0;
  int _prepSpent = 0;
  bool _stale = false;

  void _prepare(_Tile tile, double scale) {
    if (_prepSpent >= _prepBudgetMicros) return;
    final started = _clock.elapsedMicroseconds;
    tile.prepare(
      _widths,
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
    for (final s in _sources) {
      for (final tile in s.tiles.values) {
        if (tile.prepared) continue;
        _prepare(tile, 256.0 * math.pow(2, zoom - tile.id.z) / tileExtent);
        _stale = true;
        return;
      }
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

  void _evict(_Source s) {
    if (s.tiles.length <= maxCachedTiles) return;
    final stale = s.tiles.values.where((t) => t.usedFrame != _frame).toList()
      ..sort((a, b) => a.usedFrame - b.usedFrame);
    for (final t in stale) {
      if (s.tiles.length <= maxCachedTiles) break;
      s.tiles.remove(t.id);
      t.dispose();
    }
  }

  @override
  void dispose() {
    _disposed = true;
    for (final s in _sources) {
      s.dispose();
    }
    _sources.clear();
    _labels.clear();
    _sprites?.dispose();
    for (final r in _rasters) {
      r.close();
    }
    for (final s in _shaders.values) {
      s.dispose();
    }
    for (final i in _dashImages.values) {
      i.dispose();
    }
    super.dispose();
  }
}
