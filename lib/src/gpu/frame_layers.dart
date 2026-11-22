import 'dart:ui' as ui;

import '../style/style_model.dart' show ExtrusionLayer, StyleRun;
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

/// Begins a pass on [target] that draws the frame's tiles, or with
/// [before] the tiles it fades from.
typedef PassOn = OpenPass Function(PassTarget target, {required bool before});

/// The textures of one frame, handed out in the order its images begin.
abstract interface class FrameTextures {
  /// The texture of the frame's first image, the map's.
  FrameTexture get map;

  /// The next texture for an image the canvas shows.
  FrameTexture nextShown();

  /// The next texture for an image a pass of the frame reads.
  PassTarget nextFed();

  /// The next texture for the picture an image fades from, whose pass
  /// stays open as long as the image's own.
  PassTarget nextBefore();
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
///
/// While tiles fade in, with a [mix], every image is drawn twice: from
/// the frame's tiles, and beside it from the tiles it fades from, which
/// the image then takes its share of as it ends.
class FrameLayers {
  FrameLayers(this._textures, {required this._passOn, this._mix}) {
    _show(_textures.map);
  }

  final FrameTextures _textures;
  final PassOn _passOn;

  /// How far the frame's tiles have taken over from those before them, or
  /// null when none fade in.
  final double? _mix;

  /// The picture the image drawn now fades from.
  ({OpenPass open, gpu.Texture texture})? _before;

  void Function(MapPass pass)? _setUp;

  /// The images the canvas lays over each other, in order.
  final List<FrameImage> images = [];

  /// The pass runs are drawn into now.
  MapPass get _pass => images.last.pass;

  /// Where a background or raster run comes between the images: the index
  /// in the style's runs of each part's first vector run and its first
  /// image.
  final List<(int, int)> splits = [];

  List<StyleRun> _below = [];

  /// Sets up the pass drawn into now and every pass after it with [setUp].
  void setUpPasses(void Function(MapPass pass) setUp) {
    _setUp = setUp;
    each(setUp);
  }

  /// Draws [draw] into the image, and into the picture it fades from.
  void each(void Function(MapPass pass) draw) {
    draw(_pass);
    if (_before case final before?) draw(before.open.pass);
  }

  /// Whether a tile in view, or one fading out, has anything of [run]'s
  /// layers to draw.
  bool holds(StyleRun run) =>
      _pass.holds(run) || (_before?.open.pass.holds(run) ?? false);

  /// Whether a tile in view, or one fading out, shows [layer]'s buildings.
  bool showsBuildings(ExtrusionLayer layer) =>
      _pass.showsBuildings(layer) ||
      (_before?.open.pass.showsBuildings(layer) ?? false);

  OpenPass _open(PassTarget target, {bool before = false}) {
    final open = _passOn(target, before: before);
    _setUp?.call(open.pass);
    return open;
  }

  void _show(FrameTexture texture) {
    images.add(FrameImage(texture, _open(texture.target)));
    if (_mix == null) return;
    final target = _textures.nextBefore();
    _before = (open: _open(target, before: true), texture: target.texture);
  }

  /// Ends the image drawn now: with tiles fading in, it keeps its share
  /// and takes the rest from the picture before them. The frame's last is
  /// ended as the frame is finished.
  void close() {
    flush();
    final before = _before;
    if (before == null) return;
    _before = null;
    images.last.before.add(before.open.commands);
    _pass.crossFade(before.texture, _mix!);
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
    final runs = _below;
    _below = [];
    each((pass) => pass.drawRuns(runs));
  }

  /// Ends the image being drawn: what comes next goes into a new one.
  void split() {
    close();
    _show(_textures.nextShown());
  }

  /// Draws [draw] whole at [opacity]: into the image below when opaque,
  /// else into a texture of its own, which the image below then lays over
  /// itself at that opacity.
  void apart(double opacity, void Function(MapPass into) draw) {
    flush();
    if (opacity <= 0) return;
    if (opacity >= 1) {
      each(draw);
      return;
    }
    void lay(MapPass onto, {required bool before}) {
      final fed = _textures.nextFed();
      final open = _open(fed, before: before);
      draw(open.pass);
      images.last.before.add(open.commands);
      onto.composite(fed.texture, opacity);
    }

    lay(_pass, before: false);
    if (_before case final before?) lay(before.open.pass, before: true);
  }

  /// Draws [draw] into the image below, which draws at [opacity] itself.
  void within(double opacity, void Function(MapPass into) draw) {
    flush();
    if (opacity > 0) each(draw);
  }

  /// Colours [heat] over what is below it, in the same image.
  void heat(Heat heat) {
    flush();
    each((pass) => pass.colorHeat(heat.density, heat.row, heat.opacity));
  }
}
