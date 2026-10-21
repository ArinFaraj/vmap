import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import 'package:vmap/vmap.dart';

import 'gestures.dart';
import 'layer.dart';

/// A whole map in one widget: a [FlutterMap] with a [VmapLayer], the markers
/// above it, and [VmapGestures] in place of flutter_map's own.
///
/// Reach for [VmapLayer] instead to add vector tiles to a `FlutterMap` you
/// already have.
class VmapMap extends StatefulWidget {
  const VmapMap({
    required this.initialCenter,
    this.initialZoom = 13,
    this.initialRotation = 0,
    this.minZoom = 3,
    this.maxZoom = 19,
    this.rotate = true,
    this.style = VmapStyle.light,
    this.controller,
    this.markers = const [],
    this.pins,
    this.overlay,
    this.styleEdits = const [],
    this.featureStates = const [],
    this.curvedLabels = true,
    this.crossSourceCollisions = true,
    this.textStyle,
    this.markerTextStyle,
    this.cacheDirectory,
    this.userAgentPackageName = 'unknown',
    this.headers = const {},
    this.onError,
    this.backgroundColor,
    this.onTap,
    this.onLongPress,
    this.onFeatureTap,
    this.onPositionChanged,
    this.children = const [],
    super.key,
  });

  final LatLng initialCenter;
  final double initialZoom;

  /// In degrees, clockwise.
  final double initialRotation;
  final double minZoom;
  final double maxZoom;

  /// Two fingers turning turn the map.
  final bool rotate;
  final VmapStyle style;

  /// Moves and reads the map from outside. The widget makes its own when
  /// none is given.
  final MapController? controller;

  /// Drawn above the map. Map labels keep clear of them, and a [NamedMarker]
  /// gets its name written beside it.
  final List<Marker> markers;

  /// Draws places of interest as round pins instead of the style's icons.
  final VmapPins? pins;

  /// Sources and layers of your own, drawn with the style.
  final VmapOverlay? overlay;

  /// Changes to single layers of the style: a colour, a filter, whether a
  /// layer is shown.
  final List<VmapStyleEdit> styleEdits;

  /// State for single features, which the style reads with
  /// `['feature-state', name]`: the way to highlight what was tapped.
  final List<VmapFeatureState> featureStates;

  /// Road names follow bends.
  final bool curvedLabels;

  /// Labels of different sources keep clear of each other.
  final bool crossSourceCollisions;
  final TextStyle? textStyle;
  final TextStyle? markerTextStyle;
  final String? cacheDirectory;
  final String userAgentPackageName;

  /// Sent with every request the map makes, for a server that wants a key or
  /// a token in a header. Read once, when the map is first built.
  final Map<String, String> headers;

  /// Told of every style, tile or sprite that could not be loaded.
  final void Function(Object error)? onError;

  /// Shown where no tile has loaded yet.
  final Color? backgroundColor;
  final void Function(LatLng point)? onTap;
  final void Function(LatLng point)? onLongPress;

  /// Called after a tap with what the map shows there, topmost first: roads,
  /// buildings, places, and the features of your own overlay. The list is
  /// empty for a tap on nothing. It arrives a moment after [onTap].
  final void Function(LatLng point, List<VmapFeature> features)? onFeatureTap;
  final void Function(MapCamera camera, bool byGesture)? onPositionChanged;

  /// More flutter_map layers, drawn above the markers.
  final List<Widget> children;

  @override
  State<VmapMap> createState() => VmapMapState();
}

/// Reached through a `GlobalKey<VmapMapState>` on the map.
class VmapMapState extends State<VmapMap> {
  MapController? _owned;
  final _layer = GlobalKey<VmapLayerState>();

  MapController get _controller =>
      widget.controller ?? (_owned ??= MapController());

  /// What draws the map, once it is built: ask it what is on the map, about
  /// clusters, to download a region or clear the cache, and for the
  /// sources' credits.
  VmapEngine? get engine => _layer.currentState?.engine;

  @override
  void dispose() {
    _owned?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final onTap = widget.onTap;
    final onFeatureTap = widget.onFeatureTap;
    final onLongPress = widget.onLongPress;
    return VmapGestures(
      controller: _controller,
      minZoom: widget.minZoom,
      maxZoom: widget.maxZoom,
      rotate: widget.rotate,
      child: FlutterMap(
        mapController: _controller,
        options: MapOptions(
          initialCenter: widget.initialCenter,
          initialZoom: widget.initialZoom,
          initialRotation: widget.initialRotation,
          minZoom: widget.minZoom,
          maxZoom: widget.maxZoom,
          backgroundColor: widget.backgroundColor ?? const Color(0xFFE0E0E0),
          onTap: onTap == null && onFeatureTap == null
              ? null
              : (_, point) async {
                  onTap?.call(point);
                  if (onFeatureTap == null) return;
                  final found = await engine?.featuresAt(point);
                  if (mounted && found != null) onFeatureTap(point, found);
                },
          onLongPress: onLongPress == null
              ? null
              : (_, point) => onLongPress(point),
          onPositionChanged: widget.onPositionChanged,
          interactionOptions: const InteractionOptions(
            flags: InteractiveFlag.none,
          ),
        ),
        children: [
          VmapLayer(
            key: _layer,
            style: widget.style,
            markers: widget.markers,
            pins: widget.pins,
            overlay: widget.overlay,
            styleEdits: widget.styleEdits,
            featureStates: widget.featureStates,
            curvedLabels: widget.curvedLabels,
            crossSourceCollisions: widget.crossSourceCollisions,
            textStyle: widget.textStyle,
            markerTextStyle: widget.markerTextStyle,
            cacheDirectory: widget.cacheDirectory,
            userAgentPackageName: widget.userAgentPackageName,
            headers: widget.headers,
            onError: widget.onError,
          ),
          if (widget.markers.isNotEmpty) MarkerLayer(markers: widget.markers),
          ...widget.children,
        ],
      ),
    );
  }
}
