import 'dart:ui';

/// Listens for a trackpad pinch the browser reports apart from pointers;
/// nothing does outside a browser. Returns what stops listening.
VoidCallback listenBrowserPinch({
  required int viewId,
  required bool Function(Offset viewPoint) owns,
  required void Function(Offset viewPoint) start,
  required void Function(Offset viewPoint, double scale, double degrees) update,
  required VoidCallback end,
}) => () {};
