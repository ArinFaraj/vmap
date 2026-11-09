import 'dart:async';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/platform.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('pixels become an image of their size', () async {
    final image = await imageFromRgba(Uint8List(2 * 3 * 4), 2, 3);
    addTearDown(image.dispose);

    expect((image.width, image.height), (2, 3));
  });

  test('a decode that cannot succeed fails the load instead of hanging', () {
    expect(
      imageFromRgba(Uint8List(4), 64, 64).timeout(const Duration(seconds: 5)),
      throwsA(isNot(isA<TimeoutException>())),
    );
  });
}
