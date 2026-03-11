import React from "react";
import TradingDashboard from "./components/dashboard/TradingDashboard";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <TradingDashboard />
    </ErrorBoundary>
  );
}