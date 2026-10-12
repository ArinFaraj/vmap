import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show visibleForTesting;

import 'collision_boxes.dart';
import 'expr.dart';
import 'label_painter.dart';
import 'text_style.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'label_view.dart';
import 'pins.dart';
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
  SpriteSheet? get sheet => _sheet;
  SpriteSheet? _sheet;
  set sheet(SpriteSheet? value) {
    _sheet = value;
    for (final st in _states.values) {
      st.icon = null;
    }
    _placeAgain = true;
  }

  /// Pins drawn in place of the style's icons. Null draws the style's own.
  VmapPins? get pins => _pins;
  VmapPins? _pins;
  set pins(VmapPins? value) {
    if (identical(value, _pins)) return;
    _pins = value;
    _painter.dropPins();
    _placeAgain = true;
  }

  /// Space between a pin and its name.
  static const double _pinGap = 3;

  /// Clear space around the text an icon is stretched behind.
  static const double _fitPad = 3;
  double zoomOffset = 0;
  final EvalContext _context = EvalContext();

  /// The style layer that draws [c]. Null for a marker's name.
  SymbolLayer? _symbolOf(LabelCandidate c) =>
      c.marker == null ? symbols[c.source.layer] : null;

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

  /// Points the paint expressions at the feature behind [c].
  void _bind(LabelCandidate c) {
    final props = c.source.props;
    if (props == null) {
      _context
        ..props = const {}
        ..state = const {};
      return;
    }
    _context
      ..props = props
      ..state =
          stateOf?.call(symbols[c.source.layer].source, props[r'$id']) ??
          const {};
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
  List<(double, double, double, double, double, double)> _obstacles = const [];
  double _obstacleReach = 0;

  List<(double, double, double, double, double, double)> get obstacles =>
      _obstacles;
  set obstacles(List<(double, double, double, double, double, double)> value) {
    _obstacles = value;
    _obstacleReach = 0;
    for (final (_, _, w, h, _, _) in value) {
      _obstacleReach = math.max(_obstacleReach, math.max(w, h) / 2 + 6);
    }
    _placeAgain = true;
  }

  double _lastZoom = 0;

  final LabelView _view = LabelView();
  final CollisionBoxes _boxes = CollisionBoxes();
  late final RoadLabels _roads = RoadLabels(_view, _boxes);
  late final LabelPainter _painter = LabelPainter(_view, _roads);

  /// Road names follow bends. Off, a name is only written where the road is
  /// straight enough to carry it.
  bool get curvedRoads => _roads.curved;
  set curvedRoads(bool value) => _roads.curved = value;
  double _placedRotation = 0;

  /// A move of [by] logical pixels as the upright label frame sees it: one
  /// along the map's sides turns with the map.
  (double, double) _moved(Expr? translate, bool onScreen, double styleZoom) {
    if (translate == null) return (0, 0);
    final by = translate(_context..zoom = styleZoom);
    if (by is! List || by.length != 2) return (0, 0);
    final x = asNumber(by[0]) ?? 0, y = asNumber(by[1]) ?? 0;
    return onScreen || _view.rotation == 0
        ? (x, y)
        : (x * _view.cos - y * _view.sin, x * _view.sin + y * _view.cos);
  }

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
  }) {
    lastPlaceMicros = 0;
    final world = 256.0 * math.pow(2, zoom);
    _view.frame(rotation: rotation, size: size, world: world, origin: origin);
    if (_zooming && !zooming) _placeAgain = true;
    _zooming = zooming;
    final nowMs = _clock.elapsedMilliseconds;
    final moved =
        zoom != _placedZoom ||
        origin != _placedOrigin ||
        rotation != _placedRotation ||
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
      final sheet = _sheet;
      final pin = st.pin;
      final pins = _pins;
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
    if (rotation != 0) canvas.restore();
    return animating;
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
    final styleZoom = zoom - 1 + zoomOffset;
    final states = _frameStates..clear();
    const margin = 60.0;
    for (final list in sources) {
      for (final c in list) {
        if (!_inRange(c, styleZoom)) continue;
        _view.project(c.worldX, c.worldY);
        final sx = _view.x;
        final sy = _view.y;
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
          ..candidate = c
          ..sortKey = c.rank - (st.placed ? 45 : 0);
        states.add(st);
      }
    }
    states.sort((a, b) => a.sortKey - b.sortKey);

    _boxes.clear();
    _roads.startPass();
    final obstacleBoxes = [
      for (final (wx, wy, w, h, shiftX, shiftY) in obstacles)
        () {
          _view.project(wx, wy);
          final ox = _view.x + shiftX;
          final oy = _view.y + shiftY;
          return _boxes.add(ox - w / 2, oy - h / 2, ox + w / 2, oy + h / 2);
        }(),
    ];
    final fitKey = (zoom * 3).round();
    var considered = 0;
    for (final st in states) {
      if (++considered > _maxConsidered) {
        st.placed = false;
        continue;
      }
      final c = st.candidate;
      final isRoad = c.source.line != null;
      _bind(c);
      final layer = _symbolOf(c);
      final textPad = layer?.textPadding ?? CollisionBoxes.defaultPad;
      final iconPad = layer?.iconPadding ?? CollisionBoxes.defaultPad;
      final fontSize = _size(c, styleZoom);
      if (c.source.props != null && c.hasText) {
        final ink = _ink(symbols[c.source.layer]).hashCode;
        if (ink != c.ink) {
          c
            ..ink = ink
            ..spriteKey = '${c.source.layer}|${c.source.text}|$ink';
          st.sprite = null;
        }
      }
      if (st.sprite?.dropped ?? false) st.sprite = null;
      final sprite = st.sprite ??= _sprites[c.spriteKey];
      st.scale = sprite == null ? 1 : fontSize / sprite.fontSize;
      st.resize = _zooming
          ? st.scale < 0.7 || st.scale > 1.4
          : st.scale < 0.87 || st.scale > 1.15;
      final textW = sprite == null
          ? c.source.text.length * fontSize * 0.55
          : sprite.textWidth * st.scale;
      final textH = sprite == null
          ? fontSize * 1.35
          : sprite.textHeight * st.scale;

      st
        ..placed = false
        ..showText = c.hasText
        ..showIcon = false;
      if (isRoad) {
        _placeRoad(
          st,
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
        _placePoint(
          st,
          layer,
          sprite,
          fontSize,
          textW,
          textH,
          textPad,
          iconPad,
          styleZoom,
          obstacleBoxes,
        );
      }
    }
    _states.removeWhere((_, st) => st.seenPass != _pass && !st.live);
    _sprites.trim(_pass);
  }

  /// Places a name along its road, when the road can carry it and it runs
  /// into nothing placed before it.
  void _placeRoad(
    LabelState st,
    SymbolLayer? layer,
    LabelSprite? sprite,
    double fontSize,
    double textW,
    double textH,
    double textPad,
    double styleZoom,
    int fitKey,
  ) {
    final c = st.candidate;
    if (st.roadFitKey != fitKey) {
      st
        ..roadFitKey = fitKey
        ..roadFits = _roads.fit(
          st,
          textW,
          textH,
          c.tileSpan * _view.world / tileExtent,
          maxBend: layer?.maxBend,
        );
    }
    if (!st.roadFits || _roads.nearSame(st)) return;
    final room = fontSize <= 12.5 ? _minorRoadRoom : _majorRoadRoom;
    final (roadX, roadY) = layer == null
        ? (0.0, 0.0)
        : _moved(layer.textTranslate, layer.textTranslateOnScreen, styleZoom);
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
      ..dy = roadY
      ..placed = true;
    if (!st.live) {
      st.live = true;
      _live.add(st);
    }
    sprite?.usedPass = _pass;
    _roads.placed(st);
  }

  /// Places a point's text and icon, the text trying each side the layer
  /// allows, or stepping aside for a marker.
  void _placePoint(
    LabelState st,
    SymbolLayer? symbol,
    LabelSprite? sprite,
    double fontSize,
    double textW,
    double textH,
    double textPad,
    double iconPad,
    double styleZoom,
    List<int> obstacleBoxes,
  ) {
    final c = st.candidate;
    st
      ..worldX = c.worldX
      ..worldY = c.worldY
      ..angle = 0
      ..curve = null
      ..screenAngle = 0;
    if (c.source.spaced && c.hasText && _roads.nearSame(st)) return;
    final spin = (symbol?.textRotate ?? 0) * math.pi / 180;
    st.screenAngle = spin;
    _view.project(st.worldX, st.worldY);
    final spot = _Spot(
      _view.x,
      _view.y,
      textW,
      textH,
      spin,
      textPad: textPad,
      iconPad: iconPad,
    );
    final moved = symbol == null
        ? (0.0, 0.0)
        : _moved(symbol.textTranslate, symbol.textTranslateOnScreen, styleZoom);
    var text = _textOffset(symbol, c, fontSize, spot, moved);
    final icon = _sizeIcon(st, symbol, spot, styleZoom);
    final pin = _choosePin(st, symbol);
    if (pin != null && c.hasText) text = _besidePin(symbol!, spot, pin.$2);
    final hasIcon = icon != null || pin != null;
    if (!hasIcon && !c.hasText) return;

    final sides = symbol?.anchors ?? const <String>[];
    final textFits = !c.hasText
        ? false
        : sides.isNotEmpty
        ? _fitOnSides(st, symbol!, sides, fontSize, spot, moved, pin?.$2)
        : obstacles.isEmpty
        ? _fitInPlace(st, symbol, spot, text)
        : _fitAside(st, spot, text, hasIcon, obstacleBoxes);
    final fitted = pin == null && (symbol?.textFit ?? false);
    final iconFits =
        hasIcon &&
        ((symbol?.iconOverlaps ?? false) ||
            fitted ||
            !_boxes.collides(
              spot.x + st.iconDx,
              spot.y + st.iconDy,
              st.iconW,
              st.iconH,
              0,
              pad: iconPad,
            ));
    final bool showText;
    final bool showIcon;
    if (c.hasText && hasIcon) {
      showText = textFits && (iconFits || symbol!.iconOptional);
      showIcon = iconFits && (textFits || symbol!.textOptional);
    } else {
      showText = textFits;
      showIcon = iconFits;
    }
    if (!showText && !showIcon) return;
    if (showText && !(symbol?.textIgnored ?? false)) {
      _boxes.take(
        spot.x + st.dx,
        spot.y + st.dy,
        textW,
        textH,
        spin,
        pad: textPad,
      );
    }
    if (showIcon && !fitted && !(symbol?.iconIgnored ?? false)) {
      _boxes.take(
        spot.x + st.iconDx,
        spot.y + st.iconDy,
        st.iconW,
        st.iconH,
        0,
        pad: iconPad,
      );
    }
    st
      ..showText = showText
      ..showIcon = showIcon;
    if (c.source.spaced && c.hasText) _roads.placed(st);
    st.placed = true;
    if (!st.live) {
      st.live = true;
      _live.add(st);
    }
    sprite?.usedPass = _pass;
  }

  /// Where the text's middle sits from its point: the layer's anchor and
  /// offset, turned with the text, then moved by its translate.
  (double, double) _textOffset(
    SymbolLayer? symbol,
    LabelCandidate c,
    double fontSize,
    _Spot spot,
    (double, double) moved,
  ) {
    var tx = 0.0;
    var ty = 0.0;
    if (symbol != null && c.hasText) {
      tx = symbol.offsetX * fontSize;
      ty = symbol.offsetY * fontSize;
      final anchor = symbol.anchor;
      if (anchor.startsWith('top')) ty += spot.textH / 2;
      if (anchor.startsWith('bottom')) ty -= spot.textH / 2;
      if (anchor.endsWith('left')) tx += spot.textW / 2;
      if (anchor.endsWith('right')) tx -= spot.textW / 2;
      if (spot.spin != 0) {
        final cos = math.cos(spot.spin);
        final sin = math.sin(spot.spin);
        (tx, ty) = (tx * cos - ty * sin, tx * sin + ty * cos);
      }
    }
    return (tx + moved.$1, ty + moved.$2);
  }

  /// Finds the style's icon for [st] and sets where and how large it is
  /// drawn. Null when the label has no icon.
  SpriteImage? _sizeIcon(
    LabelState st,
    SymbolLayer? symbol,
    _Spot spot,
    double styleZoom,
  ) {
    final c = st.candidate;
    var icon = st.icon;
    if (icon == null && c.source.icon.isNotEmpty) {
      icon = st.icon = _sheet?.entries[c.source.icon];
    }
    st
      ..iconDx = 0
      ..iconDy = 0;
    if (icon == null || symbol == null) return icon;
    final by = asNumber(symbol.iconSize(_context..zoom = styleZoom)) ?? 1;
    if (!symbol.textFit) {
      final (ax, ay) = anchorSides(symbol.iconAnchor);
      st
        ..iconDx = symbol.iconOffsetX * by + ax * icon.width * by / 2
        ..iconDy = symbol.iconOffsetY * by + ay * icon.height * by / 2;
    }
    final (ix, iy) = _moved(
      symbol.iconTranslate,
      symbol.iconTranslateOnScreen,
      styleZoom,
    );
    st
      ..iconDx += ix
      ..iconDy += iy
      ..iconW = symbol.textFit ? spot.textW + _fitPad * 2 : icon.width * by
      ..iconH = symbol.textFit ? spot.textH + _fitPad * 2 : icon.height * by
      ..iconOpacity = (asNumber(symbol.iconOpacity(_context)) ?? 1).clamp(
        0.0,
        1.0,
      );
    return icon;
  }

  /// The pin drawn in place of [st]'s icon, and how far its name sits from
  /// its middle, when the app draws pins and has one for the icon.
  (VmapPin, double)? _choosePin(LabelState st, SymbolLayer? symbol) {
    final pins = _pins;
    final name = st.candidate.source.icon;
    final pin = pins == null || symbol == null || name.isEmpty
        ? null
        : pins.resolve(name, place: symbol.sourceLayer == 'poi');
    st.pin = pin;
    if (pin == null) return null;
    st
      ..iconDx = 0
      ..iconDy = 0
      ..iconW = pins!.size
      ..iconH = pins.size
      ..iconOpacity = 1;
    return (pin, pins.size / 2 + _pinGap);
  }

  /// Where a name sits beside a pin, on the side its anchor names.
  (double, double) _besidePin(SymbolLayer symbol, _Spot spot, double reach) {
    final anchor = symbol.anchor;
    if (anchor.endsWith('left')) return (reach + spot.textW / 2, 0);
    if (anchor.endsWith('right')) return (-reach - spot.textW / 2, 0);
    if (anchor.startsWith('bottom')) return (0, -reach - spot.textH / 2);
    return (0, reach + spot.textH / 2);
  }

  /// Tries the layer's variable anchors in turn, the side the text took
  /// last first so a label stays put while it still fits there.
  bool _fitOnSides(
    LabelState st,
    SymbolLayer symbol,
    List<String> sides,
    double fontSize,
    _Spot spot,
    (double, double) moved,
    double? pinReach,
  ) {
    final away = pinReach ?? symbol.radialOffset * fontSize;
    final first = st.side < sides.length ? st.side : 0;
    for (var k = 0; k < sides.length; k++) {
      final at = (first + k) % sides.length;
      final (ax, ay) = anchorSides(sides[at]);
      final double fx, fy;
      if (away > 0) {
        final reach = ax != 0 && ay != 0 ? away / math.sqrt2 : away;
        fx = moved.$1 + ax * (reach + spot.textW / 2);
        fy = moved.$2 + ay * (reach + spot.textH / 2);
      } else {
        fx =
            moved.$1 +
            ax * ((symbol.offsetX * fontSize).abs() + spot.textW / 2);
        fy =
            moved.$2 +
            ay * ((symbol.offsetY * fontSize).abs() + spot.textH / 2);
      }
      if (!symbol.textOverlaps && _textHits(spot, fx, fy)) continue;
      st
        ..side = at
        ..dx = fx
        ..dy = fy;
      return true;
    }
    return false;
  }

  /// Puts the text where its layer puts it.
  bool _fitInPlace(
    LabelState st,
    SymbolLayer? symbol,
    _Spot spot,
    (double, double) text,
  ) {
    st
      ..dx = text.$1
      ..dy = text.$2;
    return (symbol?.textOverlaps ?? false) ||
        !_textHits(spot, text.$1, text.$2);
  }

  /// With markers on the map, keeps the text where it was, or steps it to
  /// a side clear of them. A marker's own name steps beside its marker, on
  /// the side its text starts from, and may sit flush against it.
  bool _fitAside(
    LabelState st,
    _Spot spot,
    (double, double) text,
    bool hasIcon,
    List<int> obstacleBoxes,
  ) {
    final c = st.candidate;
    final beside = c.marker != null;
    var down = spot.textH / 2 + _obstacleReach;
    var across = spot.textW / 2 + _obstacleReach;
    var (shiftX, shiftY) = text;
    int? ownBox;
    if (c.marker case final own?) {
      final (_, _, w, h, ox, oy) = obstacles[own];
      down = spot.textH / 2 + h / 2 + 2;
      across = spot.textW / 2 + w / 2 + 4;
      ownBox = obstacleBoxes[own];
      (shiftX, shiftY) = (ox, oy);
    }
    final first = beside && c.startsRight ? -across : across;
    for (var k = 0; k < 6; k++) {
      final ox = switch (k) {
        1 => st.dx,
        2 => beside ? first : 0.0,
        3 => beside ? -first : 0.0,
        4 => beside ? 0.0 : across,
        5 => beside ? 0.0 : -across,
        _ => 0.0,
      };
      final oy = switch (k) {
        1 => st.dy,
        2 => beside ? 0.0 : down,
        3 => beside ? 0.0 : -down,
        4 => beside ? down : 0.0,
        5 => beside ? -down : 0.0,
        _ => 0.0,
      };
      if (beside && (k == 1 || (ox == 0 && oy == 0))) continue;
      if (hasIcon && k > 1) break;
      final fx = k == 1 ? ox : ox + shiftX;
      final fy = k == 1 ? oy : oy + shiftY;
      if (_textHits(spot, fx, fy, except: ownBox)) continue;
      st
        ..dx = fx
        ..dy = fy;
      return true;
    }
    return false;
  }

  /// Whether the text, moved [fx], [fy] from its point, runs into a box
  /// already taken.
  bool _textHits(_Spot spot, double fx, double fy, {int? except}) =>
      _boxes.collides(
        spot.x + fx,
        spot.y + fy,
        spot.textW,
        spot.textH,
        spot.spin,
        pad: spot.textPad,
        except: except,
      );

  /// Draws the label once, in the look its layer gives it, or for a
  /// marker's name the look the app gives markers.
  LabelSprite _rasterize(
    LabelState st,
    double styleZoom,
    int background,
    double dpr,
  ) {
    final c = st.candidate;
    final source = c.source;
    final beside = c.marker != null;
    final symbol = _symbolOf(c);
    _context.zoom = styleZoom;
    _bind(c);
    final fontSize = _size(c, styleZoom);
    final isRoad = source.line != null;
    final label = symbol?.uppercase ?? false
        ? source.text.toUpperCase()
        : source.text;
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

/// Where a point label is being placed on the upright screen, the size of
/// its text, and the room kept around its text and icon.
class _Spot {
  const _Spot(
    this.x,
    this.y,
    this.textW,
    this.textH,
    this.spin, {
    required this.textPad,
    required this.iconPad,
  });

  final double x;
  final double y;
  final double textW;
  final double textH;

  /// How far the text is turned, in radians.
  final double spin;
  final double textPad;
  final double iconPad;
}
