"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ChevronRight } from "lucide-react";

interface PortfolioCard8Props {
  portfolio: Portfolio;
  isEditable?: boolean;
  siteUser?: string;
  onClick?: () => void;
}

export const PortfolioCard8: React.FC<PortfolioCard8Props> = ({
  portfolio,
  isEditable = false,
  siteUser,
  onClick,
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
      onMouseEnter={() => !isEditable && setIsHovered(true)}
      onMouseLeave={() => !isEditable && setIsHovered(false)}
      onClick={handleClick}
      className={`group flex h-full flex-col bg-white p-10 transition-all duration-300 ${
        isEditable ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <div className="relative mb-8">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200 transition-all duration-300">
          <Image
            unoptimized
            src={portfolioImage}
            alt={portfolio.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="mb-2">
        <span
          className="text-xs font-semibold text-gray-400"
          style={{ fontFamily: theme?.fonts?.body }}
        >
          {categoryName}
        </span>
      </div>

      <h3
        className="mb-4 text-2xl font-semibold tracking-tight"
        style={{ fontFamily: theme?.fonts?.heading }}
      >
        {portfolio.title}
      </h3>

      <p
        className="mb-8 line-clamp-3 leading-relaxed text-balance text-gray-600"
        style={{ fontFamily: theme?.fonts?.body }}
      >
        {portfolio.meta_description}
      </p>
    </div>
  );
};
