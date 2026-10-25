/// How a dasharray cross-fades as the zoom crosses a whole level, as
/// MapLibre's crossfade parameters: the dashes of the level at [fromZoom],
/// [fromScale] times as long, lie under this level's, which show [mix] of
/// the way.
typedef DashFade = ({double fromZoom, double fromScale, double mix});

/// The whole zoom level the map last crossed and when, as MapLibre's
/// ZoomHistory, from which [fade] follows.
class ZoomHistory {
  static const fadeMicros = 300000;

  double? _lastZoom;
  int _lastFloor = 0;
  int _lastInteger = 0;
  int _crossedAt = 0;

  /// No cross-fade: only this level's dashes show.
  static const DashFade settled = (fromZoom: 0, fromScale: 1, mix: 1);

  /// The cross-fade of the frame last [update]d.
  DashFade fade = settled;

  /// Whether a later frame's [fade] differs from this one's.
  bool get fading => fade.mix < 1;

  /// Notes the style [zoom] of a frame drawn at [nowMicros].
  void update(double zoom, int nowMicros) {
    final floor = zoom.floor();
    if (_lastZoom == null) {
      _lastInteger = floor;
      _crossedAt = nowMicros - fadeMicros;
    } else if (_lastFloor > floor) {
      _lastInteger = floor + 1;
      _crossedAt = nowMicros;
    } else if (_lastFloor < floor) {
      _lastInteger = floor;
      _crossedAt = nowMicros;
    }
    _lastZoom = zoom;
    _lastFloor = floor;
    final fraction = zoom - floor;
    final t = ((nowMicros - _crossedAt) / fadeMicros).clamp(0.0, 1.0);
    fade = zoom > _lastInteger
        ? (
            fromZoom: floor - 1.0,
            fromScale: 2,
            mix: fraction + (1 - fraction) * t,
          )
        : (fromZoom: floor + 1.0, fromScale: 0.5, mix: 1 - (1 - t) * fraction);
  }
}
