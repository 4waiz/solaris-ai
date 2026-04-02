"use client";

import { Sun } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-teal-600 to-teal-500">
              <Sun className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Solaris <span className="font-light text-muted-foreground">AI</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            MVP made for the{" "}
            <span className="font-medium text-foreground">DEWA CleanTech Hackathon 2026</span>
            {" "}by{" "}
            <a
              href="https://www.linkedin.com/in/awaizahmed/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              Awaiz Ahmed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
