import 'dart:ui' as ui;

import '../style/style_model.dart' show StyleRun;
import 'gpu_map_pass.dart';
import 'gpu_shim/gpu.dart' as gpu;

/// A heatmap run's points added up in [density], to be coloured with the
/// gradient in ramp row [row] at [opacity].
typedef Heat = ({gpu.Texture density, double row, double opacity});

/// A texture a frame draws into and the image the canvas shows it by.
typedef FrameImage = (gpu.Texture, ui.Image);

/// The images one frame's layers are drawn into, in the style's order. A
/// layer drawn whole at an opacity goes into an image of its own and what
/// is above it into another, so the canvas lays them over each other in
/// order; a heatmap is coloured into a new image laid over what is below.
class FrameLayers {
  FrameLayers(
    FrameImage first, {
    required this._passOn,
    required this._next,
    required this._heatOf,
  }) {
    final (texture, image) = first;
    shown.add((image, 1));
    textures.add(texture);
    pass = _passOn(texture);
  }

  final MapPass Function(gpu.Texture target) _passOn;
  final FrameImage Function() _next;
  final Heat? Function(StyleRun run) _heatOf;
  void Function(MapPass pass)? _setUp;

  /// The pass runs are drawn into now.
  late MapPass pass;

  /// The images the canvas lays over each other, each at its opacity.
  final List<(ui.Image, double)> shown = [];

  /// The texture behind each of [shown].
  final List<gpu.Texture> textures = [];

  /// Where a background or raster run comes between the images: the index
  /// in the style's runs of each part's first vector run and its first
  /// image.
  final List<(int, int)> splits = [];

  List<StyleRun> _below = [];

  /// Sets up the pass drawn into now and every pass after it with [setUp].
  void setUpPasses(void Function(MapPass pass) setUp) {
    _setUp = setUp;
    setUp(pass);
  }

  MapPass _open(gpu.Texture target) {
    final pass = _passOn(target);
    _setUp?.call(pass);
    return pass;
  }

  void _openNext() {
    final (texture, image) = _next();
    pass = _open(texture);
    shown.add((image, 1));
    textures.add(texture);
  }

  /// Queues [run], or with a [whole] opacity draws it [apart].
  void add(StyleRun run, double? whole) {
    if (whole == null) {
      _below.add(run);
    } else {
      apart(whole, (into) => into.drawRuns([run]));
    }
  }

  /// Draws the runs queued so far.
  void flush() {
    pass.drawRuns(_below);
    _below = [];
  }

  /// Ends the image being drawn: what comes next goes into a new one.
  void split() {
    flush();
    _openNext();
  }

  /// Draws [draw] whole at [opacity]: into the image below when opaque,
  /// else into an image of its own laid over it.
  void apart(double opacity, void Function(MapPass into) draw) {
    flush();
    if (opacity <= 0) return;
    if (opacity >= 1) {
      draw(pass);
      return;
    }
    final (alone, aloneImage) = _next();
    draw(_open(alone));
    final (above, aboveImage) = _next();
    pass = _open(above);
    shown
      ..add((aloneImage, opacity))
      ..add((aboveImage, 1));
    textures
      ..add(alone)
      ..add(above);
  }

  /// Colours heatmap [run] over what is below it, when it draws at all.
  void heat(StyleRun run) {
    flush();
    final heat = _heatOf(run);
    if (heat == null) return;
    _openNext();
    pass.colorHeat(heat.density, heat.row, heat.opacity);
  }
}
