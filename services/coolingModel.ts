import { HourlyCoolingData, HourlyWeatherData } from "@/types";

/**
 * Cooling Demand Model
 *
 * Computes hourly cooling demand score (0-100) using:
 * - Temperature (dominant factor, ~50% weight)
 * - Humidity (secondary, ~20% weight)
 * - Solar radiation (drives solar heat gain, ~20% weight)
 * - Apparent temperature penalty (~10% weight)
 *
 * Thresholds calibrated for Gulf climate:
 * - Below 25°C: minimal cooling
 * - 25-35°C: moderate cooling
 * - 35-45°C: heavy cooling
 * - Above 45°C: extreme cooling
 */

const TEMP_MIN = 22; // Below this, no cooling needed
const TEMP_MAX = 48; // At this, cooling demand is maxed
const HUMIDITY_THRESHOLD = 60; // Above this, humidity adds load
const RADIATION_MAX = 1000; // W/m² max expected

export function computeHourlyCoolingData(
  weather: HourlyWeatherData
): HourlyCoolingData[] {
  const hours = weather.time.length;
  const result: HourlyCoolingData[] = [];

  for (let i = 0; i < hours; i++) {
    const temp = weather.temperature_2m[i];
    const humidity = weather.relative_humidity_2m[i];
    const apparentTemp = weather.apparent_temperature[i];
    const solarRad = weather.shortwave_radiation[i];
    const directRad = weather.direct_radiation[i];
    const cloudCover = weather.cloud_cover[i];
    const windSpeed = weather.wind_speed_10m[i];

    // Temperature component (0-100)
    const tempScore = Math.max(
      0,
      Math.min(100, ((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100)
    );

    // Humidity component (0-100)
    const humidityScore =
      humidity > HUMIDITY_THRESHOLD
        ? Math.min(100, ((humidity - HUMIDITY_THRESHOLD) / 40) * 100)
        : 0;

    // Solar radiation component (0-100)
    const solarScore = Math.min(100, (solarRad / RADIATION_MAX) * 100);

    // Apparent temperature penalty
    const apparentPenalty = Math.max(0, (apparentTemp - temp) * 3);

    // Combined cooling demand
    const coolingDemand = Math.round(
      Math.min(
        100,
        tempScore * 0.5 + humidityScore * 0.2 + solarScore * 0.2 + apparentPenalty * 0.1
      )
    );

    // Solar opportunity: high when radiation is high
    const solarOpportunity = Math.round(
      Math.min(100, (directRad / RADIATION_MAX) * 120)
    );

    // Peak risk: high demand + low solar
    const peakRisk = Math.round(
      Math.min(100, coolingDemand * (1 - solarOpportunity / 200))
    );

    const timeStr = weather.time[i];
    const d = new Date(timeStr);
    const hourLabel = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Dubai",
    });

    result.push({
      hour: hourLabel,
      time: timeStr,
      temperature: temp,
      humidity,
      apparentTemp,
      solarRadiation: solarRad,
      directRadiation: directRad,
      cloudCover,
      windSpeed,
      coolingDemand,
      solarOpportunity,
      peakRisk,
      isPreCoolWindow: false,
      tesAction: "idle",
      comfortScore: 100,
    });
  }

  return result;
}

// Comfort score: 100 means fully comfortable, decreases if demand is unmet
export function computeComfortScore(
  demand: number,
  capacityUtilization: number
): number {
  if (capacityUtilization >= demand) return 100;
  const gap = demand - capacityUtilization;
  return Math.max(0, Math.round(100 - gap * 1.5));
}
