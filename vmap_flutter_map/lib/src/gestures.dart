import 'dart:math' as math;

import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:vmap/gestures.dart';

/// vmap's gestures for a [FlutterMap] whose own are switched off
/// (`InteractiveFlag.none`): the same touches, mouse, trackpad and keys as
/// a `Vmap` takes, with the same glide, switched off one by one with
/// [options]. flutter_map does not tilt, so [VmapGestureOptions.pitch] and
/// the gestures that only tilt have no effect.
///
/// It reads raw pointers rather than joining the gesture arena, so the map
/// follows the finger from the first frame and taps on markers keep working.
class VmapGestures extends StatefulWidget {
  const VmapGestures({
    required this.controller,
    required this.child,
    this.minZoom = 3,
    this.maxZoom = 19,
    this.options = const VmapGestureOptions(),
    super.key,
  });

  final MapController controller;
  final Widget child;
  final double minZoom;
  final double maxZoom;

  /// Which gestures move the map.
  final VmapGestureOptions options;

  @override
  State<VmapGestures> createState() => _VmapGesturesState();
}

class _VmapGesturesState extends State<VmapGestures>
    with SingleTickerProviderStateMixin
    implements MapGestureTarget {
  late final Ticker _ticker = createTicker(_tick);
  late final MapGestureRecognizer _gestures = MapGestureRecognizer(
    this,
    options: widget.options,
  );

  MapCamera? _start;
  MapGestureStep Function(double t)? _motion;
  Duration _duration = Duration.zero;

  MapCamera get _camera => widget.controller.camera;

  @override
  void didUpdateWidget(VmapGestures old) {
    super.didUpdateWidget(old);
    _gestures.options = widget.options;
  }

  @override
  void dispose() {
    _ticker.dispose();
    _gestures.dispose();
    super.dispose();
  }

  @override
  Size get size => _camera.nonRotatedSize;

  @override
  Offset get centre => size.center(Offset.zero);

  @override
  double get zoom => _camera.zoom;

  @override
  double get minZoom => widget.minZoom;

  @override
  double get maxZoom => widget.maxZoom;

  @override
  bool get isMoving => _motion != null;

  @override
  void stop() {
    _motion = null;
    _start = null;
    if (_ticker.isActive) _ticker.stop();
  }

  @override
  void jump(MapGestureStep step) => _moveTo(_camera, step);

  @override
  void ease(
    MapGestureStep step,
    Duration duration, {
    Curve curve = Curves.ease,
  }) => _run(duration, (t) => step.scaled(curve.transform(t)));

  @override
  void glide(MapGlide glide) => _run(glide.duration, glide.at);

  void _run(Duration duration, MapGestureStep Function(double t) at) {
    stop();
    _start = _camera;
    _motion = at;
    _duration = duration;
    _ticker.start();
  }

  void _tick(Duration elapsed) {
    final motion = _motion, start = _start;
    if (motion == null || start == null) return;
    final t = _duration == Duration.zero
        ? 1.0
        : (elapsed.inMicroseconds / _duration.inMicroseconds).clamp(0.0, 1.0);
    _moveTo(start, motion(t));
    if (t >= 1) stop();
  }

  static Offset _turned(Offset o, double angle) {
    if (angle == 0) return o;
    final c = math.cos(angle);
    final s = math.sin(angle);
    return Offset(o.dx * c - o.dy * s, o.dx * s + o.dy * c);
  }

  /// Moves the map to [from] changed by [step]. flutter_map turns the
  /// other way from a bearing: a turn of the bearing by a degree is a
  /// rotation by minus one.
  void _moveTo(MapCamera from, MapGestureStep step) {
    final middle = from.nonRotatedSize.center(Offset.zero);
    final z0 = from.zoom;
    final r0 = from.rotationRad;
    var world = from.projectAtZoom(from.center, z0);
    if (step.from case final a?) world += _turned(a - step.to!, -r0);
    final z1 = (z0 + step.zoomBy).clamp(widget.minZoom, widget.maxZoom);
    final r1 = r0 - step.turn * math.pi / 180;
    final f = (step.anchor ?? middle) - middle;
    final scale = math.pow(2.0, z1 - z0).toDouble();
    final worldSize = 256.0 * math.pow(2.0, z1);
    final centre = (world + _turned(f, -r0)) * scale - _turned(f, -r1);
    final to = from.unprojectAtZoom(
      Offset(centre.dx, centre.dy.clamp(0.0, worldSize)),
      z1,
    );
    if (r1 == _camera.rotationRad) {
      widget.controller.move(to, z1);
    } else {
      widget.controller.moveAndRotate(to, z1, r1 * 180 / math.pi);
    }
  }

  @override
  Widget build(BuildContext context) => MapGestureDetector(
    recognizer: _gestures,
    behavior: HitTestBehavior.translucent,
    child: widget.child,
  );
}
