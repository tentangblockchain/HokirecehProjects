import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ExchangeLogo } from "@/components/ui/ExchangeLogo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────────

interface EthStrategy {
  id: number;
  name: string;
  type: "dca" | "grid";
  marketSymbol: string;
  isRunning: boolean;
  dcaConfig?: {
    amountPerOrder: number;
    intervalMinutes: number;
    side: "buy" | "sell";
    orderType: string;
    limitPriceOffset?: number;
  } | null;
  gridConfig?: {
    lowerPrice: number;
    upperPrice: number;
    gridLevels: number;
    amountPerGrid: number;
    mode: string;
    orderType: string;
    limitPriceOffset?: number;
    stopLoss?: number | null;
    takeProfit?: number | null;
  } | null;
}

interface AIResult {
  reasoning: string;
  marketCondition: "bullish" | "bearish" | "sideways" | "volatile";
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  modelUsed: string;
  modelTier: string;
}

// ── Schemas ──────────────────────────────────────────────────────────────────────

const ethDcaEditSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
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

const ethGridEditSchema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
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

type EthDcaEditData = z.infer<typeof ethDcaEditSchema>;
type EthGridEditData = z.infer<typeof ethGridEditSchema>;

// ── API helpers ──────────────────────────────────────────────────────────────────

async function updateEthStrategy(strategyId: number, payload: object) {
  const res = await fetch(`/api/ethereal/strategies/${strategyId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as any).error ?? "Gagal memperbarui strategi Ethereal");
  return json;
}

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

// ── AI Insight Card ────────────────────────────────────────────────────────────

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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
          <Sparkles className="w-3.5 h-3.5" />
          Analisis AI — {result.modelTier}
        </div>
        <div className="flex items-center gap-2">
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

// ── DCA Edit Form ──────────────────────────────────────────────────────────────

function EthDcaEditForm({
  strategy,
  onSuccess,
  onCancel,
}: {
  strategy: EthStrategy;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const cfg = strategy.dcaConfig;

  const buildDefaults = useCallback(
    () => ({
      name: strategy.name,
      amountPerOrder: cfg?.amountPerOrder ?? 100,
      intervalMinutes: cfg?.intervalMinutes ?? 1440,
      side: (cfg?.side as "buy" | "sell") ?? "buy",
      orderType: (cfg?.orderType as any) ?? "limit",
      limitPriceOffset: cfg?.limitPriceOffset ?? 0,
    }),
    [strategy.id]
  );

  const form = useForm<EthDcaEditData>({
    resolver: zodResolver(ethDcaEditSchema),
    defaultValues: buildDefaults(),
  });

  useEffect(() => {
    form.reset(buildDefaults());
    setAiResult(null);
  }, [strategy.id]);

  const watchOrderType = form.watch("orderType");

  const handleAIAnalyze = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const data = await fetchAiParams("dca", strategy.marketSymbol);
      const p = data?.dca_params;
      if (!p) throw new Error("AI tidak mengembalikan parameter DCA");
      if (p.amountPerOrder != null)
        form.setValue("amountPerOrder", p.amountPerOrder, { shouldValidate: true });
      if (p.intervalMinutes != null)
        form.setValue("intervalMinutes", p.intervalMinutes, { shouldValidate: true });
      if (p.side) form.setValue("side", p.side, { shouldValidate: true });
      if (p.orderType) form.setValue("orderType", p.orderType, { shouldValidate: true });
      if (p.limitPriceOffset != null)
        form.setValue("limitPriceOffset", p.limitPriceOffset, { shouldValidate: true });
      setAiResult({
        reasoning: data.reasoning,
        marketCondition: data.marketCondition,
        riskLevel: data.riskLevel,
        confidence: data.confidence,
        modelUsed: data.modelUsed,
        modelTier: data.modelTier,
      });
      toast.success("Analisis AI Selesai", {
        description: `Parameter diperbarui menggunakan ${data.modelTier}`,
      });
    } catch (err: any) {
      toast.error("Analisis AI Gagal", { description: err.message });
    } finally {
      setAiLoading(false);
    }
  };

  const onSubmit = async (data: EthDcaEditData) => {
    setLoading(true);
    try {
      await updateEthStrategy(strategy.id, {
        name: data.name,
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
      toast.success("Strategi Ethereal Diperbarui");
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
        <Input {...form.register("name")} className="bg-background" />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300 font-mono">
        Market: {strategy.marketSymbol}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 hover:border-amber-500/50 gap-2"
        onClick={handleAIAnalyze}
        disabled={aiLoading || loading}
      >
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {aiLoading ? "Menganalisis pasar..." : "Analisis Ulang AI & Perbarui Parameter"}
      </Button>

      {aiResult && <AIInsightCard result={aiResult} />}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Jumlah (USDe)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("amountPerOrder")}
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
            value={form.watch("side")}
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
            value={form.watch("orderType")}
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
          <Label>Limit Price Offset (USDe)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("limitPriceOffset")}
            className="bg-background font-mono"
          />
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
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}

// ── Grid Edit Form ─────────────────────────────────────────────────────────────

function EthGridEditForm({
  strategy,
  onSuccess,
  onCancel,
}: {
  strategy: EthStrategy;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const cfg = strategy.gridConfig;

  const buildDefaults = useCallback(
    () => ({
      name: strategy.name,
      lowerPrice: cfg?.lowerPrice ?? 0,
      upperPrice: cfg?.upperPrice ?? 0,
      gridLevels: cfg?.gridLevels ?? 10,
      amountPerGrid: cfg?.amountPerGrid ?? 50,
      mode: (cfg?.mode as any) ?? "neutral",
      orderType: (cfg?.orderType as any) ?? "limit",
      limitPriceOffset: cfg?.limitPriceOffset ?? 0,
      stopLoss: cfg?.stopLoss ?? undefined,
      takeProfit: cfg?.takeProfit ?? undefined,
    }),
    [strategy.id]
  );

  const form = useForm<EthGridEditData>({
    resolver: zodResolver(ethGridEditSchema),
    defaultValues: buildDefaults(),
  });

  useEffect(() => {
    form.reset(buildDefaults());
    setAiResult(null);
  }, [strategy.id]);

  const watchOrderType = form.watch("orderType");

  const handleAIAnalyze = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const data = await fetchAiParams("grid", strategy.marketSymbol);
      const p = data?.grid_params;
      if (!p) throw new Error("AI tidak mengembalikan parameter Grid");
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

      setAiResult({
        reasoning: data.reasoning,
        marketCondition: data.marketCondition,
        riskLevel: data.riskLevel,
        confidence: data.confidence,
        modelUsed: data.modelUsed,
        modelTier: data.modelTier,
      });
      toast.success("Analisis AI Selesai", {
        description: `Parameter grid diperbarui menggunakan ${data.modelTier}`,
      });
    } catch (err: any) {
      toast.error("Analisis AI Gagal", { description: err.message });
    } finally {
      setAiLoading(false);
    }
  };

  const onSubmit = async (data: EthGridEditData) => {
    setLoading(true);
    try {
      await updateEthStrategy(strategy.id, {
        name: data.name,
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
      toast.success("Strategi Ethereal Diperbarui");
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
        <Input {...form.register("name")} className="bg-background" />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300 font-mono">
        Market: {strategy.marketSymbol}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 hover:border-amber-500/50 gap-2"
        onClick={handleAIAnalyze}
        disabled={aiLoading || loading}
      >
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {aiLoading
          ? "Menganalisis pasar untuk setup grid..."
          : "Analisis Ulang AI & Perbarui Parameter Grid"}
      </Button>

      {aiResult && <AIInsightCard result={aiResult} />}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Harga Bawah (USDe)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("lowerPrice")}
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
            value={form.watch("mode")}
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
            value={form.watch("orderType")}
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
          <Label>Limit Price Offset (USDe)</Label>
          <Input
            type="text"
            inputMode="decimal"
            {...form.register("limitPriceOffset")}
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
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}

// ── Modal utama ─────────────────────────────────────────────────────────────────

export function EthEditStrategyModal({
  strategy,
  onClose,
  onSaved,
}: {
  strategy: EthStrategy | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!strategy);
  }, [strategy]);

  if (!strategy) return null;

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSuccess = () => {
    setOpen(false);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-[580px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExchangeLogo exchange="ethereal" size={20} />
            Edit Strategi — {strategy.name}
          </DialogTitle>
        </DialogHeader>

        {strategy.type === "dca" ? (
          <EthDcaEditForm strategy={strategy} onSuccess={handleSuccess} onCancel={handleClose} />
        ) : (
          <EthGridEditForm strategy={strategy} onSuccess={handleSuccess} onCancel={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
