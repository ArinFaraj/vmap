import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';

import 'engine.dart';

/// A flutter_map layer that draws vector tiles with [engine].
class VmapLayer extends StatelessWidget {
  const VmapLayer({required this.engine, super.key});

  final VmapEngine engine;

  @override
  Widget build(BuildContext context) {
    final camera = MapCamera.of(context);
    return MobileLayerTransformer(
      child: RepaintBoundary(
        child: CustomPaint(
          size: camera.size,
          painter: _VmapPainter(
            engine,
            VmapCamera(
              zoom: camera.zoom,
              origin: camera.pixelOrigin,
              size: camera.size,
              rotation: camera.rotationRad,
              devicePixelRatio: MediaQuery.devicePixelRatioOf(context),
            ),
          ),
        ),
      ),
    );
  }
}

class _VmapPainter extends CustomPainter {
  _VmapPainter(this.engine, this.camera) : super(repaint: engine);

  final VmapEngine engine;
  final VmapCamera camera;

  @override
  void paint(Canvas canvas, Size size) => engine.paint(canvas, camera);

  @override
  bool shouldRepaint(_VmapPainter oldDelegate) => true;
}
