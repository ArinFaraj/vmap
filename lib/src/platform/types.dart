import 'dart:async';
import 'dart:typed_data';

/// What a server answered.
class Reply {
  const Reply(this.status, this.bytes);

  final int status;
  final Uint8List bytes;
}

/// A server answered with something other than what was asked for.
class HttpFailure implements Exception {
  const HttpFailure(this.status, this.url);

  final int status;
  final String url;

  @override
  String toString() => 'HTTP $status for $url';
}

/// The code a worker runs: it reads what it is sent from [inbox] and answers
/// through [send].
typedef WorkerBody = Future<void> Function(
  List<Object?> init,
  void Function(Object? message) send,
  Stream<Object?> inbox,
);
