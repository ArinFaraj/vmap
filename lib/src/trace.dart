import 'dart:developer' show Timeline;

/// Whether the engine marks its work on the timeline. Off unless built with
/// `--dart-define=VMAP_TIMELINE=true`: a mark takes time in release builds
/// too, and on the web each one is a `performance.mark`.
const bool tracing = bool.fromEnvironment('VMAP_TIMELINE');

/// [work], on the timeline as [name] when [tracing].
T traced<T>(String name, T Function() work) =>
    tracing ? Timeline.timeSync(name, work) : work();

/// A moment on the timeline called [name], when [tracing].
void traceInstant(String name, Map<String, Object?> Function() arguments) {
  if (tracing) Timeline.instantSync(name, arguments: arguments());
}

/// The timeline's clock in microseconds, zero unless [tracing].
int get traceNow => tracing ? Timeline.now : 0;
