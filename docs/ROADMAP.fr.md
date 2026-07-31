# Roadmap

La lib est **complète** pour brancher un GAN 251 UI : connect, crypto, moves, état, gyro, battery, scramble URF, MAC auto.

## Done

- Driver GATT + ProtocolV3-2
- Events `move` / `facelets` / `gyro` / `battery` / `disconnect`
- `Cube2x2`, `scramble2x2Official`, `mergeMoves`
- MAC auto (ads) + cache
- Docs FR + EN, examples

## Next (packaging)

- ~~Publish npm `gan2x2ui`~~ → **[gan2x2ui@0.1.0](https://www.npmjs.com/package/gan2x2ui)**
- (optionnel) `.d.ts` si un conso TS le demande

Pas de feature timer / AO5 / UI ici — c’est une lib, le reste va dans l’app.

[English](./ROADMAP.en.md)
