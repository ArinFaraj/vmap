import 'package:flutter/widgets.dart';

import '../render/frame_planes.dart';

/// Whether the map shows its GPU images in page elements: never outside a
/// browser.
bool get pageShowsGpuImages => false;

/// A page element showing GPU images; there is none outside a browser.
abstract interface class PagePlane {}

/// A page element for GPU images, handed to [onCreated] once it exists.
Widget pagePlaneView(void Function(PagePlane plane) onCreated) =>
    const SizedBox.shrink();

/// Shows [plane] in its element in [pages].
void showPlane(Map<int, PagePlane> pages, int index, GpuPlane plane) {}
