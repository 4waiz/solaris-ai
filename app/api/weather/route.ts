import { NextRequest, NextResponse } from "next/server";
import { generateMockWeatherData } from "@/services/openMeteo";

const HOURLY_PARAMS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "cloud_cover",
  "direct_radiation",
  "diffuse_radiation",
  "shortwave_radiation",
  "wind_speed_10m",
].join(",");

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = searchParams.get("lat") || "25.2048";
  const lon = searchParams.get("lon") || "55.2708";
  const tz = searchParams.get("tz") || "Asia/Dubai";
  const days = searchParams.get("days") || "2";

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${HOURLY_PARAMS}&timezone=${encodeURIComponent(tz)}&forecast_days=${days}`;

    const res = await fetch(url, { next: { revalidate: 1800 } });

    if (!res.ok) {
      throw new Error(`Open-Meteo returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather API error, using mock data:", error);
    // Fallback to mock data
    const mockData = generateMockWeatherData(parseInt(days) * 24);
    return NextResponse.json({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      timezone: tz,
      hourly: mockData,
    });
  }
}
