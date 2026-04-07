import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GrvtCredentials {
  hasCredentials: boolean;
  walletAddress?: string;
  subAccountId?: string;
  grvtNetwork?: string;
}

interface GrvtConfigModalProps {
  open: boolean;
  onClose: () => void;
  credentials: GrvtCredentials;
  onSaved: () => void;
}

async function saveGrvtCredentials(payload: object) {
  const res = await fetch("/api/grvt/strategies/credentials", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error((json as any)?.error ?? `HTTP ${res.status}`);
  return json;
}

export function GrvtConfigModal({ open, onClose, credentials, onSaved }: GrvtConfigModalProps) {
  const [busy, setBusy] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [subAccountId, setSubAccountId] = useState(credentials.subAccountId ?? "");
  const [network, setNetwork] = useState<"mainnet" | "testnet">(
    (credentials.grvtNetwork ?? "mainnet") as "mainnet" | "testnet"
  );

  const save = async () => {
    if (!apiKey && !privateKey && !credentials.hasCredentials) {
      toast.error("API Key atau Private Key wajib diisi");
      return;
    }
    setBusy(true);
    try {
      await saveGrvtCredentials({
        ...(apiKey && { apiKey }),
        ...(privateKey && { privateKey }),
        ...(subAccountId && { subAccountId }),
        grvtNetwork: network,
      });
      toast.success("Credentials GRVT tersimpan");
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
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-purple-400" />
            Konfigurasi GRVT DEX
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3 text-xs text-muted-foreground">
            GRVT mendukung autentikasi via <strong className="text-foreground">API Key</strong> atau{" "}
            <strong className="text-foreground">EVM Private Key</strong> (EIP-712). Isi salah satu.
          </div>

          <div className="space-y-2">
            <Label>API Key (dari dashboard GRVT)</Label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={credentials.hasCredentials ? "••••••••••••••• (tersimpan)" : "grvt_..."}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Dapatkan di{" "}
              <a
                href="https://app.grvt.io"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-purple-400"
              >
                app.grvt.io
              </a>{" "}
              → Settings → API Keys
            </p>
          </div>

          <div className="space-y-2">
            <Label>EVM Private Key (opsional, jika tidak pakai API Key)</Label>
            <Input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder={credentials.hasCredentials ? "••••••••••••••• (tersimpan)" : "0x..."}
              className="bg-background"
            />
            {credentials.walletAddress && (
              <p className="text-xs text-muted-foreground">
                Wallet: {credentials.walletAddress.slice(0, 10)}...{credentials.walletAddress.slice(-8)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Sub-Account ID (dari GRVT)</Label>
            <Input
              value={subAccountId}
              onChange={(e) => setSubAccountId(e.target.value)}
              placeholder="12345678 (angka atau string)"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Ditemukan di dashboard GRVT → Account → Sub-Accounts
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
                <SelectItem value="testnet">Testnet (api.testnet.grvt.io)</SelectItem>
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
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
