import 'dart:math' as math;
import 'dart:ui' as ui;

import 'globe.dart';
import 'style_model.dart';

/// The air around the globe, drawn over it and the space beside it as
/// MapLibre's `drawAtmosphere` does.
class Atmosphere {
  static ui.FragmentProgram? _program;
  static Future<void>? _loading;
  ui.FragmentShader? _shader;
  final ui.Paint _paint = ui.Paint();

  /// Draws the atmosphere of [globe], seen on a screen of [size], over
  /// [area], [blend] of it, lit by [light]. False while its shader is still
  /// loading.
  bool paint(
    ui.Canvas canvas,
    ui.Size size,
    ui.Rect area,
    Globe globe,
    double blend,
    ExtrusionLight light,
  ) {
    final program = _program;
    if (program == null) {
      _loading ??= ui.FragmentProgram.fromAsset(
        'packages/vmap/shaders/atmosphere.frag',
      ).then((p) => _program = p);
      return false;
    }
    final (cx, cy, cz) = globe.viewCentre;
    final radius = globe.radius;
    final altitude = math.sqrt(cx * cx + cy * cy + cz * cz) - radius;
    final amount = blend * globe.transition * _altitudeBlend(altitude, radius);
    if (amount <= 0) return true;
    final (sx, sy, sz) = globe.sunAt(light.position, viewport: light.viewport);
    final shader = _shader ??= program.fragmentShader();
    var i = 0;
    void set(double v) => shader.setFloat(i++, v);
    set(size.width);
    set(size.height);
    globe.viewRays.forEach(set);
    set(sx);
    set(sy);
    set(sz);
    set(cx);
    set(cy);
    set(cz);
    set(radius);
    set(amount.clamp(0, 1).toDouble());
    canvas.drawRect(area, _paint..shader = shader);
    return true;
  }

  /// MapLibre's `getAtmosphereAltitudeBlend`: none inside the air, all of
  /// it from ten times its height.
  static double _altitudeBlend(double altitude, double radius) {
    final height = radius * 100000 / 6371000;
    final x = ((altitude - height) / (9 * height)).clamp(0, 1).toDouble();
    return x * x * (3 - 2 * x);
  }
}
