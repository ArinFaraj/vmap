import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/label_state.dart';
import 'package:vmap/src/labels.dart';
import 'package:vmap/src/text_style.dart';
import 'package:vmap/src/style_model.dart';
import 'package:vmap/src/tile_builder.dart';

const _size = ui.Size(400, 400);

/// A world 1024 pixels wide, so a point at world fraction f sits at 1024 * f
/// on the screen with the origin at the top left of the world.
const _zoom = 2.0;
const _world = 1024.0;

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
      },
    },
    {
      'id': 'roads',
      'type': 'symbol',
      'source': 'places',
      'source-layer': 'road',
      'layout': {
        'text-field': ['get', 'name'],
        'symbol-placement': 'line',
        'text-size': 14,
      },
    },
  ],
});

/// A label of the place layer at screen pixel [x], [y].
LabelCandidate _place(String key, String text, double x, double y, int rank) =>
    LabelCandidate(
      key,
      BuiltLabel(0, rank, text, 0, 0, null),
      x / _world,
      y / _world,
      0,
    );

LabelEngine _engine() => LabelEngine(const VmapTextStyle())
  ..symbols = _sheet.symbols
  ..zoomOffset = 0;

/// Paints until placing and drawing the labels has settled, and returns the
/// keys of the labels showing.
Future<Set<String>> _settle(
  LabelEngine labels,
  List<List<LabelCandidate>> sources,
) async {
  for (var frame = 0; frame < 8; frame++) {
    final recorder = ui.PictureRecorder();
    labels.paint(
      ui.Canvas(recorder),
      sources: sources,
      sourcesKey: 1,
      background: 0xFFFFFFFF,
      zoom: _zoom,
      origin: ui.Offset.zero,
      size: _size,
      rotation: 0,
      devicePixelRatio: 1,
      dt: 1,
      rasterBudgetMicros: 1000000,
      zooming: false,
    );
    recorder.endRecording().dispose();
    await Future<void>.delayed(const Duration(milliseconds: 100));
  }
  return labels.shownKeys;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('of two labels in one place the one ranked first shows', () async {
    final shown = await _settle(_engine(), [
      [
        _place('late', 'Second', 200, 200, 9),
        _place('early', 'First', 200, 200, 1),
        _place('apart', 'Elsewhere', 60, 340, 5),
      ],
    ]);
    expect(shown, {'early', 'apart'});
  });

  test(
    "a marker's name shows, and a map label under the marker steps aside",
    () async {
      final labels = _engine()
        ..obstacles = [(200 / _world, 200 / _world, 40, 40, 0, 0)];
      final shown = await _settle(labels, [
        [LabelCandidate.marker(0, 'Home', 200 / _world, 200 / _world)],
        [_place('under', 'Covered', 200, 200, 1)],
      ]);
      expect(shown, {LabelCandidate.marker(0, 'Home', 0, 0).key, 'under'});
    },
  );

  test('a name is written along a straight road', () async {
    final road = LabelCandidate(
      'road',
      BuiltLabel(
        1,
        1,
        'Long Road',
        0,
        0,
        Float32List.fromList([0, 2048, 4096, 2048]),
      ),
      0,
      0,
      400 / _world,
    );
    final shown = await _settle(_engine(), [
      [road],
    ]);
    expect(shown, {'road'});
  });
}
