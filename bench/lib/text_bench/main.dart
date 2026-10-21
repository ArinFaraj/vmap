// ignore_for_file: implementation_imports

import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_displaymode/flutter_displaymode.dart';
import 'package:path_provider/path_provider.dart';
import 'package:vmap/src/map_camera.dart';
import 'package:vmap/src/mercator.dart';
import 'package:vmap/src/view.dart';
import 'package:vmap/vmap.dart';

import 'glyph_atlas.dart';
import 'sdf.dart';

const _fontSize = 13.0;
const _halo = 1.5;
const _ink = Color(0xFF26323F);
const _haloInk = Color(0xFFFFFFFF);
const _phaseSeconds = 12;

var _pages = <int, BakedPage>{};

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (Platform.isAndroid) await FlutterDisplayMode.setHighRefreshRate();
  final rows = (jsonDecode(
    await rootBundle.loadString('assets/bench_labels.json'),
  ) as List).cast<Map<String, Object?>>();
  final font = (await rootBundle.load('assets/fonts/Vazirmatn.ttf')).buffer
      .asUint8List();
  final atlas = await GlyphAtlas.build(font, [
    for (final r in rows) r['n']! as String,
  ]);
  debugPrint(
    'bench: atlas ${atlas.image.width}x${atlas.image.height}, '
    '${atlas.glyphCount} glyphs, shaped and rendered in '
    '${atlas.buildMicros ~/ 1000} ms off the UI thread',
  );
  final dpr = ui.PlatformDispatcher.instance.views.first.devicePixelRatio;
  final keys = [for (var k = -20; k <= -5; k++) k];
  final bakeWatch = Stopwatch()..start();
  final pages = await atlas.bake([
    for (final k in keys) math.pow(2, k / 8).toDouble() * dpr,
  ], _halo * dpr);
  debugPrint(
    'bench: baked ${pages.length} sizes in ${bakeWatch.elapsedMilliseconds} ms '
    'off the UI thread',
  );
  _pages = {for (final (i, k) in keys.indexed) k: pages[i]};
  final labels = [
    for (final (i, r) in rows.indexed)
      _Label(
        r['n']! as String,
        worldX((r['lon']! as num).toDouble()),
        worldY((r['lat']! as num).toDouble()),
        atlas.labels[i],
      ),
  ];
  runApp(MaterialApp(home: _Bench(atlas, labels)));
}

class _Label {
  _Label(this.text, this.x, this.y, this.shaped);

  final String text;
  final double x, y;
  final ShapedLabel shaped;
  ui.Image? sprite;
  double spriteSize = 0;
}

enum _Arm { atlas, atlasPlain, baked, paragraph }

class _Counters {
  int frames = 0;
  int paintMicros = 0;
  final paints = <int>[];
  int rasterized = 0;
  int rasterMicros = 0;
  int drawn = 0;

  void reset() {
    frames = 0;
    paintMicros = 0;
    paints.clear();
    rasterized = 0;
    rasterMicros = 0;
    drawn = 0;
  }
}

class _Bench extends StatefulWidget {
  const _Bench(this.atlas, this.labels);

  final GlyphAtlas atlas;
  final List<_Label> labels;

  @override
  State<_Bench> createState() => _BenchState();
}

class _BenchState extends State<_Bench> with SingleTickerProviderStateMixin {
  static const _erbil = VmapCamera(
    center: LatLng(36.1912, 44.0092),
    zoom: 15.3,
    pitch: 55,
  );
  final controller = VmapController(_erbil);
  final engine = VmapEngine(
    style: const VmapStyle.builtIn(),
    showLabels: false,
    maxCachedTiles: 400,
  );
  final boundary = GlobalKey();
  final counters = _Counters();
  var arm = _Arm.atlas;
  late final Ticker _orbit = createTicker(_tick);
  Duration _orbitStart = Duration.zero;
  bool _orbiting = false;

  @override
  void initState() {
    super.initState();
    _orbit.start();
    _run();
  }

  Duration _elapsed = Duration.zero;

  void _tick(Duration elapsed) {
    _elapsed = elapsed;
    if (!_orbiting) return;
    final t = (elapsed - _orbitStart).inMicroseconds / 1e6;
    controller.camera = _erbil.copyWith(
      bearing: 30 * t,
      zoom: 15.3 + 0.6 * math.sin(2 * math.pi * t / 5),
    );
  }

  Future<String> _phase(_Arm which) async {
    setState(() => arm = which);
    for (final l in widget.labels) {
      l.sprite?.dispose();
      l.sprite = null;
    }
    controller.camera = _erbil;
    await Future<void>.delayed(const Duration(seconds: 4));
    final frames = <FrameTiming>[];
    void listen(List<FrameTiming> t) => frames.addAll(t);
    counters.reset();
    SchedulerBinding.instance.addTimingsCallback(listen);
    _orbitStart = _elapsed;
    _orbiting = true;
    await Future<void>.delayed(const Duration(seconds: _phaseSeconds));
    _orbiting = false;
    SchedulerBinding.instance.removeTimingsCallback(listen);
    int p(List<int> v, double q) {
      if (v.isEmpty) return 0;
      final s = [...v]..sort();
      return s[((s.length - 1) * q).round()];
    }

    final build = [for (final f in frames) f.buildDuration.inMicroseconds];
    final raster = [for (final f in frames) f.rasterDuration.inMicroseconds];
    final total = [for (final f in frames) f.totalSpan.inMicroseconds];
    final slow = total.where((v) => v > 1e6 / 120 * 1.5).length;
    return '${which.name}: ${frames.length} frames in ${_phaseSeconds}s, '
        'labels drawn/frame ${counters.frames == 0 ? 0 : counters.drawn ~/ counters.frames}, '
        'label paint p50 ${p(counters.paints, .5)} p99 ${p(counters.paints, .99)} us, '
        'build p50 ${p(build, .5)} p99 ${p(build, .99)} us, '
        'raster p50 ${p(raster, .5)} p99 ${p(raster, .99)} us, '
        'janky ${(100 * slow / math.max(1, frames.length)).toStringAsFixed(1)}%, '
        'rasterized ${counters.rasterized} sprites in '
        '${counters.rasterMicros ~/ 1000} ms';
  }

  Future<void> _shot(String name) async {
    final dir = Platform.isAndroid
        ? (await getExternalStorageDirectory())!.path
        : '/tmp/vmap_text';
    Directory(dir).createSync(recursive: true);
    if (!mounted) return;
    final dpr = MediaQuery.devicePixelRatioOf(context);
    final render =
        boundary.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    final image = await render.toImage(pixelRatio: dpr);
    final png = await image.toByteData(format: ui.ImageByteFormat.png);
    File('$dir/$name.png').writeAsBytesSync(png!.buffer.asUint8List());
  }

  Future<void> _run() async {
    await Future<void>.delayed(const Duration(seconds: 6));
    final results = <String>[];
    for (var round = 0; round < 1; round++) {
      for (final which in _Arm.values) {
        final line = await _phase(which);
        debugPrint('bench round $round $line');
        results.add('round $round $line');
      }
    }
    _orbit.stop();
    for (final which in _Arm.values) {
      setState(() => arm = which);
      controller.camera = _erbil.copyWith(bearing: 20);
      await Future<void>.delayed(const Duration(seconds: 3));
      await _shot('text_${which.name}');
    }
    final dir = Platform.isAndroid
        ? (await getExternalStorageDirectory())!.path
        : '/tmp/vmap_text';
    File('$dir/text_bench.txt').writeAsStringSync(results.join('\n'));
    debugPrint('bench: done');
  }

  @override
  void dispose() {
    _orbit.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: RepaintBoundary(
      key: boundary,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Vmap(controller: controller, engine: engine),
          IgnorePointer(
            child: CustomPaint(
              painter: switch (arm) {
                _Arm.baked => _BakedPainter(
                  widget.labels,
                  controller,
                  counters,
                ),
                _Arm.atlas || _Arm.atlasPlain => _AtlasPainter(
                  widget.atlas,
                  widget.labels,
                  controller,
                  counters,
                  plain: arm == _Arm.atlasPlain,
                ),
                _Arm.paragraph => _ParagraphPainter(
                  widget.labels,
                  controller,
                  counters,
                  MediaQuery.devicePixelRatioOf(context),
                ),
              },
            ),
          ),
          Positioned(
            left: 12,
            top: 48,
            child: Text(
              arm.name,
              style: const TextStyle(fontSize: 18, color: Colors.red),
            ),
          ),
        ],
      ),
    ),
  );
}

/// Places every label in view: screen point and font size, nearest last.
Iterable<(_Label, double, double, double)> _visible(
  List<_Label> labels,
  MapView view,
) sync* {
  final world = view.worldSize;
  for (final l in labels) {
    final gx = l.x * world, gy = l.y * world;
    final ratio = view.perspectiveRatio(gx, gy);
    if (ratio < 0.6) continue;
    final p = view.project(gx, gy);
    if (p.x < -150 ||
        p.y < -40 ||
        p.x > view.width + 150 ||
        p.y > view.height + 40) {
      continue;
    }
    yield (l, p.x, p.y, _fontSize * ratio);
  }
}

class _AtlasPainter extends CustomPainter {
  _AtlasPainter(
    this.atlas,
    this.labels,
    this.controller,
    this.counters, {
    this.plain = false,
  }) : super(repaint: controller);

  /// Tints the atlas by vertex colour instead of a colour matrix, to time
  /// the matrix: edges come out soft.
  final bool plain;
  static final _plainColors = <int, Int32List>{};

  final GlyphAtlas atlas;
  final List<_Label> labels;
  final VmapController controller;
  final _Counters counters;

  static Paint _pass(double s, Color color, double edge) {
    final k = 2 * spread * s;
    return Paint()
      ..filterQuality = FilterQuality.low
      ..colorFilter = ColorFilter.matrix([
        0, 0, 0, 0, color.r * 255, //
        0, 0, 0, 0, color.g * 255, //
        0, 0, 0, 0, color.b * 255, //
        0, 0, 0, k, (0.5 - edge * k) * 255,
      ]);
  }

  static final _buckets = <int, _Buffers>{};
  static final _paints = <int, (Paint, Paint)>{};

  @override
  void paint(Canvas canvas, Size size) {
    final watch = Stopwatch()..start();
    final view = controller.camera.view(size.width, size.height);
    for (final b in _buckets.values) {
      b.length = 0;
    }
    var drawn = 0;
    for (final (l, x, y, font) in _visible(labels, view)) {
      drawn++;
      final s = font / emTexels;
      final key = (math.log(s) / math.ln2 * 8).round();
      final b = _buckets.putIfAbsent(key, _Buffers.new);
      for (final g in l.shaped.glyphs) {
        b.add(s, x + g.dx * s, y + g.dy * s, g.source);
      }
    }
    for (final MapEntry(:key, value: b) in _buckets.entries) {
      if (b.length == 0) continue;
      final s = math.pow(2, key / 8).toDouble();
      final (halo, ink) = _paints.putIfAbsent(
        key,
        () => (
          _pass(s, _haloInk, 0.5 - _halo / (2 * spread * s)),
          _pass(s, _ink, 0.5),
        ),
      );
      final transforms = Float32List.sublistView(b.transforms, 0, b.length * 4);
      final rects = Float32List.sublistView(b.rects, 0, b.length * 4);
      if (plain) {
        final colors = _plainColors.putIfAbsent(
          b.length,
          () => Int32List(b.length),
        );
        colors.fillRange(0, b.length, _ink.toARGB32());
        canvas.drawRawAtlas(
          atlas.image,
          transforms,
          rects,
          colors,
          BlendMode.modulate,
          null,
          Paint()..filterQuality = FilterQuality.low,
        );
        continue;
      }
      canvas
        ..drawRawAtlas(atlas.image, transforms, rects, null, null, null, halo)
        ..drawRawAtlas(atlas.image, transforms, rects, null, null, null, ink);
    }
    counters.frames += 1;
    counters.drawn += drawn;
    counters.paints.add(watch.elapsedMicroseconds);
  }

  @override
  bool shouldRepaint(_AtlasPainter old) => true;
}

class _Buffers {
  Float32List transforms = Float32List(256);
  Float32List rects = Float32List(256);
  int length = 0;

  void add(double scale, double x, double y, Rect source) {
    final o = length * 4;
    if (o + 4 > transforms.length) {
      transforms = Float32List(transforms.length * 2)..setAll(0, transforms);
      rects = Float32List(rects.length * 2)..setAll(0, rects);
    }
    transforms[o] = scale;
    transforms[o + 1] = 0;
    transforms[o + 2] = x;
    transforms[o + 3] = y;
    rects[o] = source.left;
    rects[o + 1] = source.top;
    rects[o + 2] = source.right;
    rects[o + 3] = source.bottom;
    length++;
  }
}

class _BakedPainter extends CustomPainter {
  _BakedPainter(this.labels, this.controller, this.counters)
    : super(repaint: controller);

  final List<_Label> labels;
  final VmapController controller;
  final _Counters counters;

  static final _buckets = <int, _Buffers>{};
  static final _colors = <(int, int), Int32List>{};
  static final _paint = Paint()..filterQuality = FilterQuality.low;

  @override
  void paint(Canvas canvas, Size size) {
    final watch = Stopwatch()..start();
    final view = controller.camera.view(size.width, size.height);
    for (final b in _buckets.values) {
      b.length = 0;
    }
    var drawn = 0;
    for (final (l, x, y, font) in _visible(labels, view)) {
      final s = font / emTexels;
      final key = (math.log(s) / math.ln2 * 8).round();
      final page = _pages[key];
      if (page == null) continue;
      drawn++;
      final c = s / page.scale;
      final b = _buckets.putIfAbsent(key, _Buffers.new);
      for (final g in l.shaped.glyphs) {
        final rect = page.rects[g.glyphId];
        if (rect == null) continue;
        b.add(c, x + g.dx * s, y + g.dy * s, rect);
      }
    }
    for (final MapEntry(:key, value: b) in _buckets.entries) {
      if (b.length == 0) continue;
      final page = _pages[key]!;
      final transforms = Float32List.sublistView(b.transforms, 0, b.length * 4);
      final rects = Float32List.sublistView(b.rects, 0, b.length * 4);
      Int32List colors(Color color) {
        final list = _colors.putIfAbsent((
          color.toARGB32(),
          b.length,
        ), () => Int32List(b.length)..fillRange(0, b.length, color.toARGB32()));
        return list;
      }

      canvas
        ..drawRawAtlas(
          page.halo,
          transforms,
          rects,
          colors(_haloInk),
          BlendMode.modulate,
          null,
          _paint,
        )
        ..drawRawAtlas(
          page.ink,
          transforms,
          rects,
          colors(_ink),
          BlendMode.modulate,
          null,
          _paint,
        );
    }
    counters.frames += 1;
    counters.drawn += drawn;
    counters.paints.add(watch.elapsedMicroseconds);
  }

  @override
  bool shouldRepaint(_BakedPainter old) => true;
}

class _ParagraphPainter extends CustomPainter {
  _ParagraphPainter(this.labels, this.controller, this.counters, this.dpr)
    : super(repaint: controller);

  final List<_Label> labels;
  final VmapController controller;
  final _Counters counters;
  final double dpr;

  static const _budgetMicros = 2000;

  ui.Image _rasterize(String text, double px) {
    ui.Paragraph lay(Paint foreground) {
      final b =
          ui.ParagraphBuilder(
              ui.ParagraphStyle(fontFamily: 'Vazirmatn', fontSize: px),
            )
            ..pushStyle(ui.TextStyle(foreground: foreground))
            ..addText(text);
      return b.build()..layout(const ui.ParagraphConstraints(width: 2000));
    }

    final halo = lay(
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = _halo * 2 * dpr
        ..strokeJoin = StrokeJoin.round
        ..color = _haloInk,
    );
    final fill = lay(Paint()..color = _ink);
    final pad = (_halo * 2 * dpr).ceil();
    final w = fill.longestLine.ceil() + pad * 2;
    final h = fill.height.ceil() + pad * 2;
    final recorder = ui.PictureRecorder();
    Canvas(recorder)
      ..drawParagraph(halo, Offset(pad.toDouble(), pad.toDouble()))
      ..drawParagraph(fill, Offset(pad.toDouble(), pad.toDouble()));
    return recorder.endRecording().toImageSync(math.max(1, w), math.max(1, h));
  }

  @override
  void paint(Canvas canvas, Size size) {
    final watch = Stopwatch()..start();
    final view = controller.camera.view(size.width, size.height);
    final paint = Paint()..filterQuality = FilterQuality.low;
    var spent = 0;
    var drawn = 0;
    for (final (l, x, y, font) in _visible(labels, view)) {
      drawn++;
      final want = font * dpr;
      final drift = l.spriteSize == 0 ? 0 : want / l.spriteSize;
      if ((l.sprite == null || drift < 0.87 || drift > 1.15) &&
          spent < _budgetMicros) {
        final t0 = watch.elapsedMicroseconds;
        l.sprite?.dispose();
        l.sprite = _rasterize(l.text, want);
        l.spriteSize = want;
        final took = watch.elapsedMicroseconds - t0;
        spent += took;
        counters.rasterized += 1;
        counters.rasterMicros += took;
      }
      final sprite = l.sprite;
      if (sprite == null) continue;
      final k = want / l.spriteSize / dpr;
      final w = sprite.width * k, h = sprite.height * k;
      canvas.drawImageRect(
        sprite,
        Rect.fromLTWH(0, 0, sprite.width.toDouble(), sprite.height.toDouble()),
        Rect.fromLTWH(x - w / 2, y - h / 2, w, h),
        paint,
      );
    }
    counters.frames += 1;
    counters.drawn += drawn;
    counters.paints.add(watch.elapsedMicroseconds);
  }

  @override
  bool shouldRepaint(_ParagraphPainter old) => true;
}
