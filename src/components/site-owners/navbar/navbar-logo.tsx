import React from "react";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface NavbarLogoProps {
  data: NavbarData;
  isEditable?: boolean;
  onEdit?: () => void;
  className?: string;
}

export const NavbarLogo: React.FC<NavbarLogoProps> = ({
  data,
  isEditable,
  onEdit,
  className = "",
}) => {
  const { logoText, logoImage, logoType } = data;

  const renderLogo = () => {
    switch (logoType) {
      case "image":
        return logoImage ? (
          <img
            src={optimizeCloudinaryUrl(logoImage, {
              width: 40,
              height: 40,
              crop: "fill",
              quality: "auto",
              format: "auto",
            })}
            alt={logoText || "Logo"}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full">
            <span className="text-sm font-bold">
              {logoText?.charAt(0)?.toUpperCase() || "L"}
            </span>
          </div>
        );

      case "both":
        return (
          <div className="flex items-center gap-3">
            {logoImage ? (
              <img
                src={optimizeCloudinaryUrl(logoImage, {
                  width: 32,
                  height: 32,
                  crop: "fill",
                  quality: "auto",
                  format: "auto",
                })}
                alt={logoText || "Logo"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-xs font-bold">
                  {logoText?.charAt(0)?.toUpperCase() || "L"}
                </span>
              </div>
            )}
            <span className="text-xl font-bold">{logoText}</span>
          </div>
        );

      case "text":
      default:
        return <span className="text-xl font-bold">{logoText}</span>;
    }
  };

  const logoElement =
    isEditable && onEdit ? (
      <span
        className={`cursor-pointer hover:opacity-80 ${className}`}
        onClick={onEdit}
      >
        {renderLogo()}
      </span>
    ) : (
      <a href="#" className={className}>
        {renderLogo()}
      </a>
    );

  return logoElement;
};
