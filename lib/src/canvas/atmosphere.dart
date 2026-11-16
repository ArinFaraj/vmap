import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

import '../style/color.dart';
import '../camera/globe.dart';
import '../platform.dart';
import '../style/style_model.dart';

/// The globe's sky and the air around it, drawn as MapLibre's `drawSky`
/// and `drawAtmosphere` draw them.
class Atmosphere {
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
    final shader = _Programs.atmosphere;
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
    final shader = _Programs.sky;
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

/// The shader programs, loaded together when one is first asked for. None
/// is drawn with before all have compiled: the first draw with one compiles
/// on the raster thread too.
abstract final class _Programs {
  static ui.FragmentShader? _atmosphere, _sky;
  static bool _asked = false;

  /// Null until the programs have loaded, which asking starts.
  static ui.FragmentShader? get atmosphere {
    _ask();
    return _atmosphere;
  }

  static ui.FragmentShader? get sky {
    _ask();
    return _sky;
  }

  static void _ask() {
    if (_asked) return;
    _asked = true;
    unawaited(rasterizesOnOwnThread ? _loadHeldBack() : _load());
  }

  static Future<ui.FragmentProgram> _program(String name) =>
      ui.FragmentProgram.fromAsset('packages/vmap/shaders/$name.frag');

  static Future<void> _load() async {
    final atmosphere = await _program('atmosphere');
    final sky = await _program('sky');
    _atmosphere = atmosphere.fragmentShader();
    _sky = sky.fragmentShader();
  }

  /// A program compiled while Flutter's raster thread draws an app's first
  /// frames can fail or trap inside Skia's shader compiler: 1 page load in
  /// 8 on a busy machine, and none in 90 with the programs held back for
  /// [_wait] and a load that died tried again after [_again].
  static const _wait = Duration(milliseconds: 400);
  static const _again = Duration(seconds: 2);

  /// A compile that traps ends its callback there, with nothing to catch
  /// and no future that completes, so each load is given [_again] to land
  /// rather than waited on.
  static Future<void> _loadHeldBack() async {
    for (var tries = 3; tries > 0 && _sky == null; tries--) {
      await Future<void>.delayed(_wait);
      unawaited(_load());
      await Future<void>.delayed(_again);
    }
  }
}
