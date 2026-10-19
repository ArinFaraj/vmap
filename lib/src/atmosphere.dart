import 'dart:math' as math;
import 'dart:ui' as ui;

import 'color.dart';
import 'globe.dart';
import 'style_model.dart';

/// The globe's sky and the air around it, drawn as MapLibre's `drawSky`
/// and `drawAtmosphere` draw them.
class Atmosphere {
  static final _Program _atmosphere = _Program('atmosphere');
  static final _Program _sky = _Program('sky');
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
    final (cx, cy, cz) = globe.viewCentre;
    final amount = blend * globe.transition * _altitudeBlend(globe);
    if (amount <= 0) return true;
    final shader = _atmosphere.shader;
    if (shader == null) return false;
    final (sx, sy, sz) = globe.sunAt(light.position, viewport: light.viewport);
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
    set(globe.radius);
    set(amount.clamp(0, 1).toDouble());
    canvas.drawRect(area, _paint..shader = shader);
    return true;
  }

  /// Fills [area] with the sky of a screen of [size] looking at [globe]:
  /// [top] above, turning to [low] over [band] logical pixels above the
  /// flat map's horizon at [horizonY] or the globe's rim, faded where
  /// [atmosphereBlend] of the air is drawn. False while its shader is still
  /// loading.
  bool sky(
    ui.Canvas canvas,
    ui.Size size,
    ui.Rect area,
    Globe globe, {
    required Rgba top,
    required Rgba low,
    required double band,
    required double horizonY,
    required double atmosphereBlend,
  }) {
    final shader = _sky.shader;
    if (shader == null) return false;
    final (cx, cy, cz) = globe.viewCentre;
    var i = 0;
    void set(double v) => shader.setFloat(i++, v);
    void colour(Rgba c) {
      set(c.r * c.a);
      set(c.g * c.a);
      set(c.b * c.a);
      set(c.a);
    }

    set(size.width);
    set(size.height);
    globe.viewRays.forEach(set);
    colour(top);
    colour(low);
    set(horizonY);
    set(band);
    set(globe.transition);
    set(cx);
    set(cy);
    set(cz);
    set(globe.radius);
    set(atmosphereBlend * _altitudeBlend(globe));
    set(globe.view.cameraToCenterDistance);
    canvas.drawRect(area, _paint..shader = shader);
    return true;
  }

  /// MapLibre's `getAtmosphereAltitudeBlend`: none inside the air, all of
  /// it from ten times its height.
  static double _altitudeBlend(Globe globe) {
    final (cx, cy, cz) = globe.viewCentre;
    final altitude = math.sqrt(cx * cx + cy * cy + cz * cz) - globe.radius;
    final height = globe.radius * 100000 / 6371000;
    final x = ((altitude - height) / (9 * height)).clamp(0, 1).toDouble();
    return x * x * (3 - 2 * x);
  }
}

class _Program {
  _Program(this.name);

  final String name;
  Future<void>? _loading;
  ui.FragmentShader? _shader;

  /// Null until the shader has loaded, which asking starts.
  ui.FragmentShader? get shader {
    _loading ??= ui.FragmentProgram.fromAsset(
      'packages/vmap/shaders/$name.frag',
    ).then((p) => _shader = p.fragmentShader());
    return _shader;
  }
}
