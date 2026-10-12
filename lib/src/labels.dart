import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show listEquals;

import 'collision_boxes.dart';
import 'expr.dart';
import 'label_sprites.dart';
import 'label_state.dart';
import 'label_view.dart';
import 'pins.dart';
import 'road_labels.dart';
import 'sprites.dart';
import 'style_model.dart';
import 'tile_builder.dart';

/// How text on the map is set. Sizes and colours of map labels come from the
/// style; the name beside a marker is the app's own.
class VmapTextStyle {
  const VmapTextStyle({
    this.fontFamily,
    this.fontFamilyFallback,
    this.scale = 1,
    this.markerSize = 12.5,
    this.markerWeight = 600,
    this.markerColor,
  });

  final String? fontFamily;
  final List<String>? fontFamilyFallback;

  /// Multiplies every label's size.
  final double scale;
  final double markerSize;
  final int markerWeight;

  /// Null picks a blue that reads on the style's background.
  final ui.Color? markerColor;

  @override
  bool operator ==(Object other) =>
      other is VmapTextStyle &&
      other.fontFamily == fontFamily &&
      listEquals(other.fontFamilyFallback, fontFamilyFallback) &&
      other.scale == scale &&
      other.markerSize == markerSize &&
      other.markerWeight == markerWeight &&
      other.markerColor == markerColor;

  @override
  int get hashCode => Object.hash(
    fontFamily,
    Object.hashAll(fontFamilyFallback ?? const []),
    scale,
    markerSize,
    markerWeight,
    markerColor,
  );
}

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
    _dropPinImages();
    _placeAgain = true;
  }

  final Map<VmapPin, ui.Image> _pinImages = {};
  double _pinRatio = 0;

  void _dropPinImages() {
    for (final image in _pinImages.values) {
      image.dispose();
    }
    _pinImages.clear();
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
  final LabelWork work = LabelWork();
  late final LabelSprites _sprites = LabelSprites(work);
  final List<LabelState> _frameStates = [];

  /// The labels that are showing or fading, which is all a frame draws.
  final List<LabelState> _live = [];
  final ui.Paint _imagePaint = ui.Paint()
    ..filterQuality = ui.FilterQuality.medium;
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

  /// The keys of the labels showing, for a test to read.
  Set<String> get shownKeys => {
    for (final st in _live)
      if (st.opacity > 0) st.candidate.key,
  };

  void clear() {
    _sprites.clear();
    _dropPinImages();
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
        _drawPin(canvas, st, pin, pins, devicePixelRatio);
      } else if (icon != null && st.showIcon && sheet != null) {
        _drawIcon(
          canvas,
          st,
          icon,
          sheet,
          styleZoom,
          devicePixelRatio,
          rotation,
        );
      }
      _imagePaint.colorFilter = null;
      if (sprite == null || !wantsText) continue;
      _drawText(canvas, st, sprite, devicePixelRatio, rotation);
    }
    _live.length = kept;
    if (rotation != 0) canvas.restore();
    return animating;
  }

  void _drawPin(
    ui.Canvas canvas,
    LabelState st,
    VmapPin pin,
    VmapPins pins,
    double devicePixelRatio,
  ) {
    if (_pinRatio != devicePixelRatio) {
      _dropPinImages();
      _pinRatio = devicePixelRatio;
    }
    final image = _pinImages[pin] ??= drawPin(pin, pins.size, devicePixelRatio);
    _imagePaint.color = ui.Color.fromRGBO(255, 255, 255, st.opacity);
    final extent = pins.size + pinPad * 2;
    _view.project(st.worldX, st.worldY);
    final px = _view.x - extent / 2;
    final py = _view.y - extent / 2;
    canvas.drawImageRect(
      image,
      ui.Rect.fromLTWH(0, 0, image.width.toDouble(), image.height.toDouble()),
      ui.Rect.fromLTWH(
        (px * devicePixelRatio).roundToDouble() / devicePixelRatio,
        (py * devicePixelRatio).roundToDouble() / devicePixelRatio,
        extent,
        extent,
      ),
      _imagePaint,
    );
  }

  void _drawIcon(
    ui.Canvas canvas,
    LabelState st,
    SpriteImage icon,
    SpriteSheet sheet,
    double styleZoom,
    double devicePixelRatio,
    double rotation,
  ) {
    _imagePaint.color = ui.Color.fromRGBO(
      255,
      255,
      255,
      st.opacity * st.iconOpacity,
    );
    final symbol = _symbolOf(st.candidate);
    ui.ColorFilter? fill, rim;
    if (icon.sdf && symbol != null) {
      _context.zoom = styleZoom;
      _bind(st.candidate);
      final by = st.iconW / icon.width;
      fill = _sdfFilter(
        Rgba.of(symbol.iconColor(_context)) ?? Rgba.black,
        by * devicePixelRatio,
      );
      final reach = asNumber(symbol.iconHaloWidth?.call(_context)) ?? 0;
      final around = Rgba.of(symbol.iconHaloColor?.call(_context));
      if (reach > 0 && around != null && by > 0) {
        rim = _sdfFilter(
          around,
          by * devicePixelRatio,
          edge: (0.75 - reach / (8 * by)).clamp(0.1, 0.75),
          fade: (asNumber(symbol.iconHaloBlur?.call(_context)) ?? 0) / (8 * by),
        );
      }
    }
    final fit = symbol?.textFit ?? false;
    _view.project(st.worldX, st.worldY);
    final ix = _view.x + (fit ? st.dx : st.iconDx);
    final iy = _view.y + (fit ? st.dy : st.iconDy);
    final from = st.candidate.source;
    final turn = from.turns ? from.angle + rotation : from.angle;
    final area = ui.Rect.fromLTWH(
      -st.iconW / 2,
      -st.iconH / 2,
      st.iconW,
      st.iconH,
    );
    for (final filter in [?rim, fill]) {
      _imagePaint.colorFilter = filter;
      if (turn == 0) {
        canvas.drawImageRect(
          sheet.image,
          icon.source,
          area.translate(
            (ix * devicePixelRatio).roundToDouble() / devicePixelRatio,
            (iy * devicePixelRatio).roundToDouble() / devicePixelRatio,
          ),
          _imagePaint,
        );
      } else {
        canvas
          ..save()
          ..translate(ix, iy)
          ..rotate(turn)
          ..drawImageRect(sheet.image, icon.source, area, _imagePaint)
          ..restore();
      }
    }
  }

  /// Draws a label's text: an image cut into strips along a bent road, a
  /// recording played back, or an image.
  void _drawText(
    ui.Canvas canvas,
    LabelState st,
    LabelSprite sprite,
    double devicePixelRatio,
    double rotation,
  ) {
    final pixelW = sprite.pixelW;
    final pixelH = sprite.pixelH;
    _imagePaint.color = ui.Color.fromRGBO(255, 255, 255, st.opacity);
    if (sprite case ImageSprite(:final image) when st.curve != null) {
      final textW = sprite.textWidth * st.scale;
      final n = RoadLabels.stripCount(textW, sprite.textHeight * st.scale);
      final strips = _roads.strips(st, n, textW / n / _view.world);
      final flip = math.cos(st.angle + rotation) < 0;
      final pad = LabelSprites.haloPad * pixelW / sprite.width;
      final slice = (pixelW - pad * 2) / n;
      final k = sprite.width * st.scale / pixelW;
      final transforms = Float32List(n * 4);
      final rects = Float32List(n * 4);
      for (var j = 0; j < n; j++) {
        final i = flip ? n - 1 - j : j;
        final a = strips[i * 3 + 2] + rotation + (flip ? math.pi : 0);
        _view.project(strips[i * 3], strips[i * 3 + 1]);
        final left = j == 0 ? 0.0 : pad + j * slice - 0.5;
        final right = j == n - 1 ? pixelW : pad + (j + 1) * slice + 0.5;
        final anchorX = pad + (j + 0.5) * slice - left;
        final anchorY = pixelH / 2;
        final scos = math.cos(a) * k;
        final ssin = math.sin(a) * k;
        transforms[j * 4] = scos;
        transforms[j * 4 + 1] = ssin;
        transforms[j * 4 + 2] =
            _view.x + st.dx - scos * anchorX + ssin * anchorY;
        transforms[j * 4 + 3] =
            _view.y + st.dy - ssin * anchorX - scos * anchorY;
        rects[j * 4] = left;
        rects[j * 4 + 1] = 0;
        rects[j * 4 + 2] = right;
        rects[j * 4 + 3] = pixelH;
      }
      canvas.drawRawAtlas(
        image,
        transforms,
        rects,
        null,
        null,
        null,
        _imagePaint,
      );
      return;
    }
    _view.project(st.worldX, st.worldY);
    final sx = _view.x + st.dx;
    final sy = _view.y + st.dy;
    final turn = st.screenAngle;
    final w = sprite.width * st.scale;
    final h = sprite.height * st.scale;
    if (sprite case PictureSprite(:final picture)) {
      canvas.save();
      if (turn == 0) {
        canvas.translate(
          ((sx - w / 2) * devicePixelRatio).roundToDouble() / devicePixelRatio,
          ((sy - h / 2) * devicePixelRatio).roundToDouble() / devicePixelRatio,
        );
      } else {
        canvas
          ..translate(sx, sy)
          ..rotate(turn)
          ..translate(-w / 2, -h / 2);
      }
      canvas.scale(st.scale);
      final fading = st.opacity < 1;
      if (fading) {
        canvas.saveLayer(
          ui.Rect.fromLTWH(0, 0, sprite.width, sprite.height),
          _imagePaint,
        );
      }
      canvas.drawPicture(picture);
      if (fading) canvas.restore();
      canvas.restore();
      return;
    }
    final image = (sprite as ImageSprite).image;
    final source = ui.Rect.fromLTWH(0, 0, pixelW, pixelH);
    if (turn == 0) {
      final left =
          ((sx - w / 2) * devicePixelRatio).roundToDouble() / devicePixelRatio;
      final top =
          ((sy - h / 2) * devicePixelRatio).roundToDouble() / devicePixelRatio;
      canvas.drawImageRect(
        image,
        source,
        ui.Rect.fromLTWH(left, top, w, h),
        _imagePaint,
      );
    } else {
      canvas
        ..save()
        ..translate(sx, sy)
        ..rotate(turn)
        ..drawImageRect(
          image,
          source,
          ui.Rect.fromLTWH(-w / 2, -h / 2, w, h),
          _imagePaint,
        )
        ..restore();
    }
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
    _roads.placed.clear();
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
      _boxes.pad = textPad;
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
      final reach = (textH + room) / 2 + _boxes.pad;
      if (_roads.curveHits(st, textW, textH, reach, add: false)) {
        return;
      }
      _roads.curveHits(st, textW, textH, reach, add: true);
    } else {
      if (_boxes.collides(sx, sy, textW + room, textH + room, turn)) {
        return;
      }
      _boxes.take(sx, sy, textW + room, textH + room, turn);
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
    _roads.placed.add(st);
  }

  /// Places a point's text and icon, the text trying each side the layer
  /// allows, or stepping aside for a marker.
  void _placePoint(
    LabelState st,
    SymbolLayer? layer,
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
    final beside = c.marker != null;
    final symbol = _symbolOf(c);
    if (c.source.spaced && c.hasText && _roads.nearSame(st)) return;
    final spin = (symbol?.textRotate ?? 0) * math.pi / 180;
    st.screenAngle = spin;
    _view.project(st.worldX, st.worldY);
    final sx = _view.x;
    final sy = _view.y;

    var tx = 0.0;
    var ty = 0.0;
    if (symbol != null && c.hasText) {
      tx = symbol.offsetX * fontSize;
      ty = symbol.offsetY * fontSize;
      final anchor = symbol.anchor;
      if (anchor.startsWith('top')) ty += textH / 2;
      if (anchor.startsWith('bottom')) ty -= textH / 2;
      if (anchor.endsWith('left')) tx += textW / 2;
      if (anchor.endsWith('right')) tx -= textW / 2;
      if (spin != 0) {
        final cos = math.cos(spin);
        final sin = math.sin(spin);
        (tx, ty) = (tx * cos - ty * sin, tx * sin + ty * cos);
      }
    }
    final (moveX, moveY) = symbol == null
        ? (0.0, 0.0)
        : _moved(symbol.textTranslate, symbol.textTranslateOnScreen, styleZoom);
    tx += moveX;
    ty += moveY;

    var icon = st.icon;
    if (icon == null && c.source.icon.isNotEmpty) {
      icon = st.icon = _sheet?.entries[c.source.icon];
    }
    st
      ..iconDx = 0
      ..iconDy = 0;
    if (icon != null && symbol != null) {
      final by = asNumber(symbol.iconSize(_context..zoom = styleZoom)) ?? 1;
      if (!symbol.textFit) {
        final (ax, ay) = _sides(symbol.iconAnchor);
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
        ..iconDy += iy;
      st
        ..iconW = symbol.textFit ? textW + _fitPad * 2 : icon.width * by
        ..iconH = symbol.textFit ? textH + _fitPad * 2 : icon.height * by
        ..iconOpacity = (asNumber(symbol.iconOpacity(_context)) ?? 1).clamp(
          0.0,
          1.0,
        );
    }
    final pins = _pins;
    final pin = pins == null || symbol == null || c.source.icon.isEmpty
        ? null
        : pins.resolve(c.source.icon, place: symbol.sourceLayer == 'poi');
    st.pin = pin;
    if (pin != null) {
      st
        ..iconDx = 0
        ..iconDy = 0
        ..iconW = pins!.size
        ..iconH = pins.size
        ..iconOpacity = 1;
      if (c.hasText) {
        final reach = pins.size / 2 + _pinGap;
        final anchor = symbol!.anchor;
        tx = 0;
        ty = 0;
        if (anchor.endsWith('left')) {
          tx = reach + textW / 2;
        } else if (anchor.endsWith('right')) {
          tx = -reach - textW / 2;
        } else if (anchor.startsWith('bottom')) {
          ty = -reach - textH / 2;
        } else {
          ty = reach + textH / 2;
        }
      }
    }
    final hasIcon = icon != null || pin != null;
    if (!hasIcon && !c.hasText) return;

    var textFits = false;
    final sides = symbol?.anchors ?? const <String>[];
    if (c.hasText && sides.isNotEmpty) {
      // The side the text took last is tried first, so a label stays put
      // while it still fits there.
      final away = pin != null
          ? pins!.size / 2 + _pinGap
          : symbol!.radialOffset * fontSize;
      final first = st.side < sides.length ? st.side : 0;
      for (var k = 0; k < sides.length && !textFits; k++) {
        final at = (first + k) % sides.length;
        final (ax, ay) = _sides(sides[at]);
        final double fx, fy;
        if (away > 0) {
          final reach = ax != 0 && ay != 0 ? away / math.sqrt2 : away;
          fx = moveX + ax * (reach + textW / 2);
          fy = moveY + ay * (reach + textH / 2);
        } else {
          fx = moveX + ax * ((symbol!.offsetX * fontSize).abs() + textW / 2);
          fy = moveY + ay * ((symbol.offsetY * fontSize).abs() + textH / 2);
        }
        if (!(symbol!.textOverlaps) &&
            _boxes.collides(sx + fx, sy + fy, textW, textH, spin)) {
          continue;
        }
        st
          ..side = at
          ..dx = fx
          ..dy = fy;
        textFits = true;
      }
    } else if (c.hasText) {
      if (obstacles.isEmpty) {
        textFits =
            (symbol?.textOverlaps ?? false) ||
            !_boxes.collides(sx + tx, sy + ty, textW, textH, spin);
        st
          ..dx = tx
          ..dy = ty;
      } else {
        var down = textH / 2 + _obstacleReach;
        var across = textW / 2 + _obstacleReach;
        var shiftX = tx;
        var shiftY = ty;
        if (beside) {
          final own = c.marker!;
          down = textH / 2 + obstacles[own].$4 / 2 + 2;
          across = textW / 2 + obstacles[own].$3 / 2 + 4;
          _boxes.ignored = obstacleBoxes[own];
          shiftX = obstacles[own].$5;
          shiftY = obstacles[own].$6;
        }
        final first = beside && c.startsRight ? -across : across;
        for (var k = 0; k < 6 && !textFits; k++) {
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
          if (_boxes.collides(sx + fx, sy + fy, textW, textH, spin)) continue;
          st
            ..dx = fx
            ..dy = fy;
          textFits = true;
        }
        _boxes.ignored = null;
      }
    }
    final fitted = pin == null && (symbol?.textFit ?? false);
    _boxes.pad = iconPad;
    final iconFits =
        hasIcon &&
        ((symbol?.iconOverlaps ?? false) ||
            fitted ||
            !_boxes.collides(
              sx + st.iconDx,
              sy + st.iconDy,
              st.iconW,
              st.iconH,
              0,
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
      _boxes.pad = textPad;
      _boxes.take(sx + st.dx, sy + st.dy, textW, textH, spin);
    }
    if (showIcon && !fitted && !(symbol?.iconIgnored ?? false)) {
      _boxes.pad = iconPad;
      _boxes.take(sx + st.iconDx, sy + st.iconDy, st.iconW, st.iconH, 0);
    }
    st
      ..showText = showText
      ..showIcon = showIcon;
    if (c.source.spaced && c.hasText) _roads.placed.add(st);
    st.placed = true;
    if (!st.live) {
      st.live = true;
      _live.add(st);
    }
    sprite?.usedPass = _pass;
  }

  /// Which way a thing lies from its point when [anchor] is the part of it
  /// on the point: 1 for right or below, -1 for left or above, 0 for neither.
  static (double, double) _sides(String anchor) => (
    anchor.endsWith('left')
        ? 1
        : anchor.endsWith('right')
        ? -1
        : 0,
    anchor.startsWith('top')
        ? 1
        : anchor.startsWith('bottom')
        ? -1
        : 0,
  );

  /// Turns a distance field into a crisp shape in [tint]. The edge of the
  /// shape is where the field is [edge] full, three quarters for the shape
  /// itself and less for a rim around it; [scale] is how many screen pixels
  /// one pixel of the field covers, which sets how sharp the edge may be.
  /// The edge fades out over [fade] of the field's range.
  static ui.ColorFilter _sdfFilter(
    Rgba tint,
    double scale, {
    double edge = 0.75,
    double fade = 0,
  }) {
    final crisp = (6 * scale).clamp(2.0, 24.0);
    final gain = fade > 0 ? math.min(crisp, 1 / fade) : crisp;
    return ui.ColorFilter.matrix([
      0, 0, 0, 0, tint.r * 255, //
      0, 0, 0, 0, tint.g * 255,
      0, 0, 0, 0, tint.b * 255,
      0, 0, 0, gain * tint.a, (0.5 - edge * gain) * 255 * tint.a,
    ]);
  }

  static bool _isRtl(String text) {
    for (final unit in text.codeUnits) {
      if (unit >= 0x0590 && unit <= 0x08FF ||
          unit >= 0xFB1D && unit <= 0xFEFC) {
        return true;
      }
      if (unit >= 0x41 && unit <= 0x24F) return false;
    }
    return false;
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
    final rightToLeft = _isRtl(label);
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
