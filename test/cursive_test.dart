import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/glyphs/cursive.dart';

void main() {
  test('latin text keeps its letter spacing', () {
    expect(letterSpacingFor('Spaced', 0.2), 0.2);
  });

  test('a label with a letter of a cursive script is not spaced', () {
    expect(letterSpacingFor('هەولێر', 0.2), 0);
    expect(letterSpacingFor('Erbil هەولێر', 0.2), 0);
    expect(letterSpacingFor('ܐܪܒܝܠ', 0.2), 0);
  });

  test('no spacing asked stays none', () {
    expect(letterSpacingFor('Erbil', 0), 0);
  });
}
