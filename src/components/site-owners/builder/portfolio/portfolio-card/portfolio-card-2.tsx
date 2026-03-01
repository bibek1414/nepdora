import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { ExternalLink, Github } from "lucide-react";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PortfolioCard2Props {
  portfolio: Portfolio;
  siteUser?: string;
  onClick?: () => void;
}

export const PortfolioCard2: React.FC<PortfolioCard2Props> = ({
  portfolio,
  siteUser,
  onClick,
}) => {
  const pathname = usePathname();
  // ✅ Fallback image
  const portfolioImage =
    portfolio.thumbnail_image ||
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop";

  // ✅ Theme handling
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/portfolio-details-draft"
      : "/portfolio-details";
    return generateLinkHref(
      `${basePath}/${portfolio.slug}`,
      siteUser,
      pathname
    );
  };

  const detailsUrl = getDetailsUrl();

  // ✅ Click handler
  const handleClick = () => {
    if (onClick) onClick();
    else window.location.href = detailsUrl;
  };

  // ✅ Wrapper (Link or Div)
  const Wrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={detailsUrl}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  return (
    <Wrapper>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white transition duration-300 dark:bg-gray-900">
        {/* Category */}
        {portfolio.category?.name && (
          <p
            className="p-2 text-xs font-semibold tracking-wide uppercase"
            style={{ color: theme.colors.primary }}
          >
            {portfolio.category.name}
          </p>
        )}

        {/* Image Section */}
        <div className="relative">
          <Image
            src={portfolioImage}
            alt={portfolio.thumbnail_image_alt_description || portfolio.title}
            width={600}
            height={400}
            className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {portfolio.project_url && (
              <a
                href={portfolio.project_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="rounded-full bg-white p-2 text-gray-900 transition hover:scale-110 dark:bg-gray-800 dark:text-gray-100"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
            {portfolio.github_url && (
              <a
                href={portfolio.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="rounded-full bg-white p-2 text-gray-900 transition hover:scale-110 dark:bg-gray-800 dark:text-gray-100"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3
            className="text-base font-semibold text-gray-900 dark:text-white"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {portfolio.title}
          </h3>

          {/* Tags */}
          {portfolio.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {portfolio.tags.map(tag => (
                <span
                  key={tag.id}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${theme.colors.primary}15`,
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
