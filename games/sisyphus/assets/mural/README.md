# Mural Asset Kit

This folder contains the reusable plaster-and-indigo assets previewed by `asset-gallery.html`.

## Adding an Asset

1. Choose the appropriate folder: `backgrounds`, `decals`, `landmarks`, `characters`, or `textures`.
2. Author or generate a richly textured mural asset using the shared colors from `manifest.json`.
3. Export a tightly cropped transparent WebP unless the asset is a full texture.
4. Add a unique entry to `manifest.json`.
5. Run a local static server and open `asset-gallery.html`.
6. Check the asset at 0.5×, 1×, and 2× on light, dark, and checkerboard grounds.
7. Check desktop and mobile layouts before using the asset in gameplay.

## Production v3 Rules

- Use the approved weathered fresco language: pale plaster, indigo-black mineral ink, chipped pigment, scratches, and irregular eroded edges.
- Keep silhouettes readable at gameplay scale while retaining dense internal incision detail.
- Use lower opacity for distant parallax layers rather than flattening their source detail.
- Keep transparent corners and remove all chroma-key fringe before committing an asset.
- Natural terrain and vegetation may support mirroring. Architecture and figures should not.
- The older SVG files are legacy sources only and are not included in the production manifest.

## Animation Asset Loop

The four active Sisyphus frames in `characters/push-v3` share a 768×768 canvas, palm anchor, and foot baseline. `simulation.html` blends them around a six-step loop and locks them to the boulder and sampled visible ridge. Frame 04 is intentionally retired because its luminance breaks the mural's visual continuity.

Regenerate normalized frames from a transparent strip plus isolated late poses with:

```powershell
python tools/build-sisyphus-sprites.py <strip.png> <pose04.png> <pose05.png> assets/mural/characters/push-v3
```

The simulation records WebM directly. `tools/convert-capture-to-gif.ps1` converts that recording, while `tools/frames-to-gif.ps1` accepts deterministic browser frame sequences.

## Extendable Stone Chain

The playable mountain is a single horizontal row of six modules. Each module spans from its controlled upper ridge to below the frame, so nothing is stacked vertically and no solid polygon is needed underneath.

All modules use the same width, vertical scale, overlap, entry height, and exit height. A deterministic seed changes only the stone material and small ridge bumps within a ±3% envelope around the straight physics ramp. Modules are not mirrored because that would reverse their rise.

The production v3 materials in `terrain/edge-safe-v3` normalize brightness and share neutral edge geology. Rebuild them with `tools/build-edge-safe-terrain.py`; the animation crossfades the first 17% of each overlapping module and adds internal decals away from its edges.

## Raster Rules

- Use transparent WebP for static sprites, landmarks, cliffs, and decals. Use optimized PNG for anchored animation frames where alpha fidelity is critical.
- Textures must tile without hard seams or directional lighting.
- Keep the plaster base at or below 300 KB. Large hero assets may use up to 400 KB; distant layers and small decals should stay below 300 KB.
- Do not add objects, text, or unique focal marks to seamless textures.

## Manifest Entry

```json
{
  "id": "rock-strata-v2",
  "name": "Weathered sediment strata v2",
  "type": "decal",
  "src": "decals/rock-strata-v2.webp",
  "dimensions": "900×617",
  "mirror": true,
  "scale": [0.6, 1.25],
  "maxBytes": 358400
}
```

The gallery reports missing files and assets that exceed their size budget.

## Local Preview

From the repository root:

```powershell
python -m http.server 8123 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8123/asset-gallery.html`.
