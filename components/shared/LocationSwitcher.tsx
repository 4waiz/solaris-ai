"use client";

import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { PRESET_LOCATIONS, Location } from "@/types";
import { cn } from "@/lib/utils";

export function LocationSwitcher() {
  const { location, setLocation } = useStore();
  const [open, setOpen] = useState(false);
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");

  const handleSelect = (loc: Location) => {
    setLocation(loc);
    setOpen(false);
  };

  const handleCustom = () => {
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon)) {
      setLocation({
        name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
        lat,
        lon,
        timezone: "UTC",
      });
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
      >
        <MapPin className="h-3.5 w-3.5" />
        <span className="font-medium">{location.name}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-border bg-card shadow-premium-lg p-2">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              Select Location
            </div>
            {PRESET_LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                onClick={() => handleSelect(loc)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors",
                  location.name === loc.name
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400"
                    : "hover:bg-muted/60"
                )}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {loc.name}
              </button>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                Custom Coordinates
              </div>
              <div className="flex gap-1.5 px-2 py-1.5">
                <input
                  type="number"
                  placeholder="Lat"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Lon"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  onClick={handleCustom}
                  className="shrink-0 rounded-md bg-teal-600 px-2.5 py-1.5 text-xs text-white font-medium hover:bg-teal-700 transition-colors"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
