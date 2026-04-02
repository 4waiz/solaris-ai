"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HourlyCoolingData } from "@/types";

interface TemperatureChartProps {
  data: HourlyCoolingData[];
  height?: number;
}

export function TemperatureChart({
  data,
  height = 220,
}: TemperatureChartProps) {
  const chartData = data.map((d) => ({
    hour: d.hour,
    temperature: d.temperature,
    apparent: d.apparentTemp,
    humidity: d.humidity,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
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
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#EF4444"
          strokeWidth={2}
          dot={false}
          name="Temperature (°C)"
        />
        <Line
          type="monotone"
          dataKey="apparent"
          stroke="#F97316"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          name="Feels Like (°C)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
