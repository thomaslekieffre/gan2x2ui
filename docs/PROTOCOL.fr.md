# Notes protocole — GAN 251 UI

Reverse-engineering CubeStation 6.6 (`GanSDK_ProtocolV3-2`).

## BLE

| | UUID |
|---|---|
| Service | `00000010-0000-fff7-fff6-fff5fff4fff0` |
| Notify (RX) | `fff6` |
| Write (TX) | `fff5` (fallback `fff7`) |

Préfixes de nom : `gan251ui_`, `ganic251_`.

## Crypto

```
ROOT_KEY = 589861fc1fecd7609f85d362be37172c
ROOT_IV  = 7f61d05275c13952082e541d8a78634d
salt     = octets MAC inversés
key[i]   = (ROOT_KEY[i] + salt[i]) % 255   // i = 0..5
iv[i]    = (ROOT_IV[i]  + salt[i]) % 255
```

AES-128-CBC, framing Gen4 dual-align, frames 20 octets, CRC16 sur les 2 derniers (ignoré pour le parse moves).

**La MAC hardware est obligatoire** pour dériver KEY/IV.  
Web Bluetooth ne la fournit **pas** au `connect()` — saisie manuelle ou lecture via advertisements (flag experimental).

## Events (`bleProtoId`)

| ID | Type | Contenu |
|----|------|---------|
| `0x01` | MOVE | time u32 LE, serial u16 LE, dir 2b + face one-hot 6b `[2,32,8,1,16,4]` → URFDLB |
| `0xED` | FACELETS | CP / CO (coins) |
| `0xEC` | GYRO | quaternion + ω grossier |
| `0xEF` | BATTERY | niveau |
| `0xD1` | HISTORY | moves de recovery |

## Limites firmware (comme CubeStation)

MOVE = **3 axes** (`U` / `R` / `F`) seulement.  
`L` / `D` / `B` physiques partagent le one-hot opposé.  
Gyro = **orientation**, pas discrimination de face.  
Scrambles style officiel en générateurs **URF**.

## Commandes write

| Nom | Préfixe plain |
|------|----------------|
| FACELETS | `DD 04 00 ED …` |
| BATTERY | `DD 04 00 EF …` |
| HARDWARE | `DF 03 00 …` |
| RESET | `D2 0D 05 39 77 …` (pose actuelle = résolu) |

[English](./PROTOCOL.en.md)
