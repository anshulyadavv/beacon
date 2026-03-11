import React from "react";
import { useState, useEffect } from "react";
import { fetchQuote, fetchProfile, fetchMetrics } from "./finnhub";

/**
 * Fetches quote + profile + metrics for a ticker in parallel.
 * Returns { quote, profile, metrics, loading, error }
 */
export function useStockData(ticker) {
  const [quote,   setQuote]   = useState(null);
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!ticker) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    setQuote(null);
    setProfile(null);
    setMetrics(null);

    Promise.all([
      fetchQuote(ticker),
      fetchProfile(ticker),
      fetchMetrics(ticker),
    ])
      .then(([q, p, m]) => {
        if (cancelled) return;
        setQuote(q);
        setProfile(p);
        setMetrics(m);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message ?? "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [ticker]);

  return { quote, profile, metrics, loading, error };
}