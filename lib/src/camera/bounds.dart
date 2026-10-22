import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:latlong2/latlong.dart';

/// The area between two corners: what [VmapController.fitBounds] frames,
/// [VmapController.featuresIn] reads and [VmapController.downloadRegion]
/// fetches.
@immutable
class VmapBounds {
  /// The area from [southWest] to [northEast].
  const VmapBounds(this.southWest, this.northEast);

  /// The smallest bounds holding every one of [points], which must not be
  /// empty.
  factory VmapBounds.around(Iterable<LatLng> points) {
    var south = 90.0, west = 180.0, north = -90.0, east = -180.0;
    for (final p in points) {
      south = math.min(south, p.latitude);
      north = math.max(north, p.latitude);
      west = math.min(west, p.longitude);
      east = math.max(east, p.longitude);
    }
    if (south > north) throw ArgumentError.value(points, 'points', 'empty');
    return VmapBounds(LatLng(south, west), LatLng(north, east));
  }

  /// The corner with the lowest latitude and longitude.
  final LatLng southWest;

  /// The corner with the highest latitude and longitude.
  final LatLng northEast;

  @override
  bool operator ==(Object other) =>
      other is VmapBounds &&
      other.southWest == southWest &&
      other.northEast == northEast;

  @override
  int get hashCode => Object.hash(southWest, northEast);
}
