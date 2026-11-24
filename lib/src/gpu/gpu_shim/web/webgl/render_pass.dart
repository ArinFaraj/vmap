part of '_webgl.dart';

/// A render pass. Its bind, state and draw calls are recorded and made on
/// the GL context when the pass ends, as flutter_gpu encodes a pass when
/// its command buffer is submitted. They wait so that every uniform block
/// written while the pass was recorded goes up in one upload before its
/// first draw: ANGLE on Metal stalls on an upload into a buffer an earlier
/// draw reads, measured at 10 to 75 microseconds each.
final class WebGlRenderPass extends RenderPass {
  WebGlRenderPass._(this._gpuContext, RenderTarget target)
    : _executor = _PassExecutor(_gpuContext, target);

  final WebGlContext _gpuContext;
  final _PassExecutor _executor;

  /// Makes this the pass being recorded, the one that was issued first,
  /// and gives the record its calls go in.
  _PassRecord _open() {
    final context = _gpuContext;
    if (!identical(context._openPass, this)) {
      context._flushPass();
      context._openPass = this;
    }
    return context._record;
  }

  void _issue() => _executor.issue(_gpuContext._record);

  /// Called by CommandBuffer when the pass ends: a new pass begins, or the
  /// buffer is submitted.
  void _finish() {
    if (identical(_gpuContext._openPass, this)) _gpuContext._flushPass();
    _executor.finish();
  }

  @override
  void bindPipeline(RenderPipeline pipeline) =>
      _open().pipeline(pipeline.webGl.._ensureLinked());

  @override
  void bindVertexBuffer(BufferView bufferView, {int slot = 0}) =>
      _open().vertexBuffer(bufferView, slot);

  @override
  void bindIndexBuffer(BufferView bufferView, IndexType indexType) =>
      _open().indexBuffer(bufferView, indexType);

  @override
  void bindUniform(UniformSlot slot, BufferView bufferView) =>
      _open().uniform(slot, bufferView);

  @override
  void bindTexture(
    UniformSlot slot,
    Texture texture, {
    SamplerOptions? sampler,
  }) {
    _gpuContext._presenter.spill(_gpuContext, only: texture);
    _open().texture(slot, texture, sampler);
  }

  @override
  void clearBindings() => _open().clearBindings();

  @override
  void setColorBlendEnable(bool enable, {int colorAttachmentIndex = 0}) =>
      _open().blendEnable(enable);

  @override
  void setColorBlendEquation(
    ColorBlendEquation equation, {
    int colorAttachmentIndex = 0,
  }) => _open().blendEquation(equation);

  @override
  void setDepthWriteEnable(bool enable) => _open().depthWrite(enable);

  @override
  void setDepthCompareOperation(CompareFunction compareFunction) =>
      _open().depthCompare(compareFunction);

  @override
  void setStencilReference(int referenceValue) =>
      _open().stencilReference(referenceValue);

  @override
  void setStencilConfig(
    StencilConfig configuration, {
    StencilFace targetFace = StencilFace.both,
  }) => _open().stencilConfig(configuration, targetFace);

  @override
  void setCullMode(CullMode cullMode) => _open().cullMode(cullMode);

  /// Does nothing: WebGL2 has no glPolygonMode.
  @override
  void setPolygonMode(PolygonMode polygonMode) {}

  @override
  void setPrimitiveType(PrimitiveType primitiveType) =>
      _open().primitiveType(primitiveType);

  @override
  void setWindingOrder(WindingOrder windingOrder) =>
      _open().windingOrder(windingOrder);

  @override
  void setScissor(Scissor scissor) => _open().scissor(scissor);

  @override
  void setViewport(Viewport viewport) => _open().viewport(viewport);

  @override
  void draw(int vertexCount, {int instanceCount = 1}) =>
      _open().draw(vertexCount, instanceCount);

  @override
  void drawIndexed(int indexCount, {int instanceCount = 1}) =>
      _open().drawIndexed(indexCount, instanceCount);
}
