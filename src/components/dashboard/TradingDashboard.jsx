import React from "react";
import { useState, useEffect } from "react";
import { DEFAULT_WATCHLIST } from "../../data/stocks";
import { useLivePrices } from "../../hooks/useLivePrices";
import Watchlist from "./Watchlist";
import ChartPanel from "./ChartPanel";
import Fundamentals from "./Fundamentals";

import Cookies from "js-cookie";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useWindowSize } from "../../hooks/useWindowSize";
import { LogOut, User as UserIcon, Menu, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WATCHLIST_COOKIE = "beacon_watchlist";

export default function TradingDashboard() {
  const { user, logout } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width <= 1024;
  
  const [selected,  setSelected]  = useState("AAPL");
  const [timeframe, setTimeframe] = useState("1D");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFundamentals, setShowFundamentals] = useState(false);
  
  // Load initial watchlist from cookie or default
  const [watchlist, setWatchlist] = useState(() => {
    const saved = Cookies.get(WATCHLIST_COOKIE);
    return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
  });

  // Save watchlist to cookie whenever it changes
  useEffect(() => {
    Cookies.set(WATCHLIST_COOKIE, JSON.stringify(watchlist), { expires: 30 });
  }, [watchlist]);

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
    <div className="dashboard-grid">
      {/* Mobile Top Bar */}
      {isMobile && (
        <div style={{
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "#0b0b0c",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
              title="Open sidebar"
              style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: "4px" }}
            >
              <Menu size={24} />
            </button>
            <span style={{ fontWeight: 800, fontSize: "1rem" }}>BEACON</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button 
              onClick={() => setShowFundamentals(!showFundamentals)}
              aria-label="Toggle company information"
              title="Toggle company information"
              style={{ 
                background: "none", 
                border: "none", 
                color: showFundamentals ? "var(--accent-blue)" : "white", 
                cursor: "pointer", 
                padding: "4px" 
              }}
            >
              <Info size={24} />
            </button>
            <button 
              onClick={logout} 
              aria-label="Log out"
              title="Log out"
              style={{ background: "none", border: "none", color: "#ff453a", cursor: "pointer", padding: "4px" }}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Watchlist Sidebar (Desktop) or Drawer (Mobile) */}
      <AnimatePresence>
        {(!isMobile || isSidebarOpen) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={isMobile ? {
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "280px",
              zIndex: 1000,
              boxShadow: "20px 0 50px rgba(0,0,0,0.5)"
            } : { gridColumn: 1 }}
          >
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
                title="Close sidebar"
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "-40px",
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  color: "white",
                  padding: "8px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)"
                }}
              >
                <X size={20} />
              </button>
            )}
            <Watchlist
              user={user}
              logout={logout}
              selected={selected}
              prices={prices}
              watchlist={watchlist}
              onSelect={(t) => {
                setSelected(t);
                setTimeframe("1D");
                if (isMobile) setIsSidebarOpen(false);
              }}
              onRemove={removeFromWatchlist}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chart Panel */}
      <div style={{ 
        gridColumn: isMobile ? 1 : 2, 
        overflow: isMobile ? "visible" : "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 0
      }}>
        <ChartPanel
          selected={selected}
          timeframe={timeframe}
          livePrice={prices[selected]}
          prices={prices}
          watchlist={watchlist}
          isInWatchlist={isInWatchlist(selected)}
          onSelect={(ticker) => {
            setSelected(ticker);
            setTimeframe("1D");
            setWatchlist((w) => w); 
          }}
          onTimeframe={setTimeframe}
          onAddToWatchlist={addToWatchlist}
          onRemoveFromWatchlist={removeFromWatchlist}
          isMobile={isMobile}
        />

        
        {/* Fundamentals below chart on mobile */}
        {isMobile && showFundamentals && (
          <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
             <Fundamentals
              selected={selected}
              livePrice={prices[selected]}
              isInWatchlist={isInWatchlist(selected)}
              onAdd={addToWatchlist}
              onRemove={removeFromWatchlist}
              isMobile={true}
            />
          </div>
        )}
      </div>

      {/* Fundamentals Sidebar (Desktop only) */}
      {!isMobile && (
        <Fundamentals
          selected={selected}
          livePrice={prices[selected]}
          isInWatchlist={isInWatchlist(selected)}
          onAdd={addToWatchlist}
          onRemove={removeFromWatchlist}
        />
      )}
    </div>
  );
}