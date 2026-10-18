in vec4 v_color;
in vec2 v_uv;
in vec4 v_rect;
out vec4 frag_color;

// The sprite sheet's width and height.
uniform SheetInfo {
  vec4 sheet_size;
}
sheet_info;

uniform sampler2D sprite_sheet;

void main() {
  if (v_rect.z < 0.0) {
    discard;
  }
  if (v_rect.z > 0.0) {
    vec2 at = v_rect.xy + mod(v_uv, v_rect.zw);
    vec4 pattern = texture(sprite_sheet, at / sheet_info.sheet_size.xy);
    frag_color = pattern * vec4(v_color.rgb, 1.0) * v_color.a;
    return;
  }
  frag_color = vec4(v_color.rgb * v_color.a, v_color.a);
}
