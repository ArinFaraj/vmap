import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/vmap.dart';
import 'package:vmap_flutter_map/vmap_flutter_map.dart';

void main() {
  testWidgets('the layer draws only inside its zoom range', (tester) async {
    final engine = VmapEngine(
      style: const VmapStyle.json({
        'version': 8,
        'sources': <String, Object?>{},
        'layers': <Object?>[],
      }),
    );
    addTearDown(engine.dispose);
    final map = MapController();
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: FlutterMap(
          mapController: map,
          options: const MapOptions(
            initialCenter: LatLng(36.19, 44.01),
            initialZoom: 10,
          ),
          children: [VmapLayer(engine: engine, minZoom: 8, maxZoom: 12)],
        ),
      ),
    );
    final drawing = find.descendant(
      of: find.byType(VmapLayer),
      matching: find.byType(CustomPaint),
    );
    expect(drawing, findsOneWidget);

    map.move(const LatLng(36.19, 44.01), 6);
    await tester.pump();
    expect(drawing, findsNothing);

    map.move(const LatLng(36.19, 44.01), 13);
    await tester.pump();
    expect(drawing, findsNothing);

    map.move(const LatLng(36.19, 44.01), 12);
    await tester.pump();
    expect(drawing, findsOneWidget);
  });

  testWidgets('the layer hands out the engine that draws it', (tester) async {
    const empty = VmapStyle.json({
      'version': 8,
      'sources': <String, Object?>{},
      'layers': <Object?>[],
    });
    final layer = GlobalKey<VmapLayerState>();
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: FlutterMap(
          options: const MapOptions(initialCenter: LatLng(36.19, 44.01)),
          children: [
            VmapLayer(
              key: layer,
              options: const VmapEngineOptions(style: empty),
            ),
          ],
        ),
      ),
    );
    final engine = layer.currentState!.engine;
    expect(await engine.featuresAt(const LatLng(36.19, 44.01)), isEmpty);
  });

  testWidgets('an app\'s engine is given the layer\'s markers', (tester) async {
    final app = VmapEngine(
      style: const VmapStyle.json({
        'version': 8,
        'sources': <String, Object?>{},
        'layers': <Object?>[],
      }),
    );
    addTearDown(app.dispose);
    Widget map(List<Marker> markers) => Directionality(
      textDirection: TextDirection.ltr,
      child: FlutterMap(
        options: const MapOptions(initialCenter: LatLng(36.19, 44.01)),
        children: [VmapLayer(engine: app, markers: markers)],
      ),
    );
    const marker = NamedMarker(
      point: LatLng(36.19, 44.01),
      name: 'Citadel',
      child: SizedBox(),
    );

    await tester.pumpWidget(map(const [marker]));
    expect(app.markers.single.name, 'Citadel');

    await tester.pumpWidget(const SizedBox());
    expect(app.markers, isEmpty);
  });

  testWidgets('a layer swaps between its own engine and an app\'s', (
    tester,
  ) async {
    const empty = VmapStyle.json({
      'version': 8,
      'sources': <String, Object?>{},
      'layers': <Object?>[],
    });
    final app = VmapEngine(style: empty);
    addTearDown(app.dispose);
    Widget map(VmapLayer layer) => Directionality(
      textDirection: TextDirection.ltr,
      child: FlutterMap(
        options: const MapOptions(initialCenter: LatLng(36.19, 44.01)),
        children: [layer],
      ),
    );
    VmapEngine drawing() =>
        tester.state<VmapLayerState>(find.byType(VmapLayer)).engine;

    await tester.pumpWidget(map(VmapLayer(engine: app)));
    expect(drawing(), same(app));

    await tester.pumpWidget(
      map(const VmapLayer(options: VmapEngineOptions(style: empty))),
    );
    final own = drawing();
    expect(own, isNot(same(app)));

    await tester.pumpWidget(map(VmapLayer(engine: app)));
    expect(drawing(), same(app));
    expect(() => own.addListener(() {}), throwsFlutterError);
  });
}
