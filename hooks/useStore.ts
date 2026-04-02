import { create } from "zustand";
import {
  Location,
  PRESET_LOCATIONS,
  OptimizationResult,
  AIRecommendation,
  KPISummary,
  HourlyCoolingData,
} from "@/types";

interface AppState {
  location: Location;
  setLocation: (loc: Location) => void;

  isLoading: boolean;
  setLoading: (v: boolean) => void;

  error: string | null;
  setError: (e: string | null) => void;

  weatherData: HourlyCoolingData[] | null;
  setWeatherData: (data: HourlyCoolingData[] | null) => void;

  optimizationResult: OptimizationResult | null;
  setOptimizationResult: (r: OptimizationResult | null) => void;

  recommendations: AIRecommendation[];
  setRecommendations: (r: AIRecommendation[]) => void;

  kpiSummary: KPISummary | null;
  setKPISummary: (k: KPISummary | null) => void;

  showOptimized: boolean;
  toggleOptimized: () => void;

  theme: "light" | "dark";
  toggleTheme: () => void;

  // Auth
  isLoggedIn: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  location: PRESET_LOCATIONS[0],
  setLocation: (location) => set({ location }),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  weatherData: null,
  setWeatherData: (weatherData) => set({ weatherData }),

  optimizationResult: null,
  setOptimizationResult: (optimizationResult) => set({ optimizationResult }),

  recommendations: [],
  setRecommendations: (recommendations) => set({ recommendations }),

  kpiSummary: null,
  setKPISummary: (kpiSummary) => set({ kpiSummary }),

  showOptimized: true,
  toggleOptimized: () =>
    set((state) => ({ showOptimized: !state.showOptimized })),

  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  isLoggedIn: false,
  userName: null,
  login: (name) => set({ isLoggedIn: true, userName: name }),
  logout: () => set({ isLoggedIn: false, userName: null }),
}));
