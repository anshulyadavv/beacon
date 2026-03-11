import { useState, useEffect, useRef, useCallback } from "react";
import { STOCKS } from "../../data/stocks";
import { generateChartData } from "../../utils/chartData";

export default function Chart({ ticker, timeframe }) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 600, h: 260 });
  const [hoverIdx, setHoverIdx] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [ticker, timeframe, dims]);

  const data = generateChartData(ticker, timeframe);
  const isUp = STOCKS[ticker].changePct > 0;
  const lineColor = isUp ? "#30d158" : "#ff453a";
  const gradId = `grad-${ticker}-${timeframe}`;
  const { w: W, h: H } = dims;

  const minV = Math.min(...data) * 0.995;
  const maxV = Math.max(...data) * 1.005;

  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - minV) / (maxV - minV)) * H,
  ]);

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
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
    val: (minV + t * (maxV - minV)).toFixed(2),
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
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
            <clipPath id={`clip-${gradId}`}>
              <rect
                x="0" y="0"
                width={animated ? W : 0}
                height={H}
                style={{ transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)" }}
              />
            </clipPath>
          </defs>

          {yTicks.map((t, i) => (
            <line key={i} x1="0" y1={t.y} x2={W} y2={t.y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}

          <g clipPath={`url(#clip-${gradId})`}>
            <path d={areaPath} fill={`url(#${gradId})`} />
            <path d={linePath} fill="none" stroke={lineColor}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {yTicks.map((t, i) => (
            <text key={i} x={W - 6} y={t.y - 5}
              fill="rgba(255,255,255,0.25)" fontSize="11" textAnchor="end"
              fontFamily="'SF Mono','Fira Mono',monospace">
              ${t.val}
            </text>
          ))}

          {hoverPt && (
            <>
              <line x1={hoverPt[0]} y1="0" x2={hoverPt[0]} y2={H}
                stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4,4" />
              <circle cx={hoverPt[0]} cy={hoverPt[1]} r="4"
                fill={lineColor} stroke="#0b0b0c" strokeWidth="2" />
              <rect
                x={Math.min(hoverPt[0] + 10, W - 100)}
                y={Math.max(hoverPt[1] - 26, 2)}
                width="90" height="22" rx="5"
                fill="rgba(20,20,22,0.95)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text
                x={Math.min(hoverPt[0] + 55, W - 55)}
                y={Math.max(hoverPt[1] - 11, 16)}
                fill="#fff" fontSize="12" fontWeight="600" textAnchor="middle"
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