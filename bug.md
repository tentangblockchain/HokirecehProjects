# Bug Tracker

---

## BUG-PNL-001 — realized_pnl tidak pernah diupdate (semua engine)

- **Severity:** HIGH
- **Status:** FIXED (commit cc0ccc53)
- **Affected:** `lighterBotEngine.ts`, `extendedBotEngine.ts`, `etherealBotEngine.ts`
- **Root cause:** `updateStrategyStatsAtomic` SELL block tidak menghitung `realized_pnl` — kolom selalu bernilai default `0` meski ratusan trade sudah terjadi
- **Fix:** Tambah baris berikut di SELL block ketiga engine:
  ```sql
  realized_pnl = realized_pnl + (size * (sell_price - avg_buy_price))
  ```
  `avg_buy_price` dibaca dari snapshot pre-update PostgreSQL (atomic, tidak perlu SELECT terpisah).
- **Note:** Data historis tidak di-backfill. PnL mulai akurat dari deploy commit cc0ccc53 ke depan.

---

## REFACTOR-001 — Migrasi toast shadcn/ui → sonner

- **Type:** Refactor
- **Status:** ✅ Done (2026-04-06)
- **Scope:** Semua file HK-Projects yang menggunakan `useToast`
- **Files changed (10):** `EtherealStrategies.tsx`, `Settings.tsx`, `LighterStrategies.tsx`, `ExtendedStrategies.tsx`, `CreateStrategyModal.tsx`, `EditStrategyModal.tsx`, `ExtCreateStrategyModal.tsx`, `ExtEditStrategyModal.tsx`, `EthCreateStrategyModal.tsx`, `EthEditStrategyModal.tsx`, `EthConfigModal.tsx`, `App.tsx`, `components/ui/sonner.tsx`
- **Files deleted (3):** `hooks/use-toast.ts`, `components/ui/toaster.tsx`, `components/ui/toast.tsx`
- **Changes:**
  - `import { useToast }` → `import { toast } from "sonner"` di semua file
  - `const { toast } = useToast()` dihapus dari semua komponen
  - `toast({ title, variant: "destructive" })` → `toast.error(title, { description })`
  - `toast({ title })` / `toast(title, ...)` (sukses) → `toast.success(title, { description })`
  - `components/ui/sonner.tsx` di-rewrite: hapus `next-themes`, output `<Sonner theme="dark" position="bottom-right" richColors />`
  - Typecheck workspace: **0 error**
