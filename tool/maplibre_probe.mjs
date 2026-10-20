// Opens one MapLibre GL JS render test in a headless browser, waits until
// the map is idle and prints what a JavaScript expression evaluates to with
// the map as `map`, as JSON: ground truth for comparing vmap's internals
// with MapLibre's.
//
//     node tool/maplibre_probe.mjs <maplibre-gl-js checkout> <test id> <expression>
//
// The checkout needs `npm ci` and `npm run build-dev` run in it. For
// example, the terrain's height under the centre:
//
//     node tool/maplibre_probe.mjs ~/projects/maplibre-gl-js terrain/default \
//       'map._camera.transform.elevation'
//
// A test id may also be a path to a style.json elsewhere. PNG=<file> also
// writes what MapLibre drew there.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';

const [checkout, id, expression] = process.argv.slice(2);
if (!checkout || !id || !expression) {
  console.error('usage: node tool/maplibre_probe.mjs <checkout> <test id> <expression>');
  process.exit(2);
}
const root = path.resolve(checkout);
const require = createRequire(path.join(root, 'package.json'));
const puppeteer = require('puppeteer');

const suite = path.join(root, 'test/integration');
const style = JSON.parse(
  fs.readFileSync(
    id.endsWith('.json') ? id : path.join(suite, 'render/tests', id, 'style.json'),
    'utf8',
  ),
);
const test = style.metadata?.test ?? {};

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.pbf': 'application/x-protobuf',
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (url.includes('/sparse204/1-')) {
    res.writeHead(204);
    res.end('');
    return;
  }
  const file = url.startsWith('/dist/')
    ? path.join(root, url)
    : path.join(suite, 'assets', url);
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end('');
      return;
    }
    res.writeHead(200, {
      'Content-Type': types[path.extname(file)] ?? 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

const local = (url) =>
  typeof url === 'string' ? url.replace(/^local:\/\//, `http://localhost:${port}/`) : url;
for (const source of Object.values(style.sources ?? {})) {
  if (source.tiles) source.tiles = source.tiles.map(local);
  if (source.urls) source.urls = source.urls.map(local);
  source.url = local(source.url);
  source.data = local(source.data);
}
if (typeof style.sprite === 'string') style.sprite = local(style.sprite);
if (Array.isArray(style.sprite)) {
  for (const s of style.sprite) s.url = local(s.url);
}
style.glyphs = local(style.glyphs);

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--disable-gpu',
    '--enable-features=AllowSwiftShaderFallback,AllowSoftwareGLFallbackDueToCrashes',
    '--enable-unsafe-swiftshader',
  ],
});
try {
  const page = await browser.newPage();
  await page.setViewport({width: test.width ?? 512, height: test.height ?? 512});
  page.on('error', (e) => console.error('page crashed:', e.message));
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.goto(`http://localhost:${port}/test-page.html`, {waitUntil: 'load'});
  await page.waitForFunction(() => window.maplibregl, {timeout: 10000});
  const result = await page.evaluate(
    async (style, test, expression, picture) => {
      const container = document.getElementById('map') ?? document.body;
      container.style.width = `${test.width ?? 512}px`;
      container.style.height = `${test.height ?? 512}px`;
      const map = new maplibregl.Map({
        container,
        style,
        interactive: false,
        attributionControl: false,
        maxPitch: test.maxPitch,
        pixelRatio: test.pixelRatio ?? 1,
        fadeDuration: test.fadeDuration ?? 0,
        localIdeographFontFamily: false,
        canvasContextAttributes: {preserveDrawingBuffer: true},
      });
      await map.once('load');
      // A map that never settles is read after 20 seconds.
      await new Promise((resolve) => {
        if (map.loaded()) resolve();
        map.once('idle', resolve);
        setTimeout(resolve, 20000);
      });
      // eslint-disable-next-line no-eval
      const value = await eval(expression);
      let png = null;
      if (picture) {
        map.triggerRepaint();
        await new Promise((resolve) => map.once('render', resolve));
        png = map.getCanvas().toDataURL('image/png');
      }
      return {
        value: JSON.stringify(value, (_, v) =>
          ArrayBuffer.isView(v) ? Array.from(v) : v,
        ),
        png,
      };
    },
    style,
    test,
    expression,
    Boolean(process.env.PNG),
  );
  console.log(result.value);
  if (process.env.PNG) {
    fs.writeFileSync(
      process.env.PNG,
      Buffer.from(result.png.replace(/^data:image\/png;base64,/, ''), 'base64'),
    );
  }
} finally {
  await browser.close();
  server.close();
}
