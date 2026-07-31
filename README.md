# gan2x2UI

Driver **Web Bluetooth** open-source pour le **GAN 251 UI** (smart 2×2).

Chrome / Edge desktop · `localhost` ou HTTPS · ESM natif, zéro dépendance.

```js
import { Gan2x2UI, scramble2x2Official, mergeMoves } from "gan2x2ui";

const cube = await Gan2x2UI.connect({ mac: "AA:BB:CC:DD:EE:FF" });

cube.on("move", ({ move, hwMove, state }) => {
  console.log(move, state.isSolved());
});

cube.on("gyro", ({ quaternion }) => { /* orientation 3D */ });
cube.on("battery", ({ level }) => console.log(level));

const { scramble, dist } = scramble2x2Official();
console.log(scramble, dist); // ex. "R U R' F2 …"  dist ≥ 4
```

## Install

```bash
npm i gan2x2ui
```

Ou clone + import local :

```js
import { Gan2x2UI } from "./src/index.js";
```

## Quick start (navigateur)

```bash
npm run serve
# → http://localhost:8080/examples/minimal.html
# → http://localhost:8080/examples/timer.html
```

Intégration site tiers : [`docs/INTEGRATION.md`](./docs/INTEGRATION.md)  
Roadmap features : [`docs/ROADMAP.md`](./docs/ROADMAP.md)

1. Ouvre **Chrome** (pas un preview IDE).
2. Cube allumé, tiens **blanc ↑ / vert →**.
3. Connect — l’état actuel est déclaré **résolu** (`RESET`).
4. Bouge le cube.

## API

### `Gan2x2UI.connect(opts)`

| Option | Défaut | |
|--------|--------|--|
| `mac` | *requis* | MAC Bluetooth (`AA:BB:CC:…`) |
| `resetOnConnect` | `true` | `RESET` + modèle local résolu |
| `requestFacelets` | `true` | Si pas de reset |
| `preferAltTx` | `false` | Write sur `fff7` |
| `device` | — | `BluetoothDevice` déjà choisi |

### Events

| Event | Payload utile |
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
off(); // unsubscribe

await cube.send("BATTERY");
await cube.markSolved();
cube.applyMoves = false; // scramble UI-driven
await cube.disconnect();
```

### Cube & scramble

| Export | Rôle |
|--------|------|
| `Cube2x2` | Modèle CP/CO, `applyMove`, `isSolved`, `findMoveTo` |
| `scramble2x2Official()` | Random-state URF (WCA-style), `{ scramble, dist, state }` |
| `mergeMoves(list)` | HTM compress — `U U`→`U2`, `F' F'`→`F2`, `R R'`→∅ |
| `parseAlg` / `invertAlg` / `applyAlg` | Utilitaires alg |
| `OrientationTracker` | Gyro → quat display après calib blanc↑ vert→ |

### Algos / apprentissage (CLL, …)

Firmware = `U/R/F` only. Pour des algos avec `L/D/B` :

| Export | Rôle |
|--------|------|
| `CaseSession` | Setup cas → `sync(CP,CO)` → `done` par **état** |
| `toURF(alg)` | Réécrit en URF (follow-along BLE) |
| `expandAlg(alg)` | `y R` → `F` |
| `detectMove(a,b)` | Infère `L`/`D`/`B` via diff d’état |
| `matchesAlg(before, after, alg)` | Vérifie l’effet |

```js
import { CaseSession, toURF } from "gan2x2ui";

const session = new CaseSession();
session.setupCase(scrambleVersLeCas);
cube.on("facelets", ({ CP, CO }) => {
  const { done, lastInferred } = session.sync(CP, CO);
  // lastInferred peut être "L" même si le BLE dit "R"
  if (done) console.log("cas OK");
});
toURF("L U L' U'"); // { urf, dist }
```

### Bas niveau

`decodePacket`, `encodeCommand`, `deriveKeyIv`, `ganCrypt`, `FACE_ONEHOT`, …  
Voir [`docs/PROTOCOL.md`](./docs/PROTOCOL.md).

## Limites firmware (important)

Le GAN 251 UI se comporte **comme CubeStation** :

- Les MOVE BLE n’encodent que **3 axes** : `U`, `R`, `F`.
- Un tour physique sur `L` / `D` / `B` remonte comme la face opposée.
- Le **gyro** sert à l’orientation 3D, **pas** à reconstruire L/D/B.
- Les scrambles officiels sont en générateurs **URF** → alignés avec le hardware.

Pour un timer / scramble : fixe le 3D en blanc↑ vert→ pendant le mélange, et fais suivre l’état 3D au scramble (pas au flux HW brut). L’exemple `examples/timer.html` montre le pattern.

## Structure

```
src/
  index.js          API publique
  connect.js        Gan2x2UI (GATT + events)
  crypto.js         AES-128-CBC + dérivation MAC
  ble_protocol.js   parse / encode frames
  cube2x2.js        modèle 2×2
  scramble.js       scramble + mergeMoves
  orientation.js    gyro → Three.js
examples/
  minimal.html      hello world BLE
  timer.html        timer type CubeStation + Twisty replay
docs/
  PROTOCOL.md       notes reverse BLE / crypto
```

## Compatibilité

- Navigateur : Chromium + Web Bluetooth (Windows / macOS / Android Chrome).
- Node : crypto / scramble / cube utilisables sans BLE ; `Gan2x2UI.connect` nécessite un navigateur.

## License

MIT — voir [LICENSE](./LICENSE).

Protocole inspiré de CubeStation / Gen4 ; clés ProtocolV3-2 extraites pour interopérabilité avec le hardware GAN. Non affilié à GAN Cube / CubeStation.
