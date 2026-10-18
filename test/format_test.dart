import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/expr.dart';
import 'package:vmap/src/format.dart';

void main() {
  test('a format keeps its runs, and plain runs read as plain text', () {
    final field = compileText([
      'format',
      'Big',
      {'font-scale': 1.5, 'text-color': 'red'},
      ' small',
      <String, Object?>{},
    ]);
    final (text, sections) = labelText(field(EvalContext()));
    expect(plainText(text), 'Big small');
    expect(sections, hasLength(2));
    expect(sections![0], [1.5, null, 0xFFFF0000, null, null]);
    expect(sections[1], [1.0, null, null, null, null]);

    final plain = compileText(['format', 'Only', <String, Object?>{}]);
    expect(labelText(plain(EvalContext())), ('Only', null));
  });
}
