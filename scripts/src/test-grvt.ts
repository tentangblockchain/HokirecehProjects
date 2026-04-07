/**
 * Test Script: GRVT DEX Integration
 *
 * Menguji:
 * 1. Koneksi ke GRVT API (public endpoint: instruments)
 * 2. Autentikasi via API Key atau Wallet (EIP-712)
 * 3. Ambil data market (instruments, mini ticker)
 * 4. Ambil balances dan positions dari sub-account
 * 5. Place LIMIT BUY order 1% di bawah mark price (tidak langsung tereksekusi)
 * 6. Verifikasi order muncul di open orders
 * 7. Cancel order
 *
 * Sumber credentials (urutan prioritas):
 *   1. Database — jika GRVT_USER_ID diset, credentials dibaca dari tabel bot_config
 *   2. Environment variable — fallback dengan peringatan
 *
 * Env vars:
 *   GRVT_USER_ID=...           (user ID di database; digunakan untuk baca credentials dari DB)
 *   GRVT_NETWORK=testnet       (default: testnet)
 *   GRVT_INSTRUMENT=BTC_USDT_Perp  (default: BTC_USDT_Perp)
 *
 * Env fallback (hanya jika credentials tidak ada di DB):
 *   GRVT_API_KEY=...           fallback API key
 *   GRVT_PRIVATE_KEY=0x...     fallback private key
 *   GRVT_SUB_ACCOUNT_ID=...    fallback sub-account ID
 *
 * Jalankan:
 *   GRVT_USER_ID=1 pnpm --filter @workspace/scripts tsx ./src/test-grvt.ts
 */

import { loginWithApiKey, loginWithWallet, getGrvtWalletAddress } from "../../artifacts/api-server/src/lib/grvt/grvtAuth.js";
import { getInstruments, getMiniTicker, getMidPrice } from "../../artifacts/api-server/src/lib/grvt/grvtMarket.js";
import {
  getGrvtBalances,
  getGrvtPositions,
  getGrvtOpenOrders,
  testGrvtConnection,
} from "../../artifacts/api-server/src/lib/grvt/grvtAccount.js";
import { createGrvtOrder, cancelGrvtOrder } from "../../artifacts/api-server/src/lib/grvt/grvtTrade.js";
import { getGrvtCredentials } from "../../artifacts/api-server/src/routes/configService.js";
import type { GrvtNetwork } from "../../artifacts/api-server/src/lib/grvt/grvtTypes.js";
import Decimal from "decimal.js";

// ─── Config dari env ──────────────────────────────────────────────────────────

const USER_ID_STR = process.env.GRVT_USER_ID;
const NETWORK = (process.env.GRVT_NETWORK ?? "testnet") as GrvtNetwork;
const INSTRUMENT = process.env.GRVT_INSTRUMENT ?? "BTC_USDT_Perp";

// Env fallback (hanya digunakan jika tidak ada di DB)
const ENV_API_KEY = process.env.GRVT_API_KEY;
const ENV_PRIVATE_KEY = process.env.GRVT_PRIVATE_KEY;
const ENV_SUB_ACCOUNT_ID = process.env.GRVT_SUB_ACCOUNT_ID;

// ─── Logging helpers ──────────────────────────────────────────────────────────

function log(msg: string, data?: unknown) {
  const ts = new Date().toISOString();
  if (data !== undefined) {
    console.log(`[${ts}] ${msg}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[${ts}] ${msg}`);
  }
}

function logOk(msg: string, data?: unknown) {
  process.stdout.write("\x1b[32m✓\x1b[0m ");
  log(msg, data);
}

function logFail(msg: string, data?: unknown) {
  process.stdout.write("\x1b[31m✗\x1b[0m ");
  log(msg, data);
}

function logInfo(msg: string, data?: unknown) {
  process.stdout.write("\x1b[36mℹ\x1b[0m ");
  log(msg, data);
}

function logWarn(msg: string, data?: unknown) {
  process.stdout.write("\x1b[33m⚠\x1b[0m ");
  log(msg, data);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n════════════════════════════════════════════════════════════");
  console.log("  Test: Integrasi GRVT DEX");
  console.log("════════════════════════════════════════════════════════════\n");

  logInfo(`Network  : ${NETWORK}`);
  logInfo(`Instrument : ${INSTRUMENT}`);

  // ── 1. Baca credentials (prioritas: DB → env fallback) ────────────────────

  let apiKey: string | null = null;
  let privateKey: string | null = null;
  let subAccountId: string | null = null;
  let credSource = "env";

  if (USER_ID_STR) {
    const userId = parseInt(USER_ID_STR, 10);
    if (isNaN(userId)) {
      logFail(`GRVT_USER_ID tidak valid: "${USER_ID_STR}" (harus angka)`);
      process.exit(1);
    }

    logInfo(`Membaca credentials dari database untuk userId=${userId}...`);
    try {
      const dbCreds = await getGrvtCredentials(userId);
      if (dbCreds.hasCredentials) {
        apiKey = dbCreds.apiKey ?? null;
        privateKey = dbCreds.privateKey ?? null;
        subAccountId = dbCreds.subAccountId ?? null;
        credSource = "database";
        logOk("Credentials berhasil dibaca dari database", {
          hasApiKey: !!apiKey,
          hasPrivateKey: !!privateKey,
          hasSubAccountId: !!subAccountId,
          network: dbCreds.grvtNetwork ?? NETWORK,
        });
      } else {
        logWarn("Credentials belum tersimpan di database untuk user ini.");
      }
    } catch (err: any) {
      logWarn(`Gagal membaca credentials dari database: ${err.message}`);
    }
  } else {
    logInfo("GRVT_USER_ID tidak diset — lewati pembacaan dari database.");
  }

  // Fallback ke env jika DB kosong
  if (!apiKey && !privateKey) {
    if (ENV_API_KEY || ENV_PRIVATE_KEY) {
      logWarn(
        "Menggunakan fallback env variable untuk credentials. " +
        "Sebaiknya simpan credentials melalui UI (halaman GRVT → konfigurasi) " +
        "agar tersimpan aman di database."
      );
      apiKey = ENV_API_KEY ?? null;
      privateKey = ENV_PRIVATE_KEY ?? null;
      subAccountId = subAccountId ?? ENV_SUB_ACCOUNT_ID ?? null;
      credSource = "env (fallback)";
    } else {
      logFail(
        "Tidak ada credentials tersedia! " +
        "Set GRVT_USER_ID (baca dari DB) atau GRVT_API_KEY / GRVT_PRIVATE_KEY (env fallback)."
      );
      console.log("  Contoh: GRVT_USER_ID=1 pnpm --filter @workspace/scripts tsx ./src/test-grvt.ts");
      process.exit(1);
    }
  }

  logInfo(`Sumber credentials: ${credSource}`);
  if (apiKey) logOk("Menggunakan autentikasi API Key");
  if (privateKey) logOk("Menggunakan autentikasi Wallet (EIP-712)");

  // ── 2. Test koneksi publik ──────────────────────────────────────────────────

  logInfo("Test koneksi publik ke GRVT REST API...");
  const connResult = await testGrvtConnection(null, NETWORK);
  if (!connResult.ok) {
    logFail("Koneksi publik gagal!", { reason: connResult.reason });
    process.exit(1);
  }
  logOk("Koneksi publik berhasil");

  // ── 3. Fetch instruments ───────────────────────────────────────────────────

  logInfo("Fetching instruments (market list)...");
  const instruments = await getInstruments(NETWORK);
  logOk(`Berhasil fetch ${instruments.length} instrument`, {
    sample: instruments.slice(0, 3).map((i) => i.instrument),
  });

  const targetInstrument = instruments.find((i) => i.instrument === INSTRUMENT);
  if (!targetInstrument) {
    logWarn(`Instrument ${INSTRUMENT} tidak ditemukan. Tersedia:`, instruments.map((i) => i.instrument));
  } else {
    logOk(`Instrument ${INSTRUMENT} ditemukan`, {
      kind: targetInstrument.kind,
      base: targetInstrument.base,
      quote: targetInstrument.quote,
      tick_size: targetInstrument.tick_size,
      min_size: targetInstrument.min_size,
    });
  }

  // ── 4. Fetch mini ticker ───────────────────────────────────────────────────

  logInfo(`Fetching mini ticker untuk ${INSTRUMENT}...`);
  const ticker = await getMiniTicker(INSTRUMENT, NETWORK);
  let markPrice: Decimal | null = null;

  if (ticker) {
    logOk(`Mini ticker ${INSTRUMENT}:`, {
      mark_price: ticker.mark_price,
      best_bid: ticker.best_bid_price,
      best_ask: ticker.best_ask_price,
      funding_rate: ticker.funding_rate_curr,
    });
    markPrice = new Decimal(ticker.mark_price);
  } else {
    logWarn(`Ticker tidak ditemukan untuk ${INSTRUMENT}. Coba ambil mid price...`);
    markPrice = await getMidPrice(INSTRUMENT, NETWORK);
  }

  if (!markPrice || markPrice.lte(0)) {
    logWarn("Tidak berhasil fetch harga market");
  } else {
    logOk(`Mark price: $${markPrice.toFixed(2)}`);
  }

  // ── 5. Autentikasi ─────────────────────────────────────────────────────────

  logInfo("Autentikasi ke GRVT...");
  let session: any;

  try {
    if (apiKey) {
      session = await loginWithApiKey(apiKey, NETWORK);
      logOk("Login API Key berhasil", { hasToken: !!session.token, hasCookie: !!session.cookie });
    } else if (privateKey) {
      const walletAddress = getGrvtWalletAddress(privateKey);
      logInfo(`Wallet address: ${walletAddress}`);
      session = await loginWithWallet(privateKey, NETWORK);
      logOk("Login Wallet berhasil", { hasToken: !!session.token, hasCookie: !!session.cookie });
    } else {
      throw new Error("Tidak ada credentials valid");
    }
  } catch (err: any) {
    logFail("Autentikasi gagal!", { error: err.message });
    process.exit(1);
  }

  // ── 6. Account data ────────────────────────────────────────────────────────

  if (subAccountId) {
    logInfo(`Fetching balances untuk sub-account ${subAccountId}...`);
    try {
      const balances = await getGrvtBalances(subAccountId, session, NETWORK);
      if (balances.length > 0) {
        logOk("Balances:", balances.map((b) => ({
          currency: b.currency,
          balance: b.balance,
        })));
      } else {
        logInfo("Tidak ada balance atau sub-account kosong");
      }
    } catch (err: any) {
      logWarn("Gagal fetch balances:", { error: err.message });
    }

    logInfo(`Fetching positions untuk sub-account ${subAccountId}...`);
    try {
      const positions = await getGrvtPositions(subAccountId, session, NETWORK);
      logOk(`${positions.length} posisi aktif`, positions.map((p) => ({
        instrument: p.instrument,
        size: p.size,
        unrealized_pnl: p.unrealized_pnl,
      })));
    } catch (err: any) {
      logWarn("Gagal fetch positions:", { error: err.message });
    }
  } else {
    logInfo("Sub-account ID tidak tersedia — skip test balances, positions, dan order.");
    logInfo("Set GRVT_SUB_ACCOUNT_ID (env) atau simpan melalui UI untuk test lengkap.");
  }

  // ── 7. Place order ─────────────────────────────────────────────────────────

  if (!subAccountId || !privateKey || !markPrice || markPrice.lte(0)) {
    logInfo("Skip place order — butuh sub-account ID + private key (EIP-712) + mark price.");
  } else {
    const minSize = targetInstrument?.min_size ?? "0.001";
    const tickSize = targetInstrument?.tick_size ?? "0.1";
    const orderSize = minSize;
    const orderPrice = markPrice.mul("0.99");

    const tick = new Decimal(tickSize);
    const priceDecimals = (tickSize.split(".")[1] ?? "").length;
    const roundedPrice = orderPrice.div(tick).toDecimalPlaces(0, Decimal.ROUND_HALF_DOWN).mul(tick).toFixed(priceDecimals);

    logInfo("Order yang akan dikirim:", {
      instrument: INSTRUMENT,
      side: "BUY",
      type: "LIMIT",
      size: orderSize,
      price: roundedPrice,
      markPrice: markPrice.toFixed(2),
      note: "1% di bawah mark price — tidak akan langsung tereksekusi",
    });

    let orderId: string | null = null;

    try {
      const contractId = 1;

      const result = await createGrvtOrder(
        session,
        privateKey,
        {
          subAccountId,
          instrument: INSTRUMENT,
          size: orderSize,
          limitPrice: roundedPrice,
          isBuying: true,
          timeInForce: "GOOD_TILL_TIME",
          postOnly: false,
          reduceOnly: false,
        },
        contractId,
        NETWORK
      );

      orderId = result?.order?.order_id ?? null;
      logOk("ORDER BERHASIL DITEMPATKAN!", {
        orderId,
        instrument: INSTRUMENT,
        size: orderSize,
        price: roundedPrice,
      });
    } catch (err: any) {
      logFail("Gagal place order:", { error: err.message });
    }

    // ── 8. Verifikasi order ────────────────────────────────────────────────

    if (orderId) {
      logInfo("Verifikasi open orders...");
      await new Promise((r) => setTimeout(r, 1000));

      try {
        const openOrders = await getGrvtOpenOrders(subAccountId, session, {}, NETWORK);
        const ourOrder = openOrders.find((o: any) => o.order_id === orderId);
        if (ourOrder) {
          logOk("Order terkonfirmasi di open orders:", {
            order_id: ourOrder.order_id,
            status: ourOrder.state?.status,
          });
        } else {
          logInfo(`Order ${orderId} belum muncul di open orders (mungkin masih diproses atau sudah tereksekusi)`);
        }
      } catch (err: any) {
        logWarn("Gagal fetch open orders:", { error: err.message });
      }

      // ── 9. Cancel order ────────────────────────────────────────────────

      logInfo(`Membatalkan order ${orderId}...`);
      try {
        await cancelGrvtOrder(session, { sub_account_id: subAccountId, order_id: orderId }, NETWORK);
        logOk(`Order ${orderId} berhasil dibatalkan`);
      } catch (err: any) {
        logInfo(`Cancel gagal (mungkin sudah tereksekusi/expired): ${err.message}`);
      }
    }
  }

  // ── 10. Ringkasan ──────────────────────────────────────────────────────────

  console.log("\n════════════════════════════════════════════════════════════");
  console.log("  TEST SELESAI");
  console.log("════════════════════════════════════════════════════════════");
  console.log(`  Network        : ${NETWORK}`);
  console.log(`  Instrument     : ${INSTRUMENT}`);
  console.log(`  Sumber creds   : ${credSource}`);
  console.log(`  Auth Method    : ${apiKey ? "API Key" : "EVM Wallet (EIP-712)"}`);
  console.log(`  Mark Price     : $${markPrice?.toFixed(2) ?? "N/A"}`);
  console.log(`  Instruments    : ${instruments.length} total`);
  console.log("════════════════════════════════════════════════════════════\n");
}

main().catch((err) => {
  logFail("Uncaught error:", { message: err.message, stack: err.stack });
  process.exit(1);
});
