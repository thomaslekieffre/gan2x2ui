# gan2x2UI

[Français](./README.md) · **English**

Open-source **Web Bluetooth** driver for the **GAN 251 UI** (smart 2×2).

Chrome / Edge desktop · `localhost` or HTTPS · native ESM, zero runtime deps.

```js
import { Gan2x2UI, scramble2x2Official, mergeMoves } from "gan2x2ui";

const cube = await Gan2x2UI.connect({ mac: "AA:BB:CC:DD:EE:FF" });

cube.on("move", ({ move, hwMove, state }) => {
  console.log(move, state.isSolved());
});

cube.on("gyro", ({ quaternion }) => { /* 3D orientation */ });
cube.on("battery", ({ level }) => console.log(level));

const { scramble, dist } = scramble2x2Official();
console.log(scramble, dist); // e.g. "R U R' F2 …"  dist ≥ 4
```

## Install

```bash
npm i gan2x2ui
```

Or clone + local import:

```js
import { Gan2x2UI } from "./src/index.js";
```

## MAC — not automatic on connect

**No:** `navigator.bluetooth.requestDevice()` / GATT connect does **not** expose the hardware MAC.

Chrome gives an opaque per-origin `device.id`, not the real address.  
GAN crypto **requires** the real MAC → you must pass `opts.mac`.

| Method | Automatic? |
|--------|------------|
| Text field + `localStorage` | Manual once |
| `chrome://bluetooth-internals/#devices` | Manual (Windows/Linux/Android) |
| `watchAdvertisements()` + manufacturer data | Semi-auto (Chrome experimental flag) |
| MAC embedded in BLE name | Rare / firmware-dependent |

**Windows / Linux / Android:** cube on → `chrome://bluetooth-internals/#devices` → Address column.  
**macOS:** that page is often spoofed → use advertisements or type it in.

Auto PoC: https://gan-mac-poc.stackblitz.io/  
Flag: `chrome://flags/#enable-experimental-web-platform-features`

Never commit a real MAC to a public repo.

## Quick start

```bash
npm run serve
# → http://localhost:8080/examples/minimal.html
# → http://localhost:8080/examples/timer.html
```

- Integration: [`docs/INTEGRATION.en.md`](./docs/INTEGRATION.en.md) · [FR](./docs/INTEGRATION.fr.md)
- Protocol: [`docs/PROTOCOL.en.md`](./docs/PROTOCOL.en.md) · [FR](./docs/PROTOCOL.fr.md)
- Roadmap: [`docs/ROADMAP.en.md`](./docs/ROADMAP.en.md) · [FR](./docs/ROADMAP.fr.md)

1. Use **Chrome** (not an IDE preview).
2. Cube on, **white ↑ / green →**.
3. Paste your MAC → Connect (`RESET` marks current pose solved).
4. Turn the cube.

## API

### `Gan2x2UI.connect(opts)`

| Option | Default | |
|--------|---------|--|
| `mac` | *required* | Bluetooth MAC (`AA:BB:CC:DD:EE:FF`) |
| `resetOnConnect` | `true` | Firmware `RESET` + local solved model |
| `requestFacelets` | `true` | If not resetting |
| `preferAltTx` | `false` | Write on `fff7` |
| `device` | — | Pre-selected `BluetoothDevice` |

### Events

| Event | Useful payload |
|-------|----------------|
| `connect` | `{ name, key, solved }` |
| `move` | `{ move, hwMove, direction, faceHot, serial, state, solved, q }` |
| `gyro` | `{ quaternion, vx, vy, vz }` |
| `facelets` | `{ CP, CO, state, solved }` |
| `battery` | `{ level }` |
| `disconnect` | `{}` |
| `error` | `{ error, ct }` |

```js
const off = cube.on("move", handler);
off();

await cube.send("BATTERY");
await cube.markSolved();
cube.applyMoves = false;
await cube.disconnect();
```

### Cube & scramble

| Export | Role |
|--------|------|
| `Cube2x2` | CP/CO model |
| `scramble2x2Official()` | Random-state URF scramble |
| `mergeMoves(list)` | `U U`→`U2`, `F' F'`→`F2` |
| `parseAlg` / `invertAlg` / `applyAlg` | Utils |
| `OrientationTracker` | Gyro → display quat |

### Low level

`decodePacket`, `encodeCommand`, `deriveKeyIv`, `ganCrypt`, `FACE_ONEHOT` — see protocol docs.

## Firmware limits

Same as CubeStation:

- MOVE reports **3 axes** only: `U` / `R` / `F`
- Physical `L` / `D` / `B` share the opposite-face one-hot
- Gyro is orientation, not face disambiguation
- Official-style scrambles are URF-only

## Layout

```
src/          driver
examples/     minimal + timer
docs/         FR + EN
test/         node:test
```

## Compatibility

- Browser: Chromium + Web Bluetooth
- Node: crypto / scramble / cube without BLE; `connect` is browser-only

## License

MIT — [LICENSE](./LICENSE).

Not affiliated with GAN Cube / CubeStation.
