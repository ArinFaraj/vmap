import 'dart:typed_data';

import 'font/apply.dart';
import 'font/font.dart';
import 'font/gpos.dart';
import 'font/gsub.dart';
import 'font/layout.dart';
import 'fallback_marks.dart';
import 'normalize.dart';
import 'scripts.dart';
import 'unicode.dart';

/// Glyphs shaped from a run of text, left to right as drawn: each glyph's
/// id, advance and offset from its pen position, in font units, y up.
class ShapedGlyphs {
  ShapedGlyphs(this.glyphs, this.advances, this.xOffsets, this.yOffsets);

  final Int32List glyphs;
  final Float64List advances, xOffsets, yOffsets;

  int get length => glyphs.length;
}

/// Shapes text with one font the way OpenType asks: Unicode normalization,
/// contextual forms for joining scripts, then the font's own `GSUB` and
/// `GPOS` lookups for its default language system. A font without `GPOS`
/// kerns by its `kern` table and has its marks placed by their glyph boxes.
///
/// Scripts other than the joining ones take the default shaping, which
/// suits alphabets; the reordering Indic and Southeast Asian scripts need
/// is not done.
class Shaper {
  Shaper(this.font);

  final Font font;
  final Map<(int, bool), _Plan> _plans = {};

  /// [text], code points of one [script] and direction, shaped. A
  /// character the font has no glyph for comes out as glyph 0. Default
  /// ignorable characters, such as joiners and direction marks, steer
  /// shaping and are then left out.
  ShapedGlyphs shape(List<int> text, {required int script, bool rtl = false}) {
    final plan = _plans[(script, rtl)] ??= _Plan(font, script, rtl);
    final codes = rtl
        ? [
            for (final c in text)
              if (mirrorOf(c) case final m when m != c && font.glyphOf(m) != 0)
                m
              else
                c,
          ]
        : text;
    final glyphs = normalize(font, codes, arabic: plan.joining);
    for (final g in glyphs) {
      g.mask = plan.globalMask;
      if (rtl) {
        final m = mirrorOf(g.codepoint);
        if (m != g.codepoint && font.glyphOf(m) == 0) g.mask |= plan.rtlmMask;
      }
    }
    if (plan.joining) _join(glyphs, plan.formMasks);
    final gdef = font.file.gdef;
    for (final g in glyphs) {
      if (gdef != null && gdef.hasGlyphClasses) {
        g
          ..glyphClass = gdef.glyphClass(g.glyph)
          ..markClass = gdef.markClass(g.glyph);
      } else {
        g.glyphClass = g.nonspacing && !g.ignorable ? glyphMark : glyphBase;
      }
    }

    final gsub = font.file.gsub;
    if (gsub != null) {
      final applier = Substitution(font, gsub, glyphs);
      for (final stage in plan.substitutions) {
        for (final l in stage) {
          applier.apply(
            l.index,
            l.mask,
            autoZwj: l.autoZwj,
            autoZwnj: l.autoZwnj,
          );
        }
      }
    }
    glyphs.removeWhere((g) => g.ignorable && !g.substituted);

    for (final g in glyphs) {
      g.xAdvance = font.advance(g.glyph).toDouble();
      if (g.spaceFallback) {
        g.xAdvance = fallbackSpaceAdvance(font, g.codepoint, g.xAdvance);
      }
    }
    final file = font.file;
    final gpos = file.gpos;
    final positioning = gpos != null;
    if (positioning) {
      final applier = Positioning(font, gpos, glyphs, rtl: rtl);
      for (final l in plan.positionings) {
        applier.apply(
          l.index,
          l.mask,
          autoZwj: l.autoZwj,
          autoZwnj: l.autoZwnj,
        );
      }
    }
    final kern = file.kern;
    final legacyKerning =
        kern != null && (!positioning || !gpos.hasFeature('kern'));
    if (legacyKerning) kern.apply(glyphs, plan.globalMask, rtl: rtl);
    final placeMarks = !positioning && (!legacyKerning || !kern.hasCrossStream);
    for (final g in glyphs) {
      if (!g.isMark) continue;
      if (placeMarks && !rtl) g.xOffset -= g.xAdvance;
      g
        ..xAdvance = 0
        ..yAdvance = 0;
    }
    Positioning.resolveAttachments(glyphs, rtl);
    if (placeMarks) placeMarksWithoutLayout(font, glyphs, rtl: rtl);

    final n = glyphs.length;
    final out = ShapedGlyphs(
      Int32List(n),
      Float64List(n),
      Float64List(n),
      Float64List(n),
    );
    for (var i = 0; i < n; i++) {
      final g = glyphs[rtl ? n - 1 - i : i];
      out.glyphs[i] = g.glyph;
      out.advances[i] = g.xAdvance;
      out.xOffsets[i] = g.xOffset;
      out.yOffsets[i] = g.yOffset;
    }
    return out;
  }

  /// Gives each letter of a joining script the mask of its contextual form,
  /// by the joining types of the letters around it.
  static void _join(List<ShapingGlyph> glyphs, List<int> formMasks) {
    final forms = List<int>.filled(glyphs.length, _none);
    var prev = -1, state = 0;
    for (var i = 0; i < glyphs.length; i++) {
      final column = switch (joiningOf(glyphs[i].codepoint)) {
        joinTransparent => -1,
        joinLeft => 1,
        joinRight => 2,
        joinDual || joinCausing => 3,
        joinAlaph => 4,
        joinDalathRish => 5,
        _ => 0,
      };
      if (column < 0) continue;
      final entry = _joiningStates[state][column];
      if (entry.$1 != _none && prev >= 0) forms[prev] = entry.$1;
      forms[i] = entry.$2;
      prev = i;
      state = entry.$3;
    }
    for (var i = 0; i < glyphs.length; i++) {
      if (forms[i] != _none) glyphs[i].mask |= formMasks[forms[i]];
    }
  }
}

/// Contextual forms, in the order of [_formTags].
const _none = 0, _isol = 1, _fina = 2, _fin2 = 3, _fin3 = 4;
const _medi = 5, _med2 = 6, _init = 7;

const _formTags = ['isol', 'fina', 'fin2', 'fin3', 'medi', 'med2', 'init'];

/// The joining state machine: for each state, by the next letter's joining
/// type (non-joining, left, right, dual, the Syriac Alaph, Dalath and Rish),
/// the form the letter before takes, the form this one takes, and the next
/// state.
const _joiningStates = [
  // Before: nothing that joins.
  [
    (_none, _none, 0),
    (_none, _isol, 2),
    (_none, _isol, 1),
    (_none, _isol, 2),
    (_none, _isol, 1),
    (_none, _isol, 6),
  ],
  // Before: a right-joining letter, isolated, that will not join on.
  [
    (_none, _none, 0),
    (_none, _isol, 2),
    (_none, _isol, 1),
    (_none, _isol, 2),
    (_none, _fin2, 5),
    (_none, _isol, 6),
  ],
  // Before: a dual or left-joining letter, isolated, that may join on.
  [
    (_none, _none, 0),
    (_none, _isol, 2),
    (_init, _fina, 1),
    (_init, _fina, 3),
    (_init, _fina, 4),
    (_init, _fina, 6),
  ],
  // Before: a dual-joining letter in its final form, that may join on.
  [
    (_none, _none, 0),
    (_none, _isol, 2),
    (_medi, _fina, 1),
    (_medi, _fina, 3),
    (_medi, _fina, 4),
    (_medi, _fina, 6),
  ],
  // Before: a final Alaph.
  [
    (_none, _none, 0),
    (_none, _isol, 2),
    (_med2, _isol, 1),
    (_med2, _isol, 2),
    (_med2, _fin2, 5),
    (_med2, _isol, 6),
  ],
  // Before: an Alaph in its second or third final form.
  [
    (_none, _none, 0),
    (_none, _isol, 2),
    (_isol, _isol, 1),
    (_isol, _isol, 2),
    (_isol, _fin2, 5),
    (_isol, _isol, 6),
  ],
  // Before: Dalath or Rish.
  [
    (_none, _none, 0),
    (_none, _isol, 2),
    (_none, _isol, 1),
    (_none, _isol, 2),
    (_none, _fin3, 5),
    (_none, _isol, 6),
  ],
];

class _Feature {
  _Feature(
    this.tag,
    this.stage, {
    required this.global,
    this.manualZwj = false,
  });

  final String tag;
  final int stage;
  final bool global, manualZwj;
  int mask = 0;
}

class _PlannedLookup {
  _PlannedLookup(this.index, this.mask, this.autoZwj, this.autoZwnj);

  final int index;
  int mask;
  bool autoZwj, autoZwnj;
}

/// What shaping one script in one direction with one font does: the
/// features, in stages, and the lookups each stage runs.
class _Plan {
  _Plan(Font font, int script, bool rtl)
    : joining = joiningScripts.contains(scriptCode(script)) {
    final features = <_Feature>[];
    var stage = 0;
    void add(String tag, {bool global = true, bool manualZwj = false}) {
      if (features.any((f) => f.tag == tag)) return;
      features.add(_Feature(tag, stage, global: global, manualZwj: manualZwj));
    }

    add('rvrn');
    stage++;
    if (rtl) {
      add('rtla');
      add('rtlm', global: false);
    } else {
      add('ltra');
      add('ltrm');
    }
    if (joining) {
      add('stch');
      stage++;
      add('ccmp', manualZwj: true);
      add('locl', manualZwj: true);
      stage++;
      for (final tag in _formTags) {
        add(tag, global: false);
        stage++;
      }
      stage++;
      add('rlig', manualZwj: true);
      if (scriptCode(script) == 'Arab') stage++;
      add('rclt', manualZwj: true);
      add('calt', manualZwj: true);
      stage++;
      add('mset');
    }
    for (final tag in const [
      'abvm',
      'blwm',
      'ccmp',
      'locl',
      'mark',
      'mkmk',
      'rlig',
      'calt',
      'clig',
      'curs',
      'dist',
      'kern',
      'liga',
      'rclt',
    ]) {
      add(tag);
    }

    var bit = 2;
    for (final f in features) {
      if (f.global) {
        f.mask = globalMask;
      } else {
        f.mask = bit;
        bit <<= 1;
      }
    }
    rtlmMask = _maskOf(features, 'rtlm');
    formMasks = [0, for (final tag in _formTags) _maskOf(features, tag)];

    final tags = openTypeScriptTags(script);
    final gsub = font.file.gsub, gpos = font.file.gpos;
    final stages = stage + 1;
    substitutions = gsub == null
        ? const []
        : _lookups(gsub, tags, features, font.coords, stages);
    positionings = gpos == null
        ? const []
        : _lookups(gpos, tags, features, font.coords, 1).first;
  }

  final bool joining;
  final int globalMask = 1;
  late final int rtlmMask;

  /// The mask of each contextual form, by its index, 0 for none.
  late final List<int> formMasks;
  late final List<List<_PlannedLookup>> substitutions;
  late final List<_PlannedLookup> positionings;

  static int _maskOf(List<_Feature> features, String tag) {
    for (final f in features) {
      if (f.tag == tag) return f.mask;
    }
    return 0;
  }

  /// The lookups of [table] the [features] select, in [stages] stages,
  /// each stage in lookup order with a lookup two features share run once
  /// for both. With one stage, every feature runs in it.
  static List<List<_PlannedLookup>> _lookups(
    LayoutTable table,
    List<String> scriptTags,
    List<_Feature> features,
    Float64List coords,
    int stages,
  ) {
    final out = [for (var s = 0; s < stages; s++) <_PlannedLookup>[]];
    final lang = table.langSys(scriptTags);
    if (lang == null) return out;
    void addFeature(int index, int stage, int mask, bool autoZwj) {
      for (final l in table.featureLookups(index, coords)) {
        if (l >= table.lookupCount) continue;
        out[stages == 1 ? 0 : stage].add(
          _PlannedLookup(l, mask, autoZwj, true),
        );
      }
    }

    final required = lang.required;
    if (required != null) {
      final tag = table.featureTag(required);
      final stage = features
          .firstWhere(
            (f) => f.tag == tag,
            orElse: () => _Feature(tag, 0, global: true),
          )
          .stage;
      addFeature(required, stage, 1, true);
    }
    for (final f in features) {
      final index = lang.features.firstWhere(
        (i) => table.featureTag(i) == f.tag,
        orElse: () => -1,
      );
      if (index < 0) continue;
      addFeature(index, f.stage, f.mask, !f.manualZwj);
    }
    for (final stage in out) {
      stage.sort((a, b) => a.index - b.index);
      for (var i = stage.length - 1; i > 0; i--) {
        final a = stage[i - 1], b = stage[i];
        if (a.index != b.index) continue;
        a
          ..mask |= b.mask
          ..autoZwj &= b.autoZwj
          ..autoZwnj &= b.autoZwnj;
        stage.removeAt(i);
      }
    }
    return out;
  }
}
