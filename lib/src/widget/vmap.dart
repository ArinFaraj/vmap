import 'dart:async';

import 'package:flutter/foundation.dart' show listEquals;
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';
import 'package:latlong2/latlong.dart';

import '../engine.dart';
import '../errors.dart';
import '../gestures/gesture_options.dart';
import '../gestures/map_gestures.dart';
import '../text/glyphs/vmap_font.dart';
import '../camera/map_camera.dart';
import 'marker.dart';
import '../options.dart';
import '../style/pins.dart';
import '../tiles/query.dart';
import '../style/style.dart';
import '../labels/text_style.dart';
import 'markers.dart';
import 'vmap_controller.dart';

/// A map of any MapLibre style, drawn by vmap.
///
/// One finger pans; two pinch, turn, and tilt when dragged up or down
/// together; a double tap zooms in and a two finger tap out; a double tap
/// held and dragged zooms. A mouse wheel zooms, a double click zooms in and
/// a shift double click out, a right or control drag turns and tilts, and a
/// shift drag zooms to its box. Two fingers on a trackpad slide the map, a
/// pinch zooms and a twist turns it. With focus the arrow keys pan, `+` and
/// `-` zoom, two levels with shift, and shift with the arrows turns and
/// tilts. [gestures] switches each of them off, by MapLibre GL JS's
/// handler names. Released gestures and interrupted animations keep their
/// speed and slow down naturally.
class Vmap extends StatefulWidget {
  /// A map of [style], at [initialCamera] or where [controller] says.
  const Vmap({
    this.controller,
    this.initialCamera = const VmapCamera(center: LatLng(0, 0), zoom: 1),
    this.style = VmapStyle.light,
    this.overlay,
    this.styleEdits = const [],
    this.featureStates = const [],
    this.markers = const [],
    this.pins,
    this.textStyle = const VmapTextStyle(),
    this.labels = const VmapLabelOptions(),
    this.network = const VmapNetworkOptions(),
    this.rendering = const VmapRenderOptions(),
    this.fonts = const [],
    this.engine,
    this.minZoom = 0,
    this.maxZoom = 22,
    this.maxPitch = 60,
    this.gestures = const VmapGestureOptions(),
    this.attribution = true,
    this.loadingBuilder,
    this.onTap,
    this.onFeatureTap,
    this.tappableLayers,
    this.onLongPress,
    this.onCameraMove,
    this.onCameraIdle,
    this.onStyleLoaded,
    this.onIdle,
    this.onError,
    this.semanticLabel = 'Map',
    super.key,
  });

  /// Moves the map from code and reads where it looks. The map makes its
  /// own, starting at [initialCamera], when none is given.
  final VmapController? controller;

  /// Where a map without a [controller] starts.
  final VmapCamera initialCamera;

  /// The style to draw: one of MapLibre's, by address or as JSON, or the
  /// built in one, which needs no key.
  final VmapStyle style;

  /// Sources and layers of the app's own, drawn with the style.
  final VmapOverlay? overlay;

  /// Changes to single layers of the style: a colour, a filter, whether a
  /// layer is shown.
  final List<VmapStyleEdit> styleEdits;

  /// State for single features, which the style reads with
  /// `['feature-state', name]`: the way to highlight what was tapped.
  final List<VmapFeatureState> featureStates;

  /// Widgets drawn above the map at places. Map labels keep clear of them.
  final List<VmapMarker> markers;

  /// Draws places of interest as round pins instead of the style's icons.
  final VmapPins? pins;

  /// The fonts of labels, their scale, and the look of markers' names.
  final VmapTextStyle textStyle;

  /// Which labels are written and how they are placed.
  final VmapLabelOptions labels;

  /// How the map fetches and keeps what it loads. Read when the map is
  /// first built.
  final VmapNetworkOptions network;

  /// What draws the map. Read when the map is first built.
  final VmapRenderOptions rendering;

  /// Fonts labels may be shaped with, beyond the app's own. Read when the
  /// map is first built.
  final List<VmapFont> fonts;

  /// Draws with an engine the app made and owns, to keep loaded tiles
  /// across pages or share them. The parameters above that configure an
  /// engine are then ignored: set them on this one.
  final VmapEngine? engine;

  /// The zooms gestures and animations keep to.
  final double minZoom;
  final double maxZoom;

  /// Degrees, at most 85. Past about 60 the horizon and the sky show.
  final double maxPitch;

  /// Which gestures, mouse moves and keys move the map.
  /// [VmapGestureOptions.none] leaves it to [controller]; taps are still
  /// reported.
  final VmapGestureOptions gestures;

  /// Shows the credit the style's sources ask for in a corner, as their
  /// terms require. Off, the app must show it some other way: see
  /// [VmapEngine.attributions].
  final bool attribution;

  /// Shown over the map until it first draws tiles, or until it fails.
  final WidgetBuilder? loadingBuilder;

  /// Called with the place tapped. [VmapController.featuresAt] tells what
  /// the style draws there.
  final void Function(LatLng point)? onTap;

  /// Called with the topmost feature under a tap, when there is one: a
  /// road, a place, a building, a feature of the [overlay]. It reads the
  /// tiles off the UI thread, so it comes a moment after [onTap].
  final void Function(VmapFeature feature, LatLng point)? onFeatureTap;

  /// The ids of the style layers [onFeatureTap] reports features of, as
  /// MapLibre's `map.on('click', layerId)`; every layer when null.
  final List<String>? tappableLayers;

  /// Called with the place a finger was held on.
  final void Function(LatLng point)? onLongPress;

  /// Called as the camera moves, by a gesture or from code.
  final void Function(VmapCamera camera)? onCameraMove;

  /// Called once the camera comes to rest after moving.
  final void Function(VmapCamera camera)? onCameraIdle;

  /// Called each time a style has loaded and is drawn.
  final VoidCallback? onStyleLoaded;

  /// Called when the map has drawn everything in view and has nothing left
  /// to load or animate.
  final VoidCallback? onIdle;

  /// Told of everything the map could not load or draw. Only for the map's
  /// own engine; an app's [engine] reports to its own `onError`.
  final void Function(VmapError error)? onError;

  /// What screen readers announce for the map.
  final String semanticLabel;

  @override
  State<Vmap> createState() => _VmapState();
}

class _VmapState extends State<Vmap>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  VmapEngine? _owned;
  VmapController? _ownController;
  late final Ticker _ticker = createTicker((elapsed) => _c.tick(elapsed));

  VmapEngine get _engine => widget.engine ?? (_owned ??= _makeEngine());

  VmapEngine _makeEngine() =>
      VmapEngine(
          style: widget.style,
          network: widget.network,
          rendering: widget.rendering,
          labels: widget.labels,
          text: widget.textStyle,
          fonts: widget.fonts,
          pins: widget.pins,
          overlay: widget.overlay,
          edits: widget.styleEdits,
        )
        ..onError = _error
        ..markers = widget.markers
        ..featureStates = widget.featureStates;

  void _error(VmapError error) {
    widget.onError?.call(error);
    if (_loading && _engine.error != null) _settled();
  }

  VmapController get _c =>
      widget.controller ??
      (_ownController ??= VmapController(widget.initialCamera));

  late final MapGestureRecognizer _gestures = MapGestureRecognizer(
    _c.gestureTarget,
    onSettle: _checkIdleCamera,
  );

  bool _loading = true;
  bool _styleWasLoaded = false;
  bool _busy = true;
  bool _cameraPending = false;
  VmapCamera? _lastCamera;

  @override
  void initState() {
    super.initState();
    _attach();
    _configureGestures();
    _lastCamera = _c.camera;
    _c.addListener(_cameraChanged);
    _engine.addListener(_engineChanged);
    PaintingBinding.instance.systemFonts.addListener(_fontsChanged);
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didHaveMemoryPressure() => _engine.trimMemory();

  /// A font arriving late, as the browser's fallback fonts do, draws the
  /// labels again; those drawn before it keep their boxes otherwise.
  void _fontsChanged() => _engine.fontsChanged();

  void _configureGestures() => _gestures
    ..target = _c.gestureTarget
    ..options = widget.gestures
    ..onTap = _tap
    ..onLongPress = widget.onLongPress == null ? null : _longPress;

  void _attach() => _c.attach(
    ticker: _ticker,
    minZoom: widget.minZoom,
    maxZoom: widget.maxZoom,
    maxPitch: widget.maxPitch,
    engine: _engine,
  );

  @override
  void didUpdateWidget(Vmap old) {
    super.didUpdateWidget(old);
    final oldController = old.controller ?? _ownController;
    if (widget.controller != null && oldController != widget.controller) {
      oldController
        ?..removeListener(_cameraChanged)
        ..detach();
      widget.controller!.addListener(_cameraChanged);
    }
    if (old.engine != widget.engine) {
      (old.engine ?? _owned)?.removeListener(_engineChanged);
      if (widget.engine != null) {
        _owned?.dispose();
        _owned = null;
      }
      _engine.addListener(_engineChanged);
    }
    _attach();
    _configureGestures();
    final owned = _owned;
    if (owned == null) return;
    owned
      ..style = widget.style
      ..overlay = widget.overlay
      ..edits = widget.styleEdits
      ..pins = widget.pins
      ..text = widget.textStyle
      ..labels = widget.labels;
    if (!listEquals(old.featureStates, widget.featureStates)) {
      owned.featureStates = widget.featureStates;
    }
    if (!VmapMarker.sameRooms(old.markers, widget.markers)) {
      owned.markers = widget.markers;
    }
  }

  @override
  void dispose() {
    _gestures.dispose();
    WidgetsBinding.instance.removeObserver(this);
    PaintingBinding.instance.systemFonts.removeListener(_fontsChanged);
    _c
      ..removeListener(_cameraChanged)
      ..detach();
    _engine.removeListener(_engineChanged);
    _ticker.dispose();
    _owned?.dispose();
    _ownController?.dispose();
    super.dispose();
  }

  void _cameraChanged() {
    final camera = _c.camera;
    if (camera != _lastCamera) {
      _lastCamera = camera;
      _cameraPending = true;
      widget.onCameraMove?.call(camera);
    }
    _checkIdleCamera();
  }

  void _checkIdleCamera() {
    if (!_cameraPending || _c.isMoving || _gestures.touching) return;
    _cameraPending = false;
    widget.onCameraIdle?.call(_c.camera);
  }

  void _engineChanged() {
    final loaded = _engine.styleLoaded;
    if (loaded && !_styleWasLoaded) widget.onStyleLoaded?.call();
    _styleWasLoaded = loaded;
  }

  /// After each frame the map drew: the loading cover goes once tiles show,
  /// and [Vmap.onIdle] hears when nothing is left to do.
  void _painted() {
    SchedulerBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final stats = _engine.stats;
      if (_loading &&
          _engine.styleLoaded &&
          (stats.tilesDrawn > 0 ||
              (stats.tilesLoading == 0 && !stats.preparing))) {
        _settled();
      }
      final busy = stats.busy || stats.tilesLoading > 0;
      if (_busy && !busy && _engine.styleLoaded) widget.onIdle?.call();
      _busy = busy;
    });
  }

  void _settled() {
    if (!_loading) return;
    setState(() => _loading = false);
  }

  void _tap(Offset at) {
    final point = _c.toLatLng(at);
    if (point == null) return;
    widget.onTap?.call(point);
    if (widget.onFeatureTap != null) unawaited(_featureTap(point));
  }

  Future<void> _featureTap(LatLng point) async {
    final features = await _c.featuresAt(point);
    final onFeatureTap = widget.onFeatureTap;
    if (!mounted || onFeatureTap == null) return;
    final layers = widget.tappableLayers;
    for (final f in features) {
      if (layers == null || f.layers.any(layers.contains)) {
        onFeatureTap(f, point);
        return;
      }
    }
  }

  void _longPress(Offset at) {
    final point = _c.toLatLng(at);
    if (point != null) widget.onLongPress?.call(point);
  }

  @override
  Widget build(BuildContext context) {
    final dpr = MediaQuery.devicePixelRatioOf(context);
    final engine = _engine;
    final loading = widget.loadingBuilder;
    return LayoutBuilder(
      builder: (context, constraints) {
        _c.layout(constraints.biggest, flat: !engine.drawsGlobe);
        final map = MapGestureDetector(
          recognizer: _gestures,
          child: Stack(
            fit: StackFit.expand,
            children: [
              // The map paints every frame it moves; left in the semantics
              // tree it has an accessibility service walk it every frame.
              ExcludeSemantics(
                child: RepaintBoundary(
                  child: CustomPaint(
                    size: constraints.biggest,
                    painter: _VmapPainter(engine, _c, dpr, _painted),
                  ),
                ),
              ),
              if (widget.markers.isNotEmpty)
                MarkerLayer(
                  controller: _c,
                  markers: widget.markers,
                  onMarkerDown: _gestures.claimPointer,
                ),
              if (widget.attribution) _Attribution(engine),
              if (loading != null)
                IgnorePointer(
                  child: AnimatedOpacity(
                    opacity: _loading ? 1 : 0,
                    duration: const Duration(milliseconds: 250),
                    child: Builder(builder: loading),
                  ),
                ),
            ],
          ),
        );
        return Semantics(
          container: true,
          label: widget.semanticLabel,
          child: map,
        );
      },
    );
  }
}

/// The credit the style's sources ask for, small in the bottom right.
class _Attribution extends StatelessWidget {
  const _Attribution(this.engine);

  final VmapEngine engine;

  static final _tags = RegExp('<[^>]*>');

  @override
  Widget build(BuildContext context) => ListenableBuilder(
    listenable: engine,
    builder: (context, _) {
      final text = {
        for (final a in engine.attributions)
          a.replaceAll(_tags, '').replaceAll('&copy;', '©').trim(),
      }.where((a) => a.isNotEmpty).join(' ');
      if (text.isEmpty) return const SizedBox.shrink();
      return Align(
        alignment: Alignment.bottomRight,
        child: Container(
          margin: const EdgeInsets.all(4),
          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
          decoration: BoxDecoration(
            color: const Color(0xB3FFFFFF),
            borderRadius: BorderRadius.circular(3),
          ),
          child: Text(
            text,
            style: const TextStyle(
              inherit: false,
              fontSize: 10,
              height: 1.2,
              color: Color(0xFF333333),
            ),
          ),
        ),
      );
    },
  );
}

class _VmapPainter extends CustomPainter {
  _VmapPainter(this.engine, this.controller, this.dpr, this.painted)
    : super(repaint: Listenable.merge([engine, controller]));

  final VmapEngine engine;
  final VmapController controller;
  final double dpr;
  final VoidCallback painted;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.clipRect(Offset.zero & size);
    engine.paint(
      canvas,
      size,
      controller.camera,
      devicePixelRatio: dpr,
      ahead: controller.destination,
    );
    painted();
  }

  @override
  bool shouldRepaint(_VmapPainter old) =>
      old.engine != engine || old.controller != controller || old.dpr != dpr;
}
