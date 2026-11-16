part of '_webgl.dart';

/// An `OffscreenCanvas` or an `HTMLCanvasElement`: the members both have.
extension type _Canvas._(JSObject _) implements JSObject {
  external int width;
  external int height;
  external JSObject? getContext(String contextId, [JSAny? options]);
}

/// The canvas the context draws in, and how a frame in it reaches the page.
///
/// `transferToImageBitmap` hands Chromium's canvas over for nothing, so
/// there the canvas is off the page and a frame leaves it as a bitmap. The
/// same call costs Firefox 6 to 26 ms a frame and Safari 1.6, so there the
/// canvas is a page element, which shows a frame left in it with no copy.
sealed class _Presenter {
  factory _Presenter() =>
      ui_web.browser.browserEngine == ui_web.BrowserEngine.blink
      ? _OffscreenPresenter()
      : _ElementPresenter();

  _Presenter._();

  _Canvas get canvas;

  /// Whether frames are drawn in the canvas itself, which then has depth
  /// and stencil of its own.
  bool get framesInCanvas => false;

  /// Claims the canvas for the frame a pass into [target] draws, when it
  /// can be drawn there.
  void claimFor(WebGlContext context, RenderTarget target) {}

  /// Whether [texture]'s frame is in the canvas and not in the texture,
  /// which is where a pass into it draws.
  bool holds(Texture texture) => false;

  /// Copies the frame in the canvas into its own texture, for anything
  /// that reads it there or needs the canvas: with [only], that texture's
  /// frame and no other.
  void spill(WebGlContext context, {Texture? only}) {}

  /// [texture] as an `ImageBitmap`, taken from the canvas.
  web.ImageBitmap bitmapOf(WebGlContext context, Texture texture);

  /// A frame of [shower] in [texture] for the page to show, [whole] when
  /// it is all of the frame.
  PageImage frame(
    WebGlContext context,
    Texture texture,
    Object shower, {
    required bool whole,
  }) => PageBitmap(bitmapOf(context, texture));

  /// [shower] shows no more frames.
  void forget(Object shower) {}
}

/// A canvas off the page. A frame drawn whole from a clear and shown once
/// is drawn in the canvas itself, which a bitmap then takes the buffer of:
/// the copy from a texture into the canvas is saved.
final class _OffscreenPresenter extends _Presenter {
  _OffscreenPresenter() : super._();

  final web.OffscreenCanvas _offscreen = web.OffscreenCanvas(1, 1);

  /// The frame whose pixels are in the canvas and not in its own texture,
  /// and the depth texture the canvas's depth and stencil stand for.
  WebGlTexture? _held;
  Texture? _heldDepth;

  @override
  _Canvas get canvas => _Canvas._(_offscreen);

  @override
  bool get framesInCanvas => true;

  @override
  bool holds(Texture texture) => identical(_held, texture);

  /// A frame is drawn in the canvas, with the canvas's own depth and
  /// stencil, when it begins from a clear. A pass the canvas cannot take
  /// sends the frame it draws back to its texture.
  @override
  void claimFor(WebGlContext context, RenderTarget target) {
    final color = target.colorAttachments.first;
    final texture = color.texture.webGl;
    final depth = target.depthStencilAttachment?.texture;
    if (!_fits(target)) {
      spill(context, only: texture);
    } else if (identical(_held, texture)) {
      if (depth != null) _heldDepth = depth;
    } else if (color.loadAction == LoadAction.clear) {
      spill(context);
      _held = texture;
      _heldDepth = depth;
      if (_offscreen.width != texture.width) _offscreen.width = texture.width;
      if (_offscreen.height != texture.height) {
        _offscreen.height = texture.height;
      }
    }
  }

  /// Whether the canvas can stand for [target]: one frame shown once, with
  /// the canvas's format and depth.
  static bool _fits(RenderTarget target) {
    if (target.colorAttachments.length != 1) return false;
    final color = target.colorAttachments.first;
    final texture = color.texture.webGl;
    final depth = target.depthStencilAttachment?.texture;
    return texture._showsOnce &&
        texture.sampleCount == 1 &&
        texture.format == PixelFormat.r8g8b8a8UNormInt &&
        color.mipLevel == 0 &&
        color.slice == 0 &&
        (depth == null ||
            (depth.format == PixelFormat.d24UnormS8Uint &&
                depth.sampleCount == 1 &&
                depth.width == texture.width &&
                depth.height == texture.height));
  }

  /// The copy a frame drawn in its texture costs when it is shown.
  @override
  void spill(WebGlContext context, {Texture? only}) {
    final held = _held;
    if (held == null || (only != null && !identical(held, only))) return;
    // The pass being recorded may draw in the canvas, so it is issued
    // while the canvas still holds its frame.
    context._leavePass();
    final depth = _heldDepth;
    _held = null;
    _heldDepth = null;
    final gl = context._gl;
    final fbo = context._framebufferFor(held, 0, 0, depth);
    context._state.disable(web.WebGL2RenderingContext.SCISSOR_TEST);
    gl.bindFramebuffer(web.WebGL2RenderingContext.READ_FRAMEBUFFER, null);
    gl.bindFramebuffer(web.WebGL2RenderingContext.DRAW_FRAMEBUFFER, fbo);
    // The canvas holds the frame upright and its texture top-down. Depth
    // and stencil go in a blit of their own, which a canvas whose depth
    // format differs refuses without losing the colour.
    for (final mask in [
      web.WebGL2RenderingContext.COLOR_BUFFER_BIT,
      if (depth != null)
        web.WebGL2RenderingContext.DEPTH_BUFFER_BIT |
            web.WebGL2RenderingContext.STENCIL_BUFFER_BIT,
    ]) {
      gl.blitFramebuffer(
        0,
        0,
        held.width,
        held.height,
        0,
        held.height,
        held.width,
        0,
        mask,
        web.WebGL2RenderingContext.NEAREST,
      );
    }
    gl.bindFramebuffer(web.WebGL2RenderingContext.FRAMEBUFFER, null);
  }

  /// A frame the canvas holds leaves as the canvas's own buffer.
  @override
  web.ImageBitmap bitmapOf(WebGlContext context, Texture texture) {
    if (!holds(texture)) {
      context._blitTextureToCanvas(texture);
      return _offscreen.transferToImageBitmap();
    }
    context._leavePass();
    _held = null;
    _heldDepth = null;
    context._gl
      ..bindFramebuffer(web.WebGL2RenderingContext.FRAMEBUFFER, null)
      ..invalidateFramebuffer(
        web.WebGL2RenderingContext.FRAMEBUFFER,
        [
          web.WebGL2RenderingContext.DEPTH.toJS,
          web.WebGL2RenderingContext.STENCIL.toJS,
        ].toJS,
      );
    return _offscreen.transferToImageBitmap();
  }
}

/// A canvas the context draws in directly: one made by
/// `transferControlToOffscreen` shows its frame a browser frame late now
/// and then.
final class _ElementPresenter extends _Presenter {
  _ElementPresenter() : super._();

  final web.HTMLCanvasElement _element = web.HTMLCanvasElement();
  web.OffscreenCanvas? _copy;

  /// The maps showing frames in the page. The canvas is one element, which
  /// only a map alone there can show.
  final Set<Object> _showers = {};

  /// The frame the page is showing in the canvas, for as long as its map
  /// keeps it.
  WeakReference<Texture>? _left;

  @override
  _Canvas get canvas => _Canvas._(_element);

  /// A page element hands no bitmap over, so one is taken from a copy.
  @override
  web.ImageBitmap bitmapOf(WebGlContext context, Texture texture) {
    context._blitTextureToCanvas(texture);
    final copy = _copy ??= web.OffscreenCanvas(1, 1);
    if (copy.width != _element.width) copy.width = _element.width;
    if (copy.height != _element.height) copy.height = _element.height;
    final context2d =
        copy.getContext('2d')! as web.OffscreenCanvasRenderingContext2D;
    context2d.drawImage(_element, 0, 0);
    final bitmap = copy.transferToImageBitmap();
    final left = _left?.target;
    if (left == null || identical(left, texture)) {
      _left = null;
    } else {
      // The page is showing the canvas, which the bitmap's texture is in.
      context._blitTextureToCanvas(left);
    }
    return bitmap;
  }

  @override
  PageImage frame(
    WebGlContext context,
    Texture texture,
    Object shower, {
    required bool whole,
  }) {
    _showers.add(shower);
    if (!whole || _showers.length > 1) {
      return super.frame(context, texture, shower, whole: whole);
    }
    context._blitTextureToCanvas(texture);
    if (!identical(_left?.target, texture)) _left = WeakReference(texture);
    return PageCanvas(_element);
  }

  @override
  void forget(Object shower) => _showers.remove(shower);
}
