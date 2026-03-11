import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchBatchQuotes } from "./finnhub";

export function useLivePrices(tickers = []) {
  const [prices, setPrices] = useState({});
  const tickersRef          = useRef(tickers);
  const prevKey             = useRef("");

  useEffect(() => { tickersRef.current = tickers; }, [tickers]);

  const applyUpdates = useCallback((updates) => {
    if (!updates.length) return;
    setPrices((prev) => {
      const next = { ...prev };
      updates.forEach(({ ticker, price, change, changePct }) => {
        next[ticker] = { price, change, changePct };
      });
      return next;
    });
  }, []);

  // Fetch immediately when new tickers are added
  useEffect(() => {
    const key = [...tickers].sort().join(",");
    if (!tickers.length || key === prevKey.current) return;
    prevKey.current = key;
    const missing = tickers.filter((t) => !prices[t]);
    if (missing.length) fetchBatchQuotes(missing).then(applyUpdates).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickers.join(",")]);

  // Poll all tickers every 15s
  useEffect(() => {
    const id = setInterval(() => {
      if (tickersRef.current.length)
        fetchBatchQuotes(tickersRef.current).then(applyUpdates).catch(() => {});
    }, 15_000);
    return () => clearInterval(id);
  }, [applyUpdates]);

  return prices;
}