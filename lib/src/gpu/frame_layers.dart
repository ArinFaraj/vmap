import 'dart:ui' as ui;

import '../style/style_model.dart' show StyleRun;
import 'gpu_map_pass.dart';
import 'gpu_shim/gpu.dart' as gpu;
import 'pass_target.dart';

/// A heatmap run's points added up in [density], to be coloured with the
/// gradient in ramp row [row] at [opacity].
typedef Heat = ({gpu.Texture density, double row, double opacity});

/// A texture a frame draws into and the image the canvas shows it by.
typedef FrameTexture = ({PassTarget target, ui.Image image});

/// A pass begun on a frame's texture and the commands it is recorded in.
typedef OpenPass = ({MapPass pass, gpu.CommandBuffer commands});

/// The textures of one frame, handed out in the order its images begin.
abstract interface class FrameTextures {
  /// The texture of the frame's first image, the map's.
  FrameTexture get map;

  /// The next texture for an image the canvas shows.
  FrameTexture nextShown();

  /// The next texture for an image a pass of the frame reads.
  PassTarget nextFed();
}

/// One image of a frame: its texture, the pass that draws it, and how the
/// canvas lays it down.
class FrameImage {
  FrameImage(FrameTexture texture, OpenPass open)
    : texture = texture.target.texture,
      image = texture.image,
      pass = open.pass,
      commands = open.commands;

  final gpu.Texture texture;

  /// What the canvas shows [texture] by: on the web a copy, taken when the
  /// image is first laid down.
  ui.Image image;
  bool copied = false;

  final MapPass pass;
  final gpu.CommandBuffer commands;

  /// The commands of the images [pass] reads, which the GPU runs before
  /// [commands].
  final List<gpu.CommandBuffer> before = [];
}

/// The images one frame's layers are drawn into, in the style's order: a
/// new one wherever the canvas draws a background or a raster between the
/// GPU's layers. A layer drawn whole at an opacity is drawn apart and laid
/// over the image below on the GPU.
class FrameLayers {
  FrameLayers(this._textures, {required this._passOn}) {
    images.add(FrameImage(_textures.map, _passOn(_textures.map.target)));
  }

  final FrameTextures _textures;
  final OpenPass Function(PassTarget target) _passOn;

  void Function(MapPass pass)? _setUp;

  /// The images the canvas lays over each other, in order.
  final List<FrameImage> images = [];

  /// The pass runs are drawn into now.
  MapPass get pass => images.last.pass;

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

  OpenPass _open(PassTarget target) {
    final open = _passOn(target);
    _setUp?.call(open.pass);
    return open;
  }

  void _show(FrameTexture texture) =>
      images.add(FrameImage(texture, _open(texture.target)));

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
    _show(_textures.nextShown());
  }

  /// Draws [draw] whole at [opacity]: into the image below when opaque,
  /// else into a texture of its own, which the image below then lays over
  /// itself at that opacity.
  void apart(double opacity, void Function(MapPass into) draw) {
    flush();
    if (opacity <= 0) return;
    if (opacity >= 1) {
      draw(pass);
      return;
    }
    final fed = _textures.nextFed();
    final open = _open(fed);
    draw(open.pass);
    images.last.before.add(open.commands);
    pass.composite(fed.texture, opacity);
  }

  /// Draws [draw] into the image below, which draws at [opacity] itself.
  void within(double opacity, void Function(MapPass into) draw) {
    flush();
    if (opacity > 0) draw(pass);
  }

  /// Colours [heat] over what is below it, in the same image.
  void heat(Heat heat) {
    flush();
    pass.colorHeat(heat.density, heat.row, heat.opacity);
  }
}
