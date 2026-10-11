@TestOn('browser')
library;

import 'dart:js_interop';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/platform/web_codec.dart';

void main() {
  test('a message comes back as it was sent', () {
    final moved = <JSObject>[];
    final whole = Float32List.fromList([1, 2.5]);
    final part = Uint16List.sublistView(Uint16List.fromList([7, 8, 9]), 1);
    final back =
        decodeMessage(
              encodeMessage([
                3,
                null,
                true,
                'text',
                0.5,
                whole,
                part,
                {
                  'name': 'a',
                  'deep': [1, 'b'],
                },
                <Object?>[],
              ], moved),
            )!
            as List<Object?>;
    expect(back[0], 3);
    expect(back[1], isNull);
    expect(back[2], isTrue);
    expect(back[3], 'text');
    expect(back[4], 0.5);
    expect(back[5], isA<Float32List>());
    expect(back[5], [1, 2.5]);
    expect(back[6], isA<Uint16List>());
    expect(back[6], [8, 9]);
    expect(back[7], {
      'name': 'a',
      'deep': [1, 'b'],
    });
    expect(back[8], isEmpty);
    // Only data that owns its whole buffer may be handed over.
    expect(moved, hasLength(1));
  });
}
