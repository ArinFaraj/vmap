# Lines and routes

Checked 2026-10-13 against the Mapbox GL style spec. Mapbox GL v3 has line
properties MapLibre lacks; their descriptions:

| Property | Spec text |
| --- | --- |
| `line-trim-offset` | "The line part between [trim-start, trim-end] will be painted using `line-trim-color`" |
| `line-trim-color` | "The color to be used for rendering the trimmed line section" |
| `line-trim-fade-range` | "The fade range for the trim-start and trim-end points" |
| `line-occlusion-opacity` | "Opacity multiplier ... of the line part that is occluded by 3D objects." |
| `line-z-offset` | "Vertical offset from ground. Not supported for globe projection at the moment." |
| `line-elevation-reference` | "Selects the base of line-elevation." |
| `line-cross-slope` | "Defines the slope of an elevated line." |
| `line-border-width`, `line-border-color` | a border without a second layer |
| `line-emissive-strength` | "Controls the intensity of light emitted on the source features." |

Apple (WWDC 2022 "What's new in MapKit"): the route "follows the elevated
terrain", "follows the road across the bridge", and "subtly shows through
the bridge pillars"; trees in front of it become transparent when the map is
pitched.

## What vmap draws

- Every MapLibre line property, which vmap 0.26 mostly reads already
  (`doc/style-support.md`).
- The Mapbox v3 set above, as extensions.
- Route progress by trim, moving every frame without rebuilding geometry.
- Data driven colours along one line (traffic per segment) without splitting
  it into features, and `line-gradient` combined with dashes and data driven
  width, which vmap 0.26 cannot do.
- Animated changes: a rerouted line morphs from old to new; dashes can flow
  along a line; a new route draws itself on.
- On the GPU tier, lines are antialiased in the fragment shader from their
  distance to the centre line, so edges stay clean at any tilt without MSAA.
