import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'cluster.dart';
import 'geojson.dart';
import 'mvt.dart';
import 'query.dart';
import 'pmtiles.dart';
import 'style.dart';
import 'tile_builder.dart';
import 'net.dart';
import 'platform.dart';

class TileId {
  const TileId(this.z, this.x, this.y);

  final int z;
  final int x;
  final int y;

  TileId get parent => TileId(z - 1, x >> 1, y >> 1);

  @override
  bool operator ==(Object other) =>
      other is TileId && other.z == z && other.x == x && other.y == y;

  @override
  int get hashCode => tileKey(z, x, y);

  @override
  String toString() => '$z/$x/$y';
}

/// One number for a tile down to zoom 22. It stays under the 53 bits a
/// number has in JavaScript.
int tileKey(int z, int x, int y) => (z * 0x400000 + x) * 0x400000 + y;

/// How tiles are fetched and kept.
class TileSourceConfig {
  const TileSourceConfig({
    this.cacheDirectory,
    this.userAgent = 'vmap',
    this.headers = const {},
    this.workers = 2,
  });

  /// Downloaded tiles are kept here between runs. Null disables the disk
  /// cache.
  final String? cacheDirectory;
  final String userAgent;

  /// Sent with every request for a style, its tiles and its pictures, for a
  /// server that wants a key or a token in a header.
  final Map<String, String> headers;
  final int workers;
}

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
  }) : maxZoom =
           sheet.sources[source].maxZoom ??
           (sheet.sources[source].geoJson ? 18 : 14) {
    _starting = _start();
  }

  final TileSourceConfig config;

  /// The style document the workers build tiles for, and its compiled form.
  final Map<String, Object?> style;
  final List<String>? nameKeys;
  final StyleSheet sheet;

  /// Which of the style's sources this pool loads.
  final int source;

  VectorSource get _def => sheet.sources[source];

  /// The deepest zoom the source has tiles for.
  int maxZoom;
  final TileLoaded onLoaded;
  final TileFailed onFailed;

  static const int _perWorker = 3;

  final List<_Worker> _workers = [];
  final Map<int, TileId> _inflight = {};
  final Set<TileId> _inflightIds = {};
  List<TileId> _wanted = const [];
  int _nextJob = 0;
  bool _closed = false;
  Future<void>? _starting;
  Object? startError;

  /// Longest the UI isolate spent unpacking one finished tile, in microseconds.
  int maxUnpackMicros = 0;
  final Stopwatch _clock = Stopwatch()..start();

  bool isLoading(TileId id) => _inflightIds.contains(id);

  /// Tiles to load, most urgent first. Replaces the previous list; tiles
  /// already being fetched are left to finish.
  void want(List<TileId> ids) {
    _wanted = ids;
    _starting ??= _start();
    _dispatch();
  }

  /// The tile address this pool is using.
  String? _template;

  /// Whether the server has confirmed [_template] in this run. Until it has,
  /// only tiles already on disk are loaded: the address changes with every
  /// tile set the server publishes, and one remembered from an earlier run
  /// may no longer answer.
  bool _confirmed = false;
  final Set<TileId> _notOnDisk = {};

  /// The folder under the cache directory that holds this source's tiles.
  String? get cacheName => _template?.hashCode.toRadixString(36);

  String? get _templateFile => config.cacheDirectory == null
      ? null
      : '${config.cacheDirectory}/source-${_def.tileJsonUrl.hashCode.toRadixString(36)}.txt';

  /// Starts on the address remembered from the last run, so tiles on disk
  /// show without waiting for the network, and asks the server for the
  /// current one meanwhile.
  Future<void> _start() async {
    startError = null;
    try {
      final direct = _def.geoJson
          ? 'geojson'
          : _def.tiles ??
                (PmTiles.handles(_def.tileJsonUrl) ? _def.tileJsonUrl : null);
      if (direct != null || _def.tileJsonUrl == null) {
        if (direct == null) {
          throw StateError('The source ${_def.name} has no tiles');
        }
        if (PmTiles.handles(direct) && _def.maxZoom == null) {
          final archive = PmTiles(direct, headers: config.headers);
          try {
            maxZoom = await archive.maxZoom;
          } finally {
            archive.close();
          }
        }
        _template = direct;
        _confirmed = true;
        await _spawnWorkers(direct);
        _dispatch();
        return;
      }
      final file = _templateFile;
      String? remembered;
      if (file != null && fileExists(file)) {
        final saved = utf8.decode(await readFile(file)).split('\n');
        remembered = saved.first;
        if (saved.length > 1) maxZoom = int.tryParse(saved[1]) ?? maxZoom;
      }
      if (remembered != null) {
        _template = remembered;
        await _spawnWorkers(remembered);
        if (_closed) return;
        _dispatch();
      }

      String? current;
      try {
        current = await _fetchTemplate();
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
        _template = current;
        await _spawnWorkers(current);
        if (_closed) return;
      }
      _confirmed = true;
      _notOnDisk.clear();
      _dispatch();
    } catch (e) {
      startError = e;
      _starting = null;
    }
  }

  Future<void> _spawnWorkers(String template) async {
    final workers = await Future.wait([
      for (var i = 0; i < (_def.geoJson ? 1 : config.workers); i++)
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
      [
        template,
        config.cacheDirectory,
        config.userAgent,
        style,
        nameKeys,
        sheet.zoomOffset,
        source,
        config.headers,
      ],
      (message) {
        if (message case [final int job, 'q', final List<Object?> found]) {
          _queries.remove(job)?.complete(found);
        } else {
          _onResult(worker, message! as List);
        }
      },
      debugName: 'vmap-tiles-$source-$index',
    );
    return worker;
  }

  Future<String> _fetchTemplate() async {
    final client = Net(userAgent: config.userAgent);
    try {
      final reply = await client.get(
        _def.tileJsonUrl!,
        config.headers,
        timeout: const Duration(seconds: 10),
      );
      final json = jsonDecode(utf8.decode(reply.bytes)) as Map<String, dynamic>;
      final template = tileTemplate(json['tiles'])!;
      final deepest = json['maxzoom'];
      if (deepest is num) maxZoom = deepest.toInt();
      final file = _templateFile;
      if (file != null) {
        await writeFile(file, utf8.encode('$template\n$maxZoom'));
      }
      return template;
    } finally {
      client.close();
    }
  }

  PmTiles? _keeping;

  /// Fetches tile [id] into the cache directory unless it is there already,
  /// and returns whether it had to. A source with nothing to keep (data
  /// held by the style, an archive on this device) answers false.
  Future<bool> keep(TileId id, Net client) async {
    await _starting;
    final directory = config.cacheDirectory;
    final template = _template;
    if (startError case final error?) throw error;
    if (directory == null || template == null || _def.geoJson) return false;
    if (id.z > maxZoom || !_def.cover.has(id.z, id.x, id.y)) return false;
    final file = _tileCachePath(directory, template, id.z, id.x, id.y);
    if (fileExists(file)) return false;
    if (PmTiles.handles(template)) {
      final archive = _keeping ??= PmTiles(template, headers: config.headers);
      if (archive.local) return false;
      await writeFile(file, await archive.tile(id.z, id.x, id.y));
      return true;
    }
    final (url, reply) = await getTile(
      client,
      template,
      id.z,
      id.x,
      _def.cover.row(id.z, id.y),
      config.headers,
    );
    if (reply.status == 204 || reply.status == 404) return false;
    if (reply.status != 200) throw HttpFailure(reply.status, url);
    await writeFile(file, reply.bytes);
    return true;
  }

  bool _onDisk(TileId id) {
    if (_notOnDisk.contains(id)) return false;
    final found = fileExists(
      _tileCachePath(config.cacheDirectory!, _template!, id.z, id.x, id.y),
    );
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
      free.busy++;
      free.link.send([job, id.z, id.x, id.y, maxZoom]);
    }
  }

  void _onResult(_Worker worker, List<Object?> message) {
    worker.busy--;
    final id = _inflight.remove(message[0]! as int);
    if (id == null || _closed) return;
    _inflightIds.remove(id);
    _wanted = [
      for (final w in _wanted)
        if (w != id) w,
    ];
    final payload = message[1];
    if (payload == null) {
      onFailed(id, message[2] ?? 'unknown');
    } else {
      final started = _clock.elapsedMicroseconds;
      onLoaded(id, BuiltTile.fromMessage(payload as List<Object?>));
      final spent = _clock.elapsedMicroseconds - started;
      if (spent > maxUnpackMicros) maxUnpackMicros = spent;
    }
    _dispatch();
  }

  final Map<int, Completer<List<Object?>>> _queries = {};

  /// The features of tile [id] within [radius] tile units of ([px], [py])
  /// that the style draws at [styleZoom], or with [halfWidth] and
  /// [halfHeight] given, those touching the box of that size around it.
  Future<List<Object?>> query(
    TileId id,
    double px,
    double py,
    double radius,
    double styleZoom, {
    double halfWidth = -1,
    double halfHeight = -1,
  }) => _ask([
    id.z,
    id.x,
    id.y,
    'q',
    px,
    py,
    radius,
    styleZoom,
    halfWidth,
    halfHeight,
  ]);

  /// Asks a clustered source about cluster [id]: its `zoom` of expansion,
  /// its `children` or its `leaves`.
  Future<List<Object?>> cluster(
    String what,
    int id, {
    int limit = 0,
    int offset = 0,
  }) => _ask([0, 0, 0, 'c', what, id, limit, offset]);

  Future<List<Object?>> _ask(List<Object?> question) async {
    await _starting;
    if (_workers.isEmpty || _closed) return const [];
    final job = _nextJob++;
    final done = _queries[job] = Completer();
    _workers.first.link.send([job, ...question]);
    return done.future.timeout(
      const Duration(seconds: 10),
      onTimeout: () {
        _queries.remove(job);
        return const [];
      },
    );
  }

  void close() {
    _closed = true;
    _keeping?.close();
    for (final q in _queries.values) {
      q.complete(const []);
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

List<Object?> _members(List<ClusterPoint>? points) => [
  for (final p in points ?? const <ClusterPoint>[]) [p.x, p.y, p.props],
];

String _tileCachePath(String directory, String template, int z, int x, int y) =>
    '$directory/${template.hashCode.toRadixString(36)}/$z/$x/$y.pbf';

/// What a tile worker runs: it builds the tiles it is asked for and answers
/// lookups in them.
Future<void> tileWorkerMain(
  List<Object?> init,
  void Function(Object? message) send,
  Stream<Object?> inbox,
) async {
  final template = init[0]! as String;
  final cacheDirectory = init[1] as String?;
  final client = Net(userAgent: init[2]! as String, perHost: 4);
  final sheet = StyleSheet.compile(
    (init[3]! as Map).cast<String, Object?>(),
    nameKeys: (init[4] as List?)?.cast<String>(),
    zoomOffset: init[5]! as double,
  );
  final source = init[6]! as int;
  final headers = (init[7]! as Map).cast<String, String>();
  final builder = TileBuilder(sheet, source: source);

  Future<GeoJsonTiles>? geoJson;
  if (sheet.sources[source].geoJson) {
    final data = sheet.sources[source].data;
    final cluster = sheet.sources[source].cluster;
    final promoteId = sheet.sources[source].idKey('');
    final generateId = sheet.sources[source].generateId;
    geoJson = () async {
      if (data is! String) {
        return GeoJsonTiles(
          data,
          cluster: cluster,
          promoteId: promoteId,
          generateId: generateId,
        );
      }
      try {
        final reply = await client.get(data, headers);
        return GeoJsonTiles(
          jsonDecode(utf8.decode(reply.bytes)),
          cluster: cluster,
          promoteId: promoteId,
          generateId: generateId,
        );
      } catch (_) {
        return GeoJsonTiles(null);
      }
    }();
  }

  final archive = PmTiles.handles(template)
      ? PmTiles(template, client: client, headers: headers)
      : null;

  /// The bytes of the tiles built last, which a lookup reads again.
  final recent = <int, Uint8List>{};

  final cover = sheet.sources[source].cover;

  Future<Uint8List> fetch(int z, int x, int y) async {
    if (!cover.has(z, x, y)) return Uint8List(0);
    final key = tileKey(z, x, y);
    final kept = recent.remove(key);
    if (kept != null) {
      recent[key] = kept;
      return kept;
    }
    void remember(Uint8List bytes) {
      recent[key] = bytes;
      if (recent.length > 24) recent.remove(recent.keys.first);
    }

    String? file;
    if (cacheDirectory != null && !(archive?.local ?? false)) {
      file = _tileCachePath(cacheDirectory, template, z, x, y);
      if (fileExists(file)) {
        final bytes = await readFile(file);
        remember(bytes);
        return bytes;
      }
    }
    void keep(Uint8List bytes) {
      remember(bytes);
      final target = file;
      if (target == null) return;
      unawaited(writeFile(target, bytes).then<void>((_) {}, onError: (_) {}));
    }

    if (archive != null) {
      final bytes = await archive.tile(z, x, y);
      keep(bytes);
      return bytes;
    }
    final (url, reply) = await getTile(
      client,
      template,
      z,
      x,
      cover.row(z, y),
      headers,
    );
    if (reply.status == 204 || reply.status == 404) return Uint8List(0);
    if (reply.status != 200) throw HttpFailure(reply.status, url);
    keep(reply.bytes);
    return reply.bytes;
  }

  Future<Iterable<TileLayer>> layersOf(int z, int x, int y) async {
    if (geoJson != null) return (await geoJson).tile(z, x, y);
    final bytes = await fetch(z, x, y);
    return bytes.isEmpty
        ? const <TileLayer>[]
        : MvtTile.decode(bytes).layers.values;
  }

  await for (final message in inbox) {
    final m = message as List<Object?>;
    final job = m[0]! as int;
    final z = m[1]! as int;
    final x = m[2]! as int;
    final y = m[3]! as int;
    if (m[4] == 'c') {
      unawaited(() async {
        try {
          final clusters = (await geoJson)?.clusters;
          final id = m[6]! as int;
          send([
            job,
            'q',
            switch (m[5]) {
              'zoom' => [clusters?.expansionZoom(id)],
              'children' => _members(clusters?.children(id)),
              _ => _members(
                clusters?.leaves(id, limit: m[7]! as int, offset: m[8]! as int),
              ),
            },
          ]);
        } catch (_) {
          send([job, 'q', const <Object?>[]]);
        }
      }());
      continue;
    }
    if (m[4] == 'q') {
      unawaited(() async {
        try {
          send([
            job,
            'q',
            queryTile(
              await layersOf(z, x, y),
              sheet,
              source,
              m[5]! as double,
              m[6]! as double,
              m[7]! as double,
              m[8]! as double,
              halfWidth: m[9]! as double,
              halfHeight: m[10]! as double,
            ),
          ]);
        } catch (_) {
          send([job, 'q', const <Object?>[]]);
        }
      }());
      continue;
    }
    unawaited(() async {
      try {
        final layers = await layersOf(z, x, y);
        final tile = layers.isEmpty
            ? BuiltTile(const [], const [])
            : (builder.buildLayers(layers, z, x: x, y: y, maxZoom: m[4]! as int)
                ..keyLabels(z, x, y, grid: geoJson == null ? 1024 : 1 << 24));
        send([job, tile.toMessage()]);
      } catch (e) {
        send([job, null, '$e']);
      }
    }());
  }
}
