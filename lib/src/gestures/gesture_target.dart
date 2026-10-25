import 'dart:math' as math;

import 'package:flutter/animation.dart';
import 'package:flutter/foundation.dart';

/// One change a gesture makes to the camera: the ground under [from] moved
/// under [to], then zoomed by [zoomBy] levels and turned by [turn] degrees
/// of bearing about [around], and tilted by [tilt] degrees of pitch.
/// [around] is [to] when not given, and the camera's centre on the screen
/// when neither is.
@immutable
class MapGestureStep {
  const MapGestureStep({
    this.from,
    this.to,
    this.around,
    this.zoomBy = 0,
    this.turn = 0,
    this.tilt = 0,
  }) : assert((from == null) == (to == null));

  final Offset? from, to, around;
  final double zoomBy, turn, tilt;

  /// The anchor of the zoom and turn, or null for the camera's centre.
  Offset? get anchor => around ?? to;

  /// [k] of the way through this step, 0 none of it and 1 all of it.
  MapGestureStep scaled(double k) => MapGestureStep(
    from: from,
    to: from == null ? null : Offset.lerp(from, to, k),
    around: around,
    zoomBy: zoomBy * k,
    turn: turn * k,
    tilt: tilt * k,
  );
}

/// A released gesture coasting and slowing like a body on a surface: the
/// map slides at [pan] screen pixels a second and zooms, turns and tilts at
/// their rates per second, all about screen point [focal].
@immutable
class MapGlide {
  const MapGlide._(this.focal, this.pan, this.zoom, this.turn, this.tilt);

  /// The glide of a gesture released at these speeds, capped, or null when
  /// it was too slow to coast.
  static MapGlide? of({
    required Offset focal,
    Offset pan = Offset.zero,
    double zoom = 0,
    double turn = 0,
    double tilt = 0,
  }) {
    double cap(double v, double most) => v.clamp(-most, most);
    final speed = pan.distance > 6000 ? pan * (6000 / pan.distance) : pan;
    zoom = cap(zoom, 4);
    turn = cap(turn, 300);
    tilt = cap(tilt, 120);
    if (speed.distance < 80 &&
        zoom.abs() < 0.25 &&
        turn.abs() < 10 &&
        tilt.abs() < 10) {
      return null;
    }
    return MapGlide._(focal, speed, zoom, turn, tilt);
  }

  /// How long a released gesture keeps its speed: the speed falls to a
  /// third in this time.
  static const glideSeconds = 0.32;

  /// Zoom, turn and tilt settle a little sooner than a slide does.
  static const _zoomSeconds = 0.24, _turnSeconds = 0.28, _tiltSeconds = 0.22;

  static const _seconds = glideSeconds * 4.5;

  final Offset focal, pan;
  final double zoom, turn, tilt;

  Duration get duration => Duration(microseconds: (_seconds * 1e6).round());

  /// How far the glide has taken the camera from where it was released, at
  /// [t] of its [duration].
  MapGestureStep at(double t) {
    double eased(double tau) => tau * (1 - math.exp(-t * _seconds / tau));
    final k = eased(glideSeconds);
    return MapGestureStep(
      from: focal,
      to: focal + pan * k,
      zoomBy: zoom * eased(_zoomSeconds),
      turn: turn * eased(_turnSeconds),
      tilt: tilt * eased(_tiltSeconds),
    );
  }
}

/// What a [MapGestureRecognizer] moves: the camera of a [Vmap], or of a map
/// widget hosting vmap.
abstract interface class MapGestureTarget {
  /// The map's size in logical pixels.
  Size get size;

  /// Where the camera's centre is on the screen.
  Offset get centre;

  double get zoom;
  double get minZoom;
  double get maxZoom;

  /// Whether an animation is moving the camera.
  bool get isMoving;

  /// Stops any animation where it is.
  void stop();

  /// Applies [step] at once.
  void jump(MapGestureStep step);

  /// Applies [step], measured from the camera now, over [duration]: each
  /// frame shows [MapGestureStep.scaled] by [curve] of the time gone, so
  /// the step's anchor stays under the same screen point throughout.
  void ease(MapGestureStep step, Duration duration, {Curve curve});

  /// Lets [glide] carry the camera on from where it is.
  void glide(MapGlide glide);
}
