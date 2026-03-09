import React from "react";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const { logoText, logoImage, logoType } = data;

  const renderLogo = () => {
    switch (logoType) {
      case "image":
        return logoImage ? (
          <img
            src={getImageUrl(logoImage, {
              height: 40,
              quality: "auto",
              format: "auto",
            })}
            alt={logoText || "Logo"}
            className="h-6 w-auto object-contain sm:h-7 md:h-8"
          />
        ) : (
          <div className="bg-primary text-primary-foreground flex h-6 w-auto items-center justify-center sm:h-7 md:h-8 px-2 rounded-sm">
            <span className="text-sm font-bold">
              {logoText?.charAt(0)?.toUpperCase() || "L"}
            </span>
          </div>
        );

      case "both":
        return (
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            {logoImage ? (
              <img
                src={getImageUrl(logoImage, {
                  height: 32,
                  quality: "auto",
                  format: "auto",
                })}
                alt={logoText || "Logo"}
                className="h-6 w-auto object-contain sm:h-7 md:h-8"
              />
            ) : (
              <div className="bg-primary text-primary-foreground flex h-6 w-auto items-center justify-center sm:h-7 md:h-8 px-2 rounded-sm">
                <span className="text-xs font-bold">
                  {logoText?.charAt(0)?.toUpperCase() || "L"}
                </span>
              </div>
            )}
            <span className="text-base font-bold sm:text-lg md:text-xl">{logoText}</span>
          </div>
        );

      case "text":
      default:
        return <span className="text-base font-bold sm:text-lg md:text-xl">{logoText}</span>;
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
