import { db } from "@workspace/db";
import { strategiesTable, tradesTable, botLogsTable } from "@workspace/db";
import { eq, sql, and, isNotNull, ne, gte, lte } from "drizzle-orm";
import Decimal from "decimal.js";
import { logger } from "../logger";
import {
  sendMessageToUser,
  formatBotStarted,
  formatBotStopped,
  formatOrderFilled,
  formatOrderFailed,
  formatStrategyError,
  formatStopLoss,
  formatTakeProfit,
  formatBotPaused,
} from "../telegramBot";
import {
  loginWithApiKey,
  loginWithWallet,
  getCachedSession,
  setCachedSession,
} from "./grvtAuth";
import {
  getInstrumentByName,
  getMidPrice,
  grvtRoundToTick,
  grvtRoundToMinSize,
} from "./grvtMarket";
import {
  registerGrvtPriceCallback,
  unregisterGrvtPriceCallback,
  getGrvtWsCachedPrice,
} from "./grvtWs";
import {
  createGrvtOrder,
  cancelGrvtOrder,
  getGrvtOrder,
} from "./grvtTrade";
import type { GrvtNetwork, GrvtAuthSession, GrvtInstrument } from "./grvtTypes";
import { getGrvtCredentials, getBotConfig } from "../../routes/configService";
import { handleAutoRerange, clearRerangeState, sendMainBotMessageWithButton } from "../autoRerange";
import { getDuplicateTolerance } from "../shared/tolerance";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

// ─── STATE ────────────────────────────────────────────────────────────────────

interface GrvtRunningBot {
  strategyId: number;
  timer: NodeJS.Timeout;
  nextRunAt: Date;
}

interface GrvtGridState {
  lastLevel: number;
  initializedAt: Date;
}

const grvtRunningBots        = new Map<number, GrvtRunningBot>();
const grvtGridStates         = new Map<number, GrvtGridState>();
const grvtWsGridLastTriggered = new Map<number, number>();

const GRVT_WS_GRID_COOLDOWN_MS    = 10_000;
const GRVT_GRID_FALLBACK_INTERVAL = 5 * 60 * 1000;

// ─── STATUS QUERIES ───────────────────────────────────────────────────────────

export function isGrvtBotRunning(strategyId: number): boolean {
  return grvtRunningBots.has(strategyId);
}

export function getGrvtBotNextRunAt(strategyId: number): Date | null {
  return grvtRunningBots.get(strategyId)?.nextRunAt ?? null;
}

export function getAllRunningGrvtBots(): { strategyId: number; nextRunAt: Date }[] {
  return Array.from(grvtRunningBots.entries()).map(([id, bot]) => ({
    strategyId: id,
    nextRunAt: bot.nextRunAt,
  }));
}

// ─── CREDENTIALS & SESSION ────────────────────────────────────────────────────

interface GrvtCreds {
  apiKey?: string;
  privateKey?: string;
  walletAddress?: string;
  subAccountId: string;
  network: GrvtNetwork;
  hasCredentials: boolean;
}

async function getGrvtConfig(userId: number): Promise<GrvtCreds | null> {
  try {
    const creds = await getGrvtCredentials(userId);
    const hasApiKey    = !!creds.apiKey;
    const hasWalletKey = !!creds.privateKey;
    const hasSubAccount = !!creds.subAccountId;

    return {
      apiKey:        creds.apiKey        ?? undefined,
      privateKey:    creds.privateKey    ?? undefined,
      walletAddress: creds.walletAddress ?? undefined,
      subAccountId:  creds.subAccountId  ?? "",
      network:       creds.grvtNetwork,
      hasCredentials: (hasApiKey || hasWalletKey) && hasSubAccount,
    };
  } catch {
    return null;
  }
}

async function getOrRefreshGrvtSession(
  userId: number,
  creds: GrvtCreds
): Promise<GrvtAuthSession | null> {
  const network = creds.network;

  // Cek session cache dulu
  const cached = getCachedSession(String(userId), network);
  if (cached) return cached;

  // Login ulang
  try {
    let session: GrvtAuthSession;
    if (creds.apiKey) {
      session = await loginWithApiKey(creds.apiKey, network);
    } else if (creds.privateKey) {
      session = await loginWithWallet(creds.privateKey, network);
    } else {
      return null;
    }
    setCachedSession(String(userId), network, session);
    return session;
  } catch (err: any) {
    logger.error({ err: err.message, userId, network }, "[GrvtBot] Session login gagal");
    return null;
  }
}

// ─── LOG & NOTIFIKASI ─────────────────────────────────────────────────────────

async function grvtAddLog(
  userId: number | null,
  strategyId: number | null,
  strategyName: string | null,
  level: "info" | "warn" | "error" | "success",
  message: string,
  details?: string
): Promise<void> {
  try {
    await db.insert(botLogsTable).values({
      userId,
      strategyId,
      strategyName,
      level,
      message,
      details: details ?? null,
      exchange: "grvt",
    });
  } catch (err) {
    logger.error({ err }, "[GrvtBot] Failed to add bot log");
  }
}

async function grvtNotifyUser(userId: number | null, message: string): Promise<void> {
  if (userId === null || userId === undefined) return;
  try {
    const botCfg = await getBotConfig(userId);
    if (!botCfg.notifyBotToken || !botCfg.notifyChatId) return;
    const result = await sendMessageToUser(botCfg.notifyChatId, message, botCfg.notifyBotToken);
    if (!result.ok) {
      await grvtAddLog(userId, null, null, "warn",
        `[Notifikasi Telegram gagal] ${result.error ?? "Unknown error"}`);
    }
  } catch (err: any) {
    logger.error({ err }, "[GrvtBot] Unexpected error in grvtNotifyUser");
  }
}

async function grvtGetNotificationConfig(userId: number) {
  const botCfg = await getBotConfig(userId).catch(() => null);
  return {
    notifyOnBuy:   botCfg?.notifyOnBuy   ?? true,
    notifyOnSell:  botCfg?.notifyOnSell  ?? true,
    notifyOnError: botCfg?.notifyOnError ?? true,
    notifyOnStart: botCfg?.notifyOnStart ?? true,
    notifyOnStop:  botCfg?.notifyOnStop  ?? false,
  };
}

// ─── DB: CATAT TRADE ──────────────────────────────────────────────────────────

async function grvtRecordTrade(params: {
  userId: number | null;
  strategyId: number;
  strategyName: string;
  marketIndex: number;
  marketSymbol: string;
  side: "buy" | "sell";
  size: Decimal;
  price: Decimal;
  status: "pending" | "filled" | "cancelled" | "failed";
  orderHash?: string;
  errorMessage?: string;
  fee?: string;
}): Promise<void> {
  await db.insert(tradesTable).values({
    userId:       params.userId,
    strategyId:   params.strategyId,
    strategyName: params.strategyName,
    marketIndex:  params.marketIndex,
    marketSymbol: params.marketSymbol,
    side:         params.side,
    size:         params.size.toFixed(8),
    price:        params.price.toFixed(8),
    fee:          params.fee ?? "0",
    status:       params.status,
    orderHash:    params.orderHash ?? null,
    clientOrderIndex: null,
    exchange:     "grvt",
    errorMessage: params.errorMessage ?? null,
    executedAt:   params.status === "filled" ? new Date() : null,
  });
}

async function grvtUpdateStrategyStatsAtomic(
  strategyId: number,
  side: "buy" | "sell",
  size: Decimal,
  price: Decimal
): Promise<void> {
  if (side === "buy") {
    await db.execute(sql`
      UPDATE strategies
      SET
        total_orders      = total_orders + 1,
        successful_orders = successful_orders + 1,
        last_run_at       = NOW(),
        updated_at        = NOW(),
        total_bought      = total_bought + ${size.toFixed(8)}::numeric,
        avg_buy_price     = CASE
          WHEN total_bought + ${size.toFixed(8)}::numeric = 0 THEN 0
          ELSE (avg_buy_price * total_bought + ${price.toFixed(8)}::numeric * ${size.toFixed(8)}::numeric)
               / (total_bought + ${size.toFixed(8)}::numeric)
        END
      WHERE id = ${strategyId}
    `);
  } else {
    await db.execute(sql`
      UPDATE strategies
      SET
        total_orders      = total_orders + 1,
        successful_orders = successful_orders + 1,
        last_run_at       = NOW(),
        updated_at        = NOW(),
        total_sold        = total_sold + ${size.toFixed(8)}::numeric,
        avg_sell_price    = CASE
          WHEN total_sold + ${size.toFixed(8)}::numeric = 0 THEN 0
          ELSE (avg_sell_price * total_sold + ${price.toFixed(8)}::numeric * ${size.toFixed(8)}::numeric)
               / (total_sold + ${size.toFixed(8)}::numeric)
        END,
        realized_pnl      = realized_pnl + CASE
          WHEN avg_buy_price > 0
          THEN (${size.toFixed(8)}::numeric * (${price.toFixed(8)}::numeric - avg_buy_price))
          ELSE 0
        END
      WHERE id = ${strategyId}
    `);
  }
}

// ─── HARGA SAAT INI ───────────────────────────────────────────────────────────

async function grvtGetCurrentPrice(
  instrument: string,
  network: GrvtNetwork = "mainnet"
): Promise<Decimal | null> {
  // Preferensi: WS cache (real-time, max 5 detik lalu)
  const cached = getGrvtWsCachedPrice(instrument, 5_000);
  if (cached) return cached;

  // Fallback: REST API getMidPrice
  try {
    const mid = await getMidPrice(instrument, network);
    if (mid && mid.gt(0)) {
      logger.info({ instrument, price: mid.toFixed(4) }, "[GrvtBot] Harga dari REST fallback");
      return mid;
    }
  } catch (err) {
    logger.warn({ err, instrument }, "[GrvtBot] REST price fallback gagal");
  }

  return null;
}

// ─── INSTRUMENT INFO HELPER ────────────────────────────────────────────────────
// contractId untuk EIP-712 signing diambil dari instrument_hash (uint32 encoded as string).

async function getGrvtInstrumentInfo(
  instrumentName: string,
  network: GrvtNetwork = "mainnet"
): Promise<{ instrument: GrvtInstrument; contractId: number } | null> {
  const inst = await getInstrumentByName(instrumentName, network);
  if (!inst) return null;

  // instrument_hash adalah representasi uint32 dari hash instrument — dikonversi ke number
  const contractId = Number(BigInt(inst.instrument_hash) & 0xFFFFFFFFn);

  return { instrument: inst, contractId };
}

// ─── PAPER TRADE ─────────────────────────────────────────────────────────────

async function grvtExecutePaperTrade(params: {
  userId: number | null;
  strategy: typeof strategiesTable.$inferSelect;
  side: "buy" | "sell";
  size: Decimal;
  price: Decimal;
  orderCount?: number;
}): Promise<void> {
  const { userId, strategy, side, size, price } = params;
  const count = params.orderCount ?? 1;
  for (let i = 0; i < count; i++) {
    await grvtRecordTrade({
      userId,
      strategyId:   strategy.id,
      strategyName: strategy.name,
      marketIndex:  strategy.marketIndex,
      marketSymbol: strategy.marketSymbol,
      side,
      size,
      price,
      status: "filled",
      orderHash: `grvt_paper_${Date.now()}_${i}`,
    });
    await grvtUpdateStrategyStatsAtomic(strategy.id, side, size, price);
  }
  const label = count > 1 ? `×${count}` : "";
  await grvtAddLog(userId, strategy.id, strategy.name, "warn",
    `Paper trade${label}: ${side.toUpperCase()} ${size.toFixed(6)} @ $${price.toFixed(2)}`,
    "Credentials GRVT belum dikonfigurasi — hanya simulasi"
  );
}

// ─── LIVE ORDER ───────────────────────────────────────────────────────────────

async function grvtExecuteLiveOrder(params: {
  userId: number | null;
  strategy: typeof strategiesTable.$inferSelect;
  creds: GrvtCreds;
  session: GrvtAuthSession;
  instrument: GrvtInstrument;
  contractId: number;
  side: "buy" | "sell";
  size: Decimal;
  currentPrice: Decimal;
  orderKind?: "market" | "limit" | "post_only";
  limitPriceOffset?: number;
}): Promise<void> {
  const { userId, strategy, creds, session, instrument, contractId, side, size, currentPrice } = params;
  const orderKind       = params.orderKind ?? "post_only";
  const limitPriceOffset = params.limitPriceOffset ?? 0;
  const network         = creds.network;

  if (!creds.privateKey) {
    await grvtAddLog(userId, strategy.id, strategy.name, "error",
      "Private key tidak tersedia — tidak bisa sign order GRVT");
    return;
  }

  // ── Hitung limit price ────────────────────────────────────────────────────
  const isMarket  = orderKind === "market";
  const isPostOnly = orderKind === "post_only";

  let limitPriceStr: string;
  if (isMarket) {
    // Market order: gunakan harga sedikit agresif agar pasti terisi
    const slippage = currentPrice.mul(0.005); // 0.5% slippage tolerance
    const rawPrice = side === "buy"
      ? currentPrice.add(slippage)
      : currentPrice.sub(slippage);
    limitPriceStr = grvtRoundToTick(rawPrice.toNumber(), instrument.tick_size);
  } else {
    const offset = new Decimal(limitPriceOffset);
    const rawPrice = side === "buy"
      ? currentPrice.sub(offset)
      : currentPrice.add(offset);
    limitPriceStr = grvtRoundToTick(rawPrice.toNumber(), instrument.tick_size);
  }

  // ── Round size ke minimum lot ─────────────────────────────────────────────
  const sizeStr = grvtRoundToMinSize(size.toNumber(), instrument.min_size);
  const execSize = new Decimal(sizeStr);
  const execPrice = new Decimal(limitPriceStr);

  const minSize = new Decimal(instrument.min_size);
  if (execSize.lt(minSize)) {
    await grvtAddLog(userId, strategy.id, strategy.name, "warn",
      `Size terlalu kecil: ${sizeStr} (min: ${instrument.min_size})`,
      `Amount per order terlalu kecil relative ke harga $${currentPrice.toFixed(2)}`
    );
    return;
  }

  await grvtAddLog(userId, strategy.id, strategy.name, "info",
    `GRVT ${side.toUpperCase()} order akan dikirim`,
    `Kind: ${orderKind} | Size: ${sizeStr} | Price: $${limitPriceStr} | Network: ${network}`
  );

  // ── Submit order ke GRVT ──────────────────────────────────────────────────
  let orderId: string;
  try {
    const result = await createGrvtOrder(
      session,
      creds.privateKey,
      {
        subAccountId: creds.subAccountId,
        instrument:   instrument.instrument,
        size:         sizeStr,
        limitPrice:   limitPriceStr,
        isBuying:     side === "buy",
        timeInForce:  "GOOD_TILL_TIME",
        postOnly:     isPostOnly,
        reduceOnly:   false,
      },
      contractId,
      network
    );

    orderId = result?.order?.order_id ?? "";
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ strategyId: strategy.id, side, err: msg }, "[GrvtBot] Order submission FAILED");
    await grvtAddLog(userId, strategy.id, strategy.name, "error", "Order submission gagal", msg);
    if (userId !== null) {
      const notif = await grvtGetNotificationConfig(userId);
      if (notif.notifyOnError) {
        await grvtNotifyUser(userId, formatOrderFailed("grvt", strategy.name, msg));
      }
    }
    await grvtRecordTrade({
      userId, strategyId: strategy.id, strategyName: strategy.name,
      marketIndex: strategy.marketIndex, marketSymbol: strategy.marketSymbol,
      side, size: execSize, price: execPrice, status: "failed", errorMessage: msg,
    });
    return;
  }

  // ── Catat trade sebagai pending (GRVT: LIMIT order perlu polling untuk fill) ─
  const orderHash = orderId ? `grvt_${orderId}` : `grvt_submitted_${Date.now()}`;
  await grvtRecordTrade({
    userId, strategyId: strategy.id, strategyName: strategy.name,
    marketIndex: strategy.marketIndex, marketSymbol: strategy.marketSymbol,
    side, size: execSize, price: execPrice,
    status: isMarket ? "filled" : "pending",
    orderHash,
  });

  if (isMarket) {
    await grvtUpdateStrategyStatsAtomic(strategy.id, side, execSize, execPrice);
  }

  await grvtAddLog(userId, strategy.id, strategy.name, "success",
    `Live ${side.toUpperCase()} order dikirim (${orderKind})`,
    `OrderId: ${orderId} | Price: $${limitPriceStr} | Size: ${sizeStr}`
  );

  // Notif hanya untuk market orders yang langsung filled
  if (isMarket && userId !== null) {
    const notif = await grvtGetNotificationConfig(userId);
    const shouldNotify = side === "buy" ? notif.notifyOnBuy : notif.notifyOnSell;
    if (shouldNotify) {
      await grvtNotifyUser(userId,
        formatOrderFilled("grvt", side, sizeStr, strategy.marketSymbol, limitPriceStr));
    }
  }
}

// ─── EXECUTE GRID CHECK ───────────────────────────────────────────────────────

async function grvtExecuteGridCheck(strategy: typeof strategiesTable.$inferSelect): Promise<void> {
  const config = strategy.gridConfig as {
    lowerPrice: number;
    upperPrice: number;
    gridLevels: number;
    amountPerGrid: number;
    mode: "neutral" | "long" | "short";
    stopLoss?: number | null;
    takeProfit?: number | null;
    orderType?: "market" | "limit" | "post_only";
    limitPriceOffset?: number;
  } | null;

  if (!config) return;

  const userId = strategy.userId ?? null;

  // ── SHORT-CIRCUIT a/b: pending rerange ───────────────────────────────────
  if (strategy.pendingRerangeAt) {
    const elapsed = Date.now() - new Date(strategy.pendingRerangeAt).getTime();
    const RERANGE_TIMEOUT_MS = 20 * 60 * 1000;

    if (elapsed > RERANGE_TIMEOUT_MS) {
      await clearRerangeState(strategy.id);
      await grvtAddLog(userId, strategy.id, strategy.name, "warn",
        "⏸ Auto-Rerange timeout: tidak ada konfirmasi dalam 20 menit. Bot di-pause.",
        "User tidak merespons konfirmasi rerange. Atur parameter manual dari dashboard."
      );
      const pauseNotifCfg = userId !== null ? await getBotConfig(userId).catch(() => null) : null;
      await sendMainBotMessageWithButton(
        pauseNotifCfg?.notifyChatId,
        formatBotPaused("grvt", strategy.name, "Tidak ada konfirmasi rerange dalam 20 menit"),
        { text: "▶️ Start Bot", callback_data: `bot_restart_${strategy.id}` }
      );
      await stopGrvtBot(strategy.id);
      return;
    }

    // Belum timeout — cek apakah harga sudah kembali ke range
    const creds = userId !== null ? await getGrvtConfig(userId) : null;
    const network = creds?.network ?? "mainnet";
    const priceCheck = await grvtGetCurrentPrice(strategy.marketSymbol, network);
    if (priceCheck) {
      const lower = new Decimal(config.lowerPrice);
      const upper = new Decimal(config.upperPrice);
      if (priceCheck.gte(lower) && priceCheck.lte(upper)) {
        await clearRerangeState(strategy.id);
        await grvtAddLog(userId, strategy.id, strategy.name, "info",
          `✅ Harga kembali ke range ($${priceCheck.toFixed(4)}). Pending rerange dibatalkan otomatis.`,
          `Range: $${lower.toFixed(4)} - $${upper.toFixed(4)}`
        );
        // Tidak return → lanjutkan ke logika grid normal
      } else {
        return;
      }
    } else {
      return;
    }
  }

  // ── Ambil credentials dan instrument ─────────────────────────────────────
  const creds = userId !== null ? await getGrvtConfig(userId) : null;
  const hasCredentials = creds?.hasCredentials ?? false;
  const network = creds?.network ?? "mainnet";

  const instInfo = await getGrvtInstrumentInfo(strategy.marketSymbol, network);
  if (!instInfo) {
    await grvtAddLog(userId, strategy.id, strategy.name, "warn",
      `Instrument info tidak tersedia untuk ${strategy.marketSymbol}`,
      "Cek apakah market masih aktif di GRVT"
    );
    return;
  }

  // ── Ambil harga saat ini ──────────────────────────────────────────────────
  const currentPrice = await grvtGetCurrentPrice(strategy.marketSymbol, network);
  if (!currentPrice || currentPrice.lte(0)) {
    await grvtAddLog(userId, strategy.id, strategy.name, "warn",
      "Harga market tidak tersedia",
      `Market: ${strategy.marketSymbol} — WS belum terhubung & REST fallback gagal`
    );
    return;
  }

  const { lowerPrice, upperPrice, gridLevels, amountPerGrid, mode } = config;
  const currentPriceNum = currentPrice.toNumber();
  const lower = new Decimal(lowerPrice);
  const upper = new Decimal(upperPrice);
  const gridSpacing = upper.sub(lower).div(gridLevels);

  // ── Stop Loss / Take Profit ───────────────────────────────────────────────
  if (config.stopLoss && currentPriceNum <= config.stopLoss) {
    await grvtAddLog(userId, strategy.id, strategy.name, "warn",
      `Stop Loss triggered! Harga: $${currentPrice.toFixed(2)} ≤ SL: $${config.stopLoss}`,
      "Bot GRVT dihentikan otomatis karena stop loss"
    );
    if (userId !== null) {
      const notif = await grvtGetNotificationConfig(userId);
      if (notif.notifyOnStop) {
        await grvtNotifyUser(userId, formatStopLoss("grvt", strategy.name, strategy.marketSymbol,
          currentPrice.toFixed(2), config.stopLoss));
      }
    }
    await stopGrvtBot(strategy.id);
    return;
  }

  if (config.takeProfit && currentPriceNum >= config.takeProfit) {
    await grvtAddLog(userId, strategy.id, strategy.name, "success",
      `Take Profit triggered! Harga: $${currentPrice.toFixed(2)} ≥ TP: $${config.takeProfit}`,
      "Bot GRVT dihentikan otomatis karena take profit"
    );
    if (userId !== null) {
      const notif = await grvtGetNotificationConfig(userId);
      if (notif.notifyOnStop) {
        await grvtNotifyUser(userId, formatTakeProfit("grvt", strategy.name, strategy.marketSymbol,
          currentPrice.toFixed(2), config.takeProfit));
      }
    }
    await stopGrvtBot(strategy.id);
    return;
  }

  // ── Auto-Rerange saat harga di luar range ────────────────────────────────
  if (currentPrice.lt(lower) || currentPrice.gt(upper)) {
    const rerangeResult = await handleAutoRerange(strategy, currentPrice);
    switch (rerangeResult.type) {
      case "triggered":
        await grvtAddLog(userId, strategy.id, strategy.name, "warn",
          `🤖 Auto-Rerange triggered: harga $${currentPrice.toFixed(4)} keluar range. Menunggu konfirmasi user.`,
          `Range lama: $${lower.toFixed(4)}-$${upper.toFixed(4)} | Range baru AI: $${rerangeResult.params.newLowerPrice.toFixed(4)}-$${rerangeResult.params.newUpperPrice.toFixed(4)}`
        );
        break;
      case "continue":
        await grvtAddLog(userId, strategy.id, strategy.name, "warn",
          `Harga $${currentPrice.toFixed(4)} di luar range ($${lower.toFixed(4)} - $${upper.toFixed(4)}) — menunggu (${(strategy.consecutiveOutOfRange ?? 0) + 1}/5 ticks)`
        );
        break;
    }
    return;
  }

  // ── Hitung level saat ini ─────────────────────────────────────────────────
  const currentLevel = Math.min(
    Math.floor(currentPrice.sub(lower).div(gridSpacing).toNumber()),
    gridLevels - 1
  );
  const prevState = grvtGridStates.get(strategy.id);
  const lastLevel = prevState?.lastLevel ?? currentLevel;

  logger.debug(
    { strategyId: strategy.id, currentLevel, lastLevel, currentPrice: currentPriceNum },
    "[GrvtBot] Grid check"
  );

  if (prevState && currentLevel === lastLevel) return;

  // Inisialisasi state
  if (!prevState) {
    grvtGridStates.set(strategy.id, { lastLevel: currentLevel, initializedAt: new Date() });
    await grvtAddLog(userId, strategy.id, strategy.name, "info",
      `Grid GRVT diinisialisasi`,
      `Level: ${currentLevel}/${gridLevels} | Harga: $${currentPrice.toFixed(2)} | Range: $${lowerPrice}–$${upperPrice}`
    );
    return;
  }

  // ── Tentukan aksi ─────────────────────────────────────────────────────────
  const levelDelta = currentLevel - lastLevel;
  grvtGridStates.set(strategy.id, { lastLevel: currentLevel, initializedAt: prevState.initializedAt });

  let orderSide: "buy" | "sell" | null = null;
  const orderCount = Math.abs(levelDelta);
  const direction = levelDelta < 0 ? "down" : "up";

  if (direction === "down" && (mode === "neutral" || mode === "long")) {
    orderSide = "buy";
  } else if (direction === "up" && (mode === "neutral" || mode === "short")) {
    orderSide = "sell";
  }

  if (!orderSide) return;

  // ── Hitung size per grid ──────────────────────────────────────────────────
  const rawSize  = new Decimal(amountPerGrid).div(currentPrice);
  const sizeStr  = grvtRoundToMinSize(rawSize.toNumber(), instInfo.instrument.min_size);
  const size     = new Decimal(sizeStr);
  const minSize  = new Decimal(instInfo.instrument.min_size);

  if (size.lt(minSize)) {
    await grvtAddLog(userId, strategy.id, strategy.name, "warn",
      `Size terlalu kecil: ${sizeStr} (min: ${instInfo.instrument.min_size})`,
      `Amount per grid: $${amountPerGrid} | Price: $${currentPrice.toFixed(2)}`
    );
    return;
  }

  await grvtAddLog(userId, strategy.id, strategy.name, "info",
    `Grid level crossing: ${lastLevel} → ${currentLevel} | ${orderSide.toUpperCase()} ×${orderCount}`,
    `Harga: $${currentPrice.toFixed(2)} | Size: ${size.toFixed(6)} × ${orderCount}`
  );

  // ── Ambil session (hanya jika live) ──────────────────────────────────────
  let session: GrvtAuthSession | null = null;
  if (hasCredentials && creds && userId !== null) {
    session = await getOrRefreshGrvtSession(userId, creds);
    if (!session) {
      await grvtAddLog(userId, strategy.id, strategy.name, "error",
        "Session GRVT tidak bisa diambil — fallback ke paper trade");
      await grvtExecutePaperTrade({ userId, strategy, side: orderSide, size, price: currentPrice, orderCount: Math.min(orderCount, 3) });
      return;
    }
  }

  // ── Kirim orders — max 3 per tick ────────────────────────────────────────
  const maxOrders = Math.min(orderCount, 3);
  for (let i = 0; i < maxOrders; i++) {
    const targetPrice = currentPrice.toNumber();
    const { lower: tolLower, upper: tolUpper } = getDuplicateTolerance(targetPrice, gridSpacing.toNumber());
    const existingPending = await db.query.tradesTable.findFirst({
      where: and(
        eq(tradesTable.strategyId, strategy.id),
        eq(tradesTable.status, "pending"),
        eq(tradesTable.side, orderSide),
        gte(tradesTable.price, String(tolLower)),
        lte(tradesTable.price, String(tolUpper)),
      ),
    });
    if (existingPending) {
      logger.info({ strategyId: strategy.id, side: orderSide, targetPrice }, "Skip: pending order sudah ada di level ini");
      continue;
    }

    if (hasCredentials && creds && session) {
      await grvtExecuteLiveOrder({
        userId, strategy, creds, session,
        instrument: instInfo.instrument,
        contractId: instInfo.contractId,
        side: orderSide, size, currentPrice,
        orderKind: config.orderType ?? "post_only",
        limitPriceOffset: config.limitPriceOffset ?? 0,
      });
    } else {
      await grvtExecutePaperTrade({ userId, strategy, side: orderSide, size, price: currentPrice });
    }
  }
}

// ─── EXECUTE DCA ORDER ────────────────────────────────────────────────────────

async function grvtExecuteDcaOrder(strategy: typeof strategiesTable.$inferSelect): Promise<void> {
  const config = strategy.dcaConfig as {
    amountPerOrder: number;
    intervalMinutes: number;
    side: "buy" | "sell";
    orderType?: "market" | "limit" | "post_only";
    limitPriceOffset?: number;
  } | null;

  if (!config) return;

  const userId = strategy.userId ?? null;
  const creds  = userId !== null ? await getGrvtConfig(userId) : null;
  const network = creds?.network ?? "mainnet";

  const instInfo = await getGrvtInstrumentInfo(strategy.marketSymbol, network);
  if (!instInfo) {
    await grvtAddLog(userId, strategy.id, strategy.name, "warn",
      `Product info tidak tersedia: ${strategy.marketSymbol}`);
    return;
  }

  const currentPrice = await grvtGetCurrentPrice(strategy.marketSymbol, network);
  if (!currentPrice || currentPrice.lte(0)) {
    await grvtAddLog(userId, strategy.id, strategy.name, "warn",
      "Harga tidak tersedia untuk DCA GRVT", `Market: ${strategy.marketSymbol}`);
    return;
  }

  const rawSize = new Decimal(config.amountPerOrder).div(currentPrice);
  const sizeStr = grvtRoundToMinSize(rawSize.toNumber(), instInfo.instrument.min_size);
  const size    = new Decimal(sizeStr);
  const minSize = new Decimal(instInfo.instrument.min_size);

  if (size.lt(minSize)) {
    await grvtAddLog(userId, strategy.id, strategy.name, "warn",
      `DCA size terlalu kecil: ${sizeStr} (min: ${instInfo.instrument.min_size})`);
    return;
  }

  await grvtAddLog(userId, strategy.id, strategy.name, "info",
    `DCA GRVT ${config.side.toUpperCase()} dipicu`,
    `Amount: $${config.amountPerOrder} | Harga: $${currentPrice.toFixed(2)} | Size: ${sizeStr}`
  );

  if (!creds?.hasCredentials) {
    await grvtExecutePaperTrade({ userId, strategy, side: config.side, size, price: currentPrice });
    return;
  }

  const session = await getOrRefreshGrvtSession(userId!, creds);
  if (!session) {
    await grvtAddLog(userId, strategy.id, strategy.name, "error",
      "Session GRVT tidak bisa diambil — fallback ke paper trade");
    await grvtExecutePaperTrade({ userId, strategy, side: config.side, size, price: currentPrice });
    return;
  }

  await grvtExecuteLiveOrder({
    userId, strategy, creds, session,
    instrument: instInfo.instrument,
    contractId: instInfo.contractId,
    side: config.side, size, currentPrice,
    orderKind: config.orderType ?? "post_only",
    limitPriceOffset: config.limitPriceOffset ?? 0,
  });
}

// ─── JALANKAN STRATEGY SEKALI ─────────────────────────────────────────────────

async function grvtRunStrategyOnce(strategyId: number): Promise<void> {
  const strategy = await db.query.strategiesTable.findFirst({
    where: eq(strategiesTable.id, strategyId),
  });

  if (!strategy || !strategy.isRunning) return;

  try {
    if (strategy.type === "grid") {
      await grvtExecuteGridCheck(strategy);
    } else if (strategy.type === "dca") {
      await grvtExecuteDcaOrder(strategy);
    }
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ err, strategyId }, "[GrvtBot] Error in grvtRunStrategyOnce");
    await grvtAddLog(strategy.userId ?? null, strategyId, strategy.name, "error",
      "Error saat menjalankan strategi GRVT", msg);
  }

  // Update nextRunAt
  const bot = grvtRunningBots.get(strategyId);
  if (bot) {
    const intervalMs = strategy.type === "dca"
      ? ((strategy.dcaConfig as { intervalMinutes?: number })?.intervalMinutes ?? 60) * 60 * 1000
      : GRVT_GRID_FALLBACK_INTERVAL;
    bot.nextRunAt = new Date(Date.now() + intervalMs);
    await db.update(strategiesTable)
      .set({ nextRunAt: bot.nextRunAt, lastRunAt: new Date(), updatedAt: new Date() })
      .where(eq(strategiesTable.id, strategyId));
  }
}

// ─── START BOT ────────────────────────────────────────────────────────────────

export async function startGrvtBot(strategyId: number): Promise<boolean> {
  if (grvtRunningBots.has(strategyId)) {
    logger.info({ strategyId }, "[GrvtBot] Bot sudah running");
    return true;
  }

  const strategy = await db.query.strategiesTable.findFirst({
    where: and(eq(strategiesTable.id, strategyId), eq(strategiesTable.exchange, "grvt")),
  });

  if (!strategy) {
    throw new Error(`Strategy GRVT tidak ditemukan: ${strategyId}`);
  }

  const userId = strategy.userId ?? null;
  const creds  = userId !== null ? await getGrvtConfig(userId) : null;

  if (creds && !creds.hasCredentials) {
    logger.warn({ strategyId, userId }, "[GrvtBot] Credentials tidak lengkap — paper trade mode");
  }

  // Register WS price callback untuk real-time grid trigger
  const network = creds?.network ?? "mainnet";
  const isGrid  = strategy.type === "grid";

  registerGrvtPriceCallback(
    strategy.marketSymbol,
    strategyId,
    isGrid
      ? (_price: Decimal, _inst: string) => {
          const now  = Date.now();
          const last = grvtWsGridLastTriggered.get(strategyId) ?? 0;
          if (now - last < GRVT_WS_GRID_COOLDOWN_MS) return;
          if (!grvtRunningBots.has(strategyId)) return;
          grvtWsGridLastTriggered.set(strategyId, now);
          grvtRunStrategyOnce(strategyId).catch(() => {});
        }
      : () => {},
    network
  );

  const intervalMs = strategy.type === "dca"
    ? ((strategy.dcaConfig as { intervalMinutes?: number })?.intervalMinutes ?? 60) * 60 * 1000
    : GRVT_GRID_FALLBACK_INTERVAL;

  const nextRunAt = new Date(Date.now() + intervalMs);

  await db.update(strategiesTable)
    .set({ isRunning: true, isActive: true, updatedAt: new Date(), nextRunAt })
    .where(eq(strategiesTable.id, strategyId));

  const timer = setInterval(async () => {
    const bot = grvtRunningBots.get(strategyId);
    if (bot) {
      const s = await db.query.strategiesTable
        .findFirst({ where: eq(strategiesTable.id, strategyId) })
        .catch(() => null);
      const nextInterval = strategy.type === "dca"
        ? ((s?.dcaConfig as { intervalMinutes?: number })?.intervalMinutes ?? 60) * 60 * 1000
        : GRVT_GRID_FALLBACK_INTERVAL;
      bot.nextRunAt = new Date(Date.now() + nextInterval);
    }
    await grvtRunStrategyOnce(strategyId);
  }, intervalMs);

  grvtRunningBots.set(strategyId, { strategyId, timer, nextRunAt });

  await grvtAddLog(userId, strategyId, strategy.name, "success",
    "Bot GRVT dimulai",
    `Mode: WebSocket realtime + ${GRVT_GRID_FALLBACK_INTERVAL / 60000} menit fallback | Network: ${network}`
  );

  logger.info({ strategyId, type: strategy.type, exchange: "grvt" }, "[GrvtBot] Bot started");

  if (userId !== null) {
    const notif = await grvtGetNotificationConfig(userId).catch(() => null);
    if (notif?.notifyOnStart) {
      await grvtNotifyUser(userId,
        formatBotStarted("grvt", strategy.name, strategy.type, strategy.marketSymbol));
    }
  }

  // Jalankan setelah 8 detik — beri waktu WS connect
  setTimeout(() => grvtRunStrategyOnce(strategyId), 8_000);

  return true;
}

// ─── STOP BOT ─────────────────────────────────────────────────────────────────

export async function stopGrvtBot(strategyId: number, skipDbUpdate = false): Promise<boolean> {
  const bot = grvtRunningBots.get(strategyId);
  if (bot) {
    clearInterval(bot.timer);
    grvtRunningBots.delete(strategyId);
  }

  grvtGridStates.delete(strategyId);
  grvtWsGridLastTriggered.delete(strategyId);

  // Reset auto-rerange state
  await clearRerangeState(strategyId);

  // Unregister WS callback
  const strategy = await db.query.strategiesTable.findFirst({
    where: eq(strategiesTable.id, strategyId),
  });

  if (strategy) {
    unregisterGrvtPriceCallback(strategy.marketSymbol, strategyId);
  }

  if (!skipDbUpdate) {
    await db.update(strategiesTable)
      .set({ isRunning: false, updatedAt: new Date(), nextRunAt: null })
      .where(eq(strategiesTable.id, strategyId));
  }

  if (strategy) {
    await grvtAddLog(strategy.userId ?? null, strategyId, strategy.name, "warn",
      "Bot GRVT dihentikan");
    const userId = strategy.userId ?? null;
    if (userId !== null) {
      const notif = await grvtGetNotificationConfig(userId).catch(() => null);
      if (notif?.notifyOnStop) {
        await grvtNotifyUser(userId,
          formatBotStopped("grvt", strategy.name, strategy.marketSymbol));
      }
    }
  }

  return true;
}

// ─── RESTORE BOTS SAAT RESTART ────────────────────────────────────────────────

export async function restoreRunningGrvtBots(): Promise<void> {
  const strategies = await db.query.strategiesTable.findMany({
    where: and(
      eq(strategiesTable.isRunning, true),
      eq(strategiesTable.exchange, "grvt")
    ),
  });

  for (const s of strategies) {
    logger.info({ strategyId: s.id }, "[GrvtBot] Restoring running GRVT bot");
    try {
      await startGrvtBot(s.id);
    } catch (err) {
      logger.error({ strategyId: s.id, err }, "[GrvtBot] Failed to restore GRVT bot");
      await db.update(strategiesTable)
        .set({ isRunning: false })
        .where(eq(strategiesTable.id, s.id));
    }
  }
}

// ─── POLL PENDING TRADES ──────────────────────────────────────────────────────
// Cek status order GRVT yang masih pending.
// GRVT order statuses: PENDING, OPEN, FILLED, PARTIALLY_FILLED, REJECTED, CANCELLED, EXPIRED

const GRVT_TRADE_POLL_INTERVAL_MS = 1 * 60 * 1000;
const GRVT_TRADE_CHECK_AFTER_MS   = 2 * 60 * 1000;
const GRVT_TRADE_TIMEOUT_MS       = 30 * 60 * 1000;

export async function pollPendingGrvtTrades(): Promise<void> {
  try {
    const pendingTrades = await db.query.tradesTable.findMany({
      where: and(
        eq(tradesTable.status, "pending"),
        eq(tradesTable.exchange, "grvt"),
        isNotNull(tradesTable.orderHash),
        ne(tradesTable.orderHash, "")
      ),
    });

    // Filter hanya real orders (bukan paper trade)
    const realPending = pendingTrades.filter(
      (t) => t.orderHash?.startsWith("grvt_") && !t.orderHash?.startsWith("grvt_paper_") && !t.orderHash?.startsWith("grvt_submitted_")
    );

    if (realPending.length === 0) return;

    logger.info({ count: realPending.length }, "[GrvtBot] Poll: checking pending GRVT trades");

    // Cache credentials & session per userId
    const uniqueUserIds = [...new Set(
      realPending.map((t) => t.userId).filter((id): id is number => id !== null)
    )];

    const credsByUserId  = new Map<number, GrvtCreds | null>();
    const sessionByUserId = new Map<number, GrvtAuthSession | null>();

    await Promise.all(
      uniqueUserIds.map(async (uid) => {
        const c = await getGrvtConfig(uid).catch(() => null);
        credsByUserId.set(uid, c?.hasCredentials ? c : null);

        if (c?.hasCredentials) {
          const sess = await getOrRefreshGrvtSession(uid, c).catch(() => null);
          sessionByUserId.set(uid, sess);
        }
      })
    );

    for (const trade of realPending) {
      const ageMs = Date.now() - new Date(trade.createdAt).getTime();
      if (ageMs < GRVT_TRADE_CHECK_AFTER_MS) continue;

      const ageMinutes = Math.floor(ageMs / 60000);
      const orderId    = trade.orderHash!.slice("grvt_".length); // strip prefix "grvt_"
      const creds      = trade.userId !== null ? (credsByUserId.get(trade.userId) ?? null) : null;
      const session    = trade.userId !== null ? (sessionByUserId.get(trade.userId) ?? null) : null;

      if (!creds || !session) {
        logger.warn({ tradeId: trade.id, orderId, ageMinutes }, "[GrvtBot] Poll: no credentials/session");
        continue;
      }

      // Fetch order status dari GRVT
      let orderDetail: Awaited<ReturnType<typeof getGrvtOrder>>;
      try {
        orderDetail = await getGrvtOrder(session, orderId, creds.subAccountId, creds.network);
      } catch (err) {
        logger.warn({ err, tradeId: trade.id, orderId }, "[GrvtBot] Poll: getGrvtOrder gagal — skip");
        continue;
      }

      // Order tidak ditemukan
      if (!orderDetail) {
        await db.update(tradesTable)
          .set({ status: "failed", errorMessage: `Order tidak ditemukan di GRVT (orderId: ${orderId})` })
          .where(eq(tradesTable.id, trade.id));
        await grvtAddLog(trade.userId ?? null, trade.strategyId, trade.strategyName, "warn",
          `Order tidak ditemukan di GRVT`,
          `OrderId: ${orderId} | Usia: ${ageMinutes} menit`
        );
        continue;
      }

      const status       = orderDetail.state?.status ?? "PENDING";
      const filledSizeStr = orderDetail.state?.filled_size ?? "0";
      const filledDecimal = new Decimal(filledSizeStr);
      const fillPriceStr  = orderDetail.limit_price ?? trade.price ?? "0";
      const fillPrice     = new Decimal(fillPriceStr);
      const isTimedOut    = ageMs > GRVT_TRADE_TIMEOUT_MS;

      // Helper: mark filled
      const markFilledInDb = async (filledQty: Decimal, label: string) => {
        await db.update(tradesTable)
          .set({ status: "filled", executedAt: new Date() })
          .where(eq(tradesTable.id, trade.id));

        if (trade.strategyId !== null && filledQty.gt(0)) {
          await grvtUpdateStrategyStatsAtomic(
            trade.strategyId, trade.side as "buy" | "sell", filledQty, fillPrice);
        }

        await grvtAddLog(trade.userId ?? null, trade.strategyId, trade.strategyName, "success",
          `Order GRVT terisi (${label})`,
          `OrderId: ${orderId} | Status: ${status} | Qty: ${filledQty.toFixed(6)} | Price: $${fillPrice.toFixed(4)} | Usia: ${ageMinutes} menit`
        );

        if (trade.userId !== null) {
          const notif = await grvtGetNotificationConfig(trade.userId).catch(() => null);
          const shouldNotify = trade.side === "buy" ? notif?.notifyOnBuy : notif?.notifyOnSell;
          if (shouldNotify && notif) {
            await grvtNotifyUser(trade.userId,
              formatOrderFilled("grvt", trade.side, filledQty.toFixed(6),
                trade.marketSymbol, fillPrice.toFixed(4)));
          }
        }
      };

      if (status === "FILLED") {
        await markFilledInDb(filledDecimal, "konfirmasi polling FILLED");

      } else if (status === "CANCELLED" || status === "REJECTED" || status === "EXPIRED") {
        if (filledDecimal.gt(0)) {
          await markFilledInDb(filledDecimal, `partial fill saat ${status}`);
        } else {
          await db.update(tradesTable)
            .set({ status: "failed", errorMessage: `Order ${status} di GRVT tanpa fill` })
            .where(eq(tradesTable.id, trade.id));
          await grvtAddLog(trade.userId ?? null, trade.strategyId, trade.strategyName, "warn",
            `Order ${status} tanpa fill`,
            `OrderId: ${orderId} | Usia: ${ageMinutes} menit`
          );
        }

      } else if (status === "PARTIALLY_FILLED" && isTimedOut) {
        // Partial fill + timeout → catat apa yang sudah terisi, cancel sisanya
        try {
          await cancelGrvtOrder(session, { sub_account_id: creds.subAccountId, order_id: orderId }, creds.network);
        } catch { /* ignore cancel error */ }
        await markFilledInDb(filledDecimal, `partial fill setelah timeout ${ageMinutes} menit`);

      } else if ((status === "PENDING" || status === "OPEN") && isTimedOut) {
        // Belum ada fill sama sekali + timeout → cancel + mark failed
        try {
          await cancelGrvtOrder(session, { sub_account_id: creds.subAccountId, order_id: orderId }, creds.network);
        } catch { /* ignore cancel error */ }
        await db.update(tradesTable)
          .set({ status: "failed", errorMessage: `Order timeout setelah ${ageMinutes} menit (status: ${status})` })
          .where(eq(tradesTable.id, trade.id));
        await grvtAddLog(trade.userId ?? null, trade.strategyId, trade.strategyName, "error",
          `Order GRVT timeout`,
          `OrderId: ${orderId} | Status: ${status} | Usia: ${ageMinutes} menit`
        );

      } else {
        // Masih aktif (PENDING / OPEN / PARTIALLY_FILLED dalam batas waktu) — tunggu
        logger.debug({ tradeId: trade.id, orderId, ageMinutes, status }, "[GrvtBot] Poll: order masih aktif");
      }
    }
  } catch (err) {
    logger.error({ err }, "[GrvtBot] Error during pending GRVT trade monitoring");
  }
}

export function startGrvtTradePollSchedule(): void {
  setInterval(pollPendingGrvtTrades, GRVT_TRADE_POLL_INTERVAL_MS);
  logger.info(
    { intervalMs: GRVT_TRADE_POLL_INTERVAL_MS, checkAfterMs: GRVT_TRADE_CHECK_AFTER_MS, timeoutMs: GRVT_TRADE_TIMEOUT_MS },
    "[GrvtBot] Trade status polling started"
  );
}
