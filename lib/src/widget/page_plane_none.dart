import 'package:flutter/widgets.dart';

import '../render/frame_planes.dart';

/// A page element showing GPU images; there is none outside a browser.
abstract interface class PagePlane {}

/// A page element for GPU images, handed to [onCreated] once it exists.
Widget pagePlaneView(void Function(PagePlane plane) onCreated) =>
    const SizedBox.shrink();

/// Shows [plane] in its element in [pages].
void showPlane(Map<int, PagePlane> pages, int index, GpuPlane plane) {}
