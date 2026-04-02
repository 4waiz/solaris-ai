import {
  HourlyCoolingData,
  OptimizationResult,
  TimeWindow,
  AIRecommendation,
  KPISummary,
} from "@/types";

/**
 * Solaris AI Optimizer
 *
 * Takes hourly cooling data and produces an optimized schedule:
 * 1. Identifies solar-rich hours for TES charging
 * 2. Identifies peak-risk periods for TES discharging
 * 3. Schedules pre-cooling windows before peak-risk
 * 4. Ensures comfort compliance throughout
 *
 * The optimizer shifts load from peak-risk hours into solar-rich hours.
 */

const SOLAR_THRESHOLD = 50; // solarOpportunity above this = good solar hour
const PEAK_RISK_THRESHOLD = 55; // peakRisk above this = risky
const PRE_COOL_LEAD_HOURS = 2; // Pre-cool starts 2 hours before peak risk
const COMFORT_FLOOR = 85; // Never let comfort drop below this
const MAX_SHIFT_PERCENT = 25; // Maximum % of demand that can be shifted per hour

export function runOptimizer(
  baselineData: HourlyCoolingData[]
): OptimizationResult {
  const optimized = baselineData.map((d) => ({ ...d }));

  // Step 1: Identify solar-rich hours
  const bestSolarHours: TimeWindow[] = [];
  let solarStart: string | null = null;

  for (let i = 0; i < optimized.length; i++) {
    if (optimized[i].solarOpportunity >= SOLAR_THRESHOLD) {
      if (!solarStart) solarStart = optimized[i].time;
    } else if (solarStart) {
      bestSolarHours.push({
        start: solarStart,
        end: optimized[i - 1].time,
        label: "High Solar Window",
      });
      solarStart = null;
    }
  }
  if (solarStart) {
    bestSolarHours.push({
      start: solarStart,
      end: optimized[optimized.length - 1].time,
      label: "High Solar Window",
    });
  }

  // Step 2: Identify peak-risk periods
  const highRiskPeriods: TimeWindow[] = [];
  let riskStart: string | null = null;

  for (let i = 0; i < optimized.length; i++) {
    if (optimized[i].peakRisk >= PEAK_RISK_THRESHOLD) {
      if (!riskStart) riskStart = optimized[i].time;
    } else if (riskStart) {
      highRiskPeriods.push({
        start: riskStart,
        end: optimized[i - 1].time,
        label: "Peak Risk Window",
      });
      riskStart = null;
    }
  }
  if (riskStart) {
    highRiskPeriods.push({
      start: riskStart,
      end: optimized[optimized.length - 1].time,
      label: "Peak Risk Window",
    });
  }

  // Step 3: Schedule TES charging during solar hours
  const tesChargeWindows: TimeWindow[] = [];
  for (const solar of bestSolarHours) {
    tesChargeWindows.push({
      start: solar.start,
      end: solar.end,
      label: "TES Charging (Solar)",
    });
  }

  // Mark TES charging in data
  for (let i = 0; i < optimized.length; i++) {
    if (optimized[i].solarOpportunity >= SOLAR_THRESHOLD && optimized[i].coolingDemand < 70) {
      optimized[i].tesAction = "charging";
    }
  }

  // Step 4: Schedule TES discharging during peak-risk
  const tesDischargeWindows: TimeWindow[] = [];
  for (const risk of highRiskPeriods) {
    tesDischargeWindows.push({
      start: risk.start,
      end: risk.end,
      label: "TES Discharging (Peak Offset)",
    });
  }

  // Mark TES discharging in data
  for (let i = 0; i < optimized.length; i++) {
    if (optimized[i].peakRisk >= PEAK_RISK_THRESHOLD) {
      optimized[i].tesAction = "discharging";
      // Reduce effective demand by shifting load
      const shiftAmount = Math.round(
        optimized[i].coolingDemand * (MAX_SHIFT_PERCENT / 100)
      );
      optimized[i].coolingDemand = Math.max(0, optimized[i].coolingDemand - shiftAmount);
    }
  }

  // Step 5: Schedule pre-cooling windows
  const preCoolWindows: TimeWindow[] = [];
  const preCoolIndices = new Set<number>();

  for (let i = 0; i < optimized.length; i++) {
    if (optimized[i].peakRisk >= PEAK_RISK_THRESHOLD) {
      // Mark preceding hours as pre-cool
      for (let j = Math.max(0, i - PRE_COOL_LEAD_HOURS); j < i; j++) {
        if (!preCoolIndices.has(j)) {
          preCoolIndices.add(j);
          optimized[j].isPreCoolWindow = true;
          // Pre-cooling slightly increases demand in these hours
          optimized[j].coolingDemand = Math.min(
            100,
            optimized[j].coolingDemand + 8
          );
        }
      }
    }
  }

  // Build pre-cool windows
  const sortedPcIndices = Array.from(preCoolIndices).sort((a, b) => a - b);
  if (sortedPcIndices.length > 0) {
    let pcStart = sortedPcIndices[0];
    for (let k = 1; k < sortedPcIndices.length; k++) {
      if (sortedPcIndices[k] !== sortedPcIndices[k - 1] + 1) {
        preCoolWindows.push({
          start: optimized[pcStart].time,
          end: optimized[sortedPcIndices[k - 1]].time,
          label: "Pre-Cooling Window",
        });
        pcStart = sortedPcIndices[k];
      }
    }
    preCoolWindows.push({
      start: optimized[pcStart].time,
      end: optimized[sortedPcIndices[sortedPcIndices.length - 1]].time,
      label: "Pre-Cooling Window",
    });
  }

  // Step 6: Comfort guard
  for (let i = 0; i < optimized.length; i++) {
    const comfortScore = Math.max(
      COMFORT_FLOOR,
      100 - Math.max(0, optimized[i].coolingDemand - 80) * 2
    );
    optimized[i].comfortScore = comfortScore;
  }

  // Calculate peak metrics
  const baselinePeak = Math.max(...baselineData.map((d) => d.coolingDemand));
  const optimizedPeak = Math.max(...optimized.map((d) => d.coolingDemand));
  const peakReduction = baselinePeak > 0
    ? Math.round(((baselinePeak - optimizedPeak) / baselinePeak) * 100)
    : 0;

  // Solar utilization
  const solarHoursCount = optimized.filter(
    (d) => d.solarOpportunity >= SOLAR_THRESHOLD
  ).length;
  const totalDaylightHours = optimized.filter(
    (d) => d.solarOpportunity > 0
  ).length;
  const solarUtil = totalDaylightHours > 0
    ? Math.round((solarHoursCount / totalDaylightHours) * 100)
    : 0;

  // Comfort compliance
  const comfortCompliant = optimized.filter(
    (d) => d.comfortScore >= COMFORT_FLOOR
  ).length;
  const comfortCompliance = Math.round((comfortCompliant / optimized.length) * 100);

  return {
    baselinePeakLoad: baselinePeak,
    optimizedPeakLoad: optimizedPeak,
    peakReductionPercent: peakReduction,
    solarUtilizationPercent: solarUtil,
    comfortCompliancePercent: comfortCompliance,
    preCoolWindows,
    tesChargeWindows,
    tesDischargeWindows,
    highRiskPeriods,
    bestSolarHours,
    hourlyData: optimized,
    baselineData,
  };
}

// Generate AI recommendations from optimization results
export function generateRecommendations(
  result: OptimizationResult
): AIRecommendation[] {
  const recs: AIRecommendation[] = [];

  // Pre-cooling recommendations
  for (const w of result.preCoolWindows.slice(0, 2)) {
    const startHour = new Date(w.start).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    recs.push({
      id: `precool-${w.start}`,
      type: "pre-cool",
      title: `Pre-cool Office Cluster at ${startHour}`,
      description: `Start pre-cooling before peak demand window to reduce peak load by up to ${result.peakReductionPercent}%.`,
      timeWindow: `${w.start} — ${w.end}`,
      priority: "high",
    });
  }

  // TES charge
  if (result.tesChargeWindows.length > 0) {
    const w = result.tesChargeWindows[0];
    const start = new Date(w.start).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const end = new Date(w.end).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    recs.push({
      id: `tes-charge-${w.start}`,
      type: "tes-charge",
      title: `Charge TES from ${start}–${end}`,
      description: `Solar generation is high during this window. Store thermal energy for evening discharge.`,
      timeWindow: `${w.start} — ${w.end}`,
      priority: "high",
    });
  }

  // TES discharge
  if (result.tesDischargeWindows.length > 0) {
    const w = result.tesDischargeWindows[0];
    const start = new Date(w.start).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const end = new Date(w.end).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    recs.push({
      id: `tes-discharge-${w.start}`,
      type: "tes-discharge",
      title: `Discharge TES from ${start}–${end}`,
      description: `Deploy stored thermal energy to offset peak demand and reduce grid stress.`,
      timeWindow: `${w.start} — ${w.end}`,
      priority: "medium",
    });
  }

  // Comfort info
  if (result.comfortCompliancePercent >= 95) {
    recs.push({
      id: "comfort-ok",
      type: "info",
      title: "No comfort risk detected",
      description: `Comfort compliance is at ${result.comfortCompliancePercent}%. All zones within safe thresholds.`,
      priority: "low",
    });
  } else {
    recs.push({
      id: "comfort-warn",
      type: "alert",
      title: "Comfort risk in some zones",
      description: `Comfort compliance at ${result.comfortCompliancePercent}%. Monitor closely during peak hours.`,
      priority: "high",
    });
  }

  return recs;
}

// Generate KPI summary
export function generateKPISummary(
  result: OptimizationResult
): KPISummary {
  const avgDemand = Math.round(
    result.hourlyData.reduce((s, d) => s + d.coolingDemand, 0) /
      result.hourlyData.length
  );

  const solarWindow = result.bestSolarHours[0];
  let solarStart = "10:00";
  let solarEnd = "15:00";
  if (solarWindow) {
    solarStart = new Date(solarWindow.start).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    solarEnd = new Date(solarWindow.end).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return {
    coolingLoadToday: avgDemand,
    coolingLoadUnit: "avg score",
    solarWindowStart: solarStart,
    solarWindowEnd: solarEnd,
    peakShiftPotential: result.peakReductionPercent,
    comfortCompliance: result.comfortCompliancePercent,
  };
}
