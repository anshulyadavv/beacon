import React from "react";
import { useState, useEffect, useRef } from "react";
import { searchStocks } from "./finnhub";

export function useStockSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const timerRef              = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length < 1) {
      setResults([]);
      setLoading(false);
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        setResults(await searchStocks(query));
      } catch {
        setError("Search unavailable");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  return { results, loading, error };
}