"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroData } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface HeroTemplate4Props {
  heroData: HeroData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

export const HeroTemplate4: React.FC<HeroTemplate4Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(heroData);
  const { data: themeResponse } = useThemeQuery();

  // Sync with prop changes
  useEffect(() => {
    setData(heroData);
  }, [heroData]);

  // Get theme colors with updated structure, fallback to defaults if not available
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

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
  };

  // Handle main image updates
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

  // Handle button updates
  const handleButtonUpdate = (buttonId: string, text: string, href: string) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, text, href } : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };

  // Get optimized image URL
  const getImageUrl = () => {
    if (!data.imageUrl) return "/api/placeholder/500/500";
    return optimizeCloudinaryUrl(convertUnsplashUrl(data.imageUrl), {
      width: 800,
      quality: "auto",
      format: "auto",
    });
  };

  // Parse stats - if statsLabel contains "|", split it for two stats
  const statsParts = data.statsLabel?.split("|") || [];
  const firstStatLabel =
    statsParts[0]?.trim() || data.statsLabel || "Happy clients";
  const secondStatLabel = statsParts[1]?.trim() || "Projects completed";
  const statsNumbers = data.statsNumber?.split("|") || [];
  const firstStatNumber = statsNumbers[0]?.trim() || data.statsNumber || "788+";
  const secondStatNumber = statsNumbers[1]?.trim() || "8k+";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, #f8fafc 100%)`,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-12 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              {/* Main Title */}
              <div className="space-y-2 sm:space-y-3">
                <EditableText
                  value={data.title}
                  onChange={handleTextUpdate("title")}
                  as="h1"
                  className="text-3xl leading-tight font-bold text-balance sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                  }}
                  isEditable={isEditable}
                  placeholder="Enter main title..."
                  multiline={true}
                />
                {/* Highlighted word - part of subtitle */}
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="div"
                  className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.heading,
                  }}
                  isEditable={isEditable}
                  placeholder="Highlighted text..."
                  multiline={true}
                />
              </div>

              {/* Description */}
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="max-w-lg text-base leading-relaxed sm:text-lg"
                style={{
                  color: "#6B7280",
                  fontFamily: theme.fonts.body,
                }}
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />

              {/* CTA Button */}
              {data.buttons.length > 0 && (
                <div className="pt-2 sm:pt-4">
                  <div className="group inline-flex items-center gap-2">
                    <EditableLink
                      text={data.buttons[0]?.text || "Shop Now"}
                      href={data.buttons[0]?.href || "#"}
                      onChange={(text, href) =>
                        handleButtonUpdate(
                          data.buttons[0]?.id || "1",
                          text,
                          href
                        )
                      }
                      isEditable={isEditable}
                      siteUser={siteUser}
                      className="rounded-none px-5 py-2.5 text-sm font-semibold transition-all hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground,
                        fontFamily: theme.fonts.body,
                      }}
                      textPlaceholder="Button text..."
                      hrefPlaceholder="Enter URL..."
                    />
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5"
                      style={{ color: theme.colors.primary }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4 sm:gap-8 sm:pt-6 lg:gap-12">
              <div className="min-w-[120px] flex-1">
                <EditableText
                  value={firstStatNumber}
                  onChange={value => {
                    const newValue =
                      value + (statsNumbers[1] ? `|${statsNumbers[1]}` : "");
                    handleTextUpdate("statsNumber")(newValue);
                  }}
                  as="div"
                  className="text-2xl font-bold sm:text-3xl"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                  }}
                  isEditable={isEditable}
                  placeholder="788+"
                />
                <EditableText
                  value={firstStatLabel}
                  onChange={value => {
                    const newValue =
                      value + (statsParts[1] ? `|${statsParts[1]}` : "");
                    handleTextUpdate("statsLabel")(newValue);
                  }}
                  as="div"
                  className="mt-1 text-xs leading-relaxed sm:text-sm"
                  style={{
                    color: "#6B7280",
                    fontFamily: theme.fonts.body,
                  }}
                  isEditable={isEditable}
                  placeholder="Stats description..."
                  multiline={true}
                />
              </div>
              <div className="min-w-[120px] flex-1">
                <EditableText
                  value={secondStatNumber}
                  onChange={value => {
                    const newValue =
                      (statsNumbers[0] || firstStatNumber) + `|${value}`;
                    handleTextUpdate("statsNumber")(newValue);
                  }}
                  as="div"
                  className="text-2xl font-bold sm:text-3xl"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                  }}
                  isEditable={isEditable}
                  placeholder="8k+"
                />
                <EditableText
                  value={secondStatLabel}
                  onChange={value => {
                    const newValue =
                      (statsParts[0] || firstStatLabel) + `|${value}`;
                    handleTextUpdate("statsLabel")(newValue);
                  }}
                  as="div"
                  className="mt-1 text-xs leading-relaxed sm:text-sm"
                  style={{
                    color: "#6B7280",
                    fontFamily: theme.fonts.body,
                  }}
                  isEditable={isEditable}
                  placeholder="Second stats description..."
                  multiline={true}
                />
              </div>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="relative flex items-center justify-center lg:order-2">
            <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
              {/* Main Product Image */}
              {data.showImage ? (
                <EditableImage
                  src={getImageUrl()}
                  alt={data.imageAlt || "Hero image"}
                  onImageChange={handleImageUpdate}
                  isEditable={isEditable}
                  className="relative z-10 h-auto w-full rounded-lg shadow-2xl"
                  width={800}
                  height={800}
                  cloudinaryOptions={{
                    folder: "hero-images",
                    resourceType: "image",
                  }}
                  placeholder={{
                    width: 800,
                    height: 800,
                    text: "Upload main product image",
                  }}
                />
              ) : (
                <div className="relative z-10 flex aspect-square w-full items-center justify-center rounded-lg bg-gray-100 shadow-2xl">
                  <EditableImage
                    src=""
                    alt="Hero image placeholder"
                    onImageChange={handleImageUpdate}
                    isEditable={isEditable}
                    className="h-full w-full rounded-lg object-cover"
                    width={800}
                    height={800}
                    cloudinaryOptions={{
                      folder: "hero-images",
                      resourceType: "image",
                    }}
                    placeholder={{
                      width: 800,
                      height: 800,
                      text: "Upload main product image",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
