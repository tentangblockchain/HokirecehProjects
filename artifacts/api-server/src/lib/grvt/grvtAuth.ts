import * as https from "https";
import * as http from "http";
import { URL } from "url";
import { ethers } from "ethers";
import { logger } from "../logger";
import type { GrvtNetwork, GrvtAuthSession } from "./grvtTypes";
import { GRVT_AUTH_URLS, GRVT_EIP712_DOMAINS } from "./grvtTypes";

// ─── Raw HTTP request helper (untuk baca Set-Cookie header) ───────────────────
// fetch() tidak expose response headers Set-Cookie secara proper di Node.js,
// sehingga kita menggunakan https.request() secara langsung.

interface RawHttpResponse {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}

function rawHttpPost(urlStr: string, payload: unknown): Promise<RawHttpResponse> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const bodyStr = JSON.stringify(payload);

    const options: https.RequestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Content-Length": Buffer.byteLength(bodyStr),
        "User-Agent": "HokirecehProjects/1.0 GRVTIntegration",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk: string | Buffer) => {
        data += typeof chunk === "string" ? chunk : chunk.toString("utf-8");
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode ?? 0,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", (err) => reject(err));
    req.setTimeout(15_000, () => {
      req.destroy(new Error("GRVT Auth request timeout"));
    });

    req.write(bodyStr);
    req.end();
  });
}

// ─── Ekstrak cookie gravity dari Set-Cookie header ────────────────────────────

function extractGravityCookie(setCookieHeaders: string | string[] | undefined): string {
  if (!setCookieHeaders) return "";
  const cookies = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  for (const c of cookies) {
    if (c.startsWith("gravity=")) {
      return c.split(";")[0].trim();
    }
  }
  return "";
}

// ─── API Key Login ─────────────────────────────────────────────────────────────
// Endpoint: POST /auth/api_key/login  (pada edge.grvt.io, BUKAN api.grvt.io)
// Cookie gravity=... dan X-Grvt-Account-Id ada di response HEADERS, bukan body.

export async function loginWithApiKey(
  apiKey: string,
  network: GrvtNetwork = "mainnet"
): Promise<GrvtAuthSession> {
  const url = `${GRVT_AUTH_URLS[network]}/auth/api_key/login`;
  logger.info({ network }, "[GRVT Auth] Logging in with API key");

  const raw = await rawHttpPost(url, { api_key: apiKey });

  if (raw.statusCode < 200 || raw.statusCode >= 300) {
    throw new Error(`GRVT Auth error ${raw.statusCode}: ${raw.body}`);
  }

  const cookie = extractGravityCookie(raw.headers["set-cookie"]);
  const accountId = ((raw.headers["x-grvt-account-id"] as string) ?? "").trim();

  if (!cookie) {
    throw new Error(
      `GRVT Auth: gravity cookie tidak ditemukan di Set-Cookie header. Body: ${raw.body}`
    );
  }

  const session: GrvtAuthSession = {
    cookie,
    accountId,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000,
  };

  logger.info({ network, accountId }, "[GRVT Auth] API key login berhasil");
  return session;
}

// ─── Wallet Login (EIP-712) ────────────────────────────────────────────────────
// Endpoint: POST /auth/wallet/login  (pada edge.grvt.io)
// EIP-712 struct WalletLogin: { signer: address, nonce: uint32, expiration: int64 }
// Nonce: random uint32, Expiration: now + 5 menit dalam nanoseconds.
// Request body: { address, signature: { signer, v, r, s, nonce, expiration, chain_id } }

const WALLET_LOGIN_TYPES = {
  WalletLogin: [
    { name: "signer",     type: "address" },
    { name: "nonce",      type: "uint32"  },
    { name: "expiration", type: "int64"   },
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

  // Nonce: random uint32
  const nonce = Math.floor(Math.random() * 0xFFFFFFFF);

  // Expiration: now + 5 menit dalam nanoseconds (BigInt)
  const expirationNs = (BigInt(Date.now() + 5 * 60 * 1000)) * 1_000_000n;

  logger.info({ network, wallet: walletAddress }, "[GRVT Auth] Signing EIP-712 wallet login");

  const rawSig = await wallet.signTypedData(
    domain as any,
    WALLET_LOGIN_TYPES,
    {
      signer: walletAddress,
      nonce,
      expiration: expirationNs,
    }
  );

  const sigParsed = ethers.Signature.from(rawSig);

  const url = `${GRVT_AUTH_URLS[network]}/auth/wallet/login`;

  const requestBody = {
    address: walletAddress,
    signature: {
      signer: walletAddress,
      v: sigParsed.v,
      r: sigParsed.r,
      s: sigParsed.s,
      nonce,
      expiration: String(expirationNs),
      chain_id: String(domain.chainId),
    },
  };

  const raw = await rawHttpPost(url, requestBody);

  if (raw.statusCode < 200 || raw.statusCode >= 300) {
    throw new Error(`GRVT Wallet Auth error ${raw.statusCode}: ${raw.body}`);
  }

  const cookie = extractGravityCookie(raw.headers["set-cookie"]);
  const accountId = ((raw.headers["x-grvt-account-id"] as string) ?? "").trim();

  if (!cookie) {
    throw new Error(
      `GRVT Wallet Auth: gravity cookie tidak ditemukan di Set-Cookie header. Body: ${raw.body}`
    );
  }

  const session: GrvtAuthSession = {
    cookie,
    accountId,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000,
  };

  logger.info({ network, wallet: walletAddress, accountId }, "[GRVT Auth] Wallet login berhasil");
  return session;
}

// ─── Wallet address helper ─────────────────────────────────────────────────────

export function getGrvtWalletAddress(privateKey: string): string {
  const pk = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  return new ethers.Wallet(pk).address;
}

// ─── Auth header builder ───────────────────────────────────────────────────────
// Membangun header autentikasi dari session yang tersimpan.
// GRVT menggunakan cookie gravity=... dan header X-Grvt-Account-Id.

export function buildGrvtAuthHeaders(session: GrvtAuthSession): Record<string, string> {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "HokirecehProjects/1.0 GRVTIntegration",
  };

  if (session.cookie) {
    headers["Cookie"] = session.cookie;
  }
  if (session.accountId) {
    headers["X-Grvt-Account-Id"] = session.accountId;
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
