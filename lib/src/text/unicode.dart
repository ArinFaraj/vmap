/// The Unicode character properties shaping and bidi ordering read, from
/// the tables tool/gen_unicode.dart writes.
library;

part 'unicode_data.g.dart';

/// Unicode's version of the tables.
const unicodeVersion = _unicodeVersion;

/// The bidi classes of UAX #9, in the order the tables number them.
enum BidiClass {
  l,
  r,
  al,
  en,
  es,
  et,
  an,
  cs,
  nsm,
  bn,
  b,
  s,
  ws,
  on,
  lre,
  lro,
  rle,
  rlo,
  pdf,
  lri,
  rli,
  fsi,
  pdi,
}

/// The value [runs] gives [c], or 0: [runs] holds sorted start, end, value
/// triples.
int _runValue(List<int> runs, int c) {
  var lo = 0, hi = runs.length ~/ 3 - 1;
  while (lo <= hi) {
    final mid = (lo + hi) >> 1;
    final i = mid * 3;
    if (c < runs[i]) {
      hi = mid - 1;
    } else if (c > runs[i + 1]) {
      lo = mid + 1;
    } else {
      return runs[i + 2];
    }
  }
  return 0;
}

/// The index of the record for [c] in [records], sorted by their first
/// field, [stride] fields each, or -1.
int _recordOf(List<int> records, int stride, int c) {
  var lo = 0, hi = records.length ~/ stride - 1;
  while (lo <= hi) {
    final mid = (lo + hi) >> 1;
    final v = records[mid * stride];
    if (c < v) {
      hi = mid - 1;
    } else if (c > v) {
      lo = mid + 1;
    } else {
      return mid * stride;
    }
  }
  return -1;
}

BidiClass bidiClassOf(int c) => BidiClass.values[_runValue(_bidiRuns, c)];

/// Scripts by index: [scriptCodes] names each.
const scriptUnknown = 0, scriptCommon = 1, scriptInherited = 2;

int scriptOf(int c) => _runValue(_scriptRuns, c);

/// The ISO 15924 code of [script], such as `Arab`.
String scriptCode(int script) => _scriptCodes[script];

/// The index of the script with ISO 15924 [code], or -1.
int scriptNamed(String code) => _scriptCodes.indexOf(code);

int combiningClassOf(int c) => _runValue(_combiningRuns, c);

int _category(int c) => _runValue(_categoryRuns, c);

/// Whether [c] is a combining mark: general category Mn, Mc or Me.
bool isMark(int c) {
  final g = _category(c);
  return g >= 1 && g <= 3;
}

bool isNonspacingMark(int c) => _category(c) == 1;

/// Whether [c] is a space separator, general category Zs.
bool isSpaceSeparator(int c) => _category(c) == 4;

bool isDefaultIgnorable(int c) => _runValue(_ignorableRuns, c) != 0;

/// Joining types, with the two Syriac joining groups that shaping tells
/// apart.
const joinNone = 0,
    joinTransparent = 1,
    joinDual = 2,
    joinRight = 3,
    joinLeft = 4,
    joinCausing = 5,
    joinAlaph = 6,
    joinDalathRish = 7;

const _listedNone = 8;

/// [c]'s joining type: from ArabicShaping.txt, or transparent for an
/// unlisted mark or format character.
int joiningOf(int c) {
  final j = _runValue(_joiningRuns, c);
  if (j == _listedNone) return joinNone;
  if (j != joinNone) return j;
  final g = _category(c);
  return g == 1 || g == 3 || g == 5 ? joinTransparent : joinNone;
}

/// The character drawn for [c] in right-to-left text, or [c].
int mirrorOf(int c) {
  final i = _recordOf(_mirrors, 2, c);
  return i < 0 ? c : _mirrors[i + 1];
}

/// [c]'s paired bracket and whether [c] opens, or null for no bracket.
(int, bool)? bracketOf(int c) {
  final i = _recordOf(_brackets, 3, c);
  return i < 0 ? null : (_brackets[i + 1], _brackets[i + 2] == 0);
}

const _sBase = 0xAC00, _lBase = 0x1100, _vBase = 0x1161, _tBase = 0x11A7;
const _lCount = 19, _vCount = 21, _tCount = 28;
const _nCount = _vCount * _tCount, _sCount = _lCount * _nCount;

/// [c]'s canonical decomposition into one or two characters, the second 0
/// for one, or null when it has none.
(int, int)? decompose(int c) {
  final s = c - _sBase;
  if (s >= 0 && s < _sCount) {
    final t = s % _tCount;
    return t != 0
        ? (c - t, _tBase + t)
        : (_lBase + s ~/ _nCount, _vBase + s % _nCount ~/ _tCount);
  }
  final i = _recordOf(_decompositions, 3, c);
  return i < 0 ? null : (_decompositions[i + 1], _decompositions[i + 2]);
}

/// The character [a] followed by [b] canonically composes to, or null.
int? compose(int a, int b) {
  final l = a - _lBase, v = b - _vBase;
  if (l >= 0 && l < _lCount && v >= 0 && v < _vCount) {
    return _sBase + (l * _vCount + v) * _tCount;
  }
  final s = a - _sBase, t = b - _tBase;
  if (s >= 0 && s < _sCount && s % _tCount == 0 && t > 0 && t < _tCount) {
    return a + t;
  }
  var lo = 0, hi = _compositions.length ~/ 3 - 1;
  while (lo <= hi) {
    final mid = (lo + hi) >> 1;
    final i = mid * 3;
    final x = _compositions[i], y = _compositions[i + 1];
    if (a < x || a == x && b < y) {
      hi = mid - 1;
    } else if (a > x || b > y) {
      lo = mid + 1;
    } else {
      return _compositions[i + 2];
    }
  }
  return null;
}

List<int>? _formsIn(List<int> table, int c) {
  final i = _recordOf(table, 5, c);
  return i < 0 ? null : table.sublist(i + 1, i + 5);
}

/// The Arabic presentation forms Unicode encodes for [letter]: isolated,
/// final, initial and medial, 0 where it has none; null for no forms.
List<int>? presentationForms(int letter) =>
    _formsIn(_presentationForms, letter);

/// The presentation forms of lam followed by [alef] as one ligature.
List<int>? lamAlefForms(int alef) => _formsIn(_lamAlefForms, alef);
