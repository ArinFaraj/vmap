uniform SdfFrame {
  vec4 screen;
  vec4 atlas;
}
sdf_frame;

uniform sampler2D glyphs;
uniform sampler2D sprites;

in vec2 v_uv;
in vec4 v_ink;
in vec4 v_halo;
// x: halo width and y: halo blur in logical pixels; z: logical pixels a
// glyph or icon pixel; w: how much farther than the screen's middle it
// lies.
in vec4 v_params;
// An icon's place in the sprite sheet, left, top, right and bottom in
// texels: clear past it, as MapLibre pads its icons.
in vec4 v_clip;
// x: 0 a glyph, 1 a distance field icon, 2 any other icon; y: 1 sampled
// between texels.
in vec4 v_kind;

out vec4 frag_color;

const float SDF_PX = 8.0;

vec4 sheet_texel(vec2 t) {
  if (t.x < v_clip.x || t.y < v_clip.y || t.x >= v_clip.z || t.y >= v_clip.w) {
    return vec4(0.0);
  }
  return texture(sprites, (t + 0.5) / sdf_frame.atlas.zw);
}

vec4 sheet(vec2 p) {
  if (v_kind.y > 0.5) {
    vec2 q = p - 0.5;
    vec2 i = floor(q);
    vec2 f = q - i;
    return mix(
      mix(sheet_texel(i), sheet_texel(i + vec2(1.0, 0.0)), f.x),
      mix(sheet_texel(i + vec2(0.0, 1.0)), sheet_texel(i + vec2(1.0, 1.0)), f.x),
      f.y);
  }
  return sheet_texel(floor(p));
}

// MapLibre's symbol_sdf and symbol_icon fragment shaders.
void main() {
  if (v_kind.x > 1.5) {
    // Drawn once, in the pass that draws glyphs.
    if (sdf_frame.screen.w < 1.5) {
      discard;
    }
    frag_color = sheet(v_uv) * v_ink.a;
    return;
  }
  float mode = sdf_frame.screen.w;
  float EDGE_GAMMA = 0.105 / sdf_frame.screen.z;
  float font_scale = v_params.z;
  float gamma_scale = v_params.w;
  float gamma = EDGE_GAMMA / (font_scale * gamma_scale);
  float inner_edge = (256.0 - 64.0) / 256.0;
  float dist = v_kind.x > 0.5 ? sheet(v_uv).a : texture(glyphs, v_uv).r;
  vec4 text = vec4(0.0);
  vec4 ring = vec4(0.0);
  if (mode > 1.5) {
    float gamma_scaled = gamma * gamma_scale;
    float alpha = smoothstep(inner_edge - gamma_scaled, inner_edge + gamma_scaled, dist);
    text = alpha * v_ink;
  }
  if (abs(mode - 2.0) > 0.5 && v_halo.a > 0.0) {
    float gamma_halo = (v_params.y * 1.19 / SDF_PX + EDGE_GAMMA) / (font_scale * gamma_scale);
    float inner_edge_halo = inner_edge + gamma_halo * gamma_scale;
    float gamma_scaled_halo = gamma_halo * gamma_scale;
    float alpha_halo = smoothstep(inner_edge_halo - gamma_scaled_halo, inner_edge_halo + gamma_scaled_halo, dist);
    float halo_edge = (6.0 - v_params.x / font_scale) / SDF_PX;
    alpha_halo = min(smoothstep(halo_edge - gamma_scaled_halo, halo_edge + gamma_scaled_halo, dist), 1.0 - alpha_halo);
    ring = alpha_halo * v_halo;
  }
  if (mode > 2.5) {
    frag_color = text + (1.0 - text.a) * ring;
  } else if (mode < 1.5) {
    frag_color = ring;
  } else {
    frag_color = text;
  }
}
