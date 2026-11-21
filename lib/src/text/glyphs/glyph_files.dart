import 'dart:typed_data';

import '../../net/net.dart';
import '../../platform.dart';
import 'glyph_pbf.dart';

/// The glyph ranges of a style's `glyphs` address in the cache directory,
/// so the next start writes its labels at once, and without a network. A
/// font's range stays what it is at its address, so one kept here is not
/// asked for again.
class GlyphFiles implements KeptFetches {
  GlyphFiles(this.directory, this.template)
    : _range = RegExp(
        '^${RegExp.escape(template).replaceFirst(RegExp.escape('{fontstack}'), '([^/?#]+)').replaceFirst(RegExp.escape('{range}'), r'(\d+-\d+)')}\$',
      );

  final String directory;

  /// The style's `glyphs`, with `{fontstack}` and `{range}` in it.
  final String template;
  final RegExp _range;

  static final _unsafe = RegExp('[^A-Za-z0-9._%-]');

  /// Where the range at [url] is kept, or null when [url] is no range of
  /// [template].
  String? fileOf(String url) {
    final match = _range.firstMatch(url);
    if (match == null) return null;
    final stack = match[1]!;
    final safe = stack.replaceAll(_unsafe, '_');
    final name = safe.length <= 100 && !safe.startsWith('.')
        ? safe
        : cacheKey(stack);
    return '$directory/glyphs-${cacheKey(template)}/$name/${match[2]}.pbf';
  }

  @override
  Future<Uint8List?> read(String url) async {
    final file = fileOf(url);
    if (file == null || !fileExists(file)) return null;
    try {
      final bytes = await readFile(file);
      if (_readable(bytes)) return bytes;
    } on Exception catch (_) {}
    await deleteFile(file);
    return null;
  }

  @override
  void keep(String url, Uint8List bytes) {
    final file = fileOf(url);
    if (file == null || !_readable(bytes)) return;
    writeFile(file, bytes).then<void>((_) {}, onError: (_) {});
  }

  static bool _readable(Uint8List bytes) {
    try {
      return GlyphPbf.parse(bytes).isNotEmpty;
    } on FormatException {
      return false;
    } on RangeError {
      return false;
    }
  }
}
