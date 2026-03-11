import { useState, useEffect } from "react";
import { STOCK_UNIVERSE } from "../data/stocks";

/**
 * Simulates live price ticking for ALL stocks in the universe (not just watchlist).
 * Prices update in the background even for stocks not currently visible,
 * so they're always fresh when selected or added to watchlist.
 *
 * Replace the interval with a WebSocket / SSE feed for real data.
 */
export function useLivePrices() {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(
      Object.entries(STOCK_UNIVERSE).map(([ticker, stock]) => [
        ticker,
        { price: stock.price, change: stock.change, changePct: stock.changePct },
      ])
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((ticker) => {
          const delta = (Math.random() - 0.499) * next[ticker].price * 0.0008;
          const newPrice = parseFloat((next[ticker].price + delta).toFixed(2));
          const base = STOCK_UNIVERSE[ticker].price;
          const change = parseFloat((newPrice - base).toFixed(2));
          const changePct = parseFloat(((change / base) * 100).toFixed(2));
          next[ticker] = { price: newPrice, change, changePct };
        });
        return next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return prices;
}