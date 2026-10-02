"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "suraj-portfolio-theme-v2";
const THEME_EVENT = "suraj-portfolio-theme-change";

function getThemeSnapshot(): Theme {
  const currentTheme = document.documentElement.dataset.theme;

  if (currentTheme === "light" || currentTheme === "dark") {
    return currentTheme;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return "light";
}

function getThemeServerSnapshot(): Theme {
  return "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(THEME_EVENT));
}

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      window.localStorage.removeItem("theme");
    } catch {
      // Theme switching still works when the browser restricts storage.
    }
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn("theme-toggle", className)}
      aria-label="Toggle color theme"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
