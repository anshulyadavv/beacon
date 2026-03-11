import { STOCKS, TIMEFRAMES } from "../../data/stocks";
import Chart from "./Chart";

export default function ChartPanel({ selected, timeframe, livePrice, search, onSearch, onTimeframe }) {
  const stock = STOCKS[selected];
  const isUp = livePrice.changePct >= 0;

  return (
    <main style={{
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      height: "100%",
      overflow: "hidden",
      borderRight: "1px solid #242426",
      boxSizing: "border-box",
    }}>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center",
        background: "rgba(20,20,22,0.4)", border: "1px solid #242426",
        borderRadius: 9999, padding: "9px 18px", flexShrink: 0,
      }}>
        <svg viewBox="0 0 24 24" style={{ fill: "#8e8e93", marginRight: 10, width: 15, height: 15, flexShrink: 0 }}>
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search ticker or company..."
          style={{
            background: "transparent", border: "none", color: "#fff",
            fontFamily: "inherit", fontSize: 13, width: "100%", outline: "none",
          }}
        />
        <span style={{
          color: "#8e8e93", fontSize: 11,
          background: "rgba(255,255,255,0.1)", padding: "2px 6px",
          borderRadius: 4, flexShrink: 0,
        }}>⌘K</span>
      </div>

      {/* Stock Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0 }}>
          {stock.name}
          <span style={{ fontSize: 13, color: "#8e8e93", fontWeight: 500, marginLeft: 8 }}>
            {selected}
          </span>
        </h1>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
            ${livePrice.price.toFixed(2)}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: isUp ? "#30d158" : "#ff453a", marginTop: 2 }}>
            {isUp ? "+" : ""}{livePrice.change.toFixed(2)} ({isUp ? "+" : ""}{livePrice.changePct.toFixed(2)}%) Today
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "rgba(20,20,22,0.4)",
        backdropFilter: "blur(20px)",
        border: "1px solid #242426",
        borderRadius: 14,
        padding: "16px 20px",
        minHeight: 0,
        overflow: "hidden",
      }}>

        {/* Timeframes */}
        <div style={{ display: "flex", gap: 4, marginBottom: 14, flexShrink: 0 }}>
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframe(tf)}
              style={{
                background: timeframe === tf ? "rgba(255,255,255,0.1)" : "transparent",
                border: "none",
                color: timeframe === tf ? "#fff" : "#8e8e93",
                padding: "5px 11px", borderRadius: 9999,
                fontSize: 12, fontWeight: 500, cursor: "pointer",
                transition: "all 0.2s", fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { if (timeframe !== tf) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { if (timeframe !== tf) e.currentTarget.style.color = "#8e8e93"; }}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart container — fills remaining space */}
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <Chart ticker={selected} timeframe={timeframe} key={`${selected}-${timeframe}`} />
        </div>
      </div>
    </main>
  );
}