import 'dart:math' as math;

import '../style_model.dart';
import '../tiles.dart';

/// How far each paint layer is in view. A layer whose zoom range the
/// camera enters fades in over [micros] instead of every road of a kind
/// appearing at once, and fades out when the camera leaves the range. A
/// footprint layer's range has no end here: its buildings take it over.
/// The fade starts once a tile on screen has something of the layer, so it
/// is not over before the tiles bringing the layer arrive.
class LayerPresence {
  LayerPresence(this._clock);

  final Stopwatch _clock;

  static const micros = 250000;

  List<double> _presence = const [];
  StyleSheet? _sheet;
  int _at = 0;

  /// Whether a later frame would look different.
  bool animating = false;

  void begin(StyleSheet sheet, double styleZoom, List<List<TileDraw>> ideal) {
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
    final drawn = List.filled(layers.length, false);
    for (final tiles in ideal) {
      for (final d in tiles) {
        final first = d.tile.gpu?.layerFirst;
        if (first == null) continue;
        for (var p = 0; p < layers.length; p++) {
          if (first[p + 1] > first[p]) drawn[p] = true;
        }
      }
    }
    for (var p = 0; p < layers.length; p++) {
      final layer = layers[p];
      final end = sheet.footprints.containsKey(p)
          ? double.infinity
          : layer.maxZoom;
      final inRange = styleZoom >= layer.minZoom && styleZoom < end;
      final target = inRange && drawn[p] ? 1.0 : 0.0;
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
