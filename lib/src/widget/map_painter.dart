import 'package:flutter/widgets.dart';

import '../engine.dart';
import 'vmap_controller.dart';

/// Paints the whole map on Flutter's canvas.
class MapPainter extends CustomPainter {
  MapPainter(this.engine, this.controller, this.devicePixelRatio, this.painted)
    : super(repaint: Listenable.merge([engine, controller]));

  final VmapEngine engine;
  final VmapController controller;
  final double devicePixelRatio;

  /// Told after each frame the map drew.
  final VoidCallback painted;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.clipRect(Offset.zero & size);
    engine.paint(
      canvas,
      size,
      controller.camera,
      devicePixelRatio: devicePixelRatio,
      ahead: controller.destination,
    );
    painted();
  }

  @override
  bool shouldRepaint(MapPainter old) =>
      old.engine != engine ||
      old.controller != controller ||
      old.devicePixelRatio != devicePixelRatio;
}
