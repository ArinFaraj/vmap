/// A value for each code point of each face, held in pages of 256 code
/// points. A lookup allocates nothing, where a map keyed by an int boxes
/// its key on the web.
class GlyphTable<T extends Object> {
  final List<List<List<T?>?>?> _faces = [];

  T? at(int face, int codePoint) {
    if (face < 0 || face >= _faces.length || codePoint < 0) return null;
    final pages = _faces[face];
    final page = codePoint >> 8;
    if (pages == null || page >= pages.length) return null;
    return pages[page]?[codePoint & 0xFF];
  }

  void put(int face, int codePoint, T value) {
    if (face < 0 || codePoint < 0) return;
    while (_faces.length <= face) {
      _faces.add(null);
    }
    final pages = _faces[face] ??= [];
    final page = codePoint >> 8;
    while (pages.length <= page) {
      pages.add(null);
    }
    (pages[page] ??= List<T?>.filled(256, null))[codePoint & 0xFF] = value;
  }
}
