import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show listEquals;

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
