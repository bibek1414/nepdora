import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Tag } from "lucide-react";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PortfolioCard2Props {
  portfolio: Portfolio;
  siteUser?: string;
  showTechnologies?: boolean;
  showCategories?: boolean;
  onClick?: () => void;
}

export const PortfolioCard2: React.FC<PortfolioCard2Props> = ({
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
      <article className="group transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={portfolioImage}
            alt={portfolio.thumbnail_image_alt_description || portfolio.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-full items-center justify-center gap-3">
              {portfolio.project_url && (
                <a
                  href={portfolio.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"
                >
                  <ExternalLink className="h-5 w-5 text-gray-700" />
                </a>
              )}
              {portfolio.github_url && (
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"
                >
                  <Github className="h-5 w-5 text-gray-700" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div>
          {/* Category */}
          {showCategories && portfolio.category && (
            <div className="mb-2">
              <Badge
                variant="secondary"
                className="text-xs"
                style={{
                  background: theme.colors.secondary,
                  color: theme.colors.secondaryForeground,
                  fontFamily: theme.fonts.heading,
                }}
              >
                {portfolio.category.name}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h3
            className="mb-2 line-clamp-1 text-lg font-bold"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.heading,
            }}
          >
            {portfolio.title}
          </h3>

          {/* Technologies */}
          {showTechnologies && portfolio.tags && portfolio.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {portfolio.tags.slice(0, 2).map(tag => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  <Tag className="mr-1 h-2.5 w-2.5" />
                  {tag.name}
                </Badge>
              ))}
              {portfolio.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{portfolio.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </article>
    </CardWrapper>
  );
};
