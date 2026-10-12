import 'dart:math' as math;

import 'collision_boxes.dart';
import 'expr.dart';
import 'label_state.dart';
import 'label_view.dart';
import 'pins.dart';
import 'road_labels.dart';
import 'sprites.dart';
import 'style_model.dart';

/// Places the labels of points: an icon or a pin, and text beside it on a
/// side that is free, keeping clear of the app's markers.
class PointLabels {
  PointLabels(this._view, this._boxes, this._roads, this._context);

  final LabelView _view;
  final CollisionBoxes _boxes;
  final RoadLabels _roads;
  final EvalContext _context;

  /// The style's icons. Null until they have loaded.
  SpriteSheet? sheet;

  /// Pins drawn in place of the style's icons. Null draws the style's own.
  VmapPins? pins;

  /// Space between a pin and its name.
  static const double _pinGap = 3;

  /// Clear space around the text an icon is stretched behind.
  static const double _fitPad = 3;

  /// Areas labels keep clear of: anchor as fractions of the world, size in
  /// screen pixels, then how far the area's centre sits from the anchor.
  List<(double, double, double, double, double, double)> _obstacles = const [];
  double _obstacleReach = 0;

  /// The collision box each obstacle took this pass, in order.
  List<int> _markerBoxes = const [];

  List<(double, double, double, double, double, double)> get obstacles =>
      _obstacles;
  set obstacles(List<(double, double, double, double, double, double)> value) {
    _obstacles = value;
    _obstacleReach = 0;
    for (final (_, _, w, h, _, _) in value) {
      _obstacleReach = math.max(_obstacleReach, math.max(w, h) / 2 + 6);
    }
  }

  /// Takes the room the markers fill, before any label is placed.
  void startPass() {
    _markerBoxes = [
      for (final (wx, wy, w, h, shiftX, shiftY) in _obstacles)
        () {
          _view.project(wx, wy);
          final ox = _view.x + shiftX;
          final oy = _view.y + shiftY;
          return _boxes.add(ox - w / 2, oy - h / 2, ox + w / 2, oy + h / 2);
        }(),
    ];
  }

  /// Places a point's text and icon, the text trying each side the layer
  /// allows, or stepping aside for a marker. False when neither fits.
  bool place(
    LabelState st,
    SymbolLayer? symbol,
    double fontSize,
    double textW,
    double textH,
    double textPad,
    double iconPad,
    double styleZoom,
  ) {
    final c = st.candidate;
    st
      ..worldX = c.worldX
      ..worldY = c.worldY
      ..angle = 0
      ..curve = null
      ..screenAngle = 0;
    if (c.spaced && c.hasText && _roads.nearSame(st)) return false;
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
        : _view.moved(
            symbol.textTranslate,
            symbol.textTranslateOnScreen,
            _context..zoom = styleZoom,
          );
    var text = _textOffset(symbol, c, fontSize, spot, moved);
    final icon = _sizeIcon(st, symbol, spot, styleZoom);
    final pin = _choosePin(st, symbol);
    if (pin != null && c.hasText) text = _besidePin(symbol!, spot, pin.$2);
    final hasIcon = icon != null || pin != null;
    if (!hasIcon && !c.hasText) return false;

    final sides = symbol?.anchors ?? const <String>[];
    final textFits = !c.hasText
        ? false
        : sides.isNotEmpty
        ? _fitOnSides(st, symbol!, sides, fontSize, spot, moved, pin?.$2)
        : _obstacles.isEmpty
        ? _fitInPlace(st, symbol, spot, text)
        : _fitAside(st, spot, text, hasIcon);
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
    if (!showText && !showIcon) return false;
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
    if (c.spaced && c.hasText) _roads.placed(st);
    return true;
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
    if (icon == null && c.icon.isNotEmpty) {
      icon = st.icon = sheet?.entries[c.icon];
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
    final (ix, iy) = _view.moved(
      symbol.iconTranslate,
      symbol.iconTranslateOnScreen,
      _context..zoom = styleZoom,
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
    final pins = this.pins;
    final name = st.candidate.icon;
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
  ) {
    final c = st.candidate;
    final beside = c.marker != null;
    var down = spot.textH / 2 + _obstacleReach;
    var across = spot.textW / 2 + _obstacleReach;
    var (shiftX, shiftY) = text;
    int? ownBox;
    if (c.marker case final own?) {
      final (_, _, w, h, ox, oy) = _obstacles[own];
      down = spot.textH / 2 + h / 2 + 2;
      across = spot.textW / 2 + w / 2 + 4;
      ownBox = _markerBoxes[own];
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
}

/// Which way a thing lies from its point when [anchor] is the part of it
/// on the point: 1 for right or below, -1 for left or above, 0 for neither.
(double, double) anchorSides(String anchor) => (
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
