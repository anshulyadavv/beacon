import { STOCKS } from "../data/stocks";

export function generateChartData(ticker, timeframe) {
  const seed = ticker.charCodeAt(0) + ticker.charCodeAt(1);
  const pointCount = { "1D": 78, "1W": 35, "1M": 30, "3M": 90, "1Y": 52, ALL: 120 }[timeframe] ?? 52;
  const stock = STOCKS[ticker];
  const isUp = stock.changePct > 0;

  let val = stock.price * (isUp ? 0.82 : 1.18);
  const data = [];

  for (let i = 0; i < pointCount; i++) {
    const noise =
      (Math.sin(i * 0.7 + seed) * 0.4 + Math.cos(i * 0.3 + seed * 0.5) * 0.3) *
      stock.price * 0.025;
    const trend = isUp
      ? (stock.price - val) * (i / pointCount) * 0.7
      : (val - stock.price) * (i / pointCount) * 0.7;
    val += noise + trend * 0.15;
    data.push(Math.max(val, stock.price * 0.5));
  }

  data[data.length - 1] = stock.price;
  return data;
}