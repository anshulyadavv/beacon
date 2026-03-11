// Fallback prices used only for mock chart generation before real data loads.
const FALLBACK_PRICES = {
  AAPL: { price: 178.72, changePct: 1.43 },
  NVDA: { price: 875.28, changePct: 3.12 },
  TSLA: { price: 175.34, changePct: -2.10 },
  MSFT: { price: 416.42, changePct: 0.85 },
  PLTR: { price: 24.31,  changePct: -0.45 },
};
const DEFAULT_STOCK = { price: 150, changePct: 1.0 };
function getStock(ticker) { return FALLBACK_PRICES[ticker] ?? DEFAULT_STOCK; }



/**
 * Seeded pseudo-random number generator — deterministic per ticker+timeframe.
 * Returns a closure that yields values in [0, 1).
 */
function seededRand(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * Per-timeframe config:
 *   points      — number of data points on the chart
 *   volatility  — per-step swing as a fraction of current price
 *   drift       — directional pull per step
 *   startOffset — how far back (fraction of price) the series begins
 */
const TIMEFRAME_CONFIG = {
  "1D": { points: 78,  volatility: 0.0015, drift: 0.00008,  startOffset: 0.010 },
  "1W": { points: 35,  volatility: 0.005,  drift: 0.0003,   startOffset: 0.035 },
  "1M": { points: 30,  volatility: 0.012,  drift: 0.0008,   startOffset: 0.075 },
  "3M": { points: 90,  volatility: 0.016,  drift: 0.0006,   startOffset: 0.130 },
  "1Y": { points: 52,  volatility: 0.028,  drift: 0.0015,   startOffset: 0.260 },
  ALL:  { points: 120, volatility: 0.042,  drift: 0.0025,   startOffset: 0.520 },
};

/**
 * Generates a realistic-feeling price series for a given ticker + timeframe.
 *
 * What makes each timeframe feel distinct:
 *   1D  → tight intraday wiggles, barely moves
 *   1W  → small multi-day swings visible
 *   1M  → clear monthly trend with pullbacks
 *   3M  → medium-term momentum with corrections
 *   1Y  → full-year arc with multiple swings
 *   ALL → multi-year journey, large moves
 *
 * The series always ends exactly at the stock's current live price.
 * Replace with a real OHLCV API fetch when ready.
 */
export function generateChartData(ticker, timeframe) {
  const stock = getStock(ticker);
  const cfg = TIMEFRAME_CONFIG[timeframe] ?? TIMEFRAME_CONFIG["1Y"];
  const { points, volatility, drift, startOffset } = cfg;

  // Unique seed per ticker + timeframe so every combo looks different
  const seedNum =
    ticker.split("").reduce((acc, c) => acc + c.charCodeAt(0) * 31, 0) +
    timeframe.split("").reduce((acc, c) => acc + c.charCodeAt(0) * 17, 0);
  const rand = seededRand(seedNum);

  const isUp = stock.changePct >= 0;
  const dirBias = isUp ? drift : -drift;

  // Start offset from current price so the series drifts toward it
  let price = stock.price * (isUp ? 1 - startOffset : 1 + startOffset);

  const data = [];

  for (let i = 0; i < points - 1; i++) {
    const progress = i / points;

    // Gaussian-ish shock: average two uniforms
    const shock = (rand() + rand() - 1) * volatility * stock.price;

    // Directional drift that strengthens as we approach the end
    const trendPull = dirBias * stock.price * (1 + progress);

    // Slow sine-wave momentum to create realistic-looking swings
    const momentum =
      Math.sin(i * 0.35 + seedNum * 0.01) * volatility * 0.4 * stock.price;

    price += shock + trendPull + momentum;
    price = Math.max(price, stock.price * 0.25); // hard floor
    data.push(price);
  }

  // Pin last point exactly to current price
  data.push(stock.price);

  return data;
}