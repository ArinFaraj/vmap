import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/vmap.dart';

const _square = [
  [44.005, 36.185],
  [44.015, 36.185],
  [44.015, 36.195],
  [44.005, 36.195],
  [44.005, 36.185],
];

const _style = VmapStyle.json({
  'version': 8,
  'sources': {
    'mine': {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'id': 7,
            'properties': {'name': 'square'},
            'geometry': {
              'type': 'Polygon',
              'coordinates': [_square],
            },
          },
        ],
      },
    },
    'spots': {
      'type': 'geojson',
      'cluster': true,
      'clusterRadius': 80,
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': {'n': 1},
            'geometry': {
              'type': 'Point',
              'coordinates': [44.30, 36.40],
            },
          },
          {
            'type': 'Feature',
            'properties': {'n': 2},
            'geometry': {
              'type': 'Point',
              'coordinates': [44.301, 36.401],
            },
          },
        ],
      },
    },
  },
  'layers': [
    {
      'id': 'area',
      'type': 'fill',
      'source': 'mine',
      'paint': {'fill-color': '#ff0000'},
    },
    {'id': 'dots', 'type': 'circle', 'source': 'spots'},
  ],
});

Future<VmapController> _drawn(
  WidgetTester tester, {
  void Function(VmapFeature feature, LatLng point)? onFeatureTap,
  List<String>? tappableLayers,
}) async {
  final controller = VmapController(
    const VmapCamera(center: LatLng(36.19, 44.01), zoom: 13),
  );
  addTearDown(controller.dispose);
  await tester.pumpWidget(
    Directionality(
      textDirection: TextDirection.ltr,
      child: Vmap(
        controller: controller,
        style: _style,
        rendering: const VmapRenderOptions(renderer: VmapRenderer.canvas),
        attribution: false,
        onFeatureTap: onFeatureTap,
        tappableLayers: tappableLayers,
      ),
    ),
  );
  for (var i = 0; i < 200; i++) {
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 20)),
    );
    await tester.pump(const Duration(milliseconds: 16));
    final engine = controller.engine!;
    if (engine.styleLoaded &&
        engine.stats.tilesDrawn > 0 &&
        engine.stats.tilesLoading == 0) {
      break;
    }
  }
  return controller;
}

void main() {
  testWidgets('a tap finds the feature under it, with where it is', (
    tester,
  ) async {
    final controller = await _drawn(tester);
    final found = (await tester.runAsync(
      () => controller.featuresAt(const LatLng(36.19, 44.01)),
    ))!;
    final square = found.singleWhere((f) => f.source == 'mine');
    expect(square.id, 7);
    expect(square.properties['name'], 'square');
    expect(square.layers, ['area']);
    expect(square.geometryType, 'Polygon');
    final ring = square.geometry.single;
    for (final [lon, lat] in _square) {
      expect(
        ring.any(
          (p) =>
              (p.longitude - lon).abs() < 1e-4 &&
              (p.latitude - lat).abs() < 1e-4,
        ),
        isTrue,
        reason: '$lon $lat',
      );
    }

    final nothing = (await tester.runAsync(
      () => controller.featuresAt(const LatLng(36.10, 43.90)),
    ))!;
    expect(nothing.where((f) => f.source == 'mine'), isEmpty);
  });

  testWidgets('an area finds what touches it', (tester) async {
    final controller = await _drawn(tester);
    final found = (await tester.runAsync(
      () => controller.featuresIn(
        const VmapBounds(LatLng(36.18, 44.0), LatLng(36.186, 44.007)),
      ),
    ))!;
    expect(found.map((f) => f.id), contains(7));
  });

  testWidgets('a cluster lists its points at their places', (tester) async {
    final controller = await _drawn(tester);
    final hits = (await tester.runAsync(
      () => controller.featuresIn(
        const VmapBounds(LatLng(36.3, 44.2), LatLng(36.5, 44.4)),
      ),
    ))!;
    final cluster = hits.firstWhere((f) => f.properties['cluster'] == true);
    final id = cluster.properties['cluster_id']! as int;
    final leaves = (await tester.runAsync(
      () => controller.clusterLeaves('spots', id),
    ))!;
    expect(leaves, hasLength(2));
    for (final leaf in leaves) {
      expect(leaf.point.latitude, closeTo(36.4, 0.01));
      expect(leaf.point.longitude, closeTo(44.3, 0.01));
    }
    final zoom = (await tester.runAsync(
      () => controller.clusterExpansionZoom('spots', id),
    ))!;
    expect(zoom, greaterThan(13));
  });

  testWidgets('a tap on a feature is told the feature', (tester) async {
    final tapped = <VmapFeature>[];
    await _drawn(tester, onFeatureTap: (f, _) => tapped.add(f));
    await tester.tapAt(tester.getCenter(find.byType(Vmap)));
    for (var i = 0; i < 50 && tapped.isEmpty; i++) {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 20)),
      );
      await tester.pump(const Duration(milliseconds: 16));
    }
    expect(tapped.single.id, 7);
  });

  testWidgets('a tap reports only the layers asked for', (tester) async {
    final tapped = <VmapFeature>[];
    await _drawn(
      tester,
      onFeatureTap: (f, _) => tapped.add(f),
      tappableLayers: const ['dots'],
    );
    await tester.tapAt(tester.getCenter(find.byType(Vmap)));
    for (var i = 0; i < 20; i++) {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 20)),
      );
      await tester.pump(const Duration(milliseconds: 16));
    }
    expect(tapped, isEmpty);
  });
}
