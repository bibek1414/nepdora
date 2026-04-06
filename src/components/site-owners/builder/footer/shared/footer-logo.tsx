import React from "react";
import { FooterData } from "@/types/owner-site/components/footer";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";

interface FooterLogoProps {
  footerData: FooterData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getImageUrl: (path: string, options?: any) => string;
}

export const FooterLogo = ({ footerData, getImageUrl }: FooterLogoProps) => {
  const { data: siteConfig } = useSiteConfig();
  const { logoType, logoImage, logoText, companyName } = footerData;
  
  const isPlaceholder = (text?: string) => {
    if (!text) return true;
    const placeholders = ["brand", "your brand"];
    return placeholders.includes(text.toLowerCase().trim());
  };

  const displayText = !isPlaceholder(logoText) 
    ? logoText 
    : (!isPlaceholder(companyName) ? companyName : (siteConfig?.business_name || logoText || companyName));

  const currentLogoImage = siteConfig?.logo || logoImage;

  const renderLogo = () => {
    switch (logoType) {
      case "image":
        return (
          <div className="flex items-center justify-start">
            {currentLogoImage ? (
              <img
                src={getImageUrl(currentLogoImage, {
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
            {currentLogoImage ? (
              <img
                src={getImageUrl(currentLogoImage, {
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
              style={{ color: footerData.textColor || "inherit" }}
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
              style={{ color: footerData.textColor || "inherit" }}
            >
              {displayText}
            </span>
          </div>
        );
    }
  };

  return <>{renderLogo()}</>;
};
