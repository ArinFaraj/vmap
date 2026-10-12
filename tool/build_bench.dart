import 'dart:convert';
import 'dart:io';

import 'package:vmap/src/style.dart';
import 'package:vmap/src/style_model.dart';
import 'package:vmap/src/tile_builder.dart';

/// Builds one tile with a style and prints what came out and how long it
/// took.
///     dart run tool/build_bench.dart tile.pbf zoom [style.json]
void main(List<String> args) {
  final bytes = File(args[0]).readAsBytesSync();
  final z = int.parse(args[1]);
  final document = args.length > 2
      ? jsonDecode(File(args[2]).readAsStringSync()) as Map<String, Object?>
      : VmapStyle.light.document!;
  final sheet = StyleSheet.compile(document);
  final builder = TileBuilder(sheet);
  late BuiltTile tile;
  for (var i = 0; i < 10; i++) {
    tile = builder.build(bytes, z);
  }
  final sw = Stopwatch()..start();
  for (var i = 0; i < 20; i++) {
    tile = builder.build(bytes, z);
  }
  var vertices = 0;
  var triangles = 0;
  for (final m in tile.meshes) {
    vertices += m.chunk.positions.length ~/ 2;
    triangles += m.chunk.indices.length ~/ 3;
  }
  stdout.writeln(
    'build ${(sw.elapsedMicroseconds / 20000).toStringAsFixed(2)} ms, '
    '${sheet.layers.length} layers in ${sheet.buckets.length} buckets, '
    '${sheet.symbols.length} text layers',
  );
  stdout.writeln(
    'meshes ${tile.meshes.length}, vertices $vertices, triangles $triangles, '
    'labels ${tile.labels.length}',
  );
  stdout.writeln(tile.labels.take(12).map((l) => l.text).join(' | '));
}
