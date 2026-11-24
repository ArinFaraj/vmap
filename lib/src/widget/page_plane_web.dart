import 'dart:js_interop';
import 'dart:typed_data';
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

  /// What each place showed last, for an image kept there.
  final List<web.HTMLCanvasElement?> _last = [];

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
      final next = _held.removeAt(0).$1;
      due = due == null ? next : _skip(due, next);
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
      final image = images[i];
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
        case PageKept():
          final last = i < _last.length ? _last[i] : null;
          if (last == null) continue;
          showing = last;
          if (!identical(last, canvas)) shown = last;
      }
      while (_last.length <= i) {
        _last.add(null);
      }
      _last[i] = showing;
      showing.style.display = 'block';
    }
    final own = _own;
    if (own != null && shown == null && element.isSameNode(own.parentNode)) {
      own.style.display = 'none';
    }
    _own = shown;
    final warp = plane.warp;
    element.style.transform = warp == null ? '' : _css(warp);
    final clip = plane.clip;
    element.style.clipPath = clip == null
        ? ''
        : 'polygon(${[for (final p in clip) '${p.dx}px ${p.dy}px'].join(',')})';
  }

  /// [warp] as a CSS transform. Firefox drops a WebGL canvas from the
  /// frame in which a transform is set on it, so there a frame shown again
  /// stays where it was drawn.
  static String _css(Float64List warp) =>
      ui_web.browser.browserEngine == ui_web.BrowserEngine.firefox
      ? ''
      : 'matrix3d(${warp.join(',')})';

  static void _fill(web.HTMLCanvasElement canvas) => canvas.style
    ..position = 'absolute'
    ..left = '0'
    ..top = '0'
    ..width = '100%'
    ..height = '100%'
    ..pointerEvents = 'none';
}

/// [newer], shown in place of [older], which is not shown: an image
/// [newer] keeps from the place's last is [older]'s, and every other image
/// of [older] is let go.
GpuPlane _skip(GpuPlane older, GpuPlane newer) {
  final images = [
    for (final (i, image) in newer.images.indexed)
      image is PageKept && i < older.images.length ? older.images[i] : image,
  ];
  for (final (i, image) in older.images.indexed) {
    if (!identical(image, images.elementAtOrNull(i))) {
      _letGo(GpuPlane([image]));
    }
  }
  return GpuPlane(images, warp: newer.warp, clip: newer.clip);
}

void _letGo(GpuPlane plane) {
  for (final image in plane.images) {
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
