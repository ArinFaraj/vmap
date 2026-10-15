import 'dart:js_interop';
import 'dart:typed_data';

/// Turns a message of lists, maps, numbers, strings and typed data into
/// something a browser can post to a worker, and back. Every list carries
/// the kinds of its items in front, because a whole number and a fraction
/// are one kind of number to JavaScript and not to Dart.
///
/// Typed data that owns its whole buffer is added to [moved], to be handed
/// over instead of copied.
JSAny? encodeMessage(Object? message, [List<JSObject>? moved]) =>
    message == null ? null : _list(message as List<Object?>, moved);

Object? decodeMessage(JSAny? message) =>
    message == null ? null : _items(message as JSArray<JSAny?>);

JSArray<JSAny?> _list(Iterable<Object?> items, List<JSObject>? moved) {
  final kinds = StringBuffer();
  final out = <JSAny?>[null];
  for (final item in items) {
    switch (item) {
      case null:
        kinds.write('n');
        out.add(null);
      case final bool v:
        kinds.write('b');
        out.add(v.toJS);
      case final String v:
        kinds.write('s');
        out.add(v.toJS);
      case final int v:
        kinds.write('i');
        out.add(v.toJS);
      case final double v:
        kinds.write('d');
        out.add(v.toJS);
      case final Float32List v:
        kinds.write('F');
        out.add(_moving(v, v.toJS, moved));
      case final Uint16List v:
        kinds.write('S');
        out.add(_moving(v, v.toJS, moved));
      case final Float64List v:
        kinds.write('D');
        out.add(_moving(v, v.toJS, moved));
      case final Uint8List v:
        kinds.write('U');
        out.add(_moving(v, v.toJS, moved));
      case final Int32List v:
        kinds.write('I');
        out.add(_moving(v, v.toJS, moved));
      case final Map<Object?, Object?> v:
        kinds.write('m');
        out.add(
          _list([
            for (final e in v.entries) ...[e.key, e.value],
          ], moved),
        );
      case final Iterable<Object?> v:
        kinds.write('l');
        out.add(_list(v, moved));
      default:
        throw ArgumentError('A ${item.runtimeType} cannot be sent to a worker');
    }
  }
  out[0] = kinds.toString().toJS;
  return out.toJS;
}

JSAny _moving(TypedData data, JSObject js, List<JSObject>? moved) {
  if (moved != null &&
      data.offsetInBytes == 0 &&
      data.lengthInBytes == data.buffer.lengthInBytes &&
      data.lengthInBytes > 0) {
    // A buffer listed twice for transfer fails the whole message.
    final buffer = data.buffer.toJS;
    if (!moved.any((b) => identical(b, buffer))) moved.add(buffer);
  }
  return js;
}

List<Object?> _items(JSArray<JSAny?> list) {
  final from = list.toDart;
  final kinds = (from[0]! as JSString).toDart;
  final out = List<Object?>.filled(kinds.length, null, growable: true);
  for (var i = 0; i < kinds.length; i++) {
    final item = from[i + 1];
    out[i] = switch (kinds[i]) {
      'n' => null,
      'b' => (item! as JSBoolean).toDart,
      's' => (item! as JSString).toDart,
      'i' => (item! as JSNumber).toDartInt,
      'd' => (item! as JSNumber).toDartDouble,
      'F' => (item! as JSFloat32Array).toDart,
      'S' => (item! as JSUint16Array).toDart,
      'D' => (item! as JSFloat64Array).toDart,
      'U' => (item! as JSUint8Array).toDart,
      'I' => (item! as JSInt32Array).toDart,
      'm' => _map(_items(item! as JSArray<JSAny?>)),
      _ => _items(item! as JSArray<JSAny?>),
    };
  }
  return out;
}

Map<Object?, Object?> _map(List<Object?> pairs) => {
  for (var i = 0; i < pairs.length; i += 2) pairs[i]: pairs[i + 1],
};
