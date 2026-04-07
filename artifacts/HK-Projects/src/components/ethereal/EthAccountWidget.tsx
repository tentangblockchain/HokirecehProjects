import { Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface EthBalance {
  tokenName?: string;
  amount: string;
  available: string;
}

interface EthPosition {
  unrealizedPnl?: string;
  [key: string]: any;
}

interface EthAccount {
  hasCredentials: boolean;
  walletAddress?: string;
  balances: EthBalance[];
  positions: EthPosition[];
  openOrders: any[];
  network?: string;
}

async function fetchEthAccount(): Promise<EthAccount> {
  const res = await fetch("/api/ethereal/strategies/account", { credentials: "include" });
  if (!res.ok) throw new Error("Gagal memuat akun Ethereal");
  return res.json();
}

export function EthAccountWidget() {
  const { data: account } = useQuery({
    queryKey: ["eth-account"],
    queryFn: fetchEthAccount,
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

  const usde = account.balances.find(
    (b) => b.tokenName?.toLowerCase().includes("usde") || b.tokenName?.toLowerCase().includes("usd")
  );

  const totalUnrealizedPnl =
    account.positions?.reduce(
      (sum: number, p: EthPosition) => sum + parseFloat(p.unrealizedPnl ?? "0"),
      0
    ) ?? 0;

  const hasPositions = (account.positions?.length ?? 0) > 0;
  const posCount = account.positions?.length ?? 0;

  return (
    <div className="flex items-center gap-3 text-sm flex-wrap">
      <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg">
        <Wallet className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs text-muted-foreground">Saldo USDe:</span>
        <span className="font-mono font-bold text-amber-300">
          {usde ? `$${parseFloat(usde.amount).toFixed(2)}` : "–"}
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
