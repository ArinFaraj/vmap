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
import 'options.dart';
import 'tile_id.dart';
import 'tile_slice.dart';
import 'glyphs/glyph_ranges.dart';
import 'glyphs/glyph_layout.dart';
import 'sprite_sizes.dart';
import 'style_model.dart';
import 'tile_builder.dart';
import 'tile_store.dart';
import 'net.dart';
import 'platform.dart';

typedef TileLoaded = void Function(TileId id, BuiltTile tile);
typedef TileFailed = void Function(TileId id, Object error);

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
    this.script,
    this.fonts,
    this.families,
    this.gpu = false,
  }) : maxZoom =
           sheet.sources[source].maxZoom ??
           sheet.sources[source].defaultMaxZoom {
    _starting = _start();
  }

  final VmapNetworkOptions config;

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

  static const int _perWorker = 6;

  final List<_Worker> _workers = [];
  final Map<int, TileId> _inflight = {};
  final Set<TileId> _inflightIds = {};
  List<TileId> _wanted = const [];
  int _nextJob = 0;
  bool _closed = false;
  Future<void>? _starting;
  Object? startError;

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

  /// Tiles to load, most urgent first. Replaces the previous list; tiles
  /// already being fetched are left to finish.
  void want(List<TileId> ids) {
    _wanted = ids;
    _starting ??= _start();
    _dispatch();
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
      }
      if (remembered != null) {
        _use(remembered);
        await _spawnWorkers(remembered);
        if (_closed) return;
        _dispatch();
      }

      String? current;
      try {
        current = await _fetchTemplate(tileJsonUrl);
      } catch (_) {
        if (remembered == null) rethrow;
      }
      if (_closed) return;
      if (current != null && current != remembered) {
        for (final w in _workers) {
          w.close();
        }
        _workers.clear();
        _inflight.clear();
        _inflightIds.clear();
        _stale.clear();
        _use(current);
        await _spawnWorkers(current);
        if (_closed) return;
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
      final file = _templateFile(tileJsonUrl);
      if (file != null) {
        await writeFile(file, utf8.encode('$template\n$maxZoom'));
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
    for (final id in _wanted) {
      if (_inflightIds.contains(id)) continue;
      if (!_confirmed && !_onDisk(id)) continue;
      _Worker? free;
      for (final w in _workers) {
        if (w.busy < _perWorker && (free == null || w.busy < free.busy)) {
          free = w;
        }
      }
      if (free == null) return;
      final job = _nextJob++;
      _inflight[job] = id;
      _inflightIds.add(id);
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
    final id = _inflight.remove(outcome.job);
    if (id == null || _closed) return;
    _inflightIds.remove(id);
    if (_stale.remove(outcome.job)) {
      _dispatch();
      return;
    }
    _wanted = [
      for (final w in _wanted)
        if (w != id) w,
    ];
    switch (outcome) {
      case TileNotBuilt(:final error):
        onFailed(id, error);
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
  final ranges = fonts == null && glyphs != null
      ? GlyphRanges(
          glyphs,
          onLoaded: (_, _) {},
          userAgent: setup.config.userAgent,
          headers: setup.config.headers,
        )
      : null;
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
          client,
          setup.config.headers,
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
  } else if (def is TiledSource) {
    store = TileStore.vector(
      setup.template,
      cover: def.cover,
      config: setup.config,
    );
  }

  /// The bytes of the tiles built last, which a lookup reads again.
  final recent = <int, Uint8List>{};

  Future<Uint8List> fetch(TileId id) async {
    final key = tileKey(id.z, id.x, id.y);
    final kept = recent.remove(key);
    if (kept != null) {
      recent[key] = kept;
      return kept;
    }
    final bytes = await store!.read(id.z, id.x, id.y) ?? Uint8List(0);
    recent[key] = bytes;
    if (recent.length > 24) recent.remove(recent.keys.first);
    return bytes;
  }

  // The source's deepest zoom, as the pool last told it.
  var dataMaxZoom = def.maxZoom ?? def.defaultMaxZoom;

  Future<Iterable<TileLayer>> layersOf(TileId id) async {
    if (geoJson != null) return (await geoJson).tile(id.z, id.x, id.y);
    if (id.z > dataMaxZoom) {
      final d = id.z - dataMaxZoom;
      final from = TileId(dataMaxZoom, id.x >> d, id.y >> d);
      return sliceLayers(await layersOf(from), from, id);
    }
    final bytes = await fetch(id);
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
      case BuildTile(:final job, :final tile, :final maxZoom):
        dataMaxZoom = maxZoom;
        try {
          final fetched = Timeline.now;
          final layers = await layersOf(tile);
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
            // The ranges a name was measured without are on their way: once
            // they land, built again with the names where MapLibre puts them.
            for (var i = 0; i < 300 && ranges.pending > 0; i++) {
              await Future<void>.delayed(const Duration(milliseconds: 10));
            }
            built = build();
          }
          Timeline.instantSync(
            'vmap.tile.built',
            arguments: {
              'id': '${tile.z}/${tile.x}/${tile.y}',
              'ms': '${(Timeline.now - building) ~/ 1000}',
            },
          );
          return TileBuilt(job, built);
        } catch (e) {
          return TileNotBuilt(job, '$e');
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
