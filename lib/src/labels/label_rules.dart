/// The few layout choices where vmap's own look and MapLibre's differ.
class LabelRules {
  const LabelRules._(this.lineHeight, this.snapIcons, this.spreadNames);

  /// vmap's look: lines a little tighter, icons on whole device pixels so
  /// they stay crisp, and a name spaced along a road kept from its own.
  static const vmap = LabelRules._(1.15, true, true);

  /// A style drawn as MapLibre draws it, with its own glyph ranges.
  static const mapLibre = LabelRules._(1.2, false, false);

  /// Line height in ems when the style gives none.
  final double lineHeight;

  /// Whether an upright icon is moved to the nearest device pixel.
  final bool snapIcons;

  /// Whether an upright name spaced along a line is left out near another
  /// of the same name; MapLibre places each at its spacing.
  final bool spreadNames;
}
