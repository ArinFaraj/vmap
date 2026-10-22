import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:latlong2/latlong.dart' show LatLng;

import 'canvas/atmosphere.dart';
import 'canvas/canvas_map.dart';
import 'camera/camera.dart';
import 'errors.dart';
import 'gpu/gpu_map.dart';
import 'camera/bounds.dart';
import 'camera/map_camera.dart';
import 'style/expr.dart';
import 'tiles/feature_queries.dart';
import 'gpu/map_renderer.dart';
import 'labels/glyphs/vmap_font.dart';
import 'labels/label_state.dart';
import 'labels/labels.dart';
import 'labels/text_style.dart';
import 'style/pins.dart';
import 'tiles/query.dart';
import 'widget/marker.dart';
import 'canvas/raster.dart';
import 'style/raster_style.dart';
import 'style/style_resources.dart';
import 'terrain/raised_ground.dart';
import 'camera/view.dart' show MapView;
import 'canvas/mesh_painter.dart';
import 'tiles/offline.dart';
import 'options.dart';
import 'stats.dart';
import 'style/style.dart';
import 'style/transitions.dart';
import 'style/style_model.dart';
import 'tiles/tile_builder.dart';
import 'tiles/tiles.dart';
import 'tiles/worker.dart';
import 'canvas/zoom_history.dart';
import 'platform.dart';
import 'camera/mercator.dart';
import 'tiles/tile_id.dart';
import 'tiles/net.dart' show cacheKey;

/// Owns the tiles and labels and draws one frame of the map for a camera.
class VmapEngine extends ChangeNotifier {
  /// In a browser, tiles are built by a web worker vmap ships, off the
  /// page's thread. Call this before the first map to use another worker
  /// script, or with null to build tiles on the page's own thread. A worker
  /// the browser refuses, or that does not load, falls back to the page's
  /// thread by itself. Other platforms build tiles on isolates and ignore
  /// it.
  static void useWebWorker(String? script) => _webWorker = script;

  static String? _webWorker = defaultWorkerScript;

  /// An engine for an app to own and give to [Vmap.engine], with the
  /// settings [Vmap] takes.
  VmapEngine({
    this._style = VmapStyle.light,
    this.network = const VmapNetworkOptions(),
    this.rendering = const VmapRenderOptions(),
    VmapLabelOptions labels = const VmapLabelOptions(),
    VmapTextStyle text = const VmapTextStyle(),
    List<VmapFont> fonts = const [],
    VmapPins? pins,
    this._overlay,
    this._edits = const [],
    @visibleForTesting MapRenderer? debugRenderer,
  }) : _labelOptions = labels,
       _labels = LabelEngine(text)
         ..pins = pins
         ..curvedRoads = labels.curved
         ..crossSourceCollisions = labels.crossSourceCollisions,
       _renderer =
           debugRenderer ??
           (rendering.renderer == VmapRenderer.gpu
               ? GpuMap.create(multisample: rendering.antialias)
               : null) {
    _labels.stateOf = (source, id) =>
        _states[_sources[source].def.name]?[featureStateKey(id)];
    if (rendering.renderer == VmapRenderer.gpu && _renderer == null) {
      scheduleMicrotask(() => _gpuFailed(_gpuOff));
    }
    _renderer?.onFailure = _gpuFailed;
    _fontsLoaded = _resources.loadFonts(fonts, shapeInWorkers: !_styleGlyphs);
    _loadStyle();
  }

  /// The fonts the tile workers and labels start with. The style is
  /// fetched meanwhile and applied once they are in.
  late final Future<void> _fontsLoaded;

  /// How the map is drawn, fixed when the engine is made.
  final VmapRenderOptions rendering;

  bool get _styleGlyphs => rendering.glyphs == VmapGlyphs.style;

  VmapLabelOptions _labelOptions;

  /// Which labels the map writes and how they are placed.
  VmapLabelOptions get labels => _labelOptions;
  set labels(VmapLabelOptions value) {
    if (value == _labelOptions) return;
    final collisions =
        value.crossSourceCollisions != _labelOptions.crossSourceCollisions;
    _labelOptions = value;
    _labels
      ..curvedRoads = value.curved
      ..crossSourceCollisions = value.crossSourceCollisions;
    if (collisions) _labels.restyle();
    notifyListeners();
  }

  /// Draws the vector layers and buildings on the GPU, or null where the
  /// canvas draws them. Fixed when the engine is made, since the tile
  /// workers build its streams.
  final MapRenderer? _renderer;

  /// What draws the map now. [VmapRenderer.gpu] is asked for by default and
  /// used where Flutter GPU runs; elsewhere, or after the GPU failed, the
  /// canvas draws, and [onError] was told why with a
  /// [VmapErrorKind.gpu] error.
  VmapRenderer get drawingWith =>
      _onGpu ? VmapRenderer.gpu : VmapRenderer.canvas;

  static const _gpuOff =
      'Flutter GPU is off, so the map is drawn with the canvas. Switch it on '
      'with io.flutter.embedding.android.EnableFlutterGPU in the Android '
      'manifest, FLTEnableFlutterGPU in the iOS and macOS Info.plist, '
      'set_enable_flutter_gpu in the Windows and Linux runners, or '
      '--enable-flutter-gpu for one run.';

  static bool _gpuReported = false;

  void _gpuFailed(Object error) {
    if (_disposed) return;
    final report = VmapError(VmapErrorKind.gpu, error);
    if (!_gpuReported) {
      _gpuReported = true;
      assert(() {
        debugPrint('vmap: $report');
        return true;
      }());
    }
    onError?.call(report);
    notifyListeners();
  }

  late final StyleResources _resources = StyleResources(
    _labels,
    network,
    onSprites: (sheet) => _meshes.sprites = _labels.sheet = sheet,
    onChange: () {
      if (!_disposed) notifyListeners();
    },
    onError: (e) => onError?.call(e),
  );

  void _report(VmapErrorKind kind, Object error) =>
      onError?.call(error is VmapError ? error : VmapError(kind, error));

  final _zoomOutHold = ZoomOutHold();

  /// How the map fetches what it loads, fixed when the engine is made.
  final VmapNetworkOptions network;

  StyleSheet? _sheet;
  final LabelEngine _labels;

  /// The map labels as last placed, for tools that compare placement: see
  /// [LabelEngine.debugLabels].
  List<Map<String, Object?>> debugLabels() {
    final sheet = _sheet;
    return sheet == null ? const [] : _labels.debugLabels(sheet);
  }

  /// The collision boxes the last label placement took, in screen pixels.
  List<double> debugBoxes() => _labels.debugBoxes;

  final List<TileSource> _sources = [];
  final List<RasterDrawing<RasterLayer>> _rasters = [];
  final VmapStats stats = VmapStats();
  final EvalContext _context = EvalContext();
  int _buildingMicros = 0;

  VmapStyle _style;
  int _frame = 0;
  int _lastPaintMicros = 0;
  bool _framePending = false;
  bool _disposed = false;
  final Stopwatch _clock = Stopwatch()..start();

  /// Whether the style draws the map as a globe at some zoom.
  bool get drawsGlobe => _sheet?.projection.isGlobe ?? false;

  /// What keeps the map from showing, if anything: a style that could not
  /// be loaded, or a source whose tiles cannot be read at all.
  VmapError? get error {
    if (_styleError != null) return _styleError;
    for (final s in _sources) {
      if (s.pool.startError case final e?) {
        return VmapError(VmapErrorKind.tiles, e);
      }
    }
    return null;
  }

  VmapError? _styleError;

  /// Told of everything that could not be loaded or drawn: the style, a
  /// tile, the sprite sheet, fonts, or the GPU. The map keeps trying where
  /// trying again can help; this is for the app to log or show.
  void Function(VmapError error)? onError;

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
    _resources.forgetSprites();
    _loadStyle();
  }

  static final _kept = RegExp('^(style|sprite|raster|source|tiles)-');

  /// Deletes what this map keeps in the cache directory, then loads it again
  /// from the network. Other files in the directory are left alone.
  Future<void> clearCache() async {
    final directory = network.cacheDirectory;
    if (directory != null) {
      await deleteCached(directory, _kept.hasMatch);
    }
    if (!_disposed) reload();
  }

  /// Fetches into the cache directory every tile the style draws inside
  /// [bounds] at zooms [minZoom] to [maxZoom], so that part of the map
  /// shows without a network. Call it once the style has loaded.
  /// [onProgress] is told how many tiles are dealt with out of how many,
  /// and the download stops early once [cancelled] answers true.
  ///
  /// The number of tiles grows fourfold with each zoom: check
  /// [VmapDownload.tiles] of a small range before asking for a large one,
  /// and the terms of the tile server before downloading in bulk.
  Future<VmapDownload> downloadRegion(
    VmapBounds bounds, {
    required double minZoom,
    required double maxZoom,
    void Function(int done, int total)? onProgress,
    bool Function()? cancelled,
  }) async {
    if (!hasFiles || network.cacheDirectory == null) {
      throw StateError('A region is downloaded into a cache directory');
    }
    return downloadTiles(
      pools: [for (final s in _sources) s.pool],
      rasters: _rasters.whereType<TileDrawing>(),
      west: bounds.southWest.longitude,
      south: bounds.southWest.latitude,
      east: bounds.northEast.longitude,
      north: bounds.northEast.latitude,
      minZoom: minZoom + 1,
      maxZoom: maxZoom + 1,
      onProgress: onProgress,
      cancelled: cancelled,
    );
  }

  /// The style drawn; setting it loads the new one.
  VmapStyle get style => _style;
  set style(VmapStyle value) {
    if (value == _style) return;
    _style = value;
    _loadStyle();
  }

  /// The credit the style's sources ask for, from the style and from
  /// their TileJSON, once each has been read.
  List<String> get attributions => {
    ...?_sheet?.attributions,
    for (final s in _sources) ?s.pool.attribution,
    for (final r in _rasters.whereType<TileDrawing>()) ?r.attribution,
  }.toList();

  /// Whether the style has loaded and compiled.
  bool get styleLoaded => _sheet != null;

  /// The style's background colour, once the style has loaded.
  ui.Color? get backgroundColor {
    final sheet = _sheet;
    if (sheet == null) return null;
    final color = Rgba.of(sheet.background(_context));
    return color == null ? null : ui.Color(color.toArgb());
  }

  String? _styleFile(String url) => network.cacheDirectory == null
      ? null
      : '${network.cacheDirectory}/style-${cacheKey(url)}.json';

  /// Uses the style right away when it is at hand. One named by address is
  /// drawn from the copy kept from the last run while the current one
  /// downloads.
  Future<void> _loadStyle() async {
    final wanted = _style;
    _styleError = null;
    final document = wanted.document;
    if (document != null) {
      await _fontsLoaded;
      if (_disposed || wanted != _style) return;
      _apply(document, wanted);
      return;
    }
    final url = wanted.url!;
    final file = _styleFile(url);
    String? remembered;
    try {
      if (file != null && fileExists(file)) {
        remembered = utf8.decode(await readFile(file));
        await _fontsLoaded;
        if (_disposed || wanted != _style) return;
        _apply(jsonDecode(remembered) as Map<String, Object?>, wanted);
      }
    } catch (_) {
      remembered = null;
    }
    final client = Net(userAgent: network.userAgent);
    try {
      final reply = await client.get(
        url,
        network.headers,
        timeout: const Duration(seconds: 10),
      );
      if (reply.status != 200) throw HttpFailure(reply.status, url);
      final body = utf8.decode(reply.bytes);
      await _fontsLoaded;
      if (_disposed || wanted != _style || body == remembered) return;
      _apply(jsonDecode(body) as Map<String, Object?>, wanted);
      if (file != null) await writeFile(file, reply.bytes);
    } catch (e) {
      final error = VmapError(VmapErrorKind.style, e, url: url);
      if (wanted == _style && !_disposed) onError?.call(error);
      if (remembered == null && wanted == _style && !_disposed) {
        _styleError = error;
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
    if (value == _overlay) return;
    final sameLayers =
        value != null &&
        jsonEncode(value.layers) == jsonEncode(_overlay?.layers);
    _overlay = value;
    _resources.useImages(value?.images ?? const {});
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
    // A change of paint keeps the labels where they are.
    String symbols(List<VmapStyleEdit> edits) => jsonEncode([
      for (final layer
          in VmapStyleEdit.applyAll(edits, document)['layers']! as List)
        if (layer case {'type': 'symbol'})
          {
            for (final e in layer.entries)
              if (e.key != 'paint') e.key: e.value,
          },
    ]);
    final sameSymbols = symbols(value) == symbols(_edits);
    _edits = value;
    _apply(base, _style, keepLabels: sameSymbols);
  }

  final PaintTransitions _transitions = PaintTransitions();

  void _apply(
    Map<String, Object?> base,
    VmapStyle from, {
    bool keepLabels = false,
  }) {
    base = derefLayers(base);
    _base = base;
    final document = _transitions.apply(
      VmapStyleEdit.applyAll(_edits, _overlay?.applyTo(base) ?? base),
      _clock.elapsedMilliseconds.toDouble(),
    );
    final sheet = StyleSheet.compile(
      document,
      nameKeys: from.nameKeys,
      zoomOffset: from.zoomOffset,
    );
    _resources.useGlyphRanges(_styleGlyphs ? sheet.glyphs : null);
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
              config: network,
              onLoaded: _requestFrame,
              onError: (e) => _report(VmapErrorKind.tiles, e),
            ),
        ]);
    } else {
      for (var i = 0; i < _rasters.length; i++) {
        _rasters[i].restyle(sheet.rasters[i]);
      }
    }
    _ground.use(sheet.terrain);
    _resources.useSprites(sheet.spriteSheets);
    _meshes.resize(sheet.layers.length);
    _labels
      ..symbols = sheet.symbols
      ..zoomOffset = sheet.zoomOffset;
    if (!keepLabels || !sameShape) {
      _labels.clear();
    } else {
      _labels.redraw();
    }
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
        network,
        style: document,
        nameKeys: from.nameKeys,
        sheet: sheet,
        source: i,
        onLoaded: (id, built) => _onLoaded(made, id, built),
        onRelabeled: (id, built) => _onRelabeled(made, id, built),
        onFailed: (id, error) {
          made.fail(
            id,
            _clock.elapsedMilliseconds,
            corrupt: '$error'.startsWith('FormatException'),
          );
          _report(VmapErrorKind.tiles, error);
        },
        script: _webWorker,
        shared: _resources.shared.fetch,
        fonts: _resources.fontBytes,
        families: _resources.families,
        gpu: _renderer != null,
      );
      if (sheet.stateBuiltSources.contains(i) && _states[def.name] != null) {
        made.pool.useStates(_statePairs(def.name));
      }
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

  late final RaisedGround _ground = RaisedGround(
    network,
    onLoaded: _requestFrame,
    onError: (e) => _report(VmapErrorKind.tiles, e),
  );

  /// Over raised ground, the height in metres the map's middle stands at,
  /// as MapLibre's center elevation with centerClampedToGround off; null
  /// keeps it on the ground under it.
  double? get centerElevation => _ground.centerElevation;
  set centerElevation(double? value) {
    if (value == _ground.centerElevation) return;
    _ground.centerElevation = value;
    _requestFrame();
  }

  /// Markers the app draws above the map. Map labels keep clear of each
  /// one, and a marker's name is placed beside it ahead of every map label;
  /// when there is no room the name hides and the marker stays.
  List<VmapMarker> get markers => _markers;
  List<VmapMarker> _markers = const [];
  set markers(List<VmapMarker> value) {
    _markers = value;
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
      final name = m.name;
      if (name == null || name.isEmpty) continue;
      _markerLabels.add(MarkerName(i, name, wx, wy));
    }
    _labels.obstacles = areas;
    notifyListeners();
  }

  final List<LabelCandidate> _markerLabels = [];

  final Map<String, Map<Object, Map<String, Object?>>> _states = {};

  /// State given to single features, read by the style's paint properties
  /// with `['feature-state', name]`. Changing it repaints, and builds again
  /// only the tiles of a source whose buildings' height, base or colour
  /// read it.
  List<VmapFeatureState> get featureStates => _featureStates;
  List<VmapFeatureState> _featureStates = const [];
  set featureStates(List<VmapFeatureState> value) {
    if (listEquals(value, _featureStates)) return;
    _featureStates = value;
    if (value.isEmpty && _states.isEmpty) return;
    final before = Map.of(_states);
    _states.clear();
    for (final s in value) {
      final id = s.id;
      if (id == null) continue;
      (_states[s.source] ??= {})[featureStateKey(id)] = s.state;
    }
    for (final i in _sheet?.stateBuiltSources ?? const <int>{}) {
      final source = _sources[i];
      final name = source.def.name;
      if (_sameStates(before[name], _states[name])) continue;
      source.pool.useStates(_statePairs(name));
      for (final MapEntry(:key, :value) in source.tiles.entries) {
        source.previous.remove(key)?.dispose();
        source.previous[key] = value;
      }
      source.tiles.clear();
    }
    _labels.restyle();
    notifyListeners();
  }

  List<(Object?, Map<String, Object?>)> _statePairs(String source) => [
    for (final MapEntry(:key, :value) in _states[source]?.entries ?? const [])
      (key, value),
  ];

  static bool _sameStates(
    Map<Object, Map<String, Object?>>? a,
    Map<Object, Map<String, Object?>>? b,
  ) {
    if ((a?.length ?? 0) != (b?.length ?? 0)) return false;
    for (final MapEntry(:key, :value) in a?.entries ?? const []) {
      final other = b![key];
      if (other == null || other.length != value.length) return false;
      for (final MapEntry(key: name, value: v) in value.entries) {
        if (other[name] != v || !other.containsKey(name)) return false;
      }
    }
    return true;
  }

  /// Pins drawn in place of the style's icons for places of interest. Null
  /// draws the style's own icons.
  VmapPins? get pins => _labels.pins;
  set pins(VmapPins? value) {
    if (identical(value, _labels.pins)) return;
    _labels.pins = value;
    notifyListeners();
  }

  /// Saves [canvas] and turns it so the unrolled picture of [view] lands
  /// where its [MapView.roll] puts it.
  static void _unroll(ui.Canvas canvas, MapView view) {
    canvas.save();
    if (view.roll == 0) return;
    final (:x, :y) = view.screenCenter;
    canvas
      ..translate(x, y)
      ..rotate(-view.roll * math.pi / 180)
      ..translate(-x, -y);
  }

  /// Clips [canvas] to the ground below [horizon] in the unrolled picture.
  static void _clipGround(ui.Canvas canvas, MapView view, double horizon) {
    final b = view.unrolledBounds;
    if (view.roll == 0) {
      canvas.clipRect(ui.Rect.fromLTRB(b.left, horizon, b.right, b.bottom));
      return;
    }
    final corners = [
      view.rolled(b.left, horizon),
      view.rolled(b.right, horizon),
      view.rolled(b.right, b.bottom),
      view.rolled(b.left, b.bottom),
    ];
    canvas.clipPath(
      ui.Path()
        ..addPolygon([for (final c in corners) ui.Offset(c.x, c.y)], true),
    );
  }

  /// Draws the collision box of every label weighed for placement, as
  /// MapLibre's `showCollisionBoxes`: blue where it was placed, red where
  /// it ran into another.
  bool get showCollisionBoxes => _labels.showCollisionBoxes;
  set showCollisionBoxes(bool value) {
    if (value == _labels.showCollisionBoxes) return;
    _labels.showCollisionBoxes = value;
    notifyListeners();
  }

  /// Lets go of what is not on screen: tiles out of view, label images not
  /// drawn, and the renderer's memory for them. Call it when the system is
  /// short of memory; what comes back into view is loaded again.
  void trimMemory() {
    for (final s in _sources) {
      s.evict(0, _frame);
    }
    _labels.trimMemory();
    _renderer?.trimMemory();
  }

  /// Draws every label again. Call it when a font has finished loading: a
  /// label drawn before that keeps the boxes it was drawn with.
  void fontsChanged() {
    _labels.clear();
    notifyListeners();
  }

  /// The fonts of labels, their scale, and the look of markers' names.
  VmapTextStyle get text => _labels.text;
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
    from.failed.remove(id);
    notifyListeners();
  }

  void _onRelabeled(TileSource from, TileId id, BuiltTile built) {
    if (_disposed || !_sources.contains(from)) return;
    final tile = from.tiles[id];
    if (tile == null) return;
    tile.replaceLabels(built.labels);
    notifyListeners();
  }

  MapFrame? _camera;

  late final FeatureQueries _queries = FeatureQueries(
    () => _sources,
    () => _camera,
    () => _sheet,
  );

  /// What the map shows at [point]: the features the style draws within
  /// [radius] logical pixels of it, topmost first. It reads the tiles again
  /// off the UI thread, so it answers a moment later.
  Future<List<VmapFeature>> featuresAt(LatLng point, {double radius = 6}) =>
      _queries.featuresAt(point, radius: radius);

  /// What the map shows between [southWest] and [northEast]: the features
  /// the style draws that touch the box, topmost first. It reads the tiles
  /// again off the UI thread, so it answers a moment later.
  ///
  /// A feature with an id comes once. One without, lying over the edge of a
  /// tile, comes once for each tile it is in. A box much larger than the
  /// screen is read from shallower tiles, which carry less.
  Future<List<VmapFeature>> featuresIn(VmapBounds bounds) =>
      _queries.featuresIn(bounds.southWest, bounds.northEast);

  /// The zoom at which cluster [clusterId] of the clustered GeoJSON source
  /// named [source] comes apart, for zooming in on a tapped cluster. Null
  /// when there is no such cluster.
  Future<double?> clusterExpansionZoom(String source, int clusterId) =>
      _queries.clusterExpansionZoom(source, clusterId);

  /// What cluster [clusterId] comes apart into at its expansion zoom.
  Future<List<VmapClusterMember>> clusterChildren(
    String source,
    int clusterId,
  ) => _queries.clusterChildren(source, clusterId);

  /// The points of the data inside cluster [clusterId], [limit] of them
  /// starting at [offset].
  Future<List<VmapClusterMember>> clusterLeaves(
    String source,
    int clusterId, {
    int limit = 10,
    int offset = 0,
  }) => _queries.clusterLeaves(source, clusterId, limit: limit, offset: offset);

  void _requestFrame() {
    if (_framePending || _disposed) return;
    _framePending = true;
    SchedulerBinding.instance.scheduleFrameCallback((_) {
      _framePending = false;
      if (!_disposed) notifyListeners();
    });
  }

  /// Draws one frame of the map, [size] logical pixels, as [camera] sees
  /// it. This is what a widget hosting the engine calls from its painter:
  /// `Vmap` does, and so does the flutter_map layer in `vmap_flutter_map`.
  /// [ahead] is where the camera is headed while an animation moves it, so
  /// the tiles there load on the way.
  void paint(
    ui.Canvas canvas,
    ui.Size size,
    VmapCamera camera, {
    double devicePixelRatio = 1,
    VmapCamera? ahead,
  }) {
    final view = camera.view(size.width, size.height);
    final center = view.center;
    final screen = view.screenCenter;
    _paint(
      canvas,
      MapFrame(
        zoom: view.zoom + 1,
        origin: ui.Offset(center.x - screen.x, center.y - screen.y),
        size: size,
        rotation: camera.bearing * math.pi / 180,
        devicePixelRatio: devicePixelRatio,
        view: view,
        ahead: ahead?.view(size.width, size.height),
      ),
    );
  }

  void _paint(ui.Canvas canvas, MapFrame camera) {
    _frame++;
    _camera = camera;
    final now = _clock.elapsedMicroseconds;
    final dt = _lastPaintMicros == 0
        ? 0.0
        : math.min(0.1, (now - _lastPaintMicros) / 1e6);
    _lastPaintMicros = now;
    final sheet = _sheet;
    if (sheet == null) return;
    if (_renderer?.loading ?? false) {
      _paintWhileLoading(canvas, camera.size);
      return;
    }
    final f = _startFrame(canvas, camera, sheet, now, dt);
    _coverTiles(f);
    _drawSky(f);
    _drawBelowLabels(f);
    _drawLabels(f);
    _drawAboveLabels(f);
    _drawAtmosphere(f);
    _finishFrame(f);
  }

  /// The background alone, while the GPU's shaders load.
  void _paintWhileLoading(ui.Canvas canvas, ui.Size size) {
    if (backgroundColor case final color?) {
      canvas.drawRect(ui.Offset.zero & size, ui.Paint()..color = color);
    }
    stats
      ..busy = true
      ..preparing = true;
    _requestFrame();
  }

  /// Sets the frame's zoom and time, switches between the GPU and the
  /// canvas when that changed, and puts the view on the globe or on raised
  /// ground.
  _Frame _startFrame(
    ui.Canvas canvas,
    MapFrame camera,
    StyleSheet sheet,
    int now,
    double dt,
  ) {
    final dataZoom = camera.zoom - 1;
    final styleZoom = dataZoom + sheet.zoomOffset;
    _context
      ..zoom = styleZoom
      ..nowMs = _clock.elapsedMilliseconds.toDouble();
    _zoomHistory.update(styleZoom, now);
    _meshes.startFrame(
      sheet,
      styleZoom,
      camera.rotation,
      standing: sheet.extrusions.isNotEmpty,
      dashFade: _zoomHistory.fade,
    );
    _budget.start(zooming: (camera.zoom - _lastZoom).abs() > 0.002);
    final gpu = _renderer;
    final onGpu = gpu != null && gpu.supports(sheet);
    if (!onGpu && _onGpu) {
      // Tiles made ready for the renderer have no canvas meshes, and the
      // data to make them is gone; they are built again.
      for (final s in _sources) {
        for (final t in s.tiles.values.followedBy(s.previous.values)) {
          t.dispose();
        }
        s.tiles.clear();
        s.previous.clear();
      }
    }
    if (onGpu && !_onGpu) {
      for (final s in _sources) {
        for (final t in s.tiles.values.followedBy(s.previous.values)) {
          t.uploadAgain();
        }
      }
    }
    _onGpu = onGpu;
    var waiting = false;
    // Only the GPU tier draws the globe; the canvas draws such a style flat.
    final globeness = onGpu ? sheet.projection.globeAt(styleZoom) : 0.0;
    if (globeness > 0) {
      camera = camera.withView(
        camera.view.withGlobe(globeness),
        camera.ahead?.withGlobe(globeness),
      );
    }
    _lastZoom = camera.zoom;
    final hold = _zoomOutHold.at(camera.view.zoom, _clock.elapsedMilliseconds);
    if (onGpu) {
      final view = camera.view;
      final (view: raised, :easing) = _ground.raise(view, gpu);
      if (easing) {
        waiting = true;
        _requestFrame();
      }
      if (!identical(raised, view)) {
        camera = camera.withView(
          raised,
          camera.ahead?.withGround(raised.groundElevation, raised.groundLowest),
        );
      }
    }
    _camera = camera;
    if (hold > 0) _requestFrame();
    final view = camera.view;
    final drape = onGpu && (gpu.terrain != null || view.globe != null);
    // Raised ground is cut by the renderer's far plane instead, as hills
    // nearer than it rise above the flat ground's far edge. So are the
    // GPU's layers past 60 degrees, as buildings near the far plane stand
    // above that edge; only what the canvas draws is cut at it.
    final farCut = onGpu && !drape && view.pitch > 60;
    return _Frame(
      canvas: canvas,
      camera: camera,
      view: view,
      sheet: sheet,
      renderer: onGpu ? gpu : _canvas,
      onGpu: onGpu,
      dataZoom: dataZoom,
      styleZoom: styleZoom,
      now: now,
      dt: dt,
      hold: hold,
      drape: drape,
      horizon: drape || farCut ? 0.0 : view.groundTopY,
      canvasHorizon: farCut ? view.groundTopY : 0.0,
      viewMatrix: view.matrix(
        originX: camera.origin.dx,
        originY: camera.origin.dy,
      ),
    )..waiting = waiting;
  }

  void _coverTiles(_Frame f) {
    for (final s in _sources) {
      final preparing = s.cover(
        f.camera,
        f.dataZoom,
        frame: _frame,
        nowMs: _clock.elapsedMilliseconds,
        prepare: _prepare,
        hold: f.hold,
        variableZoom: _ground.tiles != null && f.onGpu,
        standing: f.sheet.buildingSources.contains(s.pool.source),
      );
      if (preparing) f.waiting = true;
      if (s.retrying) _requestFrameLater();
    }
    if (!f.waiting) _prepareBackdrop(f.camera.zoom);
  }

  /// The sky above the horizon of a tilted map, or around the globe.
  void _drawSky(_Frame f) {
    final view = f.view, canvas = f.canvas, size = f.camera.size;
    final sky = f.sheet.sky;
    if (sky == null) return;
    final b = view.unrolledBounds;
    final globe = view.globe;
    if (globe == null) {
      if (view.horizonY <= b.top) return;
      _unroll(canvas, view);
      // As MapLibre's sky shader, every pixel whose centre is above the
      // horizon is wholly sky: an edge across a pixel would leave it part
      // see-through, the ground reaching only up to the horizon.
      final dpr = f.camera.devicePixelRatio;
      final bottom = view.roll == 0
          ? (view.horizonY * dpr).roundToDouble() / dpr
          : view.horizonY;
      _meshes.drawSky(
        canvas,
        sky,
        size,
        ui.Rect.fromLTRB(b.left, b.top, b.right, bottom),
        horizonY: view.horizonY,
      );
      canvas.restore();
      return;
    }
    _unroll(canvas, view);
    final top = Rgba.of(sky.skyColor(_context)) ?? Rgba.transparent;
    if (!_atmosphere.sky(
      canvas,
      size,
      ui.Rect.fromLTRB(b.left, b.top, b.right, b.bottom),
      globe,
      top: top,
      low: Rgba.of(sky.horizonColor(_context)) ?? top,
      band:
          (asNumber(sky.skyHorizonBlend(_context)) ?? 0).toDouble() *
          size.height /
          2,
      horizonY: view.horizonY,
      atmosphereBlend:
          asNumber(sky.atmosphereBlend(_context))?.toDouble() ?? 0.8,
    )) {
      f.waiting = true;
    }
    canvas.restore();
  }

  /// The style's layers below its labels, and the buildings.
  void _drawBelowLabels(_Frame f) {
    final canvas = f.canvas, sheet = f.sheet, renderer = f.renderer;
    if (f.horizon > 0) {
      canvas.save();
      _clipGround(canvas, f.view, f.horizon);
    }
    final started = _clock.elapsedMicroseconds;
    renderer
      ..rasters = f.drape ? [for (final r in _rasters) r.drawn] : const []
      ..states = [for (final s in _sources) _states[s.def.name]]
      ..dashFade = _zoomHistory.fade;
    if (renderer.paint(
      canvas,
      f.view,
      f.camera.origin,
      sheet,
      [for (final s in _sources) s.fallback],
      [for (final s in _sources) s.ideal],
      _context,
      f.styleZoom,
      f.camera.devicePixelRatio,
      _resources.sprites,
    )) {
      f.waiting = true;
    }
    _drawRuns(f, 0, sheet.labelsRun);
    if (renderer.presentUntil(canvas, sheet.labelsRun)) f.waiting = true;
    _buildingMicros = _clock.elapsedMicroseconds - started;
    if (f.horizon > 0) canvas.restore();
  }

  /// The style's backgrounds and raster layers from run [from] to [to], with
  /// the renderer's vector layers before each laid down first, so all of
  /// them come in the style's order.
  void _drawRuns(_Frame f, int from, int to) {
    final canvas = f.canvas, sheet = f.sheet;
    for (var index = from; index < to; index++) {
      final run = sheet.runs[index];
      if (run.background < 0 && run.raster < 0) continue;
      if (run.background >= 0 && f.drape) continue;
      if (f.renderer.presentUntil(canvas, index)) f.waiting = true;
      canvas.save();
      if (f.canvasHorizon > 0) _clipGround(canvas, f.view, f.canvasHorizon);
      canvas.transform(f.viewMatrix);
      if (run.background >= 0) {
        _meshes.drawBackground(
          canvas,
          sheet.backgrounds[run.background],
          f.camera,
        );
      } else {
        _rasters[run.raster].paint(
          canvas,
          _context,
          f.camera.zoom,
          f.camera.origin,
          f.camera.size,
          view: f.view,
          drape: f.drape,
        );
      }
      canvas.restore();
    }
  }

  void _drawLabels(_Frame f) {
    final sheet = f.sheet, camera = f.camera, view = f.view;
    f.animating =
        (sheet.dashed && _zoomHistory.fading) ||
        _rasters.any((r) => r is TileDrawing && r.fading);
    f.labelsStarted = _clock.elapsedMicroseconds;
    if (!_labelOptions.visible) return;
    final shown = [
      for (final s in _sources) ...[...s.ideal, ...s.fallback],
    ];
    _labels.occlusion.update(view, shown, sheet, f.styleZoom);
    if (_transitions.isNotEmpty &&
        _transitions.touches({for (final s in sheet.symbols) s.id})) {
      _labels.placeNow();
    }
    final perMetre = RaisedGround.labelPerMetre(view);
    final terrain = f.renderer.terrain;
    final moving = _labels.paint(
      f.canvas,
      sources: [_markerLabels]
          .followedBy(shown.map((d) => d.tile.labelsIn(_wrapOf(d, camera)))),
      sourcesKey:
          Object.hashAll(
            shown.map(
              (d) => Object.hash(
                identityHashCode(d.tile),
                d.tile.labels.length,
                _wrapOf(d, camera),
              ),
            ),
          ) ^
          _markerLabels.length,
      background: sheet.background(_context)?.toArgb() ?? 0xFFFFFFFF,
      zoom: camera.zoom,
      origin: camera.origin,
      size: camera.size,
      devicePixelRatio: camera.devicePixelRatio,
      dt: f.dt,
      rasterBudgetMicros: _budget.spent > 1000 ? 1 : _labelBudgetMicros,
      styleNowMs: _clock.elapsedMilliseconds.toDouble(),
      zooming: _budget.zooming,
      view: view,
      ground: RaisedGround.groundOf(view, terrain),
      perMetre: perMetre,
      seaLevel: terrain == null ? 0 : -terrain.centre * perMetre,
      sdf: f.renderer.sdfText,
    );
    f.animating = f.animating || moving;
  }

  /// What the style puts after its last symbol layer, which goes over the
  /// labels, as MapLibre draws in the style's order.
  void _drawAboveLabels(_Frame f) {
    final sheet = f.sheet, canvas = f.canvas;
    if (sheet.labelsRun >= sheet.runs.length) return;
    if (f.horizon > 0) {
      canvas.save();
      _clipGround(canvas, f.view, f.horizon);
    }
    _drawRuns(f, sheet.labelsRun, sheet.runs.length);
    if (f.renderer.presentUntil(canvas, sheet.runs.length)) f.waiting = true;
    if (f.horizon > 0) canvas.restore();
  }

  /// The air in front of the globe.
  void _drawAtmosphere(_Frame f) {
    final globe = f.view.globe;
    final sky = f.sheet.sky;
    if (globe == null || sky == null) return;
    final blend = asNumber(sky.atmosphereBlend(_context))?.toDouble() ?? 0.8;
    if (blend <= 0) return;
    _unroll(f.canvas, f.view);
    final b = f.view.unrolledBounds;
    if (!_atmosphere.paint(
      f.canvas,
      f.camera.size,
      ui.Rect.fromLTRB(b.left, b.top, b.right, b.bottom),
      globe,
      blend,
      f.sheet.light,
    )) {
      f.waiting = true;
    }
    f.canvas.restore();
  }

  /// Counts what the frame drew and spent, ends finished transitions, asks
  /// for another frame when something is still moving or loading, and lets
  /// go of tiles past the cache's size.
  void _finishFrame(_Frame f) {
    final now = f.now, labelsStarted = f.labelsStarted;
    final finished = _clock.elapsedMicroseconds;
    var ideal = 0, fallback = 0, cached = 0, loading = 0, unpack = 0;
    var holes = 0;
    for (final s in _sources) {
      holes += s.uncovered;
      ideal += s.ideal.length;
      fallback += s.fallback.length;
      cached += s.tiles.length;
      for (final (id, _) in s.missing) {
        if (!s.resting(id, _clock.elapsedMilliseconds)) loading++;
      }
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
            'z=${f.camera.zoom.toStringAsFixed(2)} '
            'tiles=$ideal+$fallback cached=$cached',
      );
    timings.labels.take(_labels.work);
    if (holes > 0) timings.framesWithHoles++;
    if (_transitions.isNotEmpty) {
      if (_transitions.allOver(_clock.elapsedMilliseconds.toDouble())) {
        // Done: the plain values take over, after this frame.
        _transitions.clear();
        scheduleMicrotask(() {
          final base = _base;
          if (base != null && !_disposed) {
            _apply(base, _style, keepLabels: true);
          }
        });
      } else {
        f.animating = true;
      }
    }
    // Tiles held while zooming out are swapped for the new zoom's once the
    // hold ends, which a frame then has to draw.
    stats
      ..busy = f.animating || f.waiting || _budget.stale || f.hold > 0
      ..preparing = f.waiting;
    if (stats.busy) {
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
      ..tilesLoading =
          loading +
          _rasters.whereType<TileDrawing>().fold<int>(
            0,
            (n, r) => n + r.waiting,
          ) +
          (_ground.tiles?.waiting ?? 0)
      ..resourcesLoading = _resources.loading + _labels.glyphsLoading
      ..drawCalls = f.onGpu ? 0 : _canvas.drawCalls
      ..gpuFramesReused = _renderer?.framesReused ?? 0;
    for (final s in _sources) {
      s.evict(rendering.maxCachedTiles, _frame);
    }
  }

  bool _retryPending = false;

  /// How many worlds east of the first the copy [d] is drawn in lies.
  static int _wrapOf(TileDraw d, MapFrame camera) {
    final n = 1 << d.tile.id.z;
    final column = ((d.left + camera.origin.dx) / d.size).round();
    return ((column - d.tile.id.x) / n).floor();
  }

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
  late final CanvasMap _canvas = CanvasMap(_meshes);

  final ZoomHistory _zoomHistory = ZoomHistory();
  final Atmosphere _atmosphere = Atmosphere();

  /// Whether this frame's flat layers are drawn by [renderer].
  bool _onGpu = false;

  void _prepare(LoadedTile tile, double scale) {
    if (_budget.spentUp) return;
    final started = _clock.elapsedMicroseconds;
    tile.prepare(
      _meshes.widths,
      scale,
      _clock,
      started + FrameBudget.micros - _budget.spent,
      renderer: _onGpu ? _renderer : null,
    );
    final spent = _clock.elapsedMicroseconds - started;
    _budget.spent += spent;
    stats.timings.tileSetup(spent);
  }

  void _prepareBackdrop(double zoom) {
    if (_budget.spentUp) return;
    for (final s in _sources) {
      for (final tile in s.tiles.values) {
        if (tile.prepared || tile.waitsForUpload) continue;
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
    _canvas.dispose();
    _renderer?.dispose();
    _resources.dispose();
    _meshes.dispose();
    for (final r in _rasters) {
      r.close();
    }
    _ground.close();
    super.dispose();
  }
}

/// What one frame draws with, handed between the steps of the engine's
/// paint.
class _Frame {
  _Frame({
    required this.canvas,
    required this.camera,
    required this.view,
    required this.sheet,
    required this.renderer,
    required this.onGpu,
    required this.dataZoom,
    required this.styleZoom,
    required this.now,
    required this.dt,
    required this.hold,
    required this.drape,
    required this.horizon,
    required this.canvasHorizon,
    required this.viewMatrix,
  });

  final ui.Canvas canvas;
  final MapFrame camera;
  final MapView view;
  final StyleSheet sheet;

  /// What draws the vector layers and buildings this frame.
  final MapRenderer renderer;

  /// Whether that is the GPU.
  final bool onGpu;
  final double dataZoom, styleZoom;

  /// When the frame began, in microseconds of the engine's clock.
  final int now;

  /// Seconds since the frame before, at most a tenth.
  final double dt;
  final double hold;

  /// Whether the GPU drapes the flat layers over raised ground or the
  /// globe.
  final bool drape;

  /// Where the ground stops on the screen, for what is cut at the horizon;
  /// 0 when nothing is.
  final double horizon, canvasHorizon;
  final Float64List viewMatrix;

  bool waiting = false;
  bool animating = false;
  int labelsStarted = 0;
}
