import React from "react";
import { useStockData } from "../../hooks/useStockData";

export default function Fundamentals({ selected, livePrice, isInWatchlist, onAdd, onRemove, isMobile }) {
  const { quote, profile, metrics, loading, error } = useStockData(selected);

  const displayPrice = livePrice ?? (quote
    ? { price: quote.price, change: quote.change, changePct: quote.changePct }
    : null);
  const isUp = displayPrice ? displayPrice.changePct >= 0 : true;

  const rows = [
    ["Market Cap",  profile?.marketCap],
    ["P/E Ratio",   metrics?.peRatio],
    ["EPS (TTM)",   metrics?.eps],
    ["52W High",    metrics?.high52],
    ["52W Low",     metrics?.low52],
    ["Div Yield",   metrics?.divYield],
    ["Beta",        metrics?.beta],
    ["Open",        quote?.open      ? `$${quote.open.toFixed(2)}`      : "—"],
    ["Prev Close",  quote?.prevClose ? `$${quote.prevClose.toFixed(2)}` : "—"],
    ["Day High",    quote?.high      ? `$${quote.high.toFixed(2)}`      : "—"],
    ["Day Low",     quote?.low       ? `$${quote.low.toFixed(2)}`       : "—"],
    ["Exchange",    profile?.exchange],
    ["Industry",    profile?.industry],
  ].filter(([, v]) => v && v !== "—" && v !== "$0.00" && v !== "undefined");

  return (
    <aside style={{
      padding: isMobile ? "0px" : "18px 14px",
      display: "flex", flexDirection: "column", gap: 10,
      height: isMobile ? "auto" : "100%", 
      overflow: isMobile ? "visible" : "hidden",
      boxSizing: "border-box",
      background: isMobile ? "transparent" : "#0b0b0c",
      borderLeft: isMobile ? "none" : "1px solid #1c1c1e",
    }}>


      <div style={{
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
        color: "#48484a", fontWeight: 700, flexShrink: 0, paddingLeft: 2,
      }}>
        Fundamentals
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "4px 0" }}>
            {[100, 80, 90, 70, 85].map((w, i) => (
              <div key={i} style={{
                height: 12, borderRadius: 6,
                width: `${w}%`,
                background: "rgba(255,255,255,0.06)",
                animation: "shimmer 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div style={{ fontSize: 12, color: "#ff453a", padding: "8px 2px" }}>
            Could not load data for {selected}
          </div>
        )}

        {/* Live price */}
        {displayPrice && (
          <div style={{
            background: "rgba(17,17,19,0.6)", border: "1px solid #1c1c1e",
            borderRadius: 14, padding: "12px 14px", flexShrink: 0,
          }}>
            <div style={{
              fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
              color: "#48484a", fontWeight: 700, marginBottom: 8,
            }}>Live</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{
                fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums", color: "#fff",
              }}>
                ${displayPrice.price.toFixed(2)}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: isUp ? "#30d158" : "#ff453a",
                background: isUp ? "rgba(48,209,88,0.1)" : "rgba(255,69,58,0.1)",
                padding: "3px 8px", borderRadius: 6,
              }}>
                {isUp ? "+" : ""}{displayPrice.changePct.toFixed(2)}%
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#48484a", marginTop: 4 }}>
              {isUp ? "+" : ""}{displayPrice.change.toFixed(2)} today
            </div>
          </div>
        )}

        {/* Stats table */}
        {rows.length > 0 && (
          <div style={{
            background: "rgba(17,17,19,0.6)", border: "1px solid #1c1c1e",
            borderRadius: 14, padding: "2px 14px", flexShrink: 0,
          }}>
            {rows.map(([label, value], i) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0",
                borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <span style={{ color: "#48484a", fontSize: 11 }}>{label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: "#e5e5ea",
                  fontVariantNumeric: "tabular-nums",
                  maxWidth: 130, textAlign: "right",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  marginLeft: 8,
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* About */}
        {profile?.about && (
          <div style={{
            background: "rgba(17,17,19,0.6)", border: "1px solid #1c1c1e",
            borderRadius: 14, padding: "12px 14px", flexShrink: 0,
          }}>
            <div style={{
              fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
              color: "#48484a", fontWeight: 700, marginBottom: 6,
            }}>About</div>
            <div style={{ fontSize: 11, color: "#8e8e93", lineHeight: 1.65 }}>
              {profile.about}
            </div>
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer"
                style={{
                  fontSize: 11, color: "#48484a", marginTop: 6,
                  display: "block", textDecoration: "none", transition: "color 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#8e8e93"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#48484a"}
              >
                {profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Add / Remove watchlist */}
      <button
        onClick={() => isInWatchlist ? onRemove(selected) : onAdd(selected)}
        style={{
          width: "100%", padding: "12px", borderRadius: 12, flexShrink: 0,
          border: `1px solid ${isInWatchlist ? "rgba(255,69,58,0.3)" : "rgba(255,255,255,0.1)"}`,
          background: isInWatchlist ? "rgba(255,69,58,0.08)" : "rgba(255,255,255,0.04)",
          color: isInWatchlist ? "#ff453a" : "#8e8e93",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", transition: "all 0.18s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isInWatchlist
            ? "rgba(255,69,58,0.15)" : "rgba(255,255,255,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isInWatchlist
            ? "rgba(255,69,58,0.08)" : "rgba(255,255,255,0.04)";
        }}
      >
        {isInWatchlist ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Remove from Watchlist
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add to Watchlist
          </>
        )}
      </button>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.9; }
        }
      `}</style>
    </aside>
  );
}