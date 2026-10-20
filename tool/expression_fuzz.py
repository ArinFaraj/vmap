# Writes a render suite in which each test puts one of the style spec's
# expression fixtures, valid or malformed, into every property of every layer
# type. vmap passes none of them; what counts is that none errors:
#
#     python3 tool/expression_fuzz.py <style spec checkout> <maplibre-gl-js checkout> <out dir>
#     tool/render_suite.sh <out dir> <report dir> [--gpu]
import json, glob, os, struct, zlib, sys

spec = os.path.abspath(sys.argv[1]) + '/test/integration/expression/tests'
out = os.path.abspath(sys.argv[3]) + '/test/integration'
os.makedirs(out + '/render/tests', exist_ok=True)
assets = os.path.abspath(sys.argv[2]) + '/test/integration/assets'
if not os.path.exists(out + '/assets'):
    os.symlink(assets, out + '/assets')

def png(w, h):
    raw = b''.join(b'\x00' + b'\xff\xff\xff\xff' * w for _ in range(h))
    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b'')

data = {'type': 'FeatureCollection', 'features': [
    {'type': 'Feature', 'id': 7, 'properties': {'x': 1, 'name': 'a', 'b': True, 'c': [1, 2]}, 'geometry': {'type': 'Point', 'coordinates': [1, 1]}},
    {'type': 'Feature', 'properties': {'x': 'y'}, 'geometry': {'type': 'LineString', 'coordinates': [[-5, -5], [5, 5]]}},
    {'type': 'Feature', 'properties': {}, 'geometry': {'type': 'Polygon', 'coordinates': [[[-3, -3], [3, -3], [3, 3], [-3, -3]]]}},
]}
slots = {
    'fill': [('paint', 'fill-color'), ('paint', 'fill-opacity'), ('paint', 'fill-pattern'), ('paint', 'fill-translate')],
    'line': [('paint', 'line-width'), ('paint', 'line-color'), ('paint', 'line-dasharray'), ('paint', 'line-offset'), ('paint', 'line-blur'), ('layout', 'line-cap')],
    'circle': [('paint', 'circle-radius'), ('paint', 'circle-color'), ('paint', 'circle-stroke-width'), ('paint', 'circle-blur')],
    'symbol': [('layout', 'text-field'), ('layout', 'icon-image'), ('layout', 'text-size'), ('layout', 'text-offset'), ('layout', 'text-anchor'), ('layout', 'text-rotate'), ('layout', 'icon-size'), ('layout', 'text-variable-anchor'), ('paint', 'text-color'), ('paint', 'text-halo-width'), ('paint', 'icon-opacity'), ('layout', 'text-transform'), ('layout', 'text-letter-spacing'), ('layout', 'text-max-width')],
    'fill-extrusion': [('paint', 'fill-extrusion-height'), ('paint', 'fill-extrusion-color')],
    'heatmap': [('paint', 'heatmap-weight'), ('paint', 'heatmap-radius')],
}
n = 0
for f in sorted(glob.glob(spec + '/**/test.json', recursive=True)):
    e = json.load(open(f))['expression']
    layers = []
    for t, ss in slots.items():
        for part, key in ss:
            l = {'id': f'{t}-{key}', 'type': t, 'source': 'g'}
            if t == 'symbol':
                l['layout'] = {'text-field': 'ab', 'icon-image': 'dot.sdf', 'text-font': ['Open Sans Semibold']}
            l.setdefault(part, {})[key] = e
            layers.append(l)
    layers.append({'id': 'filter', 'type': 'circle', 'source': 'g', 'filter': e})
    d = f'{out}/render/tests/fuzz/{n:04d}'
    os.makedirs(d, exist_ok=True)
    json.dump({'version': 8, 'metadata': {'test': {'width': 64, 'height': 64, 'note': f[len(spec)+1:]}},
               'center': [0, 0], 'zoom': 2, 'pitch': 30,
               'sprite': 'local://sprites/sprite', 'glyphs': 'local://glyphs/{fontstack}/{range}.pbf',
               'sources': {'g': {'type': 'geojson', 'data': data}}, 'layers': layers}, open(d + '/style.json', 'w'))
    open(d + '/expected.png', 'wb').write(png(64, 64))
    n += 1
print(n, 'tests')
