# gan2x2UI

**Français** · [English](./README.en.md)

Driver **Web Bluetooth** open-source pour le **GAN 251 UI** (smart 2×2).

Chrome / Edge desktop · `localhost` ou HTTPS · ESM natif, zéro dépendance.

```js
import { Gan2x2UI, scramble2x2Official, mergeMoves } from "gan2x2ui";

// MAC auto via BLE advertisements (flag Chrome experimental)
const cube = await Gan2x2UI.connect();
// ou forcer : await Gan2x2UI.connect({ mac: "AA:BB:CC:DD:EE:FF" });

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

## MAC — auto via advertisements

WebBT ne donne **pas** la MAC au GATT. La crypto GAN en a besoin → on la lit dans le **Manufacturer Specific Data** des ads BLE (derniers 6 octets, convention GAN/csTimer).

```js
const cube = await Gan2x2UI.connect(); // auto
console.log(cube.mac, cube.macSource); // "aa:bb:…" / "advertisement"
```

### Obligatoire pour la MAC auto

Sans ça, `watchAdvertisements()` est mort et le connect auto échoue :

1. Ouvre `chrome://flags/#enable-experimental-web-platform-features`
2. Passe à **Enabled**
3. **Relance Chrome** complètement
4. (Si toujours KO) aussi `chrome://flags/#enable-web-bluetooth-new-permissions-backend` → Enabled

Bluefy iOS : Settings → **Enable BLE Advertisements**.

Fallback ladder : `opts.mac` → advertisements → nom 12-hex → `localStorage` cache.

Sans flag / timeout → erreur claire, ou passe `mac` à la main (`chrome://bluetooth-internals/#devices` sur Win/Linux/Android).

## Quick start

```bash
npm run serve
# → http://localhost:8080/examples/minimal.html
# → http://localhost:8080/examples/timer.html
```

- Intégration : [`docs/INTEGRATION.fr.md`](./docs/INTEGRATION.fr.md) · [EN](./docs/INTEGRATION.en.md)
- Protocole : [`docs/PROTOCOL.fr.md`](./docs/PROTOCOL.fr.md) · [EN](./docs/PROTOCOL.en.md)
- Roadmap : [`docs/ROADMAP.fr.md`](./docs/ROADMAP.fr.md) · [EN](./docs/ROADMAP.en.md)

1. **Chrome** + flag experimental **obligatoire** pour MAC auto (voir section MAC).
2. Cube allumé, **blanc ↑ / vert →**.
3. Connect (champ MAC vide = auto) → `RESET` = pose actuelle résolue.
4. Bouge le cube.

## API

### `Gan2x2UI.connect(opts)`

| Option | Défaut | |
|--------|--------|--|
| `mac` | auto | MAC Bluetooth — omis = advertisements |
| `autoMac` | `true` | Lit manufacturer data si pas de `mac` |
| `macTimeoutMs` | `10000` | Timeout ads |
| `cacheMac` | `true` | Persist `localStorage` |
| `resetOnConnect` | `true` | `RESET` + modèle local résolu |
| `requestFacelets` | `true` | Si pas de reset |
| `preferAltTx` | `false` | Write sur `fff7` |
| `device` | — | `BluetoothDevice` déjà choisi |

### Events

| Event | Payload utile |
|-------|----------------|
| `connect` | `{ name, mac, macSource, key, solved }` |
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

| Export | Rôle |
|--------|------|
| `Cube2x2` | Modèle CP/CO |
| `scramble2x2Official()` | Scramble random-state URF |
| `mergeMoves(list)` | `U U`→`U2`, `F' F'`→`F2` |
| `parseAlg` / `invertAlg` / `applyAlg` | Utils |
| `OrientationTracker` | Gyro → quat display |

### Bas niveau

`decodePacket`, `encodeCommand`, `deriveKeyIv`, `ganCrypt`, `FACE_ONEHOT` — voir docs protocole.

## Limites firmware

Comme CubeStation :

- MOVE = **3 axes** `U` / `R` / `F` seulement
- `L` / `D` / `B` physiques → one-hot de la face opposée
- Gyro = orientation, pas discrimination de face
- Scrambles URF only

## Structure

```
src/          driver
examples/     minimal + timer
docs/         FR + EN
test/         node:test
```

## Compatibilité

- Navigateur : Chromium + Web Bluetooth
- Node : crypto / scramble / cube sans BLE ; `connect` = navigateur only

## License

MIT — [LICENSE](./LICENSE).

Non affilié à GAN Cube / CubeStation.
