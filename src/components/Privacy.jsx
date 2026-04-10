import React from "react";
import { motion } from "framer-motion";

/**
 * Privacy Policy
 * Standardized with Beacon premium design system.
 */
export default function Privacy() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-deep)", paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, marginBottom: "2rem" }}>
            Privacy Policy
          </h1>
          <section className="glass-effect" style={{ padding: "3rem", borderRadius: "24px", lineHeight: "1.8", color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: "1.5rem", color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 500 }}>
              Your data privacy is fundamental to the architecture of Beacon.
            </p>
            
            <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", marginTop: "2rem", marginBottom: "1rem" }}>1. Local Storage First</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              Beacon is designed with a "Local First" approach. Your stock watchlist and preferences are stored directly on your browser via secure cookies. We do not transmit your personal watchlist data to our servers.
            </p>

            <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", marginTop: "2rem", marginBottom: "1rem" }}>2. Data Collection</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              We do not require users to provide identification or sensitive financial information. Any authentication data is used solely to facilitate session persistence.
            </p>

            <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", marginTop: "2rem", marginBottom: "1rem" }}>3. External Data Feeds</h2>
            <p>
              We integrate third-party APIs (Yahoo Finance, Finnhub) to provide real-time market insights. These external services may receive anonymized data requests to fulfill your charting needs.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
