import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/labels/label_glyphs.dart';
import 'package:vmap/src/labels/label_sprites.dart';
import 'package:vmap/src/labels/label_style.dart';
import 'package:vmap/src/labels/label_view.dart';
import 'package:vmap/src/labels/text_style.dart';
import 'package:vmap/src/options.dart';
import 'package:vmap/src/stats.dart';
import 'package:vmap/src/text/glyphs/glyph_layout.dart';

TextLook _look(String text, List<String> fontStack) => TextLook(
  text: text,
  fontSize: 16,
  color: 0xFF000000,
  halo: null,
  haloWidth: 0,
  haloBlur: 0,
  weight: 400,
  italic: false,
  letterSpacing: 0,
  lineHeight: 1.2,
  align: ui.TextAlign.center,
  rightToLeft: false,
  road: false,
  layoutWidth: 10 * 16,
  fontFamily: null,
  fontFamilyFallback: null,
  fontStack: fontStack,
);

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('a name in a font the server lacks wraps at its width', () async {
    final glyphs = LabelGlyphs()
      ..useFonts(
        GlyphFonts([
          File('assets/fonts/Vazirmatn-Variable.ttf').readAsBytesSync(),
        ]),
      )
      ..useRanges(
        'https://example.org/{fontstack}/{range}.pbf',
        const VmapNetworkOptions(),
        () {},
        fetch: (_) async => null,
      );
    final sprites = LabelSprites(
      VmapLabelWork(),
      LabelStyle(const VmapTextStyle(), LabelView()),
      glyphs,
    );
    const name = 'The Old Citadel Of Erbil And Its Museum';
    final look = _look(name, const ['Nowhere Sans']);
    expect(sprites.draw('long', look, dpr: 1, pass: 1), isNull);
    await Future<void>.delayed(Duration.zero);

    final long = sprites.draw('long', look, dpr: 1, pass: 1)!;
    final short = sprites.draw(
      'short',
      _look('Erbil', const ['Nowhere Sans']),
      dpr: 1,
      pass: 1,
    )!;
    expect(long.textHeight / short.textHeight, closeTo(2, 0.01));
  });
}
