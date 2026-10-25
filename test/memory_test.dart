import 'dart:ui' as ui;

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/render/map_renderer.dart';
import 'package:vmap/src/style/style_model.dart';
import 'package:vmap/src/tiles/tiles.dart' show LoadedTile;
import 'package:vmap/vmap.dart';

class _Renderer extends MapRenderer {
  int trims = 0;

  @override
  void trimMemory() => trims++;

  @override
  bool supports(StyleSheet sheet) => false;

  @override
  bool paint(ui.Canvas canvas, RenderFrame frame) => false;

  @override
  bool makeReady(
    LoadedTile tile,
    double scale,
    Stopwatch clock,
    int deadline,
  ) => true;

  @override
  bool canBuild(LoadedTile tile) => true;

  @override
  void dispose() {}
}

void main() {
  const empty = VmapStyle.json({
    'version': 8,
    'sources': <String, Object?>{},
    'layers': <Object?>[],
  });

  testWidgets('the map lets memory go when the system runs short', (
    tester,
  ) async {
    final renderer = _Renderer();
    final engine = VmapEngine(style: empty, debugRenderer: renderer);
    addTearDown(engine.dispose);
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: Vmap(
          engine: engine,
          controller: VmapController(
            const VmapCamera(center: LatLng(36.19, 44.01), zoom: 10),
          ),
        ),
      ),
    );

    tester.binding.handleMemoryPressure();

    expect(renderer.trims, 1);
    await tester.pumpWidget(const SizedBox());
  });
}
