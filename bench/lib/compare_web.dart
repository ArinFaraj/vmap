import 'dart:js_interop';

import 'package:flutter/material.dart';
import 'package:vmap/vmap.dart';
import 'package:web/web.dart' as web;

/// vmap's half of web/compare.html: a map that takes its style and camera
/// from the page's address, follows the camera the page posts to it, and
/// posts its own camera back when someone moves it.
void main() {
  final q = Uri.base.queryParameters;
  double param(String key, double fallback) =>
      double.tryParse(q[key] ?? '') ?? fallback;
  runApp(
    _CompareMap(
      style: q['style'] ?? 'https://tiles.openfreemap.org/styles/liberty',
      camera: VmapCamera(
        center: LatLng(param('lat', 36.1912), param('lng', 44.0092)),
        zoom: param('zoom', 14),
        bearing: param('bearing', 0),
        pitch: param('pitch', 0),
      ),
    ),
  );
}

class _CompareMap extends StatefulWidget {
  const _CompareMap({required this.style, required this.camera});

  final String style;
  final VmapCamera camera;

  @override
  State<_CompareMap> createState() => _CompareMapState();
}

class _CompareMapState extends State<_CompareMap> {
  late final VmapController _controller = VmapController(widget.camera);
  late final JSFunction _onMessage = _received.toJS;

  /// Set while a camera from the page is applied, so it is not echoed.
  bool _following = false;

  @override
  void initState() {
    super.initState();
    web.window.addEventListener('message', _onMessage);
  }

  @override
  void dispose() {
    web.window.removeEventListener('message', _onMessage);
    _controller.dispose();
    super.dispose();
  }

  void _received(web.MessageEvent event) {
    final data = event.data.dartify();
    if (data is! Map || data['type'] != 'camera') return;
    double field(String key) => (data[key] as num).toDouble();
    _following = true;
    _controller.camera = VmapCamera(
      center: LatLng(field('lat'), field('lng')),
      zoom: field('zoom'),
      bearing: field('bearing'),
      pitch: field('pitch'),
    );
    _following = false;
  }

  void _moved(VmapCamera camera) {
    if (_following) return;
    web.window.parent?.postMessage(
      {
        'type': 'camera',
        'lat': camera.center.latitude,
        'lng': camera.center.longitude,
        'zoom': camera.zoom,
        'bearing': camera.bearing,
        'pitch': camera.pitch,
      }.jsify(),
      '*'.toJS,
    );
  }

  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    home: Scaffold(
      body: Vmap(
        style: VmapStyle.url(widget.style),
        controller: _controller,
        onCameraMove: _moved,
      ),
    ),
  );
}
