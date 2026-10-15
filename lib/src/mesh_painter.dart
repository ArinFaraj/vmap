import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'camera.dart';
import 'expr.dart';
import 'heat.dart';
import 'shaders.dart';
import 'sprites.dart';
import 'stats.dart';
import 'style_model.dart';
import 'tile_builder.dart' show tileExtent;
import 'tiles.dart';

/// What one frame may still spend on the UI thread preparing tiles and
/// widening lines before the rest waits for the next frame.
class FrameBudget {
  static const int micros = 1500;

  int spent = 0;

  /// Something was left for a later frame, which should follow soon.
  bool stale = false;

  /// The zoom is changing, so lines may be drawn further off their width
  /// before they are widened again.
  bool zooming = false;

  bool get spentUp => spent >= micros;

  void start({required bool zooming}) {
    spent = 0;
    stale = false;
    this.zooming = zooming;
  }
}

/// Draws the style's fill, line, circle and heatmap layers tile by tile.
class MeshPainter {
  MeshPainter(this._budget, this._stats, this._context);

  final FrameBudget _budget;
  final VmapStats _stats;
  final EvalContext _context;
  final Stopwatch _clock = Stopwatch()..start();
  final ui.Paint _paint = ui.Paint()..isAntiAlias = true;
  final ui.Paint _pointPaint = ui.Paint()
    ..isAntiAlias = true
    ..strokeCap = ui.StrokeCap.round;
  final LayerShaders _shaders = LayerShaders();
  final HeatPainter _heat = HeatPainter();

  /// The style's icons and patterns. Null until they have loaded.
  SpriteSheet? sprites;
  double _rotation = 0;

  /// Each paint layer's colour and width this frame, or a colour of black
  /// for a layer worked out per mesh.
  Int32List _colors = Int32List(0);
  Float64List _widths = Float64List(0);

  Float64List get widths => _widths;

  void resize(int layers) {
    _colors = Int32List(layers);
    _widths = Float64List(layers);
  }

  /// Fills the screen with the style's background, and returns its colour.
  /// Fills the map with [layer]: the screen, or under the transform of a
  /// tilted [camera] the ground it shows.
  void drawBackground(
    ui.Canvas canvas,
    BackgroundLayer layer,
    VmapCamera camera,
  ) {
    if (_context.zoom < layer.minZoom || _context.zoom >= layer.maxZoom) return;
    final pattern = layer.pattern?.call(_context);
    final ui.Paint paint;
    if (pattern is String) {
      final shader = _shaders.backdrop(
        pattern,
        sprites,
        camera.origin,
        _context.zoom,
      );
      if (shader == null) return;
      final opacity = asNumber(layer.opacity(_context)) ?? 1;
      paint = _paint
        ..color = ui.Color.fromRGBO(255, 255, 255, opacity.clamp(0, 1))
        ..shader = shader;
    } else {
      final color = layer.colorAt(_context);
      if (color == null || color.a <= 0) return;
      paint = _paint..color = ui.Color(color.toArgb());
    }
    if (camera.view case final view?) {
      final ground = view.ground();
      final path = ui.Path()
        ..addPolygon([
          for (final p in ground)
            ui.Offset(p.x - camera.origin.dx, p.y - camera.origin.dy),
        ], true);
      canvas.drawPath(path, paint);
    } else {
      canvas.drawRect(ui.Offset.zero & camera.size, paint);
    }
    _paint.shader = null;
  }

  /// Works out each layer's colour and width at [styleZoom].
  void startFrame(
    StyleSheet sheet,
    double styleZoom,
    double rotation, {
    bool standing = false,
  }) {
    _rotation = rotation;
    for (var i = 0; i < sheet.layers.length; i++) {
      final layer = sheet.layers[i];
      _colors[i] = 0;
      _widths[i] = 0;
      if (styleZoom < layer.minZoom || styleZoom >= layer.maxZoom) continue;
      if (standing && layer is FillLayer && layer.extruded) continue;
      if (layer.perFeature) {
        _colors[i] = 0xFF000000;
        continue;
      }
      final color = Rgba.of(layer.color(_context));
      if (color == null) continue;
      _colors[i] = color.toArgb(asNumber(layer.opacity(_context)) ?? 1);
      if (layer case StrokedLayer(:final width)) {
        _widths[i] = asNumber(width(_context)) ?? 0;
      }
    }
    _shaders.startFrame();
  }

  /// Draws [run] of the style over [tiles], and returns the draw calls it
  /// took. A heatmap's glows add up off screen and are coloured at the end.
  int drawRun(
    ui.Canvas canvas,
    StyleSheet sheet,
    StyleRun run,
    Iterable<TileDraw> tiles,
    Map<Object, Map<String, Object?>>? states,
    ui.Size size,
  ) {
    final heat = switch (sheet.layers[run.first]) {
      HeatmapLayer(:final heat) => heat,
      _ => null,
    };
    final shown = _colors[run.first] >>> 24;
    if (heat != null && (shown == 0 || _widths[run.first] <= 0)) return 0;
    final onto = heat == null ? canvas : _heat.begin();
    var draws = 0;
    for (final d in tiles) {
      draws += _drawTile(onto, sheet, d, run.first, run.end, states);
    }
    if (heat != null) _heat.end(canvas, size, _context, heat, shown / 255);
    return draws;
  }

  int _drawTile(
    ui.Canvas canvas,
    StyleSheet sheet,
    TileDraw d,
    int first,
    int end,
    Map<Object, Map<String, Object?>>? states,
  ) {
    final scale = d.size / tileExtent;
    void enter({bool clip = true}) {
      canvas.save();
      final clips = d.clips;
      if (!clip) {
      } else if (clips == null) {
        canvas.clipRect(
          ui.Rect.fromLTWH(d.left, d.top, d.size, d.size),
          doAntiAlias: false,
        );
      } else if (clips.length == 1) {
        canvas.clipRect(clips.first, doAntiAlias: false);
      } else {
        final path = ui.Path();
        for (final r in clips) {
          path.addRect(r);
        }
        canvas.clipPath(path, doAntiAlias: false);
      }
      canvas
        ..translate(d.left, d.top)
        ..scale(scale);
    }

    final layers = sheet.layers;
    // A tile standing in for part of another keeps its clip, or its circles
    // would show beside those of the tiles around it.
    enter(
      clip:
          !layers[first].spills ||
          (d.clips != null && layers[first] is! HeatmapLayer),
    );
    final groups = d.tile.groups;
    var draws = 0;
    for (var p = first; p < end; p++) {
      if (_colors[p] >>> 24 == 0) continue;
      final meshes = groups[layers[p].bucket];
      if (meshes == null) continue;
      var color = _colors[p];
      var width = _widths[p];
      final MeshLayer layer;
      switch (layers[p]) {
        case HeatmapLayer(:final heat):
          _heat.add(canvas, _context, heat, meshes, width / scale);
          draws++;
          continue;
        case final MeshLayer mesh:
          layer = mesh;
      }
      final patterned = switch (layer) {
        PatternedLayer(pattern: _?) => true,
        _ => false,
      };
      ui.ImageShader? shader;
      if (!layer.perFeature) {
        shader = _shaders.of(layer, width, scale, _context, sprites, color);
        if (shader == null && patterned) continue;
      }
      final moved = layer.translate?.call(_context);
      final shifted = moved is List && moved.length == 2;
      if (shifted) {
        var mx = (asNumber(moved[0]) ?? 0) / scale;
        var my = (asNumber(moved[1]) ?? 0) / scale;
        final turn = layer.translateOnScreen ? -_rotation : 0.0;
        if (turn != 0) {
          final cos = math.cos(turn), sin = math.sin(turn);
          (mx, my) = (mx * cos - my * sin, mx * sin + my * cos);
        }
        canvas
          ..save()
          ..translate(mx, my);
      }
      for (final m in meshes) {
        if (layer.perFeature) {
          _context
            ..props = m.props ?? const {}
            ..state = states?[m.props?[r'$id']] ?? const {};
          final own = Rgba.of(layer.color(_context));
          if (own == null) continue;
          color = own.toArgb(asNumber(layer.opacity(_context)) ?? 1);
          if (color >>> 24 == 0) continue;
          if (layer case StrokedLayer(width: final own)) {
            width = asNumber(own(_context)) ?? 0;
          }
          shader = _shaders.of(layer, width, scale, _context, sprites, color);
          if (shader == null && patterned) continue;
        }
        switch (layer) {
          case FillLayer():
            _paint
              ..color = ui.Color(color)
              ..shader = shader;
            canvas.drawVertices(m.fill!, ui.BlendMode.srcOver, _paint);
          case LineLayer():
            if (width <= 0) continue;
            if (shader == null) {
              _paint.color = ui.Color(color);
            } else if (patterned) {
              _paint
                ..color = ui.Color(color)
                ..shader = shader;
            } else {
              _paint
                ..color = ui.Color(color | 0xFFFFFF)
                ..shader = shader;
            }
            canvas.drawVertices(
              _stroke(
                m,
                p,
                width / 2 / scale,
                (asNumber(layer.offset?.call(_context)) ?? 0) / scale,
              ),
              ui.BlendMode.srcOver,
              _paint,
            );
          case CircleLayer(:final ring):
            if (width <= 0) continue;
            final ringWidth = ring == null
                ? 0.0
                : asNumber(ring.width(_context)) ?? 0;
            if (ring != null && ringWidth > 0) {
              final ringColor = Rgba.of(ring.color(_context));
              if (ringColor != null) {
                _pointPaint
                  ..color = ui.Color(
                    ringColor.toArgb(asNumber(ring.opacity(_context)) ?? 1),
                  )
                  ..strokeWidth = (width + ringWidth * 2) / scale;
                canvas.drawRawPoints(
                  ui.PointMode.points,
                  m.points!,
                  _pointPaint,
                );
              }
            }
            _pointPaint
              ..color = ui.Color(color)
              ..strokeWidth = width / scale;
            canvas.drawRawPoints(ui.PointMode.points, m.points!, _pointPaint);
        }
        draws++;
        if (shader != null) {
          _paint
            ..shader = null
            ..colorFilter = null;
        }
      }
      if (layer.perFeature) {
        _context
          ..props = const {}
          ..state = const {};
      }
      if (shifted) canvas.restore();
    }
    canvas.restore();
    return draws;
  }

  /// The mesh widened for [pass]. A width a few percent off is kept when the
  /// frame's budget is spent, and corrected on a later frame.
  ui.Vertices _stroke(
    TileMesh mesh,
    int pass,
    double halfWidth,
    double offset,
  ) {
    final current = mesh.existing(pass);
    if (current != null) {
      final ratio = halfWidth / current.halfWidth;
      final moved = (offset - current.offset).abs() / halfWidth;
      if (ratio > 0.96 && ratio < 1.04 && moved < 0.08) return current.vertices;
      final slack = _budget.zooming ? 0.22 : 0;
      if ((ratio > 1 - slack && ratio < 1 + slack && moved < slack * 2) ||
          _budget.spentUp) {
        _budget.stale = true;
        return current.vertices;
      }
    }
    final started = _clock.elapsedMicroseconds;
    final vertices = mesh.build(pass, halfWidth, offset);
    final spent = _clock.elapsedMicroseconds - started;
    _budget.spent += spent;
    _stats.timings.stroke(spent);
    return vertices;
  }

  void dispose() {
    _shaders.dispose();
    _heat.dispose();
  }
}
