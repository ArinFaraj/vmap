import 'dart:ui' as ui;

class VmapCamera {
  const VmapCamera({
    required this.zoom,
    required this.origin,
    required this.size,
    required this.rotation,
    required this.devicePixelRatio,
  });

  /// Slippy-map zoom: the world is `256 * 2^zoom` logical pixels wide.
  final double zoom;

  /// World pixel at the canvas origin.
  final ui.Offset origin;
  final ui.Size size;
  final double rotation;
  final double devicePixelRatio;
}
