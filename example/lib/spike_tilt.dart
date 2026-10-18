// ignore_for_file: implementation_imports

import 'dart:io';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:vmap/src/mercator.dart';
import 'package:vmap/vmap.dart';

const _out = String.fromEnvironment('OUT', defaultValue: '/tmp/vmap_tilt');
const _styleName = String.fromEnvironment('STYLE');

void main() => runApp(const MaterialApp(home: _Tilt()));

class _Tilt extends StatefulWidget {
  const _Tilt();

  @override
  State<_Tilt> createState() => _TiltState();
}

class _TiltState extends State<_Tilt> {
  final _boundary = GlobalKey();
  final engine = VmapEngine(
    style: _styleName.isEmpty
        ? const VmapStyle.builtIn()
        : VmapStyle.url('https://tiles.openfreemap.org/styles/$_styleName'),
    maxCachedTiles: 400,
  );
  double pitch = 0;
  double bearing = 0;

  @override
  void initState() {
    super.initState();
    _shoot();
  }

  Future<void> _shoot() async {
    Directory(_out).createSync(recursive: true);
    for (final (p, b) in [
      (0.0, 0.0),
      (30.0, 0.0),
      (45.0, 0.0),
      (60.0, 0.0),
      (60.0, 35.0),
    ]) {
      setState(() {
        pitch = p;
        bearing = b;
      });
      await Future<void>.delayed(const Duration(seconds: 8));
      final render =
          _boundary.currentContext!.findRenderObject()!
              as RenderRepaintBoundary;
      final image = await render.toImage(pixelRatio: 2);
      final png = await image.toByteData(format: ui.ImageByteFormat.png);
      File('$_out/pitch_${p.round()}_bearing_${b.round()}.png')
          .writeAsBytesSync(png!.buffer.asUint8List());
      debugPrint(
        'shot pitch=$p bearing=$b tiles=${engine.stats.tilesDrawn}+${engine.stats.fallbackTiles} loading=${engine.stats.tilesLoading}',
      );
    }
    exit(0);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: RepaintBoundary(
      key: _boundary,
      child: CustomPaint(
        size: Size.infinite,
        painter: _TiltPainter(
          engine,
          pitch,
          bearing,
          MediaQuery.devicePixelRatioOf(context),
        ),
      ),
    ),
  );
}

class _TiltPainter extends CustomPainter {
  _TiltPainter(this.engine, this.pitch, this.bearing, this.dpr)
    : super(repaint: engine);

  final VmapEngine engine;
  final double pitch;
  final double bearing;
  final double dpr;

  static const _lat = 36.1912, _lon = 44.0092, _zoom = 15.0;

  @override
  void paint(Canvas canvas, Size size) {
    final view = MapView(
      centerX: worldX(_lon),
      centerY: worldY(_lat),
      zoom: _zoom,
      width: size.width,
      height: size.height,
      pitch: pitch,
      bearing: bearing,
    );
    final center = view.center;
    canvas
      ..clipRect(Offset.zero & size)
      ..drawColor(const Color(0xFFDDE6F0), BlendMode.src);
    engine.paint(
      canvas,
      VmapCamera(
        zoom: _zoom + 1,
        origin: Offset(center.x - size.width / 2, center.y - size.height / 2),
        size: size,
        rotation: bearing * math.pi / 180,
        devicePixelRatio: dpr,
        view: view,
      ),
    );
  }

  @override
  bool shouldRepaint(_TiltPainter old) =>
      old.pitch != pitch || old.bearing != bearing;
}
