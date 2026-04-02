"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sun,
  Moon,
  Search,
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { LocationSwitcher } from "./LocationSwitcher";

const NAV_ITEMS = [
  { label: "Command Center", href: "/" },
  { label: "Digital Twin", href: "/digital-twin" },
  { label: "Optimization", href: "/optimization" },
  { label: "Flex Credits", href: "/flex-credits" },
  { label: "Insights", href: "/insights" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/80 backdrop-blur-xl dark:bg-[#0F1419]/80">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-500">
            <Sun className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Solaris <span className="font-light text-muted-foreground">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive
                    ? "text-teal-700 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <LocationSwitcher />

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          <button className="hidden lg:flex items-center gap-2 h-9 px-4 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors">
            <LogIn className="h-3.5 w-3.5" />
            Operator Sign In
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Search bar overlay */}
      {searchOpen && (
        <div className="border-t border-border/40 bg-white dark:bg-[#0F1419] px-4 py-3">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search sites, plants, towers, and cooling assets"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ESC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/40 bg-white dark:bg-[#0F1419] px-4 py-4">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "text-teal-700 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 pt-4 border-t border-border/40">
            <button className="w-full flex items-center justify-center gap-2 h-10 rounded-full bg-teal-600 text-white text-sm font-medium">
              <LogIn className="h-3.5 w-3.5" />
              Operator Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
