import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:latlong2/latlong.dart';
import 'package:vmap/vmap.dart' show VmapGestureOptions;
import 'package:vmap_flutter_map/vmap_flutter_map.dart';

Future<MapController> _pump(
  WidgetTester tester, {
  VmapGestureOptions options = const VmapGestureOptions(),
}) async {
  final controller = MapController();
  await tester.pumpWidget(
    Directionality(
      textDirection: TextDirection.ltr,
      child: VmapGestures(
        controller: controller,
        options: options,
        child: FlutterMap(
          mapController: controller,
          options: const MapOptions(
            initialCenter: LatLng(36.19, 44.01),
            initialZoom: 12,
            interactionOptions: InteractionOptions(flags: InteractiveFlag.none),
          ),
          children: const [],
        ),
      ),
    ),
  );
  await tester.pump();
  return controller;
}

Future<void> _settle(WidgetTester tester) async {
  for (var i = 0; i < 30; i++) {
    await tester.pump(const Duration(milliseconds: 50));
  }
}

void main() {
  testWidgets('a wheel step zooms as MapLibre GL JS does', (tester) async {
    final c = await _pump(tester);
    final mouse = TestPointer(1, PointerDeviceKind.mouse);
    await tester.sendEventToBinding(mouse.hover(const Offset(400, 300)));
    await tester.sendEventToBinding(mouse.scroll(const Offset(0, -300)));
    await _settle(tester);
    expect(
      c.camera.zoom,
      closeTo(12 + math.log(2 / (1 + math.exp(-300 / 450))) / math.ln2, 1e-6),
    );
  });

  testWidgets('a trackpad scroll zooms rather than pans', (tester) async {
    final c = await _pump(tester);
    final pad = TestPointer(1, PointerDeviceKind.trackpad);
    await tester.sendEventToBinding(pad.hover(const Offset(400, 300)));
    final before = c.camera;
    await tester.sendEventToBinding(pad.scroll(const Offset(0, -3)));
    await tester.pump(const Duration(milliseconds: 16));
    expect(c.camera.zoom, greaterThan(before.zoom));
  });

  testWidgets('a native trackpad pans, pinches and turns', (tester) async {
    final c = await _pump(tester);
    final pad = TestPointer(1, PointerDeviceKind.trackpad);
    await tester.sendEventToBinding(pad.panZoomStart(const Offset(400, 300)));
    await tester.sendEventToBinding(
      pad.panZoomUpdate(
        const Offset(400, 300),
        pan: const Offset(30, 0),
        scale: 2,
        rotation: 0.5,
      ),
    );
    await tester.sendEventToBinding(pad.panZoomEnd());
    await tester.pump();
    expect(c.camera.zoom, closeTo(13, 1e-6));
    expect(c.camera.rotation, closeTo(0.5 * 180 / 3.141592653589793, 0.01));
  });

  testWidgets('a right drag turns the map', (tester) async {
    final c = await _pump(tester);
    final mouse = await tester.startGesture(
      const Offset(400, 300),
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryMouseButton,
    );
    await mouse.moveTo(const Offset(450, 300));
    await mouse.up();
    await tester.pump();
    expect(c.camera.rotation, closeTo(-40, 0.01));
  });

  testWidgets('the keyboard zooms, pans and turns once focused', (
    tester,
  ) async {
    final c = await _pump(tester);
    await tester.tapAt(const Offset(400, 300));
    await tester.pump(const Duration(milliseconds: 400));
    await tester.sendKeyEvent(LogicalKeyboardKey.equal);
    await _settle(tester);
    expect(c.camera.zoom, closeTo(13, 1e-6));
    final before = c.camera.center;
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await _settle(tester);
    expect(c.camera.center.longitude, greaterThan(before.longitude));
    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowLeft);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await _settle(tester);
    expect(c.camera.rotation, closeTo(15, 0.01));
  });

  testWidgets('without rotate a right drag leaves the map unturned', (
    tester,
  ) async {
    final c = await _pump(
      tester,
      options: const VmapGestureOptions(rotate: false),
    );
    final mouse = await tester.startGesture(
      const Offset(400, 300),
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryMouseButton,
    );
    await mouse.moveTo(const Offset(450, 300));
    await mouse.up();
    await tester.pump();
    expect(c.camera.rotation, 0);
  });

  testWidgets('a pinch zooms about the fingers and glides like a Vmap', (
    tester,
  ) async {
    final c = await _pump(tester);
    final a = await tester.startGesture(const Offset(350, 300), pointer: 1);
    final b = await tester.startGesture(const Offset(450, 300), pointer: 2);
    for (var i = 1; i <= 10; i++) {
      await tester.pump(const Duration(milliseconds: 16));
      await a.moveTo(Offset(350 - i * 5.0, 300));
      await b.moveTo(Offset(450 + i * 5.0, 300));
    }
    await tester.pump(const Duration(milliseconds: 200));
    await a.up();
    await b.up();
    await _settle(tester);
    expect(c.camera.zoom, closeTo(13, 0.05));
  });

  testWidgets('a shift drag zooms to the box it draws', (tester) async {
    final c = await _pump(tester);
    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    final mouse = await tester.startGesture(
      const Offset(300, 200),
      kind: PointerDeviceKind.mouse,
    );
    await mouse.moveTo(const Offset(500, 400));
    await tester.pump();
    await mouse.up();
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await _settle(tester);
    expect(c.camera.zoom, closeTo(13.58, 0.01));
  });
}
