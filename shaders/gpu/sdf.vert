uniform SdfFrame {
  // x, y: the screen in logical pixels; z: the device pixel ratio; w: 1
  // drawing halos only, 2 glyphs only, 3 both.
  vec4 screen;
  // x, y: the glyph atlas's size in texels; z, w: the sprite sheet's.
  vec4 atlas;
}
sdf_frame;

// The flat map's view of the ground, for text laid on it.
uniform SdfGround {
  // z: the world's width in pixels; w: the tilt's pull, the pitch's sine
  // over the camera's distance from the centre.
  vec4 origin;
  // x, y: the bearing's cosine and sine; z: the pitch's cosine.
  vec4 turn;
  // x, y: the roll's cosine and sine; z, w: the screen point the camera
  // looks at.
  vec4 roll;
}
sdf_ground;

// The quad's corner, (0, 0) to (1, 1), the same for every glyph.
in vec2 corner;

// One glyph or icon, the same for its six corners: where its top left
// corner lands (x, y) and its top left texel (z, w); the screen vectors
// across and down its whole quad; its size in texels (x, y), its kind
// (z) and whether it samples between texels (w).
in vec4 placement;
in vec4 axes;
in vec4 extent;
in vec4 ink;
in vec4 halo;
in vec4 params;
in vec4 clip;
// w: how far the quad has faded in. z above zero marks a glyph laid on the
// ground, kept from frame to frame: x, y are then its label's anchor from
// the camera's centre in fractions of the world, z the size the label was
// laid out at over its size at the centre, placement.xy the glyph's pen
// origin from the anchor, axes.xy the line's direction there, axes.z the
// world a glyph pixel covers, and clip.xy the quad's corner from the pen
// origin in glyph pixels.
in vec4 anchor;

out vec2 v_uv;
out vec4 v_ink;
out vec4 v_halo;
out vec4 v_params;
out vec4 v_clip;
out vec4 v_kind;

vec2 turned(vec2 d) {
  return vec2(
    sdf_ground.turn.x * d.x + sdf_ground.turn.y * d.y,
    -sdf_ground.turn.y * d.x + sdf_ground.turn.x * d.y);
}

// How far a ground point at turned place uv, w deep, moves on the screen
// when it moves by d: the difference of two projections, worked out
// without subtracting them.
vec2 moved(vec2 uv, float w, vec2 d) {
  float k = sdf_ground.origin.w;
  return vec2(d.x * w + uv.x * k * d.y, sdf_ground.turn.z * d.y) /
      (w * (w - k * d.y));
}

void main() {
  vec2 position;
  vec4 look = params;
  if (anchor.z > 0.0) {
    // As MapLibre sizes text pitched with the map: by half its anchor's
    // depth and a half, its edge softened by the depth over the pitch's
    // cosine.
    float world = sdf_ground.origin.z;
    vec2 centre = turned(anchor.xy * world);
    float depth = 1.0 - sdf_ground.origin.w * centre.y;
    float grown = (0.5 + 0.5 * depth) / anchor.z;
    vec2 uv = centre + turned(placement.xy * (grown * world));
    float w = 1.0 - sdf_ground.origin.w * uv.y;
    float pixel = axes.z * grown * world;
    vec2 across = moved(uv, w, turned(axes.xy) * pixel);
    vec2 down = moved(uv, w, turned(vec2(-axes.y, axes.x)) * pixel);
    vec2 flat_at = vec2(uv.x, sdf_ground.turn.z * uv.y) / w +
        (clip.x + corner.x * extent.x) * across +
        (clip.y + corner.y * extent.y) * down;
    position = vec2(
      flat_at.x * sdf_ground.roll.x + flat_at.y * sdf_ground.roll.y,
      -flat_at.x * sdf_ground.roll.y + flat_at.y * sdf_ground.roll.x) +
        sdf_ground.roll.zw;
    look.z = params.z * grown;
    look.w = depth / sdf_ground.turn.z;
  } else {
    position = placement.xy + corner.x * axes.xy + corner.y * axes.zw;
  }
  vec2 texel = placement.zw + corner * extent.xy;
  // A glyph samples the atlas by its share; an icon keeps its texel.
  v_uv = extent.z < 0.5 ? texel / sdf_frame.atlas.xy : texel;
  v_ink = ink * anchor.w;
  v_halo = halo * anchor.w;
  v_params = look;
  v_clip = clip;
  v_kind = vec4(extent.z, extent.w, 0.0, 0.0);
  gl_Position = vec4(
    position.x / sdf_frame.screen.x * 2.0 - 1.0,
    1.0 - position.y / sdf_frame.screen.y * 2.0,
    0.0,
    1.0);
}
