# Naming the engine

The package that replaces vmap needs a name. vmap's own slot can be reused or
left behind: on 2026-10-21 it had 0 likes and 108 downloads in 30 days, most
likely KRDPass's own builds.

## What the name has to do

- Read as a map, and suit 3D, the globe and terrain, not only flat tiles.
- Be short enough to prefix every public type (`<Name>Controller`,
  `<Name>Style`) without the API reading long.
- Not belong to someone else: no trademarks (Apple's MapKit), nothing that
  reads as Mapbox GL or MapLibre.
- Be free on pub.dev. pub.dev can also refuse a name too close to an existing
  one, which only shows when publishing, so keep a second choice.

## Checked on pub.dev, 2026-10-21

Free: `meridian`, `mappa`, `terrae`, `geoverse`, `mapverse`, `globus`,
`cartograph`, `veduta`, `cartica`, `lodestar`, `mapcraft`, `polymap`,
`maplet`, `vista`, `geokit`, `earthkit`, `map3d`, `gpu_map`, `geogpu`,
`tilekit`, `roam`, `mapscene`, `geoscene`, `orbit_map`, `terra_map`,
`planet_map`, `gaia_map`, `mappa_mundi`.

Taken: `atlas`, `cartographer`, `orbit`, `terrain`, `tessera`, `gaia`,
`glmap`.

Left out although free: `mapkit` (Apple's trademark), `mapgl` and `cartogl`
(read as Mapbox GL), `gpu_map`, `map3d`, `geogpu` (describe one feature, not
the product).

## Shortlist

| Name | Types read as | For | Against |
|---|---|---|---|
| `mappa` | `Mappa`, `MappaController`, `MappaStyle` | Short, says map in Latin and Italian, the widget can be just `Mappa(...)`. | mappa.js is an old p5.js maps library; little overlap. |
| `meridian` | `MeridianMap`, `MeridianController` | Cartographic and global, sounds like a serious product. | Longer prefix; does not contain "map", so search leans on topics. |
| `terrae` | `TerraeMap`, `TerraeController` | "Lands" in Latin, fits terrain and the globe. | Harder to spell and say. |
| `geoverse` | `GeoverseMap`, `GeoverseController` | Modern, suggests a 3D world to build on. | Trendy; reads like many startups. |
| keep `vmap` | `VMap`, `VMapController` | Already ours, 160 pub points, no rename work. | Says "vector map", the old idea, and the prefix spellings already clash. |

Recommendation: `mappa`, with `meridian` second. The widget is named after
the package, every type stays short, and "map" is in the name for search.
