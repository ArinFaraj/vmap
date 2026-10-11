import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show listEquals;

import 'expr.dart';
import 'sprites.dart';
import 'style.dart';
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

class LabelCandidate {
  LabelCandidate(this.key, this.source, this.tileX, this.tileY, this.tileSpan)
    : worldX = tileX + source.x / tileExtent * tileSpan,
      worldY = tileY + source.y / tileExtent * tileSpan,
      _line = source.line;

  final String key;
  late final String spriteKey = '${source.layer}|${source.text}';

  /// Whether the text reads right to left, so its first letter is at its
  /// right edge.
  late final bool startsRight = _startsRight(source.text);

  static bool _startsRight(String text) {
    for (final unit in text.codeUnits) {
      if (unit >= 0x0590 && unit <= 0x08ff) return true;
      if ((unit >= 0x41 && unit <= 0x5a) || (unit >= 0x61 && unit <= 0x7a)) {
        return false;
      }
    }
    return false;
  }

  final BuiltLabel source;
  late final bool hasText = source.text.isNotEmpty;

  /// The owning tile's corner and width, as fractions of the world.
  final double tileX;
  final double tileY;
  final double tileSpan;
  final double worldX;
  final double worldY;
  final Float32List? _line;
  late final double lineLength = _length(_line);

  static double _length(Float32List? line) {
    if (line == null) return 0;
    var total = 0.0;
    for (var i = 2; i < line.length; i += 2) {
      final dx = line[i] - line[i - 2];
      final dy = line[i + 1] - line[i - 1];
      total += math.sqrt(dx * dx + dy * dy);
    }
    return total;
  }
}

/// A label drawn once into an image, shared by every label with the same
/// text and class.
class _Sprite {
  _Sprite(
    this.image,
    this.width,
    this.height,
    this.textWidth,
    this.textHeight,
    this.fontSize,
  );

  final ui.Image image;

  /// The size the text was drawn at. The image is scaled while the label's
  /// size stays close to it.
  final double fontSize;
  final double width;
  final double height;
  final double textWidth;
  final double textHeight;
  int usedPass = 0;

  /// Evicted from the cache; its image is gone.
  bool dropped = false;
}

class _LabelState {
  _LabelState(this.candidate);

  LabelCandidate candidate;
  _Sprite? sprite;
  double opacity = 0;
  bool placed = false;
  int seenPass = -1;
  int sortKey = 0;
  double worldX = 0;
  double worldY = 0;
  double angle = 0;

  /// The label's size now over the size its image was drawn at.
  double scale = 1;

  /// The image is too far from the label's size and wants drawing again.
  bool resize = false;

  /// Where the label sits relative to its anchor, in screen pixels, after
  /// stepping aside for a reserved area.
  double dx = 0;
  double dy = 0;
  int roadFitKey = -1;
  bool roadFits = false;

  /// The icon at the anchor and the size it is drawn at.
  SpriteImage? icon;
  double iconW = 0;
  double iconH = 0;
  double iconOpacity = 1;
  bool showIcon = false;
  bool showText = true;

  /// In the list of labels that are showing or fading.
  bool live = false;
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

  /// Clear space around the text an icon is stretched behind.
  static const double _fitPad = 3;
  double zoomOffset = 0;
  final EvalContext _context = EvalContext();

  double _size(int layer, double styleZoom) {
    if (layer < 0) return text.markerSize * text.scale;
    _context.zoom = styleZoom;
    return (asNumber(symbols[layer].size(_context)) ?? 16) * text.scale;
  }

  bool _inRange(int layer, double styleZoom) =>
      layer < 0 ||
      (styleZoom >= symbols[layer].minZoom &&
          styleZoom < symbols[layer].maxZoom);

  static const double _fadeSeconds = 0.2;
  static const double _haloPad = 4;

  /// UI-thread time a frame may spend drawing new labels into images.
  /// Candidates weighed per placement, best priority first. The rest are the
  /// least important street names and wait for a closer zoom.
  static const int _maxConsidered = 240;

  /// The halo is the text redrawn in the background colour around itself.
  /// A blurred shadow looks the same and stalls the raster thread for tens of
  /// milliseconds per label image.
  static const List<ui.Offset> _haloOffsets = [
    ui.Offset(1.5, 0),
    ui.Offset(-1.5, 0),
    ui.Offset(0, 1.5),
    ui.Offset(0, -1.5),
    ui.Offset(1.1, 1.1),
    ui.Offset(-1.1, 1.1),
    ui.Offset(1.1, -1.1),
    ui.Offset(-1.1, -1.1),
  ];

  /// Extra clear space kept around street names, so a grid of short streets
  /// names a few of them instead of all of them.
  static const double _minorRoadRoom = 34;
  static const double _majorRoadRoom = 14;
  static const int _placementIntervalMs = 90;
  static const int _zoomingIntervalMs = 350;
  static const double _roadRepeatDistance = 260;

  static const int _maxSprites = 1400;

  /// A frame that spent this long placing labels draws no new text images;
  /// they wait a frame, so the two costs never land on the same one.
  static const int _heavyPlaceMicros = 800;

  final Map<String, _LabelState> _states = {};
  final Map<String, _Sprite> _sprites = {};
  final List<_LabelState> _frameStates = [];

  /// The labels that are showing or fading, which is all a frame draws.
  final List<_LabelState> _live = [];
  Float32List _boxes = Float32List(1024);
  int _boxCount = 0;
  final List<_LabelState> _placedRoads = [];
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

  /// The collision box of the marker whose own name is being placed, which
  /// that name may sit flush against. -1 otherwise.
  int _ownBox = -1;
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

  /// While the zoom is changing a label's image is stretched further before
  /// it is drawn again, and sharpened once the zoom rests.
  bool _zooming = false;
  int lastRasterMicros = 0;
  int rasterizedTotal = 0;
  int resizedTotal = 0;
  int evictedTotal = 0;
  int statesWalked = 0;

  int get stateCount => _states.length;
  int get spriteCount => _sprites.length;

  int get shown => _states.values.where((s) => s.opacity > 0).length;

  void clear() {
    for (final sprite in _sprites.values) {
      sprite.image.dispose();
    }
    _sprites.clear();
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
    if (_zooming && !zooming) _placeAgain = true;
    _zooming = zooming;
    final world = 256.0 * math.pow(2, zoom);
    final nowMs = _clock.elapsedMilliseconds;
    final moved =
        zoom != _placedZoom ||
        origin != _placedOrigin ||
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
      if (cached == null && st.sprite != null) resizedTotal++;
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
    rasterizedTotal += rasterized;
    _lastZoom = zoom;
    final styleZoom = zoom - 1 + zoomOffset;
    var animating = pending;
    final step = dt / _fadeSeconds;
    statesWalked += _live.length;
    var kept = 0;
    for (var i = 0; i < _live.length; i++) {
      final st = _live[i];
      final seen = st.seenPass == _pass;
      if (st.sprite?.dropped ?? false) {
        st.sprite = _sprites[st.candidate.spriteKey];
      }
      final sprite = st.sprite;
      final inRange = _inRange(st.candidate.source.layer, styleZoom);
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
      if (icon != null && st.showIcon && sheet != null) {
        _imagePaint.color = ui.Color.fromRGBO(
          255,
          255,
          255,
          st.opacity * st.iconOpacity,
        );
        final fit =
            st.candidate.source.layer >= 0 &&
            symbols[st.candidate.source.layer].textFit;
        final ix = st.worldX * world - origin.dx + (fit ? st.dx : 0);
        final iy = st.worldY * world - origin.dy + (fit ? st.dy : 0);
        final turn = st.candidate.source.angle - rotation;
        final area = ui.Rect.fromLTWH(
          -st.iconW / 2,
          -st.iconH / 2,
          st.iconW,
          st.iconH,
        );
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
      if (sprite == null || !wantsText) continue;
      final image = sprite.image;
      _imagePaint.color = ui.Color.fromRGBO(255, 255, 255, st.opacity);
      final sx = st.worldX * world - origin.dx + st.dx;
      final sy = st.worldY * world - origin.dy + st.dy;
      final turn = st.angle - rotation;
      final w = sprite.width * st.scale;
      final h = sprite.height * st.scale;
      final source = ui.Rect.fromLTWH(
        0,
        0,
        image.width.toDouble(),
        image.height.toDouble(),
      );
      if (turn == 0) {
        final left =
            ((sx - w / 2) * devicePixelRatio).roundToDouble() /
            devicePixelRatio;
        final top =
            ((sy - h / 2) * devicePixelRatio).roundToDouble() /
            devicePixelRatio;
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
    _live.length = kept;
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
        if (!_inRange(c.source.layer, styleZoom)) continue;
        final sx = c.worldX * world - origin.dx;
        final sy = c.worldY * world - origin.dy;
        if (sx < -margin ||
            sy < -margin ||
            sx > size.width + margin ||
            sy > size.height + margin) {
          continue;
        }
        final st = _states[c.key] ??= _LabelState(c);
        if (st.seenPass == _pass) continue;
        st
          ..seenPass = _pass
          ..candidate = c
          ..sortKey = c.source.priority - (st.placed ? 45 : 0);
        states.add(st);
      }
    }
    states.sort((a, b) => a.sortKey - b.sortKey);

    _boxCount = 0;
    _placedRoads.clear();
    for (final (wx, wy, w, h, shiftX, shiftY) in obstacles) {
      final ox = wx * world - origin.dx + shiftX;
      final oy = wy * world - origin.dy + shiftY;
      _addBox(ox - w / 2, oy - h / 2, ox + w / 2, oy + h / 2);
    }
    final fitKey = (zoom * 3).round();
    var considered = 0;
    for (final st in states) {
      if (++considered > _maxConsidered) {
        st.placed = false;
        continue;
      }
      final c = st.candidate;
      final isRoad = c.source.line != null;
      final fontSize = _size(c.source.layer, styleZoom);
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
        if (st.roadFitKey != fitKey) {
          st
            ..roadFitKey = fitKey
            ..roadFits = _fitRoad(
              st,
              textW,
              textH,
              c.tileSpan * world / tileExtent,
            );
        }
        if (!st.roadFits || _nearSameRoad(st, world)) continue;
        final room = fontSize <= 12.5 ? _minorRoadRoom : _majorRoadRoom;
        final sx = st.worldX * world - origin.dx;
        final sy = st.worldY * world - origin.dy;
        if (_collides(sx, sy, textW + room, textH + room, st.angle)) continue;
        _addBoxes(sx, sy, textW + room, textH + room, st.angle);
        st
          ..dx = 0
          ..dy = 0
          ..placed = true;
        if (!st.live) {
          st.live = true;
          _live.add(st);
        }
        sprite?.usedPass = _pass;
        _placedRoads.add(st);
        continue;
      }

      st
        ..worldX = c.worldX
        ..worldY = c.worldY
        ..angle = 0;
      final beside = c.source.layer < 0;
      final symbol = beside ? null : symbols[c.source.layer];
      if (c.source.spaced && c.hasText && _nearSameRoad(st, world)) continue;
      final sx = st.worldX * world - origin.dx;
      final sy = st.worldY * world - origin.dy;

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
      }

      var icon = st.icon;
      if (icon == null && c.source.icon.isNotEmpty) {
        icon = st.icon = _sheet?.entries[c.source.icon];
      }
      if (icon != null && symbol != null) {
        final by = asNumber(symbol.iconSize(_context..zoom = styleZoom)) ?? 1;
        st
          ..iconW = symbol.textFit ? textW + _fitPad * 2 : icon.width * by
          ..iconH = symbol.textFit ? textH + _fitPad * 2 : icon.height * by
          ..iconOpacity = (asNumber(symbol.iconOpacity(_context)) ?? 1).clamp(
            0.0,
            1.0,
          );
      }
      if (icon == null && !c.hasText) continue;

      var textFits = false;
      if (c.hasText) {
        if (obstacles.isEmpty) {
          textFits =
              (symbol?.textOverlaps ?? false) ||
              !_collides(sx + tx, sy + ty, textW, textH, 0);
          st
            ..dx = tx
            ..dy = ty;
        } else {
          var down = textH / 2 + _obstacleReach;
          var across = textW / 2 + _obstacleReach;
          var shiftX = tx;
          var shiftY = ty;
          if (beside) {
            final own = c.source.priority + 1000000;
            down = textH / 2 + obstacles[own].$4 / 2 + 2;
            across = textW / 2 + obstacles[own].$3 / 2 + 4;
            _ownBox = own * 4;
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
            if (icon != null && k > 1) break;
            final fx = k == 1 ? ox : ox + shiftX;
            final fy = k == 1 ? oy : oy + shiftY;
            if (_collides(sx + fx, sy + fy, textW, textH, 0)) continue;
            st
              ..dx = fx
              ..dy = fy;
            textFits = true;
          }
          _ownBox = -1;
        }
      }
      final iconFits =
          icon != null &&
          ((symbol?.iconOverlaps ?? false) ||
              (symbol?.textFit ?? false) ||
              !_collides(sx, sy, st.iconW, st.iconH, 0));
      final bool showText;
      final bool showIcon;
      if (c.hasText && icon != null) {
        showText = textFits && (iconFits || symbol!.iconOptional);
        showIcon = iconFits && (textFits || symbol!.textOptional);
      } else {
        showText = textFits;
        showIcon = iconFits;
      }
      if (!showText && !showIcon) continue;
      if (showText) _addBoxes(sx + st.dx, sy + st.dy, textW, textH, 0);
      if (showIcon && !(symbol?.textFit ?? false)) {
        _addBoxes(sx, sy, st.iconW, st.iconH, 0);
      }
      st
        ..showText = showText
        ..showIcon = showIcon;
      if (c.source.spaced && c.hasText) _placedRoads.add(st);
      st.placed = true;
      if (!st.live) {
        st.live = true;
        _live.add(st);
      }
      sprite?.usedPass = _pass;
    }
    _states.removeWhere((_, st) => st.seenPass != _pass && !st.live);
    if (_sprites.length > _maxSprites) {
      final unused = [
        for (final e in _sprites.entries)
          if (e.value.usedPass != _pass) e.key,
      ];
      for (final key in unused) {
        if (_sprites.length <= _maxSprites * 3 ~/ 4) break;
        evictedTotal++;
        _sprites.remove(key)!
          ..dropped = true
          ..image.dispose();
      }
    }
  }

  /// Finds a straight enough stretch around the road's middle to carry text
  /// [textW] pixels long, and sets the label's anchor and angle to it.
  bool _fitRoad(_LabelState st, double textW, double textH, double unitPx) {
    final c = st.candidate;
    final line = c.source.line!;
    final need = textW * 1.15 / unitPx;
    if (c.lineLength < need) return false;
    final half = textW / 2 / unitPx;
    final from = c.lineLength / 2 - half;
    final to = c.lineLength / 2 + half;
    var walked = 0.0;
    var ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0;
    var first = -1;
    var last = -1;
    final n = line.length ~/ 2;
    for (var i = 1; i < n; i++) {
      final x0 = line[i * 2 - 2];
      final y0 = line[i * 2 - 1];
      final dx = line[i * 2] - x0;
      final dy = line[i * 2 + 1] - y0;
      final seg = math.sqrt(dx * dx + dy * dy);
      if (seg == 0) continue;
      if (first < 0 && walked + seg >= from) {
        final t = (from - walked) / seg;
        ax = x0 + dx * t;
        ay = y0 + dy * t;
        first = i;
      }
      if (walked + seg >= to) {
        final t = (to - walked) / seg;
        bx = x0 + dx * t;
        by = y0 + dy * t;
        last = i;
        break;
      }
      walked += seg;
    }
    if (first < 0 || last < 0) return false;
    final cx = bx - ax;
    final cy = by - ay;
    final chord = math.sqrt(cx * cx + cy * cy);
    if (chord == 0) return false;
    final limit = textH * 0.3 / unitPx;
    for (var i = first; i < last; i++) {
      final px = line[i * 2] - ax;
      final py = line[i * 2 + 1] - ay;
      if ((px * cy - py * cx).abs() / chord > limit) return false;
    }
    var angle = math.atan2(cy, cx);
    if (angle > math.pi / 2) angle -= math.pi;
    if (angle < -math.pi / 2) angle += math.pi;
    st
      ..angle = angle
      ..worldX = c.tileX + (ax + bx) / 2 / tileExtent * c.tileSpan
      ..worldY = c.tileY + (ay + by) / 2 / tileExtent * c.tileSpan;
    return true;
  }

  bool _nearSameRoad(_LabelState st, double world) {
    final text = st.candidate.source.text;
    for (final other in _placedRoads) {
      if (other.candidate.source.text != text) continue;
      final dx = (other.worldX - st.worldX) * world;
      final dy = (other.worldY - st.worldY) * world;
      if (dx * dx + dy * dy < _roadRepeatDistance * _roadRepeatDistance) {
        return true;
      }
    }
    return false;
  }

  static const double _boxPad = 3;

  bool _collides(double sx, double sy, double w, double h, double angle) {
    if (angle == 0) {
      return _hits(
        sx - w / 2 - _boxPad,
        sy - h / 2 - _boxPad,
        sx + w / 2 + _boxPad,
        sy + h / 2 + _boxPad,
      );
    }
    final count = math.max(1, (w / h).ceil());
    final cosA = math.cos(angle);
    final sinA = math.sin(angle);
    final r = h / 2 + _boxPad;
    for (var i = 0; i < count; i++) {
      final d = count == 1 ? 0.0 : -w / 2 + h / 2 + (w - h) * i / (count - 1);
      final x = sx + cosA * d;
      final y = sy + sinA * d;
      if (_hits(x - r, y - r, x + r, y + r)) return true;
    }
    return false;
  }

  void _addBoxes(double sx, double sy, double w, double h, double angle) {
    if (angle == 0) {
      _addBox(
        sx - w / 2 - _boxPad,
        sy - h / 2 - _boxPad,
        sx + w / 2 + _boxPad,
        sy + h / 2 + _boxPad,
      );
      return;
    }
    final count = math.max(1, (w / h).ceil());
    final cosA = math.cos(angle);
    final sinA = math.sin(angle);
    final r = h / 2 + _boxPad;
    for (var i = 0; i < count; i++) {
      final d = count == 1 ? 0.0 : -w / 2 + h / 2 + (w - h) * i / (count - 1);
      final x = sx + cosA * d;
      final y = sy + sinA * d;
      _addBox(x - r, y - r, x + r, y + r);
    }
  }

  bool _hits(double l, double t, double r, double b) {
    final boxes = _boxes;
    for (var i = 0; i < _boxCount; i += 4) {
      if (i == _ownBox) continue;
      if (l < boxes[i + 2] &&
          r > boxes[i] &&
          t < boxes[i + 3] &&
          b > boxes[i + 1]) {
        return true;
      }
    }
    return false;
  }

  void _addBox(double l, double t, double r, double b) {
    if (_boxCount + 4 > _boxes.length) {
      _boxes = Float32List(_boxes.length * 2)..setRange(0, _boxCount, _boxes);
    }
    _boxes[_boxCount++] = l;
    _boxes[_boxCount++] = t;
    _boxes[_boxCount++] = r;
    _boxes[_boxCount++] = b;
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

  /// Draws the label once into an image. The halo is the text redrawn in the
  /// halo colour around itself, so the text is laid out a single time.
  _Sprite _rasterize(
    _LabelState st,
    double styleZoom,
    int background,
    double dpr,
  ) {
    final source = st.candidate.source;
    final beside = source.layer < 0;
    final symbol = beside ? null : symbols[source.layer];
    _context.zoom = styleZoom;
    final fontSize = _size(source.layer, styleZoom);
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
      color = (Rgba.of(symbol.color(_context)) ?? Rgba.black).toArgb(
        asNumber(symbol.opacity(_context)) ?? 1,
      );
      haloWidth = (asNumber(symbol.haloWidth(_context)) ?? 0).clamp(0, 2);
      halo = haloWidth > 0
          ? Rgba.of(symbol.haloColor(_context))?.toArgb()
          : null;
      weight = symbol.weight;
    }
    final italic = symbol?.italic ?? false;
    final maxWidthEm = isRoad ? 60.0 : (symbol?.maxWidth ?? 9);
    // A marker's name hugs its marker: lines are flush on the side the text
    // starts from, which is the side the marker is on.
    final align = !beside
        ? ui.TextAlign.center
        : (_isRtl(label) ? ui.TextAlign.right : ui.TextAlign.left);
    final builder =
        ui.ParagraphBuilder(
            ui.ParagraphStyle(
              textAlign: align,
              textDirection: _isRtl(label)
                  ? ui.TextDirection.rtl
                  : ui.TextDirection.ltr,
              maxLines: isRoad ? 1 : 3,
              fontFamily: text.fontFamily,
              fontSize: fontSize,
              height: 1.15,
            ),
          )
          ..pushStyle(
            ui.TextStyle(
              color: ui.Color(color),
              fontSize: fontSize,
              fontFamily: text.fontFamily,
              fontFamilyFallback: text.fontFamilyFallback,
              fontWeight: ui.FontWeight.values[(weight ~/ 100 - 1).clamp(0, 8)],
              fontVariations: [ui.FontVariation('wght', weight.toDouble())],
              fontStyle: italic ? ui.FontStyle.italic : ui.FontStyle.normal,
              letterSpacing: (symbol?.letterSpacing ?? 0) * fontSize,
              height: 1.15,
            ),
          )
          ..addText(label);
    final layoutWidth = maxWidthEm * fontSize;
    final paragraph = builder.build()
      ..layout(ui.ParagraphConstraints(width: layoutWidth));
    final textW = math.max(1, paragraph.longestLine).ceilToDouble();
    final textH = paragraph.height.ceilToDouble();
    final pixelW = ((textW + _haloPad * 2) * dpr).ceil();
    final pixelH = ((textH + _haloPad * 2) * dpr).ceil();
    final recorder = ui.PictureRecorder();
    final at = ui.Offset(switch (align) {
      ui.TextAlign.left => _haloPad,
      ui.TextAlign.right => _haloPad + textW - layoutWidth,
      _ => _haloPad + textW / 2 - layoutWidth / 2,
    }, _haloPad);
    final canvas = ui.Canvas(recorder)..scale(dpr);
    if (halo != null) {
      canvas.saveLayer(
        null,
        ui.Paint()
          ..colorFilter = ui.ColorFilter.mode(
            ui.Color(halo),
            ui.BlendMode.srcIn,
          ),
      );
      for (final offset in _haloOffsets) {
        canvas.drawParagraph(paragraph, at + offset * (haloWidth / 1.5));
      }
      canvas.restore();
    }
    canvas.drawParagraph(paragraph, at);
    final picture = recorder.endRecording();
    final sprite = _Sprite(
      picture.toImageSync(pixelW, pixelH),
      pixelW / dpr,
      pixelH / dpr,
      textW,
      textH,
      fontSize,
    )..usedPass = _pass;
    picture.dispose();
    paragraph.dispose();
    _sprites.remove(st.candidate.spriteKey)
      ?..dropped = true
      ..image.dispose();
    _sprites[st.candidate.spriteKey] = sprite;
    return sprite;
  }
}
