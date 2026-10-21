import 'dart:ui' as ui;

import 'view.dart';

/// One frame of the map as the engine draws it: the screen framed at the
/// zoom of its middle, and the view that says what the screen shows.
class MapFrame {
  const MapFrame({
    required this.zoom,
    required this.origin,
    required this.size,
    required this.rotation,
    required this.devicePixelRatio,
    required this.view,
    this.ahead,
  });

  /// Slippy-map zoom: the world is `256 * 2^zoom` logical pixels wide.
  final double zoom;

  /// World pixel at the canvas origin.
  final ui.Offset origin;
  final ui.Size size;
  final double rotation;
  final double devicePixelRatio;

  /// What the screen shows, tilted, turned or on the globe; [origin] and
  /// [size] frame the screen at the scale of its middle.
  final MapView view;

  /// What the screen will show where the camera is headed, while it moves
  /// to a known place, so its tiles load on the way.
  final MapView? ahead;

  /// This frame seeing [view], headed for [ahead].
  MapFrame withView(MapView view, MapView? ahead) => MapFrame(
    zoom: zoom,
    origin: origin,
    size: size,
    rotation: rotation,
    devicePixelRatio: devicePixelRatio,
    view: view,
    ahead: ahead,
  );
}
