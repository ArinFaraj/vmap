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
      _ideal[source].length < 255;

  /// Each tile writes its number over its square, and draws only where its
  /// number is: a tile's data runs a little past its square, and a
  /// translucent fill drawn twice there shows a seam. A tile standing in
  /// for a missing one draws where no number is. Tilted, a square is no
  /// rectangle on the screen, so scissors cannot do it. Sources tile the
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
    void cover(List<TileDraw> tiles, bool clear) {
      for (final (i, d) in tiles.indexed) {
        if (_device.drawn(d) == null) continue;
        _device.blocks.times(_clip, d.size / tileExtent, 1, d.left, d.top, 1);
        renderPass
          ..setStencilReference(clear ? 0 : i + 1)
          ..bindUniform(
            _device.pipelines.stencilFrame!,
            _device.host.emplace(_device.blocks.frameBytes),
          )
          ..draw(6);
      }
    }

    if (_marked >= 0) cover(_ideal[_marked], true);
    cover(_ideal[source], false);
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
      if (clipped && want == null) {
        _stencilEquals(0);
        for (final d in _fallback[source]) {
          _drawFlat(d, run);
        }
      } else if (clipped) {
        _stencilEquals(0);
        for (var at = run.first; at < run.end; at++) {
          if (drawnWhole(_sheet.layers[at]) != want) continue;
          for (final d in _fallback[source]) {
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
      final slotEnd = s + 5 < segments.length
          ? segments[s + 5]
          : stream.slots.length;
      final written = _device.paints.fill(
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
      renderPass.bindUniform(
        _device.pipelines.flatSlots,
        host.emplace(written, room: _device.paints.slotBytes.lengthInBytes),
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
  void drawBuildings(ExtrusionLayer layer) {
    bool built(List<TileDraw> tiles) =>
        tiles.any((d) => d.tile.extrusions.isNotEmpty);
    for (var source = 0; source < _ideal.length; source++) {
      final standIn = built(_fallback[source]) && _clips(source);
      if (!built(_ideal[source]) && !standIn) continue;
      if (standIn) _mark(source);
      renderPass
        ..clearBindings()
        ..bindPipeline(_device.pipelines.buildings)
        // As MapLibre, walls facing away are not drawn, so they do not show
        // through a pattern's clear parts.
        ..setCullMode(gpu.CullMode.backFace)
        ..setWindingOrder(gpu.WindingOrder.clockwise)
        ..setColorBlendEnable(true)
        ..setStencilConfig(gpu.StencilConfig())
        ..setDepthWriteEnable(true)
        ..setDepthCompareOperation(gpu.CompareFunction.lessEqual);
      _device.sprites.bindBuildings(
        renderPass,
        _device.pipelines,
        _device.host,
      );
      _drawBuildingsOf(layer, _ideal[source]);
      if (standIn) {
        _stencilEquals(0);
        _drawBuildingsOf(layer, _fallback[source]);
      }
    }
    renderPass.setCullMode(gpu.CullMode.none);
  }

  void _drawBuildingsOf(ExtrusionLayer layer, List<TileDraw> tiles) {
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
        final fade = _device.reveal.opacity(d.tile, layer, b);
        _device.blocks.times(
          _clip,
          d.size / tileExtent,
          perMetre,
          d.left + mx,
          d.top + my,
          fade,
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
