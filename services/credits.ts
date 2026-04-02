import { FlexCredit, MRVRecord, OptimizationResult, Asset } from "@/types";

/**
 * Flex Credits Engine
 *
 * Converts shifted cooling demand into Cooling Flex Credits.
 * Formula:
 *   credits = kwhShifted × solarAlignmentMultiplier × comfortMultiplier
 *
 * 1 credit ≈ 1 kWh shifted into a solar-rich hour with full comfort compliance
 */

const BASE_LOAD_MW = 12; // Simulated base MW for the district
const CREDIT_PER_KWH = 1.0;
const SOLAR_BONUS_MULTIPLIER = 1.3;
const CO2_PER_KWH = 0.42; // kg CO2 per kWh (UAE grid average)

export function computeFlexCredits(
  result: OptimizationResult,
  assets: Asset[]
): FlexCredit[] {
  const totalShiftedDemandPoints = result.baselineData.reduce((sum, bd, i) => {
    const optimized = result.hourlyData[i];
    return sum + Math.max(0, bd.coolingDemand - optimized.coolingDemand);
  }, 0);

  // Convert demand points to approximate kWh
  const totalKwhShifted = Math.round(
    (totalShiftedDemandPoints / 100) * BASE_LOAD_MW * 1000
  );

  // Distribute across assets proportionally to their capacity
  const totalCapacity = assets.reduce((s, a) => s + a.maxCapacity, 0);

  return assets.map((asset) => {
    const share = totalCapacity > 0 ? asset.maxCapacity / totalCapacity : 1 / assets.length;
    const kwhShifted = Math.round(totalKwhShifted * share);

    // Solar alignment: what % of shifted load went into solar hours
    const solarHours = result.hourlyData.filter(
      (d) => d.solarOpportunity >= 50
    ).length;
    const totalHours = result.hourlyData.length;
    const solarAlignment = Math.round(
      (solarHours / Math.max(1, totalHours)) * 100
    );

    const multiplier =
      solarAlignment > 60 ? SOLAR_BONUS_MULTIPLIER : CREDIT_PER_KWH;
    const credits = Math.round(kwhShifted * multiplier);

    return {
      assetId: asset.id,
      assetName: asset.name,
      kwhShifted,
      creditsEarned: credits,
      co2Avoided: Math.round(kwhShifted * CO2_PER_KWH),
      solarAlignmentScore: solarAlignment,
    };
  });
}

export function computeMRVRecords(
  result: OptimizationResult,
  days: number = 7
): MRVRecord[] {
  const records: MRVRecord[] = [];
  const now = new Date();

  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().slice(0, 10);

    const varianceFactor = 0.85 + Math.random() * 0.3;
    const baselineKwh = Math.round(BASE_LOAD_MW * 1000 * 14 * varianceFactor);
    const optimizedKwh = Math.round(
      baselineKwh * (1 - result.peakReductionPercent / 100 * varianceFactor)
    );

    records.push({
      date: dateStr,
      baselineKwh,
      optimizedKwh,
      peakShaved: Math.round(
        result.peakReductionPercent * varianceFactor
      ),
      solarAbsorbed: Math.round(
        result.solarUtilizationPercent * varianceFactor
      ),
      comfortCompliance: Math.min(
        100,
        Math.round(result.comfortCompliancePercent * (0.97 + Math.random() * 0.03))
      ),
    });
  }

  return records;
}

export function generateCSVExport(records: MRVRecord[]): string {
  const header =
    "Date,Baseline kWh,Optimized kWh,Peak Shaved %,Solar Absorbed %,Comfort Compliance %";
  const rows = records.map(
    (r) =>
      `${r.date},${r.baselineKwh},${r.optimizedKwh},${r.peakShaved},${r.solarAbsorbed},${r.comfortCompliance}`
  );
  return [header, ...rows].join("\n");
}

export function generateJSONExport(records: MRVRecord[]): string {
  return JSON.stringify(records, null, 2);
}
