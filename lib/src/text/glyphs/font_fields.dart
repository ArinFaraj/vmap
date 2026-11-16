import 'dart:typed_data';

import 'glyph_layout.dart';
import 'glyph_pbf.dart';
import 'glyph_worker.dart';
import 'glyph_table.dart';

/// A weight and slant a font file is drawn at, numbered among the [count]
/// a font has.
extension type const FontLook._(int _index) {
  FontLook(int weight, bool italic)
    : _index = GlyphFonts.snapWeight(weight) ~/ 100 * 2 + (italic ? 1 : 0);

  static const count = 20;

  /// Font files the faces below [GlyphPbf.firstFace] have room for.
  static const fonts = GlyphPbf.firstFace ~/ count;

  int get weight => _index ~/ 2 * 100;
  bool get italic => _index.isOdd;

  /// The face the glyphs of font file [font] have among distance fields.
  int face(int font) => font * count + _index;
}

/// Whether a text's glyphs can be drawn as distance fields.
enum FieldsState {
  ready,

  /// Asked for, and drawn when they land.
  coming,

  /// A font of the text has no face among distance fields.
  never,
}

/// Distance field glyphs for every label: the style's glyph ranges, and
/// fields made from vmap's own fonts as labels need them. A face below
/// [GlyphPbf.firstFace] is a font file at a [FontLook], its glyphs looked
/// up by glyph id.
class FieldGlyphs implements PbfGlyphs {
  FieldGlyphs(this._worker, this._landed);

  final GlyphRasterWorker _worker;
  final void Function() _landed;

  /// The style's glyph ranges, which faces from [GlyphPbf.firstFace] up are
  /// looked up in.
  PbfGlyphs? ranges;

  final GlyphTable<PbfGlyph> _fields = GlyphTable();
  final GlyphTable<bool> _asked = GlyphTable();
  bool _disposed = false;

  /// Batches of fields asked for and not yet made.
  int pending = 0;

  @override
  PbfGlyph? glyph(int face, int codePoint) => face < GlyphPbf.firstFace
      ? _fields.at(face, codePoint)
      : ranges?.glyph(face, codePoint);

  /// Whether every glyph of [shaped], five numbers a glyph with its font
  /// and glyph id first, has its field at [look], asking for those that
  /// have not.
  FieldsState state(Float32List shaped, FontLook look) {
    for (var i = 0; i < shaped.length; i += 5) {
      if (shaped[i] >= FontLook.fonts) return FieldsState.never;
    }
    var all = true;
    Map<int, List<int>>? missing;
    for (var i = 0; i < shaped.length; i += 5) {
      final font = shaped[i].toInt();
      if (font < 0) continue;
      final face = look.face(font), glyph = shaped[i + 1].toInt();
      if (_fields.at(face, glyph) != null) continue;
      all = false;
      if (_asked.at(face, glyph) != null) continue;
      _asked.put(face, glyph, true);
      ((missing ??= {})[font] ??= []).add(glyph);
    }
    missing?.forEach((font, glyphs) => _ask(font, look, glyphs));
    return all ? FieldsState.ready : FieldsState.coming;
  }

  Future<void> _ask(int font, FontLook look, List<int> glyphs) async {
    pending++;
    final face = look.face(font);
    try {
      final made = await _worker.fields(font, look.weight, look.italic, glyphs);
      if (_disposed) return;
      for (final g in made) {
        _fields.put(face, g.id, g);
      }
    } catch (_) {
      // Glyphs whose fields could not be made are drawn without ink, so
      // their labels show what did arrive.
      for (final g in glyphs) {
        _fields.put(face, g, PbfGlyph.blank(g));
      }
    } finally {
      pending--;
      if (!_disposed) _landed();
    }
  }

  void dispose() => _disposed = true;
}
