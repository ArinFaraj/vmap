# Benchmark against vector_map_tiles

![Frames lost during the tour](images/bench.png)

Both renderers drew the Liberty style on the same phone (Vivo V2514, Android,
profile build) and flew the same scripted tour twice per start: once straight
after a clean install with nothing cached, then again after a restart with the
cache that run left behind. A lost frame is a display refresh that passed
without a new frame. The numbers are from vmap 0.3.0 and vector_map_tiles
9.0.0-beta.13.

| | vmap lost | vmap worst gap | vector_map_tiles lost | vector_map_tiles worst gap |
| --- | --- | --- | --- | --- |
| Tour, clean install | 0 of 2778 | 17 ms | 196 of 2779 | 132 ms |
| Tour, cached | 0 of 2775 | 17 ms | 10 of 2779 | 132 ms |
| Fast zooms, clean install | 0 of 1328 | 17 ms | 164 of 1325 | 166 ms |
| Fast zooms, cached | 0 of 1327 | 18 ms | 140 of 1321 | 166 ms |

## What this does and does not show

- The phone ran both apps at 60 Hz, so a frame had 16.6 ms. It was one run
  per row on one phone.
- vmap does more work per frame, because it redraws the vectors every frame:
  about 3 ms on the UI thread and 4 ms on the raster thread at the median,
  against 1 to 2 ms each for vector_map_tiles, which mostly draws finished
  images.
- The slowest 1 percent of vmap's frames took 6.6 to 7.2 ms on the UI thread
  and 6.4 to 8.2 ms on the raster thread in later single lap runs of version
  0.3.2. A frame has 8.3 ms at 120 Hz. 120 Hz itself has not been measured:
  the phone held both apps at 60 Hz.
- Version 0.5.1, with rotation, every source, pins and bent road names in,
  ran one cached lap of the tour with 0 of 1390 frames skipped. Its slowest
  1 percent of frames took 5.9 ms on the UI thread and 5.9 ms on the raster
  thread, and 79 frames took more than 8 ms in total. Still at 60 Hz.
- Version 0.9.0 ran one cached lap of the same tour with 0 of 1383 frames
  skipped. Its slowest 1 percent of frames took 6.8 ms on the UI thread and
  6.5 ms on the raster thread, and 122 frames took more than 8 ms in total.
  Still at 60 Hz.
- Versions 0.9.0 and 0.14.0 ran five laps each in turn on a warm phone. The
  slowest 1 percent of frames took 6.9 to 7.4 ms on the UI thread for 0.9.0
  and 6.6 to 8.0 ms for 0.14.0, and 5.9 to 7.2 ms against 6.5 to 7.5 ms on
  the raster thread. Laps of one build differ from each other by as much.
- A heatmap layer of 300 points in view cost 0.2 to 0.5 ms more per frame on
  the UI thread and nothing measurable on the raster thread: two laps with
  the layer and two without, in the same style.
- vector_map_tiles lost its frames in long gaps while waiting for tiles to be
  rendered, not in slow frames of its own.
- vmap's process used about 440 to 490 MB. vector_map_tiles' memory was not
  recorded.
- Pins (0.4.0) were not part of any of these runs.

## In a browser

Chrome on a Mac with a 120 Hz screen, the same tour and style, one lap. The
Mac was busy with other work during every run here (a load of 17 to 26 on
14 cores), so read the size of the change and not the last digit.

| | frames a second | frames skipped | longest gap |
|---|---|---|---|
| JavaScript build, a label image each (0.17.0) | 25 and 32 | 463 and 473 | 213 and 226 ms |
| JavaScript build, labels as text (0.17.2) | 104 and 105 | 381 and 356 | 148 and 99 ms |
| JavaScript build, labels as text, road names as images (0.21.1) | 112 and 114 | 225 and 168 | 101 and 103 ms |
| `--wasm` build, a label image each (0.17.2) | 107 and 68 | 299 and 248 | 76 and 77 ms |

In the JavaScript build an image of a label took 28 ms to make on average,
and the cost rose with the load on the machine. 0.17.1 shared images between
labels and measured 119 frames a second once; later runs of the same build
gave 23 to 58, so that figure should not be relied on. Drawing the text
itself needs no image at all.

The `--wasm` build keeps an image for each label, which costs it nothing
to make. Drawing every label as text ran its renderer out of memory, and
turning its images into textures by reading their pixels back left some
labels as noise and froze the tab twice in six runs, so neither is used.
Both of its laps drew the same number of frames, about 2700 in 30 seconds,
so the 68 is more likely the browser's frame times than the map. 0.17.1
measured this build at 18 to 30, and why it differs has not been traced.

The frames still skipped are the labels, not the tiles. With labels off
the same lap skipped 16 to 31 frames and ran at 119 frames a second.

About half of what 0.17.2 skipped was the names along roads. Text that is
turned is drawn again from its outlines every frame, and a road name is
turned and has a stroked halo. From 0.21.1 those names are images, made
with the stroked halo instead of the ring of copies, which takes about 2 ms
an image here where the ring took 28. Playing the straight stretch of a
name in one piece instead of a slice at a time was tried first and changed
nothing (363 frames skipped).

Making every label an image with the stroked halo was tried after that. Two
laps drew 72 and 88 frames a second with 128 and 56 frames skipped: fewer
long gaps but fewer frames, and an image took 9 ms to make in that run
against 2 ms in the ones above, on the same machine under the same kind of
load. Text for the flat labels is kept because its cost does not swing
like that.

### A worker for the tiles

`VmapEngine.useWebWorker` sets the worker that moves tile building off the page's thread. One lap
each, JavaScript build, tiles already in the browser's cache:

| | frames a second | frames skipped | longest gap |
|---|---|---|---|
| on the page | 105 and 106 | 348 and 322 | 97 and 103 ms |
| in a worker | 106 and 106 | 324 and 340 | 107 and 93 ms |
| on the page, labels off, processor slowed four times | 65 | 489 | 246 ms |
| in a worker, labels off, processor slowed four times | 70 | 452 | 236 ms |

So on a fast machine it changes nothing that can be measured, and on a
slowed one it was worth about 8 percent in one run of each. Chrome's
slowdown may not slow a worker as much as the page, which would flatter
the worker. It has not been measured on a real slow device or with tiles
coming from the network for the first time.

### Frame pacing

The frames skipped above are not all lost to the same thing. Two of them —
a tile being unpacked for the GPU, and label text being drawn anew after a
zoom — can wait a frame or two without the map looking worse for it, and
those are what `FramePacing` (in `lib/src/render/`) limits. Every frame
reports what it cost; the average of the last twenty picks one of three
levels, each handing out a different share of the next frame:

| pressure | frame | tile preparation | label text | label placement |
|---|---|---|---|---|
| 0 | under 7 ms | 2.5 ms | 2 ms | 1.5 ms |
| 1 | 7 to 12 ms | 1.5 ms | 1 ms | 1 ms |
| 2 | over 12 ms | 0.75 ms | 0.5 ms | 0.6 ms |

A level is entered at one average and left at another (2 is left under
10 ms, 1 under 7 ms), so a map drawing at the edge of a level does not
switch back and forth, and the first frames of a map — its slowest — only
count once there are twenty of them. `VmapStats.pressure` reports the
level, and the benchmark app prints it with the rest of a lap, so a run
that went slow can be read for whether it was the map's drawing or the
work that was meant to wait.

Nothing above has been measured again since these changes: the table is
what the levels hand out, not what a lap drew. Run `tool/bench_device.sh`
or the browser tour and read `pressure`, `skipped` and `worst gap`, as the
tables above were read.

## The comparison picture

![vmap and vector_map_tiles drawing the same style](images/compare.png)

The same style, camera and tiles. vector_map_tiles reads a style one zoom
level deeper than MapLibre does for the same view, so for this picture vmap
was given `zoomOffset: 1` to match. vector_map_tiles shows more shops in this
view than vmap does. The style holds those layers back until zoom 16 and 17,
and vmap follows that. Why vector_map_tiles shows them earlier has not been
traced.

## Run it yourself

```bash
tool/bench_device.sh <adb-serial> ours --dart-define=STYLE=liberty --dart-define=ZOFF=1
tool/bench_device.sh <adb-serial> vmt --dart-define=STYLE=liberty
```

`STYLE` gives both the same style, and `ZOFF=1` makes vmap read it at the
zoom vector_map_tiles does, so both draw the same roads and names. Add
`--dart-define=STRESS=true` for the tour of fast zooms.

Once a build is installed, `tool/quick_bench.sh <adb-serial>` flies one lap
again in about half a minute without rebuilding. Add `labels=off` to fly it
with labels off.
