import 'package:flutter/foundation.dart';
import 'package:flutter/painting.dart';
import 'package:latlong2/latlong.dart';

/// Where the app draws a widget above the map: a box at [point]. Map labels
/// keep clear of the box, and [name], when given, is written beside it ahead
/// of every map label; when there is no room the name hides and the marker
/// stays.
@immutable
class VmapMarker {
  const VmapMarker({
    required this.point,
    this.width = 30,
    this.height = 30,
    this.alignment,
    this.name,
  });

  final LatLng point;
  final double width;
  final double height;

  /// Which way the box sits from [point]: `Alignment.topCenter` puts it
  /// above. Centred on the point when null.
  final Alignment? alignment;
  final String? name;

  @override
  bool operator ==(Object other) =>
      other is VmapMarker &&
      other.point == point &&
      other.width == width &&
      other.height == height &&
      other.alignment == alignment &&
      other.name == name;

  @override
  int get hashCode => Object.hash(point, width, height, alignment, name);
}
