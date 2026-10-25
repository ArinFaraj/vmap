import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/vmap.dart';

const _empty = VmapStyle.json({
  'version': 8,
  'sources': <String, Object?>{},
  'layers': <Object?>[
    {
      'id': 'land',
      'type': 'background',
      'paint': {'background-color': '#eeeeee'},
    },
  ],
});

const _erbil = VmapCamera(center: LatLng(36.19, 44.01), zoom: 12);

Future<VmapController> _pump(
  WidgetTester tester, {
  VmapCamera camera = _erbil,
  List<VmapMarker> markers = const [],
  void Function(LatLng)? onTap,
  void Function(LatLng)? onLongPress,
  void Function(VmapCamera)? onCameraIdle,
  WidgetBuilder? loadingBuilder,
  VmapGestureOptions gestures = const VmapGestureOptions(),
}) async {
  final controller = VmapController(camera);
  addTearDown(controller.dispose);
  await tester.pumpWidget(
    Directionality(
      textDirection: TextDirection.ltr,
      child: Vmap(
        controller: controller,
        style: _empty,
        rendering: const VmapRenderOptions(renderer: VmapRenderer.canvas),
        attribution: false,
        markers: markers,
        onTap: onTap,
        onLongPress: onLongPress,
        onCameraIdle: onCameraIdle,
        loadingBuilder: loadingBuilder,
        gestures: gestures,
      ),
    ),
  );
  await tester.pump();
  return controller;
}

/// The levels MapLibre GL JS zooms for [delta] pixels of wheel at [rate].
double _wheelLevels(double delta, double rate) =>
    math.log(2 / (1 + math.exp(-delta * rate))) / math.ln2;

Future<void> _settle(WidgetTester tester) async {
  for (var i = 0; i < 40; i++) {
    await tester.pump(const Duration(milliseconds: 50));
  }
}

void main() {
  testWidgets('a drag moves the map with the finger', (tester) async {
    final c = await _pump(tester);
    final before = c.toLatLng(const Offset(400, 300))!;
    await tester.dragFrom(const Offset(400, 300), const Offset(-120, 0));
    await _settle(tester);
    final under = c.toScreen(before)!;
    expect(under.dx, lessThan(300));
    expect(under.dy, closeTo(300, 2));
  });

  testWidgets('a double tap zooms in one level about the tap', (tester) async {
    final c = await _pump(tester);
    final spot = c.toLatLng(const Offset(200, 200))!;
    await tester.tapAt(const Offset(200, 200));
    await tester.pump(const Duration(milliseconds: 60));
    await tester.tapAt(const Offset(200, 200));
    await _settle(tester);
    expect(c.camera.zoom, closeTo(13, 1e-6));
    final now = c.toScreen(spot)!;
    expect(now.dx, closeTo(200, 0.5));
    expect(now.dy, closeTo(200, 0.5));
  });

  testWidgets('a drag after a double tap pans rather than zooms', (
    tester,
  ) async {
    final c = await _pump(tester);
    await tester.tapAt(const Offset(200, 200));
    await tester.pump(const Duration(milliseconds: 60));
    await tester.tapAt(const Offset(200, 200));
    await _settle(tester);
    final zoom = c.camera.zoom;
    final before = c.toLatLng(const Offset(400, 300))!;
    await tester.dragFrom(const Offset(400, 300), const Offset(0, 120));
    await _settle(tester);
    expect(c.camera.zoom, closeTo(zoom, 1e-6));
    expect(c.toScreen(before)!.dy, greaterThan(400));
  });

  testWidgets('a two finger tap zooms out one level', (tester) async {
    final c = await _pump(tester);
    final a = await tester.startGesture(const Offset(350, 300), pointer: 1);
    final b = await tester.startGesture(const Offset(450, 300), pointer: 2);
    await tester.pump(const Duration(milliseconds: 40));
    await a.up();
    await b.up();
    await _settle(tester);
    expect(c.camera.zoom, closeTo(11, 1e-6));
  });

  testWidgets('pinching apart zooms in', (tester) async {
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

  testWidgets('a mouse wheel zooms in about the pointer', (tester) async {
    final c = await _pump(tester);
    final spot = c.toLatLng(const Offset(600, 150))!;
    final mouse = TestPointer(1, PointerDeviceKind.mouse);
    await tester.sendEventToBinding(mouse.hover(const Offset(600, 150)));
    await tester.sendEventToBinding(mouse.scroll(const Offset(0, -300)));
    await _settle(tester);
    expect(c.camera.zoom, closeTo(12 + _wheelLevels(300, 1 / 450), 1e-6));
    final now = c.toScreen(spot)!;
    expect(now.dx, closeTo(600, 1));
    expect(now.dy, closeTo(150, 1));
  });

  testWidgets('the keyboard zooms and pans once the map has focus', (
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
  });

  testWidgets('a tap is told where it landed', (tester) async {
    LatLng? tapped;
    final c = await _pump(tester, onTap: (p) => tapped = p);
    final expected = c.toLatLng(const Offset(250, 120))!;
    await tester.tapAt(const Offset(250, 120));
    await tester.pump(const Duration(milliseconds: 400));
    expect(tapped!.latitude, closeTo(expected.latitude, 1e-9));
    expect(tapped!.longitude, closeTo(expected.longitude, 1e-9));
  });

  testWidgets('a marker sits on its place and takes its own taps', (
    tester,
  ) async {
    var mapTaps = 0, markerTaps = 0;
    final c = await _pump(
      tester,
      onTap: (_) => mapTaps++,
      markers: [
        VmapMarker(
          point: _erbil.center,
          width: 40,
          height: 40,
          alignment: Alignment.topCenter,
          child: GestureDetector(
            onTap: () => markerTaps++,
            child: const ColoredBox(color: Color(0xFFFF0000)),
          ),
        ),
      ],
    );
    final box = tester.getRect(find.byType(ColoredBox));
    final at = c.toScreen(_erbil.center)!;
    expect(box.bottomCenter.dx, closeTo(at.dx, 0.5));
    expect(box.bottomCenter.dy, closeTo(at.dy, 0.5));
    await tester.tapAt(box.center);
    await tester.pump(const Duration(milliseconds: 400));
    expect(markerTaps, 1);
    expect(mapTaps, 0);
  });

  testWidgets('a map laid out with no room yet paints its markers', (
    tester,
  ) async {
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: Center(
          child: SizedBox.shrink(
            child: Vmap(
              initialCamera: _erbil,
              style: _empty,
              rendering: const VmapRenderOptions(renderer: VmapRenderer.canvas),
              attribution: false,
              markers: [
                VmapMarker(
                  point: _erbil.center,
                  width: 40,
                  height: 40,
                  child: const ColoredBox(color: Color(0xFFFF0000)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(tester.takeException(), isNull);
  });

  testWidgets('holding a finger still is a long press', (tester) async {
    LatLng? held;
    var taps = 0;
    await _pump(tester, onLongPress: (p) => held = p, onTap: (_) => taps++);
    final finger = await tester.startGesture(const Offset(300, 300));
    await tester.pump(const Duration(milliseconds: 600));
    await finger.up();
    await tester.pump(const Duration(milliseconds: 400));
    expect(held, isNotNull);
    expect(taps, 0);
  });

  testWidgets('the camera is told once when it comes to rest', (tester) async {
    final rests = <VmapCamera>[];
    final c = await _pump(tester, onCameraIdle: rests.add);
    await tester.flingFrom(const Offset(400, 300), const Offset(-200, 0), 1500);
    await _settle(tester);
    expect(rests, hasLength(1));
    expect(rests.single, c.camera);
  });

  testWidgets('the loading cover goes once the style is drawn', (tester) async {
    await _pump(tester, loadingBuilder: (_) => const Text('loading'));
    await _settle(tester);
    final opacity = tester.widget<AnimatedOpacity>(
      find.ancestor(
        of: find.text('loading'),
        matching: find.byType(AnimatedOpacity),
      ),
    );
    expect(opacity.opacity, 0);
  });

  testWidgets('fitting bounds frames them inside the padding, turned too', (
    tester,
  ) async {
    const bounds = VmapBounds(LatLng(36.10, 43.90), LatLng(36.30, 44.15));
    const padding = EdgeInsets.fromLTRB(40, 80, 20, 160);
    for (final bearing in [0.0, 90.0, 30.0]) {
      final c = await _pump(tester, camera: _erbil.copyWith(bearing: bearing));
      await c.fitBounds(bounds, padding: padding);
      await tester.pump();
      const inside = Rect.fromLTRB(40, 80, 780, 440);
      for (final corner in [
        bounds.southWest,
        bounds.northEast,
        LatLng(bounds.southWest.latitude, bounds.northEast.longitude),
        LatLng(bounds.northEast.latitude, bounds.southWest.longitude),
      ]) {
        final p = c.toScreen(corner)!;
        expect(inside.inflate(1).contains(p), isTrue, reason: '$bearing $p');
      }
    }
  });

  testWidgets('a place and its point on the screen agree', (tester) async {
    final c = await _pump(tester, camera: _erbil.copyWith(pitch: 45));
    for (final point in const [Offset(100, 500), Offset(700, 200)]) {
      final place = c.toLatLng(point)!;
      final back = c.toScreen(place)!;
      expect(back.dx, closeTo(point.dx, 1e-6));
      expect(back.dy, closeTo(point.dy, 1e-6));
    }
  });

  testWidgets('a trackpad scroll zooms frame by frame about the pointer', (
    tester,
  ) async {
    var idle = 0;
    final c = await _pump(tester, onCameraIdle: (_) => idle++);
    final spot = c.toLatLng(const Offset(600, 150))!;
    final pad = TestPointer(1, PointerDeviceKind.trackpad);
    await tester.sendEventToBinding(pad.hover(const Offset(600, 150)));
    for (var i = 0; i < 10; i++) {
      await tester.sendEventToBinding(pad.scroll(const Offset(0, -3)));
      await tester.pump(const Duration(milliseconds: 16));
    }
    expect(c.camera.zoom, closeTo(12 + 10 * _wheelLevels(3, 1 / 100), 1e-6));
    final now = c.toScreen(spot)!;
    expect(now.dx, closeTo(600, 1));
    expect(now.dy, closeTo(150, 1));
    expect(idle, 0);
    await _settle(tester);
    expect(idle, 1);
  });

  testWidgets('a shift double click zooms out', (tester) async {
    final c = await _pump(tester);
    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    for (var i = 0; i < 2; i++) {
      final mouse = await tester.startGesture(
        const Offset(300, 200),
        kind: PointerDeviceKind.mouse,
      );
      await mouse.up();
      await tester.pump(const Duration(milliseconds: 60));
    }
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await _settle(tester);
    expect(c.camera.zoom, closeTo(11, 1e-6));
  });

  testWidgets('a shift drag zooms to the box it draws', (tester) async {
    final c = await _pump(tester);
    final centre = c.toLatLng(const Offset(300, 250))!;
    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    final mouse = await tester.startGesture(
      const Offset(200, 200),
      kind: PointerDeviceKind.mouse,
    );
    for (var i = 1; i <= 10; i++) {
      await mouse.moveTo(Offset(200 + i * 20.0, 200 + i * 10.0));
      await tester.pump(const Duration(milliseconds: 16));
    }
    expect(find.byType(DecoratedBox), findsWidgets);
    await mouse.up();
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await _settle(tester);
    expect(c.camera.zoom, closeTo(14, 0.01));
    expect(c.camera.center.latitude, closeTo(centre.latitude, 1e-4));
    expect(c.camera.center.longitude, closeTo(centre.longitude, 1e-4));
  });

  testWidgets('a right drag or a control drag turns the map', (tester) async {
    final c = await _pump(tester);
    final right = await tester.startGesture(
      const Offset(400, 300),
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryMouseButton,
    );
    for (var i = 1; i <= 10; i++) {
      await right.moveTo(Offset(400 + i * 5.0, 300));
      await tester.pump(const Duration(milliseconds: 16));
    }
    await right.up();
    await _settle(tester);
    expect(c.camera.bearing, closeTo(40, 1));

    await tester.sendKeyDownEvent(LogicalKeyboardKey.controlLeft);
    final left = await tester.startGesture(
      const Offset(400, 300),
      kind: PointerDeviceKind.mouse,
    );
    for (var i = 1; i <= 10; i++) {
      await left.moveTo(Offset(400 - i * 5.0, 300));
      await tester.pump(const Duration(milliseconds: 16));
    }
    await left.up();
    await tester.sendKeyUpEvent(LogicalKeyboardKey.controlLeft);
    await _settle(tester);
    expect(c.camera.bearing, closeTo(0, 1));
  });

  testWidgets('shift with plus zooms two whole levels', (tester) async {
    final c = await _pump(
      tester,
      camera: const VmapCamera(center: LatLng(36.19, 44.01), zoom: 12.4),
    );
    await tester.tapAt(const Offset(400, 300));
    await tester.pump(const Duration(milliseconds: 400));
    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.equal);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await _settle(tester);
    expect(c.camera.zoom, closeTo(14, 1e-6));
    await tester.sendKeyEvent(LogicalKeyboardKey.minus);
    await _settle(tester);
    expect(c.camera.zoom, closeTo(13, 1e-6));
  });

  testWidgets('a wheel zoom during a fling adds to its glide', (tester) async {
    final c = await _pump(tester);
    await tester.flingFrom(const Offset(600, 400), const Offset(-200, 0), 1500);
    await tester.pump(const Duration(milliseconds: 16));
    expect(c.isMoving, isTrue);
    final mouse = TestPointer(2, PointerDeviceKind.mouse);
    await tester.sendEventToBinding(mouse.hover(const Offset(400, 300)));
    var zoom = c.camera.zoom, longitude = c.camera.center.longitude;
    for (var i = 0; i < 40; i++) {
      if (i < 10) {
        await tester.sendEventToBinding(mouse.scroll(const Offset(0, -3)));
      }
      await tester.pump(const Duration(milliseconds: 16));
      expect(c.camera.zoom, greaterThanOrEqualTo(zoom - 1e-9));
      expect(c.camera.center.longitude, greaterThanOrEqualTo(longitude - 1e-9));
      zoom = c.camera.zoom;
      longitude = c.camera.center.longitude;
    }
    expect(zoom, greaterThan(12));
  });

  testWidgets('a native trackpad pans, pinches and turns the map', (
    tester,
  ) async {
    final c = await _pump(tester);
    final pad = TestPointer(1, PointerDeviceKind.trackpad);
    await tester.sendEventToBinding(pad.panZoomStart(const Offset(400, 300)));
    for (var i = 1; i <= 10; i++) {
      await tester.sendEventToBinding(
        pad.panZoomUpdate(
          const Offset(400, 300),
          pan: Offset(i * 4.0, 0),
          scale: 1 + i * 0.1,
          rotation: -i * 0.02,
          timeStamp: Duration(milliseconds: i * 16),
        ),
      );
      await tester.pump(const Duration(milliseconds: 16));
    }
    await tester.sendEventToBinding(
      pad.panZoomEnd(timeStamp: const Duration(milliseconds: 400)),
    );
    await _settle(tester);
    expect(c.camera.zoom, closeTo(13, 0.05));
    expect(c.camera.bearing, closeTo(0.2 * 180 / 3.141592653589793, 0.5));
  });

  group('gesture options', () {
    testWidgets('none leaves the camera to code and still reports taps', (
      tester,
    ) async {
      LatLng? tapped;
      final c = await _pump(
        tester,
        gestures: VmapGestureOptions.none,
        onTap: (p) => tapped = p,
      );
      final before = c.camera;
      await tester.dragFrom(const Offset(400, 300), const Offset(-120, 0));
      final mouse = TestPointer(1, PointerDeviceKind.mouse);
      await tester.sendEventToBinding(mouse.hover(const Offset(400, 300)));
      await tester.sendEventToBinding(mouse.scroll(const Offset(0, -300)));
      await _settle(tester);
      expect(c.camera, before);
      await tester.tapAt(const Offset(200, 200));
      await tester.pump(const Duration(milliseconds: 400));
      expect(tapped, isNotNull);
    });

    testWidgets('without drag pan a pinch zooms but does not slide', (
      tester,
    ) async {
      final c = await _pump(
        tester,
        gestures: const VmapGestureOptions(dragPan: false),
      );
      final before = c.camera.center;
      await tester.dragFrom(const Offset(400, 300), const Offset(-120, 0));
      await _settle(tester);
      expect(c.camera.center, before);
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

    testWidgets('without rotate a right drag only tilts', (tester) async {
      final c = await _pump(
        tester,
        gestures: const VmapGestureOptions(rotate: false),
      );
      final right = await tester.startGesture(
        const Offset(400, 300),
        kind: PointerDeviceKind.mouse,
        buttons: kSecondaryMouseButton,
      );
      for (var i = 1; i <= 10; i++) {
        await right.moveTo(Offset(400 + i * 5.0, 300 - i * 3.0));
        await tester.pump(const Duration(milliseconds: 16));
      }
      await right.up();
      await _settle(tester);
      expect(c.camera.bearing, 0);
      expect(c.camera.pitch, greaterThan(5));
    });

    testWidgets('the wheel rate sets how far a notch zooms', (tester) async {
      final c = await _pump(
        tester,
        gestures: const VmapGestureOptions(wheelZoomRate: 1 / 150),
      );
      final mouse = TestPointer(1, PointerDeviceKind.mouse);
      await tester.sendEventToBinding(mouse.hover(const Offset(400, 300)));
      await tester.sendEventToBinding(mouse.scroll(const Offset(0, -150)));
      await _settle(tester);
      expect(c.camera.zoom, closeTo(12 + _wheelLevels(150, 1 / 150), 1e-6));
    });

    testWidgets('without double click zoom a double tap is two taps', (
      tester,
    ) async {
      var taps = 0;
      final c = await _pump(
        tester,
        gestures: const VmapGestureOptions(doubleClickZoom: false),
        onTap: (_) => taps++,
      );
      await tester.tapAt(const Offset(200, 200));
      await tester.pump(const Duration(milliseconds: 60));
      await tester.tapAt(const Offset(200, 200));
      await _settle(tester);
      expect(c.camera.zoom, 12);
      expect(taps, 2);
    });

    testWidgets('without inertia a fast drag stops where the finger does', (
      tester,
    ) async {
      final c = await _pump(
        tester,
        gestures: const VmapGestureOptions(inertia: false),
      );
      final spot = c.toLatLng(const Offset(400, 300))!;
      await tester.flingFrom(
        const Offset(400, 300),
        const Offset(-150, 0),
        2000,
      );
      await _settle(tester);
      expect(c.toScreen(spot)!.dx, closeTo(250, 2));
    });

    testWidgets('options change on a rebuild', (tester) async {
      await _pump(tester, gestures: VmapGestureOptions.none);
      final c = await _pump(tester);
      final before = c.camera.center;
      await tester.dragFrom(const Offset(400, 300), const Offset(-120, 0));
      await _settle(tester);
      expect(c.camera.center, isNot(before));
    });
  });
}
