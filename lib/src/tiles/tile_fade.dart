import '../camera/camera.dart';
import '../camera/view.dart' show CoverTile;
import '../render/map_renderer.dart' show TilesBefore;
import 'tile_id.dart';
import 'tiles.dart';

/// The cross-fade from the picture a map's tiles made to the one they make
/// with the tiles that became ready since: one at a time, so a tile that
/// becomes ready while it runs waits for the next. Each frame [advance]
/// moves it on, the sources cover the view with the tiles of [newest],
/// and [settle] lets the new tiles join and lays out what they fade over.
class TileFade {
  TileFade(this.milliseconds);

  /// How long a fade takes; 0 for none, each tile showing as it is ready.
  final int milliseconds;

  /// The pictures begun so far. The tiles that joined the last one are
  /// fading in while [running].
  int picture = 0;

  /// The share of the running fade that is done, or null when none runs.
  double? _done;
  int _atMs = 0;
  bool _fades = false;

  bool get running => _done != null;

  /// The newest picture a tile drawn now may have joined, or null for
  /// every tile: while a fade runs, the tiles ready since it began wait.
  int? get newest => running ? picture : null;

  /// How far the last picture has taken over, from 0 to 1, easing in and
  /// out.
  double get mix {
    final t = _done;
    return t == null ? 1 : t * t * (3 - 2 * t);
  }

  /// Begins the next picture at [nowMs].
  void start(int nowMs) {
    picture++;
    _done = 0;
    _atMs = nowMs;
  }

  /// Moves the fade on to [nowMs], before the sources cover the view, and
  /// ends it once it has run its time: in half of it when [pressed], while
  /// tiles in view wait for it to end, as they do one zoom level after
  /// another on a fast way down. Where tiles do not [fade], none runs.
  void advance(int nowMs, {required bool fades, required bool pressed}) {
    _fades = fades && milliseconds > 0;
    final done = _done;
    if (done == null) return;
    if (!_fades) {
      _done = null;
      return;
    }
    final share = (nowMs - _atMs) / milliseconds * (pressed ? 2 : 1);
    _atMs = nowMs;
    _done = done + share >= 1 ? null : done + share;
  }

  /// After [sources] covered the view at [nowMs] from [camera]: lets the
  /// tiles they show for the first time join, starting the next picture
  /// when one fades in, lays out what each source showed before it, and
  /// has the buildings of tiles fading in stand up as they do. Returns
  /// the tiles the frame fades from, or null when none fade, and whether
  /// buildings are still rising.
  ({TilesBefore? before, bool rising}) settle(
    List<TileSource> sources,
    MapFrame camera, {
    required int frame,
    required int nowMs,
    required void Function(LoadedTile tile, double scale) prepare,
  }) {
    var began = false;
    if (!running) {
      for (final s in sources) {
        if (_join(s, picture + 1, nowMs)) began = true;
      }
      if (began) start(nowMs);
    }
    TilesBefore? before;
    if (running) {
      for (final s in sources) {
        s.layBefore(
          camera,
          newest: picture - 1,
          frame: frame,
          nowMs: nowMs,
          prepare: prepare,
        );
        if (began) _standUp(s, picture, nowMs);
      }
      before = TilesBefore(
        [for (final s in sources) s.before.ideal],
        [for (final s in sources) s.before.fallback],
        [for (final s in sources) s.before.far],
        mix,
      );
    } else {
      for (final s in sources) {
        s.before.clear();
      }
    }
    var rising = false;
    for (final s in sources) {
      if (_rise(s, nowMs)) rising = true;
    }
    return (before: before, rising: rising);
  }

  /// Lets the tiles [source] shows for the first time join: as picture
  /// [next] when tiles fade and, for the ground, where the last frame
  /// showed their place, so that they fade in over what it showed there;
  /// else at once, standing whole at [nowMs]. Returns whether any joined
  /// [next].
  bool _join(TileSource source, int next, int nowMs) {
    var any = false;
    _LastView? last;
    final shown = source.shown;
    for (final d in shown.ideal.followedBy(shown.fallback)) {
      final tile = d.tile;
      if (tile.joined != null) continue;
      if (_fades && (last ??= _LastView(source.lastPicked)).showed(tile.id)) {
        tile.joined = next;
        any = true;
      } else {
        tile
          ..joined = 0
          ..standWhole(nowMs);
      }
    }
    for (final d in shown.far) {
      final tile = d.tile;
      if (tile.joined != null) continue;
      tile.joined = _fades ? next : 0;
      if (_fades) any = true;
    }
    return any;
  }

  /// Has the buildings of the tiles that joined [picture] at [nowMs] stand
  /// up from the ground as the tiles fade in, but for those where the
  /// picture before them already has buildings, which fade in whole over
  /// those.
  static void _standUp(TileSource source, int picture, int nowMs) {
    final before = source.before, shown = source.shown;
    final stood = [
      for (final d in before.ideal.followedBy(before.fallback))
        if (d.tile.extrusions.isNotEmpty) d,
      ...before.far,
    ];
    for (final d in shown.ideal.followedBy(shown.fallback)) {
      final tile = d.tile;
      if (tile.joined != picture || tile.stoodSinceMs != null) continue;
      if (stood.any(d.overlaps)) {
        tile.standWhole(nowMs);
      } else {
        tile.stoodSinceMs = nowMs;
      }
    }
  }

  /// Sinks the buildings of [source]'s tiles by how far they have yet to
  /// rise at [nowMs], so those of a tile fading in stand up from the
  /// ground as it does. Returns whether any is still rising.
  static bool _rise(TileSource source, int nowMs) {
    var rising = false;
    for (final picture in [source.shown, source.before]) {
      for (final d in picture.ideal.followedBy(picture.fallback)) {
        if (d.tile.extrusions.isEmpty) continue;
        d.sunk = d.tile.sunkAt(nowMs);
        if (d.sunk > 0) rising = true;
      }
    }
    return rising;
  }
}

/// The ground the last frame's view took: its tiles, and every tile over
/// them, by [tileKey].
class _LastView {
  _LastView(List<CoverTile> picked) {
    for (final t in picked) {
      final n = 1 << t.z;
      if (t.y < 0 || t.y >= n) continue;
      final x = t.x % n;
      _taken.add(tileKey(t.z, x, t.y));
      for (var up = 0; up <= t.z; up++) {
        if (!_over.add(tileKey(t.z - up, x >> up, t.y >> up))) break;
      }
    }
  }

  final Set<int> _taken = {}, _over = {};

  /// Whether the view showed any of tile [id]'s ground.
  bool showed(TileId id) {
    if (_over.contains(tileKey(id.z, id.x, id.y))) return true;
    for (var up = 1; up <= id.z; up++) {
      if (_taken.contains(tileKey(id.z - up, id.x >> up, id.y >> up))) {
        return true;
      }
    }
    return false;
  }
}
