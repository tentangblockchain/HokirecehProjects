import { Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface GrvtBalance {
  currency: string;
  balance: string;
  index_price: string;
}

interface GrvtPosition {
  instrument: string;
  unrealized_pnl: string;
  [key: string]: any;
}

interface GrvtAccount {
  hasCredentials: boolean;
  walletAddress?: string;
  balances: GrvtBalance[];
  positions: GrvtPosition[];
  openOrders: any[];
  network?: string;
}

async function fetchGrvtAccount(): Promise<GrvtAccount> {
  const res = await fetch("/api/grvt/strategies/account", { credentials: "include" });
  if (!res.ok) throw new Error("Gagal memuat akun GRVT");
  return res.json();
}

export function GrvtAccountWidget() {
  const { data: account } = useQuery({
    queryKey: ["grvt-account"],
    queryFn: fetchGrvtAccount,
    staleTime: 30_000,
    retry: false,
  });

  if (!account?.hasCredentials) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Wallet className="w-4 h-4" />
        <span>Belum terkonfigurasi</span>
      </div>
    );
  }

  const usdtBalance = account.balances.find(
    (b) => b.currency?.toLowerCase().includes("usdt") || b.currency?.toLowerCase().includes("usd")
  );

  const totalUnrealizedPnl =
    account.positions?.reduce(
      (sum: number, p: GrvtPosition) => sum + parseFloat(p.unrealized_pnl ?? "0"),
      0
    ) ?? 0;

  const hasPositions = (account.positions?.length ?? 0) > 0;
  const posCount = account.positions?.length ?? 0;

  return (
    <div className="flex items-center gap-3 text-sm flex-wrap">
      <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1.5 rounded-lg">
        <Wallet className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-xs text-muted-foreground">Saldo:</span>
        <span className="font-mono font-bold text-purple-300">
          {usdtBalance ? `$${parseFloat(usdtBalance.balance).toFixed(2)}` : "–"}
        </span>
      </div>
      {hasPositions && (
        <div className="flex items-center gap-1.5 bg-background/50 border border-border/40 px-2.5 py-1.5 rounded-lg">
          <span className="text-xs text-muted-foreground">{posCount} posisi</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">uPnL:</span>
          <span
            className={`font-mono font-bold text-xs ${
              totalUnrealizedPnl >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {totalUnrealizedPnl >= 0 ? "+" : ""}${totalUnrealizedPnl.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
