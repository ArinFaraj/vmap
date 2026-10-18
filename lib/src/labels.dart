import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show visibleForTesting;

import 'collision_boxes.dart';
import 'expr.dart';
import 'label_painter.dart';
import 'text_style.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'occlusion.dart';
import 'glyphs/glyph_layout.dart';
import 'glyphs/glyph_pages.dart';
import 'glyphs/glyph_ranges.dart';
import 'label_rules.dart';
import 'label_view.dart';
import 'view.dart';
import 'pins.dart';
import 'point_labels.dart';
import 'road_labels.dart';
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
    _points.sheet = value;
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
    final color = (Rgba.of(symbol.color(_context)) ?? Rgba.black).toArgb(
      asNumber(symbol.opacity(_context)) ?? 1,
    );
    final double haloWidth = (asNumber(symbol.haloWidth(_context)) ?? 0).clamp(
      0,
      2,
    );
    return (
      color,
      haloWidth > 0 ? Rgba.of(symbol.haloColor(_context))?.toArgb() : null,
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

  /// The key [st]'s text sprite is kept under: its candidate's, and with
  /// `text-justify: auto` the side its lines are flush on.
  String _spriteKey(LabelState st) {
    final c = st.candidate;
    final symbol = _symbolOf(c);
    if (symbol == null || !symbol.justifyAuto) return c.spriteKey;
    return '${c.spriteKey}|${_autoJustify(st, symbol).index}';
  }

  /// The side of the anchor [st] takes, which `text-justify: auto` makes
  /// its lines flush on.
  static ui.TextAlign _autoJustify(LabelState st, SymbolLayer symbol) {
    final anchors = symbol.anchors;
    final anchor = anchors.isEmpty
        ? symbol.anchor
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
    _painter.rules = _rules = url == null
        ? LabelRules.vmap
        : LabelRules.mapLibre;
    clear();
  }

  LabelRules _rules = LabelRules.vmap;

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
  }) {
    lastPlaceMicros = 0;
    if (view != null) rotation = 0;
    final world = 256.0 * math.pow(2, zoom);
    _view.frame(
      rotation: rotation,
      size: size,
      world: world,
      origin: origin,
      tilted: view,
    );
    _view.ground = ground;
    final tilt = view == null ? 0.0 : view.pitch * 1000 + view.bearing;
    if (_zooming && !zooming) _placeAgain = true;
    _zooming = zooming;
    final nowMs = _clock.elapsedMilliseconds;
    final moved =
        zoom != _placedZoom ||
        origin != _placedOrigin ||
        rotation != _placedRotation ||
        tilt != _placedTilt ||
        sourcesKey != _placedSourcesKey;
    var pending = false;
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
        _placedRotation = rotation;
        _placedTilt = tilt;
        _placedSourcesKey = sourcesKey;
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
      _placeAgain = true;
      if (cached == null) rasterized++;
    }

    lastRasterMicros = _clock.elapsedMicroseconds - rasterStart;
    work.rasterized += rasterized;
    _lastZoom = zoom;
    final styleZoom = zoom - 1 + zoomOffset;
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
    _drawn.clear();
    if (pages != null) {
      pages.flush(canvas);
      if (pages.rasterizePending()) animating = true;
      pages.endFrame();
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
    final s = -math.sin(rotation), c = math.cos(rotation);
    for (final st in _drawn) {
      if (_symbolOf(st.candidate)?.drawnByScreenY != true) continue;
      _view.project(st.worldX, st.worldY);
      st.drawY = (s * _view.x + c * _view.y).roundToDouble();
    }
    _drawn.sort((a, b) {
      final byLayer = _layerOf(a.candidate) - _layerOf(b.candidate);
      if (byLayer != 0) return byLayer;
      if (_symbolOf(a.candidate)?.drawnByScreenY != true) {
        return a.sortKey - b.sortKey;
      }
      final byY = a.drawY.compareTo(b.drawY);
      return byY != 0 ? byY : b.sortKey - a.sortKey;
    });
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
  ) {
    _pass++;
    _placeAgain = false;
    occlusion.startPass();
    final styleZoom = zoom - 1 + zoomOffset;
    final states = _frameStates..clear();
    const margin = 60.0;
    for (final list in sources) {
      for (final c in list) {
        if (!_inRange(c, styleZoom)) continue;
        _view.project(c.worldX, c.worldY);
        final sx = _view.x;
        final sy = _view.y;
        if (_view.ratio < _perspectiveCutoff) continue;
        if (!_glyphText &&
            _view.tilted != null &&
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
          ..candidate = c
          // Ties keep the order the tiles list them in, as MapLibre
          // places features.
          ..sortKey =
              (c.rank - (st.placed ? 45 : 0)) * 65536 +
              math.min(states.length, 65535);
        states.add(st);
      }
    }
    states.sort((a, b) => a.sortKey - b.sortKey);

    _boxes.clear();
    _roads.startPass();
    _points.startPass();
    final fitKey = (zoom * 3).round();
    var considered = 0;
    for (final st in states) {
      final c = st.candidate;
      // Only labels that test for collisions count towards the cap: one
      // that may overlap anything and is ignored by everything costs
      // nothing to place.
      if (!_free(c) && ++considered > _maxConsidered) {
        st.placed = false;
        continue;
      }
      // Buildings hiding labels are worked out at sea level, which raised
      // ground would make flip from frame to frame; there hills hide them.
      st.occluded = _view.ground == null
          ? (occlusion.hides(c.worldX, c.worldY) ?? st.occluded)
          : _view.behindHill(c.worldX, c.worldY);
      if (st.occluded) {
        st.placed = false;
        continue;
      }
      final road = c is TileLabel && c.tile.line != null ? c : null;
      _bind(c);
      final layer = _symbolOf(c);
      final textPad = layer?.textPadding ?? CollisionBoxes.defaultPad;
      final iconPad = layer?.iconPadding ?? CollisionBoxes.defaultPad;
      final fontSize = _size(c, styleZoom) * st.perspective;
      if (layer != null &&
          c is TileLabel &&
          c.tile.props != null &&
          c.hasText) {
        final ink = _ink(layer).hashCode;
        if (ink != c.ink) {
          c
            ..ink = ink
            ..spriteKey = '${c.tile.layer}|${c.text}|$ink';
          st.sprite = null;
        }
      }
      if (st.sprite?.dropped ?? false) st.sprite = null;
      final key = _spriteKey(st);
      if (st.spriteKey != key || st.sprite == null) {
        st
          ..sprite = _sprites[key]
          ..spriteKey = key;
      }
      final sprite = st.sprite;
      st.scale = sprite == null ? 1 : fontSize / sprite.fontSize;
      st.resize = sprite is GlyphSprite
          ? false
          : _zooming
          ? st.scale < 0.7 || st.scale > 1.4
          : st.scale < 0.87 || st.scale > 1.15;
      final textW = sprite == null
          ? c.text.length * fontSize * 0.55
          : sprite.textWidth * st.scale;
      final textH = sprite == null
          ? fontSize * 1.35
          : sprite.textHeight * st.scale;

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
      } else {
        if (_points.place(
          st,
          layer,
          fontSize,
          textW,
          textH,
          textPad,
          iconPad,
          _context..zoom = styleZoom,
        )) {
          _showPlaced(st, sprite);
        }
      }
    }
    _states.removeWhere((_, same) {
      same.removeWhere((st) => st.seenPass != _pass && !st.live);
      return same.isEmpty;
    });
    _sprites.trim(_pass);
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
    if (st.roadFitKey != fitKey) {
      st
        ..roadFitKey = fitKey
        ..roadFits = _roads.fit(
          st,
          road,
          textW,
          textH,
          road.tileSpan * _view.world / tileExtent,
          maxBend: layer?.maxBend,
        );
    }
    if (!st.roadFits) return;
    final mapLibre = identical(_rules, LabelRules.mapLibre) && layer != null;
    if (_roads.nearSame(
      st,
      mapLibre
          ? layer.build.spacing / 2 * road.tileSpan * _view.world / 512
          : null,
    )) {
      return;
    }
    final overlaps = mapLibre && layer.textOverlaps;
    final ignored = mapLibre && layer.textIgnored;
    final room = mapLibre
        ? 0.0
        : fontSize <= 12.5
        ? _minorRoadRoom
        : _majorRoadRoom;
    final (roadX, roadY) = layer == null
        ? (0.0, 0.0)
        : _view.moved(
            layer.textTranslate,
            layer.textTranslateOnScreen,
            _context..zoom = styleZoom,
          );
    _view.project(st.worldX, st.worldY);
    final sx = _view.x + roadX;
    final sy = _view.y + roadY;
    st
      ..keepUpright = layer?.keepUpright ?? true
      ..onGround = layer?.textOnGround ?? false;
    final turn = _view.uprightAngle(
      st.worldX,
      st.worldY,
      st.angle,
      keep: st.keepUpright,
    );
    st.screenAngle = turn;
    if (st.curve != null) {
      final reach = (textH + room) / 2 + textPad;
      if (!overlaps && _roads.curveHits(st, textW, textH, reach, add: false)) {
        return;
      }
      if (!ignored) _roads.curveHits(st, textW, textH, reach, add: true);
    } else {
      if (!overlaps &&
          _boxes.collides(
            sx,
            sy,
            textW + room,
            textH + room,
            turn,
            pad: textPad,
          )) {
        return;
      }
      if (!ignored) {
        _boxes.take(sx, sy, textW + room, textH + room, turn, pad: textPad);
      }
    }
    st
      ..dx = roadX
      ..dy = roadY;
    _showPlaced(st, sprite);
    _roads.placed(st);
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
    _context.zoom = styleZoom;
    _bind(c);
    final fontSize = _size(c, styleZoom) * st.perspective;
    final isRoad = c is TileLabel && c.tile.line != null;
    final label = symbol?.uppercase ?? false ? c.text.toUpperCase() : c.text;
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
    final rightToLeft = isRightToLeft(label);
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
            : (asNumber(symbol.haloBlur(_context)) ?? 0).clamp(0.0, haloWidth),
        weight: weight,
        italic: symbol?.italic ?? false,
        letterSpacing: symbol?.letterSpacing ?? 0,
        lineHeight: symbol?.lineHeight ?? _rules.lineHeight,
        // A marker's name hugs its marker: lines are flush on the side the
        // text starts from, which is the side the marker is on.
        align: !beside
            ? (symbol == null
                  ? ui.TextAlign.center
                  : symbol.justifyAuto
                  ? _autoJustify(st, symbol)
                  : symbol.justify)
            : (rightToLeft ? ui.TextAlign.right : ui.TextAlign.left),
        rightToLeft: rightToLeft,
        road: isRoad,
        layoutWidth: (isRoad ? 60.0 : (symbol?.maxWidth ?? 9)) * fontSize,
        fontFamily: text.fontFamily,
        fontFamilyFallback: text.fontFamilyFallback,
        fontStack: symbol?.fontStack ?? const [],
      ),
      dpr: dpr,
      pass: _pass,
      shaped: c is TileLabel ? c.tile.shaped : null,
    );
  }
}
