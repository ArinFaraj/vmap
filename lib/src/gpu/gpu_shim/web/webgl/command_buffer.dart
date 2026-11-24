part of '_webgl.dart';

/// CommandBuffer is a thin convenience wrapper. A pass records its calls
/// and issues them to the GL context when it ends: when the next pass
/// begins, or at `submit`. Completion is reported through a fence.
final class WebGlCommandBuffer extends CommandBuffer {
  WebGlCommandBuffer._(this._gpuContext);

  final WebGlContext _gpuContext;
  WebGlRenderPass? _activePass;

  @override
  RenderPass createRenderPass(RenderTarget renderTarget) {
    // Starting a new pass ends the previous one (triggers its MSAA resolve),
    // so a subsequent pass that samples the resolve texture sees finished
    // contents.
    _activePass?._finish();
    final pass = WebGlRenderPass._(_gpuContext, renderTarget);
    _activePass = pass;
    return pass;
  }

  @override
  void submit({CompletionCallback? completionCallback}) {
    // Finishing the last pass issues its calls and runs its MSAA resolve.
    _activePass?._finish();
    _activePass = null;
    if (completionCallback != null) {
      _gpuContext._enqueueCompletion(completionCallback);
    }
  }
}

/// A fence after the commands of one turn, and what waits on it.
final class _WebGlCompletion {
  _WebGlCompletion(this.sync, this.callbacks);

  final web.WebGLSync sync;
  final List<CompletionCallback> callbacks;
}
