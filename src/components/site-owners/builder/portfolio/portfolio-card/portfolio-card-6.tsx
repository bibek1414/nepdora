"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ChevronRight } from "lucide-react";

interface PortfolioCard6Props {
  portfolio: Portfolio;
  isEditable?: boolean;
  siteUser?: string;
  onClick?: () => void;
}

export const PortfolioCard6: React.FC<PortfolioCard6Props> = ({
  portfolio,
  isEditable = false,
  siteUser,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const pathname = usePathname();
  const portfolioImage =
    portfolio.thumbnail_image || "/fallback/image-not-found.png";

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
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const handleClick = () => {
    if (isEditable) return;
    if (onClick) {
      onClick();
    } else {
      window.location.href = getDetailsUrl();
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => !isEditable && setIsHovered(true)}
      onMouseLeave={() => !isEditable && setIsHovered(false)}
      className={`animate-in fade-in slide-in-from-bottom-8 flex flex-col gap-6 duration-1000 ${
        isEditable ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <div
        className={`bg-muted relative aspect-16/10 overflow-hidden rounded-2xl shadow-sm transition-all duration-500 ${
          isHovered ? "shadow-xl" : ""
        }`}
      >
        <Image
          unoptimized
          src={portfolioImage}
          alt={portfolio.title}
          fill
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-105" : ""
          }`}
        />
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isHovered ? "bg-black/5" : "bg-black/0"
          }`}
        />
      </div>

      <div className="flex flex-col gap-3 px-1">
        <div className="flex items-start justify-between gap-4">
          <h3
            className="text-2xl leading-tight font-normal tracking-tight md:text-3xl"
            style={{ fontFamily: theme?.fonts?.heading }}
          >
            {portfolio.title}
          </h3>
          <div
            className={`border-border flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              isHovered
                ? "bg-primary border-primary text-primary-foreground"
                : ""
            }`}
            style={{
              backgroundColor: isHovered ? theme?.colors?.primary : undefined,
              borderColor: isHovered ? theme?.colors?.primary : undefined,
              color: isHovered ? theme?.colors?.primaryForeground : undefined,
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>

        {portfolio.meta_description && (
          <p
            className="text-muted-foreground line-clamp-2 max-w-2xl text-lg leading-relaxed"
            style={{ fontFamily: theme?.fonts?.body }}
          >
            {portfolio.meta_description}
          </p>
        )}
      </div>
    </div>
  );
};
