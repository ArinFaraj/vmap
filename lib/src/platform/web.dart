import 'dart:async';
import 'dart:js_interop';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'dart:ui_web' as ui_web;

import 'package:web/web.dart' as web;

import 'types.dart';
import 'web_codec.dart';

export 'types.dart';

/// Whether this platform has a file system to keep tiles in. A browser keeps
/// what it downloads in its own cache.
const bool hasFiles = false;

/// The page's or the worker's own `fetch`: a worker has no window.
@JS('fetch')
external JSPromise<web.Response> _fetch(JSAny url, web.RequestInit init);

class Net {
  Net({String userAgent = 'vmap', int? perHost});

  /// A browser sets these itself and refuses them from a page.
  static const _refused = {'user-agent', 'accept-encoding'};

  Future<Reply> get(
    String url,
    Map<String, String> headers, {
    Duration timeout = const Duration(seconds: 20),
  }) => () async {
    final sent = web.Headers();
    headers.forEach((name, value) {
      if (!_refused.contains(name.toLowerCase())) sent.append(name, value);
    });
    final response = await _fetch(
      url.toJS,
      web.RequestInit(headers: sent),
    ).toDart;
    final body = await response.arrayBuffer().toDart;
    return Reply(response.status, body.toDart.asUint8List());
  }().timeout(timeout);

  void close() {}
}

bool fileExists(String path) => false;

Future<Uint8List> readFile(String path) =>
    throw UnsupportedError('There are no files in a browser');

Future<void> writeFile(String path, List<int> bytes) async {}

Future<void> deleteCached(
  String directory,
  bool Function(String name) mine,
) async {}

class FileSlices {
  FileSlices(this.path);

  final String path;

  Future<Uint8List> read(int offset, int length) =>
      throw UnsupportedError('A browser cannot read the file $path');

  void close() {}
}

Future<Uint8List> gunzip(Uint8List bytes) async {
  final unpacked = web.Blob([bytes.toJS].toJS)
      .stream()
      .pipeThrough(web.DecompressionStream('gzip') as web.ReadableWritablePair);
  final buffer = await web.Response(unpacked).arrayBuffer().toDart;
  return buffer.toDart.asUint8List();
}

/// Labels are drawn as text every frame. Making an image of one stalls the
/// JavaScript renderer for milliseconds, far more when the machine is busy.
/// The WebAssembly renderer runs out of memory drawing that much text, and
/// makes an image at no cost, so it keeps the images.
const bool directLabels = !bool.fromEnvironment('dart.tool.dart2wasm');

/// The image to make a shader of. The web engine's image shader releases
/// the image it is given when it is disposed, so it gets a handle of its own.
ui.Image forShader(ui.Image image) => image.clone();

/// A browser page has one thread for Dart, so the work runs where it is.
Future<T> runAside<T>(T Function() work) async => work();

Object pack(TypedData data) => data;

Float32List unpackFloats(Object packed) => packed as Float32List;

Uint16List unpackShorts(Object packed) => packed as Uint16List;

/// The worker script vmap ships as a web only asset.
final String defaultWorkerScript = ui_web.assetManager.getAssetUrl(
  'packages/vmap/assets/vmap_worker.js',
);

class Worker {
  void Function(Object? message)? _send;
  void Function()? _stop;
  bool _closed = false;

  void send(Object? message) {
    if (!_closed) _send?.call(message);
  }

  void close() {
    _closed = true;
    _stop?.call();
  }
}

/// Runs [body] in a worker when [script] names one, which then has to
/// be the tile worker's script, and otherwise on the page's own thread
/// between frames. A script the browser refuses or that does not load is
/// replaced by the page's thread, with what it was sent so far.
Future<Worker> startWorker(
  WorkerBody body,
  List<Object?> init,
  void Function(Object? message) onMessage, {
  String? script,
  String? debugName,
}) async {
  final worker = Worker();
  if (script == null) {
    _onPage(worker, body, init, onMessage);
    return worker;
  }
  final web.Worker real;
  try {
    real = web.Worker(script.toJS);
  } on Object {
    _onPage(worker, body, init, onMessage);
    return worker;
  }
  var answered = false;
  final unanswered = <Object?>[];
  real.onmessage = ((web.MessageEvent event) {
    answered = true;
    unanswered.clear();
    final message = decodeMessage(event.data);
    if (message != null && !worker._closed) onMessage(message);
  }).toJS;
  real.onerror = ((web.Event event) {
    if (answered || worker._closed) return;
    real.terminate();
    _onPage(worker, body, init, onMessage);
    for (final message in unanswered) {
      worker.send(message);
    }
    unanswered.clear();
  }).toJS;
  worker
    .._send = (message) {
      if (!answered) unanswered.add(message);
      real.postMessage(encodeMessage(message));
    }
    .._stop = () => real.terminate();
  real.postMessage(encodeMessage(init));
  return worker;
}

void _onPage(
  Worker worker,
  WorkerBody body,
  List<Object?> init,
  void Function(Object? message) onMessage,
) {
  final inbox = StreamController<Object?>();
  worker
    .._send = inbox.add
    .._stop = inbox.close;
  unawaited(
    body(init, (message) {
      Timer.run(() {
        if (!worker._closed) onMessage(message);
      });
    }, inbox.stream),
  );
}
