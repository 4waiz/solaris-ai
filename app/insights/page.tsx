"use client";

import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  Download,
  FileJson,
  FileSpreadsheet,
  BarChart3,
  Sun,
  TrendingDown,
  ShieldCheck,
  Info,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useWeatherData } from "@/hooks/useWeatherData";
import { computeMRVRecords, generateCSVExport, generateJSONExport } from "@/services/credits";
import { CardSkeleton, ChartSkeleton } from "@/components/shared/LoadingSkeleton";

export default function InsightsPage() {
  const { isLoading, optimizationResult } = useStore();
  useWeatherData();

  const records = useMemo(() => {
    if (!optimizationResult) return [];
    return computeMRVRecords(optimizationResult, 7);
  }, [optimizationResult]);

  const avgPeakShaved =
    records.length > 0
      ? Math.round(records.reduce((s, r) => s + r.peakShaved, 0) / records.length)
      : 0;
  const avgSolarAbsorbed =
    records.length > 0
      ? Math.round(records.reduce((s, r) => s + r.solarAbsorbed, 0) / records.length)
      : 0;
  const avgComfort =
    records.length > 0
      ? Math.round(records.reduce((s, r) => s + r.comfortCompliance, 0) / records.length)
      : 0;
  const totalSaved =
    records.reduce((s, r) => s + (r.baselineKwh - r.optimizedKwh), 0);

  const downloadFile = useCallback((content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleCSV = useCallback(() => {
    downloadFile(generateCSVExport(records), "solaris-mrv-report.csv", "text/csv");
  }, [records, downloadFile]);

  const handleJSON = useCallback(() => {
    downloadFile(generateJSONExport(records), "solaris-mrv-report.json", "application/json");
  }, [records, downloadFile]);

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Insights & MRV
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Measurement, Reporting, and Verification dashboard for cooling
                flexibility performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCSV}
                disabled={records.length === 0}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border/60 bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                CSV
              </button>
              <button
                onClick={handleJSON}
                disabled={records.length === 0}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border/60 bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50"
              >
                <FileJson className="h-3.5 w-3.5" />
                JSON
              </button>
              <button
                onClick={handleCSV}
                disabled={records.length === 0}
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-teal-600 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8 space-y-6">
        {/* Summary KPIs */}
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
                <TrendingDown className="h-3.5 w-3.5" />
                Avg Peak Shaved
              </div>
              <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">
                {avgPeakShaved}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                7-day rolling average
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
                Solar Absorbed
              </div>
              <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                {avgSolarAbsorbed}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                average utilization rate
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
                Comfort Maintained
              </div>
              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {avgComfort}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                compliance across all zones
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5" />
                Total kWh Saved
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {totalSaved.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                over the past 7 days
              </p>
            </motion.div>
          </div>
        )}

        {/* Charts */}
        {isLoading || records.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Baseline vs Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">
                  Baseline vs Optimized
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daily energy consumption comparison (kWh)
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={records.map((r) => ({
                    date: r.date.slice(5),
                    Baseline: r.baselineKwh,
                    Optimized: r.optimizedKwh,
                  }))}
                  margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Bar
                    dataKey="Baseline"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                    opacity={0.3}
                  />
                  <Bar
                    dataKey="Optimized"
                    fill="#4E8F91"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Performance trends */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
            >
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">
                  Performance Trends
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Peak shaved, solar absorbed, and comfort compliance over 7 days
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={records.map((r) => ({
                    date: r.date.slice(5),
                    "Peak Shaved %": r.peakShaved,
                    "Solar %": r.solarAbsorbed,
                    "Comfort %": r.comfortCompliance,
                  }))}
                  margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="Peak Shaved %"
                    stroke="#4E8F91"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#4E8F91" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Solar %"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#F59E0B" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Comfort %"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Metric annotations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-base font-semibold text-foreground mb-4">
            Metric Definitions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Baseline kWh",
                desc: "Estimated daily energy consumption without any optimization, based on weather-driven cooling demand and asset capacities.",
              },
              {
                title: "Optimized kWh",
                desc: "Actual energy consumption after Solaris AI applies load shifting, pre-cooling, and TES dispatch strategies.",
              },
              {
                title: "Peak Shaved %",
                desc: "Percentage reduction in peak demand score achieved by shifting load away from high-risk hours into solar-rich windows.",
              },
              {
                title: "Solar Absorbed %",
                desc: "Proportion of available solar radiation hours that were utilized for TES charging or direct cooling operations.",
              },
              {
                title: "Comfort Compliance %",
                desc: "Percentage of operating hours where all zones maintained comfort scores above the 85% safety threshold.",
              },
              {
                title: "CO₂ Avoided",
                desc: "Estimated emissions reduction using UAE grid average of 0.42 kg CO₂/kWh applied to total energy shifted.",
              },
            ].map((metric) => (
              <div
                key={metric.title}
                className="rounded-xl border border-border/60 bg-card p-4 shadow-premium"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <p className="text-sm font-semibold text-foreground">
                    {metric.title}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {metric.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data table */}
        {records.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl border border-border/60 bg-card shadow-premium overflow-hidden"
          >
            <div className="p-5 border-b border-border/40">
              <h3 className="text-base font-semibold text-foreground">
                MRV Data Table
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Raw verification data for the past 7 days
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Baseline kWh
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Optimized kWh
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Peak Shaved
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Solar
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Comfort
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr
                      key={r.date}
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-foreground">
                        {r.date}
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground">
                        {r.baselineKwh.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-foreground font-medium">
                        {r.optimizedKwh.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-teal-600 dark:text-teal-400 font-medium">
                        {r.peakShaved}%
                      </td>
                      <td className="px-5 py-3 text-right text-amber-600 dark:text-amber-400">
                        {r.solarAbsorbed}%
                      </td>
                      <td className="px-5 py-3 text-right text-emerald-600 dark:text-emerald-400">
                        {r.comfortCompliance}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
