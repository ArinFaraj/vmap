import 'dart:js_interop';
import 'dart:ui';
import 'dart:ui_web' as ui_web;

import 'package:web/web.dart' as web;

/// Safari's `GestureEvent`, which it sends for a trackpad pinch in place of
/// the wheel events with the control key other browsers send.
extension type _GestureEvent._(JSObject _) implements web.UIEvent {
  external double get clientX;
  external double get clientY;
  external double get scale;
  external double get rotation;
}

/// Listens on view [viewId] for a trackpad pinch as Safari reports it,
/// taking it from the page's own zoom when [owns] claims where it began.
/// [update] gets the scale and the clockwise turn in degrees since then.
/// Returns what stops listening.
VoidCallback listenBrowserPinch({
  required int viewId,
  required bool Function(Offset viewPoint) owns,
  required void Function(Offset viewPoint) start,
  required void Function(Offset viewPoint, double scale, double degrees) update,
  required VoidCallback end,
}) {
  final host = ui_web.views.getHostElement(viewId) as web.Element?;
  if (host == null) return () {};
  var mine = false;
  Offset at(_GestureEvent e) {
    final box = host.getBoundingClientRect();
    return Offset(e.clientX - box.left, e.clientY - box.top);
  }

  void onStart(web.Event event) {
    final e = event as _GestureEvent;
    final point = at(e);
    mine = owns(point);
    if (!mine) return;
    e.preventDefault();
    start(point);
  }

  void onChange(web.Event event) {
    if (!mine) return;
    final e = event as _GestureEvent;
    e.preventDefault();
    update(at(e), e.scale, e.rotation);
  }

  void onEnd(web.Event event) {
    if (!mine) return;
    mine = false;
    event.preventDefault();
    end();
  }

  final options = web.AddEventListenerOptions(passive: false);
  final listeners = {
    'gesturestart': onStart.toJS,
    'gesturechange': onChange.toJS,
    'gestureend': onEnd.toJS,
  };
  for (final MapEntry(:key, :value) in listeners.entries) {
    host.addEventListener(key, value, options);
  }
  return () {
    for (final MapEntry(:key, :value) in listeners.entries) {
      host.removeEventListener(key, value);
    }
  };
}
