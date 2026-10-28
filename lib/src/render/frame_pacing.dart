import 'dart:typed_data';

/// Keeps frames inside the display's interval by handing the work that may
/// wait smaller shares while frames run long, and larger ones while they
/// run short.
///
/// A frame has 16.7 ms at 60 Hz and 8.3 ms at 120 Hz, and the refresh rate
/// is not known here, so the levels go by how long a frame takes of either:
/// while the map paints in well under 8 ms it has room to prepare tiles for
/// the GPU and to sharpen label text, so ground not yet drawn fills in at
/// once; while it paints in over 12 ms it does only what shows this frame,
/// so a slow device keeps its frames on time and draws what it has instead
/// of hitching. Between the two it works at the rates vmap has always used.
///
/// The levels only move on an average of the last [_window] frames, and a
/// level is left well past where it was entered, so a map drawing at the
/// edge of one does not switch back and forth.
class FramePacing {
  /// Frames averaged: about a third of a second at 60 Hz.
  static const int _window = 20;

  /// Where the average frame's time puts it: under [_calmMicros] nothing
  /// waits, over [_busyMicros] the frame keeps to what shows, and over
  /// [_tightMicros] it keeps to less again.
  static const int _calmMicros = 7000;
  static const int _busyMicros = 9000;
  static const int _relaxedMicros = 10000;
  static const int _tightMicros = 12000;

  /// Frame times in microseconds: an Int32List, as the web has no 64 bit
  /// typed data, and no frame takes anywhere near 2147 seconds.
  final Int32List _samples = Int32List(_window);
  int _at = 0, _count = 0, _sum = 0;

  /// How pressed the frames are: 0 with time to spare, 1 with little, and 2
  /// with none, where everything that may wait until a calmer frame does.
  /// It starts at 1, the shares vmap has always handed out, and only moves
  /// once a window of frames says which way to go.
  int get pressure => _pressure;
  int _pressure = 1;

  /// The average of the last [_window] frames, in microseconds.
  int get frameMicros => _count == 0 ? 0 : _sum ~/ _count;

  /// Adds a frame that painted in [micros] to the average.
  void addFrame(int micros) {
    if (_count == _window) {
      _sum -= _samples[_at];
    } else {
      _count++;
    }
    _samples[_at] = micros;
    _sum += micros;
    _at = (_at + 1) % _window;
    // The first frames of a map are its slowest — the style compiling, the
    // first tiles built — and say nothing about the ones that follow, so
    // the pressure only follows a full window.
    if (_count == _window) _settle(_sum ~/ _window);
  }

  void _settle(int average) {
    _pressure = switch (_pressure) {
      2 when average < _relaxedMicros => 1,
      1 when average >= _tightMicros => 2,
      1 when average < _calmMicros => 0,
      0 when average >= _tightMicros => 2,
      0 when average >= _busyMicros => 1,
      _ => _pressure,
    };
  }

  /// What a frame may spend getting tiles ready for the GPU: the steps that
  /// make a tile drawable, which may wait a frame.
  int get prepMicros => switch (_pressure) {
    0 => 2500,
    1 => 1500,
    _ => 750,
  };

  /// What it may spend drawing label text anew, each image a page of its
  /// own, and the sharpen after a zoom rests.
  int get labelRasterMicros => switch (_pressure) {
    0 => 2000,
    1 => 1000,
    _ => 500,
  };

  /// What it may spend placing labels again, which a move of the camera
  /// asks for.
  int get placeSliceMicros => switch (_pressure) {
    0 => 1500,
    1 => 1000,
    _ => 600,
  };
}
