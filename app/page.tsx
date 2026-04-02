"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Thermometer,
  Sun,
  TrendingDown,
  ShieldCheck,
  Search,
  Factory,
  Building2,
  Hotel,
  Store,
  GraduationCap,
  ArrowRight,
  MapPin,
  Zap,
  X,
  BarChart3,
  Award,
  FileDown,
  Battery,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/hooks/useStore";
import { useWeatherData } from "@/hooks/useWeatherData";
import { KPICard } from "@/components/shared/KPICard";
import { RecommendationPanel } from "@/components/shared/RecommendationPanel";
import { CoolingDemandChart } from "@/components/charts/CoolingDemandChart";
import { SolarRadiationChart } from "@/components/charts/SolarRadiationChart";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import {
  CardSkeleton,
  ChartSkeleton,
  RecommendationSkeleton,
} from "@/components/shared/LoadingSkeleton";
import { DEMO_ASSETS, getAssetStatusColor } from "@/services/assets";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { icon: Factory, label: "District Cooling", count: "3 plants" },
  { icon: Building2, label: "Commercial Towers", count: "12 towers" },
  { icon: Hotel, label: "Hospitality", count: "8 hotels" },
  { icon: Store, label: "Retail", count: "5 malls" },
  { icon: GraduationCap, label: "Campuses", count: "4 sites" },
];

// Searchable items: assets + some extra virtual entries
const SEARCH_ITEMS = [
  ...DEMO_ASSETS.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    status: a.status,
    load: `${a.currentLoad} / ${a.maxCapacity} MW`,
    href: "/digital-twin",
  })),
  { id: "zone-a1", name: "Zone A1 — Business Bay Cluster", type: "office" as const, status: "normal" as const, load: "4.2 / 8 MW", href: "/digital-twin" },
  { id: "zone-b2", name: "Zone B2 — DIFC Tower Group", type: "office" as const, status: "pre-cooling" as const, load: "3.1 / 6 MW", href: "/digital-twin" },
  { id: "campus-01", name: "Knowledge Park Campus", type: "campus" as const, status: "normal" as const, load: "1.8 / 3 MW", href: "/digital-twin" },
  { id: "tes-02", name: "Thermal Storage Tank B", type: "storage" as const, status: "storage-discharging" as const, load: "2.5 / 8 MW", href: "/digital-twin" },
];

const ICON_MAP: Record<string, typeof Factory> = {
  plant: Factory,
  storage: Zap,
  office: Building2,
  hotel: Hotel,
  mall: Store,
  campus: GraduationCap,
};

const ASSET_ICON_MAP: Record<string, typeof Factory> = {
  plant: Factory,
  storage: Battery,
  office: Building2,
  hotel: Hotel,
  mall: Store,
  campus: GraduationCap,
};

export default function CommandCenter() {
  const {
    isLoading,
    error,
    weatherData,
    optimizationResult,
    recommendations,
    kpiSummary,
  } = useStore();
  useWeatherData();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SEARCH_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const showResults = searchFocused && (searchQuery.trim().length > 0);

  const displayData = weatherData?.slice(0, 24) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient dark:hero-gradient-dark relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large soft gradient orbs */}
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-[100px] animate-pulse-soft" />
          <div
            className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-teal-300/8 blur-[80px] animate-pulse-soft"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-teal-200/5 blur-[120px] animate-pulse-soft"
            style={{ animationDelay: "1s" }}
          />

          {/* Geometric grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>

          {/* Floating rings / circles */}
          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full border border-white/[0.06]"
          />
          <motion.div
            animate={{ y: [6, -10, 6], rotate: [0, -3, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[12%] w-40 h-40 rounded-full border border-white/[0.04]"
          />
          <motion.div
            animate={{ y: [-5, 12, -5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] left-[18%] w-16 h-16 rounded-full border border-teal-300/[0.08]"
          />
          <motion.div
            animate={{ y: [10, -6, 10], x: [-3, 3, -3] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[25%] right-[20%] w-32 h-32 rounded-full border border-white/[0.05]"
          />

          {/* Glowing dots */}
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[30%] left-[30%] w-2 h-2 rounded-full bg-teal-300/40"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[50%] right-[25%] w-1.5 h-1.5 rounded-full bg-teal-200/30"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.2, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[25%] right-[35%] w-1.5 h-1.5 rounded-full bg-white/20"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[35%] left-[40%] w-2.5 h-2.5 rounded-full bg-teal-400/25"
          />

          {/* Diagonal lines / rays */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="100%" x2="60%" y2="0" stroke="white" strokeWidth="1" />
            <line x1="40%" y1="100%" x2="100%" y2="0" stroke="white" strokeWidth="0.5" />
            <line x1="20%" y1="100%" x2="80%" y2="0" stroke="white" strokeWidth="0.5" />
          </svg>

          {/* Subtle arc / swoosh at bottom */}
          <svg className="absolute bottom-0 left-0 w-full h-32 opacity-[0.06]" viewBox="0 0 1440 128" preserveAspectRatio="none">
            <path d="M0,64 C360,128 1080,0 1440,64 L1440,128 L0,128 Z" fill="white" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Turn cooling demand into a
              <br />
              <span className="text-teal-300">
                flexible clean-energy asset.
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-teal-100/70 max-w-2xl mx-auto leading-relaxed">
              AI-powered cooling flexibility for solar-driven cities. Shift
              load, store thermal energy, and optimize comfort in real time.
            </p>
          </motion.div>

          {/* Search bar with results */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-10 mx-auto max-w-2xl relative z-20"
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-xl border px-5 py-3.5 transition-all",
                showResults
                  ? "border-white/20 bg-white/15 rounded-b-none"
                  : "border-white/10"
              )}
            >
              <Search className="h-5 w-5 text-teal-200/60 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search sites, plants, towers, and cooling assets"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-teal-200/50"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-teal-200/40 hover:text-teal-200/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <ArrowRight className="h-4 w-4 text-teal-200/40" />
              )}
            </div>

            {/* Search results dropdown */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full rounded-b-2xl bg-white/15 backdrop-blur-xl border border-t-0 border-white/20 overflow-hidden"
                >
                  {searchResults.length === 0 ? (
                    <div className="px-5 py-4 text-sm text-teal-200/60 text-center">
                      No assets found matching &ldquo;{searchQuery}&rdquo;
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((item) => {
                        const Icon = ICON_MAP[item.type] || Building2;
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                              <Icon className="h-4 w-4 text-teal-200" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-teal-200/50">
                                {item.load} · {item.type}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-medium",
                                item.status === "normal" && "bg-emerald-400/20 text-emerald-300",
                                item.status === "pre-cooling" && "bg-sky-400/20 text-sky-300",
                                item.status === "storage-charging" && "bg-amber-400/20 text-amber-300",
                                item.status === "storage-discharging" && "bg-violet-400/20 text-violet-300",
                                item.status === "high-load" && "bg-rose-400/20 text-rose-300"
                              )}
                            >
                              {item.status.replace("-", " ")}
                            </span>
                          </Link>
                        );
                      })}
                      <div className="px-5 py-2 border-t border-white/10">
                        <Link
                          href="/digital-twin"
                          className="flex items-center gap-2 text-xs text-teal-300/70 hover:text-teal-200 transition-colors"
                        >
                          <MapPin className="h-3 w-3" />
                          View all assets in Digital Twin
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Category cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSearchQuery(cat.label.split(" ")[0])}
                className="group flex items-center gap-2.5 rounded-xl bg-white/[0.07] backdrop-blur-sm border border-white/[0.07] px-4 py-2.5 text-sm text-teal-100 hover:bg-white/[0.12] hover:border-white/[0.15] transition-all"
              >
                <cat.icon className="h-4 w-4 text-teal-300/70 group-hover:text-teal-200 transition-colors" />
                <span className="font-medium">{cat.label}</span>
                <span className="text-xs text-teal-200/50">{cat.count}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 -mt-6 relative z-10 pb-12">
        {error && (
          <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            Live data unavailable — showing simulated forecast. {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading || !kpiSummary ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <KPICard
                title="Cooling Load Today"
                value={kpiSummary.coolingLoadToday}
                subtitle={kpiSummary.coolingLoadUnit}
                icon={Thermometer}
                trend="up"
                trendValue="Active demand"
                delay={0}
              />
              <KPICard
                title="Solar Opportunity"
                value={`${kpiSummary.solarWindowStart}–${kpiSummary.solarWindowEnd}`}
                icon={Sun}
                trend="stable"
                trendValue="Best window today"
                delay={1}
              />
              <KPICard
                title="Peak Shift Potential"
                value={`${kpiSummary.peakShiftPotential}%`}
                subtitle="reduction"
                icon={TrendingDown}
                trend="up"
                trendValue="With Solaris AI"
                delay={2}
              />
              <KPICard
                title="Comfort Compliance"
                value={`${kpiSummary.comfortCompliance}%`}
                subtitle="all zones"
                icon={ShieldCheck}
                trend="stable"
                trendValue="Within threshold"
                delay={3}
              />
            </>
          )}
        </div>

        {/* Main Charts + Recommendations */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {isLoading || displayData.length === 0 ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
                >
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-foreground">
                      Cooling Demand Forecast
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      24-hour estimated cooling load (0–100) based on
                      temperature, humidity, and solar radiation
                    </p>
                  </div>
                  <CoolingDemandChart
                    data={
                      optimizationResult?.hourlyData.slice(0, 24) ??
                      displayData
                    }
                    baselineData={optimizationResult?.baselineData.slice(0, 24)}
                    showBaseline={true}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
                >
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-foreground">
                      Solar Radiation
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Shortwave and direct radiation intensity (W/m²)
                    </p>
                  </div>
                  <SolarRadiationChart data={displayData} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
                >
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-foreground">
                      Temperature Profile
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Actual and apparent temperature for the next 24 hours
                    </p>
                  </div>
                  <TemperatureChart data={displayData} />
                </motion.div>
              </>
            )}
          </div>

          {/* Recommendations sidebar */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              {isLoading || recommendations.length === 0 ? (
                <RecommendationSkeleton />
              ) : (
                <RecommendationPanel recommendations={recommendations} />
              )}
            </motion.div>

            {optimizationResult &&
              optimizationResult.preCoolWindows.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="rounded-2xl border border-border/60 bg-gradient-to-br from-sky-50/50 to-teal-50/50 dark:from-sky-900/10 dark:to-teal-900/10 p-5 shadow-premium"
                >
                  <h3 className="text-sm font-semibold text-foreground">
                    Pre-Cooling Schedule
                  </h3>
                  <div className="mt-3 space-y-2">
                    {optimizationResult.preCoolWindows.map((w, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <div className="h-2 w-2 rounded-full bg-sky-500" />
                        <span>
                          {new Date(w.start).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}{" "}
                          –{" "}
                          {new Date(w.end).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            {optimizationResult && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-2xl border border-border/60 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 p-5 shadow-premium"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  TES Dispatch Schedule
                </h3>
                <div className="mt-3 space-y-2">
                  {optimizationResult.tesChargeWindows
                    .slice(0, 2)
                    .map((w, i) => (
                      <div
                        key={`c-${i}`}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>
                          Charge:{" "}
                          {new Date(w.start).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}{" "}
                          –{" "}
                          {new Date(w.end).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                      </div>
                    ))}
                  {optimizationResult.tesDischargeWindows
                    .slice(0, 2)
                    .map((w, i) => (
                      <div
                        key={`d-${i}`}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <div className="h-2 w-2 rounded-full bg-violet-500" />
                        <span>
                          Discharge:{" "}
                          {new Date(w.start).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}{" "}
                          –{" "}
                          {new Date(w.end).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Asset overview */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Asset Overview
                </h3>
                <Link
                  href="/digital-twin"
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-2.5">
                {DEMO_ASSETS.map((asset) => {
                  const Icon = ASSET_ICON_MAP[asset.type] || Building2;
                  const pct = Math.round((asset.currentLoad / asset.maxCapacity) * 100);
                  return (
                    <div key={asset.id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {asset.name.split(" ").slice(0, 3).join(" ")}
                        </p>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              pct > 80
                                ? "bg-rose-500"
                                : pct > 60
                                  ? "bg-amber-500"
                                  : "bg-teal-500"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground shrink-0 tabular-nums">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Live weather snapshot */}
            {displayData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-2xl border border-border/60 bg-gradient-to-br from-rose-50/40 to-orange-50/40 dark:from-rose-900/10 dark:to-orange-900/10 p-5 shadow-premium"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  Current Conditions
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Temperature</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">
                      {displayData[0]?.temperature ?? "--"}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Feels Like</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">
                      {displayData[0]?.apparentTemp ?? "--"}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Humidity</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">
                      {displayData[0]?.humidity ?? "--"}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Solar Rad.</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">
                      {displayData[0]?.solarRadiation ?? "--"}
                      <span className="text-xs font-normal text-muted-foreground ml-0.5">W/m²</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Wind</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">
                      {displayData[0]?.windSpeed ?? "--"}
                      <span className="text-xs font-normal text-muted-foreground ml-0.5">km/h</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cloud Cover</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">
                      {displayData[0]?.cloudCover ?? "--"}%
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/optimization"
                  className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
                >
                  <BarChart3 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span className="flex-1">Run Optimization</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
                <Link
                  href="/flex-credits"
                  className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
                >
                  <Award className="h-4 w-4 text-amber-500" />
                  <span className="flex-1">View Flex Credits</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
                <Link
                  href="/insights"
                  className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
                >
                  <FileDown className="h-4 w-4 text-violet-500" />
                  <span className="flex-1">Export MRV Report</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
