import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';

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
    this.style = VmapStyle.light,
    this.markers = const [],
    this.pins,
    this.overlay,
    this.styleEdits = const [],
    this.featureStates = const [],
    this.textStyle = const VmapTextStyle(),
    this.labels = const VmapLabelOptions(),
    this.network = const VmapNetworkOptions(),
    this.rendering = const VmapRenderOptions(),
    this.fonts = const [],
    this.onError,
    this.minZoom = 0,
    this.maxZoom = double.infinity,
    super.key,
  }) : engine = null;

  /// Draws with an engine the app owns, for keeping loaded tiles across
  /// pages or sharing them.
  const VmapLayer.engine(
    VmapEngine this.engine, {
    this.minZoom = 0,
    this.maxZoom = double.infinity,
    super.key,
  }) : style = VmapStyle.light,
       markers = const [],
       pins = null,
       overlay = null,
       styleEdits = const [],
       featureStates = const [],
       textStyle = const VmapTextStyle(),
       labels = const VmapLabelOptions(),
       network = const VmapNetworkOptions(),
       rendering = const VmapRenderOptions(),
       fonts = const [],
       onError = null;

  final VmapEngine? engine;

  /// A MapLibre style, by address or as JSON, or the built in one.
  final VmapStyle style;

  /// The markers drawn above the map: pass the list given to `MarkerLayer`.
  /// Map labels keep clear of them, and a [NamedMarker] gets its name written
  /// beside it.
  final List<Marker> markers;

  /// Draws places of interest as round pins instead of the style's icons.
  final VmapPins? pins;

  /// Sources and layers of the app's own, drawn with the style.
  final VmapOverlay? overlay;

  /// Changes to single layers of the style: a colour, a filter, whether a
  /// layer is shown.
  final List<VmapStyleEdit> styleEdits;

  /// State for single features, which the style reads with
  /// `['feature-state', name]`.
  final List<VmapFeatureState> featureStates;

  /// The fonts of labels, their scale, and the look of markers' names.
  final VmapTextStyle textStyle;

  /// Which labels are written and how they are placed.
  final VmapLabelOptions labels;

  /// How the layer fetches and keeps what it loads. Read when the layer is
  /// first built. Set its user agent to the app's name, as `TileLayer`'s
  /// `userAgentPackageName`.
  final VmapNetworkOptions network;

  /// What draws the map. Read when the layer is first built.
  final VmapRenderOptions rendering;

  /// Fonts labels may be shaped with, beyond the app's own. Read when the
  /// layer is first built.
  final List<VmapFont> fonts;

  /// Told of everything the layer could not load or draw.
  final void Function(VmapError error)? onError;

  /// The layer draws nothing, and asks for no tiles, below this zoom, in
  /// flutter_map's zoom.
  final double minZoom;

  /// The layer draws nothing, and asks for no tiles, above this zoom, in
  /// flutter_map's zoom.
  final double maxZoom;

  @override
  State<VmapLayer> createState() => VmapLayerState();
}

/// Reached through a `GlobalKey<VmapLayerState>` on the layer.
class VmapLayerState extends State<VmapLayer> with WidgetsBindingObserver {
  VmapEngine? _owned;

  /// What draws the layer: ask it what is on the map, about clusters, to
  /// download a region or clear the cache, and for the sources' credits.
  /// Its zooms are vmap's, one below flutter_map's.
  VmapEngine get engine => widget.engine ?? _owned!;

  /// A browser fetches the font for a script the first time it is drawn,
  /// and a phone can have its font changed while the app runs.
  void _fontsChanged() => engine.fontsChanged();

  @override
  void initState() {
    super.initState();
    if (widget.engine == null) {
      _owned =
          VmapEngine(
              style: widget.style,
              network: widget.network,
              rendering: widget.rendering,
              labels: widget.labels,
              text: widget.textStyle,
              fonts: widget.fonts,
              pins: widget.pins,
              overlay: widget.overlay,
              edits: widget.styleEdits,
            )
            ..onError = widget.onError
            ..markers = _vmapMarkers(widget.markers)
            ..featureStates = widget.featureStates;
    }
    PaintingBinding.instance.systemFonts.addListener(_fontsChanged);
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didHaveMemoryPressure() => engine.trimMemory();

  @override
  void didUpdateWidget(VmapLayer oldWidget) {
    super.didUpdateWidget(oldWidget);
    final owned = _owned;
    if (owned == null) return;
    owned
      ..style = widget.style
      ..pins = widget.pins
      ..overlay = widget.overlay
      ..edits = widget.styleEdits
      ..labels = widget.labels
      ..onError = widget.onError
      ..text = widget.textStyle;
    final markers = _vmapMarkers(widget.markers);
    if (!VmapMarker.sameRooms(_vmapMarkers(oldWidget.markers), markers)) {
      owned.markers = markers;
    }
    if (!identical(oldWidget.featureStates, widget.featureStates)) {
      owned.featureStates = widget.featureStates;
    }
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
    WidgetsBinding.instance.removeObserver(this);
    PaintingBinding.instance.systemFonts.removeListener(_fontsChanged);
    _owned?.dispose();
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
