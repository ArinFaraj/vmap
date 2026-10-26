import 'dart:async';
import 'dart:convert';
import 'dart:ui' as ui;
import 'dart:ui_web' as ui_web;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:vmap/vmap.dart';

import 'layers.dart';
import 'panel.dart';
import 'styles.dart';
import 'tour.dart';

void main() {
  // Lets Chrome take the path Safari takes, to compare the two.
  if (Uri.base.queryParameters['engine'] == 'webkit') {
    ui_web.browser.debugBrowserEngineOverride = ui_web.BrowserEngine.webkit;
  }
  runApp(const DemoApp());
}

const accent = Color(0xFF4C8DFF);

class DemoApp extends StatelessWidget {
  const DemoApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'vmap',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      brightness: Brightness.dark,
      colorScheme: ColorScheme.fromSeed(
        seedColor: accent,
        brightness: Brightness.dark,
      ),
      useMaterial3: true,
    ),
    home: const DemoPage(),
  );
}

class DemoPage extends StatefulWidget {
  const DemoPage({super.key});

  @override
  State<DemoPage> createState() => _DemoPageState();
}

/// Whether a link opens on its stop with the tour paused, as `?still`.
final bool _still = Uri.base.queryParameters.containsKey('still');

/// The stop a link opens at, as `?stop=3`.
final int _firstStop =
    (int.tryParse(Uri.base.queryParameters['stop'] ?? '') ?? 0) %
    tourStops.length;

class _DemoPageState extends State<DemoPage> with TickerProviderStateMixin {
  final _controller = VmapController(tourStops[_firstStop].camera);
  late final Tour _tour = Tour(
    controller: _controller,
    vsync: this,
    viewWidth: () => _viewWidth,
    onStop: (i) => setState(() => _stop = i),
    onArriving: (i) => setState(() {
      _terrain = tourStops[i].terrain;
      _data = tourStops[i].data;
    }),
  );
  double _viewWidth = 1200;

  int _stop = _firstStop;
  bool _touring = !_still;
  bool _panel = false;

  DemoStyle _style = demoStyles.first;
  bool _globe = true;
  bool _terrain = tourStops[_firstStop].terrain;
  DataLayer _data = tourStops[_firstStop].data;
  String _language = 'Local';
  VmapStyle? _resolved;
  Map<String, Object?>? _quakes;

  @override
  void initState() {
    super.initState();
    unawaited(_restyle());
    unawaited(
      rootBundle
          .loadString('assets/earthquakes.geojson')
          .then(
            (text) => setState(
              () => _quakes = jsonDecode(text) as Map<String, Object?>,
            ),
          ),
    );
  }

  Future<void> _restyle() async {
    final style = await resolveStyle(
      _style,
      globe: _globe && _style.canGlobe,
      language: demoLanguages[_language]!,
    );
    if (mounted) setState(() => _resolved = style);
  }

  void _startTour() {
    setState(() {
      _touring = true;
      _panel = false;
    });
    _tour.play();
  }

  void _stopTour() {
    if (!_touring) return;
    _tour.pause();
    setState(() => _touring = false);
  }

  @override
  void dispose() {
    _tour.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final resolved = _resolved;
    return Scaffold(
      backgroundColor: const Color(0xFF0B1220),
      body: LayoutBuilder(
        builder: (context, box) {
          _viewWidth = box.maxWidth;
          final narrow = box.maxWidth < 760;
          return Stack(
            fit: StackFit.expand,
            children: [
              if (resolved != null)
                Listener(
                  onPointerDown: (_) => _stopTour(),
                  onPointerSignal: (e) {
                    if (e is PointerScrollEvent) _stopTour();
                  },
                  onPointerPanZoomStart: (_) => _stopTour(),
                  child: Vmap(
                    controller: _controller,
                    initialCamera: tourStops[_firstStop].camera,
                    style: resolved,
                    maxPitch: 85,
                    overlay: overlayFor(
                      terrain: _terrain,
                      data: _data,
                      quakes: _quakes,
                      shadeBefore: _style.shadeBefore,
                    ),
                    onError: (error) => debugPrint('vmap: $error'),
                    onStyleLoaded: () {
                      if (_touring && !_tour.playing) _tour.play(_stop);
                    },
                  ),
                ),
              Positioned(left: 20, top: 18, child: const _Brand()),
              Positioned(
                right: 16,
                top: 16,
                child: _TopActions(
                  touring: _touring,
                  panel: _panel,
                  onTour: _touring ? _stopTour : _startTour,
                  onPanel: () => setState(() {
                    _stopTour();
                    _panel = !_panel;
                  }),
                ),
              ),
              if (_touring)
                Positioned(
                  left: narrow ? 12 : 20,
                  right: narrow ? 12 : null,
                  bottom: narrow ? 12 : 28,
                  child: _Caption(
                    stop: tourStops[_stop],
                    index: _stop,
                    count: tourStops.length,
                    onPick: (i) => _tour.play(i),
                  ),
                ),
              if (_panel)
                Positioned(
                  right: 16,
                  top: 72,
                  bottom: narrow ? null : 16,
                  child: ExplorePanel(
                    style: _style,
                    globe: _globe,
                    terrain: _terrain,
                    data: _data,
                    language: _language,
                    onStyle: (s) {
                      setState(() => _style = s);
                      _restyle();
                    },
                    onGlobe: (v) {
                      setState(() => _globe = v);
                      _restyle();
                    },
                    onTerrain: (v) => setState(() => _terrain = v),
                    onData: (v) => setState(() => _data = v),
                    onLanguage: (v) {
                      setState(() => _language = v);
                      _restyle();
                    },
                    onPlace: (stop) {
                      setState(() {
                        _terrain = stop.terrain || _terrain;
                      });
                      _controller.flyTo(stop.camera);
                    },
                    onTilt: () => _controller.easeTo(
                      _controller.camera.copyWith(
                        pitch: _controller.camera.pitch > 10 ? 0 : 60,
                      ),
                    ),
                    onNorth: () => _controller.easeTo(
                      _controller.camera.copyWith(bearing: 0),
                    ),
                  ),
                ),
              const Positioned(left: 20, bottom: 6, child: _FrameRate()),
            ],
          );
        },
      ),
    );
  }
}

/// A frosted card the controls sit on.
class Glass extends StatelessWidget {
  const Glass({required this.child, this.padding, super.key});

  final Widget child;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) => ClipRRect(
    borderRadius: BorderRadius.circular(18),
    child: BackdropFilter(
      filter: ui.ImageFilter.blur(sigmaX: 18, sigmaY: 18),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: const Color(0xCC0E1626),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0x22FFFFFF)),
        ),
        child: Padding(
          padding: padding ?? const EdgeInsets.all(16),
          child: child,
        ),
      ),
    ),
  );
}

class _Brand extends StatelessWidget {
  const _Brand();

  @override
  Widget build(BuildContext context) => Glass(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: const BoxDecoration(
            color: accent,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 10),
        const Text(
          'vmap',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.2,
          ),
        ),
        const SizedBox(width: 12),
        Text(
          'a GPU map engine for Flutter',
          style: TextStyle(
            fontSize: 13,
            color: Colors.white.withValues(alpha: 0.7),
          ),
        ),
      ],
    ),
  );
}

class _TopActions extends StatelessWidget {
  const _TopActions({
    required this.touring,
    required this.panel,
    required this.onTour,
    required this.onPanel,
  });

  final bool touring, panel;
  final VoidCallback onTour, onPanel;

  @override
  Widget build(BuildContext context) => Glass(
    padding: const EdgeInsets.all(6),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        TextButton.icon(
          onPressed: onTour,
          icon: Icon(touring ? Icons.pause_rounded : Icons.play_arrow_rounded),
          label: Text(touring ? 'Pause tour' : 'Play tour'),
        ),
        const SizedBox(width: 4),
        FilledButton.tonalIcon(
          onPressed: onPanel,
          icon: const Icon(Icons.tune_rounded),
          label: Text(panel ? 'Hide' : 'Explore'),
        ),
      ],
    ),
  );
}

class _Caption extends StatelessWidget {
  const _Caption({
    required this.stop,
    required this.index,
    required this.count,
    required this.onPick,
  });

  final TourStop stop;
  final int index, count;
  final ValueChanged<int> onPick;

  @override
  Widget build(BuildContext context) => ConstrainedBox(
    constraints: const BoxConstraints(maxWidth: 520),
    child: Glass(
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 16),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 500),
        switchInCurve: Curves.easeOutCubic,
        switchOutCurve: Curves.easeInCubic,
        transitionBuilder: (child, animation) => FadeTransition(
          opacity: animation,
          child: SlideTransition(
            position: Tween(
              begin: const Offset(0, 0.06),
              end: Offset.zero,
            ).animate(animation),
            child: child,
          ),
        ),
        child: Column(
          key: ValueKey(index),
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              stop.title,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 6),
            Text(
              stop.caption,
              style: TextStyle(
                fontSize: 14,
                height: 1.4,
                color: Colors.white.withValues(alpha: 0.78),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0x66000000),
                borderRadius: BorderRadius.circular(10),
              ),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Text(
                  stop.code,
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 12.5,
                    color: Color(0xFF9CC2FF),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                for (var i = 0; i < count; i++)
                  GestureDetector(
                    onTap: () => onPick(i),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 400),
                      curve: Curves.easeOutCubic,
                      margin: const EdgeInsets.only(right: 6),
                      width: i == index ? 26 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: i == index
                            ? accent
                            : Colors.white.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    ),
  );
}

/// Frames drawn in the last second, from the engine's frame timings.
class _FrameRate extends StatefulWidget {
  const _FrameRate();

  @override
  State<_FrameRate> createState() => _FrameRateState();
}

class _FrameRateState extends State<_FrameRate> {
  final _times = <Duration>[];
  int _fps = 0;
  Timer? _timer;

  void _onTimings(List<FrameTiming> timings) {
    for (final t in timings) {
      _times.add(
        Duration(
          microseconds: t.timestampInMicroseconds(ui.FramePhase.rasterFinish),
        ),
      );
    }
  }

  @override
  void initState() {
    super.initState();
    SchedulerBinding.instance.addTimingsCallback(_onTimings);
    _timer = Timer.periodic(const Duration(milliseconds: 500), (_) {
      if (_times.isEmpty) {
        if (_fps != 0) setState(() => _fps = 0);
        return;
      }
      final last = _times.last;
      _times.removeWhere((t) => last - t > const Duration(seconds: 1));
      setState(() => _fps = _times.length);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    SchedulerBinding.instance.removeTimingsCallback(_onTimings);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Text(
    // An idle map draws only when something changes, which is no rate.
    _fps < 10 ? '' : '$_fps fps',
    style: TextStyle(
      fontSize: 11,
      fontFeatures: const [ui.FontFeature.tabularFigures()],
      color: Colors.white.withValues(alpha: 0.55),
    ),
  );
}
