import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/sprites.dart';

ui.Image _square(int w, int h) {
  final recorder = ui.PictureRecorder();
  ui.Canvas(recorder).drawRect(
    ui.Rect.fromLTWH(0, 0, w.toDouble(), h.toDouble()),
    ui.Paint()..color = const ui.Color(0xFFFF0000),
  );
  return recorder.endRecording().toImageSync(w, h);
}

void main() {
  test('added images sit under the sheet and replace an image of its name', () {
    final base = SpriteSheet(_square(20, 10), {
      'shop': SpriteImage(const ui.Rect.fromLTWH(0, 0, 10, 10), 5, 5, 2),
      'park': SpriteImage(const ui.Rect.fromLTWH(10, 0, 10, 10), 5, 5, 2),
    });
    final joined = SpriteSheet.join(base, {
      'park': VmapImage(_square(12, 6)),
      'pin': VmapImage(_square(8, 8), pixelRatio: 2, sdf: true),
    });
    expect(
      joined.entries['shop']!.source,
      const ui.Rect.fromLTWH(0, 0, 10, 10),
    );
    expect(
      joined.entries['park']!.source,
      const ui.Rect.fromLTWH(0, 10, 12, 6),
    );
    final pin = joined.entries['pin']!;
    expect(pin.source, const ui.Rect.fromLTWH(12, 10, 8, 8));
    expect([pin.width, pin.height, pin.sdf], [4, 4, true]);
    expect([joined.image.width, joined.image.height], [20, 18]);
  });

  test('images join with no sheet of the style', () {
    final joined = SpriteSheet.join(null, {'pin': VmapImage(_square(8, 4))});
    expect(joined.entries['pin']!.source, const ui.Rect.fromLTWH(0, 0, 8, 4));
    expect([joined.image.width, joined.image.height], [8, 4]);
  });
}
