# Roadmap — features to add

Prioritized for the lib + third-party site integrations.  
*(S = small, M = medium, L = large)*

## P0 — Web timer-style integration

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 1 | Documented React hook / adapter | M | move / solved / disconnect |
| 2 | `gan251ui_` / `ganic251_` detection helpers | S | Avoid wrong driver |
| 3 | Timer guide: scramble → insp → stop | S | Already in `examples/timer.html` + INTEGRATION |
| 4 | HTM `mergeMoves` + tests | S | Done |
| 5 | Twisty 2×2 replay example | M | Partial in timer |

## P1 — Lib DX

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 6 | TypeScript types (`.d.ts` or TS rewrite) | M | Typed apps |
| 7 | `npm` publish + CI (`npm test`) | S | GitHub Actions |
| 8 | BLE `namePrefix` filters | S | Picker UX |
| 9 | MAC cache helper (`localStorage`) | S | First-connect DX |
| 10 | Minimal React example | S | Vite/Next snippet |
| 10b | Optional auto-MAC via advertisements | M | Needs Chrome experimental flag |

## P2 — Timer / cube product

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 11 | AO5 / AO12 helpers | S | Session stats |
| 12 | Inspection +2 / DNF utils | S | Already in example |
| 13 | Scramble verify (ignore wrong face) | S | Already in timer.html |
| 14 | Timed replay (`cubeTimestamp`) | M | On MOVE events |
| 15 | CS Timer / Twizzle export | S | scramble + reco |
| 16 | Reconnect last device (`getDevices`) | M | Chrome only |

## P3 — Protocol / hard

| # | Feature | Effort | Notes |
|---|---------|--------|-------|
| 17 | HISTORY `0xD1` recovery after BLE drop | M | Partial parse |
| 18 | Battery helpers + low-bat event | S | `battery` event |
| 19 | Keep-alive / anti-sleep disconnect | M | Firmware-dependent |
| 20 | Other GAN 2×2 matrix (same V3-2) | M | Device tests |

## P4 — Nice to have

| # | Feature | Effort |
|---|---------|--------|
| 22 | Reusable orientation calib UI | S |
| 23 | FR + EN docs | S | **Done** |
| 24 | CDN bundle (esm.sh / unpkg) | S |
| 25 | Twisty visual regression | M |

## Non-goals

- Inventing `L`/`D`/`B` moves from gyro.
- Replacing existing 3×3 drivers in apps.
- Firefox / Safari support (no usable Web Bluetooth).

## Suggested order

1. **Wave A**: #1 #2 #6 #8 #9 → easy drop-in for a third-party site  
2. **Wave B**: #5 #7 #14 #15 → polish + npm publish

[Français](./ROADMAP.fr.md)
