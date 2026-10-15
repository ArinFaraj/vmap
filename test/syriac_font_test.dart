import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/glyphs/glyph_layout.dart';

void main() {
  test('an Assyrian name shapes with the bundled Syriac font', () {
    final fonts = GlyphFonts(
      [
        File('assets/fonts/Vazirmatn-Variable.ttf').readAsBytesSync(),
        File('assets/fonts/NotoSansSyriacEastern-Variable.ttf')
            .readAsBytesSync(),
      ],
      families: ['Vazirmatn', 'Noto Sans Syriac Eastern'],
    );
    final shaped = layoutText(fonts, 'ܥܢܟܒܐ / عەنکاوە')!;
    final faces = {
      for (var i = 0; i < shaped.glyphs.length; i += 5)
        shaped.glyphs[i].toInt(),
    };
    expect(faces, {0, 1});
    expect(layoutText(GlyphFonts([fonts.faceBytes.first]), 'ܥܢܟܒܐ'), isNull);
  });
}
