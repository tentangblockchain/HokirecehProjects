import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EthCredentials {
  hasCredentials: boolean;
  walletAddress?: string;
  subaccountId?: string;
  etherealNetwork?: string;
}

interface EthConfigModalProps {
  open: boolean;
  onClose: () => void;
  credentials: EthCredentials;
  onSaved: () => void;
}

async function saveEthCredentials(payload: object) {
  const res = await fetch("/api/ethereal/strategies/credentials", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error((json as any)?.error ?? `HTTP ${res.status}`);
  return json;
}

export function EthConfigModal({ open, onClose, credentials, onSaved }: EthConfigModalProps) {
  const [busy, setBusy] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [subaccountId, setSubaccountId] = useState(credentials.subaccountId ?? "");
  const [network, setNetwork] = useState<"mainnet" | "testnet">(
    (credentials.etherealNetwork ?? "mainnet") as "mainnet" | "testnet"
  );

  const save = async () => {
    if (!privateKey && !credentials.hasCredentials) {
      toast.error("Private key wajib diisi");
      return;
    }
    setBusy(true);
    try {
      await saveEthCredentials({
        ...(privateKey && { privateKey }),
        ...(subaccountId && { subaccountId }),
        etherealNetwork: network,
      });
      toast.success("Credentials Ethereal tersimpan");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error("Gagal menyimpan", { description: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[440px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-amber-400" />
            Konfigurasi Ethereal DEX
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Private Key (EVM, 64 hex chars)</Label>
            <Input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder={credentials.hasCredentials ? "••••••••••••••• (tersimpan)" : "0x..."}
              className="bg-background"
            />
            {credentials.walletAddress && (
              <p className="text-xs text-muted-foreground">
                Wallet: {credentials.walletAddress.slice(0, 10)}...
                {credentials.walletAddress.slice(-8)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Subaccount ID (UUID dari Ethereal)</Label>
            <Input
              value={subaccountId}
              onChange={(e) => setSubaccountId(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Dapatkan dari Settings → API Keys di{" "}
              <a
                href="https://app.ethereal.trade"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-amber-400"
              >
                app.ethereal.trade
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Network</Label>
            <Select value={network} onValueChange={(v) => setNetwork(v as any)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mainnet">Mainnet</SelectItem>
                <SelectItem value="testnet">Testnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Batal
          </Button>
          <Button
            onClick={save}
            disabled={busy}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
