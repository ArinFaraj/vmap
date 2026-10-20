import 'dart:math' as math;

import 'collision_boxes.dart';
import 'expr.dart';
import 'label_rules.dart';
import 'label_state.dart';
import 'label_view.dart';
import 'pins.dart';
import 'road_labels.dart';
import 'sprites.dart';
import 'style_model.dart';

/// Places the labels of points: an icon or a pin, and text beside it on a
/// side that is free, keeping clear of the app's markers.
class PointLabels {
  PointLabels(this._view, this._boxes, this._roads);

  final LabelView _view;
  final CollisionBoxes _boxes;
  final RoadLabels _roads;
  LabelRules rules = LabelRules.vmap;

  /// The style's icons. Null until they have loaded.
  SpriteSheet? sheet;

  /// Pins drawn in place of the style's icons. Null draws the style's own.
  VmapPins? pins;

  /// With collision boxes shown, each weighed box as left, top, right,
  /// bottom and whether it was placed (1 or 0).
  List<double>? debugBoxes;

  /// The text anchor of the label being placed.
  String _anchor = 'center';

  /// Space between a pin and its name.
  static const double _pinGap = 3;

  /// Clear space around the text an icon is stretched behind.

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
  /// [context] is bound to the label's feature at the style zoom.
  bool place(
    LabelState st,
    SymbolLayer? symbol,
    double fontSize,
    double textW,
    double textH,
    double textPad,
    double iconPad,
    EvalContext context,
  ) {
    final c = st.candidate;
    st
      ..worldX = c.worldX
      ..worldY = c.worldY
      ..angle = 0
      ..curve = null
      ..screenAngle = 0;
    final spaced = c is TileLabel && c.tile.spaced;
    if (spaced && c.hasText && rules.spreadNames && _roads.nearSame(st)) {
      return false;
    }
    final along = symbol?.textAlongMap ?? false;
    // Layout is read at the tile's zoom, as MapLibre lays symbols out.
    final zoom = context.zoom;
    context.zoom = zoom.floorToDouble();
    final rotate = symbol?.rotateAt(context) ?? 0;
    _anchor = symbol?.anchorAt(context) ?? 'center';
    context.zoom = zoom;
    final spin = rotate * math.pi / 180 + (along ? _view.mapTurn : 0);
    st.screenAngle = spin;
    // Text pitched with the map is laid on the ground, its baseline turned
    // by text-rotate on the map, or kept level on the screen.
    st
      ..onGround =
          (symbol?.textOnGround ?? false) && (_view.tilted?.pitch ?? 0) > 0
      ..keepUpright = false;
    if (st.onGround) st.angle = spin - _view.mapTurn;
    _view.project(st.worldX, st.worldY);
    final x = _view.x, y = _view.y;
    var boxW = textW, boxH = textH, boxSpin = spin;
    if (st.onGround) {
      (boxW, boxH) = _groundBox(
        st,
        textW / st.perspective,
        textH / st.perspective,
        perspective: (symbol?.anchors ?? const []).isEmpty,
      );
      boxSpin = 0;
      _view.project(st.worldX, st.worldY);
    }
    final spot = _Spot(
      x,
      y,
      boxW,
      boxH,
      boxSpin,
      textPad: textPad,
      iconPad: iconPad,
      cooperative: symbol?.textCooperative ?? false,
      groundW: st.onGround ? textW / st.perspective : null,
      groundH: st.onGround ? textH / st.perspective : null,
    );
    final moved = symbol == null
        ? (0.0, 0.0)
        : _view.moved(
            symbol.textTranslate,
            symbol.textTranslateOnScreen,
            context,
            at: (st.worldX, st.worldY),
          );
    // As MapLibre, a radial offset without variable anchors moves the text
    // from its anchor in place of text-offset.
    final radial = symbol?.radialOffset ?? 0;
    final ems = symbol == null
        ? (0.0, 0.0)
        : symbol.anchors.isEmpty && radial != 0
        ? _fromRadialOffset(_anchor, radial)
        : symbol.textOffset(context);
    var text = _textOffset(symbol, c, fontSize, spot, moved, ems);
    final icon = _sizeIcon(st, symbol, spot, context);
    final pin = _choosePin(st, symbol);
    if (pin != null && c.hasText) text = _besidePin(symbol!, spot, pin.$2);
    final hasIcon = icon != null || pin != null;
    if (!hasIcon && !c.hasText) return false;

    final sides = symbol?.anchors ?? const <String>[];
    final fitted = pin == null && (symbol?.textFit ?? false);
    final pads = symbol?.iconPaddings;
    // As MapLibre's attemptAnchorPlacement: an icon fitted to the text
    // moves with it, and a side where it collides is passed over.
    bool fittedIconClear(double dx, double dy) {
      final ix = spot.x + st.iconDx + dx * st.iconScale;
      final iy = spot.y + st.iconDy + dy * st.iconScale;
      return !_boxes.hits(
        ix - st.iconW / 2 - (pads?[3] ?? iconPad),
        iy - st.iconH / 2 - (pads?[0] ?? iconPad),
        ix + st.iconW / 2 + (pads?[1] ?? iconPad),
        iy + st.iconH / 2 + (pads?[2] ?? iconPad),
        cooperative: symbol?.iconCooperative ?? false,
      );
    }

    final textFits = !c.hasText
        ? false
        : sides.isNotEmpty
        ? _fitOnSides(
            st,
            symbol!,
            sides,
            fontSize,
            spot,
            moved,
            pin?.$2,
            ems,
            iconClear: fitted && icon != null && !symbol.iconOverlaps
                ? fittedIconClear
                : null,
          )
        : _obstacles.isEmpty
        ? _fitInPlace(st, symbol, spot, text)
        : _fitAside(st, spot, text, hasIcon);
    if (fitted && icon != null) {
      // Now the text's place is settled, the box fitted about it is kept
      // from the anchor like any icon's.
      st
        ..iconDx += st.dx * st.iconScale
        ..iconDy += st.dy * st.iconScale;
      _keepContentShape(st, icon);
    }
    final ix = spot.x + st.iconDx, iy = spot.y + st.iconDy;
    final il = ix - st.iconW / 2 - (pads?[3] ?? iconPad);
    final it = iy - st.iconH / 2 - (pads?[0] ?? iconPad);
    final ir = ix + st.iconW / 2 + (pads?[1] ?? iconPad);
    final ib = iy + st.iconH / 2 + (pads?[2] ?? iconPad);
    final iconFits =
        hasIcon &&
        ((symbol?.iconOverlaps ?? false) ||
            !_boxes.hits(
              il,
              it,
              ir,
              ib,
              cooperative: symbol?.iconCooperative ?? false,
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
    final debug = debugBoxes;
    if (debug != null) {
      if (c.hasText) {
        _debugBox(
          debug,
          spot.x + st.dx,
          spot.y + st.dy,
          spot.textW,
          spot.textH,
          spot.spin,
          textPad,
          showText,
        );
      }
      if (hasIcon) debug.addAll([il, it, ir, ib, showIcon ? 1 : 0]);
    }
    if (!showText && !showIcon) return false;
    if (showText && !(symbol?.textIgnored ?? false)) {
      _boxes.take(
        spot.x + st.dx,
        spot.y + st.dy,
        spot.textW,
        spot.textH,
        spot.spin,
        pad: textPad,
        never:
            !(symbol?.textOverlaps ?? false) &&
            !(symbol?.textCooperative ?? false),
      );
    }
    if (showIcon && !(symbol?.iconIgnored ?? false)) {
      _boxes.add(
        il,
        it,
        ir,
        ib,
        never:
            !(symbol?.iconOverlaps ?? false) &&
            !(symbol?.iconCooperative ?? false),
      );
    }
    st
      ..showText = showText
      ..showIcon = showIcon;
    if (spaced && c.hasText) _roads.placed(st);
    return true;
  }

  /// The width and height on the screen of the box a label [w] by [h]
  /// flat pixels takes lying on the ground at its point, turned by its
  /// angle on the map, as MapLibre's collision index projects a
  /// map-pitched label's box. [perspective] grows it with its distance as
  /// MapLibre's shader does, which MapLibre leaves out with variable
  /// anchors.
  (double, double) _groundBox(
    LabelState st,
    double w,
    double h, {
    required bool perspective,
    double? atX,
    double? atY,
  }) {
    final cx = atX ?? st.worldX, cy = atY ?? st.worldY;
    final grow = perspective ? 0.5 + 0.5 * _view.depth : 1.0;
    final hw = w * grow / 2 / _view.world, hh = h * grow / 2 / _view.world;
    final c = math.cos(st.angle), s = math.sin(st.angle);
    var minX = double.infinity, minY = double.infinity;
    var maxX = double.negativeInfinity, maxY = double.negativeInfinity;
    for (final (u, v) in const [(-1, -1), (1, -1), (1, 1), (-1, 1)]) {
      _view.project(
        cx + (u * hw * c - v * hh * s),
        cy + (u * hw * s + v * hh * c),
      );
      minX = math.min(minX, _view.x);
      maxX = math.max(maxX, _view.x);
      minY = math.min(minY, _view.y);
      maxY = math.max(maxY, _view.y);
    }
    return (maxX - minX, maxY - minY);
  }

  static void _debugBox(
    List<double> out,
    double x,
    double y,
    double w,
    double h,
    double angle,
    double pad,
    bool placed,
  ) {
    final c = math.cos(angle).abs(), s = math.sin(angle).abs();
    final hw = (w * c + h * s) / 2 + pad;
    final hh = (w * s + h * c) / 2 + pad;
    out.addAll([x - hw, y - hh, x + hw, y + hh, placed ? 1 : 0]);
  }

  /// Where the text's middle sits from its point: the layer's anchor and
  /// offset, turned with the text, then moved by its translate.
  (double, double) _textOffset(
    SymbolLayer? symbol,
    LabelCandidate c,
    double fontSize,
    _Spot spot,
    (double, double) moved,
    (double, double) ems,
  ) {
    var tx = 0.0;
    var ty = 0.0;
    if (symbol != null && c.hasText) {
      tx = ems.$1 * fontSize;
      ty = ems.$2 * fontSize;
      final anchor = _anchor;
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
  /// Sizes the icon of [st], a name along a line [textW] by [textH], as a
  /// point label's icon about its text; null when it has none.
  SpriteImage? sizeLineIcon(
    LabelState st,
    SymbolLayer symbol,
    double textW,
    double textH,
    EvalContext context,
  ) => _sizeIcon(
    st,
    symbol,
    _Spot(0, 0, textW, textH, 0, textPad: 0, iconPad: 0),
    context,
  );

  SpriteImage? _sizeIcon(
    LabelState st,
    SymbolLayer? symbol,
    _Spot spot,
    EvalContext context,
  ) {
    final name = _iconName(st.candidate);
    var icon = st.icon;
    if (icon == null && name.isNotEmpty) {
      icon = st.icon = sheet?.icon(name);
    }
    st
      ..iconDx = 0
      ..iconDy = 0;
    if (icon == null || symbol == null) return icon;
    // As MapLibre's icon shader, an icon grows and shrinks with its
    // distance from a tilted camera as text does; a fitted icon takes its
    // size from its text, which already has.
    final by =
        (asNumber(symbol.iconSize(context)) ?? 1) *
        (symbol.textFit ? 1 : st.perspective);
    final (offsetX, offsetY) = symbol.iconOffset(context);
    st.iconScale = by;
    if (!symbol.textFit) {
      final (ax, ay) = anchorSides(symbol.iconAnchorAt(context));
      st
        ..iconDx = offsetX * by + ax * icon.width * by / 2
        ..iconDy = offsetY * by + ay * icon.height * by / 2;
    }
    final (ix, iy) = _view.moved(
      symbol.iconTranslate,
      symbol.iconTranslateOnScreen,
      context,
      at: (st.worldX, st.worldY),
    );
    if (symbol.textFit) {
      // As MapLibre's fitIconToText: around the text box, padded, moved by
      // icon-offset, the whole scaled by icon-size about the anchor. Until
      // [place] settles the text, iconDx and iconDy are the box's middle
      // from the text's middle.
      final [top, right, bottom, left] = symbol.iconTextFitPadding;
      final fit = symbol.iconTextFit;
      final wide = fit == 'width' || fit == 'both';
      final tall = fit == 'height' || fit == 'both';
      st
        ..iconW = (wide ? spot.textW + left + right : icon.width) * by
        ..iconH = (tall ? spot.textH + top + bottom : icon.height) * by
        ..iconDx = (offsetX + (wide ? (right - left) / 2 : 0)) * by
        ..iconDy = (offsetY + (tall ? (bottom - top) / 2 : 0)) * by;
    } else {
      st
        ..iconW = icon.width * by
        ..iconH = icon.height * by;
    }
    st
      ..iconDx += ix
      ..iconDy += iy
      ..iconOpacity = (asNumber(symbol.iconOpacity(context)) ?? 1).clamp(
        0.0,
        1.0,
      );
    return icon;
  }

  /// As MapLibre's applyTextFit: a fitted picture whose sprite asks for a
  /// `proportional` side has that side pushed back out to its content's
  /// shape, about the label's point.
  static void _keepContentShape(LabelState st, SpriteImage icon) {
    final content = icon.content;
    final across = icon.textFitWidth, down = icon.textFitHeight;
    if (content == null || (across == null && down == null)) return;
    final aspect = (content[2] - content[0]) / (content[3] - content[1]);
    final by = st.iconScale;
    // Vertical text is laid out across and turned a quarter, so its width
    // runs down the screen.
    final turned = st.vertical;
    var w = (turned ? st.iconH : st.iconW) / by;
    var h = (turned ? st.iconW : st.iconH) / by;
    var left = (turned ? st.iconDy : st.iconDx) / by - w / 2;
    var top = (turned ? st.iconDx : st.iconDy) / by - h / 2;
    if (down == 'proportional') {
      if ((across == 'stretchOnly' && w / h < aspect) ||
          across == 'proportional') {
        final wider = (h * aspect).ceilToDouble();
        left *= wider / w;
        w = wider;
      }
    } else if (across == 'proportional') {
      if (down == 'stretchOnly' && aspect != 0 && w / h > aspect) {
        final taller = (w / aspect).ceilToDouble();
        top *= taller / h;
        h = taller;
      }
    }
    final cx = (left + w / 2) * by, cy = (top + h / 2) * by;
    st
      ..iconW = (turned ? h : w) * by
      ..iconH = (turned ? w : h) * by
      ..iconDx = turned ? cy : cx
      ..iconDy = turned ? cx : cy;
  }

  /// The pin drawn in place of [st]'s icon, and how far its name sits from
  /// its middle, when the app draws pins and has one for the icon.
  (VmapPin, double)? _choosePin(LabelState st, SymbolLayer? symbol) {
    final pins = this.pins;
    final name = _iconName(st.candidate);
    final pin = pins == null || symbol == null || name.isEmpty
        ? null
        : pins.resolve(
            name.split(imageChoice).first,
            place: symbol.sourceLayer == 'poi',
          );
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

  /// MapLibre's fromRadialOffset: the offset in ems [radial] ems from the
  /// anchor towards [anchor]'s side, a text above or below its point
  /// 7/24 of an em nearer it.
  static (double, double) _fromRadialOffset(String anchor, double radial) {
    const baseline = 7 / 24;
    final r = math.max(0.0, radial);
    final h = r / math.sqrt2;
    final y = switch (anchor) {
      'top-right' || 'top-left' => h - baseline,
      'bottom-right' || 'bottom-left' => -h + baseline,
      'bottom' => -r + baseline,
      'top' => r - baseline,
      _ => 0.0,
    };
    final x = switch (anchor) {
      'top-right' || 'bottom-right' => -h,
      'top-left' || 'bottom-left' => h,
      'left' => r,
      'right' => -r,
      _ => 0.0,
    };
    return (x, y);
  }

  /// Where a name sits beside a pin, on the side its anchor names.
  (double, double) _besidePin(SymbolLayer symbol, _Spot spot, double reach) {
    final anchor = _anchor;
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
    (double, double) ems, {
    bool Function(double dx, double dy)? iconClear,
  }) {
    final radial = symbol.radialOffset;
    final away = pinReach ?? (radial == null ? null : radial * fontSize);
    // As MapLibre: a text set above or below its point sits 7/24 of an em
    // nearer it, the room glyphs leave under their baseline.
    final baseline = pinReach == null ? 7 / 24 * fontSize : 0.0;
    // The side taken last is tried first, so a label stays put while it
    // fits there; then the sides in the layer's order.
    final previous = st.opacity > 0 && st.side < sides.length ? st.side : -1;
    final turn = symbol.textAlongMap && !st.onGround ? _view.mapTurn : 0.0;
    final cos = math.cos(turn), sin = math.sin(turn);
    for (var k = previous < 0 ? 0 : -1; k < sides.length; k++) {
      final at = k < 0 ? previous : k;
      if (k >= 0 && at == previous) continue;
      final (ax, ay) = anchorSides(sides[at]);
      final double fx, fy;
      // As MapLibre's calculateVariableLayoutShift: by half the text's
      // collision box, which its padding is part of.
      final groundW = spot.groundW, groundH = spot.groundH;
      final halfW = (groundW ?? spot.textW) / 2 + spot.textPad;
      final halfH = (groundH ?? spot.textH) / 2 + spot.textPad;
      final given = symbol.anchorOffsets;
      final double lx, ly;
      if (given != null) {
        // As MapLibre's getTextVariableAnchorOffset: the offset as given,
        // with the baseline shift of a text above or below its point.
        lx = ax * halfW + given[at].$1 * fontSize;
        ly = ay * halfH + given[at].$2 * fontSize - ay * baseline;
      } else if (away != null) {
        final reach = ax != 0 && ay != 0 ? away / math.sqrt2 : away;
        lx = ax * (reach + halfW);
        ly = ay * (reach + halfH) - ay * baseline;
      } else {
        lx = ax * ((ems.$1 * fontSize).abs() + halfW);
        ly = ay * ((ems.$2 * fontSize).abs() + halfH) - ay * baseline;
      }
      var hits = false;
      if (groundW != null && groundH != null) {
        // Text lying on a tilted map is shifted on the ground and the
        // shift then seen through the tilt, as MapLibre shifts it in tile
        // units, without its perspective growth.
        final c = math.cos(st.angle), s = math.sin(st.angle);
        final wx = st.worldX + (lx * c - ly * s) / _view.world;
        final wy = st.worldY + (lx * s + ly * c) / _view.world;
        final (bw, bh) = _groundBox(
          st,
          groundW,
          groundH,
          perspective: false,
          atX: wx,
          atY: wy,
        );
        _view.project(wx, wy);
        fx = moved.$1 + _view.x - spot.x;
        fy = moved.$2 + _view.y - spot.y;
        hits = _boxes.collides(
          _view.x + moved.$1,
          _view.y + moved.$2,
          bw,
          bh,
          0,
          pad: spot.textPad,
          cooperative: spot.cooperative,
        );
      } else {
        // Text turned with the map is shifted along the map's axes, as
        // MapLibre's collision index shifts it in tile units.
        fx = moved.$1 + lx * cos - ly * sin;
        fy = moved.$2 + lx * sin + ly * cos;
        hits = _textHits(spot, fx, fy);
      }
      if (!symbol.textOverlaps && hits) continue;
      if (iconClear != null && !iconClear(fx, fy)) continue;
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
    final beside = c is MarkerName;
    var down = spot.textH / 2 + _obstacleReach;
    var across = spot.textW / 2 + _obstacleReach;
    var (shiftX, shiftY) = text;
    int? ownBox;
    if (c case MarkerName(index: final own)) {
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
        cooperative: spot.cooperative,
      );
}

/// The sprite image drawn at [c]'s point. Empty for none.
String _iconName(LabelCandidate c) => switch (c) {
  TileLabel(:final tile) => tile.icon,
  MarkerName() => '',
};

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
    this.cooperative = false,
    this.groundW,
    this.groundH,
  });

  /// For text lying on a tilted map: its flat width and height, which
  /// it has on the ground before the view tilts it.
  final double? groundW, groundH;

  final double x;
  final double y;
  final double textW;
  final double textH;

  /// How far the text is turned, in radians.
  final double spin;
  final double textPad;
  final double iconPad;

  /// The text minds only boxes that overlap nothing.
  final bool cooperative;
}
