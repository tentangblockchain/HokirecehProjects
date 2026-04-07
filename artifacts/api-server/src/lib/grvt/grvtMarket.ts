import Decimal from "decimal.js";
import { logger } from "../logger";
import { GRVT_REST_URLS } from "./grvtTypes";
import type {
  GrvtNetwork,
  GrvtInstrument,
  GrvtMiniTicker,
  GrvtTrade,
  GrvtApiResponse,
} from "./grvtTypes";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

const FETCH_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 3;

async function grvtFetch<T>(
  path: string,
  network: GrvtNetwork = "mainnet",
  options?: RequestInit
): Promise<T> {
  const url = `${GRVT_REST_URLS[network]}${path}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": "HokirecehProjects/1.0 GRVTIntegration",
    ...(options?.headers as Record<string, string> | undefined),
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(url, { ...options, signal: controller.signal, headers });
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === "AbortError") {
        throw new Error(`GRVT Market API timeout: ${path}`);
      }
      throw err;
    }
    clearTimeout(timer);

    if (res.status === 429) {
      const waitMs = 2_000 * Math.pow(2, attempt);
      logger.warn({ path, attempt, waitMs }, "[GRVT Market] Rate limited, retrying...");
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw new Error(`GRVT Market API rate limited: ${path}`);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`GRVT Market API error ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
  }

  throw new Error(`GRVT Market API: max retries exceeded for ${path}`);
}

// ─── Instrument (market) cache ─────────────────────────────────────────────────

interface InstrumentCache {
  instruments: GrvtInstrument[];
  fetchedAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const instrumentCaches = new Map<GrvtNetwork, InstrumentCache>();
const runtimeFallback = new Map<GrvtNetwork, GrvtInstrument[]>();

// ─── Public: Get all instruments ───────────────────────────────────────────────
// Endpoint: GET /v1/instruments
// Returns list of all active instruments (perpetuals).

export async function getInstruments(
  network: GrvtNetwork = "mainnet"
): Promise<GrvtInstrument[]> {
  const cached = instrumentCaches.get(network);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.instruments;
  }

  try {
    const res = await grvtFetch<GrvtApiResponse<GrvtInstrument[]>>(
      "/v1/instruments",
      network
    );

    const instruments: GrvtInstrument[] = Array.isArray(res)
      ? res
      : (res.result ?? []);

    const filtered = instruments.filter((i) => i.kind === "PERPETUAL" || !i.kind);

    instrumentCaches.set(network, { instruments: filtered, fetchedAt: Date.now() });
    runtimeFallback.set(network, filtered);

    logger.info({ count: filtered.length, network }, "[GRVT Market] Instruments cached");
    return filtered;
  } catch (err) {
    logger.error({ err, network }, "[GRVT Market] Failed to fetch instruments");

    const fallback = runtimeFallback.get(network);
    if (fallback?.length) {
      logger.warn({ count: fallback.length, network }, "[GRVT Market] Using runtime fallback");
      return fallback;
    }

    const stale = instrumentCaches.get(network);
    if (stale?.instruments.length) return stale.instruments;

    return [];
  }
}

// ─── Get single instrument by name ────────────────────────────────────────────

export async function getInstrumentByName(
  instrument: string,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtInstrument | null> {
  const all = await getInstruments(network);
  return all.find((i) => i.instrument === instrument) ?? null;
}

// ─── Get mini ticker ───────────────────────────────────────────────────────────
// Endpoint: POST /v1/mini
// Body: { instrument: "BTC_USDT_Perp" }

export async function getMiniTicker(
  instrument: string,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtMiniTicker | null> {
  try {
    const res = await grvtFetch<GrvtApiResponse<GrvtMiniTicker>>(
      "/v1/mini",
      network,
      { method: "POST", body: JSON.stringify({ instrument }) }
    );
    const ticker = (res as any).result ?? res;
    if (ticker && typeof ticker === "object" && ticker.instrument) {
      return ticker as GrvtMiniTicker;
    }
    return null;
  } catch (err) {
    logger.error({ err, instrument, network }, "[GRVT Market] Failed to fetch mini ticker");
    return null;
  }
}

// ─── Get all mini tickers ──────────────────────────────────────────────────────
// Endpoint: POST /v1/mini — tanpa body untuk semua instrument

export async function getAllMiniTickers(
  network: GrvtNetwork = "mainnet"
): Promise<GrvtMiniTicker[]> {
  try {
    const res = await grvtFetch<GrvtApiResponse<GrvtMiniTicker[]>>(
      "/v1/mini",
      network,
      { method: "POST", body: JSON.stringify({}) }
    );
    const result = (res as any).result ?? res;
    return Array.isArray(result) ? result : [];
  } catch (err) {
    logger.error({ err, network }, "[GRVT Market] Failed to fetch all mini tickers");
    return [];
  }
}

// ─── Get recent trades ─────────────────────────────────────────────────────────
// Endpoint: POST /v1/trades
// Body: { instrument, limit, cursor }

export async function getRecentTrades(
  instrument: string,
  limit = 50,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtTrade[]> {
  try {
    const res = await grvtFetch<GrvtApiResponse<GrvtTrade[]>>(
      "/v1/trades",
      network,
      {
        method: "POST",
        body: JSON.stringify({ instrument, limit: String(limit) }),
      }
    );
    const result = (res as any).result ?? res;
    return Array.isArray(result) ? result : [];
  } catch (err) {
    logger.error({ err, instrument, network }, "[GRVT Market] Failed to fetch trades");
    return [];
  }
}

// ─── Get mid price from ticker ─────────────────────────────────────────────────

export async function getMidPrice(
  instrument: string,
  network: GrvtNetwork = "mainnet"
): Promise<Decimal | null> {
  const ticker = await getMiniTicker(instrument, network);
  if (!ticker) return null;

  if (ticker.best_bid_price && ticker.best_ask_price) {
    const bid = new Decimal(ticker.best_bid_price);
    const ask = new Decimal(ticker.best_ask_price);
    if (bid.gt(0) && ask.gt(0)) {
      return bid.add(ask).div(2);
    }
  }

  if (ticker.mark_price) {
    const mark = new Decimal(ticker.mark_price);
    if (mark.gt(0)) return mark;
  }

  return null;
}

// ─── Invalidate cache ──────────────────────────────────────────────────────────

export function invalidateGrvtInstrumentCache(network?: GrvtNetwork): void {
  if (network) {
    instrumentCaches.delete(network);
  } else {
    instrumentCaches.clear();
  }
}

// ─── Rounding utilities ────────────────────────────────────────────────────────

export function grvtRoundToTick(price: number, tickSize: string): string {
  const tick = new Decimal(tickSize);
  if (tick.lte(0)) return String(price);
  const decimals = (tickSize.split(".")[1] ?? "").length;
  return new Decimal(price)
    .div(tick)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .mul(tick)
    .toFixed(decimals);
}

export function grvtRoundToMinSize(size: number, minSize: string): string {
  const min = new Decimal(minSize);
  const decimals = (minSize.split(".")[1] ?? "").length;
  const result = new Decimal(size)
    .div(min)
    .toDecimalPlaces(0, Decimal.ROUND_DOWN)
    .mul(min);
  return result.lt(min) ? min.toFixed(decimals) : result.toFixed(decimals);
}
