"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Factory,
  Battery,
  Building2,
  Hotel,
  Store,
  X,
  Activity,
  Zap,
  ShieldCheck,
  Gauge,
} from "lucide-react";
import { DEMO_ASSETS, getAssetStatusColor } from "@/services/assets";
import { Asset } from "@/types";
import { cn } from "@/lib/utils";
import { MiniTrendChart } from "@/components/charts/MiniTrendChart";
import { Badge } from "@/components/ui/badge";

const ICON_MAP: Record<Asset["type"], typeof Factory> = {
  plant: Factory,
  storage: Battery,
  office: Building2,
  hotel: Hotel,
  mall: Store,
  campus: Building2,
};

const ASSET_POSITIONS: Record<string, { x: string; y: string }> = {
  "dcp-01": { x: "50%", y: "18%" },
  "tes-01": { x: "50%", y: "45%" },
  "off-01": { x: "18%", y: "72%" },
  "htl-01": { x: "50%", y: "75%" },
  "mal-01": { x: "82%", y: "72%" },
};

const FLOW_LINES = [
  { from: "dcp-01", to: "tes-01", label: "Chilled water supply" },
  { from: "tes-01", to: "off-01", label: "Cooling distribution" },
  { from: "tes-01", to: "htl-01", label: "Cooling distribution" },
  { from: "tes-01", to: "mal-01", label: "Cooling distribution" },
];

export default function DigitalTwinPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Digital Twin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visual asset network showing real-time cooling energy flows and
            system status
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Network visualization */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-card shadow-premium overflow-hidden">
              <div className="p-4 border-b border-border/40">
                <h3 className="text-sm font-semibold text-foreground">
                  Cooling Network Topology
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click any asset to view details and recommendations
                </p>
              </div>

              {/* SVG Network Map */}
              <div className="relative w-full" style={{ paddingBottom: "65%" }}>
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 800 520"
                  fill="none"
                >
                  {/* Flow lines */}
                  <motion.line
                    x1="400" y1="130" x2="400" y2="210"
                    stroke="var(--ring)" strokeWidth="2" strokeDasharray="6 4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  <motion.line
                    x1="400" y1="280" x2="160" y2="360"
                    stroke="var(--ring)" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.6}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  />
                  <motion.line
                    x1="400" y1="280" x2="400" y2="370"
                    stroke="var(--ring)" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.6}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                  />
                  <motion.line
                    x1="400" y1="280" x2="640" y2="360"
                    stroke="var(--ring)" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.6}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />

                  {/* Flow direction indicators */}
                  <circle cx="400" cy="170" r="3" fill="var(--ring)" opacity={0.8}>
                    <animate attributeName="cy" values="140;200" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="280" cy="320" r="2.5" fill="var(--ring)" opacity={0.6}>
                    <animate attributeName="cx" values="380;180" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="290;350" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="520" cy="320" r="2.5" fill="var(--ring)" opacity={0.6}>
                    <animate attributeName="cx" values="420;620" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="290;350" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                </svg>

                {/* Asset nodes */}
                {DEMO_ASSETS.map((asset) => {
                  const pos = ASSET_POSITIONS[asset.id];
                  if (!pos) return null;
                  const Icon = ICON_MAP[asset.type];

                  return (
                    <motion.button
                      key={asset.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      onClick={() => setSelectedAsset(asset)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group"
                      style={{ left: pos.x, top: pos.y }}
                    >
                      <div
                        className={cn(
                          "flex flex-col items-center gap-1.5 rounded-2xl border bg-card p-3 shadow-premium transition-all hover:shadow-premium-lg hover:scale-105 cursor-pointer",
                          selectedAsset?.id === asset.id
                            ? "border-teal-500 ring-2 ring-teal-500/20"
                            : "border-border/60"
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/20">
                          <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-foreground text-center max-w-[100px] leading-tight">
                          {asset.name.split(" ").slice(0, 2).join(" ")}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[9px] px-1.5 py-0",
                            getAssetStatusColor(asset.status)
                          )}
                        >
                          {asset.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Asset list / detail panel */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {selectedAsset ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="rounded-2xl border border-border/60 bg-card shadow-premium overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border/40">
                    <h3 className="text-sm font-semibold text-foreground">
                      Asset Detail
                    </h3>
                    <button
                      onClick={() => setSelectedAsset(null)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted/60 text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {selectedAsset.name}
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "mt-1.5",
                          getAssetStatusColor(selectedAsset.status)
                        )}
                      >
                        {selectedAsset.status.replace("-", " ")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-muted/40 p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Zap className="h-3 w-3" />
                          Current Load
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                          {selectedAsset.currentLoad}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            MW
                          </span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          of {selectedAsset.maxCapacity} MW capacity
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/40 p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <ShieldCheck className="h-3 w-3" />
                          Comfort Score
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                          {selectedAsset.comfortScore}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          within safe range
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/40 p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Gauge className="h-3 w-3" />
                          Flexibility
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                          {selectedAsset.flexibilityScore}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          shift potential
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/40 p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Activity className="h-3 w-3" />
                          Utilization
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                          {Math.round(
                            (selectedAsset.currentLoad /
                              selectedAsset.maxCapacity) *
                              100
                          )}
                          %
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          of max capacity
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Load Trend (12h)
                      </p>
                      <MiniTrendChart
                        data={selectedAsset.trend}
                        height={60}
                      />
                    </div>

                    <div className="rounded-xl bg-teal-50/50 dark:bg-teal-900/10 border border-teal-200/30 dark:border-teal-800/20 p-3">
                      <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mb-1">
                        AI Recommendation
                      </p>
                      <p className="text-xs text-teal-600 dark:text-teal-300 leading-relaxed">
                        {selectedAsset.recommendation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    All Assets
                  </h3>
                  <div className="space-y-2.5">
                    {DEMO_ASSETS.map((asset, i) => {
                      const Icon = ICON_MAP[asset.type];
                      return (
                        <motion.button
                          key={asset.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          onClick={() => setSelectedAsset(asset)}
                          className="w-full flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 shadow-premium transition-all hover:shadow-premium-lg text-left"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20">
                            <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {asset.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {asset.currentLoad} / {asset.maxCapacity} MW
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] shrink-0",
                              getAssetStatusColor(asset.status)
                            )}
                          >
                            {asset.status.replace("-", " ")}
                          </Badge>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
