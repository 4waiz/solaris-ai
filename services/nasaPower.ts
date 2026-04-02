import { Location } from "@/types";

const BASE_URL = "https://power.larc.nasa.gov/api/temporal/hourly/point";

export interface NASAPowerData {
  parameters: {
    ALLSKY_SFC_SW_DWN: Record<string, number>;
    T2M: Record<string, number>;
    RH2M: Record<string, number>;
    CLRSKY_SFC_SW_DWN: Record<string, number>;
  };
}

export async function fetchNASAPowerData(
  location: Location,
  startDate: string, // YYYYMMDD
  endDate: string
): Promise<NASAPowerData | null> {
  try {
    const params = "ALLSKY_SFC_SW_DWN,T2M,RH2M,CLRSKY_SFC_SW_DWN";
    const url = `${BASE_URL}?parameters=${params}&community=RE&longitude=${location.lon}&latitude=${location.lat}&start=${startDate}&end=${endDate}&format=JSON`;

    const res = await fetch(url, { next: { revalidate: 86400 } });

    if (!res.ok) return null;

    const data = await res.json();
    return data.properties as NASAPowerData;
  } catch {
    return null;
  }
}

// Generate summary stats from NASA data
export function summarizeNASAData(data: NASAPowerData) {
  const swEntries = Object.values(data.parameters.ALLSKY_SFC_SW_DWN).filter(
    (v) => v > -999
  );
  const tempEntries = Object.values(data.parameters.T2M).filter(
    (v) => v > -999
  );

  return {
    avgSolarIrradiance: swEntries.length
      ? swEntries.reduce((a, b) => a + b, 0) / swEntries.length
      : 0,
    maxSolarIrradiance: swEntries.length ? Math.max(...swEntries) : 0,
    avgTemperature: tempEntries.length
      ? tempEntries.reduce((a, b) => a + b, 0) / tempEntries.length
      : 0,
    dataPoints: swEntries.length,
  };
}
