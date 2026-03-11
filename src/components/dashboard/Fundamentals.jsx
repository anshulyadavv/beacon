import { STOCKS } from "../../data/stocks";

export default function Fundamentals({ selected }) {
  const stock = STOCKS[selected];

  const rows = [
    ["Market Cap", stock.marketCap],
    ["P/E Ratio",  stock.peRatio],
    ["EPS (TTM)",  stock.eps],
    ["Revenue",    stock.revenue],
    ["Div Yield",  stock.divYield],
    ["Beta",       stock.beta],
    ["52W High",   stock.high52],
    ["52W Low",    stock.low52],
  ];

  return (
    <aside style={{
      padding: "20px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      height: "100%",
      overflow: "hidden",
      boxSizing: "border-box",
    }}>

      {/* Label */}
      <div style={{
        fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em",
        color: "#8e8e93", fontWeight: 600, flexShrink: 0,
      }}>
        Fundamentals
      </div>

      {/* Table */}
      <div style={{
        background: "rgba(20,20,22,0.4)", border: "1px solid #242426",
        borderRadius: 14, padding: "2px 16px", flexShrink: 0,
      }}>
        {rows.map(([label, value], i) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <span style={{ color: "#8e8e93", fontSize: 12 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{
        padding: 14, borderRadius: 12,
        background: "rgba(255,255,255,0.02)", border: "1px solid #242426",
        flexShrink: 0,
      }}>
        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>About {stock.name}</div>
        <div style={{ fontSize: 12, color: "#8e8e93", lineHeight: 1.6 }}>{stock.about}</div>
      </div>
    </aside>
  );
}