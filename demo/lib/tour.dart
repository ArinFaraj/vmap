import 'dart:math' as math;

import 'package:flutter/scheduler.dart';
import 'package:vmap/vmap.dart';

import 'flight.dart';

/// What the map shows besides the style.
enum DataLayer { none, heatmap, clusters }

/// One place the tour stops at: where the camera goes, how it drifts while
/// it stays, and what the map shows there.
class TourStop {
  const TourStop({
    required this.title,
    required this.caption,
    required this.code,
    required this.camera,
    this.hold = const Duration(seconds: 7),
    this.orbit = 0,
    this.drift = 0,
    this.push = 0,
    this.terrain = false,
    this.data = DataLayer.none,
  });

  final String title, caption, code;
  final VmapCamera camera;
  final Duration hold;

  /// Degrees a second the camera turns while it stays.
  final double orbit;

  /// Degrees of longitude a second the camera moves east while it stays.
  final double drift;

  /// Zoom levels the camera moves in over the stay.
  final double push;

  final bool terrain;
  final DataLayer data;
}

const tourStops = [
  TourStop(
    title: 'Any MapLibre style, on the GPU',
    caption:
        'The globe at low zooms, flat up close. Every layer drawn with '
        'Flutter GPU, on every platform.',
    code: "Vmap(style: VmapStyle.url('https://tiles.openfreemap.org/styles/liberty'))",
    camera: VmapCamera(center: LatLng(28, 38), zoom: 1.7),
    hold: Duration(seconds: 6),
    drift: 6,
  ),
  TourStop(
    title: '3D buildings, labels in every script',
    caption:
        'Erbil\'s citadel. Kurdish and Arabic names shaped and joined as '
        'they are written.',
    code: 'controller.flyTo(VmapCamera(center: erbil, zoom: 16.4, pitch: 62))',
    camera: VmapCamera(
      center: LatLng(36.1912, 44.0092),
      zoom: 16.4,
      pitch: 62,
      bearing: -20,
    ),
    orbit: 5,
    push: 0.15,
  ),
  TourStop(
    title: 'Tilt up to 85 degrees',
    caption:
        'Lower Manhattan, with depth tested buildings, sky and fog past the '
        'horizon.',
    code: 'Vmap(maxPitch: 85, style: VmapStyle.url(liberty))',
    camera: VmapCamera(
      center: LatLng(40.7069, -74.0113),
      zoom: 15.7,
      pitch: 72,
      bearing: 28,
    ),
    orbit: 4,
    push: 0.2,
  ),
  TourStop(
    title: 'Terrain, draped with the map',
    caption:
        'The Matterhorn from elevation tiles, the map laid over the ground '
        'it raises.',
    code: "VmapOverlay(terrain: {'source': 'dem', 'exaggeration': 1.5})",
    camera: VmapCamera(
      center: LatLng(45.9763, 7.6586),
      zoom: 12.6,
      pitch: 63,
      bearing: 222,
    ),
    orbit: 3,
    push: 0.2,
    terrain: true,
  ),
  TourStop(
    title: 'Your own data, as a heatmap',
    caption: 'Six thousand earthquakes from a GeoJSON file, weighed by size.',
    code: "{'id': 'quakes', 'type': 'heatmap', 'source': 'quakes', 'paint': {...}}",
    camera: VmapCamera(center: LatLng(48, -142), zoom: 2.6),
    drift: 2.5,
    data: DataLayer.heatmap,
  ),
  TourStop(
    title: 'Clustered, as MapLibre clusters',
    caption:
        'The same points gathered by zoom, each count a circle of its own.',
    code: "'quakes': {'type': 'geojson', 'data': quakes, 'cluster': true}",
    camera: VmapCamera(center: LatLng(39.5, -119), zoom: 4.6, pitch: 30),
    orbit: 2,
    push: 0.35,
    data: DataLayer.clusters,
  ),
];

/// Moves the camera through [stops]: a flight to each, then a slow drift
/// while it stays, eased in and out so the camera never jolts. Loops.
class Tour {
  Tour({
    required this.controller,
    required TickerProvider vsync,
    required this.viewWidth,
    required this.onStop,
    required this.onArriving,
    this.stops = tourStops,
  }) {
    _ticker = vsync.createTicker(_tick);
  }

  final VmapController controller;
  final double Function() viewWidth;
  final List<TourStop> stops;

  /// Told when the tour heads for stop [index].
  final void Function(int index) onStop;

  /// Told halfway through the flight to stop [index], high above the map,
  /// when what the map shows can change unseen.
  final void Function(int index) onArriving;

  late final Ticker _ticker;
  int index = 0;
  bool get playing => _ticker.isActive;

  Flight? _flight;
  bool _arrived = false;
  bool _announced = false;
  VmapCamera? _holdFrom;
  Duration _phaseStart = Duration.zero;
  double _turned = 0, _drifted = 0;
  Duration _last = Duration.zero;

  /// Starts or resumes at stop [at], from wherever the camera is.
  void play([int? at]) {
    if (at != null) index = at % stops.length;
    _ticker.stop();
    _startFlight();
    _last = Duration.zero;
    _ticker.start();
  }

  void pause() => _ticker.stop();

  void _startFlight() {
    _flight = Flight(
      controller.camera,
      stops[index].camera,
      viewWidth: viewWidth(),
    );
    _holdFrom = null;
    _arrived = false;
    _announced = false;
    _phaseStart = Duration.zero;
    onStop(index);
  }

  void _tick(Duration elapsed) {
    final dt = _last == Duration.zero
        ? 0.0
        : (elapsed - _last).inMicroseconds / 1e6;
    _last = elapsed;
    if (_phaseStart == Duration.zero) _phaseStart = elapsed;
    final since = (elapsed - _phaseStart).inMicroseconds / 1e6;
    final flight = _flight;
    if (flight != null) {
      final t = since / (flight.duration.inMicroseconds / 1e6);
      if (!_announced && t >= 0.5) {
        _announced = true;
        onArriving(index);
      }
      controller.camera = flight.at(t);
      if (t >= 1) {
        _flight = null;
        _holdFrom = controller.camera;
        _turned = _drifted = 0;
        _phaseStart = elapsed;
        _arrived = true;
      }
      return;
    }
    if (!_arrived) return;
    final stop = stops[index];
    final hold = stop.hold.inMicroseconds / 1e6;
    final from = _holdFrom!;
    // The drift's speed rises and falls over the first and last 1.8 s, so
    // it joins the flights on either side without a change of pace.
    final ramp = math.min(1.8, hold / 2);
    final speed = smoother(since / ramp) * smoother((hold - since) / ramp);
    _turned += stop.orbit * speed * dt;
    _drifted += stop.drift * speed * dt;
    controller.camera = from.copyWith(
      center: LatLng(
        from.center.latitude,
        (from.center.longitude + _drifted + 180) % 360 - 180,
      ),
      bearing: from.bearing + _turned,
      zoom: from.zoom + stop.push * smoother(since / hold),
    );
    if (since >= hold) {
      index = (index + 1) % stops.length;
      _startFlight();
      _phaseStart = elapsed;
    }
  }

  void dispose() => _ticker.dispose();
}
