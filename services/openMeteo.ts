import { WeatherForecast, Location, HourlyWeatherData } from "@/types";

const BASE_URL = "https://api.open-meteo.com/v1";

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

export async function fetchWeatherForecast(
  location: Location,
  forecastDays: number = 2
): Promise<WeatherForecast> {
  const url = `${BASE_URL}/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=${HOURLY_PARAMS}&timezone=${encodeURIComponent(location.timezone)}&forecast_days=${forecastDays}`;

  const res = await fetch(url, { next: { revalidate: 1800 } });

  if (!res.ok) {
    throw new Error(`Open-Meteo forecast failed: ${res.status}`);
  }

  return res.json();
}

export async function fetchHistoricalWeather(
  location: Location,
  startDate: string,
  endDate: string
): Promise<WeatherForecast> {
  const url = `${BASE_URL}/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=${HOURLY_PARAMS}&timezone=${encodeURIComponent(location.timezone)}&start_date=${startDate}&end_date=${endDate}&past_days=0`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Open-Meteo historical failed: ${res.status}`);
  }

  return res.json();
}

// Generate mock data as fallback
export function generateMockWeatherData(hours: number = 48): HourlyWeatherData {
  const now = new Date();
  now.setMinutes(0, 0, 0);

  const time: string[] = [];
  const temperature_2m: number[] = [];
  const relative_humidity_2m: number[] = [];
  const apparent_temperature: number[] = [];
  const cloud_cover: number[] = [];
  const direct_radiation: number[] = [];
  const diffuse_radiation: number[] = [];
  const shortwave_radiation: number[] = [];
  const wind_speed_10m: number[] = [];

  for (let i = 0; i < hours; i++) {
    const d = new Date(now.getTime() + i * 3600000);
    const hour = d.getHours();

    time.push(d.toISOString().slice(0, 16));

    // Dubai-realistic temperature curve
    const baseTemp = 35 + 8 * Math.sin(((hour - 6) / 24) * Math.PI * 2);
    temperature_2m.push(Math.round((baseTemp + (Math.random() - 0.5) * 3) * 10) / 10);

    const hum = 45 + 20 * Math.cos(((hour - 6) / 24) * Math.PI * 2) + (Math.random() - 0.5) * 10;
    relative_humidity_2m.push(Math.round(Math.max(20, Math.min(90, hum))));

    apparent_temperature.push(Math.round((baseTemp + 3 + (Math.random() - 0.5) * 2) * 10) / 10);

    cloud_cover.push(Math.round(Math.max(0, Math.min(100, 15 + (Math.random() - 0.5) * 30))));

    // Solar radiation peaks at midday
    const solarBase = hour >= 6 && hour <= 18
      ? 800 * Math.sin(((hour - 6) / 12) * Math.PI)
      : 0;
    direct_radiation.push(Math.round(Math.max(0, solarBase * (0.8 + Math.random() * 0.2))));
    diffuse_radiation.push(Math.round(Math.max(0, solarBase * 0.15 * (0.8 + Math.random() * 0.2))));
    shortwave_radiation.push(Math.round(Math.max(0, solarBase * 1.1 * (0.8 + Math.random() * 0.2))));

    wind_speed_10m.push(Math.round((8 + (Math.random() - 0.5) * 6) * 10) / 10);
  }

  return {
    time,
    temperature_2m,
    relative_humidity_2m,
    apparent_temperature,
    cloud_cover,
    direct_radiation,
    diffuse_radiation,
    shortwave_radiation,
    wind_speed_10m,
  };
}
