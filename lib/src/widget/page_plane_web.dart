import 'dart:js_interop';
import 'dart:ui_web' as ui_web;

import 'package:flutter/widgets.dart';
import 'package:web/web.dart' as web;

import '../gpu/gpu_shim/shared/page_image.dart';
import '../render/frame_planes.dart';
import 'map_showing.dart';

/// Whether Flutter draws a frame on the page at once, as the map's page
/// elements are shown: in Safari and Firefox, where copying an image into
/// Flutter's own WebGL context also goes through the CPU. Elsewhere
/// Flutter shows its frame a frame or more later, from another thread.
bool get _canvasAtOnce => switch (ui_web.browser.browserEngine) {
  ui_web.BrowserEngine.webkit || ui_web.BrowserEngine.firefox => true,
  _ => false,
};

/// Where the map's frames are shown. Page elements cost no trip through
/// Flutter's renderer, so GPU images go there wherever the canvas keeps
/// up with them. Where Flutter's own frame trails the page, a map with
/// anything that moves on the canvas ([mapOnCanvas]) stays on the canvas
/// whole, since what the canvas paints would lag the rest by a frame, and
/// one under widgets ([widgetsOverMap]) has its images wait for the canvas.
MapShowing mapShowing({
  required bool mapOnCanvas,
  required bool widgetsOverMap,
}) {
  if (_canvasAtOnce) return MapShowing.page;
  if (mapOnCanvas) return MapShowing.canvas;
  return widgetsOverMap ? MapShowing.pageWithCanvas : MapShowing.pageAhead;
}

/// A page element showing GPU images laid over each other: a canvas for
/// each, which takes its image without a copy.
abstract interface class PagePlane {}

class _Plane implements PagePlane {
  _Plane(this.element);

  final web.HTMLElement element;
  final List<(web.HTMLCanvasElement, web.ImageBitmapRenderingContext)>
  _canvases = [];

  /// Planes waiting for the frame after the one they were handed in, each
  /// with the time it was handed.
  final List<(GpuPlane, double)> _held = [];
  bool _asked = false;

  /// The backend's own canvas, while this plane shows a frame left in it.
  web.HTMLCanvasElement? _own;

  /// Shows [plane] in the browser's next frame, when Flutter's own frame
  /// drawn with it has reached the page too, so widgets laid over the map
  /// stay on it.
  void showWithCanvas(GpuPlane plane) {
    _held.add((plane, web.window.performance.now()));
    _ask();
  }

  void _ask() {
    if (_asked) return;
    _asked = true;
    web.window.requestAnimationFrame(
      ((JSNumber time) {
        _asked = false;
        _showDue(time.toDartDouble);
      }).toJS,
    );
  }

  /// Shows the newest plane handed before the frame that began at [time];
  /// one handed in this frame, by a callback that ran first, waits.
  void _showDue(double time) {
    GpuPlane? due;
    while (_held.isNotEmpty && _held.first.$2 < time) {
      if (due != null) _letGo(due);
      due = _held.removeAt(0).$1;
    }
    if (due != null) show(due);
    if (_held.isNotEmpty) _ask();
  }

  void show(GpuPlane plane) {
    final images = plane.images;
    while (_canvases.length < images.length) {
      final canvas = web.HTMLCanvasElement();
      _fill(canvas);
      element.append(canvas);
      _canvases.add((
        canvas,
        canvas.getContext('bitmaprenderer')! as web.ImageBitmapRenderingContext,
      ));
    }
    web.HTMLCanvasElement? shown;
    for (var i = 0; i < _canvases.length; i++) {
      final (canvas, context) = _canvases[i];
      canvas.style.display = 'none';
      if (i >= images.length) continue;
      final (image, opacity) = images[i];
      final web.HTMLCanvasElement showing;
      switch (image) {
        case PageBitmap(:final source):
          context.transferFromImageBitmap(source as web.ImageBitmap);
          showing = canvas;
        case PageCanvas(:final source):
          showing = shown = source as web.HTMLCanvasElement;
          if (!element.isSameNode(showing.parentNode)) {
            _fill(showing);
            element.append(showing);
          }
      }
      showing.style
        ..display = 'block'
        ..opacity = '$opacity';
    }
    final own = _own;
    if (own != null && shown == null && element.isSameNode(own.parentNode)) {
      own.style.display = 'none';
    }
    _own = shown;
    final warp = plane.warp;
    element.style.transform = warp == null ? '' : 'matrix3d(${warp.join(',')})';
    final clip = plane.clip;
    element.style.clipPath = clip == null
        ? ''
        : 'polygon(${[for (final p in clip) '${p.dx}px ${p.dy}px'].join(',')})';
  }

  static void _fill(web.HTMLCanvasElement canvas) => canvas.style
    ..position = 'absolute'
    ..left = '0'
    ..top = '0'
    ..width = '100%'
    ..height = '100%'
    ..pointerEvents = 'none';
}

void _letGo(GpuPlane plane) {
  for (final (image, _) in plane.images) {
    if (image case PageBitmap(:final source)) {
      (source as web.ImageBitmap).close();
    }
  }
}

/// Shows [plane] in its element in [pages], or lets go of its images
/// when it has none yet. With [held] it waits for the browser's next
/// frame, which Flutter's own frame drawn with it reaches too.
void showPlane(
  Map<int, PagePlane> pages,
  int index,
  GpuPlane plane, {
  required bool held,
}) {
  final page = pages[index] as _Plane?;
  if (page == null) return _letGo(plane);
  held ? page.showWithCanvas(plane) : page.show(plane);
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
