import 'dart:math' as math;
import 'dart:typed_data';

import 'unicode.dart';

/// A run of text at one embedding level: code points [start] to [end] of
/// the text, read right to left when [level] is odd.
class BidiRun {
  const BidiRun(this.start, this.end, this.level);

  final int start, end, level;

  bool get rightToLeft => level.isOdd;

  @override
  String toString() => 'BidiRun($start..$end, $level)';
}

/// Text ordered by the Unicode bidirectional algorithm, UAX #9, each
/// paragraph taken as one line.
class Bidi {
  Bidi._(this.levels, this.paragraphLevels, this.visualRuns);

  /// Orders [text], code points, giving every paragraph [paragraphLevel]
  /// when set, or the direction of its first strong character.
  factory Bidi.resolve(List<int> text, {int? paragraphLevel}) {
    final levels = Uint8List(text.length);
    final paragraphs = <int>[];
    final runs = <BidiRun>[];
    var start = 0;
    for (var i = 0; i <= text.length; i++) {
      final end = i == text.length;
      if (!end && bidiClassOf(text[i]) != BidiClass.b) continue;
      final stop = end ? i : i + 1;
      if (stop > start || paragraphs.isEmpty) {
        final p = _Paragraph(text, start, stop, paragraphLevel, levels);
        paragraphs.add(p.level);
        runs.addAll(p.visualRuns());
      }
      start = stop;
    }
    return Bidi._(levels, paragraphs, runs);
  }

  /// Each code point's resolved level. Characters the algorithm removes,
  /// embedding controls and boundary neutrals, take the level before them.
  final Uint8List levels;

  /// Each paragraph's embedding level, 0 or 1 unless one was given.
  final List<int> paragraphLevels;

  /// The runs left to right as they are drawn.
  final List<BidiRun> visualRuns;

  /// The first paragraph's embedding level.
  int get paragraphLevel => paragraphLevels.first;
}

/// Whether [text] is written right to left: the direction of its first
/// strong character outside an isolate, as rules P2 and P3 find a
/// paragraph's.
bool textIsRightToLeft(String text) {
  var isolates = 0;
  for (final c in text.runes) {
    switch (bidiClassOf(c)) {
      case BidiClass.lri || BidiClass.rli || BidiClass.fsi:
        isolates++;
      case BidiClass.pdi when isolates > 0:
        isolates--;
      case BidiClass.b when isolates == 0:
        return false;
      case BidiClass.l when isolates == 0:
        return false;
      case BidiClass.r || BidiClass.al when isolates == 0:
        return true;
      default:
    }
  }
  return false;
}

/// Whether any of [codes] is a right-to-left letter or opens right-to-left
/// text, so that ordering them needs the bidi algorithm.
bool hasRightToLeft(List<int> codes) => codes.any(
  (c) => switch (bidiClassOf(c)) {
    BidiClass.r ||
    BidiClass.al ||
    BidiClass.rle ||
    BidiClass.rlo ||
    BidiClass.rli ||
    BidiClass.fsi => true,
    _ => false,
  },
);

const _maxDepth = 125;

bool _removed(BidiClass c) =>
    c == BidiClass.bn ||
    c == BidiClass.lre ||
    c == BidiClass.rle ||
    c == BidiClass.lro ||
    c == BidiClass.rlo ||
    c == BidiClass.pdf;

bool _isolateInitiator(BidiClass c) =>
    c == BidiClass.lri || c == BidiClass.rli || c == BidiClass.fsi;

/// Neutral and isolate classes, as rules N1 and N2 see them.
bool _neutral(BidiClass c) =>
    c == BidiClass.b ||
    c == BidiClass.s ||
    c == BidiClass.ws ||
    c == BidiClass.on ||
    _isolateInitiator(c) ||
    c == BidiClass.pdi;

/// Strong direction as rules N0 to N2 see it, numbers counting as right to
/// left, or null for none.
BidiClass? _strong(BidiClass c) => switch (c) {
  BidiClass.l => BidiClass.l,
  BidiClass.r || BidiClass.al || BidiClass.en || BidiClass.an => BidiClass.r,
  _ => null,
};

class _Entry {
  _Entry(this.level, this.override, this.isolate);

  final int level;
  final BidiClass? override;
  final bool isolate;
}

class _Paragraph {
  _Paragraph(this.text, this.start, this.end, int? level, this.levels)
    : initial = [for (var i = start; i < end; i++) bidiClassOf(text[i])] {
    types = List.of(initial);
    _matchIsolates();
    this.level = level ?? _firstStrong(0, initial.length);
    _explicit();
    for (final sequence in _sequences()) {
      _resolve(sequence);
    }
    _implicit();
    _trailing();
  }

  final List<int> text;
  final int start, end;
  final Uint8List levels;

  /// Classes by position from [start], as given and as resolved.
  final List<BidiClass> initial;
  late final List<BidiClass> types;
  late final int level;

  /// For each isolate initiator, the position of its matching PDI, or the
  /// paragraph's length.
  final Map<int, int> _pdiOf = {};
  final Set<int> _matchedPdi = {};

  int get length => initial.length;

  void _matchIsolates() {
    final open = <int>[];
    for (var i = 0; i < length; i++) {
      final c = initial[i];
      if (_isolateInitiator(c)) {
        open.add(i);
      } else if (c == BidiClass.pdi && open.isNotEmpty) {
        _pdiOf[open.removeLast()] = i;
        _matchedPdi.add(i);
      }
    }
    for (final i in open) {
      _pdiOf[i] = length;
    }
  }

  /// Rules P2 and P3 over positions [from] to [to]: 1 when the first strong
  /// character outside isolates is right to left, else 0.
  int _firstStrong(int from, int to) {
    for (var i = from; i < to; i++) {
      final c = initial[i];
      if (c == BidiClass.l) return 0;
      if (c == BidiClass.r || c == BidiClass.al) return 1;
      if (_isolateInitiator(c)) i = _pdiOf[i]!;
    }
    return 0;
  }

  /// Rules X1 to X8.
  void _explicit() {
    final stack = [_Entry(level, null, false)];
    var overflowIsolates = 0, overflowEmbeddings = 0, validIsolates = 0;
    for (var i = 0; i < length; i++) {
      final c = initial[i];
      final top = stack.last;
      switch (c) {
        case BidiClass.rle || BidiClass.lre || BidiClass.rlo || BidiClass.lro:
          final rtl = c == BidiClass.rle || c == BidiClass.rlo;
          final next = rtl ? (top.level + 1) | 1 : (top.level + 2) & ~1;
          if (next <= _maxDepth &&
              overflowIsolates == 0 &&
              overflowEmbeddings == 0) {
            final override = switch (c) {
              BidiClass.rlo => BidiClass.r,
              BidiClass.lro => BidiClass.l,
              _ => null,
            };
            stack.add(_Entry(next, override, false));
          } else if (overflowIsolates == 0) {
            overflowEmbeddings++;
          }
          _set(i, top.level);
        case BidiClass.rli || BidiClass.lri || BidiClass.fsi:
          _set(i, top.level);
          if (top.override != null) types[i] = top.override!;
          final rtl =
              c == BidiClass.rli ||
              c == BidiClass.fsi && _firstStrong(i + 1, _pdiOf[i]!) == 1;
          final next = rtl ? (top.level + 1) | 1 : (top.level + 2) & ~1;
          if (next <= _maxDepth &&
              overflowIsolates == 0 &&
              overflowEmbeddings == 0) {
            validIsolates++;
            stack.add(_Entry(next, null, true));
          } else {
            overflowIsolates++;
          }
        case BidiClass.pdi:
          if (overflowIsolates > 0) {
            overflowIsolates--;
          } else if (validIsolates > 0) {
            overflowEmbeddings = 0;
            while (!stack.last.isolate) {
              stack.removeLast();
            }
            stack.removeLast();
            validIsolates--;
          }
          final now = stack.last;
          _set(i, now.level);
          if (now.override != null) types[i] = now.override!;
        case BidiClass.pdf:
          if (overflowIsolates == 0) {
            if (overflowEmbeddings > 0) {
              overflowEmbeddings--;
            } else if (!top.isolate && stack.length >= 2) {
              stack.removeLast();
            }
          }
          _set(i, top.level);
        case BidiClass.b:
          _set(i, level);
        case BidiClass.bn:
          _set(i, top.level);
        default:
          _set(i, top.level);
          if (top.override != null) types[i] = top.override!;
      }
    }
  }

  void _set(int i, int value) => levels[start + i] = value;

  int _level(int i) => levels[start + i];

  /// Rule X10: the isolating run sequences, as positions, removed
  /// characters left out.
  List<List<int>> _sequences() {
    final runs = <List<int>>[];
    List<int>? run;
    var runLevel = -1;
    for (var i = 0; i < length; i++) {
      if (_removed(initial[i])) continue;
      if (run == null || _level(i) != runLevel) {
        run = [];
        runs.add(run);
        runLevel = _level(i);
      }
      run.add(i);
    }
    final runOf = <int, List<int>>{};
    for (final r in runs) {
      runOf[r.first] = r;
    }
    final sequences = <List<int>>[];
    for (final r in runs) {
      if (initial[r.first] == BidiClass.pdi && _matchedPdi.contains(r.first)) {
        continue;
      }
      final sequence = <int>[];
      var current = r;
      while (true) {
        sequence.addAll(current);
        final last = current.last;
        if (!_isolateInitiator(initial[last])) break;
        final pdi = _pdiOf[last]!;
        final next = pdi < length ? runOf[pdi] : null;
        if (next == null) break;
        current = next;
      }
      sequences.add(sequence);
    }
    return sequences;
  }

  int _neighbourLevel(int from, int step) {
    for (var i = from + step; i >= 0 && i < length; i += step) {
      if (!_removed(initial[i])) return _level(i);
    }
    return level;
  }

  /// Rules W1 to W7, N0 to N2, over one isolating run sequence.
  void _resolve(List<int> seq) {
    final runLevel = _level(seq.first);
    final before = _neighbourLevel(seq.first, -1);
    final last = seq.last;
    final after = _isolateInitiator(initial[last])
        ? level
        : _neighbourLevel(last, 1);
    final sos = math.max(before, runLevel).isOdd ? BidiClass.r : BidiClass.l;
    final eos = math.max(after, _level(last)).isOdd ? BidiClass.r : BidiClass.l;
    final t = [for (final i in seq) types[i]];
    final n = t.length;

    // W1
    for (var k = 0; k < n; k++) {
      if (t[k] != BidiClass.nsm) continue;
      if (k == 0) {
        t[k] = sos;
      } else {
        final p = t[k - 1];
        t[k] = _isolateInitiator(p) || p == BidiClass.pdi ? BidiClass.on : p;
      }
    }
    // W2, W3
    var lastStrong = sos;
    for (var k = 0; k < n; k++) {
      final c = t[k];
      if (c == BidiClass.l || c == BidiClass.r || c == BidiClass.al) {
        lastStrong = c;
      } else if (c == BidiClass.en && lastStrong == BidiClass.al) {
        t[k] = BidiClass.an;
      }
    }
    for (var k = 0; k < n; k++) {
      if (t[k] == BidiClass.al) t[k] = BidiClass.r;
    }
    // W4
    for (var k = 1; k < n - 1; k++) {
      final p = t[k - 1], c = t[k], q = t[k + 1];
      if (c == BidiClass.es && p == BidiClass.en && q == BidiClass.en) {
        t[k] = BidiClass.en;
      } else if (c == BidiClass.cs &&
          p == q &&
          (p == BidiClass.en || p == BidiClass.an)) {
        t[k] = p;
      }
    }
    // W5
    for (var k = 0; k < n; k++) {
      if (t[k] != BidiClass.et) continue;
      var e = k;
      while (e < n && t[e] == BidiClass.et) {
        e++;
      }
      final touches =
          k > 0 && t[k - 1] == BidiClass.en || e < n && t[e] == BidiClass.en;
      if (touches) t.fillRange(k, e, BidiClass.en);
      k = e - 1;
    }
    // W6
    for (var k = 0; k < n; k++) {
      final c = t[k];
      if (c == BidiClass.es || c == BidiClass.et || c == BidiClass.cs) {
        t[k] = BidiClass.on;
      }
    }
    // W7
    lastStrong = sos;
    for (var k = 0; k < n; k++) {
      final c = t[k];
      if (c == BidiClass.l || c == BidiClass.r) {
        lastStrong = c;
      } else if (c == BidiClass.en && lastStrong == BidiClass.l) {
        t[k] = BidiClass.l;
      }
    }

    final embedding = runLevel.isOdd ? BidiClass.r : BidiClass.l;
    _brackets(seq, t, sos, embedding);

    // N1, N2
    for (var k = 0; k < n; k++) {
      if (!_neutral(t[k])) continue;
      var e = k;
      while (e < n && _neutral(t[e])) {
        e++;
      }
      final lead = k == 0 ? sos : _strong(t[k - 1]);
      final trail = e == n ? eos : _strong(t[e]);
      t.fillRange(k, e, lead == trail && lead != null ? lead : embedding);
      k = e - 1;
    }

    for (var k = 0; k < n; k++) {
      types[seq[k]] = t[k];
    }
  }

  /// Rule N0: paired brackets take the direction of what they enclose.
  void _brackets(
    List<int> seq,
    List<BidiClass> t,
    BidiClass sos,
    BidiClass embedding,
  ) {
    final pairs = <(int, int)>[];
    final open = <(int, int)>[];
    for (var k = 0; k < seq.length; k++) {
      if (t[k] != BidiClass.on) continue;
      final b = bracketOf(text[start + seq[k]]);
      if (b == null) continue;
      final (pair, opening) = b;
      if (opening) {
        if (open.length == 63) break;
        open.add((_canonicalBracket(pair), k));
        continue;
      }
      final me = _canonicalBracket(text[start + seq[k]]);
      for (var s = open.length - 1; s >= 0; s--) {
        if (open[s].$1 != me) continue;
        pairs.add((open[s].$2, k));
        open.removeRange(s, open.length);
        break;
      }
    }
    pairs.sort((a, b) => a.$1 - b.$1);
    final opposite = embedding == BidiClass.l ? BidiClass.r : BidiClass.l;
    for (final (o, c) in pairs) {
      var found = false, foundOpposite = false;
      for (var k = o + 1; k < c; k++) {
        final s = _strong(t[k]);
        if (s == embedding) {
          found = true;
          break;
        }
        if (s == opposite) foundOpposite = true;
      }
      BidiClass? to;
      if (found) {
        to = embedding;
      } else if (foundOpposite) {
        var context = sos;
        for (var k = o - 1; k >= 0; k--) {
          final s = _strong(t[k]);
          if (s != null) {
            context = s;
            break;
          }
        }
        to = context == opposite ? opposite : embedding;
      }
      if (to == null) continue;
      for (final k in [o, c]) {
        t[k] = to;
        for (var m = k + 1; m < seq.length; m++) {
          if (initial[seq[m]] != BidiClass.nsm) break;
          t[m] = to;
        }
      }
    }
  }

  /// U+2329 and U+232A pair as their canonical equivalents U+3008 and
  /// U+3009 do.
  static int _canonicalBracket(int c) => switch (c) {
    0x2329 => 0x3008,
    0x232A => 0x3009,
    _ => c,
  };

  /// Rules I1 and I2.
  void _implicit() {
    for (var i = 0; i < length; i++) {
      if (_removed(initial[i])) continue;
      final l = _level(i), c = types[i];
      if (l.isEven) {
        if (c == BidiClass.r) {
          _set(i, l + 1);
        } else if (c == BidiClass.an || c == BidiClass.en) {
          _set(i, l + 2);
        }
      } else if (c == BidiClass.l || c == BidiClass.en || c == BidiClass.an) {
        _set(i, l + 1);
      }
    }
  }

  /// Rule L1, the line being the paragraph, and removed characters given
  /// the level before them.
  void _trailing() {
    var reset = true;
    for (var i = length - 1; i >= 0; i--) {
      final c = initial[i];
      if (c == BidiClass.b || c == BidiClass.s) {
        _set(i, level);
        reset = true;
      } else if (c == BidiClass.ws ||
          _isolateInitiator(c) ||
          c == BidiClass.pdi ||
          _removed(c)) {
        if (reset) _set(i, level);
      } else {
        reset = false;
      }
    }
    for (var i = 0; i < length; i++) {
      if (_removed(initial[i])) _set(i, i == 0 ? level : _level(i - 1));
    }
  }

  /// Rule L2, by runs of one level.
  List<BidiRun> visualRuns() {
    final runs = <BidiRun>[];
    var from = 0;
    for (var i = 1; i <= length; i++) {
      if (i < length && _level(i) == _level(from)) continue;
      runs.add(BidiRun(start + from, start + i, _level(from)));
      from = i;
    }
    if (runs.isEmpty) return runs;
    var highest = 0, lowestOdd = _maxDepth + 2;
    for (final r in runs) {
      highest = math.max(highest, r.level);
      if (r.level.isOdd) lowestOdd = math.min(lowestOdd, r.level);
    }
    for (var l = highest; l >= lowestOdd; l--) {
      for (var i = 0; i < runs.length; i++) {
        if (runs[i].level < l) continue;
        var j = i;
        while (j < runs.length && runs[j].level >= l) {
          j++;
        }
        final reversed = runs.sublist(i, j).reversed.toList();
        runs.setRange(i, j, reversed);
        i = j;
      }
    }
    return runs;
  }
}
