import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';

import 'canvas/atmosphere.dart';
import 'canvas/backdrop.dart';
import 'canvas/canvas_map.dart';
import 'camera/camera.dart';
import 'style/expr.dart';
import 'tiles/feature_states.dart';
import 'render/frame_planes.dart';
import 'render/map_renderer.dart';
import 'labels/label_state.dart';
import 'labels/labels.dart';
import 'raster/raster.dart';
import 'style/raster_style.dart';
import 'style/style_resources.dart';
import 'terrain/raised_ground.dart';
import 'terrain/terrain.dart' show Terrain;
import 'camera/view.dart' show MapView;
import 'canvas/mesh_painter.dart';
import 'stats.dart';
import 'style/transitions.dart';
import 'style/style_model.dart';
import 'tiles/built_tile.dart';
import 'tiles/tiles.dart';
import 'render/frame_pacing.dart';
import 'render/zoom_history.dart';

/// Saves [canvas] and turns it so the unrolled picture of [view] lands
/// where its [MapView.roll] puts it.
void _unroll(ui.Canvas canvas, MapView view) {
  canvas.save();
  if (view.roll == 0) return;
  final (:x, :y) = view.screenCenter;
  canvas
    ..translate(x, y)
    ..rotate(-view.roll * math.pi / 180)
    ..translate(-x, -y);
}

/// The ground below [horizon] in the unrolled picture, as the screen shows
/// it.
List<ui.Offset> _groundOutline(MapView view, double horizon) {
  final b = view.unrolledBounds;
  ui.Offset at(double x, double y) {
    if (view.roll == 0) return ui.Offset(x, y);
    final c = view.rolled(x, y);
    return ui.Offset(c.x, c.y);
  }

  return [
    at(b.left, horizon),
    at(b.right, horizon),
    at(b.right, b.bottom),
    at(b.left, b.bottom),
  ];
}

/// Clips [canvas] to the ground below [horizon] in the unrolled picture.
void _clipGround(ui.Canvas canvas, MapView view, double horizon) {
  final b = view.unrolledBounds;
  if (view.roll == 0) {
    canvas.clipRect(ui.Rect.fromLTRB(b.left, horizon, b.right, b.bottom));
    return;
  }
  canvas.clipPath(ui.Path()..addPolygon(_groundOutline(view, horizon), true));
}

/// How many worlds east of the first the copy [d] is drawn in lies.
int _wrapOf(TileDraw d, MapFrame camera) {
  final n = 1 << d.tile.id.z;
  final column = ((d.left + camera.origin.dx) / d.size).round();
  return ((column - d.tile.id.x) / n).floor();
}

/// Draws the engine's frames, and keeps what carries from one frame to the
/// next: the time spent, the zoom history, and what draws.
class FramePainter {
  FramePainter({
    required this._sources,
    required this._rasters,
    required this._labels,
    required this._markerLabels,
    required this._ground,
    required this._resources,
    required this._states,
    required this._transitions,
    required this._context,
    required this._clock,
    required this._stats,
    required this._gpu,
    required this._maxCachedTiles,
    required this._host,
  });

  final List<TileSource> _sources;
  final List<RasterDrawing<RasterLayer>> _rasters;
  final LabelEngine _labels;
  final List<LabelCandidate> _markerLabels;
  final RaisedGround _ground;
  final StyleResources _resources;
  final FeatureStates _states;
  final PaintTransitions _transitions;
  final EvalContext _context;
  final Stopwatch _clock;
  final VmapStats _stats;
  final MapRenderer? _gpu;
  final int _maxCachedTiles;
  final FrameHost _host;
  final FrameBudget _budget = FrameBudget();
  late final MeshPainter _meshes = MeshPainter(_budget, _stats, _context);
  late final CanvasMap _canvas = CanvasMap(_meshes);

  /// How long the last frames took, which the work that may wait is shared
  /// out by: smaller shares while the map runs long, larger ones while it
  /// runs short, so no frame spends so much on tiles or label text that the
  /// one after it comes late.
  final FramePacing _pacing = FramePacing();

  /// The tiles in view, in one list kept from frame to frame so a frame does
  /// not build it anew.
  final List<TileDraw> _shown = [];

  /// Frames painted, which tiles are aged by.
  int frame = 0;

  /// The camera of the last frame, raised onto the ground or the globe.
  MapFrame? lastCamera;

  /// What draws the flat layers and buildings now: the GPU renderer where
  /// it runs and supports the style, else the canvas.
  late MapRenderer current = _canvas;

  /// Whether the canvas draws the map now, not the GPU.
  bool get drawsWithCanvas => identical(current, _canvas);

  /// Makes room for a style of [layers] layers.
  void resize(int layers) => _meshes.resize(layers);

  int _lastPaintMicros = 0;
  int _buildingMicros = 0;
  double _lastZoom = 0;
  final ZoomHistory _zoomHistory = ZoomHistory();
  final Atmosphere _atmosphere = Atmosphere();
  late final Backdrop _backdrop = Backdrop(_context);

  /// Draws one frame of [sheet] as [camera] sees it; with [labelsVisible]
  /// off, without labels.
  void paint(
    ui.Canvas canvas,
    MapFrame camera,
    StyleSheet? sheet, {
    required bool labelsVisible,
    FramePlanes? planes,
  }) {
    frame++;
    lastCamera = camera;
    final now = _clock.elapsedMicroseconds;
    final dt = _lastPaintMicros == 0
        ? 0.0
        : math.min(0.1, (now - _lastPaintMicros) / 1e6);
    _lastPaintMicros = now;
    if (sheet == null) return;
    if (_gpu?.loading ?? false) {
      _paintWhileLoading(canvas, camera.size, sheet);
      return;
    }
    final f = _startFrame(canvas, camera, sheet, now, dt, planes)
      ..labelsVisible = labelsVisible;
    _coverTiles(f);
    _drawSky(f);
    _drawBelowLabels(f);
    _drawLabels(f);
    _drawAboveLabels(f);
    _drawAtmosphere(f);
    _finishFrame(f);
  }

  /// The background alone, while the GPU's shaders load.
  void _paintWhileLoading(ui.Canvas canvas, ui.Size size, StyleSheet sheet) {
    if (Rgba.of(sheet.background(_context)) case final color?) {
      canvas.drawRect(
        ui.Offset.zero & size,
        ui.Paint()..color = ui.Color(color.toArgb()),
      );
    }
    _stats
      ..busy = true
      ..preparing = true;
    _host.requestFrame();
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
    FramePlanes? planes,
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
    _backdrop.startFrame();
    _budget.start(
      zooming: (camera.zoom - _lastZoom).abs() > 0.002,
      limit: _pacing.prepMicros,
    );
    _labels.placeSliceMicros = _pacing.placeSliceMicros;
    final gpu = _gpu;
    _use(gpu != null && gpu.supports(sheet) ? gpu : _canvas);
    final renderer = current;
    final threeD = renderer.drawsIn3d;
    var waiting = false;
    final globeness = threeD ? sheet.projection.globeAt(styleZoom) : 0.0;
    if (globeness > 0) {
      camera = camera.withView(
        camera.view.withGlobe(globeness),
        camera.ahead?.withGlobe(globeness),
      );
    }
    _lastZoom = camera.zoom;
    if (threeD) {
      final view = camera.view;
      final (view: raised, :easing) = _ground.raise(view);
      if (easing) {
        waiting = true;
        _host.requestFrame();
      }
      if (!identical(raised, view)) {
        camera = camera.withView(
          raised,
          camera.ahead?.withGround(raised.groundElevation, raised.groundLowest),
        );
      }
    }
    lastCamera = camera;
    final view = camera.view;
    final terrain = threeD ? _ground.terrain : null;
    final drape = threeD && (terrain != null || view.globe != null);
    // Raised ground is cut by the renderer's far plane instead, as hills
    // nearer than it rise above the flat ground's far edge. So are the
    // GPU's layers past 60 degrees, as buildings near the far plane stand
    // above that edge; only what the canvas draws is cut at it.
    final farCut = threeD && !drape && view.pitch > 60;
    return _Frame(
      canvas: canvas,
      planes: planes,
      camera: camera,
      view: view,
      sheet: sheet,
      renderer: renderer,
      terrain: terrain,
      dataZoom: dataZoom,
      styleZoom: styleZoom,
      now: now,
      dt: dt,
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
        frame: frame,
        nowMs: _clock.elapsedMilliseconds,
        prepare: _prepare,
        variableZoom: _ground.tiles != null && f.renderer.drawsIn3d,
        standing: f.sheet.buildingSources.contains(s.pool.source),
      );
      if (preparing) f.waiting = true;
      if (s.retrying) _host.requestFrameLater();
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
      _backdrop.drawSky(
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
    final sheet = f.sheet, renderer = f.renderer;
    _cutAtHorizon(f);
    final started = _clock.elapsedMicroseconds;
    _stats.drawCalls = 0;
    if (f.drape) _collectRasters(f);
    if (renderer.paint(
      f.canvas,
      RenderFrame(
        view: f.view,
        origin: f.camera.origin,
        sheet: sheet,
        fallback: [for (final s in _sources) s.fallback],
        ideal: [for (final s in _sources) s.ideal],
        context: _context,
        styleZoom: f.styleZoom,
        devicePixelRatio: f.camera.devicePixelRatio,
        sprites: _resources.sprites,
        terrain: f.terrain,
        rasters: f.drape ? [for (final r in _rasters) r.drawn] : const [],
        states: [for (final s in _sources) _states.of(s.def.name)],
        dashFade: _zoomHistory.fade,
        transitioning: _host.transitionsRunning,
        stats: _stats,
        planes: f.planes,
      ),
    )) {
      f.waiting = true;
    }
    _drawRuns(f, 0, sheet.labelsRun);
    // With no horizon to cut the map at, the renderer may draw the labels'
    // text into the map's image, which is then laid down after them.
    f.textInMap =
        f.labelsVisible && f.horizon <= 0 && renderer.textInto(sheet.labelsRun);
    if (!f.textInMap) _present(f, sheet.labelsRun);
    _buildingMicros = _clock.elapsedMicroseconds - started;
    _uncut(f);
  }

  /// Cuts what is drawn next at the horizon, when the frame has one.
  void _cutAtHorizon(_Frame f) {
    if (f.horizon <= 0) return;
    f.canvas.save();
    _clipGround(f.canvas, f.view, f.horizon);
    f.planes?.clip = _groundOutline(f.view, f.horizon);
  }

  void _uncut(_Frame f) {
    if (f.horizon <= 0) return;
    f.canvas.restore();
    f.planes?.clip = null;
  }

  /// Lays the renderer's layers before style run [run] down. On the web
  /// they go into a page element and the frame goes on in a new picture,
  /// cut at the horizon as the one before was.
  void _present(_Frame f, int run) {
    if (f.renderer.presentUntil(f.canvas, run)) f.waiting = true;
    final planes = f.planes;
    if (planes == null || identical(planes.canvas, f.canvas)) return;
    f.canvas = planes.canvas;
    if (planes.clip != null) {
      f.canvas.save();
      _clipGround(f.canvas, f.view, f.horizon);
    }
  }

  /// The style's backgrounds and raster layers from run [from] to [to], with
  /// the renderer's vector layers before each laid down first, so all of
  /// them come in the style's order.
  void _drawRuns(_Frame f, int from, int to) {
    final sheet = f.sheet;
    for (var index = from; index < to; index++) {
      final run = sheet.runs[index];
      if (run.background < 0 && run.raster < 0) continue;
      if (run.background >= 0 && f.drape) continue;
      _present(f, index);
      final canvas = f.canvas..save();
      if (f.canvasHorizon > 0) _clipGround(canvas, f.view, f.canvasHorizon);
      canvas.transform(f.viewMatrix);
      if (run.background >= 0) {
        _backdrop.drawBackground(
          canvas,
          sheet.backgrounds[run.background],
          f.camera,
          _resources.sprites,
        );
      } else if (!f.drape || _rasters[run.raster] is PictureDrawing) {
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

  /// Lays out this frame's raster tiles for the GPU to drape before it
  /// draws: laid out after, the ground would wear the last frame's, a frame
  /// behind the camera. Only a picture source draws on the canvas here, and
  /// it is drawn again in its place among the layers.
  void _collectRasters(_Frame f) {
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder);
    for (final raster in _rasters) {
      raster.paint(
        canvas,
        _context,
        f.camera.zoom,
        f.camera.origin,
        f.camera.size,
        view: f.view,
        drape: true,
      );
    }
    recorder.endRecording().dispose();
  }

  void _drawLabels(_Frame f) {
    final sheet = f.sheet, camera = f.camera, view = f.view;
    f.animating =
        (sheet.dashed && _zoomHistory.fading) ||
        _rasters.any((r) => r is TileDrawing && r.fading);
    f.labelsStarted = _clock.elapsedMicroseconds;
    if (!f.labelsVisible) return;
    final shown = _shown..clear();
    for (final s in _sources) {
      shown
        ..addAll(s.ideal)
        ..addAll(s.fallback);
    }
    _labels.occlusion.update(view, shown, sheet, f.styleZoom);
    if (_transitions.isNotEmpty &&
        _transitions.touches({for (final s in sheet.symbols) s.id})) {
      _labels.placeNow();
    }
    final recorder = f.textInMap ? ui.PictureRecorder() : null;
    final moving = _labels.paint(
      recorder == null ? f.canvas : ui.Canvas(recorder),
      camera,
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
      dt: f.dt,
      // Text drawn anew waits a frame when tiles took this one's time
      // already, so the two costs never land on the same frame.
      rasterBudgetMicros: _budget.spent > 1000
          ? 1
          : _pacing.labelRasterMicros,
      styleNowMs: _clock.elapsedMilliseconds.toDouble(),
      zooming: _budget.zooming,
      terrain: f.terrain,
      sdf: f.renderer.sdfText,
    );
    // The text may have gone into a page element, the frame on in a new
    // picture over it.
    if (f.planes?.canvas case final canvas?) f.canvas = canvas;
    if (recorder != null) {
      _present(f, sheet.labelsRun);
      f.canvas.drawPicture(recorder.endRecording());
      if (f.renderer.sdfText case final sdf?) f.canvas = sdf.layKept(f.canvas);
    }
    f.animating = f.animating || moving;
  }

  /// What the style puts after its last symbol layer, which goes over the
  /// labels, as MapLibre draws in the style's order.
  void _drawAboveLabels(_Frame f) {
    final sheet = f.sheet;
    if (sheet.labelsRun >= sheet.runs.length) return;
    _cutAtHorizon(f);
    _drawRuns(f, sheet.labelsRun, sheet.runs.length);
    _present(f, sheet.runs.length);
    _uncut(f);
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
        if (!s.retries.resting(id, _clock.elapsedMilliseconds)) loading++;
      }
      unpack = math.max(unpack, s.pool.takeMaxUnpackMicros());
    }
    // What this frame cost decides how much of the next one may wait: the
    // average of the last twenty, so a single slow frame changes nothing.
    _pacing.addFrame(finished - now);
    var rasterLoading = 0;
    for (final r in _rasters) {
      if (r is TileDrawing) rasterLoading += r.waiting;
    }
    final timings = _stats.timings
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
            'pressure=${_pacing.pressure} '
            'z=${f.camera.zoom.toStringAsFixed(2)} '
            'tiles=$ideal+$fallback cached=$cached',
      );
    timings.labels.take(_labels.work);
    if (holes > 0) timings.framesWithHoles++;
    if (_host.transitionsRunning) f.animating = true;
    _stats
      ..busy = f.animating || f.waiting || _budget.stale
      ..preparing = f.waiting;
    if (_stats.busy) {
      _host.requestFrame();
    } else {
      _lastPaintMicros = 0;
    }
    _stats
      ..tilesDrawn = ideal
      ..fallbackTiles = fallback
      ..tilesCached = cached
      ..labelStates = _labels.stateCount
      ..labelSprites = _labels.spriteCount
      ..pressure = _pacing.pressure
      ..tilesLoading = loading + rasterLoading + (_ground.tiles?.waiting ?? 0)
      ..resourcesLoading = _resources.loading + _labels.glyphsLoading;
    for (final s in _sources) {
      // As MapLibre sizes its tile cache: about five screens of tiles, so
      // panning back or zooming out and in again finds them built.
      final screen = s.ideal.length + s.fallback.length;
      s.evict(math.max(_maxCachedTiles, 5 * screen), frame);
    }
  }

  /// Draws with [next] from this frame, which makes ready again the tiles
  /// it can build and leaves the rest to be fetched again.
  void _use(MapRenderer next) {
    if (identical(next, current)) return;
    current = next;
    for (final s in _sources) {
      for (final tiles in [s.tiles, s.previous]) {
        tiles.removeWhere((_, t) {
          if (next.canBuild(t)) {
            t.releaseRenderer();
            return false;
          }
          t.dispose();
          return true;
        });
      }
    }
  }

  void _prepare(LoadedTile tile, double scale) {
    if (_budget.spentUp) return;
    final started = _clock.elapsedMicroseconds;
    tile.prepare(
      scale,
      _clock,
      started + _budget.limit - _budget.spent,
      renderer: current,
    );
    final spent = _clock.elapsedMicroseconds - started;
    _budget.spent += spent;
    _stats.timings.tileSetup(spent);
  }

  void dispose() {
    _canvas.dispose();
    _meshes.dispose();
  }

  void _prepareBackdrop(double zoom) {
    if (_budget.spentUp) return;
    for (final s in _sources) {
      for (final tile in s.tiles.values) {
        if (tile.prepared || tile.waitsForRenderer) continue;
        _prepare(tile, 256.0 * math.pow(2, zoom - tile.id.z) / tileExtent);
        _budget.stale = true;
        return;
      }
    }
  }
}

/// What a [FramePainter] asks of the engine it paints for.
abstract interface class FrameHost {
  /// Asks for the next frame.
  void requestFrame();

  /// Asks for a frame in a few seconds, to try again what failed.
  void requestFrameLater();

  /// Whether a paint transition is still running; one that ended hands
  /// over to the plain values.
  bool get transitionsRunning;
}

/// What one frame draws with, handed between the steps of the engine's
/// paint.
class _Frame {
  _Frame({
    required this.canvas,
    required this.planes,
    required this.camera,
    required this.view,
    required this.sheet,
    required this.renderer,
    required this.terrain,
    required this.dataZoom,
    required this.styleZoom,
    required this.now,
    required this.dt,
    required this.drape,
    required this.horizon,
    required this.canvasHorizon,
    required this.viewMatrix,
  });

  /// What the frame draws on now: on the web, a new picture after each of
  /// the GPU's images.
  ui.Canvas canvas;
  final FramePlanes? planes;
  final MapFrame camera;
  final MapView view;
  final StyleSheet sheet;

  /// What draws the vector layers and buildings this frame.
  final MapRenderer renderer;

  /// The raised ground's heights, null for flat ground or the canvas.
  final Terrain? terrain;
  final double dataZoom, styleZoom;

  /// When the frame began, in microseconds of the engine's clock.
  final int now;

  /// Seconds since the frame before, at most a tenth.
  final double dt;

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
  bool labelsVisible = true;

  /// Whether the renderer draws the labels' text into the map's image.
  bool textInMap = false;
}
