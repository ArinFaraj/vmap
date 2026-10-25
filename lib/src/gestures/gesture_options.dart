import 'dart:math' as math;

import 'package:flutter/foundation.dart';

/// Which gestures move the map, by MapLibre GL JS's handler names, and the
/// two kinds of movement any of them may make, as flutter_map's flags have
/// them: a turn needs [rotate] and the handler, a tilt needs [pitch] and the
/// handler.
///
/// Taps and long presses are reported whatever is switched off, so a map
/// with [VmapGestureOptions.none] still answers them.
@immutable
class VmapGestureOptions {
  const VmapGestureOptions({
    this.dragPan = true,
    this.scrollZoom = true,
    this.boxZoom = true,
    this.dragRotate = true,
    this.pitchWithRotate = true,
    this.keyboard = true,
    this.doubleClickZoom = true,
    this.touchZoomRotate = true,
    this.touchPitch = true,
    this.rotate = true,
    this.pitch = true,
    this.inertia = true,
    this.wheelZoomRate = 1 / 300,
    this.rotateThreshold = 0.26 * 180 / math.pi,
  });

  /// Nothing moves the map but code; taps are still reported.
  static const none = VmapGestureOptions(
    dragPan: false,
    scrollZoom: false,
    boxZoom: false,
    dragRotate: false,
    keyboard: false,
    doubleClickZoom: false,
    touchZoomRotate: false,
    touchPitch: false,
  );

  /// One finger or the mouse dragging, two fingers sliding on a trackpad,
  /// and the middle of two fingers moving while they pinch.
  final bool dragPan;

  /// The mouse wheel, and a pinch on a trackpad.
  final bool scrollZoom;

  /// A shift drag zooms to the box it draws.
  final bool boxZoom;

  /// A right drag, or a control drag, turns the map, and tilts it when
  /// [pitchWithRotate].
  final bool dragRotate;
  final bool pitchWithRotate;

  /// Once the map has focus the arrow keys pan, `+` and `-` zoom, and shift
  /// with the arrows turns and tilts.
  final bool keyboard;

  /// A double tap or click zooms in, a shift double click and a two finger
  /// tap zoom out.
  final bool doubleClickZoom;

  /// Two fingers pinch to zoom and twist to turn, on a screen or a
  /// trackpad, and a double tap held and dragged zooms.
  final bool touchZoomRotate;

  /// Two fingers side by side dragged up or down tilt the map.
  final bool touchPitch;

  /// Whether any gesture may turn the map.
  final bool rotate;

  /// Whether any gesture may tilt the map.
  final bool pitch;

  /// Released gestures keep their speed and slow down, rather than stop.
  final bool inertia;

  /// Zoom levels per pixel the mouse wheel scrolls.
  final double wheelZoomRate;

  /// Degrees two fingers twist before they turn the map, so a pinch does
  /// not turn it by accident.
  final double rotateThreshold;

  /// Whether any gesture moves the map.
  bool get any =>
      dragPan ||
      scrollZoom ||
      boxZoom ||
      dragRotate ||
      keyboard ||
      doubleClickZoom ||
      touchZoomRotate ||
      touchPitch;

  VmapGestureOptions copyWith({
    bool? dragPan,
    bool? scrollZoom,
    bool? boxZoom,
    bool? dragRotate,
    bool? pitchWithRotate,
    bool? keyboard,
    bool? doubleClickZoom,
    bool? touchZoomRotate,
    bool? touchPitch,
    bool? rotate,
    bool? pitch,
    bool? inertia,
    double? wheelZoomRate,
    double? rotateThreshold,
  }) => VmapGestureOptions(
    dragPan: dragPan ?? this.dragPan,
    scrollZoom: scrollZoom ?? this.scrollZoom,
    boxZoom: boxZoom ?? this.boxZoom,
    dragRotate: dragRotate ?? this.dragRotate,
    pitchWithRotate: pitchWithRotate ?? this.pitchWithRotate,
    keyboard: keyboard ?? this.keyboard,
    doubleClickZoom: doubleClickZoom ?? this.doubleClickZoom,
    touchZoomRotate: touchZoomRotate ?? this.touchZoomRotate,
    touchPitch: touchPitch ?? this.touchPitch,
    rotate: rotate ?? this.rotate,
    pitch: pitch ?? this.pitch,
    inertia: inertia ?? this.inertia,
    wheelZoomRate: wheelZoomRate ?? this.wheelZoomRate,
    rotateThreshold: rotateThreshold ?? this.rotateThreshold,
  );

  @override
  bool operator ==(Object other) =>
      other is VmapGestureOptions &&
      other.dragPan == dragPan &&
      other.scrollZoom == scrollZoom &&
      other.boxZoom == boxZoom &&
      other.dragRotate == dragRotate &&
      other.pitchWithRotate == pitchWithRotate &&
      other.keyboard == keyboard &&
      other.doubleClickZoom == doubleClickZoom &&
      other.touchZoomRotate == touchZoomRotate &&
      other.touchPitch == touchPitch &&
      other.rotate == rotate &&
      other.pitch == pitch &&
      other.inertia == inertia &&
      other.wheelZoomRate == wheelZoomRate &&
      other.rotateThreshold == rotateThreshold;

  @override
  int get hashCode => Object.hash(
    dragPan,
    scrollZoom,
    boxZoom,
    dragRotate,
    pitchWithRotate,
    keyboard,
    doubleClickZoom,
    touchZoomRotate,
    touchPitch,
    rotate,
    pitch,
    inertia,
    wheelZoomRate,
    rotateThreshold,
  );
}
