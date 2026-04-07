import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BotLog {
  id: number;
  strategyId: number | null;
  level: string;
  message: string;
  data?: any;
  createdAt: string;
}

interface GrvtLogDialogProps {
  open: boolean;
  onClose: () => void;
  strategyId: number;
  strategyName: string;
}

async function fetchLogs(strategyId: number, limit = 50): Promise<BotLog[]> {
  const res = await fetch(
    `/api/grvt/strategies/logs/recent?strategyId=${strategyId}&limit=${limit}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Gagal memuat log");
  return res.json();
}

function levelColor(level: string): string {
  switch (level?.toLowerCase()) {
    case "error": return "text-red-400";
    case "warn":  return "text-yellow-400";
    case "info":  return "text-blue-400";
    default:      return "text-muted-foreground";
  }
}

export function GrvtLogDialog({ open, onClose, strategyId, strategyName }: GrvtLogDialogProps) {
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchLogs(strategyId);
      setLogs(data);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open, strategyId]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[660px] bg-card border-border max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-400">
            <ScrollText className="w-4 h-4" />
            Log: {strategyName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-end">
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 bg-background/50 rounded-lg p-3 min-h-[200px]">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {loading ? "Memuat log..." : "Belum ada log untuk strategy ini"}
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-2 leading-relaxed">
                <span className="text-muted-foreground/60 shrink-0">
                  {new Date(log.createdAt).toLocaleTimeString("id-ID")}
                </span>
                <span className={`uppercase font-bold shrink-0 ${levelColor(log.level)}`}>
                  [{log.level?.toUpperCase() ?? "INFO"}]
                </span>
                <span className="text-foreground/80 break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
