import 'dart:math' as math;

import '../tiles/extrusion.dart';
import '../camera/mercator.dart';
import '../style/style_model.dart';
import '../tiles/tile_builder.dart' show tileExtent;
import '../tiles/tiles.dart';
import '../camera/view.dart';

/// Whether the buildings on screen hide a point on the ground from the
/// camera of a tilted map, so a label behind one fades out as Apple's and
/// Google's maps do. A label inside a building stands on its roof.
///
/// Walks the line from the point toward the camera only as far as the
/// tallest building near it could reach over the line, and tests the walls
/// of the buildings beside that stretch.
class BuildingOcclusion {
  MapView? _view;
  final List<(TileDraw, BuiltExtrusion)> _buildings = [];
  double _perMetre = 0;
  final Stopwatch _clock = Stopwatch()..start();
  int _until = 0;

  /// Time one placement may spend asking; past it, labels count as seen.
  static const budgetMicros = 1500;

  /// Starts a placement's budget.
  void startPass() => _until = _clock.elapsedMicroseconds + budgetMicros;

  /// Takes this frame's [view] and the [tiles] on screen. Buildings count
  /// once the zoom is in their layer's range.
  void update(
    MapView view,
    Iterable<TileDraw> tiles,
    StyleSheet sheet,
    double styleZoom,
  ) {
    _buildings.clear();
    _view = view;
    this.view = 0;
    if (view.pitch < 15) return;
    final eye = view.eye;
    final shown = {
      for (final layer in sheet.extrusions)
        if (styleZoom >= layer.minZoom && styleZoom < layer.maxZoom)
          layer.bucket,
    };
    if (shown.isEmpty) return;
    for (final d in tiles) {
      for (final e in d.tile.extrusions) {
        if (shown.contains(e.bucket)) _buildings.add((d, e));
      }
    }
    _perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
    this.view = Object.hash(eye.x, eye.y, eye.height, _buildings.length);
  }

  /// Which camera and buildings the answers of [hides] hold for: an answer
  /// found for the same value still stands.
  int view = 0;

  /// Whether a building hides the ground point [wx], [wy], in fractions of
  /// the world, or null once this placement's budget is spent.
  bool? hides(double wx, double wy) {
    final view = _view;
    if (view == null || _buildings.isEmpty) return false;
    if (_clock.elapsedMicroseconds > _until) return null;
    final px = wx * view.worldSize, py = wy * view.worldSize;
    final eye = view.eye;
    final dx = eye.x - px, dy = eye.y - py;
    final ground = math.sqrt(dx * dx + dy * dy);
    if (ground < 1) return false;
    final slope = eye.height / ground;
    final ux = dx / ground, uy = dy / ground;
    var standing = 0.0;
    for (final (d, e) in _buildings) {
      final grid = e.index;
      final scale = tileExtent / d.size;
      final ax = (px - view.worldSize * _left(d)) * scale;
      final ay = (py - view.worldSize * _top(d)) * scale;
      final roof = grid.roofAt(e.walls, e.info, ax, ay);
      if (roof * _perMetre > standing) standing = roof * _perMetre;
    }
    for (final (d, e) in _buildings) {
      final grid = e.index;
      final reach = math.min(
        ground,
        (grid.tallest * _perMetre - standing) / slope,
      );
      if (reach <= 0) continue;
      final scale = tileExtent / d.size;
      final ax = (px - view.worldSize * _left(d)) * scale;
      final ay = (py - view.worldSize * _top(d)) * scale;
      final bx = ax + ux * reach * scale, by = ay + uy * reach * scale;
      if (grid.blocks(e.walls, e.info, ax, ay, bx, by, (along) {
        return standing + along / scale * slope;
      }, _perMetre)) {
        return true;
      }
    }
    return false;
  }

  double _left(TileDraw d) => d.tile.id.x / (1 << d.tile.id.z);
  double _top(TileDraw d) => d.tile.id.y / (1 << d.tile.id.z);
}
