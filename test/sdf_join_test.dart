import 'dart:async';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/camera/view.dart';
import 'package:vmap/src/gpu/gpu_buffers.dart';
import 'package:vmap/src/gpu/gpu_device.dart';
import 'package:vmap/src/gpu/gpu_pipelines.dart';
import 'package:vmap/src/gpu/gpu_shim/gpu.dart' as gpu;
import 'package:vmap/src/gpu/sdf_text_gpu.dart';
import 'package:vmap/src/labels/sdf_text.dart';
import 'package:vmap/src/text/glyphs/glyph_pbf.dart';
import 'package:vmap/src/text/glyphs/glyph_ranges.dart';

// Needs Flutter GPU, so it is skipped by a plain `flutter test`:
//     flutter test --enable-impeller --enable-flutter-gpu test/sdf_join_test.dart

/// A letter of a joining script: a bar of ink [inkWidth] glyph pixels long
/// from [left], its pen moving on by [advance], so the bars of neighbours
/// overlap where they join, as Arabic letters' do.
const _joining = 0xFE8E, _apart = 0x6C;
const _inkWidth = 10, _inkHeight = 6, _left = -1, _advance = 8;
const _barTop = 14;

/// A glyph of a script that does not join: the same bar with room after it.
const _apartAdvance = _inkWidth + 2;

Uint8List _barField() {
  const b = GlyphPbf.border;
  const w = _inkWidth + 2 * b, h = _inkHeight + 2 * b;
  final field = Uint8List(w * h);
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      final px = x + 0.5 - b, py = y + 0.5 - b;
      final dx = math.max(-px, px - _inkWidth);
      final dy = math.max(-py, py - _inkHeight);
      final outside = math.sqrt(
        math.pow(math.max(dx, 0), 2) + math.pow(math.max(dy, 0), 2),
      );
      final inside = math.min(math.max(dx, dy), 0);
      final distance = outside + inside;
      field[y * w + x] = (192 - distance * 32).round().clamp(0, 255);
    }
  }
  return field;
}

List<int> _varint(int v) {
  final out = <int>[];
  while (v >= 0x80) {
    out.add(v & 0x7f | 0x80);
    v >>= 7;
  }
  return out..add(v);
}

List<int> _field(int number, List<int> bytes) => [
  ..._varint(number << 3 | 2),
  ..._varint(bytes.length),
  ...bytes,
];

List<int> _number(int number, int v) => [
  ..._varint(number << 3),
  ..._varint(v),
];

List<int> _glyph(int id, Uint8List field, int advance) => [
  ..._number(1, id),
  ..._field(2, field),
  ..._number(3, _inkWidth),
  ..._number(4, _inkHeight),
  ..._number(5, _left * -2 - 1),
  ..._number(6, _barTop * 2),
  ..._number(7, advance),
];

Uint8List _range() {
  final field = _barField();
  return Uint8List.fromList(
    _field(1, [
      ..._field(1, 'Test'.codeUnits),
      ..._field(3, _glyph(_joining, field, _advance)),
      ..._field(3, _glyph(_apart, field, _apartAdvance)),
    ]),
  );
}

Future<gpu.ShaderLibrary?> _shaders() async {
  for (final key in [
    'build/shaderbundles/vmap_gpu.shaderbundle',
    'packages/vmap/build/shaderbundles/vmap_gpu.shaderbundle',
  ]) {
    try {
      final library = await gpu.loadShaderLibraryAsync(key);
      if (library != null) return library;
    } catch (_) {}
  }
  return null;
}

bool _hasGpu() {
  try {
    gpu.gpuContext;
    return true;
  } catch (_) {
    return false;
  }
}

void main() {
  final skip = _hasGpu()
      ? false
      : 'needs --enable-impeller --enable-flutter-gpu';

  late SdfTextGpu text;
  late GlyphRanges ranges;
  late int face;

  setUpAll(() async {
    if (skip != false) return;
    final library = (await _shaders())!;
    text = SdfTextGpu(
      GpuDevice(GpuPipelines(library), GpuHeap(), fail: (e) => throw e),
      library,
    );
    final loaded = Completer<void>();
    ranges = GlyphRanges(
      'test/{fontstack}/{range}.pbf',
      fetch: (_) async => _range(),
      onLoaded: (_, _) {
        if (!loaded.isCompleted) loaded.complete();
      },
    );
    face = ranges.face(['Test']);
    ranges.ready(face, 'l');
    await loaded.future;
  });

  /// [count] glyphs [codePoint] in a row, black with a white halo
  /// [haloWidth] wide, [textSize] logical pixels to the em, drawn at
  /// [dpr]; returns the image and the bar's span in device pixels.
  Future<(ByteData, int, int, int, int, int)> draw(
    int codePoint,
    int advance, {
    required double textSize,
    required double dpr,
    double haloWidth = 1,
    int count = 6,
  }) async {
    final scale = textSize / GlyphPbf.em;
    const width = 240.0, height = 60.0;
    final view = MapView(
      centerX: 0.5,
      centerY: 0.5,
      zoom: 3,
      width: width,
      height: height,
    );
    text.begin(const ui.Size(width, height), dpr, ranges, view);
    final look = SdfLook(
      SdfLook.rgba(0xFF000000, 1),
      SdfLook.rgba(0xFFFFFFFF, 1),
      haloWidth,
      0,
      scale,
    );
    const x0 = 20.0, baseline = 40.0;
    for (var i = 0; i < count; i++) {
      text.glyph(
        face,
        codePoint,
        x0 + i * advance * scale,
        baseline,
        scale,
        0,
        0,
        scale,
        look,
        0,
      );
    }
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder)..scale(dpr);
    text.end(canvas);
    final w = (width * dpr).round(), h = (height * dpr).round();
    final image = await recorder.endRecording().toImage(w, h);
    final bytes = (await image.toByteData())!;
    final left = ((x0 + _left * scale) * dpr).ceil();
    final right =
        ((x0 + ((count - 1) * advance + _left + _inkWidth) * scale) * dpr)
            .floor();
    final mid = ((baseline - (_barTop - _inkHeight / 2) * scale) * dpr).round();
    return (bytes, w, h, left, right, mid);
  }

  int at(ByteData bytes, int w, int x, int y, int channel) =>
      bytes.getUint8((y * w + x) * 4 + channel);

  for (final dpr in [1.0, 2.0, 3.0]) {
    for (final size in [10.0, 14.0, 22.0]) {
      test(
        'joined letters are one stroke of ink at ${size}px, dpr $dpr',
        skip: skip,
        () async {
          final (bytes, w, _, left, right, mid) = await draw(
            _joining,
            _advance,
            textSize: size,
            dpr: dpr,
          );
          final inset = (2 * dpr).ceil();
          var lightest = 0;
          for (var x = left + inset; x <= right - inset; x++) {
            lightest = math.max(lightest, at(bytes, w, x, mid, 0));
            expect(at(bytes, w, x, mid, 3), greaterThan(250));
          }
          expect(
            lightest,
            lessThan(16),
            reason: 'the halo shows through the ink where letters join',
          );
        },
      );
    }
  }

  test('letters apart keep their halo between them', skip: skip, () async {
    for (final dpr in [1.0, 2.0]) {
      final (bytes, w, _, left, _, mid) = await draw(
        _apart,
        _apartAdvance,
        textSize: 22,
        dpr: dpr,
        haloWidth: 1.5,
        count: 2,
      );
      const scale = 22 / GlyphPbf.em;
      final gap = ((20 + (_left + _inkWidth + 1) * scale) * dpr).round();
      expect(at(bytes, w, gap, mid, 0), greaterThan(200));
      expect(at(bytes, w, gap, mid, 3), greaterThan(200));
      final ink = left + (3 * dpr).round();
      expect(at(bytes, w, ink, mid, 0), lessThan(16));
    }
  });
}
