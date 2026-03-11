/**
 * Finnhub API utility
 * Reads key from VITE_FINNHUB_KEY env variable.
 * All functions return parsed data or throw on failure.
 * In-memory cache prevents redundant calls.
 */

const KEY  = import.meta.env.VITE_FINNHUB_KEY;
const BASE = "https://finnhub.io/api/v1";

// ─── Cache ────────────────────────────────────────────────────────────────────
const _cache = new Map();

function getCached(key, ttlMs) {
  const entry = _cache.get(key);
  if (entry && Date.now() - entry.ts < ttlMs) return entry.data;
  return null;
}

function setCache(key, data) {
  _cache.set(key, { data, ts: Date.now() });
  return data;
}

async function apiFetch(path, ttlMs = 60_000) {
  const cached = getCached(path, ttlMs);
  if (cached) return cached;

  const url = `${BASE}${path}&token=${KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Finnhub ${res.status} — ${path}`);
  const data = await res.json();
  return setCache(path, data);
}

// ─── Quote ────────────────────────────────────────────────────────────────────
// Returns { price, change, changePct, open, prevClose, high, low }
export async function fetchQuote(ticker) {
  const data = await apiFetch(`/quote?symbol=${ticker}`, 15_000);
  if (!data || data.c == null) throw new Error(`No quote for ${ticker}`);
  const price     = data.c;
  const prevClose = data.pc;
  const change    = parseFloat((price - prevClose).toFixed(2));
  const changePct = prevClose
    ? parseFloat(((change / prevClose) * 100).toFixed(2))
    : 0;
  return {
    price,
    change,
    changePct,
    open:      data.o  ?? 0,
    prevClose: data.pc ?? 0,
    high:      data.h  ?? 0,
    low:       data.l  ?? 0,
  };
}

// ─── Company profile ──────────────────────────────────────────────────────────
// Returns { name, ticker, exchange, industry, marketCap, logo, website, about }
export async function fetchProfile(ticker) {
  const data = await apiFetch(`/stock/profile2?symbol=${ticker}`, 300_000); // 5 min cache
  if (!data || !data.name) throw new Error(`No profile for ${ticker}`);

  const mcRaw = data.marketCapitalization ?? 0; // in millions
  const marketCap = mcRaw >= 1_000_000
    ? `${(mcRaw / 1_000_000).toFixed(2)}T`
    : mcRaw >= 1_000
    ? `${(mcRaw / 1_000).toFixed(2)}B`
    : `${mcRaw.toFixed(0)}M`;

  return {
    name:      data.name            ?? ticker,
    ticker:    data.ticker          ?? ticker,
    exchange:  data.exchange        ?? "—",
    industry:  data.finnhubIndustry ?? "—",
    marketCap,
    logo:      data.logo            ?? "",
    website:   data.weburl          ?? "",
    about:     data.name
      ? `${data.name} operates in the ${data.finnhubIndustry ?? "market"} sector, listed on ${data.exchange ?? "a major exchange"}.`
      : "",
  };
}

// ─── Basic financials ─────────────────────────────────────────────────────────
// Returns key stats: peRatio, eps, high52, low52, beta, divYield
export async function fetchMetrics(ticker) {
  const data = await apiFetch(`/stock/metric?symbol=${ticker}&metric=all`, 300_000);
  const m = data?.metric ?? {};

  const fmt = (v) => (v != null ? String(v) : "—");

  return {
    peRatio:  fmt(m["peNormalizedAnnual"] ?? m["peTTM"]),
    eps:      fmt(m["epsTTM"]),
    high52:   m["52WeekHigh"]  != null ? `$${m["52WeekHigh"].toFixed(2)}`  : "—",
    low52:    m["52WeekLow"]   != null ? `$${m["52WeekLow"].toFixed(2)}`   : "—",
    beta:     fmt(m["beta"]),
    divYield: m["dividendYieldIndicatedAnnual"] != null
      ? `${(m["dividendYieldIndicatedAnnual"] * 100).toFixed(2)}%`
      : "—",
  };
}

// ─── Chart / candles ──────────────────────────────────────────────────────────
const CHART_CONFIG = {
  "1D": { interval: "5m",  range: "1d"  },
  "1W": { interval: "15m", range: "5d"  },
  "1M": { interval: "1h",  range: "1mo" },
  "3M": { interval: "1d",  range: "3mo" },
  "1Y": { interval: "1wk", range: "1y"  },
  "ALL":{ interval: "1mo", range: "5y"  },
};

export async function fetchCandles(ticker, timeframe) {
  const cfg = CHART_CONFIG[timeframe] ?? CHART_CONFIG["1Y"];
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=${cfg.interval}&range=${cfg.range}&corsDomain=finance.yahoo.com`;

  const cacheKey = `chart:${ticker}:${timeframe}`;
  const cached = getCached(cacheKey, 60_000);
  if (cached) return cached;

  const res  = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Chart fetch failed: ${res.status}`);
  const data = await res.json();

  const closes = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
  const filtered = closes.filter((v) => v != null);
  if (filtered.length < 2) throw new Error("no_data");

  return setCache(cacheKey, filtered);
}

// ─── Search ───────────────────────────────────────────────────────────────────
export async function searchStocks(query) {
  const data = await apiFetch(`/search?q=${encodeURIComponent(query)}`, 120_000);
  const seen = new Set();
  return (data?.result ?? [])
    .filter((r) => {
      if (r.type !== "Common Stock" || !r.displaySymbol) return false;
      if (seen.has(r.displaySymbol)) return false;
      seen.add(r.displaySymbol);
      return true;
    })
    .slice(0, 9)
    .map((r) => ({
      ticker:   r.displaySymbol,
      name:     r.description,
      exchange: r.primaryExchange ?? "",
      type:     r.type,
    }));
}

// ─── Batch quotes (parallel) ──────────────────────────────────────────────────
export async function fetchBatchQuotes(tickers) {
  const results = await Promise.allSettled(
    tickers.map(async (ticker) => ({ ticker, ...(await fetchQuote(ticker)) }))
  );
  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
}