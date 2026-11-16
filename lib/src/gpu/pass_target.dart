import 'package:vector_math/vector_math.dart' show Vector4;

import 'gpu_shim/gpu.dart' as gpu;

/// A texture passes draw into, and how every pass on it begins: with which
/// depth and stencil, and keeping what it held or cleared to nothing, so
/// that what is under its image shows where no layer is drawn.
///
/// On Vulkan Impeller keeps the first pass and framebuffer made for a
/// texture and begins every later pass on it as that one, whatever the
/// later pass asks for. So a texture has one target for as long as it
/// lives, and one more shape at most: drawn through [multisampled], which
/// Impeller keeps apart by its sample count.
class PassTarget {
  PassTarget(this.texture, {this.depth, this.keeps = false, this.multisampled});

  final gpu.Texture texture;

  /// The depth and stencil of a pass drawn straight into [texture].
  final gpu.Texture? depth;

  /// Whether a pass begins with what [texture] held, where it otherwise
  /// begins clear.
  final bool keeps;

  /// The samples a multisampled pass draws into and resolves from, and
  /// their depth and stencil.
  final ({gpu.Texture samples, gpu.Texture depth})? multisampled;

  /// A pass into [texture] recorded in [commands], through
  /// [multisampled] with [multisample].
  gpu.RenderPass begin(gpu.CommandBuffer commands, {bool multisample = false}) {
    final sampled = multisample ? multisampled : null;
    final depth = sampled?.depth ?? this.depth;
    return commands.createRenderPass(
      gpu.RenderTarget.singleColor(
        sampled == null
            ? gpu.ColorAttachment(
                texture: texture,
                loadAction: keeps ? gpu.LoadAction.load : gpu.LoadAction.clear,
                clearValue: Vector4.zero(),
              )
            : gpu.ColorAttachment(
                texture: sampled.samples,
                resolveTexture: texture,
                storeAction: gpu.StoreAction.multisampleResolve,
                clearValue: Vector4.zero(),
              ),
        depthStencilAttachment: depth == null
            ? null
            : gpu.DepthStencilAttachment(texture: depth, depthClearValue: 1),
      ),
    );
  }
}
