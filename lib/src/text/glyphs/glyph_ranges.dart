import 'dart:typed_data';

import '../../style/style_model.dart';
import '../../net/net.dart';
import 'glyph_pbf.dart';

/// The glyph ranges of a style's `glyphs` URL, fetched as labels need
/// them. Each font stack is a face from [GlyphPbf.firstFace] up.
class GlyphRanges {
  GlyphRanges(
    this.template, {
    required this.onLoaded,
    this.onError,
    this.fetch,
    this.userAgent = 'vmap',
    this.headers = const {},
  });

  /// Where ranges come from; fetched directly when null.
  final FetchBytes? fetch;

  /// The style's `glyphs`, with `{fontstack}` and `{range}` in it.
  final String template;
  final String userAgent;
  final Map<String, String> headers;

  /// Called with each range as it arrives.
  final void Function(int face, List<PbfGlyph> glyphs) onLoaded;

  /// Told of a range that could not be fetched. A range the server does not
  /// have (404) is not an error: its characters are left out, as MapLibre
  /// leaves them.
  final void Function(Object error)? onError;

  final List<String> _stacks = [];
  final Map<String, int> _faces = {};
  final List<Map<int, PbfGlyph>> _glyphs = [];
  final Set<int> _asked = {};
  final Set<int> _arrived = {};
  Net? _net;
  bool _closed = false;

  /// Ranges asked for and not yet answered.
  int get pending => _asked.length - _arrived.length;

  /// The face of the font stack [fonts].
  int face(List<String> fonts) {
    final name = fonts.join(',');
    return _faces.putIfAbsent(name, () {
      _stacks.add(name);
      _glyphs.add({});
      return GlyphPbf.firstFace + _stacks.length - 1;
    });
  }

  PbfGlyph? glyph(int face, int codePoint) =>
      _glyphs[face - GlyphPbf.firstFace][codePoint];

  /// Asks for the range of Latin letters, which nearly every label needs,
  /// in each font stack [sheet]'s text names, ahead of any tile.
  void prefetch(StyleSheet sheet) {
    for (final symbol in sheet.symbols) {
      if (symbol.fontStack.isNotEmpty) ready(face(symbol.fontStack), 'a');
    }
  }

  /// Whether every range [text] needs in [face] has been answered, asking
  /// for those that have not. A range that failed counts as answered: its
  /// characters are left out, as MapLibre leaves them.
  bool ready(int face, String text) {
    var all = true;
    for (final c in text.runes) {
      final key = face << 16 | c >> 8;
      if (_arrived.contains(key)) continue;
      all = false;
      if (_asked.add(key)) _fetch(face, c >> 8, key);
    }
    return all;
  }

  Future<void> _fetch(int face, int block, int key) async {
    final url = template
        .replaceAll(
          '{fontstack}',
          Uri.encodeComponent(_stacks[face - GlyphPbf.firstFace]),
        )
        .replaceAll('{range}', '${block * 256}-${block * 256 + 255}');
    var glyphs = const <PbfGlyph>[];
    try {
      final bytes = await (fetch ?? _fetchDirectly)(url);
      if (bytes != null) glyphs = GlyphPbf.parse(bytes);
    } catch (e) {
      if (!_closed) onError?.call(e);
    }
    if (_closed) return;
    final known = _glyphs[face - GlyphPbf.firstFace];
    for (final g in glyphs) {
      known[g.id] = g;
    }
    _arrived.add(key);
    onLoaded(face, glyphs);
  }

  Future<Uint8List?> _fetchDirectly(String url) async {
    final reply = await (_net ??= Net(userAgent: userAgent)).get(url, headers);
    if (reply.status == 200) return reply.bytes;
    if (reply.status == 404) return null;
    throw HttpFailure(reply.status, url);
  }

  void close() {
    _closed = true;
    _net?.close();
  }
}
