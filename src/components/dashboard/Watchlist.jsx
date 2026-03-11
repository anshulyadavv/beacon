import { STOCK_UNIVERSE } from "../../data/stocks";

export default function Watchlist({ selected, prices, watchlist, onSelect, onRemove }) {
  return (
    <aside style={{
      padding: "20px 14px",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      borderRight: "1px solid #1c1c1e",
      boxSizing: "border-box",
      background: "#0b0b0c",
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 22, flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.03em", color: "#fff" }}>Beacon</span>
      </div>

      {/* Section label */}
      <div style={{
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
        color: "#48484a", fontWeight: 700, marginBottom: 6, flexShrink: 0, paddingLeft: 4,
      }}>
        Watchlist
      </div>

      {/* Watchlist rows */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {watchlist.length === 0 && (
          <div style={{ fontSize: 12, color: "#48484a", padding: "16px 4px", lineHeight: 1.5 }}>
            Search and add stocks to your watchlist.
          </div>
        )}
        {watchlist.map((ticker) => {
          const stock = STOCK_UNIVERSE[ticker];
          const live = prices[ticker];
          if (!stock || !live) return null;
          const isUp = live.changePct >= 0;
          const isActive = selected === ticker;

          return (
            <div
              key={ticker}
              style={{
                display: "flex", alignItems: "center",
                padding: "9px 6px", borderRadius: 10, cursor: "pointer",
                marginBottom: 1, transition: "background 0.15s",
                background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                position: "relative",
              }}
              onClick={() => onSelect(ticker)}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.querySelector(".remove-btn").style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
                e.currentTarget.querySelector(".remove-btn").style.opacity = "0";
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <div style={{
                  position: "absolute", left: -2, top: "50%", transform: "translateY(-50%)",
                  width: 2, height: 18, borderRadius: 2, background: "#fff",
                }} />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: isActive ? "#fff" : "#e5e5ea" }}>
                  {ticker}
                </div>
                <div style={{ fontSize: 11, color: "#48484a", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {stock.name}
                </div>
              </div>

              <div style={{ textAlign: "right", marginLeft: 8, flexShrink: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13, fontVariantNumeric: "tabular-nums", color: "#e5e5ea" }}>
                  ${live.price.toFixed(2)}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 500, marginTop: 1,
                  color: isUp ? "#30d158" : "#ff453a",
                }}>
                  {isUp ? "+" : ""}{live.changePct.toFixed(2)}%
                </div>
              </div>

              {/* Remove button — appears on hover */}
              <button
                className="remove-btn"
                onClick={(e) => { e.stopPropagation(); onRemove(ticker); }}
                style={{
                  position: "absolute", right: -2, top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,69,58,0.15)", border: "none", borderRadius: 6,
                  width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", opacity: 0, transition: "opacity 0.15s",
                  padding: 0,
                }}
                title="Remove from watchlist"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="#ff453a" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Market Status */}
      <div style={{
        flexShrink: 0, marginTop: 12, padding: "10px 12px",
        borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid #1c1c1e",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
            background: "#30d158", boxShadow: "0 0 5px #30d158",
          }} />
          <span style={{ fontSize: 11, color: "#8e8e93", fontWeight: 500 }}>Market Open</span>
        </div>
        <div style={{ fontSize: 10, color: "#48484a", letterSpacing: "0.02em" }}>NYSE · NASDAQ · Live</div>
      </div>
    </aside>
  );
}