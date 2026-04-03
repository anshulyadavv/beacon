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

// ─── Quote (Migrated to Yahoo Finance) ────────────────────────────────────────
// Returns { price, change, changePct, open, prevClose, high, low }
export async function fetchQuote(ticker) {
  const url = `/api/yquote/v8/finance/chart/${ticker}?interval=1d&range=1d`;
  
  const cacheKey = `quote:${ticker}`;
  const cached = getCached(cacheKey, 1_000);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Quote fetch failed for ${ticker}`);
  const data = await res.json();

  const result = data?.chart?.result?.[0];
  if (!result) throw new Error(`No quote for ${ticker}`);

  const meta = result.meta;
  const quote = result.indicators?.quote?.[0] || {};

  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose;
  const change = parseFloat((price - prevClose).toFixed(2));
  const changePct = prevClose ? parseFloat(((change / prevClose) * 100).toFixed(2)) : 0;

  const openPrice = quote.open?.[0] ?? meta.regularMarketPrice;

  const formatted = {
    price,
    change,
    changePct,
    open: openPrice,
    prevClose: prevClose,
    high: meta.regularMarketDayHigh ?? price,
    low: meta.regularMarketDayLow ?? price,
  };

  return setCache(cacheKey, formatted);
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
  const url = `/api/yquote/v8/finance/chart/${ticker}?interval=${cfg.interval}&range=${cfg.range}`;

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

// ─── Search (Migrated to Yahoo Finance) ───────────────────────────────────────
export async function searchStocks(query) {
  const url = `/api/ysearch/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0&enableFuzzyQuery=false`;
  
  const cacheKey = `search:${query}`;
  const cached = getCached(cacheKey, 120_000);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed`);
  const data = await res.json();

  const seen = new Set();
  const results = (data?.quotes ?? [])
    .filter((r) => {
      if (!["EQUITY", "ETF"].includes(r.quoteType) || !r.symbol) return false;
      if (seen.has(r.symbol)) return false;
      seen.add(r.symbol);
      return true;
    })
    .slice(0, 9)
    .map((r) => ({
      ticker:   r.symbol,
      name:     r.shortname || r.longname || r.symbol,
      exchange: r.exchDisp ?? "",
      type:     r.quoteType === "ETF" ? "ETF" : "Common Stock",
    }));

  return setCache(cacheKey, results);
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