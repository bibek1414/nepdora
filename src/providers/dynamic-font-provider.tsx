"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

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
  const { data: themeResponse } = useThemeQuery();

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
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap`;

      // Check if font is already loaded
      const existingLink = document.querySelector(
        `link[href*="${fontName.replace(/\s+/g, "+")}"]`
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
    document.documentElement.style.setProperty(
      "--font-body",
      `'${bodyFont}', sans-serif`
    );
    document.documentElement.style.setProperty(
      "--font-heading",
      `'${headingFont}', sans-serif`
    );

    // Apply to body
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
