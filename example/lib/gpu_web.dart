import 'dart:async';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:vmap/vmap.dart';

/// Liberty over Erbil in a browser, flying a fixed tour and printing the
/// frame times, on the GPU renderer, or on the canvas with `?gpu=off`.
/// `?terrain=on` raises the ground; `?tour=off&lat=..&lon=..&zoom=..` stays
/// at one place.
void main() {
  final query = Uri.base.queryParameters;
  runApp(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      home: _Bench(
        gpu: query['gpu'] != 'off',
        terrain: query['terrain'] == 'on',
        tour: query['tour'] != 'off',
        start: MapCameraPosition(
          latitude: double.tryParse(query['lat'] ?? '') ?? _erbil.latitude,
          longitude: double.tryParse(query['lon'] ?? '') ?? _erbil.longitude,
          zoom: double.tryParse(query['zoom'] ?? '') ?? _erbil.zoom,
        ),
      ),
    ),
  );
}

const _erbil = MapCameraPosition(latitude: 36.19, longitude: 44.01, zoom: 14);

class _Bench extends StatefulWidget {
  const _Bench({
    required this.gpu,
    required this.terrain,
    required this.tour,
    required this.start,
  });

  final bool gpu;
  final bool terrain;
  final bool tour;
  final MapCameraPosition start;

  @override
  State<_Bench> createState() => _BenchState();
}

class _BenchState extends State<_Bench> {
  late final controller = VMapController(widget.start);
  late final VmapEngine engine = VmapEngine(
    style: VmapStyle.url('https://tiles.openfreemap.org/styles/liberty'),
    maxCachedTiles: 400,
    overlay: widget.terrain
        ? const VmapOverlay(
            sources: {
              'dem': {
                'type': 'raster-dem',
                'tiles': [
                  'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
                ],
                'encoding': 'terrarium',
                'maxzoom': 15,
              },
            },
            terrain: {'source': 'dem', 'exaggeration': 1.5},
          )
        : null,
    renderer: widget.gpu ? GpuMap.create() : null,
  );
  final List<ui.FrameTiming> _timings = [];
  String _status = 'loading';

  @override
  void initState() {
    super.initState();
    engine.onError = (e) => debugPrint('VMAPERROR $e');
    SchedulerBinding.instance.addTimingsCallback(_timings.addAll);
    if (widget.tour) unawaited(_tour());
  }

  Future<void> _tour() async {
    await Future<void>.delayed(const Duration(seconds: 6));
    _timings.clear();
    final watch = Stopwatch()..start();
    var frames = 0;
    void count(Duration _) {
      frames++;
      if (watch.elapsedMilliseconds < 12000) {
        SchedulerBinding.instance.scheduleFrameCallback(count);
      }
    }

    SchedulerBinding.instance.scheduleFrameCallback(count);
    for (final to in const [
      MapCameraPosition(latitude: 36.20, longitude: 44.03, zoom: 15.5),
      MapCameraPosition(
        latitude: 36.19,
        longitude: 44.00,
        zoom: 15,
        pitch: 55,
        bearing: 40,
      ),
      MapCameraPosition(
        latitude: 36.17,
        longitude: 44.02,
        zoom: 13,
        pitch: 30,
        bearing: -20,
      ),
      _erbil,
    ]) {
      await controller.flyTo(to, duration: const Duration(seconds: 3));
    }
    final seconds = watch.elapsedMilliseconds / 1000;
    final builds = [for (final t in _timings) t.buildDuration.inMicroseconds]
      ..sort();
    final rasters = [for (final t in _timings) t.rasterDuration.inMicroseconds]
      ..sort();
    int p(List<int> v, double q) =>
        v.isEmpty ? 0 : v[((v.length - 1) * q).round()];
    final line =
        'VMAPBENCH renderer=${widget.gpu && engine.renderer != null ? 'gpu' : 'canvas'} '
        'frames=$frames seconds=${seconds.toStringAsFixed(1)} '
        'fps=${(frames / seconds).toStringAsFixed(1)} '
        'build_p50=${p(builds, 0.5)} build_p99=${p(builds, 0.99)} '
        'raster_p50=${p(rasters, 0.5)} raster_p99=${p(rasters, 0.99)}';
    debugPrint(line);
    setState(() => _status = line);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Stack(
      children: [
        VMap(controller: controller, engine: engine),
        Positioned(
          left: 8,
          top: 8,
          child: ColoredBox(
            color: const Color(0xCCFFFFFF),
            child: Padding(
              padding: const EdgeInsets.all(4),
              child: Text(_status, style: const TextStyle(fontSize: 11)),
            ),
          ),
        ),
      ],
    ),
  );
}
