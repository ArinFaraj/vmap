import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:isolate';
import 'dart:typed_data';

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

/// Where tiles come from and how they are read.
class TileSourceConfig {
  const TileSourceConfig({
    this.tileJsonUrl = 'https://tiles.openfreemap.org/planet',
    this.nameKeys = const ['name'],
    this.cacheDirectory,
    this.userAgent = 'vmap',
    this.workers = 2,
    this.linesAsPolylines = false,
  });

  final String tileJsonUrl;
  final List<String> nameKeys;

  /// Downloaded tiles are kept here between runs. Null disables the disk
  /// cache.
  final String? cacheDirectory;
  final String userAgent;
  final int workers;

  /// Stroke roads as paths on the raster thread instead of as triangles
  /// widened on the UI thread.
  final bool linesAsPolylines;
}

typedef TileLoaded = void Function(
  TileId id,
  List<String> nameKeys,
  BuiltTile tile,
);
typedef TileFailed = void Function(TileId id, Object error);

/// Downloads, decodes and tessellates tiles on background isolates, so none of
/// it runs on the UI thread.
class TilePool {
  TilePool(this.config, {required this.onLoaded, required this.onFailed}) {
    _starting = _start();
  }

  final TileSourceConfig config;
  final TileLoaded onLoaded;
  final TileFailed onFailed;

  static const int _perWorker = 3;

  final List<_Worker> _workers = [];
  final Map<int, (TileId, List<String>)> _inflight = {};
  final Set<TileId> _inflightIds = {};
  List<TileId> _wanted = const [];
  List<String> _nameKeys = const ['name'];
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
  void want(List<TileId> ids, List<String> nameKeys) {
    _wanted = ids;
    _nameKeys = nameKeys;
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
      : File('${config.cacheDirectory}/tilejson.url');

  /// Starts on the address remembered from the last run, so tiles on disk
  /// show without waiting for the network, and asks the server for the
  /// current one meanwhile.
  Future<void> _start() async {
    try {
      final file = _templateFile;
      final remembered = file != null && file.existsSync()
          ? file.readAsStringSync()
          : null;
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
      for (var i = 0; i < config.workers; i++) _spawnWorker(i, template),
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
    ], debugName: 'vmap-tiles-$index');
    final ready = Completer<SendPort>();
    final worker = _Worker(isolate, inbox);
    inbox.listen((message) {
      if (message is SendPort) {
        ready.complete(message);
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
          .getUrl(Uri.parse(config.tileJsonUrl))
          .timeout(const Duration(seconds: 10));
      final response = await request.close().timeout(
        const Duration(seconds: 10),
      );
      final json =
          jsonDecode(await utf8.decodeStream(response)) as Map<String, dynamic>;
      final template = (json['tiles'] as List).first as String;
      final file = _templateFile;
      if (file != null) {
        await file.parent.create(recursive: true);
        await file.writeAsString(template);
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
      _inflight[job] = (id, _nameKeys);
      _inflightIds.add(id);
      free.busy++;
      free.port.send([
        job,
        id.z,
        id.x,
        id.y,
        _nameKeys,
        config.linesAsPolylines,
      ]);
    }
  }

  void _onResult(_Worker worker, List<Object?> message) {
    worker.busy--;
    final job = _inflight.remove(message[0]! as int);
    if (job == null || _closed) return;
    final (id, nameKeys) = job;
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
      onLoaded(id, nameKeys, BuiltTile.fromMessage(payload as List<Object?>));
      final spent = _clock.elapsedMicroseconds - started;
      if (spent > maxUnpackMicros) maxUnpackMicros = spent;
    }
    _dispatch();
  }

  void close() {
    _closed = true;
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
  final builders = <String, TileBuilder>{};
  final inbox = ReceivePort();
  out.send(inbox.sendPort);

  Future<Uint8List> fetch(int z, int x, int y) async {
    File? file;
    if (cacheDirectory != null) {
      file = File(_tileCachePath(cacheDirectory, template, z, x, y));
      if (file.existsSync()) return file.readAsBytes();
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

  await for (final message in inbox) {
    final m = message as List<Object?>;
    final job = m[0]! as int;
    final z = m[1]! as int;
    final nameKeys = (m[4]! as List).cast<String>();
    unawaited(() async {
      try {
        final bytes = await fetch(z, m[2]! as int, m[3]! as int);
        final asPolylines = m[5]! as bool;
        final builder = builders['$asPolylines|${nameKeys.join('|')}'] ??=
            TileBuilder(nameKeys, linesAsPolylines: asPolylines);
        final tile = bytes.isEmpty
            ? BuiltTile(const [], const [])
            : builder.build(bytes, z);
        out.send([job, tile.toMessage()]);
      } catch (e) {
        out.send([job, null, '$e']);
      }
    }());
  }
}
