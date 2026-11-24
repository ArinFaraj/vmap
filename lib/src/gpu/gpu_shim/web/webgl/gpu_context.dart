part of '_webgl.dart';

/// Global graphics context. Lazily creates a shared canvas +
/// `WebGL2RenderingContext` the first time it's accessed; all resources
/// (buffers, textures, pipelines) live in this context.
///
/// Mirrors `package:flutter_gpu`'s `GpuContext`. The shim's web GpuContext
/// is `base class`-shaped for API parity but doesn't extend any
/// platform-specific native wrapper.
final class WebGlContext extends GpuContext {
  WebGlContext._createDefault() {
    // antialias:false makes the default framebuffer single-sampled, so we
    // can blitFramebuffer single-sample render targets onto it for present.
    // Without preserveDrawingBuffer, transferToImageBitmap hands the canvas's
    // buffer over instead of copying it: every snapshot blits fresh content
    // first, and the copy cost Chrome about 0.7 ms of GPU time an image.
    final attrs = web.WebGLContextAttributes(
      antialias: false,
      alpha: true,
      depth: _presenter.framesInCanvas,
      stencil: _presenter.framesInCanvas,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    );
    final gl =
        _canvas.getContext('webgl2', attrs) as web.WebGL2RenderingContext?;
    if (gl == null) {
      throw StateError(
        'WebGL2 is not available. Cannot initialize flutter_gpu_shim.',
      );
    }
    _gl = gl;
    // Enabled before any compile: the browser then compiles and links on
    // threads of its own, and a program's status can be polled instead of
    // waited on (WebGlRenderPipeline.isLinkComplete).
    _parallelShaderCompile =
        _gl.getExtension('KHR_parallel_shader_compile') != null;
    // Uploads are tightly packed, as Flutter GPU takes them. GL's default
    // row alignment of 4 skews a one or two byte texel texture whose rows
    // are not a multiple of four bytes.
    _gl.pixelStorei(web.WebGL2RenderingContext.UNPACK_ALIGNMENT, 1);
    // Cache extensions we rely on for later phases.
    _gl.getExtension('EXT_color_buffer_float');
    _gl.getExtension('OES_texture_float_linear');
    // Anisotropic filtering. MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF.
    if (_gl.getExtension('EXT_texture_filter_anisotropic') != null) {
      _maxSupportedAnisotropy = _integerParameter(0x84FF) ?? 1;
    }
    // Clip-space depth in [0, 1], as Metal and Vulkan rasterize it. The
    // bundles' GLES shaders end by remapping z to [-1, 1] for core GL, which
    // the loader strips while this is on (see stripClipSpaceDepthRemap); with
    // both, a float depth buffer stores clip depth directly, so reversed
    // depth keeps its precision. Without the extension the remap stays and
    // depth is 24-bit, which renders the same with standard precision.
    final clipControl =
        _gl.getExtension('EXT_clip_control') as _ExtClipControl?;
    if (clipControl != null) {
      // LOWER_LEFT_EXT keeps the default origin, ZERO_TO_ONE_EXT the range.
      clipControl.clipControlEXT(0x8CA1, 0x935F);
      _clipDepthZeroToOne = true;
    }
  }

  final _Presenter _presenter = _Presenter();
  _Canvas get _canvas => _presenter.canvas;

  bool _clipDepthZeroToOne = false;

  bool _parallelShaderCompile = false;

  /// Whether clip-space depth spans `[0, 1]` (EXT_clip_control), so GLES
  /// shaders run without their `[-1, 1]` depth remap.
  bool get clipDepthZeroToOne => _clipDepthZeroToOne;

  late final web.WebGL2RenderingContext _gl;
  late final _GlState _state = _GlState(_gl);

  final List<_WebGlCompletion> _completions = [];
  List<CompletionCallback> _unfenced = [];
  Timer? _completionPoll;

  /// Calls [callback] once the GPU has finished what was submitted so far.
  /// Submissions of one turn share a fence, set after the turn's last
  /// command.
  void _enqueueCompletion(CompletionCallback callback) {
    // The root zone keeps a test's fake clock from owning the shared poll.
    if (_unfenced.isEmpty) Zone.root.scheduleMicrotask(_fence);
    final zone = Zone.current;
    _unfenced.add(
      identical(zone, Zone.root)
          ? callback
          : zone.bindUnaryCallbackGuarded(callback),
    );
  }

  void _fence() {
    final callbacks = _unfenced;
    _unfenced = [];
    final sync = _gl.fenceSync(
      web.WebGL2RenderingContext.SYNC_GPU_COMMANDS_COMPLETE,
      0,
    );
    if (sync == null) {
      Zone.root.createTimer(Duration.zero, () {
        for (final callback in callbacks) {
          callback(CompletionStatus.error);
        }
      });
      return;
    }
    _completions.add(_WebGlCompletion(sync, callbacks));
    _gl.flush();
    _completionPoll ??= Zone.root.createTimer(Duration.zero, _poll);
  }

  void _poll() {
    _completionPoll = null;
    var done = 0;
    List<(List<CompletionCallback>, CompletionStatus)>? ready;
    for (final pending in _completions) {
      // A WebGL 2 fence signals only after a return to the event loop, and
      // a wait of 0 never blocks.
      final result = _gl.clientWaitSync(pending.sync, 0, 0);
      if (result == web.WebGL2RenderingContext.TIMEOUT_EXPIRED) break;
      _gl.deleteSync(pending.sync);
      (ready ??= []).add((
        pending.callbacks,
        result == web.WebGL2RenderingContext.WAIT_FAILED
            ? CompletionStatus.error
            : CompletionStatus.successful,
      ));
      done++;
    }
    _completions.removeRange(0, done);
    if (ready != null) {
      for (final (callbacks, status) in ready) {
        for (final callback in callbacks) {
          callback(status);
        }
      }
    }
    if (_completions.isNotEmpty) {
      _completionPoll ??= Zone.root.createTimer(
        const Duration(milliseconds: 1),
        _poll,
      );
    }
  }

  /// Cached vertex-array objects keyed by (pipeline, vertex streams, index
  /// buffer), in least-recently-used order; see _PassExecutor._applyVertexState.
  static const int _kMaxCachedVaos = 512;
  final Map<_VaoKey, _CachedVao> _vaoCache = {};

  /// The key a draw fills in to look its vertex array up, kept so a draw
  /// allocates none.
  final _VaoKey _vaoProbe = _VaoKey();

  /// Counts vertex array uses, to tell which were used longest ago.
  int _vaoClock = 0;

  /// Deletes the quarter of the cached vertex arrays used longest ago.
  void _dropOldVaos() {
    final byAge = _vaoCache.entries.toList()
      ..sort((a, b) => a.value.used - b.value.used);
    for (final entry in byAge.take(_kMaxCachedVaos ~/ 4)) {
      _vaoCache.remove(entry.key);
      _state.deleteVertexArray(entry.value.vao);
    }
  }

  int _maxSupportedAnisotropy = 1;

  /// The device's maximum supported anisotropy (1 when the extension is
  /// unavailable, which disables anisotropic filtering).
  int get maxSupportedAnisotropy => _maxSupportedAnisotropy;

  /// The underlying canvas, an `OffscreenCanvas` in Chromium and an
  /// `HTMLCanvasElement` elsewhere. Resized on demand by `snapshot`.
  JSObject get canvas => _canvas;

  /// The underlying WebGL2 context. Exposed for advanced consumers and the
  /// shim's own internal tests.
  web.WebGL2RenderingContext get gl => _gl;

  @override
  PixelFormat get defaultColorFormat => PixelFormat.r8g8b8a8UNormInt;

  @override
  PixelFormat get defaultStencilFormat => PixelFormat.s8UInt;

  // Forward depth (shadow maps, masks) gains nothing from float, so only
  // _reversedDepthStencilFormat pays for it.
  @override
  PixelFormat get defaultDepthStencilFormat => PixelFormat.d24UnormS8Uint;

  @override
  int get minimumUniformByteAlignment => 256;

  @override
  bool get doesSupportOffscreenMSAA => true;

  // WebGL2 framebufferTexture2D accepts any allocated mip level.
  @override
  bool get doesSupportFramebufferRenderMipmap => true;

  // texStorage2D allocates complete mip chains; per-level overwrite plus
  // mipmap min filters sample correctly.
  @override
  bool get doesSupportManuallyMippedTextures => true;

  final Map<TextureCompressionFamily, bool> _compressionSupport = {};

  /// Reports block-compression support by probing (and enabling) the matching
  /// WebGL2 compressed-texture extension. Enabling it here makes the compressed
  /// internal formats valid for the `createTexture` / `overwrite` upload path.
  @override
  bool supportsTextureCompression(TextureCompressionFamily family) {
    return _compressionSupport.putIfAbsent(family, () {
      final name = switch (family) {
        TextureCompressionFamily.bc => 'WEBGL_compressed_texture_s3tc',
        TextureCompressionFamily.etc2 => 'WEBGL_compressed_texture_etc',
        TextureCompressionFamily.astc => 'WEBGL_compressed_texture_astc',
        // No WebGL extension exposes the ASTC HDR profile.
        TextureCompressionFamily.astcHdr => null,
      };
      return name != null && _gl.getExtension(name) != null;
    });
  }

  /// Texture unit reserved for creation and upload binds, above any unit
  /// [RenderPass.bindTexture] assigns. GL texture bindings are global per
  /// unit, so a texture created or uploaded between a pass's binds and its
  /// draw (a lazily built placeholder, say) would otherwise replace the
  /// texture the pass bound on the active unit, a hazard Impeller's
  /// per-draw binding model does not have.
  late final int _setupTextureUnit =
      (_integerParameter(
            web.WebGL2RenderingContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
          ) ??
          32) -
      1;

  /// The largest texture side the context allocates, or null when the query
  /// yields no number.
  late final int? _maxTextureSize = _integerParameter(
    web.WebGL2RenderingContext.MAX_TEXTURE_SIZE,
  );

  /// An integer `getParameter` result, or null when it is not a number. Read
  /// as a JS value: under dart2wasm the result is not a Dart `num`, so an
  /// `is num` check silently takes the fallback.
  int? _integerParameter(int pname) {
    final JSAny? value = _gl.getParameter(pname);
    return value.isA<JSNumber>() ? (value as JSNumber).toDartInt : null;
  }

  late final _MipGenerator _mipGenerator = _MipGenerator(this);

  /// Binds [texture] on the reserved setup unit for creation or upload work.
  void _bindTextureForSetup(int target, web.WebGLTexture? texture) {
    _state
      ..useUnit(_setupTextureUnit)
      ..bindTexture(_setupTextureUnit, target, texture);
  }

  @override
  DeviceBuffer createDeviceBuffer(StorageMode storageMode, int sizeInBytes) {
    if (storageMode == StorageMode.deviceTransient) {
      throw Exception(
        'DeviceBuffers cannot be set to StorageMode.deviceTransient',
      );
    }
    return WebGlDeviceBuffer._initialize(this, storageMode, sizeInBytes);
  }

  /// Web-only. A host-visible buffer committed to ONE GL role: vertex
  /// (`index: false`) or index (`index: true`) data. Skips the staging mirror
  /// and the lazy first-bind upload a generic buffer needs; see
  /// [WebGlDeviceBuffer._initializeTyped]. [_createGeometryBuffers] is built from
  /// it, and so can a caller that manages its own [BufferView]s.
  ///
  /// The GL store is hinted STATIC_DRAW, which suits geometry written once at
  /// creation. A geometry uploaded repeatedly (CPU morph blending re-uploads
  /// on every weight change) allocates fresh buffers per upload rather than
  /// rewriting these, so each one is still written once.
  // TODO(web-buffers): Reuse a geometry's buffers when it re-uploads at the
  // same size, instead of allocating a new pair and dropping the old one.
  DeviceBuffer createTypedDeviceBuffer(int sizeInBytes, {required bool index}) {
    return WebGlDeviceBuffer._initializeTyped(
      this,
      sizeInBytes,
      index
          ? web.WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER
          : web.WebGL2RenderingContext.ARRAY_BUFFER,
    );
  }

  /// Web-only. A vertex-role buffer rewritten often, such as uniform data
  /// written for every draw, hinted DYNAMIC_DRAW: a STATIC_DRAW store
  /// rewritten that often makes ANGLE copy it on each write.
  DeviceBuffer createUniformBuffer(int sizeInBytes) =>
      WebGlDeviceBuffer._initializeTyped(
        this,
        sizeInBytes,
        web.WebGL2RenderingContext.ARRAY_BUFFER,
        usage: web.WebGL2RenderingContext.DYNAMIC_DRAW,
        held: true,
      );

  /// The calls of [_openPass], the pass being recorded, which issues them
  /// when it ends, another pass begins, or something reads what it draws.
  final _PassRecord _record = _PassRecord();
  WebGlRenderPass? _openPass;

  /// The pass whose framebuffer is bound, null once anything else binds one.
  _PassExecutor? _boundPass;

  void _flushPass() {
    final pass = _openPass;
    if (pass == null) return;
    _openPass = null;
    pass._issue();
  }

  /// Readies the context for GL calls made outside a pass: the pass being
  /// recorded is issued first, and the framebuffer a pass bound is taken
  /// to be lost. A frame drawn in the canvas goes to its texture before
  /// work that reads [reads] there, or that [usesCanvas].
  void _leavePass({Texture? reads, bool usesCanvas = false}) {
    if (reads != null || usesCanvas) _presenter.spill(this, only: reads);
    _flushPass();
    _boundPass = null;
  }

  /// Uniform buffers written since the last upload, each to be sent once.
  final List<WebGlDeviceBuffer> _held = [];

  void _sendHeld() {
    for (final buffer in _held) {
      buffer._sendHeld();
    }
    _held.clear();
  }

  @override
  DeviceBuffer createDeviceBufferWithCopy(ByteData data) {
    final buffer = WebGlDeviceBuffer._initialize(
      this,
      StorageMode.hostVisible,
      data.lengthInBytes,
    );
    buffer.overwrite(data);
    return buffer;
  }

  @override
  HostBuffer createHostBuffer({
    int blockLengthInBytes = HostBuffer.kDefaultBlockLengthInBytes,
  }) {
    return WebGlHostBuffer._initialize(
      this,
      blockLengthInBytes: blockLengthInBytes,
    );
  }

  @override
  Texture createTexture(
    StorageMode storageMode,
    int width,
    int height, {
    PixelFormat format = PixelFormat.r8g8b8a8UNormInt,
    int sampleCount = 1,
    TextureType? textureType,
    bool enableRenderTargetUsage = true,
    bool enableShaderReadUsage = true,
    bool enableShaderWriteUsage = false,
    int mipLevelCount = 1,
  }) {
    final resolvedType =
        textureType ??
        (sampleCount == 1
            ? TextureType.texture2D
            : TextureType.texture2DMultisample);
    return WebGlTexture._initialize(
      this,
      storageMode,
      format,
      width,
      height,
      sampleCount,
      resolvedType,
      enableRenderTargetUsage,
      enableShaderReadUsage,
      enableShaderWriteUsage,
      mipLevelCount,
    );
  }

  @override
  CommandBuffer createCommandBuffer() => WebGlCommandBuffer._(this);

  // Linked-program cache. Program linking is expensive and some callers
  // create a pipeline per draw per frame; native flutter_gpu absorbs that,
  // so the shim must too. Keyed by shader identity plus compile generation,
  // so a hot-reloaded shader relinks while untouched pairs stay cached.
  final Map<(WebGlShader, WebGlShader, int, int), WebGlRenderPipeline>
  _pipelineCache = {};

  @override
  RenderPipeline createRenderPipeline(
    Shader vertexShader,
    Shader fragmentShader, {
    VertexLayout? vertexLayout,
  }) {
    final vertex = vertexShader.webGl;
    final fragment = fragmentShader.webGl;
    if (vertexLayout != null) {
      // Custom layouts are rare (inline smoke pipelines); don't cache.
      return WebGlRenderPipeline._(
        this,
        vertex,
        fragment,
        vertexLayout: vertexLayout,
      );
    }
    final key = (vertex, fragment, vertex._generation, fragment._generation);
    final cached = _pipelineCache[key];
    if (cached != null) return cached;
    if (_pipelineCache.length >= 512) {
      // Far above any realistic working set; clearing keeps stale
      // hot-reload generations from accumulating without bookkeeping.
      _leavePass();
      for (final pipeline in _pipelineCache.values) {
        _state.deleteProgram(pipeline._program);
      }
      _pipelineCache.clear();
    }
    return _pipelineCache[key] = WebGlRenderPipeline._(this, vertex, fragment);
  }

  // Framebuffer cache, keyed by the attachment textures, so the synchronous
  // checkFramebufferStatus round trip runs once per attachment combination
  // and not once a pass. Releasing a texture drops its entries; the capacity
  // only bounds targets dropped without a release, and evicts the least
  // recently used, so a frame's working set stays.
  static const _framebufferCacheCapacity = 256;
  final Map<(Texture, int, int, Texture?), web.WebGLFramebuffer>
  _framebufferCache = {};

  web.WebGLFramebuffer _framebufferFor(
    Texture color,
    int mipLevel,
    int slice,
    Texture? depth,
  ) {
    final key = (color, mipLevel, slice, depth);
    // Inserting again moves the entry last, so the first is the one used
    // longest ago.
    final cached = _framebufferCache.remove(key);
    if (cached != null) return _framebufferCache[key] = cached;
    if (_framebufferCache.length >= _framebufferCacheCapacity) {
      final oldest = _framebufferCache.keys.first;
      _gl.deleteFramebuffer(_framebufferCache.remove(oldest));
    }
    return _framebufferCache[key] = _createFramebuffer(
      color,
      mipLevel,
      slice,
      depth,
    );
  }

  web.WebGLFramebuffer _createFramebuffer(
    Texture color,
    int mipLevel,
    int slice,
    Texture? depth,
  ) {
    final gl = _gl;
    final fbo = gl.createFramebuffer();
    if (fbo == null) {
      throw StateError('Failed to create WebGL framebuffer');
    }
    gl.bindFramebuffer(web.WebGL2RenderingContext.FRAMEBUFFER, fbo);

    if (color.sampleCount == 1) {
      // For a cube the attachment target is the face; for 2D it is TEXTURE_2D.
      gl.framebufferTexture2D(
        web.WebGL2RenderingContext.FRAMEBUFFER,
        web.WebGL2RenderingContext.COLOR_ATTACHMENT0,
        color.webGl.glSliceTarget(slice),
        color.webGl.glTexture,
        mipLevel,
      );
    } else {
      assert(
        mipLevel == 0,
        'Multisampled attachments cannot target a mip level',
      );
      gl.framebufferRenderbuffer(
        web.WebGL2RenderingContext.FRAMEBUFFER,
        web.WebGL2RenderingContext.COLOR_ATTACHMENT0,
        web.WebGL2RenderingContext.RENDERBUFFER,
        color.webGl.glRenderbuffer,
      );
    }

    if (depth != null) {
      if (depth.sampleCount == 1) {
        gl.framebufferTexture2D(
          web.WebGL2RenderingContext.FRAMEBUFFER,
          web.WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT,
          web.WebGL2RenderingContext.TEXTURE_2D,
          depth.webGl.glTexture,
          0,
        );
      } else {
        gl.framebufferRenderbuffer(
          web.WebGL2RenderingContext.FRAMEBUFFER,
          web.WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT,
          web.WebGL2RenderingContext.RENDERBUFFER,
          depth.webGl.glRenderbuffer,
        );
      }
    }

    final status = gl.checkFramebufferStatus(
      web.WebGL2RenderingContext.FRAMEBUFFER,
    );
    if (status != web.WebGL2RenderingContext.FRAMEBUFFER_COMPLETE) {
      throw Exception(
        'Framebuffer incomplete (status 0x${status.toRadixString(16)})',
      );
    }
    return fbo;
  }

  /// Snapshot the underlying canvas into a `ui.Image` for display
  /// in a Flutter widget. The canvas is resized if [width] / [height] differ
  /// from its current dimensions. Web-specific addition; not in flutter_gpu.
  Future<ui.Image> snapshot({
    required int width,
    required int height,
    bool transferOwnership = false,
  }) async {
    _leavePass(usesCanvas: true);
    if (_canvas.width != width) _canvas.width = width;
    if (_canvas.height != height) _canvas.height = height;
    return await ui_web.createImageFromTextureSource(
      _canvas,
      width: width,
      height: height,
      transferOwnership: transferOwnership,
    );
  }

  /// Blit a single-sample [texture]'s contents onto the underlying canvas,
  /// resizing it to match. Shared by the present paths.
  void _blitTextureToCanvas(Texture texture) {
    if (texture.sampleCount != 1) {
      throw UnimplementedError(
        'Cannot present an MSAA texture directly; use its resolve texture.',
      );
    }
    _leavePass(usesCanvas: true);
    if (_canvas.width != texture.width) _canvas.width = texture.width;
    if (_canvas.height != texture.height) _canvas.height = texture.height;

    final readFbo = _gl.createFramebuffer();
    if (readFbo == null) {
      throw StateError('Failed to create framebuffer for present blit');
    }
    _gl.bindFramebuffer(web.WebGL2RenderingContext.READ_FRAMEBUFFER, readFbo);
    _gl.framebufferTexture2D(
      web.WebGL2RenderingContext.READ_FRAMEBUFFER,
      web.WebGL2RenderingContext.COLOR_ATTACHMENT0,
      web.WebGL2RenderingContext.TEXTURE_2D,
      texture.webGl.glTexture,
      0,
    );
    _gl.bindFramebuffer(web.WebGL2RenderingContext.DRAW_FRAMEBUFFER, null);
    // A blit is clipped by the scissor, which the last pass may have left on.
    _state.disable(web.WebGL2RenderingContext.SCISSOR_TEST);
    // Flip vertically during the blit (dst Y runs height -> 0). WebGL2
    // rasterizes into FBO textures bottom-up, so the swapchain texture is
    // stored bottom-up; this flip presents it upright on the canvas. (The
    // engine's own backends store render-to-texture top-down, so flutter_scene
    // applies no Y compensation; this present-time flip is the shim absorbing
    // WebGL2's bottom-up FBO convention, equivalent to what Impeller's GLES
    // backend does in-engine.)
    _gl.blitFramebuffer(
      0,
      0,
      texture.width,
      texture.height,
      0,
      texture.height,
      texture.width,
      0,
      web.WebGL2RenderingContext.COLOR_BUFFER_BIT,
      web.WebGL2RenderingContext.NEAREST,
    );
    _gl.bindFramebuffer(web.WebGL2RenderingContext.FRAMEBUFFER, null);
    _gl.deleteFramebuffer(readFbo);
  }

  /// Synchronously snapshot [texture] into a `ui.Image`. Blits to the
  /// canvas, takes the canvas content out as an ImageBitmap,
  /// and wraps it. `transferToImageBitmap` and `createImageFromImageBitmap`
  /// are both synchronous on CanvasKit and Skwasm, so this works inside a
  /// synchronous paint callback - which is what flutter_scene's
  /// `Texture.asImage()` -> `canvas.drawImageRect` path needs.
  ui.Image snapshotTextureSync(Texture texture) {
    final bitmap = textureBitmap(texture);
    final result = ui_web.createImageFromImageBitmap(bitmap as JSAny);
    if (result is ui.Image) return result;
    throw StateError(
      'createImageFromImageBitmap returned a Future; expected a synchronous '
      'ui.Image on this renderer.',
    );
  }

  /// [texture] as an `ImageBitmap`, taken from the canvas.
  web.ImageBitmap textureBitmap(Texture texture) =>
      _presenter.bitmapOf(this, texture);

  /// Blit [texture] onto the canvas and return it as a `ui.Image` via
  /// `createImageFromTextureSource` (async copy path).
  Future<ui.Image> _presentTextureAsImage(
    Texture texture, {
    bool transferOwnership = false,
  }) async {
    _blitTextureToCanvas(texture);
    return ui_web.createImageFromTextureSource(
      _canvas,
      width: texture.width,
      height: texture.height,
      transferOwnership: transferOwnership,
    );
  }
}

/// The default graphics context. Lazily initialized.
final WebGlContext webGlContext = WebGlContext._createDefault();

/// Blit [texture]'s contents onto the GpuContext's `OffscreenCanvas` and
/// return it as a `ui.Image` for display in a Flutter widget. Web-only;
/// throws on native backends.
///
/// Bridge helper between offscreen-rendered Textures and Flutter widgets
/// until the swapchain / on-screen presentation story lands in Phase 5.
Future<ui.Image> _presentTextureAsImage(
  Texture texture, {
  bool transferOwnership = false,
}) => webGlContext._presentTextureAsImage(
  texture,
  transferOwnership: transferOwnership,
);

/// Writes mesh data into a buffer from [_createGeometryBuffers] (or an arena's).
/// [source] keeps its element type so the web backend can hand it to GL as-is;
/// see [DeviceBuffer.overwriteTypedData].
bool _writeGeometryData(
  DeviceBuffer buffer,
  TypedData source, {
  required int destinationOffsetInBytes,
}) => buffer.webGl.overwriteTypedData(
  source,
  destinationOffsetInBytes: destinationOffsetInBytes,
);

/// The depth-stencil format for passes that rasterize reversed depth (near
/// at 1, far at 0): float while EXT_clip_control puts clip depth in [0, 1],
/// else the context default, since under the `[-1, 1]` remap a float buffer
/// holds no more than 24 bits would.
PixelFormat get _reversedDepthStencilFormat => webGlContext.clipDepthZeroToOne
    ? PixelFormat.d32FloatS8UInt
    : webGlContext.defaultDepthStencilFormat;

/// The buffers one mesh upload needs: [vertexBytes] of vertex streams and
/// [indexBytes] of indices. On web they are two role-typed buffers, because
/// WebGL2 cannot share one buffer between the two roles and sharing one
/// [DeviceBuffer] costs a staging mirror and a second full upload.
/// [indexBaseOffset] is where the indices start inside [index].
({DeviceBuffer vertex, DeviceBuffer index, int indexBaseOffset})
_createGeometryBuffers(int vertexBytes, int indexBytes) {
  final vertex = webGlContext.createTypedDeviceBuffer(
    vertexBytes,
    index: false,
  );
  return (
    vertex: vertex,
    // Non-indexed geometry never binds an index buffer; do not allocate one.
    index: indexBytes == 0
        ? vertex
        : webGlContext.createTypedDeviceBuffer(indexBytes, index: true),
    indexBaseOffset: 0,
  );
}

/// `EXT_clip_control`, which sets the clip-space origin and depth range.
extension type _ExtClipControl._(JSObject _) implements JSObject {
  external void clipControlEXT(int origin, int depth);
}

/// A cached vertex array, when it was last used, and the buffer serial
/// and offset each of its instance-rate slots points at.
final class _CachedVao {
  _CachedVao(this.vao);

  final web.WebGLVertexArrayObject vao;
  int used = 0;
  Int32List _instanceAt = Int32List(0);

  /// Records that instance-rate [slot] reads buffer [serial] from
  /// [offset]; true when that moves it.
  bool moveInstance(int slot, int serial, int offset) {
    final at = slot * 2;
    if (at >= _instanceAt.length) {
      _instanceAt = Int32List(at + 2)
        ..fillRange(0, at + 2, -1)
        ..setRange(0, _instanceAt.length, _instanceAt);
    }
    if (_instanceAt[at] == serial && _instanceAt[at + 1] == offset) {
      return false;
    }
    _instanceAt[at] = serial;
    _instanceAt[at + 1] = offset;
    return true;
  }
}

/// What a vertex array was built for: a pipeline, then the serial, offset
/// and slot of each buffer that feeds it per vertex, then the index
/// buffer's serial and offset when it has one. Whole numbers compared as
/// they are: a key built as text hashed a string for every draw.
final class _VaoKey {
  WebGlRenderPipeline? _pipeline;
  Int32List _parts = Int32List(16);
  int _length = 0;

  void clear(WebGlRenderPipeline pipeline) {
    _pipeline = pipeline;
    _length = 0;
  }

  void stream(int serial, int offset, int slot) {
    _add(serial);
    _add(offset);
    _add(slot);
  }

  void indices(int serial, int offset) {
    _add(serial);
    _add(offset);
  }

  void _add(int part) {
    if (_length == _parts.length) {
      _parts = Int32List(_length * 2)..setRange(0, _length, _parts);
    }
    _parts[_length++] = part;
  }

  _VaoKey copy() => _VaoKey()
    .._pipeline = _pipeline
    .._parts = Int32List.fromList(Int32List.sublistView(_parts, 0, _length))
    .._length = _length;

  @override
  int get hashCode {
    var h = identityHashCode(_pipeline);
    for (var i = 0; i < _length; i++) {
      h = ((h ^ _parts[i]) * 0x9E3779B1) & 0x3fffffff;
    }
    return h;
  }

  @override
  bool operator ==(Object other) {
    if (other is! _VaoKey ||
        !identical(other._pipeline, _pipeline) ||
        other._length != _length) {
      return false;
    }
    for (var i = 0; i < _length; i++) {
      if (other._parts[i] != _parts[i]) return false;
    }
    return true;
  }
}
