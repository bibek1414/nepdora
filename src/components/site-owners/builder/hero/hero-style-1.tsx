"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { HeroTemplate1Data } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface HeroTemplate1Props {
  heroData: HeroTemplate1Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate1Data>) => void;
}

export const HeroTemplate1: React.FC<HeroTemplate1Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(heroData);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // Type-safe handlers - only update fields that exist in HeroTemplate1Data
  const handleTextUpdate =
    (field: keyof HeroTemplate1Data) => (value: string) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);
      onUpdate?.({ [field]: value } as Partial<HeroTemplate1Data>);
    };

  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      imageUrl,
      imageAlt: updatedData.imageAlt,
    });
  };

  const handleAltUpdate = (altText: string) => {
    const updatedData = { ...data, imageAlt: altText };
    setData(updatedData);
    onUpdate?.({ imageAlt: altText });
  };

  const handleButtonUpdate = (buttonId: string, text: string, href: string) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, text, href } : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };

  const getButtonClasses = (variant: string) => {
    const baseClasses =
      "inline-block px-4 py-2.5 sm:px-6 sm:py-3 font-bold transition-colors min-w-[100px] sm:min-w-[120px] text-center text-sm sm:text-base";

    const buttonStyles = {
      backgroundColor:
        variant === "primary"
          ? theme.colors.primary
          : variant === "secondary"
            ? theme.colors.secondary
            : "transparent",
      color:
        variant === "primary"
          ? theme.colors.primaryForeground
          : variant === "secondary"
            ? theme.colors.secondaryForeground
            : theme.colors.text,
      border:
        variant === "outline" ? `1px solid ${theme.colors.primary}` : "none",
      borderRadius: "9999px",
      fontFamily: theme.fonts.body,
    };

    return { className: baseClasses, style: buttonStyles };
  };

  const getLayoutClasses = () => {
    switch (data.layout) {
      case "text-left":
        return "text-left items-start";
      case "text-right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  };

  const getImageUrl = () => {
    if (!data.imageUrl) return "";
    return optimizeCloudinaryUrl(convertUnsplashUrl(data.imageUrl), {
      width: 600,
      quality: "auto",
      format: "auto",
    });
  };

  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-4 py-12 sm:min-h-[60vh] sm:px-6 sm:py-16 md:py-20 lg:px-8">
      <div className="relative z-10 container mx-auto w-full max-w-6xl">
        <div className={`flex flex-col ${getLayoutClasses()} gap-4 sm:gap-6`}>
          {/* Hero Image */}
          {data.showImage && data.imageUrl && (
            <div className="mb-4 w-full sm:mb-6">
              <div className="mx-auto h-[300px] max-w-full overflow-hidden rounded-lg sm:max-w-md">
                <EditableImage
                  src={getImageUrl()}
                  alt={data.imageAlt || "Hero image"}
                  onImageChange={handleImageUpdate}
                  onAltChange={handleAltUpdate}
                  isEditable={isEditable}
                  className="h-full w-full object-cover"
                  width={600}
                  height={400}
                  cloudinaryOptions={{
                    folder: "hero-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 600,
                    height: 400,
                    text: "Upload hero image",
                  }}
                />
              </div>
            </div>
          )}

          {/* Subtitle Badge */}
          {data.subtitle && (
            <div
              className={`w-fit ${data.layout === "text-center" ? "mx-auto" : ""}`}
            >
              <Badge
                variant="secondary"
                className="text-xs sm:text-sm"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.secondaryForeground,
                  fontFamily: theme.fonts.body,
                }}
              >
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="span"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />
              </Badge>
            </div>
          )}

          {/* Title */}
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h1"
            className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl lg:text-6xl"
            isEditable={isEditable}
            placeholder="Enter your hero title..."
          />

          {/* Description */}
          {data.description && (
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="mx-auto max-w-2xl text-base leading-relaxed opacity-90 sm:text-lg md:text-xl"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          )}

          {/* Buttons */}
          {data.buttons.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-3 font-semibold sm:mt-4 sm:justify-start sm:gap-4">
              {data.buttons.map(button => {
                const buttonClass = getButtonClasses(button.variant);
                return (
                  <EditableLink
                    key={button.id}
                    text={button.text || "Button text"}
                    href={button.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate(button.id, text, href)
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className={buttonClass.className}
                    style={buttonClass.style}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
