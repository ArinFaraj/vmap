import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:vector_map_tiles/vector_map_tiles.dart' as vmt;
import 'package:vmap/vmap.dart';

const _shotPath = String.fromEnvironment('SHOT');
const _styleName = String.fromEnvironment('STYLE');
const _dark = bool.fromEnvironment('DARK');
const _zoomTenths = int.fromEnvironment('ZOOM', defaultValue: 158);
const _selected = int.fromEnvironment('SELECT', defaultValue: -1);
const _plain = bool.fromEnvironment('PLAIN');
const _pins = bool.fromEnvironment('PINS', defaultValue: true);
const _names = String.fromEnvironment(
  'NAMES',
  defaultValue: 'name:en,name:latin,name',
);
const _centre = LatLng(
  int.fromEnvironment('LAT', defaultValue: 36188900) / 1e6,
  int.fromEnvironment('LON', defaultValue: 44007600) / 1e6,
);

enum Category {
  sights('Landmark', Icons.account_balance_rounded, Color(0xFF7B61FF)),
  coffee('Cafe', Icons.local_cafe_rounded, Color(0xFFB8672E)),
  food('Restaurant', Icons.restaurant_rounded, Color(0xFFF2762E)),
  hotels('Hotel', Icons.hotel_rounded, Color(0xFFE5488B)),
  parks('Park', Icons.park_rounded, Color(0xFF1F9D62)),
  books('Bookshop', Icons.menu_book_rounded, Color(0xFF2F7DE1));

  const Category(this.label, this.icon, this.color);

  final String label;
  final IconData icon;
  final Color color;
}

class Place {
  const Place(this.name, this.category, this.lat, this.lon);

  final String name;
  final Category category;
  final double lat;
  final double lon;

  LatLng get point => LatLng(lat, lon);
}

/// Places around the Erbil citadel, as OpenStreetMap has them.
const places = [
  Place('Erbil Citadel', Category.sights, 36.19110, 44.00920),
  Place('Machko Chaikhana', Category.coffee, 36.18946, 44.00970),
  Place('Najar Restaurant', Category.food, 36.18900, 44.00866),
  Place('Sidra Coffee', Category.coffee, 36.18855, 44.00947),
  Place('Zerngran Restaurant', Category.food, 36.18823, 44.00819),
  Place('Kotri Salam', Category.sights, 36.18734, 44.00830),
  Place('Kaftria Nabaz', Category.coffee, 36.18658, 44.00840),
  Place('Fwad Restaurant', Category.food, 36.19028, 44.00679),
  Place('Rehat Hotel', Category.hotels, 36.19307, 44.00528),
  Place('Mahwi Bookshop', Category.books, 36.19289, 44.00583),
  Place('Minaret Gallery', Category.sights, 36.18761, 43.99998),
  Place('Glkand Park', Category.parks, 36.18264, 44.00883),
  Place('Shanadar Park', Category.parks, 36.18202, 44.00185),
  Place('Adana Doner', Category.food, 36.18557, 44.00434),
];

/// How places are marked: not at all, with the style's own icons, or with
/// the package's round pins.
enum PlaceIcons {
  none('None'),
  style('Style'),
  custom('Custom');

  const PlaceIcons(this.label);

  final String label;
}

class MapLook {
  const MapLook(this.label, this.style, {this.dark = false});

  final String label;
  final VmapStyle style;
  final bool dark;
}

final _nameKeys = _names.split(',');

const _live = bool.fromEnvironment('LIVE');

final _liveLayers = <Map<String, Object?>>[
  ..._overlay.layers,
  {
    'id': 'walker',
    'type': 'circle',
    'source': 'walker',
    'paint': {
      'circle-radius': 7,
      'circle-color': '#1A73E8',
      'circle-stroke-color': '#FFFFFF',
      'circle-stroke-width': 3,
    },
  },
];

/// The demo overlay with a dot that is [step] steps into the walk, to show
/// data that changes while the map is up.
VmapOverlay _walking(int step) {
  final walk = _overlay.sources['walk']! as Map;
  final line =
      ((((walk['data'] as Map)['features'] as List).first as Map)['geometry']
              as Map)['coordinates']
          as List;
  final at = step % ((line.length - 1) * 20) / 20;
  final from = line[at.floor()] as List;
  final to = line[at.floor() + 1] as List;
  final t = at - at.floor();
  return VmapOverlay(
    sources: {
      ..._overlay.sources,
      'walker': {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': <String, Object?>{},
          'geometry': {
            'type': 'Point',
            'coordinates': [
              (from[0] as num) + ((to[0] as num) - (from[0] as num)) * t,
              (from[1] as num) + ((to[1] as num) - (from[1] as num)) * t,
            ],
          },
        },
      },
    },
    layers: _liveLayers,
  );
}

/// A few hundred made up points around the city, gathered into clusters, to
/// show a clustered source.
VmapOverlay _crowd() {
  final random = math.Random(7);
  double spread() => (random.nextDouble() + random.nextDouble() - 1) * 0.035;
  return VmapOverlay(
    sources: {
      'crowd': {
        'type': 'geojson',
        'cluster': true,
        'clusterRadius': 45,
        'clusterMaxZoom': 14,
        'data': {
          'type': 'FeatureCollection',
          'features': [
            for (var i = 0; i < 400; i++)
              {
                'type': 'Feature',
                'id': i,
                'properties': <String, Object?>{},
                'geometry': {
                  'type': 'Point',
                  'coordinates': [
                    _centre.longitude + spread() * 1.2,
                    _centre.latitude + spread(),
                  ],
                },
              },
          ],
        },
      },
    },
    layers: const [
      {
        'id': 'crowd-clusters',
        'type': 'circle',
        'source': 'crowd',
        'filter': ['has', 'point_count'],
        'paint': {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#1A73E8',
            20,
            '#7B61FF',
            80,
            '#E5484D',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            14,
            20,
            19,
            80,
            25,
          ],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 3,
        },
      },
      {
        'id': 'crowd-count',
        'type': 'symbol',
        'source': 'crowd',
        'filter': ['has', 'point_count'],
        'layout': {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 13,
          'text-allow-overlap': true,
        },
        'paint': {'text-color': '#FFFFFF'},
      },
      {
        'id': 'crowd-single',
        'type': 'circle',
        'source': 'crowd',
        'filter': [
          '!',
          ['has', 'point_count'],
        ],
        'paint': {
          'circle-color': '#1A73E8',
          'circle-radius': 5,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2,
        },
      },
    ],
  );
}

final _crowdOverlay = _crowd();

/// Red for the feature that was tapped, blue for the rest.
const _picked = [
  'case',
  [
    '==',
    ['feature-state', 'picked'],
    true,
  ],
  '#E5484D',
  '#1A73E8',
];

/// A walk through the old town and the square in front of the citadel, to
/// show an overlay of the app's own data.
const _overlay = VmapOverlay(
  sources: {
    'walk': {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'id': 1,
            'properties': {'name': 'Evening walk'},
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [44.00530, 36.19300],
                [44.00680, 36.19030],
                [44.00866, 36.18900],
                [44.00947, 36.18855],
                [44.00830, 36.18734],
                [44.00840, 36.18658],
                [44.00883, 36.18300],
              ],
            },
          },
          {
            'type': 'Feature',
            'id': 2,
            'properties': {'name': 'Meeting point'},
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
                [
                  [44.00900, 36.18880],
                  [44.01010, 36.18880],
                  [44.01010, 36.18800],
                  [44.00900, 36.18800],
                  [44.00900, 36.18880],
                ],
              ],
            },
          },
        ],
      },
    },
  },
  layers: [
    {
      'id': 'walk-area',
      'type': 'fill',
      'source': 'walk',
      'filter': ['==', r'$type', 'Polygon'],
      'paint': {
        'fill-color': _picked,
        'fill-opacity': [
          'case',
          [
            '==',
            ['feature-state', 'picked'],
            true,
          ],
          0.45,
          0.18,
        ],
      },
    },
    {
      'id': 'walk-casing',
      'type': 'line',
      'source': 'walk',
      'filter': ['==', r'$type', 'LineString'],
      'layout': {'line-cap': 'round'},
      'paint': {'line-color': '#ffffff', 'line-width': 8},
    },
    {
      'id': 'walk-line',
      'type': 'line',
      'source': 'walk',
      'filter': ['==', r'$type', 'LineString'],
      'layout': {'line-cap': 'round'},
      'paint': {'line-color': _picked, 'line-width': 5},
    },
  ],
);

MapLook _openFreeMap(String label, String name, {bool dark = false}) => MapLook(
  label,
  VmapStyle.url(
    'https://tiles.openfreemap.org/styles/$name',
    zoomOffset: const int.fromEnvironment('ZOFF').toDouble(),
  ),
  dark: dark,
);

const _styleFile = String.fromEnvironment('STYLE_FILE');

final looks = [
  if (_styleFile.isNotEmpty)
    MapLook(
      'File',
      VmapStyle.json(
        jsonDecode(File(_styleFile).readAsStringSync()) as Map<String, Object?>,
      ),
    ),
  MapLook('Default', VmapStyle.builtIn(nameKeys: _nameKeys)),
  MapLook(
    'Night',
    VmapStyle.builtIn(palette: VmapPalette.dark, nameKeys: _nameKeys),
    dark: true,
  ),
  _openFreeMap('Liberty', 'liberty'),
  _openFreeMap('Bright', 'bright'),
  _openFreeMap('Positron', 'positron'),
  _openFreeMap('Dark Matter', 'dark', dark: true),
  _openFreeMap('Fiord', 'fiord', dark: true),
];

class ShowcaseApp extends StatefulWidget {
  const ShowcaseApp({required this.cacheDirectory, this.vmtStyle, super.key});

  final String cacheDirectory;

  /// Draws the map with vector_map_tiles instead, for side by side pictures.
  final vmt.Style? vmtStyle;

  @override
  State<ShowcaseApp> createState() => _ShowcaseAppState();
}

class _ShowcaseAppState extends State<ShowcaseApp> {
  final _map = MapController();
  final _boundary = GlobalKey();
  final _messenger = GlobalKey<ScaffoldMessengerState>();
  int? _place = _selected < 0 ? null : _selected;
  int _look = _initialLook();

  PlaceIcons _icons = _pins ? PlaceIcons.custom : PlaceIcons.style;

  /// For each look, the ids of the style's layers that draw icons, found
  /// once the style document is read.
  final Map<int, List<String>> _iconLayers = {};
  bool _showPlaces = _selected >= 0;
  bool _route = _live || const bool.fromEnvironment('OVERLAY');
  bool _clusters = const bool.fromEnvironment('CLUSTER');
  bool _curved = true;
  bool _rotate = true;

  static int _initialLook() {
    if (_styleName.isEmpty) return _dark ? 1 : 0;
    final index = looks.indexWhere(
      (l) => l.style.url?.endsWith('/$_styleName') ?? false,
    );
    return index < 0 ? 0 : index;
  }

  @override
  void initState() {
    super.initState();
    if (_shotPath.isNotEmpty) {
      Future<void>.delayed(const Duration(seconds: 12), _capture);
    }
    if (_route) _startWalker();
    _findIconLayers(_look);
  }

  /// Reads which layers of look [index] draw icons, so they can be hidden.
  Future<void> _findIconLayers(int index) async {
    if (_iconLayers.containsKey(index)) return;
    final style = looks[index].style;
    Map<String, Object?>? document = style.document;
    if (document == null && style.url != null) {
      final client = HttpClient();
      try {
        final request = await client.getUrl(Uri.parse(style.url!));
        final response = await request.close();
        document = jsonDecode(
          await response.transform(utf8.decoder).join(),
        ) as Map<String, Object?>;
      } catch (_) {
        return;
      } finally {
        client.close();
      }
    }
    final ids = [
      for (final layer in (document?['layers'] as List?) ?? const [])
        if (layer case {
          'id': final String id,
          'type': 'symbol',
          'layout': {'icon-image': _},
        })
          id,
    ];
    if (mounted) setState(() => _iconLayers[index] = ids);
  }

  /// Hides the style's icons when no icons are wanted.
  List<VmapStyleEdit> get _styleEdits => _icons == PlaceIcons.none
      ? [
          for (final id in _iconLayers[_look] ?? const <String>[])
            VmapStyleEdit.layout(id, 'icon-image', null),
        ]
      : const [];

  void _setLook(int index) {
    setState(() => _look = index);
    _findIconLayers(index);
  }

  void _startWalker() {
    _walker?.cancel();
    _walker = Timer.periodic(
      const Duration(milliseconds: 250),
      (_) => setState(() => _step++),
    );
  }

  void _setRoute(bool on) {
    setState(() => _route = on);
    if (on) {
      _startWalker();
    } else {
      _walker?.cancel();
      _walker = null;
    }
  }

  /// The overlays switched on, drawn as one.
  VmapOverlay? get _overlayShown {
    final shown = [if (_route) _walking(_step), if (_clusters) _crowdOverlay];
    if (shown.isEmpty) return null;
    if (shown.length == 1) return shown.single;
    return VmapOverlay(
      sources: {for (final o in shown) ...o.sources},
      layers: [for (final o in shown) ...o.layers],
    );
  }

  void _northUp() =>
      _map.moveAndRotate(_map.camera.center, _map.camera.zoom, 0);

  Timer? _walker;
  int _step = 0;
  List<VmapFeatureState> _featureStates = const [
    if (int.fromEnvironment('PICK') != 0)
      VmapFeatureState(
        source: 'walk',
        id: int.fromEnvironment('PICK'),
        state: {'picked': true},
      ),
  ];

  @override
  void dispose() {
    _walker?.cancel();
    super.dispose();
  }

  Future<void> _capture() async {
    const nudge = int.fromEnvironment('NUDGE');
    if (nudge != 0) {
      _map.move(_map.camera.center, _map.camera.zoom + nudge / 10);
      await WidgetsBinding.instance.endOfFrame;
    }
    final render =
        _boundary.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    final image = await render.toImage(pixelRatio: 3);
    final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
    File(_shotPath).writeAsBytesSync(bytes!.buffer.asUint8List());
    exit(0);
  }

  void _select(int? index) {
    setState(() => _place = index);
    if (index != null) {
      _map.move(places[index].point, _map.camera.zoom);
    }
  }

  @override
  Widget build(BuildContext context) {
    final look = looks[_look];
    final scheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF1A73E8),
      brightness: look.dark ? Brightness.dark : Brightness.light,
    );
    final markers = [
      for (var i = 0; i < places.length; i++)
        if (_showPlaces && !_plain)
          NamedMarker(
            name: places[i].name,
            point: places[i].point,
            width: 34,
            height: 34,
            rotate: true,
            child: _PlacePin(
              category: places[i].category,
              selected: _place == i,
              onTap: () => _select(i),
            ),
          ),
    ];
    final selected = _place == null ? null : places[_place!];
    Widget screen = Scaffold(
      body: Stack(
        children: [
          if (widget.vmtStyle case final other?)
            FlutterMap(
              mapController: _map,
              options: MapOptions(
                initialCenter: _centre,
                initialZoom: _zoomTenths / 10,
                minZoom: 3,
                maxZoom: 19,
                backgroundColor: scheme.surface,
              ),
              children: [
                vmt.VectorTileLayer(
                  theme: other.theme,
                  sprites: other.sprites,
                  tileOffset: const bool.fromEnvironment('VMT_512')
                      ? vmt.TileOffset.mapbox
                      : vmt.TileOffset.DEFAULT,
                  tileProviders: other.providers,
                ),
              ],
            )
          else
            VmapMap(
              controller: _map,
              initialCenter: _centre,
              initialZoom: _zoomTenths / 10,
              initialRotation: const int.fromEnvironment('ROT').toDouble(),
              rotate: _rotate,
              curvedLabels: _curved,
              backgroundColor: scheme.surface,
              onTap: (_) => _select(null),
              style: look.style,
              markers: markers,
              pins: _icons == PlaceIcons.custom ? VmapPins.standard : null,
              styleEdits: _styleEdits,
              overlay: _overlayShown,
              featureStates: _featureStates,
              onFeatureTap: (_, features) {
                final own = features.where((f) => f.source == 'walk');
                setState(
                  () => _featureStates = [
                    if (own.isNotEmpty)
                      VmapFeatureState.of(own.first, const {'picked': true}),
                  ],
                );
                if (features.isEmpty) return;
                final top = features.first;
                final name =
                    top.properties['name:en'] ?? top.properties['name'];
                _messenger.currentState
                  ?..clearSnackBars()
                  ..showSnackBar(
                    SnackBar(
                      behavior: SnackBarBehavior.floating,
                      duration: const Duration(seconds: 2),
                      content: Text(
                        '${name ?? top.properties['class'] ?? top.sourceLayer}'
                        '  (${top.layers.first})',
                      ),
                    ),
                  );
              },
              cacheDirectory: widget.cacheDirectory,
              userAgentPackageName: 'dev.vmap.bench',
              textStyle: const TextStyle(
                fontFamily: 'GoogleSansFlex',
                fontFamilyFallback: ['Vazirmatn'],
              ),
              markerTextStyle: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: look.dark
                    ? const Color(0xFFE8EAED)
                    : const Color(0xFF30343A),
              ),
            ),
          if (!_plain)
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _TopBar(
                      look: _look,
                      onLook: _setLook,
                      icons: _icons,
                      onIcons: (mode) => setState(() => _icons = mode),
                      layers: [
                        _Layer('Demo places', _showPlaces, (on) {
                          setState(() {
                            _showPlaces = on;
                            if (!on) _place = null;
                          });
                        }),
                        _Layer('Walking route', _route, _setRoute),
                        _Layer(
                          'Clusters',
                          _clusters,
                          (on) => setState(() => _clusters = on),
                        ),
                        _Layer(
                          'Curved road names',
                          _curved,
                          (on) => setState(() => _curved = on),
                        ),
                        _Layer('Rotation', _rotate, (on) {
                          setState(() => _rotate = on);
                          if (!on) _northUp();
                        }),
                      ],
                      onNorth: _northUp,
                    ),
                    const Spacer(),
                    if (selected != null) _PlaceCard(place: selected),
                    const SizedBox(height: 10),
                    const Align(
                      alignment: AlignmentDirectional.centerStart,
                      child: _Attribution(),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
    final desktop =
        !kIsWeb && (Platform.isMacOS || Platform.isWindows || Platform.isLinux);
    if (desktop) {
      screen = ColoredBox(
        color: const Color(0xFF202124),
        child: Center(
          child: SizedBox(
            width: 390,
            height: 844,
            child: RepaintBoundary(
              key: _boundary,
              child: MediaQuery(
                data: const MediaQueryData(
                  size: Size(390, 844),
                  padding: EdgeInsets.only(top: 54, bottom: 24),
                ),
                child: screen,
              ),
            ),
          ),
        ),
      );
    }
    return MaterialApp(
      scaffoldMessengerKey: _messenger,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: scheme,
        fontFamily: 'GoogleSansFlex',
        fontFamilyFallback: const ['Vazirmatn'],
      ),
      home: screen,
    );
  }
}

/// One thing in the layers menu that can be switched on and off.
class _Layer {
  const _Layer(this.label, this.on, this.onChanged);

  final String label;
  final bool on;
  final ValueChanged<bool> onChanged;
}

/// The bar along the top: the style, the place icons and the layers, each a
/// menu that names its current value, and a button that turns north up.
class _TopBar extends StatelessWidget {
  const _TopBar({
    required this.look,
    required this.onLook,
    required this.icons,
    required this.onIcons,
    required this.layers,
    required this.onNorth,
  });

  final int look;
  final ValueChanged<int> onLook;
  final PlaceIcons icons;
  final ValueChanged<PlaceIcons> onIcons;
  final List<_Layer> layers;
  final VoidCallback onNorth;

  @override
  Widget build(BuildContext context) {
    final on = layers.where((l) => l.on).length;
    return Row(
      spacing: 8,
      children: [
        Expanded(
          child: FittedBox(
            fit: BoxFit.scaleDown,
            alignment: AlignmentDirectional.centerStart,
            child: Row(
              spacing: 6,
              children: [
                _Menu(
                  label: looks[look].label,
                  items: [
                    for (var i = 0; i < looks.length; i++)
                      _Choice(looks[i].label, i == look, () => onLook(i)),
                  ],
                ),
                _Menu(
                  prefix: 'Icons',
                  label: icons.label,
                  items: [
                    for (final mode in PlaceIcons.values)
                      _Choice(mode.label, mode == icons, () => onIcons(mode)),
                  ],
                ),
                _Menu(
                  prefix: 'Layers',
                  label: '$on',
                  items: [
                    for (final layer in layers)
                      CheckboxMenuButton(
                        value: layer.on,
                        closeOnActivate: false,
                        onChanged: (value) => layer.onChanged(value ?? false),
                        child: Text(layer.label),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
        _Round(icon: Icons.explore_outlined, onPressed: onNorth),
      ],
    );
  }
}

/// A menu entry that is one choice of several, ticked when it is the
/// current one.
class _Choice extends StatelessWidget {
  const _Choice(this.label, this.selected, this.onPressed);

  final String label;
  final bool selected;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) => MenuItemButton(
    onPressed: onPressed,
    trailingIcon: selected
        ? Icon(
            Icons.check,
            size: 18,
            color: Theme.of(context).colorScheme.primary,
          )
        : const SizedBox(width: 18),
    child: Text(label),
  );
}

/// A pill that opens [items], reading "[prefix] [label]".
class _Menu extends StatelessWidget {
  const _Menu({required this.label, required this.items, this.prefix});

  final String? prefix;
  final String label;
  final List<Widget> items;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return MenuAnchor(
      alignmentOffset: const Offset(0, 6),
      style: MenuStyle(
        backgroundColor: WidgetStatePropertyAll(scheme.surfaceContainerLowest),
        shape: WidgetStatePropertyAll(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
        padding: const WidgetStatePropertyAll(
          EdgeInsets.symmetric(vertical: 6),
        ),
      ),
      menuChildren: items,
      builder: (context, controller, _) => Material(
        color: scheme.surfaceContainerLowest,
        elevation: 1.5,
        shadowColor: Colors.black26,
        shape: const StadiumBorder(),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () =>
              controller.isOpen ? controller.close() : controller.open(),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 7, 6, 7),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (prefix != null)
                  Text(
                    '$prefix ',
                    style: TextStyle(
                      fontSize: 13,
                      height: 1.2,
                      color: scheme.onSurfaceVariant,
                    ),
                  ),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.2,
                    fontWeight: FontWeight.w600,
                    color: scheme.onSurface,
                  ),
                ),
                Icon(
                  Icons.arrow_drop_down_rounded,
                  size: 20,
                  color: scheme.onSurfaceVariant,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// A round button that floats over the map.
class _Round extends StatelessWidget {
  const _Round({required this.icon, required this.onPressed});

  final IconData icon;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color: scheme.surfaceContainerLowest,
      elevation: 1.5,
      shadowColor: Colors.black26,
      shape: const CircleBorder(),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onPressed,
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Icon(icon, size: 20, color: scheme.onSurface),
        ),
      ),
    );
  }
}

class _PlacePin extends StatelessWidget {
  const _PlacePin({
    required this.category,
    required this.selected,
    required this.onTap,
  });

  final Category category;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedScale(
        scale: selected ? 1 : 0.8,
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOutCubic,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: category.color,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 2.5),
            boxShadow: const [
              BoxShadow(
                color: Color(0x40000000),
                blurRadius: 6,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Icon(category.icon, color: Colors.white, size: 17),
        ),
      ),
    );
  }
}

class _Attribution extends StatelessWidget {
  const _Attribution();

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: scheme.surface.withValues(alpha: 0.75),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
        child: Text(
          '© OpenFreeMap © OpenMapTiles © OpenStreetMap',
          style: TextStyle(fontSize: 8.5, color: scheme.onSurfaceVariant),
        ),
      ),
    );
  }
}

class _PlaceCard extends StatelessWidget {
  const _PlaceCard({required this.place});

  final Place place;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color: scheme.surfaceContainerLowest,
      elevation: 3,
      shadowColor: Colors.black38,
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          spacing: 12,
          children: [
            DecoratedBox(
              decoration: BoxDecoration(
                color: place.category.color,
                shape: BoxShape.circle,
              ),
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Icon(place.category.icon, color: Colors.white, size: 20),
              ),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 2,
                children: [
                  Text(
                    place.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 16,
                      height: 1.25,
                      fontWeight: FontWeight.w600,
                      letterSpacing: -0.1,
                      color: scheme.onSurface,
                    ),
                  ),
                  Text(
                    place.category.label,
                    style: TextStyle(
                      fontSize: 13,
                      height: 1.25,
                      color: scheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
