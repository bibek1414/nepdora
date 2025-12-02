import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PageHeaderProps {
  title: string;
  currentPage: string;
}

export const InnerPageHeader = ({ title, currentPage }: PageHeaderProps) => {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#2d5a4e",
      primaryForeground: "#FFFFFF",
      secondary: "#8cc63f",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  return (
    <div className="bg-background w-full">
      <div
        className="relative mx-auto flex min-h-[200px] w-full flex-col justify-center overflow-hidden px-4 py-8 sm:h-[200px] sm:px-6 sm:py-10 md:h-[250px] md:px-8 md:py-12 lg:h-[300px] lg:px-86"
        style={{
          backgroundColor: theme.colors.primary,
        }}
      >
        {/* Optional: Subtle background decorative circle */}
        <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-5 blur-3xl sm:h-48 sm:w-48 md:h-64 md:w-64"></div>

        <div className="z-10 space-y-3 sm:space-y-4">
          {/* Main Title */}
          <h1
            className="text-2xl leading-tight font-bold tracking-wide capitalize sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
            style={{
              color: theme.colors.primaryForeground,
              fontFamily: theme.fonts.heading,
            }}
          >
            {title}
          </h1>

          {/* Breadcrumbs */}
          <div
            className="flex flex-wrap items-center gap-1.5 text-sm font-medium sm:gap-2 sm:text-base md:text-lg"
            style={{
              color: theme.colors.primaryForeground,
              opacity: 0.9,
              fontFamily: theme.fonts.body,
            }}
          >
            <Link
              href="/"
              className="transition-colors hover:opacity-80"
              style={{
                color: theme.colors.primaryForeground,
              }}
            >
              Home
            </Link>
            <ChevronRight
              className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5"
              style={{
                color: theme.colors.secondary,
              }}
            />
            <span className="break-words capitalize">{currentPage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
