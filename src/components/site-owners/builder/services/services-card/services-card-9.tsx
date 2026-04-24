"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { sanitizeContent } from "@/utils/html-sanitizer";
import {
  Briefcase,
  Layout,
  Palette,
  Code,
  BarChart,
  Rocket,
  Globe,
} from "lucide-react";

interface ServicesCard9Props {
  service: ServicesPost;
  theme: any;
  isEditable: boolean;
  onServiceClick?: (slug: string) => void;
  siteUser?: string;
}

const ICON_MAP: Record<string, any> = {
  strategy: BarChart,
  design: Palette,
  engineering: Code,
  growth: Rocket,
  branding: Layout,
  web: Globe,
  default: Briefcase,
};

const getIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("strategy")) return ICON_MAP.strategy;
  if (lowerTitle.includes("design")) return ICON_MAP.design;
  if (
    lowerTitle.includes("engineering") ||
    lowerTitle.includes("development") ||
    lowerTitle.includes("code")
  )
    return ICON_MAP.engineering;
  if (lowerTitle.includes("growth") || lowerTitle.includes("marketing"))
    return ICON_MAP.growth;
  if (lowerTitle.includes("branding")) return ICON_MAP.branding;
  if (lowerTitle.includes("web")) return ICON_MAP.web;
  return ICON_MAP.default;
};

export const ServicesCard9: React.FC<ServicesCard9Props> = ({
  service,
  theme,
  isEditable,
  onServiceClick,
  siteUser,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const Icon = getIcon(service.title);

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
      onMouseEnter={() => !isEditable && setIsHovered(true)}
      onMouseLeave={() => !isEditable && setIsHovered(false)}
      onClick={handleActivate}
      className={`group flex h-full flex-col bg-white p-10 transition-colors duration-300 ${
        isEditable ? "cursor-default" : "cursor-pointer hover:-translate-y-1"
      }`}
    >
      <div className="relative mb-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300">
          <Icon className="h-6 w-6" />
        </span>
      </div>

      <h3
        className="mb-4 text-2xl font-semibold tracking-tight"
        style={{ fontFamily: theme?.fonts?.heading }}
      >
        {service.title}
      </h3>

      <div
        className="leading-relaxed text-balance text-gray-600"
        style={{ fontFamily: theme?.fonts?.body }}
        dangerouslySetInnerHTML={{
          __html: sanitizeContent(service.description || ""),
        }}
      />
    </div>
  );
};
