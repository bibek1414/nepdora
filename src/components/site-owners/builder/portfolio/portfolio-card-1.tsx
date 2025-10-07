import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Tag } from "lucide-react";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PortfolioCard1Props {
  portfolio: Portfolio;
  siteUser?: string;
  showTechnologies?: boolean;
  showCategories?: boolean;
  onClick?: () => void;
}

export const PortfolioCard1: React.FC<PortfolioCard1Props> = ({
  portfolio,
  siteUser,
  showTechnologies = true,
  showCategories = true,
  onClick,
}) => {
  const portfolioImage =
    portfolio.thumbnail_image ||
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop";

  const getDetailsUrl = (): string => {
    if (siteUser) {
      return `/preview/${siteUser}/portfolio/${portfolio.slug}`;
    } else {
      return `/portfolio/${portfolio.slug}`;
    }
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
      <article className="group border-border bg-card relative overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-xl">
        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={portfolioImage}
            alt={portfolio.thumbnail_image_alt_description || portfolio.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {portfolio.project_url && (
              <a
                href={portfolio.project_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-110"
              >
                <ExternalLink className="h-4 w-4 text-gray-700" />
              </a>
            )}
            {portfolio.github_url && (
              <a
                href={portfolio.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-110"
              >
                <Github className="h-4 w-4 text-gray-700" />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category Badge */}
          {showCategories && portfolio.category && (
            <Badge
              className="mb-3"
              style={{
                background: theme.colors.secondary,
                color: theme.colors.secondaryForeground,
                fontFamily: theme.fonts.heading,
              }}
            >
              {portfolio.category.name}
            </Badge>
          )}

          {/* Title */}
          <h3
            className="mb-3 line-clamp-2 text-xl font-bold"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.heading,
            }}
          >
            {portfolio.title}
          </h3>

          {/* Description */}
          <div
            className="text-muted-foreground mb-4 line-clamp-3 text-sm"
            dangerouslySetInnerHTML={{
              __html:
                (portfolio?.meta_description
                  ? portfolio.meta_description.substring(0, 150)
                  : "No content available") + "...",
            }}
          />

          {/* Technologies */}
          {showTechnologies && portfolio.tags && portfolio.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {portfolio.tags.slice(0, 3).map(tag => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag.name}
                </Badge>
              ))}
              {portfolio.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{portfolio.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </article>
    </CardWrapper>
  );
};
