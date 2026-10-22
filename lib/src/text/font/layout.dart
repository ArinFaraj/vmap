import 'dart:typed_data';

import 'bytes.dart';
import 'variations.dart';

/// [glyph]'s index in the Coverage table at [at], or -1.
int coverageIndex(ByteData data, int at, int glyph) {
  final format = data.u16(at), count = data.u16(at + 2);
  var lo = 0, hi = count - 1;
  if (format == 1) {
    while (lo <= hi) {
      final mid = (lo + hi) >> 1;
      final g = data.u16(at + 4 + mid * 2);
      if (glyph < g) {
        hi = mid - 1;
      } else if (glyph > g) {
        lo = mid + 1;
      } else {
        return mid;
      }
    }
  } else if (format == 2) {
    while (lo <= hi) {
      final mid = (lo + hi) >> 1;
      final r = at + 4 + mid * 6;
      if (glyph < data.u16(r)) {
        hi = mid - 1;
      } else if (glyph > data.u16(r + 2)) {
        lo = mid + 1;
      } else {
        return data.u16(r + 4) + glyph - data.u16(r);
      }
    }
  }
  return -1;
}

/// [glyph]'s class in the ClassDef table at [at], 0 when it has none.
int classOf(ByteData data, int at, int glyph) {
  final format = data.u16(at);
  if (format == 1) {
    final first = data.u16(at + 2);
    final i = glyph - first;
    return i >= 0 && i < data.u16(at + 4) ? data.u16(at + 6 + i * 2) : 0;
  }
  if (format == 2) {
    var lo = 0, hi = data.u16(at + 2) - 1;
    while (lo <= hi) {
      final mid = (lo + hi) >> 1;
      final r = at + 4 + mid * 6;
      if (glyph < data.u16(r)) {
        hi = mid - 1;
      } else if (glyph > data.u16(r + 2)) {
        lo = mid + 1;
      } else {
        return data.u16(r + 4);
      }
    }
  }
  return 0;
}

/// Glyph classes from GDEF, as lookups tell glyphs apart.
const glyphBase = 1, glyphLigature = 2, glyphMark = 3, glyphComponent = 4;

/// The `GDEF` table: glyph classes, mark classes and sets, and the store of
/// deltas positioning reads.
class Gdef {
  Gdef(this.data, int at)
    : _classes = _sub(data, at, 4),
      _markClasses = _sub(data, at, 10),
      _markSets = data.u16(at + 2) >= 2 ? _sub(data, at, 12) : null,
      store = data.u16(at + 2) >= 3 && data.u32(at + 14) != 0
          ? ItemVariationStore(data, at + data.u32(at + 14))
          : null;

  static int? _sub(ByteData data, int at, int field) {
    final o = data.u16(at + field);
    return o == 0 ? null : at + o;
  }

  final ByteData data;
  final int? _classes, _markClasses, _markSets;
  final ItemVariationStore? store;

  bool get hasGlyphClasses => _classes != null;

  int glyphClass(int glyph) =>
      _classes == null ? 0 : classOf(data, _classes, glyph);

  int markClass(int glyph) =>
      _markClasses == null ? 0 : classOf(data, _markClasses, glyph);

  bool inMarkSet(int set, int glyph) {
    final sets = _markSets;
    if (sets == null || set >= data.u16(sets + 2)) return false;
    return coverageIndex(data, sets + data.u32(sets + 4 + set * 4), glyph) >= 0;
  }
}

/// One lookup: its type, flags and subtables, with extension subtables
/// already followed to the subtables they hold.
class Lookup {
  Lookup(this.type, this.flag, this.subtables, this.markSet);

  final int type, flag, markSet;
  final List<int> subtables;

  static const rightToLeft = 0x0001,
      ignoreBase = 0x0002,
      ignoreLigatures = 0x0004,
      ignoreMarks = 0x0008,
      useMarkSet = 0x0010;

  int get markAttachment => flag >> 8;
}

/// A script's language system: the features a font applies to it.
typedef LangSys = ({String script, int? required, List<int> features});

/// A `GSUB` or `GPOS` table: scripts, features and lookups.
class LayoutTable {
  LayoutTable(this.data, this.at, {required this.extensionType})
    : _scripts = at + data.u16(at + 4),
      _features = at + data.u16(at + 6),
      _lookups = at + data.u16(at + 8),
      _variations = data.u16(at + 2) >= 1 && data.u32(at + 10) != 0
          ? at + data.u32(at + 10)
          : null;

  final ByteData data;
  final int at;

  /// The lookup type that wraps another: 7 in GSUB, 9 in GPOS.
  final int extensionType;
  final int _scripts, _features, _lookups;
  final int? _variations;
  final Map<int, Lookup> _cache = {};

  /// The default language system of the first of [tags] the table has a
  /// script for, or null.
  LangSys? langSys(List<String> tags) {
    final count = data.u16(_scripts);
    for (final tag in tags) {
      for (var i = 0; i < count; i++) {
        final r = _scripts + 2 + i * 6;
        if (data.tag(r) != tag) continue;
        final script = _scripts + data.u16(r + 4);
        final def = data.u16(script);
        if (def == 0) continue;
        final l = script + def;
        final required = data.u16(l + 2);
        return (
          script: tag,
          required: required == 0xFFFF ? null : required,
          features: [
            for (var k = 0; k < data.u16(l + 4); k++) data.u16(l + 6 + k * 2),
          ],
        );
      }
    }
    return null;
  }

  String featureTag(int feature) => data.tag(_features + 2 + feature * 6);

  /// Whether any script of the table has feature [tag].
  bool hasFeature(String tag) {
    for (var i = 0; i < data.u16(_features); i++) {
      if (featureTag(i) == tag) return true;
    }
    return false;
  }

  /// The lookups of [feature] at [coords], after any feature variation
  /// that applies there.
  List<int> featureLookups(int feature, Float64List coords) {
    var table = _features + data.u16(_features + 2 + feature * 6 + 4);
    final substitute = _substitute(feature, coords);
    if (substitute != null) table = substitute;
    return [
      for (var k = 0; k < data.u16(table + 2); k++) data.u16(table + 4 + k * 2),
    ];
  }

  int? _substitute(int feature, Float64List coords) {
    final v = _variations;
    if (v == null || coords.isEmpty) return null;
    for (var i = 0; i < data.u32(v + 4); i++) {
      final r = v + 8 + i * 8;
      final conditions = v + data.u32(r);
      var all = true;
      for (var c = 0; c < data.u16(conditions); c++) {
        final cond = conditions + data.u32(conditions + 2 + c * 4);
        if (data.u16(cond) != 1) {
          all = false;
          break;
        }
        final axis = data.u16(cond + 2);
        final value = axis < coords.length ? coords[axis] : 0.0;
        if (value < data.f2dot14(cond + 4) || value > data.f2dot14(cond + 6)) {
          all = false;
          break;
        }
      }
      if (!all) continue;
      final subs = v + data.u32(r + 4);
      for (var s = 0; s < data.u16(subs + 4); s++) {
        final rec = subs + 6 + s * 6;
        if (data.u16(rec) == feature) return subs + data.u32(rec + 2);
      }
      return null;
    }
    return null;
  }

  int get lookupCount => data.u16(_lookups);

  Lookup lookup(int index) => _cache[index] ??= () {
    final l = _lookups + data.u16(_lookups + 2 + index * 2);
    final declared = data.u16(l);
    var type = declared;
    final flag = data.u16(l + 2), count = data.u16(l + 4);
    final subtables = <int>[];
    for (var i = 0; i < count; i++) {
      var sub = l + data.u16(l + 6 + i * 2);
      if (declared == extensionType) {
        type = data.u16(sub + 2);
        sub += data.u32(sub + 4);
      }
      subtables.add(sub);
    }
    final markSet = flag & Lookup.useMarkSet != 0
        ? data.u16(l + 6 + count * 2)
        : 0;
    return Lookup(type, flag, subtables, markSet);
  }();
}
