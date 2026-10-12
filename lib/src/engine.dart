import 'dart:convert';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_map/flutter_map.dart' show Marker;
import 'package:latlong2/latlong.dart' show LatLng;

import 'camera.dart';
import 'cluster.dart' show ClusterPoint;
import 'expr.dart';
import 'heat.dart';
import 'labels.dart';
import 'pins.dart';
import 'query.dart';
import 'layer.dart' show NamedMarker;
import 'raster.dart';
import 'shaders.dart';
import 'sprites.dart';
import 'style.dart';
import 'tile_builder.dart';
import 'tiles.dart';
import 'worker.dart';
import 'platform.dart';
import 'mercator.dart';
import 'net.dart' show cacheKey;

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
  int labelLayoutMicros = 0;
  int labelImageMicros = 0;
  int labelImages = 0;
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
    labelRasterMicros = labelsRasterized = labelLayoutMicros =
        labelImageMicros = labelImages = labelStatesWalked = labelsResized =
            labelsEvicted = maxUnpackMicros = 0;
    slowPaints.clear();
  }
}

/// Owns the tiles and labels and draws one frame of the map for a camera.
class VmapEngine extends ChangeNotifier {
  /// In a browser, the address of the script that builds tiles off the
  /// page's thread: `'vmap_worker.js'` once `dart run vmap:build_web_worker`
  /// has written it into the app's `web` folder. Set it before the first
  /// map is shown. Null, or a script that does not load, builds tiles on
  /// the page's own thread, which costs frames while new tiles come in.
  /// Other platforms build tiles on isolates and ignore it.
  static String? get webWorker => workerScript;
  static set webWorker(String? script) => workerScript = script;

  VmapEngine({
    this._style = VmapStyle.light,
    this.source = const TileSourceConfig(),
    VmapTextStyle text = const VmapTextStyle(),
    this.maxCachedTiles = 56,
    this.showLabels = true,
    VmapPins? pins,
    this._overlay,
    this._edits = const [],
    bool curvedLabels = true,
  }) : _labels = LabelEngine(text)
         ..pins = pins
         ..curvedRoads = curvedLabels {
    _labels.stateOf = (source, id) => _states[_sources[source].def.name]?[id];
    _loadStyle();
  }

  final TileSourceConfig source;
  final int maxCachedTiles;

  bool showLabels;
  StyleSheet? _sheet;
  final LabelEngine _labels;
  final List<TileSource> _sources = [];
  final ui.Paint _paint = ui.Paint()..isAntiAlias = true;
  final ui.Paint _pointPaint = ui.Paint()
    ..isAntiAlias = true
    ..strokeCap = ui.StrokeCap.round;
  SpriteSheet? _sprites;
  String? _spriteUrl;
  final List<RasterTiles> _rasters = [];
  final LayerShaders _shaders = LayerShaders();
  final HeatPainter _heat = HeatPainter();
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

  /// Told of every style, tile or sprite that could not be loaded. The map
  /// keeps trying on its own; this is for the app to log or show.
  void Function(Object error)? onError;

  /// Loads the style and every tile again, from the cache where it has them.
  void reload() {
    for (final s in _sources) {
      s.dispose();
    }
    _sources.clear();
    for (final r in _rasters) {
      r.close();
    }
    _rasters.clear();
    _labels.clear();
    _sheet = null;
    _rasterKey = null;
    _spriteUrl = null;
    _loadStyle();
  }

  static final _kept = RegExp('^(style|sprite|raster|source|tiles)-');

  /// Deletes what this map keeps in the cache directory, then loads it again
  /// from the network. Other files in the directory are left alone.
  Future<void> clearCache() async {
    final directory = source.cacheDirectory;
    if (directory != null) {
      await deleteCached(directory, _kept.hasMatch);
    }
    if (!_disposed) reload();
  }

  /// Fetches into the cache directory every tile the style draws between
  /// [west], [south], [east] and [north] at map zooms [minZoom] to
  /// [maxZoom], so that part of the map shows without a network. Call it
  /// once the style has loaded. [onProgress] is told how many tiles are
  /// dealt with out of how many, and the download stops early once
  /// [cancelled] answers true.
  ///
  /// The number of tiles grows fourfold with each zoom: check
  /// [VmapDownload.tiles] of a small range before asking for a large one,
  /// and the terms of the tile server before downloading in bulk.
  Future<VmapDownload> downloadRegion({
    required double west,
    required double south,
    required double east,
    required double north,
    required double minZoom,
    required double maxZoom,
    void Function(int done, int total)? onProgress,
    bool Function()? cancelled,
  }) async {
    if (!hasFiles || source.cacheDirectory == null) {
      throw StateError('A region is downloaded into a cache directory');
    }
    final jobs = <Future<bool> Function()>[];
    void cover(int from, int to, void Function(int z, int x, int y) add) {
      for (var z = from; z <= to; z++) {
        for (var y = tileRow(north, z); y <= tileRow(south, z); y++) {
          for (var x = tileColumn(west, z); x <= tileColumn(east, z); x++) {
            add(z, x, y);
          }
        }
      }
    }

    for (final s in _sources) {
      final pool = s.pool;
      int at(double zoom) => tileZoomAt(zoom, pool.maxZoom);
      cover(
        at(minZoom),
        at(maxZoom),
        (z, x, y) => jobs.add(() => pool.keep(TileId(z, x, y))),
      );
    }
    for (final r in _rasters) {
      cover(
        r.tileZoom(minZoom),
        r.tileZoom(maxZoom),
        (z, x, y) => jobs.add(() => r.keep(z, x, y)),
      );
    }
    var next = 0, done = 0, fetched = 0, failed = 0;
    Future<void> lane() async {
      while (next < jobs.length && !(cancelled?.call() ?? false)) {
        final job = jobs[next++];
        try {
          if (await job()) fetched++;
        } catch (_) {
          failed++;
        }
        onProgress?.call(++done, jobs.length);
      }
    }

    await Future.wait([for (var i = 0; i < 6; i++) lane()]);
    return VmapDownload(tiles: jobs.length, fetched: fetched, failed: failed);
  }

  VmapStyle get style => _style;
  set style(VmapStyle value) {
    if (value == _style) return;
    _style = value;
    _loadStyle();
  }

  /// The credit the style's sources ask for, once the style has loaded.
  List<String> get attributions => _sheet?.attributions ?? const [];

  /// The style's background colour, once the style has loaded.
  ui.Color? get backgroundColor {
    final sheet = _sheet;
    if (sheet == null) return null;
    final color = Rgba.of(sheet.background(_context));
    return color == null ? null : ui.Color(color.toArgb());
  }

  String? _styleFile(String url) => source.cacheDirectory == null
      ? null
      : '${source.cacheDirectory}/style-${cacheKey(url)}.json';

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
      if (file != null && fileExists(file)) {
        remembered = utf8.decode(await readFile(file));
        if (_disposed || wanted != _style) return;
        _apply(jsonDecode(remembered) as Map<String, Object?>, wanted);
      }
    } catch (_) {
      remembered = null;
    }
    final client = Net(userAgent: source.userAgent);
    try {
      final reply = await client.get(
        url,
        source.headers,
        timeout: const Duration(seconds: 10),
      );
      if (reply.status != 200) throw HttpFailure(reply.status, url);
      final body = utf8.decode(reply.bytes);
      if (_disposed || wanted != _style || body == remembered) return;
      _apply(jsonDecode(body) as Map<String, Object?>, wanted);
      if (file != null) await writeFile(file, reply.bytes);
    } catch (e) {
      if (wanted == _style && !_disposed) onError?.call(e);
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
    final sameLayers =
        value != null &&
        jsonEncode(value.layers) == jsonEncode(_overlay?.layers);
    _overlay = value;
    final base = _base;
    if (base != null) _apply(base, _style, keepLabels: sameLayers);
  }

  List<VmapStyleEdit> _edits;

  /// Changes made to single layers of the style, on top of what it says.
  List<VmapStyleEdit> get edits => _edits;
  set edits(List<VmapStyleEdit> value) {
    if (VmapStyleEdit.same(value, _edits)) return;
    final base = _base;
    if (base == null) {
      _edits = value;
      return;
    }
    final document = _overlay?.applyTo(base) ?? base;
    String symbols(List<VmapStyleEdit> edits) => jsonEncode([
      for (final layer
          in VmapStyleEdit.applyAll(edits, document)['layers']! as List)
        if (layer case {'type': 'symbol'}) layer,
    ]);
    final sameSymbols = symbols(value) == symbols(_edits);
    _edits = value;
    _apply(base, _style, keepLabels: sameSymbols);
  }

  void _apply(
    Map<String, Object?> base,
    VmapStyle from, {
    bool keepLabels = false,
  }) {
    _base = base;
    final document = VmapStyleEdit.applyAll(
      _edits,
      _overlay?.applyTo(base) ?? base,
    );
    final sheet = StyleSheet.compile(
      document,
      nameKeys: from.nameKeys,
      zoomOffset: from.zoomOffset,
    );
    final sameShape = _sheet != null && _sheet!.shape == sheet.shape;
    final rasterKey = [for (final r in sheet.rasters) r.signature].join('\n');
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
              headers: source.headers,
              onLoaded: _requestFrame,
              onError: (e) => onError?.call(e),
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
      ..zoomOffset = sheet.zoomOffset;
    if (!keepLabels || !sameShape) _labels.clear();
    final byName = <String, TileSource>{
      if (sameShape)
        for (final s in _sources) s.def.name: s,
    };
    final kept = <String, TileSource>{
      if (sameShape)
        for (final s in _sources) s.def.signature: s,
    };
    final next = <TileSource>[];
    for (var i = 0; i < sheet.sources.length; i++) {
      final def = sheet.sources[i];
      final reused = kept.remove(def.signature);
      if (reused != null) {
        next.add(reused);
        continue;
      }
      final made = TileSource(def);
      made.pool = TilePool(
        source,
        style: document,
        nameKeys: from.nameKeys,
        sheet: sheet,
        source: i,
        onLoaded: (id, built) => _onLoaded(made, id, built),
        onFailed: (id, error) {
          made.failedAt[id] = _clock.elapsedMilliseconds;
          onError?.call(error);
        },
      );
      final before = byName[def.name];
      if (before != null) {
        made.previous
          ..addAll(before.previous)
          ..addAll(before.tiles);
        before.previous.clear();
        before.tiles.clear();
      }
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
        headers: source.headers,
      );
    } catch (e) {
      onError?.call(e);
    }
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
      final wx = worldX(m.point.longitude);
      final wy = worldY(m.point.latitude);
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
      _markerLabels.add(LabelCandidate.marker(i, name, wx, wy));
    }
    _labels.obstacles = areas;
    notifyListeners();
  }

  final List<LabelCandidate> _markerLabels = [];

  final Map<String, Map<Object, Map<String, Object?>>> _states = {};

  /// State given to single features, read by the style's paint properties
  /// with `['feature-state', name]`. Changing it repaints and rebuilds
  /// nothing.
  set featureStates(List<VmapFeatureState> value) {
    if (value.isEmpty && _states.isEmpty) return;
    _states.clear();
    for (final s in value) {
      final id = s.id;
      if (id == null) continue;
      (_states[s.source] ??= {})[id] = s.state;
    }
    _labels.restyle();
    notifyListeners();
  }

  /// Pins drawn in place of the style's icons for places of interest. Null
  /// draws the style's own icons.
  VmapPins? get pins => _labels.pins;
  set pins(VmapPins? value) {
    if (identical(value, _labels.pins)) return;
    _labels.pins = value;
    notifyListeners();
  }

  /// Road names follow bends. Off, a name is written only where its road is
  /// straight enough, which is a little cheaper to draw.
  bool get curvedLabels => _labels.curvedRoads;
  set curvedLabels(bool value) {
    if (value == _labels.curvedRoads) return;
    _labels
      ..curvedRoads = value
      ..clear();
    notifyListeners();
  }

  /// Draws every label again. Call it when a font has finished loading: a
  /// label drawn before that keeps the boxes it was drawn with.
  void fontsChanged() {
    _labels.clear();
    notifyListeners();
  }

  set text(VmapTextStyle value) {
    if (value == _labels.text) return;
    _labels
      ..text = value
      ..clear();
    notifyListeners();
  }

  void _onLoaded(TileSource from, TileId id, BuiltTile built) {
    if (_disposed || !_sources.contains(from)) return;
    from.tiles[id]?.dispose();
    from.tiles[id] = LoadedTile(id, built, _sheet!)..usedFrame = _frame;
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
    final wx = worldX(point.longitude);
    final wy = worldY(point.latitude);
    final styleZoom = camera.zoom - 1 + sheet.zoomOffset;
    final found = <(int, VmapFeature)>[];
    await Future.wait([
      for (final s in List.of(_sources))
        () async {
          final z = tileZoomAt(camera.zoom, s.pool.maxZoom);
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
            found.add(_feature(s.def.name, hit));
          }
        }(),
    ]);
    found.sort((a, b) => b.$1 - a.$1);
    return [for (final f in found) f.$2];
  }

  static (int, VmapFeature) _feature(String source, TileHit hit) => (
    hit.order,
    VmapFeature(
      source: source,
      sourceLayer: hit.sourceLayer,
      geometryType: hit.geometryType,
      layers: hit.layers,
      id: hit.properties[r'$id'],
      properties: {
        for (final e in hit.properties.entries)
          if (e.key != r'$id') e.key: e.value,
      },
    ),
  );

  /// What the map shows between [southWest] and [northEast]: the features
  /// the style draws that touch the box, topmost first. It reads the tiles
  /// again off the UI thread, so it answers a moment later.
  ///
  /// A feature with an id comes once. One without, lying over the edge of a
  /// tile, comes once for each tile it is in. A
  /// box much larger than the screen is read from shallower tiles, which
  /// carry less.
  Future<List<VmapFeature>> featuresIn(
    LatLng southWest,
    LatLng northEast,
  ) async {
    final camera = _camera;
    final sheet = _sheet;
    if (camera == null || sheet == null) return const [];
    final west = worldX(southWest.longitude);
    final east = worldX(northEast.longitude);
    final north = worldY(northEast.latitude);
    final south = worldY(southWest.latitude);
    if (east < west || south < north) return const [];
    final styleZoom = camera.zoom - 1 + sheet.zoomOffset;
    final found = <String, (int, VmapFeature)>{};
    await Future.wait([
      for (final s in List.of(_sources))
        () async {
          var z = tileZoomAt(camera.zoom, s.pool.maxZoom);
          int tiles(int z) {
            final n = 1 << z;
            return ((east * n).floor() - (west * n).floor() + 1) *
                ((south * n).floor() - (north * n).floor() + 1);
          }

          while (z > 0 && tiles(z) > _maxQueryTiles) {
            z--;
          }
          final n = 1 << z;
          final asked = <Future<void>>[];
          for (var y = (north * n).floor(); y <= (south * n).floor(); y++) {
            for (var x = (west * n).floor(); x <= (east * n).floor(); x++) {
              if (x < 0 || y < 0 || x >= n || y >= n) continue;
              asked.add(() async {
                final hits = await s.pool.query(
                  TileId(z, x, y),
                  ((west + east) / 2 * n - x) * tileExtent,
                  ((north + south) / 2 * n - y) * tileExtent,
                  0,
                  styleZoom,
                  box: (
                    (east - west) / 2 * n * tileExtent,
                    (south - north) / 2 * n * tileExtent,
                  ),
                );
                for (final hit in hits) {
                  final (order, feature) = _feature(s.def.name, hit);
                  // A feature lying over a tile edge is in both tiles, and
                  // only an id tells its two halves from two features.
                  final key = feature.id == null
                      ? '${found.length}'
                      : '${feature.source}|${feature.sourceLayer}|${feature.id}';
                  final before = found[key];
                  if (before == null || before.$1 < order) {
                    found[key] = (order, feature);
                  }
                }
              }());
            }
          }
          await Future.wait(asked);
        }(),
    ]);
    final sorted = found.values.toList()..sort((a, b) => b.$1 - a.$1);
    return [for (final f in sorted) f.$2];
  }

  static const int _maxQueryTiles = 16;

  TilePool? _clustered(String source) {
    for (final s in _sources) {
      if (s.def case GeoJsonSource(:final name, cluster: _?)
          when name == source) {
        return s.pool;
      }
    }
    return null;
  }

  /// The map zoom at which cluster [clusterId] of the clustered GeoJSON
  /// source named [source] comes apart, for zooming in on a tapped cluster.
  /// Null when there is no such cluster.
  Future<double?> clusterExpansionZoom(String source, int clusterId) async {
    final zoom = await _clustered(source)?.clusterZoom(clusterId);
    return zoom == null ? null : zoom + 1.0;
  }

  /// What cluster [clusterId] comes apart into at its expansion zoom.
  Future<List<VmapClusterMember>> clusterChildren(
    String source,
    int clusterId,
  ) async => _members(
    await _clustered(source)
        ?.clusterMembers(ClusterQuestion.children, clusterId),
  );

  /// The points of the data inside cluster [clusterId], [limit] of them
  /// starting at [offset].
  Future<List<VmapClusterMember>> clusterLeaves(
    String source,
    int clusterId, {
    int limit = 10,
    int offset = 0,
  }) async => _members(
    await _clustered(source)?.clusterMembers(
      ClusterQuestion.leaves,
      clusterId,
      limit: limit,
      offset: offset,
    ),
  );

  static List<VmapClusterMember> _members(List<ClusterPoint>? found) => [
    for (final member in found ?? const <ClusterPoint>[])
      VmapClusterMember(
        latitude: latitudeAt(member.y),
        longitude: longitudeAt(member.x),
        id: member.props[r'$id'],
        properties: {
          for (final e in member.props.entries)
            if (e.key != r'$id') e.key: e.value,
        },
      ),
  ];

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
    if (sheet.backgroundPattern?.call(_context) case final String name) {
      final shader = _shaders.backdrop(name, _sprites, camera.origin);
      if (shader != null) {
        final opacity = asNumber(sheet.backgroundOpacity(_context)) ?? 1;
        canvas.drawRect(
          ui.Offset.zero & size,
          _paint
            ..color = ui.Color.fromRGBO(255, 255, 255, opacity.clamp(0, 1))
            ..shader = shader,
        );
        _paint.shader = null;
      }
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
      if (layer.width case final width?) {
        _widths[i] = asNumber(width(_context)) ?? 0;
      }
    }
    _shaders.startFrame();

    _prepSpent = 0;
    _stale = false;
    var waiting = false;
    _zooming = (camera.zoom - _lastZoom).abs() > 0.002;
    _lastZoom = camera.zoom;
    for (final s in _sources) {
      final preparing = s.cover(
        camera,
        dataZoom,
        frame: _frame,
        nowMs: _clock.elapsedMilliseconds,
        prepare: _prepare,
      );
      if (preparing) waiting = true;
      if (s.retrying) _requestFrameLater();
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
      final states = _states[s.def.name];
      final heat = switch (sheet.layers[run.first]) {
        HeatmapLayer(:final heat) => heat,
        _ => null,
      };
      final shown = _colors[run.first] >>> 24;
      if (heat != null && (shown == 0 || _widths[run.first] <= 0)) continue;
      final onto = heat == null ? canvas : _heat.begin();
      for (final d in s.fallback) {
        draws += _drawTile(onto, sheet, d, run.first, run.end, states);
      }
      for (final d in s.ideal) {
        draws += _drawTile(onto, sheet, d, run.first, run.end, states);
      }
      if (heat != null) _heat.end(canvas, size, _context, heat, shown / 255);
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
      unpack = math.max(unpack, s.pool.takeMaxUnpackMicros());
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
      ..labelsRasterized += _labels.rasterizedTotal
      ..labelLayoutMicros += _labels.layoutMicrosTotal
      ..labelImageMicros += _labels.imageMicrosTotal
      ..labelImages += _labels.imagesTotal
      ..labelStatesWalked += _labels.statesWalked
      ..labelsResized += _labels.resizedTotal
      ..labelsEvicted += _labels.evictedTotal;
    _labels.clearTotals();
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
      ..maxUnpackMicros = math.max(stats.maxUnpackMicros, unpack)
      ..labelStates = _labels.stateCount
      ..labelSprites = _labels.spriteCount
      ..tilesLoading = loading
      ..drawCalls = draws;
    for (final s in _sources) {
      s.evict(maxCachedTiles, _frame);
    }
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
    TileDraw d,
    int first,
    int end,
    Map<Object, Map<String, Object?>>? states,
  ) {
    final scale = d.size / tileExtent;
    void enter({bool clip = true}) {
      canvas.save();
      final clips = d.clips;
      if (!clip) {
      } else if (clips == null) {
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
    }

    final layers = sheet.layers;
    // A tile standing in for part of another keeps its clip, or its circles
    // would show beside those of the tiles around it.
    enter(
      clip:
          !layers[first].spills ||
          (d.clips != null && layers[first] is! HeatmapLayer),
    );
    final groups = d.tile.groups;
    var draws = 0;
    for (var p = first; p < end; p++) {
      if (_colors[p] >>> 24 == 0) continue;
      final layer = layers[p];
      final meshes = groups[layer.bucket];
      if (meshes == null) continue;
      var color = _colors[p];
      var width = _widths[p];
      if (layer case HeatmapLayer(:final heat)) {
        _heat.add(canvas, _context, heat, meshes, width / scale);
        draws++;
        continue;
      }
      ui.ImageShader? shader;
      if (!layer.perFeature) {
        shader = _shaders.of(layer, width, scale, _context, _sprites, color);
        if (shader == null && (layer.pattern != null)) continue;
      }
      final moved = layer.translate?.call(_context);
      final shifted = moved is List && moved.length == 2;
      if (shifted) {
        var mx = (asNumber(moved[0]) ?? 0) / scale;
        var my = (asNumber(moved[1]) ?? 0) / scale;
        final turn = layer.translateOnScreen ? -(_camera?.rotation ?? 0) : 0.0;
        if (turn != 0) {
          final cos = math.cos(turn), sin = math.sin(turn);
          (mx, my) = (mx * cos - my * sin, mx * sin + my * cos);
        }
        canvas
          ..save()
          ..translate(mx, my);
      }
      for (final m in meshes) {
        if (layer.perFeature) {
          _context
            ..props = m.props ?? const {}
            ..state = states?[m.props?[r'$id']] ?? const {};
          final own = Rgba.of(layer.color(_context));
          if (own == null) continue;
          color = own.toArgb(asNumber(layer.opacity(_context)) ?? 1);
          if (color >>> 24 == 0) continue;
          if (layer.width case final own?) {
            width = asNumber(own(_context)) ?? 0;
          }
          shader = _shaders.of(layer, width, scale, _context, _sprites, color);
          if (shader == null && layer.pattern != null) continue;
        }
        switch (layer) {
          case FillLayer():
            _paint
              ..color = ui.Color(color)
              ..shader = shader;
            canvas.drawVertices(m.fill!, ui.BlendMode.srcOver, _paint);
          case LineLayer():
            if (width <= 0) continue;
            if (shader == null) {
              _paint.color = ui.Color(color);
            } else if (layer.pattern != null) {
              _paint
                ..color = ui.Color(color)
                ..shader = shader;
            } else {
              _paint
                ..color = ui.Color(color | 0xFFFFFF)
                ..shader = shader;
            }
            canvas.drawVertices(
              _stroke(
                m,
                p,
                width / 2 / scale,
                (asNumber(layer.offset?.call(_context)) ?? 0) / scale,
              ),
              ui.BlendMode.srcOver,
              _paint,
            );
          case CircleLayer(:final ring):
            if (width <= 0) continue;
            final ringWidth = ring == null
                ? 0.0
                : asNumber(ring.width(_context)) ?? 0;
            if (ring != null && ringWidth > 0) {
              final ringColor = Rgba.of(ring.color(_context));
              if (ringColor != null) {
                _pointPaint
                  ..color = ui.Color(
                    ringColor.toArgb(asNumber(ring.opacity(_context)) ?? 1),
                  )
                  ..strokeWidth = (width + ringWidth * 2) / scale;
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
          case HeatmapLayer():
            continue;
        }
        draws++;
        if (shader != null) {
          _paint
            ..shader = null
            ..colorFilter = null;
        }
      }
      if (layer.perFeature) {
        _context
          ..props = const {}
          ..state = const {};
      }
      if (shifted) canvas.restore();
    }
    canvas.restore();
    return draws;
  }

  /// UI-thread time a frame may spend preparing tiles and re-widening lines
  /// before the rest waits for the next frame.
  static const int _prepBudgetMicros = 1500;
  static const int _labelBudgetMicros = 1000;
  bool _zooming = false;
  double _lastZoom = 0;
  int _prepSpent = 0;
  bool _stale = false;

  void _prepare(LoadedTile tile, double scale) {
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
  ui.Vertices _stroke(
    TileMesh mesh,
    int pass,
    double halfWidth,
    double offset,
  ) {
    final current = mesh.existing(pass);
    if (current != null) {
      final ratio = halfWidth / current.halfWidth;
      final moved = (offset - current.offset).abs() / halfWidth;
      if (ratio > 0.96 && ratio < 1.04 && moved < 0.08) return current.vertices;
      final slack = _zooming ? 0.22 : 0;
      if ((ratio > 1 - slack && ratio < 1 + slack && moved < slack * 2) ||
          _prepSpent >= _prepBudgetMicros) {
        _stale = true;
        return current.vertices;
      }
    }
    final started = _clock.elapsedMicroseconds;
    final vertices = mesh.build(pass, halfWidth, offset);
    final spent = _clock.elapsedMicroseconds - started;
    _prepSpent += spent;
    stats
      ..strokeMicros += spent
      ..strokesBuilt += 1;
    return vertices;
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
    _heat.dispose();
    _shaders.dispose();
    for (final r in _rasters) {
      r.close();
    }
    super.dispose();
  }
}
