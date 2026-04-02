"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HourlyCoolingData } from "@/types";

interface SolarRadiationChartProps {
  data: HourlyCoolingData[];
  height?: number;
}

export function SolarRadiationChart({
  data,
  height = 220,
}: SolarRadiationChartProps) {
  const chartData = data.map((d) => ({
    hour: d.hour,
    radiation: d.solarRadiation,
    direct: d.directRadiation,
    opportunity: d.solarOpportunity,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="directGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB923C" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#FB923C" stopOpacity={0.02} />
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
        <Area
          type="monotone"
          dataKey="radiation"
          stroke="#F59E0B"
          strokeWidth={2}
          fill="url(#solarGradient)"
          name="Total Radiation (W/m²)"
        />
        <Area
          type="monotone"
          dataKey="direct"
          stroke="#FB923C"
          strokeWidth={1.5}
          fill="url(#directGradient)"
          name="Direct Radiation (W/m²)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
