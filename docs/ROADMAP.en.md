# Roadmap

The lib is **complete** for wiring a GAN 251 UI: connect, crypto, moves, state, gyro, battery, URF scramble, auto MAC.

## Done

- GATT driver + ProtocolV3-2
- Events `move` / `facelets` / `gyro` / `battery` / `disconnect`
- `Cube2x2`, `scramble2x2Official`, `mergeMoves`
- Auto MAC (ads) + cache
- FR + EN docs, examples

## Next (packaging)

- ~~Publish npm `gan2x2ui`~~ → **[gan2x2ui@0.1.0](https://www.npmjs.com/package/gan2x2ui)**
- (optional) `.d.ts` if a TS consumer needs it

No timer / AO5 / UI features here — this is a lib; the rest lives in the app.

[Français](./ROADMAP.fr.md)
