import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import '../engine.dart';
import '../render/frame_planes.dart';
import 'map_painter.dart';
import 'map_showing.dart';
import 'page_plane.dart';
import 'vmap_controller.dart';

/// The map in a browser: each frame's canvas pictures painted in turn
/// with the GPU's images in page elements between them, which the browser
/// lays over each other on the GPU, with no trip through Flutter's
/// renderer. Safari copies an image into Flutter's own WebGL context on
/// the CPU, about 50 ms for a frame the size of a window.
class PlanesView extends StatefulWidget {
  const PlanesView({
    required this.engine,
    required this.controller,
    required this.devicePixelRatio,
    required this.showing,
    required this.painted,
    super.key,
  });

  final VmapEngine engine;
  final VmapController controller;
  final double devicePixelRatio;

  /// How the page and Flutter's canvas show a frame together.
  final MapShowing showing;

  /// Told after each frame the map drew.
  final VoidCallback painted;

  @override
  State<PlanesView> createState() => _PlanesViewState();
}

class _PlanesViewState extends State<PlanesView> {
  final Map<int, PagePlane> _pages = {};
  late final _planes = FramePlanes()
    ..onHand = (index, plane) => showPlane(
      _pages,
      index,
      plane,
      held: widget.showing == MapShowing.pageWithCanvas,
    );

  /// GPU planes the last frame had, which the stack has a place for. A
  /// frame has one nearly always, so its place is there from the start.
  int _places = 1;

  /// Whether a frame goes into Flutter's own picture for now: where that
  /// picture reaches the page late, a map moved here from the canvas keeps
  /// showing there until its page elements exist, with no empty frame in
  /// between.
  bool get _onCanvasMeanwhile =>
      widget.showing.canvasTrails && _pages.length < _places;

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
            MapPainter(
              widget.engine,
              widget.controller,
              widget.devicePixelRatio,
              widget.painted,
            ),
            _planes,
            _drawn,
            () => _onCanvasMeanwhile,
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
  _FramePainter(this.whole, this.planes, this.drawn, this.onCanvas)
    : super(repaint: Listenable.merge([whole.engine, whole.controller]));

  /// Paints the frame when it goes on Flutter's canvas, as [onCanvas] says.
  final MapPainter whole;
  final FramePlanes planes;
  final VoidCallback drawn;
  final bool Function() onCanvas;

  @override
  void paint(Canvas canvas, Size size) {
    if (onCanvas()) return whole.paint(canvas, size);
    whole.engine.paintPlanes(
      planes,
      size,
      whole.controller.camera,
      devicePixelRatio: whole.devicePixelRatio,
      ahead: whole.controller.destination,
    );
    canvas
      ..clipRect(Offset.zero & size)
      ..drawPicture(planes.pictures.first);
    drawn();
  }

  @override
  bool shouldRepaint(_FramePainter old) => whole.shouldRepaint(old.whole);
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
