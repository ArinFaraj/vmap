import 'dart:convert';

import '../errors.dart';
import '../options.dart';
import '../platform.dart';
import '../net/net.dart';
import 'style.dart';

/// Loads [style] and hands [use] each document worth drawing, once [ready]
/// completes and while [current] answers true: one given as JSON at once;
/// one named by address first from the copy [network] kept from the last
/// run, then as downloaded when that differs, which is kept for the next.
/// [onError] is told of every failure. Returns the error that left nothing
/// to draw, or null.
Future<VmapError?> loadStyle(
  VmapStyle style,
  VmapNetworkOptions network, {
  required Future<void> ready,
  required bool Function() current,
  required void Function(Map<String, Object?> document) use,
  required void Function(VmapError error) onError,
}) async {
  final document = style.document;
  if (document != null) {
    await ready;
    if (current()) use(document);
    return null;
  }
  final url = style.url!;
  final directory = network.cacheDirectory;
  final file = directory == null
      ? null
      : '$directory/style-${cacheKey(url)}.json';
  String? remembered;
  try {
    if (file != null && fileExists(file)) {
      remembered = utf8.decode(await readFile(file));
      await ready;
      if (!current()) return null;
      use(jsonDecode(remembered) as Map<String, Object?>);
    }
  } catch (_) {
    remembered = null;
  }
  final client = Net(userAgent: network.userAgent);
  try {
    final reply = await client.get(
      url,
      network.headers,
      timeout: const Duration(seconds: 10),
    );
    if (reply.status != 200) throw HttpFailure(reply.status, url);
    final body = utf8.decode(reply.bytes);
    await ready;
    if (!current() || body == remembered) return null;
    use(jsonDecode(body) as Map<String, Object?>);
    if (file != null) await writeFile(file, reply.bytes);
    return null;
  } catch (e) {
    if (!current()) return null;
    final error = VmapError(VmapErrorKind.style, e, url: url);
    onError(error);
    return remembered == null ? error : null;
  } finally {
    client.close();
  }
}
