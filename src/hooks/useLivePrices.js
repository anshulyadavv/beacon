import { useState, useEffect, useRef, useCallback } from "react";
import { fetchBatchQuotes } from "./finnhub";

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY;

export function useLivePrices(tickers = []) {
  const [prices, setPrices] = useState({});
  const tickersRef = useRef([]);
  
  // We need to store baseline prevClose for each ticker to calc percentages correctly when WSS updates fire
  const baselineRef = useRef({}); 
  const wsRef = useRef(null);

  // Initialize bulk fetch logic to get previousClose quickly
  const fetchBaselines = useCallback(async (newTickers) => {
    if (!newTickers.length) return;
    try {
      const data = await fetchBatchQuotes(newTickers);
      setPrices((prev) => {
        const next = { ...prev };
        data.forEach(({ ticker, price, change, changePct, prevClose }) => {
          next[ticker] = { price, change, changePct };
          baselineRef.current[ticker] = prevClose;
        });
        return next;
      });
    } catch (e) {
      console.warn("Failed to fetch baselines", e);
    }
  }, []);

  // WSS Connection
  useEffect(() => {
    if (!FINNHUB_KEY) return;
    
    let reconnectTimeout = null;
    let keepAliveInterval = null;

    const connect = () => {
      const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_KEY}`);
      
      ws.onopen = () => {
        // Subscribe to existing tickers
        tickersRef.current.forEach(symbol => {
          ws.send(JSON.stringify({ type: 'subscribe', symbol }));
        });
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'trade' && message.data) {
          // Process trades and aggregate
          // Note: Finnhub can send multiple trades, we just take the last known price
          const latestPrices = {};
          message.data.forEach(trade => {
            latestPrices[trade.s] = trade.p;
          });

          setPrices(prev => {
            const next = {...prev};
            let updated = false;

            for (const [sym, price] of Object.entries(latestPrices)) {
              if (!tickersRef.current.includes(sym)) continue;
              
              const prevClose = baselineRef.current[sym];
              if (prevClose) {
                const change = price - prevClose;
                const changePct = (change / prevClose) * 100;
                next[sym] = { price, change, changePct };
                updated = true;
              }
            }
            return updated ? next : prev;
          });
        }
      };

      ws.onclose = () => {
        // Reconnect logic
        reconnectTimeout = setTimeout(connect, 3000);
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent auto-reconnect
        wsRef.current.close();
      }
    };
  }, []);

  // Handle ticker list changes
  useEffect(() => {
    const oldTickers = tickersRef.current;
    const newTickers = tickers;
    
    const added = newTickers.filter(t => !oldTickers.includes(t));
    const removed = oldTickers.filter(t => !newTickers.includes(t));

    // Handle WebSocket Subscriptions
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      added.forEach(symbol => {
        wsRef.current.send(JSON.stringify({ type: 'subscribe', symbol }));
      });
      removed.forEach(symbol => {
        wsRef.current.send(JSON.stringify({ type: 'unsubscribe', symbol }));
      });
    }

    if (added.length > 0) {
      fetchBaselines(added);
    }
    
    tickersRef.current = newTickers;
  }, [tickers, fetchBaselines]);

  return prices;
}