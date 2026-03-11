import React from "react";
import { useState, useEffect } from "react";
import { DEFAULT_WATCHLIST } from "../../data/stocks";
import { useLivePrices } from "../../hooks/useLivePrices";
import Watchlist from "./Watchlist";
import ChartPanel from "./ChartPanel";
import Fundamentals from "./Fundamentals";

export default function TradingDashboard() {
  const [selected,  setSelected]  = useState("AAPL");
  const [timeframe, setTimeframe] = useState("1Y");
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);

  // Live prices stream only for tickers currently in watchlist + selected
  const tickersToStream = [...new Set([...watchlist, selected])];
  const prices = useLivePrices(tickersToStream);

  // Read ticker from URL hash → enables share links
  useEffect(() => {
    const hash = window.location.hash.replace("#", "").toUpperCase();
    if (hash) {
      setSelected(hash);
      // Also add to watchlist if not already there
      setWatchlist((w) => w.includes(hash) ? w : [...w, hash]);
    }
  }, []);

  const addToWatchlist      = (ticker) => setWatchlist((w) => w.includes(ticker) ? w : [...w, ticker]);
  const removeFromWatchlist = (ticker) => setWatchlist((w) => w.filter((t) => t !== ticker));
  const isInWatchlist       = (ticker) => watchlist.includes(ticker);

  return (
    <div style={{
      background: "#0b0b0c",
      color: "#fff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      width: "100vw",
      height: "100vh",
      display: "grid",
      gridTemplateColumns: "232px 1fr 268px",
      WebkitFontSmoothing: "antialiased",
      overflow: "hidden",
      position: "fixed",
      top: 0, left: 0,
    }}>
      <Watchlist
        selected={selected}
        prices={prices}
        watchlist={watchlist}
        onSelect={setSelected}
        onRemove={removeFromWatchlist}
      />
      <ChartPanel
        selected={selected}
        timeframe={timeframe}
        livePrice={prices[selected]}
        prices={prices}
        watchlist={watchlist}
        isInWatchlist={isInWatchlist(selected)}
        onSelect={(ticker) => {
          setSelected(ticker);
          // Start streaming this ticker immediately
          setWatchlist((w) => w); // trigger re-render so tickersToStream updates
        }}
        onTimeframe={setTimeframe}
        onAddToWatchlist={addToWatchlist}
        onRemoveFromWatchlist={removeFromWatchlist}
      />
      <Fundamentals
        selected={selected}
        livePrice={prices[selected]}
        isInWatchlist={isInWatchlist(selected)}
        onAdd={addToWatchlist}
        onRemove={removeFromWatchlist}
      />
    </div>
  );
}