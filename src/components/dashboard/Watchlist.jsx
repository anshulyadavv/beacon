import React from "react";
import { useStockData } from "../../hooks/useStockData";

function WatchlistRow({ ticker, livePrice, isActive, onSelect, onRemove }) {
  const { profile, loading } = useStockData(ticker);
  const isUp = livePrice ? livePrice.changePct >= 0 : true;

  return (
    <div
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
        const btn = e.currentTarget.querySelector(".remove-btn");
        if (btn) btn.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
        const btn = e.currentTarget.querySelector(".remove-btn");
        if (btn) btn.style.opacity = "0";
      }}
    >
      {/* Active bar */}
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
        <div style={{
          fontSize: 11, color: "#48484a", marginTop: 1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {loading ? <Shimmer width={80} /> : (profile?.name ?? "—")}
        </div>
      </div>

      <div style={{ textAlign: "right", marginLeft: 8, flexShrink: 0, minWidth: 64 }}>
        {livePrice ? (
          <>
            <div style={{ fontWeight: 500, fontSize: 13, fontVariantNumeric: "tabular-nums", color: "#e5e5ea" }}>
              ${livePrice.price.toFixed(2)}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, marginTop: 1, color: isUp ? "#30d158" : "#ff453a" }}>
              {isUp ? "+" : ""}{livePrice.changePct.toFixed(2)}%
            </div>
          </>
        ) : (
          <>
            <Shimmer width={52} />
            <div style={{ marginTop: 3 }}><Shimmer width={36} /></div>
          </>
        )}
      </div>

      {/* Remove on hover */}
      <button
        className="remove-btn"
        onClick={(e) => { e.stopPropagation(); onRemove(ticker); }}
        style={{
          position: "absolute", right: -2, top: "50%", transform: "translateY(-50%)",
          background: "rgba(255,69,58,0.15)", border: "none", borderRadius: 6,
          width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", opacity: 0, transition: "opacity 0.15s", padding: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="#ff453a" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// Simple inline shimmer placeholder
function Shimmer({ width = 60, height = 10 }) {
  return (
    <span style={{
      display: "inline-block", width, height,
      borderRadius: 4, background: "rgba(255,255,255,0.06)",
      verticalAlign: "middle",
      animation: "shimmer 1.4s ease-in-out infinite",
    }} />
  );
}

export default function Watchlist({ selected, prices, watchlist, onSelect, onRemove }) {
  const [marketOpen, setMarketOpen] = React.useState(true);

  React.useEffect(() => {
    const checkMarket = () => {
      const nyTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
      const d = new Date(nyTime);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const time = hours * 100 + minutes;
      setMarketOpen(!isWeekend && time >= 930 && time < 1600);
    };
    checkMarket();
    const interval = setInterval(checkMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside style={{
      padding: "20px 14px",
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden",
      borderRight: "1px solid #1c1c1e",
      boxSizing: "border-box",
      background: "#0b0b0c",
    }}>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.9; }
        }
      `}</style>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 22, flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.03em" }}>Beacon</span>
      </div>

      <div style={{
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
        color: "#48484a", fontWeight: 700, marginBottom: 6, flexShrink: 0, paddingLeft: 4,
      }}>
        Watchlist
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {watchlist.length === 0 && (
          <div style={{ fontSize: 12, color: "#48484a", padding: "16px 4px", lineHeight: 1.6 }}>
            Search for stocks and add them to your watchlist.
          </div>
        )}
        {watchlist.map((ticker) => (
          <WatchlistRow
            key={ticker}
            ticker={ticker}
            livePrice={prices[ticker]}
            isActive={selected === ticker}
            onSelect={onSelect}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Market status */}
      <div style={{
        flexShrink: 0, marginTop: 12, padding: "10px 12px",
        borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid #1c1c1e",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
            background: marketOpen ? "#30d158" : "#ff453a",
            boxShadow: `0 0 5px ${marketOpen ? "#30d158" : "#ff453a"}`,
          }} />
          <span style={{ fontSize: 11, color: "#8e8e93", fontWeight: 500 }}>
            {marketOpen ? "Market Open" : "Market Closed"}
          </span>
        </div>
        <div style={{ fontSize: 10, color: "#48484a" }}>NYSE · NASDAQ · Live</div>
      </div>
    </aside>
  );
}