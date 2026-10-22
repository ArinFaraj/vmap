import 'dart:math' as math;
import 'dart:typed_data';

import 'bytes.dart';
import 'glyf.dart';
import 'kern.dart';
import 'layout.dart';
import 'variations.dart';

export 'glyf.dart' show GlyphOutline;
export 'variations.dart' show FontAxis;

/// A TrueType font file read for shaping and drawing labels: its character
/// map, metrics, outlines, variation axes and layout tables.
class FontFile {
  FontFile._(this.data, this._tables) {
    final head = _require('head'), maxp = _require('maxp');
    final hhea = _require('hhea');
    unitsPerEm = data.u16(head + 18);
    glyphCount = data.u16(maxp + 4);
    ascender = data.i16(hhea + 4);
    descender = data.i16(hhea + 6);
    glyphs = Glyphs(
      data,
      loca: _require('loca'),
      glyf: _require('glyf'),
      longOffsets: data.i16(head + 50) == 1,
      glyphCount: glyphCount,
      hmtx: _require('hmtx'),
      metricCount: math.max(1, data.u16(hhea + 34)),
      gvar: _tables['gvar'],
    );
    axes = Axes.read(data, _tables['fvar'], _tables['avar']);
    _cmap = _CharMap(data, _require('cmap'));
    final gdef = _tables['GDEF'];
    this.gdef = gdef == null ? null : Gdef(data, gdef);
    final gsub = _tables['GSUB'], gpos = _tables['GPOS'];
    this.gsub = gsub == null ? null : LayoutTable(data, gsub, extensionType: 7);
    this.gpos = gpos == null ? null : LayoutTable(data, gpos, extensionType: 9);
    final kern = _tables['kern'];
    this.kern = kern == null ? null : LegacyKern.read(data, kern);
    final hvar = _tables['HVAR'];
    if (hvar != null) {
      _advanceStore = ItemVariationStore(data, hvar + data.u32(hvar + 4));
      final map = data.u32(hvar + 8);
      _advanceMap = map == 0 ? null : DeltaSetIndexMap(data, hvar + map);
    }
  }

  /// Reads a TrueType font, or the first font of a collection. Throws a
  /// [FormatException] for anything else.
  factory FontFile.parse(Uint8List bytes) {
    final data = ByteData.sublistView(bytes);
    try {
      var at = 0;
      if (data.tag(0) == 'ttcf') at = data.u32(12);
      final version = data.u32(at);
      if (version != 0x00010000 && data.tag(at) != 'true') {
        throw const FormatException('Not a TrueType font');
      }
      final tables = <String, int>{};
      for (var i = 0; i < data.u16(at + 4); i++) {
        final r = at + 12 + i * 16;
        tables[data.tag(r)] = data.u32(r + 8);
      }
      return FontFile._(data, tables);
    } on RangeError {
      throw const FormatException('Font data ends early');
    }
  }

  final ByteData data;
  final Map<String, int> _tables;

  late final int unitsPerEm, glyphCount, ascender, descender;
  late final Glyphs glyphs;
  late final Axes? axes;
  late final _CharMap _cmap;
  late final Gdef? gdef;
  late final LayoutTable? gsub, gpos;
  late final LegacyKern? kern;
  ItemVariationStore? _advanceStore;
  DeltaSetIndexMap? _advanceMap;

  /// The glyph the font maps [c] to, 0 when it has none.
  int glyphOf(int c) => _cmap.glyph(c);

  /// The glyph for [c] followed by variation [selector], or null.
  int? variantOf(int c, int selector) => _cmap.variant(c, selector);

  int _require(String tag) =>
      _tables[tag] ?? (throw FormatException('Font has no $tag table'));

  /// [glyph]'s advance at [coords], rounded to a font unit as rasterizers
  /// round it.
  int advance(int glyph, Float64List coords) {
    final base = glyphs.advance(glyph);
    if (coords.isEmpty) return base;
    final store = _advanceStore;
    if (store == null) return glyphs.variedAdvance(glyph, coords);
    final (outer, inner) = _advanceMap?[glyph] ?? (0, glyph);
    return base + store.delta(outer, inner, coords).round();
  }
}

/// A font at one point of its design space, as labels are shaped and drawn
/// with it.
class Font {
  Font._(this.file, this.coords)
    : _advances = Int32List(file.glyphCount)..fillRange(0, file.glyphCount, -1);

  /// Reads a TrueType font at its default instance.
  factory Font.parse(Uint8List bytes) =>
      Font._(FontFile.parse(bytes), Float64List(0));

  final FontFile file;

  /// Normalized coordinates, one per axis, or none at the default.
  final Float64List coords;
  final Int32List _advances;

  bool get isVariable => file.axes != null;

  List<FontAxis> get axes => file.axes?.axes ?? const [];

  int get unitsPerEm => file.unitsPerEm;

  /// This font at [values], user values by axis tag, such as `wght`.
  Font withAxes(Map<String, double> values) {
    final axes = file.axes;
    if (axes == null) return this;
    final coords = axes.normalize(values);
    return Font._(file, coords.every((c) => c == 0) ? Float64List(0) : coords);
  }

  /// The glyph the font maps [c] to, 0 when it has none.
  int glyphOf(int c) => file.glyphOf(c);

  /// The glyph for [c] followed by variation [selector], or null when the
  /// font has no variant for the pair.
  int? variantOf(int c, int selector) => file.variantOf(c, selector);

  int advance(int glyph) {
    if (glyph >= _advances.length) return 0;
    final a = _advances[glyph];
    if (a >= 0) return a;
    return _advances[glyph] = file.advance(glyph, coords);
  }

  GlyphOutline? outline(int glyph) => file.glyphs.outline(glyph, coords);

  /// [glyph]'s ink box: left, top, width and a negative height, y up.
  (double, double, double, double) extents(int glyph) =>
      file.glyphs.extents(glyph, coords);
}

class _CharMap {
  _CharMap(this.data, int at) {
    final count = data.u16(at + 2);
    final subtables = <(int, int), int>{};
    for (var i = 0; i < count; i++) {
      final r = at + 4 + i * 8;
      subtables[(data.u16(r), data.u16(r + 2))] = at + data.u32(r + 4);
    }
    const preferred = [
      (3, 10),
      (0, 6),
      (0, 4),
      (3, 1),
      (0, 3),
      (0, 2),
      (0, 1),
      (0, 0),
      (3, 0),
    ];
    for (final key in preferred) {
      final sub = subtables[key];
      if (sub == null || !const [0, 4, 6, 12].contains(data.u16(sub))) {
        continue;
      }
      _main = sub;
      _symbol = key == (3, 0);
      break;
    }
    _variants = subtables[(0, 5)];
  }

  final ByteData data;
  int? _main, _variants;
  bool _symbol = false;

  int glyph(int c) {
    final sub = _main;
    if (sub == null) return 0;
    final g = _lookup(sub, c);
    if (g == 0 && _symbol && c <= 0xFF) return _lookup(sub, 0xF000 + c);
    return g;
  }

  int _lookup(int sub, int c) {
    switch (data.u16(sub)) {
      case 0:
        return c < 256 ? data.u8(sub + 6 + c) : 0;
      case 4:
        if (c > 0xFFFF) return 0;
        final segments = data.u16(sub + 6) ~/ 2;
        final ends = sub + 14, starts = ends + segments * 2 + 2;
        final deltas = starts + segments * 2, ranges = deltas + segments * 2;
        var lo = 0, hi = segments - 1;
        while (lo <= hi) {
          final mid = (lo + hi) >> 1;
          if (c > data.u16(ends + mid * 2)) {
            lo = mid + 1;
            continue;
          }
          final start = data.u16(starts + mid * 2);
          if (c < start) {
            hi = mid - 1;
            continue;
          }
          final delta = data.u16(deltas + mid * 2);
          final range = data.u16(ranges + mid * 2);
          if (range == 0) return (c + delta) & 0xFFFF;
          final at = ranges + mid * 2 + range + (c - start) * 2;
          final g = data.u16(at);
          return g == 0 ? 0 : (g + delta) & 0xFFFF;
        }
        return 0;
      case 6:
        final first = data.u16(sub + 6), count = data.u16(sub + 8);
        final i = c - first;
        return i >= 0 && i < count ? data.u16(sub + 10 + i * 2) : 0;
      case 12:
        var lo = 0, hi = data.u32(sub + 12) - 1;
        while (lo <= hi) {
          final mid = (lo + hi) >> 1;
          final r = sub + 16 + mid * 12;
          if (c < data.u32(r)) {
            hi = mid - 1;
          } else if (c > data.u32(r + 4)) {
            lo = mid + 1;
          } else {
            return data.u32(r + 8) + c - data.u32(r);
          }
        }
        return 0;
    }
    return 0;
  }

  int? variant(int c, int selector) {
    final sub = _variants;
    if (sub == null) return null;
    final count = data.u32(sub + 6);
    for (var i = 0; i < count; i++) {
      final r = sub + 10 + i * 11;
      if (data.u24(r) != selector) continue;
      final defaults = data.u32(r + 3), others = data.u32(r + 7);
      if (others != 0) {
        final t = sub + others;
        var lo = 0, hi = data.u32(t) - 1;
        while (lo <= hi) {
          final mid = (lo + hi) >> 1;
          final u = data.u24(t + 4 + mid * 5);
          if (c < u) {
            hi = mid - 1;
          } else if (c > u) {
            lo = mid + 1;
          } else {
            return data.u16(t + 4 + mid * 5 + 3);
          }
        }
      }
      if (defaults != 0) {
        final t = sub + defaults;
        for (var k = 0; k < data.u32(t); k++) {
          final start = data.u24(t + 4 + k * 4);
          if (c >= start && c <= start + data.u8(t + 4 + k * 4 + 3)) {
            final g = glyph(c);
            return g == 0 ? null : g;
          }
        }
      }
      return null;
    }
    return null;
  }
}
