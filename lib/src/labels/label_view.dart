import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../camera/camera.dart';
import '../camera/mercator.dart';
import '../camera/view.dart';
import '../style/expr.dart';
import '../terrain/terrain.dart';
import 'label_path.dart';
import 'sdf_text.dart';

/// Where points of the world land on the screen for one frame, through the
/// camera's view, so labels can be laid out upright on the screen.
class LabelView {
  /// The middle of the screen, which the map turns around.
  double cx = 0;
  double cy = 0;

  /// The width of the world in logical pixels, and the world pixel at the
  /// screen's top left.
  double world = 256;
  ui.Offset origin = ui.Offset.zero;

  /// What the camera sees: points are projected through it.
  late MapView tilted;

  /// The ground's height in world pixels at a point of the world, when the
  /// style raises it: points are projected standing on it.
  double Function(double wx, double wy)? ground;

  /// World pixels in a metre, and sea level's height in world pixels: 0
  /// unless raised ground is drawn from the height under the middle.
  double perMetre = 0, seaLevel = 0;

  double _lift = 0;
  bool _fromSea = false;

  /// Projects points [metres] above the ground, or above sea level
  /// [fromSea], until called again: a label's `symbol-height-offset`.
  void standAt(double metres, {bool fromSea = false}) {
    _lift = metres * perMetre;
    _fromSea = fromSea;
  }

  /// The height in world pixels points at [wx], [wy] are projected at.
  double heightAt(double wx, double wy) =>
      (_fromSea ? seaLevel : ground?.call(wx, wy) ?? 0) + _lift;

  /// Where [project] put the last point, and the label scale there: 1 on a
  /// flat map, less farther from a tilted camera.
  double x = 0;
  double y = 0;
  double ratio = 1;

  /// How much farther than the middle of the screen the last point lies.
  double depth = 1;

  /// Device pixels in a logical pixel.
  double devicePixelRatio = 1;

  /// The camera stands where it stood the frame before. Only then do
  /// labels sit on whole device pixels to stay crisp: on a moving map a
  /// label held to the pixels steps while the map under it glides.
  bool still = true;

  /// The map is zooming, when MapLibre samples icons smoothly.
  bool moving = false;

  /// Draws text from a style's glyph ranges as distance fields for the
  /// frame being drawn, when the renderer can.
  SdfText? sdf;

  /// Frames [camera], with the ground [terrain] raises, if any.
  void frame(MapFrame camera, [Terrain? terrain]) {
    final view = tilted = camera.view;
    cx = camera.size.width / 2;
    cy = camera.size.height / 2;
    world = 256.0 * math.pow(2, camera.zoom);
    origin = camera.origin;
    devicePixelRatio = camera.devicePixelRatio;
    // As MapLibre's pixels per meter: at the middle's latitude on the flat
    // map, and at the equator's on the globe, whose sphere is the world's
    // width around.
    perMetre = view.globe != null
        ? view.worldSize / earthCircumference
        : perMetreAt(view);
    if (terrain == null) {
      ground = null;
      seaLevel = 0;
    } else {
      final toWorld = perMetreAt(view), zoom = view.zoom.floor();
      ground = (wx, wy) => terrain.at(wx, wy, zoom) * toWorld;
      seaLevel = -terrain.centre * perMetre;
    }
    standAt(0);
  }

  /// [at] moved to the nearest device pixel while the map is [still].
  double onPixel(double at) =>
      still ? (at * devicePixelRatio).roundToDouble() / devicePixelRatio : at;

  /// Whether raised ground stands between the camera and the point [wx],
  /// [wy] of the world, in fractions of it, at the height it is projected
  /// at: the
  /// line of sight is walked over the heights, as MapLibre reads its
  /// terrain depth. Its last tenth is left out, or a label on a slope would
  /// hide behind the slope it stands on.
  bool behindHill(double wx, double wy) {
    final height = ground;
    if (height == null) return false;
    final view = tilted;
    final w = view.worldSize;
    final (x: ex, y: ey, height: eh) = view.eye;
    final px = wx * w, py = wy * w, ph = heightAt(wx, wy);
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

  /// How much larger text laid on the ground is at [wy] on the globe, as
  /// MapLibre's getPitchedTextCorrection: a world unit there is smaller on
  /// the sphere by the cosine of its latitude, against the centre's.
  double groundScale(double wy) {
    final view = tilted;
    final globe = view.globe;
    if (globe == null) return 1;
    double cosine(double y) =>
        math.cos(math.min(latitudeAt(y).abs(), 85.051129) * math.pi / 180);
    final full = cosine(view.centerY) / math.max(cosine(wy), 1e-6);
    return 1 + (full - 1) * globe.transition;
  }

  /// Sets [x] and [y] to where the point [wx], [wy] of the world, in
  /// fractions of it, is on the upright screen.
  void project(double wx, double wy) {
    final view = tilted;
    view.projectTo(wx * view.worldSize, wy * view.worldSize, heightAt(wx, wy));
    x = view.outX;
    y = view.outY;
    ratio = 0.5 + 0.5 / view.outDepth;
    depth = view.outDepth;
  }

  /// The direction on screen of a line through the point [wx], [wy] of the
  /// world that runs at [angle] on the flat map, measured between two
  /// projected points, since perspective and the bearing both bend it.
  /// Leaves [x] and [y] where they were.
  double screenAngle(double wx, double wy, double angle) {
    final view = tilted;
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

  /// How far the map is turned on the upright screen: the view's bearing
  /// and roll.
  double get mapTurn => -(tilted.bearing + tilted.roll) * math.pi / 180;

  /// A style's translate read in [context], as the upright label frame
  /// sees it: a move along the map's sides turns with the map, one along
  /// the screen's sides when [onScreen] does not.
  ///
  /// On a tilted map with the label's anchor [at], as fractions of the
  /// world, the move is laid on the map as MapLibre's translatePosition
  /// lays it, in pixels at the centre's scale, so the tilt foreshortens it.
  (double, double) moved(
    Expr? translate,
    bool onScreen,
    EvalContext context, {
    (double, double)? at,
  }) {
    if (translate == null) return (0, 0);
    final by = translate(context);
    if (by is! List || by.length != 2) return (0, 0);
    final x = asNumber(by[0]) ?? 0, y = asNumber(by[1]) ?? 0;
    final turn = mapTurn;
    final view = tilted;
    if (at != null && (view.pitch > 0 || view.globe != null)) {
      var mx = x.toDouble(), my = y.toDouble();
      if (onScreen && turn != 0) {
        final c = math.cos(-turn), s = math.sin(-turn);
        (mx, my) = (mx * c - my * s, mx * s + my * c);
      }
      final (wx, wy) = at;
      final keepX = this.x, keepY = this.y;
      final keepRatio = ratio, keepDepth = depth;
      project(wx, wy);
      final ax = this.x, ay = this.y;
      project(wx + mx / view.worldSize, wy + my / view.worldSize);
      final out = (this.x - ax, this.y - ay);
      this.x = keepX;
      this.y = keepY;
      ratio = keepRatio;
      depth = keepDepth;
      return out;
    }
    if (onScreen || turn == 0) return (x, y);
    final c = math.cos(turn), s = math.sin(turn);
    return (x * c - y * s, x * s + y * c);
  }
}
