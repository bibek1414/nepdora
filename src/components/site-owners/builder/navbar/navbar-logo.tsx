import React from "react";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { generateLinkHref } from "@/lib/link-utils";

interface NavbarLogoProps {
  data: NavbarData;
  isEditable?: boolean;
  onEdit?: () => void;
  className?: string;
  siteUser?: string;
}

export const NavbarLogo: React.FC<NavbarLogoProps> = ({
  data: navbarData,
  isEditable,
  onEdit,
  className = "",
  siteUser,
}) => {
  const { data, getImageUrl } = useBuilderLogic(navbarData);
  const { data: siteConfig } = useSiteConfig();
  const { logoText, logoImage, logoType } = data;

  const isPlaceholder = (text?: string) => {
    if (!text) return true;
    const placeholders = ["brand", "your brand"];
    return placeholders.includes(text.toLowerCase().trim());
  };

  const displayText = !isPlaceholder(logoText)
    ? logoText
    : siteConfig?.business_name || logoText;

  const renderLogo = () => {
    switch (logoType) {
      case "image":
        return (
          <div className="flex items-center justify-start">
            {logoImage ? (
              <img
                src={getImageUrl(logoImage, {
                  height: 40,
                  quality: "auto",
                  format: "auto",
                })}
                alt={displayText || "Logo"}
                className="h-6 w-auto object-contain object-left sm:h-7 md:h-8"
              />
            ) : (
              <div className="bg-primary text-primary-foreground flex h-6 w-auto items-center justify-center rounded-sm px-2 sm:h-7 md:h-8">
                <span className="text-sm font-bold">
                  {displayText?.charAt(0)?.toUpperCase() || "L"}
                </span>
              </div>
            )}
          </div>
        );

      case "both":
        return (
          <div className="flex items-center justify-start gap-2 sm:gap-2.5 md:gap-3">
            {logoImage ? (
              <img
                src={getImageUrl(logoImage, {
                  height: 32,
                  quality: "auto",
                  format: "auto",
                })}
                alt={displayText || "Logo"}
                className="h-6 w-auto object-contain object-left sm:h-7 md:h-8"
              />
            ) : (
              <div className="bg-primary text-primary-foreground flex h-6 w-auto items-center justify-center rounded-sm px-2 sm:h-7 md:h-8">
                <span className="text-xs font-bold">
                  {displayText?.charAt(0)?.toUpperCase() || "L"}
                </span>
              </div>
            )}
            <span
              className="text-base font-bold sm:text-lg md:text-xl"
              style={{ color: navbarData.textColor || "inherit" }}
            >
              {displayText}
            </span>
          </div>
        );

      case "text":
      default:
        return (
          <div className="flex items-center justify-start">
            <span
              className="text-base font-bold sm:text-lg md:text-xl"
              style={{ color: navbarData.textColor || "inherit" }}
            >
              {displayText}
            </span>
          </div>
        );
    }
  };

  const pathname = usePathname();

  const logoElement =
    isEditable && onEdit ? (
      <span
        className={`cursor-pointer hover:opacity-80 ${className}`}
        onClick={onEdit}
      >
        {renderLogo()}
      </span>
    ) : (
      <Link
        href={generateLinkHref("/", siteUser, pathname, isEditable)}
        className={className}
      >
        {renderLogo()}
      </Link>
    );

  return logoElement;
};
