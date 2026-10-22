import 'unicode.dart';

/// A run of text in one script: code points [start] to [end], in [script],
/// an index [scriptCode] names.
class ScriptRun {
  const ScriptRun(this.start, this.end, this.script);

  final int start, end, script;

  @override
  String toString() => 'ScriptRun($start..$end, ${scriptCode(script)})';
}

/// [text] split where its script changes. Spaces, punctuation, digits and
/// marks, which belong to no one script, join the run before them, or the
/// first run when they lead. Text with no script of its own is one run in
/// [scriptCommon].
List<ScriptRun> scriptRuns(List<int> text) {
  final runs = <ScriptRun>[];
  var start = 0, current = scriptCommon;
  for (var i = 0; i < text.length; i++) {
    final s = scriptOf(text[i]);
    if (s == scriptCommon || s == scriptInherited || s == current) continue;
    if (current == scriptCommon) {
      current = s;
      continue;
    }
    runs.add(ScriptRun(start, i, current));
    start = i;
    current = s;
  }
  if (text.isNotEmpty) runs.add(ScriptRun(start, text.length, current));
  return runs;
}

/// The OpenType script tags a font may hold [script] under, best first,
/// ending with the tags any script falls back to.
List<String> openTypeScriptTags(int script) {
  final code = scriptCode(script);
  final own = switch (code) {
    'Zyyy' || 'Zinh' || 'Zzzz' => const <String>[],
    'Hira' || 'Kana' || 'Hrkt' => const ['kana'],
    'Laoo' => const ['lao '],
    'Yiii' => const ['yi  '],
    'Nkoo' => const ['nko '],
    'Vaii' => const ['vai '],
    'Deva' => const ['dev2', 'deva'],
    'Beng' => const ['bng2', 'beng'],
    'Guru' => const ['gur2', 'guru'],
    'Gujr' => const ['gjr2', 'gujr'],
    'Orya' => const ['ory2', 'orya'],
    'Taml' => const ['tml2', 'taml'],
    'Telu' => const ['tel2', 'telu'],
    'Knda' => const ['knd2', 'knda'],
    'Mlym' => const ['mlm2', 'mlym'],
    'Mymr' => const ['mym2', 'mymr'],
    _ => [code.toLowerCase()],
  };
  return [...own, 'DFLT', 'dflt', 'latn'];
}

/// Scripts whose letters join, shaped with contextual forms.
const joiningScripts = {
  'Arab',
  'Syrc',
  'Mong',
  'Nkoo',
  'Phag',
  'Mand',
  'Mani',
  'Phlp',
  'Adlm',
  'Rohg',
  'Sogd',
  'Chrs',
  'Ougr',
};
