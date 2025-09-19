// "use client";

// import React, { createContext, useContext } from "react";
// import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

// interface ThemeContextType {
//   colors: {
//     text: string;
//     primary: string;
//     secondary: string;
//     background: string;
//   };
//   fonts: {
//     body: string;
//     heading: string;
//   };
// }

// const defaultTheme: ThemeContextType = {
//   colors: {
//     text: "#111827",
//     primary: "#1E40AF",
//     secondary: "#FACC15",
//     background: "#FFFFFF",
//   },
//   fonts: {
//     body: "Inter",
//     heading: "Inter",
//   },
// };

// const ThemeContext = createContext<ThemeContextType>(defaultTheme);

// export const useTheme = () => useContext(ThemeContext);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const { data: themeResponse } = useThemeQuery();

//   const theme = themeResponse?.data?.[0]?.data?.theme || defaultTheme;

//   return (
//     <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
//   );
// }
