import 'package:flutter/widgets.dart';
import 'package:latlong2/latlong.dart';

/// A widget drawn above the map at [point], in a box [width] by [height].
/// Map labels keep clear of the box, and [name], when given, is written
/// beside it ahead of every map label; when there is no room the name hides
/// and the marker stays.
@immutable
class VmapMarker {
  const VmapMarker({
    required this.point,
    this.child,
    this.width = 30,
    this.height = 30,
    this.alignment,
    this.name,
    this.key,
  });

  final LatLng point;

  /// What is drawn. Null keeps the box clear of labels and draws nothing,
  /// for an app that draws its markers itself.
  final Widget? child;
  final double width;
  final double height;

  /// Which way the box sits from [point]: `Alignment.topCenter` puts it
  /// above. Centred on the point when null.
  final Alignment? alignment;
  final String? name;

  /// Keeps a marker's widget state when markers are added or removed
  /// before it.
  final Key? key;

  /// Whether [other] takes the same room on the map, which is all the
  /// labels care about.
  bool sameRoom(VmapMarker other) =>
      other.point == point &&
      other.width == width &&
      other.height == height &&
      other.alignment == alignment &&
      other.name == name;

  /// Whether [a] and [b] take the same room, marker by marker.
  static bool sameRooms(List<VmapMarker> a, List<VmapMarker> b) {
    if (identical(a, b)) return true;
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!a[i].sameRoom(b[i])) return false;
    }
    return true;
  }
}
