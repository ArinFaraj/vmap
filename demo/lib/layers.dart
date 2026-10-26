import 'package:vmap/vmap.dart';

import 'tour.dart';

const _dem = {
  'type': 'raster-dem',
  'tiles': [
    'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
  ],
  'encoding': 'terrarium',
  'tileSize': 256,
  'maxzoom': 15,
};

/// What the demo adds to the style: raised ground, shaded under the style
/// layer [shadeBefore] when there is one, and the earthquakes as a heatmap
/// or in clusters.
VmapOverlay overlayFor({
  required bool terrain,
  required DataLayer data,
  required Map<String, Object?>? quakes,
  String? shadeBefore,
}) {
  final shade = terrain && shadeBefore != null;
  final sources = <String, Object?>{
    if (terrain) 'dem': _dem,
    if (shade) 'dem-shade': _dem,
    if (quakes != null) ...{
      'quakes-heat': {'type': 'geojson', 'data': quakes},
      'quakes': {
        'type': 'geojson',
        'data': quakes,
        'cluster': true,
        'clusterMaxZoom': 12,
        'clusterRadius': 48,
      },
    },
  };
  final layers = <Map<String, Object?>>[
    if (shade)
      {
        'id': 'hillshade',
        'type': 'hillshade',
        'source': 'dem-shade',
        'before': shadeBefore,
        'paint': {
          'hillshade-exaggeration': 0.55,
          'hillshade-shadow-color': '#3D3527',
          'hillshade-highlight-color': '#FFFFFF',
        },
      },
    // Both are always there and only their opacity changes, so switching
    // between them fades instead of building every tile of the style again.
    if (quakes != null) ...[
      _heatmap(data == DataLayer.heatmap ? 1 : 0),
      ..._clusters(data == DataLayer.clusters ? 1 : 0),
    ],
  ];
  return VmapOverlay(
    sources: sources,
    layers: layers,
    terrain: terrain ? const {'source': 'dem', 'exaggeration': 1.5} : null,
  );
}

Map<String, Object?> _heatmap(double shown) => {
  'id': 'quakes-heat',
  'type': 'heatmap',
  'source': 'quakes-heat',
  'paint': {
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'mag'],
      0,
      0,
      6,
      1,
    ],
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1,
      9,
      3,
    ],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      1,
      'rgb(178,24,43)',
    ],
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      4,
      9,
      22,
    ],
    'heatmap-opacity': 0.85 * shown,
  },
};

List<Map<String, Object?>> _clusters(double shown) => [
  {
    'id': 'quakes-clusters',
    'type': 'circle',
    'source': 'quakes',
    'filter': ['has', 'point_count'],
    'paint': {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#5AC8FA',
        50,
        '#4C6FFF',
        200,
        '#A855F7',
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        16,
        50,
        22,
        200,
        30,
      ],
      'circle-opacity': 0.88 * shown,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(255,255,255,0.85)',
      'circle-stroke-opacity': shown,
    },
  },
  {
    'id': 'quakes-count',
    'type': 'symbol',
    'source': 'quakes',
    'filter': ['has', 'point_count'],
    'layout': {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Noto Sans Bold'],
      'text-size': 13,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    'paint': {'text-color': '#ffffff', 'text-opacity': shown},
  },
  {
    'id': 'quakes-points',
    'type': 'circle',
    'source': 'quakes',
    'filter': [
      '!',
      ['has', 'point_count'],
    ],
    'paint': {
      'circle-color': '#5AC8FA',
      'circle-radius': 4,
      'circle-opacity': shown,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-opacity': shown,
    },
  },
];
