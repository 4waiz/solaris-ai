import { Asset } from "@/types";

// Seed demo asset data for the Digital Twin
export const DEMO_ASSETS: Asset[] = [
  {
    id: "dcp-01",
    name: "Al Maryah District Cooling Plant",
    type: "plant",
    status: "normal",
    currentLoad: 8.4,
    maxCapacity: 15,
    comfortScore: 97,
    flexibilityScore: 72,
    recommendation: "Optimal operating range. Consider TES charging during 11:00-14:00.",
    trend: [6.2, 6.8, 7.1, 7.5, 8.0, 8.4, 8.9, 9.2, 9.5, 9.1, 8.7, 8.4],
  },
  {
    id: "tes-01",
    name: "Thermal Energy Storage Tank A",
    type: "storage",
    status: "storage-charging",
    currentLoad: 3.2,
    maxCapacity: 8,
    comfortScore: 100,
    flexibilityScore: 88,
    recommendation: "Charging from solar surplus. Discharge scheduled for 18:00-21:00.",
    trend: [1.0, 1.5, 2.0, 2.5, 3.0, 3.2, 3.5, 4.0, 4.5, 5.0, 4.2, 3.2],
  },
  {
    id: "off-01",
    name: "Marina Bay Office Tower",
    type: "office",
    status: "pre-cooling",
    currentLoad: 2.1,
    maxCapacity: 4,
    comfortScore: 95,
    flexibilityScore: 65,
    recommendation: "Pre-cooling active. Zone temperature 1.5°C below setpoint for peak buffer.",
    trend: [1.2, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.4, 2.2, 2.0, 1.8],
  },
  {
    id: "htl-01",
    name: "Palm Jumeirah Grand Hotel",
    type: "hotel",
    status: "normal",
    currentLoad: 3.8,
    maxCapacity: 6,
    comfortScore: 98,
    flexibilityScore: 45,
    recommendation: "Guest comfort priority maintained. Limited flexibility during occupancy hours.",
    trend: [3.0, 2.8, 2.5, 2.3, 2.5, 3.0, 3.5, 3.8, 4.0, 4.2, 4.0, 3.8],
  },
  {
    id: "mal-01",
    name: "City Walk Shopping Mall",
    type: "mall",
    status: "high-load",
    currentLoad: 5.2,
    maxCapacity: 7,
    comfortScore: 92,
    flexibilityScore: 55,
    recommendation: "High occupancy detected. Maintain current cooling. Shift non-critical loads after 22:00.",
    trend: [2.5, 2.8, 3.2, 3.8, 4.5, 5.0, 5.2, 5.5, 5.3, 5.0, 4.5, 4.0],
  },
];

export function getAssetById(id: string): Asset | undefined {
  return DEMO_ASSETS.find((a) => a.id === id);
}

export function getAssetStatusColor(status: Asset["status"]): string {
  switch (status) {
    case "normal":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "pre-cooling":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400";
    case "storage-charging":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "storage-discharging":
      return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
    case "high-load":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    case "offline":
      return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
  }
}

export function getAssetTypeIcon(type: Asset["type"]): string {
  switch (type) {
    case "plant":
      return "Factory";
    case "storage":
      return "Battery";
    case "office":
      return "Building2";
    case "hotel":
      return "Hotel";
    case "mall":
      return "Store";
    case "campus":
      return "GraduationCap";
  }
}
