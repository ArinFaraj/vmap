import 'dart:async';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:latlong2/latlong.dart';
import 'package:vmap/src/camera/camera.dart';
import 'package:vmap/src/camera/map_camera.dart';
import 'package:vmap/src/camera/view.dart';
import 'package:vmap/src/labels/label_state.dart';
import 'package:vmap/src/labels/labels.dart';
import 'package:vmap/src/labels/text_style.dart';
import 'package:vmap/src/options.dart';
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/tiles/built_tile.dart';

const _size = ui.Size(400, 400);
const _zoom = 2.0;
const _world = 1024.0;
const _span = 0.25;

final _sheet = StyleSheet.compile({
  'version': 8,
  'sources': {
    'places': {'type': 'vector', 'url': 'https://example.org/planet'},
  },
  'layers': [
    {
      'id': 'names',
      'type': 'symbol',
      'source': 'places',
      'source-layer': 'place',
      'layout': {
        'text-field': ['get', 'name'],
        'text-size': 14,
        'symbol-z-order': 'viewport-y',
      },
    },
  ],
});

/// A label of equal rank at screen pixel [x], [y] of the unturned map, in
/// the world's first tile at zoom 2.
LabelCandidate _place(String key, double x, double y) => TileLabel(
  key,
  BuiltLabel(
    0,
    5,
    key,
    x / _world / _span * tileExtent,
    y / _world / _span * tileExtent,
    null,
  ),
  0,
  0,
  _span,
);

/// Labels drawn as MapLibre draws them, from glyph ranges that never come.
LabelEngine _engine() => LabelEngine(const VmapTextStyle())
  ..symbols = _sheet.symbols
  ..zoomOffset = 0
  ..useRanges(
    'https://example.org/{fontstack}/{range}.pbf',
    const VmapNetworkOptions(),
    () {},
    fetch: (_) => Completer<Uint8List?>().future,
  );

MapView _view(double bearing) {
  final x = _size.width / 2 / _world, y = _size.height / 2 / _world;
  final lat = math.atan(_sinh(math.pi * (1 - 2 * y))) * 180 / math.pi;
  return VmapCamera(
    center: LatLng(lat, x * 360 - 180),
    zoom: _zoom - 1,
    bearing: bearing,
  ).view(_size.width, _size.height);
}

double _sinh(double x) => (math.exp(x) - math.exp(-x)) / 2;

Future<Set<String>> _placed(
  LabelEngine labels,
  List<LabelCandidate> sources,
  double bearing,
) async {
  for (var frame = 0; frame < 4; frame++) {
    final recorder = ui.PictureRecorder();
    labels.paint(
      ui.Canvas(recorder),
      MapFrame(
        zoom: _zoom,
        origin: ui.Offset.zero,
        size: _size,
        rotation: bearing * math.pi / 180,
        devicePixelRatio: 1,
        view: _view(bearing),
      ),
      sources: [sources],
      sourcesKey: 1,
      background: 0xFFFFFFFF,
      dt: 1,
      rasterBudgetMicros: 1000000,
      zooming: false,
    );
    recorder.endRecording().dispose();
    await Future<void>.delayed(const Duration(milliseconds: 100));
  }
  return labels.placedKeys;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final labels = [_place('high', 200, 195), _place('low', 200, 205)];

  test('of two equals the lower on the screen is placed', () async {
    expect(await _placed(_engine(), labels, 0), {'low'});
    expect(await _placed(_engine(), labels, 180), {'high'});
  });

  test('a map turned round keeps the label it showed', () async {
    final engine = _engine();
    expect(await _placed(engine, labels, 0), {'low'});
    expect(await _placed(engine, labels, 180), {'low'});
  });
}
