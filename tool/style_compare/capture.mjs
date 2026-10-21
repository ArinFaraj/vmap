// Renders every view in views.json with MapLibre GL JS in Chrome and writes
// a render suite vmap's harness runs: one test per view, MapLibre's picture
// as its expected image.
//
//     node capture.mjs <out dir> [chrome executable]
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const out = path.resolve(process.argv[2] ?? '/tmp/vmap_style_compare');
const chrome = process.argv[3] ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const config = JSON.parse(fs.readFileSync(new URL('./views.json', import.meta.url)));
const size = config.size;
const tests = path.join(out, 'test/integration/render/tests');
fs.mkdirSync(path.join(out, 'test/integration/assets'), {recursive: true});

const styles = {};
for (const [name, url] of Object.entries(config.styles)) {
  styles[name] = await (await fetch(url)).json();
}

// MapLibre starts its worker from beside its own script, which a browser
// only allows from the page's own origin: the page and the package are
// served from here.
const dist = path.join(path.dirname(new URL(import.meta.url).pathname),
  'node_modules/maplibre-gl/dist');
// Apps that show Arabic script load MapLibre's right-to-left text plugin,
// without which it draws those letters unjoined and in the wrong order.
const rtl = path.join(path.dirname(new URL(import.meta.url).pathname),
  'node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js');
const page_ = `<!doctype html><html><head>
<link rel="stylesheet" href="/dist/maplibre-gl.css">
<script type="module">
import * as m from '/dist/maplibre-gl.mjs';
const maplibregl = m.default ?? m;
await maplibregl.setRTLTextPlugin(new URL('/rtl.js', location).href, false);
window.maplibregl = maplibregl;
</script>
<style>html,body{margin:0}#m{width:${size}px;height:${size}px}</style></head>
<body><div id="m"></div></body></html>`;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://local');
  if (url.pathname === '/') {
    res.writeHead(200, {'content-type': 'text/html'}).end(page_);
    return;
  }
  if (url.pathname === '/rtl.js') {
    res.writeHead(200, {'content-type': 'text/javascript'}).end(fs.readFileSync(rtl));
    return;
  }
  const file = path.join(dist, path.normalize(url.pathname.replace(/^\/dist\//, '')));
  if (!file.startsWith(dist) || !fs.existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  const type = file.endsWith('.css') ? 'text/css' : 'text/javascript';
  res.writeHead(200, {'content-type': type}).end(fs.readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}/`;

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  // Software WebGL: a headless Chrome may have no GPU, and the same
  // rasterizer everywhere keeps the pictures the same from machine to
  // machine.
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars'],
  protocolTimeout: 120000,
});
const page = await browser.newPage();
page.on('console', (m) => {
  if (m.type() === 'error') console.log(`page: ${m.text()}`);
});
page.on('pageerror', (e) => console.log(`page error: ${e.message}`));
page.on('response', (r) => {
  if (r.status() >= 400 && !r.url().endsWith('/favicon.ico')) {
    console.log(`page: ${r.status()} ${r.url()}`);
  }
});
await page.setViewport({width: size, height: size, deviceScaleFactor: 1});
await page.goto(origin, {waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.maplibregl?.Map);

let shownStyle = null;
for (const view of config.views) {
  const camera = {
    center: [view.lon, view.lat], zoom: view.zoom,
    bearing: view.bearing ?? 0, pitch: view.pitch ?? 0,
  };
  const png = await page.evaluate(async (style, styleName, shownStyle, camera) => {
    if (styleName !== shownStyle) {
      window.map?.remove();
      window.map = new maplibregl.Map({
        container: 'm', style, pixelRatio: 1, fadeDuration: 0,
        attributionControl: false, interactive: false, ...camera,
        canvasContextAttributes: {preserveDrawingBuffer: true},
      });
      window.map.on('error', (e) => console.log(`map error: ${e.error?.message ?? e}`));
    } else {
      window.map.jumpTo(camera);
    }
    await new Promise((done) => window.map.once('idle', done));
    await new Promise((done) => setTimeout(done, 300));
    return window.map.getCanvas().toDataURL('image/png');
  }, styles[view.style], view.style, shownStyle, camera);
  shownStyle = view.style;
  const dir = path.join(tests, view.style, view.name);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'expected.png'), Buffer.from(png.split(',')[1], 'base64'));
  fs.writeFileSync(path.join(dir, 'style.json'), JSON.stringify({
    ...styles[view.style], ...camera,
    metadata: {test: {width: size, height: size}},
  }));
  console.log(`captured ${view.style}/${view.name}`);
}
await browser.close();
server.close();
