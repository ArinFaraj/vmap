import 'dart:convert';
import 'dart:ui' as ui;

import 'expr.dart';

/// What the tile builder reads from a symbol layer, made from the JSON it
/// came from. [signature] is that JSON, so two layers that build the same
/// labels have the same signature, and a change to anything the builder
/// reads changes it.
class SymbolBuild {
  /// The keys of the JSON a build is made from.
  static const sourceKey = 'source';
  static const sourceLayerKey = 'sourceLayer';
  static const filterKey = 'filter';
  static const textKey = 'text';
  static const iconKey = 'icon';
  static const placementKey = 'placement';
  static const spacingKey = 'spacing';
  static const textUprightKey = 'textUpright';
  static const iconUprightKey = 'iconUpright';
  static const minZoomKey = 'minZoom';
  static const maxZoomKey = 'maxZoom';
  static const sortKeyKey = 'sortKey';
  static const iconRotateKey = 'iconRotate';
  static const paintKeysKey = 'paintKeys';

  SymbolBuild(Map<String, Object?> json)
    : signature = jsonEncode(json),
      source = json[sourceKey]! as int,
      sourceLayer = json[sourceLayerKey]! as String,
      filter = compileFilter(json[filterKey]),
      text = switch (json[textKey]) {
        null => (_) => '',
        final field => compileText(field),
      },
      icon = switch (json[iconKey]) {
        null => null,
        final image => compileIcon(image),
      },
      placement = compileExpr(json[placementKey]),
      spacing = (json[spacingKey]! as num).toDouble(),
      textUpright = json[textUprightKey] == true,
      iconUpright = json[iconUprightKey] == true,
      minZoom = (json[minZoomKey]! as num).toDouble(),
      maxZoom = (json[maxZoomKey]! as num).toDouble(),
      sortKey = switch (json[sortKeyKey]) {
        null => null,
        final key => compileExpr(key),
      },
      iconRotate = compileExpr(json[iconRotateKey] ?? 0),
      paintKeys = (json[paintKeysKey]! as List).cast<String>();

  final String signature;

  /// Index into the style's sources.
  final int source;
  final String sourceLayer;
  final bool Function(EvalContext) filter;
  final Expr text;

  /// The name of the sprite image, or null when the layer has none.
  final Expr? icon;
  final Expr placement;

  /// Space between labels repeated along a line, in logical pixels.
  final double spacing;

  /// Text or icons along a line stay upright on the screen instead of
  /// following the line.
  final bool textUpright;
  final bool iconUpright;
  final double minZoom;
  final double maxZoom;

  /// `symbol-sort-key`: of two labels in this layer wanting the same room,
  /// the one with the lower number gets it.
  final Expr? sortKey;

  /// `icon-rotate`, by feature and zoom, in degrees.
  final Expr iconRotate;

  /// The feature properties the layer's colours, opacities and sizes read.
  /// Each label carries its feature's values of them.
  final List<String> paintKeys;
}

/// A text and icon layer of the style.
class SymbolLayer {
  SymbolLayer({
    required this.id,
    required this.build,
    required this.size,
    required this.color,
    required this.opacity,
    required this.haloColor,
    required this.haloWidth,
    required this.weight,
    required this.italic,
    this.fontStack = const [],
    required this.uppercase,
    this.layoutAt = const SymbolLayout(),
    this.writingModes = const [],
    required this.letterSpacing,
    required this.haloBlur,
    this.lineHeight,
    this.justify = ui.TextAlign.center,
    this.justifyAuto = false,
    this.textPadding,
    this.textAlongMap = false,
    this.glyphsUpright = false,
    this.iconAlongMap = false,
    this.iconPadding,
    this.iconPaddings,
    this.textIgnored = false,
    this.keepUpright = true,
    this.textOnGround = false,
    this.iconOnGround = false,
    this.iconIgnored = false,
    required this.maxWidth,
    required this.iconSize,
    required this.iconOpacity,
    required this.iconColor,
    required this.textRotate,
    required this.anchor,
    required this.offsetX,
    required this.offsetY,
    this.offsetBy,
    required this.textOptional,
    required this.iconOptional,
    required this.iconOverlaps,
    required this.textOverlaps,
    this.iconCooperative = false,
    this.textCooperative = false,
    this.drawnByScreenY = false,
    this.placedByScreenY = false,
    this.drawnByKey = false,
    this.iconSizeByFeature = false,
    required this.textFit,
    this.iconTextFit = 'none',
    this.iconTextFitPadding = const [0, 0, 0, 0],
    this.anchors = const [],
    this.radialOffset,
    this.anchorOffsets,
    this.iconAnchor = 'center',
    this.iconAnchorBy,
    this.iconOffsetX = 0,
    this.iconOffsetBy,
    this.iconOffsetY = 0,
    this.textTranslate,
    this.textTranslateOnScreen = false,
    this.iconTranslate,
    this.iconTranslateOnScreen = false,
    this.maxBend,
    this.iconHaloColor,
    this.iconHaloWidth,
    this.iconHaloBlur,
    this.heightOffset,
    this.heightFromSea = false,
  });

  final String id;

  /// Everything the tile builder reads from the layer.
  final SymbolBuild build;

  int get source => build.source;
  String get sourceLayer => build.sourceLayer;
  bool Function(EvalContext) get filter => build.filter;
  double get minZoom => build.minZoom;
  double get maxZoom => build.maxZoom;

  final Expr size;
  final Expr color;
  final Expr opacity;
  final Expr haloColor;
  final Expr haloWidth;
  final int weight;
  final bool italic;

  /// The style's `text-font`: the fonts to try first, by name.
  final List<String> fontStack;
  final bool uppercase;

  /// Layout read from each feature or the zoom, where the style gives an
  /// expression; the constant fields hold the rest.
  final SymbolLayout layoutAt;

  /// The text as `text-transform` in [c] makes it.
  String transformed(String text, EvalContext c) {
    final by = layoutAt.transform?.call(c);
    if (by == 'uppercase' || (by == null && uppercase)) {
      return text.toUpperCase();
    }
    return by == 'lowercase' ? text.toLowerCase() : text;
  }

  double letterSpacingAt(EvalContext c) =>
      _number(layoutAt.letterSpacing, c, letterSpacing);

  double maxWidthAt(EvalContext c) => _number(layoutAt.maxWidth, c, maxWidth);

  double rotateAt(EvalContext c) => _number(layoutAt.rotate, c, textRotate);

  String anchorAt(EvalContext c) => switch (layoutAt.anchor?.call(c)) {
    final String a => a,
    _ => anchor,
  };

  ui.TextAlign justifyAt(EvalContext c) => switch (layoutAt.justify?.call(c)) {
    'left' => ui.TextAlign.left,
    'right' => ui.TextAlign.right,
    'center' => ui.TextAlign.center,
    _ => justify,
  };

  /// Whether `text-justify` in [c] is auto, which follows the anchor.
  bool justifyAutoAt(EvalContext c) => switch (layoutAt.justify?.call(c)) {
    final String j => j == 'auto',
    _ => justifyAuto,
  };

  List<String> fontStackAt(EvalContext c) => switch (layoutAt.font?.call(c)) {
    final List names => [for (final n in names) '$n'],
    _ => fontStack,
  };

  static double _number(Expr? expr, EvalContext c, double otherwise) =>
      expr == null ? otherwise : (asNumber(expr(c)) ?? otherwise).toDouble();

  /// A point label's `text-writing-mode`, in the order it is tried: true
  /// for vertical, down the page where the script allows, false for
  /// horizontal. Empty for horizontal only.
  final List<bool> writingModes;

  /// In ems.
  final double letterSpacing;

  /// The height of a line of text in ems. Null for the package's own.
  final double? lineHeight;

  /// The side the lines of a text of several lines are flush on.
  final ui.TextAlign justify;

  /// `text-justify: auto`: lines are flush on the side of the anchor the
  /// text takes, in place of [justify].
  final bool justifyAuto;

  /// Clear space kept around the text and the icon where labels are
  /// weighed against each other, in logical pixels. Null for the package's
  /// own.
  final double? textPadding;

  /// `text-rotation-alignment: map`: a point's text turns with the map.
  final bool textAlongMap;

  /// `text-rotation-alignment: viewport-glyph`: a name along a line is laid
  /// along it with each glyph upright on the screen.
  final bool glyphsUpright;

  /// The icon turns with the map, as `icon-rotation-alignment: map` asks.
  final bool iconAlongMap;
  final double? iconPadding;

  /// `icon-padding` given for each side, top, right, bottom and left;
  /// null when it is one number.
  final List<double>? iconPaddings;

  /// The text or icon takes no room from the labels placed after it.
  final bool textIgnored;

  /// `text-keep-upright`: a name along a line is turned half round when it
  /// would read upside down.
  final bool keepUpright;

  /// The text lies on the ground of a tilted map, as MapLibre lays it for
  /// `text-pitch-alignment: map`, or `auto` with text turning with the map,
  /// a name along a line by default: foreshortened, and on the screen as
  /// large as text facing the viewer.
  final bool textOnGround;

  /// The icon lies on the ground of a tilted map, as MapLibre lays it for
  /// `icon-pitch-alignment: map`, or `auto` with the icon turning with the
  /// map.
  final bool iconOnGround;
  final bool iconIgnored;

  /// How far the edge of the halo fades out, in logical pixels.
  final Expr haloBlur;
  final double maxWidth;
  final Expr iconSize;
  final Expr iconOpacity;

  /// The colour of an icon that takes one.
  final Expr iconColor;

  /// Degrees a point's text is turned clockwise.
  final double textRotate;

  /// Which part of the text sits on the anchor point: `center`, `top`,
  /// `bottom-left` and so on.
  final String anchor;

  /// How far the text is moved from the anchor, in ems.
  final double offsetX;
  final double offsetY;

  /// `text-offset` read per feature or zoom, when it is not one pair.
  final Expr? offsetBy;

  /// The text's offset in ems for the feature and zoom of [context].
  (double, double) textOffset(EvalContext context) {
    final by = offsetBy?.call(context);
    if (by is List && by.length == 2) {
      return (
        (asNumber(by[0]) ?? 0).toDouble(),
        (asNumber(by[1]) ?? 0).toDouble(),
      );
    }
    return (offsetX, offsetY);
  }

  /// `text-variable-anchor`: the anchors tried in turn until the text fits.
  /// Empty when the text has the one [anchor].
  final List<String> anchors;

  /// `text-radial-offset`: how far the text sits from its point whichever
  /// way it lies, in ems. Set, even to 0, it is used instead of
  /// `text-offset` with variable anchors.
  final double? radialOffset;

  /// `text-variable-anchor-offset`: the text's offset in ems for each of
  /// [anchors], as given, which wins over every other offset. Null when the
  /// layer gives anchors alone.
  final List<(double, double)>? anchorOffsets;

  /// Which part of the icon sits on the point.
  final String iconAnchor;

  /// `icon-anchor` read from each feature; null for a constant.
  final Expr? iconAnchorBy;

  String iconAnchorAt(EvalContext c) => switch (iconAnchorBy?.call(c)) {
    final String a => a,
    _ => iconAnchor,
  };

  /// How far the icon is moved, in pixels at an icon size of 1.
  final double iconOffsetX;
  final double iconOffsetY;

  /// `icon-offset` read per feature or zoom, when it is not one pair.
  final Expr? iconOffsetBy;

  /// The icon's offset for the feature and zoom of [context].
  (double, double) iconOffset(EvalContext context) {
    final by = iconOffsetBy?.call(context);
    if (by is List && by.length == 2) {
      return (
        (asNumber(by[0]) ?? 0).toDouble(),
        (asNumber(by[1]) ?? 0).toDouble(),
      );
    }
    return (iconOffsetX, iconOffsetY);
  }

  /// How far the text and the icon are drawn from their place, in logical
  /// pixels, along the map's sides or the screen's.
  final Expr? textTranslate;
  final bool textTranslateOnScreen;
  final Expr? iconTranslate;
  final bool iconTranslateOnScreen;

  /// The rim drawn around an icon that takes a colour, and how far out it
  /// reaches in logical pixels. Null when the style names none.
  final Expr? iconHaloColor;
  final Expr? iconHaloWidth;
  final Expr? iconHaloBlur;

  /// `symbol-height-offset`: how many metres above the ground the label
  /// stands, or above sea level with [heightFromSea]
  /// (`symbol-height-anchor: absolute`). Null for none.
  final Expr? heightOffset;
  final bool heightFromSea;

  /// `text-max-angle` in radians: the sharpest turn a name bent along a
  /// line takes. Null for the package's own.
  final double? maxBend;

  /// The icon may show without its text, or the text without its icon.
  final bool textOptional;
  final bool iconOptional;
  final bool iconOverlaps;
  final bool textOverlaps;

  /// `icon-overlap` and `text-overlap: cooperative`: the symbol overlaps
  /// any other that may be overlapped, but not one that overlaps nothing.
  final bool iconCooperative;
  final bool textCooperative;

  /// Its symbols are drawn top to bottom on the screen, so lower ones
  /// cover higher ones: `symbol-z-order` viewport-y, or auto without a
  /// sort key, when they may overlap.
  final bool drawnByScreenY;

  /// `symbol-z-order` viewport-y: its symbols are also placed bottom to
  /// top on the screen, so a lower one wins a collision.
  final bool placedByScreenY;

  /// Whether the layer has a `symbol-sort-key`, which MapLibre draws by
  /// across tiles rather than tile by tile.
  final bool drawnByKey;

  /// `icon-size` is read from each feature, which MapLibre draws filtered
  /// even where it comes out at 1.
  final bool iconSizeByFeature;

  /// The icon is stretched to sit behind the text.
  final bool textFit;

  /// `icon-text-fit`: none, width, height or both.
  final String iconTextFit;

  /// `icon-text-fit-padding`: top, right, bottom and left, in pixels.
  final List<double> iconTextFitPadding;
}

/// A symbol layer's layout properties given as expressions of the feature
/// or the zoom; null for one the style gives as a constant.
class SymbolLayout {
  const SymbolLayout({
    this.transform,
    this.letterSpacing,
    this.maxWidth,
    this.justify,
    this.anchor,
    this.rotate,
    this.font,
  });

  final Expr? transform, letterSpacing, maxWidth, justify, anchor, rotate;
  final Expr? font;

  /// Whether any of them is an expression, which each label then evaluates.
  bool get any =>
      transform != null ||
      letterSpacing != null ||
      maxWidth != null ||
      justify != null ||
      anchor != null ||
      rotate != null ||
      font != null;
}
