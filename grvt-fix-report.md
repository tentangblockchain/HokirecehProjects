# GRVT Fix Report

**Tanggal:** 2026-04-07  
**Berdasarkan:** audit-grvt.md

---

## File yang Diubah

| File | Lokasi |
|---|---|
| `grvtTypes.ts` | `artifacts/api-server/src/lib/grvt/grvtTypes.ts` |
| `grvtAuth.ts` | `artifacts/api-server/src/lib/grvt/grvtAuth.ts` |
| `grvtMarket.ts` | `artifacts/api-server/src/lib/grvt/grvtMarket.ts` |
| `grvtTrade.ts` | `artifacts/api-server/src/lib/grvt/grvtTrade.ts` |
| `grvtWs.ts` | `artifacts/api-server/src/lib/grvt/grvtWs.ts` |

File yang **TIDAK** diubah (sesuai aturan keselamatan):
- `grvtAccount.ts` — tidak ada perubahan kritis, otomatis benefit dari perbaikan auth headers
- `routes/grvt/bot.ts` — tidak ada perubahan diperlukan
- Semua file Ethereal, Extended, Lighter — tidak disentuh

---

## Ringkasan Perbaikan per Issue

### CRITICAL-1 — Auth URL salah (api.grvt.io → edge.grvt.io)

**File:** `grvtTypes.ts`, `grvtAuth.ts`

**Perbaikan:**
- Ditambahkan konstanta baru `GRVT_AUTH_URLS` di `grvtTypes.ts`:
  ```typescript
  export const GRVT_AUTH_URLS: Record<GrvtNetwork, string> = {
    mainnet: "https://edge.grvt.io",
    testnet: "https://edge.testnet.grvt.io",
  };
  ```
- `grvtAuth.ts` sekarang menggunakan `GRVT_AUTH_URLS` (bukan `GRVT_REST_URLS`) untuk semua request auth.
- `GRVT_REST_URLS` tetap untuk market data & trading (api.grvt.io).

---

### CRITICAL-2 — Cookie ada di HTTP header, bukan JSON body

**File:** `grvtAuth.ts`

**Perbaikan:**
- `fetch()` diganti dengan `https.request()` (Node.js native) agar bisa membaca `Set-Cookie` response header langsung.
- Fungsi baru `rawHttpPost()` melakukan POST request dan mengembalikan `{ statusCode, headers, body }`.
- Fungsi `extractGravityCookie()` mengekstrak `gravity=...` dari array `Set-Cookie` header.
- `accountId` diekstrak dari header `X-Grvt-Account-Id`.
- Jika cookie kosong, throw error eksplisit (tidak silent fallback ke string kosong).

---

### CRITICAL-3 — GrvtAuthSession tidak menyimpan accountId

**File:** `grvtTypes.ts`, `grvtAuth.ts`

**Perbaikan:**
- Ditambahkan field `accountId: string` ke interface `GrvtAuthSession`.
- `loginWithApiKey()` dan `loginWithWallet()` sekarang mengisi `session.accountId` dari header `X-Grvt-Account-Id`.

---

### CRITICAL-4 — buildGrvtAuthHeaders() tidak menyertakan X-Grvt-Account-Id

**File:** `grvtAuth.ts`

**Perbaikan:**
- `buildGrvtAuthHeaders()` sekarang menambahkan header `X-Grvt-Account-Id` jika `session.accountId` ada:
  ```typescript
  if (session.accountId) {
    headers["X-Grvt-Account-Id"] = session.accountId;
  }
  ```
- Semua authenticated request (trade, account) otomatis mendapat header ini.

---

### CRITICAL-5 — Wallet Login EIP-712: struct dan request body salah

**File:** `grvtAuth.ts`, `grvtTypes.ts`

**Perbaikan:**
- EIP-712 struct diubah dari `{ nonce: string }` ke `WalletLogin { signer: address, nonce: uint32, expiration: int64 }`.
- Nonce: random uint32 (`Math.floor(Math.random() * 0xFFFFFFFF)`).
- Expiration: `now + 5 menit` dalam nanoseconds menggunakan BigInt.
- Request body baru: `{ address, signature: { signer, v, r, s, nonce, expiration, chain_id } }`.
- Interface `GrvtWalletLoginRequest` di types diperbarui sesuai struktur baru.

---

### CRITICAL-6 — GrvtSignature tidak memiliki field chain_id

**File:** `grvtTypes.ts`, `grvtTrade.ts`

**Perbaikan:**
- Ditambahkan `chain_id: string` ke interface `GrvtSignature`.
- `signGrvtOrder()` sekarang mengisi `chain_id: String(domain.chainId)` di signature yang dikembalikan.

---

### CRITICAL-7 — WebSocket subscribe format dan message handler salah

**File:** `grvtWs.ts`, `grvtTypes.ts`

**Perbaikan di `grvtTypes.ts`:**
- `GRVT_WS_URLS` diperbarui dengan path `/ws/full`:
  ```typescript
  mainnet: "wss://stream.grvt.io/ws/full",
  testnet: "wss://stream.testnet.grvt.io/ws/full",
  ```

**Perbaikan di `grvtWs.ts`:**
- Format subscribe diubah dari JSON-RPC ke:
  ```json
  { "stream": "v1.mini.s", "feed": ["BTC_USDT_Perp"], "method": "subscribe", "is_full": true }
  ```
- Stream names baru: `v1.mini.s`, `v1.mini.d`, `v1.book.s`, `v1.book.d`, `v1.trade.s`, `v1.trade.d`.
- `handleMessage()` sekarang menangani:
  - **Subscription confirmation**: deteksi field `subs` → log konfirmasi.
  - **Data event**: deteksi field `stream`, `selector`, `feed` → dispatch ke callback yang sesuai.
- **Authenticated WebSocket**: `connect()` menerima parameter `session?`, menambahkan header `Cookie` dan `X-Grvt-Account-Id` saat koneksi.
- Tracking feed per stream type menggunakan `miniTickerFeeds`, `orderbookFeeds`, `tradeFeeds` (Set<string>) — menggantikan `subscribedStreams` lama.
- Ditambahkan `setGrvtWsSession()` untuk menyimpan session module-level sebelum koneksi WS.

---

### HIGH-1 — Market data endpoint: GET → POST + tambah prefix /full/

**File:** `grvtMarket.ts`

**Perbaikan:**
- Semua endpoint sekarang menggunakan method POST.
- Ditambahkan prefix `/full/` ke semua path:
  - `GET /v1/instruments` → `POST /full/v1/instruments` (body: `{}`)
  - `POST /v1/mini` → `POST /full/v1/mini` (body: `{ instrument }` atau `{}`)
  - `POST /v1/trades` → `POST /full/v1/trades` (body: `{ instrument, limit }`)
- Fungsi `grvtFetch()` disederhanakan: selalu POST, body sebagai parameter.

---

### HIGH-2 — generateExpiry() menggunakan Number, bukan BigInt nanoseconds

**File:** `grvtTrade.ts`

**Perbaikan:**
- `generateExpiry()` diubah ke:
  ```typescript
  function generateExpiry(daysFromNow = 30): string {
    const nowNs = BigInt(Date.now()) * 1_000_000n;
    const daysNs = BigInt(daysFromNow) * 24n * 60n * 60n * 1_000_000_000n;
    return String(nowNs + daysNs);
  }
  ```
- Menghindari precision loss yang terjadi saat menggunakan `Number` untuk nanoseconds.

---

### HIGH-3 — client_order_id menggunakan range yang overlap dengan GRVT UI

**File:** `grvtTrade.ts`

**Perbaikan:**
- `clientOrderID` di EIP-712 types diubah dari `uint32` ke `uint64`.
- Ditambahkan fungsi `generateClientOrderId()` yang menggunakan range `[2^63, 2^64-1]`:
  ```typescript
  function generateClientOrderId(nonce: number): bigint {
    return (BigInt(Date.now()) << 20n) | (BigInt(nonce) & 0xFFFFFn);
  }
  ```
- Menghindari konflik `overlappingClientOrderId` dengan GRVT UI orders.

---

## Fix Tambahan (Post-Deploy VPS)

Error yang baru terdeteksi saat VPS menjalankan TypeScript strict check setelah db di-build:

### FIX-A — groqAI.ts: "grvt" tidak ada di union type MarketContext.exchange

**File:** `src/lib/groqAI.ts`

**Masalah:** Interface `MarketContext` mendefinisikan `exchange: "lighter" | "extended" | "ethereal"` — tidak termasuk `"grvt"`. Ketika `routes/ai.ts` memanggil `analyzeMarketForStrategy({ exchange: "grvt", ... })`, TypeScript error `TS2322`.

**Perbaikan:**
- Ditambahkan `"grvt"` ke union type di `MarketContext.exchange`
- Ditambahkan case `"grvt"` di `exchangeLabel`: `"GRVT Exchange (ZK perp DEX)"`
- Ditambahkan case `"grvt"` di `feeContext`: `"Maker fee 0.02%, Taker fee 0.05% — always use LIMIT/Post-Only"`
- Ditambahkan case `"grvt"` di `systemPrompt` (menggunakan `LIGHTER_SYSTEM_PROMPT` sebagai baseline perp DEX)
- Ditambahkan case `"grvt"` di `limitPriceOffset` (default `0.2` untuk DCA, `0.1` untuk Grid)

### FIX-B — routes/grvt/bot.ts: req.params bertipe string | string[]

**File:** `src/routes/grvt/bot.ts`

**Masalah:** Express `req.params.instrument` bertipe `string | string[]`, tapi `getMiniTicker(instrument, network)` hanya menerima `string`. TypeScript error `TS2345`.

**Perbaikan:**
```typescript
// Sebelum:
const { instrument } = req.params;
// Sesudah:
const instrument = String(req.params.instrument);
```

---

## Hasil TypeScript Build

**Status: SUKSES ✅**

```
pnpm --filter @workspace/api-server run build
→ ⚡ Done in 2113ms (0 errors)
```

**Hasil tsc --noEmit untuk file lib/grvt:**
```
No errors in lib/grvt files
```

**Error di luar GRVT (pre-existing, tidak diubah):**
- `src/routes/grvt/bot.ts`: 2x `TS6305` (lib/db belum di-build), 1x `TS2345` (Express params typing), 1x `TS7006` (implicit any)
- `src/routes/ai.ts`: `TS2322` (exchange type union tidak include "grvt")
- `src/lib/ethereal/`, `src/lib/extended/`, `src/lib/lighter/`: berbagai pre-existing errors
- Semua error di atas sudah ada sebelum perubahan ini dan **bukan disebabkan** oleh perbaikan GRVT.

---

## Instruksi Manual Testing

### 1. Test Login API Key

```typescript
import { loginWithApiKey } from "./lib/grvt/grvtAuth";

const session = await loginWithApiKey("YOUR_GRVT_API_KEY", "testnet");
console.log("Cookie:", session.cookie);
console.log("Account ID:", session.accountId);
// Ekspektasi: cookie berformat "gravity=...", accountId berupa string angka
```

### 2. Test Fetch Market Data

```typescript
import { getInstruments, getMiniTicker, getRecentTrades } from "./lib/grvt/grvtMarket";

// List instruments
const instruments = await getInstruments("testnet");
console.log("Instruments:", instruments.length);

// Mini ticker
const ticker = await getMiniTicker("BTC_USDT_Perp", "testnet");
console.log("Mark price:", ticker?.mark_price);

// Recent trades
const trades = await getRecentTrades("BTC_USDT_Perp", 10, "testnet");
console.log("Trades:", trades.length);
```

### 3. Test WebSocket Subscribe

```typescript
import { registerGrvtPriceCallback, setGrvtWsSession, connect } from "./lib/grvt/grvtWs";

// Login dulu untuk authenticated WS (opsional untuk public streams)
const session = await loginWithApiKey("YOUR_API_KEY", "testnet");
setGrvtWsSession(session);

// Subscribe mini ticker
registerGrvtPriceCallback(
  "BTC_USDT_Perp",
  1,
  (price, instrument) => {
    console.log(`[WS] ${instrument}: ${price.toFixed(2)}`);
  },
  "testnet"
);
// Ekspektasi: menerima price update setiap beberapa detik
```

### 4. Test Order Signing (tanpa submit)

```typescript
import { signGrvtOrder } from "./lib/grvt/grvtTrade";

const sig = await signGrvtOrder(
  "0xYOUR_PRIVATE_KEY",
  {
    subAccountId: "YOUR_SUB_ACCOUNT_ID",
    timeInForce: "GOOD_TILL_TIME",
    postOnly: false,
    reduceOnly: false,
    legs: [{
      contractId: 1,
      size: "0.001",
      limitPrice: "50000",
      isBuyingContract: true,
    }],
  },
  "testnet"
);
console.log("Signature:", sig);
console.log("chain_id:", sig.chain_id); // harus "326" untuk testnet
// Ekspektasi: expiration adalah string nanoseconds (>10^18)
```
