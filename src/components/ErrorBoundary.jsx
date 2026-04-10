import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: "fixed", inset: 0,
          background: "var(--bg-deep)", color: "var(--text-primary)",
          fontFamily: "var(--font-apple)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 24,
          padding: 32, zIndex: 9999
        }}>
          <div style={{ 
            background: "rgba(255, 69, 58, 0.1)", 
            padding: "16px", borderRadius: "16px",
            border: "1px solid rgba(255, 69, 58, 0.2)",
            color: "var(--error)", fontWeight: 700, fontSize: "1.2rem"
          }}>
            Critical System Error
          </div>
          <pre style={{
            fontSize: 12, color: "var(--text-secondary)", background: "rgba(0,0,0,0.3)",
            padding: "20px", borderRadius: 16, maxWidth: 600,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            border: "1px solid var(--border-subtle)",
            fontFamily: "'SF Mono', monospace"
          }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => { window.location.href = "/"; }}
            style={{
              background: "var(--accent-blue)", border: "none",
              color: "#fff", padding: "12px 24px", borderRadius: 12,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 12px rgba(0, 113, 227, 0.3)"
            }}
          >
            Return to Safety
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}