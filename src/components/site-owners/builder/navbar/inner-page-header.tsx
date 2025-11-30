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
    <div className="bg-background w-full px-4 pb-8 sm:px-6 lg:px-8">
      <div
        className="relative mx-auto flex h-[300px] w-full max-w-7xl flex-col justify-center overflow-hidden rounded-[30px] px-6 md:h-[400px] md:rounded-[50px] md:px-20"
        style={{
          backgroundColor: theme.colors.primary,
        }}
      >
        {/* Optional: Subtle background decorative circle */}
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-5 blur-3xl"></div>

        <div className="z-10 space-y-4">
          {/* Main Title */}
          <h1
            className="text-4xl font-bold tracking-wide capitalize md:text-5xl lg:text-6xl"
            style={{
              color: theme.colors.primaryForeground,
              fontFamily: theme.fonts.heading,
            }}
          >
            {title}
          </h1>

          {/* Breadcrumbs */}
          <div
            className="flex items-center gap-2 text-base font-medium md:text-lg"
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
              className="h-4 w-4 md:h-5 md:w-5"
              style={{
                color: theme.colors.secondary,
              }}
            />
            <span className="capitalize">{currentPage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
