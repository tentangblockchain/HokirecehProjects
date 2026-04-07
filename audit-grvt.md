# LAPORAN AUDIT GRVT — Kode vs Dokumentasi Resmi

**Tanggal audit:** 2026-04-07  
**Auditor:** AI Agent (HokirecehProjects)  
**Sumber kebenaran:** `referensi/grvt-docs/docs/` (di-fetch dari https://api-docs.grvt.io/)  
**Scope:** `artifacts/api-server/src/lib/grvt/`, `artifacts/api-server/src/routes/grvt/`

---

## Ringkasan Eksekutif

**Status: TIDAK SIAP PRODUCTION.**

Dari 5 area yang diaudit (Auth, Market Data REST, Trading REST, WebSocket, Tipe Data), ditemukan **7 issue CRITICAL** yang menyebabkan seluruh GRVT flow tidak bisa berfungsi. Tidak satu pun authenticated API call yang akan berhasil dalam kondisi kode saat ini.

Implementasi GRVT **sepenuhnya terisolasi** dari exchange lain — tidak ada risiko efek samping ke Ethereal, Extended, atau Lighter.

---

## CRITICAL Issues

---

### CRITICAL-1 — Auth URL: `api.grvt.io` vs `edge.grvt.io`

**File:** `grvtAuth.ts` → `grvtTypes.ts` (GRVT_REST_URLS)

**Kode saat ini:**
```typescript
export const GRVT_REST_URLS: Record<GrvtNetwork, string> = {
  mainnet: "https://api.grvt.io",       // ← SALAH untuk auth
  testnet: "https://api.testnet.grvt.io",
};

// URL auth yang dihasilkan:
const url = `${GRVT_REST_URLS[network]}/auth/api_key/login`;
// → https://api.grvt.io/auth/api_key/login  ← SALAH
```

**Dokumentasi resmi (`overview.md`, `api-setup.md`):**
```bash
# prod (mainnet)
GRVT_AUTH_ENDPOINT="https://edge.grvt.io/auth/api_key/login"
# testnet
GRVT_AUTH_ENDPOINT="https://edge.testnet.grvt.io/auth/api_key/login"
```

**Dampak:** Semua request auth akan kena HTTP 404/connection error. Tidak ada session yang bisa dibuat.

**Rekomendasi perbaikan:**
```typescript
// Pisahkan URL auth dari URL data/trading
export const GRVT_AUTH_URLS: Record<GrvtNetwork, string> = {
  mainnet: "https://edge.grvt.io",
  testnet: "https://edge.testnet.grvt.io",
};
// GRVT_REST_URLS tetap https://api.grvt.io untuk market data & trading
```

---

### CRITICAL-2 — Auth Response: Cookie Ada di HTTP Header, Bukan di JSON Body

**File:** `grvtAuth.ts` → `loginWithApiKey()` dan `loginWithWallet()`

**Kode saat ini:**
```typescript
const res = await grvtAuthFetch<{ cookie?: string; token?: string; ... }>(url, body);

// Mencari cookie di JSON body — TIDAK ADA DI SINI
const cookie = res.cookie ?? res.result?.cookie;
const token  = res.token ?? res.result?.token;
```

**Dokumentasi resmi (`overview.md`, `api-setup.md`):**
```
On success, a session cookie (gravity=...) is set [via Set-Cookie HTTP header]
and the response body contains:
{
  "status": "success",
  "location": "",
  "funding_account_address": "0xYourFundingAccountAddress",
  "sub_account_id": "123456789"
}
```

```bash
# Cara GRVT mengambil cookie yang benar:
GRVT_COOKIE=$(echo "$RESPONSE" | grep -i 'set-cookie:' | grep -o 'gravity=[^;]*')
GRVT_ACCOUNT_ID=$(echo "$RESPONSE" | grep 'x-grvt-account-id:' | awk '{print $2}')
```

**Dampak:** `session.cookie` akan selalu `""` (string kosong). Tidak ada cookie yang valid. Semua authenticated endpoint akan ditolak server.

**Rekomendasi perbaikan:**
```typescript
// Gunakan Node.js https.request() untuk akses response headers langsung
import * as https from "https";

async function loginWithApiKeyRaw(apiKey: string, network: GrvtNetwork): Promise<GrvtAuthSession> {
  return new Promise((resolve, reject) => {
    const req = https.request(`${GRVT_AUTH_URLS[network]}/auth/api_key/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": "rm=true;" },
    }, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        const setCookie = res.headers["set-cookie"] ?? [];
        const gravityCookie = setCookie.find(c => c.startsWith("gravity="))?.split(";")[0] ?? "";
        const accountId = (res.headers["x-grvt-account-id"] as string) ?? "";
        const parsed = JSON.parse(body);
        resolve({
          cookie: gravityCookie,
          accountId,
          subAccountId: parsed.sub_account_id,
          expiresAt: Date.now() + 23 * 60 * 60 * 1000,
        });
      });
    });
    req.write(JSON.stringify({ api_key: apiKey }));
    req.end();
  });
}
```

---

### CRITICAL-3 — `X-Grvt-Account-Id` Header Hilang dari Semua Authenticated Request

**File:** `grvtAuth.ts` → `buildGrvtAuthHeaders()`

**Kode saat ini:**
```typescript
export function buildGrvtAuthHeaders(session: GrvtAuthSession): Record<string, string> {
  const headers: Record<string, string> = { ... };
  if (session.cookie) headers["Cookie"] = session.cookie;
  if (session.token)  headers["Authorization"] = `Bearer ${session.token}`;
  // ← TIDAK ADA X-Grvt-Account-Id !
  return headers;
}
```

**Dokumentasi resmi (`overview.md`):**
```
To subscribe to authenticated WebSocket streams, you must establish a connection
with both your GRVT_COOKIE and X-Grvt-Account-Id included.

wscat -c "wss://..." \
  -H "Cookie: $GRVT_COOKIE" \
  -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID"   # ← REQUIRED
```

**Dampak:** Server GRVT akan menolak semua authenticated REST dan WebSocket request.

**Rekomendasi perbaikan:**
```typescript
// Tambah accountId ke GrvtAuthSession
export interface GrvtAuthSession {
  cookie: string;
  accountId: string;   // ← tambahan baru
  token?: string;
  expiresAt?: number;
}

// Update buildGrvtAuthHeaders
export function buildGrvtAuthHeaders(session: GrvtAuthSession): Record<string, string> {
  const headers: Record<string, string> = { ... };
  if (session.cookie)    headers["Cookie"] = session.cookie;
  if (session.accountId) headers["X-Grvt-Account-Id"] = session.accountId;
  return headers;
}
```

---

### CRITICAL-4 — Wallet Login: EIP-712 Struct Sama Sekali Salah

**File:** `grvtAuth.ts` → `loginWithWallet()`

**Kode saat ini:**
```typescript
const WALLET_LOGIN_TYPES = {
  WalletLogin: [
    { name: "nonce", type: "string" },  // ← Hanya 1 field, tipe string
  ],
};

const signature = await wallet.signTypedData(domain, WALLET_LOGIN_TYPES, { nonce });
```

**Dokumentasi resmi (`overview.md`, `api-setup.md`):**
```
Sign the following struct with eth_signTypedData_v4:
WalletLogin(address signer, uint32 nonce, int64 expiration)

Fields:
- signer:     address   — EVM wallet address
- nonce:      uint32    — random number, tiap (address, nonce) hanya bisa dipakai sekali
- expiration: int64     — Unix timestamp nanoseconds, max 5 menit dari sekarang
```

**Dampak:** Signature akan salah secara kriptografis. Server GRVT akan menolak wallet login.

**Rekomendasi perbaikan:**
```typescript
const WALLET_LOGIN_TYPES = {
  WalletLogin: [
    { name: "signer",     type: "address" },
    { name: "nonce",      type: "uint32"  },
    { name: "expiration", type: "int64"   },
  ],
};

const nonce = Math.floor(Math.random() * 4294967295);  // uint32
const expiration = BigInt(Date.now()) * 1_000_000n + 300_000_000_000n;  // now + 5 menit dalam nanoseconds

const signature = await wallet.signTypedData(domain, WALLET_LOGIN_TYPES, {
  signer: walletAddress,
  nonce,
  expiration,
});
```

---

### CRITICAL-5 — Wallet Login Request Body Salah

**File:** `grvtAuth.ts` → `loginWithWallet()`

**Kode saat ini:**
```typescript
await grvtAuthFetch(url, {
  wallet: walletAddress,  // ← field "wallet" SALAH
  signature,              // ← hanya string hex, bukan object
  nonce                   // ← nonce terpisah, seharusnya di dalam signature
});
```

**Dokumentasi resmi (`overview.md`):**
```json
{
  "address": "0xYourWalletAddress",
  "signature": {
    "signer":     "0xYourWalletAddress",
    "v":          27,
    "r":          "0x...",
    "s":          "0x...",
    "nonce":      305419896,
    "expiration": "1772159636314000000",
    "chain_id":   "326"
  }
}
```

**Dampak:** Server akan menolak request karena field `address` tidak ada dan format signature salah.

**Rekomendasi perbaikan:**
```typescript
const { v, r, s } = ethers.Signature.from(rawSig);
await grvtAuthFetch(url, {
  address: walletAddress,         // ← "address" bukan "wallet"
  signature: {
    signer:     walletAddress,
    v, r, s,
    nonce,                        // integer
    expiration: String(expiration),   // string nanoseconds
    chain_id:   String(domain.chainId),  // "325" atau "326"
  }
});
```

---

### CRITICAL-6 — WebSocket Subscription Format Seluruhnya Salah

**File:** `grvtWs.ts` → `sendSubscribe()`

**Kode saat ini:**
```typescript
function sendSubscribe(stream: string): void {
  const msg = JSON.stringify({
    jsonrpc: "2.0",
    method: "subscribe",
    params: { stream },        // stream = "v1.mini.BTC_USDT_Perp"
    id: nextRpcId(),
  });
  ws.send(msg);
}

// Stream names yang dikirim (SEMUANYA SALAH):
//   "v1.mini.BTC_USDT_Perp"         ← harusnya stream: "v1.mini.s", feed: ["BTC_USDT_Perp@500"]
//   "v1.orderbook.l2.BTC_USDT_Perp" ← harusnya stream: "v1.book.s", feed: ["BTC_USDT_Perp@500-20-10"]
//   "v1.trade.BTC_USDT_Perp"         ← harusnya stream: "v1.trade.s", feed: ["BTC_USDT_Perp"]
```

**Dokumentasi resmi (`overview.md`, `market-data-streams.md`):**
```json
{
    "stream":  "v1.mini.s",
    "feed":    ["BTC_USDT_Perp@500"],
    "method":  "subscribe",
    "is_full": true
}

// Stream names yang benar:
//   v1.mini.s   — Mini Ticker Snapshot  (v1.mini.d untuk Delta)
//   v1.book.s   — Order Book Snapshot   (v1.book.d untuk Delta)
//   v1.trade.s  — Trades Snapshot       (v1.trade.d untuk Delta)

// Feed selector format:
//   Mini ticker : "BTC_USDT_Perp@500"         (instrument@rate_ms)
//   Order book  : "BTC_USDT_Perp@500-100-10"  (instrument@rate-depth-etc)
//   Trades      : "BTC_USDT_Perp"             (instrument saja)
```

**Dampak:** Server GRVT tidak akan mengakui subscription ini. Tidak ada data market yang diterima.

**Rekomendasi perbaikan:**
```typescript
function sendSubscribe(stream: string, selectors: string[], isFull = true): void {
  const msg = JSON.stringify({
    stream,
    feed: selectors,
    method: "subscribe",
    is_full: isFull,
  });
  ws.send(msg);
}

// Contoh penggunaan:
sendSubscribe("v1.mini.s",  ["BTC_USDT_Perp@500"]);
sendSubscribe("v1.book.s",  ["BTC_USDT_Perp@500-20-10"]);
sendSubscribe("v1.trade.s", ["BTC_USDT_Perp"]);
```

---

### CRITICAL-7 — WebSocket Message Handling: Format Response Sama Sekali Berbeda

**File:** `grvtWs.ts` → `handleMessage()`

**Kode saat ini:**
```typescript
// Mengharapkan format: { method: "subscribe", params: { channel, data } }
if (msg.method === "subscribe" && msg.params) {
  const { channel, data } = msg.params;
  if (channel.startsWith("v1.mini.")) handleMiniTickerEvent(data);
  // ...
}
```

**Dokumentasi resmi (`overview.md`):**
```json
// Format data stream yang sebenarnya dari server:
{
    "stream":          "v1.book.s",
    "selector":        "BTC_USDT_Perp@500-100-10",
    "sequence_number": "872634876",
    "feed":            { ... actual data ... }
}
```

**Dampak:** `channel` tidak akan pernah ada. Semua event market data akan di-ignore. Tidak ada callback yang dipanggil.

**Rekomendasi perbaikan:**
```typescript
function handleMessage(raw: string): void {
  const msg = JSON.parse(raw);

  // Subscription confirmation
  if (msg.stream && msg.subs) {
    logger.info({ stream: msg.stream, subs: msg.subs }, "[GRVT WS] Subscribed");
    return;
  }

  // Error response
  if (msg.code && msg.message) {
    logger.warn({ code: msg.code, msg: msg.message }, "[GRVT WS] Error");
    return;
  }

  // Feed data event — format sebenarnya
  if (msg.stream && msg.feed !== undefined) {
    const { stream, selector, feed } = msg;
    if      (stream === "v1.mini.s"  || stream === "v1.mini.d")  handleMiniTickerEvent(feed, selector);
    else if (stream === "v1.book.s"  || stream === "v1.book.d")  handleOrderbookEvent(feed, selector);
    else if (stream === "v1.trade.s" || stream === "v1.trade.d") handleTradeEvent(feed, selector);
  }
}
```

---

## HIGH Issues

---

### HIGH-1 — `chain_id` Hilang dari `GrvtSignature` dan Semua Order

**File:** `grvtTypes.ts` → `GrvtSignature`, `grvtTrade.ts` → `signGrvtOrder()`

**Kode saat ini:**
```typescript
export interface GrvtSignature {
  signer: string;
  r: string; s: string; v: number;
  expiration: string;
  nonce: number;
  // ← Tidak ada chain_id !
}
```

**Dokumentasi resmi (`trading-api.md`):**
```
chain_id (required) — Chain ID used in EIP-712 domain.
Contoh: "326" untuk testnet, "325" untuk mainnet.
```

**Rekomendasi:**
```typescript
export interface GrvtSignature {
  signer: string;
  r: string; s: string; v: number;
  expiration: string;
  nonce: number;
  chain_id: string;   // ← tambahkan
}

// Di signGrvtOrder(), tambahkan:
const signature: GrvtSignature = {
  signer: wallet.address,
  r: sigParsed.r, s: sigParsed.s, v: sigParsed.v,
  expiration,
  nonce,
  chain_id: String(domain.chainId),  // "325" atau "326"
};
```

---

### HIGH-2 — Expiration Order Dalam Microsecond, Seharusnya Nanosecond

**File:** `grvtTrade.ts` → `generateExpiry()`

**Kode saat ini:**
```typescript
function generateExpiry(daysFromNow = 30): string {
  return String(Date.now() * 1000 + daysFromNow * 24 * 60 * 60 * 1_000_000);
  //            ↑ hasilnya microseconds, bukan nanoseconds
  //            ↑ juga berpotensi floating point precision loss (> Number.MAX_SAFE_INTEGER)
}
```

**Dokumentasi resmi (`trading-api.md`):**
```
expiration: string — Timestamp after which this signature expires, expressed in unix nanoseconds.
Must be capped at 30 days.
Contoh nilai: "1772159636314000000"  ← ini nanoseconds
```

**Dampak:** Expiration yang dikirim ~1000× terlalu kecil. Signature akan dianggap sudah expired oleh server.

**Rekomendasi:**
```typescript
function generateExpiry(daysFromNow = 30): string {
  // Gunakan BigInt untuk menghindari floating point precision loss
  const nowNs  = BigInt(Date.now()) * 1_000_000n;             // ms → ns
  const daysNs = BigInt(daysFromNow) * 86_400_000_000_000n;   // days → ns
  return String(nowNs + daysNs);
}
```

---

### HIGH-3 — Market Data Endpoint Salah: Missing `full/` Prefix + Menggunakan GET

**File:** `grvtMarket.ts`

**Kode saat ini:**
```typescript
// GET /v1/instruments   ← method GET dan path tanpa "full/"
const res = await grvtFetch<...>("/v1/instruments", network);

// POST /v1/mini        ← path tanpa "full/"
await grvtFetch<...>("/v1/mini", network, { method: "POST", ... });

// POST /v1/trades      ← path tanpa "full/"
await grvtFetch<...>("/v1/trades", network, { method: "POST", ... });
```

**Dokumentasi resmi (`market-data-api.md`):**
```
All requests should be made using the POST HTTP method.
FULL ENDPOINT: full/v1/instrument
FULL ENDPOINT: full/v1/mini
FULL ENDPOINT: full/v1/trades
```

**Rekomendasi:**
```typescript
// instruments list
await grvtFetch<...>("/full/v1/instruments", network,
  { method: "POST", body: JSON.stringify({}) });

// mini ticker
await grvtFetch<...>("/full/v1/mini", network,
  { method: "POST", body: JSON.stringify({ instrument }) });

// trades
await grvtFetch<...>("/full/v1/trades", network,
  { method: "POST", body: JSON.stringify({ instrument, limit }) });
```

---

### HIGH-4 — WebSocket Base URL Kemungkinan Salah (Missing `/ws/full` Path)

**File:** `grvtTypes.ts` → `GRVT_WS_URLS`

**Kode saat ini:**
```typescript
export const GRVT_WS_URLS: Record<GrvtNetwork, string> = {
  mainnet: "wss://stream.grvt.io",           // ← tanpa path /ws/full
  testnet: "wss://stream.testnet.grvt.io",
};
```

**Dokumentasi resmi (`overview.md`):**
```bash
wscat -c "wss://trades.dev.gravitymarkets.io/ws/full"
#                                             ^^^^^^^^ ada path /ws/full
```

**Catatan:** Docs tidak secara eksplisit menyebut URL WS mainnet/testnet. URL di atas adalah untuk environment `dev`. Perlu konfirmasi dari GRVT atau pengujian langsung apakah mainnet menggunakan `wss://stream.grvt.io/ws/full` atau URL lain.

---

## MEDIUM Issues

---

### MEDIUM-1 — `GrvtAuthSession` Tidak Menyimpan `accountId`

**File:** `grvtTypes.ts`, `grvtAuth.ts`

`accountId` dari response header `x-grvt-account-id` tidak disimpan di session. Karena `X-Grvt-Account-Id` header diperlukan untuk semua authenticated request (lihat CRITICAL-3), session harus menyimpan nilai ini.

---

### MEDIUM-2 — `client_order_id` Range Konflik dengan Rekomendasi Docs

**File:** `grvtTrade.ts`

**Kode:**
```typescript
const clientOrderId = params.clientOrderId ?? (nonce % 65536);
// range [0, 65535]
```

**Dokumentasi (`trading-api.md`):**
```
Gravity UI menggunakan range [0, 2^63 - 1].
Client machines should use [2^63, 2^64 - 1] untuk menghindari konflik.
```

Range `[0, 65535]` overlap dengan range yang dipakai GRVT UI, berpotensi menyebabkan `overlappingClientOrderId` rejection.

---

### MEDIUM-3 — Session Expiry 23 Jam Hardcoded Tanpa Auto-Refresh

**File:** `grvtAuth.ts`

Session cookie GRVT mungkin expire lebih cepat dari 23 jam. Jika cookie sudah expire di sisi server namun cache lokal masih valid, semua request akan gagal dengan 401 secara silent sampai restart. Perlu mekanisme refresh otomatis saat menerima 401 response.

---

## Isolasi Terhadap Exchange Lain

**Aman — tidak ada risiko efek samping ke Ethereal, Extended, atau Lighter.**

Alasannya:
- Semua DB query GRVT memfilter dengan `eq(strategiesTable.exchange, "grvt")` — tidak bisa menyentuh data exchange lain
- Library GRVT sepenuhnya di `lib/grvt/` dan `routes/grvt/` — tidak di-import oleh exchange lain
- `configService.ts` mempunyai fungsi terpisah khusus GRVT: `getGrvtCredentials`, `updateGrvtCredentials`, `deleteGrvtCredentials`
- `authMiddleware` yang di-share hanya bertugas validasi JWT user — benign

---

## Daftar File yang Perlu Diperbaiki

| File | Masalah | Prioritas |
|---|---|---|
| `grvtTypes.ts` | Tambah `GRVT_AUTH_URLS`, perbaiki `GRVT_WS_URLS`, tambah `chain_id` ke `GrvtSignature`, tambah `accountId` ke `GrvtAuthSession` | **CRITICAL** |
| `grvtAuth.ts` | Perbaiki auth URL, ganti `fetch()` dengan `https.request()` untuk baca `Set-Cookie` header, simpan `accountId`, perbaiki `buildGrvtAuthHeaders`, perbaiki EIP-712 wallet login struct + request body | **CRITICAL** |
| `grvtWs.ts` | Perbaiki `sendSubscribe()` (stream name + feed array + is_full), perbaiki `handleMessage()` (stream/selector/feed vs method/params/channel), pisahkan stream name dari instrument name | **CRITICAL** |
| `grvtMarket.ts` | Tambah `full/` prefix ke semua endpoint, ganti GET → POST untuk instruments | **HIGH** |
| `grvtTrade.ts` | Perbaiki `generateExpiry()` ke nanoseconds (BigInt), tambah `chain_id` ke signature object, perbaiki `client_order_id` range | **HIGH** |
| `grvtAccount.ts` | Tidak ada perubahan kritis — endpoint sudah benar (`/full/v1/...`), akan otomatis benefit dari perbaikan auth headers | LOW |
| `bot.ts` (routes) | Tidak ada perubahan diperlukan — logic routing sudah benar | — |

---

## Syarat Minimum Sebelum Production

Urutan perbaikan yang harus dilakukan (berurutan, karena saling bergantung):

1. **`grvtTypes.ts`** — Tambah `GRVT_AUTH_URLS`, update `GrvtSignature` (chain_id), update `GrvtAuthSession` (accountId)
2. **`grvtAuth.ts`** — Fix auth URL + session extraction dari HTTP headers + wallet login EIP-712
3. **`grvtMarket.ts`** — Fix endpoint paths (`full/` prefix + POST method)
4. **`grvtTrade.ts`** — Fix expiration (BigInt nanoseconds) + chain_id di signature
5. **`grvtWs.ts`** — Rewrite subscription format + message handling
6. **Test end-to-end** — Minimal: API key login → fetch balance → fetch mini ticker → WebSocket mini ticker subscribe

**Tanpa langkah 1–3 selesai, tidak ada satu pun feature GRVT yang bisa berjalan.**
