"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
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

const CATEGORIES = [
  { icon: Factory, label: "District Cooling", count: "3 plants" },
  { icon: Building2, label: "Commercial Towers", count: "12 towers" },
  { icon: Hotel, label: "Hospitality", count: "8 hotels" },
  { icon: Store, label: "Retail", count: "5 malls" },
  { icon: GraduationCap, label: "Campuses", count: "4 sites" },
];

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

  const displayData = weatherData?.slice(0, 24) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient dark:hero-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl animate-pulse-soft" />
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-teal-300/15 blur-3xl animate-pulse-soft"
            style={{ animationDelay: "1.5s" }}
          />
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
            <p className="mt-4 text-base sm:text-lg text-teal-100/80 max-w-2xl mx-auto">
              AI-powered cooling flexibility for solar-driven cities. Shift
              load, store thermal energy, and optimize comfort in real time.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-10 mx-auto max-w-2xl"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3.5 transition-all focus-within:bg-white/15 focus-within:border-white/20">
              <Search className="h-5 w-5 text-teal-200/60 shrink-0" />
              <input
                type="text"
                placeholder="Search sites, plants, towers, and cooling assets"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-teal-200/50"
              />
              <ArrowRight className="h-4 w-4 text-teal-200/40" />
            </div>
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
                className="group flex items-center gap-2.5 rounded-xl bg-white/8 backdrop-blur-sm border border-white/8 px-4 py-2.5 text-sm text-teal-100 hover:bg-white/12 hover:border-white/15 transition-all"
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
          </div>
        </div>
      </section>
    </div>
  );
}
