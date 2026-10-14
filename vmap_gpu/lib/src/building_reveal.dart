import 'dart:math' as math;

import 'package:vmap/renderer.dart';

import 'gpu_buffers.dart';

/// How buildings come and go: always at full height, fading. A building
/// layer fades in over its footprints over [fadeMicros] once the zoom
/// enters its range and out when it leaves. Buildings showing where none
/// stood a moment ago fade in over [fadeMicros]; buildings replacing others
/// while zooming swaps tiles show at once.
class BuildingReveal {
  BuildingReveal(this._clock);

  final Stopwatch _clock;

  static const fadeMicros = 300000;

  /// How long a tile's standing buildings let a neighbour skip fading in.
  static const _standingFrames = 90;

  final Map<ExtrusionLayer, double> _presence = Map.identity();

  /// Tiles whose buildings stood once, which show standing from then on,
  /// even when their GPU data is sent again.
  final Expando<bool> _stood = Expando();
  final Map<int, int> _standing = {};
  int _at = 0, _frame = 0;

  /// Whether a later frame would look different.
  bool animating = false;

  void begin(StyleSheet sheet, double styleZoom) {
    _frame++;
    animating = false;
    final now = _clock.elapsedMicroseconds;
    final step = math.min(1.0, (now - _at) / fadeMicros);
    _at = now;
    for (final layer in sheet.extrusions) {
      final target = styleZoom >= layer.minZoom && styleZoom < layer.maxZoom
          ? 1.0
          : 0.0;
      final was = _presence[layer] ?? target;
      final next = was < target
          ? math.min(target, was + step)
          : math.max(target, was - step);
      _presence[layer] = next;
      if (next != target) animating = true;
    }
    if (_frame % 120 == 0) {
      _standing.removeWhere((_, at) => _frame - at > 600);
    }
  }

  bool shows(ExtrusionLayer layer) => (_presence[layer] ?? 0) > 0;

  /// How far [layer] has faded in, eased.
  double _shown(ExtrusionLayer layer) {
    final p = _presence[layer] ?? 0;
    return p * p * (3 - 2 * p);
  }

  /// The opacity of [buildings] in [tile].
  double opacity(LoadedTile tile, ExtrusionLayer layer, BuildingGpu buildings) {
    final id = tile.id;
    final now = _clock.elapsedMicroseconds;
    if (buildings.shownAt < 0) {
      final fades =
          _shown(layer) >= 1 && _stood[tile] == null && !_standingNear(id);
      buildings.shownAt = fades ? now : now - fadeMicros;
    }
    final t = math.min(1.0, (now - buildings.shownAt) / fadeMicros);
    if (t < 1) {
      animating = true;
    } else {
      _standing[tileKey(id.z, id.x, id.y)] = _frame;
      _stood[tile] = true;
    }
    return t * _shown(layer);
  }

  bool _standingNear(TileId id) {
    bool recent(int z, int x, int y) {
      final at = _standing[tileKey(z, x, y)];
      return at != null && _frame - at < _standingFrames;
    }

    var z = id.z, x = id.x, y = id.y;
    for (var up = 0; up <= 4 && z >= 0; up++) {
      if (recent(z, x, y)) return true;
      z--;
      x >>= 1;
      y >>= 1;
    }
    for (var down = 1; down <= 2; down++) {
      final n = 1 << down;
      for (var dy = 0; dy < n; dy++) {
        for (var dx = 0; dx < n; dx++) {
          if (recent(id.z + down, id.x * n + dx, id.y * n + dy)) return true;
        }
      }
    }
    return false;
  }
}
