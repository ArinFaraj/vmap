import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'label_path.dart';
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

  /// The ground's height in world pixels at a point of the world, when the
  /// style raises it: points are projected standing on it.
  double Function(double wx, double wy)? ground;

  /// Where [project] put the last point, and the label scale there: 1 on a
  /// flat map, less farther from a tilted camera.
  double x = 0;
  double y = 0;
  double ratio = 1;

  /// How much farther than the middle of the screen the last point lies.
  double depth = 1;

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

  /// Whether raised ground stands between the camera and the point [wx],
  /// [wy] of the world, in fractions of it, standing on the ground: the
  /// line of sight is walked over the heights, as MapLibre reads its
  /// terrain depth. Its last tenth is left out, or a label on a slope would
  /// hide behind the slope it stands on.
  bool behindHill(double wx, double wy) {
    final view = tilted, height = ground;
    if (view == null || height == null) return false;
    final w = view.worldSize;
    final (x: ex, y: ey, height: eh) = view.eye;
    final px = wx * w, py = wy * w, ph = height(wx, wy);
    final dx = px - ex, dy = py - ey, dh = ph - eh;
    final margin = 0.002 * math.sqrt(dx * dx + dy * dy + dh * dh);
    const steps = 32;
    for (var i = 2; i < steps - 2; i++) {
      final t = i / steps;
      final x = ex + dx * t, y = ey + dy * t;
      if (height(x / w, y / w) > eh + dh * t + margin) return true;
    }
    return false;
  }

  /// Sets [x] and [y] to where the point [wx], [wy] of the world, in
  /// fractions of it, is on the upright screen.
  void project(double wx, double wy) {
    final view = tilted;
    if (view != null) {
      view.projectTo(
        wx * view.worldSize,
        wy * view.worldSize,
        ground?.call(wx, wy) ?? 0,
      );
      x = view.outX;
      y = view.outY;
      ratio = 0.5 + 0.5 / view.outDepth;
      depth = view.outDepth;
      return;
    }
    ratio = 1;
    depth = 1;
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
    final keepX = x, keepY = y, keepRatio = ratio, keepDepth = depth;
    final step = 8 / view.worldSize;
    final dx = math.cos(angle) * step, dy = math.sin(angle) * step;
    project(wx - dx, wy - dy);
    final ax = x, ay = y;
    project(wx + dx, wy + dy);
    final turn = math.atan2(y - ay, x - ax);
    x = keepX;
    y = keepY;
    ratio = keepRatio;
    depth = keepDepth;
    return turn;
  }

  /// [screenAngle] turned by half a turn where needed so text along it
  /// reads left to right: between minus and plus a quarter turn. With
  /// [keep] false it is only brought between minus and plus a half turn.
  double uprightAngle(double wx, double wy, double angle, {bool keep = true}) {
    var turn = screenAngle(wx, wy, angle) % (2 * math.pi);
    if (turn > math.pi) turn -= 2 * math.pi;
    if (!keep) return turn;
    if (turn > math.pi / 2) turn -= math.pi;
    if (turn < -math.pi / 2) turn += math.pi;
    return turn;
  }

  Float64List _screen = Float64List(64);

  /// [path], points of the world, where they fall on the screen, and how
  /// far along that the point [at] along [path] lands. Text facing the
  /// screen is laid along this in screen pixels, as MapLibre lays it: on a
  /// tilted map a road shrinks with distance faster than its letters do,
  /// so spacing them along the flat road would cram them. The list is
  /// reused by the next call.
  (Float64List, double) onScreen(Float64List path, double at) {
    if (_screen.length < path.length) _screen = Float64List(path.length * 2);
    for (var i = 0; i < path.length; i += 2) {
      project(path[i], path[i + 1]);
      _screen[i] = x;
      _screen[i + 1] = y;
    }
    final points = Float64List.sublistView(_screen, 0, path.length);
    return (points, screenDistance(path, points, at));
  }

  /// A style's translate read in [context], as the upright label frame
  /// sees it: a move along the map's sides turns with the map, one along
  /// the screen's sides when [onScreen] does not.
  (double, double) moved(Expr? translate, bool onScreen, EvalContext context) {
    if (translate == null) return (0, 0);
    final by = translate(context);
    if (by is! List || by.length != 2) return (0, 0);
    final x = asNumber(by[0]) ?? 0, y = asNumber(by[1]) ?? 0;
    // A projected frame is upright, its turn in the view's bearing.
    final view = tilted;
    final turn = view == null ? rotation : -view.bearing * math.pi / 180;
    if (onScreen || turn == 0) return (x, y);
    final c = math.cos(turn), s = math.sin(turn);
    return (x * c - y * s, x * s + y * c);
  }
}
