"use client";

import { motion } from "framer-motion";
import {
  Snowflake,
  BatteryCharging,
  BatteryFull,
  AlertTriangle,
  Info,
} from "lucide-react";
import { AIRecommendation } from "@/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<AIRecommendation["type"], typeof Snowflake> = {
  "pre-cool": Snowflake,
  "tes-charge": BatteryCharging,
  "tes-discharge": BatteryFull,
  alert: AlertTriangle,
  info: Info,
};

const PRIORITY_STYLES: Record<AIRecommendation["priority"], string> = {
  high: "border-l-teal-600 dark:border-l-teal-400",
  medium: "border-l-amber-500 dark:border-l-amber-400",
  low: "border-l-gray-300 dark:border-l-gray-600",
};

const ICON_BG: Record<AIRecommendation["type"], string> = {
  "pre-cool": "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
  "tes-charge":
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  "tes-discharge":
    "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
  alert: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  info: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400",
};

interface RecommendationPanelProps {
  recommendations: AIRecommendation[];
  title?: string;
}

export function RecommendationPanel({
  recommendations,
  title = "AI Recommendations",
}: RecommendationPanelProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-2.5">
        {recommendations.map((rec, i) => {
          const Icon = ICON_MAP[rec.type];
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={cn(
                "rounded-xl border border-border/60 border-l-[3px] bg-card p-3.5 shadow-premium transition-shadow hover:shadow-premium-lg cursor-default",
                PRIORITY_STYLES[rec.priority]
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    ICON_BG[rec.type]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {rec.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
