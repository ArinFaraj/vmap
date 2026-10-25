import 'dart:typed_data';
import 'dart:ui' as ui;

/// GPU images laid over each other as one page element: each a browser
/// `ImageBitmap` at its opacity, the whole moved by [warp] and cut to the
/// polygon [clip], both in the map's logical pixels.
class GpuPlane {
  const GpuPlane(this.images, {this.warp, this.clip});

  final List<(Object bitmap, double opacity)> images;

  /// A column-major 4x4 matrix, as `Canvas.transform` takes.
  final Float64List? warp;
  final List<ui.Offset>? clip;
}

/// One frame of the map as planes over each other, for the web, where
/// copying a GPU image into Flutter's renderer costs Safari about 50 ms:
/// a picture of what the canvas drew, a page element with the GPU's
/// images, the next picture, and so on. [pictures] has one more entry than
/// [gpu].
class FramePlanes {
  final List<ui.Picture> pictures = [];
  final List<GpuPlane> gpu = [];
  ui.PictureRecorder? _recorder;
  ui.Canvas? _canvas;

  /// Shows the GPU plane at [index] as soon as it is handed over: Safari
  /// blanks a bitmap taken from a canvas that is drawn into again before
  /// the bitmap is shown.
  void Function(int index, GpuPlane plane)? onHand;

  /// The ground the frame is cut to above the horizon, in logical pixels,
  /// which a GPU plane handed now is cut to too.
  List<ui.Offset>? clip;

  /// What is drawn next goes on this.
  ui.Canvas get canvas => _canvas!;

  /// Starts a frame, dropping the last one's planes.
  ui.Canvas begin() {
    pictures.clear();
    gpu.clear();
    clip = null;
    return _open();
  }

  ui.Canvas _open() {
    final recorder = _recorder = ui.PictureRecorder();
    return _canvas = ui.Canvas(recorder);
  }

  void _close() {
    final canvas = _canvas!;
    while (canvas.getSaveCount() > 1) {
      canvas.restore();
    }
    pictures.add(_recorder!.endRecording());
  }

  /// Ends the picture drawn so far and lays [images] over it, moved by
  /// [warp]; what is drawn next goes over them, on the canvas returned.
  ui.Canvas hand(
    List<(Object bitmap, double opacity)> images,
    Float64List? warp,
  ) {
    _close();
    final plane = GpuPlane(images, warp: warp, clip: clip);
    onHand?.call(gpu.length, plane);
    gpu.add(plane);
    return _open();
  }

  /// Ends the frame's last picture.
  void end() => _close();
}
