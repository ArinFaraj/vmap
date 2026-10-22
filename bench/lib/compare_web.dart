import 'dart:js_interop';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
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
      workers: int.tryParse(q['workers'] ?? ''),
      labelStats: q['labels'] == 'stats',
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
  const _CompareMap({
    required this.style,
    required this.camera,
    this.workers,
    this.labelStats = false,
  });

  /// Whether to count labels that blink, shown, hidden and shown again
  /// within a second, for the page to read.
  final bool labelStats;

  final String style;

  /// Tile workers per source, from the address, to compare pool sizes.
  final int? workers;
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
    if (widget.labelStats) {
      SchedulerBinding.instance.scheduleFrameCallback(_countLabels);
    }
  }

  @override
  void dispose() {
    web.window.removeEventListener('message', _onMessage);
    _controller.dispose();
    super.dispose();
  }

  final Map<String, (bool, int, int)> _seen = {};
  int _blinks = 0, _hides = 0;

  void _countLabels(Duration _) {
    if (!mounted) return;
    final now = DateTime.now().millisecondsSinceEpoch;
    final shownNow = <String>{};
    for (final l in _controller.engine?.debugLabels() ?? const []) {
      if (l['text_shown'] != true && l['icon_shown'] != true) continue;
      final x = ((l['x']! as num) * 4096).round();
      final y = ((l['y']! as num) * 4096).round();
      shownNow.add('${l['layer']}|${l['text']}|$x|$y');
    }
    for (final key in {..._seen.keys, ...shownNow}) {
      final (was, hiddenAt, _) = _seen[key] ?? (false, 0, 0);
      final shown = shownNow.contains(key);
      if (was && !shown) {
        _hides++;
        _seen[key] = (false, now, 0);
      } else if (!was && shown) {
        if (hiddenAt > 0 && now - hiddenAt < 1000) _blinks++;
        _seen[key] = (true, 0, 0);
      }
    }
    SchedulerBinding.instance.scheduleFrameCallback(_countLabels);
  }

  void _received(web.MessageEvent event) {
    final data = event.data.dartify();
    if (data is Map && data['type'] == 'labelstats?') {
      web.window.postMessage(
        {'type': 'labelstats', 'blinks': _blinks, 'hides': _hides}.jsify(),
        '*'.toJS,
      );
      return;
    }
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

  /// Tells the page when the map reached a milestone, for timing.
  void _mark(String what) => web.window.parent?.postMessage(
    {'type': what, 'at': web.window.performance.now()}.jsify(),
    '*'.toJS,
  );

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
        network: widget.workers == null
            ? const VmapNetworkOptions()
            : VmapNetworkOptions(workers: widget.workers!),
        controller: _controller,
        onCameraMove: _moved,
        onStyleLoaded: () => _mark('style'),
        onIdle: () => _mark('idle'),
      ),
    ),
  );
}
