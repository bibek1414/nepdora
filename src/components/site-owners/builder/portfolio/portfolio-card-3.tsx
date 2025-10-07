import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Tag, ArrowRight } from "lucide-react";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PortfolioCard3Props {
  portfolio: Portfolio;
  siteUser?: string;
  showTechnologies?: boolean;
  showCategories?: boolean;
  onClick?: () => void;
}

export const PortfolioCard3: React.FC<PortfolioCard3Props> = ({
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
      <article className="group border-border hover:border-primary/50 flex flex-col gap-6 border-b pb-6 transition-all duration-300 md:flex-row">
        {/* Image */}
        <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-lg md:h-48 md:w-80">
          <Image
            src={portfolioImage}
            alt={portfolio.thumbnail_image_alt_description || portfolio.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {/* Category */}
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
              className="mb-3 text-2xl font-bold"
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
            {showTechnologies &&
              portfolio.tags &&
              portfolio.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {portfolio.tags.map(tag => (
                    <Badge key={tag.id} variant="outline">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="group/btn"
              style={{ color: theme.colors.primary }}
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>

            {portfolio.project_url && (
              <a
                href={portfolio.project_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </Button>
              </a>
            )}

            {portfolio.github_url && (
              <a
                href={portfolio.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                <Button variant="outline" size="sm">
                  <Github className="mr-2 h-4 w-4" />
                  Code
                </Button>
              </a>
            )}
          </div>
        </div>
      </article>
    </CardWrapper>
  );
};
