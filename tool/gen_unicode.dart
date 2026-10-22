// Writes lib/src/text/unicode_data.g.dart from the Unicode Character
// Database.
//
//     dart run tool/gen_unicode.dart <ucd dir>
//
// The directory holds these files from
// https://www.unicode.org/Public/<version>/ucd/, flat: UnicodeData.txt,
// ArabicShaping.txt, BidiMirroring.txt, BidiBrackets.txt, Scripts.txt,
// PropertyValueAliases.txt, DerivedCoreProperties.txt,
// DerivedNormalizationProps.txt, DerivedBidiClass.txt,
// DerivedGeneralCategory.txt and DerivedCombiningClass.txt.
import 'dart:io';
import 'dart:typed_data';

const _bidiClasses = [
  'L', 'R', 'AL', 'EN', 'ES', 'ET', 'AN', 'CS', 'NSM', 'BN', 'B', 'S', 'WS', //
  'ON', 'LRE', 'LRO', 'RLE', 'RLO', 'PDF', 'LRI', 'RLI', 'FSI', 'PDI',
];

const _categories = {'Mn': 1, 'Mc': 2, 'Me': 3, 'Zs': 4, 'Cf': 5};

const _joiningTypes = {'T': 1, 'D': 2, 'R': 3, 'L': 4, 'C': 5, 'U': 8};
const _alaph = 6, _dalathRish = 7;

const _forms = ['<isolated>', '<final>', '<initial>', '<medial>'];

const _max = 0x110000;

late String _dir;

Iterable<List<String>> _rows(String file) sync* {
  for (final line in File('$_dir/$file').readAsLinesSync()) {
    final data = line.split('#').first.trim();
    if (data.isEmpty) continue;
    yield [for (final f in data.split(';')) f.trim()];
  }
}

(int, int) _range(String field) {
  final parts = field.split('..');
  final a = int.parse(parts.first, radix: 16);
  return (a, parts.length > 1 ? int.parse(parts[1], radix: 16) : a);
}

/// Runs of equal non-default values as flat start, end, value triples.
List<int> _runs(Uint8List values) {
  final out = <int>[];
  var c = 0;
  while (c < _max) {
    final v = values[c];
    var end = c;
    while (end + 1 < _max && values[end + 1] == v) {
      end++;
    }
    if (v != 0) out.addAll([c, end, v]);
    c = end + 1;
  }
  return out;
}

String _list(String name, String doc, List<int> values, int perLine) {
  final b = StringBuffer('$doc\nconst $name = <int>[\n');
  for (var i = 0; i < values.length; i += perLine) {
    final row = values.skip(i).take(perLine).map(_hex);
    b.writeln('  ${row.join(', ')},');
  }
  b.writeln('];\n');
  return b.toString();
}

String _hex(int v) => v < 10 ? '$v' : '0x${v.toRadixString(16).toUpperCase()}';

void main(List<String> args) {
  if (args.length != 1) {
    stderr.writeln('usage: dart run tool/gen_unicode.dart <ucd dir>');
    exit(64);
  }
  _dir = args.single;
  final version = RegExp(r'DerivedBidiClass-([\d.]+)\.txt')
      .firstMatch(File('$_dir/DerivedBidiClass.txt').readAsStringSync())!
      .group(1);

  final bidi = Uint8List(_max);
  for (final line in File('$_dir/DerivedBidiClass.txt').readAsLinesSync()) {
    final m = RegExp(r'^# @missing: (\S+); (\w+)').firstMatch(line);
    if (m == null) continue;
    final (a, b) = _range(m.group(1)!);
    final v = _bidiClasses.indexOf(_bidiShort(m.group(2)!));
    bidi.fillRange(a, b + 1, v);
  }
  for (final r in _rows('DerivedBidiClass.txt')) {
    final (a, b) = _range(r[0]);
    bidi.fillRange(a, b + 1, _bidiClasses.indexOf(r[1]));
  }

  final scriptCodes = <String, String>{};
  for (final r in _rows('PropertyValueAliases.txt')) {
    if (r[0] == 'sc') scriptCodes[r[2]] = r[1];
  }
  final scripts = ['Zzzz', 'Zyyy', 'Zinh'];
  final script = Uint8List(_max);
  for (final r in _rows('Scripts.txt')) {
    final code = scriptCodes[r[1]]!;
    var i = scripts.indexOf(code);
    if (i < 0) {
      i = scripts.length;
      scripts.add(code);
    }
    final (a, b) = _range(r[0]);
    script.fillRange(a, b + 1, i);
  }

  final category = Uint8List(_max);
  for (final r in _rows('DerivedGeneralCategory.txt')) {
    final v = _categories[r[1]];
    if (v == null) continue;
    final (a, b) = _range(r[0]);
    category.fillRange(a, b + 1, v);
  }

  final combining = Uint8List(_max);
  for (final r in _rows('DerivedCombiningClass.txt')) {
    final (a, b) = _range(r[0]);
    combining.fillRange(a, b + 1, int.parse(r[1]));
  }

  final joining = Uint8List(_max);
  for (final r in _rows('ArabicShaping.txt')) {
    final c = int.parse(r[0], radix: 16);
    joining[c] = switch (r[3]) {
      'ALAPH' => _alaph,
      'DALATH RISH' => _dalathRish,
      _ => _joiningTypes[r[2]] ?? 0,
    };
  }

  final ignorable = Uint8List(_max);
  for (final r in _rows('DerivedCoreProperties.txt')) {
    if (r[1] != 'Default_Ignorable_Code_Point') continue;
    final (a, b) = _range(r[0]);
    ignorable.fillRange(a, b + 1, 1);
  }

  final excluded = <int>{};
  for (final r in _rows('DerivedNormalizationProps.txt')) {
    if (r[1] != 'Full_Composition_Exclusion') continue;
    final (a, b) = _range(r[0]);
    for (var c = a; c <= b; c++) {
      excluded.add(c);
    }
  }
  final decompositions = <int>[];
  final compositions = <(int, int, int)>[];
  final names = <int, String>{};
  final presentation = <int, List<int>>{};
  final lamAlef = <int, List<int>>{};
  for (final r in _rows('UnicodeData.txt')) {
    names[int.parse(r[0], radix: 16)] = r[1];
  }
  for (final r in _rows('UnicodeData.txt')) {
    final d = r[5];
    final c = int.parse(r[0], radix: 16);
    final form = _forms.indexOf(d.split(' ').first);
    final presentationBlock = c >= 0xFB50 && c <= 0xFDFF || c >= 0xFE70;
    if (form >= 0 && presentationBlock && c <= 0xFEFF) {
      final bases = [
        for (final p in d.split(' ').skip(1)) int.parse(p, radix: 16),
      ];
      if (bases.length == 1) {
        (presentation[bases.single] ??= [0, 0, 0, 0])[form] = c;
      } else if (bases.length == 2 &&
          bases.first == 0x0644 &&
          names[bases.last]!.contains('ALEF')) {
        (lamAlef[bases.last] ??= [0, 0, 0, 0])[form] = c;
      }
    }
    if (d.isEmpty || d.startsWith('<')) continue;
    final parts = [for (final p in d.split(' ')) int.parse(p, radix: 16)];
    final a = parts[0], b = parts.length > 1 ? parts[1] : 0;
    decompositions.addAll([c, a, b]);
    if (b != 0 && !excluded.contains(c)) compositions.add((a, b, c));
  }
  compositions.sort((x, y) => x.$1 != y.$1 ? x.$1 - y.$1 : x.$2 - y.$2);

  final mirrors = <int>[];
  for (final r in _rows('BidiMirroring.txt')) {
    mirrors.addAll([int.parse(r[0], radix: 16), int.parse(r[1], radix: 16)]);
  }
  final brackets = <int>[];
  for (final r in _rows('BidiBrackets.txt')) {
    brackets.addAll([
      int.parse(r[0], radix: 16),
      int.parse(r[1], radix: 16),
      r[2] == 'o' ? 0 : 1,
    ]);
  }

  List<int> flat(Map<int, List<int>> forms) => [
    for (final c in forms.keys.toList()..sort()) ...[c, ...forms[c]!],
  ];

  final out = StringBuffer()
    ..writeln(
      '// Generated by tool/gen_unicode.dart from Unicode $version. '
      'Do not edit.',
    )
    ..writeln('// dart format off')
    ..writeln()
    ..writeln("part of 'unicode.dart';")
    ..writeln()
    ..writeln('const _unicodeVersion = \'$version\';')
    ..writeln()
    ..writeln('/// ISO 15924 codes, indexed by [_scriptRuns] values.')
    ..writeln('const _scriptCodes = [')
    ..writeln(
      [for (final s in scripts) "'$s'"]
          .join(', ')
          .replaceAllMapped(RegExp(r'(.{1,72})(, |$)'), (m) => '  ${m[1]},\n'),
    )
    ..writeln('];')
    ..writeln()
    ..write(
      _list(
        '_bidiRuns',
        '/// Bidi classes other than L: start, end, index into [BidiClass].',
        _runs(bidi),
        12,
      ),
    )
    ..write(
      _list(
        '_scriptRuns',
        '/// Scripts other than Unknown: start, end, index into '
            '[_scriptCodes].',
        _runs(script),
        12,
      ),
    )
    ..write(
      _list(
        '_categoryRuns',
        '/// General categories that shaping asks about: start, end, and 1 '
            'Mn,\n/// 2 Mc, 3 Me, 4 Zs, 5 Cf.',
        _runs(category),
        12,
      ),
    )
    ..write(
      _list(
        '_combiningRuns',
        '/// Canonical combining classes other than 0: start, end, class.',
        _runs(combining),
        12,
      ),
    )
    ..write(
      _list(
        '_joiningRuns',
        '/// Joining types listed in ArabicShaping.txt: start, end, '
            'and\n/// 1 T, 2 D, 3 R, 4 L, 5 C, 6 the Syriac Alaph, 7 Dalath '
            'and Rish, 8 U as listed.',
        _runs(joining),
        12,
      ),
    )
    ..write(
      _list(
        '_ignorableRuns',
        '/// Default ignorable code points: start, end, 1.',
        _runs(ignorable),
        12,
      ),
    )
    ..write(
      _list(
        '_decompositions',
        '/// Canonical decompositions, by code point: the code point, its '
            'first\n/// part and its second, 0 for a singleton.',
        decompositions,
        12,
      ),
    )
    ..write(
      _list(
        '_compositions',
        '/// Canonical compositions, by first then second part: the parts '
            'and\n/// what they compose to.',
        [
          for (final (a, b, c) in compositions) ...[a, b, c],
        ],
        12,
      ),
    )
    ..write(
      _list(
        '_mirrors',
        '/// Bidi mirroring pairs, by code point: the code point and its '
            'mirror.',
        mirrors,
        12,
      ),
    )
    ..write(
      _list(
        '_brackets',
        '/// Paired brackets, by code point: the code point, its pair, and '
            '0 for\n/// an opening bracket, 1 for a closing one.',
        brackets,
        12,
      ),
    )
    ..write(
      _list(
        '_presentationForms',
        '/// Arabic presentation forms by letter: the letter, then its '
            'isolated,\n/// final, initial and medial forms, 0 where Unicode '
            'has none.',
        flat(presentation),
        10,
      ),
    )
    ..write(
      _list(
        '_lamAlefForms',
        '/// Lam followed by an alef as one ligature, by the alef, in the '
            'same forms.',
        flat(lamAlef),
        10,
      ),
    );
  File('lib/src/text/unicode_data.g.dart')
    ..createSync(recursive: true)
    ..writeAsStringSync(out.toString().replaceFirst(RegExp(r'\n+$'), '\n'));
}

String _bidiShort(String long) =>
    const {
      'Left_To_Right': 'L',
      'Right_To_Left': 'R',
      'Arabic_Letter': 'AL',
      'European_Number': 'EN',
      'European_Separator': 'ES',
      'European_Terminator': 'ET',
      'Arabic_Number': 'AN',
      'Common_Separator': 'CS',
      'Nonspacing_Mark': 'NSM',
      'Boundary_Neutral': 'BN',
      'Paragraph_Separator': 'B',
      'Segment_Separator': 'S',
      'White_Space': 'WS',
      'Other_Neutral': 'ON',
    }[long] ??
    long;
