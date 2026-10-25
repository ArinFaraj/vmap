import 'dart:ui';

import 'wheel_zoom.dart';

/// Listens for the browser's own wheel events over the map; there are none
/// outside a browser. Returns what stops listening.
VoidCallback listenBrowserWheel({
  required int viewId,
  required bool Function(Offset viewPoint) owns,
  required void Function(WheelInput input) onWheel,
}) => () {};
