/// Arabic-script letters joined into their contextual presentation forms,
/// as MapLibre joins them before drawing from glyph ranges, which hold a
/// glyph per code point and no shaping tables.
library;

import '../unicode.dart';

/// [c]'s joining type within the Arabic blocks, the only letters MapLibre
/// joins, the Syriac joining groups counting as right-joining letters.
int _typeOf(int c) {
  if (!(c >= 0x0600 && c <= 0x08FF ||
      c >= 0xFB50 && c <= 0xFDFF ||
      c >= 0xFE70 && c <= 0xFEFF)) {
    return joinNone;
  }
  final type = joiningOf(c);
  return type == joinAlaph || type == joinDalathRish ? joinRight : type;
}

bool _joinsForward(int type) =>
    type == joinDual || type == joinLeft || type == joinCausing;

bool _joinsBack(int type) =>
    type == joinDual || type == joinRight || type == joinCausing;

/// Whether [text] has a letter this joins.
bool hasJoiningLetters(String text) {
  for (final c in text.runes) {
    if (c >= 0x0600 && c <= 0x08FF) return true;
  }
  return false;
}

/// Whether [text] has a letter that joins but that Unicode gives no
/// presentation forms, which only shaping with a font can join.
bool needsFontShaping(String text) {
  for (final c in text.runes) {
    if (c < 0x0600 || c > 0x08FF || presentationForms(c) != null) continue;
    final type = _typeOf(c);
    if (type == joinDual || type == joinRight || type == joinLeft) return true;
  }
  return false;
}

/// [codes], in logical order, with each Arabic-script letter in the form
/// its neighbours call for, and lam and alef as one. A letter Unicode
/// gives no form for, such as the Kurdish ڵ, ڕ, ێ and ە, keeps its own
/// glyph, and its neighbours still join to it.
List<int> joinArabic(List<int> codes) => [
  for (final c in joinedForms(codes))
    if (c >= 0) c,
];

/// [joinArabic] kept to one code per code of [codes]: the alef of a lam
/// and alef drawn as one is -1, so a width or a break found per code of
/// the joined text holds for [codes].
List<int> joinedForms(List<int> codes) {
  int? next(int i) {
    for (var k = i + 1; k < codes.length; k++) {
      if (_typeOf(codes[k]) != joinTransparent) return k;
    }
    return null;
  }

  final out = <int>[];
  var joinedBefore = false;
  for (var i = 0; i < codes.length; i++) {
    final c = codes[i];
    final type = _typeOf(c);
    if (type == joinTransparent) {
      out.add(c);
      continue;
    }
    final after = next(i);
    final ligature = c == 0x0644 && after != null
        ? lamAlefForms(codes[after])
        : null;
    if (ligature != null) {
      final form = ligature[joinedBefore ? 1 : 0];
      out.add(form == 0 ? c : form);
      for (var k = i + 1; k < after!; k++) {
        out.add(codes[k]);
      }
      out.add(form == 0 ? codes[after] : -1);
      joinedBefore = false;
      i = after;
      continue;
    }
    final back = joinedBefore && _joinsBack(type);
    final forward =
        _joinsForward(type) &&
        after != null &&
        _joinsBack(_typeOf(codes[after]));
    final forms = presentationForms(c);
    final form = forms == null
        ? 0
        : forms[back ? (forward ? 3 : 1) : (forward ? 2 : 0)];
    out.add(form == 0 ? c : form);
    joinedBefore = forward;
  }
  return out;
}
