import { useState } from "react";
import { STOCKS } from "../../data/stocks";
import { useLivePrices } from "../../hooks/useLivePrices";
import Watchlist from "./Watchlist";
import ChartPanel from "./ChartPanel";
import Fundamentals from "./Fundamentals";

export default function TradingDashboard() {
  const [selected, setSelected]   = useState("AAPL");
  const [timeframe, setTimeframe] = useState("1Y");
  const [search, setSearch]       = useState("");

  const prices = useLivePrices();

  const handleSearch = (value) => {
    setSearch(value);
    if (value) {
      const match = Object.keys(STOCKS).find((t) =>
        t.startsWith(value.toUpperCase())
      );
      if (match) setSelected(match);
    }
  };

  return (
    <div style={{
      background: "#0b0b0c",
      color: "#fff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      width: "100vw",
      height: "100vh",
      display: "grid",
      gridTemplateColumns: "240px 1fr 280px",
      WebkitFontSmoothing: "antialiased",
      overflow: "hidden",
      position: "fixed",
      top: 0,
      left: 0,
    }}>
      <Watchlist
        selected={selected}
        prices={prices}
        onSelect={setSelected}
      />
      <ChartPanel
        selected={selected}
        timeframe={timeframe}
        livePrice={prices[selected]}
        search={search}
        onSearch={handleSearch}
        onTimeframe={setTimeframe}
      />
      <Fundamentals selected={selected} />
    </div>
  );
}