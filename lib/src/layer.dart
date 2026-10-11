import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';

import 'camera.dart';
import 'engine.dart';
import 'labels.dart';

import 'package:latlong2/latlong.dart';

import 'pins.dart';
import 'query.dart';
import 'style.dart';
import 'worker.dart';

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

/// A flutter_map layer that draws vector tiles. Put it where a `TileLayer`
/// would go.
class VmapLayer extends StatefulWidget {
  const VmapLayer({
    this.style = VmapStyle.light,
    this.markers = const [],
    this.pins,
    this.overlay,
    this.styleEdits = const [],
    this.featureStates = const [],
    this.curvedLabels = true,
    this.textStyle,
    this.markerTextStyle,
    this.cacheDirectory,
    this.userAgentPackageName = 'unknown',
    this.headers = const {},
    this.onError,
    this.minZoom = 0,
    this.maxZoom = double.infinity,
    super.key,
  }) : engine = null;

  /// Draws with an engine the app owns, for reading its stats or keeping
  /// loaded tiles across pages.
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
       curvedLabels = true,
       textStyle = null,
       markerTextStyle = null,
       cacheDirectory = null,
       headers = const {},
       onError = null,
       userAgentPackageName = 'unknown';

  final VmapEngine? engine;

  /// A MapLibre style, by address or as JSON, or one of the built in ones.
  final VmapStyle style;

  /// The markers drawn above the map: pass the list given to `MarkerLayer`.
  /// Map labels keep clear of them, and a [NamedMarker] gets its name written
  /// beside it.
  final List<Marker> markers;

  /// Draws places of interest as round pins instead of the style's icons.
  /// [VmapPins.standard] covers the usual kinds of place.
  final VmapPins? pins;

  /// Sources and layers of your own, drawn with the style.
  final VmapOverlay? overlay;

  /// Changes to single layers of the style: a colour, a filter, whether a
  /// layer is shown.
  final List<VmapStyleEdit> styleEdits;

  /// State for single features, which the style reads with
  /// `['feature-state', name]`.
  final List<VmapFeatureState> featureStates;

  /// Road names follow bends. Off, a name is written only where its road is
  /// straight enough.
  final bool curvedLabels;

  /// The font of every label: family and fallbacks. Sizes and colours come
  /// from the style.
  final TextStyle? textStyle;

  /// Size, weight and colour of the names beside markers.
  final TextStyle? markerTextStyle;

  /// Downloaded tiles and styles are kept here between runs.
  final String? cacheDirectory;

  /// Sent to the tile server as the user agent, as `TileLayer` does.
  final String userAgentPackageName;

  /// Sent with every request the map makes, for a server that wants a key or
  /// a token in a header. Read once, when the layer is first built.
  final Map<String, String> headers;

  /// Told of every style, tile or sprite that could not be loaded. The map
  /// keeps trying on its own; this is for the app to log or show.
  final void Function(Object error)? onError;

  /// The layer draws nothing, and asks for no tiles, below this zoom.
  final double minZoom;

  /// The layer draws nothing, and asks for no tiles, above this zoom.
  final double maxZoom;

  @override
  State<VmapLayer> createState() => VmapLayerState();
}

/// Reached through a `GlobalKey<VmapLayerState>` on the layer.
class VmapLayerState extends State<VmapLayer> {
  VmapEngine? _owned;

  /// What the map shows at [point]: the features the style draws within
  /// [radius] logical pixels of it, topmost first.
  Future<List<VmapFeature>> featuresAt(LatLng point, {double radius = 6}) =>
      _engine.featuresAt(point, radius: radius);

  /// What the map shows between [southWest] and [northEast]: the features
  /// the style draws that touch the box, topmost first.
  Future<List<VmapFeature>> featuresIn(LatLng southWest, LatLng northEast) =>
      _engine.featuresIn(southWest, northEast);

  /// The map zoom at which a cluster of a clustered GeoJSON source comes
  /// apart, for zooming in on a tapped cluster.
  Future<double?> clusterExpansionZoom(String source, int clusterId) =>
      _engine.clusterExpansionZoom(source, clusterId);

  /// What a cluster comes apart into at its expansion zoom.
  Future<List<VmapClusterMember>> clusterChildren(
    String source,
    int clusterId,
  ) => _engine.clusterChildren(source, clusterId);

  /// The points of the data inside a cluster.
  Future<List<VmapClusterMember>> clusterLeaves(
    String source,
    int clusterId, {
    int limit = 10,
    int offset = 0,
  }) => _engine.clusterLeaves(source, clusterId, limit: limit, offset: offset);

  /// Fetches the tiles of a region into the cache directory for use
  /// offline. See [VmapEngine.downloadRegion].
  Future<VmapDownload> downloadRegion({
    required double west,
    required double south,
    required double east,
    required double north,
    required double minZoom,
    required double maxZoom,
    void Function(int done, int total)? onProgress,
    bool Function()? cancelled,
  }) => _engine.downloadRegion(
    west: west,
    south: south,
    east: east,
    north: north,
    minZoom: minZoom,
    maxZoom: maxZoom,
    onProgress: onProgress,
    cancelled: cancelled,
  );

  /// The credit the style's sources ask for, once the style has loaded.
  List<String> get attributions => _engine.attributions;

  /// Loads the style and every tile again, from the cache where it has them.
  void reload() => _engine.reload();

  /// Deletes what the map keeps in the cache directory, then loads it again
  /// from the network.
  Future<void> clearCache() => _engine.clearCache();

  VmapEngine get _engine => widget.engine ?? _owned!;

  /// A browser fetches the font for a script the first time it is drawn,
  /// and a phone can have its font changed while the app runs.
  void _fontsChanged() => _engine.fontsChanged();

  VmapTextStyle get _text => VmapTextStyle(
    fontFamily: widget.textStyle?.fontFamily,
    fontFamilyFallback: widget.textStyle?.fontFamilyFallback,
    markerSize: widget.markerTextStyle?.fontSize ?? 12.5,
    markerWeight: widget.markerTextStyle?.fontWeight?.value ?? 600,
    markerColor: widget.markerTextStyle?.color,
  );

  @override
  void initState() {
    super.initState();
    if (widget.engine == null) {
      _owned =
          VmapEngine(
              style: widget.style,
              text: _text,
              pins: widget.pins,
              overlay: widget.overlay,
              edits: widget.styleEdits,
              curvedLabels: widget.curvedLabels,
              source: TileSourceConfig(
                cacheDirectory: widget.cacheDirectory,
                userAgent: widget.userAgentPackageName,
                headers: widget.headers,
              ),
            )
            ..onError = widget.onError
            ..markers = widget.markers
            ..featureStates = widget.featureStates;
    }
    PaintingBinding.instance.systemFonts.addListener(_fontsChanged);
  }

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
      ..curvedLabels = widget.curvedLabels
      ..onError = widget.onError
      ..text = _text;
    if (!_sameMarkers(oldWidget.markers, widget.markers)) {
      owned.markers = widget.markers;
    }
    if (!identical(oldWidget.featureStates, widget.featureStates)) {
      owned.featureStates = widget.featureStates;
    }
  }

  static bool _sameMarkers(List<Marker> a, List<Marker> b) {
    if (identical(a, b)) return true;
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      final x = a[i], y = b[i];
      if (x.point != y.point ||
          x.width != y.width ||
          x.height != y.height ||
          x.alignment != y.alignment ||
          (x is NamedMarker ? x.name : null) !=
              (y is NamedMarker ? y.name : null)) {
        return false;
      }
    }
    return true;
  }

  @override
  void dispose() {
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
    return MobileLayerTransformer(
      child: RepaintBoundary(
        child: CustomPaint(
          size: camera.size,
          painter: _VmapPainter(
            _engine,
            VmapCamera(
              zoom: camera.zoom,
              origin: camera.pixelOrigin,
              size: camera.size,
              rotation: camera.rotationRad,
              devicePixelRatio: MediaQuery.devicePixelRatioOf(context),
            ),
          ),
        ),
      ),
    );
  }
}

class _VmapPainter extends CustomPainter {
  _VmapPainter(this.engine, this.camera) : super(repaint: engine);

  final VmapEngine engine;
  final VmapCamera camera;

  @override
  void paint(Canvas canvas, Size size) => engine.paint(canvas, camera);

  @override
  bool shouldRepaint(_VmapPainter oldDelegate) => true;
}
