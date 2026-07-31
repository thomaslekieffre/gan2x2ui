# Protocol notes — GAN 251 UI

Reverse-engineered from CubeStation 6.6 (`GanSDK_ProtocolV3-2`).

## BLE

| | UUID |
|---|---|
| Service | `00000010-0000-fff7-fff6-fff5fff4fff0` |
| Notify (RX) | `fff6` |
| Write (TX) | `fff5` (fallback `fff7`) |

Name prefixes: `gan251ui_`, `ganic251_`.

## Crypto

```
ROOT_KEY = 589861fc1fecd7609f85d362be37172c
ROOT_IV  = 7f61d05275c13952082e541d8a78634d
salt     = MAC bytes reversed
key[i]   = (ROOT_KEY[i] + salt[i]) % 255   // i = 0..5
iv[i]    = (ROOT_IV[i]  + salt[i]) % 255
```

AES-128-CBC, Gen4 dual-align framing, 20-byte frames, CRC16 on last 2 bytes (ignored for move parse).

**The hardware MAC is required** to derive KEY/IV.  
Web Bluetooth does **not** expose it on GATT. `Gan2x2UI.connect()` reads it from advertisements  
(**required**: `chrome://flags/#enable-experimental-web-platform-features` → Enabled → restart Chrome),  
else `opts.mac` / cache / manual entry.

## Events (`bleProtoId`)

| ID | Type | Payload |
|----|------|---------|
| `0x01` | MOVE | time u32 LE, serial u16 LE, dir 2b + face one-hot 6b `[2,32,8,1,16,4]` → URFDLB |
| `0xED` | FACELETS | CP / CO (corners) |
| `0xEC` | GYRO | quaternion + coarse ω |
| `0xEF` | BATTERY | level |
| `0xD1` | HISTORY | recovery moves |

## Firmware limits (same as CubeStation)

MOVE reports **3 axes only** (`U` / `R` / `F`).  
Physical `L` / `D` / `B` share the opposite-face one-hot.  
Gyro is for **orientation**, not face discrimination.  
Official-style scrambles use **URF** generators — matches hardware.

## Write commands

| Name | Plain prefix |
|------|----------------|
| FACELETS | `DD 04 00 ED …` |
| BATTERY | `DD 04 00 EF …` |
| HARDWARE | `DF 03 00 …` |
| RESET | `D2 0D 05 39 77 …` (mark current pose solved) |

[Français](./PROTOCOL.fr.md)
