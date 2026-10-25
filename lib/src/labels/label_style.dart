import 'dart:math' as math;
import 'dart:ui' as ui;

import '../style/expr.dart';
import '../style/format.dart';
import '../style/sprites.dart';
import 'text_style.dart';
import 'label_rules.dart';
import 'label_state.dart';
import '../text/glyphs/maplibre_shaping.dart' show allowsVerticalText;
import 'label_view.dart';
import '../style/style_model.dart';
import '../tiles/built_tile.dart';

/// What a label's style layer says about it in this frame: which layer
/// draws it, at what size and in which colours, how its text is laid out
/// and moved, read with the paint expressions pointed at its feature.
class LabelStyle {
  LabelStyle(this.text, this._view);

  final LabelView _view;

  VmapTextStyle text;
  List<SymbolLayer> symbols = const [];

  /// The style's sprite sheet: its icons, and the images formatted text
  /// shows inline. Null until it has loaded.
  SpriteSheet? sheet;

  /// vmap's look, or MapLibre's for a style with its own glyph ranges.
  LabelRules rules = LabelRules.vmap;

  /// The state the app has given a feature of a source, for paint that
  /// reads `feature-state`.
  Map<String, Object?>? Function(int source, Object? id)? stateOf;

  final EvalContext context = EvalContext();

  /// The style layer that draws [c]. Null for a marker's name.
  SymbolLayer? symbolOf(LabelCandidate c) => switch (c) {
    TileLabel(:final tile) => symbols[tile.layer],
    MarkerName() => null,
  };

  double size(LabelCandidate c, double styleZoom) {
    final symbol = symbolOf(c);
    if (symbol == null) return text.markerSize * text.scale;
    context.zoom = styleZoom;
    return finiteOr(symbol.size(context), 16) * text.scale;
  }

  bool inRange(LabelCandidate c, double styleZoom) => switch (symbolOf(c)) {
    null => true,
    final symbol => styleZoom >= symbol.minZoom && styleZoom < symbol.maxZoom,
  };

  /// The context with the paint expressions pointed at [c]'s feature.
  EvalContext bound(LabelCandidate c, double styleZoom) {
    context.zoom = styleZoom;
    bind(c);
    return context;
  }

  /// Points the paint expressions at the feature behind [c]. A marker's
  /// name has none.
  void bind(LabelCandidate c) {
    if (c case TileLabel(tile: BuiltLabel(:final props?, :final layer))) {
      context
        ..props = props
        ..state =
            stateOf?.call(symbols[layer].source, props[r'$id']) ?? const {};
    } else {
      context
        ..props = const {}
        ..state = const {};
    }
  }

  /// A text's colour, halo colour and halo width from its layer's paint.
  (int, int?, double) ink(SymbolLayer symbol) {
    final opacity = asNumber(symbol.opacity(context)) ?? 1;
    final color = (Rgba.of(symbol.color(context)) ?? Rgba.black).toArgb(
      opacity,
    );
    final double haloWidth = (asNumber(symbol.haloWidth(context)) ?? 0).clamp(
      0,
      8,
    );
    return (
      color,
      haloWidth > 0
          ? Rgba.of(symbol.haloColor(context))?.toArgb(opacity)
          : null,
      haloWidth,
    );
  }

  /// How far past the screen's edge [c]'s anchor may lie with its text
  /// still reaching in: its offsets, half its widest line and its
  /// translation. Only labels that can show are placed, however far their
  /// layer throws them.
  double reach(LabelCandidate c, double styleZoom) {
    final symbol = symbolOf(c);
    if (symbol == null) return 0;
    final ems =
        math.max(symbol.offsetX.abs(), symbol.offsetY.abs()) +
        (symbol.radialOffset ?? 0).abs() +
        symbol.maxWidth / 2;
    var reach = ems * size(c, styleZoom);
    if (symbol.textTranslate case final translate?) {
      bind(c);
      final (dx, dy) = _view.moved(
        translate,
        symbol.textTranslateOnScreen,
        context,
      );
      reach += math.max(dx.abs(), dy.abs());
    }
    return reach;
  }

  /// How a name along a line is moved off its anchor, as MapLibre shapes
  /// it: its `text-anchor`'s alignment and its `text-offset`. Null when it
  /// is not moved.
  (double, double, double, double)? lineShift(LabelCandidate c) {
    if (c.road == null) return null;
    final symbol = symbolOf(c);
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
    final (offsetX, offsetY) = symbol.textOffset(layoutContext(c));
    if (alignX == 0 && alignY == 0 && offsetX == 0 && offsetY == 0) {
      return null;
    }
    return (alignX, alignY, offsetX, offsetY);
  }

  /// The key [st]'s text sprite is kept under: its candidate's, and with
  /// `text-justify: auto` the side its lines are flush on.
  String spriteKey(LabelState st) {
    final c = st.candidate;
    final symbol = symbolOf(c);
    var key = st.vertical ? '${c.spriteKey}|v' : c.spriteKey;
    if (lineShift(c) case (final ax, final ay, final ox, final oy)) {
      key = '$key|$ax,$ay,$ox,$oy';
    }
    if (symbol == null) return key;
    if (symbol.layoutAt.any) {
      final context = layoutContext(c);
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
    return '$key|${autoJustify(st, symbol).index}';
  }

  /// The zoom a tile's symbols are laid out at: MapLibre lays them out at
  /// the tile's zoom.
  double layoutZoom = 0;

  /// The context [c]'s layout is read in: its feature, at [layoutZoom].
  EvalContext layoutContext(LabelCandidate c) {
    bind(c);
    return context..zoom = layoutZoom;
  }

  /// Whether [c] may be written down the page: its layer allows it, it is
  /// a point's plain text, and its script has upright vertical forms.
  bool mayBeVertical(LabelCandidate c, SymbolLayer? symbol) {
    final point = c.point;
    return symbol != null &&
        symbol.writingModes.contains(true) &&
        point != null &&
        point.tile.props?[formatKey] == null &&
        allowsVerticalText(c.text);
  }

  /// The side of the anchor [st] takes, which `text-justify: auto` makes
  /// its lines flush on.
  ui.TextAlign autoJustify(LabelState st, SymbolLayer symbol) {
    final anchors = symbol.anchors;
    final anchor = anchors.isEmpty
        ? (symbol.layoutAt.anchor == null
              ? symbol.anchor
              : symbol.anchorAt(layoutContext(st.candidate)))
        : anchors[st.side.clamp(0, anchors.length - 1)];
    if (anchor.endsWith('left')) return ui.TextAlign.left;
    if (anchor.endsWith('right')) return ui.TextAlign.right;
    return ui.TextAlign.center;
  }

  /// Whether [c]'s text and icon both overlap anything and are ignored by
  /// everything else, so placing it tests nothing.
  bool free(LabelCandidate c) {
    final layer = symbolOf(c);
    if (layer == null) return false;
    final text = !c.hasText || (layer.textOverlaps && layer.textIgnored);
    final icon = layer.iconOverlaps && layer.iconIgnored;
    return text && icon;
  }

  /// Has [_view] project [c]'s points at its layer's height offset.
  void stand(LabelCandidate c) {
    final layer = symbolOf(c);
    final offset = layer?.heightOffset;
    if (offset == null) {
      _view.standAt(0);
      return;
    }
    final metres = c.heightMetres ??= () {
      bind(c);
      return finiteOr(offset(context), 0);
    }();
    _view.standAt(metres, fromSea: layer!.heightFromSea);
  }
}
