# Contribuer

**Français** · [English](./CONTRIBUTING.en.md)

Lib Web Bluetooth pour le **GAN 251 UI** (2×2). Scope = driver + crypto + modèle + helpers scramble. Pas une app timer.

## Setup

```bash
git clone https://github.com/thomaslekieffre/gan2x2ui.git
cd gan2x2ui
npm test
npm run serve   # http://localhost:8080/examples/
```

Chrome + flag experimental pour MAC auto (voir README).

## Principes

- **Zéro dépendance runtime** (WebCrypto, pas aes-js / RxJS).
- ESM natif, code dans `src/`.
- Docs **FR + EN** pour tout changement user-facing.
- **Jamais** committer une vraie MAC / clé perso.
- Ne pas inventer des moves `L`/`D`/`B` via le gyro (limite firmware URF).

## Workflow

1. Fork + branche `fix/…` ou `feat/…`
2. `npm test` vert
3. PR claire (pourquoi + comment tester sur cube réel si BLE)
4. Un sujet = une PR

## Zones du repo

| Path | |
|------|--|
| `src/` | driver, crypto, protocole, cube, scramble |
| `examples/` | demos HTML |
| `docs/` | intégration, protocole, roadmap |
| `test/` | `node:test` |

## Signaler un bug

Issue GitHub avec : OS, Chrome version, nom BLE du cube (`GAN251Ui_…`), flag experimental on/off, extrait console (sans MAC).

## License

MIT — en contribuant tu acceptes que ton code soit sous MIT.
