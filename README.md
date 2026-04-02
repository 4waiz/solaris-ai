# Solaris AI

**AI-powered cooling flexibility for solar-driven cities.**

Solaris AI helps operators shift cooling demand into solar-rich hours using demand forecasting, thermal storage dispatch, comfort-aware optimization, and real-time weather/solar signals.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS v4** with custom design system
- **shadcn/ui** component library
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Zustand** for state management
- **Lucide** icons

## Real API Integrations

| API | Purpose | Fallback |
|-----|---------|----------|
| [Open-Meteo Forecast](https://open-meteo.com/) | Hourly weather & solar radiation | Mock Dubai weather data |
| [NASA POWER](https://power.larc.nasa.gov/) | Historical solar/meteorological context | N/A (optional enrichment) |

Default location: **Dubai, UAE** (25.2048, 55.2708). Switchable to Abu Dhabi, Riyadh, Doha, or custom coordinates.

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Command Center | Hero, KPI cards, 24h forecast charts, AI recommendations |
| `/digital-twin` | Digital Twin | Visual asset network with flow lines and detail drawers |
| `/optimization` | Forecast & Optimization | Baseline vs optimized demand, schedule breakdown |
| `/flex-credits` | Flex Credits | Shifted demand converted to credits, leaderboard |
| `/insights` | Insights & MRV | Measurement/reporting/verification, CSV/JSON export |

## Architecture

```
app/                  # Next.js App Router pages
  api/weather/        # Server-side weather API proxy
components/
  shared/             # Navbar, KPICard, RecommendationPanel, skeletons
  charts/             # CoolingDemand, SolarRadiation, Temperature, MiniTrend
  ui/                 # shadcn/ui primitives
services/
  openMeteo.ts        # Open-Meteo API client + mock fallback
  nasaPower.ts        # NASA POWER API client
  coolingModel.ts     # Cooling demand estimator (temp, humidity, radiation)
  optimizer.ts        # Pre-cooling scheduler, TES dispatch, peak-risk detector
  credits.ts          # Flex credits engine, MRV records, CSV/JSON export
  assets.ts           # Demo asset data for Digital Twin
hooks/
  useStore.ts         # Zustand global state
  useWeatherData.ts   # Data fetching + optimization pipeline
types/
  index.ts            # All TypeScript interfaces
```

## Logic Engine

The optimizer runs entirely client-side with transparent heuristics:

1. **Cooling Demand Score (0-100)** — 50% temperature + 20% humidity + 20% solar radiation + 10% apparent temp
2. **Solar Opportunity Detection** — identifies hours with direct radiation > 50% threshold
3. **Peak-Risk Detection** — high demand + low solar periods
4. **Pre-Cooling Scheduler** — starts 2 hours before peak-risk windows
5. **TES Dispatch** — charges during solar hours, discharges during peak-risk
6. **Comfort Guard** — never lets comfort drop below 85%
7. **Flex Credits** — 1 credit per kWh shifted, 1.3x bonus for solar-aligned shifts

## Design

Inspired by premium UAE government digital products. Clean, minimal, spacious design with:
- Teal accent system (#67A9AA / #4E8F91)
- Generous whitespace and large typography
- Soft shadows and rounded surfaces
- Smooth Framer Motion animations
- Dark/light mode support

## Build

```bash
npm run build    # Production build
npm run lint     # ESLint check
```
