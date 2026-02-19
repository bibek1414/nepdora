import React from "react";
import { FooterData } from "@/types/owner-site/components/footer";
import { cn } from "@/lib/utils";

interface FooterLogoProps {
  footerData: FooterData;
  getImageUrl: (path: string) => string;
  textClassName?: string;
  imageClassName?: string;
  containerClassName?: string;
}

export const FooterLogo = ({
  footerData,
  getImageUrl,
  textClassName,
  imageClassName,
  containerClassName,
}: FooterLogoProps) => {
  const { logoType, logoImage, logoText, companyName } = footerData;

  const renderText = () => (
    <span
      className={cn("text-base font-bold sm:text-lg md:text-xl", textClassName)}
    >
      {logoText || companyName}
    </span>
  );

  const renderImage = () =>
    logoImage ? (
      <img
        src={getImageUrl(logoImage)}
        alt={companyName}
        className={cn(
          "h-6 w-auto object-contain sm:h-7 md:h-8",
          imageClassName
        )}
      />
    ) : (
      renderText()
    );

  if (logoType === "text") {
    return (
      <div className={cn("flex items-center", containerClassName)}>
        {renderText()}
      </div>
    );
  }

  if (logoType === "image") {
    return (
      <div className={cn("flex items-center", containerClassName)}>
        {renderImage()}
      </div>
    );
  }

  // logoType === "both"
  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-2.5 md:gap-3",
        containerClassName
      )}
    >
      {logoImage && (
        <img
          src={getImageUrl(logoImage)}
          alt={companyName}
          className={cn(
            "h-6 w-auto object-contain sm:h-7 md:h-8",
            imageClassName
          )}
        />
      )}
      {renderText()}
    </div>
  );
};
