import 'dart:async';
import 'dart:math' as math;
import 'dart:js_interop';
import 'dart:js_interop_unsafe';
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

  /// Fetches [url]. The request is aborted when [cancel] is cancelled or
  /// [timeout] passes, so it stops taking the connection's bandwidth.
  Future<Reply> get(
    String url,
    Map<String, String> headers, {
    Duration timeout = const Duration(seconds: 20),
    Cancel? cancel,
  }) async {
    if (cancel?.cancelled ?? false) throw const Cancelled();
    final sent = web.Headers();
    headers.forEach((name, value) {
      if (!_refused.contains(name.toLowerCase())) sent.append(name, value);
    });
    final abort = web.AbortController();
    var timedOut = false;
    final timer = Timer(timeout, () {
      timedOut = true;
      abort.abort();
    });
    cancel?.onCancel(() => abort.abort());
    try {
      final response = await _fetch(
        url.toJS,
        web.RequestInit(headers: sent, signal: abort.signal),
      ).toDart;
      final body = await response.arrayBuffer().toDart;
      return Reply(response.status, body.toDart.asUint8List());
    } catch (_) {
      if (timedOut) throw TimeoutException('No answer from $url', timeout);
      if (cancel?.cancelled ?? false) throw const Cancelled();
      rethrow;
    } finally {
      timer.cancel();
    }
  }

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
const bool directLabels = _javaScript;

const _javaScript = !bool.fromEnvironment('dart.tool.dart2wasm');

/// The image to make a shader of. The web engine's image shader releases
/// the image it is given when it is disposed, so it gets a handle of its own.
ui.Image forShader(ui.Image image) => image.clone();

/// An image of [pixels], premultiplied RGBA rows [width] wide, as Flutter
/// takes raw pixels. The JavaScript renderer, which Safari always gets,
/// keeps an image of pixels on the GPU once drawn, but uploads an image
/// made from an `ImageBitmap` again at every draw: a page of label glyphs
/// fifteen times a frame. The WebAssembly renderer freezes the page
/// decoding raw pixels, so it takes an `ImageBitmap`; `ImageData` is
/// unpremultiplied, so the colours are divided by alpha first. A
/// [readable] image keeps [pixels] for [imagePixels].
Future<ui.Image> imageFromRgba(
  Uint8List pixels,
  int width,
  int height, {
  bool readable = false,
}) async {
  final ui.Image image;
  if (_javaScript) {
    final done = Completer<ui.Image>();
    ui.decodeImageFromPixels(
      pixels,
      width,
      height,
      ui.PixelFormat.rgba8888,
      done.complete,
    );
    image = await done.future;
  } else {
    final data = web.ImageData(_straight(pixels).toJS, width, height.toJS);
    final bitmap = await web.window.createImageBitmap(data).toDart;
    image = await ui_web.createImageFromImageBitmap(bitmap);
  }
  if (readable) _pixelsOf[image] = pixels;
  return image;
}

/// Where an image's pixels can be had without reading the image back.
/// Flutter's web renderers read an image by resizing the surface the page
/// is drawn on to the image's size, and a frame drawn meanwhile shows only
/// that corner of the page, the rest white.
final Expando<Uint8List> _encodedOf = Expando();
final Expando<Uint8List> _pixelsOf = Expando();
final Expando<web.ImageBitmap> _bitmapOf = Expando();
final Expando<(int, int, List<(ui.Image, int, int)>)> _partsOf = Expando();

/// Notes that [image], [width] by [height], is [parts] drawn at their
/// places, each image at its left and top, for [imagePixels].
void composedOf(
  ui.Image image,
  int width,
  int height,
  List<(ui.Image, int, int)> parts,
) => _partsOf[image] = (width, height, parts);

/// Notes the encoded [bytes] [image] was decoded from, for [imagePixels].
void decodedFrom(ui.Image image, Uint8List bytes) => _encodedOf[image] = bytes;

/// [image]'s premultiplied RGBA pixels: those it was made from, or its
/// encoded bytes decoded again by the browser, and read back from the image
/// only when it has neither.
Future<ByteData?> imagePixels(ui.Image image) async {
  if (_pixelsOf[image] case final pixels?) return ByteData.sublistView(pixels);
  if (_bitmapOf[image] case final bitmap?) return _read(bitmap);
  if (_partsOf[image] case (final width, final height, final parts)) {
    final out = Uint8List(width * height * 4);
    for (final (part, left, top) in parts) {
      final pixels = await _knownPixels(part);
      if (pixels == null) return image.toByteData();
      final (from, w, h) = pixels;
      for (var y = 0; y < h && top + y < height; y++) {
        final row = math.min(w, width - left);
        if (row <= 0) break;
        out.setRange(
          ((top + y) * width + left) * 4,
          ((top + y) * width + left + row) * 4,
          from,
          y * w * 4,
        );
      }
    }
    return ByteData.sublistView(out);
  }
  final encoded = _encodedOf[image];
  if (encoded == null) return image.toByteData();
  final bitmap = await web.window
      .createImageBitmap(
        web.Blob([encoded.toJS].toJS),
        web.ImageBitmapOptions(colorSpaceConversion: 'none'),
      )
      .toDart;
  try {
    return _read(bitmap);
  } finally {
    bitmap.close();
  }
}

/// [image]'s pixels, width and height when they can be had without reading
/// the image back: a part of a composed image may have been let go of.
Future<(Uint8List, int, int)?> _knownPixels(ui.Image image) async {
  if (_pixelsOf[image] == null &&
      _bitmapOf[image] == null &&
      _partsOf[image] == null &&
      _encodedOf[image] == null) {
    return null;
  }
  final size = switch (_partsOf[image]) {
    (final w, final h, _) => (w, h),
    _ => await _sizeOf(image),
  };
  if (size == null) return null;
  final data = await imagePixels(image);
  if (data == null) return null;
  return (Uint8List.sublistView(data), size.$1, size.$2);
}

/// [image]'s size from what it was made of, as it may have been let go of.
Future<(int, int)?> _sizeOf(ui.Image image) async {
  if (_bitmapOf[image] case final bitmap?) return (bitmap.width, bitmap.height);
  final encoded = _encodedOf[image];
  if (encoded == null) return null;
  final bitmap = await web.window
      .createImageBitmap(web.Blob([encoded.toJS].toJS))
      .toDart;
  final size = (bitmap.width, bitmap.height);
  bitmap.close();
  return size;
}

/// [bitmap]'s premultiplied RGBA pixels.
ByteData _read(web.ImageBitmap bitmap) {
  final width = bitmap.width, height = bitmap.height;
  final context =
      web.OffscreenCanvas(
            width,
            height,
          ).getContext('2d', {'willReadFrequently': true}.jsify())!
          as web.OffscreenCanvasRenderingContext2D;
  context.drawImage(bitmap, 0, 0);
  final pixels = Uint8List.sublistView(
    context.getImageData(0, 0, width, height).data.toDart,
  );
  for (var i = 0; i < pixels.length; i += 4) {
    final a = pixels[i + 3];
    if (a == 255) continue;
    pixels
      ..[i] = (pixels[i] * a + 127) ~/ 255
      ..[i + 1] = (pixels[i + 1] * a + 127) ~/ 255
      ..[i + 2] = (pixels[i + 2] * a + 127) ~/ 255;
  }
  return ByteData.sublistView(pixels);
}

/// A raster of premultiplied [rgba] pixels made ready for the page: in a
/// browser worker, an `ImageBitmap` made there and handed over, so the page
/// neither copies the pixels nor turns them into an image; elsewhere the
/// pixels themselves.
Future<Object> rasterForPage(Uint8List rgba, int width, int height) async {
  if (!_inWorker) return pack(rgba);
  final data = web.ImageData(_straight(rgba).toJS, width, height.toJS);
  final scope = globalContext as web.WorkerGlobalScope;
  return Moved(await scope.createImageBitmap(data).toDart);
}

/// The image of a raster from [rasterForPage]. A [readable] one keeps a
/// copy of its bitmap for [imagePixels].
Future<ui.Image> imageFromRaster(
  Object raster,
  int width,
  int height, {
  bool readable = false,
}) async {
  if (raster is! Moved) {
    return imageFromRgba(
      unpackBytes(raster),
      width,
      height,
      readable: readable,
    );
  }
  final bitmap = raster.object as web.ImageBitmap;
  final copy = readable
      ? await web.window.createImageBitmap(bitmap).toDart
      : null;
  final image = await ui_web.createImageFromImageBitmap(bitmap);
  _bitmapOf[image] = copy;
  return image;
}

/// Whether this runs in a worker, which has no document.
final bool _inWorker = !globalContext.has('document');

/// [pixels] with their colours no longer multiplied by their alpha, as an
/// `ImageData` takes them.
Uint8ClampedList _straight(Uint8List pixels) {
  final straight = Uint8ClampedList(pixels.length);
  for (var i = 0; i < pixels.length; i += 4) {
    final a = pixels[i + 3];
    if (a == 0) continue;
    straight
      ..[i] = pixels[i] * 255 ~/ a
      ..[i + 1] = pixels[i + 1] * 255 ~/ a
      ..[i + 2] = pixels[i + 2] * 255 ~/ a
      ..[i + 3] = a;
  }
  return straight;
}

/// A browser page has one thread for Dart, so the work runs where it is.
Future<T> runAside<T>(T Function() work) async => work();

Object pack(TypedData data) => data;

Float32List unpackFloats(Object packed) => packed as Float32List;

Uint16List unpackShorts(Object packed) => packed as Uint16List;

Uint8List unpackBytes(Object packed) => packed as Uint8List;

/// The worker script vmap ships as a web only asset.
final String defaultWorkerScript = ui_web.assetManager.getAssetUrl(
  'packages/vmap/assets/vmap_worker.js',
);

/// The script tiles are built and glyphs drawn in, off the page's thread;
/// null to do both on the page's own.
String? workerScript = defaultWorkerScript;

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
  // Each message is a task of its own, as it would be in a worker, so a
  // frame can be drawn between two of them.
  final inbox = StreamController<Object?>();
  worker
    .._send = ((message) => Timer.run(() {
      if (!inbox.isClosed) inbox.add(message);
    }))
    .._stop = inbox.close;
  unawaited(
    body(init, (message) {
      Timer.run(() {
        if (!worker._closed) onMessage(message);
      });
    }, inbox.stream),
  );
}
