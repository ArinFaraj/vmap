import 'dart:typed_data';

/// Big-endian reads of the types font tables are made of.
extension FontBytes on ByteData {
  int u8(int at) => getUint8(at);
  int i8(int at) => getInt8(at);
  int u16(int at) => getUint16(at);
  int i16(int at) => getInt16(at);
  int u24(int at) => getUint16(at) << 8 | getUint8(at + 2);
  int u32(int at) => getUint32(at);
  int i32(int at) => getInt32(at);

  /// A 2.14 fixed point number.
  double f2dot14(int at) => getInt16(at) / 16384;

  /// A 16.16 fixed point number.
  double fixed(int at) => getInt32(at) / 65536;

  String tag(int at) => String.fromCharCodes([
    getUint8(at),
    getUint8(at + 1),
    getUint8(at + 2),
    getUint8(at + 3),
  ]);

  /// A tag as the number its four bytes make.
  int tagCode(int at) => getUint32(at);
}

/// [tag], four characters, as the number its bytes make.
int tagOf(String tag) =>
    tag.codeUnitAt(0) << 24 |
    tag.codeUnitAt(1) << 16 |
    tag.codeUnitAt(2) << 8 |
    tag.codeUnitAt(3);
