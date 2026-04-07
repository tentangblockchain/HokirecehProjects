import { Router } from "express";
import { db } from "@workspace/db";
import { botLogsTable, tradesTable, strategiesTable } from "@workspace/db";
import { desc, eq, and, gte, asc } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../../middlewares/auth";
import {
  getGrvtCredentials,
  updateGrvtCredentials,
  deleteGrvtCredentials,
} from "../configService";
import { getInstruments, getMiniTicker, invalidateGrvtInstrumentCache } from "../../lib/grvt/grvtMarket";
import {
  getGrvtBalances,
  getGrvtPositions,
  getGrvtOpenOrders,
  getGrvtFundingPayments,
  testGrvtConnection,
} from "../../lib/grvt/grvtAccount";
import {
  loginWithApiKey,
  loginWithWallet,
  getGrvtWalletAddress,
  getCachedSession,
  setCachedSession,
} from "../../lib/grvt/grvtAuth";
import type { GrvtNetwork, GrvtAuthSession } from "../../lib/grvt/grvtTypes";

const router = Router();
router.use(authMiddleware);

// ─── Helper: get or refresh GRVT session ──────────────────────────────────────

async function getOrRefreshSession(
  userId: number,
  network: GrvtNetwork
): Promise<GrvtAuthSession | null> {
  const cached = getCachedSession(String(userId), network);
  if (cached) return cached;

  const creds = await getGrvtCredentials(userId);
  if (!creds.hasCredentials) return null;

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
  } catch {
    return null;
  }
}

// ─── LIST MARKETS ──────────────────────────────────────────────────────────────

router.get("/markets", async (req: AuthRequest, res) => {
  try {
    const creds = await getGrvtCredentials(req.userId!).catch(() => null);
    const network = (creds?.grvtNetwork ?? "mainnet") as GrvtNetwork;

    const instruments = await getInstruments(network);

    res.json(
      instruments.map((i) => ({
        instrument: i.instrument,
        instrument_hash: i.instrument_hash,
        base: i.base,
        quote: i.quote,
        kind: i.kind,
        tick_size: i.tick_size,
        min_size: i.min_size,
        base_decimals: i.base_decimals,
        quote_decimals: i.quote_decimals,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to fetch markets");
    res.status(500).json({ error: "Gagal mengambil daftar market GRVT" });
  }
});

// ─── REFRESH MARKET CACHE ──────────────────────────────────────────────────────

router.post("/markets/refresh", async (req: AuthRequest, res) => {
  try {
    const creds = await getGrvtCredentials(req.userId!).catch(() => null);
    const network = (creds?.grvtNetwork ?? "mainnet") as GrvtNetwork;
    invalidateGrvtInstrumentCache(network);
    const instruments = await getInstruments(network);
    res.json({ ok: true, count: instruments.length });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to refresh markets");
    res.status(500).json({ error: "Gagal refresh market cache GRVT" });
  }
});

// ─── GET TICKER ────────────────────────────────────────────────────────────────

router.get("/ticker/:instrument", async (req: AuthRequest, res) => {
  try {
    const creds = await getGrvtCredentials(req.userId!).catch(() => null);
    const network = (creds?.grvtNetwork ?? "mainnet") as GrvtNetwork;
    const { instrument } = req.params;

    const ticker = await getMiniTicker(instrument, network);
    if (!ticker) {
      return res.status(404).json({ error: `Ticker tidak ditemukan: ${instrument}` });
    }
    res.json(ticker);
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to fetch ticker");
    res.status(500).json({ error: "Gagal mengambil ticker GRVT" });
  }
});

// ─── ACCOUNT INFO ──────────────────────────────────────────────────────────────

router.get("/account", async (req: AuthRequest, res) => {
  try {
    const creds = await getGrvtCredentials(req.userId!);
    const network = creds.grvtNetwork;

    if (!creds.hasCredentials) {
      return res.json({
        hasCredentials: false,
        isConnected: false,
        walletAddress: null,
        subAccountId: null,
        balances: [],
        positions: [],
        openOrders: [],
      });
    }

    let walletAddress = creds.walletAddress ?? null;
    if (!walletAddress && creds.privateKey) {
      walletAddress = getGrvtWalletAddress(creds.privateKey);
    }

    const session = await getOrRefreshSession(req.userId!, network);
    if (!session) {
      return res.json({
        hasCredentials: true,
        isConnected: false,
        walletAddress,
        subAccountId: creds.subAccountId ?? null,
        balances: [],
        positions: [],
        openOrders: [],
        error: "Gagal autentikasi ke GRVT. Periksa API key atau private key.",
      });
    }

    const subAccountId = creds.subAccountId ?? "";

    const [balances, positions, openOrders] = await Promise.all([
      getGrvtBalances(subAccountId, session, network).catch(() => []),
      getGrvtPositions(subAccountId, session, network).catch(() => []),
      getGrvtOpenOrders(subAccountId, session, {}, network).catch(() => []),
    ]);

    res.json({
      hasCredentials: true,
      isConnected: true,
      walletAddress,
      subAccountId,
      balances,
      positions,
      openOrders,
      network,
    });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to fetch account");
    res.status(500).json({ error: "Gagal mengambil data akun GRVT" });
  }
});

// ─── FUNDING PAYMENTS ──────────────────────────────────────────────────────────

router.get("/funding", async (req: AuthRequest, res) => {
  try {
    const creds = await getGrvtCredentials(req.userId!);
    const network = creds.grvtNetwork;

    if (!creds.hasCredentials || !creds.subAccountId) {
      return res.json({ payments: [] });
    }

    const session = await getOrRefreshSession(req.userId!, network);
    if (!session) {
      return res.status(401).json({ error: "Gagal autentikasi ke GRVT" });
    }

    const instrument = req.query.instrument as string | undefined;
    const payments = await getGrvtFundingPayments(
      creds.subAccountId,
      session,
      { instrument, limit: 50 },
      network
    );

    res.json({ payments });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to fetch funding payments");
    res.status(500).json({ error: "Gagal mengambil funding payments GRVT" });
  }
});

// ─── TEST CONNECTION ───────────────────────────────────────────────────────────

router.get("/test-connection", async (req: AuthRequest, res) => {
  try {
    const creds = await getGrvtCredentials(req.userId!);
    if (!creds.hasCredentials) {
      return res.json({ ok: false, reason: "Credentials belum dikonfigurasi" });
    }
    const network = creds.grvtNetwork;

    const publicResult = await testGrvtConnection(null, network);
    if (!publicResult.ok) return res.json(publicResult);

    const session = await getOrRefreshSession(req.userId!, network);
    if (!session) {
      return res.json({ ok: false, reason: "Autentikasi gagal — periksa API key / private key" });
    }

    res.json({ ok: true, network });
  } catch (err: any) {
    res.json({ ok: false, reason: err.message });
  }
});

// ─── CREDENTIALS ──────────────────────────────────────────────────────────────

router.get("/credentials", async (req: AuthRequest, res) => {
  try {
    const creds = await getGrvtCredentials(req.userId!);
    res.json({
      hasApiKey: creds.hasApiKey,
      hasPrivateKey: creds.hasPrivateKey,
      hasCredentials: creds.hasCredentials,
      walletAddress: creds.walletAddress ?? null,
      subAccountId: creds.subAccountId ?? null,
      grvtNetwork: creds.grvtNetwork,
    });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to fetch credentials");
    res.status(500).json({ error: "Gagal mengambil credentials GRVT" });
  }
});

router.put("/credentials", async (req: AuthRequest, res) => {
  const { apiKey, privateKey, walletAddress, subAccountId, grvtNetwork } = req.body;

  try {
    let resolvedWalletAddress = walletAddress;
    if (privateKey && !resolvedWalletAddress) {
      try {
        resolvedWalletAddress = getGrvtWalletAddress(privateKey);
      } catch {
        return res.status(400).json({ error: "Private key tidak valid" });
      }
    }

    await updateGrvtCredentials(req.userId!, {
      ...(apiKey !== undefined && { apiKey }),
      ...(privateKey !== undefined && { privateKey }),
      ...(resolvedWalletAddress !== undefined && { walletAddress: resolvedWalletAddress }),
      ...(subAccountId !== undefined && { subAccountId }),
      ...(grvtNetwork !== undefined && { grvtNetwork }),
    });

    const updated = await getGrvtCredentials(req.userId!);
    res.json({
      ok: true,
      hasCredentials: updated.hasCredentials,
      walletAddress: updated.walletAddress ?? null,
      grvtNetwork: updated.grvtNetwork,
    });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to update credentials");
    res.status(500).json({ error: "Gagal menyimpan credentials GRVT" });
  }
});

router.delete("/credentials", async (req: AuthRequest, res) => {
  try {
    await deleteGrvtCredentials(req.userId!);
    res.json({ ok: true, message: "Credentials GRVT berhasil dihapus" });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to delete credentials");
    res.status(500).json({ error: "Gagal menghapus credentials GRVT" });
  }
});

// ─── LIST STRATEGIES ───────────────────────────────────────────────────────────

router.get("/", async (req: AuthRequest, res) => {
  try {
    const strategies = await db.query.strategiesTable.findMany({
      where: and(
        eq(strategiesTable.userId, req.userId!),
        eq(strategiesTable.exchange, "grvt")
      ),
      orderBy: [desc(strategiesTable.createdAt)],
    });

    res.json(
      strategies.map((s) => ({
        ...s,
        isRunning: false,
        nextRunAt: null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to list strategies");
    res.status(500).json({ error: "Gagal mengambil daftar strategy GRVT" });
  }
});

// ─── GET SINGLE STRATEGY ───────────────────────────────────────────────────────

router.get("/:strategyId", async (req: AuthRequest, res) => {
  const strategyId = parseInt(String(req.params.strategyId));
  if (isNaN(strategyId)) return res.status(400).json({ error: "strategyId tidak valid" });

  try {
    const strategy = await db.query.strategiesTable.findFirst({
      where: and(
        eq(strategiesTable.id, strategyId),
        eq(strategiesTable.userId, req.userId!),
        eq(strategiesTable.exchange, "grvt")
      ),
    });
    if (!strategy) return res.status(404).json({ error: "Strategy GRVT tidak ditemukan" });

    res.json({ ...strategy, isRunning: false, nextRunAt: null });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to get strategy");
    res.status(500).json({ error: "Gagal mengambil strategy GRVT" });
  }
});

// ─── CREATE STRATEGY ───────────────────────────────────────────────────────────

router.post("/", async (req: AuthRequest, res) => {
  const { name, type, marketSymbol, marketIndex, gridConfig, dcaConfig, isActive } = req.body;

  if (!name || !type || !marketSymbol) {
    return res.status(400).json({ error: "name, type, dan marketSymbol wajib diisi" });
  }

  if (!["grid", "dca"].includes(type)) {
    return res.status(400).json({ error: "type harus 'grid' atau 'dca'" });
  }

  try {
    const [strategy] = await db.insert(strategiesTable).values({
      userId: req.userId!,
      exchange: "grvt",
      name,
      type,
      marketSymbol,
      marketIndex: marketIndex ?? 0,
      gridConfig: gridConfig ?? null,
      dcaConfig: dcaConfig ?? null,
      isActive: isActive ?? true,
      isRunning: false,
    }).returning();

    res.status(201).json(strategy);
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to create strategy");
    res.status(500).json({ error: "Gagal membuat strategy GRVT" });
  }
});

// ─── UPDATE STRATEGY ───────────────────────────────────────────────────────────

router.put("/:strategyId", async (req: AuthRequest, res) => {
  const strategyId = parseInt(String(req.params.strategyId));
  if (isNaN(strategyId)) return res.status(400).json({ error: "strategyId tidak valid" });

  try {
    const strategy = await db.query.strategiesTable.findFirst({
      where: and(
        eq(strategiesTable.id, strategyId),
        eq(strategiesTable.userId, req.userId!),
        eq(strategiesTable.exchange, "grvt")
      ),
    });
    if (!strategy) return res.status(404).json({ error: "Strategy GRVT tidak ditemukan" });

    const { name, type, marketSymbol, marketIndex, gridConfig, dcaConfig, isActive } = req.body;

    const [updated] = await db.update(strategiesTable)
      .set({
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(marketSymbol !== undefined && { marketSymbol }),
        ...(marketIndex !== undefined && { marketIndex }),
        ...(gridConfig !== undefined && { gridConfig }),
        ...(dcaConfig !== undefined && { dcaConfig }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(strategiesTable.id, strategyId))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to update strategy");
    res.status(500).json({ error: "Gagal memperbarui strategy GRVT" });
  }
});

// ─── DELETE STRATEGY ───────────────────────────────────────────────────────────

router.delete("/:strategyId", async (req: AuthRequest, res) => {
  const strategyId = parseInt(String(req.params.strategyId));
  if (isNaN(strategyId)) return res.status(400).json({ error: "strategyId tidak valid" });

  try {
    const strategy = await db.query.strategiesTable.findFirst({
      where: and(
        eq(strategiesTable.id, strategyId),
        eq(strategiesTable.userId, req.userId!),
        eq(strategiesTable.exchange, "grvt")
      ),
    });
    if (!strategy) return res.status(404).json({ error: "Strategy GRVT tidak ditemukan" });

    await db.delete(strategiesTable).where(eq(strategiesTable.id, strategyId));
    res.json({ ok: true, message: "Strategy GRVT berhasil dihapus" });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to delete strategy");
    res.status(500).json({ error: "Gagal menghapus strategy GRVT" });
  }
});

// ─── LOGS ─────────────────────────────────────────────────────────────────────

router.get("/logs/recent", async (req: AuthRequest, res) => {
  const limit = Math.min(parseInt(String(req.query.limit ?? "50")), 200);
  const strategyId = req.query.strategyId
    ? parseInt(String(req.query.strategyId))
    : undefined;

  try {
    const logs = await db.query.botLogsTable.findMany({
      where: and(
        eq(botLogsTable.userId, req.userId!),
        eq(botLogsTable.exchange, "grvt"),
        strategyId ? eq(botLogsTable.strategyId, strategyId) : undefined
      ),
      orderBy: [desc(botLogsTable.createdAt)],
      limit,
    });
    res.json({ logs });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to fetch logs");
    res.status(500).json({ error: "Gagal mengambil logs GRVT" });
  }
});

// ─── PNL CHART ────────────────────────────────────────────────────────────────

router.get("/pnl/:strategyId", async (req: AuthRequest, res) => {
  const strategyId = parseInt(String(req.params.strategyId));
  if (isNaN(strategyId)) return res.status(400).json({ error: "strategyId diperlukan" });

  try {
    const strategy = await db.query.strategiesTable.findFirst({
      where: and(
        eq(strategiesTable.id, strategyId),
        eq(strategiesTable.userId, req.userId!),
        eq(strategiesTable.exchange, "grvt")
      ),
    });
    if (!strategy) return res.status(404).json({ error: "Strategy GRVT tidak ditemukan" });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trades = await db.query.tradesTable.findMany({
      where: and(
        eq(tradesTable.strategyId, strategyId),
        eq(tradesTable.status, "filled"),
        gte(tradesTable.executedAt, thirtyDaysAgo)
      ),
      orderBy: [asc(tradesTable.executedAt)],
    });

    const dailyMap = new Map<string, { buys: number; sells: number; dailyPnl: number }>();
    let runningBuyVolume = 0;
    let runningBuyValue = 0;

    for (const trade of trades) {
      const date = (trade.executedAt ?? trade.createdAt).toISOString().split("T")[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { buys: 0, sells: 0, dailyPnl: 0 });
      }
      const d = dailyMap.get(date)!;
      const size = parseFloat(trade.size);
      const price = parseFloat(trade.price);

      if (trade.side === "buy") {
        d.buys++;
        runningBuyVolume += size;
        runningBuyValue += size * price;
      } else {
        d.sells++;
        if (runningBuyVolume > 0) {
          const avgBuyPrice = runningBuyValue / runningBuyVolume;
          d.dailyPnl += size * (price - avgBuyPrice);
          const consumed = Math.min(size, runningBuyVolume);
          runningBuyValue -= consumed * avgBuyPrice;
          runningBuyVolume -= consumed;
          if (runningBuyVolume < 1e-10) { runningBuyVolume = 0; runningBuyValue = 0; }
        }
      }
    }

    const sortedDates = Array.from(dailyMap.keys()).sort();
    let cumulativePnl = 0;
    const data = sortedDates.map((date) => {
      const d = dailyMap.get(date)!;
      cumulativePnl += d.dailyPnl;
      return { date, buys: d.buys, sells: d.sells, estimatedPnl: d.dailyPnl, cumulativePnl };
    });

    res.json({ data });
  } catch (err) {
    req.log.error({ err }, "[GRVT] Failed to get PnL chart");
    res.status(500).json({ error: "Gagal mengambil data PnL chart GRVT" });
  }
});

export default router;
