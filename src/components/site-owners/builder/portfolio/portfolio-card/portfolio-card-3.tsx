import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Tag, ChevronRight } from "lucide-react";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PortfolioCard3Props {
  portfolio: Portfolio;
  siteUser?: string;
  onClick?: () => void;
}

export const PortfolioCard3: React.FC<PortfolioCard3Props> = ({
  portfolio,
  siteUser,
  onClick,
}) => {
  const pathname = usePathname();
  const portfolioImage =
    portfolio.thumbnail_image ||
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop";

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

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  const CardWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={getDetailsUrl()}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <article className="group border-border hover:border-primary/50 flex flex-col gap-3 border-b pb-4 transition-all duration-300 sm:gap-4 sm:pb-5 md:flex-row md:gap-6 md:pb-6">
        {/* Image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-56 md:h-48 md:w-80 lg:h-56">
          <Image
            src={portfolioImage}
            alt={portfolio.thumbnail_image_alt_description || portfolio.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 320px, 320px"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between gap-3 sm:gap-4">
          <div>
            {/* Category */}
            {portfolio.category && (
              <Badge
                className="mb-2 text-xs sm:mb-3 sm:text-sm"
                style={{
                  background: theme.colors.secondary,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.heading,
                }}
              >
                {portfolio.category.name}
              </Badge>
            )}

            {/* Title */}
            <h3
              className="mb-2 text-lg leading-tight font-bold sm:mb-3 sm:text-xl md:text-2xl"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
              }}
            >
              {portfolio.title}
            </h3>

            {/* Description */}
            <div
              className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed sm:mb-4 sm:line-clamp-3 sm:text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  (portfolio?.meta_description
                    ? portfolio.meta_description.substring(0, 150)
                    : "No content available") + "...",
              }}
            />

            {/* Technologies */}
            {portfolio.tags && portfolio.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4 sm:gap-2">
                {portfolio.tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs sm:text-sm"
                  >
                    <Tag className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span className="max-w-[80px] truncate sm:max-w-none">
                      {tag.name}
                    </span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="group/btn w-full justify-start text-xs sm:w-auto sm:text-sm"
              style={{ color: theme.colors.primary }}
            >
              <span className="sm:hidden">Details</span>
              <span className="hidden sm:inline">View Details</span>
              <ChevronRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
            </Button>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {portfolio.project_url && (
                <a
                  href={portfolio.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs sm:w-auto sm:text-sm"
                  >
                    <ExternalLink className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                    <span className="sm:hidden">Demo</span>
                    <span className="hidden sm:inline">Live Demo</span>
                  </Button>
                </a>
              )}

              {portfolio.github_url && (
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs sm:w-auto sm:text-sm"
                  >
                    <Github className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                    Code
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </CardWrapper>
  );
};
