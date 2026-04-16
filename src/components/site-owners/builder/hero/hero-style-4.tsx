"use client";

import React from "react";
import { ChevronRight, Play } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate4Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import EiffelTowerBg from "../../../ui/eiffle-tower-bg";

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
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
  const imageUrl = data.imageUrl || defaultImageUrl;

  return (
    <section
      className="min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="relative mx-auto flex min-h-[500px] w-full max-w-7xl items-center overflow-hidden rounded-[16px] px-3 py-6 sm:min-h-[550px] sm:rounded-[24px] sm:px-4 sm:py-8 md:min-h-[600px] md:rounded-[32px] md:px-6 md:py-10 lg:min-h-[700px] lg:rounded-[40px] lg:px-8 lg:py-12 xl:min-h-[720px] xl:rounded-[48px] xl:px-10 xl:py-16">
        {/* Background decoration: Eiffel Tower outline */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-0 w-[80px] text-white opacity-[0.06] sm:left-1 sm:w-[120px] md:left-2 md:w-[160px] lg:left-3 lg:w-[200px] xl:left-4 xl:w-[280px] 2xl:w-[350px]">
          <EiffelTowerBg />
        </div>

        {/* Accent decorative circle */}
        <div
          className="absolute -right-[30%] bottom-[-30%] z-0 h-[200px] w-[200px] rounded-full opacity-70 sm:-right-[25%] sm:bottom-[-25%] sm:h-[250px] sm:w-[250px] md:-right-[20%] md:bottom-[-20%] md:h-[300px] md:w-[300px] lg:h-[400px] lg:w-[400px] xl:h-[500px] xl:w-[500px]"
          style={{ backgroundColor: theme.colors.primary }}
        ></div>

        <div className="relative z-10 grid h-full w-full grid-cols-1 items-center gap-6 px-2 py-4 sm:gap-8 sm:px-3 sm:py-6 md:gap-10 md:px-4 md:py-8 lg:gap-12 lg:px-5 lg:py-10 xl:grid-cols-2 xl:gap-16">
          {/* Left Content */}
          <div className="relative z-10 w-full space-y-4 text-center sm:space-y-5 sm:text-left md:space-y-6 lg:space-y-8 xl:space-y-10">
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
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-start sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
              {/* Primary Button */}
              <EditableLink
                text={primaryButton.text}
                href={primaryButton.href || "#"}
                onChange={(text, href) => {
                  handleButtonUpdate("buttons")(primaryButton.id, text, href);
                }}
                isEditable={isEditable}
                siteUser={siteUser}
                className="group inline-flex w-full max-w-[200px] items-center justify-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:shadow-lg sm:w-auto sm:px-5 sm:py-2.5 sm:text-sm md:gap-2 md:px-6 md:py-3 md:text-base lg:px-7 lg:py-3.5 xl:px-8 xl:py-4"
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
                className="group inline-flex w-full max-w-[220px] items-center justify-center gap-2 text-white transition-all duration-300 hover:opacity-80 sm:w-auto sm:justify-start sm:gap-2 md:gap-3 lg:gap-4"
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 xl:h-12 xl:w-12"
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
          <div className="relative flex w-full items-center justify-center px-4 sm:px-6 md:px-8 lg:justify-end lg:px-0">
            <div className="relative z-10 w-full max-w-[260px] overflow-hidden rounded-lg border-2 border-white/15 shadow-2xl sm:max-w-[300px] sm:rounded-xl sm:border-[3px] md:max-w-[350px] md:rounded-xl md:border-[4px] lg:max-w-[400px] lg:rounded-2xl lg:border-[5px] xl:max-w-[450px] xl:border-[6px] 2xl:max-w-[500px] 2xl:border-[8px]">
              <EditableImage
                src={getImageUrl(data.imageUrl, { width: 800 }) || imageUrl}
                alt={data.imageAlt || "Happy traveler in Paris"}
                onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                onAltChange={handleAltUpdate("imageAlt")}
                isEditable={isEditable}
                className="aspect-[3/4] w-full object-cover sm:aspect-[4/5] md:aspect-auto"
                width={600}
                height={750}
                s3Options={{
                  folder: "hero-images",
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
                className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                style={{
                  background: `linear-gradient(to top, ${theme.colors.background}99, transparent)`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
