// Races vmap against MapLibre GL JS, and builds of vmap against each other,
// in Chrome on this machine's GPU, through bench/web/race.html.
//
//     node tool/web_race.mjs out.json rounds [uncapped] name=port ...
//
// Each name=port is a build of bench/lib/compare_web.dart served by
// tool/web_compare.sh; vmap is raced from each, MapLibre from the first.
// Every round flies each map through the same views in a fresh tab, after
// one round that warms the HTTP cache and is thrown away, then loads each
// view cold in a fresh browser context to time the first full picture.
// With uncapped, Chrome draws as fast as it can instead of at the screen's
// rate, and the load timing is skipped.
import {createRequire} from 'node:module';
import {existsSync, writeFileSync} from 'node:fs';
import {execSync} from 'node:child_process';
import {platform} from 'node:os';

const require = createRequire(new URL('style_compare/package.json', import.meta.url));
const puppeteer = require('puppeteer-core');

const [out, roundsArg, ...rest] = process.argv.slice(2);
const uncapped = rest[0] === 'uncapped';
const builds = Object.fromEntries(rest.filter((a) => a.includes('=')).map((a) => a.split('=')));
const names = Object.keys(builds);
const rounds = Number(roundsArg);
const targets = [...names.map((build) => ({build, map: 'vmap'})), {build: names[0], map: 'maplibre'}];
const label = (t) => t.map === 'maplibre' ? 'maplibre' : `vmap@${t.build}`;

const chrome = process.env.CHROME ?? {
  darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
  win32: [
    `${process.env.PROGRAMFILES}/Google/Chrome/Application/chrome.exe`,
    `${process.env['PROGRAMFILES(X86)']}/Google/Chrome/Application/chrome.exe`,
    `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  ],
  linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'],
}[platform()]?.find((path) => existsSync(path));
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  protocolTimeout: 300000,
  args: [
    '--window-size=1552,985', '--enable-gpu', '--ignore-gpu-blocklist',
    ...(platform() === 'darwin' ? ['--use-angle=metal'] : []),
    '--no-first-run', '--enable-blink-features=ForceEagerMeasureMemory',
    ...(uncapped ? ['--disable-frame-rate-limit', '--disable-gpu-vsync'] : []),
  ],
  defaultViewport: {width: 1552, height: 985, deviceScaleFactor: 2},
});
const results = {uncapped, flights: [], loads: [], gpu: null};
const load = () => platform() === 'win32'
  ? null
  : execSync('uptime').toString().trim().split('averages: ')[1];

const open = async (context, t) => {
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log(label(t), 'error', String(e).slice(0, 200)));
  await page.goto(`http://127.0.0.1:${builds[t.build]}/race.html`, {waitUntil: 'load'});
  return page;
};

const fly = async (t, round, record) => {
  const page = await open(browser.defaultBrowserContext(), t);
  results.gpu ??= await page.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    return gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
  });
  const row = {round, target: label(t), load: load()};
  const go = (fn, ...args) => page.evaluate(fn, ...args);
  await go((m) => window.race.load(m, 'erbil3d'), t.map);
  for (const view of ['erbil3d', 'city', 'flight']) {
    row[view] = await go((v) => window.race.fly(v), view);
  }
  row.memoryMb = await go(() => window.race.memory());
  await go((m) => window.race.load(m, 'globe'), t.map);
  row.globe = await go(() => window.race.fly('globe'));
  await page.close();
  if (record) results.flights.push(row);
  const brief = ['erbil3d', 'city', 'flight', 'globe']
    .map((v) => `${v} ${row[v].fps}fps p95 ${row[v].p95} work ${row[v].workMs}`).join(' | ');
  console.log(record ? round : 'warm', row.target, `${row.memoryMb} MB`, brief);
};

const cold = async (t, view, round) => {
  const context = await browser.createBrowserContext();
  const page = await open(context, t);
  const r = await page.evaluate((m, v) => window.race.load(m, v), t.map, view);
  await context.close();
  results.loads.push({round, target: label(t), view, ...r});
  console.log('load', round, label(t), view, r);
};

const rotate = (list, n) => list.map((_, i) => list[(i + n) % list.length]);
for (const t of targets) await fly(t, -1, false);
for (let round = 0; round < rounds; round++) {
  for (const t of rotate(targets, round)) await fly(t, round, true);
  writeFileSync(out, JSON.stringify(results, null, 1));
}
if (!uncapped) {
  for (let round = 0; round < rounds; round++) {
    for (const view of ['erbil3d', 'city', 'globe']) {
      for (const t of rotate(targets, round)) await cold(t, view, round);
    }
    writeFileSync(out, JSON.stringify(results, null, 1));
  }
}
writeFileSync(out, JSON.stringify(results, null, 1));
await browser.close();
