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
      className="min-h-screen flex items-center justify-center p-4 lg:p-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="relative mx-auto flex min-h-[600px] w-full max-w-7xl items-center overflow-hidden rounded-3xl bg-white/5 p-6 md:p-12 shadow-2xl ring-1 ring-white/10">
        {/* Background decoration: Eiffel Tower outline */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-0 w-[300px] text-white opacity-[0.05] lg:w-[500px]">
          <EiffelTowerBg />
        </div>

        {/* Accent decorative circle */}
        <div
          className="absolute -right-20 -bottom-20 z-0 h-64 w-64 rounded-full blur-3xl opacity-50"
          style={{ backgroundColor: theme.colors.primary }}
        ></div>

        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col items-start text-left space-y-8">
            {/* Title */}
            <EditableText
              value={data.title || "Visa Made Easy\nDreams Made\nPossible"}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight"
              isEditable={isEditable}
              placeholder="Visa Made Easy\nDreams Made\nPossible"
              useHeadingFont={true}
              multiline={true}
            />

            {/* Buttons Container */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary Button */}
              <EditableLink
                text={primaryButton.text}
                href={primaryButton.href || "#"}
                onChange={(text, href) => {
                  handleButtonUpdate("buttons")(primaryButton.id, text, href);
                }}
                isEditable={isEditable}
                siteUser={siteUser}
                className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg backdrop-blur-sm"
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                <span>{primaryButton.text}</span>
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
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
                className="group flex cursor-pointer items-center gap-3 text-white transition-opacity hover:opacity-80"
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: theme.colors.secondary }}
                >
                  <Play
                    size={16}
                    className="ml-1 fill-white text-white"
                    style={{ color: theme.colors.secondaryForeground }}
                  />
                </div>
                <span className="text-base font-medium">
                  {secondaryButton.text}
                </span>
              </EditableLink>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-[6px] border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:shadow-3xl">
              <EditableImage
                src={getImageUrl(data.imageUrl, { width: 800 }) || imageUrl}
                alt={data.imageAlt || "Happy traveler in Paris"}
                onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                onAltChange={handleAltUpdate("imageAlt")}
                isEditable={isEditable}
                className="h-[500px] w-full object-cover"
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
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
