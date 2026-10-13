import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_gpu/gpu.dart' as gpu;
import 'package:vector_math/vector_math.dart' show Vector4;

/// How much a Flutter GPU draw costs the UI thread: frames of [_counts]
/// draws each, a small triangle mesh with its own uniform per draw, timed
/// from command buffer to submit.
const _counts = [100, 300, 600, 1000];

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MaterialApp(home: _Bench()));
}

class _Bench extends StatefulWidget {
  const _Bench();

  @override
  State<_Bench> createState() => _BenchState();
}

class _BenchState extends State<_Bench> {
  final _times = <int, List<int>>{};
  int _frame = 0;
  gpu.RenderPipeline? _pipeline;
  gpu.UniformSlot? _slot;
  gpu.DeviceBuffer? _mesh;
  gpu.Texture? _target;
  gpu.HostBuffer? _host;
  final _info = Float32List(20);

  @override
  void initState() {
    super.initState();
    _setUp();
  }

  Future<void> _setUp() async {
    final library = await gpu.ShaderLibrary.fromAsset(
      'packages/vmap_gpu/build/shaderbundles/vmap_gpu.shaderbundle',
    );
    SchedulerBinding.instance.addPostFrameCallback((_) {
      final vertex = library!['BuildingVertex']!;
      _pipeline = gpu.gpuContext.createRenderPipeline(
        vertex,
        library['BuildingFragment']!,
        vertexLayout: const gpu.VertexLayout(
          buffers: [
            gpu.VertexBuffer(
              strideInBytes: 20,
              attributes: [
                gpu.VertexAttribute(
                  name: 'position',
                  format: gpu.VertexFormat.float32x3,
                ),
                gpu.VertexAttribute(
                  name: 'color_data',
                  format: gpu.VertexFormat.float32x2,
                  offsetInBytes: 12,
                ),
              ],
            ),
          ],
        ),
      );
      _slot = vertex.getUniformSlot('FrameInfo');
      final words = Float32List(5 * 300);
      for (var i = 0; i < words.length; i += 5) {
        words[i] = i * 2.0;
        words[i + 1] = i * 1.0;
        words[i + 2] = 10;
        words[i + 3] = 128 + 128 * 256 + 128 * 65536;
        words[i + 4] = 255;
      }
      _mesh = gpu.gpuContext.createDeviceBufferWithCopy(
        ByteData.sublistView(words),
      );
      _target = gpu.gpuContext.createTexture(
        gpu.StorageMode.devicePrivate,
        512,
        512,
        format: gpu.PixelFormat.r8g8b8a8UNormInt,
      );
      _host = gpu.gpuContext.createHostBuffer();
      _tick();
    });
  }

  void _tick() {
    SchedulerBinding.instance.scheduleFrameCallback((_) {
      final count = _counts[(_frame ~/ 120) % _counts.length];
      final watch = Stopwatch()..start();
      final commands = gpu.gpuContext.createCommandBuffer();
      final pass = commands.createRenderPass(
        gpu.RenderTarget.singleColor(
          gpu.ColorAttachment(texture: _target!, clearValue: Vector4.zero()),
        ),
      );
      pass.bindPipeline(_pipeline!);
      final host = _host!..reset();
      final view = gpu.BufferView(
        _mesh!,
        offsetInBytes: 0,
        lengthInBytes: 6000,
      );
      final bytes = ByteData.sublistView(_info);
      for (var i = 0; i < count; i++) {
        _info[0] = 0.001;
        _info[5] = 0.001;
        _info[15] = 1;
        _info[16] = 1;
        pass
          ..bindVertexBuffer(view)
          ..bindUniform(_slot!, host.emplace(bytes))
          ..draw(300);
      }
      commands.submit();
      (_times[count] ??= []).add(watch.elapsedMicroseconds);
      _frame++;
      if (_frame == 120 * _counts.length * 2) {
        for (final c in _counts) {
          final t = [..._times[c]!]..sort();
          debugPrint(
            'drawbench $c draws: p50 ${t[t.length ~/ 2]} us, '
            'p95 ${t[(t.length * 0.95).floor()]} us, '
            '${(t[t.length ~/ 2] / c).toStringAsFixed(2)} us a draw',
          );
        }
        debugPrint('drawbench: done');
        if (Platform.isMacOS) exit(0);
        return;
      }
      setState(() {});
      _tick();
    });
  }

  @override
  Widget build(BuildContext context) => Center(
    child: Text(
      'draw bench frame $_frame',
      textDirection: ui.TextDirection.ltr,
    ),
  );
}
