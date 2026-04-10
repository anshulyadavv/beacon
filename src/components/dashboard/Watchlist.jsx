import React, { useState, useEffect } from "react";
import { Activity, LogOut, User as UserIcon, X, Check, Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStockData } from "../../hooks/useStockData";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Enhanced Watchlist Row with Edit Mode support.
 */
function WatchlistRow({ 
  ticker, livePrice, isActive, isEditing, isSelected, 
  onSelect, onToggleSelect 
}) {
  const { profile, loading } = useStockData(ticker);
  const isUp = livePrice ? livePrice.changePct >= 0 : true;

  return (
    <div
      style={{
        display: "flex", alignItems: "center",
        padding: "9px 12px", borderRadius: 12, cursor: "pointer",
        marginBottom: 2, transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
        position: "relative",
        overflow: "hidden"
      }}
      onClick={() => isEditing ? onToggleSelect(ticker) : onSelect(ticker)}
      onMouseEnter={(e) => {
        if (!isActive && !isEditing) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        if (!isActive && !isEditing) e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Active bar */}
      {isActive && !isEditing && (
        <div style={{
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          width: 3, height: 20, borderRadius: 3, background: "var(--accent-blue)",
        }} />
      )}

      {/* iOS Style Selection Circle */}
      <div style={{
        width: isEditing ? 24 : 0,
        opacity: isEditing ? 1 : 0,
        marginRight: isEditing ? 12 : 0,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          border: isSelected ? "none" : "2px solid rgba(255,255,255,0.15)",
          background: isSelected ? "var(--error)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s"
        }}>
          {isSelected && <Check size={12} color="white" strokeWidth={4} />}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, transform: isEditing ? "translateX(0)" : "translateX(0)", transition: "transform 0.3s" }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: isActive ? "#fff" : "#e5e5ea" }}>
          {ticker}
        </div>
        <div style={{
          fontSize: 10, color: "var(--text-secondary)", marginTop: 1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {loading ? "Loading..." : (profile?.name ?? "—")}
        </div>
      </div>

      {!isEditing && (
        <div style={{ textAlign: "right", marginLeft: 8, flexShrink: 0, minWidth: 64 }}>
          {livePrice ? (
            <>
              <div style={{ fontWeight: 500, fontSize: 13, fontVariantNumeric: "tabular-nums", color: "#e5e5ea" }}>
                ${livePrice.price.toFixed(2)}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, marginTop: 1, color: isUp ? "var(--success)" : "var(--error)" }}>
                {isUp ? "+" : ""}{livePrice.changePct.toFixed(2)}%
              </div>
            </>
          ) : (
            <div style={{ opacity: 0.2 }}>—</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Watchlist({ 
  user, logout, selected, prices, watchlist, onSelect, onRemove, onOpenSettings
}) {
  const [marketOpen, setMarketOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setSelectedItems(new Set());
  };

  const toggleSelect = (ticker) => {
    const next = new Set(selectedItems);
    if (next.has(ticker)) next.delete(ticker);
    else next.add(ticker);
    setSelectedItems(next);
  };

  const handleMassDelete = () => {
    selectedItems.forEach(ticker => onRemove(ticker));
    setIsEditing(false);
    setSelectedItems(new Set());
  };

  useEffect(() => {
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
      padding: "16px 12px",
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden",
      borderRight: "1px solid var(--border-subtle)",
      boxSizing: "border-box",
      background: "var(--bg-deep)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, flexShrink: 0, paddingLeft: 4 }}>
        <Activity size={20} color="var(--accent-blue)" />
        <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "-0.03em", textTransform: "uppercase" }}>Beacon</span>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 8, paddingLeft: 4, paddingRight: 4
      }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", fontWeight: 700 }}>
          Watchlist
        </div>
        <button 
          onClick={toggleEdit}
          style={{
            background: isEditing ? "rgba(255,255,255,0.1)" : "transparent",
            border: "none", color: isEditing ? "white" : "var(--accent-blue)",
            fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
            padding: "4px 8px", borderRadius: "6px", cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0, paddingRight: isEditing ? 0 : 2 }}>
        {watchlist.length === 0 && (
          <div style={{ fontSize: 12, color: "var(--text-secondary)", padding: "16px 4px", lineHeight: 1.6 }}>
            Search and add stocks to get started.
          </div>
        )}
        {watchlist.map((ticker) => (
          <WatchlistRow
            key={ticker}
            ticker={ticker}
            livePrice={prices[ticker]}
            isActive={selected === ticker}
            isEditing={isEditing}
            isSelected={selectedItems.has(ticker)}
            onSelect={onSelect}
            onToggleSelect={toggleSelect}
          />
        ))}
      </div>

      <AnimatePresence>
        {isEditing && selectedItems.size > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{
              padding: "12px", background: "var(--error)", borderRadius: "12px",
              marginTop: "12px", color: "white", textAlign: "center", cursor: "pointer",
              fontWeight: 700, fontSize: "12px", display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px", boxShadow: "0 10px 20px rgba(255,69,58,0.2)"
            }}
            onClick={handleMassDelete}
          >
            <Trash2 size={14} /> Remove {selectedItems.size} {selectedItems.size === 1 ? "Stock" : "Stocks"}
          </motion.div>
        )}
      </AnimatePresence>

      {!isEditing && (
        <>
          {/* User & Logout */}
          <div style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "12px",
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem"
          }}>
            <div 
              onClick={onOpenSettings}
              style={{ 
                display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0,
                cursor: "pointer", padding: "4px 8px 4px 0", borderRadius: "8px",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ 
                width: "32px", height: "32px", borderRadius: "50%", 
                background: "var(--accent-blue)", display: "flex", 
                alignItems: "center", justifyContent: "center", flexShrink: 0 
              }}>
                <UserIcon size={16} color="white" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.user_metadata?.full_name || user?.name || "User"}
                </p>
                <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.email || "Signed In"}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                background: "var(--bg-surface)", border: "none", borderRadius: "8px",
                width: "32px", height: "32px", display: "flex", 
                alignItems: "center", justifyContent: "center", cursor: "pointer",
                transition: "background 0.2s"
              }}
              title="Sign Out"
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,69,58,0.1)"}
              onMouseOut={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
            >
              <LogOut size={16} color="var(--error)" />
            </button>
          </div>

          {/* Market status */}
          <div style={{
            flexShrink: 0, marginTop: "12px", padding: "12px",
            borderRadius: 12, background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: marketOpen ? "var(--success)" : "var(--error)",
                boxShadow: `0 0 8px ${marketOpen ? "rgba(48, 209, 88, 0.4)" : "rgba(255, 69, 58, 0.4)"}`,
              }} />
              <span style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 600 }}>
                {marketOpen ? "Market Open" : "Market Closed"}
              </span>
            </div>
            <div style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 500 }}>Global Markets · Real-time</div>
          </div>
        </>
      )}
    </aside>
  );
}