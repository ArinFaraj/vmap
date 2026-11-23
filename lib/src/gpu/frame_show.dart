import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';

import '../camera/view.dart';
import '../render/frame_planes.dart';
import 'frame_layers.dart';
import 'gpu_shim/gpu.dart' as gpu;

/// The frame the canvas shows: the last one drawn, laid down image by
/// image between what the canvas draws itself, and shown again, moved to
/// the camera, while the GPU catches up.
class FrameShow {
  _KeptFrame? _frame;

  /// The copies of the frames before this one, let go when this one's
  /// first is taken: the canvas may still be showing them until then.
  final List<ui.Image> _stale = [];

  final ui.Paint _paint = ui.Paint()..filterQuality = ui.FilterQuality.low;
  final ui.Paint _overlayPaint = ui.Paint()
    ..filterQuality = ui.FilterQuality.low;

  /// Whether there is a frame to show.
  bool get hasFrame => _frame != null;

  /// Keeps [images], drawn for [view] and split at [splits], as the frame
  /// to show, with [text] the pass held back for its labels. With
  /// [copies], each image is copied out of its texture when it is first
  /// laid down.
  void keep(
    List<FrameImage> images,
    List<(int, int)> splits,
    MapView view, {
    required TextPass? text,
    required bool copies,
  }) {
    _retire();
    _frame = _KeptFrame(images, splits, view, text, copies: copies);
  }

  /// Shows the kept frame again, for [view].
  void again(MapView view) => _frame?.again(view);

  /// The pass the text of the frame being shown goes in, over the map: a
  /// new frame's until its image is laid down, and for a frame shown again
  /// the one its text is in already. Null when the text is drawn apart.
  TextPass? get textPass {
    final frame = _frame, text = frame?.text;
    if (frame == null || text == null) return null;
    return (frame.reused ? text.drawn : !text.sent) ? text : null;
  }

  /// Sends a text pass still held: a pass left open is never let go
  /// unsent.
  void sendText() => _frame?.text?._send();

  /// Forgets the frame, whose textures are about to go.
  void drop() {
    sendText();
    _retire();
    _frame = null;
  }

  void _retire() => _stale.addAll(_frame?.snapshots ?? const []);

  /// How many of [length] images come before style run [run].
  static int upTo(int run, int length, List<(int, int)> splits) {
    var upTo = length;
    for (final (at, image) in splits) {
      if (at >= run) {
        upTo = math.min(upTo, image);
        break;
      }
    }
    return upTo;
  }

  /// Lays the frame's images before style run [run] on [canvas], or with
  /// [planes] hands them to the page. With [warps], a frame shown again
  /// for a camera that has moved is moved with it, so the map keeps up
  /// with the labels drawn for the new camera.
  void presentUntil(
    ui.Canvas canvas,
    int run, {
    required bool warps,
    FramePlanes? planes,
  }) {
    final frame = _frame;
    if (frame == null) return;
    final all = frame.images;
    final until = upTo(run, all.length, frame.splits);
    if (until <= frame.presented) return;
    if (frame.text case final text? when text._image < until) text._send();
    final images = all.getRange(frame.presented, until);
    final warp = warps ? frame.warp : null;
    if (planes != null) {
      _hand(planes, images, warp, whole: all.length == 1);
    } else {
      if (frame.copies) _copy(frame, images);
      _lay(canvas, images, frame.view, warp);
    }
    frame.presented = until;
  }

  /// Hands [planes] each of [images] as the backend takes it out of its
  /// texture now, each shown before the next is taken: Safari blanks a
  /// bitmap whose canvas is drawn into again before it is shown. With
  /// [whole] they are all of the frame.
  void _hand(
    FramePlanes planes,
    Iterable<FrameImage> images,
    Float64List? warp, {
    required bool whole,
  }) {
    for (final image in images) {
      final page = gpu.gpuHost.page!.frame(
        image.texture,
        shower: this,
        whole: whole,
      );
      planes.hand([(page, image.opacity)], warp);
    }
  }

  /// Copies those of [images] not copied yet out of their textures.
  void _copy(_KeptFrame frame, Iterable<FrameImage> images) {
    if (frame.snapshots.isEmpty) {
      for (final copy in _stale) {
        copy.dispose();
      }
      _stale.clear();
    }
    for (final image in images) {
      if (image.copied) continue;
      final copy = image.texture.asImage();
      frame.snapshots.add(copy);
      image
        ..image = copy
        ..copied = true;
    }
  }

  void _lay(
    ui.Canvas canvas,
    Iterable<FrameImage> images,
    MapView view,
    Float64List? warp,
  ) {
    final to = ui.Rect.fromLTWH(0, 0, view.width, view.height);
    if (warp != null) {
      canvas
        ..save()
        ..transform(warp);
    }
    for (final FrameImage(:image, :opacity) in images) {
      final paint = opacity >= 1
          ? _paint
          : (_overlayPaint..color = ui.Color.fromRGBO(255, 255, 255, opacity));
      canvas.drawImageRect(
        image,
        ui.Rect.fromLTWH(0, 0, image.width.toDouble(), image.height.toDouble()),
        to,
        paint,
      );
    }
    if (warp != null) canvas.restore();
  }

  void dispose() {
    drop();
    gpu.gpuHost.page?.left(this);
  }
}

/// A frame kept to show: its images in the order the canvas lays them,
/// where a background or raster run comes between them as
/// [FrameLayers.splits], the camera they were drawn for, and the pass
/// under its labels when it has one.
class _KeptFrame {
  _KeptFrame(
    this.images,
    this.splits,
    this.view,
    this.text, {
    required this.copies,
  }) : _showView = view;

  final List<FrameImage> images;
  final List<(int, int)> splits;
  final MapView view;
  final TextPass? text;

  /// Whether the images are copied out of their textures when they are
  /// first laid down: on the web, where a texture's image is a copy taken
  /// when asked for and not the texture itself as on Impeller.
  final bool copies;
  final List<ui.Image> snapshots = [];

  /// The camera the frame is shown for: [view] unless it is shown again
  /// for a camera that has moved on.
  MapView _showView;

  /// How many of [images] are on the canvas.
  int presented = 0;
  bool reused = false;

  void again(MapView view) {
    presented = 0;
    _showView = view;
    reused = true;
  }

  /// How the frame moves to show the camera now, or null when it need not.
  Float64List? get warp {
    if (identical(_showView, view)) return null;
    final warp = _showView.warpFrom(view);
    return warp == null || _identity(warp) ? null : warp;
  }

  static bool _identity(Float64List m) {
    for (var i = 0; i < 16; i++) {
      if ((m[i] - (i % 5 == 0 ? 1 : 0)).abs() > 1e-9) return false;
    }
    return true;
  }
}

/// The pass of a frame's image under its labels, kept from the GPU so the
/// frame's text is drawn in it, over the map, rather than into an image of
/// its own. It is sent when its image is laid down.
class TextPass {
  /// [pass], which draws the frame's image [image], sent by [submit].
  TextPass(this.pass, int image, void Function() submit)
    : _image = image,
      _submit = submit;

  /// [pass] as one text is drawn in, sent by whoever made it.
  @visibleForTesting
  TextPass.on(this.pass) : _image = 0, _submit = _nothing;

  static void _nothing() {}

  final gpu.RenderPass pass;

  /// Which of the frame's images [pass] draws.
  final int _image;
  final void Function() _submit;

  /// Whether text was drawn in [pass].
  bool drawn = false;

  /// Whether [pass] has gone to the GPU and takes no more.
  bool get sent => _sent;
  bool _sent = false;

  void _send() {
    if (_sent) return;
    _sent = true;
    _submit();
  }
}
