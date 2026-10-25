import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/text/bidi.dart';
import 'package:vmap/src/text/unicode.dart';

/// Unicode's conformance cases. BIDI_CHARACTER_TEST names the whole
/// BidiCharacterTest.txt to run every case instead of the sample.
void main() {
  final path =
      Platform.environment['BIDI_CHARACTER_TEST'] ??
      'test/fixtures/bidi_character_test.txt';
  final cases = [
    for (final line in File(path).readAsLinesSync())
      if (line.isNotEmpty && !line.startsWith('#')) line.split(';'),
  ];

  test('orders every Unicode conformance case', () {
    final failures = <String>[];
    for (final c in cases) {
      final text = [for (final h in c[0].split(' ')) int.parse(h, radix: 16)];
      final given = int.parse(c[1]);
      final bidi = Bidi.resolve(
        text,
        paragraphLevel: given == 2 ? null : given,
      );
      final levels = c[3].split(' ');
      final order = [
        for (final run in bidi.visualRuns)
          for (final i
              in run.rightToLeft
                  ? [for (var i = run.end - 1; i >= run.start; i--) i]
                  : [for (var i = run.start; i < run.end; i++) i])
            if (levels[i] != 'x') i,
      ];
      final gotLevels = [
        for (var i = 0; i < text.length; i++)
          levels[i] == 'x' ? 'x' : '${bidi.levels[i]}',
      ];
      if (bidi.paragraphLevel != int.parse(c[2]) ||
          gotLevels.join(' ') != c[3] ||
          order.join(' ') != c[4].trim()) {
        failures.add(
          '${c[0]}; ${c[1]}: level ${bidi.paragraphLevel}, '
          'levels ${gotLevels.join(' ')} (want ${c[3]}), '
          'order ${order.join(' ')} (want ${c[4].trim()})',
        );
      }
    }
    expect(failures.take(10), isEmpty, reason: '${failures.length} fail');
  });

  test('a paragraph takes the direction of its first strong letter', () {
    expect(Bidi.resolve('123 abc'.runes.toList()).paragraphLevel, 0);
    expect(Bidi.resolve('123 هەولێر'.runes.toList()).paragraphLevel, 1);
  });

  test('runs come left to right as drawn', () {
    final text = 'Erbil هەولێر 2026'.runes.toList();
    final runs = Bidi.resolve(text).visualRuns;
    expect([for (final r in runs) r.level], [0, 2, 1]);
    expect(runs.first.start, 0);
  });

  test('reads Unicode $unicodeVersion', () {
    expect(bidiClassOf(0x06B5), BidiClass.al);
  });

  test('a text\'s direction is its first paragraph\'s level', () {
    for (final c in cases) {
      if (c[1] != '2') continue;
      final text = [for (final h in c[0].split(' ')) int.parse(h, radix: 16)];
      if (text.any((t) => t > 0xFFFF)) continue;
      expect(
        textIsRightToLeft(String.fromCharCodes(text)),
        Bidi.resolve(text).paragraphLevel == 1,
        reason: c[0],
      );
    }
  });

  test('direction comes from the first strong letter, any script', () {
    expect(textIsRightToLeft('Москва القاهرة'), isFalse);
    expect(textIsRightToLeft('12 القاهرة'), isTrue);
    expect(textIsRightToLeft('ירושלים'), isTrue);
    expect(textIsRightToLeft('\u2067Erbil\u2069 هەولێر'), isTrue);
    expect(textIsRightToLeft('123'), isFalse);
  });
}
