import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:latlong2/latlong.dart' show LatLng;

import 'camera/camera.dart';
import 'errors.dart';
import 'frame_painter.dart';
import 'gpu/gpu_map.dart';
import 'camera/bounds.dart';
import 'camera/map_camera.dart';
import 'style/expr.dart';
import 'style/json_equals.dart';
import 'tiles/feature_queries.dart';
import 'tiles/feature_states.dart';
import 'render/map_renderer.dart';
import 'text/glyphs/vmap_font.dart';
import 'labels/label_state.dart';
import 'labels/labels.dart';
import 'labels/point_labels.dart' show LabelObstacle;
import 'labels/text_style.dart';
import 'style/pins.dart';
import 'tiles/query.dart';
import 'widget/marker.dart';
import 'raster/raster.dart';
import 'style/raster_style.dart';
import 'style/style_loader.dart';
import 'style/style_resources.dart';
import 'terrain/raised_ground.dart';
import 'tiles/offline.dart';
import 'options.dart';
import 'stats.dart';
import 'style/style.dart';
import 'style/transitions.dart';
import 'style/style_model.dart';
import 'tiles/built_tile.dart';
import 'tiles/tiles.dart';
import 'tiles/worker.dart';
import 'platform.dart';
import 'camera/mercator.dart';
import 'tiles/tile_id.dart';

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
    _labels.stateOf = (source, id) => _states.at(_sources[source].def.name, id);
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
      _painter.drawsWithCanvas ? VmapRenderer.canvas : VmapRenderer.gpu;

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
    onSprites: (sheet) => _labels.sheet = sheet,
    onChange: () {
      if (!_disposed) notifyListeners();
    },
    onError: (e) => onError?.call(e),
  );

  void _report(VmapErrorKind kind, Object error) =>
      onError?.call(error is VmapError ? error : VmapError(kind, error));

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

  VmapStyle _style;
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

  /// Uses the style right away when it is at hand. One named by address is
  /// drawn from the copy kept from the last run while the current one
  /// downloads.
  Future<void> _loadStyle() async {
    final wanted = _style;
    _styleError = null;
    bool current() => !_disposed && wanted == _style;
    final error = await loadStyle(
      wanted,
      network,
      ready: _fontsLoaded,
      current: current,
      use: (document) => _apply(document, wanted),
      onError: (e) => onError?.call(e),
    );
    if (error != null && current()) {
      _styleError = error;
      notifyListeners();
    }
  }

  Map<String, Object?>? _base;
  VmapOverlay? _overlay;

  /// Sources and layers of the app's own, drawn with the style.
  VmapOverlay? get overlay => _overlay;
  set overlay(VmapOverlay? value) {
    if (value == _overlay) return;
    final sameLayers =
        value != null && jsonEquals(value.layers, _overlay?.layers);
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
    final sameSymbols = jsonEquals(
      _placedSymbols(value, document),
      _placedSymbols(_edits, document),
    );
    _edits = value;
    _apply(base, _style, keepLabels: sameSymbols);
  }

  /// The symbol layers of [document] with [edits], all but their paint:
  /// what decides where labels are placed, which a change of paint keeps.
  static List<Object?> _placedSymbols(
    List<VmapStyleEdit> edits,
    Map<String, Object?> document,
  ) => [
    for (final layer
        in VmapStyleEdit.applyAll(edits, document)['layers']! as List)
      if (layer case {'type': 'symbol'})
        {
          for (final e in layer.entries)
            if (e.key != 'paint') e.key: e.value,
        },
  ];

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
    final keepRasters = _sheet != null && rasterKey == _rasterKey;
    _rasterKey = rasterKey;
    _sheet = sheet;
    reconcileRasters(
      _rasters,
      sheet.rasters,
      keep: keepRasters,
      make: (layer) => RasterDrawing.of(
        layer,
        config: network,
        onLoaded: _requestFrame,
        onError: (e) => _report(VmapErrorKind.tiles, e),
      ),
    );
    _ground.use(sheet.terrain);
    _resources.useSprites(sheet.spriteSheets);
    _painter.resize(sheet.layers.length);
    _labels
      ..symbols = sheet.symbols
      ..zoomOffset = sheet.zoomOffset;
    if (!keepLabels || !sameShape) {
      _labels.clear();
    } else {
      _labels.restyle();
    }
    final next = reconcileSources(
      _sources,
      sheet.sources,
      keep: sameShape,
      make: (i) {
        final def = sheet.sources[i];
        late final TileSource made;
        final pool = TilePool(
          network,
          style: document,
          nameKeys: from.nameKeys,
          sheet: sheet,
          source: i,
          onLoaded: (id, built) => _onLoaded(made, id, built),
          onRelabeled: (id, built) => _onRelabeled(made, id, built),
          onFailed: (id, failure) {
            made.retries.fail(
              id,
              _clock.elapsedMilliseconds,
              corrupt: failure.corrupt,
            );
            _report(VmapErrorKind.tiles, failure);
          },
          script: _webWorker,
          shared: _resources.shared.fetch,
          fonts: _resources.fontBytes,
          families: _resources.families,
          gpu: _renderer != null,
        );
        if (sheet.stateBuiltSources.contains(i) &&
            _states.of(def.name) != null) {
          pool.useStates(_states.pairs(def.name));
        }
        return made = TileSource(def, pool);
      },
    );
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
    final areas = <LabelObstacle>[];
    _markerLabels.clear();
    for (var i = 0; i < value.length; i++) {
      final m = value[i];
      final wx = worldX(m.point.longitude);
      final wy = worldY(m.point.latitude);
      areas.add((
        x: wx,
        y: wy,
        width: m.width,
        height: m.height,
        shiftX: (m.alignment?.x ?? 0) * m.width / 2,
        shiftY: (m.alignment?.y ?? 0) * m.height / 2,
      ));
      final name = m.name;
      if (name == null || name.isEmpty) continue;
      _markerLabels.add(MarkerName(i, name, wx, wy));
    }
    _labels.obstacles = areas;
    notifyListeners();
  }

  final List<LabelCandidate> _markerLabels = [];

  final FeatureStates _states = FeatureStates();

  /// State given to single features, read by the style's paint properties
  /// with `['feature-state', name]`. Changing it repaints, and builds again
  /// only the tiles of a source whose buildings' height, base or colour
  /// read it.
  List<VmapFeatureState> get featureStates => _featureStates;
  List<VmapFeatureState> _featureStates = const [];
  set featureStates(List<VmapFeatureState> value) {
    if (listEquals(value, _featureStates)) return;
    _featureStates = value;
    final changed = _states.replace(value);
    if (changed.isEmpty) return;
    for (final i in _sheet?.stateBuiltSources ?? const <int>{}) {
      final source = _sources[i];
      final name = source.def.name;
      if (!changed.contains(name)) continue;
      source.pool.useStates(_states.pairs(name));
      source.rebuildAll();
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
      s.evict(0, _painter.frame);
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
    from.tiles[id] = LoadedTile(id, built, _sheet!)..usedFrame = _painter.frame;
    from.retries.loaded(id);
    notifyListeners();
  }

  void _onRelabeled(TileSource from, TileId id, BuiltTile built) {
    if (_disposed || !_sources.contains(from)) return;
    final tile = from.tiles[id];
    if (tile == null) return;
    tile.replaceLabels(built.labels);
    notifyListeners();
  }

  late final FeatureQueries _queries = FeatureQueries(
    () => _sources,
    () => _painter.lastCamera,
    () => _sheet,
  );

  /// What the map shows at [point]: the features the style draws within
  /// [radius] logical pixels of it, topmost first. It reads the tiles again
  /// off the UI thread, so it answers a moment later.
  Future<List<VmapFeature>> featuresAt(LatLng point, {double radius = 6}) =>
      _queries.featuresAt(point, radius: radius);

  /// What the map shows inside [bounds]: the features the style draws that
  /// touch the box, topmost first. It reads the tiles again off the UI
  /// thread, so it answers a moment later.
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
    _painter.paint(
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
      _sheet,
      labelsVisible: _labelOptions.visible,
    );
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

  late final FramePainter _painter = FramePainter(
    sources: _sources,
    rasters: _rasters,
    labels: _labels,
    markerLabels: _markerLabels,
    ground: _ground,
    resources: _resources,
    states: _states,
    transitions: _transitions,
    context: _context,
    clock: _clock,
    stats: stats,
    gpu: _renderer,
    maxCachedTiles: rendering.maxCachedTiles,
    host: _Host(this),
  );

  /// Whether a paint transition is still running. Once all have ended the
  /// plain values take over, after this frame.
  bool _transitionsRunning() {
    if (_transitions.isEmpty) return false;
    if (!_transitions.allOver(_clock.elapsedMilliseconds.toDouble())) {
      return true;
    }
    _transitions.clear();
    scheduleMicrotask(() {
      final base = _base;
      if (base != null && !_disposed) _apply(base, _style, keepLabels: true);
    });
    return false;
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
    _painter.dispose();
    _renderer?.dispose();
    _resources.dispose();
    for (final r in _rasters) {
      r.close();
    }
    _ground.close();
    super.dispose();
  }
}

class _Host implements FrameHost {
  _Host(this._engine);

  final VmapEngine _engine;

  @override
  void requestFrame() => _engine._requestFrame();

  @override
  void requestFrameLater() => _engine._requestFrameLater();

  @override
  bool get transitionsRunning => _engine._transitionsRunning();
}
