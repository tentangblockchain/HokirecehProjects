// fetch-grvt-docs.js
// Fetch GRVT DEX API documentation dari sumber resmi.
// Output: ./grvt-docs/
//
// Cara pakai: node referensi/fetch-grvt-docs.js
//
// Sumber:
//  1. Docs pages (MkDocs Material static site) — api-docs.grvt.io
//
// Struktur halaman docs GRVT:
//  - /                   — Overview (Beranda)
//  - /learn/             — Learn (Konsep dasar, auth, encoding, WebSocket)
//  - /api_setup/         — API Setup
//  - /market_data_api/   — Market Data REST API
//  - /market_data_streams/ — Market Data Streams (WebSocket)
//  - /trading_api/       — Trading REST API
//  - /trading_streams/   — Trading Streams (WebSocket)
//  - /referral_data/     — Referral Data
//  - /grvt_strategies/   — GRVT Strategies
//  - /builder_codes/     — Builder Codes
//
// Catatan: api-docs.grvt.io dilindungi Cloudflare WAF.
//  Script mencoba dengan curl + browser headers. Jika gagal, file placeholder
//  tetap dibuat agar kamu tahu URL mana yang perlu dibuka manual.

const https       = require('https');
const http        = require('http');
const fs          = require('fs');
const path        = require('path');
const { execSync } = require('child_process');

const ROOT     = path.join(__dirname, 'grvt-docs');
const BASE_URL = 'https://api-docs.grvt.io';

// ─── DAFTAR HALAMAN DOCS ───────────────────────────────────────────────────────
// Format: [url-path, filename-output, judul-halaman]
const DOCS_PAGES = [
  ['',                     'overview',             'GRVT API Overview'],
  ['learn/',               'learn',                'Learn — Konsep Dasar & Auth'],
  ['api_setup/',           'api-setup',            'API Setup'],
  ['market_data_api/',     'market-data-api',      'Market Data REST API'],
  ['market_data_streams/', 'market-data-streams',  'Market Data Streams (WebSocket)'],
  ['trading_api/',         'trading-api',          'Trading REST API'],
  ['trading_streams/',     'trading-streams',      'Trading Streams (WebSocket)'],
  ['referral_data/',       'referral-data',        'Referral Data'],
  ['grvt_strategies/',     'grvt-strategies',      'GRVT Strategies'],
  ['builder_codes/',       'builder-codes',        'Builder Codes'],
];

// OpenAPI spec — coba beberapa kandidat URL
const OPENAPI_CANDIDATES = [
  `${BASE_URL}/openapi.json`,
  `${BASE_URL}/openapi.yaml`,
  `${BASE_URL}/api/openapi.json`,
  'https://api.grvt.io/openapi.json',
  'https://api.grvt.io/docs/openapi.json',
  'https://api.testnet.grvt.io/openapi.json',
];

// ─── FETCH VIA CURL (bypass Cloudflare lebih baik) ────────────────────────────
function fetchWithCurl(url, timeoutSec = 20) {
  try {
    const cmd = [
      'curl', '-sL',
      `--max-time ${timeoutSec}`,
      '--compressed',
      '-H', `"User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"`,
      '-H', '"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"',
      '-H', '"Accept-Language: en-US,en;q=0.9"',
      '-H', '"Sec-Fetch-Dest: document"',
      '-H', '"Sec-Fetch-Mode: navigate"',
      '-H', '"Sec-Fetch-Site: none"',
      '-H', '"Cache-Control: no-cache"',
      '-w', '"\\n__HTTP_STATUS__%{http_code}"',
      `"${url}"`,
    ].join(' ');

    const raw = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const statusMatch = raw.match(/__HTTP_STATUS__(\d+)$/);
    const status      = statusMatch ? parseInt(statusMatch[1]) : 200;
    const body        = statusMatch ? raw.slice(0, raw.lastIndexOf('__HTTP_STATUS__')) : raw;

    if (status === 403) throw new Error(`HTTP 403 (Cloudflare WAF)`);
    if (status !== 200) throw new Error(`HTTP ${status}`);

    return body;
  } catch (err) {
    if (err.message) throw err;
    throw new Error(`curl error: ${err.stderr ?? err.message}`);
  }
}

// ─── FETCH VIA NODE HTTPS (fallback) ──────────────────────────────────────────
function fetchWithNode(urlStr, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const tryFetch = (u, redirectsLeft) => {
      const mod = u.startsWith('https') ? https : http;
      mod.get(u, {
        headers: {
          'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control':   'no-cache',
        },
        timeout: 20000,
      }, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
          if (redirectsLeft <= 0) { reject(new Error(`Too many redirects`)); return; }
          const loc  = res.headers.location;
          const next = loc.startsWith('http') ? loc : new URL(loc, u).href;
          res.resume();
          tryFetch(next, redirectsLeft - 1);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        res.on('error', reject);
      }).on('error', reject).on('timeout', function () {
        this.destroy();
        reject(new Error(`Timeout`));
      });
    };
    tryFetch(urlStr, maxRedirects);
  });
}

// ─── FETCH (coba curl dulu, fallback ke node) ─────────────────────────────────
async function fetch(url) {
  try {
    const body = fetchWithCurl(url);
    if (!body || body.length < 100) throw new Error('Empty response dari curl');
    return body;
  } catch (e1) {
    // Fallback ke node https
    try {
      return await fetchWithNode(url);
    } catch (e2) {
      throw new Error(`curl: ${e1.message} | node: ${e2.message}`);
    }
  }
}

// ─── EXTRACT KONTEN DARI MKDOCS HTML ──────────────────────────────────────────
// MkDocs Material menyimpan konten di <article class="md-content__inner">
function extractMkdocsContent(html) {
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Cari konten utama MkDocs Material
  const patterns = [
    /<article[^>]*class="[^"]*md-content__inner[^"]*"[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*md-content__inner[^"]*"[^>]*>([\s\S]*)/i,
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      const text = htmlToMd(match[1]);
      if (text.length > 200) return text;
    }
  }

  // Fallback: seluruh body
  return htmlToMd(cleaned);
}

// ─── HTML → MARKDOWN ──────────────────────────────────────────────────────────
function htmlToMd(html) {
  return html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n# ${stripTags(t)}\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${stripTags(t)}\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${stripTags(t)}\n`)
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n#### ${stripTags(t)}\n`)
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => `\n##### ${stripTags(t)}\n`)
    .replace(/<pre[^>]*><code[^>]*class="[^"]*language-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
      (_, lang, code) => `\n\`\`\`${lang}\n${decodeHtml(code)}\n\`\`\`\n`)
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
      (_, code) => `\n\`\`\`\n${decodeHtml(code)}\n\`\`\`\n`)
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => `\`${stripTags(c)}\``)
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
      (_, href, text) => `[${stripTags(text)}](${href})`)
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${stripTags(t)}**`)
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi,     (_, __, t) => `_${stripTags(t)}_`)
    .replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, (_, t) => `| ${stripTags(t)} `)
    .replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, (_, t) => `| ${stripTags(t)} `)
    .replace(/<\/tr>/gi, '|\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${stripTags(t)}`)
    .replace(/<\/(ul|ol)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n${stripTags(t)}\n`)
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
      (_, t) => '\n' + stripTags(t).split('\n').map(l => `> ${l}`).join('\n') + '\n')
    .replace(/<\/?div[^>]*>/gi, '\n')
    .replace(/<\/?section[^>]*>/gi, '\n')
    .replace(/<\/?span[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d)))
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

function stripTags(html) {
  return (html ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .trim();
}

function decodeHtml(html) {
  return (html ?? '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

// ─── EXTRACT JUDUL HALAMAN ─────────────────────────────────────────────────────
function extractTitle(html, fallback) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return fallback;
  return m[1]
    .replace(/ - GRVT.*$/i, '')
    .replace(/ \| GRVT.*/i, '')
    .replace(/ – GRVT.*/i, '')
    .trim() || fallback;
}

// ─── BUILD RINGKASAN OPENAPI ───────────────────────────────────────────────────
function buildApiSummary(spec, label) {
  const title   = spec.info?.title   ?? label;
  const version = spec.info?.version ?? '?';
  const desc    = spec.info?.description ?? '';
  const baseUrl = (spec.servers ?? []).map(s => s.url).join(', ') || '—';

  const lines = [
    `# ${title} — Ringkasan Endpoint`,
    ``,
    `> Label   : ${label}`,
    `> Versi   : ${version}`,
    `> Base URL: ${baseUrl}`,
    `> Dibuat  : ${new Date().toISOString()}`,
    ``,
    desc,
    ``,
    `## Daftar Endpoint`,
    ``,
  ];

  const paths = spec.paths ?? {};
  for (const [pathStr, methods] of Object.entries(paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (!op || typeof op !== 'object') continue;
      const summary = op.summary ?? op.operationId ?? '';
      const tags    = (op.tags ?? []).join(', ');
      lines.push(`### \`${method.toUpperCase()} ${pathStr}\``);
      if (tags)           lines.push(`**Tags**: ${tags}`);
      if (summary)        lines.push(`**Summary**: ${summary}`);
      if (op.description) lines.push(``, op.description);

      const params = op.parameters ?? [];
      if (params.length > 0) {
        lines.push(``, `**Parameter:**`);
        for (const p of params) {
          const req  = p.required ? ' *(required)*' : '';
          const type = p.schema?.type ?? p.type ?? 'any';
          lines.push(`- \`${p.name}\` (${p.in}, ${type})${req} — ${p.description ?? ''}`);
        }
      }

      const reqBody = op.requestBody;
      if (reqBody) {
        const schema = reqBody.content?.['application/json']?.schema;
        if (schema) {
          lines.push(``, `**Request Body:**`);
          lines.push(`\`\`\`json`);
          lines.push(JSON.stringify(schema, null, 2).slice(0, 2000));
          lines.push(`\`\`\``);
        }
      }
      lines.push(``);
    }
  }

  return lines.join('\n');
}

// ─── SIMPAN FILE ───────────────────────────────────────────────────────────────
function save(filepath, content) {
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content, 'utf8');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function run() {
  let ok = 0, fail = 0;
  const failList = [];

  console.log('\nGRVT API Docs Fetcher');
  console.log('=====================');
  console.log(`Source : ${BASE_URL}`);
  console.log(`Output : ${ROOT}/`);
  console.log(`Engine : MkDocs Material (static HTML)`);
  console.log(`Fetch  : curl (browser fingerprint) → node https (fallback)\n`);

  fs.mkdirSync(ROOT, { recursive: true });

  // ── 1. Coba OpenAPI JSON Spec ────────────────────────────────────────────────
  console.log('── OPENAPI JSON SPEC ──');
  let openApiSaved = false;
  for (const url of OPENAPI_CANDIDATES) {
    try {
      const body = await fetch(url);
      if (!body || body.includes('<!DOCTYPE')) throw new Error('Bukan JSON/YAML');
      if (body.includes('openapi:') || body.includes('swagger:')) {
        // YAML format
        save(path.join(ROOT, 'openapi.yaml'), body);
        console.log(`  [OK] openapi.yaml ← ${url}`);
        ok++;
        openApiSaved = true;
        break;
      }
      const parsed = JSON.parse(body);
      if (parsed.openapi || parsed.swagger || parsed.info) {
        save(path.join(ROOT, 'openapi.json'), JSON.stringify(parsed, null, 2));
        console.log(`  [OK] openapi.json ← ${url}`);
        ok++;
        openApiSaved = true;

        const summary = buildApiSummary(parsed, 'GRVT API');
        save(path.join(ROOT, 'api-endpoints-summary.md'), summary);
        console.log(`  [OK] api-endpoints-summary.md`);
        ok++;
        break;
      }
    } catch (e) {
      // coba kandidat berikutnya — diam saja
    }
    await new Promise(r => setTimeout(r, 300));
  }
  if (!openApiSaved) {
    console.log('  [SKIP] OpenAPI spec tidak ditemukan');
  }

  // ── 2. Docs Pages (MkDocs static HTML) ──────────────────────────────────────
  console.log(`\n── DOCS PAGES (${BASE_URL}) ──`);

  for (const [urlPath, filename, pageLabel] of DOCS_PAGES) {
    const url     = `${BASE_URL}/${urlPath}`;
    const outFile = path.join(ROOT, 'docs', filename + '.md');

    try {
      const body = await fetch(url);

      // Cek apakah kena Cloudflare block
      if (body.includes('"cf-error-details"') || (body.includes('Cloudflare') && body.includes('blocked'))) {
        throw new Error('Cloudflare WAF block — buka manual di browser');
      }

      const pageTitle  = extractTitle(body, pageLabel);
      const content    = extractMkdocsContent(body);
      const hasContent = content.length > 150;

      const fileContent = [
        `# ${pageTitle}`,
        ``,
        `> Source  : ${url}`,
        `> Fetched : ${new Date().toISOString()}`,
        `> Engine  : MkDocs Material`,
        ``,
        hasContent ? '' : `> ⚠️ Konten terlalu singkat. Buka ${url} di browser untuk dokumentasi lengkap.`,
        ``,
        content,
      ].join('\n');

      save(outFile, fileContent);

      const status = hasContent ? 'OK' : 'PARTIAL';
      console.log(`  [${status}] docs/${filename}.md  (${content.length} chars)`);
      if (hasContent) ok++;
      else { fail++; failList.push({ section: 'docs', filename, err: 'konten minimal' }); }

    } catch (err) {
      // Buat placeholder meski gagal — tetap berguna sebagai referensi URL
      const placeholder = [
        `# ${pageLabel}`,
        ``,
        `> Source  : ${url}`,
        `> Fetched : ${new Date().toISOString()}`,
        `> Status  : GAGAL`,
        ``,
        `> ⚠️ Tidak bisa di-fetch otomatis: ${err.message}`,
        `>`,
        `> Buka URL ini langsung di browser untuk membaca dokumentasinya:`,
        `> **${url}**`,
        ``,
        `---`,
        ``,
        `## Cara membuka manual`,
        ``,
        `1. Buka browser`,
        `2. Navigasi ke: \`${url}\``,
        `3. Copy paste konten ke file ini jika diperlukan`,
      ].join('\n');

      save(outFile, placeholder);

      fail++;
      failList.push({ section: 'docs', filename, err: err.message });
      console.log(`  [FAIL] docs/${filename}.md — ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 500));
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log(`\n══════════════════════════════════════════`);
  console.log(`Berhasil : ${ok}`);
  console.log(`Gagal    : ${fail}`);
  console.log(`Folder   : ${ROOT}/`);
  console.log(`           └── docs/  (${DOCS_PAGES.length} halaman — termasuk placeholder jika gagal)`);
  if (openApiSaved) {
    console.log(`           ├── openapi.json / openapi.yaml`);
    console.log(`           └── api-endpoints-summary.md`);
  }
  console.log(`\nURL Docs Resmi : ${BASE_URL}/`);
  console.log(``);

  if (failList.length > 0) {
    console.log('Halaman yang gagal di-fetch (tersedia sebagai placeholder):');
    failList.forEach(f => console.log(`  - ${f.filename}: ${f.err}`));
    console.log(``);
    if (failList.some(f => f.err.includes('Cloudflare'))) {
      console.log('Tips: Situs api-docs.grvt.io dilindungi Cloudflare WAF.');
      console.log('      Coba jalankan script ini dari IP yang berbeda (VPN/proxy),');
      console.log('      atau buka halaman di browser dan copy paste kontennya secara manual.');
      console.log('');
    }
  }

  // ── Index JSON ────────────────────────────────────────────────────────────────
  const index = {
    generated:   new Date().toISOString(),
    source:      BASE_URL,
    engine:      'MkDocs Material',
    successful:  ok,
    failed:      fail,
    openApiSpec: openApiSaved,
    note:        'api-docs.grvt.io dilindungi Cloudflare. Jika fetch gagal, file placeholder dibuat dengan URL referensi.',
    sections: Object.fromEntries(
      DOCS_PAGES.map(([p, f, label]) => [f, { url: `${BASE_URL}/${p}`, file: `docs/${f}.md`, label }])
    ),
    docs: DOCS_PAGES.map(([urlPath, filename, label]) => ({
      label,
      url:  `${BASE_URL}/${urlPath}`,
      file: `docs/${filename}.md`,
    })),
  };
  save(path.join(ROOT, 'index.json'), JSON.stringify(index, null, 2));
  console.log(`Index    : ${ROOT}/index.json\n`);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
