import 'dart:math' as math;
import 'dart:typed_data';

import '../camera/globe.dart';
import '../terrain/terrain.dart' show perMetreAt;
import '../camera/view.dart';
import '../render/map_renderer.dart';
import '../render/pattern_growth.dart';
import '../style/expr.dart';
import '../style/style_model.dart';
import '../tiles/built_tile.dart';
import '../tiles/tiles.dart';
import 'gpu_buffers.dart';
import 'gpu_device.dart';
import 'gpu_shim/gpu.dart' as gpu;

/// One frame's render pass: the style's runs in order, then the buildings.
class MapPass {
  /// Draws [frame] through [clip] into [renderPass]: [frame]'s tiles, or
  /// [fallback] and [ideal] in their place.
  MapPass(
    this._device,
    this.renderPass,
    this._frame,
    this._clip, {
    List<List<TileDraw>>? fallback,
    List<List<TileDraw>>? ideal,
  }) : _fallback = fallback ?? _frame.fallback,
       _ideal = ideal ?? _frame.ideal;

  final GpuDevice _device;
  final gpu.RenderPass renderPass;
  final RenderFrame _frame;
  final Float64List _clip;

  MapView get _view => _frame.view;
  StyleSheet get _sheet => _frame.sheet;
  EvalContext get _context => _frame.context;
  double get _styleZoom => _frame.styleZoom;

  /// A heatmap's ramp row and opacity, as heat.frag takes them.
  static final Float32List _heatValues = Float32List(4);
  static final ByteData _heatBytes = ByteData.sublistView(_heatValues);

  /// Per source, the tiles standing in for missing ones and the tiles
  /// wanted, both indexed by the style's sources.
  final List<List<TileDraw>> _fallback, _ideal;

  /// The globe the tiles are laid on, or null on the flat map and in the
  /// drape's slots.
  Globe? globe;

  /// The source whose tiles' numbers are in the stencil, or -1.
  int _marked = -1;

  /// Draws add up, as a heatmap's density does.
  bool adding = false;

  /// Circles and heatmap points stand on the raised ground, depth tested
  /// against it, as MapLibre draws them over terrain instead of into the
  /// texture laid on it.
  bool raise = false;

  /// With true only the layers that stand on raised ground are drawn,
  /// circles and heatmaps; with false every layer but those.
  bool? standing;

  late final double _perMetre = perMetreAt(_view);

  bool _clips(int source) =>
      !adding &&
      globe == null &&
      _device.pipelines.stencil != null &&
      _ideal[source].length < _drawnBit - 1;

  /// The stencil number of stand-in [index] of [source]'s, after its ideal
  /// tiles' own; 0, where no ideal tile is, when there are too many tiles
  /// for the stand-ins to have numbers of their own.
  int _standInMark(int source, int index) {
    final ideal = _ideal[source].length;
    return ideal + _fallback[source].length < _drawnBit - 1
        ? ideal + 1 + index
        : 0;
  }

  /// Each tile writes its number over its square, and draws only where its
  /// number is: a tile's data runs a little past its square, and a
  /// translucent fill drawn twice there shows a seam. A tile standing in
  /// for missing ones writes its number over their squares alone, so a
  /// coarse one's water does not show through the gaps of the finer ones
  /// beside it, nor its buildings stand inside theirs. Tilted, a square is
  /// no rectangle on the screen, so scissors cannot do it. Sources tile the
  /// map apart, so the numbers are rewritten when the source changes.
  void _mark(int source) {
    if (source == _marked) return;
    renderPass
      ..clearBindings()
      ..bindPipeline(_device.pipelines.stencil!)
      ..setCullMode(gpu.CullMode.none)
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(overBlend)
      ..setStencilConfig(
        gpu.StencilConfig(
          depthStencilPassOperation: gpu.StencilOperation.setToReferenceValue,
        ),
      )
      ..bindVertexBuffer(
        gpu.BufferView(
          _device.pipelines.quad!,
          offsetInBytes: 0,
          lengthInBytes: 48,
        ),
      );
    void square(double left, double top, double size, int reference) {
      _device.blocks.times(_clip, size / tileExtent, 1, left, top, 1);
      renderPass
        ..setStencilReference(reference)
        ..bindUniform(
          _device.pipelines.stencilFrame!,
          _device.host.emplace(_device.blocks.frameBytes),
        )
        ..draw(6);
    }

    void cover(int source, bool clear) {
      for (final (i, d) in _ideal[source].indexed) {
        if (_device.drawn(d) == null) continue;
        square(d.left, d.top, d.size, clear ? 0 : i + 1);
      }
      for (final (j, d) in _fallback[source].indexed) {
        final mark = _standInMark(source, j);
        if (mark == 0 || _device.drawn(d) == null) continue;
        final reference = clear ? 0 : mark;
        if (d.clips case final clips?) {
          for (final c in clips) {
            square(c.left, c.top, c.width, reference);
          }
        } else {
          square(d.left, d.top, d.size, reference);
        }
      }
    }

    if (_marked >= 0) cover(_marked, true);
    cover(source, false);
    _marked = source;
    renderPass.clearBindings();
  }

  void _stencilEquals(int reference) => renderPass
    ..setStencilReference(reference)
    ..setStencilConfig(
      gpu.StencilConfig(compareFunction: gpu.CompareFunction.equal),
    );

  /// Lays [image], drawn whole, over the whole screen at [opacity].
  void composite(gpu.Texture image, double opacity) {
    final p = _device.pipelines;
    _heatValues[0] = opacity;
    final nearest = gpu.SamplerOptions(
      minFilter: gpu.MinMagFilter.nearest,
      magFilter: gpu.MinMagFilter.nearest,
      widthAddressMode: gpu.SamplerAddressMode.clampToEdge,
      heightAddressMode: gpu.SamplerAddressMode.clampToEdge,
    );
    renderPass
      ..clearBindings()
      ..bindPipeline(p.composite!)
      ..setCullMode(gpu.CullMode.none)
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..setStencilConfig(gpu.StencilConfig())
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(overBlend)
      ..bindVertexBuffer(
        gpu.BufferView(p.screen!, offsetInBytes: 0, lengthInBytes: 48),
      )
      ..bindUniform(p.compositeInfo!, _device.host.emplace(_heatBytes))
      ..bindTexture(p.compositeLayer!, image, sampler: nearest)
      ..draw(6)
      ..clearBindings();
    _marked = -1;
  }

  /// Colours a heatmap's [density] through row [row] of the ramps, as
  /// opaque as [opacity], over the whole screen.
  void colorHeat(gpu.Texture density, double row, double opacity) {
    final ramp = _device.ramps.texture;
    if (ramp == null) return;
    _heatValues
      ..[0] = row
      ..[1] = opacity;
    final linear = gpu.SamplerOptions(
      minFilter: gpu.MinMagFilter.linear,
      magFilter: gpu.MinMagFilter.linear,
      widthAddressMode: gpu.SamplerAddressMode.clampToEdge,
      heightAddressMode: gpu.SamplerAddressMode.clampToEdge,
    );
    renderPass
      ..clearBindings()
      ..bindPipeline(_device.pipelines.heat!)
      ..setCullMode(gpu.CullMode.none)
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..setStencilConfig(gpu.StencilConfig())
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(overBlend)
      ..bindVertexBuffer(
        gpu.BufferView(
          _device.pipelines.screen!,
          offsetInBytes: 0,
          lengthInBytes: 48,
        ),
      )
      ..bindUniform(
        _device.pipelines.heatInfo!,
        _device.host.emplace(_heatBytes),
      )
      ..bindTexture(_device.pipelines.heatDensity!, density, sampler: linear)
      ..bindTexture(_device.pipelines.heatRamp!, ramp, sampler: linear)
      ..draw(6)
      ..clearBindings();
    _marked = -1;
  }

  /// Draws the paint layers of [runs] into this pass.
  void drawRuns(Iterable<StyleRun> runs) {
    var bound = false;
    for (final run in runs) {
      if (run.source < 0 || run.source >= _ideal.length) continue;
      final source = run.source;
      final clipped = _clips(source);
      if (clipped && _marked != source) {
        _mark(source);
        bound = false;
      }
      if (!bound) {
        renderPass
          ..clearBindings()
          ..bindPipeline(_device.pipelines.flat)
          ..setDepthWriteEnable(false)
          ..setDepthCompareOperation(
            raise && !adding
                ? gpu.CompareFunction.lessEqual
                : gpu.CompareFunction.always,
          )
          ..setCullMode(gpu.CullMode.none)
          ..setColorBlendEnable(true)
          ..setColorBlendEquation(adding ? addBlend : overBlend);
        _device.sprites.bind(renderPass, _device.pipelines, _device.host);
        bound = true;
      }
      // As MapLibre, a circle is kept by the one tile its centre is in and
      // drawn whole, past that tile's square.
      bool drawnWhole(PaintLayer layer) =>
          layer is CircleLayer || layer is HeatmapLayer;
      final want = standing;
      // Unclipped, as on the globe, stand-ins are drawn whole under the
      // tiles that are ready, which draw over them. Heat adds up instead,
      // so a ready tile a stand-in already covers is left out.
      final fallback = _fallback[source];
      bool underStandIn(TileDraw d) => fallback.any(
        (f) =>
            f.left <= d.left + 0.5 &&
            f.top <= d.top + 0.5 &&
            f.left + f.size >= d.left + d.size - 0.5 &&
            f.top + f.size >= d.top + d.size - 0.5,
      );
      if (want == null) {
        for (final (j, d) in fallback.indexed) {
          if (clipped) _stencilEquals(_standInMark(source, j));
          _drawFlat(d, run);
        }
      } else {
        for (var at = run.first; at < run.end; at++) {
          if (drawnWhole(_sheet.layers[at]) != want) continue;
          for (final (j, d) in fallback.indexed) {
            if (clipped) _stencilEquals(_standInMark(source, j));
            _drawFlat(d, StyleRun.vector(source, at, at + 1));
          }
        }
      }
      var at = run.first;
      while (at < run.end) {
        final whole = drawnWhole(_sheet.layers[at]);
        final skip =
            (!adding && _sheet.layers[at] is HeatmapLayer) ||
            (want != null && whole != want);
        var end = at + 1;
        while (end < run.end && drawnWhole(_sheet.layers[end]) == whole) {
          end++;
        }
        final part = StyleRun.vector(source, at, end);
        if (whole) renderPass.setStencilConfig(gpu.StencilConfig());
        for (final (i, d) in _ideal[source].indexed) {
          if (skip) break;
          if (adding && fallback.isNotEmpty && underStandIn(d)) continue;
          if (clipped && !whole) _stencilEquals(i + 1);
          _drawFlat(d, part);
        }
        at = end;
      }
      renderPass.setStencilConfig(gpu.StencilConfig());
    }
  }

  /// Draws [run]'s layers of tile [d].
  void _drawFlat(TileDraw d, StyleRun run) {
    final data = _device.drawn(d);
    final stream = data?.stream;
    if (data == null || stream == null) return;
    final from = stream.layerFirst[run.first];
    final to = stream.layerFirst[run.end];
    if (from == to) return;
    final host = _device.host;
    final scale = d.size / tileExtent;
    _device.blocks.times(_clip, scale, raise ? _perMetre : 1, d.left, d.top, 1);
    _device.heights.bind(
      renderPass,
      _device.pipelines,
      _device.host,
      raise ? _frame.terrain : null,
      d.tile.id,
      flat: true,
    );
    renderPass
      ..bindVertexBuffer(
        gpu.BufferView(
          data.buffer!,
          offsetInBytes: data.vertexOffset,
          lengthInBytes: stream.vertices.lengthInBytes,
        ),
      )
      ..bindUniform(
        _device.pipelines.flatFrame,
        host.emplace(
          _device.blocks.mapFor(
            globe,
            d.tile.id,
            _styleZoom.floor(),
            dashMix: _frame.dashFade.mix,
            rampRows: _device.ramps.rowCount,
          ),
        ),
      );
    final segments = stream.segments;
    void bindSlots(int s) {
      final paints = _device.paints;
      renderPass.bindUniform(
        _device.pipelines.flatSlots,
        paints.written(data, s, scale, () {
          final slotEnd = s + 5 < segments.length
              ? segments[s + 5]
              : stream.slots.length;
          final written = paints.fill(
            _sheet,
            d,
            data,
            segments[s + 2],
            slotEnd,
            scale,
            _context,
            _styleZoom,
            _view.bearing,
          );
          return host.emplace(written, room: paints.slotBytes.lengthInBytes);
        }),
      );
    }

    void drawIndices(int first, int count) => renderPass
      ..bindIndexBuffer(
        gpu.BufferView(
          data.indexBuffer!,
          offsetInBytes: data.indexOffset + first * 4,
          lengthInBytes: count * 4,
        ),
        gpu.IndexType.int32,
      )
      ..drawIndexed(count);

    void drawRange(int from, int to) {
      for (var s = 0; s < segments.length; s += 3) {
        final first = math.max(segments[s], from);
        final count = math.min(segments[s] + segments[s + 1], to) - first;
        if (count <= 0) continue;
        bindSlots(s);
        drawIndices(first, count);
      }
    }

    // As MapLibre, a fill's outline is drawn after the fill and before the
    // next layer: lines through the fill's own vertices.
    final outlines = stream.outlines;
    var done = from;
    for (var o = 0; o < outlines.length; o += 4) {
      final layer = outlines[o];
      if (layer < run.first || layer >= run.end) continue;
      final end = stream.layerFirst[layer + 1];
      if (end > done) {
        drawRange(done, end);
        done = end;
      }
      final frame = _device.blocks.mapFor(
        globe,
        d.tile.id,
        _styleZoom.floor(),
        dashMix: _frame.dashFade.mix,
        rampRows: _device.ramps.rowCount,
      );
      _device.blocks.map[60] = 1;
      bindSlots(outlines[o + 1] * 3);
      renderPass
        ..bindUniform(_device.pipelines.flatFrame, host.emplace(frame))
        ..setPrimitiveType(gpu.PrimitiveType.line);
      drawIndices(outlines[o + 2], outlines[o + 3]);
      _device.blocks.map[60] = 0;
      renderPass
        ..setPrimitiveType(gpu.PrimitiveType.triangle)
        ..bindUniform(
          _device.pipelines.flatFrame,
          host.emplace(_device.blocks.mapBytes),
        );
    }
    if (to > done) drawRange(done, to);
  }

  /// Buildings after the flat layers, with depth. The flat layers leave an
  /// index buffer bound, cleared first, or these draws would read their
  /// vertices through it.
  /// Draws building layer [layer], standing, depth tested.
  /// Draws [layer]'s buildings at [opacity]. Below 1 they are drawn as
  /// MapLibre draws them, in this pass: their depth alone first, then their
  /// colour where it is the nearest, each pixel once, so the walls behind
  /// do not show through those in front.
  void drawBuildings(ExtrusionLayer layer, {double opacity = 1}) {
    if (opacity >= 1) {
      _drawBuildings(layer, _Walls.whole, 1);
    } else {
      _drawBuildings(layer, _Walls.depth, 1);
      _drawBuildings(layer, _Walls.colour, opacity);
      _clearStencil();
    }
    renderPass.setCullMode(gpu.CullMode.none);
  }

  void _drawBuildings(ExtrusionLayer layer, _Walls walls, double opacity) {
    bool built(List<TileDraw> tiles) =>
        tiles.any((d) => d.tile.extrusions.isNotEmpty);
    bool meet(TileDraw a, TileDraw b) =>
        a.left < b.left + b.size - 0.5 &&
        b.left < a.left + a.size - 0.5 &&
        a.top < b.top + b.size - 0.5 &&
        b.top < a.top + a.size - 0.5;
    for (var source = 0; source < _ideal.length; source++) {
      final ideal = _ideal[source], fallback = _fallback[source];
      // A stand-in no other tile overlaps, as the four under a missing
      // tile, has no building another tile draws too, so its buildings are
      // drawn whole: cut to its square they would lose what stands over
      // the tiles beside it.
      final alone = <TileDraw>[], shared = <TileDraw>[];
      final sharedMarks = <int>[];
      for (final (j, f) in fallback.indexed) {
        final overlaps =
            ideal.any((d) => meet(d, f)) ||
            fallback.any((o) => !identical(o, f) && meet(o, f));
        if (overlaps) {
          shared.add(f);
          sharedMarks.add(_standInMark(source, j));
        } else {
          alone.add(f);
        }
      }
      final standIn = built(shared) && _clips(source);
      if (!built(ideal) && !built(alone) && !standIn) continue;
      if (standIn) _mark(source);
      renderPass
        ..clearBindings()
        ..bindPipeline(_device.pipelines.buildings)
        // As MapLibre, walls facing away are not drawn, so they do not show
        // through a pattern's clear parts.
        ..setCullMode(gpu.CullMode.backFace)
        ..setWindingOrder(gpu.WindingOrder.clockwise)
        ..setColorBlendEnable(true)
        ..setDepthWriteEnable(walls != _Walls.colour)
        ..setDepthCompareOperation(gpu.CompareFunction.lessEqual);
      switch (walls) {
        case _Walls.whole:
          renderPass.setStencilConfig(gpu.StencilConfig());
        case _Walls.depth:
          renderPass
            ..setColorBlendEquation(_keepColour)
            ..setStencilConfig(gpu.StencilConfig());
        case _Walls.colour:
          renderPass
            ..setColorBlendEquation(overBlend)
            ..setStencilReference(_drawn)
            ..setStencilConfig(
              gpu.StencilConfig(
                compareFunction: gpu.CompareFunction.notEqual,
                depthStencilPassOperation:
                    gpu.StencilOperation.setToReferenceValue,
              ),
            );
      }
      _device.sprites.bindBuildings(
        renderPass,
        _device.pipelines,
        _device.host,
      );
      _drawBuildingsOf(layer, ideal, opacity);
      _drawBuildingsOf(layer, alone, opacity);
      if (standIn) {
        for (final (k, f) in shared.indexed) {
          final mark = sharedMarks[k];
          if (walls == _Walls.colour) {
            // Only over the squares it stands in for, where nothing is
            // coloured yet; coloured, its number gains [_drawnBit].
            renderPass
              ..setStencilReference(mark)
              ..setStencilConfig(
                gpu.StencilConfig(
                  compareFunction: gpu.CompareFunction.equal,
                  depthStencilPassOperation: gpu.StencilOperation.invert,
                  writeMask: _drawnBit,
                ),
              );
          } else {
            _stencilEquals(mark);
          }
          _drawBuildingsOf(layer, [f], opacity);
        }
      }
    }
  }

  /// The stencil value of a pixel translucent buildings have coloured.
  static const _drawn = 0xFF;

  /// The bit a stand-in's translucent buildings set where they coloured,
  /// above every tile's number.
  static const _drawnBit = 0x80;

  /// Leaves the colour as it is, for drawing depth alone.
  static final _keepColour = gpu.ColorBlendEquation(
    sourceColorBlendFactor: gpu.BlendFactor.zero,
    destinationColorBlendFactor: gpu.BlendFactor.one,
    sourceAlphaBlendFactor: gpu.BlendFactor.zero,
    destinationAlphaBlendFactor: gpu.BlendFactor.one,
  );

  /// Clip space from a tile's square, stretched over the whole screen.
  static final _wholeScreen = () {
    const k = 2 / tileExtent;
    final m = Float32List(16);
    m[0] = k;
    m[5] = k;
    m[10] = 1;
    m[12] = -1;
    m[13] = -1;
    m[15] = 1;
    return ByteData.sublistView(m);
  }();

  /// Zeroes the stencil over the whole screen, so tiles mark it again.
  void _clearStencil() {
    final stencil = _device.pipelines.stencil;
    if (stencil == null) return;
    renderPass
      ..clearBindings()
      ..bindPipeline(stencil)
      ..setCullMode(gpu.CullMode.none)
      ..setDepthWriteEnable(false)
      ..setDepthCompareOperation(gpu.CompareFunction.always)
      ..setColorBlendEnable(true)
      ..setColorBlendEquation(_keepColour)
      ..setStencilReference(0)
      ..setStencilConfig(
        gpu.StencilConfig(
          depthStencilPassOperation: gpu.StencilOperation.setToReferenceValue,
        ),
      )
      ..bindVertexBuffer(
        gpu.BufferView(
          _device.pipelines.quad!,
          offsetInBytes: 0,
          lengthInBytes: 48,
        ),
      )
      ..bindUniform(
        _device.pipelines.stencilFrame!,
        _device.host.emplace(_wholeScreen),
      )
      ..draw(6)
      ..clearBindings();
    _marked = -1;
  }

  void _drawBuildingsOf(
    ExtrusionLayer layer,
    List<TileDraw> tiles,
    double opacity,
  ) {
    final view = _view;
    final perMetre = perMetreAt(view);
    final host = _device.host;
    final (mx, my) = layer.moved(_context, view.bearing);
    for (final d in tiles) {
      final data = _device.drawn(d);
      if (data == null) continue;
      if (data.buildings.every((b) => b.extrusion.bucket != layer.bucket)) {
        continue;
      }
      _device.heights.bind(
        renderPass,
        _device.pipelines,
        _device.host,
        _frame.terrain,
        d.tile.id,
      );
      renderPass.bindUniform(
        _device.pipelines.buildingGlobe,
        host.emplace(
          _device.blocks.buildingGlobe(
            view.globe,
            d.tile.id,
            mx / d.size * tileExtent,
            my / d.size * tileExtent,
          ),
        ),
      );
      for (final b in data.buildings) {
        if (b.extrusion.bucket != layer.bucket) continue;
        _device.blocks.times(
          _clip,
          d.size / tileExtent,
          perMetre,
          d.left + mx,
          d.top + my,
          opacity,
        );
        renderPass
          ..bindVertexBuffer(
            gpu.BufferView(
              data.buffer!,
              offsetInBytes: b.offset,
              lengthInBytes: b.vertexCount * BuildingGpu.stride,
            ),
          )
          ..bindUniform(
            _device.pipelines.buildingFrame,
            host.emplace(_device.blocks.frameBytes),
          )
          ..bindUniform(
            _device.pipelines.buildingPatterns,
            host.emplace(
              _device.sprites.patternsOf(
                b.extrusion,
                d.size / tileExtent,
                patternGrowth(_styleZoom),
                d.tile.id,
                _styleZoom.floor(),
              ),
            ),
          )
          ..bindIndexBuffer(
            gpu.BufferView(
              data.indexBuffer!,
              offsetInBytes: b.indexOffset,
              lengthInBytes: b.indexCount * 4,
            ),
            gpu.IndexType.int32,
          )
          ..drawIndexed(b.indexCount);
      }
    }
  }
}

/// What a building draw writes: everything, depth alone, or colour alone
/// where the depth already drawn is its own.
enum _Walls { whole, depth, colour }
