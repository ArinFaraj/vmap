import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import '../engine.dart';
import '../render/frame_planes.dart';
import 'page_plane.dart';
import 'vmap_controller.dart';

/// The map on the web: each frame's canvas pictures painted in turn with
/// the GPU's images in page elements between them, which the browser lays
/// over each other on the GPU. Safari copies an image into Flutter's own
/// WebGL context on the CPU, about 50 ms for a frame the size of a window.
class PlanesView extends StatefulWidget {
  const PlanesView({
    required this.engine,
    required this.controller,
    required this.devicePixelRatio,
    required this.painted,
    super.key,
  });

  final VmapEngine engine;
  final VmapController controller;
  final double devicePixelRatio;

  /// Told after each frame the map drew.
  final VoidCallback painted;

  @override
  State<PlanesView> createState() => _PlanesViewState();
}

class _PlanesViewState extends State<PlanesView> {
  final Map<int, PagePlane> _pages = {};
  late final _planes = FramePlanes()
    ..onHand = (index, plane) => showPlane(_pages, index, plane);

  /// GPU planes the last frame had, which the stack has a place for.
  int _places = 0;

  void _drawn() {
    final gpu = _planes.gpu;
    if (gpu.length != _places) {
      final places = gpu.length;
      SchedulerBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        setState(() => _places = places);
        _pages.removeWhere((i, _) => i >= places);
      });
    }
    widget.painted();
  }

  @override
  Widget build(BuildContext context) => RepaintBoundary(
    child: Stack(
      fit: StackFit.expand,
      children: [
        CustomPaint(
          painter: _FramePainter(
            widget.engine,
            widget.controller,
            widget.devicePixelRatio,
            _planes,
            _drawn,
          ),
        ),
        for (var i = 0; i < _places; i++) ...[
          IgnorePointer(
            key: ValueKey(('gpu', i)),
            child: pagePlaneView((page) => _pages[i] = page),
          ),
          CustomPaint(
            key: ValueKey(('picture', i)),
            painter: _PicturePainter(_planes, i + 1),
          ),
        ],
      ],
    ),
  );
}

/// Draws the frame into the planes and paints the first picture.
class _FramePainter extends CustomPainter {
  _FramePainter(
    this.engine,
    this.controller,
    this.devicePixelRatio,
    this.planes,
    this.drawn,
  ) : super(repaint: Listenable.merge([engine, controller]));

  final VmapEngine engine;
  final VmapController controller;
  final double devicePixelRatio;
  final FramePlanes planes;
  final VoidCallback drawn;

  @override
  void paint(Canvas canvas, Size size) {
    engine.paintPlanes(
      planes,
      size,
      controller.camera,
      devicePixelRatio: devicePixelRatio,
      ahead: controller.destination,
    );
    canvas
      ..clipRect(Offset.zero & size)
      ..drawPicture(planes.pictures.first);
    drawn();
  }

  @override
  bool shouldRepaint(_FramePainter old) =>
      old.engine != engine ||
      old.controller != controller ||
      old.devicePixelRatio != devicePixelRatio;
}

/// Paints the frame's picture [index], over the GPU's images before it.
class _PicturePainter extends CustomPainter {
  _PicturePainter(this.planes, this.index);

  final FramePlanes planes;
  final int index;

  @override
  void paint(Canvas canvas, Size size) {
    if (index >= planes.pictures.length) return;
    canvas
      ..clipRect(Offset.zero & size)
      ..drawPicture(planes.pictures[index]);
  }

  @override
  bool shouldRepaint(_PicturePainter old) => true;
}
