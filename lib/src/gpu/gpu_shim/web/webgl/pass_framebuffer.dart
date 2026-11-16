part of '_webgl.dart';

/// Where a render pass draws, the canvas or its target's framebuffer: the
/// load actions that begin it, and the resolve and discards that end it.
final class _PassFramebuffer {
  _PassFramebuffer(this._gpuContext, this._target) {
    if (_target.colorAttachments.isEmpty) {
      throw Exception('RenderTarget must have at least one color attachment');
    }
    _gpuContext._presenter.claimFor(_gpuContext, _target);
  }

  final WebGlContext _gpuContext;
  final RenderTarget _target;

  /// Whether the pass draws in the canvas and not in its target's texture:
  /// it does for as long as the canvas holds its frame.
  bool get inCanvas =>
      _gpuContext._presenter.holds(_target.colorAttachments.first.texture);

  /// Whether the canvas has depth and stencil the pass's target has not.
  bool get depthless => inCanvas && _target.depthStencilAttachment == null;

  int get height => _target.colorAttachments.first.texture.height;

  web.WebGLFramebuffer? _fbo;
  bool _finished = false;

  /// Binds the canvas or the target's framebuffer, whichever the pass
  /// draws in now, with a viewport over all of it.
  void bind() {
    final gl = _gpuContext._gl;

    final colorAttachment = _target.colorAttachments.first;
    final color = colorAttachment.texture;
    final mipLevel = colorAttachment.mipLevel;
    final slice = colorAttachment.slice;
    final depth = _target.depthStencilAttachment?.texture;
    if (inCanvas) {
      _fbo = null;
      gl.bindFramebuffer(web.WebGL2RenderingContext.FRAMEBUFFER, null);
      gl.viewport(0, 0, color.width, color.height);
      return;
    }
    // A color slice selects a cube face; depth slices/mips are not supported.
    if (slice != 0 && color.textureType != TextureType.textureCube) {
      throw UnsupportedError(
        'Rendering to a 2D texture slice is not supported on the web backend',
      );
    }
    if ((_target.depthStencilAttachment?.slice ?? 0) != 0) {
      throw UnsupportedError(
        'Rendering to a depth texture slice is not supported on the web backend',
      );
    }
    if ((_target.depthStencilAttachment?.mipLevel ?? 0) != 0) {
      throw UnsupportedError(
        'Rendering to a depth mip level is not supported on the web backend',
      );
    }

    // Configured framebuffers (including the completeness check, a
    // synchronous GPU round trip) are cached per attachment combination.
    final fbo = _gpuContext._framebufferFor(color, mipLevel, slice, depth);
    _fbo = fbo;
    gl.bindFramebuffer(web.WebGL2RenderingContext.FRAMEBUFFER, fbo);
    if (color.sampleCount == 1) {
      _gpuContext._state.unbindTexture(color.webGl.glTexture);
    }
    if (depth != null && depth.sampleCount == 1) {
      _gpuContext._state.unbindTexture(depth.webGl.glTexture);
    }
    gl.viewport(
      0,
      0,
      (color.width >> mipLevel).clamp(1, color.width).toInt(),
      (color.height >> mipLevel).clamp(1, color.height).toInt(),
    );
  }

  /// Clears what the target's load actions clear.
  void load() {
    final gl = _gpuContext._gl;
    int clearMask = 0;

    final color = _target.colorAttachments.first;
    if (color.loadAction == LoadAction.clear) {
      gl.clearColor(
        color.clearValue.x,
        color.clearValue.y,
        color.clearValue.z,
        color.clearValue.w,
      );
      clearMask |= web.WebGL2RenderingContext.COLOR_BUFFER_BIT;
    }
    final depth = _target.depthStencilAttachment;
    if (depth != null) {
      if (depth.depthLoadAction == LoadAction.clear) {
        // glClear(DEPTH) respects depthMask, which a prior draw may have
        // turned off; force it on so the clear actually writes.
        _gpuContext._state.depthMask(true);
        gl.clearDepth(depth.depthClearValue);
        clearMask |= web.WebGL2RenderingContext.DEPTH_BUFFER_BIT;
      }
      if (depth.stencilLoadAction == LoadAction.clear) {
        // Like depthMask, glClear(STENCIL) respects the stencil write mask.
        _gpuContext._state.stencilMask(0xFF);
        gl.clearStencil(depth.stencilClearValue);
        clearMask |= web.WebGL2RenderingContext.STENCIL_BUFFER_BIT;
      }
    }
    if (clearMask != 0) {
      gl.clear(clearMask);
    }
  }

  /// Ends the pass: resolves MSAA color attachments into their resolve
  /// textures.
  void finish() {
    if (_finished) return;
    _finished = true;
    final gl = _gpuContext._gl;
    for (final att in _target.colorAttachments) {
      final resolve = att.resolveTexture;
      final needsResolve =
          att.texture.sampleCount > 1 &&
          resolve != null &&
          (att.storeAction == StoreAction.multisampleResolve ||
              att.storeAction == StoreAction.storeAndMultisampleResolve);
      if (needsResolve) {
        _resolveColor(gl, att.texture, resolve);
      }
    }
    _invalidateDiscarded(gl);
  }

  /// Tells the GL the attachments whose contents the pass's store actions
  /// discard, so a tiling GPU does not write them back to memory: on Apple
  /// GPUs a full-screen depth and stencil store costs as much as the color.
  void _invalidateDiscarded(web.WebGL2RenderingContext gl) {
    final fbo = _fbo;
    if (fbo == null) return;
    final color = _target.colorAttachments.first;
    final resolved =
        color.texture.sampleCount > 1 &&
        color.resolveTexture != null &&
        color.storeAction == StoreAction.multisampleResolve;
    final depth = _target.depthStencilAttachment;
    final discardDepth =
        depth != null && depth.depthStoreAction == StoreAction.dontCare;
    final discardStencil =
        depth != null && depth.stencilStoreAction == StoreAction.dontCare;
    final attachments = <int>[
      if (color.storeAction == StoreAction.dontCare || resolved)
        web.WebGL2RenderingContext.COLOR_ATTACHMENT0,
      if (discardDepth && discardStencil)
        web.WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT
      else if (discardDepth)
        web.WebGL2RenderingContext.DEPTH_ATTACHMENT
      else if (discardStencil)
        web.WebGL2RenderingContext.STENCIL_ATTACHMENT,
    ];
    if (attachments.isEmpty) return;
    _gpuContext._boundPass = null;
    gl.bindFramebuffer(web.WebGL2RenderingContext.FRAMEBUFFER, fbo);
    gl.invalidateFramebuffer(
      web.WebGL2RenderingContext.FRAMEBUFFER,
      [for (final a in attachments) a.toJS].toJS,
    );
  }

  void _resolveColor(
    web.WebGL2RenderingContext gl,
    Texture msaa,
    Texture resolve,
  ) {
    final resolveFbo = gl.createFramebuffer();
    _gpuContext._boundPass = null;
    gl.bindFramebuffer(web.WebGL2RenderingContext.READ_FRAMEBUFFER, _fbo);
    gl.bindFramebuffer(web.WebGL2RenderingContext.DRAW_FRAMEBUFFER, resolveFbo);
    gl.framebufferTexture2D(
      web.WebGL2RenderingContext.DRAW_FRAMEBUFFER,
      web.WebGL2RenderingContext.COLOR_ATTACHMENT0,
      web.WebGL2RenderingContext.TEXTURE_2D,
      resolve.webGl.glTexture,
      0,
    );
    gl.blitFramebuffer(
      0,
      0,
      msaa.width,
      msaa.height,
      0,
      0,
      resolve.width,
      resolve.height,
      web.WebGL2RenderingContext.COLOR_BUFFER_BIT,
      web.WebGL2RenderingContext.NEAREST,
    );
    gl.bindFramebuffer(web.WebGL2RenderingContext.FRAMEBUFFER, null);
    gl.deleteFramebuffer(resolveFbo);
  }
}
