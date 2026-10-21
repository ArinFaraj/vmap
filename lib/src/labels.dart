import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show visibleForTesting;

import 'collision_boxes.dart';
import 'expr.dart';
import 'format.dart';
import 'label_painter.dart';
import 'label_path.dart';
import 'text_style.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'occlusion.dart';
import 'glyphs/cursive.dart';
import 'glyphs/glyph_layout.dart';
import 'glyphs/glyph_pages.dart';
import 'glyphs/glyph_pbf.dart' show GlyphPbf;
import 'glyphs/glyph_ranges.dart';
import 'glyphs/maplibre_shaping.dart' show allowsVerticalText;
import 'label_rules.dart';
import 'label_view.dart';
import 'view.dart';
import 'pins.dart';
import 'point_labels.dart';
import 'road_labels.dart';
import 'sdf_text.dart';
import 'source_config.dart';
import 'sprites.dart';
import 'stats.dart';
import 'style_model.dart';
import 'tile_builder.dart';

/// Chooses which labels show, fades them, and draws them. Text is laid out by
/// the engine's own text stack, so joined scripts shape correctly.
class LabelEngine {
  LabelEngine(this.text);

  /// Buildings that hide labels on a tilted map; placement leaves those
  /// labels out, so they fade.
  final occlusion = BuildingOcclusion();

  VmapTextStyle text;
  List<SymbolLayer> symbols = const [];

  /// The style's icons. Null until they have loaded.
  SpriteSheet? get sheet => _points.sheet;
  set sheet(SpriteSheet? value) {
    _points.sheet = _sprites.images = _painter.images = value;
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
  final EvalContext _context = EvalContext();

  /// The style layer that draws [c]. Null for a marker's name.
  SymbolLayer? _symbolOf(LabelCandidate c) => switch (c) {
    TileLabel(:final tile) => symbols[tile.layer],
    MarkerName() => null,
  };

  double _size(LabelCandidate c, double styleZoom) {
    final symbol = _symbolOf(c);
    if (symbol == null) return text.markerSize * text.scale;
    _context.zoom = styleZoom;
    return finiteOr(symbol.size(_context), 16) * text.scale;
  }

  bool _inRange(LabelCandidate c, double styleZoom) => switch (_symbolOf(c)) {
    null => true,
    final symbol => styleZoom >= symbol.minZoom && styleZoom < symbol.maxZoom,
  };

  static const double _fadeSeconds = 0.3;

  /// UI-thread time a frame may spend drawing new labels into images.
  /// Candidates weighed per placement, best priority first. The rest are the
  /// least important street names and wait for a closer zoom.
  static const int _maxConsidered = 1500;

  /// Extra clear space kept around street names, so a grid of short streets
  /// names a few of them instead of all of them.
  static const double _minorRoadRoom = 34;
  static const double _majorRoadRoom = 14;
  static const int _placementIntervalMs = 90;
  static const int _zoomingIntervalMs = 350;

  /// A frame that spent this long placing labels draws no new text images;
  /// they wait a frame, so the two costs never land on the same one.
  /// The state the app has given a feature of a source, for paint that
  /// reads `feature-state`.
  Map<String, Object?>? Function(int source, Object? id)? stateOf;

  /// Has the labels placed and coloured again on the next frame.
  void restyle() => _placeAgain = true;

  /// Places every label again from the style, each keeping how far it
  /// has faded in, as MapLibre keeps them through a change of paint. A
  /// sprite whose colours changed is drawn again by its key.
  void redraw() => _placeAgain = true;

  /// Glyph ranges asked for and not here yet, which labels wait on.
  int get glyphsLoading => _sprites.ranges?.pending ?? 0;

  /// Places the labels again in the next frame, however soon after the
  /// last placement, while a paint property they are placed by changes.
  void placeNow() {
    _placeAgain = true;
    _placedAtMs = -1000000;
  }

  /// The context with the paint expressions pointed at [c]'s feature.
  EvalContext _bound(LabelCandidate c, double styleZoom) {
    _context.zoom = styleZoom;
    _bind(c);
    return _context;
  }

  /// Points the paint expressions at the feature behind [c]. A marker's
  /// name has none.
  void _bind(LabelCandidate c) {
    if (c case TileLabel(tile: BuiltLabel(:final props?, :final layer))) {
      _context
        ..props = props
        ..state =
            stateOf?.call(symbols[layer].source, props[r'$id']) ?? const {};
    } else {
      _context
        ..props = const {}
        ..state = const {};
    }
  }

  /// A text's colour, halo colour and halo width from its layer's paint.
  (int, int?, double) _ink(SymbolLayer symbol) {
    final opacity = asNumber(symbol.opacity(_context)) ?? 1;
    final color = (Rgba.of(symbol.color(_context)) ?? Rgba.black).toArgb(
      opacity,
    );
    final double haloWidth = (asNumber(symbol.haloWidth(_context)) ?? 0).clamp(
      0,
      8,
    );
    return (
      color,
      haloWidth > 0
          ? Rgba.of(symbol.haloColor(_context))?.toArgb(opacity)
          : null,
      haloWidth,
    );
  }

  static const int _heavyPlaceMicros = 800;

  /// Label states by key; a key holds more than one when places of one
  /// name share a cell, told apart by distance.
  final Map<String, List<LabelState>> _states = {};

  Iterable<LabelState> get _allStates => _states.values.expand((s) => s);
  final VmapLabelWork work = VmapLabelWork();
  late final LabelSprites _sprites = LabelSprites(work);
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
  List<(double, double, double, double, double, double)> get obstacles =>
      _points.obstacles;
  set obstacles(List<(double, double, double, double, double, double)> value) {
    _points.obstacles = value;
    _placeAgain = true;
  }

  double _lastZoom = 0;

  final LabelView _view = LabelView();
  final CollisionBoxes _boxes = CollisionBoxes();

  /// Labels of different sources keep clear of each other, as MapLibre's
  /// `crossSourceCollisions`. Off, each source's labels only mind their
  /// own, and the app's reserved areas.
  bool crossSourceCollisions = true;
  late final RoadLabels _roads = RoadLabels(_view, _boxes);
  late final LabelPainter _painter = LabelPainter(_view, _roads);
  late final PointLabels _points = PointLabels(_view, _boxes, _roads);

  /// Road names follow bends. Off, a name is only written where the road is
  /// straight enough to carry it.
  bool get curvedRoads => _roads.curved;
  set curvedRoads(bool value) {
    if (value == _roads.curved) return;
    _roads.curved = value;
    clear();
  }

  double _placedRotation = 0;
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

  /// How far past the screen's edge [c]'s anchor may lie with its text
  /// still reaching in: its offsets, half its widest line and its
  /// translation. Only labels that can show are placed, however far their
  /// layer throws them.
  double _reach(LabelCandidate c, double styleZoom) {
    final symbol = _symbolOf(c);
    if (symbol == null) return 0;
    final ems =
        math.max(symbol.offsetX.abs(), symbol.offsetY.abs()) +
        (symbol.radialOffset ?? 0).abs() +
        symbol.maxWidth / 2;
    var reach = ems * _size(c, styleZoom);
    if (symbol.textTranslate case final translate?) {
      _bind(c);
      final (dx, dy) = _view.moved(
        translate,
        symbol.textTranslateOnScreen,
        _context,
      );
      reach += math.max(dx.abs(), dy.abs());
    }
    return reach;
  }

  /// How a name along a line is moved off its anchor, as MapLibre shapes
  /// it: its `text-anchor`'s alignment and its `text-offset`. Null when it
  /// is not moved.
  (double, double, double, double)? _lineShift(LabelCandidate c) {
    if (c is! TileLabel || c.tile.line == null) return null;
    final symbol = _symbolOf(c);
    if (symbol == null) return null;
    final anchor = symbol.anchor;
    final alignX = anchor.endsWith('left')
        ? 0.5
        : anchor.endsWith('right')
        ? -0.5
        : 0.0;
    final alignY = anchor.startsWith('top')
        ? 0.5
        : anchor.startsWith('bottom')
        ? -0.5
        : 0.0;
    final (offsetX, offsetY) = symbol.textOffset(_layoutContext(c));
    if (alignX == 0 && alignY == 0 && offsetX == 0 && offsetY == 0) {
      return null;
    }
    return (alignX, alignY, offsetX, offsetY);
  }

  /// The key [st]'s text sprite is kept under: its candidate's, and with
  /// `text-justify: auto` the side its lines are flush on.
  String _spriteKey(LabelState st) {
    final c = st.candidate;
    final symbol = _symbolOf(c);
    var key = st.vertical ? '${c.spriteKey}|v' : c.spriteKey;
    if (_lineShift(c) case (final ax, final ay, final ox, final oy)) {
      key = '$key|$ax,$ay,$ox,$oy';
    }
    if (symbol == null) return key;
    if (symbol.layoutAt.any) {
      final context = _layoutContext(c);
      key =
          '$key|${symbol.transformed('a', context)}'
          '|${symbol.letterSpacingAt(context)}|${symbol.maxWidthAt(context)}'
          '|${symbol.justifyAt(context).index}'
          '|${symbol.justifyAutoAt(context)}'
          '|${symbol.fontStackAt(context).join(',')}';
      if (!symbol.justifyAutoAt(context)) return key;
    } else if (!symbol.justifyAuto) {
      return key;
    }
    return '$key|${_autoJustify(st, symbol).index}';
  }

  /// The zoom a tile's symbols are laid out at: MapLibre lays them out at
  /// the tile's zoom.
  double _layoutZoom = 0;

  /// The context [c]'s layout is read in: its feature, at [_layoutZoom].
  EvalContext _layoutContext(LabelCandidate c) {
    _bind(c);
    return _context..zoom = _layoutZoom;
  }

  /// Whether [c] may be written down the page: its layer allows it, it is
  /// a point's plain text, and its script has upright vertical forms.
  bool _mayBeVertical(LabelCandidate c, SymbolLayer? symbol) =>
      symbol != null &&
      symbol.writingModes.contains(true) &&
      c is TileLabel &&
      c.tile.line == null &&
      c.tile.props?[formatKey] == null &&
      allowsVerticalText(c.text);

  /// The side of the anchor [st] takes, which `text-justify: auto` makes
  /// its lines flush on.
  ui.TextAlign _autoJustify(LabelState st, SymbolLayer symbol) {
    final anchors = symbol.anchors;
    final anchor = anchors.isEmpty
        ? (symbol.layoutAt.anchor == null
              ? symbol.anchor
              : symbol.anchorAt(_layoutContext(st.candidate)))
        : anchors[st.side.clamp(0, anchors.length - 1)];
    if (anchor.endsWith('left')) return ui.TextAlign.left;
    if (anchor.endsWith('right')) return ui.TextAlign.right;
    return ui.TextAlign.center;
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

  /// Whether [c]'s text and icon both overlap anything and are ignored by
  /// everything else, so placing it tests nothing.
  bool _free(LabelCandidate c) {
    final layer = _symbolOf(c);
    if (layer == null) return false;
    final text = !c.hasText || (layer.textOverlaps && layer.textIgnored);
    final icon = layer.iconOverlaps && layer.iconIgnored;
    return text && icon;
  }

  /// How far apart in pixels two labels of one text in one cell may be and
  /// still be the same label.
  static const double _sameLabelPx = 3;

  GlyphPages? _glyphPages;

  /// Shapes and draws text with [fonts] from now on, where they cover it.
  void useGlyphs(GlyphFonts fonts) {
    _glyphPages?.dispose();
    final pages = _glyphPages = GlyphPages(fonts);
    _sprites.glyphFonts = fonts;
    _painter.glyphs = pages;
    clear();
  }

  bool get _glyphText => _glyphPages != null;

  String? _rangesUrl;

  /// Draws labels from the glyph ranges at [url], a style's `glyphs`,
  /// fetched with [config], as MapLibre draws them; from the font files
  /// when it is null. [onArrived] runs as each range lands.
  void useRanges(
    String? url,
    TileSourceConfig config,
    void Function() onArrived,
  ) {
    if (url == _rangesUrl) return;
    _rangesUrl = url;
    _sprites.ranges?.close();
    _sprites.ranges = url == null
        ? null
        : GlyphRanges(
            url,
            userAgent: config.userAgent,
            headers: config.headers,
            onLoaded: (face, glyphs) {
              _glyphPages?.addPbf(face, glyphs);
              onArrived();
            },
          );
    _painter.rules = _points.rules = _rules = url == null
        ? LabelRules.vmap
        : LabelRules.mapLibre;
    clear();
  }

  LabelRules _rules = LabelRules.vmap;

  /// With the debug view on, the collision circles of names along lines as
  /// the last placement laid them: x, y, radius and 1 when the name ran
  /// into something.
  List<double>? _debugCircles;

  /// The camera of the frame before, which [LabelPainter.still] compares.
  (double, ui.Offset, double, double)? _frameCamera;

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
    ui.Canvas canvas, {
    required Iterable<List<LabelCandidate>> sources,
    required int sourcesKey,
    required int background,
    required double zoom,
    required ui.Offset origin,
    required ui.Size size,
    required double rotation,
    required double devicePixelRatio,
    required double dt,
    required int rasterBudgetMicros,
    required bool zooming,
    MapView? view,
    double Function(double wx, double wy)? ground,
    double perMetre = 0,
    double seaLevel = 0,
    SdfText? sdf,
    double styleNowMs = 0,
  }) {
    lastPlaceMicros = 0;
    _context.nowMs = styleNowMs;
    // Text from glyph ranges is drawn by the renderer as distance fields
    // where it can, on the unturned screen of a projected view.
    final ranges = _sprites.ranges;
    final sdfText = view != null && ranges != null ? sdf : null;
    sdfText?.begin(size, devicePixelRatio, ranges!.glyph);
    _painter.sdfText = sdfText;
    if (view != null) rotation = 0;
    final world = 256.0 * math.pow(2, zoom);
    _view.frame(
      rotation: rotation,
      size: size,
      world: world,
      origin: origin,
      tilted: view,
    );
    _view
      ..ground = ground
      ..perMetre = perMetre
      ..seaLevel = seaLevel
      ..standAt(0);
    final tilt = view == null
        ? 0.0
        : Object.hash(view.pitch, view.bearing, view.roll).toDouble();
    if (_zooming && !zooming) _placeAgain = true;
    _zooming = _painter.moving = zooming;
    final camera = (zoom, origin, rotation, tilt);
    _painter.still = camera == _frameCamera;
    _frameCamera = camera;
    final nowMs = _clock.elapsedMilliseconds;
    final moved =
        zoom != _placedZoom ||
        origin != _placedOrigin ||
        rotation != _placedRotation ||
        tilt != _placedTilt ||
        sourcesKey != _placedSourcesKey;
    // A frame after the camera stops puts the labels back on the pixels.
    var pending = !_painter.still;
    if (moved || _placeAgain) {
      final zoomingOut = zoom < _lastZoom;
      final interval = !zooming || zoomingOut || _placedZoom - zoom > 0.4
          ? _placementIntervalMs
          : _zoomingIntervalMs;
      if (nowMs - _placedAtMs >= interval) {
        final t0 = _clock.elapsedMicroseconds;
        _place(sources, zoom, world, origin, size, rotation);
        lastPlaceMicros = _clock.elapsedMicroseconds - t0;
        _placedAtMs = nowMs;
        _placedZoom = zoom;
        _placedOrigin = origin;
        _placedRotation = rotation;
        _placedTilt = tilt;
        _placedSourcesKey = sourcesKey;
        if (_placeAgain) pending = true;
      } else {
        pending = true;
      }
    }

    var rasterized = 0;
    final rasterStart = _clock.elapsedMicroseconds;
    for (final st in _frameStates) {
      if (st.sprite?.dropped ?? false) {
        st.sprite = _sprites[_spriteKey(st)];
      }
      if (!st.placed || st.seenPass != _pass) continue;
      if (!st.candidate.hasText || !st.showText) continue;
      final key = _spriteKey(st);
      if (st.sprite != null && !st.resize && st.spriteKey == key) continue;
      var cached = _sprites[_spriteKey(st)];
      if (identical(cached, st.sprite)) cached = null;
      if (cached == null &&
          (lastPlaceMicros > _heavyPlaceMicros ||
              (rasterized > 0 &&
                  _clock.elapsedMicroseconds - rasterStart >
                      rasterBudgetMicros))) {
        pending = true;
        break;
      }
      final sprite =
          cached ??
          _rasterize(st, zoom - 1 + zoomOffset, background, devicePixelRatio);
      // Its glyph ranges are on their way; their arrival repaints.
      if (sprite == null) continue;
      if (cached == null && st.sprite != null) work.resized++;
      st
        ..sprite = sprite
        ..spriteKey = key
        ..resize = false
        ..roadFitKey = -1;
      // Placed again at its real size, and then faded in: frames are
      // still needed even with nothing else moving.
      _placeAgain = true;
      pending = true;
      if (cached == null) rasterized++;
    }

    // A label turned away on its guessed size is drawn too, so the next
    // placement weighs it at its real one, as MapLibre lays out every
    // label before placing any.
    if (!pending) {
      for (final st in _frameStates) {
        if (st.placed || st.seenPass != _pass || st.sprite != null) continue;
        if (!st.candidate.hasText) continue;
        if (_clock.elapsedMicroseconds - rasterStart > rasterBudgetMicros) {
          pending = true;
          break;
        }
        final key = _spriteKey(st);
        final sprite =
            _sprites[key] ??
            _rasterize(st, zoom - 1 + zoomOffset, background, devicePixelRatio);
        if (sprite == null) continue;
        st
          ..sprite = sprite
          ..spriteKey = key;
        _placeAgain = true;
        pending = true;
        rasterized++;
      }
    }

    lastRasterMicros = _clock.elapsedMicroseconds - rasterStart;
    work.rasterized += rasterized;
    _lastZoom = zoom;
    final styleZoom = zoom - 1 + zoomOffset;
    _layoutZoom = styleZoom.floorToDouble();
    var animating = pending;
    final step = dt / _fadeSeconds;
    work.statesWalked += _live.length;
    if (rotation != 0) {
      canvas
        ..save()
        ..translate(_view.cx, _view.cy)
        ..rotate(-rotation)
        ..translate(-_view.cx, -_view.cy);
    }
    var kept = 0;
    for (var i = 0; i < _live.length; i++) {
      final st = _live[i];
      final seen = st.seenPass == _pass;
      if (st.sprite?.dropped ?? false) {
        st.sprite = _sprites[_spriteKey(st)];
      }
      final sprite = st.sprite;
      final inRange = _inRange(st.candidate, styleZoom);
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
    _drawOrder(rotation);
    final pages = _glyphPages;
    var textLayer = -1 << 30;
    for (final st in _drawn) {
      _stand(st.candidate);
      _grow(st, styleZoom);
      final layer = _layerOf(st.candidate);
      final sprite = st.sprite;
      final wantsText = st.candidate.hasText && st.showText;
      final icon = st.icon;
      final sheet = _points.sheet;
      final pin = st.pin;
      final pins = _points.pins;
      if (pin != null && pins != null && st.showIcon) {
        _painter.paintPin(canvas, st, pin, pins, devicePixelRatio);
      } else if (icon != null && st.showIcon && sheet != null) {
        if (pages != null && textLayer != layer) pages.flush(canvas);
        final symbol = _symbolOf(st.candidate);
        _painter.paintIcon(
          canvas,
          st,
          icon,
          sheet,
          symbol,
          icon.sdf && symbol != null ? _bound(st.candidate, styleZoom) : null,
          devicePixelRatio,
        );
      }
      if (sprite == null || !wantsText) continue;
      _painter.paintText(canvas, st, sprite, devicePixelRatio);
      textLayer = layer;
    }
    _view.standAt(0);
    _drawn.clear();
    if (sdfText != null) {
      if (sdfText.end(canvas)) animating = true;
      _painter.sdfText = null;
    }
    if (pages != null) {
      pages.flush(canvas);
      if (pages.rasterizePending()) animating = true;
      pages.endFrame();
    }
    final debugBoxes = _points.debugBoxes;
    if (debugBoxes != null) {
      _painter
        ..paintCollisionBoxes(canvas, debugBoxes, devicePixelRatio)
        ..paintCollisionCircles(canvas, _debugCircles ?? const []);
    }
    if (rotation != 0) canvas.restore();
    return animating;
  }

  final List<LabelState> _drawn = [];

  static int _layerOf(LabelCandidate c) => switch (c) {
    TileLabel(:final tile) => tile.layer,
    MarkerName() => 1 << 30,
  };

  /// Puts [_drawn] in MapLibre's drawing order: layer by layer, and within
  /// a layer in placement order, or top to bottom on the screen for a
  /// layer drawn by screen y, the later feature first on a tie.
  void _drawOrder(double rotation) {
    final bearing = _view.tilted != null ? -_view.mapTurn : rotation;
    final ts = math.sin(bearing), tc = math.cos(bearing);
    final s = -math.sin(rotation), c = math.cos(rotation);
    for (final st in _drawn) {
      final candidate = st.candidate;
      if (_symbolOf(candidate)?.drawnByScreenY != true) continue;
      if (candidate is TileLabel) {
        // As MapLibre's getSortedSymbolIndexes: the anchor's turned y in
        // whole tile units.
        final x = (st.worldX - candidate.tileX) / candidate.tileSpan;
        final y = (st.worldY - candidate.tileY) / candidate.tileSpan;
        st.drawY = ((-ts * x + tc * y) * _sortExtent).roundToDouble();
        continue;
      }
      _stand(candidate);
      _view.project(st.worldX, st.worldY);
      _view.standAt(0);
      st.drawY = (s * _view.x + c * _view.y).roundToDouble();
    }
    _drawn.sort((a, b) {
      final byLayer = _layerOf(a.candidate) - _layerOf(b.candidate);
      if (byLayer != 0) return byLayer;
      if (_symbolOf(a.candidate)?.drawnByKey != true) {
        final byTile = _tileOrder(a.candidate, b.candidate, ts, tc);
        if (byTile != 0) return byTile;
      }
      if (_symbolOf(a.candidate)?.drawnByScreenY != true) {
        return a.sortKey - b.sortKey;
      }
      final byY = a.drawY.compareTo(b.drawY);
      return byY != 0 ? byY : b.sortKey - a.sortKey;
    });
  }

  /// MapLibre's placement order: by priority, then a layer's tiles deepest
  /// first, each copy of the world, column and row in turn (the order
  /// `Style._updatePlacement` sorts them in), then the order the tile lists
  /// its symbols in.
  int _placementOrder(LabelState a, LabelState b) {
    final byRank = (a.sortKey >> 16) - (b.sortKey >> 16);
    if (byRank != 0) return byRank;
    final ca = a.candidate, cb = b.candidate;
    if (ca is TileLabel && cb is TileLabel) {
      if (ca.tileSpan != cb.tileSpan) return ca.tileSpan.compareTo(cb.tileSpan);
      final ax = (ca.tileX / ca.tileSpan).round();
      final bx = (cb.tileX / cb.tileSpan).round();
      final n = (1 / ca.tileSpan).round();
      final aw = (ax / n).floor(), bw = (bx / n).floor();
      if (aw != bw) return aw - bw;
      if (ax != bx) return ax - bx;
      final ay = (ca.tileY / ca.tileSpan).round();
      final by = (cb.tileY / cb.tileSpan).round();
      if (ay != by) return ay - by;
      // As MapLibre's placeLayerBucketPart for symbol-z-order viewport-y:
      // the lowest on the screen first, then the earlier feature.
      if (ca.tile.layer == cb.tile.layer &&
          (_symbolOf(ca)?.placedByScreenY ?? false)) {
        final byY = b.drawY.compareTo(a.drawY);
        if (byY != 0) return byY;
      }
    }
    return a.sortKey - b.sortKey;
  }

  static bool _marker(LabelCandidate c) =>
      c is TileLabel && c.tile.line == null && c.tile.icon.isNotEmpty;

  /// The tile units MapLibre sorts symbols in, `EXTENT`.
  static const _sortExtent = 8192.0;

  /// MapLibre draws a layer's symbols tile by tile: deepest zoom first,
  /// then in rows down the turned screen, each row from left to right
  /// (`getRenderableIds` for symbol layers, reversed by the painter).
  static int _tileOrder(
    LabelCandidate a,
    LabelCandidate b,
    double s,
    double c,
  ) {
    if (a is! TileLabel || b is! TileLabel) return 0;
    if (a.tileSpan != b.tileSpan) return a.tileSpan.compareTo(b.tileSpan);
    if (a.tileX == b.tileX && a.tileY == b.tileY) return 0;
    final ax = a.tileX / a.tileSpan, ay = a.tileY / a.tileSpan;
    final bx = b.tileX / b.tileSpan, by = b.tileY / b.tileSpan;
    final byRow = (-s * ax + c * ay).compareTo(-s * bx + c * by);
    if (byRow != 0) return byRow;
    return (c * ax + s * ay).compareTo(c * bx + s * by);
  }

  /// Labels a tilted map would shrink below this are left out, as MapLibre
  /// does (`collision_index.ts`, `perspectiveRatioCutoff`).
  static const _perspectiveCutoff = 0.6;

  /// Decides which labels show for this camera. Labels without an image yet
  /// are placed by an estimated size and drawn once rasterized.
  void _place(
    Iterable<List<LabelCandidate>> sources,
    double zoom,
    double world,
    ui.Offset origin,
    ui.Size size,
    double rotation,
  ) {
    _pass++;
    _placeAgain = false;
    occlusion.startPass();
    final styleZoom = zoom - 1 + zoomOffset;
    _layoutZoom = styleZoom.floorToDouble();
    final states = _frameStates..clear();
    // As MapLibre's viewportPadding: its collision grid reaches this far
    // past the screen, and a label whose box reaches into it is placed.
    const margin = 100.0;
    for (final list in sources) {
      for (final c in list) {
        if (!_inRange(c, styleZoom)) continue;
        _stand(c);
        _view.project(c.worldX, c.worldY);
        _view.standAt(0);
        final sx = _view.x;
        final sy = _view.y;
        if (_view.ratio < _perspectiveCutoff) continue;
        // A road name drawn as an image is not laid on tilted ground.
        final tilted = _view.tilted;
        if (!_glyphText &&
            tilted != null &&
            (tilted.pitch > 0 || tilted.globe != null) &&
            c is TileLabel &&
            c.tile.line != null) {
          continue;
        }
        final reach = margin + _reach(c, styleZoom);
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
          ..iconOnGround = _symbolOf(c)?.iconOnGround ?? false
          ..candidate = c
          // Ties keep the order the tiles list them in, as MapLibre
          // places features.
          ..sortKey =
              (c.rank -
                      (st.placed && !identical(_rules, LabelRules.mapLibre)
                          ? 45
                          : 0)) *
                  65536 +
              math.min(states.length, 65535);
        states.add(st);
      }
    }
    if (identical(_rules, LabelRules.mapLibre)) {
      final bearing = _view.tilted != null ? -_view.mapTurn : rotation;
      final ts = math.sin(bearing), tc = math.cos(bearing);
      for (final st in states) {
        final c = st.candidate;
        if (c is TileLabel && (_symbolOf(c)?.placedByScreenY ?? false)) {
          final x = (st.worldX - c.tileX) / c.tileSpan;
          final y = (st.worldY - c.tileY) / c.tileSpan;
          st.drawY = ((-ts * x + tc * y) * _sortExtent).roundToDouble();
        }
      }
      states.sort(_placementOrder);
    } else {
      states.sort((a, b) => a.sortKey - b.sortKey);
    }

    _boxes
      ..clear()
      ..group = 0
      ..grid = (-100, -100, size.width + 100, size.height + 100);
    _points.debugBoxes?.clear();
    _debugCircles = _points.debugBoxes == null ? null : <double>[];
    _roads.startPass();
    _points.startPass();
    final fitKey = (zoom * 3).round();
    var considered = 0;
    for (final (order, st) in states.indexed) {
      st.placeOrder = order;
      final c = st.candidate;
      _stand(c);
      _boxes
        ..group = crossSourceCollisions || c is! TileLabel
            ? 0
            : symbols[c.tile.layer].source + 1
        // MapLibre's 16 tile units to the pixel, seen through the tilt.
        ..quantum =
            identical(_rules, LabelRules.mapLibre) &&
                c is TileLabel &&
                c.tile.line == null
            ? st.perspective / 16
            : 0;
      // Only labels that test for collisions count towards the cap: one
      // that may overlap anything and is ignored by everything costs
      // nothing to place.
      if (!_free(c) && ++considered > _maxConsidered) {
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
      final road = c is TileLabel && c.tile.line != null ? c : null;
      _bind(c);
      final layer = _symbolOf(c);
      // As MapLibre keeps a point's padding in tile units, a tilted map's
      // distance grows and shrinks it with the label; a name along a line
      // is padded in pixels, as its collision circles are.
      final textPad =
          (layer?.textPadding ?? CollisionBoxes.defaultPad) *
          (road == null ? st.perspective : 1);
      final iconPad =
          (layer?.iconPadding ?? CollisionBoxes.defaultPad) * st.perspective;
      final fontSize = _size(c, styleZoom) * st.perspective;
      if (layer != null &&
          c is TileLabel &&
          c.tile.props != null &&
          c.hasText) {
        final ink = Object.hash(
          _ink(layer),
          asNumber(layer.haloBlur(_context)),
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
      final modes = road == null && _mayBeVertical(c, layer)
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
          fontSize,
          textPad,
          iconPad,
          styleZoom,
          fitKey,
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

  /// Has [_view] project [c]'s points at its layer's height offset.
  void _stand(LabelCandidate c) {
    final layer = _symbolOf(c);
    final offset = layer?.heightOffset;
    if (offset == null) {
      _view.standAt(0);
      return;
    }
    final metres = c.heightMetres ??= () {
      _bind(c);
      return finiteOr(offset(_context), 0);
    }();
    _view.standAt(metres, fromSea: layer!.heightFromSea);
  }

  /// Places [st] in its writing mode; true when it shows.
  bool _placeIn(
    LabelState st,
    LabelCandidate c,
    TileLabel? road,
    SymbolLayer? layer,
    double fontSize,
    double textPad,
    double iconPad,
    double styleZoom,
    int fitKey,
  ) {
    final key = _spriteKey(st);
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
    final (guessW, guessH) = sprite == null
        ? _guessSize(st, c, layer, fontSize, wraps: road == null)
        : (0.0, 0.0);
    final textW = sprite == null ? guessW : sprite.textWidth * st.scale;
    final textH = sprite == null ? guessH : sprite.textHeight * st.scale;

    st
      ..placed = false
      ..showText = c.hasText
      ..showIcon = false;
    if (road != null) {
      _placeRoad(
        st,
        road,
        layer,
        sprite,
        fontSize,
        textW,
        textH,
        textPad,
        styleZoom,
        fitKey,
      );
      return st.placed;
    }
    final ok = _points.place(
      st,
      layer,
      fontSize,
      textW,
      textH,
      textPad,
      iconPad,
      _context..zoom = styleZoom,
    );
    if (ok) {
      _showPlaced(st, sprite);
      return true;
    }
    return false;
  }

  /// The size of [c]'s text before it is laid out, for placing it until it
  /// is: each line's characters at about half an em, a line [wraps] at the
  /// layer's text-max-width.
  (double, double) _guessSize(
    LabelState st,
    LabelCandidate c,
    SymbolLayer? layer,
    double fontSize, {
    required bool wraps,
  }) {
    final ems = st.vertical ? 1.0 : 0.55;
    final maxWidth = layer == null ? double.infinity : layer.maxWidth;
    var widest = 0.0;
    var lines = 0;
    for (final line in c.text.split('\n')) {
      final width = line.runes.length * ems;
      if (!wraps || st.vertical || width <= maxWidth) {
        lines++;
        widest = math.max(widest, width);
        continue;
      }
      // Words fill a line until the next would pass the width.
      var run = 0.0;
      lines++;
      for (final word in line.split(' ')) {
        final w = word.runes.length * ems;
        if (run > 0 && run + ems + w > maxWidth) {
          widest = math.max(widest, run);
          lines++;
          run = w;
        } else {
          run += (run > 0 ? ems : 0) + w;
        }
      }
      widest = math.max(widest, run);
    }
    final long = widest * fontSize;
    final across = (1.35 + (lines - 1) * 1.2) * fontSize;
    return st.vertical ? (across, long) : (long, across);
  }

  /// Places a name along its road, when the road can carry it and it runs
  /// into nothing placed before it.
  void _placeRoad(
    LabelState st,
    TileLabel road,
    SymbolLayer? layer,
    LabelSprite? sprite,
    double fontSize,
    double textW,
    double textH,
    double textPad,
    double styleZoom,
    int fitKey,
  ) {
    // A fit worked out on the text's estimated width is worked out again
    // once its glyphs are laid out.
    // The offset and anchor's move along the road, turned round with a name
    // kept upright that reads against the road.
    final flips = (layer?.keepUpright ?? true) && _roads.flipsAt(road);
    var shift = 0.0;
    if (_lineShift(road) case (final alignX, _, final offsetX, _)) {
      shift = alignX * textW + offsetX * fontSize;
      if (flips) shift = -shift;
    }
    var key = sprite == null ? -1 - fitKey : fitKey;
    if (shift < 0) key = ~key;
    if (st.roadFitKey != key) {
      st
        ..roadFitKey = key
        ..roadFits = _roads.fit(
          st,
          road,
          textW,
          textH,
          road.tileSpan * _view.world / tileExtent,
          maxBend: layer?.maxBend,
          mapLibre: identical(_rules, LabelRules.mapLibre),
          shift: shift,
        );
    }
    if (!st.roadFits) return;
    final mapLibre = identical(_rules, LabelRules.mapLibre) && layer != null;
    if (_roads.nearSame(st, mapLibre ? 1 : null, mapLibre)) {
      return;
    }
    final overlaps = mapLibre && layer.textOverlaps;
    final ignored = mapLibre && layer.textIgnored;
    final room = mapLibre
        ? 0.0
        : fontSize <= 12.5
        ? _minorRoadRoom
        : _majorRoadRoom;
    final (translateX, translateY) = layer == null
        ? (0.0, 0.0)
        : _view.moved(
            layer.textTranslate,
            layer.textTranslateOnScreen,
            _context..zoom = styleZoom,
          );
    var (roadX, roadY) = (translateX, translateY);
    _view.project(st.worldX, st.worldY);
    final sx = _view.x + roadX;
    final sy = _view.y + roadY;
    st
      ..keepUpright = layer?.keepUpright ?? true
      ..onGround = layer?.textOnGround ?? false
      ..glyphsUpright = layer?.glyphsUpright ?? false;
    final turn = _view.uprightAngle(
      st.worldX,
      st.worldY,
      st.angle,
      keep: st.keepUpright,
    );
    st.screenAngle = turn;
    final lift = (_lineShift(st.candidate)?.$4 ?? 0) * fontSize;
    if (st.curve != null) {
      st.roadLift = lift;
    } else {
      st.roadLift = 0;
      // Text shaped from glyphs carries its text-offset; an image of it is
      // moved by it across the text, as MapLibre shapes the offset in.
      if (sprite is! GlyphSprite) {
        roadX -= math.sin(turn) * lift;
        roadY += math.cos(turn) * lift;
      }
    }
    if (mapLibre) {
      if (!_roadCircles(
        st,
        sprite,
        fontSize,
        textW,
        textPad,
        sx,
        sy,
        turn,
        lift,
        styleZoom,
        check: !overlaps,
        add: !ignored,
      )) {
        return;
      }
    } else if (st.curve != null) {
      final reach = (textH + room) / 2 + textPad;
      if (_roads.curveHits(
        st,
        textW,
        textH,
        reach,
        check: !overlaps,
        add: !ignored,
        lift: lift,
      )) {
        return;
      }
    } else {
      final bx = sx + roadX - translateX, by = sy + roadY - translateY;
      if (_boxes.offGridAround(bx, by, textW + room, textH + room)) return;
      if (!overlaps &&
          _boxes.collides(
            bx,
            by,
            textW + room,
            textH + room,
            turn,
            pad: textPad,
          )) {
        return;
      }
      if (!ignored) {
        _boxes.take(bx, by, textW + room, textH + room, turn, pad: textPad);
      }
    }
    st
      ..dx = roadX
      ..dy = roadY
      ..moveX = translateX
      ..moveY = translateY;
    if (mapLibre) {
      st.showIcon =
          _points.sizeLineIcon(
            st,
            layer,
            textW,
            textH,
            _context..zoom = styleZoom,
          ) !=
          null;
    }
    _showPlaced(st, sprite);
    _roads.placed(st);
  }

  /// Whether a name along a line clears what is placed, weighed as
  /// MapLibre's `placeCollisionCircles` weighs it, and with [add] takes the
  /// room: a row of circles as tall as its text at its layout size, from
  /// its first glyph's middle to its last's, along its road on the screen
  /// moved [lift] across, spaced at most two and a half radii apart.
  bool _roadCircles(
    LabelState st,
    LabelSprite? sprite,
    double fontSize,
    double textW,
    double textPad,
    double sx,
    double sy,
    double turn,
    double lift,
    double styleZoom, {
    required bool check,
    required bool add,
  }) {
    final layoutSize = _size(st.candidate, styleZoom.floorToDouble() + 1);
    final glyphH = sprite == null
        ? 28.8
        : sprite.textHeight / sprite.fontSize * GlyphPbf.em;
    final radius =
        math.max(10, glyphH) * layoutSize / GlyphPbf.em / 2 * st.perspective +
        textPad;
    // The first and last glyphs' middles, from the text's middle.
    var first = -textW / 2 + fontSize * 0.3, last = -first;
    if (sprite is GlyphSprite) {
      final g = sprite.shaped.glyphs;
      final em = sprite.shaped.width > 0 ? textW / sprite.shaped.width : 0.0;
      int? a, b;
      for (var i = 0; i < g.length; i += 5) {
        a ??= i;
        b = i;
      }
      if (a != null && b != null) {
        first = (g[a + 2] + g[a + 4] / 2) * em - textW / 2;
        last = (g[b + 2] + g[b + 4] / 2) * em - textW / 2;
      }
    }
    // The path from the first glyph's middle to the last's on the screen:
    // laid on the ground and projected for text pitched with the map, as
    // MapLibre lays it in its label plane, else along the road on screen.
    final path = <double>[];
    const samples = 8;
    final tilted = _view.tilted;
    if (st.onGround && tilted != null) {
      _view.project(st.worldX, st.worldY);
      final k =
          (0.5 + 0.5 * _view.depth) /
          math.max(st.perspective, 1e-6) /
          _view.world *
          _view.groundScale(st.worldY);
      final shiftX = sx - _view.x, shiftY = sy - _view.y;
      OffsetLine? ground;
      if (st.curve case final curve?) {
        ground = offsetPath(curve, st.curveMid, lift * k);
      }
      final c = math.cos(st.angle), sn = math.sin(st.angle);
      final at = Float64List(3);
      for (var q = 0; q <= samples; q++) {
        final along = (first + (last - first) * q / samples) * k;
        double wx, wy;
        if (ground != null) {
          ground.at(along, at);
          wx = at[0];
          wy = at[1];
        } else {
          wx = st.worldX + c * along - sn * lift * k;
          wy = st.worldY + sn * along + c * lift * k;
        }
        _view.project(wx, wy);
        path
          ..add(_view.x + shiftX)
          ..add(_view.y + shiftY);
      }
    } else {
      OffsetLine? line;
      if (st.curve case final curve?) {
        final (screen, middle) = _view.onScreen(curve, st.curveMid);
        line = offsetPath(screen, middle, lift);
      }
      _view.project(st.worldX, st.worldY);
      final shiftX = sx - _view.x, shiftY = sy - _view.y;
      final cos = math.cos(turn), sin = math.sin(turn);
      final at = Float64List(3);
      for (var q = 0; q <= samples; q++) {
        final along = first + (last - first) * q / samples;
        if (line != null) {
          line.at(along, at);
          path
            ..add(at[0] + shiftX)
            ..add(at[1] + shiftY);
        } else {
          path
            ..add(sx + cos * along - sin * lift)
            ..add(sy + sin * along + cos * lift);
        }
      }
    }
    // As MapLibre, only the stretches of the path inside the collision grid
    // carry circles; a path wholly outside it places nothing.
    final pad = radius * 0.25;
    final centres = <double>[];
    var hit = false;
    for (final piece in _clipToGrid(path)) {
      var length = 0.0;
      for (var q = 2; q < piece.length; q += 2) {
        final dx = piece[q] - piece[q - 2], dy = piece[q + 1] - piece[q - 1];
        length += math.sqrt(dx * dx + dy * dy);
      }
      final count = length <= 0.5 * radius
          ? 1
          : ((length - 2 * pad) / (radius * 2.5)).ceil() + 1;
      final at = Float64List(3);
      for (var k = 0; k < count; k++) {
        final t = k / math.max(count - 1, 1);
        pointAlong(piece, pad + t * (length - 2 * pad), at);
        final x = at[0], y = at[1];
        if (check && !hit && _boxes.hitsCircle(x, y, radius)) {
          // As MapLibre, the debug view still shows every circle of a name
          // that runs into something, in red.
          if (_debugCircles == null) return false;
          hit = true;
        }
        centres
          ..add(x)
          ..add(y);
      }
    }
    if (_debugCircles case final debug?) {
      for (var k = 0; k < centres.length; k += 2) {
        debug.addAll([centres[k], centres[k + 1], radius, hit ? 1 : 0]);
      }
    }
    if (hit || centres.isEmpty) return false;
    if (add) {
      for (var k = 0; k < centres.length; k += 2) {
        _boxes.addCircle(centres[k], centres[k + 1], radius);
      }
    }
    return true;
  }

  /// [path], x and y in turn, cut to the collision grid: the pieces of it
  /// inside, as MapLibre's `clipLine`.
  List<Float64List> _clipToGrid(List<double> path) {
    final g = _boxes.grid;
    if (g == null) return [Float64List.fromList(path)];
    final (x1, y1, x2, y2) = g;
    final pieces = <Float64List>[];
    var piece = <double>[];
    void flush() {
      if (piece.length >= 4) pieces.add(Float64List.fromList(piece));
      piece = <double>[];
    }

    for (var q = 2; q < path.length; q += 2) {
      var ax = path[q - 2], ay = path[q - 1], bx = path[q], by = path[q + 1];
      // Liang-Barsky against the grid's four edges.
      var t0 = 0.0, t1 = 1.0;
      final dx = bx - ax, dy = by - ay;
      var inside = true;
      for (final (pv, qv) in [
        (-dx, ax - x1),
        (dx, x2 - ax),
        (-dy, ay - y1),
        (dy, y2 - ay),
      ]) {
        if (pv == 0) {
          if (qv < 0) inside = false;
          continue;
        }
        final r = qv / pv;
        if (pv < 0) {
          if (r > t1) inside = false;
          if (r > t0) t0 = r;
        } else {
          if (r < t0) inside = false;
          if (r < t1) t1 = r;
        }
      }
      if (!inside || t0 > t1) {
        flush();
        continue;
      }
      final sx = ax + dx * t0, sy = ay + dy * t0;
      final ex = ax + dx * t1, ey = ay + dy * t1;
      if (piece.isEmpty || t0 > 0) {
        flush();
        piece.addAll([sx, sy]);
      }
      piece.addAll([ex, ey]);
      if (t1 < 1) flush();
    }
    flush();
    return pieces;
  }

  /// Grows or shrinks [st] to its text size in this frame, as MapLibre's
  /// shaders size labels by the zoom and the distance in each frame, where
  /// placement weighed it at the size of its last pass: its text, the part
  /// of its offset that grows with the text, and its icon, with the text
  /// when fitted to it and else with the distance.
  void _grow(LabelState st, double styleZoom) {
    if (st.placedSize <= 0) return;
    _view.project(st.worldX, st.worldY);
    final perspective = _view.tilted == null ? 1.0 : _view.ratio;
    _bind(st.candidate);
    final size = _size(st.candidate, styleZoom) * perspective;
    if (size == st.placedSize || size <= 0) return;
    final k = size / st.placedSize;
    final fitted = _symbolOf(st.candidate)?.textFit ?? false;
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
  LabelSprite? _rasterize(
    LabelState st,
    double styleZoom,
    int background,
    double dpr,
  ) {
    final c = st.candidate;
    final beside = c is MarkerName;
    final symbol = _symbolOf(c);
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
      final layout = _layoutContext(c);
      label = symbol.transformed(c.text, layout);
      letterSpacing = letterSpacingFor(label, symbol.letterSpacingAt(layout));
      maxWidth = symbol.maxWidthAt(layout);
      fontStack = symbol.fontStackAt(layout);
      align = symbol.justifyAutoAt(layout)
          ? _autoJustify(st, symbol)
          : symbol.justifyAt(_layoutContext(c));
    }
    _context.zoom = styleZoom;
    _bind(c);
    final fontSize = _size(c, styleZoom) * st.perspective;
    final isRoad = c is TileLabel && c.tile.line != null;
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
      (color, halo, haloWidth) = _ink(symbol);
      weight = symbol.weight;
    }
    final rightToLeft = isRightToLeft(plainText(label));
    return _sprites.draw(
      _spriteKey(st),
      TextLook(
        text: label,
        fontSize: fontSize,
        color: color,
        halo: halo,
        haloWidth: haloWidth,
        haloBlur: symbol == null
            ? 0.0
            : math.max(0.0, asNumber(symbol.haloBlur(_context)) ?? 0),
        weight: weight,
        italic: symbol?.italic ?? false,
        letterSpacing: letterSpacing,
        lineHeight: symbol?.lineHeight ?? _rules.lineHeight,
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
        lineShift: _lineShift(c),
      ),
      dpr: dpr,
      pass: _pass,
      shaped: c is TileLabel ? c.tile.shaped : null,
    );
  }
}
