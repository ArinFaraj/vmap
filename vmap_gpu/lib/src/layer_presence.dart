import 'dart:math' as math;

import 'package:vmap/renderer.dart';

/// How far each paint layer is in view. A layer whose zoom range the
/// camera enters fades in over [micros] instead of every road of a kind
/// appearing at once, and fades out when the camera leaves the range.
class LayerPresence {
  LayerPresence(this._clock);

  final Stopwatch _clock;

  static const micros = 250000;

  List<double> _presence = const [];
  StyleSheet? _sheet;
  int _at = 0;

  /// Whether a later frame would look different.
  bool animating = false;

  void begin(StyleSheet sheet, double styleZoom) {
    final now = _clock.elapsedMicroseconds;
    final step = math.min(1.0, (now - _at) / micros);
    _at = now;
    final layers = sheet.layers;
    final fresh = !identical(sheet, _sheet);
    if (fresh) {
      _sheet = sheet;
      _presence = List.filled(layers.length, 0);
    }
    animating = false;
    for (var p = 0; p < layers.length; p++) {
      final layer = layers[p];
      final target = styleZoom >= layer.minZoom && styleZoom < layer.maxZoom
          ? 1.0
          : 0.0;
      final was = fresh ? target : _presence[p];
      final next = was < target
          ? math.min(target, was + step)
          : math.max(target, was - step);
      _presence[p] = next;
      if (next != target) animating = true;
    }
  }

  /// Layer [p]'s opacity, eased: 0 out of view, 1 in.
  double of(int p) {
    if (p >= _presence.length) return 1;
    final v = _presence[p];
    return v * v * (3 - 2 * v);
  }
}
