// ignore_for_file: implementation_imports

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/widgets.dart';
import 'package:vmap/src/camera/map_camera.dart';
import 'package:vmap/src/camera/view.dart';
import 'package:vmap/vmap.dart';

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

/// tool/render_suite_out_of_scope.tsv: tests of what a Flutter map has no
/// part in, each id and why, left out of the score in scope.
const _outOfScope = String.fromEnvironment('OUT_OF_SCOPE');

/// tool/render_suite_exceptions.tsv: in-scope tests vmap need not pass yet,
/// each with its kind and why. Every other in-scope test must pass.
const _exceptions = String.fromEnvironment('EXCEPTIONS');
const _port = int.fromEnvironment('PORT', defaultValue: 2900);
const _gpu = bool.fromEnvironment('GPU');
const _multisample = bool.fromEnvironment('MULTISAMPLE', defaultValue: true);

/// Tests run at once: each has its own engine and draws off screen.
const _parallel = int.fromEnvironment('PARALLEL', defaultValue: 6);

/// Whether each test, once drawn, is also watched for a second for frames
/// that still ask for another: a map that is not moving should draw none.
const _idleCheck = bool.fromEnvironment('IDLE_CHECK');

/// Whether each test also writes the labels as placed, to labels.json
/// beside its picture, for comparing placement with MapLibre's.
const _dumpLabels = bool.fromEnvironment('LABELS');

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SizedBox.expand());
  _runAll().whenComplete(() => exit(0));
}

class _Camera {
  double longitude = 0, latitude = 0, zoom = 0, bearing = 0, pitch = 0;
  double roll = 0;

  /// On the globe.
  bool globe = false;

  /// [zoom] no lower than MapLibre's default minZoom, -2.
  double zoomFor(double height) => math.max(zoom, -2);

  /// Space kept free around the drawn area, in pixels, as the style's
  /// operations ask for it.
  EdgeInsets pad = EdgeInsets.zero;

  /// The vertical field of view the last `setVerticalFieldOfView` asked
  /// for, in degrees: MapLibre's default is about 36.87.
  double fovDegrees = 36.87;

  /// Whether this test asks for the padding overlay (`showPadding`).
  bool showPadding = false;

  /// The test's `maxPitch`, else MapLibre's default.
  double maxPitch = 60;

  VmapCamera positionFor(double height) {
    final position = VmapCamera(
      center: LatLng(latitude, longitude),
      zoom: zoomFor(height),
      bearing: bearing,
      pitch: math.min(pitch, maxPitch),
      roll: roll,
      padding: pad,
      fieldOfView: fovDegrees,
    );
    return globe ? position : position.constrained(height);
  }
}

/// MapLibre's padding from a `setPadding` or `easeTo` argument.
EdgeInsets _padOf(Object? value) => switch (value) {
  final num n => EdgeInsets.all(n.toDouble()),
  final Map m => EdgeInsets.only(
    top: (m['top'] as num? ?? 0).toDouble(),
    bottom: (m['bottom'] as num? ?? 0).toDouble(),
    left: (m['left'] as num? ?? 0).toDouble(),
    right: (m['right'] as num? ?? 0).toDouble(),
  ),
  _ => EdgeInsets.zero,
};

class _Result {
  _Result(this.id);

  final String id;
  bool ok = false;
  double difference = 1;
  double allowed = 0;
  String? error;

  /// What the engine reported while drawing; scored on pixels anyway, as
  /// MapLibre's runner scores, since the engine retries what failed.
  String? note;

  Map<String, Object?> toJson() => {
    'id': id,
    'ok': ok,
    'difference': difference,
    'allowed': allowed,
    'error': ?error,
    'note': ?note,
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
  final results = List<_Result?>.filled(ids.length, null);
  var next = 0, done = 0;
  Future<void> worker() async {
    while (next < ids.length) {
      final i = next++;
      final clock = Stopwatch()..start();
      final result = results[i] = await _runOne(
        ids[i],
        '${testsDir.path}/${ids[i]}',
      );
      debugPrint(
        'render ${++done}/${ids.length} ${result.ok ? 'pass' : 'FAIL'} '
        '${ids[i]} '
        '${result.error ?? result.difference.toStringAsFixed(4)} '
        '${(clock.elapsedMilliseconds / 1000).toStringAsFixed(1)}s',
      );
    }
  }

  await Future.wait([for (var w = 0; w < _parallel; w++) worker()]);
  final all = results.cast<_Result>();
  File('$_out/results.json').writeAsStringSync(
    const JsonEncoder.withIndent(' ')
        .convert([for (final r in all) r.toJson()]),
  );
  File('$_out/index.html').writeAsStringSync(_report(all, testsDir.path));
  final passed = all.where((r) => r.ok).length;
  final errored = all.where((r) => r.error != null).length;
  debugPrint(
    'render suite: $passed of ${all.length} passed, '
    '${all.length - passed - errored} failed, $errored errored',
  );
  if (_outOfScope.isNotEmpty) {
    final left = {
      for (final line in File(_outOfScope).readAsLinesSync())
        if (line.contains('\t')) line.split('\t').first,
    };
    final scoped = all.where((r) => !left.contains(r.id));
    debugPrint(
      'in scope: ${scoped.where((r) => r.ok).length} of ${scoped.length} '
      'passed, ${all.length - scoped.length} out of scope',
    );
    if (_exceptions.isNotEmpty) {
      final excepted = {
        for (final line in File(_exceptions).readAsLinesSync())
          if (line.contains('\t')) line.split('\t').first,
      };
      final must = scoped.where((r) => !excepted.contains(r.id));
      final stale = scoped.where((r) => r.ok && excepted.contains(r.id));
      debugPrint(
        'must pass: ${must.where((r) => r.ok).length} of ${must.length} '
        'passed, ${scoped.length - must.length} excepted'
        '${stale.isEmpty ? '' : ', ${stale.length} excepted but passing: '
                  '${stale.map((r) => r.id).join(' ')}'}',
      );
    }
  }
}

Future<_Result> _runOne(String id, String dir) async {
  final result = _Result(id);
  _Session? session;
  try {
    final style = jsonDecode(
      File('$dir/style.json').readAsStringSync(),
    ) as Map<String, Object?>;
    final test =
        ((style['metadata'] as Map?)?['test'] as Map?)
            ?.cast<String, Object?>() ??
        const {};
    result.allowed = (test['allowed'] as num? ?? 0.00025).toDouble();
    final width = (test['width'] as num? ?? 512).toInt();
    final height = (test['height'] as num? ?? 512).toInt();
    // MapLibre's runner caps the canvas at 8192 pixels a side, which lowers
    // the pixel ratio.
    final ratio = math.min(
      (test['pixelRatio'] as num? ?? 1).toDouble(),
      math.min(8192 / width, 8192 / height),
    );
    session =
        _Session(
            style,
            width: width,
            height: height,
            ratio: ratio,
            collisionBoxes: test['collisionDebug'] == true,
            crossSourceCollisions: test['crossSourceCollisions'] != false,
            onError: (e) => result.note ??= 'engine: $e',
          )
          ..camera.showPadding = test['showPadding'] == true
          ..camera.maxPitch = (test['maxPitch'] as num? ?? 60).toDouble();
    await session.settle();
    final operations = (test['operations'] as List?) ?? const [];
    for (final op in operations) {
      await session.apply(op as List);
    }
    // After a timed wait the picture is taken as it stands, mid-transition.
    final timed = switch (operations.lastOrNull) {
      ['wait', num _] => true,
      _ => false,
    };
    if (!timed) await session.settle();
    if (_idleCheck) {
      final busy = await session.framesAskedWhileIdle();
      if (busy > 2) result.note ??= 'asked for $busy frames while idle';
    }
    if (_dumpLabels) {
      final out = Directory('$_out/$id')..createSync(recursive: true);
      File('${out.path}/labels.json')
          .writeAsStringSync(jsonEncode(session._engine.debugLabels()));
      File('${out.path}/boxes.json')
          .writeAsStringSync(jsonEncode(session._engine.debugBoxes()));
    }
    var actual = session.capture();
    // The runner reads back the bottom-left corner of that size.
    if (test['reportWidth'] case final num w) {
      final h = (test['reportHeight'] as num? ?? w).toInt();
      final recorder = ui.PictureRecorder();
      ui.Canvas(recorder).drawImageRect(
        actual,
        ui.Rect.fromLTWH(
          0,
          actual.height - h.toDouble(),
          w.toDouble(),
          h.toDouble(),
        ),
        ui.Rect.fromLTWH(0, 0, w.toDouble(), h.toDouble()),
        ui.Paint(),
      );
      final cropped = recorder.endRecording().toImageSync(w.toInt(), h);
      actual.dispose();
      actual = cropped;
    }
    await _score(
      result,
      actual,
      dir,
      (test['threshold'] as num? ?? 0.1285).toDouble(),
    );
    actual.dispose();
  } catch (e) {
    result.error ??= '$e';
  } finally {
    session?.dispose();
  }
  return result;
}

/// One test's engine, style, camera and the changes its operations made.
class _Session {
  _Session(
    this._document, {
    required this.width,
    required this.height,
    required this.ratio,
    required this.collisionBoxes,
    required this.crossSourceCollisions,
    required this.onError,
  }) {
    _readCamera(_document, _camera);
    _engine = _make();
  }

  final int width, height;
  final double ratio;
  final bool collisionBoxes;
  final bool crossSourceCollisions;
  final void Function(Object error) onError;
  final _camera = _Camera();
  _Camera get camera => _camera;
  Map<String, Object?> _document;
  final _edits = <VmapStyleEdit>[];
  final _states = <(String, Object?), Map<String, Object?>>{};
  final _images = <String, VmapImage>{};
  late VmapEngine _engine;
  bool _clampedToGround = true;

  VmapEngine _make() =>
      VmapEngine(
          style: VmapStyle.json(_localize(_document) as Map<String, Object?>),
          network: VmapNetworkOptions(spritePixelRatio: ratio),
          rendering: VmapRenderOptions(
            renderer: _gpu ? VmapRenderer.gpu : VmapRenderer.canvas,
            antialias: _multisample,
            maxCachedTiles: 200,
          ),
          labels: VmapLabelOptions(
            crossSourceCollisions: crossSourceCollisions,
          ),
        )
        ..onError = onError
        ..showCollisionBoxes = collisionBoxes;

  Future<void> settle() => _settle(_engine, () => _paintNow(false));

  /// Of the frames drawn over the second after the first 300 ms, how many
  /// left the engine busy.
  Future<int> framesAskedWhileIdle() async {
    final watch = Stopwatch()..start();
    var busy = 0;
    while (watch.elapsedMilliseconds < 1300) {
      _paintNow(false);
      if (watch.elapsedMilliseconds > 300 && _engine.stats.busy) busy++;
      await Future<void>.delayed(const Duration(milliseconds: 16));
    }
    return busy;
  }

  ui.Image capture() => _paintNow(true)!;

  ui.Image? _paintNow(bool capture) =>
      _paint(_engine, _camera, width, height, ratio, capture);

  void dispose() => _engine.dispose();

  void _restyle() => _engine.style = VmapStyle.json(
    _localize(_document) as Map<String, Object?>,
  );

  void _edit(VmapStyleEdit e) => _engine.edits = [..._edits..add(e)];

  void _restate() => _engine.featureStates = [
    for (final MapEntry(key: (source, id), :value) in _states.entries)
      VmapFeatureState(source: source, id: id, state: value),
  ];

  List<Object?> get _layers => [...(_document['layers'] as List?) ?? const []];

  Map<String, Object?> get _sources => {
    ...?(_document['sources'] as Map?)?.cast<String, Object?>(),
  };

  /// Makes one of the test's operations, as MapLibre's runner names them.
  Future<void> apply(List o) async {
    switch (o[0]) {
      case 'wait' when o.length > 1 && o[1] is num:
        // As MapLibre's runner: that long, then one frame.
        await Future<void>.delayed(
          Duration(milliseconds: (o[1] as num).toInt()),
        );
        await _loaded(_engine, () => _paintNow(false));
      case 'wait' || 'idle':
        await settle();
      case 'sleep':
        await Future<void>.delayed(
          Duration(milliseconds: num.parse('${o[1]}').toInt()),
        );
        await settle();
      case 'setStyle':
        _engine.dispose();
        _document = o[1] is String
            ? jsonDecode(
                File(
                  '$_suite/assets/${(o[1] as String).replaceFirst('local://', '')}',
                ).readAsStringSync(),
              ) as Map<String, Object?>
            : (o[1] as Map).cast<String, Object?>();
        _edits.clear();
        _states.clear();
        _images.clear();
        _engine = _make();
        await settle();
      case 'addImage':
        final options = o.length > 3 ? o[3] as Map : const {};
        final codec = await ui.instantiateImageCodec(
          File('$_suite/assets/${o[2]}').readAsBytesSync(),
        );
        final frame = await codec.getNextFrame();
        codec.dispose();
        _images[o[1] as String] = VmapImage(
          frame.image,
          pixelRatio: (options['pixelRatio'] as num? ?? 1).toDouble(),
          sdf: options['sdf'] == true,
        );
        _engine.overlay = VmapOverlay(images: {..._images});
      case 'removeImage':
        _images.remove(o[1]);
        _engine.overlay = VmapOverlay(images: {..._images});
      case 'setGlobalStateProperty':
        _edit(VmapStyleEdit.state(o[1] as String, o[2]));
      case 'setPaintProperty':
        _edit(VmapStyleEdit.paint(o[1] as String, o[2] as String, o[3]));
      case 'setLayoutProperty':
        _edit(VmapStyleEdit.layout(o[1] as String, o[2] as String, o[3]));
      case 'setFilter':
        _edit(VmapStyleEdit.filter(o[1] as String, o.length > 2 ? o[2] : null));
      case 'setLayerZoomRange':
        _edit(
          VmapStyleEdit.zoomRange(
            o[1] as String,
            min: (o[2] as num?)?.toDouble(),
            max: (o[3] as num?)?.toDouble(),
          ),
        );
      case 'addLayer':
        final all = _layers;
        final before = o.length > 2 ? o[2] : null;
        final at = all.indexWhere((l) => (l as Map)['id'] == before);
        all.insert(at < 0 ? all.length : at, o[1]);
        _document = {..._document, 'layers': all};
        _restyle();
      case 'removeLayer':
        _document = {
          ..._document,
          'layers': _layers..removeWhere((l) => (l as Map)['id'] == o[1]),
        };
        _restyle();
      case 'setLight':
        _document = {..._document}..remove('light');
        if (o.length > 1 && o[1] != null) _document['light'] = o[1];
        _restyle();
      case 'setSky':
        _document = {..._document}..remove('sky');
        if (o.length > 1 && o[1] != null) _document['sky'] = o[1];
        _restyle();
      case 'setTerrain':
        _document = {..._document}..remove('terrain');
        if (o.length > 1 && o[1] != null) _document['terrain'] = o[1];
        _restyle();
      case 'addSource':
        _document = {
          ..._document,
          'sources': _sources..[o[1] as String] = o[2],
        };
        _restyle();
      case 'removeSource':
        _document = {..._document, 'sources': _sources..remove(o[1])};
        _restyle();
      case 'setFeatureState':
        final target = o[1] as Map;
        final key = (target['source'] as String, target['id']);
        _states[key] = {
          ...?_states[key],
          ...(o[2] as Map).cast<String, Object?>(),
        };
        _restate();
      case 'removeFeatureState':
        final target = o[1] as Map;
        final name = o.length > 2 ? o[2] as String? : null;
        _states.removeWhere((k, v) {
          if (k.$1 != target['source']) return false;
          if (target.containsKey('id') && k.$2 != target['id']) return false;
          if (name == null) return true;
          v.remove(name);
          return v.isEmpty;
        });
        _restate();
      case 'easeTo' || 'flyTo' || 'jumpTo':
        final to = o[1] as Map;
        if (to['center'] case [final num lon, final num lat]) {
          _camera
            ..longitude = lon.toDouble()
            ..latitude = lat.toDouble();
        }
        _camera
          ..zoom = (to['zoom'] as num? ?? _camera.zoom).toDouble()
          ..bearing = (to['bearing'] as num? ?? _camera.bearing).toDouble()
          ..pitch = (to['pitch'] as num? ?? _camera.pitch).toDouble()
          ..roll = (to['roll'] as num? ?? _camera.roll).toDouble();
        // An `easeTo` sets the padding it was given, replacing the map's
        // (`camera.ts`: `options.padding ?? tr.padding`).
        if (to['padding'] != null) _camera.pad = _padOf(to['padding']);
      case 'setZoom':
        _camera.zoom = (o[1] as num).toDouble();
      case 'setCenter':
        final c = o[1] as List;
        _camera
          ..longitude = (c[0] as num).toDouble()
          ..latitude = (c[1] as num).toDouble();
      case 'setBearing':
        _camera.bearing = (o[1] as num).toDouble();
      case 'setPitch':
        _camera.pitch = (o[1] as num).toDouble();
      case 'setRoll':
        _camera.roll = (o[1] as num).toDouble();
      case 'setPadding':
        _camera.pad = _padOf(o[1]);
      case 'setVerticalFieldOfView':
        _camera.fovDegrees = (o[1] as num).toDouble();
      case 'setCenterClampedToGround':
        _clampedToGround = o[1] as bool;
        if (_clampedToGround) _engine.centerElevation = null;
      case 'setCenterElevation':
        if (!_clampedToGround) {
          _engine.centerElevation = (o[1] as num).toDouble();
        }
      case 'pauseTiles':
        // Tiles are asked for on demand, so there is nothing to pause; a
        // test that pauses them keeps whatever has loaded.
        break;
      default:
        throw UnsupportedError('operation ${o[0]}');
    }
  }
}

/// Scores [actual] against the test's expected images in [dir] as
/// MapLibre's runner does, keeping the closest, and saves ours and the
/// difference when it fails.
Future<void> _score(
  _Result result,
  ui.Image actual,
  String dir,
  double threshold,
) async {
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
  if (result.ok) return;
  final out = Directory('$_out/${result.id}')..createSync(recursive: true);
  // From the pixels scored: the image's texture may hold a later frame
  // by now.
  File('${out.path}/actual.png').writeAsBytesSync(await _encode(pixels, w, h));
  if (bestDiff != null) {
    File('${out.path}/diff.png')
        .writeAsBytesSync(await _encode(bestDiff, w, h));
  }
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
    ..pitch = (style['pitch'] as num? ?? 0).toDouble()
    ..roll = (style['roll'] as num? ?? 0).toDouble()
    ..globe = switch (style['projection']) {
      {'type': final type} =>
        '$type'.contains('globe') || '$type'.contains('vertical-perspective'),
      _ => false,
    };
}

/// Points every `local://` address in [value] at the asset server.
Object? _localize(Object? value) => switch (value) {
  String s when s.startsWith('local://') => s.replaceFirst(
    'local://',
    'http://127.0.0.1:$_port/',
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
  final position = camera.positionFor(size.height);
  canvas.clipRect(ui.Offset.zero & size);
  engine.paint(canvas, size, position, devicePixelRatio: ratio);
  if (camera.showPadding) {
    _paintPadding(canvas, size, position.view(size.width, size.height));
  }
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

/// Paints whenever the engine asks, until its style has loaded and it has
/// nothing left to load, fade or draw for a couple of frames.
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
    // The engine asks for its next frame through the scheduler, which a
    // hidden window seldom drives; this loop paints in its place.
    final stats = engine.stats;
    if (stats.busy || stats.tilesLoading > 0 || stats.resourcesLoading > 0) {
      dirty = true;
    }
    if (!dirty &&
        engine.styleLoaded &&
        engine.stats.tilesLoading == 0 &&
        engine.stats.resourcesLoading == 0 &&
        !engine.stats.busy &&
        clock.elapsedMilliseconds - lastPaint > 100) {
      break;
    }
  }
  engine.removeListener(listen);
}

/// Paints until nothing [engine] needs is still loading, without waiting
/// for what is animating, then once more.
Future<void> _loaded(VmapEngine engine, void Function() paint) async {
  final clock = Stopwatch()..start();
  paint();
  while (clock.elapsedMilliseconds < 20000 &&
      (!engine.styleLoaded ||
          engine.stats.tilesLoading > 0 ||
          engine.stats.resourcesLoading > 0 ||
          engine.stats.preparing)) {
    await Future<void>.delayed(const Duration(milliseconds: 16));
    paint();
  }
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

/// MapLibre's padding overlay, as `draw_debug.ts` draws it when a test asks
/// for `showPadding`: a band at each padding edge in its own colour, and a
/// crosshair where the camera looks.
///
/// MapLibre clears it as scissored rectangles in GL space, y up, each
/// [lineWidth] thick laid half a pixel either side of its line, and reads
/// the frame back flipped. A rectangle from y to y + lineWidth in GL space
/// therefore lands on the screen at height - y - lineWidth, which is what
/// the drawRect here does.
void _paintPadding(ui.Canvas canvas, ui.Size size, MapView view) {
  final pad = view.pad;
  // MapLibre clears a band with a scissor rectangle, which OpenGL takes in
  // whole pixels: it starts at the pixel holding its fractional top and
  // covers the pixels it straddles. The band is three of them, and the
  // tiles below and above it are whatever was drawn, so the band's rows
  // are the three the line sits in.
  void band(ui.Color color, int left, int top, int width, int height) =>
      canvas.drawRect(
        ui.Rect.fromLTWH(
          left.toDouble(),
          top.toDouble(),
          width.toDouble(),
          height.toDouble(),
        ),
        ui.Paint()..color = color,
      );

  final w = size.width.toInt(), h = size.height.toInt();
  // MapLibre puts a band's middle a pixel inside its line: the top line
  // is `pad.top` down, the bottom one `pad.bottom` up, the left `pad.left`
  // in and the right `pad.right` in, and the band is the three pixels
  // about that.
  band(const ui.Color(0xFFFF0000), 0, pad.top.toInt() - 4, w, 3);
  band(const ui.Color(0xFF00FF00), 0, h - pad.bottom.toInt() - 2, w, 3);
  band(const ui.Color(0xFF0000FF), pad.left.toInt() - 2, 0, 3, h);
  band(const ui.Color(0xFFFF00FF), w - pad.right.toInt() - 2, 0, 3, h);
  // A cyan crosshair where the camera looks.
  final cx = view.screenCenter.x.toInt();
  final cy = view.screenCenter.y.toInt();
  band(const ui.Color(0xFF00FFFF), cx - 1, cy - 10, 3, 20);
  band(const ui.Color(0xFF00FFFF), cx - 10, cy - 1, 20, 3);
}
