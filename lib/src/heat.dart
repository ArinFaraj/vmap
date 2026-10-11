import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'style.dart';
import 'tiles.dart';

/// Draws heatmap layers.
class HeatPainter {
  ui.Image? _glow;
  final ui.Paint _paint = ui.Paint();

  /// A heatmap's points as soft glows: wide ones in the colour of the ramp's
  /// low end that add up, then tighter ones in the colour of its top that
  /// build up where points crowd. The stops between are not followed.
  void draw(
    ui.Canvas canvas,
    EvalContext context,
    HeatPaint heat,
    List<TileMesh> meshes,
    int color,
    double diameter,
  ) {
    final glow = _glow ??= _glowImage();
    ui.Color at(double density) {
      context.progress = density;
      final c = Rgba.of(heat.ramp(context)) ?? Rgba.black;
      return ui.Color.fromRGBO(
        (c.r * 255).round(),
        (c.g * 255).round(),
        (c.b * 255).round(),
        1,
      );
    }

    final low = at(0.3);
    final high = at(1);
    final intensity = asNumber(heat.intensity(context)) ?? 1;
    canvas.saveLayer(
      null,
      ui.Paint()..color = ui.Color.fromRGBO(0, 0, 0, (color >>> 24) / 255),
    );
    for (final hot in const [false, true]) {
      for (final mesh in meshes) {
        final points = mesh.points;
        if (points == null || points.isEmpty) continue;
        context.props = mesh.props ?? const {};
        final strength = ((asNumber(heat.weight(context)) ?? 1) * intensity)
            .clamp(0.0, 4.0);
        final n = points.length ~/ 2;
        final size = hot ? diameter * 0.7 : diameter;
        final k = size / glow.width;
        final transforms = Float32List(n * 4);
        final rects = Float32List(n * 4);
        for (var i = 0; i < n; i++) {
          transforms[i * 4] = k;
          transforms[i * 4 + 2] = points[i * 2] - size / 2;
          transforms[i * 4 + 3] = points[i * 2 + 1] - size / 2;
          rects[i * 4 + 2] = glow.width.toDouble();
          rects[i * 4 + 3] = glow.height.toDouble();
        }
        _paint
          ..color = ui.Color.fromRGBO(
            255,
            255,
            255,
            (strength * (hot ? 0.22 : 0.6)).clamp(0.0, 1.0),
          )
          ..colorFilter = ui.ColorFilter.mode(
            hot ? high : low,
            ui.BlendMode.srcIn,
          )
          ..blendMode = hot ? ui.BlendMode.srcOver : ui.BlendMode.plus;
        canvas.drawRawAtlas(glow, transforms, rects, null, null, null, _paint);
      }
    }
    context.props = const {};
    canvas.restore();
  }

  static ui.Image _glowImage() {
    const size = 64.0;
    final recorder = ui.PictureRecorder();
    ui.Canvas(recorder).drawCircle(
      const ui.Offset(size / 2, size / 2),
      size / 2,
      ui.Paint()
        ..shader = ui.Gradient.radial(
          const ui.Offset(size / 2, size / 2),
          size / 2,
          const [
            ui.Color(0xFFFFFFFF),
            ui.Color(0xB0FFFFFF),
            ui.Color(0x48FFFFFF),
            ui.Color(0x00FFFFFF),
          ],
          const [0, 0.3, 0.65, 1],
        ),
    );
    final picture = recorder.endRecording();
    final image = picture.toImageSync(size.toInt(), size.toInt());
    picture.dispose();
    return image;
  }

  void dispose() => _glow?.dispose();
}
