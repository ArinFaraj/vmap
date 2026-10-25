import 'package:flutter/widgets.dart';
import 'package:web/web.dart' as web;

import '../render/frame_planes.dart';

/// A page element showing GPU images laid over each other: a canvas for
/// each, which takes its image without a copy.
abstract interface class PagePlane {}

class _Plane implements PagePlane {
  _Plane(this.element);

  final web.HTMLElement element;
  final List<(web.HTMLCanvasElement, web.ImageBitmapRenderingContext)>
  _canvases = [];

  void show(GpuPlane plane) {
    final images = plane.images;
    while (_canvases.length < images.length) {
      final canvas = web.HTMLCanvasElement();
      canvas.style
        ..position = 'absolute'
        ..left = '0'
        ..top = '0'
        ..width = '100%'
        ..height = '100%'
        ..pointerEvents = 'none';
      element.append(canvas);
      _canvases.add((
        canvas,
        canvas.getContext('bitmaprenderer')! as web.ImageBitmapRenderingContext,
      ));
    }
    for (var i = 0; i < _canvases.length; i++) {
      final (canvas, context) = _canvases[i];
      if (i >= images.length) {
        canvas.style.display = 'none';
        continue;
      }
      final (bitmap, opacity) = images[i];
      canvas.style
        ..display = 'block'
        ..opacity = '$opacity';
      context.transferFromImageBitmap(bitmap as web.ImageBitmap);
    }
    final warp = plane.warp;
    element.style.transform = warp == null ? '' : 'matrix3d(${warp.join(',')})';
    final clip = plane.clip;
    element.style.clipPath = clip == null
        ? ''
        : 'polygon(${[for (final p in clip) '${p.dx}px ${p.dy}px'].join(',')})';
  }
}

/// Shows [plane] in its element in [pages], or lets go of its images
/// when it has none yet.
void showPlane(Map<int, PagePlane> pages, int index, GpuPlane plane) {
  final page = pages[index] as _Plane?;
  if (page != null) return page.show(plane);
  for (final (bitmap, _) in plane.images) {
    (bitmap as web.ImageBitmap).close();
  }
}

/// A page element for GPU images, handed to [onCreated] once it exists.
Widget pagePlaneView(void Function(PagePlane plane) onCreated) =>
    HtmlElementView.fromTagName(
      tagName: 'div',
      onElementCreated: (Object element) {
        final div = element as web.HTMLElement;
        div.style
          ..position = 'relative'
          ..width = '100%'
          ..height = '100%'
          ..pointerEvents = 'none'
          ..transformOrigin = '0 0';
        onCreated(_Plane(div));
      },
    );
