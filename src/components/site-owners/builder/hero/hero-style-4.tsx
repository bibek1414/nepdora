"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate4Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface HeroTemplate4Props {
  heroData: HeroTemplate4Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate4Data>) => void;
}

export const HeroTemplate4: React.FC<HeroTemplate4Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();

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

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleButtonUpdate,
    getImageUrl,
  } = useBuilderLogic(heroData, onUpdate);

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
      className="relative flex min-h-screen w-full items-center overflow-hidden py-16 lg:py-24"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, #f8fafc 100%)`,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col items-start space-y-8 text-left">
            <div className="space-y-6">
              {/* Main Title */}
              <div className="space-y-2">
                <EditableText
                  value={data.title}
                  onChange={handleTextUpdate("title")}
                  as="h1"
                  className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-foreground"
                  isEditable={isEditable}
                  placeholder="Enter main title..."
                  multiline={true}
                />
                {/* Highlighted word - part of subtitle */}
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="h2"
                  className="text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl"
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
                className="max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />

              {/* CTA Button */}
              {data.buttons.length > 0 && (
                <div className="pt-4">
                  <div className="group inline-flex items-center gap-2">
                    <EditableLink
                      text={data.buttons[0]?.text || "Shop Now"}
                      href={data.buttons[0]?.href || "#"}
                      onChange={(text, href) =>
                        handleButtonUpdate("buttons")(
                          data.buttons[0]?.id || "1",
                          text,
                          href
                        )
                      }
                      isEditable={isEditable}
                      siteUser={siteUser}
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground,
                        fontFamily: theme.fonts.body,
                      }}
                      className="px-8 py-4 rounded-lg font-medium shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                      textPlaceholder="Button text..."
                      hrefPlaceholder="Enter URL..."
                    >
                      {data.buttons[0]?.text || "Shop Now"}
                      <ChevronRight
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        style={{ color: theme.colors.primaryForeground }}
                      />
                    </EditableLink>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-muted w-full">
              <div className="min-w-[120px]">
                <EditableText
                  value={firstStatNumber}
                  onChange={value => {
                    const newValue =
                      value + (statsNumbers[1] ? `|${statsNumbers[1]}` : "");
                    handleTextUpdate("statsNumber")(newValue);
                  }}
                  as="h3"
                  className="text-3xl font-bold text-foreground sm:text-4xl"
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
                  className="mt-1 text-sm font-medium text-muted-foreground uppercase tracking-wide"
                  isEditable={isEditable}
                  placeholder="Stats description..."
                  multiline={true}
                />
              </div>
              <div className="min-w-[120px]">
                <EditableText
                  value={secondStatNumber}
                  onChange={value => {
                    const newValue =
                      (statsNumbers[0] || firstStatNumber) + `|${value}`;
                    handleTextUpdate("statsNumber")(newValue);
                  }}
                  as="h3"
                  className="text-3xl font-bold text-foreground sm:text-4xl"
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
                  className="mt-1 text-sm font-medium text-muted-foreground uppercase tracking-wide"
                  isEditable={isEditable}
                  placeholder="Second stats description..."
                  multiline={true}
                />
              </div>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="relative flex items-center justify-center lg:order-2 lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transition-all hover:shadow-3xl">
              {/* Main Product Image */}
              {data.showImage ? (
                <EditableImage
                  src={getImageUrl(data.imageUrl, { width: 800 })}
                  alt={data.imageAlt || "Hero image"}
                  onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                  isEditable={isEditable}
                  className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                  width={800}
                  height={1000}
                  cloudinaryOptions={{
                    folder: "hero-images",
                    resourceType: "image",
                  }}
                  placeholder={{
                    width: 800,
                    height: 1000,
                    text: "Upload main product image",
                  }}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <EditableImage
                    src=""
                    alt="Hero image placeholder"
                    onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                    isEditable={isEditable}
                    className="w-full h-full object-cover opacity-0"
                    width={800}
                    height={1000}
                    cloudinaryOptions={{
                      folder: "hero-images",
                      resourceType: "image",
                    }}
                    placeholder={{
                      width: 800,
                      height: 1000,
                      text: "Upload main product image",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
                      Upload Image
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
