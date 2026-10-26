part of '_webgl.dart';

/// The GL state the shim sets, as it last set it, so a call that would set
/// what is set already is not made. Every WebGL call crosses to the
/// browser's GPU process, which WebKit then waits on when a frame's image
/// is taken; most of a map frame's state calls repeat the one before.
///
/// Everything in the shim sets this state through here. The element array
/// binding is the bound vertex array's, so it is always set.
final class _GlState {
  _GlState(this._gl);

  final web.WebGL2RenderingContext _gl;

  static const Object _unknown = Object();

  final Map<int, web.WebGLBuffer?> _buffers = {};
  final Map<int, (web.WebGLBuffer?, int, int)> _uniformBlocks = {};
  Object? _vertexArray = _unknown;
  Object? _program = _unknown;
  final Map<int, bool> _enabled = {};
  bool? _depthMask;
  int? _depthFunc, _frontFace, _cullFace;
  (int, int)? _blendEquation;
  (int, int, int, int)? _blendFunc;
  final List<(int, int, int)?> _stencilFunc = [null, null];
  final List<(int, int, int)?> _stencilOp = [null, null];
  final List<int?> _stencilMask = [null, null];

  void bindBuffer(int target, web.WebGLBuffer? buffer) {
    if (target != web.WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER) {
      if (_buffers.containsKey(target) && _buffers[target] == buffer) return;
      _buffers[target] = buffer;
    }
    _gl.bindBuffer(target, buffer);
  }

  void bindBufferRange(
    int target,
    int index,
    web.WebGLBuffer? buffer,
    int offset,
    int size,
  ) {
    _buffers[target] = buffer;
    if (target == web.WebGL2RenderingContext.UNIFORM_BUFFER) {
      final bound = (buffer, offset, size);
      if (_uniformBlocks[index] == bound) return;
      _uniformBlocks[index] = bound;
    }
    _gl.bindBufferRange(target, index, buffer, offset, size);
  }

  void bindBufferBase(int target, int index, web.WebGLBuffer? buffer) {
    _buffers[target] = buffer;
    if (target == web.WebGL2RenderingContext.UNIFORM_BUFFER) {
      final bound = (buffer, -1, -1);
      if (_uniformBlocks[index] == bound) return;
      _uniformBlocks[index] = bound;
    }
    _gl.bindBufferBase(target, index, buffer);
  }

  void deleteBuffer(web.WebGLBuffer buffer) {
    _buffers.updateAll((_, b) => b == buffer ? null : b);
    _uniformBlocks.removeWhere((_, bound) => bound.$1 == buffer);
    _gl.deleteBuffer(buffer);
  }

  void bindVertexArray(web.WebGLVertexArrayObject? vertexArray) {
    if (_vertexArray == vertexArray) return;
    _vertexArray = vertexArray;
    _gl.bindVertexArray(vertexArray);
  }

  void deleteVertexArray(web.WebGLVertexArrayObject vertexArray) {
    if (_vertexArray == vertexArray) _vertexArray = _unknown;
    _gl.deleteVertexArray(vertexArray);
  }

  void useProgram(web.WebGLProgram? program) {
    if (_program == program) return;
    _program = program;
    _gl.useProgram(program);
  }

  void deleteProgram(web.WebGLProgram program) {
    if (_program == program) _program = _unknown;
    _gl.deleteProgram(program);
  }

  void enable(int capability) => setEnabled(capability, true);

  void disable(int capability) => setEnabled(capability, false);

  void setEnabled(int capability, bool on) {
    if (_enabled[capability] == on) return;
    _enabled[capability] = on;
    if (on) {
      _gl.enable(capability);
    } else {
      _gl.disable(capability);
    }
  }

  /// Whether [capability] is on, asking GL only when it was never set here.
  bool isEnabled(int capability) =>
      _enabled[capability] ??= _gl.isEnabled(capability);

  void depthMask(bool on) {
    if (_depthMask == on) return;
    _depthMask = on;
    _gl.depthMask(on);
  }

  void depthFunc(int function) {
    if (_depthFunc == function) return;
    _depthFunc = function;
    _gl.depthFunc(function);
  }

  void frontFace(int mode) {
    if (_frontFace == mode) return;
    _frontFace = mode;
    _gl.frontFace(mode);
  }

  void cullFace(int mode) {
    if (_cullFace == mode) return;
    _cullFace = mode;
    _gl.cullFace(mode);
  }

  void blendEquationSeparate(int color, int alpha) {
    final equation = (color, alpha);
    if (_blendEquation == equation) return;
    _blendEquation = equation;
    _gl.blendEquationSeparate(color, alpha);
  }

  void blendFuncSeparate(
    int srcColor,
    int dstColor,
    int srcAlpha,
    int dstAlpha,
  ) {
    final function = (srcColor, dstColor, srcAlpha, dstAlpha);
    if (_blendFunc == function) return;
    _blendFunc = function;
    _gl.blendFuncSeparate(srcColor, dstColor, srcAlpha, dstAlpha);
  }

  static int _face(int face) => face == web.WebGL2RenderingContext.BACK ? 1 : 0;

  void stencilFuncSeparate(int face, int function, int reference, int mask) {
    final set = (function, reference, mask);
    if (_stencilFunc[_face(face)] == set) return;
    _stencilFunc[_face(face)] = set;
    _gl.stencilFuncSeparate(face, function, reference, mask);
  }

  void stencilOpSeparate(int face, int fail, int depthFail, int pass) {
    final set = (fail, depthFail, pass);
    if (_stencilOp[_face(face)] == set) return;
    _stencilOp[_face(face)] = set;
    _gl.stencilOpSeparate(face, fail, depthFail, pass);
  }

  void stencilMaskSeparate(int face, int mask) {
    if (_stencilMask[_face(face)] == mask) return;
    _stencilMask[_face(face)] = mask;
    _gl.stencilMaskSeparate(face, mask);
  }

  void stencilMask(int mask) {
    if (_stencilMask[0] == mask && _stencilMask[1] == mask) return;
    _stencilMask[0] = mask;
    _stencilMask[1] = mask;
    _gl.stencilMask(mask);
  }

  final Map<int, (int, web.WebGLTexture?)> _units = {};
  int? _activeUnit;

  /// Binds [texture] to [target] on texture unit [unit].
  void bindTexture(int unit, int target, web.WebGLTexture? texture) {
    if (_activeUnit != unit) {
      _activeUnit = unit;
      _gl.activeTexture(web.WebGL2RenderingContext.TEXTURE0 + unit);
    }
    _units[unit] = (target, texture);
    _gl.bindTexture(target, texture);
  }

  /// Takes [texture] off every unit it is bound to: a draw whose program
  /// has a sampler on such a unit while [texture] is drawn into is refused
  /// as a feedback loop, whether or not it samples it.
  void unbindTexture(web.WebGLTexture? texture) {
    if (texture == null) return;
    for (final MapEntry(key: unit, value: (target, bound)) in [
      ..._units.entries,
    ]) {
      if (bound == texture) bindTexture(unit, target, null);
    }
  }
}
