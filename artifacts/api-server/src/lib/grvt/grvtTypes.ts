// ─── GRVT Types ───────────────────────────────────────────────────────────────
// Sumber: https://api-docs.grvt.io/
// GRVT adalah DEX perpetual berbasis EVM dengan auth via API Key atau EIP-712 wallet signing.

export type GrvtNetwork = "mainnet" | "testnet";

// ─── Base URLs ────────────────────────────────────────────────────────────────

// Auth endpoint (edge.grvt.io) — BERBEDA dari data/trading endpoint
export const GRVT_AUTH_URLS: Record<GrvtNetwork, string> = {
  mainnet: "https://edge.grvt.io",
  testnet: "https://edge.testnet.grvt.io",
};

// Market data & trading REST endpoint
export const GRVT_REST_URLS: Record<GrvtNetwork, string> = {
  mainnet: "https://api.grvt.io",
  testnet: "https://api.testnet.grvt.io",
};

// WebSocket endpoint — path /ws/full untuk full data stream
export const GRVT_WS_URLS: Record<GrvtNetwork, string> = {
  mainnet: "wss://stream.grvt.io/ws/full",
  testnet: "wss://stream.testnet.grvt.io/ws/full",
};

// ─── Auth types ────────────────────────────────────────────────────────────────

export interface GrvtApiKeyLoginRequest {
  api_key: string;
}

export interface GrvtWalletLoginRequest {
  address: string;
  signature: {
    signer: string;
    v: number;
    r: string;
    s: string;
    nonce: number;
    expiration: string;
    chain_id: string;
  };
}

export interface GrvtAuthSession {
  cookie: string;
  token?: string;
  expiresAt?: number;
  accountId: string;
}

// ─── Instrument types ──────────────────────────────────────────────────────────

export type GrvtInstrumentKind = "PERPETUAL" | "SPOT" | "FUTURE";
export type GrvtCurrency = "USDT" | "USDC" | "BTC" | "ETH" | string;

export interface GrvtInstrument {
  instrument: string;
  instrument_hash: string;
  base: GrvtCurrency;
  quote: GrvtCurrency;
  kind: GrvtInstrumentKind;
  venues: string[];
  settlement_period: string;
  base_decimals: number;
  quote_decimals: number;
  tick_size: string;
  min_size: string;
  create_time: string;
  is_active?: boolean;
}

// ─── Ticker types ──────────────────────────────────────────────────────────────

export interface GrvtMiniTicker {
  instrument: string;
  open: string;
  high: string;
  low: string;
  close: string;
  diff: string;
  volume: string;
  num_trades: string;
  open_time: string;
  close_time: string;
  mark_price: string;
  index_price: string;
  funding_rate_curr: string;
  funding_rate_avg: string;
  interest_rate: string;
  forward_price?: string;
  best_bid_price: string;
  best_bid_size: string;
  best_ask_price: string;
  best_ask_size: string;
}

export interface GrvtTicker extends GrvtMiniTicker {
  open_interest: string;
  settlement_price?: string;
  estimated_delivery_price?: string;
}

// ─── Trade types ───────────────────────────────────────────────────────────────

export interface GrvtTrade {
  event_time: string;
  instrument: string;
  is_taker_buyer: boolean;
  size: string;
  price: string;
  mark_price: string;
  index_price: string;
  trade_id: string;
  venue: string;
  client_trade_id?: string;
}

// ─── Order types ───────────────────────────────────────────────────────────────

export type GrvtOrderSide = "BUY" | "SELL";
export type GrvtOrderType = "LIMIT" | "MARKET";
export type GrvtTimeInForce = "GOOD_TILL_TIME" | "ALL_OR_NONE" | "IMMEDIATE_OR_CANCEL" | "FILL_OR_KILL";
export type GrvtOrderStatus =
  | "PENDING"
  | "OPEN"
  | "FILLED"
  | "PARTIALLY_FILLED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

export interface GrvtOrderLeg {
  instrument: string;
  size: string;
  limit_price?: string;
  is_buying_asset: boolean;
}

export interface GrvtOrder {
  order_id: string;
  client_order_id?: string;
  sub_account_id: string;
  is_market: boolean;
  time_in_force: GrvtTimeInForce;
  limit_price: string;
  trigger_price?: string;
  post_only: boolean;
  reduce_only: boolean;
  legs: GrvtOrderLeg[];
  signature: GrvtSignature;
  metadata?: GrvtOrderMetadata;
  create_time?: string;
  state?: GrvtOrderState;
}

export interface GrvtOrderMetadata {
  client_order_id?: string;
  create_time?: string;
}

export interface GrvtOrderState {
  status: GrvtOrderStatus;
  reject_reason?: string;
  book_at_create_time?: string;
  request_id?: string;
  time_in_force?: GrvtTimeInForce;
  filled_size?: string;
  leaves_size?: string;
  cost?: string;
  cumulative_fees?: string;
  cumulative_rebates?: string;
}

export interface GrvtSignature {
  signer: string;
  r: string;
  s: string;
  v: number;
  expiration: string;
  nonce: number;
  chain_id: string;
}

// ─── Create order request ──────────────────────────────────────────────────────

export interface GrvtCreateOrderRequest {
  order: GrvtOrder;
}

export interface GrvtCreateOrderResponse {
  order: GrvtOrder;
}

// ─── Cancel order request ──────────────────────────────────────────────────────

export interface GrvtCancelOrderRequest {
  sub_account_id: string;
  order_id?: string;
  client_order_id?: string;
}

export interface GrvtCancelAllOrdersRequest {
  sub_account_id: string;
  kind?: GrvtInstrumentKind;
  base?: GrvtCurrency;
  quote?: GrvtCurrency;
}

// ─── Amend order request ──────────────────────────────────────────────────────

export interface GrvtAmendOrderRequest {
  order: GrvtOrder;
}

// ─── Account types ─────────────────────────────────────────────────────────────

export interface GrvtBalance {
  currency: GrvtCurrency;
  balance: string;
  index_price: string;
}

export interface GrvtSubAccount {
  sub_account_id: string;
  margin_type: string;
  settle_currency: GrvtCurrency;
  total_equity: string;
  initial_margin: string;
  maintenance_margin: string;
  available_balance: string;
  spot_margin: string;
  open_order_initial_margin: string;
  unrealized_pnl: string;
  net_span_margin?: string;
  portfolio_initial_margin?: string;
  portfolio_maintenance_margin?: string;
}

export interface GrvtPosition {
  event_time: string;
  sub_account_id: string;
  instrument: string;
  size: string;
  notional: string;
  entry_price: string;
  exit_price: string;
  mark_price: string;
  unrealized_pnl: string;
  realized_pnl: string;
  total_pnl: string;
  roi: string;
  quote_index_price: string;
}

// ─── Funding payment type ──────────────────────────────────────────────────────

export interface GrvtFundingPayment {
  event_time: string;
  sub_account_id: string;
  instrument: string;
  currency: GrvtCurrency;
  total_funding_payment: string;
  funding_rate: string;
  mark_price: string;
  position_size: string;
}

// ─── Transfer types ────────────────────────────────────────────────────────────

export type GrvtTransferType = "FUNDING_TO_TRADING" | "TRADING_TO_FUNDING";

export interface GrvtTransferRequest {
  from_account_id: string;
  to_account_id: string;
  currency: GrvtCurrency;
  num_tokens: string;
  signature: GrvtSignature;
}

// ─── WebSocket types ───────────────────────────────────────────────────────────

export interface GrvtWsRequest {
  jsonrpc: "2.0";
  method: string;
  params: Record<string, any>;
  id: number;
}

export interface GrvtWsResponse {
  jsonrpc: "2.0";
  method?: string;
  params?: any;
  result?: any;
  error?: { code: number; message: string };
  id?: number;
}

export interface GrvtOrderbookLevel {
  price: string;
  size: string;
  num_orders: number;
}

export interface GrvtOrderbookL2 {
  event_time: string;
  instrument: string;
  bids: GrvtOrderbookLevel[];
  asks: GrvtOrderbookLevel[];
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface GrvtPageResult<T> {
  result?: T;
  results?: T[];
  next?: string;
  cursor?: string;
}

// ─── API response wrapper ──────────────────────────────────────────────────────

export interface GrvtApiResponse<T = any> {
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

// ─── EIP-712 domain for GRVT ──────────────────────────────────────────────────

export const GRVT_EIP712_DOMAINS: Record<GrvtNetwork, {
  name: string;
  version: string;
  chainId: number;
}> = {
  mainnet: {
    name: "GRVT Exchange",
    version: "0",
    chainId: 325,
  },
  testnet: {
    name: "GRVT Exchange",
    version: "0",
    chainId: 326,
  },
};
