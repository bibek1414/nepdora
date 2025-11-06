export interface ThemeColors {
  text: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
}

export interface ThemeFonts {
  body: string;
  heading: string;
}

export interface ThemeData {
  name: string;
  fonts: ThemeFonts;
  colors: ThemeColors;
}

export interface Theme {
  id: number;
  data: {
    theme: ThemeData;
  };
}

export interface GetThemeResponse {
  data: Theme[];
  message: string;
}

export interface CreateThemeRequest {
  data: {
    theme: ThemeData;
  };
}

export interface CreateThemeResponse {
  data: Theme;
  message: string;
}

// Updated: Removed id from UpdateThemeRequest since it's passed separately
export interface UpdateThemeRequest {
  data: {
    theme: Partial<ThemeData>;
  };
}

export interface UpdateThemeResponse {
  data: Theme;
  message: string;
}

export interface DeleteThemeResponse {
  message: string;
}

// Updated default theme data
export const defaultThemeData: ThemeData = {
  name: "Default Theme",
  fonts: {
    body: "Inter",
    heading: "Poppins",
  },
  colors: {
    text: "#0F172A",
    primary: "#3B82F6",
    primaryForeground: "#FFFFFF",
    secondary: "#F59E0B",
    secondaryForeground: "#1F2937",
    background: "#FFFFFF",
  },
};
