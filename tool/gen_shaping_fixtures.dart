// Writes test/fixtures/shaping.json: how HarfBuzz shapes a corpus of label
// text with the bundled fonts, for test/shaper_test.dart to hold vmap's
// shaper to.
//
//     dart run tool/gen_shaping_fixtures.dart
//
// Needs HarfBuzz's hb-shape on the path.
import 'dart:convert';
import 'dart:io';

const _vazirmatn = 'assets/fonts/Vazirmatn-Variable.ttf';
const _syriac = 'assets/fonts/NotoSansSyriacEastern-Variable.ttf';

/// Text by font, script and direction.
const _corpus = <(String, String, bool, List<String>)>[
  (
    _vazirmatn,
    'Arab',
    true,
    [
      'هەولێر',
      'سلێمانی',
      'بازاڕی قەیسەری',
      'ڵا ڵای کەڵا',
      'لا لأ لإ لآ',
      'ئاکرێ',
      'دهۆک',
      'کۆیە',
      'مُحَمَّد',
      'كِتَابٌ',
      'شَدَّة',
      'أ',
      'ؤ',
      'می‌خواهم',
      'ه‍',
      '‍ه',
      'ک‌ه',
      'ـــ',
      'پاکستان کا شہر',
      'چ ژ گ ڤ ۆ ێ',
      '(هەولێر)',
      '[شار] «ناو»',
      'هەولێر شار',
      'شار شار',
      'عەنکاوە',
      'مزگەوتی گەورە',
      '١٢٣',
      '۴۵۶',
      'ﷲ',
      'ٱلرَّحْمَٰن',
    ],
  ),
  (
    _vazirmatn,
    'Latn',
    false,
    [
      'Erbil',
      'Hewlêr',
      'AVATAR Tower WAVE',
      'office affluent',
      'Dihok Zaxo Amêdî',
      'é é ẹ̀ ẹ̀',
      'Straße Ærø',
      'fi fl ffi',
      '1,234.56 km',
      'Mount Sinjar (1,463 m)',
      '“quoted” — dash',
      'A B C D',
      'x︀',
    ],
  ),
  (_vazirmatn, 'Cyrl', false, ['Москва', 'Ерби́ль']),
  (_vazirmatn, 'Grek', false, ['Αθήνα', 'ἄλφα']),
  (_vazirmatn, 'Zyyy', false, ['123 456', '(1)', '+964']),
  (
    _syriac,
    'Syrc',
    true,
    [
      'ܥܢܟܒܐ',
      'ܐܠܗܐ',
      'ܕܐ',
      'ܪܐ',
      'ܒܐ',
      'ܐܐ',
      'ܒܐܒ',
      'ܡܠܟܐ',
      'ܫܠܡܐ',
      'ܟܬܒܐ ܕܩܘܕܫܐ',
      'ܐܵܬܘܿܪ',
      'ܡܫܝܚܐ',
    ],
  ),
];

const _weights = {
  _vazirmatn: [100, 400, 650, 900],
  _syriac: [400, 700],
};

void main() {
  final cases = <Map<String, Object>>[];
  for (final (font, script, rtl, texts) in _corpus) {
    for (final weight in _weights[font]!) {
      for (final text in texts) {
        final result = Process.runSync('hb-shape', [
          '--font-funcs=ot',
          '--remove-default-ignorables',
          '--no-glyph-names',
          '--show-extents',
          '--output-format=json',
          '--language=en',
          '--script=$script',
          '--direction=${rtl ? 'rtl' : 'ltr'}',
          '--variations=wght=$weight',
          font,
          text,
        ]);
        if (result.exitCode != 0) {
          stderr.write(result.stderr);
          exit(1);
        }
        final glyphs = jsonDecode(result.stdout as String) as List;
        cases.add({
          'font': font,
          'wght': weight,
          'script': script,
          'rtl': rtl,
          'text': text,
          'glyphs': [
            for (final g in glyphs.cast<Map<String, dynamic>>())
              [
                g['g'],
                g['ax'],
                g['dx'],
                g['dy'],
                g['xb'],
                g['yb'],
                g['w'],
                g['h'],
              ],
          ],
        });
      }
    }
  }
  final version = (Process.runSync('hb-shape', ['--version']).stdout as String)
      .split('\n')
      .first;
  File('test/fixtures/shaping.json').writeAsStringSync(
    '${const JsonEncoder.withIndent(' ').convert({'source': version, 'fields': 'glyph, advance, x offset, y offset, x bearing, y bearing, '
        'width, height', 'cases': cases})}\n',
  );
  stdout.writeln('${cases.length} cases from $version');
}
