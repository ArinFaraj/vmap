import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';

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
    this.curvedLabels = true,
    this.textStyle,
    this.markerTextStyle,
    this.cacheDirectory,
    this.userAgentPackageName = 'unknown',
    super.key,
  }) : engine = null;

  /// Draws with an engine the app owns, for reading its stats or keeping
  /// loaded tiles across pages.
  const VmapLayer.engine(VmapEngine this.engine, {super.key})
    : style = VmapStyle.light,
      markers = const [],
      pins = null,
      overlay = null,
      curvedLabels = true,
      textStyle = null,
      markerTextStyle = null,
      cacheDirectory = null,
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

  VmapEngine get _engine => widget.engine ?? _owned!;

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
      _owned = VmapEngine(
        style: widget.style,
        text: _text,
        pins: widget.pins,
        overlay: widget.overlay,
        curvedLabels: widget.curvedLabels,
        source: TileSourceConfig(
          cacheDirectory: widget.cacheDirectory,
          userAgent: widget.userAgentPackageName,
        ),
      )..markers = widget.markers;
    }
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
      ..curvedLabels = widget.curvedLabels
      ..text = _text;
    if (!_sameMarkers(oldWidget.markers, widget.markers)) {
      owned.markers = widget.markers;
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
    _owned?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final camera = MapCamera.of(context);
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
