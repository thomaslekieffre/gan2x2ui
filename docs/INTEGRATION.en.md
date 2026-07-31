# Integrating into a third-party site

How to wire **gan2x2UI** (GAN 251 UI / 2×2) into an existing web app (timer, training, dashboard…).

Browser requirements: **Chrome / Edge** desktop (Web Bluetooth), page on `https://` or `http://localhost`.

## Install

```bash
npm i gan2x2ui
# or local clone
npm i /path/to/gan2x2UI
```

Native ESM, zero runtime dependencies.

```js
import { Gan2x2UI, scramble2x2Official, mergeMoves } from "gan2x2ui";
```

Bundlers (Vite, Next, Webpack) if needed:

```js
transpilePackages: ["gan2x2ui"] // Next
```

BLE `connect` must run **client-side only** (`"use client"`, no SSR).

## Minimal flow

```js
const cube = await Gan2x2UI.connect({
  mac: "AA:BB:CC:DD:EE:FF", // your hardware MAC
  resetOnConnect: true,      // current pose = solved
});

cube.on("move", ({ move, state, solved }) => {
  console.log(move, solved);
});

cube.on("gyro", ({ quaternion }) => {
  // 3D orientation
});

cube.on("battery", ({ level }) => {});
cube.on("disconnect", () => {});

await cube.send("BATTERY");
await cube.disconnect();
```

`Gan2x2UI.connect` opens the Bluetooth picker — call it from a **user gesture**.

## MAC — not returned by BT connect

ProtocolV3-2 derives KEY/IV from the **hardware MAC**.  
Web Bluetooth does **not** expose it on connect.

**How to find it (Windows/Linux/Android):**  
`chrome://bluetooth-internals/#devices` → Address (cube on).  
On macOS that value is often fake — use advertisements or manual entry.

App UX options:

1. Text field (first time).
2. `localStorage` cache keyed by device name.
3. `watchAdvertisements()` + manufacturer data (Chrome experimental flag).

Wrong MAC → decrypt fails, no readable moves.

## Device detection

Observed prefixes: `gan251ui_`, `ganic251_`.

```js
function isGan251Ui(name) {
  const n = (name || "").toLowerCase();
  return n.startsWith("gan251ui") || n.startsWith("ganic251");
}
```

If your site already supports other smart cubes (GAN 3×3, Giiker, …): route 251 UI to **gan2x2UI**, not a generic Gen4/3×3 driver (different keys / framing).

## Recommended timer pattern

Same logic as `examples/timer.html`:

1. **Connect** with physically solved cube (white ↑ green →) → `resetOnConnect`.
2. Generate a URF scramble: `scramble2x2Official()`.
3. During scramble:
   - `cube.applyMoves = false`
   - drive local / viewer state from the **scramble**, not raw HW stream
   - lock 3D orientation (white ↑ green →), gyro off
4. Scramble done → 15 s inspection.
5. First `move` → start timer.
6. `solved === true` → stop.
7. Reconstruction: `mergeMoves(rawMoves)` (`U U` → `U2`).

```js
const raw = [];
cube.on("move", (e) => {
  raw.push(e.move);
  const reco = mergeMoves(raw); // HTM
});
```

## 3D viewer

- **TwistyPlayer** (`cubing/twisty`, puzzle `2x2x2`) for replay.
- Or custom Three.js (see timer example).
- Do not reuse a **3×3 (54 stickers)** facelets pipeline as-is — native model is **CP/CO** (`Cube2x2`).

Gyro = orientation quaternion only. **Do not** remap move letters via gyro (firmware = U/R/F axes).

## Integration checklist

- [ ] Client-only import
- [ ] MAC + `Gan2x2UI.connect` on user gesture
- [ ] `resetOnConnect` or `markSolved()`
- [ ] URF scramble + `applyMoves = false` while scrambling
- [ ] Timer: insp → first move → stop on solved
- [ ] Reco via `mergeMoves`
- [ ] 2×2 viewer (not 3×3 facelets)
- [ ] Error if Web Bluetooth missing

## Examples in this repo

```bash
npm run serve
# http://localhost:8080/examples/minimal.html
# http://localhost:8080/examples/timer.html
```

[Français](./INTEGRATION.fr.md)
