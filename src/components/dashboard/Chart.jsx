import { useState, useEffect, useRef, useCallback } from "react";
import { generateChartData } from "../../utils/chartData";

/**
 * SVG line chart — fills its parent container dynamically via ResizeObserver.
 * Line color is green if price went up over the selected timeframe, red if down.
 * Includes animated draw-in, hover crosshair, and price tooltip.
 *
 * Props:
 *   ticker     {string} — e.g. "AAPL"
 *   timeframe  {string} — e.g. "1Y"
 */
export default function Chart({ ticker, timeframe }) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hoverIdx, setHoverIdx] = useState(null);
  const [animated, setAnimated] = useState(false);

  // Track real container size
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

  // Retrigger draw animation on any change
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [ticker, timeframe, dims.w, dims.h]);

  const data = generateChartData(ticker, timeframe);

  // Color based on actual timeframe performance (start vs end)
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? "#30d158" : "#ff453a";
  const gradId = `grad-${ticker}-${timeframe}`;
  const clipId = `clip-${ticker}-${timeframe}`;

  const { w: W, h: H } = dims;

  // Normalise to SVG coords
  const minV = Math.min(...data) * 0.997;
  const maxV = Math.max(...data) * 1.003;
  const range = maxV - minV || 1;

  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - minV) / range) * H,
  ]);

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  const handleMouseMove = useCallback(
    (e) => {
      const el = containerRef.current;
      if (!el || W === 0) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const idx = Math.round((x / W) * (data.length - 1));
      setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
    },
    [W, data.length]
  );

  const hoverPt = hoverIdx !== null ? pts[hoverIdx] : null;
  const hoverVal = hoverIdx !== null ? data[hoverIdx] : null;

  const yTicks = [0.2, 0.5, 0.8].map((t) => ({
    y: H - t * H,
    val: (minV + t * range).toFixed(2),
  }));

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      {W > 0 && H > 0 && (
        <svg width={W} height={H} style={{ display: "block", cursor: "crosshair" }}>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.20" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
            <clipPath id={clipId}>
              <rect
                x="0" y="0" height={H}
                width={animated ? W : 0}
                style={{ transition: "width 0.85s cubic-bezier(0.4,0,0.2,1)" }}
              />
            </clipPath>
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map((t, i) => (
            <line
              key={i} x1="0" y1={t.y} x2={W} y2={t.y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            />
          ))}

          {/* Animated area + line */}
          <g clipPath={`url(#${clipId})`}>
            <path d={areaPath} fill={`url(#${gradId})`} />
            <path
              d={linePath} fill="none"
              stroke={lineColor} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </g>

          {/* Y-axis price labels */}
          {yTicks.map((t, i) => (
            <text
              key={i} x={W - 6} y={t.y - 5}
              fill="rgba(255,255,255,0.22)" fontSize="10" textAnchor="end"
              fontFamily="'SF Mono','Fira Mono',monospace"
            >
              ${t.val}
            </text>
          ))}

          {/* Hover crosshair */}
          {hoverPt && (
            <>
              <line
                x1={hoverPt[0]} y1="0" x2={hoverPt[0]} y2={H}
                stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4,4"
              />
              <circle
                cx={hoverPt[0]} cy={hoverPt[1]} r="4"
                fill={lineColor} stroke="#0b0b0c" strokeWidth="2"
              />
              {/* Tooltip bubble */}
              <rect
                x={Math.min(hoverPt[0] + 10, W - 96)}
                y={Math.max(hoverPt[1] - 26, 2)}
                width="86" height="22" rx="5"
                fill="rgba(18,18,20,0.96)"
                stroke="rgba(255,255,255,0.08)" strokeWidth="1"
              />
              <text
                x={Math.min(hoverPt[0] + 53, W - 53)}
                y={Math.max(hoverPt[1] - 11, 16)}
                fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle"
                fontFamily="'SF Mono','Fira Mono',monospace"
              >
                ${Number(hoverVal).toFixed(2)}
              </text>
            </>
          )}
        </svg>
      )}
    </div>
  );
}