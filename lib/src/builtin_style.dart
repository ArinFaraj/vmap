import 'style.dart';

/// The package's own style as a MapLibre style document, for tiles in the
/// OpenMapTiles schema.
Map<String, Object?> builtInStyle(
  VmapPalette palette, {
  required String tileJsonUrl,
  required List<String> nameKeys,
}) {
  String tone(int t) {
    final c = palette.colors[t];
    return 'rgba(${c >> 16 & 255},${c >> 8 & 255},${c & 255},${(c >>> 24) / 255})';
  }

  final layers = <Map<String, Object?>>[
    {
      'id': 'background',
      'type': 'background',
      'paint': {'background-color': tone(Tone.background)},
    },
  ];

  void fill(
    String id,
    String sourceLayer,
    int color, {
    Object? filter,
    double? minZoom,
    Object? opacity,
  }) {
    layers.add({
      'id': id,
      'type': 'fill',
      'source': 'openmaptiles',
      'source-layer': sourceLayer,
      'minzoom': ?minZoom,
      'filter': ?filter,
      'paint': {'fill-color': tone(color), 'fill-opacity': ?opacity},
    });
  }

  void line(
    String id,
    String sourceLayer,
    int color,
    Object width, {
    Object? filter,
    double? minZoom,
    bool caps = true,
  }) {
    layers.add({
      'id': id,
      'type': 'line',
      'source': 'openmaptiles',
      'source-layer': sourceLayer,
      'minzoom': ?minZoom,
      'filter': [
        'all',
        ['==', r'$type', 'LineString'],
        ?filter,
      ],
      'layout': {'line-cap': caps ? 'round' : 'butt'},
      'paint': {'line-color': tone(color), 'line-width': width},
    });
  }

  fill(
    'residential',
    'landuse',
    Tone.residential,
    filter: [
      'in',
      'class',
      'residential',
      'suburb',
      'neighbourhood',
      'quarter',
    ],
  );
  fill(
    'commercial',
    'landuse',
    Tone.commercial,
    minZoom: 10,
    filter: ['in', 'class', 'commercial', 'retail', 'industrial'],
  );
  fill(
    'school',
    'landuse',
    Tone.school,
    minZoom: 10,
    filter: ['in', 'class', 'school', 'university', 'college', 'kindergarten'],
  );
  fill(
    'hospital',
    'landuse',
    Tone.hospital,
    minZoom: 10,
    filter: ['==', 'class', 'hospital'],
  );
  fill('sand', 'landcover', Tone.sand, filter: ['==', 'class', 'sand']);
  fill('cemetery', 'landuse', Tone.grass, filter: ['==', 'class', 'cemetery']);
  fill(
    'grass',
    'landcover',
    Tone.grass,
    filter: ['in', 'class', 'grass', 'wetland'],
  );
  fill('park', 'park', Tone.park);
  fill('wood', 'landcover', Tone.wood, filter: ['==', 'class', 'wood']);
  fill(
    'pitch',
    'landuse',
    Tone.pitch,
    minZoom: 12,
    filter: ['in', 'class', 'pitch', 'stadium', 'playground', 'track'],
  );
  fill('water', 'water', Tone.water);
  line(
    'waterway',
    'waterway',
    Tone.water,
    _stops([8, 12, 15, 20], [0.5, 1.2, 3, 10]),
    filter: ['!=', 'brunnel', 'tunnel'],
  );
  fill(
    'aeroway',
    'aeroway',
    Tone.aeroway,
    minZoom: 10,
    filter: ['in', 'class', 'runway', 'taxiway', 'apron'],
  );
  line(
    'runway',
    'aeroway',
    Tone.road,
    _stops([10, 13, 17], [1.5, 8, 60]),
    minZoom: 10,
    filter: ['==', 'class', 'runway'],
  );
  line(
    'taxiway',
    'aeroway',
    Tone.road,
    _stops([11, 14, 17], [0.6, 2.4, 14]),
    minZoom: 11,
    filter: ['==', 'class', 'taxiway'],
  );
  fill(
    'pedestrian',
    'transportation',
    Tone.pedestrian,
    filter: ['==', 'class', 'path'],
  );
  fill(
    'building',
    'building',
    Tone.building,
    minZoom: 13,
    opacity: [
      'interpolate',
      ['linear'],
      ['zoom'],
      13,
      0,
      13.8,
      1,
    ],
  );

  const ramp = ['==', 'ramp', 1];
  const notRamp = ['!=', 'ramp', 1];
  final roads = <(String, Object, Object, double?, int casing, int inner)>[
    (
      'service',
      ['in', 'class', 'service', 'track'],
      _service,
      13.5,
      Tone.casing,
      Tone.road,
    ),
    ('minor', ['==', 'class', 'minor'], _minor, 11, Tone.casing, Tone.road),
    (
      'secondary',
      ['in', 'class', 'secondary', 'tertiary'],
      _secondary,
      null,
      Tone.casing,
      Tone.roadMajor,
    ),
    (
      'primary',
      [
        'any',
        ['==', 'class', 'primary'],
        [
          'all',
          ['in', 'class', 'motorway', 'trunk'],
          ramp,
        ],
      ],
      _primary,
      null,
      Tone.casing,
      Tone.roadMajor,
    ),
    (
      'trunk',
      [
        'all',
        ['==', 'class', 'trunk'],
        notRamp,
      ],
      _trunk,
      null,
      Tone.trunkCasing,
      Tone.trunk,
    ),
    (
      'motorway',
      [
        'all',
        ['==', 'class', 'motorway'],
        notRamp,
      ],
      _trunk,
      null,
      Tone.motorwayCasing,
      Tone.motorway,
    ),
  ];
  const bridge = ['==', 'brunnel', 'bridge'];
  const ground = ['!=', 'brunnel', 'bridge'];
  final path = ('path', ['==', 'class', 'path'], _path, 13.5);
  final rail = ('rail', ['in', 'class', 'rail', 'transit'], _rail, null);

  for (final (suffix, level) in [('', ground), ('-bridge', bridge)]) {
    for (final (id, filter, width, minZoom, casing, _) in roads) {
      line(
        '$id$suffix-casing',
        'transportation',
        casing,
        ['+', width, _casingExtra],
        minZoom: minZoom,
        filter: ['all', filter, level],
      );
    }
  }
  for (final (suffix, level) in [('', ground), ('-bridge', bridge)]) {
    line(
      '${path.$1}$suffix',
      'transportation',
      Tone.path,
      path.$3,
      minZoom: path.$4,
      filter: ['all', path.$2, level],
    );
    for (final (id, filter, width, minZoom, _, inner) in roads) {
      line(
        '$id$suffix',
        'transportation',
        inner,
        width,
        minZoom: minZoom,
        filter: ['all', filter, level],
      );
    }
    line(
      '${rail.$1}$suffix',
      'transportation',
      Tone.rail,
      rail.$3,
      filter: ['all', rail.$2, level],
    );
  }

  line(
    'boundary-region',
    'boundary',
    Tone.boundary,
    _stops([4, 8, 12], [0.5, 0.9, 1.4]),
    caps: false,
    filter: [
      'all',
      ['in', 'admin_level', 3, 4],
      ['!=', 'maritime', 1],
    ],
  );
  line(
    'boundary-country',
    'boundary',
    Tone.boundary,
    _stops([2, 6, 12], [0.8, 1.4, 2.4]),
    caps: false,
    filter: [
      'all',
      ['<=', 'admin_level', 2],
      ['!=', 'maritime', 1],
    ],
  );

  void label(
    String id,
    String sourceLayer,
    Object filter, {
    required double size,
    required int color,
    required double minZoom,
    double? maxZoom,
    int weight = 500,
    bool line = false,
    bool italic = false,
    bool uppercase = false,
    double spacing = 0,
    double maxWidth = 9,
  }) {
    layers.add({
      'id': id,
      'type': 'symbol',
      'source': 'openmaptiles',
      'source-layer': sourceLayer,
      'minzoom': minZoom,
      'maxzoom': ?maxZoom,
      'filter': filter,
      'layout': {
        'text-field': [
          'coalesce',
          for (final k in nameKeys) ['get', k],
        ],
        'text-font': [
          '${weight >= 600 ? 'Semibold' : 'Medium'}${italic ? ' Italic' : ''}',
        ],
        'text-size': size,
        'text-max-width': maxWidth,
        'text-letter-spacing': spacing / size,
        'symbol-placement': line ? 'line' : 'point',
        if (uppercase) 'text-transform': 'uppercase',
      },
      'paint': {
        'text-color': tone(color),
        'text-halo-color': tone(Tone.halo),
        'text-halo-width': 1.5,
      },
    });
  }

  Object place(Object filter) => [
    'all',
    ['==', r'$type', 'Point'],
    filter,
  ];
  Object road(List<String> classes) => [
    'all',
    ['==', r'$type', 'LineString'],
    ['in', 'class', ...classes],
  ];

  label(
    'road-minor',
    'transportation_name',
    road(['minor', 'service', 'track']),
    size: 12,
    color: Tone.labelRoad,
    minZoom: 13.2,
    line: true,
  );
  label(
    'road-secondary',
    'transportation_name',
    road(['secondary', 'tertiary']),
    size: 13,
    color: Tone.labelRoad,
    minZoom: 11.5,
    line: true,
  );
  label(
    'road-primary',
    'transportation_name',
    road(['primary']),
    size: 13,
    color: Tone.labelRoad,
    minZoom: 11.5,
    line: true,
  );
  label(
    'road-highway',
    'transportation_name',
    road(['motorway', 'trunk']),
    size: 13,
    color: Tone.labelRoad,
    minZoom: 11.5,
    line: true,
  );
  label(
    'neighbourhood',
    'place',
    place(['==', 'class', 'neighbourhood']),
    size: 11.5,
    color: Tone.labelSecondary,
    minZoom: 12.5,
    maxZoom: 17,
    spacing: 0.2,
  );
  label(
    'water-name',
    'water_name',
    ['==', r'$type', 'Point'],
    size: 11.5,
    color: Tone.labelWater,
    minZoom: 8,
    italic: true,
    spacing: 0.3,
  );
  label(
    'suburb',
    'place',
    place(['in', 'class', 'suburb', 'quarter']),
    size: 11.5,
    color: Tone.labelSecondary,
    minZoom: 10.5,
    maxZoom: 15.5,
    spacing: 0.4,
  );
  label(
    'village',
    'place',
    place(['in', 'class', 'village', 'hamlet', 'isolated_dwelling']),
    size: 12,
    color: Tone.labelPrimary,
    minZoom: 9,
    maxZoom: 15.5,
  );
  label(
    'town',
    'place',
    place(['==', 'class', 'town']),
    size: 12.5,
    color: Tone.labelPrimary,
    minZoom: 6,
    maxZoom: 14.5,
  );
  label(
    'state',
    'place',
    place(['in', 'class', 'state', 'province']),
    size: 11,
    weight: 600,
    color: Tone.labelSecondary,
    minZoom: 4.5,
    maxZoom: 8.5,
    uppercase: true,
    spacing: 1.2,
  );
  label(
    'city',
    'place',
    place([
      'all',
      ['==', 'class', 'city'],
      ['!=', 'capital', 2],
    ]),
    size: 14,
    color: Tone.labelPrimary,
    minZoom: 3,
    maxZoom: 14.2,
  );
  label(
    'capital',
    'place',
    place([
      'all',
      ['==', 'class', 'city'],
      ['==', 'capital', 2],
    ]),
    size: 15,
    weight: 600,
    color: Tone.labelPrimary,
    minZoom: 3,
    maxZoom: 14.2,
  );
  label(
    'country',
    'place',
    place(['==', 'class', 'country']),
    size: 13,
    weight: 600,
    color: Tone.labelPrimary,
    minZoom: 1,
    maxZoom: 7,
    maxWidth: 7,
  );

  return {
    'version': 8,
    'sources': {
      'openmaptiles': {'type': 'vector', 'url': tileJsonUrl},
    },
    'layers': layers,
  };
}

/// A width that grows evenly through a pinch: geometric between stops.
List<Object> _stops(List<num> zooms, List<num> values) => [
  'interpolate',
  ['geometric'],
  ['zoom'],
  for (var i = 0; i < zooms.length; i++) ...[zooms[i], values[i]],
];

final _trunk = _stops(
  [5, 9, 12, 14, 16, 18, 20],
  [0.9, 1.8, 3.2, 6, 9.5, 17, 32],
);
final _primary = _stops(
  [7, 10, 12, 14, 16, 18, 20],
  [0.7, 1.3, 2.6, 5, 8.5, 16, 30],
);
final _secondary = _stops(
  [9, 11, 13, 14, 16, 18, 20],
  [0.6, 1.1, 2.4, 4, 7.5, 15, 28],
);
final _minor = _stops([11, 13, 14, 16, 18, 20], [0.4, 1.0, 2.2, 6, 13, 26]);
final _service = _stops([12, 14, 16, 18, 20], [0.3, 1.0, 3.2, 7, 14]);
final _path = _stops([13, 15, 17, 20], [0.5, 1.0, 2.2, 6]);
final _rail = _stops([8, 13, 16, 20], [0.4, 0.9, 1.8, 4]);
final _casingExtra = _stops([6, 12, 15, 18], [1.0, 1.6, 2.2, 3.2]);
