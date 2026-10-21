import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:latlong2/latlong.dart' show LatLng;

import 'atmosphere.dart';
import 'camera.dart';
import 'errors.dart';
import 'gpu/gpu_map.dart';
import 'map_camera.dart';
import 'expr.dart';
import 'extrusion.dart';
import 'map_renderer.dart';
import 'glyphs/vmap_font.dart';
import 'label_state.dart';
import 'labels.dart';
import 'text_style.dart';
import 'paint_defaults.dart';
import 'pins.dart';
import 'query.dart';
import 'marker.dart';
import 'raster.dart';
import 'raster_style.dart';
import 'style_resources.dart';
import 'terrain/terrain.dart';
import 'view.dart' show MapView;
import 'mesh_painter.dart';
import 'offline.dart';
import 'options.dart';
import 'stats.dart';
import 'style.dart';
import 'style_model.dart';
import 'tile_builder.dart';
import 'tiles.dart';
import 'worker.dart';
import 'zoom_history.dart';
import 'platform.dart';
import 'mercator.dart';
import 'protocol.dart';
import 'tile_id.dart';
import 'net.dart' show cacheKey;

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
    _resources.loadFonts(fonts, shapeInWorkers: !_styleGlyphs).whenComplete(() {
      if (!_disposed) _loadStyle();
    });
  }

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
  final ui.Paint _layerPaint = ui.Paint();

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
  final BuildingRenderer _buildings = ExtrusionPainter();
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

  /// Fetches into the cache directory every tile the style draws between
  /// [west], [south], [east] and [north] at zooms [minZoom] to [maxZoom],
  /// so that part of the map shows without a network. Call it
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
    if (!hasFiles || network.cacheDirectory == null) {
      throw StateError('A region is downloaded into a cache directory');
    }
    return downloadTiles(
      pools: [for (final s in _sources) s.pool],
      rasters: _rasters.whereType<TileDrawing>(),
      west: west,
      south: south,
      east: east,
      north: north,
      minZoom: minZoom + 1,
      maxZoom: maxZoom + 1,
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
    final client = Net(userAgent: network.userAgent);
    try {
      final reply = await client.get(
        url,
        network.headers,
        timeout: const Duration(seconds: 10),
      );
      if (reply.status != 200) throw HttpFailure(reply.status, url);
      final body = utf8.decode(reply.bytes);
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
    if (identical(value, _overlay)) return;
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

  /// The document last applied, before its transitions were written in.
  Map<String, Object?>? _applied;

  /// Paint properties on their way from one value to another, by layer id
  /// and property name.
  final Map<String, _Transition> _transitions = {};

  /// [document] with each paint property that changed since the last
  /// document passing from its old value to its new one, over its
  /// `-transition` or the style's `transition`, 300 ms by default, as
  /// MapLibre animates a changed paint property.
  Map<String, Object?> _transitioned(Map<String, Object?> document) {
    final before = _applied;
    _applied = document;
    final now = _clock.elapsedMilliseconds.toDouble();
    _transitions.removeWhere((_, t) => t.over(now));
    if (before != null) {
      final old = {
        for (final l in (before['layers'] as List?) ?? const [])
          if (l is Map) '${l['id']}': l,
      };
      final style = document['transition'];
      for (final l in (document['layers'] as List?) ?? const []) {
        if (l is! Map) continue;
        final id = '${l['id']}';
        final was = old[id];
        if (was == null) continue;
        final paint = l['paint'] is Map ? l['paint'] as Map : const {};
        final prior = was['paint'] is Map ? was['paint'] as Map : const {};
        for (final key in {...paint.keys, ...prior.keys}) {
          if ('$key'.endsWith('-transition')) continue;
          final a = prior[key] ?? paintDefaults[key];
          final b = paint[key] ?? paintDefaults[key];
          if (a == null || b == null || _sameJson(a, b)) continue;
          final own = paint['$key-transition'];
          double timing(String name, double fallback) =>
              asNumber(own is Map ? own[name] : null) ??
              asNumber(style is Map ? style[name] : null) ??
              fallback;
          final duration = timing('duration', 300);
          final delay = timing('delay', 0);
          if (duration <= 0 && delay <= 0) continue;
          _transitions['$id\u0000$key'] = _Transition(
            id,
            '$key',
            a,
            b,
            now,
            duration,
            delay,
          );
        }
      }
    }
    if (_transitions.isEmpty) return document;
    return {
      ...document,
      'layers': [
        for (final l in (document['layers'] as List?) ?? const [])
          if (l is Map &&
              _transitions.values.any((t) => t.layer == '${l['id']}'))
            {
              ...l,
              'paint': {
                ...?(l['paint'] as Map?),
                for (final t in _transitions.values)
                  if (t.layer == '${l['id']}') t.key: t.expression,
              },
            }
          else
            l,
      ],
    };
  }

  static bool _sameJson(Object? a, Object? b) {
    try {
      return jsonEncode(a) == jsonEncode(b);
    } on JsonUnsupportedObjectError {
      return identical(a, b);
    }
  }

  void _apply(
    Map<String, Object?> base,
    VmapStyle from, {
    bool keepLabels = false,
  }) {
    base = derefLayers(base);
    _base = base;
    final document = _transitioned(
      VmapStyleEdit.applyAll(_edits, _overlay?.applyTo(base) ?? base),
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
    _useTerrain(sheet.terrain);
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
        onFailed: (id, error) {
          made.fail(
            id,
            _clock.elapsedMilliseconds,
            corrupt: '$error'.startsWith('FormatException'),
          );
          _report(VmapErrorKind.tiles, error);
        },
        script: _webWorker,
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

  /// The heights the style's root `terrain` raises the ground by, drawn by
  /// a renderer that draws terrain.
  TerrainTiles? _terrain;

  void _useTerrain(TerrainLayer? layer) {
    if (layer?.signature == _terrain?.layer.signature) {
      if (layer != null) _terrain!.restyle(layer);
      return;
    }
    _terrain?.close();
    _terrain = layer == null
        ? null
        : RasterDrawing.of(
            layer,
            config: network,
            onLoaded: _requestFrame,
            onError: (e) => _report(VmapErrorKind.tiles, e),
          ) as TerrainTiles;
  }

  /// World pixels in a metre of height for labels raised by
  /// `symbol-height-offset`: at the middle's latitude on the flat map, as
  /// MapLibre's pixels per meter, and at the equator's on the globe, whose
  /// sphere is the world's width around.
  static double _labelPerMetre(MapView? view) {
    if (view == null) return 0;
    const circumference = 40075016.686;
    if (view.globe != null) return view.worldSize / circumference;
    return view.worldSize /
        (circumference * math.cos(latitudeAt(view.centerY) * math.pi / 180));
  }

  /// The ground's height in world pixels under a point of the world, for
  /// labels to stand on, when the renderer draws raised ground.
  double Function(double wx, double wy)? _groundOf(MapView? view) {
    final terrain = _renderer?.terrain;
    if (view == null || terrain == null || !_onGpu) return null;
    final perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
    final zoom = view.zoom.floor();
    return (wx, wy) => terrain.at(wx, wy, zoom) * perMetre;
  }

  /// Asks for the heights under [view] and hands them to the renderer.
  /// Returns the view over that ground, and whether the ground is still
  /// easing to its height, when the map is not settled.
  ({MapView view, bool easing}) _raiseGround(MapView view) {
    final terrain = _terrain, gpu = _renderer;
    if (gpu == null) return (view: view, easing: false);
    if (terrain == null) {
      gpu.terrain = null;
      return (view: view, easing: false);
    }
    final exaggeration = terrain.layer.exaggeration;
    final shallower = terrain.shallower;
    final zoom = math.max(
      0,
      math.min(view.zoom.floor() - shallower, terrain.maxZoom),
    );
    final perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
    final eye = view.eye;
    final belowEye =
        terrain.heights.heightAt(
          eye.x / view.worldSize,
          eye.y / view.worldSize,
          zoom,
        ) *
        exaggeration;
    // The ground under the map's middle, raised further when a hill would
    // otherwise reach the camera's near plane: everything sinks instead, as
    // MapLibre lifts its camera over terrain.
    final near = view.height / 50;
    final under = math.max(
      terrain.heights.heightAt(view.centerX, view.centerY, zoom) * exaggeration,
      belowEye + (near - eye.height) / perMetre,
    );
    // Eased, so an arriving tile of heights does not make the map jump.
    final centre = centerElevation != null
        ? _groundCentre = centerElevation!
        : _groundCentre += (under - _groundCentre) * 0.15;
    final easing = centerElevation == null && (under - centre).abs() > 0.5;
    if (easing) _requestFrame();
    final centreTile = terrain.heights.locate(view.centerX, view.centerY, zoom);
    final raised = view.withGround(
      centre,
      (centreTile?.$1.min ?? 0) * exaggeration,
    );
    terrain.want(
      {
        for (final t in raised.cover(
          maxZoom: terrain.maxZoom + shallower,
          variableZoom: true,
          beyond: view.height,
        ))
          if (t.z >= shallower)
            TileId(
              t.z - shallower,
              (t.x % (1 << t.z)) >> shallower,
              t.y >> shallower,
            ),
      }.toList(),
    );
    gpu.terrain = Terrain(
      terrain.heights,
      exaggeration,
      terrain.maxZoom,
      centre,
      shallower: shallower,
    );
    return (view: raised, easing: easing);
  }

  double _groundCentre = 0;

  /// Over raised ground, the height in metres the map's middle stands at,
  /// as MapLibre's center elevation with centerClampedToGround off; null
  /// keeps it on the ground under it.
  double? get centerElevation => _centerElevation;
  double? _centerElevation;
  set centerElevation(double? value) {
    if (value == _centerElevation) return;
    _centerElevation = value;
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

  MapFrame? _camera;

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
            found.add(_feature(s.def.name, TileId(z, x, y), hit));
          }
        }(),
    ]);
    found.sort((a, b) => b.$1 - a.$1);
    return [for (final f in found) f.$2];
  }

  static (int, VmapFeature) _feature(String source, TileId tile, TileHit hit) {
    final n = 1 << tile.z;
    return (
      hit.order,
      VmapFeature(
        source: source,
        sourceLayer: hit.sourceLayer,
        geometryType: hit.geometryType,
        layers: hit.layers,
        geometry: [
          for (final ring in hit.rings)
            [
              for (var i = 0; i + 1 < ring.length; i += 2)
                LatLng(
                  latitudeAt((tile.y + ring[i + 1] / 4096) / n),
                  longitudeAt((tile.x + ring[i] / 4096) / n),
                ),
            ],
        ],
        id: hit.properties[r'$id'],
        properties: {
          for (final e in hit.properties.entries)
            if (e.key != r'$id') e.key: e.value,
        },
      ),
    );
  }

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
                  final (order, feature) = _feature(
                    s.def.name,
                    TileId(z, x, y),
                    hit,
                  );
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

  /// The zoom at which cluster [clusterId] of the clustered GeoJSON source
  /// named [source] comes apart, for zooming in on a tapped cluster. Null
  /// when there is no such cluster.
  Future<double?> clusterExpansionZoom(String source, int clusterId) async {
    final zoom = await _clustered(source)?.clusterZoom(clusterId);
    return zoom?.toDouble();
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
        point: LatLng(latitudeAt(member.y), longitudeAt(member.x)),
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

  void _paint(ui.Canvas canvas, MapFrame flatCamera) {
    _frame++;
    var camera = flatCamera;
    _camera = camera;
    final now = _clock.elapsedMicroseconds;
    final dt = _lastPaintMicros == 0
        ? 0.0
        : math.min(0.1, (now - _lastPaintMicros) / 1e6);
    _lastPaintMicros = now;

    final size = camera.size;
    final sheet = _sheet;
    if (sheet == null) return;
    if (_renderer?.loading ?? false) {
      if (backgroundColor case final color?) {
        canvas.drawRect(
          ui.Offset.zero & camera.size,
          ui.Paint()..color = color,
        );
      }
      stats
        ..busy = true
        ..preparing = true;
      _requestFrame();
      return;
    }
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
      standing: camera.view != null && sheet.extrusions.isNotEmpty,
      dashFade: _zoomHistory.fade,
    );
    _budget.start(zooming: (camera.zoom - _lastZoom).abs() > 0.002);
    final gpu = _renderer;
    final onGpu = camera.view != null && gpu != null && gpu.supports(sheet);
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
    // Only the GPU tier draws the globe; the canvas draws such a style flat.
    final globeness = onGpu ? sheet.projection.globeAt(styleZoom) : 0.0;
    if (globeness > 0 && camera.view != null) {
      camera = MapFrame(
        zoom: camera.zoom,
        origin: camera.origin,
        size: camera.size,
        rotation: camera.rotation,
        devicePixelRatio: camera.devicePixelRatio,
        view: camera.view!.withGlobe(globeness),
        ahead: camera.ahead?.withGlobe(globeness),
      );
      _camera = camera;
    }
    var waiting = false;
    _lastZoom = camera.zoom;
    final hold = _zoomOutHold.at(camera.view?.zoom, _clock.elapsedMilliseconds);
    if (camera.view case final view? when onGpu) {
      final (view: raised, :easing) = _raiseGround(view);
      if (easing) waiting = true;
      if (!identical(raised, view)) {
        camera = MapFrame(
          zoom: camera.zoom,
          origin: camera.origin,
          size: camera.size,
          rotation: camera.rotation,
          devicePixelRatio: camera.devicePixelRatio,
          view: raised,
          ahead: camera.ahead?.withGround(
            raised.groundElevation,
            raised.groundLowest,
          ),
        );
        _camera = camera;
      }
    }
    if (hold > 0) _requestFrame();
    for (final s in _sources) {
      final preparing = s.cover(
        camera,
        dataZoom,
        frame: _frame,
        nowMs: _clock.elapsedMilliseconds,
        prepare: _prepare,
        hold: hold,
        variableZoom: _terrain != null && onGpu,
        standing: sheet.buildingSources.contains(s.pool.source),
      );
      if (preparing) waiting = true;
      if (s.retrying) _requestFrameLater();
    }
    if (!waiting) _prepareBackdrop(camera.zoom);

    var draws = 0;
    final view = camera.view;
    final globe = view?.globe != null;
    final drape = onGpu && (gpu.terrain != null || globe);
    // Raised ground is cut by the renderer's far plane instead, as hills
    // nearer than it rise above the flat ground's far edge. So are the
    // GPU's layers past 60 degrees, as buildings near the far plane stand
    // above that edge; only what the canvas draws is cut at it.
    final farCut = onGpu && !drape && view != null && view.pitch > 60;
    final horizon = drape || farCut ? 0.0 : view?.groundTopY ?? 0;
    final canvasHorizon = farCut ? view.groundTopY : 0.0;
    if (view != null &&
        !globe &&
        view.horizonY > view.unrolledBounds.top &&
        sheet.sky != null) {
      _unroll(canvas, view);
      final b = view.unrolledBounds;
      // As MapLibre's sky shader, every pixel whose centre is above the
      // horizon is wholly sky: an edge across a pixel would leave it part
      // see-through, the ground reaching only up to the horizon.
      final dpr = camera.devicePixelRatio;
      final bottom = view.roll == 0
          ? (view.horizonY * dpr).roundToDouble() / dpr
          : view.horizonY;
      _meshes.drawSky(
        canvas,
        sheet.sky!,
        size,
        ui.Rect.fromLTRB(b.left, b.top, b.right, bottom),
        horizonY: view.horizonY,
      );
      canvas.restore();
    }
    final globeSky = sheet.sky;
    if (view != null && globeSky != null && view.globe != null) {
      _unroll(canvas, view);
      final b = view.unrolledBounds;
      final top = Rgba.of(globeSky.skyColor(_context)) ?? Rgba.transparent;
      if (!_atmosphere.sky(
        canvas,
        size,
        ui.Rect.fromLTRB(b.left, b.top, b.right, b.bottom),
        view.globe!,
        top: top,
        low: Rgba.of(globeSky.horizonColor(_context)) ?? top,
        band:
            (asNumber(globeSky.skyHorizonBlend(_context)) ?? 0).toDouble() *
            size.height /
            2,
        horizonY: view.horizonY,
        atmosphereBlend:
            asNumber(globeSky.atmosphereBlend(_context))?.toDouble() ?? 0.8,
      )) {
        waiting = true;
      }
      canvas.restore();
    }
    if (horizon > 0) {
      canvas.save();
      _clipGround(canvas, view!, horizon);
    }
    // The GPU draws the vector layers into images first, which are laid in
    // the style's order between the canvas's backgrounds and rasters.
    if (view != null && onGpu) {
      final gpuStarted = _clock.elapsedMicroseconds;
      gpu.rasters = drape ? [for (final r in _rasters) r.drawn] : const [];
      gpu.states = [for (final s in _sources) _states[s.def.name]];
      gpu.dashFade = _zoomHistory.fade;
      final more = gpu.paint(
        canvas,
        view,
        camera.origin,
        sheet,
        [for (final s in _sources) s.fallback],
        [for (final s in _sources) s.ideal],
        _context,
        styleZoom,
        camera.devicePixelRatio,
        _resources.sprites,
      );
      _buildingMicros = _clock.elapsedMicroseconds - gpuStarted;
      if (more) waiting = true;
    }
    final viewMatrix = view?.matrix(
      originX: camera.origin.dx,
      originY: camera.origin.dy,
    );
    // The runs from [from] to [to] in the style's order: the GPU's images
    // of the vector layers laid between the canvas's backgrounds and
    // rasters.
    void drawRuns(int from, int to) {
      void begin() {
        canvas.save();
        if (canvasHorizon > 0) _clipGround(canvas, view!, canvasHorizon);
        canvas.transform(viewMatrix!);
      }

      if (viewMatrix != null) begin();
      for (var index = from; index < to; index++) {
        final run = sheet.runs[index];
        if ((run.background >= 0 || run.raster >= 0) &&
            onGpu &&
            viewMatrix != null) {
          canvas.restore();
          gpu.presentUntil(canvas, index);
          begin();
        }
        if (run.background >= 0) {
          if (drape) continue;
          _meshes.drawBackground(
            canvas,
            sheet.backgrounds[run.background],
            camera,
          );
          continue;
        }
        if (run.raster >= 0) {
          _rasters[run.raster].paint(
            canvas,
            _context,
            camera.zoom,
            camera.origin,
            size,
            view: view,
            drape: drape,
          );
          continue;
        }
        if (onGpu) continue;
        final whole = sheet.runOpacity(run, _context);
        if (whole == 0) continue;
        if (whole != null && whole < 1) {
          canvas.saveLayer(
            null,
            _layerPaint..color = ui.Color.fromRGBO(0, 0, 0, whole),
          );
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
        if (whole != null && whole < 1) canvas.restore();
      }
      if (viewMatrix != null) canvas.restore();
    }

    drawRuns(0, sheet.labelsRun);

    if (view != null) {
      if (onGpu) {
        gpu.presentUntil(canvas, sheet.labelsRun);
      } else if (sheet.extrusions.isNotEmpty) {
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
    if (horizon > 0) canvas.restore();

    var animating =
        (sheet.dashed && _zoomHistory.fading) ||
        _rasters.any((r) => r is TileDrawing && r.fading);
    final labelsStarted = _clock.elapsedMicroseconds;
    if (_labelOptions.visible) {
      final shown = [
        for (final s in _sources) ...[...s.ideal, ...s.fallback],
      ];
      _labels.occlusion.update(view, shown, sheet, styleZoom);
      if (_transitions.isNotEmpty) {
        final symbols = {for (final s in sheet.symbols) s.id};
        if (_transitions.values.any((t) => symbols.contains(t.layer))) {
          _labels.placeNow();
        }
      }
      final labelsMoving = _labels.paint(
        canvas,
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
        size: size,
        rotation: camera.rotation,
        devicePixelRatio: camera.devicePixelRatio,
        dt: dt,
        rasterBudgetMicros: _budget.spent > 1000 ? 1 : _labelBudgetMicros,
        styleNowMs: _clock.elapsedMilliseconds.toDouble(),
        zooming: _budget.zooming,
        view: view,
        ground: _groundOf(view),
        perMetre: _labelPerMetre(view),
        seaLevel: onGpu && gpu.terrain != null
            ? -gpu.terrain!.centre * _labelPerMetre(view)
            : 0,
        sdf: onGpu ? gpu.sdfText : null,
      );
      animating = animating || labelsMoving;
    }
    if (sheet.labelsRun < sheet.runs.length) {
      // As MapLibre draws in the style's order: what the style puts after
      // its last symbol layer goes over the labels.
      if (horizon > 0) {
        canvas.save();
        _clipGround(canvas, view!, horizon);
      }
      drawRuns(sheet.labelsRun, sheet.runs.length);
      if (view != null && onGpu) gpu.presentUntil(canvas, sheet.runs.length);
      if (horizon > 0) canvas.restore();
    }
    final globeView = view?.globe;
    final sky = sheet.sky;
    if (globeView != null && sky != null) {
      final blend = asNumber(sky.atmosphereBlend(_context))?.toDouble() ?? 0.8;
      if (blend > 0) {
        _unroll(canvas, view!);
        final b = view.unrolledBounds;
        if (!_atmosphere.paint(
          canvas,
          size,
          ui.Rect.fromLTRB(b.left, b.top, b.right, b.bottom),
          globeView,
          blend,
          sheet.light,
        )) {
          waiting = true;
        }
        canvas.restore();
      }
    }
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
            'z=${camera.zoom.toStringAsFixed(2)} '
            'tiles=$ideal+$fallback cached=$cached',
      );
    timings.labels.take(_labels.work);
    if (holes > 0) timings.framesWithHoles++;
    if (_transitions.isNotEmpty) {
      final now = _clock.elapsedMilliseconds.toDouble();
      if (_transitions.values.every((t) => t.over(now))) {
        // Done: the plain values take over, after this frame.
        _transitions.clear();
        scheduleMicrotask(() {
          final base = _base;
          if (base != null && !_disposed) {
            _apply(base, _style, keepLabels: true);
          }
        });
      } else {
        animating = true;
      }
    }
    // Tiles held while zooming out are swapped for the new zoom's once the
    // hold ends, which a frame then has to draw.
    stats
      ..busy = animating || waiting || _budget.stale || hold > 0
      ..preparing = waiting;
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
          (_terrain?.waiting ?? 0)
      ..resourcesLoading = _resources.loading + _labels.glyphsLoading
      ..drawCalls = draws
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
    _buildings.dispose();
    _renderer?.dispose();
    _resources.dispose();
    _meshes.dispose();
    for (final r in _rasters) {
      r.close();
    }
    _terrain?.close();
    super.dispose();
  }
}

/// A paint property passing from one value to another.
class _Transition {
  _Transition(
    this.layer,
    this.key,
    this.from,
    this.to,
    this.startMs,
    this.duration,
    this.delay,
  );

  final String layer, key;
  final Object? from, to;
  final double startMs, duration, delay;

  bool over(double nowMs) => nowMs >= startMs + delay + duration;

  /// The property's value as an expression of the frame's time.
  List<Object?> get expression => [
    r'$transition',
    _quoted(from),
    _quoted(to),
    startMs,
    duration,
    delay,
  ];

  /// [v] as an expression: a list that is not one is a literal.
  static Object? _quoted(Object? v) =>
      v is List && (v.isEmpty || v.first is! String) ||
          v is Map && !_isFunction(v)
      ? ['literal', v]
      : v;

  static bool _isFunction(Map<Object?, Object?> v) =>
      v.containsKey('stops') || v.containsKey('property');
}
