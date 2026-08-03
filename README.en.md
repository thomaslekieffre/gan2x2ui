# gan2x2UI

[Français](./README.md) · **English**

Open-source **Web Bluetooth** driver for the **GAN 251 UI** (smart 2×2).

**Complete** lib: connect, crypto, moves, CP/CO state, gyro, battery, URF scramble, auto MAC.  
Wire your own timer / UI / training in the app.

Chrome / Edge desktop · `localhost` or HTTPS · native ESM · **zero runtime deps**.

```js
import { Gan2x2UI, scramble2x2Official, mergeMoves } from "gan2x2ui";

const cube = await Gan2x2UI.connect(); // auto MAC (Chrome flag — below)
cube.on("move", ({ move, solved }) => console.log(move, solved));
cube.on("gyro", ({ quaternion }) => {});
cube.on("battery", ({ level }) => console.log(level));

const { scramble, dist } = scramble2x2Official();
```

## Install

```bash
npm i gan2x2ui
pnpm add gan2x2ui
```

https://www.npmjs.com/package/gan2x2ui

Local clone:

```js
import { Gan2x2UI } from "./src/index.js";
```

## Auto MAC — Chrome flag required

WebBT does **not** expose the MAC on GATT. GAN crypto needs it → BLE advertisement Manufacturer Specific Data.

```js
const cube = await Gan2x2UI.connect();
console.log(cube.mac, cube.macSource); // "aa:bb:…" · "advertisement"
```

1. `chrome://flags/#enable-experimental-web-platform-features` → **Enabled**
2. **Restart Chrome**
3. If still failing: also `chrome://flags/#enable-web-bluetooth-new-permissions-backend`

Bluefy iOS: **Enable BLE Advertisements**.

Fallback: `opts.mac` → 12-hex name → `localStorage` → manual (`chrome://bluetooth-internals/#devices`).  
**Never** commit a real MAC.

## Quick start

```bash
npm test
npm run serve
# → http://localhost:8080/examples/minimal.html
# → http://localhost:8080/examples/timer.html
```

1. Chrome + flag (auto MAC)
2. Cube on, **white ↑ / green →**
3. Connect → turn

## Docs

| | EN | FR |
|--|----|----|
| Integration | [INTEGRATION.en](./docs/INTEGRATION.en.md) | [FR](./docs/INTEGRATION.fr.md) |
| BLE protocol | [PROTOCOL.en](./docs/PROTOCOL.en.md) | [FR](./docs/PROTOCOL.fr.md) |
| Roadmap | [ROADMAP.en](./docs/ROADMAP.en.md) | [FR](./docs/ROADMAP.fr.md) |
| Contributing | [CONTRIBUTING.en](./CONTRIBUTING.en.md) | [FR](./CONTRIBUTING.md) |

## API

### `Gan2x2UI.connect(opts)`

| Option | Default | |
|--------|---------|--|
| `mac` | auto | omit = advertisements |
| `autoMac` | `true` | |
| `macTimeoutMs` | `10000` | |
| `cacheMac` | `true` | `localStorage` |
| `resetOnConnect` | `true` | `RESET` + solved model |
| `requestFacelets` | `true` | if no reset |
| `preferAltTx` | `false` | write `fff7` |
| `device` | — | pre-selected device |

### Events

| Event | Payload |
|-------|---------|
| `connect` | `{ name, mac, macSource, key, solved }` |
| `move` | `{ move, hwMove, serial, state, solved, q, … }` |
| `gyro` | `{ quaternion, vx, vy, vz }` |
| `facelets` | `{ CP, CO, state, solved }` |
| `battery` | `{ level }` |
| `disconnect` | `{}` |
| `error` | `{ error, ct }` |

```js
const off = cube.on("move", handler);
off();
await cube.send("BATTERY"); // FACELETS | BATTERY | HARDWARE | RESET
await cube.markSolved();
cube.applyMoves = false; // UI-driven scramble
await cube.disconnect();
```

### Helpers

| Export | |
|--------|--|
| `Cube2x2` | CP/CO model |
| `scramble2x2Official()` | URF scramble |
| `mergeMoves` | HTM reco |
| `parseAlg` / `invertAlg` / `applyAlg` | |
| `OrientationTracker` | gyro → display |
| `resolveMac` / `deriveKeyIv` / `decodePacket` | low-level |

## Firmware limits (like CubeStation)

- MOVE = **U / R / F** only
- Physical `L` / `D` / `B` → opposite-face one-hot
- Gyro = orientation, not face disambiguation
- Official scrambles = URF

## Used by

- **[csTimer](https://github.com/cs0x7f/cstimer)** — GAN 251 UI (2×2) Bluetooth support, PR [#551](https://github.com/cs0x7f/cstimer/pull/551) (vendored as an IIFE in the csTimer repo)

## Compat

- Browser: Chromium + Web Bluetooth
- Node: crypto / scramble / cube OK; `connect` = browser only

## Author

Created and maintained by **[Thomas Lekieffre](https://github.com/thomaslekieffre)** — reverse of the GAN 251 UI protocol (ProtocolV3-2) and open-source Web Bluetooth driver.

## License

MIT — [LICENSE](./LICENSE) · © 2026 Thomas Lekieffre  

Not affiliated with GAN Cube / CubeStation.
