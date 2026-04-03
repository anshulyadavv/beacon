# Beacon — Stock Trading Dashboard

A real-time stock trading dashboard built with React and Finnhub API. Clean, Apple-inspired dark UI designed for monitoring markets, tracking watchlists, and analyzing company fundamentals at a glance.

![Beacon Dashboard](https://img.shields.io/badge/status-active-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Finnhub](https://img.shields.io/badge/API-Finnhub-orange)

---

## Features

### Live Data
- **Real-time price polling** — all watchlisted stocks refresh every 15 seconds via Finnhub's REST API
- **Live price ticking** — prices and percentage changes update automatically in the background for every stock in your watchlist, even when you're viewing a different one
- **Market status indicator** — shows whether markets are currently open or closed

### Search
- **Universal stock search** — search across 50,000+ stocks and ETFs from any global exchange via Finnhub
- **Instant results** — debounced 350ms so results appear as you type without hammering the API
- **Inline watchlist toggle** — add or remove any stock directly from the search dropdown without navigating away
- **⌘K shortcut** — press Command+K (or Ctrl+K on Windows) to focus the search bar from anywhere

### Watchlist
- **Dynamic watchlist** — add and remove any stock at any time, not limited to a preset list
- **Persistent active state** — currently selected stock is always highlighted with a left-side indicator
- **Hover to remove** — a red remove button appears on hover for clean one-click removal
- **Live prices inline** — every watchlist row shows the current price and percentage change, updating in real time

### Chart
- **Real price history** — OHLCV candle data fetched from Yahoo Finance (free, no auth required)
- **Six timeframes** — 1D, 1W, 1M, 3M, 1Y, ALL with appropriate data resolution per range
- **Animated draw-on** — chart line animates in on load and on every ticker/timeframe switch
- **Hover crosshair** — move your mouse over the chart to see exact price at any point
- **Gradient fill** — color-coded green/red area fill based on whether the stock is up or down
- **Preview mode** — mock chart renders instantly while real data loads so the UI never feels broken

### Fundamentals Panel
- **Company profile** — name, exchange, industry, sector, and website pulled from Finnhub
- **Key statistics** — Market Cap, P/E Ratio, EPS, 52W High/Low, Dividend Yield, Beta, Day High/Low, Open, Prev Close, Volume
- **Live price card** — always-visible current price with today's change
- **Add/Remove watchlist** — one-click button at the bottom of the panel to toggle watchlist membership

### Share
- **Shareable links** — the share button (top right of chart panel) copies a URL with the ticker in the hash (e.g. `beacon.app/#NVDA`) to your clipboard
- **Auto-load from URL** — opening a shared link automatically selects and loads that stock
- **Confirmation toast** — a subtle "Link copied" confirmation appears and fades after 2 seconds

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Inline styles (zero CSS-in-JS dependencies) |
| Live quotes | Finnhub REST API (free tier) |
| Chart data | Yahoo Finance v8 chart endpoint |
| Stock search | Finnhub search API |
| Company data | Finnhub profile + metrics endpoints |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Free Finnhub API key from [finnhub.io](https://finnhub.io/register)

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

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.jsx        — catches runtime errors, shows readable message
│   └── dashboard/
│       ├── TradingDashboard.jsx — root layout, owns all state
│       ├── Watchlist.jsx        — left sidebar with live stock rows
│       ├── ChartPanel.jsx       — center panel: search, chart, timeframes
│       ├── Chart.jsx            — SVG line chart with ResizeObserver
│       └── Fundamentals.jsx     — right sidebar with stats and profile
├── hooks/
│   ├── finnhub.js              — core API utility (fetch, cache, all endpoints)
│   ├── useLivePrices.js        — polls prices every 15s for all watched tickers
│   ├── useStockData.js         — fetches quote + profile + metrics in parallel
│   ├── useStockSearch.js       — debounced search hook
│   └── useChartData.js         — fetches OHLCV candle data per timeframe
├── data/
│   └── stocks.js               — default watchlist tickers + timeframe constants
└── utils/
    └── chartData.js            — mock chart generator (fallback while loading)
```

---

## API Usage

Beacon uses two data sources:

**Finnhub** (quotes, search, profile, metrics)
- Free tier: 60 calls/minute
- Used for: live prices, company search, fundamentals panel
- Docs: [finnhub.io/docs](https://finnhub.io/docs/api)

**Yahoo Finance** (chart history only)
- Free, no auth required
- Used for: OHLCV candle data across all timeframes
- Cached 60 seconds per ticker/timeframe combination

---

## Planned Features

### Data & Analytics
- [ ] **Candlestick chart mode** — toggle between line chart and OHLC candlestick view
- [ ] **Volume bars** — display trading volume underneath the price chart
- [ ] **Moving averages** — overlay 20MA, 50MA, 200MA on the chart
- [ ] **RSI / MACD indicators** — technical analysis panel below the main chart
- [ ] **Earnings calendar** — upcoming earnings dates highlighted on the chart timeline
- [ ] **Company news feed** — latest headlines per stock via Finnhub's free `/company-news` endpoint
- [ ] **Analyst ratings** — buy/hold/sell consensus and price targets

### Portfolio
- [ ] **Portfolio tracker** — log buy price and quantity, track total P&L in real time
- [ ] **Cost basis tracking** — average down support, multiple lot entries
- [ ] **Allocation pie chart** — visual breakdown of portfolio by position size and sector
- [ ] **Performance vs S&P 500** — benchmark your portfolio against the index

### Watchlist & UX
- [ ] **Multiple watchlists** — create, name, and switch between separate watchlists
- [ ] **Drag to reorder** — reorder watchlist items by dragging
- [ ] **Watchlist persistence** — save watchlist to localStorage so it survives page refresh
- [ ] **Price alerts** — set a target price and get a browser notification when it's hit
- [ ] **Keyboard navigation** — arrow keys to move between watchlist stocks

### Search & Discovery
- [ ] **ETF support** — show ETF-specific data (holdings, expense ratio, AUM)
- [ ] **Crypto support** — add BTC, ETH and other major crypto tickers via Finnhub
- [ ] **Sector heatmap** — visual overview of how sectors are performing today
- [ ] **Trending stocks** — show most searched or most active stocks on open

### Social & Sharing
- [ ] **Snapshot share** — share a chart screenshot as an image, not just a link
- [ ] **Watchlist share** — share your full watchlist as a link others can import
- [ ] **Embed widget** — embeddable price ticker for external websites

### Infrastructure
- [ ] **Backend proxy** — move API calls server-side to hide the API key and lift rate limits
- [ ] **User accounts** — sign in with Google to sync watchlist across devices
- [ ] **WebSocket live prices** — upgrade to Finnhub paid tier for true real-time streaming
- [ ] **PWA support** — installable as a desktop/mobile app with offline fallback

---

## License

MIT — free to use, modify and deploy.

---

*Built with React · Powered by Finnhub & Yahoo Finance*
