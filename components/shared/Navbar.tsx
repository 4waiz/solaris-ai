"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  Search,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Factory,
  Building2,
  Hotel,
  Store,
  Zap,
  GraduationCap,
  ArrowRight,
  Thermometer,
  BarChart3,
  Award,
  Eye,
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

const SEARCH_HINTS = [
  { icon: Factory, label: "Al Maryah District Cooling Plant", type: "Asset", href: "/digital-twin" },
  { icon: Zap, label: "Thermal Energy Storage Tank A", type: "Asset", href: "/digital-twin" },
  { icon: Building2, label: "Marina Bay Office Tower", type: "Asset", href: "/digital-twin" },
  { icon: Hotel, label: "Palm Jumeirah Grand Hotel", type: "Asset", href: "/digital-twin" },
  { icon: Store, label: "City Walk Shopping Mall", type: "Asset", href: "/digital-twin" },
  { icon: GraduationCap, label: "Knowledge Park Campus", type: "Asset", href: "/digital-twin" },
  { icon: Thermometer, label: "Cooling Demand Forecast", type: "Page", href: "/" },
  { icon: BarChart3, label: "Forecast & Optimization", type: "Page", href: "/optimization" },
  { icon: Award, label: "Flex Credits Dashboard", type: "Page", href: "/flex-credits" },
  { icon: Eye, label: "Insights & MRV Report", type: "Page", href: "/insights" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, isLoggedIn, userName, login, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredHints = useMemo(() => {
    if (!searchQuery.trim()) return SEARCH_HINTS;
    const q = searchQuery.toLowerCase();
    return SEARCH_HINTS.filter(
      (h) => h.label.toLowerCase().includes(q) || h.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // ESC to close search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearchSelect = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  const handleLogin = () => {
    if (loginUser === "awaiz" && loginPass === "1234") {
      login(loginUser);
      setLoginOpen(false);
      setLoginUser("");
      setLoginPass("");
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/80 backdrop-blur-xl dark:bg-[#0F1419]/80">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/icon.png" alt="Solaris AI" width={32} height={32} className="h-8 w-8 rounded-lg object-contain" />
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

            {isLoggedIn ? (
              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-2 h-9 px-3 rounded-full bg-teal-50 dark:bg-teal-900/20 text-sm">
                  <div className="h-6 w-6 rounded-full bg-teal-600 flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium text-teal-700 dark:text-teal-400">{userName}</span>
                </div>
                <button
                  onClick={logout}
                  className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="hidden lg:flex items-center gap-2 h-9 px-4 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Operator Sign In
              </button>
            )}

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

        {/* Search bar overlay with hints */}
        {searchOpen && (
          <div className="border-t border-border/40 bg-white dark:bg-[#0F1419] px-4 py-3">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sites, plants, towers, and cooling assets"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded border border-border/60"
                >
                  ESC
                </button>
              </div>

              {/* Search results / hints */}
              <div className="mt-2 rounded-xl border border-border/60 bg-card shadow-premium-lg overflow-hidden">
                <div className="px-4 py-2 border-b border-border/40">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {searchQuery.trim() ? `Results for "${searchQuery}"` : "Quick access"}
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {filteredHints.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No results found for &ldquo;{searchQuery}&rdquo;
                    </div>
                  ) : (
                    filteredHints.map((hint) => (
                      <button
                        key={hint.label}
                        onClick={() => handleSearchSelect(hint.href)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                          <hint.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{hint.label}</p>
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full shrink-0">
                          {hint.type}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      </button>
                    ))
                  )}
                </div>
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
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-medium text-foreground">{userName}</span>
                  </div>
                  <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground">
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-full bg-teal-600 text-white text-sm font-medium"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Operator Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => { setLoginOpen(false); setLoginError(""); }}
          />
          <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-border/60 bg-card shadow-premium-lg overflow-hidden">
            {/* Modal header */}
            <div className="relative bg-gradient-to-br from-teal-600 to-teal-700 px-6 pt-8 pb-6 text-center">
              <Image src="/icon.png" alt="Solaris AI" width={56} height={56} className="mx-auto h-14 w-14 rounded-2xl object-contain" />
              <h2 className="mt-4 text-xl font-bold text-white">Welcome back</h2>
              <p className="mt-1 text-sm text-teal-100/70">Sign in to Solaris AI operator portal</p>
              <button
                onClick={() => { setLoginOpen(false); setLoginError(""); }}
                className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6 space-y-4">
              {loginError && (
                <div className="rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 px-3 py-2 text-xs text-rose-700 dark:text-rose-400">
                  {loginError}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => { setLoginUser(e.target.value); setLoginError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter username"
                  className="w-full h-10 rounded-xl border border-border bg-muted/30 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => { setLoginPass(e.target.value); setLoginError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter password"
                  className="w-full h-10 rounded-xl border border-border bg-muted/30 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full h-10 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
