import 'dart:async';
import 'dart:io';
import 'dart:isolate';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'types.dart';

export 'types.dart';

/// Whether this platform has a file system to keep tiles in.
const bool hasFiles = true;

class Net {
  Net({String userAgent = 'vmap', int? perHost})
    : _client = HttpClient()
        ..userAgent = userAgent
        ..maxConnectionsPerHost = perHost
        ..connectionTimeout = const Duration(seconds: 10);

  final HttpClient _client;

  Future<Reply> get(
    String url,
    Map<String, String> headers, {
    Duration timeout = const Duration(seconds: 20),
  }) => () async {
    final request = await _client.getUrl(Uri.parse(url));
    headers.forEach(request.headers.set);
    final response = await request.close();
    final builder = BytesBuilder(copy: false);
    await response.forEach(builder.add);
    return Reply(response.statusCode, builder.takeBytes());
  }().timeout(timeout);

  void close() => _client.close(force: true);
}

bool fileExists(String path) => File(path).existsSync();

Future<Uint8List> readFile(String path) => File(path).readAsBytes();

Future<void> writeFile(String path, List<int> bytes) async {
  final file = File(path);
  await file.parent.create(recursive: true);
  await file.writeAsBytes(bytes);
}

/// Deletes the entries of [directory] whose name [mine] says yes to.
Future<void> deleteCached(
  String directory,
  bool Function(String name) mine,
) async {
  try {
    await for (final entry in Directory(directory).list()) {
      final name = entry.uri.pathSegments.lastWhere((s) => s.isNotEmpty);
      if (mine(name)) await entry.delete(recursive: true);
    }
  } on FileSystemException catch (_) {}
}

/// Reads pieces of a file on this device.
class FileSlices {
  FileSlices(this.path);

  final String path;
  RandomAccessFile? _file;

  Future<Uint8List> read(int offset, int length) async {
    final file = _file ??= await File(path).open();
    await file.setPosition(offset);
    return file.read(length);
  }

  void close() {
    _file?.closeSync();
    _file = null;
  }
}

Future<Uint8List> gunzip(Uint8List bytes) async =>
    Uint8List.fromList(gzip.decode(bytes));

/// Labels are drawn into images once and the images drawn every frame.
const bool directLabels = false;

/// The image to make a shader of.
ui.Image forShader(ui.Image image) => image;

/// An image of [pixels], premultiplied RGBA rows [width] wide.
Future<ui.Image> imageFromRgba(Uint8List pixels, int width, int height) {
  final done = Completer<ui.Image>();
  ui.decodeImageFromPixels(
    pixels,
    width,
    height,
    ui.PixelFormat.rgba8888,
    done.complete,
  );
  return done.future;
}

/// Runs [work] off the UI thread where the platform can.
Future<T> runAside<T>(T Function() work) => Isolate.run(work);

/// Wraps a buffer so it moves to another isolate without a copy.
Object pack(TypedData data) => TransferableTypedData.fromList([data]);

Float32List unpackFloats(Object packed) =>
    (packed as TransferableTypedData).materialize().asFloat32List();

Uint16List unpackShorts(Object packed) =>
    (packed as TransferableTypedData).materialize().asUint16List();

Uint8List unpackBytes(Object packed) =>
    (packed as TransferableTypedData).materialize().asUint8List();

class Worker {
  Worker._(this._isolate, this._inbox, this._port);

  final Isolate _isolate;
  final ReceivePort _inbox;
  final SendPort _port;

  void send(Object? message) => _port.send(message);

  void close() {
    _inbox.close();
    _isolate.kill(priority: Isolate.immediate);
  }
}

/// Only a browser needs a script to build tiles off its one thread.
const String? defaultWorkerScript = null;

/// The script a browser builds tiles and draws glyphs in; unused here.
String? workerScript;

/// A raster of premultiplied [rgba] pixels made ready to go to the page.
Future<Object> rasterForPage(Uint8List rgba, int width, int height) async =>
    pack(rgba);

/// The image of a raster from [rasterForPage].
Future<ui.Image> imageFromRaster(Object raster, int width, int height) =>
    imageFromRgba(unpackBytes(raster), width, height);

/// Starts [body] on an isolate of its own. It must be a top level function.
/// [script] is for a browser only.
Future<Worker> startWorker(
  WorkerBody body,
  List<Object?> init,
  void Function(Object? message) onMessage, {
  String? script,
  String? debugName,
}) async {
  final inbox = ReceivePort();
  final isolate = await Isolate.spawn(_run, [
    inbox.sendPort,
    body,
    init,
  ], debugName: debugName);
  final ready = Completer<SendPort>();
  inbox.listen((message) {
    if (message is SendPort) {
      ready.complete(message);
    } else {
      onMessage(message);
    }
  });
  return Worker._(isolate, inbox, await ready.future);
}

Future<void> _run(List<Object?> args) async {
  final out = args[0]! as SendPort;
  final inbox = ReceivePort();
  out.send(inbox.sendPort);
  await (args[1]! as WorkerBody)(args[2]! as List<Object?>, out.send, inbox);
}
