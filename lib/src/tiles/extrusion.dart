import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:dart_earcut/dart_earcut.dart';

import 'building_index.dart';
import '../style/expr.dart';
import '../camera/mercator.dart';
import '../platform.dart';
import 'round_corners.dart';
import '../style/style_model.dart';
import '../camera/subdivide.dart';
import 'tile_builder.dart' show tileExtent;
import 'tiles.dart' show TileDraw;
import '../camera/view.dart';
import 'typed_buffer.dart';

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
    this.indices,
    this.index, [
    this.patterns = const [],
  ]);

  /// The buildings by where they stand, for what hides labels.
  final BuildingIndex index;

  /// Every wall and roof ready for the GPU, [floatsPerVertex]
  /// floats a vertex: x and y in tile units, height in metres, the colour
  /// as red plus 256 green plus 65536 blue, from 0 to 255 each, alpha from
  /// 0 to 255, the wall's outward normal and its gradient, where its
  /// pattern is, in tile units, and which pattern, then the middle of its
  /// polygon, in tile units, which raised ground lifts it from. Every one
  /// exact, so
  /// OpenGL ES 2 shaders, which have no integers, unpack them.
  final Float32List vertices;

  /// The triangles of [vertices], three indices each: a wall is two
  /// triangles over its four corners, a roof shares its points. Empty, as
  /// [vertices] is, for a renderer that draws buildings from [walls].
  final Uint32List indices;

  static const floatsPerVertex = 13;

  /// The sprite images the buildings are covered in; a vertex's last float
  /// is one more than the index of its building's, zero for none.
  final List<String> patterns;

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
    pack(vertices),
    pack(
      Float32List.view(indices.buffer, indices.offsetInBytes, indices.length),
    ),
    pack(index.bounds),
    pack(index.cellStart),
    pack(index.cellItems),
    pack(index.cellTallest),
    patterns,
  ];

  static BuiltExtrusion fromMessage(List<Object?> m) {
    final words = unpackFloats(m[6]!);
    return BuiltExtrusion(
      m[0]! as int,
      unpackFloats(m[1]!),
      unpackFloats(m[2]!),
      unpackFloats(m[3]!),
      unpackFloats(m[4]!),
      unpackFloats(m[5]!),
      words.buffer.asUint32List(words.offsetInBytes, words.length),
      BuildingIndex(
        unpackFloats(m[7]!),
        unpackFloats(m[8]!),
        unpackFloats(m[9]!),
        unpackFloats(m[10]!),
      ),
      (m[11]! as List).cast<String>(),
    );
  }
}

/// Collects buildings for one bucket while a tile is built.
class ExtrusionBuilder {
  ExtrusionBuilder(
    this.bucket, {
    this.light = const ExtrusionLight(),
    this.gradient = true,
    this.patternPerMetre = 0,
  });

  final int bucket;

  /// What the walls and roofs are shaded by, and whether walls darken
  /// towards their feet.
  final ExtrusionLight light;
  final bool gradient;

  /// How far up a wall a metre moves its pattern, in tile units, as
  /// MapLibre's `u_height_factor`: negative, so the pattern runs up.
  final double patternPerMetre;
  final _walls = DoubleBuffer();
  final _roof = DoubleBuffer();
  final _indices = DoubleBuffer();
  final _info = DoubleBuffer();
  final _ring = DoubleBuffer();
  final _normals = DoubleBuffer();
  final _edges = DoubleBuffer();

  /// The middle of the polygon each wall, and each roof corner, belongs
  /// to, as MapLibre's `a_centroid`: the mean of its rings' corners in
  /// whole tile units, where raised ground lifts the building from.
  final _wallMiddles = DoubleBuffer();
  final _roofMiddles = DoubleBuffer();
  final List<int> _patternOf = [];
  final List<String> _patterns = [];

  /// Adds one feature: rings of x, y pairs in tile units between the point
  /// indices of [starts] and [ends], its corners rounded [rounding] tile
  /// units, its walls and roof covered in the sprite [pattern] when given.
  void add(
    Float64List coords,
    List<int> starts,
    List<int> ends,
    double height,
    double base,
    Rgba color, {
    double rounding = 0,
    String? pattern,
  }) {
    // As MapLibre, a building no taller than its base still has its roof.
    if (height < base) return;
    var polygonStart = -1;
    final ring = _ring..clear();
    final holes = <int>[];
    final wallsFrom = _walls.length ~/ 4;
    final roofFrom = _indices.length;
    var sx = 0.0, sy = 0.0, area = 0.0;
    var middleX = 0.0, middleY = 0.0, corners = 0;
    var polygonWalls = _walls.length ~/ 4;

    void roof() {
      if (corners > 0) {
        final mx = (middleX / corners).floorToDouble();
        final my = (middleY / corners).floorToDouble();
        for (var w = polygonWalls; w < _walls.length ~/ 4; w++) {
          _wallMiddles.add2(mx, my);
        }
        if (polygonStart >= 0 && ring.length >= 6) {
          for (var v = 0; v < ring.length ~/ 2; v++) {
            _roofMiddles.add2(mx, my);
          }
        }
      }
      middleX = middleY = 0;
      corners = 0;
      polygonWalls = _walls.length ~/ 4;
      if (polygonStart < 0 || ring.length < 6) {
        ring.clear();
        holes.clear();
        polygonStart = -1;
        return;
      }
      final flat = ring.toFloat64List();
      final tris = Earcut.triangulateRaw(flat, holeIndices: holes);
      final at = _roof.length ~/ 2;
      _roof.addBuffer(ring);
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
      var pts = Float64List.sublistView(coords, start * 2, (start + count) * 2);
      if (rounding > 0) {
        pts = roundRing(pts, rounding);
        count = pts.length ~/ 2;
      }
      var a = 0.0;
      for (var i = 0; i < count; i++) {
        final j = (i + 1) % count;
        a += pts[i * 2] * pts[j * 2 + 1] - pts[j * 2] * pts[i * 2 + 1];
      }
      if (a.abs() < 1) continue;
      final outer = a > 0;
      if (outer) {
        roof();
        polygonStart = 0;
        area += a;
        for (var i = 0; i < count; i++) {
          sx += pts[i * 2] * a / count;
          sy += pts[i * 2 + 1] * a / count;
        }
      } else if (polygonStart >= 0) {
        holes.add(ring.length ~/ 2);
      } else {
        continue;
      }
      for (var i = 0; i < count; i++) {
        middleX += pts[i * 2];
        middleY += pts[i * 2 + 1];
      }
      corners += count;
      final perps = Float64List(count * 2);
      for (var i = 0; i < count; i++) {
        final x = pts[i * 2], y = pts[i * 2 + 1];
        ring.add2(x, y);
        final j = (i + 1) % count;
        final x1 = pts[j * 2], y1 = pts[j * 2 + 1];
        if (isBoundaryEdge(x, y, x1, y1)) continue;
        perps[i * 2] = y1 - y;
        perps[i * 2 + 1] = x - x1;
      }
      final normals = rounding > 0 ? smoothNormals(perps) : null;
      // As MapLibre's side faces: how far along the ring each wall's ends
      // are, which a pattern wraps around the walls by, counted from the
      // end of a wall back to its start and started over past 16384.
      var along = 0.0;
      for (var i = 0; i < count; i++) {
        final nx = perps[i * 2], ny = perps[i * 2 + 1];
        if (nx == 0 && ny == 0) continue;
        final j = (i + 1) % count;
        _walls.add4(pts[i * 2], pts[i * 2 + 1], pts[j * 2], pts[j * 2 + 1]);
        final length = math.sqrt(nx * nx + ny * ny);
        if (along + length > 16384) along = 0;
        final end = (along * 2).roundToDouble() / 2;
        along += length;
        _edges.add2((along * 2).roundToDouble() / 2, end);
        if (normals != null) {
          _normals.add4(
            normals[i * 4],
            normals[i * 4 + 1],
            normals[i * 4 + 2],
            normals[i * 4 + 3],
          );
        } else {
          final l = math.sqrt(nx * nx + ny * ny);
          _normals.add4(nx / l, ny / l, nx / l, ny / l);
        }
      }
    }
    roof();
    final walls = _walls.length ~/ 4 - wallsFrom;
    if (walls == 0 || area == 0) return;
    var patternIndex = -1;
    if (pattern != null) {
      patternIndex = _patterns.indexOf(pattern);
      if (patternIndex < 0) {
        patternIndex = _patterns.length;
        _patterns.add(pattern);
      }
    }
    _patternOf.add(patternIndex);
    _info
      ..add4(height, base, sx / area, sy / area)
      ..add4(
        wallsFrom.toDouble(),
        walls.toDouble(),
        roofFrom.toDouble(),
        (_indices.length - roofFrom).toDouble(),
      )
      // As MapLibre, the colour's alpha darkens it and is dropped:
      // fill-extrusion-opacity alone sees through buildings.
      ..add4(color.r * color.a, color.g * color.a, color.b * color.a, 1);
  }

  /// With [cells], the triangles are cut along a grid that many cells
  /// across the tile, as MapLibre subdivides buildings for the globe.
  static (Float32List, Uint32List) _subdivided(
    Float32List vertices,
    Uint32List indices,
    int cells,
  ) {
    final cut = Subdivider(BuiltExtrusion.floatsPerVertex, tileExtent / cells);
    for (var t = 0; t + 2 < indices.length; t += 3) {
      cut.add(vertices, indices[t], indices[t + 1], indices[t + 2]);
    }
    return (
      Float32List.fromList(cut.vertices),
      Uint32List.fromList(cut.indices),
    );
  }

  /// The buildings collected. Without [vertices] they carry no vertices
  /// for the GPU, for a renderer that draws them from their walls.
  BuiltExtrusion? finish({int cells = 0, bool vertices = true}) {
    if (_info.isEmpty) return null;
    final walls = _walls.toFloat32List(), info = _info.toFloat32List();
    if (!vertices) {
      return BuiltExtrusion(
        bucket,
        walls,
        _roof.toFloat32List(),
        _indices.toFloat32List(),
        info,
        Float32List(0),
        Uint32List(0),
        BuildingIndex.of(walls, info),
        List.of(_patterns),
      );
    }
    var most = 0, triangles = 0;
    for (var i = 0; i < _info.length; i += BuiltExtrusion.stride) {
      most += _info[i + 5].toInt() * 4 + _info[i + 7].toInt();
      triangles += _info[i + 5].toInt() * 6 + _info[i + 7].toInt();
    }
    final out = Float32List(most * BuiltExtrusion.floatsPerVertex);
    final order = Uint32List(triangles);
    final roofVertex = Int32List(_roof.length ~/ 2)
      ..fillRange(0, _roof.length ~/ 2, -1);
    var o = 0, n = 0;
    for (var i = 0; i < _info.length; i += BuiltExtrusion.stride) {
      final top = _info[i], bottom = _info[i + 1];
      final r = _info[i + 8], g = _info[i + 9], b = _info[i + 10];
      final a = (_info[i + 11] * 255).roundToDouble().clamp(0.0, 255.0);
      final rgb =
          ((r * 255).round() +
                  (g * 255).round() * 256 +
                  (b * 255).round() * 65536)
              .toDouble();
      // A vertex: where it is, its colour unlit, the outward normal of its
      // wall (none on a roof) and how much the wall's gradient darkens it,
      // for the renderer to light it as the map turns.
      final patternIndex = _patternOf[i ~/ BuiltExtrusion.stride] + 1.0;
      void vertex(
        double x,
        double y,
        double z,
        double nx,
        double ny,
        double t,
        double u,
        double v,
        double mx,
        double my,
      ) {
        out[o++] = x;
        out[o++] = y;
        out[o++] = z;
        out[o++] = rgb;
        out[o++] = a;
        out[o++] = nx;
        out[o++] = ny;
        out[o++] = nx == 0 && ny == 0
            ? 1
            : light.gradient(t: t, base: bottom, height: top, on: gradient);
        out[o++] = u;
        out[o++] = v;
        out[o++] = patternIndex;
        out[o++] = mx;
        out[o++] = my;
      }

      final firstWall = _info[i + 4].toInt(), walls = _info[i + 5].toInt();
      for (var j = firstWall; j < firstWall + walls; j++) {
        final x0 = _walls[j * 4], y0 = _walls[j * 4 + 1];
        final x1 = _walls[j * 4 + 2], y1 = _walls[j * 4 + 3];
        if (x0 == x1 && y0 == y1) continue;
        final nx0 = _normals[j * 4], ny0 = _normals[j * 4 + 1];
        final nx1 = _normals[j * 4 + 2], ny1 = _normals[j * 4 + 3];
        final e0 = _edges[j * 2], e1 = _edges[j * 2 + 1];
        final v0 = bottom * patternPerMetre, v1 = top * patternPerMetre;
        final mx = _wallMiddles[j * 2], my = _wallMiddles[j * 2 + 1];
        final first = o ~/ BuiltExtrusion.floatsPerVertex;
        vertex(x0, y0, bottom, nx0, ny0, 0, e0, v0, mx, my);
        vertex(x1, y1, bottom, nx1, ny1, 0, e1, v0, mx, my);
        vertex(x1, y1, top, nx1, ny1, 1, e1, v1, mx, my);
        vertex(x0, y0, top, nx0, ny0, 1, e0, v1, mx, my);
        order
          ..[n++] = first
          ..[n++] = first + 1
          ..[n++] = first + 2
          ..[n++] = first
          ..[n++] = first + 2
          ..[n++] = first + 3;
      }
      final firstRoof = _info[i + 6].toInt(), roofs = _info[i + 7].toInt();
      for (var j = firstRoof; j < firstRoof + roofs; j++) {
        final v = _indices[j].toInt();
        if (roofVertex[v] < 0) {
          roofVertex[v] = o ~/ BuiltExtrusion.floatsPerVertex;
          final x = _roof[v * 2], y = _roof[v * 2 + 1];
          vertex(
            x,
            y,
            top,
            0,
            0,
            1,
            x,
            y,
            _roofMiddles[v * 2],
            _roofMiddles[v * 2 + 1],
          );
        }
        order[n++] = roofVertex[v];
      }
    }
    var (built, builtOrder) = (out.sublist(0, o), order.sublist(0, n));
    if (cells > 0) (built, builtOrder) = _subdivided(built, builtOrder, cells);
    return BuiltExtrusion(
      bucket,
      walls,
      _roof.toFloat32List(),
      _indices.toFloat32List(),
      info,
      built,
      builtOrder,
      BuildingIndex.of(walls, info),
      List.of(_patterns),
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
      final (mx, my) = layer.moved(context, view.bearing);
      _draw(
        canvas,
        view,
        origin.translate(mx, my),
        n,
        opacity,
        sheet.light,
        sheet.buckets[layer.bucket].extrude?.verticalGradient ?? true,
      );
    }
    return false;
  }

  void _draw(
    ui.Canvas canvas,
    MapView view,
    ui.Offset origin,
    int n,
    double opacity,
    ExtrusionLight light,
    bool gradient,
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
      _building(
        view,
        d,
        e,
        packed & 0xFFFFF,
        origin,
        cam,
        perMetre,
        opacity,
        light,
        gradient,
      );
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
    ExtrusionLight light,
    bool gradient,
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
    final alpha = (info[i + 11] * opacity * 255).round() << 24;
    final firstRoof = info[i + 6].toInt(), roofs = info[i + 7].toInt();
    _reserve(walls * 6 + roofs);
    for (var j = firstWall; j < firstWall + walls; j++) {
      final x0 = ox + w[j * 4] * scale, y0 = oy + w[j * 4 + 1] * scale;
      final x1 = ox + w[j * 4 + 2] * scale, y1 = oy + w[j * 4 + 3] * scale;
      final nx = y1 - y0, ny = x0 - x1;
      final mx = (x0 + x1) / 2 - cam.x, my = (y0 + y1) / 2 - cam.y;
      if (nx * mx + ny * my >= 0) continue;
      if (nx == 0 && ny == 0) continue;
      int lit(double t) =>
          alpha |
          light.shade(
            r,
            g,
            bl,
            nx,
            ny,
            0,
            t: t,
            base: info[i + 1],
            height: info[i],
            gradient: gradient,
            bearing: view.bearing,
          );
      final high = lit(1), low = lit(0);
      _vertex(view, x0, y0, bottom, low);
      _vertex(view, x1, y1, bottom, low);
      _vertex(view, x1, y1, top, high);
      _vertex(view, x0, y0, bottom, low);
      _vertex(view, x1, y1, top, high);
      _vertex(view, x0, y0, top, high);
    }
    final roofColor =
        alpha | light.shade(r, g, bl, 0, 0, 1, bearing: view.bearing);
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
