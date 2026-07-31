# Intégration dans un site tiers

Comment brancher **gan2x2UI** (GAN 251 UI / 2×2) dans une app web existante (timer, training, dashboard…).

Prérequis navigateur : **Chrome / Edge** desktop (Web Bluetooth), page en `https://` ou `http://localhost`.

## Install

```bash
npm i gan2x2ui
# ou clone local
npm i /chemin/vers/gan2x2UI
```

ESM natif, zéro dépendance runtime.

```js
import { Gan2x2UI, scramble2x2Official, mergeMoves } from "gan2x2ui";
```

Bundlers (Vite, Next, Webpack) : si besoin,

```js
// next.config / vite
transpilePackages: ["gan2x2ui"] // Next
```

Le connect BLE **doit** tourner côté client uniquement (`"use client"`, pas de SSR).

## Flux minimal

```js
const cube = await Gan2x2UI.connect({
  mac: "AA:BB:CC:DD:EE:FF", // ta MAC hardware
  resetOnConnect: true,      // pose actuelle = résolu
});

cube.on("move", ({ move, state, solved }) => {
  console.log(move, solved);
});

cube.on("gyro", ({ quaternion }) => {
  // orientation 3D
});

cube.on("battery", ({ level }) => {});
cube.on("disconnect", () => {});

await cube.send("BATTERY");
await cube.disconnect();
```

`Gan2x2UI.connect` ouvre le picker Bluetooth : à appeler depuis un **clic utilisateur**.

## MAC

La crypto ProtocolV3-2 dérive KEY/IV depuis la **MAC** hardware.  
Web Bluetooth ne l’expose pas nativement.

**Comment la trouver (Windows/Linux/Android)** :  
`chrome://bluetooth-internals/#devices` → Address (cube allumé).  
Sur macOS cette valeur est souvent fausse — préférer advertisement / saisie manuelle.

Options UX app :

1. Champ texte (1ʳᵉ fois).
2. Cache `localStorage` par nom de device.
3. `watchAdvertisements()` + manufacturer data (flag Chrome experimental) — voir gist GAN MAC FAQ.

Sans MAC correcte → decrypt KO.

## Détection device

Préfixes observés : `gan251ui_`, `ganic251_`.

```js
function isGan251Ui(name) {
  const n = (name || "").toLowerCase();
  return n.startsWith("gan251ui") || n.startsWith("ganic251");
}
```

Si ton site gère déjà d’autres smart cubes (GAN 3×3, Giiker, etc.) : route le 251 UI vers **gan2x2UI**, pas vers un driver Gen4/3×3 générique (clés / framing différents).

## Pattern timer (recommandé)

Même logique que `examples/timer.html` :

1. **Connect** + cube physiquement résolu (blanc ↑ vert →) → `resetOnConnect`.
2. Générer un scramble URF : `scramble2x2Official()` (aligné firmware).
3. Pendant le mélange :
   - `cube.applyMoves = false`
   - faire avancer un modèle local / viewer selon le **scramble**, pas le flux HW brut
   - orientation 3D **fixée** (blanc ↑ vert →), gyro off
4. Scramble terminé → inspection 15 s.
5. 1ʳᵉ `move` → start chrono.
6. `solved === true` → stop.
7. Reconstruction : `mergeMoves(rawMoves)` (`U U` → `U2`).

```js
const raw = [];
cube.on("move", (e) => {
  raw.push(e.move);
  const reco = mergeMoves(raw); // HTM
});
```

## Viewer 3D

- **TwistyPlayer** (`cubing/twisty`, puzzle `2x2x2`) pour replay.
- Ou Three.js custom (voir l’exemple timer).
- Ne réutilise pas un pipeline facelets **3×3 (54 stickers)** tel quel : le modèle natif est **CP/CO** (`Cube2x2`).

Gyro = quaternion d’orientation seulement. **Ne mappe pas** les lettres de moves via le gyro (firmware = axes U/R/F).

## Checklist intégration

- [ ] Import client-only
- [ ] MAC + `Gan2x2UI.connect` sur geste user
- [ ] `resetOnConnect` ou `markSolved()`
- [ ] Scramble URF + `applyMoves = false` pendant mélange
- [ ] Timer : insp → 1er move → stop on solved
- [ ] Reco via `mergeMoves`
- [ ] Viewer 2×2 (pas facelets 3×3)
- [ ] Message d’erreur si pas Web Bluetooth

## Exemples dans ce repo

```bash
npm run serve
# http://localhost:8080/examples/minimal.html
# http://localhost:8080/examples/timer.html
```
