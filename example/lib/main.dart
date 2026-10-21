import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_displaymode/flutter_displaymode.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:path_provider/path_provider.dart';
import 'package:vector_map_tiles/vector_map_tiles.dart' as vmt;
import 'package:vmap/vmap.dart';

import 'showcase.dart';

const mode = String.fromEnvironment('MODE', defaultValue: 'ours');
const tour = bool.fromEnvironment('TOUR');
const dark = bool.fromEnvironment('DARK');
const shotPath = String.fromEnvironment('SHOT');
const startZoomTenths = int.fromEnvironment('ZOOM', defaultValue: 125);
const nameKeys = String.fromEnvironment('NAMES');

/// An OpenFreeMap style name: liberty, positron, bright, dark or fiord. Empty
/// draws vmap's built in style, and positron in vector_map_tiles.
const styleName = String.fromEnvironment('STYLE');
const vmapGestures = bool.fromEnvironment('GESTURES');

/// Shows the engine's counters over a bare map instead of the showcase.
const hud = bool.fromEnvironment('HUD');
const record = bool.fromEnvironment('REC');
const stress = bool.fromEnvironment('STRESS');

/// Draws with the GPU renderer instead of the canvas.
const gpuRenderer = bool.fromEnvironment('GPU');

const erbil = LatLng(
  int.fromEnvironment('LAT', defaultValue: 36191113) / 1e6,
  int.fromEnvironment('LON', defaultValue: 44009167) / 1e6,
);

class Key3 {
  const Key3(this.t, this.lat, this.lon, this.zoom);
  final double t;
  final double lat;
  final double lon;
  final double zoom;
}

const stressKeys = [
  Key3(0, 36.191113, 44.009167, 12),
  Key3(1.2, 36.191113, 44.009167, 16.8),
  Key3(1.8, 36.193, 44.014, 16.8),
  Key3(2.8, 36.191113, 44.009167, 12.2),
  Key3(3.4, 35.5613, 45.4302, 12),
  Key3(4.6, 35.5613, 45.4302, 16.8),
  Key3(5.2, 35.5633, 45.4352, 16.5),
  Key3(6.2, 35.5613, 45.4302, 11.5),
  Key3(6.8, 36.8667, 42.9833, 12),
  Key3(8.0, 36.8667, 42.9833, 17),
  Key3(9.0, 36.8667, 42.9833, 13),
  Key3(9.8, 36.8667, 42.9833, 16.2),
  Key3(11, 36.191113, 44.009167, 12),
];
const wander = bool.fromEnvironment('WANDER');
List<Key3> tourKeys = wander
    ? _wanderKeys(0)
    : (stress ? stressKeys : _tourKeys);

List<Key3> _wanderKeys(int lap) {
  final random = math.Random(7 + lap);
  final keys = <Key3>[const Key3(0, 36.191113, 44.009167, 13)];
  var t = 0.0;
  var lat = 36.191113 + lap * 0.02;
  var lon = 44.009167 - lap * 0.025;
  while (t < 30) {
    t += 0.7 + random.nextDouble() * 1.3;
    lat = (lat + (random.nextDouble() - 0.5) * 0.03).clamp(36.10, 36.32);
    lon = (lon + (random.nextDouble() - 0.5) * 0.04).clamp(43.86, 44.12);
    keys.add(Key3(t, lat, lon, 11.5 + random.nextDouble() * 5.5));
  }
  return keys;
}

const _tourKeys = [
  Key3(0, 36.191113, 44.009167, 12.5),
  Key3(4, 36.195, 44.085, 12.5),
  Key3(8, 36.191113, 44.009167, 16),
  Key3(12, 36.207, 44.032, 16),
  Key3(16, 36.19, 44.0, 10.5),
  Key3(20, 36.17, 43.97, 14),
  Key3(23, 36.191113, 44.009167, 12.5),
];

/// Switches read at start from `flags.txt` in the app's external files
/// directory, one `name=value` a line, so a run can be varied without a
/// rebuild.
final flags = <String, String>{};

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (Platform.isAndroid) {
    try {
      final dir = await getExternalStorageDirectory();
      final file = File('${dir!.path}/flags.txt');
      if (file.existsSync()) {
        for (final line in file.readAsLinesSync()) {
          final cut = line.indexOf('=');
          if (cut > 0) flags[line.substring(0, cut)] = line.substring(cut + 1);
        }
      }
    } catch (_) {}
  }
  final cache = '${(await getApplicationCacheDirectory()).path}/vmap';
  if (Platform.isAndroid) {
    try {
      await FlutterDisplayMode.setHighRefreshRate();
    } catch (_) {}
  }
  vmt.Style? style;
  if (mode == 'vmt') {
    style = await vmt.StyleReader(
      uri:
          'https://tiles.openfreemap.org/styles/${styleName.isEmpty ? (dark ? 'dark' : 'positron') : styleName}',
    ).read();
  }
  runApp(
    tour || record || hud
        ? BenchApp(cacheDirectory: cache, vmtStyle: style)
        : ShowcaseApp(cacheDirectory: cache, vmtStyle: style),
  );
}

class BenchApp extends StatefulWidget {
  const BenchApp({required this.cacheDirectory, this.vmtStyle, super.key});

  final String cacheDirectory;
  final vmt.Style? vmtStyle;

  @override
  State<BenchApp> createState() => _BenchAppState();
}

class _BenchAppState extends State<BenchApp>
    with SingleTickerProviderStateMixin {
  final controller = MapController();
  final boundary = GlobalKey();
  static final names = nameKeys.isEmpty ? null : nameKeys.split(',');
  late final engine = VmapEngine(
    style: flags['style_file'] != null
        ? VmapStyle.json(
            jsonDecode(File(flags['style_file']!).readAsStringSync())
                as Map<String, Object?>,
            nameKeys: names,
          )
        : styleName.isEmpty
        ? VmapStyle.builtIn(
            palette: dark ? VmapPalette.dark : VmapPalette.light,
            nameKeys: names,
          )
        : VmapStyle.url(
            'https://tiles.openfreemap.org/styles/$styleName',
            zoomOffset: const int.fromEnvironment('ZOFF').toDouble(),
            nameKeys: names,
          ),
    source: TileSourceConfig(
      cacheDirectory: widget.cacheDirectory,
      userAgent: 'dev.vmap.bench',
    ),
    text: const VmapTextStyle(
      fontFamily: 'GoogleSansFlex',
      fontFamilyFallback: ['Vazirmatn'],
    ),
    showLabels: flags['labels'] != 'off',
    renderer: gpuRenderer ? GpuMap.create() : null,
  );
  late final Ticker ticker;
  final laps = <List<FrameTiming>>[
    for (
      var i = 0;
      i < (int.tryParse(flags['laps'] ?? '') ?? (wander ? 5 : 2));
      i++
    )
      [],
  ];
  int lap = -1;
  Duration lapStart = Duration.zero;
  String result = '';
  final engineLaps = <Map<String, Object>>[];

  @override
  void initState() {
    super.initState();
    ticker = createTicker(_tick);
    if (tour) {
      SchedulerBinding.instance.addTimingsCallback((timings) {
        if (lap >= 0 && lap < laps.length) laps[lap].addAll(timings);
      });
      Future<void>.delayed(const Duration(seconds: 4), () {
        lap = 0;
        engine.stats.resetTimers();
        ticker.start();
      });
    }
    if (record) {
      SchedulerBinding.instance.addTimingsCallback((timings) {
        if (lap >= 0 && lap < laps.length) laps[lap].addAll(timings);
      });
      Future<void>.delayed(const Duration(seconds: 6), () => lap = 0);
      Future<void>.delayed(const Duration(seconds: 16), () => lap = 1);
      Future<void>.delayed(const Duration(seconds: 26), () {
        lap = 2;
        _report();
      });
    }
    if (shotPath.isNotEmpty) {
      Future<void>.delayed(const Duration(seconds: 12), _capture);
    }
  }

  void _tick(Duration elapsed) {
    final t = (elapsed - lapStart).inMicroseconds / 1e6;
    if (t >= tourKeys.last.t) {
      lap++;
      lapStart = elapsed;
      engineLaps.add({
        'frames': engine.stats.timings.frames,
        'paint_avg_us': engine.stats.timings.frames == 0
            ? 0
            : engine.stats.timings.paintMicros ~/ engine.stats.timings.frames,
        'paint_max_us': engine.stats.timings.maxPaintMicros,
        'stroke_total_ms': engine.stats.timings.strokeMicros ~/ 1000,
        'strokes_built': engine.stats.timings.strokesBuilt,
        'label_total_ms': engine.stats.timings.labelMicros ~/ 1000,
        'label_max_us': engine.stats.timings.maxLabelMicros,
        'tile_setup_total_ms': engine.stats.timings.tileSetupMicros ~/ 1000,
        'tile_setup_max_us': engine.stats.timings.maxTileSetupMicros,
        'paints_over_4ms': engine.stats.timings.paintsOver4ms,
        'paints_over_8ms': engine.stats.timings.paintsOver8ms,
        'prep_max_us': engine.stats.timings.maxPrepMicros,
        'place_max_us': engine.stats.timings.maxPlaceMicros,
        'place_total_ms': engine.stats.timings.placeMicros ~/ 1000,
        'label_raster_total_ms': engine.stats.timings.labelRasterMicros ~/ 1000,
        'labels_rasterized': engine.stats.timings.labels.rasterized,
        'label_layout_ms': engine.stats.timings.labels.layoutMicros ~/ 1000,
        'label_image_ms': engine.stats.timings.labels.imageMicros ~/ 1000,
        'label_images': engine.stats.timings.labels.images,
        'labels_resized': engine.stats.timings.labels.resized,
        'labels_evicted': engine.stats.timings.labels.evicted,
        'label_states_walked': engine.stats.timings.labels.statesWalked,
        'label_raster_max_us': engine.stats.timings.maxLabelRasterMicros,
        'draw_max_us': engine.stats.timings.maxDrawMicros,
        'unpack_max_us': engine.stats.timings.maxUnpackMicros,
        'rss_mb': kIsWeb ? 0 : ProcessInfo.currentRss >> 20,
        'max_rss_mb': kIsWeb ? 0 : ProcessInfo.maxRss >> 20,
        'gpu_frames_reused': switch (engine.renderer) {
          final GpuMap gpu => gpu.framesReused,
          _ => 0,
        },
        'slow':
            (engine.stats.timings.slowPaints.toList()..sort(
                  (a, b) =>
                      int.parse(b.split('paint=')[1].split(' ')[0]) -
                      int.parse(a.split('paint=')[1].split(' ')[0]),
                ))
                .take(10)
                .toList(),
        'draw_calls': engine.stats.drawCalls,
        'tiles': engine.stats.tilesCached,
        'label_states': engine.stats.labelStates,
        'label_sprites': engine.stats.labelSprites,
      });
      engine.stats.resetTimers();
      if (wander) tourKeys = _wanderKeys(lap);
      if (lap >= laps.length) {
        ticker.stop();
        Future<void>.delayed(const Duration(milliseconds: 500), _report);
      }
      return;
    }
    var i = 1;
    while (tourKeys[i].t < t) {
      i++;
    }
    final a = tourKeys[i - 1];
    final b = tourKeys[i];
    final u = (t - a.t) / (b.t - a.t);
    final s = u * u * (3 - 2 * u);
    controller.move(
      LatLng(a.lat + (b.lat - a.lat) * s, a.lon + (b.lon - a.lon) * s),
      a.zoom + (b.zoom - a.zoom) * s,
    );
  }

  Map<String, Object> _summarize(List<FrameTiming> frames, double seconds) {
    double ms(Duration d) => d.inMicroseconds / 1000;
    List<double> sorted(Iterable<double> v) => v.toList()..sort();
    double pct(List<double> v, double p) =>
        v.isEmpty ? 0 : v[math.min(v.length - 1, (v.length * p).floor())];
    final build = sorted(frames.map((f) => ms(f.buildDuration)));
    final raster = sorted(frames.map((f) => ms(f.rasterDuration)));
    final total = sorted(
      frames.map((f) => ms(f.buildDuration) + ms(f.rasterDuration)),
    );
    String r(double v) => v.toStringAsFixed(2);
    final pace = Pace.of(frames);
    return {
      'interval_ms': r(pace.interval),
      'skipped': pace.skipped,
      'hitches': pace.hitches,
      'worst_gap_ms': r(pace.worstGap),
      'wait_p99': r(pace.waitP99),
      'wait_max': r(pace.waitMax),
      'queue_p99': r(pace.queueP99),
      'queue_max': r(pace.queueMax),
      'hitch_samples': pace.samples.take(12).toList(),
      'frames': frames.length,
      'fps': r(frames.length / seconds),
      'build_p50': r(pct(build, 0.5)),
      'build_p90': r(pct(build, 0.9)),
      'build_p99': r(pct(build, 0.99)),
      'build_max': r(build.isEmpty ? 0 : build.last),
      'raster_p50': r(pct(raster, 0.5)),
      'raster_p90': r(pct(raster, 0.9)),
      'raster_p99': r(pct(raster, 0.99)),
      'raster_max': r(raster.isEmpty ? 0 : raster.last),
      'over_8ms': total.where((v) => v > 8.33).length,
      'over_16ms': total.where((v) => v > 16.67).length,
      'over_33ms': total.where((v) => v > 33.3).length,
    };
  }

  void _report() {
    final out = {
      'mode': mode,
      'style': styleName.isEmpty ? 'default' : styleName,
      'refresh': ui.PlatformDispatcher.instance.views.first.display.refreshRate,
      'dpr': ui.PlatformDispatcher.instance.views.first.devicePixelRatio,
      for (var i = 0; i < laps.length; i++)
        'lap$i': _summarize(laps[i], tourKeys.last.t),
      if (mode == 'ours') 'engine': engineLaps,
    };
    // ignore: avoid_print
    if (kIsWeb) {
      const lapKeys = [
        'fps', 'skipped', 'worst_gap_ms', 'build_p50', 'build_p99', //
        'raster_p50', 'raster_p99', 'over_33ms',
      ];
      const engineKeys = [
        'frames', 'paint_avg_us', 'label_total_ms', 'label_raster_total_ms', //
        'labels_rasterized',
        'label_layout_ms',
        'label_image_ms',
        'label_images',
        'stroke_total_ms', 'tile_setup_total_ms', 'prep_max_us',
        'draw_max_us', 'unpack_max_us',
      ];
      // ignore: avoid_print
      print(
        'VMAP_WEB ${jsonEncode({
          for (var i = 0; i < laps.length; i++) 'lap$i': {for (final k in lapKeys) k: (out['lap$i']! as Map)[k]},
          'engine': [
            for (final e in engineLaps) {for (final k in engineKeys) k: e[k]},
          ],
        })}',
      );
      return;
    }
    // ignore: avoid_print
    print('VMAP_BENCH ${jsonEncode(out)}');
    if (!Platform.isAndroid) exit(0);
    getExternalStorageDirectory().then((dir) {
      if (dir != null) {
        File('${dir.path}/bench.json').writeAsStringSync(jsonEncode(out));
      }
    });
    setState(() => result = const JsonEncoder.withIndent(' ').convert(out));
  }

  Future<void> _capture() async {
    final render =
        boundary.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    final image = await render.toImage(pixelRatio: 2);
    final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
    File(shotPath).writeAsBytesSync(bytes!.buffer.asUint8List());
    exit(0);
  }

  @override
  void dispose() {
    ticker.dispose();
    engine.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: Stack(
          children: [
            RepaintBoundary(
              key: boundary,
              child: VmapGestures(
                controller: controller,
                enabled: vmapGestures,
                child: FlutterMap(
                  mapController: controller,
                  options: MapOptions(
                    initialCenter: erbil,
                    initialZoom: startZoomTenths / 10,
                    minZoom: 3,
                    maxZoom: 19,
                    backgroundColor: dark
                        ? const Color(0xFF121212)
                        : const Color(0xFFF4F6F8),
                    interactionOptions: InteractionOptions(
                      flags: vmapGestures
                          ? InteractiveFlag.none
                          : InteractiveFlag.all & ~InteractiveFlag.rotate,
                    ),
                  ),
                  children: [
                    switch (mode) {
                      'raster' => TileLayer(
                        urlTemplate:
                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        userAgentPackageName: 'dev.vmap.bench',
                      ),
                      'vmt' => vmt.VectorTileLayer(
                        theme: widget.vmtStyle!.theme,
                        sprites: widget.vmtStyle!.sprites,
                        tileOffset: const bool.fromEnvironment('VMT_512')
                            ? vmt.TileOffset.mapbox
                            : vmt.TileOffset.DEFAULT,
                        tileProviders: widget.vmtStyle!.providers,
                      ),
                      _ => VmapLayer.engine(engine),
                    },
                  ],
                ),
              ),
            ),
            if (mode == 'ours' && !tour && shotPath.isEmpty)
              Positioned(
                left: 12,
                bottom: 28,
                child: ListenableBuilder(
                  listenable: engine,
                  builder: (context, _) {
                    final s = engine.stats;
                    return _Chip(
                      'tiles ${s.tilesDrawn}+${s.fallbackTiles} cached ${s.tilesCached} loading ${s.tilesLoading} draws ${s.drawCalls}'
                      '${engine.error == null ? '' : '\n${engine.error}'}',
                    );
                  },
                ),
              ),
            if (mode == 'ours' && !tour && shotPath.isEmpty)
              Positioned(left: 12, top: 96, child: _Hud(engine: engine)),
            if (result.isNotEmpty)
              Positioned(left: 12, top: 48, child: _Chip(result)),
            Positioned(
              right: 8,
              bottom: 6,
              child: _Chip(
                '© OpenFreeMap © OpenMapTiles © OpenStreetMap',
                small: true,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip(this.text, {this.small = false});

  final String text;
  final bool small;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: small ? 0.35 : 0.7),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Text(
          text,
          style: TextStyle(
            color: Colors.white,
            fontSize: small ? 9 : 11,
            fontFamily: 'monospace',
          ),
        ),
      ),
    );
  }
}

/// Frame pacing, engine costs and memory, refreshed every second and appended
/// to `jank.log` so a session can be read back afterwards.
/// How evenly frames arrived, which build and raster times alone do not show:
/// a frame can be cheap and still come late because the UI thread was busy
/// before it started.
class Pace {
  Pace(
    this.interval,
    this.skipped,
    this.hitches,
    this.worstGap,
    this.waitP99,
    this.waitMax, [
    this.queueP99 = 0,
    this.queueMax = 0,
    this.samples = const [],
  ]);

  /// Time a built frame sat waiting for the raster thread to pick it up.
  final double queueP99;
  final double queueMax;

  /// The frame before each lost refresh: gap, wait, build, queue, raster.
  final List<String> samples;

  /// The usual gap between frames, in milliseconds.
  final double interval;

  /// Display refreshes that passed without a new frame during continuous motion.
  final int skipped;

  /// Gaps that lost at least one refresh.
  final int hitches;
  final double worstGap;

  /// Delay between the display asking for a frame and the frame starting.
  final double waitP99;
  final double waitMax;

  static Pace of(List<FrameTiming> frames) {
    if (frames.length < 3) return Pace(0, 0, 0, 0, 0, 0);
    final starts = [
      for (final f in frames)
        f.timestampInMicroseconds(ui.FramePhase.vsyncStart) / 1000,
    ];
    final gaps = [
      for (var i = 1; i < starts.length; i++) starts[i] - starts[i - 1],
    ];
    final sorted = [...gaps]..sort();
    final interval = sorted[sorted.length ~/ 2];
    var skipped = 0;
    var hitches = 0;
    var worst = 0.0;
    final samples = <String>[];
    double q(FrameTiming f) =>
        (f.timestampInMicroseconds(ui.FramePhase.rasterStart) -
            f.timestampInMicroseconds(ui.FramePhase.buildFinish)) /
        1000;
    for (var i = 0; i < gaps.length; i++) {
      final g = gaps[i];
      if (g > 250) continue;
      if (g > worst) worst = g;
      final lost = (g / interval).round() - 1;
      if (lost > 0) {
        skipped += lost;
        hitches++;
        final f = frames[i];
        final n = frames[i + 1];
        samples.add(
          'gap ${g.round()} | prev b${(f.buildDuration.inMicroseconds / 1000).toStringAsFixed(1)} q${q(f).toStringAsFixed(1)} r${(f.rasterDuration.inMicroseconds / 1000).toStringAsFixed(1)}'
          ' | next b${(n.buildDuration.inMicroseconds / 1000).toStringAsFixed(1)} q${q(n).toStringAsFixed(1)} r${(n.rasterDuration.inMicroseconds / 1000).toStringAsFixed(1)}',
        );
      }
    }
    final waits = [
      for (final f in frames)
        (f.timestampInMicroseconds(ui.FramePhase.buildStart) -
                f.timestampInMicroseconds(ui.FramePhase.vsyncStart)) /
            1000,
    ]..sort();
    final queues = [for (final f in frames) q(f)]..sort();
    return Pace(
      interval,
      skipped,
      hitches,
      worst,
      waits[(waits.length * 0.99).floor()],
      waits.last,
      queues[(queues.length * 0.99).floor()],
      queues.last,
      samples,
    );
  }
}

class _Hud extends StatefulWidget {
  const _Hud({required this.engine});

  final VmapEngine engine;

  @override
  State<_Hud> createState() => _HudState();
}

class _HudState extends State<_Hud> {
  final frames = <FrameTiming>[];
  int dropped = 0;
  int total = 0;
  int slowSeen = 0;
  String text = '';
  IOSink? log;
  late final timer = Stream<void>.periodic(const Duration(seconds: 1))
      .listen((_) => _flush());

  @override
  void initState() {
    super.initState();
    SchedulerBinding.instance.addTimingsCallback(frames.addAll);
    getExternalStorageDirectory().then((dir) {
      if (dir != null) log = File('${dir.path}/jank.log').openWrite();
    });
    timer.resume();
  }

  void _flush() {
    final budget =
        1000 / ui.PlatformDispatcher.instance.views.first.display.refreshRate;
    double ms(Duration d) => d.inMicroseconds / 1000;
    var worstBuild = 0.0;
    var worstRaster = 0.0;
    var late = 0;
    for (final f in frames) {
      worstBuild = math.max(worstBuild, ms(f.buildDuration));
      worstRaster = math.max(worstRaster, ms(f.rasterDuration));
      if (ms(f.buildDuration) > budget || ms(f.rasterDuration) > budget) late++;
    }
    // Fewer frames than this in a second means the map was mostly at rest,
    // where a gap is the app not asking for a frame rather than losing one.
    final pace = Pace.of(frames.length < 30 ? const [] : frames);
    late = pace.skipped;
    dropped += late;
    total += frames.length;
    final s = widget.engine.stats;
    final line =
        'fps ${frames.length} skipped $late in ${pace.hitches} hitches, worst gap ${pace.worstGap.toStringAsFixed(0)}ms wait ${pace.waitMax.toStringAsFixed(1)} (all $dropped/$total) build ${worstBuild.toStringAsFixed(1)} raster ${worstRaster.toStringAsFixed(1)} '
        'rss ${ProcessInfo.currentRss >> 20}MB tiles ${s.tilesCached} states ${s.labelStates} sprites ${s.labelSprites}';
    final slow = s.timings.slowPaints;
    if (frames.isNotEmpty) {
      log?.writeln(
        '${DateTime.now().toIso8601String().substring(11, 19)} $line',
      );
      for (final p in slow.skip(math.min(slowSeen, slow.length))) {
        log?.writeln('    $p');
      }
    }
    slowSeen = slow.length >= 300 ? 0 : slow.length;
    if (slow.length >= 300) slow.clear();
    frames.clear();
    if (mounted) {
      setState(
        () => text = line
            .replaceFirst(' worst', '\nworst')
            .replaceFirst(' build', '\nbuild')
            .replaceFirst(' rss', '\nrss'),
      );
    }
  }

  @override
  void dispose() {
    timer.cancel();
    log?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => _Chip(text);
}
