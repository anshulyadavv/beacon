import React from "react";
import { motion } from "framer-motion";

/**
 * Terms of Use
 * Standardized with Beacon premium design system.
 */
export default function Terms() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-deep)", paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, marginBottom: "2rem" }}>
            Terms of Use
          </h1>
          <section className="glass-effect" style={{ padding: "3rem", borderRadius: "24px", lineHeight: "1.8", color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: "1.5rem", color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 500 }}>
              The following terms govern your access to and usage of the Beacon platform.
            </p>
            
            <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", marginTop: "2rem", marginBottom: "1rem" }}>1. Financial Risk Disclosure</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              Beacon is a proprietary financial visualization engine. All data, metrics, and insights provided are for educational and informational purposes only. Beacon does not provide financial, investment, or legal advice. All trading involves substantial risk of loss; we recommend consulting with a certified financial advisor before making any allocation decisions.
            </p>

            <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", marginTop: "2rem", marginBottom: "1rem" }}>2. Data Fidelity & Third-Party Latency</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              While we utilize high-fidelity feeds from institutional-grade providers, Beacon does not guarantee the absolute accuracy, completeness, or timeliness of market data. We are not liable for any discrepancies resulting from API latency, transmission errors, or technical interruptions beyond our control.
            </p>

            <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", marginTop: "2rem", marginBottom: "1rem" }}>3. Intellectual Property & Usage Limits</h2>
            <p>
              Usage of Beacon is restricted to personal, non-commercial research. Automated extraction, high-frequency scraping, or redistribution of Beacon's proprietary interface and data visualizations is strictly prohibited and may result in immediate revocation of access.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
