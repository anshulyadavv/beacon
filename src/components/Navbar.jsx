import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useWindowSize } from "../hooks/useWindowSize.js";

/**
 * Global Navigation:
 * Balanced for desktop and mobile.
 * Uses useWindowSize to dynamically adjust spacing and prevent overlaps.
 */
export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const { width } = useWindowSize();
  
  const isMobile = width <= 1024;
  const isTiny = width <= 430;

  return (
    <nav 
      className="glass-effect"
      style={{
        position: "fixed",
        top: isMobile ? "0.75rem" : "1.25rem",
        left: isMobile ? "0.75rem" : "2rem",
        right: isMobile ? "0.75rem" : "2rem",
        zIndex: 1000,
        padding: isMobile ? (isTiny ? "0.75rem 1rem" : "1rem 1.25rem") : "0.9rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: isMobile ? "16px" : "20px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Link 
        to="/" 
        aria-label="Beacon Home"
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: isTiny ? "0.35rem" : "0.5rem", 
          textDecoration: "none",
          color: "white",
          fontWeight: 800,
          fontSize: isTiny ? "1rem" : "1.2rem",
          letterSpacing: "-0.5px"
        }}
      >
        <Activity size={isTiny ? 20 : 24} color="var(--accent-blue)" />
        <span>BEACON</span>
      </Link>

      <div style={{ 
        display: "flex", 
        // Huge gap 2.5rem desktop → tight 0.75rem mobile
        gap: isMobile ? (isTiny ? "0.75rem" : "1rem") : "2.5rem", 
        alignItems: "center" 
      }}>
        <Link 
          to="/" 
          style={{ 
            textDecoration: "none", 
            color: location.pathname === "/" ? "white" : "var(--text-secondary)",
            fontSize: isTiny ? "0.85rem" : "0.95rem",
            fontWeight: 600,
            transition: "color 0.2s"
          }}
        >
          Home
        </Link>
        
        {!isTiny && (
          <Link 
            to="/about" 
            style={{ 
              textDecoration: "none", 
              color: location.pathname === "/about" ? "white" : "var(--text-secondary)",
              fontSize: "0.95rem",
              fontWeight: 600,
              transition: "color 0.2s"
            }}
          >
            About
          </Link>
        )}

        {user ? (
          <Link 
            to="/dashboard"
            aria-label="Dashboard"
            style={{
              background: "var(--accent-blue)",
              color: "white",
              padding: isTiny ? "0.4rem 0.8rem" : "0.6rem 1.25rem",
              borderRadius: "99px",
              textDecoration: "none",
              fontSize: isTiny ? "0.75rem" : "0.85rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(0, 113, 227, 0.2)"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <LayoutDashboard size={isTiny ? 14 : 16} />
            {isTiny ? "Dash" : "Dashboard"}
          </Link>
        ) : (
          <Link 
            to="/login"
            aria-label="Sign In"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: isTiny ? "0.85rem" : "0.95rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: isTiny ? "0.4rem 0.6rem" : "0.6rem 1rem",
              borderRadius: "12px",
              background: isTiny ? "rgba(255,255,255,0.05)" : "transparent",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseOut={(e) => e.currentTarget.style.background = isTiny ? "rgba(255,255,255,0.05)" : "transparent"}
          >
            <User size={isTiny ? 16 : 18} />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
