"use client";

import { useEffect, useCallback } from "react";
import { useStore } from "./useStore";
import { computeHourlyCoolingData } from "@/services/coolingModel";
import {
  runOptimizer,
  generateRecommendations,
  generateKPISummary,
} from "@/services/optimizer";

export function useWeatherData() {
  const {
    location,
    setLoading,
    setError,
    setWeatherData,
    setOptimizationResult,
    setRecommendations,
    setKPISummary,
  } = useStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/weather?lat=${location.lat}&lon=${location.lon}&tz=${encodeURIComponent(location.timezone)}`
      );

      if (!res.ok) throw new Error("Weather API failed");

      const weatherData = await res.json();
      const coolingData = computeHourlyCoolingData(weatherData.hourly);

      setWeatherData(coolingData);

      const optResult = runOptimizer(coolingData);
      setOptimizationResult(optResult);

      const recs = generateRecommendations(optResult);
      setRecommendations(recs);

      const kpis = generateKPISummary(optResult);
      setKPISummary(kpis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      // Use mock data on failure
      try {
        const { generateMockWeatherData } = await import(
          "@/services/openMeteo"
        );
        const mockWeather = generateMockWeatherData(48);
        const coolingData = computeHourlyCoolingData(mockWeather);
        setWeatherData(coolingData);

        const optResult = runOptimizer(coolingData);
        setOptimizationResult(optResult);
        setRecommendations(generateRecommendations(optResult));
        setKPISummary(generateKPISummary(optResult));
      } catch {
        // Silent fallback failure
      }
    } finally {
      setLoading(false);
    }
  }, [
    location,
    setLoading,
    setError,
    setWeatherData,
    setOptimizationResult,
    setRecommendations,
    setKPISummary,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { refetch: fetchData };
}
