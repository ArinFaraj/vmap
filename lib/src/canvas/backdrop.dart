import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../camera/camera.dart';
import '../platform.dart';
import '../style/expr.dart';
import '../style/sprites.dart';
import '../style/style_model.dart';
import '../render/pattern_growth.dart';

/// Draws what lies behind the map's layers, whichever renderer draws them:
/// the style's background and the sky above a tilted map's horizon.
class Backdrop {
  Backdrop(this._context);

  final EvalContext _context;
  final ui.Paint _paint = ui.Paint()..isAntiAlias = true;
  final Float64List _matrix = Float64List(16)
    ..[5] = 1
    ..[10] = 1
    ..[15] = 1;
  final List<ui.ImageShader> _patterns = [];

  /// Drops the pattern shaders made for the last frame: they are held to
  /// its camera.
  void startFrame() {
    for (final s in _patterns) {
      s.dispose();
    }
    _patterns.clear();
  }

  /// Fills the map with [layer]: the screen, or under the transform of a
  /// tilted [camera] the ground it shows, a pattern from [sprites].
  void drawBackground(
    ui.Canvas canvas,
    BackgroundLayer layer,
    MapFrame camera,
    SpriteSheet? sprites,
  ) {
    if (_context.zoom < layer.minZoom || _context.zoom >= layer.maxZoom) return;
    final pattern = layer.pattern?.call(_context);
    final ui.Paint paint;
    if (pattern is String) {
      final shader = _pattern(pattern, sprites, camera.origin, _context.zoom);
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
    final path = ui.Path()
      ..addPolygon([
        for (final p in camera.view.ground())
          ui.Offset(p.x - camera.origin.dx, p.y - camera.origin.dy),
      ], true);
    canvas.drawPath(path, paint);
    _paint.shader = null;
  }

  /// The sprite image [name] repeated over the whole view at style zoom
  /// [zoom], held to the world pixel at [origin] so it moves with the map.
  /// Null while the sprite sheet has not loaded or has no such image.
  ui.ImageShader? _pattern(
    String name,
    SpriteSheet? sprites,
    ui.Offset origin,
    double zoom,
  ) {
    final image = sprites?.pattern(name);
    if (image == null) return null;
    final stretch = patternGrowth(zoom) / sprites!.entries[name]!.pixelRatio;
    _matrix
      ..[0] = stretch
      ..[5] = stretch
      ..[12] = -(origin.dx % (image.width * stretch))
      ..[13] = -(origin.dy % (image.height * stretch));
    final shader = ui.ImageShader(
      forShader(image),
      ui.TileMode.repeated,
      ui.TileMode.repeated,
      _matrix,
      filterQuality: ui.FilterQuality.low,
    );
    _patterns.add(shader);
    return shader;
  }

  /// Fills [area], the screen above the horizon at [horizonY], by default
  /// its bottom, with [sky], as MapLibre's sky shader does: its sky colour,
  /// turning towards its horizon colour over the blend's share of half the
  /// screen's height above the horizon.
  void drawSky(
    ui.Canvas canvas,
    SkyPaint sky,
    ui.Size size,
    ui.Rect area, {
    double? horizonY,
  }) {
    horizonY ??= area.bottom;
    final top = Rgba.of(sky.skyColor(_context)) ?? Rgba.transparent;
    final low = Rgba.of(sky.horizonColor(_context)) ?? top;
    final band =
        (asNumber(sky.skyHorizonBlend(_context)) ?? 0).clamp(0.0, 1.0) *
        size.height /
        2;
    if (band <= 0) {
      canvas.drawRect(area, _paint..color = ui.Color(top.toArgb()));
      return;
    }
    const steps = 8;
    _paint.shader = ui.Gradient.linear(
      ui.Offset(0, horizonY - band),
      ui.Offset(0, horizonY),
      [
        for (var i = 0; i <= steps; i++)
          ui.Color(_mix(top, low, math.pow(i / steps, 2).toDouble()).toArgb()),
      ],
      [for (var i = 0; i <= steps; i++) i / steps],
    );
    canvas.drawRect(area, _paint);
    _paint.shader = null;
  }

  static Rgba _mix(Rgba a, Rgba b, double t) => Rgba(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
    a.a + (b.a - a.a) * t,
  );
}
