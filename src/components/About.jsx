import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-deep)", paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="gradient-text" style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem" }}>About Beacon</h1>
          <section className="glass-effect" style={{ padding: "3rem", borderRadius: "24px", lineHeight: "1.8", color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: "1.5rem", color: "var(--text-primary)", fontSize: "1.1rem" }}>
              Beacon is a financial platform designed to give investors clear market insights.
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              We built Beacon to cut through the noise of the stock market. Existing tools are often either too basic or crowded with clutter. We wanted a fast and simple way to see what is happening in the global markets, combining live data and great charting inside a fast web interface.
            </p>
            <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>Reliable Data</h2>
            <p>
              We pull our live quotes directly from Finnhub and Yahoo Finance so your metrics are always accurate.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
