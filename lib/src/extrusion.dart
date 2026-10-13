import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:dart_earcut/dart_earcut.dart';

import 'expr.dart';
import 'mercator.dart';
import 'platform.dart';
import 'style_model.dart';
import 'tile_builder.dart' show tileExtent;
import 'tiles.dart' show TileDraw;
import 'view.dart';

/// One tile's buildings of one `fill-extrusion` bucket: their walls, roofs,
/// heights and colours, in tile units.
class BuiltExtrusion {
  BuiltExtrusion(
    this.bucket,
    this.walls,
    this.roof,
    this.roofIndices,
    this.info,
    this.vertices,
  );

  /// Every wall and roof as triangles ready for the GPU, three 32 bit words
  /// a vertex: x and y in half tile units plus 16384, 16 bits each; height
  /// in decimetres; and the colour, lit from the north west and darker at
  /// the foot, as red, green, blue and alpha bytes. A third of the size of
  /// floats, so a tile goes to the GPU in a third of the time.
  final Uint32List vertices;

  /// Vertices per piece the GPU takes at once, whole triangles.
  static const chunk = 8190;

  final int bucket;

  /// x0, y0, x1, y1 per wall, each building's walls together, outer rings
  /// clockwise on screen so a wall's outside is to its left.
  final Float32List walls;

  /// Roof points as x, y.
  final Float32List roof;

  /// Roof triangles, three indices into [roof] each.
  final Float32List roofIndices;

  /// Per building: height and base in metres, centre x and y, first wall
  /// and wall count, first roof index and index count, and red, green, blue
  /// and alpha from 0 to 1.
  final Float32List info;

  static const stride = 12;
  int get count => info.length ~/ stride;

  List<Object?> toMessage() => [
    bucket,
    pack(walls),
    pack(roof),
    pack(roofIndices),
    pack(info),
    pack(
      Float32List.view(
        vertices.buffer,
        vertices.offsetInBytes,
        vertices.length,
      ),
    ),
  ];

  static BuiltExtrusion fromMessage(List<Object?> m) => BuiltExtrusion(
    m[0]! as int,
    unpackFloats(m[1]!),
    unpackFloats(m[2]!),
    unpackFloats(m[3]!),
    unpackFloats(m[4]!),
    () {
      final words = unpackFloats(m[5]!);
      return words.buffer.asUint32List(words.offsetInBytes, words.length);
    }(),
  );
}

/// Collects buildings for one bucket while a tile is built.
class ExtrusionBuilder {
  ExtrusionBuilder(this.bucket);

  final int bucket;
  final List<double> _walls = [];
  final List<double> _roof = [];
  final List<double> _indices = [];
  final List<double> _info = [];

  /// Adds one feature: rings of x, y pairs in tile units between the point
  /// indices of [starts] and [ends].
  void add(
    Float64List coords,
    List<int> starts,
    List<int> ends,
    double height,
    double base,
    Rgba color,
  ) {
    if (height <= base) return;
    var polygonStart = -1;
    final ring = <double>[];
    final holes = <int>[];
    final wallsFrom = _walls.length ~/ 4;
    final roofFrom = _indices.length;
    var sx = 0.0, sy = 0.0, area = 0.0;

    void roof() {
      if (polygonStart < 0 || ring.length < 6) return;
      final flat = Float64List.fromList(ring);
      final tris = Earcut.triangulateRaw(flat, holeIndices: holes);
      final at = _roof.length ~/ 2;
      _roof.addAll(ring);
      for (final t in tris) {
        _indices.add((at + t).toDouble());
      }
      ring.clear();
      holes.clear();
      polygonStart = -1;
    }

    for (var r = 0; r < starts.length; r++) {
      final start = starts[r], end = ends[r];
      var count = end - start;
      if (count < 3) continue;
      if (coords[start * 2] == coords[(end - 1) * 2] &&
          coords[start * 2 + 1] == coords[(end - 1) * 2 + 1]) {
        count--;
      }
      var a = 0.0;
      for (var i = 0; i < count; i++) {
        final j = (i + 1) % count;
        a +=
            coords[(start + i) * 2] * coords[(start + j) * 2 + 1] -
            coords[(start + j) * 2] * coords[(start + i) * 2 + 1];
      }
      if (a.abs() < 1) continue;
      final outer = a > 0;
      if (outer) {
        roof();
        polygonStart = 0;
        area += a;
        for (var i = 0; i < count; i++) {
          sx += coords[(start + i) * 2] * a / count;
          sy += coords[(start + i) * 2 + 1] * a / count;
        }
      } else if (polygonStart >= 0) {
        holes.add(ring.length ~/ 2);
      } else {
        continue;
      }
      for (var i = 0; i < count; i++) {
        final x = coords[(start + i) * 2], y = coords[(start + i) * 2 + 1];
        ring
          ..add(x)
          ..add(y);
        final j = (i + 1) % count;
        _walls.addAll([
          x,
          y,
          coords[(start + j) * 2],
          coords[(start + j) * 2 + 1],
        ]);
      }
    }
    roof();
    final walls = _walls.length ~/ 4 - wallsFrom;
    if (walls == 0 || area == 0) return;
    _info.addAll([
      height,
      base,
      sx / area,
      sy / area,
      wallsFrom.toDouble(),
      walls.toDouble(),
      roofFrom.toDouble(),
      (_indices.length - roofFrom).toDouble(),
      color.r,
      color.g,
      color.b,
      color.a,
    ]);
  }

  BuiltExtrusion? finish() {
    if (_info.isEmpty) return null;
    var count = 0;
    for (var i = 0; i < _info.length; i += BuiltExtrusion.stride) {
      count += _info[i + 5].toInt() * 6 + _info[i + 7].toInt();
    }
    final out = Uint32List(count * 3);
    var o = 0;
    int coord(double v) => ((v + 8192) * 2).round().clamp(0, 0xFFFF);
    for (var i = 0; i < _info.length; i += BuiltExtrusion.stride) {
      final top = _info[i], bottom = _info[i + 1];
      final r = _info[i + 8], g = _info[i + 9], b = _info[i + 10];
      final a = (_info[i + 11] * 255).round().clamp(0, 255);
      void vertex(double x, double y, double z, double light) {
        out[o++] = coord(x) | coord(y) << 16;
        out[o++] = (z * 10).round().clamp(0, 0xFFFF);
        out[o++] =
            (r * light * 255).round().clamp(0, 255) |
            (g * light * 255).round().clamp(0, 255) << 8 |
            (b * light * 255).round().clamp(0, 255) << 16 |
            a << 24;
      }

      final firstWall = _info[i + 4].toInt(), walls = _info[i + 5].toInt();
      for (var j = firstWall; j < firstWall + walls; j++) {
        final x0 = _walls[j * 4], y0 = _walls[j * 4 + 1];
        final x1 = _walls[j * 4 + 2], y1 = _walls[j * 4 + 3];
        final nx = y1 - y0, ny = x0 - x1;
        final len = math.sqrt(nx * nx + ny * ny);
        final facing = len == 0
            ? 0.0
            : (nx * ExtrusionPainter.lightX + ny * ExtrusionPainter.lightY) /
                  len;
        final light = 0.72 + 0.2 * facing;
        final low = light * 0.82;
        vertex(x0, y0, bottom, low);
        vertex(x1, y1, bottom, low);
        vertex(x1, y1, top, light);
        vertex(x0, y0, bottom, low);
        vertex(x1, y1, top, light);
        vertex(x0, y0, top, light);
      }
      final firstRoof = _info[i + 6].toInt(), roofs = _info[i + 7].toInt();
      for (var j = firstRoof; j < firstRoof + roofs; j++) {
        final v = _indices[j].toInt();
        vertex(_roof[v * 2], _roof[v * 2 + 1], top, 1);
      }
    }
    return BuiltExtrusion(
      bucket,
      Float32List.fromList(_walls),
      Float32List.fromList(_roof),
      Float32List.fromList(_indices),
      Float32List.fromList(_info),
      out,
    );
  }
}

/// Draws a style's buildings standing up on a tilted map. vmap's own draws
/// them with the canvas; another may draw them on the GPU with a depth
/// buffer.
abstract class BuildingRenderer {
  /// Draws what it can and returns true when it held some back for the
  /// next frame.
  bool paint(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    StyleSheet sheet,
    Iterable<TileDraw> tiles,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
  );

  void dispose() {}
}

/// Draws buildings standing up on a tilted map with the canvas: walls and
/// roofs projected through the view, farthest building first, walls facing
/// away from the camera left out and each wall shaded by where it faces.
class ExtrusionPainter implements BuildingRenderer {
  Float32List _positions = Float32List(1 << 14);
  Int32List _colors = Int32List(1 << 13);
  int _vertices = 0;
  Float64List _keys = Float64List(1024);
  Int32List _order = Int32List(1024);
  final List<(TileDraw, BuiltExtrusion)> _found = [];

  /// The direction light comes from on the ground: the north west.
  static const lightX = -0.6, lightY = -0.8;

  @override
  void dispose() {}

  @override
  bool paint(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    StyleSheet sheet,
    Iterable<TileDraw> tiles,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
  ) {
    for (final layer in sheet.extrusions) {
      if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) continue;
      final opacity = (asNumber(layer.opacity(context)) ?? 1).clamp(0.0, 1.0);
      if (opacity == 0) continue;
      _found.clear();
      var n = 0;
      for (final d in tiles) {
        for (final e in d.tile.extrusions) {
          if (e.bucket != layer.bucket) continue;
          _found.add((d, e));
          n += e.count;
        }
      }
      if (n == 0) continue;
      _draw(canvas, view, origin, n, opacity);
    }
    return false;
  }

  void _draw(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    int n,
    double opacity,
  ) {
    if (_keys.length < n) {
      _keys = Float64List(n * 2);
      _order = Int32List(n * 2);
    }
    final cam = view.cameraGround;
    const margin = 160.0;
    final right = view.width + margin, bottom = view.height + margin;
    var k = 0;
    for (var t = 0; t < _found.length; t++) {
      final (d, e) = _found[t];
      final scale = d.size / tileExtent;
      final ox = origin.dx + d.left, oy = origin.dy + d.top;
      for (var b = 0; b < e.count; b++) {
        final i = b * BuiltExtrusion.stride;
        final cx = ox + e.info[i + 2] * scale, cy = oy + e.info[i + 3] * scale;
        if (view.depth(cx, cy) < 0.2) continue;
        final p = view.project(cx, cy);
        if (p.x < -margin || p.y < -margin || p.x > right || p.y > bottom) {
          continue;
        }
        final dx = cx - cam.x, dy = cy - cam.y;
        _keys[k] = -(dx * dx + dy * dy);
        _order[k] = t << 20 | b;
        k++;
      }
    }
    if (k == 0) return;
    final order = List<int>.generate(k, (i) => i)
      ..sort((a, b) => _keys[a].compareTo(_keys[b]));
    final perMetre =
        view.worldSize /
        (40075016.686 * math.cos(latitudeAt(view.centerY) * math.pi / 180));
    _vertices = 0;
    for (final o in order) {
      final packed = _order[o];
      final (d, e) = _found[packed >> 20];
      _building(view, d, e, packed & 0xFFFFF, origin, cam, perMetre, opacity);
    }
    if (_vertices == 0) return;
    canvas.drawVertices(
      ui.Vertices.raw(
        ui.VertexMode.triangles,
        Float32List.sublistView(_positions, 0, _vertices * 2),
        colors: Int32List.sublistView(_colors, 0, _vertices),
      ),
      ui.BlendMode.dst,
      ui.Paint(),
    );
  }

  void _reserve(int more) {
    if ((_vertices + more) * 2 <= _positions.length) return;
    final size = math.max(_positions.length * 2, (_vertices + more) * 4);
    _positions = Float32List(size)..setAll(0, _positions);
    _colors = Int32List(size ~/ 2)..setAll(0, _colors);
  }

  static int _shade(double r, double g, double b, double a, double light) =>
      ((a * 255).round() << 24) |
      ((r * light * 255).round().clamp(0, 255) << 16) |
      ((g * light * 255).round().clamp(0, 255) << 8) |
      (b * light * 255).round().clamp(0, 255);

  void _vertex(MapView view, double x, double y, double z, int color) {
    final p = view.project3(x, y, z);
    _positions[_vertices * 2] = p.x;
    _positions[_vertices * 2 + 1] = p.y;
    _colors[_vertices] = color;
    _vertices++;
  }

  void _building(
    MapView view,
    TileDraw d,
    BuiltExtrusion e,
    int b,
    ui.Offset origin,
    WorldPoint cam,
    double perMetre,
    double opacity,
  ) {
    final info = e.info;
    final i = b * BuiltExtrusion.stride;
    final top = info[i] * perMetre, bottom = info[i + 1] * perMetre;
    final scale = d.size / tileExtent;
    final ox = origin.dx + d.left, oy = origin.dy + d.top;
    final w = e.walls;
    final firstWall = info[i + 4].toInt(), walls = info[i + 5].toInt();
    for (var j = firstWall; j < firstWall + walls; j++) {
      final x = ox + w[j * 4] * scale, y = oy + w[j * 4 + 1] * scale;
      if (view.depth3(x, y, top) < 0.05) return;
    }
    final r = info[i + 8], g = info[i + 9], bl = info[i + 10];
    final a = info[i + 11] * opacity;
    final firstRoof = info[i + 6].toInt(), roofs = info[i + 7].toInt();
    _reserve(walls * 6 + roofs);
    for (var j = firstWall; j < firstWall + walls; j++) {
      final x0 = ox + w[j * 4] * scale, y0 = oy + w[j * 4 + 1] * scale;
      final x1 = ox + w[j * 4 + 2] * scale, y1 = oy + w[j * 4 + 3] * scale;
      final nx = y1 - y0, ny = x0 - x1;
      final mx = (x0 + x1) / 2 - cam.x, my = (y0 + y1) / 2 - cam.y;
      if (nx * mx + ny * my >= 0) continue;
      final len = math.sqrt(nx * nx + ny * ny);
      if (len == 0) continue;
      final facing = (nx * lightX + ny * lightY) / len;
      final light = 0.72 + 0.2 * facing;
      final high = _shade(r, g, bl, a, light);
      final low = _shade(r, g, bl, a, light * 0.82);
      _vertex(view, x0, y0, bottom, low);
      _vertex(view, x1, y1, bottom, low);
      _vertex(view, x1, y1, top, high);
      _vertex(view, x0, y0, bottom, low);
      _vertex(view, x1, y1, top, high);
      _vertex(view, x0, y0, top, high);
    }
    final roofColor = _shade(r, g, bl, a, 1);
    final rp = e.roof, ri = e.roofIndices;
    for (var j = firstRoof; j < firstRoof + roofs; j++) {
      final v = ri[j].toInt();
      _vertex(
        view,
        ox + rp[v * 2] * scale,
        oy + rp[v * 2 + 1] * scale,
        top,
        roofColor,
      );
    }
  }
}
