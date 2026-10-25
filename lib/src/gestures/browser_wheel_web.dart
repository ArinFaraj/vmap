import 'dart:js_interop';
import 'dart:math' as math;
import 'dart:ui';
import 'dart:ui_web' as ui_web;

import 'package:web/web.dart' as web;

import 'wheel_zoom.dart';

/// Safari's `GestureEvent`, which it sends for a trackpad pinch where other
/// browsers send a wheel event with the control key held.
extension type _GestureEvent._(JSObject _) implements web.UIEvent {
  external double get clientX;
  external double get clientY;
  external double get scale;
}

/// Listens on view [viewId] for wheel events over the map, as MapLibre GL
/// JS takes them from the page: raw, before Flutter's guess at whether a
/// mouse or a trackpad sent them, and kept from the page and from Flutter
/// when [owns] claims the point. A pinch in Safari becomes the wheel event
/// a pinch is in other browsers: its change in scale as `-100 ln` of it,
/// with the control key held. Returns what stops listening.
VoidCallback listenBrowserWheel({
  required int viewId,
  required bool Function(Offset viewPoint) owns,
  required void Function(WheelInput input) onWheel,
}) {
  final host = ui_web.views.getHostElement(viewId) as web.Element?;
  if (host == null) return () {};
  Offset at(double x, double y) {
    final box = host.getBoundingClientRect();
    return Offset(x - box.left, y - box.top);
  }

  void wheel(web.Event event) {
    final e = event as web.WheelEvent;
    final point = at(e.clientX.toDouble(), e.clientY.toDouble());
    if (!owns(point)) return;
    e
      ..preventDefault()
      ..stopPropagation();
    onWheel((
      deltaY: e.deltaY.toDouble(),
      lines: e.deltaMode == web.WheelEvent.DOM_DELTA_LINE,
      shift: e.shiftKey,
      at: point,
    ));
  }

  var pinching = false;
  var lastScale = 1.0;
  void gestureStart(web.Event event) {
    final e = event as _GestureEvent;
    pinching = owns(at(e.clientX, e.clientY));
    if (!pinching) return;
    e.preventDefault();
    lastScale = 1;
  }

  void gestureChange(web.Event event) {
    if (!pinching) return;
    final e = event as _GestureEvent;
    e.preventDefault();
    if (e.scale <= 0 || lastScale <= 0) return;
    final deltaY = -100 * math.log(e.scale / lastScale);
    lastScale = e.scale;
    if (deltaY == 0) return;
    onWheel((
      deltaY: deltaY,
      lines: false,
      shift: false,
      at: at(e.clientX, e.clientY),
    ));
  }

  void gestureEnd(web.Event event) {
    if (!pinching) return;
    pinching = false;
    event.preventDefault();
  }

  final options = web.AddEventListenerOptions(passive: false, capture: true);
  final listeners = {
    'wheel': wheel.toJS,
    'gesturestart': gestureStart.toJS,
    'gesturechange': gestureChange.toJS,
    'gestureend': gestureEnd.toJS,
  };
  for (final MapEntry(:key, :value) in listeners.entries) {
    host.addEventListener(key, value, options);
  }
  return () {
    for (final MapEntry(:key, :value) in listeners.entries) {
      host.removeEventListener(
        key,
        value,
        web.EventListenerOptions(capture: true),
      );
    }
  };
}
