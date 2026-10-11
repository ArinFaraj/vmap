import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import 'gestures.dart';
import 'layer.dart';
import 'pins.dart';
import 'query.dart';
import 'style.dart';

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
    this.curvedLabels = true,
    this.textStyle,
    this.markerTextStyle,
    this.cacheDirectory,
    this.userAgentPackageName = 'unknown',
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

  /// Road names follow bends.
  final bool curvedLabels;
  final TextStyle? textStyle;
  final TextStyle? markerTextStyle;
  final String? cacheDirectory;
  final String userAgentPackageName;

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
  State<VmapMap> createState() => _VmapMapState();
}

class _VmapMapState extends State<VmapMap> {
  MapController? _owned;
  final _layer = GlobalKey<VmapLayerState>();

  MapController get _controller =>
      widget.controller ?? (_owned ??= MapController());

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
                  final found = await _layer.currentState?.featuresAt(point);
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
            curvedLabels: widget.curvedLabels,
            textStyle: widget.textStyle,
            markerTextStyle: widget.markerTextStyle,
            cacheDirectory: widget.cacheDirectory,
            userAgentPackageName: widget.userAgentPackageName,
          ),
          if (widget.markers.isNotEmpty) MarkerLayer(markers: widget.markers),
          ...widget.children,
        ],
      ),
    );
  }
}
