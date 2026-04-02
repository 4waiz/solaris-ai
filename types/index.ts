// Location & Configuration
export interface Location {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
}

export const PRESET_LOCATIONS: Location[] = [
  { name: "Dubai", lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai" },
  { name: "Abu Dhabi", lat: 24.4539, lon: 54.3773, timezone: "Asia/Dubai" },
  { name: "Riyadh", lat: 24.7136, lon: 46.6753, timezone: "Asia/Riyadh" },
  { name: "Doha", lat: 25.2854, lon: 51.531, timezone: "Asia/Qatar" },
];

// Weather data from Open-Meteo
export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  cloud_cover: number[];
  direct_radiation: number[];
  diffuse_radiation: number[];
  shortwave_radiation: number[];
  wind_speed_10m: number[];
}

export interface WeatherForecast {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: HourlyWeatherData;
}

// Cooling demand model output
export interface HourlyCoolingData {
  hour: string;
  time: string;
  temperature: number;
  humidity: number;
  apparentTemp: number;
  solarRadiation: number;
  directRadiation: number;
  cloudCover: number;
  windSpeed: number;
  coolingDemand: number; // 0-100
  solarOpportunity: number; // 0-100
  peakRisk: number; // 0-100
  isPreCoolWindow: boolean;
  tesAction: "idle" | "charging" | "discharging";
  comfortScore: number; // 0-100
}

// Optimizer output
export interface OptimizationResult {
  baselinePeakLoad: number;
  optimizedPeakLoad: number;
  peakReductionPercent: number;
  solarUtilizationPercent: number;
  comfortCompliancePercent: number;
  preCoolWindows: TimeWindow[];
  tesChargeWindows: TimeWindow[];
  tesDischargeWindows: TimeWindow[];
  highRiskPeriods: TimeWindow[];
  bestSolarHours: TimeWindow[];
  hourlyData: HourlyCoolingData[];
  baselineData: HourlyCoolingData[];
}

export interface TimeWindow {
  start: string;
  end: string;
  label?: string;
}

// Digital Twin assets
export type AssetStatus =
  | "normal"
  | "pre-cooling"
  | "storage-charging"
  | "storage-discharging"
  | "high-load"
  | "offline";

export interface Asset {
  id: string;
  name: string;
  type: "plant" | "storage" | "office" | "hotel" | "mall" | "campus";
  status: AssetStatus;
  currentLoad: number; // MW
  maxCapacity: number; // MW
  comfortScore: number; // 0-100
  flexibilityScore: number; // 0-100
  recommendation: string;
  trend: number[]; // last 12 hours load
}

// Flex Credits
export interface FlexCredit {
  assetId: string;
  assetName: string;
  kwhShifted: number;
  creditsEarned: number;
  co2Avoided: number; // kg
  solarAlignmentScore: number; // 0-100
}

// MRV (Measurement, Reporting, Verification)
export interface MRVRecord {
  date: string;
  baselineKwh: number;
  optimizedKwh: number;
  peakShaved: number;
  solarAbsorbed: number;
  comfortCompliance: number;
}

// AI Recommendations
export interface AIRecommendation {
  id: string;
  type: "pre-cool" | "tes-charge" | "tes-discharge" | "alert" | "info";
  title: string;
  description: string;
  timeWindow?: string;
  priority: "high" | "medium" | "low";
  icon?: string;
}

// KPI summary
export interface KPISummary {
  coolingLoadToday: number;
  coolingLoadUnit: string;
  solarWindowStart: string;
  solarWindowEnd: string;
  peakShiftPotential: number;
  comfortCompliance: number;
}
