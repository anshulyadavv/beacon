import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, BarChart3, Zap, Shield, ChevronRight } from "lucide-react";

const GithubIcon = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import { useAuth } from "../hooks/useAuth.jsx";
import { useWindowSize } from "../hooks/useWindowSize.js";
import GravityParticles from "./GravityParticles";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-effect"
    style={{
      padding: "2rem",
      borderRadius: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      textAlign: "left"
    }}
  >
    <div style={{ 
      background: "rgba(0, 113, 227, 0.1)", 
      width: "fit-content", 
      padding: "0.75rem", 
      borderRadius: "12px",
      color: "var(--accent-blue)"
    }}>
      <Icon size={24} />
    </div>
    <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>{title}</h3>
    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.95rem" }}>
      {description}
    </p>
  </motion.div>
);

export default function LandingPage() {
  const { user } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width <= 1024;
  const isSmall = width <= 640;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-deep)" }}>
      <GravityParticles />
      {/* Hero Section */}
      <section style={{
        paddingTop: isMobile ? "120px" : "160px",
        paddingBottom: isMobile ? "60px" : "100px",
        textAlign: "center",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Background Gradients */}
        <div style={{
          position: "absolute",
          top: "-10%",
          left: "20%",
          width: "60%",
          height: "60%",
          background: "radial-gradient(circle, rgba(0, 113, 227, 0.15) 0%, transparent 70%)",
          zIndex: 0,
          filter: "blur(100px)"
        }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="gradient-text" style={{ 
              fontSize: isSmall ? "2.5rem" : "clamp(3rem, 8.5vw, 6rem)", 
              fontWeight: 800, 
              letterSpacing: "-0.04em",
              lineHeight: "1.02",
              marginBottom: "1.5rem"
            }}>
              Track the market <br /> with exact clarity
            </h1>
            <p style={{ 
              color: "var(--text-secondary)", 
              fontSize: isSmall ? "1rem" : "clamp(1.1rem, 2.2vw, 1.4rem)", 
              maxWidth: "640px", 
              margin: "0 auto 2.5rem",
              lineHeight: "1.6"
            }}>
              Follow your favorite stocks with live data and interactive charts. It is everything you need in one simple dashboard.
            </p>

            <div style={{  
              display: "flex", 
              gap: "1rem", 
              justifyContent: "center",
              flexDirection: isSmall ? "column" : "row",
              alignItems: "center"
            }}>
              <Link to={user ? "/dashboard" : "/login"} style={{ textDecoration: "none", width: isSmall ? "100%" : "auto" }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: "var(--accent-blue)",
                    color: "white",
                    padding: isSmall ? "0.9rem 2rem" : "1.1rem 2.5rem",
                    borderRadius: "99px",
                    fontSize: isSmall ? "1rem" : "1.1rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    width: isSmall ? "100%" : "auto",
                    boxShadow: "0 10px 20px rgba(0, 113, 227, 0.3)"
                  }}
                >
                  {user ? "Go to Dashboard" : "Get Started"} <TrendingUp size={20} />
                </motion.button>
              </Link>
              
              <Link to="/about" style={{ textDecoration: "none", width: isSmall ? "100%" : "auto" }}>
                <motion.button
                  whileHover={{ background: "rgba(255,255,255,0.08)" }}
                  style={{
                    background: "transparent",
                    color: "var(--text-primary)",
                    padding: isSmall ? "0.9rem 2rem" : "1.1rem 2.5rem",
                    borderRadius: "99px",
                    fontSize: isSmall ? "1rem" : "1.1rem",
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    width: isSmall ? "100%" : "auto"
                  }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Floating UI Viewport Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 15 }}
            className="antigravity-float"
            style={{ marginTop: "60px", position: "relative" }}
          >
            <div 
              className="glass-effect"
              style={{
                maxWidth: "840px",
                margin: "0 auto",
                borderRadius: "32px",
                overflow: "hidden",
                boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)"
              }}
            >
               <img 
                 src="/dashboard-preview.png" 
                 alt="Beacon Dashboard"
                 style={{
                   width: "100%",
                   height: "auto",
                   display: "block",
                   opacity: 0.9,
                   transition: "opacity 0.5s ease"
                 }}
                 onLoad={(e) => e.currentTarget.style.opacity = 1}
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: isMobile ? "60px 1.5rem" : "100px 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "2.5rem" : "4rem" }}>
          <h2 style={{ fontSize: isSmall ? "1.8rem" : "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginBottom: "1rem" }}>
            Tools you actually need
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: isSmall ? "0.95rem" : "1.1rem" }}>
            Everything required to navigate the markets with confidence.
          </p>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "2rem" 
        }}>
          <FeatureCard 
            icon={Zap} 
            title="Live Market Data" 
            description="Live market feeds designed to help you make decisions fast." 
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Interactive Charting" 
            description="TradingView charts with complete history and technical indicators." 
          />
          <FeatureCard 
            icon={Shield} 
            title="Company Insights" 
            description="Clear company fundamentals so you know exactly what you are investing into." 
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: isMobile ? "60px 1.5rem 40px" : "80px 2.5rem 40px", 
        borderTop: "1px solid rgba(255,255,255,0.06)",
        marginTop: "60px",
        background: "rgba(0,0,0,0.4)"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          display: "flex", 
          flexDirection: isSmall ? "column" : "row",
          justifyContent: isSmall ? "center" : "space-between", 
          gap: "3rem", 
          alignItems: isSmall ? "center" : "flex-start",
          textAlign: isSmall ? "center" : "left"
        }}>
          <div>
             <div style={{ 
               display: "flex", 
               alignItems: "center", 
               justifyContent: isSmall ? "center" : "flex-start",
               gap: "0.6rem", 
               marginBottom: "1.25rem" 
             }}>
                <TrendingUp size={28} color="var(--accent-blue)" />
                <span style={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.6px" }}>BEACON</span>
             </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "320px", margin: isSmall ? "0 auto" : "0", marginBottom: "1.5rem" }}>
                A trading dashboard built for modern stock analysis.
              </p>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "99px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <GithubIcon size={18} /> Star this repo on GitHub
              </a>
          </div>

          <div style={{ 
            display: "flex", 
            gap: isSmall ? "2.5rem" : "5rem",
            justifyContent: "center"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <h4 style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 700 }}>Platform</h4>
              <Link to="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}>Dashboard</Link>
              <Link to="/about" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}>About Us</Link>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <h4 style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 700 }}>Legal</h4>
              <Link to="/privacy" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}>Terms of Use</Link>
            </div>
          </div>
        </div>

        <div style={{ 
          maxWidth: "1200px", 
          margin: "50px auto 0", 
          paddingTop: "25px", 
          borderTop: "1px solid rgba(255,255,255,0.06)", 
          textAlign: "center" 
        }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            © 2026 Beacon. All rights reserved. Data provided by Finnhub and Yahoo Finance.
          </p>
        </div>
      </footer>
    </div>
  );
}
