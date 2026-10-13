import 'dart:ui' as ui;

import 'view.dart';

class VmapCamera {
  const VmapCamera({
    required this.zoom,
    required this.origin,
    required this.size,
    required this.rotation,
    required this.devicePixelRatio,
    this.view,
  });

  /// Slippy-map zoom: the world is `256 * 2^zoom` logical pixels wide.
  final double zoom;

  /// World pixel at the canvas origin.
  final ui.Offset origin;
  final ui.Size size;
  final double rotation;
  final double devicePixelRatio;

  /// Set when the map is tilted: [origin] and [size] then frame the screen at
  /// the centre's scale, and the view says what the tilted screen shows.
  final MapView? view;
}
