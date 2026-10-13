# Labels and pins in 3D

Checked 2026-10-13. Every engine studied draws labels as flat, screen facing
sprites at a 3D anchor, picks the visible ones with a collision pass in screen
space, and fades them rather than popping them.

## MapLibre GL JS and Native

From maplibre-gl-js `src/symbol/` on main:

- Two switches per label: `text-pitch-alignment` and `text-rotation-alignment`,
  `map` or `viewport`. `map` lies on the ground and tilts with it; `viewport`
  stands up and faces the screen. Icons have the same pair.
- Distance scaling (`projection.ts:205`):
  `0.5 + 0.5 * cameraToCenterDistance / distanceToAnchor`. Twice as far is
  75%, not 50%.
- Labels whose ratio falls below 0.6 are not placed
  (`collision_index.ts:100`, `perspectiveRatioCutoff`).
- One collision grid over the screen plus 100 px each side
  (`viewportPadding`), 25 px cells, shared by all tiles and sources. Line
  labels collide as chains of circles, which stay stable under rotation and
  tilt (mapbox-gl-js#5150, merged 2017-10-18).
- Placement runs in the foreground on a time budget and may span frames. New
  tiles force a full pass, which is where the slow frames come from. The PR's
  benchmark: 4% of frames over 16 ms against 0% before.
- Fading is by time, 300 ms by default; each vertex holds its current and
  target opacity. A cross-tile symbol index makes one label at two zoom
  levels the same label, so crossing a zoom does not flicker it.
- Road names in a tilted view are laid out per glyph on the CPU along the
  projected line, flipped to stay readable (`keepUpright`). Viewport aligned
  curved labels far away are hidden because they "start to look very strange
  in the distance" (mapbox-gl-native#9009, merged 2017-07-11).
- 3D buildings do not hide labels.

## Mapbox GL v3

From the Mapbox style spec:

- `symbol-z-elevate`: "Position symbol on buildings (both fill extrusions and
  models) rooftops."
- `text-occlusion-opacity`, `icon-occlusion-opacity`: "The opacity at which
  the text will be drawn in case of being depth occluded."
- `symbol-z-offset`: "Specifies an uniform elevation from the ground."

## Google Maps 3D

From the Maps JavaScript 3D reference and the altitude modes guide:

- `altitudeMode`: `CLAMP_TO_GROUND` (default), `RELATIVE_TO_GROUND`,
  `RELATIVE_TO_MESH` (above ground, buildings or water, whichever is highest),
  `ABSOLUTE`.
- `extruded`: "Specifies whether to connect the marker to the ground."
- `drawsWhenOccluded`, default false: a marker behind a building is hidden.
- `sizePreserved`, default false: markers shrink with distance.
- Collision: `REQUIRED` always shows; `REQUIRED_AND_HIDES_OPTIONAL` always
  shows and hides optional markers and the base map's labels under it;
  `OPTIONAL_AND_HIDES_LOWER_PRIORITY` shows only when clear, higher draw order
  wins, then the marker lower on screen.
- `Model3DElement`: a `.glb` model with position, heading, tilt and roll.

## Apple MapKit

- WWDC 2013 "Putting Map Kit in Perspective": annotations "stay upright as the
  map rotates", "always face the screen even as the map pitches", and "always
  stay the same size" in the distance.
- WWDC 2022 "What's new in MapKit": annotations are "displayed at the correct
  elevation" on realistic terrain. Buildings and trees over an overlay are
  drawn with transparency that grows with pitch. The 3D map needs an A12 or
  newer; older devices "automatically get a 2D route on a 2D map".
- `displayPriority`, default `required`: lower priorities may hide the view.
  `clusteringIdentifier`: colliding views with the same identifier become one
  cluster view.
- `collisionMode` was not checked; its documentation page did not load.

## CesiumJS

From the Billboard reference: `scaleByDistance`, `translucencyByDistance`,
`distanceDisplayCondition`, `pixelOffsetScaleByDistance`; depth testing is
turned off beyond `disableDepthTestDistance`, so a far billboard draws over
terrain; `eyeOffset` pulls it toward the camera so it does not sink into the
surface; `sizeInMeters` sizes it in the world instead of in pixels.

## Adopted for vmap

1. Labels and pins face the screen and are placed by the camera matrix; only
   road names are laid out in map space.
2. The MapLibre alignment switches, unchanged.
3. Distance scaling per layer: MapLibre's ratio for base map labels, constant
   size for app pins.
4. The 0.6 cutoff, and far road names hidden.
5. One screen space grid with 100 px padding, circles for line labels,
   priorities, and Google's three collision levels for pins.
6. Placement on a frame budget, time based fades, a cross-tile index.
7. On the Flutter GPU renderer: pins with an altitude mode and a ground line,
   labels on roofs, labels behind buildings drawn faded, buildings over app
   content made see-through as the map tilts. On the canvas renderer labels
   draw on top, as MapLibre does.
