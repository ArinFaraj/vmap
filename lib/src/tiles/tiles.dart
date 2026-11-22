import 'dart:math' as math;
import 'dart:ui' as ui;

import '../camera/camera.dart';
import '../trace.dart';
import 'extrusion.dart';
import 'far_buildings.dart';
import 'gpu_stream.dart';
import 'recent_peak.dart';
import '../labels/label_state.dart';
import '../render/map_renderer.dart';
import '../style/style_model.dart';
import 'built_tile.dart';
import 'tile_asks.dart';
import 'tile_layout.dart';
import 'worker.dart';
import 'tile_id.dart';
import '../camera/view.dart';

class LoadedTile {
  LoadedTile(this.id, BuiltTile built, this.sheet)
    : _built = built,
      extrusions = built.extrusions,
      gpu = built.gpu;

  /// The buildings to stand up on a tilted map.
  final List<BuiltExtrusion> extrusions;

  /// Whether any of [extrusions] has height.
  late final bool stands = () {
    for (final e in extrusions) {
      for (var i = 0; i < e.info.length; i += BuiltExtrusion.stride) {
        if (e.info[i] > 0) return true;
      }
    }
    return false;
  }();

  /// The fill and line layers for the GPU renderer, when it is on.
  final GpuStream? gpu;

  final TileId id;
  final StyleSheet sheet;
  BuiltTile? _built;

  /// The worker's meshes, which a renderer makes the tile drawable from;
  /// null once it is.
  List<BuiltMesh>? get builtMeshes => _built?.meshes;
  final List<LabelCandidate> labels = [];
  final Map<int, List<LabelCandidate>> _copies = {};

  /// [labels] in the copy of the world [wrap] worlds east, where the tile
  /// is also drawn: MapLibre places the labels of each copy on its own.
  List<LabelCandidate> labelsIn(int wrap) {
    if (wrap == 0) return labels;
    final copy = _copies[wrap];
    if (copy != null && copy.length == labels.length) return copy;
    return _copies[wrap] = [
      for (final l in labels)
        if (l case TileLabel(
          :final tile,
          :final tileX,
          :final tileY,
          :final tileSpan,
        ))
          TileLabel('w$wrap|${l.key}', tile, tileX + wrap, tileY, tileSpan),
    ];
  }

  int usedFrame = 0;

  /// The picture the tile joined as it first showed, counted as the fade
  /// between pictures counts them: 0 for one that showed with no fade,
  /// null until it shows.
  int? joined;

  /// Whether the tile is in a picture drawn from the tiles that joined one
  /// up to [newest], or from every tile when that is null.
  bool inPicture(int? newest) {
    final joined = this.joined;
    return newest == null || (joined != null && joined <= newest);
  }

  /// Whether this is a tile of the [keptZoom] coarsest levels, at most 21
  /// of them, which no cache drops: they stand in anywhere on the world,
  /// so a flight over ground not yet loaded never shows it bare.
  bool get standsIn => id.z <= keptZoom;

  /// How long the tile's buildings take to rise from the ground once they
  /// first stand.
  static const riseMs = 350;

  /// When the tile's buildings first stood in a frame, on the frames'
  /// clock, or null until they do. One made ready ahead of the camera has
  /// waited since, and its buildings rise when they show, not before.
  int? stoodSinceMs;

  /// Has the tile's buildings stand whole at [nowMs], unless they already
  /// do.
  void standWhole(int nowMs) {
    final stood = nowMs - riseMs, since = stoodSinceMs;
    if (since == null || since > stood) stoodSinceMs = stood;
  }

  /// How far the tile's buildings are still sunk at [nowMs]: 1 when they
  /// first stand, easing to 0 over [riseMs], and 0 before they first do.
  double sunkAt(int nowMs) {
    final since = stoodSinceMs;
    if (since == null) return 0;
    final left = 1 - ((nowMs - since) / riseMs).clamp(0.0, 1.0);
    return left * left * (3 - 2 * left);
  }

  /// What a renderer keeps for this tile, let go with it.
  RendererTileData? get rendererData => _rendererData;
  RendererTileData? _rendererData;

  /// Keeps [data] for the renderer that made it, until [releaseRenderer].
  void keepForRenderer(RendererTileData data) {
    assert(_rendererData == null);
    _rendererData = data;
  }

  /// Lets go of what the renderer kept, so the next [prepare] makes the
  /// tile ready for its renderer again.
  void releaseRenderer() {
    _rendererData?.dispose();
    _rendererData = null;
    _ready = false;
  }

  bool get prepared => _ready;
  bool _ready = false;

  /// Made ready once, then let go by its renderer, which makes it ready
  /// again if the tile still has what it is drawn from.
  bool get waitsForRenderer => !_ready && _built == null;

  int _labelAt = 0;

  /// Gets the tile ready to draw, so the first frame that draws it has
  /// nothing left to compute: its labels, and what [renderer] draws it
  /// from, at [scale] tile units to a pixel.
  /// Works in steps and returns once [clock] passes [deadline]; call again
  /// to continue.
  void prepare(
    double scale,
    Stopwatch clock,
    int deadline, {
    required MapRenderer renderer,
  }) {
    if (_ready) return;
    final built = _built;
    if (built != null && !_labels(built, clock, deadline)) return;
    if (!renderer.makeReady(this, scale, clock, deadline)) return;
    _built = null;
    _ready = true;
    traceInstant('vmap.tile.ready', () => {'id': '${id.z}/${id.x}/${id.y}'});
  }

  /// Puts [built] in place of the tile's labels, which come late when the
  /// glyph ranges they are measured with did.
  void replaceLabels(List<BuiltLabel> built) {
    final span = 1 / (1 << id.z);
    labels
      ..clear()
      ..addAll([
        for (final l in built)
          TileLabel(l.key, l, id.x * span, id.y * span, span),
      ]);
    _copies.clear();
  }

  bool _labels(BuiltTile built, Stopwatch clock, int deadline) {
    final span = 1 / (1 << id.z);
    final tx = id.x * span;
    final ty = id.y * span;
    while (_labelAt < built.labels.length) {
      final l = built.labels[_labelAt++];
      labels.add(TileLabel(l.key, l, tx, ty, span));
      if (_labelAt & 127 == 0 && clock.elapsedMicroseconds > deadline) {
        return false;
      }
    }
    return true;
  }

  void dispose() => releaseRenderer();
}

/// The tiles one picture of a source is drawn from.
class TilePicture {
  final List<TileDraw> ideal = [];
  final List<TileDraw> fallback = [];

  /// Tiles drawn for their buildings alone, where the ground under them
  /// is drawn by coarser tiles that carry none.
  final List<TileDraw> far = [];

  /// Tiles wanted that nothing loaded could stand in for.
  int uncovered = 0;

  /// Whether a tile in view was ready but left out, as it has joined no
  /// picture yet: it waits for the fade that runs to end.
  bool held = false;

  void clear() {
    ideal.clear();
    fallback.clear();
    far.clear();
    uncovered = 0;
    held = false;
  }
}

class TileDraw {
  TileDraw(this.tile, this.left, this.top, this.size);

  final LoadedTile tile;
  final double left;
  final double top;
  final double size;
  List<ui.Rect>? clips;

  /// How far into the ground the tile's buildings are still sunk, from 1
  /// to 0 once they stand.
  double sunk = 0;

  /// For a tile standing in for tiles still on their way, the style zooms
  /// its layout was built for, from the first to before the second: its
  /// layers show as at the nearest of them, so it keeps what it showed
  /// until they take its place. Null for a tile drawn as the view's own,
  /// and for one standing in for a tile that could not be had, which
  /// show the layers of the view's zoom, as MapLibre's.
  (double, double)? builtFor;

  /// The zoom this tile's layers are shown or hidden by in a frame at
  /// [styleZoom].
  double gate(double styleZoom) {
    final built = builtFor;
    if (built == null) return styleZoom;
    final (from, to) = built;
    if (styleZoom < from) return from;
    return styleZoom < to ? styleZoom : to - 1e-9;
  }

  /// Whether this and [other] cover some of the same ground.
  bool overlaps(TileDraw other) =>
      left < other.left + other.size - 0.5 &&
      other.left < left + size - 0.5 &&
      top < other.top + other.size - 0.5 &&
      other.top < top + size - 0.5;
}

/// The sources of [defs] in order: each one of [sources] with the same
/// signature kept when [keep], the rest made by [make] from its index, each
/// new one showing the tiles of the source of its name it replaces until
/// its own are ready. The sources not kept are disposed.
List<TileSource> reconcileSources(
  List<TileSource> sources,
  List<VectorSource> defs, {
  required bool keep,
  required TileSource Function(int index) make,
}) {
  final byName = <String, TileSource>{
    if (keep)
      for (final s in sources) s.def.name: s,
  };
  final kept = <String, TileSource>{
    if (keep)
      for (final s in sources) s.def.signature: s,
  };
  final next = <TileSource>[];
  for (var i = 0; i < defs.length; i++) {
    final def = defs[i];
    final reused = kept.remove(def.signature);
    if (reused != null) {
      next.add(reused);
      continue;
    }
    final made = make(i);
    if (byName[def.name] case final before?) made._takeOver(before);
    next.add(made);
  }
  for (final s in sources) {
    if (!next.contains(s)) s.dispose();
  }
  return next;
}

/// When each tile that failed may be asked for again.
class TileRetries {
  final Map<TileId, ({int atMs, int times})> _failed = {};

  /// Notes that tile [id] could not be had at [nowMs]. Data it could not
  /// read will not read better soon, so it waits the longest at once.
  void fail(TileId id, int nowMs, {required bool corrupt}) {
    final times = corrupt ? _doublings + 1 : (_failed[id]?.times ?? 0) + 1;
    _failed[id] = (atMs: nowMs, times: times);
  }

  /// Forgets that tile [id] failed, now that it loaded.
  void loaded(TileId id) => _failed.remove(id);

  static const _doublings = 7;

  /// Whether tile [id] failed too lately to ask for it again: three seconds
  /// after the first failure, twice as long after each one more, up to
  /// about six minutes, so a missing tile is not asked for over and over.
  bool resting(TileId id, int nowMs) {
    final f = _failed[id];
    if (f == null) return false;
    final wait = 3000 << (math.min(f.times, _doublings + 1) - 1);
    return nowMs - f.atMs < wait;
  }
}

/// The tiles of one of the style's sources.
class TileSource {
  TileSource(this.def, this.pool);

  /// Shows [before]'s tiles until this source's own are ready.
  void _takeOver(TileSource before) {
    previous
      ..addAll(before.previous)
      ..addAll(before.tiles);
    before.previous.clear();
    before.tiles.clear();
  }

  /// Keeps every tile shown, as one that changed, until it is built again.
  void rebuildAll() {
    for (final MapEntry(:key, :value) in tiles.entries) {
      previous.remove(key)?.dispose();
      previous[key] = value;
    }
    tiles.clear();
  }

  final VectorSource def;
  final TilePool pool;
  final Map<TileId, LoadedTile> tiles = {};

  /// Tiles of the data this source had before it changed, shown until the
  /// tiles of the new data are ready.
  final Map<TileId, LoadedTile> previous = {};
  final TileRetries retries = TileRetries();

  /// What the view shows this frame.
  final TilePicture shown = TilePicture();

  /// What the view showed before the tiles now fading in joined it, laid
  /// out by [layBefore].
  final TilePicture before = TilePicture();

  /// The tiles the view took this frame, and the frame before.
  List<CoverTile> picked = const [], lastPicked = const [];

  /// How far the buildings past the ground tiles stand this frame, or null
  /// where none do.
  BuildingReach? farReach;

  /// Tiles this frame wanted that are not here, the most needed first.
  final List<(TileId, double)> missing = [];

  /// The tiles asked for this frame: those the view needs now or within
  /// the time a tile takes to come, and those for later.
  final Set<TileId> wantedNow = {}, wantedLater = {};
  bool _hadWanted = false;

  /// A tile that failed is being held back before it is asked for again.
  bool retrying = false;
  int maxDataZoom = 14;

  void dispose() {
    pool.close();
    for (final t in tiles.values) {
      t.dispose();
    }
    tiles.clear();
    dropPrevious();
  }

  void dropPrevious() {
    for (final t in previous.values) {
      t.dispose();
    }
    previous.clear();
  }

  /// Keeps [tile], just built, in place of the tile of its id. One built
  /// again from changed data or for a changed style shows at once:
  /// fading, it would trail behind data that changes with every frame.
  void put(LoadedTile tile) {
    final replaced = tiles[tile.id];
    replaced?.dispose();
    if (previous.containsKey(tile.id) || replaced?.joined != null) {
      tile.joined = 0;
    }
    tiles[tile.id] = tile;
  }

  /// The tile [t] of a cover is, or null off the top or bottom of the
  /// world.
  TileId? idOf(CoverTile t) {
    final n = 1 << t.z;
    if (t.y < 0 || t.y >= n) return null;
    return TileId(t.z, t.x % n, t.y, over: t.z >= maxDataZoom ? t.over : 0);
  }

  /// Works out which of the source's tiles cover the view, asks for the
  /// missing ones, and returns whether a tile is still being prepared. A
  /// tilted view takes tiles nearer the camera at the view's zoom, farther
  /// ones a level or more coarser. With [farBuildings], the tiles whose
  /// buildings stand within it over that coarser ground are drawn too.
  /// Only tiles that joined a picture up to [newest] are drawn, or every
  /// tile when it is null; the others wait.
  bool cover(
    MapFrame camera,
    double dataZoom, {
    required int frame,
    required int nowMs,
    required void Function(LoadedTile tile, double scale) prepare,
    bool variableZoom = false,
    bool standing = false,
    BuildingReach? farBuildings,
    int? newest,
  }) {
    retrying = false;
    maxDataZoom = pool.coverMaxZoom;
    final view = camera.view;
    lastPicked = picked;
    picked = view.cover(
      maxZoom: maxDataZoom,
      variableZoom: variableZoom,
      beyond: variableZoom ? view.height : 0,
      standing: standing ? view.standingFor() : 0,
    );
    farReach = farBuildings;
    final layout = TileLayout(
      this,
      shown,
      newest: newest,
      frame: frame,
      nowMs: nowMs,
      prepare: prepare,
    );
    final ground = layout.lay(camera, picked);
    if (ground.covered && !ground.waiting) dropPrevious();
    final far = farBuildings == null
        ? null
        : layFarBuildings(layout, camera, farBuildings);
    missing
      ..clear()
      ..addAll(ground.missing)
      ..sort((a, b) => a.$2.compareTo(b.$2));
    TileAsks(this, frame: frame, nowMs: nowMs, prepare: prepare).ask(
      camera,
      [for (final (id, _) in missing) id],
      far: far?.missing ?? const [],
      variableZoom: variableZoom,
    );
    for (final t in picked) {
      if (t.z == 0) continue;
      if (idOf(t) case final id?) tiles[id.parent]?.usedFrame = frame;
    }
    final wanting = wantedNow.isNotEmpty || wantedLater.isNotEmpty;
    if (wanting || _hadWanted || pool.loading) {
      pool.want([...wantedNow], later: [...wantedLater]);
    }
    _hadWanted = wanting;
    return ground.waiting || (far?.waiting ?? false);
  }

  /// Lays [before] out from the view [cover] took this frame, with the
  /// tiles that joined a picture up to [newest].
  void layBefore(
    MapFrame camera, {
    required int newest,
    required int frame,
    required int nowMs,
    required void Function(LoadedTile tile, double scale) prepare,
  }) {
    final layout = TileLayout(
      this,
      before,
      newest: newest,
      frame: frame,
      nowMs: nowMs,
      prepare: prepare,
    )..lay(camera, picked);
    if (farReach case final reach?) layFarBuildings(layout, camera, reach);
  }

  /// Drops the tiles a renderer let go of that [canBuild] says it cannot
  /// make ready again, so they are fetched again when the view wants them.
  void dropSpent(bool Function(LoadedTile tile) canBuild) {
    for (final held in [tiles, previous]) {
      held.removeWhere((_, tile) {
        if (!tile.waitsForRenderer || canBuild(tile)) return false;
        tile.dispose();
        return true;
      });
    }
  }

  final _screen = RecentPeak();

  /// As MapLibre sizes its tile cache: about five screens of tiles, so
  /// panning back or zooming out and in again finds them built. A screen is
  /// the most tiles the view showed at once lately.
  void evictBeyondScreens(int atLeast, int frame, int nowMs) {
    final screen =
        shown.ideal.length + shown.fallback.length + shown.far.length;
    evict(math.max(atLeast, 5 * _screen.of(screen, nowMs)), frame);
  }

  /// Drops the tiles longest out of use until at most [keep] are held,
  /// but for those that [LoadedTile.standsIn].
  void evict(int keep, int frame) {
    if (tiles.length <= keep) return;
    final stale =
        tiles.values.where((t) => t.usedFrame != frame && !t.standsIn).toList()
          ..sort((a, b) => a.usedFrame - b.usedFrame);
    for (final t in stale) {
      if (tiles.length <= keep) break;
      tiles.remove(t.id);
      t.dispose();
    }
  }
}
