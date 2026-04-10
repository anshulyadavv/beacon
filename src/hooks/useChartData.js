import React from "react";
import { useState, useEffect } from "react";
import { fetchCandles } from "./finnhub";

export function useChartData(ticker, timeframe) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!ticker || !timeframe) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    setData([]);

    fetchCandles(ticker, timeframe)
      .then((payload) => {
        if (cancelled) return;
        setData(payload);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message ?? "no_data");
        setData([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [ticker, timeframe]);

  return { data, loading, error };
}