# gan2x2UI

[Français](./README.md) · **English**

Open-source **Web Bluetooth** driver for the **GAN 251 UI** (smart 2×2).

Chrome / Edge desktop · `localhost` or HTTPS · native ESM, zero runtime deps.

```js
import { Gan2x2UI, scramble2x2Official, mergeMoves } from "gan2x2ui";

// Auto MAC from BLE advertisements (Chrome experimental flag)
const cube = await Gan2x2UI.connect();
// or force: await Gan2x2UI.connect({ mac: "AA:BB:CC:DD:EE:FF" });

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

## MAC — auto via advertisements

WebBT does **not** expose the hardware MAC on GATT. GAN crypto needs it → we read **Manufacturer Specific Data** from BLE ads (last 6 bytes, GAN/csTimer convention).

```js
const cube = await Gan2x2UI.connect(); // auto
console.log(cube.mac, cube.macSource); // "aa:bb:…" / "advertisement"
```

### Required for auto MAC

Without this, `watchAdvertisements()` is dead and auto-connect fails:

1. Open `chrome://flags/#enable-experimental-web-platform-features`
2. Set to **Enabled**
3. **Fully restart Chrome**
4. (If still failing) also enable `chrome://flags/#enable-web-bluetooth-new-permissions-backend`

Bluefy iOS: Settings → **Enable BLE Advertisements**.

Fallback ladder: `opts.mac` → advertisements → 12-hex name → `localStorage` cache.

No flag / timeout → clear error, or pass `mac` manually (`chrome://bluetooth-internals/#devices` on Win/Linux/Android).

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

1. **Chrome** + experimental flag **required** for auto MAC (see MAC section).
2. Cube on, **white ↑ / green →**.
3. Connect (empty MAC field = auto) → `RESET` marks current pose solved.
4. Turn the cube.

## API

### `Gan2x2UI.connect(opts)`

| Option | Default | |
|--------|---------|--|
| `mac` | auto | Bluetooth MAC — omit = advertisements |
| `autoMac` | `true` | Read manufacturer data if no `mac` |
| `macTimeoutMs` | `10000` | Ads timeout |
| `cacheMac` | `true` | Persist in `localStorage` |
| `resetOnConnect` | `true` | Firmware `RESET` + local solved model |
| `requestFacelets` | `true` | If not resetting |
| `preferAltTx` | `false` | Write on `fff7` |
| `device` | — | Pre-selected `BluetoothDevice` |

### Events

| Event | Useful payload |
|-------|----------------|
| `connect` | `{ name, mac, macSource, solved }` |
| `move` | `{ move, hwMove, serial, solved, state }` |
| `gyro` | `{ quaternion, vx, vy, vz }` |
| `facelets` | `{ CP, CO, serial, solved, state }` |
| `battery` | `{ level }` |
| `disconnect` | `{}` |
| `error` | `{ error }` |

### Helpers

`Cube2x2`, `scramble2x2Official`, `mergeMoves`, `OrientationTracker`, `resolveMac`, crypto/protocol exports — see `src/index.js`.

## Firmware note (URF)

Like CubeStation: MOVE frames only report **U/R/F**. Physical L/D/B share opposite-face one-hots. Official scrambles are **URF**. Gyro = orientation only.

## License

MIT
