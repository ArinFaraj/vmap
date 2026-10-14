import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/glyphs/arabic_forms.dart';

List<int> join(String text) => joinArabic(text.runes.toList());

void main() {
  test('letters take the form their neighbours call for', () {
    expect(join('بب'), [0xFE91, 0xFE90]);
    expect(join('ببب'), [0xFE91, 0xFE92, 0xFE90]);
    expect(join('ب'), [0xFE8F]);
  });

  test('lam and alef are one ligature', () {
    expect(join('سلام'), [0xFEB3, 0xFEFC, 0xFEE1]);
    expect(join('لا'), [0xFEFB]);
  });

  test('a letter joining only backwards ends the joined run', () {
    expect(join('دب'), [0xFEA9, 0xFE8F]);
  });

  test('Kurdish letters without forms keep their glyph and their joins', () {
    expect(join('هەولێر'), [0xFEEB, 0x06D5, 0xFEED, 0xFEDF, 0x06CE, 0xFEAE]);
  });

  test('marks between letters do not break the join', () {
    expect(join('بَب'), [0xFE91, 0x064E, 0xFE90]);
  });

  test('text with no Arabic letters is left as it is', () {
    expect(join('Erbil 44'), 'Erbil 44'.runes.toList());
    expect(hasJoiningLetters('Erbil'), isFalse);
    expect(hasJoiningLetters('هەولێر'), isTrue);
  });

  test('only letters without forms need a font to join', () {
    expect(needsFontShaping('هەولێر'), isTrue);
    expect(needsFontShaping('سلام'), isFalse);
    expect(needsFontShaping('Erbil'), isFalse);
  });
}
