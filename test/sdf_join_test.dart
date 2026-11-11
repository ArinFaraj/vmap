@Tags(['gpu'])
library;

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

/// A letter of a joining script: a bar of ink [_inkWidth] glyph pixels
/// long from [_left], its pen moving on by [_advance], so the bars of
/// neighbours overlap where they join, as Arabic letters' do.
const _joining = 0xFE8E, _apart = 0x6C;
const _inkWidth = 10, _inkHeight = 6, _left = -1, _advance = 8;
const _barTop = 14;

/// A glyph of a script that does not join: the same bar with room after it.
const _apartAdvance = _inkWidth + 2;

const _face = GlyphPbf.firstFace;

/// Where the first glyph's pen starts, in logical pixels.
const _penX = 20.0, _baseline = 40.0;

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
      field[y * w + x] = (192 - (outside + inside) * 32).round().clamp(0, 255);
    }
  }
  return field;
}

class _Bars implements PbfGlyphs {
  _Bars() {
    final field = _barField();
    for (final (id, advance) in [
      (_joining, _advance),
      (_apart, _apartAdvance),
    ]) {
      _byCode[id] = PbfGlyph(
        id,
        field,
        _inkWidth,
        _inkHeight,
        _left,
        _barTop,
        advance,
      );
    }
  }

  final _byCode = <int, PbfGlyph>{};

  @override
  PbfGlyph? glyph(int face, int codePoint) => _byCode[codePoint];
}

/// A row of bars drawn by [SdfTextGpu], read back pixel by pixel.
class _Drawn {
  _Drawn(this._pixels, this._width, this._scale, this._dpr);

  final ByteData _pixels;
  final int _width;
  final double _scale, _dpr;

  /// The device pixel column [glyphPixels] along the line from the first
  /// pen origin.
  double x(num glyphPixels) => (_penX + glyphPixels * _scale) * _dpr;

  /// The device pixel row through the middle of the bars.
  int get midRow =>
      ((_baseline - (_barTop - _inkHeight / 2) * _scale) * _dpr).round();

  int red(int x) => _pixels.getUint8((midRow * _width + x) * 4);
  int alpha(int x) => _pixels.getUint8((midRow * _width + x) * 4 + 3);
}

void main() {
  final hasGpu = () {
    try {
      gpu.gpuContext;
      return true;
    } catch (_) {
      return false;
    }
  }();
  final skip = hasGpu ? false : 'needs Flutter GPU: run tool/gpu_tests.sh';

  late SdfTextGpu text;
  final glyphs = _Bars();

  setUpAll(() async {
    if (!hasGpu) return;
    const bundle = 'build/shaderbundles/vmap_gpu.shaderbundle';
    final library = await gpu.loadShaderLibraryAsync(bundle);
    if (library == null) throw StateError('no shader bundle at $bundle');
    text = SdfTextGpu(
      GpuDevice(GpuPipelines(library), GpuHeap(), fail: (e) => throw e),
      library,
    );
  });

  /// [count] glyphs [codePoint] in a row, black with a white halo
  /// [haloWidth] wide, [textSize] logical pixels to the em, at [dpr].
  Future<_Drawn> draw(
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
    text.begin(const ui.Size(width, height), dpr, glyphs, view);
    final look = SdfLook(
      SdfLook.rgba(0xFF000000, 1),
      SdfLook.rgba(0xFFFFFFFF, 1),
      haloWidth,
      0,
      scale,
    );
    for (var i = 0; i < count; i++) {
      final pen = _penX + i * advance * scale;
      text.glyph(_face, codePoint, pen, _baseline, scale, 0, 0, scale, look, 0);
    }
    final recorder = ui.PictureRecorder();
    text.end(ui.Canvas(recorder)..scale(dpr));
    final w = (width * dpr).round();
    final image = await recorder.endRecording().toImage(
      w,
      (height * dpr).round(),
    );
    return _Drawn((await image.toByteData())!, w, scale, dpr);
  }

  for (final dpr in [1.0, 2.0, 3.0]) {
    for (final size in [10.0, 14.0, 22.0]) {
      test(
        'joined letters are one stroke of ink at ${size}px, dpr $dpr',
        skip: skip,
        () async {
          const count = 6;
          final drawn = await draw(
            _joining,
            _advance,
            textSize: size,
            dpr: dpr,
          );
          final inset = (2 * dpr).ceil();
          final from = drawn.x(_left).ceil() + inset;
          final to =
              drawn.x((count - 1) * _advance + _left + _inkWidth).floor() -
              inset;
          var lightest = 0;
          for (var x = from; x <= to; x++) {
            lightest = math.max(lightest, drawn.red(x));
            expect(drawn.alpha(x), greaterThan(250));
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
      final drawn = await draw(
        _apart,
        _apartAdvance,
        textSize: 22,
        dpr: dpr,
        haloWidth: 1.5,
        count: 2,
      );
      final gap = drawn.x(_left + _inkWidth + 1).round();
      expect(drawn.red(gap), greaterThan(200));
      expect(drawn.alpha(gap), greaterThan(200));
      expect(drawn.red((drawn.x(_left) + 3 * dpr).round()), lessThan(16));
    }
  });
}
