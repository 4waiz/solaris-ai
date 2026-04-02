"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Leaf,
  Zap,
  Sun,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useWeatherData } from "@/hooks/useWeatherData";
import { computeFlexCredits } from "@/services/credits";
import { DEMO_ASSETS } from "@/services/assets";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { cn } from "@/lib/utils";

export default function FlexCreditsPage() {
  const { isLoading, optimizationResult } = useStore();
  useWeatherData();

  const credits = useMemo(() => {
    if (!optimizationResult) return [];
    return computeFlexCredits(optimizationResult, DEMO_ASSETS);
  }, [optimizationResult]);

  const totalKwh = credits.reduce((s, c) => s + c.kwhShifted, 0);
  const totalCredits = credits.reduce((s, c) => s + c.creditsEarned, 0);
  const totalCo2 = credits.reduce((s, c) => s + c.co2Avoided, 0);
  const avgSolar =
    credits.length > 0
      ? Math.round(
          credits.reduce((s, c) => s + c.solarAlignmentScore, 0) /
            credits.length
        )
      : 0;

  const sorted = [...credits].sort((a, b) => b.creditsEarned - a.creditsEarned);

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Flex Credits
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cooling demand shifted into solar-rich hours, converted into
            verifiable Cooling Flex Credits
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8 space-y-6">
        {/* Impact cards */}
        {isLoading ? (
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
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Zap className="h-3.5 w-3.5" />
                Energy Shifted
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {totalKwh.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">kWh shifted today</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Award className="h-3.5 w-3.5" />
                Credits Earned
              </div>
              <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">
                {totalCredits.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Cooling Flex Credits
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Leaf className="h-3.5 w-3.5" />
                CO₂ Avoided
              </div>
              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalCo2.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                kg CO₂ estimated
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Sun className="h-3.5 w-3.5" />
                Solar Alignment
              </div>
              <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                {avgSolar}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                average alignment score
              </p>
            </motion.div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Asset Leaderboard
            </h3>
            <div className="space-y-3">
              {sorted.map((credit, i) => (
                <motion.div
                  key={credit.assetId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm",
                        i === 0
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : i === 1
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                      )}
                    >
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {credit.assetName}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{credit.kwhShifted.toLocaleString()} kWh</span>
                        <span>·</span>
                        <span>{credit.co2Avoided} kg CO₂</span>
                        <span>·</span>
                        <span>{credit.solarAlignmentScore}% solar</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
                        {credit.creditsEarned.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">credits</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${totalCredits > 0 ? (credit.creditsEarned / totalCredits) * 100 : 0}%`,
                        }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Credits explanation */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-4"
          >
            <h3 className="text-base font-semibold text-foreground">
              How Flex Credits Work
            </h3>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-bold text-xs">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Demand is Shifted
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    The optimizer moves cooling load from peak-risk hours into
                    solar-rich hours using pre-cooling and TES dispatch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-bold text-xs">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    kWh Shifted is Measured
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    The difference between baseline and optimized demand is
                    calculated hourly and converted to kWh based on asset
                    capacity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-bold text-xs">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Credits are Issued
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    1 credit ≈ 1 kWh shifted. A 1.3× bonus is applied when load
                    is shifted into solar-aligned hours (above 60% solar
                    alignment).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-bold text-xs">
                  4
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    CO₂ Impact is Estimated
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Using the UAE grid average of 0.42 kg CO₂/kWh, each shifted
                    kWh translates to measurable emissions reduction.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-700 dark:to-teal-800 p-6 text-white shadow-premium-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-5 w-5 text-teal-200" />
                <h4 className="text-base font-semibold">Today&apos;s Impact</h4>
              </div>
              <p className="text-3xl font-bold">
                {totalCredits.toLocaleString()}{" "}
                <span className="text-lg font-normal text-teal-200">
                  credits
                </span>
              </p>
              <p className="mt-2 text-sm text-teal-100/80">
                {totalKwh.toLocaleString()} kWh shifted ·{" "}
                {totalCo2.toLocaleString()} kg CO₂ avoided · {avgSolar}% solar
                aligned
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
