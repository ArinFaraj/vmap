import 'dart:math' as math;

/// The latitude Web Mercator stops at, north and south.
const double maxLatitude = 85.0511;

/// A longitude as a fraction of the world's width, 0 at 180 west.
double worldX(double longitude) => (longitude + 180) / 360;

/// A latitude as a fraction of the world's height, 0 at the top. Latitudes
/// past [maxLatitude] land on the edge.
double worldY(double latitude) {
  final r = latitude.clamp(-maxLatitude, maxLatitude) * math.pi / 180;
  return (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2;
}

/// The longitude at a fraction [x] of the world's width.
double longitudeAt(double x) => x * 360 - 180;

/// The latitude at a fraction [y] of the world's height.
double latitudeAt(double y) {
  final v = math.pi * (1 - 2 * y);
  return math.atan((math.exp(v) - math.exp(-v)) / 2) * 180 / math.pi;
}

/// The column of the tile at zoom [z] that holds [longitude].
int tileColumn(double longitude, int z) {
  final n = 1 << z;
  return (worldX(longitude) * n).floor().clamp(0, n - 1);
}

/// The row of the tile at zoom [z] that holds [latitude].
int tileRow(double latitude, int z) {
  final n = 1 << z;
  return (worldY(latitude) * n).floor().clamp(0, n - 1);
}

/// The zoom of the 512 pixel tiles drawn at map zoom [mapZoom], for a source
/// that stops at [maxZoom].
int tileZoomAt(double mapZoom, int maxZoom) =>
    (mapZoom - 1).floor().clamp(0, maxZoom);
