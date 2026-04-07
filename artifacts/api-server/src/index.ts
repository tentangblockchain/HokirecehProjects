import { setGlobalDispatcher, ProxyAgent } from "undici";
import app from "./app";
import { logger } from "./lib/logger";
import { getAllRunningExtendedBots, startExtendedBot, stopExtendedBot } from "./lib/extended/extendedBotEngine";
import { getAllRunningEtherealBots, startEtherealBot, stopEtherealBot } from "./lib/ethereal/etherealBotEngine";
import { getAllRunningBots, startBot, stopBot } from "./lib/lighter/lighterBotEngine";
import { destroyExtendedWs } from "./lib/extended/extendedWs";
import { destroyGrvtWs } from "./lib/grvt/grvtWs";
import { db, strategiesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const proxyUrl = process.env["HTTPS_PROXY"] || process.env["HTTP_PROXY"] || process.env["https_proxy"] || process.env["http_proxy"];
if (proxyUrl) {
  setGlobalDispatcher(new ProxyAgent(proxyUrl));
  logger.info({ proxy: proxyUrl.replace(/:[^:@/]*@/, ":***@") }, "HTTP proxy configured for outbound requests");
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // ── Startup Recovery ──────────────────────────────────────────────────────
  // Recovery dipusatkan di app.ts (setTimeout 3 detik) via restoreRunningBots /
  // restoreRunningExtendedBots / restoreRunningEtherealBots.
  // Loop recovery kedua di sini (delay 5 detik) dihapus untuk menghindari
  // double recovery: kedua path memanggil startBot bersamaan dalam window 2 detik
  // → potensi race condition pada in-memory guard runningBots.has() sebelum set.
  // startBot memang idempotent (line 1002), tapi race window tetap ada saat
  // banyak bot restore bersamaan dan startBot belum selesai set runningBots.
  // ─────────────────────────────────────────────────────────────────────────
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

let isShuttingDown = false;

async function gracefulShutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, "[Shutdown] Signal received, shutting down gracefully...");

  // 1. Stop accepting new HTTP connections
  server.close((err) => {
    if (err) logger.warn({ err }, "[Shutdown] HTTP server close error");
  });

  try {
    // 2. Stop all Lighter bots
    const lighterBots = getAllRunningBots();
    if (lighterBots.length > 0) {
      logger.info({ count: lighterBots.length }, "[Shutdown] Stopping Lighter bots");
      await Promise.allSettled(lighterBots.map((b) => stopBot(b.strategyId, true)));
    }

    // 3. Stop all Extended bots
    const extendedBots = getAllRunningExtendedBots();
    if (extendedBots.length > 0) {
      logger.info({ count: extendedBots.length }, "[Shutdown] Stopping Extended bots");
      await Promise.allSettled(extendedBots.map((b) => stopExtendedBot(b.strategyId, true)));
    }

    // 4. Stop all Ethereal bots
    const etherealBots = getAllRunningEtherealBots();
    if (etherealBots.length > 0) {
      logger.info({ count: etherealBots.length }, "[Shutdown] Stopping Ethereal bots");
      await Promise.allSettled(etherealBots.map((b) => stopEtherealBot(b.strategyId, true)));
    }

    // 5. Close Extended WebSocket connections
    destroyExtendedWs();
    logger.info("[Shutdown] Extended WS connections closed");

    // 6. Close GRVT WebSocket connections
    destroyGrvtWs();
    logger.info("[Shutdown] GRVT WS connections closed");

    // 6. Close DB connection
    if (typeof (db as any).$client?.end === "function") {
      await (db as any).$client.end();
      logger.info("[Shutdown] DB connection closed");
    }
  } catch (err) {
    logger.error({ err }, "[Shutdown] Error during graceful shutdown");
  }

  logger.info("[Shutdown] Shutdown complete");
  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT",  () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  logger.error({ err }, "[Process] uncaughtException — process akan exit");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "[Process] unhandledRejection — process akan exit");
  process.exit(1);
});
