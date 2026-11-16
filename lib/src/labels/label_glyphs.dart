import '../net/net.dart' show FetchBytes;
import '../options.dart';
import '../text/glyphs/glyph_layout.dart';
import '../text/glyphs/glyph_pages.dart';
import '../text/glyphs/glyph_pbf.dart' show PbfGlyphs;
import '../text/glyphs/glyph_ranges.dart';

/// The glyphs labels are shaped and drawn from: vmap's own fonts with the
/// pages they are drawn in, and a style's glyph ranges.
class LabelGlyphs {
  /// Where glyph text is drawn from, once vmap's fonts are loaded.
  GlyphPages? get pages => _pages;
  GlyphPages? _pages;

  /// vmap's own fonts, once loaded: text they cover is shaped by vmap and
  /// drawn from [pages], the rest is drawn as before.
  GlyphFonts? get fonts => _pages?.fonts;

  /// The style's glyph ranges, which labels are laid out and drawn with
  /// instead of [fonts] when set.
  GlyphRanges? get ranges => _ranges;
  GlyphRanges? _ranges;
  String? _rangesUrl;

  /// What a renderer draws text from as distance fields: the fonts'
  /// fields, which look the faces of a range up in [ranges], or the ranges
  /// alone.
  PbfGlyphs? get fields => _pages?.fields ?? _ranges;

  /// Shapes and draws text with [fonts] from now on, where they cover it.
  void useFonts(GlyphFonts fonts) {
    _pages?.dispose();
    _pages = GlyphPages(fonts)..fields.ranges = _ranges;
  }

  /// Takes the glyph ranges at [url], a style's `glyphs`, fetched with
  /// [config], or none when it is null; [onArrived] runs as each range
  /// lands. False when [url] is the one already in use.
  bool useRanges(
    String? url,
    VmapNetworkOptions config,
    void Function() onArrived, {
    void Function(Object error)? onError,
    FetchBytes? fetch,
  }) {
    if (url == _rangesUrl) return false;
    _rangesUrl = url;
    _ranges?.close();
    final ranges = _ranges = url == null
        ? null
        : GlyphRanges(
            url,
            userAgent: config.userAgent,
            headers: config.headers,
            fetch: fetch,
            onLoaded: (face, glyphs) {
              _pages?.addPbf(face, glyphs);
              onArrived();
            },
            onError: onError,
          );
    _pages?.fields.ranges = ranges;
    return true;
  }

  /// Glyph ranges asked for and not here yet, which labels wait on.
  int get rangesPending => _ranges?.pending ?? 0;

  /// Glyphs drawn into pages in the last frame, and what that cost.
  int get rasterized => _pages?.lastRasterized ?? 0;
  int get rasterMicros => _pages?.lastRasterMicros ?? 0;
  int get pageCount => _pages?.pageCount ?? 0;

  void disposePages() {
    _pages?.dispose();
    _pages = null;
  }
}
