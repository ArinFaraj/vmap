import 'package:flutter/widgets.dart';

import '../engine.dart';
import '../engine_options.dart';
import '../errors.dart';
import 'marker.dart';

/// The engine a map widget draws with: an app's own, or one it makes from
/// [VmapEngineOptions] and keeps in step with the widget. Either is given
/// the widget's markers. It lets memory go when the system runs short,
/// redraws labels when the system's fonts change, and keeps the widget's
/// listener on whichever engine draws. Make one in `initState`, [update]
/// it in `didUpdateWidget` and [dispose] it with the widget.
class VmapEngineOwner with WidgetsBindingObserver {
  VmapEngineOwner({
    required VmapEngineOptions options,
    required this._onError,
    List<VmapMarker> markers = const [],
    VmapEngine? engine,
    this._onChanged,
  }) {
    _use(engine, options, markers);
    PaintingBinding.instance.systemFonts.addListener(_fontsChanged);
    WidgetsBinding.instance.addObserver(this);
  }

  final void Function(VmapError error) _onError;
  final VoidCallback? _onChanged;

  /// The engine the app gave, if any.
  VmapEngine? _app;

  /// The engine made here when the app gave none, disposed here.
  VmapEngine? _made;

  /// The app's engine when it gave one, otherwise the one made here.
  VmapEngine get engine => _app ?? _made!;

  /// Whether the app's engine holds markers given here, which leave it
  /// with the widget.
  bool _gaveMarkers = false;

  void _use(
    VmapEngine? app,
    VmapEngineOptions options,
    List<VmapMarker> markers,
  ) {
    _app = app;
    _made = app == null
        ? (VmapEngine.withOptions(options)..onError = _onError)
        : null;
    _giveMarkers(markers);
    if (_onChanged case final listener?) engine.addListener(listener);
  }

  /// An app's engine is given [markers] only once the widget has some, so
  /// those the app set on it itself stay.
  void _giveMarkers(List<VmapMarker> markers) {
    final app = _app;
    if (app != null && markers.isEmpty && !_gaveMarkers) return;
    engine.markers = markers;
    _gaveMarkers = app != null && markers.isNotEmpty;
  }

  void _letGo() {
    if (_onChanged case final listener?) engine.removeListener(listener);
    if (_gaveMarkers) _giveMarkers(const []);
    _made?.dispose();
  }

  /// Follows a rebuilt widget. The engine made here goes once the app
  /// gives one, and a new one is made if the app's goes.
  void update({
    required VmapEngineOptions options,
    required List<VmapMarker> markers,
    VmapEngine? engine,
  }) {
    if (engine != _app) {
      _letGo();
      _use(engine, options, markers);
      return;
    }
    _made?.update(options);
    _giveMarkers(markers);
  }

  @override
  void didHaveMemoryPressure() => engine.trimMemory();

  /// A font arriving late, as the browser's fallback fonts do, draws the
  /// labels again; those drawn before it keep their boxes otherwise.
  void _fontsChanged() => engine.fontsChanged();

  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    PaintingBinding.instance.systemFonts.removeListener(_fontsChanged);
    _letGo();
  }
}
