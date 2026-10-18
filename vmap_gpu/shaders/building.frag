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
    // Sampled between texels wrapped within the pattern, as MapLibre's
    // atlas pads a pattern with a texel of itself, so the repeat leaves
    // no seam of its neighbours in the sheet.
    vec2 size = v_rect.zw;
    vec2 t = mod(v_uv, size) - 0.5;
    vec2 i0 = floor(t);
    vec2 f = t - i0;
    vec2 a = (v_rect.xy + mod(i0, size) + 0.5) / sheet_info.sheet_size.xy;
    vec2 b = (v_rect.xy + mod(i0 + 1.0, size) + 0.5) / sheet_info.sheet_size.xy;
    vec4 pattern = mix(
      mix(texture(sprite_sheet, a), texture(sprite_sheet, vec2(b.x, a.y)), f.x),
      mix(texture(sprite_sheet, vec2(a.x, b.y)), texture(sprite_sheet, b), f.x),
      f.y);
    frag_color = pattern * vec4(v_color.rgb, 1.0) * v_color.a;
    return;
  }
  frag_color = vec4(v_color.rgb * v_color.a, v_color.a);
}
