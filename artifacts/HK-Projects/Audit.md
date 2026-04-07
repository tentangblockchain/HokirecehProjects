# Audit Report — HokirecehProjects Bot Engine
**Tanggal Audit**: 6 April 2026  
**Scope**: Ketiga bot engine (Lighter, Extended, Ethereal) — logika order, fill detection, stats update, dan price accuracy

---

## Ringkasan Eksekutif

| # | ID | Engine | Severity | Status | Judul |
|---|----|--------|----------|--------|-------|
| 1 | BUG-ETH-001 | Ethereal | **MEDIUM** | Open | Market order — `avg_buy/sell_price` diupdate dengan harga $0 |
| 2 | DESIGN-EXT-001 | Extended | LOW | By Design | IOC market order — stats dihitung dari estimated price, bukan actual fill |
| 3 | DESIGN-EXT-002 | Extended | LOW | By Design | PARTIALLY_FILLED via WS — ditandai "filled" meski belum 100% terisi |
| 4 | OK-LIGHTER-001 | Lighter | — | Verified OK | Formula `avg_buy_price` weighted-average — benar |
| 5 | OK-ETH-002 | Ethereal | — | Verified OK | Market order price=0 ke API — sesuai docs |
| 6 | OK-EXT-003 | Extended | — | Verified OK | Double-count PARTIALLY_FILLED via WS — tidak terjadi |

---

## Detail Temuan

---

### BUG-ETH-001 — Ethereal Market Order: `avg_buy/sell_price` Corrupt (MEDIUM)

**File**: `artifacts/api-server/src/lib/ethereal/etherealBotEngine.ts`  
**Lines**: ~484–506

**Deskripsi**:  
Untuk MARKET orders di Ethereal, harga yang dikirim ke exchange adalah `0` — ini benar sesuai docs Ethereal OpenAPI (`"Limit price in native units… zero if market order"`). Masalahnya, ketika order langsung terisi (`immediatelyFilled = isMarket && filledAmount.gt(0)`), sistem memanggil:

```typescript
await ethUpdateStrategyStatsAtomic(strategy.id, side, filledSize, executionPrice);
// executionPrice = new Decimal(0) untuk MARKET orders
```

Ini meng-update kolom `avg_buy_price` / `avg_sell_price` di database dengan formula weighted average menggunakan **harga $0**, sehingga rata-rata harga menjadi bias ke bawah secara permanen.

**Mengapa polling tidak memperbaiki ini?**  
Trade langsung dicatat dengan `status: "filled"` (bukan `"pending"`). Mekanisme polling `pollPendingEtherealTrades` hanya memonitor trades dengan `status = "pending"`, sehingga actual fill price **tidak pernah diupdate** ke DB.

**Impact**:
- `avg_buy_price` / `avg_sell_price` per strategi tidak akurat
- Dashboard yang menampilkan rata-rata harga beli/jual jadi misleading
- Kalkulasi PnL yang menggunakan `avg_buy_price` menjadi salah

**Fix yang disarankan**:

Opsi A (sederhana): Untuk market order yang `immediatelyFilled`, jangan update stats dari response awal. Alih-alih, simpan trade sebagai `status: "pending"` dan biarkan `pollPendingEtherealTrades` mengambil actual fill price dari fills API:

```typescript
// Sebelum (bug):
const tradeStatus = isMarket ? (immediatelyFilled ? "filled" : "pending") : "pending";
if (immediatelyFilled) {
  await ethUpdateStrategyStatsAtomic(strategy.id, side, filledSize, executionPrice); // price=0!
}

// Sesudah (fix):
// Market order SELALU "pending" dulu, polling yang update stats dengan harga aktual
const tradeStatus = "pending";
// hapus blok if (immediatelyFilled) untuk stats update
```

Opsi B (lebih akurat): Setelah submit market order, langsung call `getFills(subaccountId, { orderId })` untuk mendapatkan actual fill price, lalu gunakan fill price itu untuk update stats. Ini menambah latency ~1 API call tapi hasilnya paling akurat.

---

### DESIGN-EXT-001 — Extended IOC Market Order: Stats dari Estimated Price (LOW, By Design)

**File**: `artifacts/api-server/src/lib/extended/extendedBotEngine.ts`  
**Lines**: ~638–648, ~715–735

**Deskripsi**:  
Extended tidak memiliki native market order — order market disimulasikan sebagai IOC LIMIT dengan harga worst-case (`calcMarketOrderPrice`, buffer ±0.75%). Setelah order diterima:

```typescript
// IOC → langsung tandai filled, update stats dengan harga estimasi
const tradeStatus = isIoc ? "filled" : "pending";
if (isIoc) {
  await extUpdateStrategyStatsAtomic(strategy.id, side, size, executionPrice);
  // executionPrice = mid ± 0.75%, bukan actual fill price
}
```

Actual fill price bisa lebih baik dari `executionPrice` (jika pasar mengisi di harga lebih murah/mahal), tapi kita tidak pernah tahu karena trade langsung "filled" dan polling tidak memproses trade "filled".

**Impact**: Perbedaan umumnya kecil (<1%) karena IOC mengisi di harga pasar. Tidak ada data yang bernilai $0 seperti BUG-ETH-001.

**Status**: Diterima sebagai keterbatasan desain. Tidak perlu fix kecuali akurasi PnL sangat kritis.

---

### DESIGN-EXT-002 — Extended PARTIALLY_FILLED: Ditandai "Filled" Meski Belum Penuh (LOW, By Design)

**File**: `artifacts/api-server/src/lib/extended/extendedBotEngine.ts`  
**Lines**: ~302–334

**Deskripsi**:  
Ketika WS mengirim ORDER event dengan `status: "PARTIALLY_FILLED"`, handler memperlakukannya sama dengan `"FILLED"` — trade di DB langsung ditandai `"filled"` menggunakan `filledQty` dari event (qty yang sudah terisi, belum tentu 100%).

```typescript
if (status === "FILLED" || status === "PARTIALLY_FILLED") {
  // Trade ditandai filled dengan fillQty saat itu
  await db.update(tradesTable).set({ status: "filled" }).where(...);
  await extUpdateStrategyStatsAtomic(trade.strategyId!, ..., fillQty, fillPrice);
}
```

**Kenapa ini TIDAK menyebabkan double-count**:  
Guard `where: and(eq(tradesTable.status, "pending"), ...)` memastikan bahwa setelah trade pertama kali diproses (status berubah dari "pending" → "filled"), event PARTIALLY_FILLED berikutnya tidak akan menemukan trade yang cocok dan diabaikan. Double-count tidak terjadi.

**Impact yang ada**: Jika order terisi 50% lalu dibatalkan, DB mencatat size=50% tapi trade tetap "filled" (bukan "partially_cancelled"). `total_bought`/`total_sold` merefleksikan partial fill yang benar, tapi status visual di UI mungkin membingungkan.

**Status**: Diterima. Kompleksitas untuk tracking partial-fill-then-cancel tidak sebanding dengan benefit saat ini.

---

## Verified OK

---

### OK-LIGHTER-001 — Formula `avg_buy_price` Lighter: Benar

**File**: `artifacts/api-server/src/lib/lighter/lighterBotEngine.ts`  
**Lines**: ~156–161

Formula SQL untuk weighted average:
```sql
avg_buy_price = CASE
  WHEN total_bought + <new_size> = 0 THEN 0
  ELSE (avg_buy_price * total_bought + <new_price> * <new_size>)
       / (total_bought + <new_size>)
END
```

`total_bought` di sini adalah nilai **lama** dari kolom (sebelum `SET` pada baris `total_bought = total_bought + <new_size>` diterapkan ke luar ekspresi ini — PostgreSQL mengevaluasi semua ekspresi di `SET` terhadap nilai kolom sebelum UPDATE). Formula ini adalah weighted average yang benar. **✅ Verified correct.**

---

### OK-ETH-002 — Ethereal Market Order Price=0 ke API: Sesuai Docs

**Referensi**: Ethereal OpenAPI spec — `"Limit price in native units expressed as a decimal, zero if market order (precision: 9)"`

Mengirim `price: "0"` untuk MARKET order ke Ethereal API adalah **behaviour yang benar sesuai dokumentasi resmi**. Ini bukan bug pada layer API. Bug ada pada penggunaan nilai `0` ini untuk update stats internal (→ lihat BUG-ETH-001).

---

### OK-EXT-003 — Extended PARTIALLY_FILLED Double-Count: Tidak Terjadi

Seperti dianalisis di DESIGN-EXT-002 di atas — guard `status: "pending"` pada query DB mencegah event WS yang datang lebih dari sekali untuk order yang sama memicu update ganda. **✅ Verified safe.**

---

## Catatan Arsitektur

### State Isolation per DEX
Setiap DEX memiliki state yang sepenuhnya terisolasi:
- **Lighter**: Nonce dikelola server-side via `getNextNonce()`. Batch TX support ada.
- **Extended**: Sequential single orders (tidak ada batch endpoint). WS dual-handler (ORDER + TRADE event sebagai failsafe).
- **Ethereal**: EIP-712 signing, margin USDe, price=0 untuk market. Polling setiap 1 menit, mulai cek setelah 2 menit, timeout 30 menit dengan auto-cancel.

### Fill Detection per DEX
| DEX | Mekanisme Utama | Fallback |
|-----|----------------|----------|
| Lighter | Polling `GET /api/v1/tx?by=hash` setiap 45s | REST orderbook price |
| Extended | WS account stream (ORDER event) | TRADE event WS (failsafe), polling REST |
| Ethereal | WS (tidak diimplementasikan) | Polling `GET /v1/order/fill` setiap 1 menit |

### Prioritas Fix
1. **BUG-ETH-001** — Fix segera jika Ethereal market orders aktif digunakan. Implementasi Opsi A (ubah market order ke "pending" selalu) lebih aman dan minimal risiko.
2. DESIGN-EXT-001 dan DESIGN-EXT-002 — Bisa ditunda, impact rendah.

---

*Audit ini fokus pada logika engine. Security audit (key handling, input validation) dan UI/UX audit dilakukan terpisah di `bug.md`.*
