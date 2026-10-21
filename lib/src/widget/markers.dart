import 'package:flutter/widgets.dart';

import '../marker.dart';
import '../mercator.dart';
import 'vmap_controller.dart';

/// The markers of a map, moved with its camera every frame without
/// building again.
class MarkerLayer extends StatelessWidget {
  const MarkerLayer({
    required this.controller,
    required this.markers,
    required this.onMarkerDown,
    super.key,
  });

  final VmapController controller;
  final List<VmapMarker> markers;

  /// Told when a pointer goes down on a marker, before the map hears it.
  final VoidCallback onMarkerDown;

  @override
  Widget build(BuildContext context) => Flow(
    delegate: _MarkerFlow(controller, markers),
    clipBehavior: Clip.hardEdge,
    children: [
      for (final m in markers)
        Listener(
          key: m.key,
          behavior: HitTestBehavior.deferToChild,
          onPointerDown: (_) => onMarkerDown(),
          child: SizedBox(width: m.width, height: m.height, child: m.child),
        ),
    ],
  );
}

class _MarkerFlow extends FlowDelegate {
  _MarkerFlow(this.controller, this.markers) : super(repaint: controller);

  final VmapController controller;
  final List<VmapMarker> markers;

  @override
  BoxConstraints getConstraintsForChild(int i, BoxConstraints constraints) =>
      BoxConstraints.tight(Size(markers[i].width, markers[i].height));

  @override
  void paintChildren(FlowPaintingContext context) {
    final view = controller.view;
    final size = context.size;
    for (var i = 0; i < context.childCount; i++) {
      final m = markers[i];
      view.projectTo(
        worldX(m.point.longitude) * view.worldSize,
        worldY(m.point.latitude) * view.worldSize,
      );
      if (view.outDepth <= 0 || view.outX < -1e5) continue;
      final a = m.alignment ?? Alignment.center;
      final left = view.outX + (a.x - 1) * m.width / 2;
      final top = view.outY + (a.y - 1) * m.height / 2;
      if (left > size.width ||
          top > size.height ||
          left + m.width < 0 ||
          top + m.height < 0) {
        continue;
      }
      context.paintChild(i, transform: Matrix4.translationValues(left, top, 0));
    }
  }

  @override
  bool shouldRepaint(_MarkerFlow old) =>
      old.controller != controller || !identical(old.markers, markers);

  @override
  bool shouldRelayout(_MarkerFlow old) =>
      !VmapMarker.sameRooms(old.markers, markers);
}
