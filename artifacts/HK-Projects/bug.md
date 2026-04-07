# Bug & Refactor Log

| ID | Deskripsi | File | Status | Tanggal |
|----|-----------|------|--------|---------|
| REFACTOR-001 | Migrasi toast shadcn → sonner | semua file | ✅ Done | 2026-04-06 |
| BUG-SETTINGS-001 | Double save Settings.tsx — onSubmit redundant dihapus | Settings.tsx | ✅ Fixed | 2026-04-06 |
| BUG-ETH-015 | Ethereal market order update avg_buy/sell_price dengan harga $0 | etherealBotEngine.ts | ⏳ Belum difix | 2026-04-06 |

---

### BUG-ETH-015 — Detail

**Severity**: LOW — hanya terpicu jika user secara manual memilih `orderType: "market"` di form strategi. Default form adalah `"limit"`, sehingga mayoritas user tidak terkena.

**Root cause**: Ethereal API mengharuskan `price=0` untuk market order (sesuai OpenAPI docs). Nilai `executionPrice=0` ini langsung digunakan untuk memanggil `ethUpdateStrategyStatsAtomic()` ketika order terisi instan (`immediatelyFilled=true`), sebelum actual fill price diketahui dari fills API. Trade langsung dicatat sebagai `status: "filled"` sehingga mekanisme polling tidak pernah memperbaiki harga.

**Impact**: `avg_buy_price` / `avg_sell_price` di tabel `strategies` menjadi bias ke bawah untuk strategi yang menggunakan market order.

**Fix yang disarankan** (belum diimplementasi): Simpan market order sebagai `"pending"` terlebih dahulu — biarkan `pollPendingEtherealTrades` mengambil actual fill price dari `GET /v1/order/fill` lalu update stats dengan harga asli.

---

## REFACTOR-002 — Ethereal Folder Extraction (2026-04-06)

### Ringkasan

Refactor `EtherealStrategies.tsx` dari monolith ~1744 baris ke arsitektur terstruktur
`components/ethereal/`, mengikuti pola `components/extended/`.

### File yang Dibuat

| File | Deskripsi |
|------|-----------|
| `src/components/ethereal/EthAccountWidget.tsx` | Widget akun self-contained (useQuery) |
| `src/components/ethereal/EthLogDialog.tsx` | Dialog log per-strategi self-contained (useQuery) |
| `src/components/ethereal/EthConfigModal.tsx` | Modal konfigurasi credentials Ethereal |
| `src/components/ethereal/EthCreateStrategyModal.tsx` | Modal create DCA/Grid — react-hook-form + zod |
| `src/components/ethereal/EthEditStrategyModal.tsx` | Modal edit DCA/Grid — react-hook-form + zod |

### Perubahan ke EtherealStrategies.tsx

- Diperkecil dari ~1744 baris → ~400 baris
- Import dari komponen baru
- Ditambah `EthPnlChartDialog` (inline) untuk konsistensi dengan Extended/Lighter
- `EthStrategyCard` diperbarui: `CardFooter`, amber colors, `onShowChart`, `fill-current` icons, label "Mulai/Hentikan Bot"
- `EthAccountWidget` sekarang self-fetching (tidak perlu state account di parent)

### Hasil Typecheck (`pnpm run typecheck`)

```
Found 29 errors in 9 files.
```

**Semua 29 error adalah pre-existing** di file yang tidak disentuh (AppLayout, CreateStrategyModal, EditStrategyModal, AIAdvisor, Dashboard, LighterStrategies, Logs, Settings, Trades).

Penyebab utama: `api-client-react` lib belum di-build (TS6305) + implicit any pre-existing (TS7006).

**Nol error dari file Ethereal baru.**

### Hasil Build (`pnpm run build`)

```
✓ 2496 modules transformed.
✓ built in 15.44s  — BUILD SUKSES
```

| DEX | Bundle size (gzip) |
|-----|--------------------|
| LighterStrategies | 9.49 kB |
| ExtendedStrategies | 10.03 kB |
| EtherealStrategies | 10.89 kB |

### Tindak Lanjut Backend

| # | Issue | Catatan |
|---|-------|---------|
| 1 | Endpoint `/api/ethereal/strategies/pnl/:id` perlu diverifikasi/dibuat | Chart dialog akan tampil "Belum ada data" jika endpoint belum ada |
| 2 | Build `api-client-react` untuk resolve TS6305 | `pnpm --filter @workspace/api-client-react build` |
