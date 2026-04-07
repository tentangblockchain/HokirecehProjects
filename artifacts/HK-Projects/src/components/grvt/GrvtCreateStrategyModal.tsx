import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GrvtMarket {
  instrument: string;
  base: string;
  quote: string;
  kind: string;
  tick_size: string;
  min_size: string;
}

interface GrvtCreateStrategyModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

async function fetchMarkets(): Promise<GrvtMarket[]> {
  const res = await fetch("/api/grvt/strategies/markets", { credentials: "include" });
  if (!res.ok) throw new Error("Gagal memuat market");
  return res.json();
}

async function createStrategy(payload: object) {
  const res = await fetch("/api/grvt/strategies", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error((json as any)?.error ?? `HTTP ${res.status}`);
  return json;
}

export function GrvtCreateStrategyModal({ open, onClose, onCreated }: GrvtCreateStrategyModalProps) {
  const [busy, setBusy] = useState(false);
  const [markets, setMarkets] = useState<GrvtMarket[]>([]);
  const [loadingMarkets, setLoadingMarkets] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<"dca" | "grid">("dca");
  const [instrument, setInstrument] = useState("");

  const [dcaAmount, setDcaAmount] = useState("10");
  const [dcaInterval, setDcaInterval] = useState("60");
  const [dcaSide, setDcaSide] = useState<"buy" | "sell">("buy");

  const [gridLower, setGridLower] = useState("");
  const [gridUpper, setGridUpper] = useState("");
  const [gridLevels, setGridLevels] = useState("10");
  const [gridAmount, setGridAmount] = useState("10");

  useEffect(() => {
    if (!open) return;
    setLoadingMarkets(true);
    fetchMarkets()
      .then((m) => {
        setMarkets(m);
        if (m.length > 0 && !instrument) setInstrument(m[0].instrument);
      })
      .catch(() => toast.error("Gagal memuat market GRVT"))
      .finally(() => setLoadingMarkets(false));
  }, [open]);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Nama strategy wajib diisi");
    if (!instrument) return toast.error("Pilih market terlebih dahulu");

    const payload: any = {
      name: name.trim(),
      type,
      marketSymbol: instrument,
      marketIndex: 0,
      isActive: true,
    };

    if (type === "dca") {
      payload.dcaConfig = {
        amountPerOrder: parseFloat(dcaAmount),
        intervalMinutes: parseInt(dcaInterval),
        side: dcaSide,
        orderType: "limit",
      };
    } else {
      if (!gridLower || !gridUpper) return toast.error("Lower dan upper price wajib diisi");
      payload.gridConfig = {
        lowerPrice: parseFloat(gridLower),
        upperPrice: parseFloat(gridUpper),
        gridLevels: parseInt(gridLevels),
        amountPerGrid: parseFloat(gridAmount),
        mode: "neutral",
        orderType: "limit",
      };
    }

    setBusy(true);
    try {
      await createStrategy(payload);
      toast.success("Strategy GRVT berhasil dibuat");
      onCreated();
      onClose();
      setName("");
    } catch (err: any) {
      toast.error("Gagal membuat strategy", { description: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-purple-400">Buat Strategy GRVT Baru</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nama Strategy</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: BTC DCA Harian"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipe Strategy</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dca">DCA (Dollar Cost Averaging)</SelectItem>
                <SelectItem value="grid">Grid Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Market (Instrument)</Label>
            {loadingMarkets ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Memuat market...
              </div>
            ) : (
              <Select value={instrument} onValueChange={setInstrument}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Pilih instrument" />
                </SelectTrigger>
                <SelectContent>
                  {markets.map((m) => (
                    <SelectItem key={m.instrument} value={m.instrument}>
                      {m.instrument} ({m.kind})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {type === "dca" && (
            <div className="space-y-3 border border-border/40 rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Konfigurasi DCA</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Jumlah per Order (USDT)</Label>
                  <Input value={dcaAmount} onChange={(e) => setDcaAmount(e.target.value)} type="number" className="bg-background" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Interval (menit)</Label>
                  <Input value={dcaInterval} onChange={(e) => setDcaInterval(e.target.value)} type="number" className="bg-background" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Arah</Label>
                <Select value={dcaSide} onValueChange={(v) => setDcaSide(v as any)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy (Long)</SelectItem>
                    <SelectItem value="sell">Sell (Short)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {type === "grid" && (
            <div className="space-y-3 border border-border/40 rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Konfigurasi Grid</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Lower Price</Label>
                  <Input value={gridLower} onChange={(e) => setGridLower(e.target.value)} type="number" placeholder="0.00" className="bg-background" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Upper Price</Label>
                  <Input value={gridUpper} onChange={(e) => setGridUpper(e.target.value)} type="number" placeholder="0.00" className="bg-background" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Jumlah Grid</Label>
                  <Input value={gridLevels} onChange={(e) => setGridLevels(e.target.value)} type="number" className="bg-background" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Amount per Grid (USDT)</Label>
                  <Input value={gridAmount} onChange={(e) => setGridAmount(e.target.value)} type="number" className="bg-background" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Batal
          </Button>
          <Button
            onClick={handleCreate}
            disabled={busy}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Buat Strategy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
