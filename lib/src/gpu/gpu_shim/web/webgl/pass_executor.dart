part of '_webgl.dart';

/// Appended to a missing-binding error, since a bundle from an earlier build
/// reflects the same way as a name the shader never declared.
const String _staleBundleHint =
    'If the app was just rebuilt, a cache in front of the server (a service '
    'worker, a CDN) may be serving a shader bundle from the previous build.';

/// What a render pass does to the GL context: its framebuffer, load and
/// store actions, and the calls it recorded, made when it is issued.
final class _PassExecutor {
  _PassExecutor(this._gpuContext, RenderTarget target) {
    // The open pass draws before this one takes the canvas from it.
    _gpuContext._flushPass();
    _framebuffer = _PassFramebuffer(_gpuContext, target);
    _bindFramebuffer();
    // A scissor is per pass too, and would clip the load action's clear.
    _gpuContext._state.disable(web.WebGL2RenderingContext.SCISSOR_TEST);
    _framebuffer.load();
    // Reset the fixed-function state that GL holds globally but Impeller
    // scopes per pass. Cull mode and winding order otherwise leak from the
    // previous pass's last draw into a pass that doesn't set them (e.g. the
    // full-screen tonemap blit, which inherits whatever the scene pass left
    // bound). A mirrored (negative-determinant) node leaves the winding
    // flipped, which would then back-face cull the blit and blank the frame.
    // Mirrors Impeller's GLES backend, which re-initialises this state at the
    // start of every pass encode.
    _gpuContext._state
      ..disable(web.WebGL2RenderingContext.CULL_FACE)
      ..disable(web.WebGL2RenderingContext.STENCIL_TEST);
    if (_depthless) {
      _gpuContext._state
        ..disable(web.WebGL2RenderingContext.DEPTH_TEST)
        ..depthMask(false);
    }
  }

  late final _PassFramebuffer _framebuffer;

  /// Whether this pass draws in the canvas and not in its target's
  /// texture. The canvas holds a frame upright, as the page shows it, and a
  /// texture holds it top-down, as Flutter GPU stores what it renders to,
  /// so winding, scissor, viewport and a shader's pixel row all turn over
  /// between the two: [_orient] and the three `_apply` methods are where.
  bool get _inCanvas => _framebuffer.inCanvas;
  bool get _depthless => _framebuffer.depthless;
  int get _height => _framebuffer.height;

  /// Binds where the pass draws, and turns what it draws the way up that
  /// place holds it.
  void _bindFramebuffer() {
    _framebuffer.bind();
    _gpuContext._boundPass = this;
    _orient();
  }

  /// Ends the pass.
  void finish() => _framebuffer.finish();

  WindingOrder _winding = WindingOrder.clockwise;
  Scissor? _scissor;
  Viewport? _viewport;

  /// Applies what depends on which way up the pass draws.
  void _orient() {
    _applyWinding();
    final scissor = _scissor, viewport = _viewport, pipeline = _boundPipeline;
    if (scissor != null) _applyScissor(scissor);
    if (viewport != null) _applyViewport(viewport);
    if (pipeline != null) {
      _gpuContext._state.useProgram(pipeline._program);
      pipeline._orient(_inCanvas, _height);
    }
  }

  // Inverted relative to the requested order in a texture: the generated
  // GLES vertex shaders multiply gl_Position.y by `_impeller_y_flip = -1`
  // there, which mirrors triangle winding while storing render targets
  // top-down.
  void _applyWinding() => _gpuContext._state.frontFace(
    (_winding == WindingOrder.clockwise) != _inCanvas
        ? web.WebGL2RenderingContext.CCW
        : web.WebGL2RenderingContext.CW,
  );

  void _applyScissor(Scissor scissor) => _gpuContext._gl.scissor(
    scissor.x,
    _inCanvas ? _height - scissor.y - scissor.height : scissor.y,
    scissor.width,
    scissor.height,
  );

  void _applyViewport(Viewport viewport) => _gpuContext._gl
    ..viewport(
      viewport.x,
      _inCanvas ? _height - viewport.y - viewport.height : viewport.y,
      viewport.width,
      viewport.height,
    )
    ..depthRange(viewport.depthRange.zNear, viewport.depthRange.zFar);

  void _setWindingOrder(WindingOrder order) {
    _winding = order;
    _applyWinding();
  }

  void _setScissor(Scissor scissor) {
    _scissor = scissor;
    _gpuContext._state.enable(web.WebGL2RenderingContext.SCISSOR_TEST);
    _applyScissor(scissor);
  }

  void _setViewport(Viewport viewport) => _applyViewport(_viewport = viewport);

  final WebGlContext _gpuContext;

  WebGlRenderPipeline? _boundPipeline;
  web.WebGLVertexArrayObject? _vao;

  /// Vertex-stream bindings recorded since the last [clearBindings], applied
  /// through the VAO cache when the draw is issued: (view, slot, whether the
  /// stream is instance-rate).
  final List<(BufferView, int, bool)> _pendingVertexBindings = [];

  /// Uniform-block binding points, and texture units mapped to the GL target
  /// bound there, occupied since the last [clearBindings]. Recorded so the
  /// clear can release exactly what it handed out.
  final Set<int> _boundUniformBlocks = {};

  /// The binding points under 62 in [_boundUniformBlocks], a bit each, so
  /// binding one again does not look the set up.
  int _boundBlockBits = 0;
  final Map<int, int> _boundTextureUnits = {};
  PrimitiveType _primitiveType = PrimitiveType.triangle;
  BufferView? _inlineVertexBufferView;

  BufferView? _indexBufferView;
  IndexType _indexType = IndexType.int32;

  /// Makes the calls in [record], and empties it.
  void issue(_PassRecord record) {
    try {
      if (!identical(_gpuContext._boundPass, this)) _bindFramebuffer();
      _gpuContext._sendHeld();
      record.replay(this);
    } finally {
      record.clear();
    }
  }

  void _ensureVao() {
    final gl = _gpuContext._gl;
    _vao ??= gl.createVertexArray();
    _gpuContext._state.bindVertexArray(_vao);
  }

  void _bindPipeline(WebGlRenderPipeline pipeline) {
    _boundPipeline = pipeline;
    _gpuContext._state.useProgram(pipeline._program);
    pipeline._orient(_inCanvas, _height);
    // Give every active uniform block a valid (zeroed) buffer up front, so a
    // block the caller never binds does not raise a used-but-unbound uniform
    // buffer error on this backend. Explicit bindUniform calls override it.
    pipeline._bindDefaultUniformBlocks();
  }

  void _bindVertexBuffer(BufferView bufferView, int slot) {
    final pipeline = _boundPipeline;
    if (pipeline == null) {
      throw StateError('bindVertexBuffer called before bindPipeline');
    }

    final layout = pipeline.vertexLayout;
    if (layout == null && slot != 0) {
      throw RangeError.value(
        slot,
        'slot',
        'Slots other than 0 need an explicit pipeline VertexLayout',
      );
    }

    if (layout == null && pipeline.vertexShader.vertexInputs.isEmpty) {
      // Inline pipeline (no reflected attributes): configured at draw time
      // from the vertex count; not part of the cached-VAO path.
      _inlineVertexBufferView = bufferView;
      return;
    }
    _inlineVertexBufferView = null;

    var instanceRate = false;
    if (layout != null) {
      if (slot < 0 || slot >= layout.buffers.length) {
        throw RangeError.value(
          slot,
          'slot',
          'Pipeline VertexLayout declares ${layout.buffers.length} buffers',
        );
      }
      instanceRate = layout.buffers[slot].stepMode == VertexStepMode.instance;
    }
    // Deferred: applied (through the VAO cache) when the draw is issued.
    // Bindings persist across same-pipeline draws, so a re-bind replaces its
    // slot's entry rather than growing the list.
    final entry = (bufferView, slot, instanceRate);
    for (var i = 0; i < _pendingVertexBindings.length; i++) {
      if (_pendingVertexBindings[i].$2 == slot) {
        _pendingVertexBindings[i] = entry;
        return;
      }
    }
    _pendingVertexBindings.add(entry);
  }

  /// Applies one recorded vertex-stream binding to the currently bound VAO:
  /// binds the stream's GL buffer and points/enables its attributes.
  void _applyVertexBinding(BufferView bufferView, int slot) {
    final gl = _gpuContext._gl;
    final pipeline = _boundPipeline!;
    bufferView.buffer.webGl._bindForTarget(
      web.WebGL2RenderingContext.ARRAY_BUFFER,
    );

    final layout = pipeline.vertexLayout;
    if (layout != null) {
      // Explicit layout: the buffer's slot describes its stride, step mode,
      // and named attributes; the shader's reflection only supplies the
      // attribute locations.
      final buffer = layout.buffers[slot];
      final divisor = buffer.stepMode == VertexStepMode.instance ? 1 : 0;
      for (final attribute in buffer.attributes) {
        final input = pipeline.vertexShader.vertexInputByName(attribute.name);
        if (input == null) {
          throw StateError(
            'Vertex shader has no input named "${attribute.name}"',
          );
        }
        gl.enableVertexAttribArray(input.location);
        final name = attribute.format.name;
        final unsigned = name.startsWith('uint');
        if (unsigned || name.startsWith('sint')) {
          // Integer inputs (`in uvec2`) need the I variant, which keeps the
          // values integral instead of converting them to float.
          gl.vertexAttribIPointer(
            input.location,
            attribute.format.componentCount,
            unsigned
                ? web.WebGL2RenderingContext.UNSIGNED_INT
                : web.WebGL2RenderingContext.INT,
            buffer.strideInBytes,
            bufferView.offsetInBytes + attribute.offsetInBytes,
          );
        } else {
          gl.vertexAttribPointer(
            input.location,
            attribute.format.componentCount,
            web.WebGL2RenderingContext.FLOAT,
            false,
            buffer.strideInBytes,
            bufferView.offsetInBytes + attribute.offsetInBytes,
          );
        }
        gl.vertexAttribDivisor(input.location, divisor);
      }
      return;
    }

    final inputs = pipeline.vertexShader.vertexInputs;
    final stride = pipeline.vertexShader.vertexStride;
    for (final input in inputs) {
      gl.enableVertexAttribArray(input.location);
      gl.vertexAttribPointer(
        input.location,
        input.componentCount,
        web.WebGL2RenderingContext.FLOAT,
        false,
        stride,
        bufferView.offsetInBytes + input.offsetInBytes,
      );
      // Divisor state lives in the VAO and may be left over from an
      // instanced layout; reset it for vertex-rate inputs.
      gl.vertexAttribDivisor(input.location, 0);
    }
  }

  /// Binds the vertex (and, when [needsIndex] is set, index) state for the
  /// draw being issued, through a cached VAO.
  ///
  /// Vertex-attribute specification is the dominant per-draw GL traffic, and
  /// on the web every GL call is validated in the browser's GPU process, so
  /// re-specifying stable geometry streams per draw is expensive out of all
  /// proportion to the Dart-side cost. Geometry streams are stable per
  /// (pipeline, buffers, offsets), so their full attribute state is captured
  /// in a VAO once and re-bound with a single call thereafter.
  ///
  /// Instance-rate streams are excluded from the cache key and re-pointed on
  /// the bound VAO every draw: they ride the per-frame bump allocator, so
  /// their offset changes per draw and every instanced draw re-points them
  /// anyway.
  void _applyVertexState({required bool needsIndex}) {
    if (_inlineVertexBufferView != null) {
      _ensureVao();
      return;
    }
    final gl = _gpuContext._gl;
    final indexView = needsIndex ? _indexBufferView : null;
    final key = _gpuContext._vaoProbe..clear(_boundPipeline!);
    for (final (view, slot, instanceRate) in _pendingVertexBindings) {
      if (instanceRate) continue;
      key.stream(view.buffer.webGl._serial, view.offsetInBytes, slot);
    }
    if (indexView != null) {
      key.indices(indexView.buffer.webGl._serial, indexView.offsetInBytes);
    }
    final cache = _gpuContext._vaoCache;
    final known = cache[key];
    if (known != null) {
      known.used = ++_gpuContext._vaoClock;
      _gpuContext._state.bindVertexArray(known.vao);
    } else {
      final vao = gl.createVertexArray();
      if (vao == null) {
        throw StateError('Failed to create WebGL vertex array');
      }
      _gpuContext._state.bindVertexArray(vao);
      for (final (view, slot, instanceRate) in _pendingVertexBindings) {
        if (instanceRate) continue;
        _applyVertexBinding(view, slot);
      }
      // ELEMENT_ARRAY_BUFFER binding is VAO state; capture it with the rest.
      indexView?.buffer.webGl._bindForTarget(
        web.WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER,
      );
      cache[key.copy()] = _CachedVao(vao)..used = ++_gpuContext._vaoClock;
      if (cache.length > WebGlContext._kMaxCachedVaos) {
        _gpuContext._dropOldVaos();
      }
    }
    for (final (view, slot, instanceRate) in _pendingVertexBindings) {
      if (instanceRate) _applyVertexBinding(view, slot);
    }
  }

  // ELEMENT_ARRAY_BUFFER binding is VAO state, applied (through the VAO
  // cache) when the draw is issued.
  void _bindIndexBuffer(BufferView bufferView, IndexType indexType) {
    _indexBufferView = bufferView;
    _indexType = indexType;
  }

  void _bindUniform(UniformSlot slot, BufferView bufferView) {
    final pipeline = _boundPipeline;
    if (pipeline == null) {
      throw StateError('bindUniform called before bindPipeline');
    }
    final known = pipeline._boundBlocks;
    for (var i = 0; i < known.length; i++) {
      final block = known[i];
      if (!identical(block.slot, slot)) continue;
      _bindBlock(block.binding, block.minBindSize, bufferView);
      return;
    }
    final struct = slot.shader.webGl._uniformStructs[slot.uniformName];
    if (struct == null) {
      // Match the native backend, which throws when the shader has no uniform
      // slot of this name. Swallowing it silently binds nothing and the draw
      // reads stale uniform state, wrong only on web and only for some draw
      // orders. The lookup reads the shader's live reflection, so it stays
      // correct across hot reload.
      throw StateError(
        'Failed to bind uniform. This shader declares no uniform block named '
        '"${slot.uniformName}". A block binds by its type name, not its '
        'instance name, and a block nothing in the shader reads is optimized '
        'out by the compiler and reflects as absent. $_staleBundleHint',
      );
    }

    final gl = _gpuContext._gl;

    // GLSL ES 3.00 bundles expose the struct as a std140 uniform block;
    // attach the emplaced bytes directly as a buffer range. The emplaced
    // layout matches std140 (it is what the reflection metadata describes),
    // and HostBuffer offsets are 256-aligned, satisfying WebGL2's
    // UNIFORM_BUFFER_OFFSET_ALIGNMENT.
    final blockBinding = pipeline._structBlockBindings[struct.name];
    if (blockBinding != null) {
      final minBindSize = pipeline._structBlockBindSizes[struct.name] ?? 0;
      pipeline._boundBlocks.add(_BoundBlock(slot, blockBinding, minBindSize));
      _bindBlock(blockBinding, minBindSize, bufferView);
      return;
    }

    final floats = bufferView.buffer.webGl._stagingFloats;
    final base = bufferView.offsetInBytes;
    final locations = pipeline._structLocations[struct.name];
    for (var i = 0; i < struct.members.length; i++) {
      final loc = locations?[i];
      if (loc == null) continue; // optimized out by the linker
      final member = struct.members[i];
      _setUniformMember(gl, loc, member, floats, base + member.offsetInBytes);
    }
  }

  /// Attaches [bufferView] to the uniform block at [blockBinding].
  ///
  /// At least [minBindSize] bytes are bound, the driver-reported block data
  /// size: the emplaced length alone can be smaller than the driver's
  /// padded size, and a too-small range makes the draw a no-op.
  /// DeviceBuffer pads its GL data store so the extended range stays inside
  /// the buffer.
  void _bindBlock(int blockBinding, int minBindSize, BufferView bufferView) {
    final glBuffer = bufferView.buffer.webGl._bindForTarget(
      web.WebGL2RenderingContext.UNIFORM_BUFFER,
    );
    var lengthInBytes = bufferView.lengthInBytes;
    if (minBindSize > lengthInBytes) lengthInBytes = minBindSize;
    _gpuContext._state.bindBufferRange(
      web.WebGL2RenderingContext.UNIFORM_BUFFER,
      blockBinding,
      glBuffer,
      bufferView.offsetInBytes,
      lengthInBytes,
    );
    if (blockBinding < 62) {
      final bit = 1 << blockBinding;
      if (_boundBlockBits & bit != 0) return;
      _boundBlockBits |= bit;
    }
    _boundUniformBlocks.add(blockBinding);
  }

  /// [length] floats of [floats] from [offset], as a JS array of just them.
  /// Under dart2wasm `toJS` copies a whole list, and the staging list is a
  /// whole uniform block, so crossing it entire for each member of each
  /// draw cost seconds a frame; under dart2js both are views.
  static JSFloat32Array _floats(Float32List floats, int offset, int length) =>
      Float32List.sublistView(floats, offset, offset + length).toJS;

  // Scratch for the rare matrix repack; grows to the largest repacked member
  // and is reused across draws.
  static Float32List _matrixScratch = Float32List(64);

  void _setUniformMember(
    web.WebGL2RenderingContext gl,
    web.WebGLUniformLocation loc,
    _UniformMember member,
    Float32List floats,
    int byteOffset,
  ) {
    final floatOffset = byteOffset >> 2;
    if (member.columns > 1) {
      // Matrix, possibly an array. In std140 each matrix column is aligned
      // to 16 bytes (a mat3 column is a vec3 padded to vec4); GL's
      // uniformMatrix*fv wants tightly-packed columns. The matrix count
      // comes from the total size, not arrayElements (which Impeller
      // overloads to mean column count for a standalone matrix).
      const columnStride = 16;
      final cols = member.columns;
      final rows = member.vecSize;
      final count = member.totalSizeInBytes ~/ (cols * columnStride);
      if (rows * 4 == columnStride) {
        // mat4 columns are already tight in std140; upload straight from the
        // staging view with no copy (the overwhelmingly common case).
        gl.uniformMatrix4fv(
          loc,
          false,
          _floats(floats, floatOffset, count * 16),
        );
        return;
      }
      final tightLength = count * cols * rows;
      if (_matrixScratch.length < tightLength) {
        _matrixScratch = Float32List(tightLength);
      }
      final tight = _matrixScratch;
      var w = 0;
      for (var m = 0; m < count; m++) {
        for (var c = 0; c < cols; c++) {
          final col = floatOffset + (m * cols + c) * (columnStride >> 2);
          for (var r = 0; r < rows; r++) {
            tight[w++] = floats[col + r];
          }
        }
      }
      switch (cols) {
        case 2:
          gl.uniformMatrix2fv(loc, false, _floats(tight, 0, tightLength));
        case 3:
          gl.uniformMatrix3fv(loc, false, _floats(tight, 0, tightLength));
      }
    } else {
      // Vector / scalar, possibly an array. vec4 arrays are tightly packed
      // (16-byte elements); vec3/vec2/scalar arrays would have std140
      // padding, but flutter_scene's uniforms don't use those.
      final count = member.arrayElements == 0 ? 1 : member.arrayElements;
      final length = member.vecSize * count;
      switch (member.vecSize) {
        case 1:
          gl.uniform1fv(loc, _floats(floats, floatOffset, length));
        case 2:
          gl.uniform2fv(loc, _floats(floats, floatOffset, length));
        case 3:
          gl.uniform3fv(loc, _floats(floats, floatOffset, length));
        case 4:
          gl.uniform4fv(loc, _floats(floats, floatOffset, length));
      }
    }
  }

  void _bindTexture(
    UniformSlot slot,
    Texture texture,
    SamplerOptions? sampler,
  ) {
    final pipeline = _boundPipeline;
    if (pipeline == null) {
      throw StateError('bindTexture called before bindPipeline');
    }
    final unit = pipeline._samplerUnits[slot.uniformName];
    if (unit == null) {
      // Match the native backend, which throws when the shader has no sampler
      // of this name. Swallowing it silently leaves the unit unbound and the
      // draw samples whatever texture that unit last held, wrong only on web
      // and varying with draw order. _samplerUnits comes from the shader's
      // live reflection, not GL introspection, so a reflected-but-unused
      // sampler still resolves and only a truly absent name throws.
      throw StateError(
        'Failed to bind texture. This shader declares no texture named '
        '"${slot.uniformName}". Check the sampler name spelling, and note '
        'that a sampler nothing in the shader reads is optimized out by the '
        'compiler and reflects as absent. $_staleBundleHint',
      );
    }

    final gl = _gpuContext._gl;
    final target = texture.webGl.glTarget;
    _gpuContext._state.bindTexture(unit, target, texture.webGl.glTexture);
    _boundTextureUnits[unit] = target;
    if (sampler != null) {
      // Sampler parameters are per-texture-object GL state; skip the ones
      // already applied to this texture. Per-draw texParameteri calls are
      // validated in the browser's GPU process and add up across draws.
      final minFilter = _glMinFilter(sampler, texture);
      if (texture.webGl._lastMinFilter != minFilter) {
        texture.webGl._lastMinFilter = minFilter;
        gl.texParameteri(
          target,
          web.WebGL2RenderingContext.TEXTURE_MIN_FILTER,
          minFilter,
        );
      }
      final magFilter = sampler.magFilter == MinMagFilter.nearest
          ? web.WebGL2RenderingContext.NEAREST
          : web.WebGL2RenderingContext.LINEAR;
      if (texture.webGl._lastMagFilter != magFilter) {
        texture.webGl._lastMagFilter = magFilter;
        gl.texParameteri(
          target,
          web.WebGL2RenderingContext.TEXTURE_MAG_FILTER,
          magFilter,
        );
      }
      final wrapS = _glAddressMode(sampler.widthAddressMode);
      if (texture.webGl._lastWrapS != wrapS) {
        texture.webGl._lastWrapS = wrapS;
        gl.texParameteri(
          target,
          web.WebGL2RenderingContext.TEXTURE_WRAP_S,
          wrapS,
        );
      }
      final wrapT = _glAddressMode(sampler.heightAddressMode);
      if (texture.webGl._lastWrapT != wrapT) {
        texture.webGl._lastWrapT = wrapT;
        gl.texParameteri(
          target,
          web.WebGL2RenderingContext.TEXTURE_WRAP_T,
          wrapT,
        );
      }
      final maxAniso = _gpuContext.maxSupportedAnisotropy;
      if (sampler.maxAnisotropy > 1 && maxAniso > 1) {
        // EXT_texture_filter_anisotropic: TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE.
        final anisotropy = sampler.maxAnisotropy.clamp(1, maxAniso).toDouble();
        if (texture.webGl._lastAnisotropy != anisotropy) {
          texture.webGl._lastAnisotropy = anisotropy;
          gl.texParameterf(target, 0x84FE, anisotropy);
        }
      }
    }
  }

  void _clearBindings() {
    // Drops every per-draw resource binding, leaving the bound pipeline in
    // place (matching flutter_gpu, where the pipeline persists until the next
    // bindPipeline; the encoder skips rebinding a pipeline it already bound,
    // so nulling it here would leave later draws without one).
    //
    // Releasing the uniform blocks and texture units matters beyond tidiness.
    // They are GL context state rather than per-draw descriptors, so leaving
    // them attached lets a draw that should have rebound a slot read the
    // previous draw's resource and render correctly, which hides bind
    // lifetime bugs here that break on the native backends.
    if (_vao != null) {
      _gpuContext._state.bindVertexArray(null);
    }
    for (final binding in _boundUniformBlocks) {
      _gpuContext._state.bindBufferBase(
        web.WebGL2RenderingContext.UNIFORM_BUFFER,
        binding,
        null,
      );
    }
    _boundUniformBlocks.clear();
    _boundBlockBits = 0;
    for (final entry in _boundTextureUnits.entries) {
      _gpuContext._state.bindTexture(entry.key, entry.value, null);
    }
    _boundTextureUnits.clear();
    _inlineVertexBufferView = null;
    _indexBufferView = null;
    _pendingVertexBindings.clear();
  }

  void _setBlendEnable(bool enable) =>
      _gpuContext._state.setEnabled(web.WebGL2RenderingContext.BLEND, enable);

  void _setColorBlendEquation(ColorBlendEquation equation) {
    final gl = _gpuContext._state;
    gl.blendEquationSeparate(
      _glBlendOp(equation.colorBlendOperation),
      _glBlendOp(equation.alphaBlendOperation),
    );
    gl.blendFuncSeparate(
      _glBlendFactor(equation.sourceColorBlendFactor),
      _glBlendFactor(equation.destinationColorBlendFactor),
      _glBlendFactor(equation.sourceAlphaBlendFactor),
      _glBlendFactor(equation.destinationAlphaBlendFactor),
    );
  }

  void _setDepthWrite(bool enable) {
    if (!_depthless) _gpuContext._state.depthMask(enable);
  }

  // GL skips depth writes while the test is disabled, so `always` keeps the
  // test on with GL_ALWAYS, as Impeller's GLES backend does.
  void _setDepthCompare(CompareFunction compare) {
    if (_depthless) return;
    _gpuContext._state
      ..enable(web.WebGL2RenderingContext.DEPTH_TEST)
      ..depthFunc(_glCompare(compare));
  }

  StencilConfig _stencilFront = StencilConfig();
  StencilConfig _stencilBack = StencilConfig();
  int _stencilReference = 0;

  void _setStencilReference(int value) {
    _stencilReference = value;
    _applyStencil();
  }

  void _setStencilConfig(StencilConfig configuration, StencilFace face) {
    if (face != StencilFace.back) _stencilFront = configuration;
    if (face != StencilFace.front) _stencilBack = configuration;
    _applyStencil();
  }

  static bool _stencilInactive(StencilConfig c) =>
      c.compareFunction == CompareFunction.always &&
      c.stencilFailureOperation == StencilOperation.keep &&
      c.depthFailureOperation == StencilOperation.keep &&
      c.depthStencilPassOperation == StencilOperation.keep;

  // GL holds the stencil state globally; the test is only enabled while a
  // config can reject or write, as Impeller's GLES backend does.
  void _applyStencil() {
    final gl = _gpuContext._state;
    if (_depthless ||
        (_stencilInactive(_stencilFront) && _stencilInactive(_stencilBack))) {
      gl.disable(web.WebGL2RenderingContext.STENCIL_TEST);
      return;
    }
    gl.enable(web.WebGL2RenderingContext.STENCIL_TEST);
    _applyStencilFace(web.WebGL2RenderingContext.FRONT, _stencilFront);
    _applyStencilFace(web.WebGL2RenderingContext.BACK, _stencilBack);
  }

  void _applyStencilFace(int face, StencilConfig config) {
    _gpuContext._state
      ..stencilFuncSeparate(
        face,
        _glCompare(config.compareFunction),
        _stencilReference,
        config.readMask & 0xFF,
      )
      ..stencilOpSeparate(
        face,
        _glStencilOp(config.stencilFailureOperation),
        _glStencilOp(config.depthFailureOperation),
        _glStencilOp(config.depthStencilPassOperation),
      )
      ..stencilMaskSeparate(face, config.writeMask & 0xFF);
  }

  void _setCullMode(CullMode cullMode) {
    final gl = _gpuContext._state;
    switch (cullMode) {
      case CullMode.none:
        gl.disable(web.WebGL2RenderingContext.CULL_FACE);
      case CullMode.frontFace:
        gl.enable(web.WebGL2RenderingContext.CULL_FACE);
        gl.cullFace(web.WebGL2RenderingContext.FRONT);
      case CullMode.backFace:
        gl.enable(web.WebGL2RenderingContext.CULL_FACE);
        gl.cullFace(web.WebGL2RenderingContext.BACK);
    }
  }

  void _configureInlineVertexBuffer(int vertexCount) {
    final pipeline = _boundPipeline;
    final bufferView = _inlineVertexBufferView;
    if (pipeline == null || bufferView == null) return;
    final gl = _gpuContext._gl;
    final location = gl.getAttribLocation(pipeline._program, 'position');
    if (location < 0) {
      throw Exception(
        'RenderPipeline has no `position` attribute and no reflected '
        'vertex inputs. Use a ShaderLibrary built from a bundle for '
        'pipelines with non-trivial vertex layouts.',
      );
    }
    final perVertex = bufferView.lengthInBytes ~/ vertexCount;
    final components = perVertex ~/ 4;
    bufferView.buffer.webGl._bindForTarget(
      web.WebGL2RenderingContext.ARRAY_BUFFER,
    );
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      components,
      web.WebGL2RenderingContext.FLOAT,
      false,
      perVertex,
      bufferView.offsetInBytes,
    );
  }

  void _draw(int vertexCount, int instanceCount) {
    final gl = _gpuContext._gl;
    if (_boundPipeline == null) {
      throw StateError('draw called before bindPipeline');
    }
    if (vertexCount == 0 || instanceCount == 0) return;
    _gpuContext._sendHeld();
    _applyVertexState(needsIndex: false);
    _configureInlineVertexBuffer(vertexCount);
    if (instanceCount != 1) {
      gl.drawArraysInstanced(
        _glPrimitiveType(_primitiveType),
        0,
        vertexCount,
        instanceCount,
      );
    } else {
      gl.drawArrays(_glPrimitiveType(_primitiveType), 0, vertexCount);
    }
  }

  void _drawIndexed(int indexCount, int instanceCount) {
    final gl = _gpuContext._gl;
    if (_boundPipeline == null) {
      throw StateError('drawIndexed called before bindPipeline');
    }
    if (_inlineVertexBufferView != null) {
      throw StateError('Indexed inline pipelines require reflected attributes');
    }
    if (indexCount == 0 || instanceCount == 0) return;
    _gpuContext._sendHeld();
    final indexView = _indexBufferView;
    if (indexView == null) {
      throw StateError('drawIndexed called before bindIndexBuffer');
    }
    _applyVertexState(needsIndex: true);
    final glIndexType = _indexType == IndexType.int16
        ? web.WebGL2RenderingContext.UNSIGNED_SHORT
        : web.WebGL2RenderingContext.UNSIGNED_INT;
    if (instanceCount != 1) {
      gl.drawElementsInstanced(
        _glPrimitiveType(_primitiveType),
        indexCount,
        glIndexType,
        indexView.offsetInBytes,
        instanceCount,
      );
    } else {
      gl.drawElements(
        _glPrimitiveType(_primitiveType),
        indexCount,
        glIndexType,
        indexView.offsetInBytes,
      );
    }
  }
}
