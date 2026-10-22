import 'package:flutter/material.dart';
import 'package:vmap/vmap.dart';

void main() => runApp(const ExampleApp());

class ExampleApp extends StatelessWidget {
  const ExampleApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'vmap',
    theme: ThemeData(colorSchemeSeed: Colors.indigo),
    home: const MapPage(),
  );
}

const _erbil = VmapCamera(center: LatLng(36.1912, 44.0092), zoom: 14);
const _citadel = LatLng(36.19114, 44.00921);

const _styles = {
  'Light': VmapStyle.light,
  'Dark': VmapStyle.dark,
  'Liberty': VmapStyle.url('https://tiles.openfreemap.org/styles/liberty'),
  'Positron': VmapStyle.url('https://tiles.openfreemap.org/styles/positron'),
};

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  final _controller = VmapController(_erbil);
  String _style = 'Liberty';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _tapped(VmapFeature feature, LatLng point) {
    final name = feature.properties['name:en'] ?? feature.properties['name'];
    ScaffoldMessenger.of(context)
      ..clearSnackBars()
      ..showSnackBar(
        SnackBar(
          content: Text(
            '${name ?? feature.sourceLayer} (${feature.layers.first})',
          ),
        ),
      );
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('vmap'),
      actions: [
        DropdownButton<String>(
          value: _style,
          underline: const SizedBox.shrink(),
          items: [
            for (final name in _styles.keys)
              DropdownMenuItem(value: name, child: Text(name)),
          ],
          onChanged: (name) => setState(() => _style = name!),
        ),
        const SizedBox(width: 12),
      ],
    ),
    body: Vmap(
      controller: _controller,
      style: _styles[_style]!,
      markers: const [
        VmapMarker(
          point: _citadel,
          name: 'Citadel',
          width: 32,
          height: 32,
          alignment: Alignment.topCenter,
          child: Icon(Icons.location_on, color: Colors.red, size: 32),
        ),
      ],
      onFeatureTap: _tapped,
      loadingBuilder: (context) =>
          const Center(child: CircularProgressIndicator()),
    ),
    floatingActionButton: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        FloatingActionButton.small(
          heroTag: 'frame',
          tooltip: 'Frame the old town',
          onPressed: () => _controller.fitBounds(
            const VmapBounds(LatLng(36.186, 44.003), LatLng(36.196, 44.016)),
            padding: const EdgeInsets.all(40),
            duration: const Duration(milliseconds: 600),
          ),
          child: const Icon(Icons.crop_free),
        ),
        const SizedBox(height: 12),
        FloatingActionButton(
          heroTag: 'fly',
          tooltip: 'Fly to the buildings',
          onPressed: () => _controller.flyTo(
            _erbil.copyWith(zoom: 16.5, pitch: 60, bearing: -30),
          ),
          child: const Icon(Icons.threed_rotation),
        ),
      ],
    ),
  );
}
