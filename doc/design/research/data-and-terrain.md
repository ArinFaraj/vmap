# Tile data and terrain

Checked 2026-10-13.

## MapLibre Tile (MLT)

From the MapLibre announcement of 2026-01-23:

- "a successor to Mapbox Vector Tile (MVT)", column oriented, compression
  "up to 6x on large tiles", encodings chosen to suit SIMD decoding. No
  decoding benchmark is published there.
- MapLibre GL JS and Native read it; a style opts in with `"encoding": "mlt"`
  on the source.
- Feature parity with MVT today. Planned: 3D coordinates, linear referencing
  and m-values, nested properties, lists and maps.
- One MVT capability it drops: a column whose type changes between features.
- The September 2026 newsletter says MLT v2 is still behind an unstable flag.

## Protomaps basemap

From docs.protomaps.com/basemaps/downloads: OSM only, an ODbL Produced Work
with OSM attribution required, daily builds on the version 4 channel, about
120 GB for the planet at zoom 0 to 15, regional extracts with
`pmtiles extract`, each extra zoom level roughly doubling the size. Building
heights are not mentioned.

## Overture buildings

Not verified for 2026: the release notes searched (2026-01-21, 2026-06-17,
2026-08-19) do not report height coverage. The earliest heights came from
USGS 3DEP lidar (six million buildings at the first release); Esri reports
contributing more. Kurdistan's coverage is unknown and must be measured
before relying on it.

## Mapterhorn

From mapterhorn.com: global terrain at 30 m with finer national datasets
listed per region (down to 0.25 m in Baden-Wuerttemberg and Canton Zurich;
Iraq is not listed). Code BSD-3; data from various open sources, listed at
mapterhorn.com/attribution, which was not read. A Protomaps blog post
describes PMTiles with Terrarium encoding in WebP; not verified on the site.

## Open questions to measure

- How many places in Kurdistan carry `name:ckb` and `name:kmr` in OSM.
- How many buildings in Kurdistan carry a height or a level count in OSM or
  Overture.
- MLT against MVT decode time in our own Dart decoder.
