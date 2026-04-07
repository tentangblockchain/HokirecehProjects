import { ethers } from "ethers";
import Decimal from "decimal.js";
import { logger } from "../logger";
import { GRVT_REST_URLS, GRVT_EIP712_DOMAINS } from "./grvtTypes";
import { buildGrvtAuthHeaders } from "./grvtAuth";
import type {
  GrvtNetwork,
  GrvtAuthSession,
  GrvtOrder,
  GrvtOrderLeg,
  GrvtSignature,
  GrvtCreateOrderRequest,
  GrvtCreateOrderResponse,
  GrvtCancelOrderRequest,
  GrvtAmendOrderRequest,
  GrvtApiResponse,
} from "./grvtTypes";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

const FETCH_TIMEOUT_MS = 15_000;

// ─── Internal fetch ───────────────────────────────────────────────────────────

async function grvtTradeFetch<T>(
  path: string,
  session: GrvtAuthSession,
  network: GrvtNetwork,
  body: unknown
): Promise<T> {
  const url = `${GRVT_REST_URLS[network]}${path}`;
  const headers = buildGrvtAuthHeaders(session);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers,
      body: JSON.stringify(body),
    });
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError") throw new Error(`GRVT Trade API timeout: ${path}`);
    throw err;
  }
  clearTimeout(timer);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GRVT Trade API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── EIP-712 Types for Order Signing ──────────────────────────────────────────
// GRVT menggunakan EIP-712 typed data untuk sign order.
// Tipe ini berdasarkan dokumentasi https://api-docs.grvt.io/

const ORDER_TYPES = {
  Order: [
    { name: "subAccountID",  type: "uint64"   },
    { name: "clientOrderID", type: "uint32"   },
    { name: "timeInForce",   type: "uint8"    },
    { name: "postOnly",      type: "bool"     },
    { name: "reduceOnly",    type: "bool"     },
    { name: "legs",          type: "OrderLeg[]" },
  ],
  OrderLeg: [
    { name: "contractID", type: "uint32"  },
    { name: "size",       type: "uint64"  },
    { name: "limitPrice", type: "uint64"  },
    { name: "isBuyingContract", type: "bool" },
  ],
};

// ─── Time-in-force enum values ─────────────────────────────────────────────────

const TIME_IN_FORCE_MAP: Record<string, number> = {
  GOOD_TILL_TIME: 1,
  ALL_OR_NONE: 2,
  IMMEDIATE_OR_CANCEL: 3,
  FILL_OR_KILL: 4,
};

// ─── Nonce helper ──────────────────────────────────────────────────────────────

function generateOrderNonce(): number {
  return Math.floor(Math.random() * 2147483647);
}

// ─── Expiry helper ─────────────────────────────────────────────────────────────
// Expiration default: 30 hari dari sekarang (dalam microseconds)

function generateExpiry(daysFromNow = 30): string {
  return String(Date.now() * 1000 + daysFromNow * 24 * 60 * 60 * 1_000_000);
}

// ─── Sign Order (EIP-712) ──────────────────────────────────────────────────────
// GRVT sign order menggunakan EIP-712 typed data.
// subAccountID, clientOrderID, dsb adalah uint types yang harus di-convert ke bigint.

export async function signGrvtOrder(
  privateKey: string,
  params: {
    subAccountId: string;
    clientOrderId?: number;
    timeInForce: string;
    postOnly: boolean;
    reduceOnly: boolean;
    legs: {
      contractId: number;
      size: string;
      limitPrice: string;
      isBuyingContract: boolean;
    }[];
  },
  network: GrvtNetwork = "mainnet"
): Promise<GrvtSignature> {
  const pk = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  const wallet = new ethers.Wallet(pk);
  const domain = GRVT_EIP712_DOMAINS[network];

  const nonce = generateOrderNonce();
  const expiration = generateExpiry();
  const clientOrderId = params.clientOrderId ?? (nonce % 65536);

  const tifValue = TIME_IN_FORCE_MAP[params.timeInForce] ?? 1;

  // Convert size dan price dari decimal string ke uint64 (multiply by 1e4 untuk GRVT precision)
  const PRICE_MULTIPLIER = 10_000n;
  const SIZE_MULTIPLIER = 10_000n;

  const legs = params.legs.map((leg) => ({
    contractID: leg.contractId,
    size: BigInt(new Decimal(leg.size).mul("10000").toFixed(0, Decimal.ROUND_DOWN)),
    limitPrice: BigInt(new Decimal(leg.limitPrice).mul("10000").toFixed(0, Decimal.ROUND_DOWN)),
    isBuyingContract: leg.isBuyingContract,
  }));

  const value = {
    subAccountID: BigInt(params.subAccountId),
    clientOrderID: clientOrderId,
    timeInForce: tifValue,
    postOnly: params.postOnly,
    reduceOnly: params.reduceOnly,
    legs,
  };

  logger.debug(
    { network, subAccountId: params.subAccountId, legs: params.legs },
    "[GRVT Trade] Signing order"
  );

  const rawSig = await wallet.signTypedData(domain as any, ORDER_TYPES, value);
  const sigParsed = ethers.Signature.from(rawSig);

  const signature: GrvtSignature = {
    signer: wallet.address,
    r: sigParsed.r,
    s: sigParsed.s,
    v: sigParsed.v,
    expiration,
    nonce,
  };

  logger.debug({ signer: wallet.address }, "[GRVT Trade] Order signed");
  return signature;
}

// ─── Create Order ──────────────────────────────────────────────────────────────
// Endpoint: POST /full/v1/create_order
// GRVT orders harus di-sign sebelum dikirim.
// Satu order bisa memiliki beberapa legs (untuk spread/combo), tapi biasanya satu leg.

export async function createGrvtOrder(
  session: GrvtAuthSession,
  privateKey: string,
  params: {
    subAccountId: string;
    instrument: string;
    size: string;
    limitPrice: string;
    isBuying: boolean;
    timeInForce?: string;
    postOnly?: boolean;
    reduceOnly?: boolean;
    clientOrderId?: number;
  },
  contractId: number,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtCreateOrderResponse> {
  const timeInForce = params.timeInForce ?? "GOOD_TILL_TIME";
  const postOnly = params.postOnly ?? false;
  const reduceOnly = params.reduceOnly ?? false;

  const signature = await signGrvtOrder(
    privateKey,
    {
      subAccountId: params.subAccountId,
      clientOrderId: params.clientOrderId,
      timeInForce,
      postOnly,
      reduceOnly,
      legs: [
        {
          contractId,
          size: params.size,
          limitPrice: params.limitPrice,
          isBuyingContract: params.isBuying,
        },
      ],
    },
    network
  );

  const leg: GrvtOrderLeg = {
    instrument: params.instrument,
    size: params.size,
    limit_price: params.limitPrice,
    is_buying_asset: params.isBuying,
  };

  const order: GrvtOrder = {
    order_id: "",
    sub_account_id: params.subAccountId,
    is_market: false,
    time_in_force: timeInForce as any,
    limit_price: params.limitPrice,
    post_only: postOnly,
    reduce_only: reduceOnly,
    legs: [leg],
    signature,
    metadata: {
      client_order_id: params.clientOrderId ? String(params.clientOrderId) : undefined,
    },
  };

  const body: GrvtCreateOrderRequest = { order };

  logger.info(
    { instrument: params.instrument, size: params.size, price: params.limitPrice, isBuying: params.isBuying, network },
    "[GRVT Trade] Creating order"
  );

  const res = await grvtTradeFetch<GrvtApiResponse<GrvtCreateOrderResponse>>(
    "/full/v1/create_order",
    session,
    network,
    body
  );

  const result = (res as any).result ?? res;
  logger.info({ orderId: (result as any)?.order?.order_id }, "[GRVT Trade] Order created");
  return result as GrvtCreateOrderResponse;
}

// ─── Cancel Order ──────────────────────────────────────────────────────────────
// Endpoint: POST /full/v1/cancel_order
// Body: { sub_account_id, order_id? }

export async function cancelGrvtOrder(
  session: GrvtAuthSession,
  params: GrvtCancelOrderRequest,
  network: GrvtNetwork = "mainnet"
): Promise<void> {
  logger.info({ orderId: params.order_id, network }, "[GRVT Trade] Cancelling order");
  await grvtTradeFetch<any>("/full/v1/cancel_order", session, network, params);
  logger.info({ orderId: params.order_id }, "[GRVT Trade] Order cancelled");
}

// ─── Cancel All Orders ─────────────────────────────────────────────────────────
// Endpoint: POST /full/v1/cancel_all_orders
// Body: { sub_account_id, kind?, base?, quote? }

export async function cancelAllGrvtOrders(
  session: GrvtAuthSession,
  subAccountId: string,
  network: GrvtNetwork = "mainnet"
): Promise<void> {
  logger.info({ subAccountId, network }, "[GRVT Trade] Cancelling all orders");
  await grvtTradeFetch<any>("/full/v1/cancel_all_orders", session, network, {
    sub_account_id: subAccountId,
  });
  logger.info({ subAccountId }, "[GRVT Trade] All orders cancelled");
}

// ─── Amend Order ──────────────────────────────────────────────────────────────
// Endpoint: POST /full/v1/amend_order
// Amend = update size/price dari existing order (re-sign diperlukan).

export async function amendGrvtOrder(
  session: GrvtAuthSession,
  privateKey: string,
  params: {
    subAccountId: string;
    orderId: string;
    instrument: string;
    newSize: string;
    newLimitPrice: string;
    isBuying: boolean;
    contractId: number;
    timeInForce?: string;
  },
  network: GrvtNetwork = "mainnet"
): Promise<void> {
  const signature = await signGrvtOrder(
    privateKey,
    {
      subAccountId: params.subAccountId,
      timeInForce: params.timeInForce ?? "GOOD_TILL_TIME",
      postOnly: false,
      reduceOnly: false,
      legs: [
        {
          contractId: params.contractId,
          size: params.newSize,
          limitPrice: params.newLimitPrice,
          isBuyingContract: params.isBuying,
        },
      ],
    },
    network
  );

  const order: GrvtOrder = {
    order_id: params.orderId,
    sub_account_id: params.subAccountId,
    is_market: false,
    time_in_force: (params.timeInForce ?? "GOOD_TILL_TIME") as any,
    limit_price: params.newLimitPrice,
    post_only: false,
    reduce_only: false,
    legs: [
      {
        instrument: params.instrument,
        size: params.newSize,
        limit_price: params.newLimitPrice,
        is_buying_asset: params.isBuying,
      },
    ],
    signature,
  };

  logger.info({ orderId: params.orderId, network }, "[GRVT Trade] Amending order");
  await grvtTradeFetch<any>("/full/v1/amend_order", session, network, { order });
  logger.info({ orderId: params.orderId }, "[GRVT Trade] Order amended");
}

// ─── Get single order ──────────────────────────────────────────────────────────
// Endpoint: POST /full/v1/order
// Body: { order_id, sub_account_id }

export async function getGrvtOrder(
  session: GrvtAuthSession,
  orderId: string,
  subAccountId: string,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtOrder | null> {
  try {
    const res = await grvtTradeFetch<GrvtApiResponse<GrvtOrder>>(
      "/full/v1/order",
      session,
      network,
      { order_id: orderId, sub_account_id: subAccountId }
    );
    const result = (res as any).result ?? res;
    if (result && typeof result === "object" && result.order_id) {
      return result as GrvtOrder;
    }
    return null;
  } catch (err: any) {
    if (err.message?.includes("404")) return null;
    throw err;
  }
}
