import 'dart:math' as math;
import 'dart:ui' as ui;

/// Where points of the world land on the screen for one frame, with the
/// map's rotation undone so labels can be laid out upright.
class LabelView {
  double rotation = 0;
  double cos = 1;
  double sin = 0;

  /// The middle of the screen, which the map turns around.
  double cx = 0;
  double cy = 0;

  /// The width of the world in logical pixels, and the world pixel at the
  /// screen's top left.
  double world = 256;
  ui.Offset origin = ui.Offset.zero;

  /// Where [project] put the last point.
  double x = 0;
  double y = 0;

  void frame({
    required double rotation,
    required ui.Size size,
    required double world,
    required ui.Offset origin,
  }) {
    this.rotation = rotation;
    cos = math.cos(rotation);
    sin = math.sin(rotation);
    cx = size.width / 2;
    cy = size.height / 2;
    this.world = world;
    this.origin = origin;
  }

  /// Sets [x] and [y] to where the point [wx], [wy] of the world, in
  /// fractions of it, is on the upright screen.
  void project(double wx, double wy) {
    final px = wx * world - origin.dx;
    final py = wy * world - origin.dy;
    if (rotation == 0) {
      x = px;
      y = py;
      return;
    }
    final dx = px - cx;
    final dy = py - cy;
    x = cx + dx * cos - dy * sin;
    y = cy + dx * sin + dy * cos;
  }
}
