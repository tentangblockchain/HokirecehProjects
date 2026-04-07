import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Activity,
  BarChart2,
  Zap,
  Pencil,
  ScrollText,
  Settings2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { GrvtAccountWidget } from "@/components/grvt/GrvtAccountWidget";
import { GrvtCreateStrategyModal } from "@/components/grvt/GrvtCreateStrategyModal";
import { GrvtLogDialog } from "@/components/grvt/GrvtLogDialog";
import { GrvtConfigModal } from "@/components/grvt/GrvtConfigModal";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface GrvtStrategy {
  id: number;
  name: string;
  type: "dca" | "grid";
  exchange: string;
  marketSymbol: string;
  isRunning: boolean;
  isActive: boolean;
  totalOrders: number;
  successfulOrders: number;
  realizedPnl: string;
  nextRunAt: string | null;
  createdAt: string;
  dcaConfig?: {
    amountPerOrder: number;
    intervalMinutes: number;
    side: "buy" | "sell";
  } | null;
  gridConfig?: {
    lowerPrice: number;
    upperPrice: number;
    gridLevels: number;
    amountPerGrid: number;
    mode: string;
  } | null;
}

interface GrvtCredentials {
  hasCredentials: boolean;
  walletAddress?: string;
  subAccountId?: string;
  grvtNetwork?: string;
}

// ── API helper ────────────────────────────────────────────────────────────────

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`/api/grvt/strategies${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error((json as any)?.error ?? `HTTP ${res.status}`);
  return json;
}

// ── Strategy Card ─────────────────────────────────────────────────────────────

function GrvtStrategyCard({
  strategy,
  onDelete,
  onViewLogs,
}: {
  strategy: GrvtStrategy;
  onDelete: (id: number) => void;
  onViewLogs: (s: GrvtStrategy) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Hapus strategy "${strategy.name}"?`)) return;
    setDeleting(true);
    try {
      await apiFetch(`/${strategy.id}`, { method: "DELETE" });
      toast.success("Strategy GRVT dihapus");
      onDelete(strategy.id);
    } catch (err: any) {
      toast.error("Gagal menghapus", { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const typeLabel = strategy.type === "dca" ? "DCA" : "Grid";
  const typeBadgeClass =
    strategy.type === "dca"
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-blue-500/10 text-blue-400 border-blue-500/20";

  const successRate =
    strategy.totalOrders > 0
      ? Math.round((strategy.successfulOrders / strategy.totalOrders) * 100)
      : 0;

  return (
    <Card className="bg-card border-border/60 hover:border-purple-500/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold truncate">{strategy.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${typeBadgeClass}`}>
                {typeLabel}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{strategy.marketSymbol}</span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${
            strategy.isActive
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-muted text-muted-foreground border-transparent"
          }`}>
            <Activity className="w-3 h-3" />
            {strategy.isActive ? "Aktif" : "Nonaktif"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total Order</p>
            <p className="text-sm font-bold">{strategy.totalOrders ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sukses</p>
            <p className="text-sm font-bold text-green-400">{successRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">PnL</p>
            <p className={`text-sm font-bold ${
              parseFloat(strategy.realizedPnl ?? "0") >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              ${parseFloat(strategy.realizedPnl ?? "0").toFixed(2)}
            </p>
          </div>
        </div>

        {strategy.type === "dca" && strategy.dcaConfig && (
          <div className="mt-3 text-xs text-muted-foreground border border-border/30 rounded p-2">
            <span className="font-semibold text-foreground/70">DCA:</span>{" "}
            ${strategy.dcaConfig.amountPerOrder} setiap {strategy.dcaConfig.intervalMinutes} menit ·{" "}
            <span className={strategy.dcaConfig.side === "buy" ? "text-green-400" : "text-red-400"}>
              {strategy.dcaConfig.side.toUpperCase()}
            </span>
          </div>
        )}

        {strategy.type === "grid" && strategy.gridConfig && (
          <div className="mt-3 text-xs text-muted-foreground border border-border/30 rounded p-2">
            <span className="font-semibold text-foreground/70">Grid:</span>{" "}
            ${strategy.gridConfig.lowerPrice} – ${strategy.gridConfig.upperPrice} ·{" "}
            {strategy.gridConfig.gridLevels} level · ${strategy.gridConfig.amountPerGrid}/grid
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onViewLogs(strategy)}
        >
          <ScrollText className="w-3.5 h-3.5" />
          Log
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function GrvtStrategies() {
  const queryClient = useQueryClient();
  const [strategies, setStrategies] = useState<GrvtStrategy[]>([]);
  const [credentials, setCredentials] = useState<GrvtCredentials>({ hasCredentials: false });
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [logDialog, setLogDialog] = useState<{ open: boolean; strategy: GrvtStrategy | null }>({
    open: false,
    strategy: null,
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [strats, creds] = await Promise.all([
        apiFetch("").catch(() => []),
        apiFetch("/credentials").catch(() => ({ hasCredentials: false })),
      ]);
      setStrategies(Array.isArray(strats) ? strats : []);
      setCredentials(creds);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = (id: number) => {
    setStrategies((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Strategi GRVT
          </h1>
          <p className="text-muted-foreground mt-1">Bot trading otomatis di GRVT DEX</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <GrvtAccountWidget />
          <Button
            size="sm"
            variant="outline"
            onClick={fetchAll}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowConfig(true)}
            className="gap-1.5"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Konfigurasi
          </Button>
          <Button
            size="sm"
            onClick={() => setShowCreate(true)}
            className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            Buat Strategy
          </Button>
        </div>
      </div>

      {/* ── Status credential ────────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm w-fit ${
          credentials.hasCredentials
            ? "bg-cyan-500/5 border-cyan-500/20"
            : "bg-muted border-border"
        }`}
      >
        <Zap className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-cyan-300 font-medium">GRVT DEX</span>
        {credentials.hasCredentials ? (
          <span className="text-green-400 font-medium">aktif ✓</span>
        ) : (
          <button
            className="text-yellow-400 font-medium hover:underline"
            onClick={() => setShowConfig(true)}
          >
            belum dikonfigurasi
          </button>
        )}
      </div>

      {credentials.hasCredentials && (
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {credentials.walletAddress && (
            <div className="bg-background border border-border/40 rounded-lg px-3 py-2">
              <span className="text-foreground/60">Wallet: </span>
              <span className="font-mono">
                {credentials.walletAddress.slice(0, 8)}...{credentials.walletAddress.slice(-6)}
              </span>
            </div>
          )}
          {credentials.subAccountId && (
            <div className="bg-background border border-border/40 rounded-lg px-3 py-2">
              <span className="text-foreground/60">Sub-Account: </span>
              <span className="font-mono">{credentials.subAccountId}</span>
            </div>
          )}
          <div className="bg-background border border-border/40 rounded-lg px-3 py-2">
            <span className="text-foreground/60">Network: </span>
            <span className={credentials.grvtNetwork === "testnet" ? "text-yellow-400" : "text-green-400"}>
              {credentials.grvtNetwork ?? "mainnet"}
            </span>
          </div>
        </div>
      )}

      {/* ── Strategy list ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm animate-pulse">
          Memuat strategies...
        </div>
      ) : strategies.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border flex flex-col items-center">
          <Zap className="w-16 h-16 text-cyan-400 mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-foreground">Belum Ada Strategi GRVT</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Kamu belum membuat bot GRVT. Klik "Buat Strategy" untuk membuat DCA atau Grid bot di GRVT DEX.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {strategies.map((s) => (
            <GrvtStrategyCard
              key={s.id}
              strategy={s}
              onDelete={handleDelete}
              onViewLogs={(strat) => setLogDialog({ open: true, strategy: strat })}
            />
          ))}
        </div>
      )}

      {/* ── Modals ────────────────────────────────────────────────────────────── */}
      <GrvtCreateStrategyModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchAll}
      />

      <GrvtConfigModal
        open={showConfig}
        onClose={() => setShowConfig(false)}
        credentials={credentials}
        onSaved={() => {
          fetchAll();
          queryClient.invalidateQueries({ queryKey: ["grvt-account"] });
        }}
      />

      {logDialog.strategy && (
        <GrvtLogDialog
          open={logDialog.open}
          onClose={() => setLogDialog({ open: false, strategy: null })}
          strategyId={logDialog.strategy.id}
          strategyName={logDialog.strategy.name}
        />
      )}
    </div>
  );
}
