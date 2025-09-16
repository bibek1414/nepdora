export interface ThemeColors {
  text: string;
  primary: string;
  secondary: string;
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

export interface UpdateThemeRequest {
  id: number;
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

// Default theme data
export const defaultThemeData: ThemeData = {
  name: "Default Theme",
  fonts: {
    body: "Inter",
    heading: "Poppins",
  },
  colors: {
    text: "#111827",
    primary: "#1E40AF",
    secondary: "#FACC15",
    background: "#FFFFFF",
  },
};
