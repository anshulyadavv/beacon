import { useState, useEffect } from "react";
import { STOCKS } from "../data/stocks";

export function useLivePrices() {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(
      Object.entries(STOCKS).map(([ticker, stock]) => [
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
          const basePrice = STOCKS[ticker].price;
          const change = parseFloat((newPrice - basePrice).toFixed(2));
          const changePct = parseFloat(((change / basePrice) * 100).toFixed(2));
          next[ticker] = { price: newPrice, change, changePct };
        });
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return prices;
}