"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface MiniTrendChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniTrendChart({
  data,
  color = "#67A9AA",
  height = 40,
}: MiniTrendChartProps) {
  const chartData = data.map((value, i) => ({ i, value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`mini-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#mini-${color.replace("#", "")})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
