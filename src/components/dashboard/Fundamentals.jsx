import { STOCK_UNIVERSE } from "../../data/stocks";

export default function Fundamentals({ selected, livePrice, isInWatchlist, onAdd, onRemove }) {
  const stock = STOCK_UNIVERSE[selected];
  if (!stock) return null;

  const isUp = livePrice ? livePrice.changePct >= 0 : true;

  const rows = [
    ["Market Cap",  stock.marketCap],
    ["P/E Ratio",   stock.peRatio],
    ["EPS (TTM)",   stock.eps],
    ["Revenue",     stock.revenue],
    ["Div Yield",   stock.divYield],
    ["Beta",        stock.beta],
    ["52W High",    stock.high52],
    ["52W Low",     stock.low52],
  ];

  return (
    <aside style={{
      padding: "18px 14px",
      display: "flex", flexDirection: "column", gap: 12,
      height: "100%", overflow: "hidden",
      boxSizing: "border-box",
      background: "#0b0b0c",
    }}>

      {/* Section label */}
      <div style={{
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
        color: "#48484a", fontWeight: 700, flexShrink: 0, paddingLeft: 2,
      }}>
        Fundamentals
      </div>

      {/* Fundamentals table */}
      <div style={{
        background: "rgba(17,17,19,0.6)", border: "1px solid #1c1c1e",
        borderRadius: 14, padding: "2px 14px", flexShrink: 0,
      }}>
        {rows.map(([label, value], i) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "9px 0",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <span style={{ color: "#48484a", fontSize: 12 }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "#e5e5ea" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Live price snapshot */}
      {livePrice && (
        <div style={{
          background: "rgba(17,17,19,0.6)", border: "1px solid #1c1c1e",
          borderRadius: 14, padding: "12px 14px", flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#48484a", fontWeight: 700, marginBottom: 8 }}>
            Live
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", color: "#fff" }}>
              ${livePrice.price.toFixed(2)}
            </span>
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: isUp ? "#30d158" : "#ff453a",
              background: isUp ? "rgba(48,209,88,0.1)" : "rgba(255,69,58,0.1)",
              padding: "3px 8px", borderRadius: 6,
            }}>
              {isUp ? "+" : ""}{livePrice.changePct.toFixed(2)}%
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#48484a", marginTop: 4 }}>
            {isUp ? "+" : ""}{livePrice.change.toFixed(2)} today
          </div>
        </div>
      )}

      {/* About */}
      <div style={{
        background: "rgba(17,17,19,0.6)", border: "1px solid #1c1c1e",
        borderRadius: 14, padding: "12px 14px", flexShrink: 0,
      }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#48484a", fontWeight: 700, marginBottom: 6 }}>
          About
        </div>
        <div style={{ fontSize: 11, color: "#8e8e93", lineHeight: 1.65 }}>{stock.about}</div>
      </div>

      {/* Add / Remove watchlist CTA */}
      <button
        onClick={() => isInWatchlist ? onRemove(selected) : onAdd(selected)}
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "12px",
          borderRadius: 12,
          border: `1px solid ${isInWatchlist ? "rgba(255,69,58,0.3)" : "rgba(255,255,255,0.1)"}`,
          background: isInWatchlist ? "rgba(255,69,58,0.08)" : "rgba(255,255,255,0.04)",
          color: isInWatchlist ? "#ff453a" : "#8e8e93",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", transition: "all 0.18s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isInWatchlist ? "rgba(255,69,58,0.15)" : "rgba(255,255,255,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isInWatchlist ? "rgba(255,69,58,0.08)" : "rgba(255,255,255,0.04)";
        }}
      >
        {isInWatchlist ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Remove from Watchlist
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add to Watchlist
          </>
        )}
      </button>
    </aside>
  );
}