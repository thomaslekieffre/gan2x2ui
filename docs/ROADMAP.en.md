# Roadmap

WebBT lib for GAN 251 UI — not a timer / app.

## Done

- GATT driver + ProtocolV3-2 crypto
- MOVE / FACELETS / GYRO / BATTERY / RESET
- `Cube2x2`, official URF scrambles, `mergeMoves`
- Auto MAC (ads) + `localStorage` cache
- FR + EN docs, `minimal` / `timer` examples

## Next

| | |
|--|--|
| **npm publish** | public `gan2x2ui` (+ CI `npm test`) |
| **Types** | `.d.ts` for TS consumers |
| **BLE filters** | `namePrefix` `gan251ui` / `ganic251` instead of `acceptAllDevices` |

## Maybe

- Reconnect via `getDevices()`
- CDN bundle (esm.sh / unpkg) once published
- Other GAN 2×2 on same V3-2 if someone tests

## Non-goals

- Timer features (AO5, insp DNF, Twizzle…) → app-side, not here
- Inventing `L`/`D`/`B` from gyro
- Firefox / Safari

[Français](./ROADMAP.fr.md)
