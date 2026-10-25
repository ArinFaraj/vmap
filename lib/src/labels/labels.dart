import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show visibleForTesting;

import 'collision_boxes.dart';
import '../style/expr.dart';
import '../style/format.dart';
import 'label_painter.dart';
import 'label_text_painter.dart';
import 'text_style.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'label_style.dart';
import 'occlusion.dart';
import '../text/glyphs/cursive.dart';
import '../text/glyphs/glyph_layout.dart';
import '../text/glyphs/glyph_pages.dart';
import '../text/glyphs/glyph_ranges.dart';
import 'label_order.dart';
import 'label_rules.dart';
import 'label_view.dart';
import '../camera/camera.dart';
import '../net/net.dart' show FetchBytes;
import '../style/pins.dart';
import 'point_labels.dart';
import 'road_labels.dart';
import 'road_placement.dart';
import 'sdf_text.dart';
import '../options.dart';
import '../style/sprites.dart';
import '../stats.dart';
import '../terrain/terrain.dart';
import '../text/bidi.dart' show textIsRightToLeft;
import '../style/style_model.dart';

/// Chooses which labels show, fades them, and draws them. Text is laid out by
/// the engine's own text stack, so joined scripts shape correctly.
class LabelEngine {
  LabelEngine(VmapTextStyle text) : this._(text, LabelView());
  LabelEngine._(VmapTextStyle text, this._view)
    : _style = LabelStyle(text, _view);

  final LabelView _view;
  final LabelStyle _style;

  /// Buildings that hide labels on a tilted map; placement leaves those
  /// labels out, so they fade.
  final occlusion = BuildingOcclusion();

  VmapTextStyle get text => _style.text;
  set text(VmapTextStyle value) => _style.text = value;

  List<SymbolLayer> get symbols => _style.symbols;
  set symbols(List<SymbolLayer> value) => _style.symbols = value;

  /// The style's icons. Null until they have loaded.
  SpriteSheet? get sheet => _style.sheet;
  set sheet(SpriteSheet? value) {
    _style.sheet = value;
    for (final st in _allStates) {
      st.icon = null;
    }
    _placeAgain = true;
  }

  /// Pins drawn in place of the style's icons. Null draws the style's own.
  VmapPins? get pins => _points.pins;
  set pins(VmapPins? value) {
    if (identical(value, _points.pins)) return;
    _points.pins = value;
    _painter.dropPins();
    _placeAgain = true;
  }

  double zoomOffset = 0;

  static const double _fadeSeconds = 0.3;

  /// Candidates weighed per placement, best priority first. The rest are the
  /// least important street names and wait for a closer zoom.
  static const int _maxConsidered = 1500;

  static const int _placementIntervalMs = 90;
  static const int _zoomingIntervalMs = 350;

  /// The state the app has given a feature of a source, for paint that
  /// reads `feature-state`.
  set stateOf(Map<String, Object?>? Function(int source, Object? id)? value) =>
      _style.stateOf = value;

  /// Places and colours every label again on the next frame, each keeping
  /// how far it has faded in, as MapLibre keeps them through a change of
  /// paint. A sprite whose colours changed is drawn again by its key.
  void restyle() => _placeAgain = true;

  /// Glyph ranges asked for and not here yet, which labels wait on.
  int get glyphsLoading => _sprites.ranges?.pending ?? 0;

  /// Places the labels again in the next frame, however soon after the
  /// last placement, while a paint property they are placed by changes.
  void placeNow() {
    _placeAgain = true;
    _placedAtMs = -1000000;
  }

  /// A frame that spent this long placing labels draws no new text images;
  /// they wait a frame, so the two costs never land on the same one.
  static const int _heavyPlaceMicros = 800;

  /// Label states by key; a key holds more than one when places of one
  /// name share a cell, told apart by distance.
  final Map<String, List<LabelState>> _states = {};

  Iterable<LabelState> get _allStates => _states.values.expand((s) => s);
  final VmapLabelWork work = VmapLabelWork();
  late final LabelSprites _sprites = LabelSprites(work, _style);
  final List<LabelState> _frameStates = [];

  /// The labels that are showing or fading, which is all a frame draws.
  final List<LabelState> _live = [];
  final Stopwatch _clock = Stopwatch()..start();
  int _pass = 0;
  int _placedAtMs = -1000;
  double _placedZoom = -1;
  int _placedSourcesKey = 0;
  ui.Offset _placedOrigin = ui.Offset.zero;
  bool _placeAgain = false;
  int lastPlaceMicros = 0;

  /// Areas labels keep clear of: anchor as fractions of the world, size in
  /// screen pixels, then how far the area's centre sits from the anchor.
  List<LabelObstacle> get obstacles => _points.obstacles;
  set obstacles(List<LabelObstacle> value) {
    _points.obstacles = value;
    _placeAgain = true;
  }

  double _lastZoom = 0;

  final CollisionBoxes _boxes = CollisionBoxes();

  /// Labels of different sources keep clear of each other, as MapLibre's
  /// `crossSourceCollisions`. Off, each source's labels only mind their
  /// own, and the app's reserved areas.
  bool crossSourceCollisions = true;
  late final RoadLabels _roads = RoadLabels(_view, _boxes);
  late final LabelPainter _painter = LabelPainter(_view, _style);
  late final LabelTextPainter _text = LabelTextPainter(_view, _roads, _style);
  late final PointLabels _points = PointLabels(_view, _boxes, _roads, _style);
  late final RoadPlacement _road = RoadPlacement(
    _view,
    _boxes,
    _roads,
    _points,
    _style,
  );
  late final LabelOrder _order = LabelOrder(_view, _style);

  /// Road names follow bends. Off, a name is only written where the road is
  /// straight enough to carry it.
  bool get curvedRoads => _roads.curved;
  set curvedRoads(bool value) {
    if (value == _roads.curved) return;
    _roads.curved = value;
    clear();
  }

  double _placedTilt = 0;

  /// While the zoom is changing a label's image is stretched further before
  /// it is drawn again, and sharpened once the zoom rests.
  bool _zooming = false;
  int lastRasterMicros = 0;
  int get stateCount => _allStates.length;

  /// Every map label as last placed, for tools that compare placement with
  /// another renderer: its layer, text, icon, point as fractions of the
  /// world, what of it shows and its size against its image's.
  List<Map<String, Object?>> debugLabels(StyleSheet sheet) => [
    for (final st in _allStates)
      if (st.candidate case final TileLabel c)
        {
          'layer': sheet.symbols[c.tile.layer].id,
          'tileZ': (math.log(1 / c.tileSpan) / math.ln2).round(),
          'text': c.text,
          'icon': c.tile.icon,
          'x': c.worldX,
          'y': c.worldY,
          'placed': st.placed,
          'text_shown': st.placed && st.showText,
          'icon_shown': st.placed && st.showIcon,
          'order': st.placeOrder,
          'scale': st.scale,
          'anchor': switch (sheet.symbols[c.tile.layer].anchors) {
            final sides when st.side < sides.length => sides[st.side],
            _ => null,
          },
        },
  ];

  /// The collision boxes the last placement took: see
  /// [CollisionBoxes.taken].
  List<double> get debugBoxes => _boxes.taken;

  int get spriteCount => _sprites.length;

  int get shown => _allStates.where((s) => s.opacity > 0).length;

  /// The keys of the labels showing.
  @visibleForTesting
  Set<String> get shownKeys => {
    for (final st in _live)
      if (st.opacity > 0) st.candidate.key,
  };

  /// The state [c] carries on from. A key names a text in a coarse cell of
  /// the world, so a place keeps its state as it shifts a little between
  /// zoom levels; within the cell, states are told apart by distance, as
  /// MapLibre's cross tile index does, so two places of one name both show.
  /// Null when another tile's copy of the same label came first this pass.
  LabelState? _stateFor(LabelCandidate c, double world) {
    const near = _sameLabelPx * _sameLabelPx;
    final same = _states[c.key] ??= [];
    for (final st in same) {
      if (_sameTileApart(st.candidate, c)) continue;
      final dx = (st.candidate.worldX - c.worldX) * world;
      final dy = (st.candidate.worldY - c.worldY) * world;
      if (dx * dx + dy * dy > near) continue;
      return st.seenPass == _pass ? null : st;
    }
    final made = LabelState(c);
    same.add(made);
    return made;
  }

  /// Whether [a] and [b] are two features of one tile, which are never the
  /// same label however close: MapLibre only joins copies across tiles.
  static bool _sameTileApart(LabelCandidate a, LabelCandidate b) =>
      a is TileLabel &&
      b is TileLabel &&
      !identical(a.tile, b.tile) &&
      a.tileX == b.tileX &&
      a.tileY == b.tileY &&
      a.tileSpan == b.tileSpan;

  /// How far apart in pixels two labels of one text in one cell may be and
  /// still be the same label.
  static const double _sameLabelPx = 3;

  GlyphPages? _glyphPages;

  /// Shapes and draws text with [fonts] from now on, where they cover it.
  void useGlyphs(GlyphFonts fonts) {
    _glyphPages?.dispose();
    final pages = _glyphPages = GlyphPages(fonts);
    _sprites.glyphFonts = fonts;
    _text.glyphs = pages;
    clear();
  }

  bool get _glyphText => _glyphPages != null;

  String? _rangesUrl;

  /// Draws labels from the glyph ranges at [url], a style's `glyphs`,
  /// fetched with [config], as MapLibre draws them; from the font files
  /// when it is null. [onArrived] runs as each range lands.
  void useRanges(
    String? url,
    VmapNetworkOptions config,
    void Function() onArrived, {
    void Function(Object error)? onError,
    FetchBytes? fetch,
  }) {
    if (url == _rangesUrl) return;
    _rangesUrl = url;
    _sprites.ranges?.close();
    _sprites.ranges = url == null
        ? null
        : GlyphRanges(
            url,
            userAgent: config.userAgent,
            headers: config.headers,
            fetch: fetch,
            onLoaded: (face, glyphs) {
              _glyphPages?.addPbf(face, glyphs);
              onArrived();
            },
            onError: onError,
          );
    _style.rules = url == null ? LabelRules.vmap : LabelRules.mapLibre;
    clear();
  }

  /// The camera of the frame before, which [LabelView.still] compares.
  (double, ui.Offset, double)? _frameCamera;

  int get rangesPending => _sprites.ranges?.pending ?? 0;

  /// Glyphs drawn into pages in the last frame, and what that cost.
  int get glyphsRasterized => _glyphPages?.lastRasterized ?? 0;
  int get glyphRasterMicros => _glyphPages?.lastRasterMicros ?? 0;
  int get glyphPageCount => _glyphPages?.pageCount ?? 0;

  void disposeGlyphs() {
    _glyphPages?.dispose();
    _glyphPages = null;
  }

  /// Lets go of the label images not drawn in the last pass.
  void trimMemory() => _sprites.drop(_pass);

  /// Records each weighed label's boxes and draws them over the labels.
  bool get showCollisionBoxes => _points.debugBoxes != null;
  set showCollisionBoxes(bool value) {
    _points.debugBoxes = value ? [] : null;
    _placeAgain = true;
  }

  void clear() {
    _sprites.clear();
    _painter.dropPins();
    _states.clear();
    _frameStates.clear();
    _live.clear();
    _placeAgain = true;
  }

  /// Returns true while another frame is needed: a fade is running, a label
  /// is waiting to be drawn, or the camera moved since labels were last placed.
  bool paint(
    ui.Canvas canvas,
    MapFrame camera, {
    required Iterable<List<LabelCandidate>> sources,
    required int sourcesKey,
    required int background,
    required double dt,
    required int rasterBudgetMicros,
    required bool zooming,
    Terrain? terrain,
    SdfText? sdf,
    double styleNowMs = 0,
  }) {
    lastPlaceMicros = 0;
    _style.context.nowMs = styleNowMs;
    final MapFrame(:zoom, :origin, :size, :view) = camera;
    _view.frame(camera, terrain);
    final world = _view.world;
    // Text from glyph ranges is drawn by the renderer as distance fields
    // where it can, on the unturned screen of a projected view.
    final ranges = _sprites.ranges;
    final sdfText = _view.sdf = ranges != null ? sdf : null;
    sdfText?.begin(size, camera.devicePixelRatio, ranges!.glyph);
    final tilt = Object.hash(view.pitch, view.bearing, view.roll).toDouble();
    if (_zooming && !zooming) _placeAgain = true;
    _zooming = zooming;
    _view.moving = zooming;
    final frameKey = (zoom, origin, tilt);
    _view.still = frameKey == _frameCamera;
    _frameCamera = frameKey;
    final nowMs = _clock.elapsedMilliseconds;
    final moved =
        zoom != _placedZoom ||
        origin != _placedOrigin ||
        tilt != _placedTilt ||
        sourcesKey != _placedSourcesKey;
    // A frame after the camera stops puts the labels back on the pixels.
    var pending = !_view.still;
    if (moved || _placeAgain) {
      final zoomingOut = zoom < _lastZoom;
      final interval = !zooming || zoomingOut || _placedZoom - zoom > 0.4
          ? _placementIntervalMs
          : _zoomingIntervalMs;
      if (nowMs - _placedAtMs >= interval) {
        final t0 = _clock.elapsedMicroseconds;
        _place(sources, zoom, world, origin, size);
        lastPlaceMicros = _clock.elapsedMicroseconds - t0;
        _placedAtMs = nowMs;
        _placedZoom = zoom;
        _placedOrigin = origin;
        _placedTilt = tilt;
        _placedSourcesKey = sourcesKey;
        if (_placeAgain) pending = true;
      } else {
        pending = true;
      }
    }

    var rasterized = 0;
    final rasterStart = _clock.elapsedMicroseconds;
    bool timeUp() =>
        _clock.elapsedMicroseconds - rasterStart > rasterBudgetMicros;
    final layoutZoom = zoom - 1 + zoomOffset;
    for (final st in _frameStates) {
      if (st.sprite?.dropped ?? false) {
        st.sprite = _sprites[_style.spriteKey(st)];
      }
      if (!st.placed || st.seenPass != _pass) continue;
      if (!st.candidate.hasText || !st.showText) continue;
      final key = _style.spriteKey(st);
      if (st.sprite != null && !st.resize && st.spriteKey == key) continue;
      var cached = _sprites[key];
      if (identical(cached, st.sprite)) cached = null;
      if (cached == null &&
          (lastPlaceMicros > _heavyPlaceMicros ||
              (rasterized > 0 && timeUp()))) {
        pending = true;
        break;
      }
      final resized = st.sprite != null;
      if (!_dress(st, key, cached, layoutZoom, background)) continue;
      if (cached == null) {
        rasterized++;
        if (resized) work.resized++;
      }
      st
        ..resize = false
        ..roadFitKey = -1;
      pending = true;
    }

    // A label turned away on its guessed size is drawn too, so the next
    // placement weighs it at its real one, as MapLibre lays out every
    // label before placing any.
    if (!pending) {
      for (final st in _frameStates) {
        if (st.placed || st.seenPass != _pass || st.sprite != null) continue;
        if (!st.candidate.hasText) continue;
        if (timeUp()) {
          pending = true;
          break;
        }
        final key = _style.spriteKey(st);
        if (!_dress(st, key, _sprites[key], layoutZoom, background)) continue;
        pending = true;
        rasterized++;
      }
    }

    lastRasterMicros = _clock.elapsedMicroseconds - rasterStart;
    work.rasterized += rasterized;
    _lastZoom = zoom;
    final styleZoom = zoom - 1 + zoomOffset;
    _style.layoutZoom = styleZoom.floorToDouble();
    var animating = pending;
    final step = dt / _fadeSeconds;
    work.statesWalked += _live.length;
    var kept = 0;
    for (var i = 0; i < _live.length; i++) {
      final st = _live[i];
      final seen = st.seenPass == _pass;
      if (st.sprite?.dropped ?? false) {
        st.sprite = _sprites[_style.spriteKey(st)];
      }
      final sprite = st.sprite;
      final inRange = _style.inRange(st.candidate, styleZoom);
      final wantsText = st.candidate.hasText && st.showText;
      final target =
          seen && inRange && st.placed && (sprite != null || !wantsText)
          ? 1.0
          : 0.0;
      if (st.opacity < target) {
        st.opacity = math.min(1, st.opacity + step);
      } else if (st.opacity > target) {
        st.opacity = math.max(
          0,
          st.opacity - (seen && inRange ? step : step * 3),
        );
      }
      if (st.opacity != target) animating = true;
      if (st.opacity == 0 && target == 0) {
        st.live = false;
        continue;
      }
      _live[kept++] = st;
      if (st.opacity == 0) continue;
      _drawn.add(st);
    }
    _live.length = kept;
    _order.sortForDrawing(_drawn);
    final pages = _glyphPages;
    var textLayer = -1 << 30;
    for (final st in _drawn) {
      _style.stand(st.candidate);
      _grow(st, styleZoom);
      final layer = LabelOrder.layerOf(st.candidate);
      final sprite = st.sprite;
      final wantsText = st.candidate.hasText && st.showText;
      final icon = st.icon;
      final sheet = _style.sheet;
      final pin = st.pin;
      final pins = _points.pins;
      if (pin != null && pins != null && st.showIcon) {
        _painter.paintPin(canvas, st, pin, pins);
      } else if (icon != null && st.showIcon && sheet != null) {
        if (pages != null && textLayer != layer) pages.flush(canvas);
        final symbol = _style.symbolOf(st.candidate);
        _painter.paintIcon(
          canvas,
          st,
          icon,
          sheet,
          symbol,
          icon.sdf && symbol != null
              ? _style.bound(st.candidate, styleZoom)
              : null,
        );
      }
      if (sprite == null || !wantsText) continue;
      _text.paintText(canvas, st, sprite);
      textLayer = layer;
    }
    _view.standAt(0);
    _drawn.clear();
    if (sdfText != null) {
      if (sdfText.end(canvas)) animating = true;
      _view.sdf = null;
    }
    if (pages != null) {
      pages.flush(canvas);
      if (pages.rasterizePending()) animating = true;
      pages.endFrame();
    }
    final debugBoxes = _points.debugBoxes;
    if (debugBoxes != null) {
      _painter
        ..paintCollisionBoxes(canvas, debugBoxes)
        ..paintCollisionCircles(canvas, _road.debugCircles ?? const []);
    }
    return animating;
  }

  final List<LabelState> _drawn = [];

  /// Gives [st] the sprite [cached], else one drawn now for [key] at
  /// [zoom]; false while its glyph ranges are on their way, whose arrival
  /// repaints. A label given its sprite is placed again at its real size,
  /// and then faded in: frames are still needed with nothing else moving.
  bool _dress(
    LabelState st,
    String key,
    LabelSprite? cached,
    double zoom,
    int background,
  ) {
    final sprite = cached ?? _rasterize(st, zoom, background);
    if (sprite == null) return false;
    st
      ..sprite = sprite
      ..spriteKey = key;
    _placeAgain = true;
    return true;
  }

  static bool _marker(LabelCandidate c) =>
      c.point?.tile.icon.isNotEmpty ?? false;

  /// Labels a tilted map would shrink below this are left out, as MapLibre
  /// does (`collision_index.ts`, `perspectiveRatioCutoff`).
  static const _perspectiveCutoff = 0.6;

  /// Grows or shrinks [st] to its text size in this frame, as MapLibre's
  /// shaders size labels by the zoom and the distance in each frame, where
  /// placement weighed it at the size of its last pass: its text, the part
  /// of its offset that grows with the text, and its icon, with the text
  /// when fitted to it and else with the distance.
  void _grow(LabelState st, double styleZoom) {
    if (st.placedSize <= 0) return;
    _view.project(st.worldX, st.worldY);
    final perspective = _view.ratio;
    _style.bind(st.candidate);
    final size = _style.size(st.candidate, styleZoom) * perspective;
    if (size == st.placedSize || size <= 0) return;
    final k = size / st.placedSize;
    final fitted = _style.symbolOf(st.candidate)?.textFit ?? false;
    final i = fitted ? k : perspective / st.perspective;
    st
      ..scale *= k
      ..dx = st.moveX + (st.dx - st.moveX) * k
      ..dy = st.moveY + (st.dy - st.moveY) * k
      ..roadLift *= k
      ..iconScale *= i
      ..iconW *= i
      ..iconH *= i
      ..iconDx = st.iconMoveX + (st.iconDx - st.iconMoveX) * i
      ..iconDy = st.iconMoveY + (st.iconDy - st.iconMoveY) * i
      ..placedSize = size
      ..perspective = perspective;
  }

  /// Decides which labels show for this camera. Labels without an image yet
  /// are placed by an estimated size and drawn once rasterized.
  void _place(
    Iterable<List<LabelCandidate>> sources,
    double zoom,
    double world,
    ui.Offset origin,
    ui.Size size,
  ) {
    _pass++;
    _placeAgain = false;
    occlusion.startPass();
    final styleZoom = zoom - 1 + zoomOffset;
    _style.layoutZoom = styleZoom.floorToDouble();
    final states = _frameStates..clear();
    // As MapLibre's viewportPadding: its collision grid reaches this far
    // past the screen, and a label whose box reaches into it is placed.
    const margin = 100.0;
    for (final list in sources) {
      for (final c in list) {
        if (!_style.inRange(c, styleZoom)) continue;
        _style.stand(c);
        _view.project(c.worldX, c.worldY);
        _view.standAt(0);
        final sx = _view.x;
        final sy = _view.y;
        if (_view.ratio < _perspectiveCutoff) continue;
        // A road name drawn as an image is not laid on tilted ground.
        final tilted = _view.tilted;
        if (!_glyphText &&
            (tilted.pitch > 0 || tilted.globe != null) &&
            c.road != null) {
          continue;
        }
        final reach = margin + _style.reach(c, styleZoom);
        if (sx < -reach ||
            sy < -reach ||
            sx > size.width + reach ||
            sy > size.height + reach) {
          continue;
        }
        final st = _stateFor(c, world);
        if (st == null) continue;
        st
          ..seenPass = _pass
          ..perspective = _view.ratio
          ..iconOnGround = _style.symbolOf(c)?.iconOnGround ?? false
          ..candidate = c
          // Ties keep the order the tiles list them in, as MapLibre
          // places features.
          ..sortKey =
              (c.rank - (st.placed ? _style.rules.placedLead : 0)) * 65536 +
              math.min(states.length, 65535);
        states.add(st);
      }
    }
    _order.sortForPlacement(states, byTile: _style.rules.placesByTile);

    _boxes
      ..clear()
      ..group = 0
      ..grid = (-100, -100, size.width + 100, size.height + 100);
    _points.debugBoxes?.clear();
    _road.debugCircles = _points.debugBoxes == null ? null : <double>[];
    _roads.startPass();
    _points.startPass();
    final fitKey = (zoom * 3).round();
    var considered = 0;
    for (final (order, st) in states.indexed) {
      st.placeOrder = order;
      final c = st.candidate;
      _style.stand(c);
      _boxes
        ..group = crossSourceCollisions || c is! TileLabel
            ? 0
            : symbols[c.tile.layer].source + 1
        // MapLibre's 16 tile units to the pixel, seen through the tilt.
        ..quantum = _style.rules.quantizesPoints && c.point != null
            ? st.perspective / 16
            : 0;
      // Only labels that test for collisions count towards the cap: one
      // that may overlap anything and is ignored by everything costs
      // nothing to place.
      if (!_style.free(c) && ++considered > _maxConsidered) {
        st.placed = false;
        continue;
      }
      // Buildings hiding labels are worked out at sea level, which raised
      // ground would make flip from frame to frame; there hills hide them.
      // Buildings hide only markers: the name of an area or a street stays
      // up over the roofs, as on Apple's and Google's maps.
      if (_view.ground != null) {
        st.occluded = _view.behindHill(c.worldX, c.worldY);
      } else if (!_marker(c)) {
        st.occluded = false;
      } else if (st.occludedFor != occlusion.view) {
        // Past the time budget a label keeps what it had, and placing again
        // asks the rest, until every label has its answer for this camera.
        final hidden = occlusion.hides(c.worldX, c.worldY);
        if (hidden == null) {
          _placeAgain = true;
        } else {
          st
            ..occluded = hidden
            ..occludedFor = occlusion.view;
        }
      }
      if (st.occluded) {
        st.placed = false;
        continue;
      }
      final road = c.road;
      _style.bind(c);
      final layer = _style.symbolOf(c);
      // As MapLibre keeps a point's padding in tile units, a tilted map's
      // distance grows and shrinks it with the label; a name along a line
      // is padded in pixels, as its collision circles are.
      final textPad =
          (layer?.textPadding ?? CollisionBoxes.defaultPad) *
          (road == null ? st.perspective : 1);
      final iconPad =
          (layer?.iconPadding ?? CollisionBoxes.defaultPad) * st.perspective;
      final fontSize = _style.size(c, styleZoom) * st.perspective;
      if (layer != null &&
          c is TileLabel &&
          c.tile.props != null &&
          c.hasText) {
        final ink = Object.hash(
          _style.ink(layer),
          asNumber(layer.haloBlur(_style.context)),
          '${c.tile.props?[formatKey]}',
        );
        if (ink != c.ink) {
          c
            ..ink = ink
            ..spriteKey = '${c.tile.layer}|${c.text}|$ink';
          st.sprite = null;
        }
      }
      if (st.sprite?.dropped ?? false) st.sprite = null;
      // As MapLibre, each writing mode the layer names is tried in turn
      // until one fits.
      final modes = road == null && _style.mayBeVertical(c, layer)
          ? layer!.writingModes
          : const [false];
      for (final vertical in modes) {
        if (st.vertical != vertical) {
          st
            ..vertical = vertical
            ..sprite = null;
        }
        if (_placeIn(
          st,
          c,
          road,
          layer,
          styleZoom,
          fitKey,
          fontSize: fontSize,
          textPad: textPad,
          iconPad: iconPad,
        )) {
          break;
        }
      }
    }
    _view.standAt(0);
    _states.removeWhere((_, same) {
      same.removeWhere((st) => st.seenPass != _pass && !st.live);
      return same.isEmpty;
    });
    _sprites.trim(_pass);
  }

  /// Places [st] in its writing mode; true when it shows.
  bool _placeIn(
    LabelState st,
    LabelCandidate c,
    TileLabel? road,
    SymbolLayer? layer,
    double styleZoom,
    int fitKey, {
    required double fontSize,
    required double textPad,
    required double iconPad,
  }) {
    final key = _style.spriteKey(st);
    if (st.spriteKey != key || st.sprite == null) {
      st
        ..sprite = _sprites[key]
        ..spriteKey = key;
    }
    final sprite = st.sprite;
    st
      ..scale = sprite == null ? 1 : fontSize / sprite.fontSize
      ..placedSize = fontSize
      ..moveX = 0
      ..moveY = 0;
    st.resize = sprite is GlyphSprite
        ? false
        : _zooming
        ? st.scale < 0.7 || st.scale > 1.4
        : st.scale < 0.87 || st.scale > 1.15;
    final (width, height) = sprite == null
        ? st.guessSize(
            fontSize,
            maxWidth: road == null && layer != null
                ? layer.maxWidth
                : double.infinity,
          )
        : (sprite.textWidth * st.scale, sprite.textHeight * st.scale);
    final LabelSize size = (
      fontSize: fontSize,
      width: width,
      height: height,
      textPad: textPad,
      iconPad: iconPad,
    );

    st
      ..placed = false
      ..showText = c.hasText
      ..showIcon = false;
    final placed = road != null
        ? _road.place(st, road, layer, sprite, size, styleZoom, fitKey)
        : _points.place(st, layer, size, _style.context..zoom = styleZoom);
    if (placed) _showPlaced(st, sprite);
    return placed;
  }

  /// Marks [st] placed in this pass, and keeps it and its image in use.
  void _showPlaced(LabelState st, LabelSprite? sprite) {
    st.placed = true;
    if (!st.live) {
      st.live = true;
      _live.add(st);
    }
    sprite?.usedPass = _pass;
  }

  /// Draws the label once, in the look its layer gives it, or for a
  /// marker's name the look the app gives markers.
  LabelSprite? _rasterize(LabelState st, double styleZoom, int background) {
    final c = st.candidate;
    final beside = c is MarkerName;
    final symbol = _style.symbolOf(c);
    final ui.TextAlign? align;
    final String label;
    final double letterSpacing, maxWidth;
    final List<String> fontStack;
    if (symbol == null) {
      align = null;
      label = c.text;
      letterSpacing = 0;
      maxWidth = 9;
      fontStack = const [];
    } else {
      final layout = _style.layoutContext(c);
      label = symbol.transformed(c.text, layout);
      letterSpacing = letterSpacingFor(label, symbol.letterSpacingAt(layout));
      maxWidth = symbol.maxWidthAt(layout);
      fontStack = symbol.fontStackAt(layout);
      align = symbol.justifyAutoAt(layout)
          ? _style.autoJustify(st, symbol)
          : symbol.justifyAt(_style.layoutContext(c));
    }
    _style.context.zoom = styleZoom;
    _style.bind(c);
    final fontSize = _style.size(c, styleZoom) * st.perspective;
    final isRoad = c.road != null;
    final dark =
        (background >> 16 & 255) * 0.3 +
            (background >> 8 & 255) * 0.59 +
            (background & 255) * 0.11 <
        128;
    final int color;
    final int? halo;
    final double haloWidth;
    final int weight;
    if (symbol == null) {
      color = text.markerColor?.toARGB32() ?? (dark ? 0xFF58B9F5 : 0xFF0073BF);
      halo = background;
      haloWidth = 1.5;
      weight = text.markerWeight;
    } else {
      (color, halo, haloWidth) = _style.ink(symbol);
      weight = symbol.weight;
    }
    final rightToLeft = textIsRightToLeft(plainText(label));
    return _sprites.draw(
      _style.spriteKey(st),
      TextLook(
        text: label,
        fontSize: fontSize,
        color: color,
        halo: halo,
        haloWidth: haloWidth,
        haloBlur: symbol == null
            ? 0.0
            : math.max(0.0, asNumber(symbol.haloBlur(_style.context)) ?? 0),
        weight: weight,
        italic: symbol?.italic ?? false,
        letterSpacing: letterSpacing,
        lineHeight: symbol?.lineHeight ?? _style.rules.lineHeight,
        // A marker's name hugs its marker: lines are flush on the side the
        // text starts from, which is the side the marker is on.
        align: !beside
            ? align ?? ui.TextAlign.center
            : (rightToLeft ? ui.TextAlign.right : ui.TextAlign.left),
        rightToLeft: rightToLeft,
        road: isRoad,
        layoutWidth: (isRoad ? 60.0 : maxWidth) * fontSize,
        fontFamily: text.fontFamily,
        fontFamilyFallback: text.fontFamilyFallback,
        fontStack: fontStack,
        format: c is TileLabel
            ? (c.tile.props?[formatKey] as List<Object?>?)
            : null,
        vertical: st.vertical,
        lineShift: _style.lineShift(c),
      ),
      dpr: _view.devicePixelRatio,
      pass: _pass,
      shaped: c is TileLabel ? c.tile.shaped : null,
    );
  }
}
