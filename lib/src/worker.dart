import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:isolate';
import 'dart:typed_data';

import 'geojson.dart';
import 'mvt.dart';
import 'query.dart';
import 'style.dart';
import 'tile_builder.dart';

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
  int get hashCode => (z << 50) | (x << 25) | y;

  @override
  String toString() => '$z/$x/$y';
}

/// How tiles are fetched and kept.
class TileSourceConfig {
  const TileSourceConfig({
    this.cacheDirectory,
    this.userAgent = 'vmap',
    this.workers = 2,
  });

  /// Downloaded tiles are kept here between runs. Null disables the disk
  /// cache.
  final String? cacheDirectory;
  final String userAgent;
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

  File? get _templateFile => config.cacheDirectory == null
      ? null
      : File(
          '${config.cacheDirectory}/source-${_def.tileJsonUrl.hashCode.toRadixString(36)}.txt',
        );

  /// Starts on the address remembered from the last run, so tiles on disk
  /// show without waiting for the network, and asks the server for the
  /// current one meanwhile.
  Future<void> _start() async {
    try {
      final direct = _def.geoJson ? 'geojson' : _def.tiles;
      if (direct != null || _def.tileJsonUrl == null) {
        if (direct == null) {
          throw StateError('The source ${_def.name} has no tiles');
        }
        _template = direct;
        _confirmed = true;
        await _spawnWorkers(direct);
        _dispatch();
        return;
      }
      final file = _templateFile;
      String? remembered;
      if (file != null && file.existsSync()) {
        final saved = file.readAsStringSync().split('\n');
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
    final inbox = ReceivePort();
    final isolate = await Isolate.spawn(_workerMain, [
      inbox.sendPort,
      template,
      config.cacheDirectory,
      config.userAgent,
      style,
      nameKeys,
      sheet.zoomOffset,
      source,
    ], debugName: 'vmap-tiles-$source-$index');
    final ready = Completer<SendPort>();
    final worker = _Worker(isolate, inbox);
    inbox.listen((message) {
      if (message is SendPort) {
        ready.complete(message);
      } else if (message case [final int job, 'q', final List<Object?> found]) {
        _queries.remove(job)?.complete(found);
      } else {
        _onResult(worker, message as List);
      }
    });
    worker.port = await ready.future;
    return worker;
  }

  Future<String> _fetchTemplate() async {
    final client = HttpClient()..userAgent = config.userAgent;
    try {
      final request = await client
          .getUrl(Uri.parse(_def.tileJsonUrl!))
          .timeout(const Duration(seconds: 10));
      final response = await request.close().timeout(
        const Duration(seconds: 10),
      );
      final json =
          jsonDecode(await utf8.decodeStream(response)) as Map<String, dynamic>;
      final template = (json['tiles'] as List).first as String;
      final deepest = json['maxzoom'];
      if (deepest is num) maxZoom = deepest.toInt();
      final file = _templateFile;
      if (file != null) {
        await file.parent.create(recursive: true);
        await file.writeAsString('$template\n$maxZoom');
      }
      return template;
    } finally {
      client.close();
    }
  }

  bool _onDisk(TileId id) {
    if (_notOnDisk.contains(id)) return false;
    final found = File(
      _tileCachePath(config.cacheDirectory!, _template!, id.z, id.x, id.y),
    ).existsSync();
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
      free.port.send([job, id.z, id.x, id.y, maxZoom]);
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
  /// that the style draws at [styleZoom].
  Future<List<Object?>> query(
    TileId id,
    double px,
    double py,
    double radius,
    double styleZoom,
  ) async {
    await _starting;
    if (_workers.isEmpty || _closed) return const [];
    final job = _nextJob++;
    final done = _queries[job] = Completer();
    _workers.first.port.send([
      job,
      id.z,
      id.x,
      id.y,
      'q',
      px,
      py,
      radius,
      styleZoom,
    ]);
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
  _Worker(this.isolate, this.inbox);

  final Isolate isolate;
  final ReceivePort inbox;
  late SendPort port;
  int busy = 0;

  void close() {
    inbox.close();
    isolate.kill(priority: Isolate.immediate);
  }
}

String _tileCachePath(String directory, String template, int z, int x, int y) =>
    '$directory/${template.hashCode.toRadixString(36)}/$z/$x/$y.pbf';

Future<void> _workerMain(List<Object?> init) async {
  final out = init[0]! as SendPort;
  final template = init[1]! as String;
  final cacheDirectory = init[2] as String?;
  final client = HttpClient()
    ..userAgent = init[3]! as String
    ..maxConnectionsPerHost = 4
    ..connectionTimeout = const Duration(seconds: 10);
  final sheet = StyleSheet.compile(
    (init[4]! as Map).cast<String, Object?>(),
    nameKeys: (init[5] as List?)?.cast<String>(),
    zoomOffset: init[6]! as double,
  );
  final source = init[7]! as int;
  final builder = TileBuilder(sheet, source: source);
  final inbox = ReceivePort();
  out.send(inbox.sendPort);

  Future<GeoJsonTiles>? geoJson;
  if (sheet.sources[source].geoJson) {
    final data = sheet.sources[source].data;
    final cluster = sheet.sources[source].cluster;
    geoJson = () async {
      if (data is! String) return GeoJsonTiles(data, cluster: cluster);
      try {
        final request = await client.getUrl(Uri.parse(data));
        final response = await request.close().timeout(
          const Duration(seconds: 20),
        );
        return GeoJsonTiles(
          jsonDecode(await utf8.decodeStream(response)),
          cluster: cluster,
        );
      } catch (_) {
        return GeoJsonTiles(null);
      }
    }();
  }

  /// The bytes of the tiles built last, which a lookup reads again.
  final recent = <int, Uint8List>{};

  Future<Uint8List> fetch(int z, int x, int y) async {
    final key = (z << 50) | (x << 25) | y;
    final kept = recent.remove(key);
    if (kept != null) {
      recent[key] = kept;
      return kept;
    }
    void remember(Uint8List bytes) {
      recent[key] = bytes;
      if (recent.length > 24) recent.remove(recent.keys.first);
    }

    File? file;
    if (cacheDirectory != null) {
      file = File(_tileCachePath(cacheDirectory, template, z, x, y));
      if (file.existsSync()) {
        final bytes = await file.readAsBytes();
        remember(bytes);
        return bytes;
      }
    }
    final url = template
        .replaceFirst('{z}', '$z')
        .replaceFirst('{x}', '$x')
        .replaceFirst('{y}', '$y');
    final request = await client.getUrl(Uri.parse(url));
    final response = await request.close().timeout(const Duration(seconds: 20));
    if (response.statusCode == 204 || response.statusCode == 404) {
      await response.drain<void>();
      return Uint8List(0);
    }
    if (response.statusCode != 200) {
      await response.drain<void>();
      throw HttpException('HTTP ${response.statusCode}', uri: Uri.parse(url));
    }
    final builder = BytesBuilder(copy: false);
    await response.forEach(builder.add).timeout(const Duration(seconds: 30));
    final bytes = builder.takeBytes();
    remember(bytes);
    if (file != null) {
      unawaited(
        file.parent
            .create(recursive: true)
            .then((_) => file!.writeAsBytes(bytes))
            .then<void>((_) {}, onError: (_) {}),
      );
    }
    return bytes;
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
    if (m[4] == 'q') {
      unawaited(() async {
        try {
          out.send([
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
            ),
          ]);
        } catch (_) {
          out.send([job, 'q', const <Object?>[]]);
        }
      }());
      continue;
    }
    unawaited(() async {
      try {
        final layers = await layersOf(z, x, y);
        final tile = layers.isEmpty
            ? BuiltTile(const [], const [])
            : (builder.buildLayers(layers, z, maxZoom: m[4]! as int)
                ..keyLabels(z, x, y, grid: geoJson == null ? 1024 : 1 << 24));
        out.send([job, tile.toMessage()]);
      } catch (e) {
        out.send([job, null, '$e']);
      }
    }());
  }
}
