#!/usr/bin/env node
/**
 * HK-Projects Audit Script v2
 * Usage: node audit.js [--engine lighter|extended|ethereal|all]
 *
 * Output: audit-prompt.md → paste ke Replit Agent
 * Agent analisis + simpan ke artifacts/HK-Projects/Audit.md
 */

import { exec } from "child_process";
import { promisify } from "util";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const execAsync = promisify(exec);

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const ENGINES = ["lighter", "extended", "ethereal"];

const ENGINE_FILES = {
  lighter: [
    "artifacts/api-server/src/lib/lighter/lighterBotEngine.ts",
    "artifacts/api-server/src/lib/lighter/lighterClient.ts",
    "artifacts/api-server/src/lib/lighter/lighterHelpers.ts",
  ],
  extended: [
    "artifacts/api-server/src/lib/extended/extendedBotEngine.ts",
    "artifacts/api-server/src/lib/extended/extendedClient.ts",
  ],
  ethereal: [
    "artifacts/api-server/src/lib/ethereal/etherealBotEngine.ts",
    "artifacts/api-server/src/lib/ethereal/etherealClient.ts",
  ],
};

const FETCH_SCRIPTS = {
  lighter:  "referensi/fetch-lighter-docs.js",
  extended: "referensi/fetch-extended-docs.js",
  ethereal: "referensi/fetch-ethereal-docs.js",
};

const DOCS_DIRS = {
  lighter:  "referensi/lighter-docs",
  extended: "referensi/extended-docs",
  ethereal: "referensi/ethereal-docs",
};

// DEX-specific rules — updated berdasarkan riset Dune+Docs Apr 2026
const DEX_RULES = {
  ethereal: `
- **WS Heartbeat**: Kirim {"method":"ping"} setiap <60s (Hyperliquid L1 drop tanpa ping, MEV bots 45% txns). Cek setInterval di etherealBotEngine.
- **Reconnect Snapshot**: Post-reconnect wajib request full orderbook snapshot + nonce sync (HyperBFT ~90min epochs). Jangan assume state masih valid.
- **HYPE Gas HyperEVM**: Gunakan HYPE (bukan ETH) untuk tx di HyperEVM; cek balance pre-tx. MetaMask error "insufficient ETH" kalau salah network.
- **Market Order Price=0 [CRITICAL]**: Saat immediatelyFilled, executionPrice=0 langsung dipakai update avg_buy_price → data corrupt permanen. Wajib poll /fills API untuk actual fill price sebelum update stats.
- **USDe Rewards**: Verifikasi compounded daily staking (kHYPE 70%); cek min balance per epoch. Zero rewards bug Mar-Apr 2026.
- **Latency Offset**: <5ms → 0.01-0.05%; monitor MEV gas spikes (Dune: 47% gas by bots).`,

  extended: `
- **WS Rate Limit**: Max 20 conn/sec (Paradex docs); cegah reconnect storm dengan exponential backoff (1s → 60s). Tanpa backoff → IP ban.
- **PARTIALLY_FILLED Double-Count**: Validasi fill_type="FILL" & remaining_size>0 di /fills sebelum update trade stats. Event bisa trigger berkali-kali untuk order yang sama.
- **IOC Market Price**: Estimasi worst-case price dari impact bid/ask; jangan pakai NaN/0 sebagai fallback.
- **Nonce Invalidate**: Gunakan noop tx untuk cancel, bukan spam cancel (Paradex flags interactive).
- **orderbook_seq_no**: Pastikan sequence number sync setelah reconnect untuk hindari missed fills.
- **Latency Offset**: 5-10ms → 0.05-0.2%.`,

  lighter: `
- **Post-Only Flag**: Guarantee maker (0 fees standard account); auto-cancel jika crossing orders.
- **Atomic Avg Price SQL [CRITICAL]**: SET avg_buy_price = (OLD.total_bought * OLD.avg + new_amount * fill_price) / (OLD.total_bought + new_amount). Denominator HARUS pakai OLD value, bukan post-SET.
- **Grid Step Dynamic**: Sesuaikan step size berdasarkan spread aktual (volume spike $19B → $2B, static step salah). Tambah 0.2% saat high volume.
- **Fair Marking**: Verifikasi EMA 8min + impact 500 USDC; TWAP suborders max 3% slippage.
- **Reduce-Only**: Position hanya boleh ke 0; partial cancel excess size jika melebihi posisi.
- **Latency Offset**: 200-300ms → 0.2-0.5%, +0.2% high vol (715K depositors peak).`,
};

const OUTPUT_PROMPT = "audit-prompt.md";
const OUTPUT_RESULT = "artifacts/HK-Projects/Audit.md";

// Token-based truncation: estimasi 4 chars/token
const MAX_TOKENS_PER_FILE = 10000;
const MAX_DOC_FILES = 5;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function log(msg) { console.log(`[audit] ${msg}`); }

/**
 * Baca file dengan token-based truncation.
 * Strip komentar dulu → yang tersisa = logika kode murni.
 */
function readFileSafe(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    let content = readFileSync(filePath, "utf-8");

    // Strip komentar untuk hemat token
    content = content
      .replace(/\/\*[\s\S]*?\*\//gm, "")  // block comments
      .replace(/^\s*\/\/.*$/gm, "")         // full-line // comments
      .replace(/\n{3,}/g, "\n\n")           // multiple blank lines
      .trim();

    const estTokens = Math.ceil(content.length / 4);
    if (estTokens > MAX_TOKENS_PER_FILE) {
      content =
        content.slice(0, MAX_TOKENS_PER_FILE * 4) +
        `\n\n... [TRUNCATED — est ${estTokens} tokens, showing first ${MAX_TOKENS_PER_FILE}]`;
    }
    return content;
  } catch { return null; }
}

function collectDocFiles(dir, maxFiles = MAX_DOC_FILES) {
  if (!existsSync(dir)) return [];
  const results = [];
  function walk(d) {
    if (results.length >= maxFiles) return;
    for (const entry of readdirSync(d)) {
      if (results.length >= maxFiles) break;
      const full = join(d, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if ([".md", ".json", ".txt"].includes(extname(entry))) {
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

function buildDocContext(engine) {
  const files = collectDocFiles(DOCS_DIRS[engine]);
  if (files.length === 0) return "(no docs available)";
  return files
    .map((f) => {
      const c = readFileSafe(f);
      return c ? `### ${f}\n\`\`\`\n${c}\n\`\`\`` : null;
    })
    .filter(Boolean)
    .join("\n\n");
}

function buildImplContext(engine) {
  return ENGINE_FILES[engine]
    .map((f) => {
      const c = readFileSafe(f);
      return c
        ? `### ${f}\n\`\`\`typescript\n${c}\n\`\`\``
        : `### ${f}\n(file not found)`;
    })
    .join("\n\n");
}

// ─── STEP 1: FETCH DOCS ───────────────────────────────────────────────────────

async function fetchDocs(engine) {
  const script = FETCH_SCRIPTS[engine];
  if (!existsSync(script)) {
    log(`SKIP fetch ${engine} — script not found: ${script}`);
    return;
  }
  log(`Fetching ${engine} docs...`);
  try {
    const { stdout, stderr } = await execAsync(`node ${script}`, { timeout: 60000 });
    if (stdout) log(`[${engine}] ${stdout.slice(0, 200)}`);
    if (stderr) log(`[${engine}] STDERR: ${stderr.slice(0, 200)}`);
  } catch (e) {
    log(`WARN: fetch ${engine} gagal — ${e.message}`);
  }
}

// ─── STEP 2: BUILD PROMPT ─────────────────────────────────────────────────────

function buildEngineSection(engine) {
  const docsCtx = buildDocContext(engine);
  const implCtx = buildImplContext(engine);
  const rules   = DEX_RULES[engine] ?? "(no specific rules)";

  return [
    `## ENGINE: ${engine.toUpperCase()}`,
    ``,
    `### DEX-Specific Rules (prioritas tinggi — cek ini dulu)`,
    rules,
    ``,
    `### Dokumentasi Resmi`,
    docsCtx,
    ``,
    `### Implementasi`,
    implCtx,
    ``,
    `---`,
  ].join("\n");
}

function buildPrompt(targetEngines) {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const header = [
    `# HK-Projects Audit Prompt`,
    `> Generated: ${now}`,
    `> Engines: ${targetEngines.join(", ")}`,
    ``,
    `---`,
    ``,
    `## INSTRUKSI UNTUK AGENT`,
    ``,
    `Kamu sedang melakukan **code audit** untuk HK-Projects — algorithmic trading platform multi-DEX (Lighter, Extended/Paradex, Ethereal/Hyperliquid).`,
    ``,
    `**Untuk setiap engine di bawah:**`,
    `1. Baca DEX-Specific Rules terlebih dahulu — ini known issues dari riset terbaru`,
    `2. Bandingkan IMPLEMENTASI dengan DOKUMENTASI resmi`,
    `3. Temukan bug nyata, diskrepansi, atau masalah correctness`,
    ``,
    `**Focus area audit:**`,
    `1. Order placement — kalkulasi harga, quantity, desimal`,
    `2. DCA & Grid — interval, step size, kondisi rerange`,
    `3. Fill/trade recording — avg_buy_price, avg_sell_price, total_bought/sold`,
    `4. WebSocket / polling — missed events, double-count, stale state, heartbeat`,
    `5. Error handling — silent failures, unhandled rejections, promise tanpa catch`,
    `6. Docs vs impl — endpoint deprecated, field name salah, response shape berubah`,
    `7. AI Guardrails — cek position sizing max 1-2x leverage, circuit breaker >10% drawdown`,
    `8. Volume ekstrem & latency — verifikasi offset dynamic saat spike volume`,
    `9. Reconnection integrity — post-drop: resync nonce, orderbook, fills; backoff exponential`,
    ``,
    `**Format output per temuan:**`,
    `\`\`\``,
    `**Bug ID**: BUG-{ENGINE}-{NNN}`,
    `**Severity**: CRITICAL / HIGH / MEDIUM / LOW`,
    `**Location**: nama file + perkiraan baris`,
    `**Description**: apa yang salah dan kenapa`,
    `**Evidence**: snippet kode bermasalah`,
    `**Fix**: apa yang harus dilakukan`,
    `\`\`\``,
    ``,
    `Kalau tidak ada bug per kategori → tulis "No issues found".`,
    ``,
    `**Setelah selesai semua engine, simpan hasil lengkap ke \`${OUTPUT_RESULT}\`.**`,
    ``,
    `---`,
    ``,
  ].join("\n");

  const engineSections = targetEngines.map(buildEngineSection).join("\n\n");

  return header + engineSections;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const engineFlag = args.indexOf("--engine");
  let targetEngines = ENGINES;

  if (engineFlag !== -1 && args[engineFlag + 1]) {
    const val = args[engineFlag + 1];
    targetEngines = val === "all" ? ENGINES : [val];
  }

  log(`Target engines: ${targetEngines.join(", ")}`);

  // Step 1: Fetch docs (paralel)
  await Promise.all(targetEngines.map(fetchDocs));

  // Step 2: Build prompt
  log("Building prompt...");
  const prompt = buildPrompt(targetEngines);
  writeFileSync(OUTPUT_PROMPT, prompt, "utf-8");

  const lines = prompt.split("\n").length;
  const kb    = (Buffer.byteLength(prompt, "utf-8") / 1024).toFixed(1);

  log(`✅ Prompt siap → ${OUTPUT_PROMPT} (${lines} baris, ${kb} KB)`);
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Langkah selanjutnya:`);
  console.log(`  1. Buka ${OUTPUT_PROMPT}`);
  console.log(`  2. Copy semua isinya`);
  console.log(`  3. Paste ke Replit Agent`);
  console.log(`  4. Agent analisis dan simpan ke ${OUTPUT_RESULT}`);
  console.log(`${"=".repeat(60)}\n`);
}

main().catch((err) => {
  console.error("[audit] FATAL:", err);
  process.exit(1);
});