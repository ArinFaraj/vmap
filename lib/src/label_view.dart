import 'dart:math' as math;
import 'dart:ui' as ui;

import 'expr.dart';
import 'view.dart';

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

  /// Set when the map is tilted: points are projected through it, and the
  /// frame is already upright.
  MapView? tilted;

  /// Where [project] put the last point, and the label scale there: 1 on a
  /// flat map, less farther from a tilted camera.
  double x = 0;
  double y = 0;
  double ratio = 1;

  void frame({
    required double rotation,
    required ui.Size size,
    required double world,
    required ui.Offset origin,
    MapView? tilted,
  }) {
    this.tilted = tilted;
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
    final view = tilted;
    if (view != null) {
      view.projectTo(wx * view.worldSize, wy * view.worldSize);
      x = view.outX;
      y = view.outY;
      ratio = 0.5 + 0.5 / view.outDepth;
      return;
    }
    ratio = 1;
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

  /// The direction on screen of a line through the point [wx], [wy] of the
  /// world that runs at [angle] on the flat map. On a tilted map that is
  /// measured between two projected points, since perspective and the
  /// bearing both bend it. Leaves [x] and [y] where they were.
  double screenAngle(double wx, double wy, double angle) {
    final view = tilted;
    if (view == null) return angle + rotation;
    final keepX = x, keepY = y, keepRatio = ratio;
    final step = 8 / view.worldSize;
    final dx = math.cos(angle) * step, dy = math.sin(angle) * step;
    project(wx - dx, wy - dy);
    final ax = x, ay = y;
    project(wx + dx, wy + dy);
    final turn = math.atan2(y - ay, x - ax);
    x = keepX;
    y = keepY;
    ratio = keepRatio;
    return turn;
  }

  /// A style's translate read in [context], as the upright label frame
  /// sees it: a move along the map's sides turns with the map, one along
  /// the screen's sides when [onScreen] does not.
  (double, double) moved(Expr? translate, bool onScreen, EvalContext context) {
    if (translate == null) return (0, 0);
    final by = translate(context);
    if (by is! List || by.length != 2) return (0, 0);
    final x = asNumber(by[0]) ?? 0, y = asNumber(by[1]) ?? 0;
    return onScreen || rotation == 0
        ? (x, y)
        : (x * cos - y * sin, x * sin + y * cos);
  }
}
