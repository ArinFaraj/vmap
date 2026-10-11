import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';

Object? _run(Object? json) => compileExpr(json)(EvalContext());

void main() {
  test('hsl and hsla make colours', () {
    final green = _run(['hsl', 120, 100, 50])! as Rgba;
    expect([green.r, green.g, green.b, green.a], [0, 1, 0, 1]);
    expect((_run(['hsla', 0, 100, 50, 0.5])! as Rgba).a, 0.5);
  });

  test('split and join', () {
    expect(_run(['split', 'a,b,c', ',']), ['a', 'b', 'c']);
    expect(
      _run([
        'join',
        ['split', 'a,b,c', ','],
        ' - ',
      ]),
      'a - b - c',
    );
  });

  test('number-format keeps the digits it is asked for', () {
    expect(
      _run([
        'number-format',
        3.14159,
        {'max-fraction-digits': 2},
      ]),
      '3.14',
    );
    expect(_run(['number-format', 3.10, <String, Object?>{}]), '3.1');
    expect(_run(['number-format', 3, <String, Object?>{}]), '3');
    expect(
      _run([
        'number-format',
        3,
        {'min-fraction-digits': 1, 'max-fraction-digits': 3},
      ]),
      '3.0',
    );
  });

  test('a collator sets case aside unless told to keep it', () {
    expect(
      _run([
        '==',
        'Erbil',
        'erbil',
        ['collator', <String, Object?>{}],
      ]),
      isTrue,
    );
    expect(
      _run([
        '!=',
        'Erbil',
        'erbil',
        ['collator', <String, Object?>{}],
      ]),
      isFalse,
    );
    expect(
      _run([
        '==',
        'Erbil',
        'erbil',
        [
          'collator',
          {'case-sensitive': true},
        ],
      ]),
      isFalse,
    );
    expect(
      _run([
        '<',
        'a',
        'B',
        ['collator', <String, Object?>{}],
      ]),
      isTrue,
    );
  });

  test('get and has read an object given to them', () {
    const from = [
      'literal',
      {'x': 1},
    ];
    expect(_run(['get', 'x', from]), 1);
    expect(_run(['has', 'x', from]), isTrue);
    expect(_run(['has', 'y', from]), isFalse);
  });
}
