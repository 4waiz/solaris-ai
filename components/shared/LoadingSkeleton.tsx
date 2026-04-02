"use client";

import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-premium",
        className
      )}
    >
      <div className="h-3 w-24 rounded-md bg-muted animate-pulse" />
      <div className="mt-3 h-7 w-16 rounded-md bg-muted animate-pulse" />
      <div className="mt-2 h-3 w-20 rounded-md bg-muted animate-pulse" />
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-6 shadow-premium",
        className
      )}
    >
      <div className="h-4 w-32 rounded-md bg-muted animate-pulse" />
      <div className="mt-2 h-3 w-48 rounded-md bg-muted animate-pulse" />
      <div className="mt-6 flex items-end gap-2 h-48">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm bg-muted animate-pulse"
            style={{
              height: `${20 + Math.random() * 80}%`,
              animationDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function RecommendationSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/60 bg-card p-4 shadow-premium"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse" />
              <div className="h-3 w-full rounded-md bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8 space-y-6">
      <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
      <div className="h-4 w-72 rounded-md bg-muted animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartSkeleton className="lg:col-span-2" />
        <ChartSkeleton />
      </div>
    </div>
  );
}
