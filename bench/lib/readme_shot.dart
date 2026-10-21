/// Draws one picture for the README and exits: see tool/readme_shots.sh.
library;

import 'dart:async';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:vmap/vmap.dart';

final _lat = double.parse(
  const String.fromEnvironment('LAT', defaultValue: '36.1912'),
);
final _lon = double.parse(
  const String.fromEnvironment('LON', defaultValue: '44.0092'),
);
final _zoom = double.parse(
  const String.fromEnvironment('ZOOM', defaultValue: '16.4'),
);
final _pitch = double.parse(
  const String.fromEnvironment('PITCH', defaultValue: '58'),
);
final _bearing = double.parse(
  const String.fromEnvironment('BEARING', defaultValue: '-28'),
);
const _style = String.fromEnvironment('STYLE', defaultValue: 'liberty');
const _name = String.fromEnvironment('NAME', defaultValue: 'shot');

void main() {
  final key = GlobalKey();
  final controller = VmapController(
    VmapCamera(
      center: LatLng(_lat, _lon),
      zoom: _zoom,
      pitch: _pitch,
      bearing: _bearing,
    ),
  );
  runApp(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      home: RepaintBoundary(
        key: key,
        child: Vmap(
          controller: controller,
          maxPitch: 75,
          style: _style == 'builtin'
              ? VmapStyle.light
              : const VmapStyle.url(
                  'https://tiles.openfreemap.org/styles/$_style',
                ),
          onError: (e) => stdout.writeln('SHOT_ERROR $e'),
        ),
      ),
    ),
  );
  Timer(const Duration(seconds: 14), () async {
    final boundary =
        key.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    final image = await boundary.toImage(pixelRatio: 2);
    final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
    final out = '${Directory.systemTemp.path}/$_name.png';
    File(out).writeAsBytesSync(bytes!.buffer.asUint8List());
    stdout.writeln('SHOT_DONE ${controller.engine?.drawingWith} $out');
    exit(0);
  });
}
