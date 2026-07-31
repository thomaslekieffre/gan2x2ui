# Contributing

[Français](./CONTRIBUTING.md) · **English**

Web Bluetooth lib for the **GAN 251 UI** (2×2). Scope = driver + crypto + model + scramble helpers. Not a timer app.

## Setup

```bash
git clone https://github.com/thomaslekieffre/gan2x2ui.git
cd gan2x2ui
npm test
npm run serve   # http://localhost:8080/examples/
```

Chrome + experimental flag for auto MAC (see README).

## Principles

- **Zero runtime deps** (WebCrypto, no aes-js / RxJS).
- Native ESM under `src/`.
- **FR + EN** docs for any user-facing change.
- **Never** commit a real MAC / personal key.
- Don’t invent `L`/`D`/`B` moves from gyro (firmware URF limit).

## Workflow

1. Fork + branch `fix/…` or `feat/…`
2. `npm test` green
3. Clear PR (why + how to test on a real cube if BLE)
4. One topic per PR

## Repo layout

| Path | |
|------|--|
| `src/` | driver, crypto, protocol, cube, scramble |
| `examples/` | HTML demos |
| `docs/` | integration, protocol, roadmap |
| `test/` | `node:test` |

## Bug reports

GitHub issue with: OS, Chrome version, BLE name (`GAN251Ui_…`), experimental flag on/off, console snippet (**no MAC**).

## License

MIT — by contributing you agree your code is MIT-licensed.
