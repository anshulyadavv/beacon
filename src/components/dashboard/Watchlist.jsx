import { STOCKS } from "../../data/stocks";

export default function Watchlist({ selected, prices, onSelect }) {
  return (
    <aside style={{
      padding: "20px 16px",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      borderRight: "1px solid #242426",
      boxSizing: "border-box",
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexShrink: 0 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>Beacon</span>
      </div>

      {/* Label */}
      <div style={{
        fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em",
        color: "#8e8e93", fontWeight: 600, marginBottom: 8, flexShrink: 0,
      }}>
        Watchlist
      </div>

      {/* Stock rows */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {Object.entries(STOCKS).map(([ticker, stock]) => {
          const live = prices[ticker];
          const isUp = live.changePct >= 0;
          const isActive = selected === ticker;

          return (
            <div
              key={ticker}
              onClick={() => onSelect(ticker)}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 8px", borderRadius: 10, cursor: "pointer",
                marginBottom: 2, transition: "background 0.15s",
                background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(30,30,33,0.6)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{ticker}</div>
                <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>{stock.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 500, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
                  ${live.price.toFixed(2)}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 500, marginTop: 2,
                  color: isUp ? "#30d158" : "#ff453a", transition: "color 0.3s",
                }}>
                  {isUp ? "+" : ""}{live.changePct.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Status */}
      <div style={{
        flexShrink: 0, marginTop: 12, padding: "12px 14px",
        borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid #242426",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
            background: "#30d158", boxShadow: "0 0 6px #30d158",
          }} />
          <span style={{ fontSize: 12, color: "#8e8e93" }}>Market Open</span>
        </div>
        <div style={{ fontSize: 11, color: "#555" }}>NYSE · NASDAQ · Live</div>
      </div>
    </aside>
  );
}