"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Plus, ChevronRight } from "lucide-react";

interface ServicesCard6Props {
  service: ServicesPost;
  siteUser?: string;
  className?: string;
  isFirst?: boolean;
  isEditable?: boolean;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesCard6: React.FC<ServicesCard6Props> = ({
  service,
  siteUser,
  className,
  isFirst,
  isEditable = false,
  onServiceClick,
}) => {
  const pathname = usePathname();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const { title, description, thumbnail_image } = service;

  const [isHovered, setIsHovered] = useState(false);

  // Provide fallback image to ensure dynamic visuals load properly
  const imageSrc =
    thumbnail_image || "https://picsum.photos/seed/placeholder/800/600";

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/service-details-draft"
      : "/service-details";
    return generateLinkHref(`${basePath}/${service.slug}`, siteUser, pathname);
  };

  const handleActivate = () => {
    if (isEditable) return;

    if (onServiceClick) {
      onServiceClick(service.slug);
      return;
    }

    window.location.href = getDetailsUrl();
  };

  return (
    <div
      onClick={handleActivate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex h-full min-h-[400px] cursor-pointer flex-col justify-between overflow-hidden rounded-4xl p-8 transition-all duration-500 ${
        className || ""
      }`}
      style={{
        backgroundColor: "var(--bg-card, #f7f7f7)",
        transform: isHovered ? "translateY(-10px)" : "translateY(0px)",
      }}
    >
      {/* Absolute Image Background */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-700"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <Image
          unoptimized
          src={imageSrc}
          alt={title || "Service"}
          fill
          className="object-cover transition-transform duration-1000 ease-out"
          style={{ transform: isHovered ? "scale(1)" : "scale(1.1)" }}
          referrerPolicy="no-referrer"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full grow flex-col bg-transparent">
        <div className="mb-4 flex items-start justify-between">
          <h3
            className="text-2xl font-medium transition-colors duration-500"
            style={{
              fontFamily: theme?.fonts?.heading,
              color: isHovered ? "white" : "inherit",
            }}
          >
            {title}
          </h3>

          <div
            className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-transparent transition-all duration-300"
            style={{
              backgroundColor: isHovered ? "white" : "transparent",
              color: isHovered ? "black" : "inherit",
            }}
          >
            <Plus
              className="absolute h-5 w-5 text-black transition-all duration-300"
              style={{
                opacity: isHovered ? 0 : 1,
                transform: isHovered
                  ? "scale(0) rotate(90deg)"
                  : "scale(1) rotate(0deg)",
              }}
            />
            <ChevronRight
              className="absolute h-5 w-5 text-black transition-all duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered
                  ? "scale(1) rotate(0deg)"
                  : "scale(0) rotate(-90deg)",
              }}
            />
          </div>
        </div>

        <p
          className="line-clamp-3 max-w-xs transition-colors duration-500"
          style={{
            color: isHovered ? "rgba(255,255,255,0.8)" : "rgba(26,26,26,0.6)",
          }}
        >
          {description}
        </p>

        {/* Static Image for mobile/non-hover when it's just the card bg */}
        <div className="relative mt-auto block min-h-[200px] w-full overflow-hidden rounded-2xl pt-8 md:hidden">
          <Image
            unoptimized
            src={imageSrc}
            alt={title || "Service"}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
};
