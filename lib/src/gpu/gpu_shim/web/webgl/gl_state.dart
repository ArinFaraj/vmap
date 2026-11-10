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

  /// No GL enum, mask or range is negative.
  static const _unset = -1;

  final _Keyed<web.WebGLBuffer> _buffers = _Keyed();

  /// The buffer bound to each uniform block index, and its offset and size
  /// as a pair in [_blockRanges]: both -1 for a whole buffer.
  final List<web.WebGLBuffer?> _blockBuffers = [];
  Int32List _blockRanges = Int32List(0);
  static const _noRange = -2;

  Object? _vertexArray = _unknown;
  Object? _program = _unknown;
  final _Keyed<bool> _enabled = _Keyed();
  bool? _depthMask;
  int? _depthFunc, _frontFace, _cullFace;
  final Int32List _blendEquation = Int32List(2)..fillRange(0, 2, _unset);
  final Int32List _blendFunc = Int32List(4)..fillRange(0, 4, _unset);

  /// Three ints for the front face, then three for the back.
  final Int32List _stencilFunc = Int32List(6)..fillRange(0, 6, _unset);
  final Int32List _stencilOp = Int32List(6)..fillRange(0, 6, _unset);
  final Int32List _stencilMask = Int32List(2)..fillRange(0, 2, _unset);

  void bindBuffer(int target, web.WebGLBuffer? buffer) {
    if (target != web.WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER) {
      if (_buffers.holds(target, buffer)) return;
      _buffers.set(target, buffer);
    }
    _gl.bindBuffer(target, buffer);
  }

  /// Makes [buffer] from [offset] for [size] what block [index] holds;
  /// true when it held that already.
  bool _holdsBlock(int index, web.WebGLBuffer? buffer, int offset, int size) {
    if (index >= _blockBuffers.length) {
      final ranges = Int32List((index + 1) * 2)
        ..fillRange(0, (index + 1) * 2, _noRange)
        ..setRange(0, _blockRanges.length, _blockRanges);
      _blockRanges = ranges;
      while (_blockBuffers.length <= index) {
        _blockBuffers.add(null);
      }
    }
    final at = index * 2;
    if (_blockRanges[at] == offset &&
        _blockRanges[at + 1] == size &&
        _blockBuffers[index] == buffer) {
      return true;
    }
    _blockBuffers[index] = buffer;
    _blockRanges[at] = offset;
    _blockRanges[at + 1] = size;
    return false;
  }

  void bindBufferRange(
    int target,
    int index,
    web.WebGLBuffer? buffer,
    int offset,
    int size,
  ) {
    _buffers.set(target, buffer);
    if (target == web.WebGL2RenderingContext.UNIFORM_BUFFER &&
        _holdsBlock(index, buffer, offset, size)) {
      return;
    }
    _gl.bindBufferRange(target, index, buffer, offset, size);
  }

  void bindBufferBase(int target, int index, web.WebGLBuffer? buffer) {
    _buffers.set(target, buffer);
    if (target == web.WebGL2RenderingContext.UNIFORM_BUFFER &&
        _holdsBlock(index, buffer, -1, -1)) {
      return;
    }
    _gl.bindBufferBase(target, index, buffer);
  }

  void deleteBuffer(web.WebGLBuffer buffer) {
    _buffers.forget(buffer);
    for (var index = 0; index < _blockBuffers.length; index++) {
      if (_blockBuffers[index] != buffer) continue;
      _blockBuffers[index] = null;
      _blockRanges[index * 2] = _noRange;
      _blockRanges[index * 2 + 1] = _noRange;
    }
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
    if (_enabled.holds(capability, on)) return;
    _enabled.set(capability, on);
    if (on) {
      _gl.enable(capability);
    } else {
      _gl.disable(capability);
    }
  }

  /// Whether [capability] is on, asking GL only when it was never set here.
  bool isEnabled(int capability) {
    final known = _enabled.of(capability);
    if (known != null) return known;
    final on = _gl.isEnabled(capability);
    _enabled.set(capability, on);
    return on;
  }

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
    if (_blendEquation[0] == color && _blendEquation[1] == alpha) return;
    _blendEquation[0] = color;
    _blendEquation[1] = alpha;
    _gl.blendEquationSeparate(color, alpha);
  }

  void blendFuncSeparate(
    int srcColor,
    int dstColor,
    int srcAlpha,
    int dstAlpha,
  ) {
    final f = _blendFunc;
    if (f[0] == srcColor &&
        f[1] == dstColor &&
        f[2] == srcAlpha &&
        f[3] == dstAlpha) {
      return;
    }
    f[0] = srcColor;
    f[1] = dstColor;
    f[2] = srcAlpha;
    f[3] = dstAlpha;
    _gl.blendFuncSeparate(srcColor, dstColor, srcAlpha, dstAlpha);
  }

  static int _face(int face) => face == web.WebGL2RenderingContext.BACK ? 1 : 0;

  /// Makes [a], [b] and [c] what [state] holds for [face]; true when it
  /// held them already.
  static bool _holdsThree(Int32List state, int face, int a, int b, int c) {
    final at = _face(face) * 3;
    if (state[at] == a && state[at + 1] == b && state[at + 2] == c) return true;
    state[at] = a;
    state[at + 1] = b;
    state[at + 2] = c;
    return false;
  }

  void stencilFuncSeparate(int face, int function, int reference, int mask) {
    if (_holdsThree(_stencilFunc, face, function, reference, mask)) return;
    _gl.stencilFuncSeparate(face, function, reference, mask);
  }

  void stencilOpSeparate(int face, int fail, int depthFail, int pass) {
    if (_holdsThree(_stencilOp, face, fail, depthFail, pass)) return;
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

  /// The target bound on each texture unit, 0 for none yet, and what is
  /// bound to it.
  Int32List _unitTargets = Int32List(16);
  final List<web.WebGLTexture?> _unitTextures = List.filled(
    16,
    null,
    growable: true,
  );
  int _activeUnit = _unset;

  /// Binds [texture] to [target] on texture unit [unit].
  void bindTexture(int unit, int target, web.WebGLTexture? texture) {
    if (_activeUnit != unit) {
      _activeUnit = unit;
      _gl.activeTexture(web.WebGL2RenderingContext.TEXTURE0 + unit);
    }
    if (unit >= _unitTargets.length) {
      _unitTargets = Int32List((unit + 1) * 2)
        ..setRange(0, _unitTargets.length, _unitTargets);
      while (_unitTextures.length < _unitTargets.length) {
        _unitTextures.add(null);
      }
    }
    _unitTargets[unit] = target;
    _unitTextures[unit] = texture;
    _gl.bindTexture(target, texture);
  }

  /// Takes [texture] off every unit it is bound to: a draw whose program
  /// has a sampler on such a unit while [texture] is drawn into is refused
  /// as a feedback loop, whether or not it samples it.
  void unbindTexture(web.WebGLTexture? texture) {
    if (texture == null) return;
    for (var unit = 0; unit < _unitTargets.length; unit++) {
      final target = _unitTargets[unit];
      if (target != 0 && _unitTextures[unit] == texture) {
        bindTexture(unit, target, null);
      }
    }
  }
}

/// What was last set under each of a few int keys, found by walking them:
/// a map keyed by an int boxes the key at every lookup on the web.
final class _Keyed<T extends Object> {
  final List<int> _keys = [];
  final List<T?> _values = [];
  final List<bool> _set = [];

  int _at(int key) {
    for (var i = 0; i < _keys.length; i++) {
      if (_keys[i] == key) return i;
    }
    _keys.add(key);
    _values.add(null);
    _set.add(false);
    return _keys.length - 1;
  }

  /// Whether [key] was last set to [value].
  bool holds(int key, T? value) {
    final i = _at(key);
    return _set[i] && _values[i] == value;
  }

  /// What [key] was last set to, null when it never was.
  T? of(int key) => _values[_at(key)];

  void set(int key, T? value) {
    final i = _at(key);
    _values[i] = value;
    _set[i] = true;
  }

  /// Sets every key that holds [value] to null.
  void forget(T value) {
    for (var i = 0; i < _values.length; i++) {
      if (_values[i] == value) _values[i] = null;
    }
  }
}
