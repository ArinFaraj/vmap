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
    this.soon,
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

  /// What the screen will show by the time a tile asked for now is here,
  /// while the camera moves: the view whose tiles are worth asking for.
  final MapView? soon;

  /// This frame with [view], [ahead] and [soon] each made anew by [remake].
  MapFrame mapViews(MapView Function(MapView view) remake) => MapFrame(
    zoom: zoom,
    origin: origin,
    size: size,
    rotation: rotation,
    devicePixelRatio: devicePixelRatio,
    view: remake(view),
    ahead: switch (ahead) {
      final ahead? => remake(ahead),
      null => null,
    },
    soon: switch (soon) {
      final soon? => remake(soon),
      null => null,
    },
  );
}
