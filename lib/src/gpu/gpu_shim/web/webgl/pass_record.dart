part of '_webgl.dart';

/// The calls of the pass being recorded, in order, and their replay.
///
/// A call is three whole numbers in [_ops], its code and two arguments,
/// and the objects it names in [_refs]. A pass records thousands of calls
/// a frame, and an object for each would be an allocation a call.
final class _PassRecord {
  Int32List _ops = Int32List(3 * 2048);
  int _length = 0;
  final List<Object?> _refs = [];

  static const int _pipeline = 0,
      _vertexBuffer = 1,
      _indexBuffer = 2,
      _uniform = 3,
      _texture = 4,
      _clearBindings = 5,
      _blendEnable = 6,
      _blendEquation = 7,
      _depthWrite = 8,
      _depthCompare = 9,
      _stencilReference = 10,
      _stencilConfig = 11,
      _cullMode = 12,
      _primitiveType = 13,
      _windingOrder = 14,
      _scissor = 15,
      _viewport = 16,
      _draw = 17,
      _drawIndexed = 18;

  void _add(int op, [int a = 0, int b = 0]) {
    if (_length + 3 > _ops.length) {
      _ops = Int32List(_ops.length * 2)..setRange(0, _length, _ops);
    }
    _ops[_length++] = op;
    _ops[_length++] = a;
    _ops[_length++] = b;
  }

  void clear() {
    _length = 0;
    _refs.clear();
  }

  void pipeline(WebGlRenderPipeline pipeline) {
    _add(_pipeline);
    _refs.add(pipeline);
  }

  void vertexBuffer(BufferView view, int slot) {
    _add(_vertexBuffer, slot);
    _refs.add(view);
  }

  void indexBuffer(BufferView view, IndexType type) {
    _add(_indexBuffer, type.index);
    _refs.add(view);
  }

  void uniform(UniformSlot slot, BufferView view) {
    _add(_uniform);
    _refs
      ..add(slot)
      ..add(view);
  }

  void texture(UniformSlot slot, Texture texture, SamplerOptions? sampler) {
    _add(_texture);
    _refs
      ..add(slot)
      ..add(texture)
      ..add(sampler);
  }

  void clearBindings() => _add(_clearBindings);

  void blendEnable(bool enable) => _add(_blendEnable, enable ? 1 : 0);

  void blendEquation(ColorBlendEquation equation) {
    _add(_blendEquation);
    _refs.add(equation);
  }

  void depthWrite(bool enable) => _add(_depthWrite, enable ? 1 : 0);

  void depthCompare(CompareFunction compare) =>
      _add(_depthCompare, compare.index);

  void stencilReference(int value) => _add(_stencilReference, value);

  void stencilConfig(StencilConfig configuration, StencilFace face) {
    _add(_stencilConfig, face.index);
    _refs.add(configuration);
  }

  void cullMode(CullMode mode) => _add(_cullMode, mode.index);

  void primitiveType(PrimitiveType type) => _add(_primitiveType, type.index);

  void windingOrder(WindingOrder order) => _add(_windingOrder, order.index);

  void scissor(Scissor scissor) {
    _add(_scissor);
    _refs.add(scissor);
  }

  void viewport(Viewport viewport) {
    _add(_viewport);
    _refs.add(viewport);
  }

  void draw(int vertexCount, int instanceCount) =>
      _add(_draw, vertexCount, instanceCount);

  void drawIndexed(int indexCount, int instanceCount) =>
      _add(_drawIndexed, indexCount, instanceCount);

  /// Makes the recorded calls on [pass], in order.
  void replay(_PassExecutor pass) {
    final ops = _ops, refs = _refs;
    var r = 0;
    for (var i = 0; i < _length; i += 3) {
      final a = ops[i + 1], b = ops[i + 2];
      switch (ops[i]) {
        case _pipeline:
          pass._bindPipeline(refs[r++] as WebGlRenderPipeline);
        case _vertexBuffer:
          pass._bindVertexBuffer(refs[r++] as BufferView, a);
        case _indexBuffer:
          pass._bindIndexBuffer(refs[r++] as BufferView, IndexType.values[a]);
        case _uniform:
          final slot = refs[r++] as UniformSlot;
          pass._bindUniform(slot, refs[r++] as BufferView);
        case _texture:
          final slot = refs[r++] as UniformSlot;
          final texture = refs[r++] as Texture;
          pass._bindTexture(slot, texture, refs[r++] as SamplerOptions?);
        case _clearBindings:
          pass._clearBindings();
        case _blendEnable:
          pass._setBlendEnable(a != 0);
        case _blendEquation:
          pass._setColorBlendEquation(refs[r++] as ColorBlendEquation);
        case _depthWrite:
          pass._setDepthWrite(a != 0);
        case _depthCompare:
          pass._setDepthCompare(CompareFunction.values[a]);
        case _stencilReference:
          pass._setStencilReference(a);
        case _stencilConfig:
          pass._setStencilConfig(
            refs[r++] as StencilConfig,
            StencilFace.values[a],
          );
        case _cullMode:
          pass._setCullMode(CullMode.values[a]);
        case _primitiveType:
          pass._primitiveType = PrimitiveType.values[a];
        case _windingOrder:
          pass._setWindingOrder(WindingOrder.values[a]);
        case _scissor:
          pass._setScissor(refs[r++] as Scissor);
        case _viewport:
          pass._setViewport(refs[r++] as Viewport);
        case _draw:
          pass._draw(a, b);
        case _drawIndexed:
          pass._drawIndexed(a, b);
      }
    }
  }
}
