import 'package:vmap/src/gpu/gpu_buffers.dart';
import 'package:vmap/src/gpu/gpu_device.dart';
import 'package:vmap/src/gpu/gpu_pipelines.dart';
import 'package:vmap/src/gpu/gpu_shim/gpu.dart' as gpu;

/// Whether Flutter GPU is there, as it is under `tool/gpu_tests.sh`.
final bool hasGpu = () {
  try {
    gpu.gpuContext;
    return true;
  } catch (_) {
    return false;
  }
}();

/// What a test that draws on the GPU passes as its `skip`.
final Object gpuSkip = hasGpu
    ? false
    : 'needs Flutter GPU: run tool/gpu_tests.sh';

/// The shaders `tool/gpu_tests.sh` builds, and a device that draws with
/// them and counts its frames in [heap].
Future<(gpu.ShaderLibrary, GpuDevice)> gpuDevice([GpuHeap? heap]) async {
  const bundle = 'build/shaderbundles/vmap_gpu.shaderbundle';
  final library = await gpu.loadShaderLibraryAsync(bundle);
  if (library == null) throw StateError('no shader bundle at $bundle');
  return (
    library,
    GpuDevice(GpuPipelines(library), heap ?? GpuHeap(), fail: (e) => throw e),
  );
}
