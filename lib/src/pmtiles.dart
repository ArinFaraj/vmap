import 'dart:io';
import 'dart:typed_data';

/// Reads tiles out of a PMTiles archive, version 3: one file holding a whole
/// tile set, read a slice at a time from a web server or from disk.
///
/// The address is `pmtiles://` followed by an `https://` address or a file
/// path, for example `pmtiles://https://example.org/world.pmtiles` or
/// `pmtiles:///data/world.pmtiles`.
class PmTiles {
  PmTiles(String address, {HttpClient? client})
    : _where = address.substring(scheme.length),
      _client = client,
      _ownsClient = client == null;

  static const String scheme = 'pmtiles://';

  static bool handles(String? address) =>
      address != null && address.startsWith(scheme);

  final String _where;
  HttpClient? _client;
  final bool _ownsClient;
  RandomAccessFile? _file;
  Future<_Header>? _header;
  final Map<int, List<_Entry>> _leaves = {};

  bool get _remote =>
      _where.startsWith('http://') || _where.startsWith('https://');

  /// The archive is a file on this device.
  bool get local => !_remote;

  /// The deepest zoom the archive has tiles for.
  Future<int> get maxZoom async => (await (_header ??= _open())).maxZoom;

  /// The bytes of tile [z]/[x]/[y] as the archive's tile format has them,
  /// uncompressed, or an empty list when the archive has no such tile.
  Future<Uint8List> tile(int z, int x, int y) async {
    final header = await (_header ??= _open());
    if (z < header.minZoom || z > header.maxZoom) return Uint8List(0);
    final id = tileId(z, x, y);
    var entries = header.root;
    for (var depth = 0; depth < 4; depth++) {
      final entry = _find(entries, id);
      if (entry == null) return Uint8List(0);
      if (entry.run > 0) {
        if (id >= entry.id + entry.run) return Uint8List(0);
        final bytes = await _read(header.tilesAt + entry.offset, entry.length);
        return _unpack(bytes, header.tilePacking);
      }
      entries = _leaves[entry.offset] ??= _directory(
        _unpack(
          await _read(header.leavesAt + entry.offset, entry.length),
          header.innerPacking,
        ),
      );
      if (_leaves.length > 48) _leaves.remove(_leaves.keys.first);
    }
    return Uint8List(0);
  }

  void close() {
    _file?.closeSync();
    _file = null;
    if (_ownsClient) _client?.close(force: true);
  }

  /// A tile's number in the archive: tiles of all shallower zooms first,
  /// then along a Hilbert curve through its own zoom.
  static int tileId(int z, int x, int y) {
    var id = 0;
    for (var i = 0; i < z; i++) {
      id += 1 << (2 * i);
    }
    var px = x, py = y;
    for (var s = z == 0 ? 0 : 1 << (z - 1); s > 0; s >>= 1) {
      final rx = px & s != 0 ? 1 : 0;
      final ry = py & s != 0 ? 1 : 0;
      id += s * s * ((3 * rx) ^ ry);
      if (ry == 0) {
        if (rx == 1) {
          px = s - 1 - px;
          py = s - 1 - py;
        }
        final t = px;
        px = py;
        py = t;
      }
    }
    return id;
  }

  static _Entry? _find(List<_Entry> entries, int id) {
    var lo = 0, hi = entries.length - 1;
    while (lo <= hi) {
      final mid = (lo + hi) >> 1;
      if (entries[mid].id <= id) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return hi < 0 ? null : entries[hi];
  }

  Future<_Header> _open() async {
    final head = await _read(0, 16384);
    if (head.length < 127 ||
        String.fromCharCodes(head.sublist(0, 7)) != 'PMTiles' ||
        head[7] != 3) {
      throw const FormatException('Not a PMTiles version 3 archive');
    }
    final data = ByteData.sublistView(head);
    int at(int offset) => data.getUint64(offset, Endian.little);
    final rootAt = at(8), rootLength = at(16);
    final innerPacking = head[97];
    final root = rootAt + rootLength <= head.length
        ? Uint8List.sublistView(head, rootAt, rootAt + rootLength)
        : await _read(rootAt, rootLength);
    return _Header(
      root: _directory(_unpack(root, innerPacking)),
      leavesAt: at(40),
      tilesAt: at(56),
      innerPacking: innerPacking,
      tilePacking: head[98],
      minZoom: head[100],
      maxZoom: head[101],
    );
  }

  static Uint8List _unpack(Uint8List bytes, int packing) => switch (packing) {
    0 || 1 => bytes,
    2 => Uint8List.fromList(gzip.decode(bytes)),
    _ => throw const FormatException(
      'The PMTiles archive is packed with brotli or zstd; only gzip is read',
    ),
  };

  /// Reads a directory: every entry's tile number, how many tiles in a row
  /// share its bytes, and where those bytes are. A run of zero points at a
  /// deeper directory instead of a tile.
  static List<_Entry> _directory(Uint8List bytes) {
    var p = 0;
    int varint() {
      var value = 0, shift = 0;
      while (true) {
        final b = bytes[p++];
        value |= (b & 0x7f) << shift;
        if (b < 0x80) return value;
        shift += 7;
      }
    }

    final n = varint();
    final ids = List<int>.filled(n, 0);
    final runs = List<int>.filled(n, 0);
    final lengths = List<int>.filled(n, 0);
    var id = 0;
    for (var i = 0; i < n; i++) {
      ids[i] = id += varint();
    }
    for (var i = 0; i < n; i++) {
      runs[i] = varint();
    }
    for (var i = 0; i < n; i++) {
      lengths[i] = varint();
    }
    final out = <_Entry>[];
    var next = 0;
    for (var i = 0; i < n; i++) {
      final raw = varint();
      final offset = raw == 0 && i > 0 ? next : raw - 1;
      next = offset + lengths[i];
      out.add(_Entry(ids[i], runs[i], offset, lengths[i]));
    }
    return out;
  }

  Future<Uint8List> _read(int offset, int length) async {
    if (!_remote) {
      final file = _file ??= await File(_where).open();
      await file.setPosition(offset);
      return file.read(length);
    }
    final request = await (_client ??= HttpClient()).getUrl(Uri.parse(_where));
    request.headers
      ..set('range', 'bytes=$offset-${offset + length - 1}')
      ..set('accept-encoding', 'identity');
    final response = await request.close().timeout(const Duration(seconds: 20));
    if (response.statusCode != 206 && response.statusCode != 200) {
      await response.drain<void>();
      throw HttpException(
        'HTTP ${response.statusCode}',
        uri: Uri.parse(_where),
      );
    }
    final builder = BytesBuilder(copy: false);
    await response.forEach(builder.add).timeout(const Duration(seconds: 30));
    final bytes = builder.takeBytes();
    // A server that ignores the range sends the whole file.
    return response.statusCode == 200 && bytes.length > length
        ? Uint8List.sublistView(
            bytes,
            offset,
            (offset + length).clamp(0, bytes.length),
          )
        : bytes;
  }
}

class _Header {
  _Header({
    required this.root,
    required this.leavesAt,
    required this.tilesAt,
    required this.innerPacking,
    required this.tilePacking,
    required this.minZoom,
    required this.maxZoom,
  });

  final List<_Entry> root;
  final int leavesAt;
  final int tilesAt;
  final int innerPacking;
  final int tilePacking;
  final int minZoom;
  final int maxZoom;
}

class _Entry {
  _Entry(this.id, this.run, this.offset, this.length);

  final int id;
  final int run;
  final int offset;
  final int length;
}
