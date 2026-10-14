/// Arabic-script letters joined into their contextual presentation forms,
/// as MapLibre joins them before drawing from glyph ranges, which hold a
/// glyph per code point and no shaping tables. The tables come from the
/// Unicode database; see tool/gen_arabic_tables.py.
library;

part 'arabic_tables.g.dart';

const _transparent = 1, _dual = 2, _right = 3, _left = 4, _causing = 5;

int _typeOf(int c) => _joiningTypes[c] ?? 0;

bool _joinsForward(int type) =>
    type == _dual || type == _left || type == _causing;

bool _joinsBack(int type) =>
    type == _dual || type == _right || type == _causing;

/// Whether [text] has a letter this joins.
bool hasJoiningLetters(String text) {
  for (final c in text.runes) {
    if (c >= 0x0600 && c <= 0x08FF) return true;
  }
  return false;
}

/// [codes], in logical order, with each Arabic-script letter in the form
/// its neighbours call for, and lam and alef as one. A letter Unicode
/// gives no form for, such as the Kurdish ڵ, ڕ, ێ and ە, keeps its own
/// glyph, and its neighbours still join to it.
List<int> joinArabic(List<int> codes) {
  int? next(int i) {
    for (var k = i + 1; k < codes.length; k++) {
      if (_typeOf(codes[k]) != _transparent) return k;
    }
    return null;
  }

  final out = <int>[];
  var joinedBefore = false;
  for (var i = 0; i < codes.length; i++) {
    final c = codes[i];
    final type = _typeOf(c);
    if (type == _transparent) {
      out.add(c);
      continue;
    }
    final after = next(i);
    final ligature = c == 0x0644 && after != null
        ? _lamLigatures[codes[after]]
        : null;
    if (ligature != null) {
      final form = ligature[joinedBefore ? 1 : 0];
      out.add(form == 0 ? c : form);
      if (form == 0) {
        for (var k = i + 1; k <= after!; k++) {
          out.add(codes[k]);
        }
      } else {
        for (var k = i + 1; k < after!; k++) {
          out.add(codes[k]);
        }
      }
      joinedBefore = false;
      i = after;
      continue;
    }
    final back = joinedBefore && _joinsBack(type);
    final forward =
        _joinsForward(type) &&
        after != null &&
        _joinsBack(_typeOf(codes[after]));
    final forms = _presentation[c];
    final form = forms == null
        ? 0
        : forms[back ? (forward ? 3 : 1) : (forward ? 2 : 0)];
    out.add(form == 0 ? c : form);
    joinedBefore = forward;
  }
  return out;
}
