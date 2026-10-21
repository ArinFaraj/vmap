in vec4 v_color;
in vec3 v_dash;
in vec4 v_dash_before;
in vec4 v_pattern;
in vec3 v_uv;
in vec4 v_circle;
in vec3 v_edge;
in vec2 v_line;
in vec3 v_clip;
in vec3 v_outline;

// The sprite sheet's width and height, then the gradient texture's.
uniform FragInfo {
  vec4 sheet_size;
}
frag_info;

uniform sampler2D sprite_sheet;
uniform sampler2D gradient_ramp;
out vec4 frag_color;

// The signed distance to a dashed line's nearest dash end, in device
// pixels: dash.x is how many repeats along, dash.y the ramp row, which
// holds the distance as a share of a repeat, and dash.z the repeat in
// device pixels.
float dash_distance(vec3 dash) {
  return (texture(gradient_ramp, vec2(fract(dash.x), dash.y)).r * 255.0 - 127.5) / 254.0 * dash.z;
}

void main() {
  if (v_clip.z > 0.5 && (v_clip.x < 0.0 || v_clip.y < 0.0 || v_clip.x > 4096.0 || v_clip.y > 4096.0)) {
    discard;
  }
  if (v_uv.z > 3.5) {
    // A heatmap's kernel, as MapLibre's: added up into the density.
    float d = -0.5 * 3.0 * 3.0 * dot(v_circle.xy, v_circle.xy);
    frag_color = vec4(v_color.r * 0.3989422804014327 * exp(d), 1.0, 1.0, 1.0);
    return;
  }
  vec4 color = v_color;
  if (v_circle.z > 0.5) {
    float radius = v_pattern.x;
    float ring = v_pattern.y;
    float outer = radius + ring;
    float d = length(v_circle.xy) * outer;
    // As MapLibre: the edge fades over the device pixel inside it, or over
    // circle-blur's share of the radius, v_circle.z less one, when wider.
    float pixel = max(v_circle.w, (v_circle.z - 1.0) * outer);
    float shape = smoothstep(0.0, pixel, outer - d);
    if (shape <= 0.0) {
      discard;
    }
    float rgb = v_pattern.z;
    float b = floor(rgb / 65536.0);
    float g = floor((rgb - b * 65536.0) / 256.0);
    float r = rgb - b * 65536.0 - g * 256.0;
    vec4 rim = vec4(vec3(r, g, b) / 255.0 * v_pattern.w, v_pattern.w);
    float inside = ring > 0.0 ? smoothstep(0.0, pixel, radius - d) : 1.0;
    color = mix(rim, v_color, inside) * shape;
  } else if (v_uv.z > 2.5) {
    // A stepped gradient's row comes negated: as MapLibre samples its
    // ramp, it takes the nearest texel, keeping its steps' edges sharp.
    float ramp = frag_info.sheet_size.z;
    float x = clamp(v_uv.x, 0.0, 1.0) * (ramp - 1.0);
    if (v_uv.y < 0.0) x = floor(x + 0.5);
    float u = (x + 0.5) / ramp;
    color = texture(gradient_ramp, vec2(u, abs(v_uv.y))) * v_color.a;
  } else if (v_uv.z > 1.5) {
    // As MapLibre's atlas, the pattern is padded by a texel of itself
    // wrapped around, and the padded pattern spans the line.
    vec2 size = v_pattern.zw;
    vec2 inside = vec2(fract(v_uv.x), clamp(v_uv.y, 0.0, 1.0));
    vec2 t = inside * (size + 2.0) - 1.5;
    vec2 i0 = clamp(floor(t), vec2(-1.0), size);
    vec2 i1 = clamp(i0 + 1.0, vec2(-1.0), size);
    vec2 f = clamp(t - floor(t), 0.0, 1.0);
    vec2 a = (v_pattern.xy + mod(i0, size) + 0.5) / frag_info.sheet_size.xy;
    vec2 b = (v_pattern.xy + mod(i1, size) + 0.5) / frag_info.sheet_size.xy;
    color = mix(
      mix(texture(sprite_sheet, a), texture(sprite_sheet, vec2(b.x, a.y)), f.x),
      mix(texture(sprite_sheet, vec2(a.x, b.y)), texture(sprite_sheet, b), f.x),
      f.y) * v_color.a;
  } else if (v_uv.z > 0.5) {
    vec2 at = v_pattern.xy + mod(v_uv.xy, v_pattern.zw);
    vec4 texel = texture(sprite_sheet, at / frag_info.sheet_size.xy);
    if (v_uv.z > 1.1) {
      // MapLibre's fill_pattern for a distance field: cut at 192 of 256,
      // smoothed over half the field's change across a pixel.
      float gamma = max(fwidth(texel.a) * 0.5, 1.0 / 255.0 / 16.0);
      float inside = smoothstep(0.75 - gamma, 0.75 + gamma, texel.a);
      float rgb = v_color.b;
      float b = floor(rgb / 65536.0);
      float g = floor((rgb - b * 65536.0) / 256.0);
      float r = rgb - b * 65536.0 - g * 256.0;
      color = vec4(vec3(r, g, b) / 255.0, 1.0) * inside * v_color.a;
    } else {
      color = texel * v_color.a;
    }
  }
  if (v_outline.x > 0.5) {
    // MapLibre's fill_outline and fill_outline_pattern: a one pixel line
    // faded by how far the pixel's centre is from the line.
    frag_color = color * (1.0 - smoothstep(0.0, 1.0, length(v_outline.yz - gl_FragCoord.xy)));
    return;
  }
  // A line's outermost device pixel fades to its edge; v_edge.z is its
  // half width in device pixels, zero for anything not a line.
  if (v_edge.z > 0.0) {
    if (v_line.x > 0.0) {
      discard;
    }
    float across = length(v_edge.xy);
    if (v_dash.y > 5.5) {
      // A fill's outline, as MapLibre's: a one pixel line, the pixel on
      // either axis whose centre is nearest it, faded by that distance.
      float d = v_edge.y * v_edge.z;
      vec2 n = vec2(dFdx(d), dFdy(d));
      float major = max(abs(n.x), abs(n.y)) / max(length(n), 1e-6);
      if (d / major <= -0.5 || d / major > 0.5) {
        discard;
      }
      frag_color = color * (1.0 - smoothstep(0.0, 1.0, abs(d)));
      return;
    }
    color *= clamp(v_edge.z * (1.0 - across) * v_line.y, 0.0, 1.0);
    if (v_dash.z > 0.0) {
      float cap = floor(v_dash.y / 2.0);
      float half_width = v_edge.z - 0.5;
      float off_middle = across * v_edge.z;
      float sd = dash_distance(vec3(v_dash.x, v_dash.y - cap * 2.0, v_dash.z));
      // As MapLibre, the zoom level before's dashes morph into these: the
      // distances mix, not the coverage.
      if (v_dash_before.w < 1.0) {
        sd = mix(dash_distance(v_dash_before.xyz), sd, v_dash_before.w);
      }
      // A round cap makes each dash a capsule half the line's width around
      // it, exact at any width; a square cap lengthens it by as much.
      float inside = cap > 1.5 ? sd + half_width
          : cap > 0.5 ? (sd >= 0.0 ? half_width : half_width - length(vec2(sd, off_middle)))
          : sd;
      // As MapLibre's dash atlas: smoothed over a device pixel either side.
      color *= smoothstep(-255.0 / 256.0, 255.0 / 256.0, inside);
    }
    // A line drawn as two: -v_dash.y is the gap's share of the half width,
    // its inner edge faded the same way.
    if (v_dash.y < 0.0) {
      float inner = across * v_edge.z + v_dash.y * (v_edge.z - 0.5);
      color *= clamp((inner - 0.5) * v_line.y + 1.0, 0.0, 1.0);
    }
  }
  frag_color = color;
}
