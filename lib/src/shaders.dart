import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'expr.dart';
import 'sprites.dart';
import 'style.dart';

/// The repeating pictures layers are drawn through: dashes and patterns.
class LayerShaders {
  final Map<String, ui.Image> _dashImages = {};
  final Map<(PaintLayer, double, double), ui.ImageShader> _shaders = {};
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
  }

  /// The repeating picture a layer is drawn through: its dashes, or the
  /// pattern that fills it. Null for a plain colour, and for a pattern whose
  /// sprite sheet has not loaded.
  ui.ImageShader? of(
    PaintLayer layer,
    double width,
    double scale,
    EvalContext context,
    SpriteSheet? sprites,
  ) {
    if (layer.dash == null && layer.pattern == null) return null;
    final key = (layer, width, scale);
    final made = _shaders[key];
    if (made != null) return made;
    final ui.Image image;
    final double stretch;
    final dash = layer.dash;
    if (dash != null) {
      if (width <= 0) return null;
      var total = 0.0;
      for (final d in dash) {
        total += d;
      }
      image = _dashImages[dash.join(',')] ??= _dashImage(dash, total);
      stretch = total * width / scale / image.width;
    } else {
      final sheet = sprites;
      if (sheet == null) return null;
      final name = layer.pattern!(context) as String;
      final found = sheet.pattern(name);
      if (found == null) return null;
      image = found;
      stretch = layer.isLine
          ? width / scale / image.height
          : 1 / (sheet.entries[name]!.pixelRatio * scale);
    }
    final along = layer.isLine;
    _matrix
      ..[0] = stretch
      ..[5] = dash != null
          ? 1
          : along
          ? 1 / image.height
          : stretch;
    final shader = ui.ImageShader(
      image,
      ui.TileMode.repeated,
      along ? ui.TileMode.clamp : ui.TileMode.repeated,
      _matrix,
      filterQuality: ui.FilterQuality.low,
    );
    return _shaders[key] = shader;
  }

  static const int _dashImageWidth = 256;

  /// One period of a dash pattern as a strip of white and clear.
  ui.Image _dashImage(Float64List dash, double total) {
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder);
    final paint = ui.Paint()..color = const ui.Color(0xFFFFFFFF);
    var at = 0.0;
    for (var i = 0; i < dash.length; i++) {
      final length = dash[i] / total * _dashImageWidth;
      if (i.isEven) {
        canvas.drawRect(ui.Rect.fromLTWH(at, 0, math.max(1, length), 2), paint);
      }
      at += length;
    }
    final picture = recorder.endRecording();
    final image = picture.toImageSync(_dashImageWidth, 2);
    picture.dispose();
    return image;
  }

  void dispose() {
    startFrame();
    for (final i in _dashImages.values) {
      i.dispose();
    }
  }
}
