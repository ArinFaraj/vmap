/// What passes between the tile pool and its workers. Each message crosses
/// as a list of plain values, which an isolate port and a browser worker
/// both carry, and is read back into one of the types here.
library;

import 'dart:typed_data';

import 'options.dart';
import 'tile_builder.dart' show BuiltTile;
import 'tile_id.dart';

/// What a worker is started with.
class WorkerSetup {
  const WorkerSetup({
    required this.template,
    required this.config,
    required this.style,
    required this.nameKeys,
    required this.zoomOffset,
    required this.source,
    this.fonts,
    this.families,
    this.gpu = false,
  });

  /// Whether workers also build each tile's stream for the GPU renderer.
  final bool gpu;

  /// The family of each of [fonts].
  final List<String>? families;

  factory WorkerSetup.fromWire(List<Object?> wire) => WorkerSetup(
    template: wire[0]! as String,
    config: VmapNetworkOptions(
      cacheDirectory: wire[1] as String?,
      userAgent: wire[2]! as String,
      headers: (wire[3]! as Map).cast<String, String>(),
    ),
    style: (wire[4]! as Map).cast<String, Object?>(),
    nameKeys: (wire[5] as List?)?.cast<String>(),
    zoomOffset: (wire[6]! as num).toDouble(),
    source: wire[7]! as int,
    fonts: wire.length > 8 ? (wire[8] as List?)?.cast<Uint8List>() : null,
    families: wire.length > 9 ? (wire[9] as List?)?.cast<String>() : null,
    gpu: wire.length > 10 && wire[10] == true,
  );

  /// The fonts labels are shaped with, or null to leave shaping to the page.
  final List<Uint8List>? fonts;

  /// The addresses of the tiles, `geojson` for data the style holds, or a
  /// `pmtiles://` archive.
  final String template;

  /// How the tiles are fetched and kept.
  final VmapNetworkOptions config;
  final Map<String, Object?> style;
  final List<String>? nameKeys;
  final double zoomOffset;

  /// Which of the style's sources the worker builds.
  final int source;

  List<Object?> toWire() => [
    template,
    config.cacheDirectory,
    config.userAgent,
    config.headers,
    style,
    nameKeys,
    zoomOffset,
    source,
    fonts,
    families,
    gpu,
  ];
}

/// What a worker is asked.
sealed class WorkerRequest {
  const WorkerRequest(this.job);

  static WorkerRequest fromWire(List<Object?> wire) {
    final job = wire[0]! as int;
    TileId tile() => TileId(wire[2]! as int, wire[3]! as int, wire[4]! as int);
    double number(int i) => (wire[i]! as num).toDouble();
    return switch (wire[1]) {
      'build' => BuildTile(
        job,
        tile().at(wire[6]! as int),
        maxZoom: wire[5]! as int,
      ),
      'find' => FindInTile(
        job,
        tile(),
        x: number(5),
        y: number(6),
        radius: number(7),
        styleZoom: number(8),
        box: wire[9] == null ? null : (number(9), number(10)),
      ),
      'cluster' => AskCluster(
        job,
        ClusterQuestion.values.byName(wire[2]! as String),
        clusterId: wire[3]! as int,
        limit: wire[4]! as int,
        offset: wire[5]! as int,
      ),
      'states' => UseStates(job, [
        for (final pair in wire[2]! as List)
          ((pair as List)[0], (pair[1]! as Map).cast<String, Object?>()),
      ]),
      final kind => throw ArgumentError('No worker request is called $kind'),
    };
  }

  /// Pairs the answer with the question.
  final int job;

  List<Object?> toWire();
}

/// Build a tile's meshes and labels.
final class BuildTile extends WorkerRequest {
  const BuildTile(super.job, this.tile, {required this.maxZoom});

  final TileId tile;

  /// The deepest zoom the source has tiles for.
  final int maxZoom;

  @override
  List<Object?> toWire() => [
    job,
    'build',
    tile.z,
    tile.x,
    tile.y,
    maxZoom,
    tile.over,
  ];
}

/// The state the app gave each feature, which buildings are built from.
/// A worker takes it in turn with its other requests and does not answer.
final class UseStates extends WorkerRequest {
  const UseStates(super.job, this.states);

  /// Each feature's id and its state. In pairs, not a map, so an id keeps
  /// its type through a browser worker.
  final List<(Object?, Map<String, Object?>)> states;

  @override
  List<Object?> toWire() => [
    job,
    'states',
    [
      for (final (id, state) in states) [id, state],
    ],
  ];
}

/// The features a style draws near a point of a tile, or touching a box
/// around it.
final class FindInTile extends WorkerRequest {
  const FindInTile(
    super.job,
    this.tile, {
    required this.x,
    required this.y,
    required this.radius,
    required this.styleZoom,
    this.box,
  });

  final TileId tile;

  /// In tile units.
  final double x;
  final double y;
  final double radius;
  final double styleZoom;

  /// Half the width and half the height of the box, in tile units, when
  /// the features touching it are wanted instead of those near the point.
  final (double, double)? box;

  @override
  List<Object?> toWire() => [
    job,
    'find',
    tile.z,
    tile.x,
    tile.y,
    x,
    y,
    radius,
    styleZoom,
    box?.$1,
    box?.$2,
  ];
}

enum ClusterQuestion { zoom, children, leaves }

/// Something about one cluster of a clustered GeoJSON source.
final class AskCluster extends WorkerRequest {
  const AskCluster(
    super.job,
    this.question, {
    required this.clusterId,
    this.limit = 0,
    this.offset = 0,
  });

  final ClusterQuestion question;
  final int clusterId;

  /// Which of a cluster's points, for [ClusterQuestion.leaves].
  final int limit;
  final int offset;

  @override
  List<Object?> toWire() => [
    job,
    'cluster',
    question.name,
    clusterId,
    limit,
    offset,
  ];
}

/// What a worker answers.
sealed class WorkerReply {
  const WorkerReply(this.job);

  static WorkerReply fromWire(List<Object?> wire) {
    final job = wire[0]! as int;
    final body = wire[2];
    return switch (wire[1]) {
      'built' => TileBuilt(job, BuiltTile.fromMessage(body! as List<Object?>)),
      'failed' => TileNotBuilt(job, body! as String),
      'found' => FeaturesFound(job, [
        for (final hit in body! as List) TileHit.fromWire(hit! as List),
      ]),
      'zoom' => ClusterZoom(job, body as int?),
      'members' => ClusterMembers(job, [
        for (final member in body! as List)
          if (member case [
            final num x,
            final num y,
            final Map<Object?, Object?> props,
          ])
            ClusterMember(x.toDouble(), y.toDouble(), props.cast()),
      ]),
      final kind => throw ArgumentError('No worker reply is called $kind'),
    };
  }

  final int job;

  List<Object?> toWire();
}

/// How building a tile ended.
sealed class TileOutcome extends WorkerReply {
  const TileOutcome(super.job);
}

final class TileBuilt extends TileOutcome {
  const TileBuilt(super.job, this.tile);

  final BuiltTile tile;

  @override
  List<Object?> toWire() => [job, 'built', tile.toMessage()];
}

final class TileNotBuilt extends TileOutcome {
  const TileNotBuilt(super.job, this.error);

  final String error;

  @override
  List<Object?> toWire() => [job, 'failed', error];
}

final class FeaturesFound extends WorkerReply {
  const FeaturesFound(super.job, this.hits);

  final List<TileHit> hits;

  @override
  List<Object?> toWire() => [
    job,
    'found',
    [for (final hit in hits) hit.toWire()],
  ];
}

/// The zoom a cluster comes apart at, or null when there is no such
/// cluster.
final class ClusterZoom extends WorkerReply {
  const ClusterZoom(super.job, this.zoom);

  final int? zoom;

  @override
  List<Object?> toWire() => [job, 'zoom', zoom];
}

final class ClusterMembers extends WorkerReply {
  const ClusterMembers(super.job, this.members);

  final List<ClusterMember> members;

  @override
  List<Object?> toWire() => [
    job,
    'members',
    [
      for (final m in members) [m.x, m.y, m.properties],
    ],
  ];
}

/// A point or a smaller cluster inside a cluster.
class ClusterMember {
  const ClusterMember(this.x, this.y, this.properties);

  /// As fractions of the world.
  final double x;
  final double y;
  final Map<String, Object?> properties;
}

/// A feature a lookup found in one tile.
class TileHit {
  const TileHit({
    required this.order,
    required this.sourceLayer,
    required this.geometryType,
    required this.layers,
    required this.properties,
  });

  factory TileHit.fromWire(List<Object?> wire) => TileHit(
    order: wire[0]! as int,
    sourceLayer: wire[1]! as String,
    geometryType: wire[2]! as String,
    layers: (wire[3]! as List).cast<String>(),
    properties: (wire[4]! as Map).cast<String, Object?>(),
  );

  /// The highest place among the style layers drawing it, for putting the
  /// hits of several tiles in order.
  final int order;
  final String sourceLayer;

  /// `Point`, `LineString` or `Polygon`.
  final String geometryType;

  /// The ids of the style layers that draw it, topmost first.
  final List<String> layers;

  /// Its tags, with its id under `$id` when it has one.
  final Map<String, Object?> properties;

  List<Object?> toWire() => [
    order,
    sourceLayer,
    geometryType,
    layers,
    properties,
  ];
}
