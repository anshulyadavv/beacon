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
              Beacon is a professional financial analytics platform designed to give every investor market-leading clarity.
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              We built Beacon because the market is filled with noise. We wanted a clean, fast, and simple way to see what's actually happening. Our mission is to make professional-grade tools accessible to everyone, providing real-time data and beautiful charts in one simple experience.
            </p>
            <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>Reliable Data</h2>
            <p>
              By using reliable, real-time data from top providers like Finnhub and Yahoo Finance, Beacon ensures that every chart and metric you see is accurate and up-to-date.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
