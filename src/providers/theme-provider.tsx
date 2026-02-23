"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import {
  defaultThemeData,
  ThemeData,
} from "@/types/owner-site/components/theme";

const ThemeContext = createContext<ThemeData>(defaultThemeData);

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || defaultThemeData;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    // Apply colors to CSS variables
    if (theme.colors) {
      root.style.setProperty("--primary", theme.colors.primary);
      root.style.setProperty(
        "--primary-foreground",
        theme.colors.primaryForeground || "#FFFFFF"
      );
      root.style.setProperty("--secondary", theme.colors.secondary);
      root.style.setProperty(
        "--secondary-foreground",
        theme.colors.secondaryForeground || "#000000"
      );
      root.style.setProperty("--background", theme.colors.background);
      root.style.setProperty("--foreground", theme.colors.text);

      // Also set these for components that might use them
      // In shadcn, 'card' and 'popover' usually follow background
      root.style.setProperty("--card", theme.colors.background);
      root.style.setProperty("--card-foreground", theme.colors.text);
      root.style.setProperty("--popover", theme.colors.background);
      root.style.setProperty("--popover-foreground", theme.colors.text);
    }
  }, [theme.colors]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
