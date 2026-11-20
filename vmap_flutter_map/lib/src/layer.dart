import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:vmap/engine_owner.dart';
import 'package:vmap/vmap.dart';

/// A flutter_map [Marker] with a name the map writes beside it, placed so it
/// never covers another label.
class NamedMarker extends Marker {
  const NamedMarker({
    required this.name,
    required super.point,
    required super.child,
    super.key,
    super.width,
    super.height,
    super.alignment,
    super.rotate,
  });

  final String name;
}

/// A flutter_map layer that draws any MapLibre style. Put it where a
/// `TileLayer` would go.
class VmapLayer extends StatefulWidget {
  const VmapLayer({
    this.options = const VmapEngineOptions(),
    this.engine,
    this.markers = const [],
    this.onError,
    this.minZoom = 0,
    this.maxZoom = double.infinity,
    super.key,
  });

  /// The style and everything else the layer makes its engine with. Set
  /// the network's user agent to the app's name, as `TileLayer`'s
  /// `userAgentPackageName`.
  final VmapEngineOptions options;

  /// Draws with an engine the app made and owns, to keep loaded tiles
  /// across pages or share them. [options] are then ignored: set them on
  /// this one.
  final VmapEngine? engine;

  /// The markers drawn above the map: pass the list given to `MarkerLayer`.
  /// Map labels keep clear of them, and a [NamedMarker] gets its name written
  /// beside it.
  final List<Marker> markers;

  /// Told of everything the layer could not load or draw. Only for the
  /// layer's own engine; an app's [engine] reports to its own `onError`.
  final void Function(VmapError error)? onError;

  /// The layer draws nothing, and asks for no tiles, below this zoom, in
  /// flutter_map's zoom, as a `TileLayer`'s.
  final double minZoom;

  /// The layer draws nothing, and asks for no tiles, above this zoom, in
  /// flutter_map's zoom, as a `TileLayer`'s.
  final double maxZoom;

  @override
  State<VmapLayer> createState() => VmapLayerState();
}

/// Reached through a `GlobalKey<VmapLayerState>` on the layer.
class VmapLayerState extends State<VmapLayer> {
  late final VmapEngineOwner _owner;

  /// What draws the layer: ask it what is on the map, about clusters, to
  /// download a region or clear the cache, and for the sources' credits.
  /// Its zooms are vmap's, one below flutter_map's.
  VmapEngine get engine => _owner.engine;

  @override
  void initState() {
    super.initState();
    _owner = VmapEngineOwner(
      options: widget.options,
      onError: (error) => widget.onError?.call(error),
      markers: _vmapMarkers(widget.markers),
      engine: widget.engine,
    );
  }

  @override
  void didUpdateWidget(VmapLayer oldWidget) {
    super.didUpdateWidget(oldWidget);
    _owner.update(
      options: widget.options,
      markers: _vmapMarkers(widget.markers),
      engine: widget.engine,
    );
  }

  static List<VmapMarker> _vmapMarkers(List<Marker> markers) => [
    for (final m in markers)
      VmapMarker(
        point: m.point,
        width: m.width,
        height: m.height,
        alignment: m.alignment,
        name: m is NamedMarker ? m.name : null,
      ),
  ];

  @override
  void dispose() {
    _owner.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final camera = MapCamera.of(context);
    if (camera.zoom < widget.minZoom || camera.zoom > widget.maxZoom) {
      return const SizedBox.shrink();
    }
    return RepaintBoundary(
      child: CustomPaint(
        size: camera.nonRotatedSize,
        painter: _VmapPainter(
          engine,
          cameraOf(camera),
          MediaQuery.devicePixelRatioOf(context),
        ),
      ),
    );
  }
}

/// What flutter_map's [camera] shows, as vmap's camera. flutter_map's tiles
/// are 256 pixels across and MapLibre's 512, so its zoom is one higher, and
/// it turns the map the other way.
@visibleForTesting
VmapCamera cameraOf(MapCamera camera) => VmapCamera(
  center: camera.center,
  zoom: camera.zoom - 1,
  bearing: -camera.rotation,
);

class _VmapPainter extends CustomPainter {
  _VmapPainter(this.engine, this.camera, this.devicePixelRatio)
    : super(repaint: engine);

  final VmapEngine engine;
  final VmapCamera camera;
  final double devicePixelRatio;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.clipRect(Offset.zero & size);
    engine.paint(canvas, size, camera, devicePixelRatio: devicePixelRatio);
  }

  @override
  bool shouldRepaint(_VmapPainter oldDelegate) => true;
}
