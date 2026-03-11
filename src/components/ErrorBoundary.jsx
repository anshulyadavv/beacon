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
          background: "#0b0b0c", color: "#fff",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16,
          padding: 32,
        }}>
          <div style={{ fontSize: 13, color: "#ff453a", fontWeight: 600 }}>
            Something went wrong
          </div>
          <pre style={{
            fontSize: 12, color: "#8e8e93", background: "#1c1c1e",
            padding: "16px 20px", borderRadius: 12, maxWidth: 600,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            border: "1px solid #2c2c2e",
          }}>
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack?.split("\n").slice(0, 6).join("\n")}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid #2c2c2e",
              color: "#fff", padding: "8px 20px", borderRadius: 8,
              fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}