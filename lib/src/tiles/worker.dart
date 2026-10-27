import 'dart:developer' show Timeline;
import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';

import 'cluster.dart';
import 'geojson.dart';
import 'mlt.dart';
import 'mvt.dart';
import 'query.dart';
import 'pmtiles.dart';
import 'protocol.dart';
import '../options.dart';
import 'tile_id.dart';
import 'tile_slice.dart';
import '../text/glyphs/glyph_ranges.dart';
import '../text/glyphs/glyph_layout.dart';
import '../style/sprite_sizes.dart';
import '../style/style_model.dart';
import 'tile_builder.dart';
import 'built_tile.dart';
import 'tile_store.dart';
import '../net/net.dart';
import '../platform.dart';

typedef TileLoaded = void Function(TileId id, BuiltTile tile);
typedef TileFailed = void Function(TileId id, TileFailure failure);

/// Downloads, decodes and tessellates tiles on background isolates, so none of
/// it runs on the UI thread.
class TilePool {
  TilePool(
    this.config, {
    required this.style,
    required this.nameKeys,
    required this.sheet,
    required this.source,
    required this.onLoaded,
    required this.onFailed,
    this.onRelabeled,
    this.script,
    required this.shared,
    this.fonts,
    this.families,
    this.gpu = false,
  }) : maxZoom =
           sheet.sources[source].maxZoom ??
           sheet.sources[source].defaultMaxZoom {
    _starting = _start();
  }

  final VmapNetworkOptions config;

  /// What the page fetches once for every worker.
  final FetchBytes shared;

  /// The fonts the workers shape labels with, or null, and their families.
  final List<Uint8List>? fonts;
  final List<String>? families;

  /// Whether the workers build GPU streams too.
  final bool gpu;

  /// In a browser, the script the workers run, or null to build tiles on
  /// the page's thread.
  final String? script;

  /// The style document the workers build tiles for, and its compiled form.
  final Map<String, Object?> style;
  final List<String>? nameKeys;
  final StyleSheet sheet;

  /// Which of the style's sources this pool loads.
  final int source;

  VectorSource get _def => sheet.sources[source];

  /// The deepest zoom the source has tiles for.
  int maxZoom;

  /// The deepest zoom the source's tiles are drawn from: past [maxZoom]
  /// a tiled source's tiles are cut from its deepest ones down to
  /// [splitZoom], and only past that drawn scaled, as MapLibre's.
  int get coverMaxZoom =>
      _def is TiledSource ? math.max(maxZoom, splitZoom) : maxZoom;
  final TileLoaded onLoaded;
  final TileFailed onFailed;

  /// Takes the labels of a tile sent before its glyph ranges arrived.
  final TileLoaded? onRelabeled;

  static const int _perWorker = 6;

  final List<_Worker> _workers = [];
  final Map<int, TileId> _inflight = {};
  final Map<int, _Worker> _jobWorker = {};
  final Set<TileId> _inflightIds = {};

  /// Jobs called off, whose failure is no failure of the tile.
  final Set<int> _cancelling = {};

  /// When each job's tile was first left out of the wanted tiles. One the
  /// camera has left, or coarser than the tiles now wanted, which come
  /// soon, is called off after [_leftMs]; one finer than them, over the
  /// ground in view as the camera rises, after [_overViewMs], for it can
  /// stand in for them while they load.
  final Map<int, int> _unwanted = {};
  static const _leftMs = 100, _overViewMs = 300;

  List<TileId> _wanted = const [];
  int _nextJob = 0;
  bool _closed = false;
  Future<void>? _starting;
  Object? startError;

  /// The credit the source's TileJSON asks for, once it has been read.
  String? attribution;

  /// Longest the UI isolate spent unpacking one finished tile, in
  /// microseconds, since this was last read.
  int takeMaxUnpackMicros() {
    final longest = _maxUnpackMicros;
    _maxUnpackMicros = 0;
    return longest;
  }

  int _maxUnpackMicros = 0;
  final Stopwatch _clock = Stopwatch()..start();

  bool isLoading(TileId id) => _inflightIds.contains(id);

  /// Whether any tile is being loaded.
  bool get loading => _inflight.isNotEmpty;

  /// Tiles to load, most urgent first. Replaces the previous list. Tiles
  /// being loaded that stay out of it are called off, as MapLibre aborts
  /// the tiles it no longer keeps, so the view's own tiles get the
  /// connection.
  void want(List<TileId> ids) {
    _wanted = ids;
    _starting ??= _start();
    if (_inflight.isNotEmpty) {
      final still = ids.toSet();
      final wantedKeys = {for (final w in ids) tileKey(w.z, w.x, w.y)};
      bool overView(TileId t) {
        for (var up = 0; up <= t.z; up++) {
          if (wantedKeys.contains(tileKey(t.z - up, t.x >> up, t.y >> up))) {
            return true;
          }
        }
        return false;
      }

      final now = _clock.elapsedMilliseconds;
      for (final MapEntry(key: job, value: id) in _inflight.entries) {
        if (still.contains(id) || _cancelling.contains(job)) {
          _unwanted.remove(job);
          continue;
        }
        final grace = overView(id) ? _overViewMs : _leftMs;
        if (now - (_unwanted[job] ??= now) < grace) continue;
        _unwanted.remove(job);
        _cancelling.add(job);
        _jobWorker[job]?.link.send(CancelTile(job).toWire());
      }
    }
    _dispatch();
  }

  /// The data tile [id] is built from: past the deepest zoom, pieces of one
  /// tile share its download.
  int _dataKey(TileId id) {
    final d = math.max(0, id.z - maxZoom);
    return tileKey(id.z - d, id.x >> d, id.y >> d);
  }

  /// Where the tiles of the address this pool is using are kept.
  TileStore? _store;

  /// Whether the server has confirmed [_template] in this run. Until it has,
  /// only tiles already on disk are loaded: the address changes with every
  /// tile set the server publishes, and one remembered from an earlier run
  /// may no longer answer.
  bool _confirmed = false;
  final Set<TileId> _notOnDisk = {};

  /// Where the tile address [tileJsonUrl] last answered is kept.
  String? _templateFile(String tileJsonUrl) => config.cacheDirectory == null
      ? null
      : '${config.cacheDirectory}/source-${cacheKey(tileJsonUrl)}.txt';

  /// Starts on the address remembered from the last run, so tiles on disk
  /// show without waiting for the network, and asks the server for the
  /// current one meanwhile.
  Future<void> _start() async {
    startError = null;
    try {
      final def = _def;
      final tileJsonUrl = def is TiledSource ? def.tileJsonUrl : null;
      final direct = switch (def) {
        GeoJsonSource() => 'geojson',
        TiledSource(:final tiles?) => tiles,
        TiledSource() when PmTiles.handles(tileJsonUrl) => tileJsonUrl,
        TiledSource() => null,
      };
      if (direct != null || tileJsonUrl == null) {
        if (direct == null) {
          throw StateError('The source ${_def.name} has no tiles');
        }
        if (PmTiles.handles(direct) && def.maxZoom == null) {
          final archive = PmTiles(
            direct,
            userAgent: config.userAgent,
            headers: config.headers,
          );
          try {
            maxZoom = await archive.maxZoom;
          } finally {
            archive.close();
          }
        }
        _use(direct);
        _confirmed = true;
        await _spawnWorkers(direct);
        _dispatch();
        return;
      }
      final file = _templateFile(tileJsonUrl);
      String? remembered;
      if (file != null && fileExists(file)) {
        final saved = utf8.decode(await readFile(file)).split('\n');
        remembered = saved.first;
        if (saved.length > 1) maxZoom = int.tryParse(saved[1]) ?? maxZoom;
        if (saved.length > 2 && saved[2].isNotEmpty) attribution = saved[2];
      }
      // The workers start while the TileJSON is asked for, and are told
      // the address once it is known.
      final spawned = _spawnWorkers(remembered ?? '');
      final fetched = _fetchTemplate(tileJsonUrl);
      await spawned;
      if (_closed) return;
      if (remembered != null) {
        _use(remembered);
        _dispatch();
      }

      String? current;
      try {
        current = await fetched;
      } catch (_) {
        if (remembered == null) rethrow;
      }
      if (_closed) return;
      if (current != null && current != remembered) {
        _stale.addAll(_inflight.keys);
        for (final w in _workers) {
          w.link.send(UseTemplate(current).toWire());
        }
        _use(current);
        final directory = config.cacheDirectory;
        if (remembered != null && directory != null) {
          final stale = TileStore.vectorFolder(remembered);
          unawaited(deleteCached(directory, (name) => name == stale));
        }
      }
      _confirmed = true;
      _notOnDisk.clear();
      _dispatch();
    } catch (e) {
      startError = e;
      _starting = null;
    }
  }

  void _use(String template) {
    _store?.close();
    _store = switch (_def) {
      GeoJsonSource() => null,
      TiledSource(:final cover) => TileStore.vector(
        template,
        cover: cover,
        config: config,
        perHost: 6,
      ),
    };
  }

  Future<void> _spawnWorkers(String template) async {
    final workers = await Future.wait([
      for (var i = 0; i < (_def is GeoJsonSource ? 1 : config.workers); i++)
        _spawnWorker(i, template),
    ]);
    if (_closed) {
      for (final w in workers) {
        w.close();
      }
      return;
    }
    _workers.addAll(workers);
  }

  Future<_Worker> _spawnWorker(int index, String template) async {
    final worker = _Worker();
    worker.link = await startWorker(
      tileWorkerMain,
      WorkerSetup(
        template: template,
        config: config,
        style: style,
        nameKeys: nameKeys,
        zoomOffset: sheet.zoomOffset,
        source: source,
        fonts: fonts,
        families: families,
        gpu: gpu,
      ).toWire(),
      (message) {
        switch (WorkerReply.fromWire(message! as List<Object?>)) {
          case final TileOutcome outcome:
            _onResult(worker, outcome);
          case FetchWanted(:final url):
            _sendFetched(worker, url);
          case TileRelabeled(:final tile, :final labels):
            if (!_closed) onRelabeled?.call(tile, labels);
          case final reply:
            _queries.remove(reply.job)?.complete(reply);
        }
      },
      script: script,
      debugName: 'vmap-tiles-$source-$index',
    );
    if (_states.isNotEmpty) _sendStates(worker);
    return worker;
  }

  Future<void> _sendFetched(_Worker worker, String url) async {
    Uint8List? bytes;
    try {
      bytes = await shared(url);
    } catch (_) {}
    if (!_closed) worker.link.send(Fetched(url, bytes).toWire());
  }

  Future<String> _fetchTemplate(String tileJsonUrl) async {
    final client = Net(userAgent: config.userAgent);
    try {
      final reply = await client.get(
        tileJsonUrl,
        config.headers,
        timeout: const Duration(seconds: 10),
      );
      final json = jsonDecode(utf8.decode(reply.bytes)) as Map<String, dynamic>;
      final template = tileTemplate(json['tiles'])!;
      final deepest = json['maxzoom'];
      if (deepest is num) maxZoom = deepest.toInt();
      if (json['attribution'] case final String credit) {
        attribution = credit.replaceAll('\n', ' ');
      }
      final file = _templateFile(tileJsonUrl);
      if (file != null) {
        await writeFile(
          file,
          utf8.encode('$template\n$maxZoom\n${attribution ?? ''}'),
        );
      }
      return template;
    } finally {
      client.close();
    }
  }

  /// Fetches tile [id] into the cache directory unless it is there already,
  /// and returns whether it had to. A source with nothing to keep (data
  /// held by the style, an archive on this device) answers false.
  Future<bool> keep(TileId id) async {
    await _starting;
    if (startError case final error?) throw error;
    final store = _store;
    if (store == null) return false;
    final d = math.max(0, id.z - maxZoom);
    return store.keep(id.z - d, id.x >> d, id.y >> d);
  }

  bool _onDisk(TileId id) {
    if (_notOnDisk.contains(id)) return false;
    final d = math.max(0, id.z - maxZoom);
    final found = _store?.onDisk(id.z - d, id.x >> d, id.y >> d) ?? false;
    if (!found) _notOnDisk.add(id);
    return found;
  }

  void _dispatch() {
    if (_workers.isEmpty || _closed) return;
    final loadingFrom = <int, _Worker>{
      for (final MapEntry(key: job, value: id) in _inflight.entries)
        _dataKey(id): ?_jobWorker[job],
    };
    for (final id in _wanted) {
      if (_inflightIds.contains(id)) continue;
      if (!_confirmed && !_onDisk(id)) continue;
      final key = _dataKey(id);
      // A tile whose data another job is downloading goes to that job's
      // worker, which shares the download, and costs no bandwidth.
      var free = loadingFrom[key];
      if (free != null && free.busy >= 2 * _perWorker) continue;
      if (free == null) {
        for (final w in _workers) {
          if (w.busy < _perWorker && (free == null || w.busy < free.busy)) {
            free = w;
          }
        }
        if (free == null) continue;
      }
      final job = _nextJob++;
      _inflight[job] = id;
      _jobWorker[job] = free;
      _inflightIds.add(id);
      loadingFrom[key] = free;
      Timeline.instantSync(
        'vmap.tile.asked',
        arguments: {'id': '${id.z}/${id.x}/${id.y}'},
      );
      free.busy++;
      free.link.send(BuildTile(job, id, maxZoom: maxZoom).toWire());
    }
  }

  List<(Object?, Map<String, Object?>)> _states = const [];

  /// Jobs started before the states changed, whose tiles are dropped.
  final Set<int> _stale = {};

  /// Builds tiles with the state the app gave each feature from now on;
  /// tiles being built already are built again.
  void useStates(List<(Object?, Map<String, Object?>)> states) {
    _states = states;
    for (final w in _workers) {
      _sendStates(w);
    }
    _stale.addAll(_inflight.keys);
  }

  void _sendStates(_Worker worker) =>
      worker.link.send(UseStates(_nextJob++, _states).toWire());

  void _onResult(_Worker worker, TileOutcome outcome) {
    worker.busy--;
    final job = outcome.job;
    final id = _inflight.remove(job);
    _jobWorker.remove(job);
    _unwanted.remove(job);
    final calledOff = _cancelling.remove(job);
    if (id == null || _closed) return;
    _inflightIds.remove(id);
    if (_stale.remove(job) || (calledOff && outcome is TileNotBuilt)) {
      _dispatch();
      return;
    }
    _wanted = [
      for (final w in _wanted)
        if (w != id) w,
    ];
    switch (outcome) {
      case TileNotBuilt(:final failure):
        onFailed(id, failure);
      case TileBuilt(:final tile):
        final started = _clock.elapsedMicroseconds;
        onLoaded(id, tile);
        final spent = _clock.elapsedMicroseconds - started;
        if (spent > _maxUnpackMicros) _maxUnpackMicros = spent;
    }
    _dispatch();
  }

  final Map<int, Completer<WorkerReply?>> _queries = {};

  /// The features of tile [id] within [radius] tile units of ([x], [y])
  /// that the style draws at [styleZoom], or with a [box] of half a width
  /// and half a height, those touching the box of that size around it.
  Future<List<TileHit>> query(
    TileId id,
    double x,
    double y,
    double radius,
    double styleZoom, {
    (double, double)? box,
  }) async => switch (await _ask(
    (job) => FindInTile(
      job,
      id,
      x: x,
      y: y,
      radius: radius,
      styleZoom: styleZoom,
      box: box,
    ),
  )) {
    FeaturesFound(:final hits) => hits,
    _ => const [],
  };

  /// The zoom at which cluster [id] of a clustered GeoJSON source comes
  /// apart, or null when there is no such cluster.
  Future<int?> clusterZoom(int id) async => switch (await _ask(
    (job) => AskCluster(job, ClusterQuestion.zoom, clusterId: id),
  )) {
    ClusterZoom(:final zoom) => zoom,
    _ => null,
  };

  /// What cluster [id] comes apart into, or the points of the data in it.
  Future<List<ClusterMember>> clusterMembers(
    ClusterQuestion question,
    int id, {
    int limit = 0,
    int offset = 0,
  }) async => switch (await _ask(
    (job) =>
        AskCluster(job, question, clusterId: id, limit: limit, offset: offset),
  )) {
    ClusterMembers(:final members) => members,
    _ => const [],
  };

  Future<WorkerReply?> _ask(WorkerRequest Function(int job) question) async {
    await _starting;
    if (_workers.isEmpty || _closed) return null;
    final job = _nextJob++;
    final done = _queries[job] = Completer();
    _workers.first.link.send(question(job).toWire());
    return done.future.timeout(
      const Duration(seconds: 10),
      onTimeout: () {
        _queries.remove(job);
        return null;
      },
    );
  }

  void close() {
    _closed = true;
    _store?.close();
    for (final q in _queries.values) {
      q.complete(null);
    }
    _queries.clear();
    for (final w in _workers) {
      w.close();
    }
    _workers.clear();
  }
}

class _Worker {
  late final Worker link;
  int busy = 0;

  void close() => link.close();
}

/// What a tile worker runs: it builds the tiles it is asked for and answers
/// lookups in them.
Future<void> tileWorkerMain(
  List<Object?> init,
  void Function(Object? message) send,
  Stream<Object?> inbox,
) async {
  final setup = WorkerSetup.fromWire(init);
  final client = Net(userAgent: setup.config.userAgent, perHost: 4);
  final sheet = StyleSheet.compile(
    setup.style,
    nameKeys: setup.nameKeys,
    zoomOffset: setup.zoomOffset,
  );
  final source = setup.source;
  final def = sheet.sources[source];
  final fonts = setup.fonts;
  final glyphs = sheet.glyphs;
  // Without fonts the labels are drawn from the style's glyph ranges, and
  // names along lines are measured with them, as MapLibre measures them.
  final asked = <String, Completer<Uint8List?>>{};
  Future<Uint8List?> fromPage(String url) {
    final waiting = asked[url];
    if (waiting != null) return waiting.future;
    final made = asked[url] = Completer<Uint8List?>();
    send(FetchWanted(url).toWire());
    return made.future;
  }

  final ranges = fonts == null && glyphs != null
      ? GlyphRanges(
          glyphs,
          onLoaded: (_, _) {},
          userAgent: setup.config.userAgent,
          headers: setup.config.headers,
          fetch: fromPage,
        )
      : null;
  ranges?.prefetch(sheet);
  final builder = TileBuilder(
    sheet,
    source: source,
    fonts: fonts == null ? null : GlyphFonts(fonts, families: setup.families),
    gpu: setup.gpu,
    ranges: ranges,
  );
  void answer(WorkerReply reply) => send(reply.toWire());
  // Icons along a line are spaced by their size, read once from the
  // style's sprite indexes before the first tile is built.
  final iconSizes = sheet.spriteSheets.isEmpty
      ? null
      : spriteSizes(
          sheet.spriteSheets,
          fromPage,
        ).then((sizes) => builder.iconSizes = sizes);

  Future<GeoJsonTiles>? geoJson;
  TileStore? store;
  if (def is GeoJsonSource) {
    final data = def.data;
    GeoJsonTiles tiles(Object? json) => GeoJsonTiles(
      json,
      cluster: def.cluster,
      promoteId: def.idKey(''),
      generateId: def.generateId,
      filter: def.filter,
      buffer: def.buffer,
    );
    geoJson = () async {
      if (data is! String) return tiles(data);
      try {
        final reply = await client.get(data, setup.config.headers);
        return tiles(jsonDecode(utf8.decode(reply.bytes)));
      } catch (_) {
        return GeoJsonTiles(null);
      }
    }();
  }

  /// The bytes of the tiles built last, which a lookup reads again.
  final recent = <int, Uint8List>{};
  final storeReady = Completer<void>();
  void useTemplate(String template) {
    if (def is! TiledSource) return;
    store?.close();
    store = TileStore.vector(template, cover: def.cover, config: setup.config);
    recent.clear();
    if (!storeReady.isCompleted) storeReady.complete();
  }

  if (setup.template.isNotEmpty) useTemplate(setup.template);

  // A download shared by every job building from the same data tile,
  // aborted once all of them are called off.
  final loading =
      <int, ({Future<Uint8List> bytes, Cancel cancel, Set<int> jobs})>{};
  final building = <int>{}, cancelled = <int>{};

  Future<Uint8List> fetch(TileId id, int? job) async {
    final key = tileKey(id.z, id.x, id.y);
    final kept = recent.remove(key);
    if (kept != null) {
      recent[key] = kept;
      return kept;
    }
    var load = loading[key];
    if (load == null) {
      final cancel = Cancel();
      final bytes = () async {
        if (store == null) await storeReady.future;
        final bytes =
            await store!.read(id.z, id.x, id.y, cancel: cancel) ?? Uint8List(0);
        recent[key] = bytes;
        if (recent.length > 24) recent.remove(recent.keys.first);
        return bytes;
      }();
      load = loading[key] = (bytes: bytes, cancel: cancel, jobs: {});
      unawaited(
        bytes.then<void>((_) {}, onError: (_) {}).whenComplete(() {
          if (identical(loading[key]?.bytes, bytes)) loading.remove(key);
        }),
      );
    }
    load.jobs.add(job ?? -1);
    return load.bytes;
  }

  void cancelJob(int job) {
    if (!building.contains(job)) return;
    cancelled.add(job);
    for (final load in loading.values) {
      if (load.jobs.remove(job) && load.jobs.isEmpty) load.cancel.cancel();
    }
  }

  // The source's deepest zoom, as the pool last told it.
  var dataMaxZoom = def.maxZoom ?? def.defaultMaxZoom;

  Future<Iterable<TileLayer>> layersOf(TileId id, [int? job]) async {
    if (geoJson != null) return (await geoJson).tile(id.z, id.x, id.y);
    if (id.z > dataMaxZoom) {
      final d = id.z - dataMaxZoom;
      final from = TileId(dataMaxZoom, id.x >> d, id.y >> d);
      return sliceLayers(await layersOf(from, job), from, id);
    }
    final bytes = await fetch(id, job);
    if (job != null && cancelled.contains(job)) throw const Cancelled();
    if (bytes.isEmpty) return const <TileLayer>[];
    return def is TiledSource && def.mlt
        ? decodeMltTile(bytes)
        : MvtTile.decode(bytes).layers.values;
  }

  Future<WorkerReply?> reply(WorkerRequest request) async {
    switch (request) {
      case UseStates(:final states):
        builder.states = {for (final (id, state) in states) id: state};
        return null;
      case UseTemplate(:final template):
        useTemplate(template);
        return null;
      case CancelTile(:final job):
        cancelJob(job);
        return null;
      case Fetched(:final url, :final bytes):
        final waiting = asked[url];
        if (waiting != null && !waiting.isCompleted) waiting.complete(bytes);
        return null;
      case BuildTile(:final job, :final tile, :final maxZoom):
        dataMaxZoom = maxZoom;
        building.add(job);
        try {
          final fetched = Timeline.now;
          final layers = await layersOf(tile, job);
          Timeline.instantSync(
            'vmap.tile.fetched',
            arguments: {
              'id': '${tile.z}/${tile.x}/${tile.y}',
              'ms': '${(Timeline.now - fetched) ~/ 1000}',
            },
          );
          final building = Timeline.now;
          BuiltTile build() =>
              builder.buildLayers(
                layers,
                tile.z,
                x: tile.x,
                y: tile.y,
                maxZoom: geoJson == null
                    ? math.max(maxZoom, splitZoom)
                    : maxZoom,
                over: tile.over,
              )..keyLabels(
                tile.z,
                tile.x,
                tile.y,
                grid: geoJson == null ? 1024 : 1 << 24,
              );
          if (iconSizes != null) await iconSizes;
          var built = layers.isEmpty ? BuiltTile(const [], const []) : build();
          if (layers.isNotEmpty && builder.missedGlyphs && ranges != null) {
            // The ranges some names were measured without are on their way:
            // the tile goes now without names, and its names follow once
            // the ranges land, measured where MapLibre puts them.
            unawaited(() async {
              for (var i = 0; i < 300 && ranges.pending > 0; i++) {
                await Future<void>.delayed(const Duration(milliseconds: 10));
              }
              final labelled = build();
              answer(TileRelabeled(tile, BuiltTile(const [], labelled.labels)));
            }());
            built = BuiltTile(
              built.meshes,
              const [],
              built.extrusions,
              built.gpu,
            );
          }
          Timeline.instantSync(
            'vmap.tile.built',
            arguments: {
              'id': '${tile.z}/${tile.x}/${tile.y}',
              'ms': '${(Timeline.now - building) ~/ 1000}',
            },
          );
          return TileBuilt(job, built);
        } on Cancelled {
          return TileNotBuilt(
            job,
            const TileFailure('cancelled', corrupt: false),
          );
        } catch (e) {
          return TileNotBuilt(
            job,
            TileFailure('$e', corrupt: e is FormatException),
          );
        } finally {
          building.remove(job);
          cancelled.remove(job);
        }
      case final FindInTile find:
        try {
          return FeaturesFound(
            find.job,
            queryTile(
              await layersOf(find.tile),
              sheet,
              source,
              find.x,
              find.y,
              find.radius,
              find.styleZoom,
              box: find.box,
            ),
          );
        } catch (_) {
          return FeaturesFound(find.job, const []);
        }
      case final AskCluster ask:
        final id = ask.clusterId;
        try {
          final clusters = geoJson == null ? null : (await geoJson).clusters;
          return switch (ask.question) {
            ClusterQuestion.zoom => ClusterZoom(
              ask.job,
              clusters?.expansionZoom(id),
            ),
            ClusterQuestion.children => ClusterMembers(
              ask.job,
              _members(clusters?.children(id)),
            ),
            ClusterQuestion.leaves => ClusterMembers(
              ask.job,
              _members(
                clusters?.leaves(id, limit: ask.limit, offset: ask.offset),
              ),
            ),
          };
        } catch (_) {
          return ask.question == ClusterQuestion.zoom
              ? ClusterZoom(ask.job, null)
              : ClusterMembers(ask.job, const []);
        }
    }
  }

  await for (final message in inbox) {
    unawaited(
      reply(WorkerRequest.fromWire(message! as List<Object?>)).then((r) {
        if (r != null) answer(r);
      }),
    );
  }
}

List<ClusterMember> _members(List<ClusterPoint>? points) => [
  for (final p in points ?? const <ClusterPoint>[])
    ClusterMember(p.x, p.y, p.props),
];
