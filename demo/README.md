# vmap demo

The showcase at https://arinfaraj.github.io/vmap/: a guided tour of vmap
(the globe, 3D buildings, terrain, your own data) and a panel to try styles,
labels and layers yourself. The `Demo` workflow deploys it on every push to
`main`.

```bash
cd demo
flutter run -d chrome --wasm
```

`?stop=3` opens the tour at its fourth stop, and `?still` holds it there.
`coi-serviceworker.js` (MIT, Guido Zuidhof) makes the page cross-origin
isolated on GitHub Pages, which cannot send the headers itself.
