import 'dart:io';
import 'dart:ui' as ui;

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

class MapLook {
  const MapLook(this.label, this.style, {this.dark = false});

  final String label;
  final VmapStyle style;
  final bool dark;
}

final _nameKeys = _names.split(',');

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
      'paint': {'fill-color': '#1A73E8', 'fill-opacity': 0.18},
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
      'paint': {'line-color': '#1A73E8', 'line-width': 5},
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

final looks = [
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
  }

  Future<void> _capture() async {
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
        if (!_plain)
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
              backgroundColor: scheme.surface,
              onTap: (_) => _select(null),
              style: look.style,
              markers: markers,
              pins: _pins ? VmapPins.standard : null,
              overlay: const bool.fromEnvironment('OVERLAY') ? _overlay : null,
              onFeatureTap: (_, features) {
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
              minimum: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Align(
                    alignment: AlignmentDirectional.topEnd,
                    child: _StyleButton(
                      label: look.label,
                      onPressed: () =>
                          setState(() => _look = (_look + 1) % looks.length),
                    ),
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
        ],
      ),
    );
    final desktop = Platform.isMacOS || Platform.isWindows || Platform.isLinux;
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

class _StyleButton extends StatelessWidget {
  const _StyleButton({required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color: scheme.surfaceContainerLowest,
      elevation: 2,
      shadowColor: Colors.black26,
      shape: const StadiumBorder(),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onPressed,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 9, 16, 9),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: 8,
            children: [
              Icon(Icons.layers_outlined, size: 18, color: scheme.onSurface),
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  height: 1.2,
                  fontWeight: FontWeight.w500,
                  color: scheme.onSurface,
                ),
              ),
            ],
          ),
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
