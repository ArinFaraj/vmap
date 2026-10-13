import 'dart:math' as math;
import 'dart:typed_data';

import 'extrusion.dart';
import 'mercator.dart';
import 'style_model.dart';
import 'tile_builder.dart' show tileExtent;
import 'tiles.dart';
import 'view.dart';

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
  final Expando<_Grid> _grids = Expando();
  double _perMetre = 0;

  /// Takes this frame's [view] and the [tiles] on screen. Buildings count
  /// once the zoom is in their layer's range.
  void update(
    MapView? view,
    Iterable<TileDraw> tiles,
    StyleSheet sheet,
    double styleZoom,
  ) {
    _buildings.clear();
    _view = view;
    if (view == null || view.pitch < 15) return;
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
  }

  /// Whether a building hides the ground point [wx], [wy], in fractions of
  /// the world.
  bool hides(double wx, double wy) {
    final view = _view;
    if (view == null || _buildings.isEmpty) return false;
    final px = wx * view.worldSize, py = wy * view.worldSize;
    final eye = view.eye;
    final dx = eye.x - px, dy = eye.y - py;
    final ground = math.sqrt(dx * dx + dy * dy);
    if (ground < 1) return false;
    final slope = eye.height / ground;
    final ux = dx / ground, uy = dy / ground;
    var standing = 0.0;
    for (final (d, e) in _buildings) {
      final grid = _grids[e] ??= _Grid(e);
      final scale = tileExtent / d.size;
      final ax = (px - view.worldSize * _left(d)) * scale;
      final ay = (py - view.worldSize * _top(d)) * scale;
      final roof = grid.roofAt(e, ax, ay);
      if (roof * _perMetre > standing) standing = roof * _perMetre;
    }
    for (final (d, e) in _buildings) {
      final grid = _grids[e]!;
      final reach = math.min(
        ground,
        (grid.tallest * _perMetre - standing) / slope,
      );
      if (reach <= 0) continue;
      final scale = tileExtent / d.size;
      final ax = (px - view.worldSize * _left(d)) * scale;
      final ay = (py - view.worldSize * _top(d)) * scale;
      final bx = ax + ux * reach * scale, by = ay + uy * reach * scale;
      if (grid.blocks(e, ax, ay, bx, by, (along) {
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

/// One tile's buildings in a 16 by 16 grid of cells by their bounds.
class _Grid {
  _Grid(BuiltExtrusion e) {
    final n = e.count;
    bounds = Float32List(n * 4);
    final cells = List.generate(_cells * _cells, (_) => <int>[]);
    for (var b = 0; b < n; b++) {
      final i = b * BuiltExtrusion.stride;
      tallest = math.max(tallest, e.info[i]);
      final first = e.info[i + 4].toInt(), count = e.info[i + 5].toInt();
      var x0 = double.infinity, y0 = double.infinity;
      var x1 = -double.infinity, y1 = -double.infinity;
      for (var w = first; w < first + count; w++) {
        x0 = math.min(x0, e.walls[w * 4]);
        x1 = math.max(x1, e.walls[w * 4]);
        y0 = math.min(y0, e.walls[w * 4 + 1]);
        y1 = math.max(y1, e.walls[w * 4 + 1]);
      }
      bounds
        ..[b * 4] = x0
        ..[b * 4 + 1] = y0
        ..[b * 4 + 2] = x1
        ..[b * 4 + 3] = y1;
      for (var cy = _cell(y0); cy <= _cell(y1); cy++) {
        for (var cx = _cell(x0); cx <= _cell(x1); cx++) {
          cells[cy * _cells + cx].add(b);
        }
      }
    }
    _byCell = cells;
    _seen = Int32List(n);
  }

  static const _cells = 16;
  late final Float32List bounds;
  late final List<List<int>> _byCell;
  late final Int32List _seen;
  int _stamp = 0;
  double tallest = 0;

  static int _cell(double v) =>
      (v / tileExtent * _cells).floor().clamp(0, _cells - 1);

  /// The height in metres of the building that ground point [x], [y], in
  /// tile units, stands in, or 0.
  double roofAt(BuiltExtrusion e, double x, double y) {
    if (x < 0 || y < 0 || x >= tileExtent || y >= tileExtent) return 0;
    var roof = 0.0;
    for (final b in _byCell[_cell(y) * _cells + _cell(x)]) {
      if (x < bounds[b * 4] ||
          y < bounds[b * 4 + 1] ||
          x > bounds[b * 4 + 2] ||
          y > bounds[b * 4 + 3]) {
        continue;
      }
      if (_inside(e, b, x, y)) {
        roof = math.max(roof, e.info[b * BuiltExtrusion.stride]);
      }
    }
    return roof;
  }

  /// Whether a wall crosses the stretch from [ax], [ay] to [bx], [by] in
  /// tile units above the line's height there, which [lineAt] gives in
  /// world pixels for a distance along the stretch in tile units.
  bool blocks(
    BuiltExtrusion e,
    double ax,
    double ay,
    double bx,
    double by,
    double Function(double along) lineAt,
    double perMetre,
  ) {
    final minX = math.min(ax, bx), maxX = math.max(ax, bx);
    final minY = math.min(ay, by), maxY = math.max(ay, by);
    if (maxX < 0 || maxY < 0 || minX >= tileExtent || minY >= tileExtent) {
      return false;
    }
    _stamp++;
    final ex = bx - ax, ey = by - ay;
    final length = math.sqrt(ex * ex + ey * ey);
    if (length == 0) return false;
    for (var cy = _cell(minY); cy <= _cell(maxY); cy++) {
      for (var cx = _cell(minX); cx <= _cell(maxX); cx++) {
        for (final b in _byCell[cy * _cells + cx]) {
          if (_seen[b] == _stamp) continue;
          _seen[b] = _stamp;
          if (maxX < bounds[b * 4] ||
              maxY < bounds[b * 4 + 1] ||
              minX > bounds[b * 4 + 2] ||
              minY > bounds[b * 4 + 3]) {
            continue;
          }
          final i = b * BuiltExtrusion.stride;
          final height = e.info[i] * perMetre;
          final first = e.info[i + 4].toInt(), count = e.info[i + 5].toInt();
          for (var w = first; w < first + count; w++) {
            final t = _cross(
              ax,
              ay,
              ex,
              ey,
              e.walls[w * 4],
              e.walls[w * 4 + 1],
              e.walls[w * 4 + 2],
              e.walls[w * 4 + 3],
            );
            if (t >= 0 && height > lineAt(t * length)) return true;
          }
        }
      }
    }
    return false;
  }

  /// Where along the stretch from ([ax], [ay]) by ([ex], [ey]) it crosses
  /// the segment from ([x0], [y0]) to ([x1], [y1]), from 0 to 1, or -1.
  static double _cross(
    double ax,
    double ay,
    double ex,
    double ey,
    double x0,
    double y0,
    double x1,
    double y1,
  ) {
    final fx = x1 - x0, fy = y1 - y0;
    final den = ex * fy - ey * fx;
    if (den == 0) return -1;
    final gx = x0 - ax, gy = y0 - ay;
    final t = (gx * fy - gy * fx) / den;
    final s = (gx * ey - gy * ex) / den;
    if (t <= 0 || t > 1 || s < 0 || s > 1) return -1;
    return t;
  }

  /// Even-odd test of [x], [y] against building [b]'s walls.
  static bool _inside(BuiltExtrusion e, int b, double x, double y) {
    final i = b * BuiltExtrusion.stride;
    final first = e.info[i + 4].toInt(), count = e.info[i + 5].toInt();
    var inside = false;
    for (var w = first; w < first + count; w++) {
      final x0 = e.walls[w * 4], y0 = e.walls[w * 4 + 1];
      final x1 = e.walls[w * 4 + 2], y1 = e.walls[w * 4 + 3];
      if ((y0 > y) != (y1 > y) && x < (x1 - x0) * (y - y0) / (y1 - y0) + x0) {
        inside = !inside;
      }
    }
    return inside;
  }
}
