import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:path_provider/path_provider.dart';
import 'package:vmap/vmap.dart';

import 'gpu/gpu_buildings.dart';

const _out = String.fromEnvironment('OUT', defaultValue: '/tmp/vmap_fly');
const _styleName = String.fromEnvironment('STYLE');
const _script = bool.fromEnvironment('SCRIPT');
const _oldText = bool.fromEnvironment('OLD_TEXT');
const _gpu = bool.fromEnvironment('GPU');
const _zoomTest = bool.fromEnvironment('ZOOMTEST');

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

void main() => runApp(const MaterialApp(home: _Demo()));

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
    glyphText: !_oldText,
  );

  @override
  void initState() {
    super.initState();
    if (_gpu) {
      final buildings = GpuBuildings.create();
      if (buildings != null) engine.buildingRenderer = buildings;
    }
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
    const base = MapCameraPosition(
      latitude: 36.1912,
      longitude: 44.0092,
      zoom: 13.5,
      pitch: 45,
      bearing: -20,
    );
    controller.camera = base;
    for (var i = 0; i < 3; i++) {
      await controller.easeTo(
        base.copyWith(zoom: 17, bearing: 10),
        duration: const Duration(seconds: 3),
      );
      await controller.easeTo(base, duration: const Duration(seconds: 3));
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
    debugPrint(
      'zoomtest: ${frames.length} frames, build p50 ${p(build, .5)} '
      'p95 ${p(build, .95)} p99 ${p(build, .99)} max ${p(build, 1)} us, '
      'raster p50 ${p(raster, .5)} p99 ${p(raster, .99)} us, '
      'build over 8 ms: $over',
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
