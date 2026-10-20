// Writes where MapLibre GL JS places the labels of render tests, to compare
// with vmap's labels.json from `LABELS=true tool/render_suite.sh`:
//
//     node labels.mjs <maplibre-gl-js checkout> <out dir> <test id>...
//
// Each test gets <out dir>/<id>/maplibre_labels.json: every symbol MapLibre
// laid out, its layer, its anchor as fractions of the world and whether its
// text and icon were placed. The test's operations are not run.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const [checkout, outDir, ...ids] = process.argv.slice(2);
const assets = path.join(checkout, 'test/integration/assets');
const tests = path.join(checkout, 'test/integration/render/tests');
const dist = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  'node_modules/maplibre-gl/dist',
);

const page_ = `<!doctype html><html><head><script type="module">
import * as m from '/dist/maplibre-gl-dev.mjs';
window.maplibregl = m.default ?? m;
</script><style>html,body{margin:0}</style></head><body><div id="m"></div></body></html>`;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://local');
  if (url.pathname === '/') {
    res.writeHead(200, {'content-type': 'text/html'}).end(page_);
    return;
  }
  const root = url.pathname.startsWith('/dist/') ? dist : assets;
  const relative = decodeURIComponent(url.pathname.replace(/^\/(dist|assets)\//, ''));
  const file = path.join(root, path.normalize(relative));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, {
    'content-type': file.endsWith('.mjs') ? 'text/javascript' : 'application/octet-stream',
  }).end(fs.readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}/`;

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  protocolTimeout: 120000,
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log(`page error: ${e.message}`));
await page.goto(origin, {waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.maplibregl?.Map);

for (const id of ids) {
  const style = JSON.parse(
    fs.readFileSync(path.join(tests, id, 'style.json'), 'utf8')
      .replaceAll('local://', `${origin}assets/`),
  );
  const test = style.metadata?.test ?? {};
  const labels = await page.evaluate(async (style, test) => {
    window.map?.remove();
    const div = document.getElementById('m');
    div.style.width = `${test.width ?? 512}px`;
    div.style.height = `${test.height ?? 512}px`;
    const map = window.map = new maplibregl.Map({
      container: 'm', style, pixelRatio: test.pixelRatio ?? 1, fadeDuration: 0,
      attributionControl: false, interactive: false,
      crossSourceCollisions: test.crossSourceCollisions ?? true,
    });
    await new Promise((done) => map.once('idle', done));
    const placements = map.style.placement.placements;
    const seen = new Map();
    for (const manager of Object.values(map.style.tileManagers)) {
      for (const key of manager.getRenderableIds()) {
        const tile = manager.getTileByID(key);
        const {z, x, y} = tile.tileID.canonical;
        const n = 2 ** z;
        for (const [layer, bucket] of Object.entries(tile.buckets)) {
          if (!bucket.symbolInstances) continue;
          for (let i = 0; i < bucket.symbolInstances.length; i++) {
            const s = bucket.symbolInstances.get(i);
            if (seen.has(s.crossTileID)) continue;
            const p = placements[s.crossTileID];
            seen.set(s.crossTileID, {
              layer: bucket.layerIds[0] ?? layer,
              tile: `${tile.tileID.overscaledZ}/${z}/${x}/${y}`,
              x: (x + s.anchorX / 8192) / n,
              y: (y + s.anchorY / 8192) / n,
              text: !!p?.text,
              icon: !!p?.icon,
              hasText: s.numHorizontalGlyphVertices > 0 || s.numVerticalGlyphVertices > 0,
              hasIcon: s.numIconVertices > 0,
            });
          }
        }
      }
    }
    return {zoom: map.getZoom(), labels: [...seen.values()]};
  }, style, test);
  const dir = path.join(outDir, id);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'maplibre_labels.json'), JSON.stringify(labels));
  console.log(`${id}: ${labels.labels.filter((l) => l.text || l.icon).length} placed of ${labels.labels.length}`);
}
await browser.close();
server.close();
