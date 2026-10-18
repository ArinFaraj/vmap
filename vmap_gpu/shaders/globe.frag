in vec2 v_uv;
in vec4 v_bounds;
in float v_opacity;

uniform sampler2D drape;
out vec4 frag_color;

void main() {
  // Kept half a texel inside the tile's slot, so linear filtering does not
  // reach into the next slot.
  frag_color = texture(drape, clamp(v_uv, v_bounds.xy, v_bounds.zw)) * v_opacity;
}
