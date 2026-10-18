import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'style_model.dart';
import 'tiles.dart';

/// Draws heatmap layers: every point adds a soft glow to a picture of how
/// crowded each place is, and that picture is then coloured through the
/// layer's ramp.
class HeatPainter {
  ui.Image? _glow;
  ui.PictureRecorder? _recorder;
  final ui.Paint _glowPaint = ui.Paint()..blendMode = ui.BlendMode.plus;
  final ui.Paint _bandPaint = ui.Paint()..filterQuality = ui.FilterQuality.low;

  /// The density picture is this much smaller than the screen, as MapLibre
  /// draws it a quarter of the screen's size; its blur shows in the result.
  static const double _coarse = 0.25;

  /// How far a glow reaches, in radii, and its height at the middle for a
  /// weight of one: the kernel MapLibre uses.
  static const double _reach = 1.3;
  static const double _peak = 0.3989422804014327;

  /// Starts a layer and returns the canvas its glows are drawn on, which
  /// takes the same coordinates as the screen.
  ui.Canvas begin() {
    final recorder = _recorder = ui.PictureRecorder();
    return ui.Canvas(recorder)..scale(_coarse);
  }

  /// Adds the points of [meshes] to the layer begun last.
  void add(
    ui.Canvas density,
    EvalContext context,
    HeatPaint heat,
    List<TileMesh> meshes,
    double diameter,
  ) {
    final glow = _glow ??= _glowImage();
    final intensity = asNumber(heat.intensity(context)) ?? 1;
    final size = diameter * _reach;
    final k = size / glow.width;
    for (final mesh in meshes) {
      final points = mesh.points;
      if (points == null || points.isEmpty) continue;
      context.props = mesh.props ?? const {};
      final strength = (asNumber(heat.weight(context)) ?? 1) * intensity;
      if (strength <= 0) continue;
      final n = points.length ~/ 2;
      final transforms = Float32List(n * 4);
      final rects = Float32List(n * 4);
      for (var i = 0; i < n; i++) {
        transforms[i * 4] = k;
        transforms[i * 4 + 2] = points[i * 2] - size / 2;
        transforms[i * 4 + 3] = points[i * 2 + 1] - size / 2;
        rects[i * 4 + 2] = glow.width.toDouble();
        rects[i * 4 + 3] = glow.height.toDouble();
      }
      _glowPaint.color = ui.Color.fromRGBO(
        255,
        255,
        255,
        (strength * _peak).clamp(0.0, 1.0),
      );
      density.drawRawAtlas(
        glow,
        transforms,
        rects,
        null,
        null,
        null,
        _glowPaint,
      );
    }
    context.props = const {};
  }

  /// Colours the layer begun last and draws it over [size].
  ///
  /// The ramp is laid on one stretch between two stops at a time: each
  /// stretch draws the density picture in the colour of its upper stop, as
  /// opaque as the density is far along the stretch, so the stretches on top
  /// of each other blend from stop to stop.
  void end(
    ui.Canvas canvas,
    ui.Size size,
    EvalContext context,
    HeatPaint heat,
    double opacity,
  ) {
    final picture = _recorder!.endRecording();
    _recorder = null;
    final width = (size.width * _coarse).ceil();
    final height = (size.height * _coarse).ceil();
    if (width <= 0 || height <= 0) {
      picture.dispose();
      return;
    }
    final image = picture.toImageSync(width, height);
    picture.dispose();
    final from = ui.Rect.fromLTWH(
      0,
      0,
      size.width * _coarse,
      size.height * _coarse,
    );
    final onto = ui.Offset.zero & size;
    final faded = opacity < 1;
    if (faded) {
      canvas.saveLayer(
        onto,
        ui.Paint()..color = ui.Color.fromRGBO(0, 0, 0, opacity),
      );
    }
    for (final band in heatBands(heat, context)) {
      _bandPaint.colorFilter = ui.ColorFilter.matrix(band);
      canvas.drawImageRect(image, from, onto, _bandPaint);
    }
    image.dispose();
    if (faded) canvas.restore();
  }

  static ui.Image _glowImage() {
    const size = 64.0;
    const steps = 16;
    final recorder = ui.PictureRecorder();
    ui.Canvas(recorder).drawCircle(
      const ui.Offset(size / 2, size / 2),
      size / 2,
      ui.Paint()
        ..shader = ui.Gradient.radial(
          const ui.Offset(size / 2, size / 2),
          size / 2,
          [
            for (var i = 0; i <= steps; i++)
              ui.Color.fromRGBO(
                255,
                255,
                255,
                i == steps
                    ? 0
                    : math.exp(-4.5 * math.pow(i / steps * _reach, 2)),
              ),
          ],
          [for (var i = 0; i <= steps; i++) i / steps],
        ),
    );
    final picture = recorder.endRecording();
    final image = picture.toImageSync(size.toInt(), size.toInt());
    picture.dispose();
    return image;
  }

  void dispose() => _glow?.dispose();
}

/// One colour matrix for each stretch of a heatmap's ramp, lowest first. A
/// matrix turns a density, held in the alpha of a pixel, into the colour of
/// the stretch's upper stop, clear below the stretch and whole above it.
List<List<double>> heatBands(HeatPaint heat, EvalContext context) {
  final bands = <List<double>>[];
  var under = 0.0;
  for (var i = 0; i + 1 < heat.stops.length; i++) {
    final low = heat.stops[i];
    final high = heat.stops[i + 1];
    if (high <= low) continue;
    context.progress = high;
    final c = Rgba.of(heat.ramp(context)) ?? Rgba.transparent;
    final share = bands.isEmpty || c.a >= 1 || under >= 1
        ? (bands.isEmpty ? c.a : 1.0)
        : ((c.a - under) / (1 - under)).clamp(0.0, 1.0);
    under = c.a;
    if (share <= 0) continue;
    final k = share / (high - low);
    bands.add([
      0, 0, 0, 0, c.r * 255, //
      0, 0, 0, 0, c.g * 255,
      0, 0, 0, 0, c.b * 255,
      0, 0, 0, k, -k * low * 255,
    ]);
  }
  return bands;
}
