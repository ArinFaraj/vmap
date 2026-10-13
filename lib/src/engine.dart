import 'dart:convert';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_map/flutter_map.dart' show Marker;
import 'package:latlong2/latlong.dart' show LatLng;

import 'camera.dart';
import 'expr.dart';
import 'extrusion.dart';
import 'glyphs/glyph_layout.dart';
import 'glyphs/vmap_font.dart';
import 'label_state.dart';
import 'labels.dart';
import 'text_style.dart';
import 'pins.dart';
import 'query.dart';
import 'layer.dart' show NamedMarker;
import 'raster.dart';
import 'raster_style.dart';
import 'sprites.dart';
import 'mesh_painter.dart';
import 'offline.dart';
import 'source_config.dart';
import 'stats.dart';
import 'style.dart';
import 'style_model.dart';
import 'tile_builder.dart';
import 'tiles.dart';
import 'worker.dart';
import 'platform.dart';
import 'mercator.dart';
import 'protocol.dart';
import 'tile_id.dart';
import 'net.dart' show cacheKey;

/// Owns the tiles and labels and draws one frame of the map for a camera.
class VmapEngine extends ChangeNotifier {
  /// In a browser, the address of the script that builds tiles off the
  /// page's thread. vmap ships one and uses it without being asked. Set
  /// another before the first map is shown, or null to build tiles on the
  /// page's own thread; a script the browser refuses or that does not load
  /// is replaced by the page's thread too. Other platforms build tiles on isolates and ignore
  /// it.
  static String? webWorker = defaultWorkerScript;

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
    bool glyphText = false,
    List<VmapFont> fonts = const [],
  }) : _labels = LabelEngine(text)
         ..pins = pins
         ..curvedRoads = curvedLabels {
    _labels.stateOf = (source, id) => _states[_sources[source].def.name]?[id];
    if (glyphText) {
      _loadGlyphFonts(fonts).whenComplete(() {
        if (!_disposed) _loadStyle();
      });
    } else {
      _loadStyle();
    }
  }

  /// The fonts' bytes and families, sent to the tile workers so they
  /// shape labels.
  List<Uint8List>? _glyphFontBytes;
  List<String>? _glyphFamilies;

  /// The font labels are shaped with when the app gives none: Vazirmatn,
  /// one variable font with every weight, for Arabic script and Latin.
  static const defaultGlyphFont =
      'packages/vmap/assets/fonts/Vazirmatn-Variable.ttf';

  Future<void> _loadGlyphFonts(List<VmapFont> given) async {
    try {
      final all = [
        ...given,
        VmapFont(
          'Vazirmatn',
          (await rootBundle.load(defaultGlyphFont)).buffer.asUint8List(),
        ),
      ];
      if (_disposed) return;
      final faces = [for (final f in all) f.bytes];
      final families = [for (final f in all) f.family];
      _glyphFontBytes = faces;
      _glyphFamilies = families;
      _labels.useGlyphs(GlyphFonts(faces, families: families));
      notifyListeners();
    } catch (e) {
      onError?.call(e);
    }
  }

  final TileSourceConfig source;
  final int maxCachedTiles;

  bool showLabels;
  StyleSheet? _sheet;
  final LabelEngine _labels;
  final List<TileSource> _sources = [];
  SpriteSheet? _sprites;
  String? _spriteUrl;
  final List<RasterDrawing<RasterLayer>> _rasters = [];
  final VmapStats stats = VmapStats();
  final EvalContext _context = EvalContext();
  BuildingRenderer _buildings = ExtrusionPainter();
  int _buildingMicros = 0;

  /// What draws buildings standing on a tilted map: the canvas unless set.
  set buildingRenderer(BuildingRenderer value) {
    _buildings.dispose();
    _buildings = value;
    notifyListeners();
  }

  VmapStyle _style;
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
    return downloadTiles(
      pools: [for (final s in _sources) s.pool],
      rasters: _rasters.whereType<TileDrawing>(),
      west: west,
      south: south,
      east: east,
      north: north,
      minZoom: minZoom,
      maxZoom: maxZoom,
      onProgress: onProgress,
      cancelled: cancelled,
    );
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
            RasterDrawing.of(
              layer,
              config: source,
              onLoaded: _requestFrame,
              onError: (e) => onError?.call(e),
            ),
        ]);
    } else {
      for (var i = 0; i < _rasters.length; i++) {
        _rasters[i].restyle(sheet.rasters[i]);
      }
    }
    if (sheet.sprite != _spriteUrl) _loadSprites(sheet.sprite);
    _meshes.resize(sheet.layers.length);
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
        script: webWorker,
        fonts: _glyphFontBytes,
        families: _glyphFamilies,
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
    _sprites = _meshes.sprites = _labels.sheet = null;
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
    _sprites = _meshes.sprites = _labels.sheet = loaded;
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
      _markerLabels.add(MarkerName(i, name, wx, wy));
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
    _labels.curvedRoads = value;
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
          TileRange at(int z) =>
              TileRange(z, west, north, east, south, tileSpan: 1 / (1 << z));
          var range = at(tileZoomAt(camera.zoom, s.pool.maxZoom));
          while (range.z > 0 && range.count > _maxQueryTiles) {
            range = at(range.z - 1);
          }
          final TileRange(:z, :n, :x0, :x1, :y0, :y1) = range;
          final asked = <Future<void>>[];
          for (var y = y0; y <= y1; y++) {
            for (var x = x0; x <= x1; x++) {
              if (x < 0 || x >= n) continue;
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

  static List<VmapClusterMember> _members(List<ClusterMember>? found) => [
    for (final member in found ?? const <ClusterMember>[])
      VmapClusterMember(
        latitude: latitudeAt(member.y),
        longitude: longitudeAt(member.x),
        id: member.properties[r'$id'],
        properties: {
          for (final e in member.properties.entries)
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
    final background = _meshes.drawBackground(canvas, sheet, camera);
    _meshes.startFrame(
      sheet,
      styleZoom,
      camera.rotation,
      standing: camera.view != null && sheet.extrusions.isNotEmpty,
    );
    _budget.start(zooming: (camera.zoom - _lastZoom).abs() > 0.002);
    var waiting = false;
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
    final view = camera.view;
    if (view != null) {
      canvas
        ..save()
        ..transform(
          view.matrix(originX: camera.origin.dx, originY: camera.origin.dy),
        );
    }
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
      draws += _meshes.drawRun(
        canvas,
        sheet,
        run,
        s.fallback.followedBy(s.ideal),
        _states[s.def.name],
        size,
      );
    }

    if (view != null) {
      canvas.restore();
      if (sheet.extrusions.isNotEmpty) {
        final buildingsStarted = _clock.elapsedMicroseconds;
        final more = _buildings.paint(
          canvas,
          view,
          camera.origin,
          sheet,
          [for (final s in _sources) ...s.ideal],
          _context,
          styleZoom,
          camera.devicePixelRatio,
        );
        _buildingMicros = _clock.elapsedMicroseconds - buildingsStarted;
        if (more) waiting = true;
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
        rasterBudgetMicros: _budget.spent > 1000 ? 1 : _labelBudgetMicros,
        zooming: _budget.zooming,
        view: view,
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
    final timings = stats.timings
      ..frame(
        paint: finished - now,
        labels: finished - labelsStarted,
        place: _labels.lastPlaceMicros,
        raster: _labels.lastRasterMicros,
        prep: _budget.spent,
        draw: labelsStarted - now - _budget.spent,
        unpack: unpack,
        describe: () =>
            't=${now ~/ 1000} paint=${finished - now} prep=${_budget.spent} '
            'place=${_labels.lastPlaceMicros} '
            'lraster=${_labels.lastRasterMicros} '
            'labels=${finished - labelsStarted} '
            'glyphs=${_labels.glyphsRasterized}/${_labels.glyphRasterMicros} '
            'pages=${_labels.glyphPageCount} '
            'buildings=$_buildingMicros '
            'z=${camera.zoom.toStringAsFixed(2)} '
            'tiles=$ideal+$fallback cached=$cached',
      );
    timings.labels.take(_labels.work);
    if (animating || waiting || _budget.stale) {
      _requestFrame();
    } else {
      _lastPaintMicros = 0;
    }

    stats
      ..tilesDrawn = ideal
      ..fallbackTiles = fallback
      ..tilesCached = cached
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

  static const int _labelBudgetMicros = 1000;
  double _lastZoom = 0;
  final FrameBudget _budget = FrameBudget();
  late final MeshPainter _meshes = MeshPainter(_budget, stats, _context);

  void _prepare(LoadedTile tile, double scale) {
    if (_budget.spentUp) return;
    final started = _clock.elapsedMicroseconds;
    tile.prepare(
      _meshes.widths,
      scale,
      _clock,
      started + FrameBudget.micros - _budget.spent,
    );
    final spent = _clock.elapsedMicroseconds - started;
    _budget.spent += spent;
    stats.timings.tileSetup(spent);
  }

  void _prepareBackdrop(double zoom) {
    if (_budget.spentUp) return;
    for (final s in _sources) {
      for (final tile in s.tiles.values) {
        if (tile.prepared) continue;
        _prepare(tile, 256.0 * math.pow(2, zoom - tile.id.z) / tileExtent);
        _budget.stale = true;
        return;
      }
    }
  }

  @override
  void dispose() {
    _disposed = true;
    for (final s in _sources) {
      s.dispose();
    }
    _sources.clear();
    _labels
      ..clear()
      ..disposeGlyphs();
    _buildings.dispose();
    _sprites?.dispose();
    _meshes.dispose();
    for (final r in _rasters) {
      r.close();
    }
    super.dispose();
  }
}
