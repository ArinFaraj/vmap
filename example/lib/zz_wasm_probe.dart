import 'dart:async';

import 'package:flutter/material.dart';
import 'package:vmap/vmap.dart';

void main() {
  final controller = VmapController(
    const VmapCamera(center: LatLng(36.1912, 44.0092), zoom: 14),
  );
  final renderer = Uri.base.queryParameters['r'] == 'canvas'
      ? VmapRenderer.canvas
      : VmapRenderer.gpu;
  runApp(
    MaterialApp(
      home: Scaffold(
        body: Vmap(
          controller: controller,
          style: const VmapStyle.url(
            'https://tiles.openfreemap.org/styles/liberty',
          ),
          rendering: VmapRenderOptions(renderer: renderer),
          onError: (e) => print('PROBE_ERROR $e'),
        ),
      ),
    ),
  );
  Timer.periodic(const Duration(seconds: 3), (_) {
    final e = controller.engine;
    print(
      'PROBE drawing=${e?.drawingWith} loaded=${e?.styleLoaded} '
      'size=${controller.camera}',
    );
  });
}
