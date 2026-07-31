# gan2x2UI

**Français** · [English](./README.en.md)

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

## MAC — pas auto au connect

**Non :** un `navigator.bluetooth.requestDevice()` / GATT connect **ne fournit pas** la MAC.

Chrome expose un `device.id` opaque (par origine), pas l’adresse hardware.  
Or la crypto GAN a **besoin** de la vraie MAC → tu dois la passer dans `opts.mac`.

| Méthode | Auto ? |
|---------|--------|
| Champ + `localStorage` | Manuel 1× |
| `chrome://bluetooth-internals/#devices` | Manuel (Windows/Linux/Android) |
| `watchAdvertisements()` + manufacturer data | Semi-auto (flag Chrome experimental) |
| Nom BLE contenant la MAC | Rare selon firmware |

**Windows / Linux / Android :** cube allumé → `chrome://bluetooth-internals/#devices` → colonne Address.  
**macOS :** cette page est souvent spoofée → advertisement ou saisie manuelle.

PoC auto : https://gan-mac-poc.stackblitz.io/  
Flag : `chrome://flags/#enable-experimental-web-platform-features`

Ne commit jamais une vraie MAC dans un repo public.

## Quick start

```bash
npm run serve
# → http://localhost:8080/examples/minimal.html
# → http://localhost:8080/examples/timer.html
```

- Intégration : [`docs/INTEGRATION.fr.md`](./docs/INTEGRATION.fr.md) · [EN](./docs/INTEGRATION.en.md)
- Protocole : [`docs/PROTOCOL.fr.md`](./docs/PROTOCOL.fr.md) · [EN](./docs/PROTOCOL.en.md)
- Roadmap : [`docs/ROADMAP.fr.md`](./docs/ROADMAP.fr.md) · [EN](./docs/ROADMAP.en.md)

1. **Chrome** (pas un preview IDE).
2. Cube allumé, **blanc ↑ / vert →**.
3. Colle ta MAC → Connect (`RESET` = pose actuelle résolue).
4. Bouge le cube.

## API

### `Gan2x2UI.connect(opts)`

| Option | Défaut | |
|--------|--------|--|
| `mac` | *requis* | MAC Bluetooth (`AA:BB:CC:DD:EE:FF`) |
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
