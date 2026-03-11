import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useChartData } from "../../hooks/useChartData";
import { generateChartData } from "../../utils/chartData";

/**
 * SVG line chart — uses real Finnhub OHLCV data when available,
 * falls back to the mock generator while loading or on error.
 */
export default function Chart({ ticker, timeframe }) {
  const containerRef            = useRef(null);
  const [dims, setDims]         = useState({ w: 0, h: 0 });
  const [hoverIdx, setHoverIdx] = useState(null);
  const [animated, setAnimated] = useState(false);

  const { data: realData, loading, error } = useChartData(ticker, timeframe);

  // Use real data if available, mock otherwise
  const data = (realData && realData.length > 1) ? realData : generateChartData(ticker, timeframe);
  const isMock = !realData || realData.length < 2;

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Re-trigger animation
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [ticker, timeframe, dims.w, dims.h, isMock]);

  const isUp      = data.length > 1 ? data[data.length - 1] >= data[0] : true;
  const lineColor = isUp ? "#30d158" : "#ff453a";
  const gradId    = `grad-${ticker}-${timeframe}`;
  const clipId    = `clip-${ticker}-${timeframe}`;

  const { w: W, h: H } = dims;
  const minV  = Math.min(...data) * 0.997;
  const maxV  = Math.max(...data) * 1.003;
  const range = maxV - minV || 1;

  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - minV) / range) * H,
  ]);

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  const handleMouseMove = useCallback((e) => {
    const el = containerRef.current;
    if (!el || W === 0) return;
    const rect = el.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const idx  = Math.round((x / W) * (data.length - 1));
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
  }, [W, data.length]);

  const hoverPt  = hoverIdx !== null ? pts[hoverIdx]  : null;
  const hoverVal = hoverIdx !== null ? data[hoverIdx] : null;

  const yTicks = [0.2, 0.5, 0.8].map((t) => ({
    y:   H - t * H,
    val: (minV + t * range).toFixed(2),
  }));

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      {/* Loading shimmer */}
      {loading && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: 12, color: "#48484a" }}>Loading chart…</div>
        </div>
      )}

      {/* Mock data badge */}
      {!loading && isMock && (
        <div style={{
          position: "absolute", top: 6, left: 8,
          fontSize: 10, color: "#48484a",
          background: "rgba(255,255,255,0.03)",
          padding: "2px 7px", borderRadius: 5,
          border: "1px solid #1c1c1e",
          pointerEvents: "none", zIndex: 10,
        }}>
          Preview
        </div>
      )}

      {W > 0 && H > 0 && (
        <svg width={W} height={H} style={{ display: "block", cursor: "crosshair" }}>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor={lineColor} stopOpacity="0.20" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0"    />
            </linearGradient>
            <clipPath id={clipId}>
              <rect x="0" y="0" height={H}
                width={animated ? W : 0}
                style={{ transition: "width 0.85s cubic-bezier(0.4,0,0.2,1)" }}
              />
            </clipPath>
          </defs>

          {yTicks.map((t, i) => (
            <line key={i} x1="0" y1={t.y} x2={W} y2={t.y}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}

          <g clipPath={`url(#${clipId})`}>
            <path d={areaPath} fill={`url(#${gradId})`} />
            <path d={linePath} fill="none" stroke={lineColor}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {yTicks.map((t, i) => (
            <text key={i} x={W - 6} y={t.y - 5}
              fill="rgba(255,255,255,0.20)" fontSize="10" textAnchor="end"
              fontFamily="'SF Mono','Fira Mono',monospace">
              ${t.val}
            </text>
          ))}

          {hoverPt && (
            <>
              <line x1={hoverPt[0]} y1="0" x2={hoverPt[0]} y2={H}
                stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="4,4" />
              <circle cx={hoverPt[0]} cy={hoverPt[1]} r="4"
                fill={lineColor} stroke="#0b0b0c" strokeWidth="2" />
              <rect
                x={Math.min(hoverPt[0] + 10, W - 96)}
                y={Math.max(hoverPt[1] - 26, 2)}
                width="86" height="22" rx="5"
                fill="rgba(18,18,20,0.97)"
                stroke="rgba(255,255,255,0.07)" strokeWidth="1"
              />
              <text
                x={Math.min(hoverPt[0] + 53, W - 53)}
                y={Math.max(hoverPt[1] - 11, 16)}
                fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle"
                fontFamily="'SF Mono','Fira Mono',monospace">
                ${Number(hoverVal).toFixed(2)}
              </text>
            </>
          )}
        </svg>
      )}
    </div>
  );
}