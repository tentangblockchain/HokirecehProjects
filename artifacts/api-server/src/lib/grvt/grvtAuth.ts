import { ethers } from "ethers";
import { logger } from "../logger";
import type { GrvtNetwork, GrvtAuthSession } from "./grvtTypes";
import { GRVT_REST_URLS, GRVT_EIP712_DOMAINS } from "./grvtTypes";

// ─── Timeout & retry ──────────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 15_000;

async function grvtAuthFetch<T>(
  url: string,
  body: unknown
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "HokirecehProjects/1.0 GRVTIntegration",
      },
      body: JSON.stringify(body),
    });
    clearTimeout(timer);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`GRVT Auth error ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error(`GRVT Auth timeout after ${FETCH_TIMEOUT_MS}ms`);
    }
    throw err;
  }
}

// ─── API Key Login ─────────────────────────────────────────────────────────────
// Endpoint: POST /auth/api_key/login
// Body: { api_key: "..." }
// Response: { cookie, token, expires }

export async function loginWithApiKey(
  apiKey: string,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtAuthSession> {
  const url = `${GRVT_REST_URLS[network]}/auth/api_key/login`;
  logger.info({ network }, "[GRVT Auth] Logging in with API key");

  const res = await grvtAuthFetch<{ cookie?: string; token?: string; result?: { cookie?: string; token?: string } }>(
    url,
    { api_key: apiKey }
  );

  const cookie = res.cookie ?? res.result?.cookie;
  const token = res.token ?? res.result?.token;

  if (!cookie && !token) {
    throw new Error("GRVT Auth: response tidak mengandung cookie atau token");
  }

  const session: GrvtAuthSession = {
    cookie: cookie ?? "",
    token,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000,
  };

  logger.info({ network }, "[GRVT Auth] API key login berhasil");
  return session;
}

// ─── Wallet Login (EIP-712) ────────────────────────────────────────────────────
// Endpoint: POST /auth/wallet/login
// Body: { wallet, signature, nonce }
// Nonce: bisa string angka atau UUID, server akan memberitahu format yang diperlukan.
// EIP-712 domain: GRVT Exchange dengan chainId sesuai network.

const WALLET_LOGIN_TYPES = {
  WalletLogin: [
    { name: "nonce", type: "string" },
  ],
};

export async function loginWithWallet(
  privateKey: string,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtAuthSession> {
  const pk = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  const wallet = new ethers.Wallet(pk);
  const walletAddress = wallet.address;

  const domain = GRVT_EIP712_DOMAINS[network];
  const nonce = generateAuthNonce();

  logger.info({ network, wallet: walletAddress }, "[GRVT Auth] Signing EIP-712 wallet login");

  const signature = await wallet.signTypedData(
    domain as any,
    WALLET_LOGIN_TYPES,
    { nonce }
  );

  const url = `${GRVT_REST_URLS[network]}/auth/wallet/login`;

  const res = await grvtAuthFetch<{ cookie?: string; token?: string; result?: { cookie?: string; token?: string } }>(
    url,
    { wallet: walletAddress, signature, nonce }
  );

  const cookie = res.cookie ?? res.result?.cookie;
  const token = res.token ?? res.result?.token;

  if (!cookie && !token) {
    throw new Error("GRVT Wallet Auth: response tidak mengandung cookie atau token");
  }

  const session: GrvtAuthSession = {
    cookie: cookie ?? "",
    token,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000,
  };

  logger.info({ network, wallet: walletAddress }, "[GRVT Auth] Wallet login berhasil");
  return session;
}

// ─── Nonce helper ──────────────────────────────────────────────────────────────

function generateAuthNonce(): string {
  return String(Date.now());
}

// ─── Wallet address helper ─────────────────────────────────────────────────────

export function getGrvtWalletAddress(privateKey: string): string {
  const pk = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  return new ethers.Wallet(pk).address;
}

// ─── Auth header builder ───────────────────────────────────────────────────────
// Membangun header autentikasi dari session yang tersimpan.
// GRVT menggunakan cookie atau Bearer token untuk authenticated requests.

export function buildGrvtAuthHeaders(session: GrvtAuthSession): Record<string, string> {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "HokirecehProjects/1.0 GRVTIntegration",
  };

  if (session.cookie) {
    headers["Cookie"] = session.cookie;
  }
  if (session.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }

  return headers;
}

// ─── Session cache ─────────────────────────────────────────────────────────────
// Cache session per userId untuk menghindari login berulang.
// Session di-refresh otomatis 1 jam sebelum expire.

const sessionCache = new Map<string, GrvtAuthSession>();

export function getCachedSession(userId: string, network: GrvtNetwork): GrvtAuthSession | null {
  const key = `${userId}:${network}`;
  const session = sessionCache.get(key);
  if (!session) return null;
  if (session.expiresAt && Date.now() > session.expiresAt - 60 * 60 * 1000) {
    sessionCache.delete(key);
    return null;
  }
  return session;
}

export function setCachedSession(userId: string, network: GrvtNetwork, session: GrvtAuthSession): void {
  const key = `${userId}:${network}`;
  sessionCache.set(key, session);
}

export function clearCachedSession(userId: string, network: GrvtNetwork): void {
  const key = `${userId}:${network}`;
  sessionCache.delete(key);
}
