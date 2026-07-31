# Roadmap — features à ajouter

Priorisé pour la lib + intégrations sites tiers.  
*(S = small, M = medium, L = large)*

## P0 — Intégration type timer web

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 1 | Hook / adapter React documenté | M | Events move / solved / disconnect |
| 2 | Helpers détection `gan251ui_` / `ganic251_` | S | Éviter mauvais driver |
| 3 | Guide timer : scramble → insp → chrono → stop | S | Déjà dans `examples/timer.html` + INTEGRATION.md |
| 4 | Reco HTM `mergeMoves` export + tests | S | Done |
| 5 | Exemple Twisty 2×2 replay | M | Partiel dans timer |

## P1 — DX lib

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 6 | Types TypeScript (`.d.ts` ou rewrite TS) | M | Conso par apps typées |
| 7 | `npm` publish + CI (`npm test`) | S | GitHub Actions |
| 8 | Filtres BLE `namePrefix` (moins d’`acceptAllDevices`) | S | UX picker |
| 9 | Helper cache MAC (`localStorage`) | S | **Done** (`src/mac.js`) |
| 10 | Exemple React minimal | S | Vite/Next snippet |
| 10b | Auto-MAC via advertisements | M | **Done** — flag Chrome experimental obligatoire |

## P2 — Produit timer / cube

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 11 | AO5 / AO12 helpers | S | Stats session |
| 12 | Inspection +2 / DNF utils | S | Déjà dans l’exemple |
| 13 | Scramble verify (ignore wrong face) | S | Déjà dans timer.html |
| 14 | Replay timed (`cubeTimestamp`) | M | Sur events MOVE |
| 15 | Export CS Timer / Twizzle URL | S | scramble + reco |
| 16 | Reconnect last device (`getDevices`) | M | Chrome only |

## P3 — Protocol / hard

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 17 | HISTORY `0xD1` recovery après drop BLE | M | Parse partiel |
| 18 | Battery helpers + low-bat event | S | Event `battery` |
| 19 | Keep-alive / anti-sleep disconnect | M | Suivant firmware |
| 20 | Matrice autres 2×2 GAN (même V3-2) | M | Tests devices |

## P4 — Nice to have

| # | Feature | Effort |
|---|---------|--------|
| 22 | UI calib orientation (blanc↑ vert→) réutilisable | S |
| 23 | Doc EN + FR | S | **Done** |
| 24 | Bundle CDN (esm.sh / unpkg) | S |
| 25 | Visual regression Twisty | M |

## Non-goals

- Inventer des moves `L`/`D`/`B` depuis le gyro.
- Remplacer les drivers 3×3 existants des apps.
- Support Firefox / Safari (pas de Web Bluetooth utilisable).

## Ordre suggéré

1. **Vague A** : #1 #2 #6 #8 #9 → drop-in facile pour un site tiers  
2. **Vague B** : #5 #7 #14 #15 → polish + publish npm

[English](./ROADMAP.en.md)
