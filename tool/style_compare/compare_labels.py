# Compares where vmap and MapLibre GL JS placed the labels of render tests:
#
#     python3 compare_labels.py <out dir> [test id prefix]
#
# The out dir holds labels.json (from LABELS=true tool/render_suite.sh) and
# maplibre_labels.json (from labels.mjs) per test. Labels match when their
# anchors are within 3 pixels at the test's zoom.
import json
import math
import os
import sys

out = sys.argv[1]
prefix = sys.argv[2] if len(sys.argv) > 2 else ''
verbose = os.environ.get('VERBOSE') == '1'

for root, _, files in sorted(os.walk(out)):
    if 'labels.json' not in files or 'maplibre_labels.json' not in files:
        continue
    test = os.path.relpath(root, out)
    if not test.startswith(prefix):
        continue
    ours = json.load(open(os.path.join(root, 'labels.json')))
    theirs = json.load(open(os.path.join(root, 'maplibre_labels.json')))
    scale = 512 * 2 ** theirs['zoom']
    view = theirs.get('view')

    def inside(l):
        # Within the quadrilateral the screen covers on the map.
        if not view:
            return True
        sign = 0
        for i in range(4):
            (x0, y0), (x1, y1) = view[i], view[(i + 1) % 4]
            c = (x1 - x0) * (l['y'] - y0) - (y1 - y0) * (l['x'] - x0)
            if c != 0:
                if sign == 0:
                    sign = 1 if c > 0 else -1
                elif (c > 0) != (sign > 0):
                    return False
        return True

    a = [l for l in theirs['labels']
         if (l['text'] or l['icon']) and l.get('onScreen', True)]
    b = [l for l in ours if l['placed'] and inside(l)]
    left = list(range(len(b)))
    matched, only_theirs, offsets = 0, [], []
    for l in a:
        best, best_d = None, 3.0
        for j in left:
            m = b[j]
            if m['layer'] != l['layer']:
                continue
            d = math.hypot((m['x'] - l['x']) * scale, (m['y'] - l['y']) * scale)
            if d <= best_d:
                best, best_d = j, d
        if best is None:
            only_theirs.append(l)
        else:
            left.remove(best)
            matched += 1
            offsets.append(best_d)
    only_ours = [b[j] for j in left]
    offsets.sort()
    median = offsets[len(offsets) // 2] if offsets else 0
    print(f'{test}: {matched} same, {len(only_theirs)} only MapLibre, '
          f'{len(only_ours)} only vmap, median offset {median:.2f}px')
    if verbose:
        for l in only_theirs:
            print(f"   maplibre {l['layer']} ({l['x'] * scale:.1f}, {l['y'] * scale:.1f})"
                  f" text={l['text']} icon={l['icon']}")
        for l in only_ours:
            print(f"   vmap     {l['layer']} ({l['x'] * scale:.1f}, {l['y'] * scale:.1f})"
                  f" {l['text']!r}")
