import 'package:flutter/widgets.dart';

import '../render/frame_planes.dart';
import 'map_showing.dart';

/// Where the map's frames are shown: there is no page outside a browser.
MapShowing mapShowing({
  required bool mapOnCanvas,
  required bool widgetsOverMap,
}) => MapShowing.canvas;

/// A page element showing GPU images; there is none outside a browser.
abstract interface class PagePlane {}

/// A page element for GPU images, handed to [onCreated] once it exists.
Widget pagePlaneView(void Function(PagePlane plane) onCreated) =>
    const SizedBox.shrink();

/// Shows [plane] in its element in [pages].
void showPlane(
  Map<int, PagePlane> pages,
  int index,
  GpuPlane plane, {
  required bool held,
}) {}
