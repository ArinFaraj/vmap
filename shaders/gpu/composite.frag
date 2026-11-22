in vec2 v_uv;

// x: the opacity the image is laid at. y: an alpha with no colour added to
// every pixel, which a blend that scales what is below by it dims with.
uniform CompositeInfo {
  vec4 info;
}
composite_info;

uniform sampler2D layer;
out vec4 frag_color;

// An image drawn whole, laid over what is below at an opacity: premultiplied
// colour, so scaling all four channels fades it.
void main() {
  frag_color = texture(layer, v_uv) * composite_info.info.x +
      vec4(0.0, 0.0, 0.0, composite_info.info.y);
}
