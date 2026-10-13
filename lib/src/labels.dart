import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show visibleForTesting;

import 'collision_boxes.dart';
import 'expr.dart';
import 'label_painter.dart';
import 'text_style.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'glyphs/glyph_layout.dart';
import 'glyphs/glyph_pages.dart';
import 'label_view.dart';
import 'view.dart';
import 'pins.dart';
import 'point_labels.dart';
import 'road_labels.dart';
import 'sprites.dart';
import 'stats.dart';
import 'style_model.dart';
import 'tile_builder.dart';

/// Chooses which labels show, fades them, and draws them. Text is laid out by
/// the engine's own text stack, so joined scripts shape correctly.
class LabelEngine {
  LabelEngine(this.text);

  VmapTextStyle text;
  List<SymbolLayer> symbols = const [];

  /// The style's icons. Null until they have loaded.
  SpriteSheet? get sheet => _points.sheet;
  set sheet(SpriteSheet? value) {
    _points.sheet = value;
    for (final st in _states.values) {
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
    return (asNumber(symbol.size(_context)) ?? 16) * text.scale;
  }

  bool _inRange(LabelCandidate c, double styleZoom) => switch (_symbolOf(c)) {
    null => true,
    final symbol => styleZoom >= symbol.minZoom && styleZoom < symbol.maxZoom,
  };

  static const double _fadeSeconds = 0.2;

  /// UI-thread time a frame may spend drawing new labels into images.
  /// Candidates weighed per placement, best priority first. The rest are the
  /// least important street names and wait for a closer zoom.
  static const int _maxConsidered = 240;

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

  final Map<String, LabelState> _states = {};
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
  int get stateCount => _states.length;
  int get spriteCount => _sprites.length;

  int get shown => _states.values.where((s) => s.opacity > 0).length;

  /// The keys of the labels showing.
  @visibleForTesting
  Set<String> get shownKeys => {
    for (final st in _live)
      if (st.opacity > 0) st.candidate.key,
  };

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

  /// Glyphs drawn into pages in the last frame, and what that cost.
  int get glyphsRasterized => _glyphPages?.lastRasterized ?? 0;
  int get glyphRasterMicros => _glyphPages?.lastRasterMicros ?? 0;
  int get glyphPageCount => _glyphPages?.pageCount ?? 0;

  void disposeGlyphs() {
    _glyphPages?.dispose();
    _glyphPages = null;
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
        st.sprite = _sprites[st.candidate.spriteKey];
      }
      if (!st.placed || st.seenPass != _pass) continue;
      if (!st.candidate.hasText || !st.showText) continue;
      if (st.sprite != null && !st.resize) continue;
      var cached = _sprites[st.candidate.spriteKey];
      if (identical(cached, st.sprite)) cached = null;
      if (cached == null &&
          (lastPlaceMicros > _heavyPlaceMicros ||
              (rasterized > 0 &&
                  _clock.elapsedMicroseconds - rasterStart >
                      rasterBudgetMicros))) {
        pending = true;
        break;
      }
      if (cached == null && st.sprite != null) work.resized++;
      st
        ..sprite =
            cached ??
            _rasterize(st, zoom - 1 + zoomOffset, background, devicePixelRatio)
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
        st.sprite = _sprites[st.candidate.spriteKey];
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
      final icon = st.icon;
      final sheet = _points.sheet;
      final pin = st.pin;
      final pins = _points.pins;
      if (pin != null && pins != null && st.showIcon) {
        _painter.paintPin(canvas, st, pin, pins, devicePixelRatio);
      } else if (icon != null && st.showIcon && sheet != null) {
        final symbol = _symbolOf(st.candidate);
        _painter.paintIcon(
          canvas,
          st,
          icon,
          sheet,
          symbol,
          icon.sdf && symbol != null ? _bound(st.candidate, styleZoom) : null,
          devicePixelRatio,
          rotation,
        );
      }
      if (sprite == null || !wantsText) continue;
      _painter.paintText(canvas, st, sprite, devicePixelRatio, rotation);
    }
    _live.length = kept;
    final pages = _glyphPages;
    if (pages != null) {
      pages.flush(canvas);
      if (pages.rasterizePending()) animating = true;
      pages.endFrame();
    }
    if (rotation != 0) canvas.restore();
    return animating;
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
        if (sx < -margin ||
            sy < -margin ||
            sx > size.width + margin ||
            sy > size.height + margin) {
          continue;
        }
        final st = _states[c.key] ??= LabelState(c);
        if (st.seenPass == _pass) continue;
        st
          ..seenPass = _pass
          ..perspective = _view.ratio
          ..candidate = c
          ..sortKey = c.rank - (st.placed ? 45 : 0);
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
      if (++considered > _maxConsidered) {
        st.placed = false;
        continue;
      }
      final c = st.candidate;
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
      final sprite = st.sprite ??= _sprites[c.spriteKey];
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
    _states.removeWhere((_, st) => st.seenPass != _pass && !st.live);
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
    if (!st.roadFits || _roads.nearSame(st)) return;
    final room = fontSize <= 12.5 ? _minorRoadRoom : _majorRoadRoom;
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
    var turn = (st.angle + _view.rotation) % (2 * math.pi);
    if (turn > math.pi) turn -= 2 * math.pi;
    if (turn > math.pi / 2) turn -= math.pi;
    if (turn < -math.pi / 2) turn += math.pi;
    st.screenAngle = turn;
    if (st.curve != null) {
      final reach = (textH + room) / 2 + textPad;
      if (_roads.curveHits(st, textW, textH, reach, add: false)) {
        return;
      }
      _roads.curveHits(st, textW, textH, reach, add: true);
    } else {
      if (_boxes.collides(
        sx,
        sy,
        textW + room,
        textH + room,
        turn,
        pad: textPad,
      )) {
        return;
      }
      _boxes.take(sx, sy, textW + room, textH + room, turn, pad: textPad);
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
  LabelSprite _rasterize(
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
      c.spriteKey,
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
        lineHeight: symbol?.lineHeight ?? 1.15,
        // A marker's name hugs its marker: lines are flush on the side the
        // text starts from, which is the side the marker is on.
        align: !beside
            ? (symbol?.justify ?? ui.TextAlign.center)
            : (rightToLeft ? ui.TextAlign.right : ui.TextAlign.left),
        rightToLeft: rightToLeft,
        road: isRoad,
        layoutWidth: (isRoad ? 60.0 : (symbol?.maxWidth ?? 9)) * fontSize,
        fontFamily: text.fontFamily,
        fontFamilyFallback: text.fontFamilyFallback,
      ),
      dpr: dpr,
      pass: _pass,
    );
  }
}
