export interface GridOptions {
  angle?: number;
  cellSize?: number;
  opacity?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface SubtitleProps {
  regular: string;
  gradient: string;
}

export interface BottomImageProps {
  light: string;
  dark: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent?: string;
}

export interface HeroSectionProps {
  className?: string;
  title?: string;
  subtitle?: SubtitleProps;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  bottomImage?: BottomImageProps;
  gridOptions?: GridOptions;
  colors?: ColorScheme;
}
