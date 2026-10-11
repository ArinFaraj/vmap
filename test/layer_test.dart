import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:latlong2/latlong.dart';
import 'package:vmap/vmap.dart';

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
          children: [VmapLayer.engine(engine, minZoom: 8, maxZoom: 12)],
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
}
