part of '_webgl.dart';

// The GL minification filter for [sampler]. Mipmap modes apply only when
// the texture actually has mip levels; a mipmap MIN_FILTER on a
// single-level texture is incomplete in GL and samples black.
int _glMinFilter(SamplerOptions sampler, Texture texture) {
  final nearest = sampler.minFilter == MinMagFilter.nearest;
  if (texture.mipLevelCount <= 1) {
    return nearest
        ? web.WebGL2RenderingContext.NEAREST
        : web.WebGL2RenderingContext.LINEAR;
  }
  return switch ((nearest, sampler.mipFilter)) {
    (true, MipFilter.nearest) =>
      web.WebGL2RenderingContext.NEAREST_MIPMAP_NEAREST,
    (true, MipFilter.linear) =>
      web.WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR,
    (false, MipFilter.nearest) =>
      web.WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST,
    (false, MipFilter.linear) =>
      web.WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR,
  };
}

int _glAddressMode(SamplerAddressMode mode) {
  switch (mode) {
    case SamplerAddressMode.clampToEdge:
      return web.WebGL2RenderingContext.CLAMP_TO_EDGE;
    case SamplerAddressMode.repeat:
      return web.WebGL2RenderingContext.REPEAT;
    case SamplerAddressMode.mirror:
      return web.WebGL2RenderingContext.MIRRORED_REPEAT;
  }
}

int _glStencilOp(StencilOperation op) => switch (op) {
  StencilOperation.keep => web.WebGL2RenderingContext.KEEP,
  StencilOperation.zero => web.WebGL2RenderingContext.ZERO,
  StencilOperation.setToReferenceValue => web.WebGL2RenderingContext.REPLACE,
  StencilOperation.incrementClamp => web.WebGL2RenderingContext.INCR,
  StencilOperation.decrementClamp => web.WebGL2RenderingContext.DECR,
  StencilOperation.invert => web.WebGL2RenderingContext.INVERT,
  StencilOperation.incrementWrap => web.WebGL2RenderingContext.INCR_WRAP,
  StencilOperation.decrementWrap => web.WebGL2RenderingContext.DECR_WRAP,
};

int _glCompare(CompareFunction f) {
  switch (f) {
    case CompareFunction.never:
      return web.WebGL2RenderingContext.NEVER;
    case CompareFunction.always:
      return web.WebGL2RenderingContext.ALWAYS;
    case CompareFunction.less:
      return web.WebGL2RenderingContext.LESS;
    case CompareFunction.equal:
      return web.WebGL2RenderingContext.EQUAL;
    case CompareFunction.lessEqual:
      return web.WebGL2RenderingContext.LEQUAL;
    case CompareFunction.greater:
      return web.WebGL2RenderingContext.GREATER;
    case CompareFunction.notEqual:
      return web.WebGL2RenderingContext.NOTEQUAL;
    case CompareFunction.greaterEqual:
      return web.WebGL2RenderingContext.GEQUAL;
  }
}

int _glBlendOp(BlendOperation op) {
  switch (op) {
    case BlendOperation.add:
      return web.WebGL2RenderingContext.FUNC_ADD;
    case BlendOperation.subtract:
      return web.WebGL2RenderingContext.FUNC_SUBTRACT;
    case BlendOperation.reverseSubtract:
      return web.WebGL2RenderingContext.FUNC_REVERSE_SUBTRACT;
  }
}

int _glBlendFactor(BlendFactor f) {
  switch (f) {
    case BlendFactor.zero:
      return web.WebGL2RenderingContext.ZERO;
    case BlendFactor.one:
      return web.WebGL2RenderingContext.ONE;
    case BlendFactor.sourceColor:
      return web.WebGL2RenderingContext.SRC_COLOR;
    case BlendFactor.oneMinusSourceColor:
      return web.WebGL2RenderingContext.ONE_MINUS_SRC_COLOR;
    case BlendFactor.sourceAlpha:
      return web.WebGL2RenderingContext.SRC_ALPHA;
    case BlendFactor.oneMinusSourceAlpha:
      return web.WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA;
    case BlendFactor.destinationColor:
      return web.WebGL2RenderingContext.DST_COLOR;
    case BlendFactor.oneMinusDestinationColor:
      return web.WebGL2RenderingContext.ONE_MINUS_DST_COLOR;
    case BlendFactor.destinationAlpha:
      return web.WebGL2RenderingContext.DST_ALPHA;
    case BlendFactor.oneMinusDestinationAlpha:
      return web.WebGL2RenderingContext.ONE_MINUS_DST_ALPHA;
    case BlendFactor.sourceAlphaSaturated:
      return web.WebGL2RenderingContext.SRC_ALPHA_SATURATE;
    case BlendFactor.blendColor:
      return web.WebGL2RenderingContext.CONSTANT_COLOR;
    case BlendFactor.oneMinusBlendColor:
      return web.WebGL2RenderingContext.ONE_MINUS_CONSTANT_COLOR;
    case BlendFactor.blendAlpha:
      return web.WebGL2RenderingContext.CONSTANT_ALPHA;
    case BlendFactor.oneMinusBlendAlpha:
      return web.WebGL2RenderingContext.ONE_MINUS_CONSTANT_ALPHA;
  }
}

int _glPrimitiveType(PrimitiveType p) {
  switch (p) {
    case PrimitiveType.triangle:
      return web.WebGL2RenderingContext.TRIANGLES;
    case PrimitiveType.triangleStrip:
      return web.WebGL2RenderingContext.TRIANGLE_STRIP;
    case PrimitiveType.line:
      return web.WebGL2RenderingContext.LINES;
    case PrimitiveType.lineStrip:
      return web.WebGL2RenderingContext.LINE_STRIP;
    case PrimitiveType.point:
      return web.WebGL2RenderingContext.POINTS;
  }
}
