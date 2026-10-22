import 'package:flutter/gestures.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:latlong2/latlong.dart';
import 'package:vmap_flutter_map/vmap_flutter_map.dart';

Future<MapController> _pump(WidgetTester tester) async {
  final controller = MapController();
  await tester.pumpWidget(
    Directionality(
      textDirection: TextDirection.ltr,
      child: VmapGestures(
        controller: controller,
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
  testWidgets('wheel notches add up to whole zoom steps', (tester) async {
    final c = await _pump(tester);
    final mouse = TestPointer(1, PointerDeviceKind.mouse);
    await tester.sendEventToBinding(mouse.hover(const Offset(400, 300)));
    await tester.sendEventToBinding(mouse.scroll(const Offset(0, -150)));
    await tester.pump(const Duration(milliseconds: 50));
    await tester.sendEventToBinding(mouse.scroll(const Offset(0, -150)));
    await _settle(tester);
    expect(c.camera.zoom, closeTo(13, 1e-6));
  });

  testWidgets('a trackpad slide in a browser pans and a pinch zooms', (
    tester,
  ) async {
    final c = await _pump(tester);
    final pad = TestPointer(1, PointerDeviceKind.trackpad);
    await tester.sendEventToBinding(pad.hover(const Offset(400, 300)));
    final before = c.camera.center;
    await tester.sendEventToBinding(pad.scroll(const Offset(80, 0)));
    await tester.pump();
    expect(c.camera.center.longitude, greaterThan(before.longitude));
    expect(c.camera.zoom, closeTo(12, 1e-9));
    await tester.sendEventToBinding(pad.scale(2));
    await tester.pump();
    expect(c.camera.zoom, closeTo(13, 1e-6));
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
    await tester.pump();
    expect(c.camera.center.longitude, greaterThan(before.longitude));
    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowLeft);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await tester.pump();
    expect(c.camera.rotation, closeTo(15, 0.01));
  });
}
