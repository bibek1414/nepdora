"use client";

import React from "react";
import { ChevronRight, Play } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate12Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import EiffelTowerBg from "../../../ui/eiffle-tower-bg";

interface HeroTemplate12Props {
  heroData: HeroTemplate12Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate12Data>) => void;
}

export const HeroTemplate12: React.FC<HeroTemplate12Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#ffffff",
      primary: "#84cc16",
      primaryForeground: "#013D2F",
      secondary: "#0A4F3F",
      secondaryForeground: "#ffffff",
      background: "#013D2F",
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
    handleAltUpdate,
    handleButtonUpdate,
    getImageUrl,
  } = useBuilderLogic(heroData, onUpdate);

  // Ensure we have buttons
  const primaryButton = data.buttons?.find(
    btn => btn.variant === "primary"
  ) || {
    id: "1",
    text: "Read More",
    variant: "primary" as const,
    href: "#",
  };

  const secondaryButton = data.buttons?.find(
    btn => btn.variant === "secondary"
  ) || {
    id: "2",
    text: "Watch Our Videos",
    variant: "secondary" as const,
    href: "#",
  };

  // Default image if none provided
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2940&auto=format&fit=crop";
  const imageUrl = data.imageUrl || defaultImageUrl;

  return (
    <section
      className="min-h-screen"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="relative mx-auto flex min-h-[380px] w-full max-w-7xl items-center overflow-hidden rounded-[16px] px-2 py-4 sm:min-h-[450px] sm:rounded-[24px] sm:px-3 sm:py-6 md:min-h-[500px] md:rounded-[32px] md:px-4 md:py-8 lg:min-h-[600px] lg:rounded-[40px] lg:px-5 lg:py-16 xl:min-h-[720px] xl:rounded-[48px]">
        {/* Background decoration: Eiffel Tower outline */}
        <div className="pointer-events-none absolute bottom-0 left-1 z-0 w-[100px] text-white opacity-[0.08] sm:left-2 sm:w-[150px] md:left-4 md:w-[200px] lg:left-4 lg:w-[250px] xl:left-10 xl:w-[350px] 2xl:w-[450px]">
          <EiffelTowerBg />
        </div>

        {/* Accent decorative circle */}
        <div
          className="absolute -right-[20%] bottom-[-20%] z-0 h-[150px] w-[150px] rounded-full sm:-right-[15%] sm:bottom-[-15%] sm:h-[250px] sm:w-[250px] md:h-[300px] md:w-[300px] lg:h-[400px] lg:w-[400px] xl:h-[500px] xl:w-[500px]"
          style={{ backgroundColor: theme.colors.primary }}
        ></div>

        <div className="relative z-10 grid h-full w-full grid-cols-1 items-center gap-3 px-2 py-4 sm:gap-4 sm:px-3 sm:py-6 md:gap-6 md:px-4 md:py-8 lg:gap-8 lg:px-5 lg:py-16 xl:grid-cols-2 xl:gap-20">
          {/* Left Content */}
          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-10">
            {/* Title */}
            <EditableText
              value={data.title || "Visa Made Easy\nDreams Made\nPossible"}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="!text-2xl !leading-tight font-bold text-white sm:!text-3xl md:!text-4xl lg:!text-5xl xl:!text-6xl 2xl:!text-7xl"
              isEditable={isEditable}
              placeholder="Visa Made Easy\nDreams Made\nPossible"
              useHeadingFont={true}
              multiline={true}
            />

            {/* Buttons Container */}
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3 md:gap-4 lg:gap-8">
              {/* Primary Button */}
              <EditableLink
                text={primaryButton.text}
                href={primaryButton.href || "#"}
                onChange={(text, href) => {
                  handleButtonUpdate("buttons")(primaryButton.id, text, href);
                }}
                isEditable={isEditable}
                siteUser={siteUser}
                className="group flex items-center gap-1.5 rounded-full border border-white/40 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:shadow-lg sm:gap-2 sm:px-4 sm:py-2 sm:text-sm md:gap-3 md:px-5 md:py-2.5 md:text-base lg:px-6 lg:py-3 xl:px-9 xl:py-4"
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                <span>{primaryButton.text}</span>
                <ChevronRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1 sm:size-[16px] md:size-[18px]"
                />
              </EditableLink>

              {/* Secondary Button */}
              <EditableLink
                text={secondaryButton.text}
                href={secondaryButton.href || "#"}
                onChange={(text, href) => {
                  handleButtonUpdate("buttons")(secondaryButton.id, text, href);
                }}
                isEditable={isEditable}
                siteUser={siteUser}
                className="group flex cursor-pointer items-center gap-1.5 text-white sm:gap-2 md:gap-3 lg:gap-4"
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 shadow-lg transition-all duration-300 group-hover:shadow-lg sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14"
                  style={{ backgroundColor: theme.colors.secondary }}
                >
                  <Play
                    size={12}
                    className="ml-0.5 fill-white text-white sm:size-[14px] md:size-[16px] lg:ml-0.5 lg:size-[18px] xl:ml-1"
                    style={{ color: theme.colors.secondaryForeground }}
                  />
                </div>
                <span className="text-xs font-medium sm:text-sm md:text-base lg:text-lg">
                  {secondaryButton.text}
                </span>
              </EditableLink>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative flex h-full w-full items-center justify-center lg:justify-end">
            <div className="relative z-10 h-full w-full max-w-xs overflow-hidden rounded-lg border-[2px] border-white/10 shadow-2xl sm:max-w-sm sm:rounded-xl sm:border-[3px] md:max-w-md md:rounded-xl md:border-[4px] lg:rounded-2xl lg:border-[5px] xl:max-w-lg xl:border-[6px] 2xl:border-[8px]">
              <EditableImage
                src={getImageUrl(data.imageUrl, { width: 800 }) || imageUrl}
                alt={data.imageAlt || "Happy traveler in Paris"}
                onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                onAltChange={handleAltUpdate("imageAlt")}
                isEditable={isEditable}
                className="h-150 w-full object-cover"
                width={600}
                height={750}
                cloudinaryOptions={{
                  folder: "hero-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 600,
                  height: 750,
                  text: "Upload hero image",
                }}
              />

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#013D2F]/40 to-transparent"
                style={{
                  background: `linear-gradient(to top, ${theme.colors.background}66, transparent)`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
