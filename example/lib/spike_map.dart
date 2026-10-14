import 'dart:io';
import 'dart:math' as math;
import 'dart:ui' as ui;
import 'dart:ui' show FramePhase;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_displaymode/flutter_displaymode.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/extrusion.dart';
import 'package:vmap/src/style_model.dart';
import 'package:vmap/src/tiles.dart' show TileDraw;
import 'package:vmap/src/view.dart';
import 'package:path_provider/path_provider.dart';
import 'package:vmap/vmap.dart';
import 'package:vmap_gpu/vmap_gpu.dart';

const _out = String.fromEnvironment('OUT', defaultValue: '/tmp/vmap_fly');
const _styleName = String.fromEnvironment('STYLE');
const _script = bool.fromEnvironment('SCRIPT');
const _oldText = bool.fromEnvironment('OLD_TEXT');
const _gpu = bool.fromEnvironment('GPU');
const _circles = bool.fromEnvironment('CIRCLES');
const _lines = bool.fromEnvironment('LINES');
const _zoomTest = bool.fromEnvironment('ZOOMTEST');

/// The zoom test as fast pinches in and out over places not yet loaded.
const _fastZoom = bool.fromEnvironment('FASTZOOM');
const _labels = bool.fromEnvironment('LABELS', defaultValue: true);
const _buildings = bool.fromEnvironment('BUILDINGS', defaultValue: true);
const _variant = String.fromEnvironment('VARIANT', defaultValue: 'full');

const _erbil = MapCameraPosition(
  latitude: 36.1912,
  longitude: 44.0092,
  zoom: 15,
);
const _places = {
  'Erbil': _erbil,
  'Tilted Erbil': MapCameraPosition(
    latitude: 36.1912,
    longitude: 44.0092,
    zoom: 16,
    pitch: 60,
    bearing: -30,
  ),
  'Sulaymaniyah': MapCameraPosition(
    latitude: 35.5613,
    longitude: 45.4374,
    zoom: 15,
    pitch: 45,
    bearing: 40,
  ),
  'Duhok': MapCameraPosition(
    latitude: 36.8669,
    longitude: 42.9503,
    zoom: 14.5,
    pitch: 30,
  ),
};

/// Points around Erbil drawn as circles with rings, to check circle layers.
final _stations = VmapOverlay(
  sources: {
    'stations': {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          for (var i = 0; i < 60; i++)
            {
              'type': 'Feature',
              'properties': {'n': i},
              'geometry': {
                'type': 'Point',
                'coordinates': [
                  44.0092 + 0.012 * math.cos(i * 0.7) * (1 + i / 30),
                  36.1912 + 0.009 * math.sin(i * 0.7) * (1 + i / 30),
                ],
              },
            },
        ],
      },
    },
  },
  layers: [
    {
      'id': 'stations',
      'type': 'circle',
      'source': 'stations',
      'paint': {
        'circle-radius': 9,
        'circle-color': '#1E88E5',
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
      },
    },
  ],
);

/// A route drawn with a colour gradient from start to end, and a ring
/// drawn with a sprite pattern, to check gradient and patterned lines.
final _patternedLines = VmapOverlay(
  sources: {
    'route': {
      'type': 'geojson',
      'lineMetrics': true,
      'data': {
        'type': 'Feature',
        'properties': <String, Object?>{},
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            for (var i = 0; i <= 40; i++)
              [
                43.990 + 0.04 * i / 40,
                36.180 + 0.012 * math.sin(i / 40 * math.pi * 2),
              ],
          ],
        },
      },
    },
    'ring': {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': <String, Object?>{},
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            for (var i = 0; i <= 48; i++)
              [
                44.0092 + 0.008 * math.cos(i / 48 * math.pi * 2),
                36.1980 + 0.006 * math.sin(i / 48 * math.pi * 2),
              ],
          ],
        },
      },
    },
  },
  layers: [
    {
      'id': 'route',
      'type': 'line',
      'source': 'route',
      'layout': {'line-cap': 'round', 'line-join': 'round'},
      'paint': {
        'line-width': 12,
        'line-gradient': [
          'interpolate',
          ['linear'],
          ['line-progress'],
          0,
          '#1E88E5',
          0.5,
          '#43A047',
          1,
          '#E53935',
        ],
      },
    },
    {
      'id': 'ring',
      'type': 'line',
      'source': 'ring',
      'paint': {'line-width': 16, 'line-pattern': 'wetland'},
    },
  ],
);

/// Where tiles, the style and its sprites are kept between runs.
late final String _cacheDirectory;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (Platform.isAndroid) await FlutterDisplayMode.setHighRefreshRate();
  _cacheDirectory = '${(await getApplicationCacheDirectory()).path}/vmap';
  runApp(const MaterialApp(home: _Demo()));
}

class _NoBuildings implements BuildingRenderer {
  @override
  bool paint(
    Canvas canvas,
    MapView view,
    Offset origin,
    StyleSheet sheet,
    Iterable<TileDraw> tiles,
    EvalContext context,
    double styleZoom,
    double devicePixelRatio,
  ) => false;

  @override
  void dispose() {}
}

class _Demo extends StatefulWidget {
  const _Demo();

  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  final controller = VMapController(_erbil);
  final boundary = GlobalKey();
  final engine = VmapEngine(
    style: _styleName.isEmpty
        ? const VmapStyle.builtIn()
        : VmapStyle.url('https://tiles.openfreemap.org/styles/$_styleName'),
    maxCachedTiles: 400,
    source: TileSourceConfig(cacheDirectory: _cacheDirectory),
    overlay: _circles
        ? _stations
        : _lines
        ? _patternedLines
        : null,
    glyphText: !_oldText,
    showLabels: _labels,
    renderer: _gpu && _buildings ? GpuMap.create() : null,
  );

  @override
  void initState() {
    super.initState();
    if (!_buildings) engine.buildingRenderer = _NoBuildings();
    if (_script) _run();
    if (_zoomTest) _zoomRun();
  }

  Future<String> _dir() async =>
      Platform.isAndroid ? (await getExternalStorageDirectory())!.path : _out;

  Future<void> _shot(String name) async {
    final dir = await _dir();
    if (!mounted) return;
    final render =
        boundary.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    final image = await render.toImage(pixelRatio: 2);
    final png = await image.toByteData(format: ui.ImageByteFormat.png);
    File('$dir/$name.png').writeAsBytesSync(png!.buffer.asUint8List());
  }

  Future<void> _zoomRun() async {
    await Future<void>.delayed(const Duration(seconds: 8));
    final frames = <FrameTiming>[];
    void listen(List<FrameTiming> t) => frames.addAll(t);
    SchedulerBinding.instance.addTimingsCallback(listen);
    engine.stats.timings.slowPaints.clear();
    engine.stats.timings
      ..frames = 0
      ..paintMicros = 0
      ..strokeMicros = 0
      ..strokesBuilt = 0
      ..tileSetupMicros = 0
      ..labelMicros = 0
      ..placeMicros = 0;
    const base = MapCameraPosition(
      latitude: 36.1912,
      longitude: 44.0092,
      zoom: 13.5,
      pitch: 45,
      bearing: -20,
    );
    controller.camera = base;
    if (_fastZoom) {
      // Out of one city to the country, over to the next, and quickly in.
      var at = _places['Tilted Erbil']!;
      controller.camera = at;
      await Future<void>.delayed(const Duration(seconds: 2));
      for (final name in ['Sulaymaniyah', 'Duhok', 'Tilted Erbil']) {
        final next = _places[name]!;
        await controller.easeTo(
          at.copyWith(zoom: 8.5, pitch: 20),
          duration: const Duration(milliseconds: 900),
        );
        await controller.easeTo(
          next.copyWith(zoom: 8.5, pitch: 20),
          duration: const Duration(milliseconds: 500),
        );
        await controller.easeTo(
          next.copyWith(zoom: 16.5, pitch: 55),
          duration: const Duration(milliseconds: 1100),
        );
        await Future<void>.delayed(const Duration(milliseconds: 600));
        at = next;
      }
    }
    for (var i = 0; i < (_fastZoom ? 0 : 2); i++) {
      await controller.easeTo(
        base.copyWith(zoom: 17, bearing: 10),
        duration: const Duration(seconds: 3),
      );
      await controller.easeTo(base, duration: const Duration(seconds: 3));
    }
    if (!_fastZoom) {
      await controller.flyTo(_places['Sulaymaniyah']!);
      await controller.flyTo(base.copyWith(zoom: 15.5, pitch: 55));
    }
    SchedulerBinding.instance.removeTimingsCallback(listen);
    int p(List<int> v, double q) {
      if (v.isEmpty) return 0;
      final s = [...v]..sort();
      return s[((s.length - 1) * q).round()];
    }

    final build = [for (final f in frames) f.buildDuration.inMicroseconds];
    final raster = [for (final f in frames) f.rasterDuration.inMicroseconds];
    final over = build.where((b) => b > 8000).length;
    final starts = [
      for (final f in frames) f.timestampInMicroseconds(FramePhase.vsyncStart),
    ]..sort();
    final gaps = [
      for (var i = 1; i < starts.length; i++) starts[i] - starts[i - 1],
    ];
    final interval = p(gaps, .5);
    final missed = gaps
        .where((g) => g > interval * 1.5)
        .fold<int>(0, (n, g) => n + (g / interval).round() - 1);
    final seconds = starts.isEmpty ? 1 : (starts.last - starts.first) / 1e6;
    final budget = interval == 0 ? 8333 : interval;
    debugPrint(
      'zoomtest $_variant: ${(frames.length / seconds).toStringAsFixed(0)} fps '
      'at a ${(1e6 / budget).toStringAsFixed(0)} Hz vsync, missed vsyncs '
      '$missed (${(100 * missed / (frames.length + missed)).toStringAsFixed(1)}%), '
      'build over budget ${build.where((b) => b > budget).length}, '
      'raster over budget ${raster.where((r) => r > budget).length}',
    );
    debugPrint(
      'zoomtest $_variant: ${frames.length} frames, build p50 ${p(build, .5)} '
      'p95 ${p(build, .95)} p99 ${p(build, .99)} max ${p(build, 1)} us, '
      'raster p50 ${p(raster, .5)} p99 ${p(raster, .99)} us, '
      'build over 8 ms: $over',
    );
    final t = engine.stats.timings;
    debugPrint(
      'zoomtest work: strokes ${t.strokesBuilt} in ${t.strokeMicros ~/ 1000} ms, '
      'tile setup ${t.tileSetupMicros ~/ 1000} ms (max ${t.maxTileSetupMicros} us), '
      'labels ${t.labelMicros ~/ 1000} ms, place ${t.placeMicros ~/ 1000} ms '
      '(max ${t.maxPlaceMicros} us), paint ${t.paintMicros ~/ 1000} ms over '
      '${t.frames} frames',
    );
    for (final line in engine.stats.timings.slowPaints.take(40)) {
      debugPrint('zoomtest slow: $line');
    }
    debugPrint('zoomtest: done');
  }

  Future<void> _run() async {
    Directory(await _dir()).createSync(recursive: true);
    await Future<void>.delayed(const Duration(seconds: 6));
    await _shot('0_erbil');
    for (final (i, name) in [
      'Tilted Erbil',
      'Sulaymaniyah',
      'Duhok',
      'Erbil',
    ].indexed) {
      final frames = <FrameTiming>[];
      void listen(List<FrameTiming> t) => frames.addAll(t);
      SchedulerBinding.instance.addTimingsCallback(listen);
      final started = DateTime.now();
      await controller.flyTo(_places[name]!);
      final took = DateTime.now().difference(started);
      SchedulerBinding.instance.removeTimingsCallback(listen);
      final build = [for (final f in frames) f.buildDuration.inMicroseconds]
        ..sort();
      final raster = [for (final f in frames) f.rasterDuration.inMicroseconds]
        ..sort();
      int p(List<int> v, double q) =>
          v.isEmpty ? 0 : v[((v.length - 1) * q).round()];
      debugPrint(
        'fly to $name: ${took.inMilliseconds} ms, ${frames.length} frames, '
        'build p50 ${p(build, .5)} p99 ${p(build, .99)} us, '
        'raster p50 ${p(raster, .5)} p99 ${p(raster, .99)} us',
      );
      await Future<void>.delayed(const Duration(seconds: 5));
      await _shot('${i + 1}_${name.replaceAll(' ', '_').toLowerCase()}');
    }
    exit(0);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Stack(
      children: [
        RepaintBoundary(
          key: boundary,
          child: VMap(controller: controller, engine: engine),
        ),
        Positioned(
          left: 8,
          right: 8,
          bottom: 16,
          child: Wrap(
            spacing: 8,
            children: [
              for (final MapEntry(:key, :value) in _places.entries)
                FilledButton.tonal(
                  onPressed: () => controller.flyTo(value),
                  child: Text(key),
                ),
            ],
          ),
        ),
      ],
    ),
  );
}
