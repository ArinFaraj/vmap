/// The largest of the values seen in the last [spanMs].
///
/// A tile cache sized by it does not shrink as the view's tile count moves
/// by a few while the camera turns: a limit that followed the count would
/// drop tiles each time it fell, to load them again as the camera turned
/// back.
final class RecentPeak {
  RecentPeak([this.spanMs = 10000]);

  final int spanMs;
  int _peak = 0, _atMs = 0;

  /// Takes in [value], seen at [nowMs], and gives the peak.
  int of(int value, int nowMs) {
    if (value >= _peak || nowMs - _atMs > spanMs) {
      _peak = value;
      _atMs = nowMs;
    }
    return _peak;
  }
}
