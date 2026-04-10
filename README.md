# Beacon — Stock Trading Dashboard

Beacon is a stock trading dashboard built with React and the Finnhub API. We designed it with a clean dark theme so you can easily monitor markets, track your watchlists, and see company fundamentals without clutter.

![Beacon Dashboard](https://img.shields.io/badge/status-active-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Finnhub](https://img.shields.io/badge/API-Finnhub-orange)

---

## Features

### Live Data
- **Live web sockets** — prices and percentage changes update instantly as trades happen via a persistent connection to Finnhub
- **Market status indicator** — shows whether markets are currently open or closed

### Search
- **Universal stock search** — search across thousands of stocks and ETFs from global exchanges
- **Instant results** — quick debounced search so results appear as you type without hitting rate limits
- **Inline watchlist toggle** — add or remove a stock directly from the search dropdown
- **Keyboard shortcut** — press Command+K (or Ctrl+K on Windows) to focus the search bar from anywhere

### Watchlist
- **Dynamic watchlist** — add and remove any stock at any time
- **Persistent active state** — your currently selected stock is highlighted with a left indicator
- **Hover to remove** — a red remove button appears on hover for clean removal
- **Live prices inline** — every watchlist row shows the current price and percentage change dynamically

### Chart
- **TradingView charts** — high performance canvas rendering powered by lightweight charts
- **Candlestick and Volume** — native candlestick view with a volume histogram overlay
- **Six timeframes** — 1D, 1W, 1M, 3M, 1Y, ALL with appropriate data resolution per range
- **Hover crosshair** — move your mouse over the chart to see exact data at any point

### Fundamentals Panel
- **Company profile** — name, exchange, industry, sector, and website
- **Key statistics** — Market Cap, P/E Ratio, EPS, 52W High/Low, Dividend Yield, Beta, Day High/Low, Open, Prev Close, Volume
- **Live price card** — always visible current price with todays change
- **Add or Remove watchlist** — button at the bottom of the panel to toggle membership

### Authentication
- **Global Auth** — secure backend user sessions managed seamlessly with Supabase
- **Dashboard routing** — protected views ensure only logged in users can see live dashboards

### Share
- **Shareable links** — the share button copies a URL with the ticker to your clipboard
- **Auto load from URL** — opening a shared link automatically selects and loads that stock

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Inline styles (zero CSS dependencies) |
| Live quotes | Finnhub WebSockets |
| Chart data | Yahoo Finance v8 chart endpoint |
| Charting Engine| TradingView lightweight charts |
| Authentication| Supabase Auth |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Free Finnhub API key from [finnhub.io](https://finnhub.io/register)
- Supabase Project credentials

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/beacon-dashboard.git
cd beacon-dashboard
npm install
```

### Environment setup

Create a `.env` file in the project root:

```
VITE_FINNHUB_KEY=your_finnhub_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for production

```bash
npm run build
```

---

## License

MIT — free to use, modify and deploy.

---

*Built with React · Powered by Finnhub & Supabase*
