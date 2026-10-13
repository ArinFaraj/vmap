import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// Asks the platform for the display's fastest refresh rate while the map
/// moves, and gives it back a few seconds after the map rests, so a still
/// map does not keep the screen at 120 Hz.
class FrameRateVote {
  FrameRateVote._();

  static const _channel = MethodChannel('vmap/frame_rate');

  /// Long enough that the display does not switch modes at the start of
  /// every gesture, a switch some panels show as a hitch.
  static const _rest = Duration(seconds: 3);
  static bool _fast = false;
  static Timer? _release;
  static int _users = 0;

  static bool get _supported =>
      !kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  /// A map is shown and may vote.
  static void attach() {
    _users++;
    moving();
  }

  static void detach() {
    _users = (_users - 1).clamp(0, 1 << 30);
    if (_users == 0) _send(false);
  }

  /// The map is moving or being touched: draw it fast.
  static void moving() {
    if (!_supported) return;
    _release?.cancel();
    _release = Timer(_rest, () => _send(false));
    if (!_fast) _send(true);
  }

  static void _send(bool fast) {
    if (fast == _fast || !_supported) return;
    _fast = fast;
    _channel
        .invokeMethod<void>('vote', {'fast': fast})
        .catchError((Object _) {});
  }
}
