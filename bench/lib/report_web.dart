import 'dart:js_interop';

import 'package:web/web.dart' as web;

/// Sends [body] to [url], for a browser whose console cannot be read.
void report(String url, String body) {
  web.window.fetch(url.toJS, web.RequestInit(method: 'POST', body: body.toJS));
}
