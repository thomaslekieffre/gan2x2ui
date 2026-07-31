# gan2x2UI

**Français** · [English](./README.en.md)

Driver **Web Bluetooth** open-source pour le **GAN 251 UI** (smart 2×2).

Lib **complète** : connect, crypto, moves, état CP/CO, gyro, battery, scramble URF, MAC auto.  
À toi de brancher timer / UI / training dans ton app.

Chrome / Edge desktop · `localhost` ou HTTPS · ESM natif · **zéro dépendance**.

```js
import { Gan2x2UI, scramble2x2Official, mergeMoves } from "gan2x2ui";

const cube = await Gan2x2UI.connect(); // MAC auto (flag Chrome — voir plus bas)
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

Clone local :

```js
import { Gan2x2UI } from "./src/index.js";
```

## MAC auto — flag Chrome obligatoire

WebBT ne donne **pas** la MAC au GATT. La crypto GAN en a besoin → Manufacturer Specific Data des ads BLE.

```js
const cube = await Gan2x2UI.connect();
console.log(cube.mac, cube.macSource); // "aa:bb:…" · "advertisement"
```

1. `chrome://flags/#enable-experimental-web-platform-features` → **Enabled**
2. **Relance Chrome**
3. Si KO : aussi `chrome://flags/#enable-web-bluetooth-new-permissions-backend`

Bluefy iOS : **Enable BLE Advertisements**.

Fallback : `opts.mac` → nom 12-hex → `localStorage` → sinon saisie (`chrome://bluetooth-internals/#devices`).  
Ne commit **jamais** une vraie MAC.

## Quick start

```bash
npm test
npm run serve
# → http://localhost:8080/examples/minimal.html
# → http://localhost:8080/examples/timer.html
```

1. Chrome + flag (MAC auto)
2. Cube allumé, **blanc ↑ / vert →**
3. Connect → tourne

## Docs

| | FR | EN |
|--|----|----|
| Intégration site | [INTEGRATION.fr](./docs/INTEGRATION.fr.md) | [EN](./docs/INTEGRATION.en.md) |
| Protocole BLE | [PROTOCOL.fr](./docs/PROTOCOL.fr.md) | [EN](./docs/PROTOCOL.en.md) |
| Roadmap | [ROADMAP.fr](./docs/ROADMAP.fr.md) | [EN](./docs/ROADMAP.en.md) |
| Contribuer | [CONTRIBUTING](./CONTRIBUTING.md) | [EN](./CONTRIBUTING.en.md) |

## API

### `Gan2x2UI.connect(opts)`

| Option | Défaut | |
|--------|--------|--|
| `mac` | auto | omis = advertisements |
| `autoMac` | `true` | |
| `macTimeoutMs` | `10000` | |
| `cacheMac` | `true` | `localStorage` |
| `resetOnConnect` | `true` | `RESET` + modèle résolu |
| `requestFacelets` | `true` | si pas de reset |
| `preferAltTx` | `false` | write `fff7` |
| `device` | — | device déjà choisi |

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
cube.applyMoves = false; // scramble piloté par l’UI
await cube.disconnect();
```

### Helpers

| Export | |
|--------|--|
| `Cube2x2` | modèle CP/CO |
| `scramble2x2Official()` | scramble URF |
| `mergeMoves` | reco HTM |
| `parseAlg` / `invertAlg` / `applyAlg` | |
| `OrientationTracker` | gyro → display |
| `resolveMac` / `deriveKeyIv` / `decodePacket` | bas niveau |

## Limites firmware (comme CubeStation)

- MOVE = **U / R / F** seulement
- `L` / `D` / `B` physiques → one-hot face opposée
- Gyro = orientation, pas discrimination de face
- Scrambles officiels = URF

## Compat

- Navigateur : Chromium + Web Bluetooth
- Node : crypto / scramble / cube OK ; `connect` = navigateur only

## License

MIT — [LICENSE](./LICENSE).  
Non affilié à GAN Cube / CubeStation.
