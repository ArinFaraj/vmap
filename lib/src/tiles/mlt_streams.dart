import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';

/// More values than this in one stream mark a corrupt tile, which would
/// otherwise ask for gigabytes.
const mltMaxValues = 1 << 24;

const mltPresent = 0;
const mltData = 1;
const mltOffset = 2;
const mltLength = 3;

const _delta = 1;
const _componentwiseDelta = 2;
const _rle = 3;
const _morton = 4;

const _fastPfor = 1;
const _varint = 2;

const mltDictionarySingle = 1;
const mltDictionaryShared = 2;
const mltDictionaryMorton = 4;
const mltDictionaryFsst = 5;

const mltLengthGeometries = 1;
const mltLengthParts = 2;
const mltLengthRings = 3;
const mltLengthSymbol = 5;
const mltLengthDictionary = 6;

const mltOffsetVertex = 0;
const mltOffsetIndex = 1;

class MltStream {
  MltStream(MltCursor c) {
    final kind = c.bytes[c.pos++];
    physical = kind >> 4;
    sub = kind & 0xf;
    final encodings = c.bytes[c.pos++];
    logical1 = encodings >> 5;
    logical2 = (encodings >> 2) & 7;
    technique = encodings & 3;
    numValues = c.varint();
    byteLength = c.varint();
    count = numValues;
    if (logical1 == _morton) {
      numBits = c.varint();
      shift = c.varint();
    } else if ((logical1 == _rle || logical2 == _rle) && technique != 0) {
      runs = c.varint();
      count = c.varint();
    }
    if (numValues > mltMaxValues ||
        count > mltMaxValues ||
        byteLength > c.bytes.length - c.pos) {
      throw const FormatException('An MLT stream is larger than its tile');
    }
  }

  late final int physical;

  /// The dictionary, offset or length type, as [physical] has one.
  late final int sub;
  late final int logical1;
  late final int logical2;
  late final int technique;
  late final int numValues;
  late final int byteLength;

  /// The number of values once decoded.
  late int count;
  int? runs;
  int numBits = 0;
  int shift = 0;
}

/// Bits stored as ORC's byte run length encoding, one 0 or 1 for each of
/// the stream's values.
Uint8List mltBools(MltCursor c, MltStream m) {
  final n = m.numValues;
  final packed = Uint8List((n + 7) >> 3);
  final end = c.pos + m.byteLength;
  var i = 0;
  while (i < packed.length && c.pos < end) {
    final header = c.bytes[c.pos++];
    if (header <= 0x7f) {
      final value = c.bytes[c.pos++];
      final stop = math.min(i + header + 3, packed.length);
      packed.fillRange(i, stop, value);
      i = stop;
    } else {
      for (var k = 256 - header; k > 0 && i < packed.length; k--) {
        packed[i++] = c.bytes[c.pos++];
      }
    }
  }
  c.pos = end;
  final out = Uint8List(n);
  for (var j = 0; j < n; j++) {
    out[j] = (packed[j >> 3] >> (j & 7)) & 1;
  }
  return out;
}

/// The 32 bit integers of a stream, unpacked and with its logical
/// encoding undone.
List<int> mltInts(MltCursor c, MltStream m, {required bool signed}) {
  final start = c.pos;
  final Uint32List raw;
  switch (m.technique) {
    case _fastPfor:
      raw = _FastPfor.decode(c.bytes, start, m.byteLength, m.numValues);
    case _varint:
      raw = Uint32List(m.numValues);
      for (var i = 0; i < raw.length; i++) {
        raw[i] = c.varint();
      }
    default:
      final view = ByteData.sublistView(c.bytes, start, start + m.byteLength);
      raw = Uint32List(m.numValues);
      for (var i = 0; i < raw.length; i++) {
        raw[i] = view.getUint32(i * 4, Endian.little);
      }
  }
  c.pos = start + m.byteLength;
  final List<int> out = signed ? Int32List(m.count) : Uint32List(m.count);
  switch (m.logical1) {
    case _delta:
      final deltas = m.logical2 == _rle ? _expand(raw, m) : raw;
      var sum = 0;
      for (var i = 0; i < out.length && i < deltas.length; i++) {
        sum += _zigzag(deltas[i]);
        out[i] = sum;
      }
    case _rle:
      final values = _expand(raw, m);
      for (var i = 0; i < out.length && i < values.length; i++) {
        out[i] = signed ? _zigzag(values[i]) : values[i];
      }
    case _morton:
      var sum = 0;
      for (var i = 0; i < out.length && i < raw.length; i++) {
        sum += raw[i];
        out[i] = sum;
      }
    case _componentwiseDelta:
      var x = 0;
      var y = 0;
      for (var i = 0; i + 1 < out.length && i + 1 < raw.length; i += 2) {
        x += _zigzag(raw[i]);
        y += _zigzag(raw[i + 1]);
        out[i] = x;
        out[i + 1] = y;
      }
    default:
      for (var i = 0; i < out.length && i < raw.length; i++) {
        out[i] = signed ? _zigzag(raw[i]) : raw[i];
      }
  }
  return out;
}

/// The same for 64 bit integers, which are stored as varints or as plain
/// little endian words.
List<int> mltInts64(MltCursor c, MltStream m, {bool signed = false}) {
  final start = c.pos;
  final List<int> raw;
  if (m.technique == _varint) {
    raw = [for (var i = 0; i < m.numValues; i++) c.varint()];
  } else {
    final view = ByteData.sublistView(c.bytes, start, start + m.byteLength);
    raw = [
      for (var i = 0; i < m.numValues; i++)
        view.getUint32(i * 8 + 4, Endian.little) * 0x100000000 +
            view.getUint32(i * 8, Endian.little),
    ];
  }
  c.pos = start + m.byteLength;
  final out = List<int>.filled(m.count, 0);
  switch (m.logical1) {
    case _delta:
      final deltas = m.logical2 == _rle ? _expand(raw, m) : raw;
      var sum = 0;
      for (var i = 0; i < out.length && i < deltas.length; i++) {
        sum += _zigzag64(deltas[i]);
        out[i] = sum;
      }
    case _rle:
      final values = _expand(raw, m);
      for (var i = 0; i < out.length && i < values.length; i++) {
        out[i] = signed ? _zigzag64(values[i]) : values[i];
      }
    default:
      for (var i = 0; i < out.length && i < raw.length; i++) {
        out[i] = signed ? _zigzag64(raw[i]) : raw[i];
      }
  }
  return out;
}

/// Runs stored as their lengths, then their values.
List<int> _expand(List<int> raw, MltStream m) {
  final runs = m.runs ?? raw.length ~/ 2;
  final out = List<int>.filled(m.count, 0);
  var o = 0;
  for (var i = 0; i < runs && i + runs < raw.length; i++) {
    final end = math.min(o + raw[i], out.length);
    out.fillRange(o, end, raw[i + runs]);
    o = end;
  }
  return out;
}

/// Written without an exclusive or, which comes out unsigned in
/// JavaScript.
@pragma('vm:prefer-inline')
int _zigzag(int v) => (v & 1) == 0 ? v >>> 1 : -(v >>> 1) - 1;

int _zigzag64(int v) => v.isEven ? v ~/ 2 : -((v + 1) ~/ 2);

/// FastPFOR, as MLT stores it: big endian words holding pages of 256
/// value blocks bit packed at a width each, with wider outliers patched
/// in, and a variable byte tail.
abstract final class _FastPfor {
  static const _block = 256;
  static const _page = 65536;

  static Uint32List decode(Uint8List bytes, int start, int length, int count) {
    final words = Uint32List(length >> 2);
    for (var i = 0, b = start; i < words.length; i++, b += 4) {
      words[i] =
          bytes[b] << 24 |
          bytes[b + 1] << 16 |
          bytes[b + 2] << 8 |
          bytes[b + 3];
    }
    final out = Uint32List(count);
    var inPos = 0;
    var outPos = 0;
    if (words.isNotEmpty) {
      final aligned = words[inPos++];
      if (aligned % _block != 0 || aligned > count) {
        throw const FormatException('A FastPFOR stream is misaligned');
      }
      while (outPos < aligned) {
        final size = math.min(_page, aligned - outPos);
        inPos = _decodePage(words, out, inPos, outPos, size);
        outPos += size;
      }
    }
    var acc = 0;
    var shift = 0;
    var bit = 0;
    while (outPos < count && inPos < words.length) {
      final byte = (words[inPos] >>> bit) & 0xff;
      bit += 8;
      if (bit == 32) {
        bit = 0;
        inPos++;
      }
      acc |= (byte & 0x7f) << shift;
      if (byte & 0x80 != 0) {
        out[outPos++] = acc;
        acc = 0;
        shift = 0;
      } else {
        shift += 7;
      }
    }
    return out;
  }

  static int _decodePage(
    Uint32List w,
    Uint32List out,
    int pageStart,
    int outPos,
    int size,
  ) {
    final packedEnd = pageStart + w[pageStart];
    final byteSize = w[packedEnd];
    final metaStart = packedEnd + 1;
    final meta = Uint8List(byteSize);
    for (var k = 0; k < byteSize; k++) {
      meta[k] = (w[metaStart + (k >> 2)] >>> ((k & 3) * 8)) & 0xff;
    }
    var at = metaStart + ((byteSize + 3) >> 2);
    final bitmap = w[at++];
    final exceptions = List<Uint32List?>.filled(33, null);
    final taken = List<int>.filled(33, 0);
    for (var width = 2; width <= 32; width++) {
      if ((bitmap >>> (width - 1)) & 1 == 0) continue;
      final n = w[at++];
      final stream = Uint32List((n + 31) & ~31);
      var j = 0;
      for (; j < n; j += 32) {
        _unpack32(w, at, stream, j, width);
        at += width;
      }
      at -= ((j - n) * width) >> 5;
      exceptions[width] = stream;
    }
    var p = pageStart + 1;
    var m = 0;
    for (var block = 0; block < size ~/ _block; block++) {
      final width = meta[m++];
      final count = meta[m++];
      final o = outPos + block * _block;
      if (width == 32) {
        out.setRange(o, o + _block, w, p);
        p += _block;
      } else if (width > 0) {
        for (var g = 0; g < 8; g++) {
          _unpack32(w, p, out, o + g * 32, width);
          p += width;
        }
      }
      if (count == 0) continue;
      final extra = meta[m++] - width;
      if (extra == 1) {
        for (var k = 0; k < count; k++) {
          out[o + meta[m++]] |= 1 << width;
        }
      } else {
        final stream = exceptions[extra];
        if (stream == null) {
          throw const FormatException('A FastPFOR exception is missing');
        }
        for (var k = 0; k < count; k++) {
          out[o + meta[m++]] |= stream[taken[extra]++] << width;
        }
      }
    }
    return at;
  }

  static void _unpack32(
    Uint32List w,
    int inPos,
    Uint32List out,
    int outPos,
    int width,
  ) {
    final mask = width == 32 ? 0xffffffff : (1 << width) - 1;
    for (var i = 0; i < 32; i++) {
      final bit = i * width;
      final word = inPos + (bit >> 5);
      final offset = bit & 31;
      var v = w[word] >>> offset;
      if (offset + width > 32) v |= w[word + 1] << (32 - offset);
      out[outPos + i] = v & mask;
    }
  }
}

class MltCursor {
  MltCursor(this.bytes);

  final Uint8List bytes;
  int pos = 0;

  /// The first four bytes by shifting, the rest by multiplying: a shift
  /// keeps only 32 bits in JavaScript.
  int varint() {
    var result = 0;
    for (var shift = 0; shift < 28; shift += 7) {
      final b = bytes[pos++];
      result |= (b & 0x7f) << shift;
      if (b < 0x80) return result;
    }
    var scale = 0x10000000;
    for (var i = 4; i < 10; i++) {
      final b = bytes[pos++];
      result += (b & 0x7f) * scale;
      if (b < 0x80) return result;
      scale *= 128;
    }
    throw const FormatException('A varint runs over ten bytes');
  }

  String string() {
    final length = varint();
    if (length > bytes.length - pos) {
      throw const FormatException('A string runs past its tile');
    }
    final s = utf8.decode(
      Uint8List.sublistView(bytes, pos, pos + length),
      allowMalformed: true,
    );
    pos += length;
    return s;
  }
}
