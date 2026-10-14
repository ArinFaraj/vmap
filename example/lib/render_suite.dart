import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/widgets.dart';
import 'package:vmap/vmap.dart';
import 'package:vmap_gpu/vmap_gpu.dart';

import 'render_suite/pixelmatch.dart';

/// Runs MapLibre GL JS's render tests through the engine and scores each
/// the way MapLibre's own runner does. Driven by tool/render_suite.sh,
/// which serves the test assets on [_port].
const _suite = String.fromEnvironment('SUITE');
const _out = String.fromEnvironment(
  'OUT',
  defaultValue: '/tmp/vmap_render_suite',
);
const _filter = String.fromEnvironment('FILTER');
const _port = int.fromEnvironment('PORT', defaultValue: 2900);
const _gpu = bool.fromEnvironment('GPU');

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SizedBox.expand());
  _runAll().whenComplete(() => exit(0));
}

class _Camera {
  double longitude = 0, latitude = 0, zoom = 0, bearing = 0, pitch = 0;
}

class _Result {
  _Result(this.id);

  final String id;
  bool ok = false;
  double difference = 1;
  double allowed = 0;
  String? error;

  Map<String, Object?> toJson() => {
    'id': id,
    'ok': ok,
    'difference': difference,
    'allowed': allowed,
    'error': ?error,
  };
}

Future<void> _runAll() async {
  final testsDir = Directory('$_suite/render/tests');
  final filters = [
    for (final f in _filter.split(','))
      if (f.trim().isNotEmpty) f.trim(),
  ];
  final ids =
      [
          for (final f in testsDir.listSync(recursive: true))
            if (f is File && f.path.endsWith('/style.json'))
              f.parent.path.substring(testsDir.path.length + 1),
        ]
        ..retainWhere(
          (id) => filters.isEmpty || filters.any((f) => id.startsWith(f)),
        )
        ..sort();
  Directory(_out).createSync(recursive: true);
  final results = <_Result>[];
  for (final (i, id) in ids.indexed) {
    final result = await _runOne(id, '${testsDir.path}/$id');
    results.add(result);
    debugPrint(
      'render ${i + 1}/${ids.length} ${result.ok ? 'pass' : 'FAIL'} $id '
      '${result.error ?? result.difference.toStringAsFixed(4)}',
    );
  }
  File('$_out/results.json').writeAsStringSync(
    const JsonEncoder.withIndent(' ')
        .convert([for (final r in results) r.toJson()]),
  );
  File('$_out/index.html').writeAsStringSync(_report(results, testsDir.path));
  final passed = results.where((r) => r.ok).length;
  final errored = results.where((r) => r.error != null).length;
  debugPrint(
    'render suite: $passed of ${results.length} passed, '
    '${results.length - passed - errored} failed, $errored errored',
  );
}

Future<_Result> _runOne(String id, String dir) async {
  final result = _Result(id);
  VmapEngine? engine;
  try {
    final style = jsonDecode(
      File('$dir/style.json').readAsStringSync(),
    ) as Map<String, Object?>;
    final test =
        ((style['metadata'] as Map?)?['test'] as Map?)
            ?.cast<String, Object?>() ??
        const {};
    final width = (test['width'] as num? ?? 512).toInt();
    final height = (test['height'] as num? ?? 512).toInt();
    final ratio = (test['pixelRatio'] as num? ?? 1).toDouble();
    final threshold = (test['threshold'] as num? ?? 0.1285).toDouble();
    result.allowed = (test['allowed'] as num? ?? 0.00025).toDouble();
    final camera = _Camera();
    _readCamera(style, camera);

    VmapEngine make(Map<String, Object?> document) {
      final made = VmapEngine(
        style: VmapStyle.json(_localize(document) as Map<String, Object?>),
        maxCachedTiles: 200,
        renderer: _gpu ? GpuMap.create() : null,
      );
      made.onError = (e) => result.error ??= 'engine: $e';
      return made;
    }

    engine = make(style);
    void paint() => _paint(engine!, camera, width, height, ratio, null);
    await _settle(engine, paint);
    for (final op in (test['operations'] as List?) ?? const []) {
      final o = op as List;
      switch (o[0]) {
        case 'wait' || 'idle':
          await _settle(engine!, paint);
        case 'sleep':
          await Future<void>.delayed(
            Duration(milliseconds: (o[1] as num).toInt()),
          );
          await _settle(engine!, paint);
        case 'setStyle':
          final next = o[1] is String
              ? jsonDecode(
                  File(
                    '$_suite/assets/${(o[1] as String).replaceFirst('local://', '')}',
                  ).readAsStringSync(),
                ) as Map<String, Object?>
              : (o[1] as Map).cast<String, Object?>();
          engine!.dispose();
          engine = make(next);
          await _settle(engine, paint);
        case 'setZoom':
          camera.zoom = (o[1] as num).toDouble();
        case 'setCenter':
          final c = o[1] as List;
          camera
            ..longitude = (c[0] as num).toDouble()
            ..latitude = (c[1] as num).toDouble();
        case 'setBearing':
          camera.bearing = (o[1] as num).toDouble();
        case 'setPitch':
          camera.pitch = (o[1] as num).toDouble();
        default:
          throw UnsupportedError('operation ${o[0]}');
      }
    }
    await _settle(engine!, paint);
    final actual = _paint(engine, camera, width, height, ratio, true)!;
    final pixels = (await actual.toByteData(
      format: ui.ImageByteFormat.rawStraightRgba,
    ))!.buffer.asUint8List();
    final w = actual.width, h = actual.height;
    final diff = Uint8List(w * h * 4);
    var best = double.infinity;
    Uint8List? bestDiff;
    for (final f in Directory(dir).listSync()) {
      final name = f.uri.pathSegments.last;
      if (!name.startsWith('expected') || !name.endsWith('.png')) continue;
      final expected = await _decode((f as File).readAsBytesSync());
      if (expected.width != w || expected.height != h) continue;
      final count = pixelmatch(
        expected.pixels,
        pixels,
        diff,
        w,
        h,
        threshold: threshold,
      );
      final share = count / (w * h);
      if (share < best) {
        best = share;
        bestDiff = Uint8List.fromList(diff);
      }
    }
    result
      ..difference = best.isFinite ? best : 1
      ..ok = result.error == null && best <= result.allowed;
    if (!result.ok) {
      final out = Directory('$_out/$id')..createSync(recursive: true);
      File('${out.path}/actual.png').writeAsBytesSync(
        (await actual.toByteData(format: ui.ImageByteFormat.png))!.buffer
            .asUint8List(),
      );
      if (bestDiff != null) {
        File('${out.path}/diff.png')
            .writeAsBytesSync(await _encode(bestDiff, w, h));
      }
    }
    actual.dispose();
  } catch (e) {
    result.error ??= '$e';
  } finally {
    engine?.dispose();
  }
  return result;
}

void _readCamera(Map<String, Object?> style, _Camera camera) {
  final center = style['center'] as List?;
  if (center != null) {
    camera
      ..longitude = (center[0] as num).toDouble()
      ..latitude = (center[1] as num).toDouble();
  }
  camera
    ..zoom = (style['zoom'] as num? ?? 0).toDouble()
    ..bearing = (style['bearing'] as num? ?? 0).toDouble()
    ..pitch = (style['pitch'] as num? ?? 0).toDouble();
}

/// Points every `local://` address in [value] at the asset server.
Object? _localize(Object? value) => switch (value) {
  String s when s.startsWith('local://') => s.replaceFirst(
    'local://',
    'http://localhost:$_port/',
  ),
  Map m => {for (final e in m.entries) e.key as String: _localize(e.value)},
  List l => [for (final v in l) _localize(v)],
  _ => value,
};

/// Paints a frame, and with [capture] returns it as an image.
ui.Image? _paint(
  VmapEngine engine,
  _Camera camera,
  int width,
  int height,
  double ratio,
  bool? capture,
) {
  final recorder = ui.PictureRecorder();
  final canvas = ui.Canvas(recorder)..scale(ratio);
  final size = ui.Size(width.toDouble(), height.toDouble());
  final view = MapCameraPosition(
    latitude: camera.latitude,
    longitude: camera.longitude,
    zoom: camera.zoom,
    bearing: camera.bearing,
    pitch: camera.pitch,
  ).view(size.width, size.height);
  final center = view.center;
  canvas.clipRect(ui.Offset.zero & size);
  engine.paint(
    canvas,
    VmapCamera(
      zoom: camera.zoom + 1,
      origin: ui.Offset(center.x - size.width / 2, center.y - size.height / 2),
      size: size,
      rotation: camera.bearing * math.pi / 180,
      devicePixelRatio: ratio,
      view: view,
    ),
  );
  final picture = recorder.endRecording();
  if (capture != true) {
    picture.dispose();
    return null;
  }
  final image = picture.toImageSync(
    (width * ratio).round(),
    (height * ratio).round(),
  );
  picture.dispose();
  return image;
}

/// Paints whenever the engine asks, until it has been quiet with nothing
/// loading for a while.
Future<void> _settle(VmapEngine engine, void Function() paint) async {
  var dirty = true;
  void listen() => dirty = true;
  engine.addListener(listen);
  final clock = Stopwatch()..start();
  var lastPaint = 0;
  while (clock.elapsedMilliseconds < 20000) {
    if (dirty) {
      dirty = false;
      paint();
      lastPaint = clock.elapsedMilliseconds;
    }
    await Future<void>.delayed(const Duration(milliseconds: 16));
    if (!dirty &&
        engine.stats.tilesLoading == 0 &&
        clock.elapsedMilliseconds > 800 &&
        clock.elapsedMilliseconds - lastPaint > 400) {
      break;
    }
  }
  engine.removeListener(listen);
}

Future<({Uint8List pixels, int width, int height})> _decode(
  Uint8List png,
) async {
  final codec = await ui.instantiateImageCodec(png);
  final frame = await codec.getNextFrame();
  final image = frame.image;
  final data = await image.toByteData(
    format: ui.ImageByteFormat.rawStraightRgba,
  );
  final out = (
    pixels: data!.buffer.asUint8List(),
    width: image.width,
    height: image.height,
  );
  image.dispose();
  codec.dispose();
  return out;
}

Future<Uint8List> _encode(Uint8List rgba, int width, int height) async {
  final done = Completer<ui.Image>();
  ui.decodeImageFromPixels(
    rgba,
    width,
    height,
    ui.PixelFormat.rgba8888,
    done.complete,
  );
  final image = await done.future;
  final png = await image.toByteData(format: ui.ImageByteFormat.png);
  image.dispose();
  return png!.buffer.asUint8List();
}

String _report(List<_Result> results, String testsDir) {
  final groups = <String, List<_Result>>{};
  for (final r in results) {
    (groups[r.id.split('/').first] ??= []).add(r);
  }
  final passed = results.where((r) => r.ok).length;
  final html = StringBuffer()
    ..writeln('<!doctype html><meta charset="utf-8">')
    ..writeln('<title>vmap render suite</title>')
    ..writeln(
      '<style>body{font:14px system-ui;margin:24px}img{width:256px;'
      'image-rendering:pixelated;border:1px solid #ccc}td{vertical-align:top;'
      'padding:4px 8px}.ok{color:#1a7f37}.bad{color:#cf222e}</style>',
    )
    ..writeln(
      '<h1>$passed of ${results.length} passed '
      '(${(100 * passed / math.max(results.length, 1)).toStringAsFixed(1)}%)'
      '${_gpu ? ', GPU renderer' : ', canvas renderer'}</h1>',
    )
    ..writeln('<h2>By group</h2><table>');
  for (final MapEntry(:key, :value) in groups.entries) {
    final ok = value.where((r) => r.ok).length;
    html.writeln(
      '<tr><td><a href="#$key">$key</a></td>'
      '<td class="${ok == value.length ? 'ok' : 'bad'}">$ok / ${value.length}</td></tr>',
    );
  }
  html.writeln('</table><h2>Failures</h2>');
  for (final MapEntry(:key, :value) in groups.entries) {
    final failed = value.where((r) => !r.ok);
    if (failed.isEmpty) continue;
    html.writeln('<h3 id="$key">$key</h3><table>');
    for (final r in failed) {
      html.writeln(
        '<tr><td>${r.id}<br>${r.error ?? 'differs ${(r.difference * 100).toStringAsFixed(2)}%'}</td>'
        '<td><img src="file://$testsDir/${r.id}/expected.png" title="expected"></td>'
        '<td><img src="${r.id}/actual.png" title="ours"></td>'
        '<td><img src="${r.id}/diff.png" title="diff"></td></tr>',
      );
    }
    html.writeln('</table>');
  }
  return html.toString();
}
