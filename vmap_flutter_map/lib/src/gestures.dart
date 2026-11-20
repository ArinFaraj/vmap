import 'dart:math' as math;

import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:vmap/gestures.dart';

/// vmap's gestures for a [FlutterMap] whose own are switched off
/// (`InteractiveFlag.none`): the same touches, mouse, trackpad and keys as
/// a `Vmap` takes, with the same glide, switched off one by one with
/// [options]. They keep to the zooms the map's `MapOptions` allow.
/// flutter_map does not tilt, so [VmapGestureOptions.pitch] and the
/// gestures that only tilt have no effect.
///
/// It reads raw pointers rather than joining the gesture arena, so the map
/// follows the finger from the first frame and taps on markers keep working.
class VmapGestures extends StatefulWidget {
  const VmapGestures({
    required this.controller,
    required this.child,
    this.options = const VmapGestureOptions(),
    super.key,
  });

  final MapController controller;
  final Widget child;

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

  /// The animation running: the camera it began at, where it has the
  /// camera at each fraction of its time, and how long it takes.
  ({MapCamera from, MapGestureStep Function(double t) at, Duration duration})?
  _motion;

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
  double get minZoom => _camera.minZoom ?? double.negativeInfinity;

  @override
  double get maxZoom => _camera.maxZoom ?? double.infinity;

  @override
  bool get isMoving => _motion != null;

  @override
  void stop() {
    _motion = null;
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
    _motion = (from: _camera, at: at, duration: duration);
    _ticker.start();
  }

  void _tick(Duration elapsed) {
    final motion = _motion;
    if (motion == null) return;
    final t = motion.duration == Duration.zero
        ? 1.0
        : (elapsed.inMicroseconds / motion.duration.inMicroseconds).clamp(
            0.0,
            1.0,
          );
    _moveTo(motion.from, motion.at(t));
    if (t >= 1) stop();
  }

  static Offset _turned(Offset o, double angle) {
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
    if ((step.from, step.to) case (final a?, final b?)) {
      world += _turned(a - b, -r0);
    }
    final z1 = from.clampZoom(z0 + step.zoomBy);
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
