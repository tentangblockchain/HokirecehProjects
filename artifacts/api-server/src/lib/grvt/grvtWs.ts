import WebSocket from "ws";
import Decimal from "decimal.js";
import { logger } from "../logger";
import type { GrvtNetwork, GrvtOrderbookL2, GrvtTrade, GrvtAuthSession } from "./grvtTypes";
import { GRVT_WS_URLS } from "./grvtTypes";

// ─── GRVT WebSocket ────────────────────────────────────────────────────────────
// GRVT WS menggunakan format subscribe langsung (bukan JSON-RPC).
// Subscribe message: { stream, feed, method: "subscribe", is_full: true }
// Data event: { stream, selector, feed }
// Subscription confirmation: { subs: [...] }
//
// Stream names:
//   v1.mini.s   → mini ticker snapshot
//   v1.mini.d   → mini ticker delta
//   v1.book.s   → orderbook snapshot
//   v1.book.d   → orderbook delta
//   v1.trade.s  → trades snapshot
//   v1.trade.d  → trades delta
//
// Authenticated WebSocket: sertakan header Cookie dan X-Grvt-Account-Id.

// ─── Types ────────────────────────────────────────────────────────────────────

export type GrvtPriceCallback = (midPrice: Decimal, instrument: string) => void;
export type GrvtOrderbookCallback = (ob: GrvtOrderbookL2, instrument: string) => void;
export type GrvtTradeCallback = (trade: GrvtTrade, instrument: string) => void;

// ─── State ────────────────────────────────────────────────────────────────────

export const grvtWsPriceCache = new Map<string, { price: Decimal; ts: number }>();

const priceCallbacks = new Map<string, Map<number, GrvtPriceCallback>>();
const orderbookCallbacks = new Map<string, Map<number, GrvtOrderbookCallback>>();
const tradeCallbacks = new Map<string, Map<number, GrvtTradeCallback>>();

// Tracked feeds per stream type (untuk re-subscribe setelah reconnect)
const miniTickerFeeds = new Set<string>();   // instrument names
const orderbookFeeds = new Set<string>();    // instrument names
const tradeFeeds = new Set<string>();        // instrument names

let ws: WebSocket | null = null;
let currentNetwork: GrvtNetwork = "mainnet";
let currentSession: GrvtAuthSession | null = null;
let isConnected = false;
let isDestroyed = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectDelay = 2_000;

// ─── Session setter (untuk authenticated WebSocket) ───────────────────────────

export function setGrvtWsSession(session: GrvtAuthSession | null): void {
  currentSession = session;
}

// ─── Subscribe helpers ─────────────────────────────────────────────────────────

function sendSubscribe(stream: string, feeds: string[]): void {
  if (!ws || ws.readyState !== WebSocket.OPEN || feeds.length === 0) return;

  const msg = JSON.stringify({
    stream,
    feed: feeds,
    method: "subscribe",
    is_full: true,
  });

  ws.send(msg);
  logger.info({ stream, feeds }, "[GRVT WS] Subscribe sent");
}

function resubscribeAll(): void {
  if (miniTickerFeeds.size > 0) {
    sendSubscribe("v1.mini.s", Array.from(miniTickerFeeds));
  }
  if (orderbookFeeds.size > 0) {
    sendSubscribe("v1.book.s", Array.from(orderbookFeeds));
  }
  if (tradeFeeds.size > 0) {
    sendSubscribe("v1.trade.s", Array.from(tradeFeeds));
  }
}

// ─── Reconnect logic ───────────────────────────────────────────────────────────

function scheduleReconnect(): void {
  if (reconnectTimer || isDestroyed) return;
  logger.info({ delayMs: reconnectDelay }, "[GRVT WS] Scheduling reconnect");
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (!isDestroyed) connect(currentNetwork, currentSession ?? undefined);
  }, reconnectDelay);
  reconnectDelay = Math.min(reconnectDelay * 2, 60_000);
}

// ─── Message handler ──────────────────────────────────────────────────────────

function handleMessage(raw: string): void {
  try {
    const msg = JSON.parse(raw) as Record<string, any>;

    // ── Subscription confirmation (field: subs) ───────────────────────────────
    if (msg["subs"] !== undefined) {
      logger.info({ subs: msg["subs"] }, "[GRVT WS] Subscription confirmed");
      return;
    }

    // ── Data event (field: stream, selector, feed) ────────────────────────────
    const stream: string | undefined = msg["stream"];
    const selector: string | undefined = msg["selector"];
    const feed: any = msg["feed"];

    if (!stream || feed === undefined) return;

    const instrument = selector ?? "";

    // ── Mini ticker (price feed) ──────────────────────────────────────────────
    if (stream === "v1.mini.s" || stream === "v1.mini.d") {
      if (Array.isArray(feed)) {
        for (const item of feed) {
          handleMiniTickerEvent(item);
        }
      } else {
        handleMiniTickerEvent(feed);
      }
      return;
    }

    // ── Orderbook ─────────────────────────────────────────────────────────────
    if (stream === "v1.book.s" || stream === "v1.book.d") {
      if (Array.isArray(feed)) {
        for (const item of feed) {
          handleOrderbookEvent(item, instrument);
        }
      } else {
        handleOrderbookEvent(feed, instrument);
      }
      return;
    }

    // ── Trades ────────────────────────────────────────────────────────────────
    if (stream === "v1.trade.s" || stream === "v1.trade.d") {
      if (Array.isArray(feed)) {
        for (const item of feed) {
          handleTradeEvent(item, instrument);
        }
      } else {
        handleTradeEvent(feed, instrument);
      }
      return;
    }

  } catch {
    // ignore parse errors
  }
}

function handleMiniTickerEvent(data: any): void {
  try {
    const instrument: string = data.instrument ?? data.i;
    if (!instrument) return;

    let price: Decimal | null = null;

    if (data.best_bid_price && data.best_ask_price) {
      const bid = new Decimal(data.best_bid_price);
      const ask = new Decimal(data.best_ask_price);
      if (bid.gt(0) && ask.gt(0)) {
        price = bid.add(ask).div(2);
      }
    }

    if (!price && data.mark_price) {
      const mark = new Decimal(data.mark_price);
      if (mark.gt(0)) price = mark;
    }

    if (!price || !price.isFinite()) return;

    grvtWsPriceCache.set(instrument, { price, ts: Date.now() });

    const callbacks = priceCallbacks.get(instrument);
    if (callbacks) {
      for (const cb of callbacks.values()) {
        try { cb(price, instrument); } catch { /* ignore */ }
      }
    }
  } catch { /* ignore */ }
}

function handleOrderbookEvent(data: any, fallbackInstrument: string): void {
  try {
    const instrument: string = data.instrument ?? data.i ?? fallbackInstrument;
    if (!instrument) return;

    const ob: GrvtOrderbookL2 = {
      event_time: data.event_time ?? data.t ?? String(Date.now()),
      instrument,
      bids: (data.bids ?? data.b ?? []).map((b: any) => ({
        price: b.price ?? b.p,
        size: b.size ?? b.s,
        num_orders: b.num_orders ?? b.n ?? 0,
      })),
      asks: (data.asks ?? data.a ?? []).map((a: any) => ({
        price: a.price ?? a.p,
        size: a.size ?? a.s,
        num_orders: a.num_orders ?? a.n ?? 0,
      })),
    };

    if (ob.bids.length > 0 && ob.asks.length > 0) {
      const bid = new Decimal(ob.bids[0].price);
      const ask = new Decimal(ob.asks[0].price);
      if (bid.gt(0) && ask.gt(0)) {
        const mid = bid.add(ask).div(2);
        grvtWsPriceCache.set(instrument, { price: mid, ts: Date.now() });

        const priceCbs = priceCallbacks.get(instrument);
        if (priceCbs) {
          for (const cb of priceCbs.values()) {
            try { cb(mid, instrument); } catch { /* ignore */ }
          }
        }
      }
    }

    const callbacks = orderbookCallbacks.get(instrument);
    if (callbacks) {
      for (const cb of callbacks.values()) {
        try { cb(ob, instrument); } catch { /* ignore */ }
      }
    }
  } catch { /* ignore */ }
}

function handleTradeEvent(data: any, fallbackInstrument: string): void {
  try {
    const instrument: string = data.instrument ?? data.i ?? fallbackInstrument;
    if (!instrument) return;

    const trade: GrvtTrade = {
      event_time: data.event_time ?? data.t ?? String(Date.now()),
      instrument,
      is_taker_buyer: data.is_taker_buyer ?? data.b ?? false,
      size: data.size ?? data.q,
      price: data.price ?? data.p,
      mark_price: data.mark_price ?? data.m ?? "0",
      index_price: data.index_price ?? data.x ?? "0",
      trade_id: data.trade_id ?? data.id ?? String(Date.now()),
      venue: data.venue ?? "GRVT",
    };

    const callbacks = tradeCallbacks.get(instrument);
    if (callbacks) {
      for (const cb of callbacks.values()) {
        try { cb(trade, instrument); } catch { /* ignore */ }
      }
    }
  } catch { /* ignore */ }
}

// ─── Connect ──────────────────────────────────────────────────────────────────
// session opsional — jika disediakan, header Cookie dan X-Grvt-Account-Id
// akan ditambahkan saat koneksi WebSocket (authenticated stream).

export function connect(network: GrvtNetwork = "mainnet", session?: GrvtAuthSession): void {
  if (isDestroyed) return;
  currentNetwork = network;
  if (session) currentSession = session;

  if (ws) {
    if (isConnected) return;
    try { ws.terminate(); } catch { /* ignore */ }
    ws = null;
  }

  const url = GRVT_WS_URLS[network];
  logger.info({ url, network }, "[GRVT WS] Connecting");

  // Build optional auth headers untuk authenticated WebSocket
  const wsOptions: WebSocket.ClientOptions = {};
  const sess = currentSession;
  if (sess?.cookie || sess?.accountId) {
    const extraHeaders: Record<string, string> = {};
    if (sess.cookie) extraHeaders["Cookie"] = sess.cookie;
    if (sess.accountId) extraHeaders["X-Grvt-Account-Id"] = sess.accountId;
    wsOptions.headers = extraHeaders;
  }

  const sock = new WebSocket(url, wsOptions);
  ws = sock;

  sock.on("open", () => {
    logger.info({ network }, "[GRVT WS] Connected");
    isConnected = true;
    reconnectDelay = 2_000;
    resubscribeAll();
  });

  sock.on("message", (data: Buffer | string) => {
    handleMessage(typeof data === "string" ? data : data.toString("utf-8"));
  });

  sock.on("close", (code, reason) => {
    logger.warn({ code, reason: reason.toString(), network }, "[GRVT WS] Disconnected");
    isConnected = false;
    scheduleReconnect();
  });

  sock.on("error", (err: Error) => {
    logger.error({ err: err.message, network }, "[GRVT WS] Connection error");
    isConnected = false;
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function registerGrvtPriceCallback(
  instrument: string,
  strategyId: number,
  callback: GrvtPriceCallback,
  network: GrvtNetwork = "mainnet"
): void {
  isDestroyed = false;

  if (!priceCallbacks.has(instrument)) {
    priceCallbacks.set(instrument, new Map());
  }
  priceCallbacks.get(instrument)!.set(strategyId, callback);

  miniTickerFeeds.add(instrument);

  if (!ws || !isConnected) {
    connect(network);
  } else {
    sendSubscribe("v1.mini.s", Array.from(miniTickerFeeds));
  }
}

export function unregisterGrvtPriceCallback(instrument: string, strategyId: number): void {
  const callbacks = priceCallbacks.get(instrument);
  if (callbacks) {
    callbacks.delete(strategyId);
    if (callbacks.size === 0) {
      priceCallbacks.delete(instrument);
      miniTickerFeeds.delete(instrument);
    }
  }

  grvtWsPriceCache.delete(instrument);

  if (priceCallbacks.size === 0 && orderbookCallbacks.size === 0 && tradeCallbacks.size === 0) {
    destroyGrvtWs();
  }
}

export function registerGrvtOrderbookCallback(
  instrument: string,
  subscriptionId: number,
  callback: GrvtOrderbookCallback,
  network: GrvtNetwork = "mainnet"
): void {
  isDestroyed = false;

  if (!orderbookCallbacks.has(instrument)) {
    orderbookCallbacks.set(instrument, new Map());
  }
  orderbookCallbacks.get(instrument)!.set(subscriptionId, callback);

  orderbookFeeds.add(instrument);

  if (!ws || !isConnected) {
    connect(network);
  } else {
    sendSubscribe("v1.book.s", Array.from(orderbookFeeds));
  }
}

export function unregisterGrvtOrderbookCallback(instrument: string, subscriptionId: number): void {
  const callbacks = orderbookCallbacks.get(instrument);
  if (callbacks) {
    callbacks.delete(subscriptionId);
    if (callbacks.size === 0) {
      orderbookCallbacks.delete(instrument);
      orderbookFeeds.delete(instrument);
    }
  }
}

export function registerGrvtTradeCallback(
  instrument: string,
  subscriptionId: number,
  callback: GrvtTradeCallback,
  network: GrvtNetwork = "mainnet"
): void {
  isDestroyed = false;

  if (!tradeCallbacks.has(instrument)) {
    tradeCallbacks.set(instrument, new Map());
  }
  tradeCallbacks.get(instrument)!.set(subscriptionId, callback);

  tradeFeeds.add(instrument);

  if (!ws || !isConnected) {
    connect(network);
  } else {
    sendSubscribe("v1.trade.s", Array.from(tradeFeeds));
  }
}

export function getGrvtWsCachedPrice(instrument: string, maxAgeMs = 10_000): Decimal | null {
  const entry = grvtWsPriceCache.get(instrument);
  if (!entry) return null;
  if (Date.now() - entry.ts > maxAgeMs) return null;
  return entry.price;
}

export function destroyGrvtWs(): void {
  isDestroyed = true;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (ws) {
    try { ws.terminate(); } catch { /* ignore */ }
    ws = null;
  }
  isConnected = false;
  priceCallbacks.clear();
  orderbookCallbacks.clear();
  tradeCallbacks.clear();
  miniTickerFeeds.clear();
  orderbookFeeds.clear();
  tradeFeeds.clear();
  grvtWsPriceCache.clear();
}
