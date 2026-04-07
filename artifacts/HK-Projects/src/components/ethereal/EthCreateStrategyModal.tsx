import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, ChevronsUpDown, Check, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExchangeLogo } from "@/components/ui/ExchangeLogo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient, useQuery } from "@tanstack/react-query";

// ── Types ────────────────────────────────────────────────────────────────────────

interface EthMarket {
  id: string;
  onchainId: number;
  ticker: string;
  displayTicker: string;
  baseAsset: string;
  quoteAsset: string;
  lastPrice: number;
}

// ── Fetch market dari API Ethereal ────────────────────────────────────────────

async function fetchEthMarkets(): Promise<EthMarket[]> {
  const res = await fetch("/api/ethereal/strategies/markets", { credentials: "include" });
  if (!res.ok) throw new Error("Gagal memuat daftar market");
  const json = await res.json();
  return Array.isArray(json) ? json : [];
}

// ── Zod schema DCA ──────────────────────────────────────────────────────────────

const ethDcaSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  marketSymbol: z.string().min(1, "Pilih market terlebih dahulu"),
  marketIndex: z.number(),
  amountPerOrder: z.coerce.number().positive("Jumlah harus positif"),
  intervalMinutes: z.coerce.number().min(1, "Interval minimal 1 menit"),
  side: z.enum(["buy", "sell"]),
  orderType: z.enum(["market", "limit", "post_only"]),
  limitPriceOffset: z.coerce.number().min(0).optional(),
});

const optionalPositiveNumber = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  },
  z.number().positive("Harus angka positif").optional()
);

const ethGridSchema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    marketSymbol: z.string().min(1, "Pilih market terlebih dahulu"),
    marketIndex: z.number(),
    lowerPrice: z.coerce.number().positive("Harga bawah harus positif"),
    upperPrice: z.coerce.number().positive("Harga atas harus positif"),
    gridLevels: z.coerce.number().min(2).max(100),
    amountPerGrid: z.coerce.number().positive("Jumlah harus positif"),
    mode: z.enum(["neutral", "long", "short"]),
    orderType: z.enum(["market", "limit", "post_only"]),
    limitPriceOffset: z.coerce.number().min(0).optional(),
    stopLoss: optionalPositiveNumber,
    takeProfit: optionalPositiveNumber,
  })
  .refine((d) => d.upperPrice > d.lowerPrice, {
    message: "Harga atas harus lebih besar dari harga bawah",
    path: ["upperPrice"],
  })
  .refine((d) => !d.stopLoss || d.stopLoss < d.lowerPrice, {
    message: "Stop Loss harus di bawah Harga Bawah",
    path: ["stopLoss"],
  })
  .refine((d) => !d.takeProfit || d.takeProfit > d.upperPrice, {
    message: "Take Profit harus di atas Harga Atas",
    path: ["takeProfit"],
  });

type EthDcaFormData = z.infer<typeof ethDcaSchema>;
type EthGridFormData = z.infer<typeof ethGridSchema>;

// ── AI Result types & card ─────────────────────────────────────────────────────

interface AIResult {
  reasoning: string;
  marketCondition: "bullish" | "bearish" | "sideways" | "volatile";
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  modelUsed: string;
  modelTier: string;
}

function AIInsightCard({ result }: { result: AIResult }) {
  const conditionIcon = {
    bullish: <TrendingUp className="w-3.5 h-3.5 text-green-400" />,
    bearish: <TrendingDown className="w-3.5 h-3.5 text-destructive" />,
    sideways: <Minus className="w-3.5 h-3.5 text-yellow-400" />,
    volatile: <Sparkles className="w-3.5 h-3.5 text-primary" />,
  }[result.marketCondition];

  const riskColor = {
    low: "text-green-400",
    medium: "text-yellow-400",
    high: "text-destructive",
  }[result.riskLevel];

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
          <Sparkles className="w-3.5 h-3.5" />
          Analisis AI — {result.modelTier}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {conditionIcon}
            <span className="capitalize">{result.marketCondition}</span>
          </div>
          <Badge variant="outline" className={cn("text-xs px-1.5 py-0", riskColor)}>
            {result.riskLevel === "low"
              ? "risiko rendah"
              : result.riskLevel === "medium"
              ? "risiko sedang"
              : "risiko tinggi"}
          </Badge>
          <span className="text-xs text-muted-foreground">{result.confidence}% keyakinan</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{result.reasoning}</p>
    </div>
  );
}

// ── Sanitize AI numbers ────────────────────────────────────────────────────────

function sanitizeAINumber(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number" && !isNaN(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/\./g, "").replace(",", ".");
    const n = parseFloat(cleaned);
    return isNaN(n) ? undefined : n;
  }
  return undefined;
}

// ── API helpers ─────────────────────────────────────────────────────────────────

async function createEthStrategy(payload: object) {
  const res = await fetch("/api/ethereal/strategies/", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as any).error ?? "Gagal membuat strategi Ethereal");
  return json;
}

async function fetchAiParams(strategyType: "dca" | "grid", marketSymbol: string) {
  const res = await fetch("/api/ai/analyze", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ strategyType, marketSymbol, exchange: "ethereal" }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as any).error ?? "Gagal mengambil rekomendasi AI");
  return json;
}

// ── Market Picker ──────────────────────────────────────────────────────────────

function EthMarketPicker({
  selected,
  onSelect,
  error,
  markets,
  isLoading,
}: {
  selected: string | null;
  onSelect: (ticker: string, onchainId: number) => void;
  error?: string;
  markets: EthMarket[];
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedMarket = markets.find((m) => m.ticker === selected);

  return (
    <div className="space-y-2">
      <Label>Market</Label>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={isLoading}
            className="w-full justify-between bg-background font-normal"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Memuat market...
              </span>
            ) : selectedMarket ? (
              <span className="font-mono text-sm">
                {selectedMarket.displayTicker || selectedMarket.ticker}
              </span>
            ) : (
              <span className="text-muted-foreground">Pilih market (mis. ETH-USD)...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[min(400px,calc(100vw-2rem))] p-0 z-[200]" align="start">
          <Command>
            <CommandInput placeholder="Cari market (mis. ETH, BTC)..." />
            <CommandList className="max-h-[280px] overflow-y-auto">
              <CommandEmpty>Market tidak ditemukan.</CommandEmpty>
              <CommandGroup heading={`${markets.length} market tersedia`}>
                {markets.map((m) => (
                  <CommandItem
                    key={m.id}
                    value={`${m.ticker} ${m.displayTicker} ${m.baseAsset}`}
                    onSelect={() => {
                      onSelect(m.ticker, m.onchainId);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected === m.ticker ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-mono text-sm">{m.displayTicker || m.ticker}</span>
                    {m.lastPrice > 0 && (
                      <span className="ml-auto text-xs text-muted-foreground font-mono">
                        ${m.lastPrice.toFixed(2)}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Tombol AI ──────────────────────────────────────────────────────────────────

function AiAutoFillButton({
  marketSymbol,
  strategyType,
  onResult,
  disabled,
}: {
  marketSymbol: string | null;
  strategyType: "dca" | "grid";
  onResult: (data: any) => void;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!marketSymbol) {
      toast.error("Pilih market dulu", {
        description: "Pilih market Ethereal sebelum menggunakan AI.",
      });
      return;
    }
    setLoading(true);
    try {
      const data = await fetchAiParams(strategyType, marketSymbol);
      onResult(data);
      toast.success("Parameter diisi otomatis AI", {
        description: `Rekomendasi ${strategyType.toUpperCase()} untuk ${marketSymbol} berhasil dimuat.`,
      });
    } catch (err: any) {
      toast.error("AI Gagal", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={disabled || loading || !marketSymbol}
      className="w-full gap-2 border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 hover:border-amber-500/50"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      {loading ? "Menganalisis pasar..." : "Isi Otomatis Parameter (AI)"}
    </Button>
  );
}

// ── DCA Form ───────────────────────────────────────────────────────────────────

function EthDcaForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [selectedMarket, setSelectedMarket] = useState<EthMarket | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  const { data: markets = [], isLoading: marketsLoading } = useQuery({
    queryKey: ["eth-markets"],
    queryFn: fetchEthMarkets,
    staleTime: 60_000,
    retry: 2,
  });

  const form = useForm<EthDcaFormData>({
    resolver: zodResolver(ethDcaSchema),
    defaultValues: {
      marketIndex: 0,
      side: "buy",
      orderType: "limit",
      limitPriceOffset: 0,
    },
  });

  const watchOrderType = form.watch("orderType");

  const handleAiResult = (data: any) => {
    const p = data?.dca_params;
    if (!p) return;
    if (p.amountPerOrder != null)
      form.setValue("amountPerOrder", p.amountPerOrder, { shouldValidate: true });
    if (p.intervalMinutes != null)
      form.setValue("intervalMinutes", p.intervalMinutes, { shouldValidate: true });
    if (p.side) form.setValue("side", p.side, { shouldValidate: true });
    if (p.orderType) form.setValue("orderType", p.orderType, { shouldValidate: true });
    if (p.limitPriceOffset != null)
      form.setValue("limitPriceOffset", p.limitPriceOffset, { shouldValidate: true });
    if (data.reasoning) {
      setAiResult({
        reasoning: data.reasoning,
        marketCondition: data.marketCondition,
        riskLevel: data.riskLevel,
        confidence: data.confidence,
        modelUsed: data.modelUsed,
        modelTier: data.modelTier,
      });
    }
  };

  const onSubmit = async (data: EthDcaFormData) => {
    setLoading(true);
    try {
      await createEthStrategy({
        name: data.name,
        type: "dca",
        marketSymbol: data.marketSymbol,
        marketIndex: data.marketIndex,
        dcaConfig: {
          amountPerOrder: data.amountPerOrder,
          intervalMinutes: data.intervalMinutes,
          side: data.side,
          orderType: data.orderType,
          limitPriceOffset:
            data.orderType === "limit" || data.orderType === "post_only"
              ? (data.limitPriceOffset ?? 0)
              : 0,
        },
      });
      toast.success("Strategi Ethereal Dibuat", { description: "Bot DCA Ethereal kamu siap." });
      onSuccess();
    } catch (err: any) {
      toast.error("Kesalahan", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label>Nama Strategi</Label>
        <Input
          {...form.register("name")}
          placeholder="mis. ETH DCA Harian"
          className="bg-background"
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <EthMarketPicker
        selected={selectedMarket?.ticker ?? null}
        onSelect={(ticker, onchainId) => {
          const m = markets.find((x) => x.ticker === ticker);
          setSelectedMarket(m ?? null);
          form.setValue("marketSymbol", ticker, { shouldValidate: true });
          form.setValue("marketIndex", onchainId, { shouldValidate: true });
          setAiResult(null);
        }}
        error={form.formState.errors.marketSymbol?.message}
        markets={markets}
        isLoading={marketsLoading}
      />

      <AiAutoFillButton
        marketSymbol={selectedMarket?.ticker ?? null}
        strategyType="dca"
        onResult={handleAiResult}
        disabled={loading}
      />

      {aiResult && <AIInsightCard result={aiResult} />}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Jumlah (USDe)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("amountPerOrder")}
            placeholder="100"
            className="bg-background font-mono"
          />
          {form.formState.errors.amountPerOrder && (
            <p className="text-xs text-destructive">
              {form.formState.errors.amountPerOrder.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Interval (Menit)</Label>
          <Input
            type="text"
            inputMode="numeric"
            {...form.register("intervalMinutes")}
            placeholder="1440"
            className="bg-background font-mono"
          />
          {form.formState.errors.intervalMinutes && (
            <p className="text-xs text-destructive">
              {form.formState.errors.intervalMinutes.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sisi</Label>
          <Select
            onValueChange={(v: any) => form.setValue("side", v)}
            value={form.watch("side") || "buy"}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipe Order</Label>
          <Select
            onValueChange={(v: any) => form.setValue("orderType", v)}
            value={form.watch("orderType") || "limit"}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="post_only">Post-Only (Maker) ⭐⭐</SelectItem>
              <SelectItem value="limit">Limit (Maker/Taker) ⭐</SelectItem>
              <SelectItem value="market">Market (Taker)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(watchOrderType === "limit" || watchOrderType === "post_only") && (
        <div className="space-y-2">
          <Label>
            Limit Price Offset (USDe)
            <span className="ml-1.5 text-xs text-muted-foreground">
              — offset dari harga pasar saat eksekusi
            </span>
          </Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("limitPriceOffset")}
            placeholder="mis. 10"
            className="bg-background font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Buy: order di <strong>bawah</strong> harga pasar. Sell: di <strong>atas</strong> harga
            pasar.
          </p>
        </div>
      )}

      <div className="pt-4 flex justify-end gap-3 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Buat Bot Ethereal
        </Button>
      </div>
    </form>
  );
}

// ── Grid Form ──────────────────────────────────────────────────────────────────

function EthGridForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [selectedMarket, setSelectedMarket] = useState<EthMarket | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  const { data: markets = [], isLoading: marketsLoading } = useQuery({
    queryKey: ["eth-markets"],
    queryFn: fetchEthMarkets,
    staleTime: 60_000,
    retry: 2,
  });

  const form = useForm<EthGridFormData>({
    resolver: zodResolver(ethGridSchema),
    defaultValues: {
      marketIndex: 0,
      mode: "neutral",
      orderType: "limit",
      limitPriceOffset: 0,
    },
  });

  const watchOrderType = form.watch("orderType");

  const handleAiResult = (data: any) => {
    const p = data?.grid_params;
    if (!p) return;
    const lowerPrice = sanitizeAINumber(p.lowerPrice);
    const upperPrice = sanitizeAINumber(p.upperPrice);
    const gridLevels = sanitizeAINumber(p.gridLevels);
    const amountPerGrid = sanitizeAINumber(p.amountPerGrid);
    const limitPriceOffset = sanitizeAINumber(p.limitPriceOffset);
    const stopLoss = sanitizeAINumber(p.stopLoss);
    const takeProfit = sanitizeAINumber(p.takeProfit);
    if (lowerPrice != null) form.setValue("lowerPrice", lowerPrice, { shouldValidate: true });
    if (upperPrice != null) form.setValue("upperPrice", upperPrice, { shouldValidate: true });
    if (gridLevels != null) form.setValue("gridLevels", gridLevels, { shouldValidate: true });
    if (amountPerGrid != null)
      form.setValue("amountPerGrid", amountPerGrid, { shouldValidate: true });
    if (p.mode) form.setValue("mode", p.mode, { shouldValidate: true });
    if (p.orderType) form.setValue("orderType", p.orderType, { shouldValidate: true });
    if (limitPriceOffset != null)
      form.setValue("limitPriceOffset", limitPriceOffset, { shouldValidate: true });

    const aiLower: number = lowerPrice ?? form.getValues("lowerPrice") ?? 0;
    const aiUpper: number = upperPrice ?? form.getValues("upperPrice") ?? 0;

    if (stopLoss != null && aiLower > 0) {
      const isReasonable = stopLoss < aiLower && stopLoss >= aiLower * 0.5;
      form.setValue("stopLoss", isReasonable ? stopLoss : (undefined as any), {
        shouldValidate: false,
      });
    } else {
      form.setValue("stopLoss", undefined as any, { shouldValidate: false });
    }
    if (takeProfit != null && aiUpper > 0) {
      const isReasonable = takeProfit > aiUpper && takeProfit <= aiUpper * 2;
      form.setValue("takeProfit", isReasonable ? takeProfit : (undefined as any), {
        shouldValidate: false,
      });
    } else {
      form.setValue("takeProfit", undefined as any, { shouldValidate: false });
    }
    if (data.reasoning) {
      setAiResult({
        reasoning: data.reasoning,
        marketCondition: data.marketCondition,
        riskLevel: data.riskLevel,
        confidence: data.confidence,
        modelUsed: data.modelUsed,
        modelTier: data.modelTier,
      });
    }
  };

  const onSubmit = async (data: EthGridFormData) => {
    setLoading(true);
    try {
      await createEthStrategy({
        name: data.name,
        type: "grid",
        marketSymbol: data.marketSymbol,
        marketIndex: data.marketIndex,
        gridConfig: {
          lowerPrice: data.lowerPrice,
          upperPrice: data.upperPrice,
          gridLevels: data.gridLevels,
          amountPerGrid: data.amountPerGrid,
          mode: data.mode,
          orderType: data.orderType,
          limitPriceOffset:
            data.orderType === "limit" || data.orderType === "post_only"
              ? (data.limitPriceOffset ?? 0)
              : 0,
          stopLoss: data.stopLoss || null,
          takeProfit: data.takeProfit || null,
        },
      });
      toast.success("Strategi Ethereal Dibuat", { description: "Bot Grid Ethereal kamu siap." });
      onSuccess();
    } catch (err: any) {
      toast.error("Kesalahan", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label>Nama Strategi</Label>
        <Input
          {...form.register("name")}
          placeholder="mis. ETH Grid Netral"
          className="bg-background"
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <EthMarketPicker
        selected={selectedMarket?.ticker ?? null}
        onSelect={(ticker, onchainId) => {
          const m = markets.find((x) => x.ticker === ticker);
          setSelectedMarket(m ?? null);
          form.setValue("marketSymbol", ticker, { shouldValidate: true });
          form.setValue("marketIndex", onchainId, { shouldValidate: true });
          setAiResult(null);
        }}
        error={form.formState.errors.marketSymbol?.message}
        markets={markets}
        isLoading={marketsLoading}
      />

      <AiAutoFillButton
        marketSymbol={selectedMarket?.ticker ?? null}
        strategyType="grid"
        onResult={handleAiResult}
        disabled={loading}
      />

      {aiResult && <AIInsightCard result={aiResult} />}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Harga Bawah (USDe)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("lowerPrice")}
            placeholder="1800"
            className="bg-background font-mono"
          />
          {form.formState.errors.lowerPrice && (
            <p className="text-xs text-destructive">{form.formState.errors.lowerPrice.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Harga Atas (USDe)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("upperPrice")}
            placeholder="2200"
            className="bg-background font-mono"
          />
          {form.formState.errors.upperPrice && (
            <p className="text-xs text-destructive">{form.formState.errors.upperPrice.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Level Grid</Label>
          <Input
            type="text"
            inputMode="numeric"
            {...form.register("gridLevels")}
            placeholder="10"
            className="bg-background font-mono"
          />
          {form.formState.errors.gridLevels && (
            <p className="text-xs text-destructive">{form.formState.errors.gridLevels.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Jumlah per Grid (USDe)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("amountPerGrid")}
            placeholder="50"
            className="bg-background font-mono"
          />
          {form.formState.errors.amountPerGrid && (
            <p className="text-xs text-destructive">
              {form.formState.errors.amountPerGrid.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Mode Grid</Label>
          <Select
            onValueChange={(v: any) => form.setValue("mode", v)}
            value={form.watch("mode") || "neutral"}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Netral (Beli &amp; Jual)</SelectItem>
              <SelectItem value="long">Long (Beli saja)</SelectItem>
              <SelectItem value="short">Short (Jual saja)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipe Order</Label>
          <Select
            onValueChange={(v: any) => form.setValue("orderType", v)}
            value={form.watch("orderType") || "limit"}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="post_only">Post-Only (Maker) ⭐⭐</SelectItem>
              <SelectItem value="limit">Limit (Maker/Taker) ⭐</SelectItem>
              <SelectItem value="market">Market (Taker)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(watchOrderType === "limit" || watchOrderType === "post_only") && (
        <div className="space-y-2">
          <Label>
            Limit Price Offset (USDe)
            <span className="ml-1.5 text-xs text-muted-foreground">— offset dari harga pasar</span>
          </Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("limitPriceOffset")}
            placeholder="mis. 10"
            className="bg-background font-mono"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Stop Loss (USDe, opsional)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("stopLoss")}
            placeholder="mis. 1700"
            className="bg-background font-mono"
          />
          {form.formState.errors.stopLoss && (
            <p className="text-xs text-destructive">{form.formState.errors.stopLoss.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Take Profit (USDe, opsional)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("takeProfit")}
            placeholder="mis. 2400"
            className="bg-background font-mono"
          />
          {form.formState.errors.takeProfit && (
            <p className="text-xs text-destructive">{form.formState.errors.takeProfit.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Buat Bot Ethereal
        </Button>
      </div>
    </form>
  );
}

// ── Modal utama ────────────────────────────────────────────────────────────────

export function EthCreateStrategyModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"dca" | "grid">("dca");
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["eth-strategies"] });
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Strategi Ethereal Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExchangeLogo exchange="ethereal" size={20} />
            Strategi Baru — Ethereal DEX
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dca">DCA</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
          </TabsList>
          <TabsContent value="dca">
            <EthDcaForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="grid">
            <EthGridForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
