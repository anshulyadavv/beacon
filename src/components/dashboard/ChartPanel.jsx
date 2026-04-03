import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { TIMEFRAMES } from "../../data/stocks";
import { useStockSearch } from "../../hooks/useStockSearch";
import { useStockData } from "../../hooks/useStockData";
import Chart from "./Chart";

function ShareToast({ visible }) {
  return (
    <div style={{
      position: "absolute", top: 46, right: 0,
      background: "rgba(28,28,30,0.97)", border: "1px solid #2c2c2e",
      borderRadius: 10, padding: "9px 14px",
      fontSize: 12, color: "#8e8e93",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(-4px)",
      transition: "opacity 0.18s, transform 0.18s",
      pointerEvents: "none", whiteSpace: "nowrap",
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      zIndex: 200,
    }}>
      <span style={{ color: "#30d158", marginRight: 6 }}>✓</span>
      Link copied to clipboard
    </div>
  );
}

export default function ChartPanel({
  selected, timeframe, livePrice, prices,
  watchlist, isInWatchlist,
  onSelect, onTimeframe,
  onAddToWatchlist, onRemoveFromWatchlist,
}) {
  const [query,     setQuery]     = useState("");
  const [focused,   setFocused]   = useState(false);
  const [showToast, setShowToast] = useState(false);
  const inputRef                  = useRef(null);
  const containerRef              = useRef(null);

  const { results, loading: searching } = useStockSearch(query);
  const { profile } = useStockData(selected);
  const showDropdown = focused && (query.trim().length > 0);
  const isUp = livePrice ? livePrice.changePct >= 0 : true;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ⌘K / Escape
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
      if (e.key === "Escape") { setFocused(false); setQuery(""); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSelect = (ticker) => {
    onSelect(ticker);
    setQuery("");
    setFocused(false);
  };

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${selected}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  }, [selected]);

  return (
    <main style={{
      padding: "18px 22px",
      display: "flex", flexDirection: "column", gap: 12,
      height: "100%", overflow: "hidden",
      borderRight: "1px solid #1c1c1e",
      boxSizing: "border-box",
      background: "#0b0b0c",
    }}>

      {/* ── Top bar ── */}
      <div ref={containerRef} style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>

        {/* Search */}
        <div style={{ position: "relative", flex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center",
            background: focused ? "rgba(28,28,30,1)" : "rgba(20,20,22,0.5)",
            border: `1px solid ${focused ? "rgba(255,255,255,0.10)" : "#1c1c1e"}`,
            borderRadius: showDropdown ? "12px 12px 0 0" : 12,
            padding: "9px 14px",
            transition: "background 0.2s, border-color 0.2s",
          }}>
            <svg viewBox="0 0 24 24" style={{ fill: "#48484a", marginRight: 9, width: 13, height: 13, flexShrink: 0 }}>
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search any stock, ETF, company…"
              style={{
                background: "transparent", border: "none",
                color: "#fff", fontFamily: "inherit",
                fontSize: 13, width: "100%", outline: "none",
              }}
            />
            {query ? (
              <button onClick={() => setQuery("")} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#48484a", fontSize: 18, padding: 0, lineHeight: 1, flexShrink: 0,
              }}>×</button>
            ) : (
              <kbd style={{
                color: "#48484a", fontSize: 10,
                background: "rgba(255,255,255,0.05)", padding: "2px 6px",
                borderRadius: 5, flexShrink: 0, fontFamily: "inherit",
                border: "1px solid #2c2c2e",
              }}>⌘K</kbd>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
              background: "rgba(15,15,17,0.99)", backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.07)", borderTop: "none",
              borderRadius: "0 0 14px 14px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}>
              {searching && (
                <div style={{ padding: "12px 14px", fontSize: 12, color: "#48484a" }}>
                  Searching…
                </div>
              )}

              {!searching && results.length === 0 && query.trim().length > 0 && (
                <div style={{ padding: "12px 14px", fontSize: 12, color: "#48484a" }}>
                  No results for "{query}"
                </div>
              )}

              {results.map((r) => {
                const lp      = prices[r.ticker];
                const up      = lp ? lp.changePct >= 0 : true;
                const inWatch = watchlist?.includes(r.ticker);

                return (
                  <div
                    key={r.ticker}
                    style={{
                      display: "flex", alignItems: "center",
                      padding: "9px 14px", cursor: "pointer",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Info */}
                    <div style={{ flex: 1 }} onClick={() => handleSelect(r.ticker)}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>{r.ticker}</span>
                        <span style={{ fontSize: 10, color: "#48484a" }}>{r.exchange}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 1 }}>{r.name}</div>
                    </div>

                    {/* Live price (if already streaming) */}
                    {lp && (
                      <div style={{ textAlign: "right", marginRight: 12, flexShrink: 0 }}
                        onClick={() => handleSelect(r.ticker)}>
                        <div style={{ fontSize: 12, fontWeight: 500, fontVariantNumeric: "tabular-nums", color: "#e5e5ea" }}>
                          ${lp.price.toFixed(2)}
                        </div>
                        <div style={{ fontSize: 11, color: up ? "#30d158" : "#ff453a" }}>
                          {up ? "+" : ""}{lp.changePct.toFixed(2)}%
                        </div>
                      </div>
                    )}

                    {/* Watch toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); inWatch ? onRemoveFromWatchlist(r.ticker) : onAddToWatchlist(r.ticker); }}
                      style={{
                        background: inWatch ? "rgba(255,69,58,0.10)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${inWatch ? "rgba(255,69,58,0.25)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 7, padding: "4px 10px",
                        fontSize: 11, fontWeight: 500, cursor: "pointer",
                        color: inWatch ? "#ff453a" : "#8e8e93",
                        transition: "all 0.15s", fontFamily: "inherit", flexShrink: 0,
                      }}
                    >
                      {inWatch ? "Remove" : "+ Watch"}
                    </button>
                  </div>
                );
              })}

              {!searching && results.length > 0 && (
                <div style={{ fontSize: 10, color: "#48484a", padding: "7px 14px", borderTop: "1px solid #1c1c1e" }}>
                  Click to view · "+ Watch" to add to watchlist
                </div>
              )}
            </div>
          )}
        </div>

        {/* Share */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={handleShare}
            title={`Share ${selected}`}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #1c1c1e", borderRadius: 12,
              width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "#2c2c2e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "#1c1c1e"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>
          <ShareToast visible={showToast} />
        </div>
      </div>

      {/* ── Stock header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, color: "#fff" }}>
            {profile?.name ?? selected}
          </h1>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#48484a",
            background: "rgba(255,255,255,0.04)", padding: "3px 7px",
            borderRadius: 6, letterSpacing: "0.06em", border: "1px solid #1c1c1e",
          }}>
            {selected}
          </span>
          {profile?.exchange && (
            <span style={{ fontSize: 11, color: "#48484a" }}>· {profile.exchange}</span>
          )}
        </div>

        {livePrice ? (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", color: "#fff" }}>
              ${livePrice.price.toFixed(2)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: isUp ? "#30d158" : "#ff453a", marginTop: 1 }}>
              {isUp ? "+" : ""}{livePrice.change.toFixed(2)} ({isUp ? "+" : ""}{livePrice.changePct.toFixed(2)}%)
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "#48484a" }}>Loading…</div>
        )}
      </div>

      {/* ── Chart card ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        background: "rgba(17,17,19,0.7)", backdropFilter: "blur(20px)",
        border: "1px solid #1c1c1e", borderRadius: 16,
        padding: "14px 16px", minHeight: 0, overflow: "hidden",
      }}>
        {/* Timeframe + watchlist toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 1 }}>
            {TIMEFRAMES.map((tf) => (
              <button key={tf} onClick={() => onTimeframe(tf)} style={{
                background: timeframe === tf ? "rgba(255,255,255,0.08)" : "transparent",
                border: "none", color: timeframe === tf ? "#e5e5ea" : "#48484a",
                padding: "5px 10px", borderRadius: 7, fontSize: 12, fontWeight: 500,
                cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
              }}
                onMouseEnter={(e) => { if (timeframe !== tf) e.currentTarget.style.color = "#8e8e93"; }}
                onMouseLeave={(e) => { if (timeframe !== tf) e.currentTarget.style.color = "#48484a"; }}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => isInWatchlist ? onRemoveFromWatchlist(selected) : onAddToWatchlist(selected)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "transparent", border: "none", borderRadius: 7, padding: "4px 10px",
              fontSize: 11, fontWeight: 500, cursor: "pointer",
              color: isInWatchlist ? "#ff453a" : "#48484a",
              transition: "color 0.15s", fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = isInWatchlist ? "#ff6961" : "#8e8e93"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isInWatchlist ? "#ff453a" : "#48484a"; }}
          >
            {isInWatchlist ? (
              <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>Remove</>
            ) : (
              <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>+ Watchlist</>
            )}
          </button>
        </div>

        {/* Chart */}
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <Chart ticker={selected} timeframe={timeframe} key={`${selected}-${timeframe}`} />
        </div>
      </div>
    </main>
  );
}