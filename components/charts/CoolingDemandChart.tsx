"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { HourlyCoolingData } from "@/types";

interface CoolingDemandChartProps {
  data: HourlyCoolingData[];
  baselineData?: HourlyCoolingData[];
  showBaseline?: boolean;
  height?: number;
}

export function CoolingDemandChart({
  data,
  baselineData,
  showBaseline = false,
  height = 280,
}: CoolingDemandChartProps) {
  const chartData = data.map((d, i) => ({
    hour: d.hour,
    demand: d.coolingDemand,
    baseline: baselineData ? baselineData[i]?.coolingDemand : undefined,
    isPreCool: d.isPreCoolWindow,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67A9AA" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#67A9AA" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          interval={3}
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
          labelStyle={{ fontWeight: 600, marginBottom: 4 }}
        />
        <ReferenceLine y={70} stroke="#F59E0B" strokeDasharray="4 4" strokeOpacity={0.6} />
        {showBaseline && baselineData && (
          <Area
            type="monotone"
            dataKey="baseline"
            stroke="#EF4444"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#baselineGradient)"
            name="Baseline"
          />
        )}
        <Area
          type="monotone"
          dataKey="demand"
          stroke="#4E8F91"
          strokeWidth={2}
          fill="url(#demandGradient)"
          name="Cooling Demand"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
