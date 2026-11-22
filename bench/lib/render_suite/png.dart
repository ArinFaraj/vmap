import 'dart:io';
import 'dart:typed_data';

/// [rgba] as a PNG file: eight bits a channel, alpha not multiplied in, the
/// way a render test's pixels are scored. Flutter's own encoder takes
/// multiplied pixels, and given these it brightens every soft edge.
Uint8List encodePng(Uint8List rgba, int width, int height) {
  final row = width * 4 + 1;
  final rows = Uint8List(row * height);
  for (var y = 0; y < height; y++) {
    rows.setRange(y * row + 1, (y + 1) * row, rgba, y * width * 4);
  }
  final header = ByteData(13)
    ..setUint32(0, width)
    ..setUint32(4, height)
    ..setUint8(8, 8)
    ..setUint8(9, 6);
  return (BytesBuilder()
        ..add(const [137, 80, 78, 71, 13, 10, 26, 10])
        ..add(_chunk('IHDR', header.buffer.asUint8List()))
        ..add(_chunk('IDAT', zlib.encode(rows)))
        ..add(_chunk('IEND', const [])))
      .takeBytes();
}

Uint8List _chunk(String type, List<int> data) {
  final chunk = ByteData(12 + data.length)..setUint32(0, data.length);
  final bytes = chunk.buffer.asUint8List()
    ..setRange(4, 8, type.codeUnits)
    ..setRange(8, 8 + data.length, data);
  chunk.setUint32(8 + data.length, _crc(bytes, 4, 8 + data.length));
  return bytes;
}

final Uint32List _crcTable = () {
  final table = Uint32List(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var bit = 0; bit < 8; bit++) {
      c = c.isOdd ? 0xEDB88320 ^ (c >> 1) : c >> 1;
    }
    table[n] = c;
  }
  return table;
}();

int _crc(Uint8List bytes, int from, int to) {
  var c = 0xFFFFFFFF;
  for (var i = from; i < to; i++) {
    c = _crcTable[(c ^ bytes[i]) & 0xFF] ^ (c >> 8);
  }
  return c ^ 0xFFFFFFFF;
}
