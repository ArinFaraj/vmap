import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'platform.dart';
import 'expr.dart';
import 'sprites.dart';
import 'style_model.dart';
import 'tessellate.dart';

/// The repeating pictures layers are drawn through: dashes and patterns.
class LayerShaders {
  final Map<String, _DashImage> _dashImages = {};
  final Map<(PaintLayer, double, double, int), ui.ImageShader> _shaders = {};
  int _frame = 0;
  final Float64List _matrix = Float64List(16)
    ..[5] = 1
    ..[10] = 1
    ..[15] = 1;

  ui.ImageShader? _backdrop;

  /// The sprite image [name] repeated over the whole view, held to the
  /// world pixel at [origin] so it moves with the map. Null while the sprite
  /// sheet has not loaded or has no such image.
  ui.ImageShader? backdrop(
    String name,
    SpriteSheet? sprites,
    ui.Offset origin,
  ) {
    final image = sprites?.pattern(name);
    if (image == null) return null;
    final stretch = 1 / sprites!.entries[name]!.pixelRatio;
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
    _matrix
      ..[12] = 0
      ..[13] = 0;
    _backdrop?.dispose();
    return _backdrop = shader;
  }

  /// Drops the shaders made for the last frame. Their sizes follow the zoom,
  /// so few survive a frame of a moving map.
  void startFrame() {
    for (final s in _shaders.values) {
      s.dispose();
    }
    _shaders.clear();
    if (_dashImages.length > _maxDashImages) {
      _dashImages.removeWhere((_, d) {
        if (d.usedFrame == _frame) return false;
        d.image.dispose();
        return true;
      });
    }
    _frame++;
  }

  static const int _maxDashImages = 48;

  /// The repeating picture a layer is drawn through: its dashes in [color],
  /// or the pattern that fills it. Null for a plain colour, and for a pattern
  /// whose sprite sheet has not loaded.
  ///
  /// Dashes carry their colour because a colour filter on the paint does
  /// not reach vertices drawn through a shader.
  ui.ImageShader? of(
    PaintLayer layer,
    double width,
    double scale,
    EvalContext context,
    SpriteSheet? sprites,
    int color,
  ) {
    final line = layer is LineLayer ? layer : null;
    final blur = line?.blur;
    final gradient = line?.gradient;
    final dash = line?.dash;
    final pattern = layer.pattern;
    if (dash == null && pattern == null && blur == null && gradient == null) {
      return null;
    }
    final rgb = pattern != null || gradient != null ? 0 : color & 0xFFFFFF;
    final key = (layer, width, scale, rgb);
    final made = _shaders[key];
    if (made != null) return made;
    final ui.Image image;
    final double stretch;
    final step = blur == null || width <= 0
        ? 0
        : ((asNumber(blur(context)) ?? 0) / width * _blurSteps * 2)
              .round()
              .clamp(0, _blurSteps);
    if (gradient != null) {
      final kept = _dashImages['g|${identityHashCode(layer)}'] ??= _DashImage(
        _gradientImage(gradient, context),
      );
      kept.usedFrame = _frame;
      image = kept.image;
      stretch = 1;
    } else if (dash != null) {
      if (width <= 0) return null;
      var total = 0.0;
      for (final d in dash) {
        total += d;
      }
      final kept =
          _dashImages['${dash.join(',')}|${line!.dashCap.index}|$step|$rgb'] ??=
              _DashImage(
                _dashImage(
                  dash,
                  total,
                  line.dashCap,
                  rgb,
                  step / _blurSteps / 2,
                ),
              );
      kept.usedFrame = _frame;
      image = kept.image;
      stretch = total * width / scale / image.width;
    } else if (blur != null) {
      if (step == 0) return null;
      final kept = _dashImages['b|$step|$rgb'] ??= _DashImage(
        _blurImage(step / _blurSteps / 2, rgb),
      );
      kept.usedFrame = _frame;
      image = kept.image;
      stretch = 1;
    } else {
      final sheet = sprites;
      if (sheet == null) return null;
      final name = pattern!(context) as String;
      final found = sheet.pattern(name);
      if (found == null) return null;
      image = found;
      stretch = line != null
          ? width / scale / image.height
          : 1 / (sheet.entries[name]!.pixelRatio * scale);
    }
    final along = line != null;
    _matrix
      ..[0] = stretch
      ..[5] = along ? 1 / image.height : stretch;
    final shader = ui.ImageShader(
      forShader(image),
      gradient != null ? ui.TileMode.clamp : ui.TileMode.repeated,
      along ? ui.TileMode.clamp : ui.TileMode.repeated,
      _matrix,
      filterQuality: ui.FilterQuality.low,
    );
    return _shaders[key] = shader;
  }

  static const int _dashImageWidth = 256;
  static const int _blurSteps = 16;
  static const int _blurImageHeight = 64;

  /// The colours [gradient] gives from the start of a line to its end, a
  /// pixel for each of [LineMesher.shareSpan] steps.
  ui.Image _gradientImage(Expr gradient, EvalContext context) {
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder);
    final paint = ui.Paint();
    const steps = LineMesher.shareSpan;
    for (var i = 0; i < steps; i++) {
      context.progress = i / (steps - 1);
      final color = Rgba.of(gradient(context));
      if (color == null) continue;
      canvas.drawRect(
        ui.Rect.fromLTWH(i + 0.0, 0, 1, 2),
        paint..color = ui.Color(color.toArgb()),
      );
    }
    context.progress = 0;
    final picture = recorder.endRecording();
    final image = picture.toImageSync(steps.toInt(), 2);
    picture.dispose();
    return image;
  }

  /// A strip across a line of [rgb] that fades out over [reach] of the
  /// line's width at each edge.
  ui.Image _blurImage(double reach, int rgb) {
    final recorder = ui.PictureRecorder();
    final solid = ui.Color(0xFF000000 | rgb);
    final clear = ui.Color(rgb);
    ui.Canvas(recorder).drawRect(
      const ui.Rect.fromLTWH(0, 0, 2, _blurImageHeight + 0.0),
      ui.Paint()
        ..shader = ui.Gradient.linear(
          ui.Offset.zero,
          const ui.Offset(0, _blurImageHeight + 0.0),
          [clear, solid, solid, clear],
          [0, reach, 1 - reach, 1],
        ),
    );
    final picture = recorder.endRecording();
    final image = picture.toImageSync(2, _blurImageHeight);
    picture.dispose();
    return image;
  }

  /// One period of a dash pattern as a strip of [rgb] and clear, as tall as
  /// the line is wide, fading out over [reach] of that width at each edge.
  ui.Image _dashImage(
    Float64List dash,
    double total,
    DashCap cap,
    int rgb,
    double reach,
  ) {
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder);
    final paint = ui.Paint()..color = ui.Color(0xFF000000 | rgb);
    final height = reach > 0
        ? _blurImageHeight + 0.0
        : cap == DashCap.round
        ? 32.0
        : 2.0;
    final lineWidth = _dashImageWidth / total;
    final capReach = cap == DashCap.butt ? 0.0 : lineWidth / 2;
    var at = 0.0;
    for (var i = 0; i < dash.length; i++) {
      final length = dash[i] / total * _dashImageWidth;
      if (i.isEven) {
        // A dash that runs past one end of the strip comes back in at the
        // other.
        for (final shift in const [-1, 0, 1]) {
          final rect = ui.Rect.fromLTWH(
            at - capReach + shift * _dashImageWidth,
            0,
            math.max(1, length + capReach * 2),
            height,
          );
          if (cap == DashCap.round) {
            canvas.drawRRect(
              ui.RRect.fromRectAndRadius(
                rect,
                ui.Radius.elliptical(
                  math.min(capReach, rect.width / 2),
                  height / 2,
                ),
              ),
              paint,
            );
          } else {
            canvas.drawRect(rect, paint);
          }
        }
      }
      at += length;
    }
    if (reach > 0) {
      const solid = ui.Color(0xFF000000), clear = ui.Color(0x00000000);
      canvas.drawRect(
        ui.Rect.fromLTWH(0, 0, _dashImageWidth + 0.0, height),
        ui.Paint()
          ..blendMode = ui.BlendMode.dstIn
          ..shader = ui.Gradient.linear(
            ui.Offset.zero,
            ui.Offset(0, height),
            [clear, solid, solid, clear],
            [0, reach, 1 - reach, 1],
          ),
      );
    }
    final picture = recorder.endRecording();
    final image = picture.toImageSync(_dashImageWidth, height.toInt());
    picture.dispose();
    return image;
  }

  void dispose() {
    startFrame();
    _backdrop?.dispose();
    for (final d in _dashImages.values) {
      d.image.dispose();
    }
  }
}

class _DashImage {
  _DashImage(this.image);

  final ui.Image image;
  int usedFrame = 0;
}
