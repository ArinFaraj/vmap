import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import '../platform.dart';
import '../render/pattern_growth.dart';
import '../style/expr.dart';
import '../style/sprites.dart';
import '../style/style_model.dart';
import '../tiles/tessellate.dart';
import '../render/zoom_history.dart';

/// The repeating pictures layers are drawn through: dashes and patterns.
class LayerShaders {
  final Map<String, _DashImage> _dashImages = {};
  final Map<
    (
      PaintLayer,
      double,
      double,
      int,
      Float64List?,
      double,
      (String, int)?,
      ui.Offset,
    ),
    ui.ImageShader
  >
  _shaders = {};

  /// How this frame's dashes cross-fade from the zoom level before.
  DashFade dashFade = ZoomHistory.settled;
  int _frame = 0;
  final Float64List _matrix = Float64List(16)
    ..[5] = 1
    ..[10] = 1
    ..[15] = 1;

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

  /// One repeat of [dash] in screen pixels. As MapLibre's line-floorwidth
  /// and tile ratio, dashes are as long as the line is wide at the zoom
  /// level's floor, and grow with the map from there to the next level.
  static double _dashRepeat(
    LineLayer line,
    Float64List dash,
    EvalContext context,
  ) {
    final zoom = context.zoom;
    final tileZoom = math.max(0.0, zoom.floorToDouble());
    context.zoom = zoom.floorToDouble();
    final floorWidth = (asNumber(line.width(context)) ?? 0).toDouble();
    context.zoom = zoom;
    return _total(dash) * floorWidth * math.pow(2, zoom - tileZoom);
  }

  static double _total(Float64List dash) => dash.fold(0.0, (a, b) => a + b);

  /// The repeating picture a layer is drawn through: its dashes in [color],
  /// or the pattern that fills it. Null for a plain colour, and for a pattern
  /// whose sprite sheet has not loaded.
  ///
  /// Dashes carry their colour because a colour filter on the paint does
  /// not reach vertices drawn through a shader. A fill's pattern lies on
  /// the world's pixel grid, as MapLibre's, from the tile's [corner] in
  /// world pixels.
  ui.ImageShader? of(
    MeshLayer layer,
    double width,
    double scale,
    EvalContext context,
    SpriteSheet? sprites,
    int color, {
    ui.Offset corner = ui.Offset.zero,
  }) {
    final line = layer is LineLayer ? layer : null;
    final blur = line?.blur;
    final gradient = line?.gradient;
    final dash = line?.dashFor(context, context.zoom);
    final pattern = switch (layer) {
      PatternedLayer(:final pattern) => pattern,
      _ => null,
    };
    if (dash == null && pattern == null && blur == null && gradient == null) {
      return null;
    }
    final rgb = pattern != null || gradient != null ? 0 : color & 0xFFFFFF;
    final repeat = dash == null || gradient != null
        ? 0.0
        : _dashRepeat(line!, dash, context);
    // As MapLibre, the zoom level before's dashes morph into these. The
    // two share a strip when one repeat is a whole number of the other, as
    // it always is for a dasharray that keeps over the two levels.
    Float64List? before;
    var beforeRepeat = 0.0, shown = _fadeSteps;
    final fade = dashFade;
    if (repeat > 0 && fade.mix < 1) {
      final from = line!.dashFor(context, fade.fromZoom);
      final steps = (fade.mix * _fadeSteps).round();
      if (from != null && steps < _fadeSteps) {
        final r = _dashRepeat(line, from, context) * fade.fromScale;
        final ratio = math.max(r, repeat) / math.max(1e-9, math.min(r, repeat));
        if (r > 0 && ratio <= 8 && (ratio - ratio.round()).abs() < 1e-6) {
          before = from;
          beforeRepeat = r;
          shown = steps;
        }
      }
    }
    final key = (
      layer,
      width,
      scale,
      rgb,
      dash,
      repeat,
      before == null ? null : (before.join(','), shown),
      line == null && pattern != null ? corner : ui.Offset.zero,
    );
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
      if (width <= 0 || repeat <= 0) return null;
      final cap = line!.dashCap;
      final reach = step / _blurSteps / 2;
      final name = [
        dash.join(','),
        if (before != null) '${before.join(',')}*${fade.fromScale}@$shown',
        cap.index,
        step,
        rgb,
      ].join('|');
      final kept = _dashImages[name] ??= _DashImage(switch (before) {
        final b? => _fadedDashImage(
          dash,
          b,
          fade.fromScale,
          shown / _fadeSteps,
          cap,
          rgb,
          reach,
        ),
        null => _dashImage(dash, _total(dash), cap, rgb, reach),
      });
      kept.usedFrame = _frame;
      image = kept.image;
      stretch = math.max(repeat, beforeRepeat) / scale / image.width;
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
          : patternGrowth(context.zoom) /
                (sheet.entries[name]!.pixelRatio * scale);
    }
    final along = line != null;
    final across = image.width * stretch * scale;
    final onGrid = line == null && pattern != null && across > 0;
    _matrix
      ..[0] = stretch
      ..[5] = along ? 1 / image.height : stretch
      ..[12] = onGrid ? -(corner.dx % across) / scale : 0
      ..[13] = onGrid
          ? -(corner.dy % (image.height * stretch * scale)) / scale
          : 0;
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

  /// The steps a cross-fade between two levels' dashes is drawn in.
  static const int _fadeSteps = 32;
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
    final height = _stripHeight(cap, reach);
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
    return _finishStrip(recorder, canvas, height, reach);
  }

  /// [dash] as [_dashImage] draws it, while the zoom level before's
  /// [before], [fromScale] times as long, morphs into it, [share] of the
  /// way: as MapLibre, by the signed distance to the nearest dash end, the
  /// two mixed. The strip holds one repeat of the longer, column by column.
  ui.Image _fadedDashImage(
    Float64List dash,
    Float64List before,
    double fromScale,
    double share,
    DashCap cap,
    int rgb,
    double reach,
  ) {
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder);
    final paint = ui.Paint();
    final height = _stripHeight(cap, reach);
    final column =
        math.max(_total(dash), _total(before) * fromScale) / _dashImageWidth;
    for (var x = 0; x < _dashImageWidth; x++) {
      final at = (x + 0.5) * column;
      // In line widths; the strip is a line's width across.
      final sd =
          _dashDistance(before, fromScale, at) * (1 - share) +
          _dashDistance(dash, 1, at) * share;
      var alpha = 1.0, half = 0.5;
      switch (cap) {
        case DashCap.butt:
          alpha = (sd / column + 0.5).clamp(0.0, 1.0);
        case DashCap.square:
          alpha = ((sd + 0.5) / column + 0.5).clamp(0.0, 1.0);
        case DashCap.round:
          if (sd < 0) half = math.sqrt(math.max(0.0, 0.25 - sd * sd));
      }
      if (alpha <= 0 || half <= 0) continue;
      canvas.drawRect(
        ui.Rect.fromLTRB(
          x + 0.0,
          (0.5 - half) * height,
          x + 1.0,
          (0.5 + half) * height,
        ),
        paint..color = ui.Color((alpha * 255).round() << 24 | rgb),
      );
    }
    return _finishStrip(recorder, canvas, height, reach);
  }

  /// The signed distance from [at] to the nearest end of [dash]'s dashes,
  /// each [scale] times as long: positive inside a dash.
  static double _dashDistance(Float64List dash, double scale, double at) {
    final period = _total(dash) * scale;
    final x = at % period;
    var best = double.negativeInfinity, start = 0.0;
    for (var i = 0; i < dash.length; i++) {
      final end = start + dash[i] * scale;
      if (i.isEven) {
        for (final shift in const [-1.0, 0.0, 1.0]) {
          final a = start + shift * period, b = end + shift * period;
          best = math.max(best, math.min(x - a, b - x));
        }
      }
      start = end;
    }
    return best;
  }

  static double _stripHeight(DashCap cap, double reach) => reach > 0
      ? _blurImageHeight + 0.0
      : cap == DashCap.round
      ? 32.0
      : 2.0;

  /// Fades the strip drawn on [canvas] out over [reach] of its height at
  /// each edge, and makes it an image.
  static ui.Image _finishStrip(
    ui.PictureRecorder recorder,
    ui.Canvas canvas,
    double height,
    double reach,
  ) {
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
