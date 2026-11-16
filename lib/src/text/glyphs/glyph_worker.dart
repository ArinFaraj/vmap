import 'dart:async';
import 'dart:typed_data';

import '../../platform.dart';
import 'glyph_layout.dart';
import 'glyph_pbf.dart';
import 'glyph_raster.dart';

/// A page of glyphs drawn by a [GlyphRasterWorker]: [raster] is ready for
/// [imageFromRaster], and [cells] says where each glyph is in it.
typedef DrawnGlyphs = ({
  int width,
  int height,
  Object raster,
  Float64List cells,
});

/// A [GlyphRasterizer] in a worker of its own, so glyphs never cost a
/// frame: an isolate, or in a browser, the worker vmap ships, or failing
/// that the page's own thread, a batch at a time.
class GlyphRasterWorker {
  GlyphRasterWorker(GlyphFonts fonts) {
    startWorker(
      glyphWorkerMain,
      [
        glyphWorkerTag,
        [for (final b in fonts.faceBytes) pack(b)],
        fonts.familyNames,
      ],
      _reply,
      script: workerScript,
      debugName: 'vmap glyphs',
    ).then((worker) {
      if (_disposed) return worker.close();
      _worker = worker;
      for (final m in _queued) {
        worker.send(m);
      }
      _queued.clear();
    }, onError: (Object _) => _fail());
  }

  /// What the first message to a worker that draws glyphs starts with.
  static const glyphWorkerTag = 'vmap glyphs';

  /// The worker could not start: every batch waiting and asked for later
  /// fails, so no page waits forever.
  void _fail() {
    _dead = true;
    for (final c in _waiting.values) {
      c.completeError(StateError('vmap glyphs: the worker did not start'));
    }
    _waiting.clear();
  }

  bool _dead = false;
  final Map<int, Completer<List<Object?>>> _waiting = {};
  final List<List<Object?>> _queued = [];
  Worker? _worker;
  int _next = 0;
  bool _disposed = false;

  /// The worker's answer to the request [make] makes of the number it is
  /// given, which the answer starts with.
  Future<List<Object?>> _ask(_Request Function(int id) make) {
    if (_dead) {
      return Future.error(StateError('vmap glyphs: the worker did not start'));
    }
    final id = _next++;
    final done = _waiting[id] = Completer<List<Object?>>();
    _send(make(id));
    return done.future;
  }

  Future<DrawnGlyphs> draw(PageKey key, List<int> ids) async =>
      _Draw.answer(await _ask((id) => _Draw(id, key, Int32List.fromList(ids))));

  /// The distance fields of [glyphs] of [face] at [weight], one each.
  Future<List<PbfGlyph>> fields(
    int face,
    int weight,
    bool italic,
    List<int> glyphs,
  ) async => _Fields.answer(
    await _ask(
      (id) => _Fields(id, face, weight, italic, Int32List.fromList(glyphs)),
    ),
  );

  void forget(PageKey key) => _send(_Forget(key));

  /// Hands the rasterizer the glyphs of a style glyph range for [face].
  void addPbf(int face, List<PbfGlyph> glyphs) => _send(_AddPbf(face, glyphs));

  void _send(_Request request) {
    if (_disposed) return;
    final worker = _worker;
    if (worker == null) {
      _queued.add(request.wire);
    } else {
      worker.send(request.wire);
    }
  }

  void _reply(Object? message) {
    final m = message! as List<Object?>;
    _waiting.remove(m[0]! as int)?.complete(m);
  }

  void dispose() {
    _disposed = true;
    _worker?.close();
    _waiting.clear();
  }
}

/// What a worker drawing glyphs runs: [GlyphRasterWorker]'s other half.
Future<void> glyphWorkerMain(
  List<Object?> init,
  void Function(Object? message) send,
  Stream<Object?> inbox,
) async {
  final rasterizer = GlyphRasterizer(
    GlyphFonts([
      for (final f in init[1]! as List) unpackBytes(f!),
    ], families: (init[2] as List?)?.cast<String>()),
  );
  await for (final message in inbox) {
    switch (_Request.of(message! as List<Object?>)) {
      case _Forget(:final key):
        rasterizer.forget(key);
      case _AddPbf(:final face, :final glyphs):
        final known = rasterizer.ranges[face] ??= {};
        for (final g in glyphs) {
          known[g.id] = g;
        }
      case _Fields(
        :final id,
        :final face,
        :final weight,
        :final italic,
        :final glyphs,
      ):
        send(
          _Fields.reply(id, rasterizer.fields(face, weight, italic, glyphs)),
        );
      case _Draw(:final id, :final key, :final ids):
        final r = _drawSafely(rasterizer, key, ids);
        send(
          _Draw.reply(id, r, await rasterForPage(r.pixels, r.width, r.height)),
        );
      case null:
    }
  }
}

/// [ids] drawn by [rasterizer], or an empty raster when a glyph cannot be.
GlyphRaster _drawSafely(
  GlyphRasterizer rasterizer,
  PageKey key,
  List<int> ids,
) {
  try {
    return rasterizer.draw(key, ids);
  } catch (_) {
    return GlyphRaster(1, 1, Uint8List(4), Float64List(0));
  }
}

/// What a [GlyphRasterWorker] asks of its worker. A request crosses as
/// [wire], a list of plain values with its kind first, which its own
/// `fromWire` reads back; one that is answered carries the number its answer starts with,
/// and says how the answer crosses too.
sealed class _Request {
  const _Request();

  List<Object?> get wire;

  /// The request [wire] holds, or null for a kind no worker knows.
  static _Request? of(List<Object?> wire) => switch (wire[0]) {
    _Draw.kind => _Draw.fromWire(wire),
    _Fields.kind => _Fields.fromWire(wire),
    _Forget.kind => _Forget.fromWire(wire),
    _AddPbf.kind => _AddPbf.fromWire(wire),
    _ => null,
  };
}

/// Draws the glyphs [ids] into a page of the look [key].
final class _Draw extends _Request {
  const _Draw(this.id, this.key, this.ids);

  _Draw.fromWire(List<Object?> wire)
    : id = wire[1]! as int,
      key = _keyOf(wire, 2),
      ids = wire[2 + _keyLength]! as List<int>;

  static const kind = 'd';

  final int id;
  final PageKey key;
  final List<int> ids;

  @override
  List<Object?> get wire => [kind, id, ..._keyWire(key), ids];

  static List<Object?> reply(int id, GlyphRaster drawn, Object raster) => [
    id,
    drawn.width,
    drawn.height,
    raster,
    drawn.cells,
  ];

  static DrawnGlyphs answer(List<Object?> reply) => (
    width: reply[1]! as int,
    height: reply[2]! as int,
    raster: reply[3]!,
    cells: reply[4]! as Float64List,
  );
}

/// Makes the distance fields of [glyphs] of font [face] at a look.
final class _Fields extends _Request {
  const _Fields(this.id, this.face, this.weight, this.italic, this.glyphs);

  _Fields.fromWire(List<Object?> wire)
    : id = wire[1]! as int,
      face = wire[2]! as int,
      weight = wire[3]! as int,
      italic = wire[4] == 1,
      glyphs = wire[5]! as List<int>;

  static const kind = 's';

  final int id, face, weight;
  final bool italic;
  final List<int> glyphs;

  @override
  List<Object?> get wire => [kind, id, face, weight, italic ? 1 : 0, glyphs];

  static List<Object?> reply(int id, List<PbfGlyph> fields) => [
    id,
    _glyphsWire(fields),
  ];

  static List<PbfGlyph> answer(List<Object?> reply) =>
      _glyphsOf(reply[1]! as List);
}

/// Lets go of the page of the look [key].
final class _Forget extends _Request {
  const _Forget(this.key);

  _Forget.fromWire(List<Object?> wire) : key = _keyOf(wire, 1);

  static const kind = 'f';

  final PageKey key;

  @override
  List<Object?> get wire => [kind, ..._keyWire(key)];
}

/// Hands over the glyphs of a style glyph range for [face].
final class _AddPbf extends _Request {
  const _AddPbf(this.face, this.glyphs);

  _AddPbf.fromWire(List<Object?> wire)
    : face = wire[1]! as int,
      glyphs = _glyphsOf(wire[2]! as List);

  static const kind = 'p';

  final int face;
  final List<PbfGlyph> glyphs;

  @override
  List<Object?> get wire => [kind, face, _glyphsWire(glyphs)];
}

List<Object?> _glyphsWire(List<PbfGlyph> glyphs) => [
  for (final g in glyphs)
    [g.id, g.bitmap, g.width, g.height, g.left, g.top, g.advance],
];

List<PbfGlyph> _glyphsOf(List<Object?> wire) => [
  for (final g in wire.cast<List<Object?>>())
    PbfGlyph(
      g[0]! as int,
      g[1]! as Uint8List,
      g[2]! as int,
      g[3]! as int,
      g[4]! as int,
      g[5]! as int,
      g[6]! as int,
    ),
];

const _keyLength = 7;

List<Object?> _keyWire(PageKey key) => [
  key.size,
  key.weight,
  key.italic ? 1 : 0,
  key.halo,
  key.blur,
  key.sixteenths,
  key.phase,
];

PageKey _keyOf(List<Object?> wire, int at) => (
  size: wire[at]! as int,
  weight: wire[at + 1]! as int,
  italic: wire[at + 2] == 1,
  halo: wire[at + 3]! as int,
  blur: wire[at + 4]! as int,
  sixteenths: wire[at + 5]! as int,
  phase: wire[at + 6]! as int,
);
