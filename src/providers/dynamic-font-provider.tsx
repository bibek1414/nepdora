"use client";

import { extractSubdomain } from "@/config/site";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import React, { createContext, useContext, useEffect, useState } from "react";

interface DynamicFontContextType {
  bodyFont: string;
  headingFont: string;
}

const DynamicFontContext = createContext<DynamicFontContextType>({
  bodyFont: "Inter",
  headingFont: "Inter",
});

export const useDynamicFonts = () => useContext(DynamicFontContext);

export function DynamicFontProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isPathPreview, setIsPathPreview] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      setSubdomain(extractSubdomain(url));
      setIsPathPreview(url.pathname.startsWith("/preview"));
    }
  }, []);

  const hasSubdomain = Boolean(subdomain);
  const status = isPathPreview ? "preview" : "published";
  const { data: themeResponse } = useThemeQuery(hasSubdomain, status);

  // Get theme fonts, fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    fonts: {
      body: "Inter",
      heading: "Inter",
    },
  };

  const bodyFont = theme.fonts?.body || "Inter";
  const headingFont = theme.fonts?.heading || "Inter";

  useEffect(() => {
    // Dynamically load Google Fonts
    const loadGoogleFont = (fontName: string) => {
      const formattedFontName = fontName.replace(/\s+/g, "+");
      const fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFontName}:wght@400;500;600;700&display=swap`;

      // Check if font is already loaded
      const existingLink = document.querySelector(
        `link[href*="${formattedFontName}"]`
      );
      if (!existingLink) {
        const link = document.createElement("link");
        link.href = fontUrl;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    };

    // Load both fonts
    if (bodyFont && bodyFont !== "Inter") loadGoogleFont(bodyFont);
    if (headingFont && headingFont !== "Inter" && headingFont !== bodyFont) {
      loadGoogleFont(headingFont);
    }

    // Apply fonts to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty("--font-body", `'${bodyFont}', sans-serif`);
    root.style.setProperty("--font-heading", `'${headingFont}', sans-serif`);
    // Also override Tailwind's default sans font variable if it's being used
    root.style.setProperty("--font-sans", `'${bodyFont}', sans-serif`);

    // Apply to body as backup
    document.body.style.fontFamily = `'${bodyFont}', sans-serif`;
  }, [bodyFont, headingFont]);

  const contextValue = {
    bodyFont,
    headingFont,
  };

  return (
    <DynamicFontContext.Provider value={contextValue}>
      {children}
    </DynamicFontContext.Provider>
  );
}
