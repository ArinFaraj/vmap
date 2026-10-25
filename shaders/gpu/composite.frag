in vec2 v_uv;

// x: the opacity the image is laid at.
uniform CompositeInfo {
  vec4 info;
}
composite_info;

uniform sampler2D layer;
out vec4 frag_color;

// An image drawn whole, laid over what is below at an opacity: premultiplied
// colour, so scaling all four channels fades it.
void main() {
  frag_color = texture(layer, v_uv) * composite_info.info.x;
}
