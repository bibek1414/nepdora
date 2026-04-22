"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ChevronRight } from "lucide-react";

interface PortfolioCard7Props {
  portfolio: Portfolio;
  isEditable?: boolean;
  siteUser?: string;
  onClick?: () => void;
  index: number;
}

export const PortfolioCard7: React.FC<PortfolioCard7Props> = ({
  portfolio,
  isEditable = false,
  siteUser,
  onClick,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

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

  const handleClick = () => {
    if (isEditable) return;
    if (onClick) {
      onClick();
    } else {
      window.location.href = getDetailsUrl();
    }
  };

  const portfolioImage =
    portfolio.thumbnail_image || "/fallback/image-not-found.png";
  const categoryName = portfolio.category?.name || "Project";

  return (
    <div
      onClick={handleClick}
      className={`group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 ${isEditable ? "cursor-default" : "cursor-pointer"}`}
    >
      {/* Top Section: Image with Overlay */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          unoptimized
          src={portfolioImage}
          alt={portfolio.title}
          fill
          className={`object-cover transition-transform duration-700`}
        />
        <div className="absolute inset-0 bg-black/20 transition-colors hover:bg-black/40" />
        <div className="absolute bottom-0 left-0 p-8">
          <span
            className="drop--md text-3xl font-normal tracking-tight text-white"
            style={{ fontFamily: theme?.fonts?.heading }}
          >
            {portfolio.title.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Bottom Section: Info */}
      <div className="flex flex-col p-6">
        <span
          className="text-xs tracking-wider text-gray-400 uppercase"
          style={{ fontFamily: theme?.fonts?.body }}
        >
          {categoryName}
        </span>
        <h3
          className={`mt-2 text-lg font-normal transition-colors duration-200`}
          style={{
            fontFamily: theme?.fonts?.heading,
          }}
        >
          {portfolio.title}
        </h3>
        <div className="text-primary mt-4 flex items-center gap-1.5 text-sm font-medium">
          <span>Read case</span>
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
