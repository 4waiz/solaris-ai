"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Sun,
  Clock,
  AlertTriangle,
  Battery,
  TrendingDown,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useWeatherData } from "@/hooks/useWeatherData";
import { CoolingDemandChart } from "@/components/charts/CoolingDemandChart";
import { SolarRadiationChart } from "@/components/charts/SolarRadiationChart";
import {
  CardSkeleton,
  ChartSkeleton,
} from "@/components/shared/LoadingSkeleton";
import { cn } from "@/lib/utils";

export default function OptimizationPage() {
  const {
    isLoading,
    weatherData,
    optimizationResult,
    showOptimized,
    toggleOptimized,
  } = useStore();
  useWeatherData();

  const displayData = weatherData?.slice(0, 24) ?? [];
  const opt = optimizationResult;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Forecast & Optimization
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live weather-driven demand forecast with Solaris AI optimization
            engine
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8 space-y-6">
        {/* Mode toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            View mode:
          </span>
          <div className="flex items-center rounded-xl border border-border/60 bg-card p-1 shadow-premium">
            <button
              onClick={() => !showOptimized || toggleOptimized()}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                !showOptimized
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Baseline
            </button>
            <button
              onClick={() => showOptimized || toggleOptimized()}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                showOptimized
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Solaris AI
            </button>
          </div>
        </div>

        {/* Optimization KPIs */}
        {isLoading || !opt ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <TrendingDown className="h-3.5 w-3.5" />
                Peak Reduction
              </div>
              <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">
                {opt.peakReductionPercent}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {opt.baselinePeakLoad} → {opt.optimizedPeakLoad} peak score
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Sun className="h-3.5 w-3.5" />
                Solar Utilization
              </div>
              <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                {opt.solarUtilizationPercent}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                of available solar hours utilized
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Comfort Compliance
              </div>
              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {opt.comfortCompliancePercent}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                all zones within safe thresholds
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Zap className="h-3.5 w-3.5" />
                Active Schedules
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {opt.preCoolWindows.length + opt.tesChargeWindows.length + opt.tesDischargeWindows.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                pre-cool, charge, and discharge windows
              </p>
            </motion.div>
          </div>
        )}

        {/* Charts */}
        {isLoading || displayData.length === 0 ? (
          <div className="space-y-4">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Before / After load curve */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    {showOptimized
                      ? "Optimized Cooling Demand"
                      : "Baseline Cooling Demand"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {showOptimized
                      ? "Demand curve after Solaris AI optimization with load shifting and TES dispatch"
                      : "Unoptimized demand curve based on weather forecast alone"}
                  </p>
                </div>
                {opt && showOptimized && (
                  <div className="shrink-0 rounded-lg bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
                    {opt.peakReductionPercent}% peak reduction
                  </div>
                )}
              </div>
              <CoolingDemandChart
                data={
                  showOptimized && opt
                    ? opt.hourlyData.slice(0, 24)
                    : displayData
                }
                baselineData={
                  showOptimized && opt
                    ? opt.baselineData.slice(0, 24)
                    : undefined
                }
                showBaseline={showOptimized}
                height={320}
              />
            </motion.div>

            {/* Solar overlay */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  Solar Radiation Window
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Identify high-radiation hours for TES charging and pre-cooling
                </p>
              </div>
              <SolarRadiationChart data={displayData} height={260} />
            </motion.div>
          </div>
        )}

        {/* Schedule breakdown */}
        {opt && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h3 className="text-base font-semibold text-foreground mb-4">
              Optimization Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Best solar hours */}
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <Sun className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Best Solar Hours
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      High radiation windows
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {opt.bestSolarHours.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No solar windows detected
                    </p>
                  ) : (
                    opt.bestSolarHours.slice(0, 3).map((w, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 px-3 py-2 text-xs"
                      >
                        <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        <span className="text-foreground font-medium">
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
                    ))
                  )}
                </div>
              </div>

              {/* Pre-cooling windows */}
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-900/20">
                    <Battery className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Pre-Cooling Windows
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Scheduled ahead of peaks
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {opt.preCoolWindows.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No pre-cooling needed
                    </p>
                  ) : (
                    opt.preCoolWindows.slice(0, 3).map((w, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-sky-50/50 dark:bg-sky-900/10 px-3 py-2 text-xs"
                      >
                        <Clock className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                        <span className="text-foreground font-medium">
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
                    ))
                  )}
                </div>
              </div>

              {/* Peak-risk periods */}
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-900/20">
                    <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Peak-Risk Periods
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      High demand, low solar
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {opt.highRiskPeriods.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No high-risk periods detected
                    </p>
                  ) : (
                    opt.highRiskPeriods.slice(0, 3).map((w, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-rose-50/50 dark:bg-rose-900/10 px-3 py-2 text-xs"
                      >
                        <Clock className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                        <span className="text-foreground font-medium">
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
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border/60 bg-gradient-to-br from-teal-50/30 to-sky-50/30 dark:from-teal-900/10 dark:to-sky-900/10 p-6 shadow-premium"
        >
          <h3 className="text-sm font-semibold text-foreground mb-2">
            How the Solaris AI Optimizer Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground leading-relaxed">
            <div>
              <p className="font-medium text-foreground mb-1">
                Cooling Demand Score (0–100)
              </p>
              <p>
                Calculated from temperature (50% weight), humidity (20%),
                solar radiation (20%), and apparent temperature penalty (10%).
                Calibrated for Gulf climate with thresholds at 22°C–48°C.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                Optimization Strategy
              </p>
              <p>
                The optimizer identifies solar-rich hours for TES charging,
                schedules pre-cooling 2 hours before peak-risk windows, and
                shifts up to 25% of peak demand into off-peak hours while
                maintaining comfort above 85%.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
