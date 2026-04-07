import { logger } from "../logger";
import { GRVT_REST_URLS } from "./grvtTypes";
import { buildGrvtAuthHeaders } from "./grvtAuth";
import type {
  GrvtNetwork,
  GrvtAuthSession,
  GrvtSubAccount,
  GrvtBalance,
  GrvtPosition,
  GrvtFundingPayment,
  GrvtApiResponse,
} from "./grvtTypes";

const FETCH_TIMEOUT_MS = 15_000;

async function grvtAuthFetch<T>(
  path: string,
  session: GrvtAuthSession,
  network: GrvtNetwork,
  body?: unknown
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
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error(`GRVT Account API timeout: ${path}`);
    }
    throw err;
  }
  clearTimeout(timer);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GRVT Account API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── Get sub-account summary ──────────────────────────────────────────────────
// Endpoint: POST /full/v1/account_summary
// Body: { sub_account_id }

export async function getSubAccountSummary(
  subAccountId: string,
  session: GrvtAuthSession,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtSubAccount | null> {
  try {
    const res = await grvtAuthFetch<GrvtApiResponse<GrvtSubAccount>>(
      "/full/v1/account_summary",
      session,
      network,
      { sub_account_id: subAccountId }
    );
    const result = (res as any).result ?? res;
    if (result && typeof result === "object" && result.sub_account_id) {
      return result as GrvtSubAccount;
    }
    return null;
  } catch (err) {
    logger.error({ err, subAccountId }, "[GRVT Account] Failed to fetch sub-account summary");
    return null;
  }
}

// ─── Get balances ──────────────────────────────────────────────────────────────
// Endpoint: POST /full/v1/balance
// Body: { sub_account_id }

export async function getGrvtBalances(
  subAccountId: string,
  session: GrvtAuthSession,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtBalance[]> {
  try {
    const res = await grvtAuthFetch<GrvtApiResponse<GrvtBalance[]>>(
      "/full/v1/balance",
      session,
      network,
      { sub_account_id: subAccountId }
    );
    const result = (res as any).result ?? res;
    return Array.isArray(result) ? result : [];
  } catch (err) {
    logger.error({ err, subAccountId }, "[GRVT Account] Failed to fetch balances");
    return [];
  }
}

// ─── Get positions ─────────────────────────────────────────────────────────────
// Endpoint: POST /full/v1/positions
// Body: { sub_account_id }

export async function getGrvtPositions(
  subAccountId: string,
  session: GrvtAuthSession,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtPosition[]> {
  try {
    const res = await grvtAuthFetch<GrvtApiResponse<GrvtPosition[]>>(
      "/full/v1/positions",
      session,
      network,
      { sub_account_id: subAccountId }
    );
    const result = (res as any).result ?? res;
    return Array.isArray(result) ? result : [];
  } catch (err) {
    logger.error({ err, subAccountId }, "[GRVT Account] Failed to fetch positions");
    return [];
  }
}

// ─── Get funding payments ──────────────────────────────────────────────────────
// Endpoint: POST /full/v1/funding
// Body: { sub_account_id, limit, cursor }

export async function getGrvtFundingPayments(
  subAccountId: string,
  session: GrvtAuthSession,
  params: { limit?: number; instrument?: string } = {},
  network: GrvtNetwork = "mainnet"
): Promise<GrvtFundingPayment[]> {
  try {
    const body: Record<string, any> = {
      sub_account_id: subAccountId,
      limit: String(params.limit ?? 50),
    };
    if (params.instrument) body.instrument = params.instrument;

    const res = await grvtAuthFetch<GrvtApiResponse<GrvtFundingPayment[]>>(
      "/full/v1/funding",
      session,
      network,
      body
    );
    const result = (res as any).result ?? res;
    return Array.isArray(result) ? result : [];
  } catch (err) {
    logger.error({ err, subAccountId }, "[GRVT Account] Failed to fetch funding payments");
    return [];
  }
}

// ─── Get open orders ───────────────────────────────────────────────────────────
// Endpoint: POST /full/v1/open_orders
// Body: { sub_account_id, kind?, base?, quote? }

export async function getGrvtOpenOrders(
  subAccountId: string,
  session: GrvtAuthSession,
  params: { instrument?: string } = {},
  network: GrvtNetwork = "mainnet"
): Promise<any[]> {
  try {
    const body: Record<string, any> = { sub_account_id: subAccountId };
    if (params.instrument) body.instrument = params.instrument;

    const res = await grvtAuthFetch<GrvtApiResponse<any[]>>(
      "/full/v1/open_orders",
      session,
      network,
      body
    );
    const result = (res as any).result ?? res;
    return Array.isArray(result) ? result : [];
  } catch (err) {
    logger.error({ err, subAccountId }, "[GRVT Account] Failed to fetch open orders");
    return [];
  }
}

// ─── Transfer between funding and trading accounts ─────────────────────────────
// Endpoint: POST /full/v1/transfer
// Body: { from_account_id, to_account_id, currency, num_tokens, signature }
// Catatan: Transfer memerlukan EIP-712 signature — diimplementasikan via grvtTrade.ts

export async function transferGrvtFunds(
  session: GrvtAuthSession,
  payload: {
    from_account_id: string;
    to_account_id: string;
    currency: string;
    num_tokens: string;
    signature: object;
  },
  network: GrvtNetwork = "mainnet"
): Promise<{ ok: boolean; reason?: string }> {
  try {
    await grvtAuthFetch<any>("/full/v1/transfer", session, network, payload);
    return { ok: true };
  } catch (err: any) {
    logger.error({ err }, "[GRVT Account] Transfer failed");
    return { ok: false, reason: err.message };
  }
}

// ─── Test connection (public + authenticated) ──────────────────────────────────

export async function testGrvtConnection(
  session: GrvtAuthSession | null,
  network: GrvtNetwork = "mainnet"
): Promise<{ ok: boolean; reason?: string; balance?: string }> {
  try {
    const instrumentsRes = await fetch(`${GRVT_REST_URLS[network]}/v1/instruments`, {
      headers: { Accept: "application/json" },
    });
    if (!instrumentsRes.ok) {
      return { ok: false, reason: `Gagal koneksi ke GRVT REST API: HTTP ${instrumentsRes.status}` };
    }

    logger.info({ network }, "[GRVT] Connection test: REST OK");
    return { ok: true };
  } catch (err: any) {
    return { ok: false, reason: err.message };
  }
}
