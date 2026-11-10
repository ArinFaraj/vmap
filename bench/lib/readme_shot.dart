/// Draws one picture for the README and exits: see tool/readme_shots.sh.
library;

import 'dart:async';
import 'dart:convert';
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
final _width = double.parse(
  const String.fromEnvironment('WIDTH', defaultValue: '900'),
);
final _height = double.parse(
  const String.fromEnvironment('HEIGHT', defaultValue: '600'),
);
const _wait = int.fromEnvironment('WAIT', defaultValue: 14);
const _style = String.fromEnvironment('STYLE', defaultValue: 'liberty');
const _name = String.fromEnvironment('NAME', defaultValue: 'shot');
const _globe = bool.fromEnvironment('GLOBE');
const _terrain = bool.fromEnvironment('TERRAIN');

const _pixelRatio = 2.0;

const _sky = {
  'sky-color': '#7DB7F0',
  'horizon-color': '#D9ECFB',
  'fog-color': '#EEF5FB',
  'sky-horizon-blend': 0.6,
  'horizon-fog-blend': 0.7,
  'fog-ground-blend': 0.4,
};

const _dem = {
  'type': 'raster-dem',
  'tiles': [
    'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
  ],
  'encoding': 'terrarium',
  'tileSize': 256,
  'maxzoom': 15,
};

const _raisedGround = VmapOverlay(
  sources: {'dem': _dem, 'dem-shade': _dem},
  layers: [
    {
      'id': 'hillshade',
      'type': 'hillshade',
      'source': 'dem-shade',
      'before': 'water',
      'paint': {
        'hillshade-exaggeration': 0.55,
        'hillshade-shadow-color': '#3D3527',
        'hillshade-highlight-color': '#FFFFFF',
      },
    },
  ],
  terrain: {'source': 'dem', 'exaggeration': 1.5},
);

Future<VmapStyle> _resolveStyle() async {
  if (_style == 'builtin') return VmapStyle.light;
  if (_style == 'dark') return VmapStyle.dark;
  final request = await HttpClient().getUrl(
    Uri.parse('https://tiles.openfreemap.org/styles/$_style'),
  );
  final response = await request.close();
  final document =
      jsonDecode(await utf8.decodeStream(response)) as Map<String, Object?>;
  document['sky'] = _sky;
  if (_globe) document['projection'] = {'type': 'globe'};
  return VmapStyle.json(document);
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final style = await _resolveStyle();
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
      // The picture has its own size and pixel ratio, whatever window and
      // screen the app opens on.
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(
          context,
        ).copyWith(size: Size(_width, _height), devicePixelRatio: _pixelRatio),
        child: child!,
      ),
      home: OverflowBox(
        alignment: Alignment.topLeft,
        minWidth: _width,
        maxWidth: _width,
        minHeight: _height,
        maxHeight: _height,
        child: RepaintBoundary(
          key: key,
          child: Vmap(
            controller: controller,
            maxPitch: 85,
            style: style,
            overlay: _terrain ? _raisedGround : null,
            onError: (e) => stdout.writeln('SHOT_ERROR $e'),
          ),
        ),
      ),
    ),
  );
  Timer(const Duration(seconds: _wait), () async {
    final boundary =
        key.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    final image = await boundary.toImage(pixelRatio: _pixelRatio);
    final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
    final out = '${Directory.systemTemp.path}/$_name.png';
    File(out).writeAsBytesSync(bytes!.buffer.asUint8List());
    stdout.writeln('SHOT_DONE ${controller.engine?.drawingWith} $out');
    exit(0);
  });
}
