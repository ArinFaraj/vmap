/// The layout choices where vmap's own look and MapLibre's differ.
class LabelRules {
  const LabelRules._({
    required this.lineHeight,
    required this.snapIcons,
    required this.spreadNames,
    required this.placedLead,
    required this.placesByTile,
    required this.quantizesPoints,
    required this.roadsAsMapLibre,
  });

  /// vmap's look: lines a little tighter, icons on whole device pixels so
  /// they stay crisp, a name spaced along a road kept from its own, and a
  /// label that showed kept ahead of newcomers so the map does not flicker.
  static const vmap = LabelRules._(
    lineHeight: 1.15,
    snapIcons: true,
    spreadNames: true,
    placedLead: 45,
    placesByTile: false,
    quantizesPoints: false,
    roadsAsMapLibre: false,
  );

  /// A style drawn as MapLibre draws it, with its own glyph ranges.
  static const mapLibre = LabelRules._(
    lineHeight: 1.2,
    snapIcons: false,
    spreadNames: false,
    placedLead: 0,
    placesByTile: true,
    quantizesPoints: true,
    roadsAsMapLibre: true,
  );

  /// Line height in ems when the style gives none.
  final double lineHeight;

  /// Whether an upright icon is moved to the nearest device pixel.
  final bool snapIcons;

  /// Whether an upright name spaced along a line is left out near another
  /// of the same name; MapLibre places each at its spacing.
  final bool spreadNames;

  /// How many ranks a label placed in the last pass moves up.
  final int placedLead;

  /// Whether labels of one rank are placed tile by tile, as MapLibre
  /// orders them, rather than in the order the sources list them.
  final bool placesByTile;

  /// Whether a point's box is cut to MapLibre's 16 tile units to the pixel.
  final bool quantizesPoints;

  /// Whether a name along a line is fitted to its road, spaced from its
  /// own and weighed against the rest as MapLibre does: collision circles,
  /// the layer's overlap settings, and no extra room around it.
  final bool roadsAsMapLibre;
}
