import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/style/expr.dart';

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

  test('number-format groups thousands', () {
    expect(
      _run(['number-format', 1234567.891, <String, Object?>{}]),
      '1,234,567.891',
    );
    expect(_run(['number-format', -1234, <String, Object?>{}]), '-1,234');
  });

  test('type assertions pass over a value of another type', () {
    expect(_run(['number', '1', -1]), -1);
    expect(_run(['string', 1, 'x']), 'x');
    expect(
      _run([
        'array',
        'number',
        [
          'literal',
          [1, 2],
        ],
      ]),
      [1, 2],
    );
    expect(
      _run([
        'array',
        'string',
        [
          'literal',
          [1, 2],
        ],
      ]),
      isNull,
    );
  });

  test('a collator can set accents aside', () {
    expect(
      _run([
        '==',
        'Hewlêr',
        'hewler',
        ['collator', <String, Object?>{}],
      ]),
      isTrue,
    );
    expect(
      _run([
        '==',
        'Hewlêr',
        'hewler',
        [
          'collator',
          {'diacritic-sensitive': true},
        ],
      ]),
      isFalse,
    );
  });

  test('an icon falls back through the images it coalesces', () {
    final icon = compileIcon([
      'coalesce',
      ['image', 'missing'],
      ['image', 'dot'],
    ])(EvalContext());
    expect(icon, 'missing${imageChoice}dot');
  });

  test('text is counted and cut by character, not by UTF-16 unit', () {
    expect(_run(['length', '\u{1F600}a']), 2);
    expect(_run(['slice', '\u{1F600}ab', 1]), 'ab');
  });

  test('a transition eases from one value to the next over its span', () {
    final expr = compileExpr([r'$transition', 0, 10, 1000, 500, 100]);
    num at(double ms) => expr(EvalContext()..nowMs = ms)! as num;
    expect(at(1000), 0);
    expect(at(1100), 0);
    expect(at(1350), closeTo(5, 1e-9));
    expect(at(1600), 10);
  });

  test('the text of a zoom function has its tokens filled in', () {
    final text = compileText({
      'stops': [
        [0, '{name}'],
        [22, ''],
      ],
    });
    final c = EvalContext()
      ..zoom = 0
      ..props = {'name': 'X'};
    expect(text(c), 'X');
  });

  test('the text of an expression keeps its braces', () {
    final text = compileText([
      'step',
      ['zoom'],
      '{name}',
      10,
      '',
    ]);
    final c = EvalContext()
      ..zoom = 0
      ..props = {'name': 'X'};
    expect(text(c), '{name}');
  });

  test('step and interpolate give nothing for an input that is no number', () {
    final c = EvalContext()..props = {'zero': 0};
    final nan = [
      '/',
      0,
      ['get', 'zero'],
    ];
    expect(compileExpr(['step', nan, 1, 2, 2])(c), isNull);
    expect(
      compileExpr([
        'interpolate',
        ['linear'],
        nan,
        1,
        1,
        2,
        2,
      ])(c),
      isNull,
    );
  });
}
