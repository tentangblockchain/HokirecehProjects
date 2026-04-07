import WebSocket from "ws";
import Decimal from "decimal.js";
import { logger } from "../logger";
import type { GrvtNetwork, GrvtOrderbookL2, GrvtTrade } from "./grvtTypes";
import { GRVT_WS_URLS } from "./grvtTypes";

// ─── GRVT WebSocket ────────────────────────────────────────────────────────────
// GRVT WS menggunakan JSON-RPC 2.0, bukan standard pub/sub.
// Subscribe message: { jsonrpc: "2.0", method: "subscribe", params: { stream, ... }, id: N }
// Response event: { jsonrpc: "2.0", method: "subscribe", params: { channel, data } }
//
// Stream yang didukung:
//   v1.orderbook.l2.{instrument}  → orderbook L2 (bids/asks)
//   v1.trade.{instrument}         → recent trades
//   v1.mini.{instrument}          → mini ticker (price feed)

// ─── Types ────────────────────────────────────────────────────────────────────

export type GrvtPriceCallback = (midPrice: Decimal, instrument: string) => void;
export type GrvtOrderbookCallback = (ob: GrvtOrderbookL2, instrument: string) => void;
export type GrvtTradeCallback = (trade: GrvtTrade, instrument: string) => void;

// ─── State ────────────────────────────────────────────────────────────────────

export const grvtWsPriceCache = new Map<string, { price: Decimal; ts: number }>();

const priceCallbacks = new Map<string, Map<number, GrvtPriceCallback>>();
const orderbookCallbacks = new Map<string, Map<number, GrvtOrderbookCallback>>();
const tradeCallbacks = new Map<string, Map<number, GrvtTradeCallback>>();

let ws: WebSocket | null = null;
let currentNetwork: GrvtNetwork = "mainnet";
let isConnected = false;
let isDestroyed = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectDelay = 2_000;
let rpcIdCounter = 1;

// Subscribed streams set (untuk re-subscribe setelah reconnect)
const subscribedStreams = new Set<string>();

// ─── JSON-RPC helpers ─────────────────────────────────────────────────────────

function nextRpcId(): number {
  return rpcIdCounter++;
}

function sendSubscribe(stream: string): void {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  const msg = JSON.stringify({
    jsonrpc: "2.0",
    method: "subscribe",
    params: { stream },
    id: nextRpcId(),
  });

  ws.send(msg);
  logger.info({ stream }, "[GRVT WS] Subscribe sent");
}

function resubscribeAll(): void {
  for (const stream of subscribedStreams) {
    sendSubscribe(stream);
  }
}

// ─── Reconnect logic ───────────────────────────────────────────────────────────

function scheduleReconnect(): void {
  if (reconnectTimer || isDestroyed) return;
  logger.info({ delayMs: reconnectDelay }, "[GRVT WS] Scheduling reconnect");
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (!isDestroyed) connect(currentNetwork);
  }, reconnectDelay);
  reconnectDelay = Math.min(reconnectDelay * 2, 60_000);
}

// ─── Message handler ──────────────────────────────────────────────────────────

function handleMessage(raw: string): void {
  try {
    const msg = JSON.parse(raw) as {
      jsonrpc?: string;
      method?: string;
      params?: any;
      result?: any;
      error?: any;
      id?: number;
    };

    // Confirmation / error response (id present)
    if (msg.id !== undefined && msg.error) {
      logger.warn({ error: msg.error }, "[GRVT WS] Subscribe error response");
      return;
    }

    // Event broadcast
    if (msg.method === "subscribe" && msg.params) {
      const { channel, data } = msg.params as { channel?: string; data?: any };

      if (!channel || !data) return;

      // ── Mini ticker (price feed) ────────────────────────────────────────────
      if (channel.startsWith("v1.mini.") || channel === "v1.mini") {
        handleMiniTickerEvent(data);
        return;
      }

      // ── Orderbook L2 ───────────────────────────────────────────────────────
      if (channel.startsWith("v1.orderbook.l2.") || channel === "v1.orderbook.l2") {
        handleOrderbookEvent(data);
        return;
      }

      // ── Trade ─────────────────────────────────────────────────────────────
      if (channel.startsWith("v1.trade.") || channel === "v1.trade") {
        handleTradeEvent(data);
        return;
      }
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

function handleOrderbookEvent(data: any): void {
  try {
    const instrument: string = data.instrument ?? data.i;
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

    // Update price cache dari best bid/ask orderbook
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

function handleTradeEvent(data: any): void {
  try {
    const instrument: string = data.instrument ?? data.i;
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

export function connect(network: GrvtNetwork = "mainnet"): void {
  if (isDestroyed) return;
  currentNetwork = network;

  if (ws) {
    if (isConnected) return;
    try { ws.terminate(); } catch { /* ignore */ }
    ws = null;
  }

  const url = GRVT_WS_URLS[network];
  logger.info({ url, network }, "[GRVT WS] Connecting");

  const sock = new WebSocket(url);
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

  // Subscribe to mini ticker stream for price feed
  const stream = `v1.mini.${instrument}`;
  subscribedStreams.add(stream);

  if (!ws || !isConnected) {
    connect(network);
  } else {
    sendSubscribe(stream);
  }
}

export function unregisterGrvtPriceCallback(instrument: string, strategyId: number): void {
  const callbacks = priceCallbacks.get(instrument);
  if (callbacks) {
    callbacks.delete(strategyId);
    if (callbacks.size === 0) priceCallbacks.delete(instrument);
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

  const stream = `v1.orderbook.l2.${instrument}`;
  subscribedStreams.add(stream);

  if (!ws || !isConnected) {
    connect(network);
  } else {
    sendSubscribe(stream);
  }
}

export function unregisterGrvtOrderbookCallback(instrument: string, subscriptionId: number): void {
  const callbacks = orderbookCallbacks.get(instrument);
  if (callbacks) {
    callbacks.delete(subscriptionId);
    if (callbacks.size === 0) orderbookCallbacks.delete(instrument);
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

  const stream = `v1.trade.${instrument}`;
  subscribedStreams.add(stream);

  if (!ws || !isConnected) {
    connect(network);
  } else {
    sendSubscribe(stream);
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
  subscribedStreams.clear();
  grvtWsPriceCache.clear();
}
