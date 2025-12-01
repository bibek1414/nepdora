"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate12Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
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
  const [data, setData] = useState<HeroTemplate12Data>(() => ({
    ...heroData,
    buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
  }));

  const { data: themeResponse } = useThemeQuery();

  useEffect(() => {
    setData({
      ...heroData,
      buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
    });
  }, [heroData]);

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

  // Handle text field updates
  const handleTextUpdate =
    (field: keyof HeroTemplate12Data) => (value: string) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);
      onUpdate?.({ [field]: value } as Partial<HeroTemplate12Data>);
    };

  // Handle image updates
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

  // Handle alt text updates
  const handleAltUpdate = (altText: string) => {
    const updatedData = { ...data, imageAlt: altText };
    setData(updatedData);
    onUpdate?.({ imageAlt: altText });
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
    if (!data.imageUrl) return "";
    return optimizeCloudinaryUrl(convertUnsplashUrl(data.imageUrl), {
      width: 800,
      quality: "auto",
      format: "auto",
    });
  };

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
      <div className="relative mx-auto flex min-h-[600px] w-full max-w-7xl items-center overflow-hidden rounded-[48px] lg:min-h-[720px]">
        {/* Background decoration: Eiffel Tower outline */}
        <div className="pointer-events-none absolute bottom-0 left-4 z-0 w-[250px] text-white opacity-[0.08] md:left-10 md:w-[350px] lg:w-[450px]">
          <EiffelTowerBg />
        </div>

        {/* Accent decorative circle */}
        <div
          className="absolute -right-[10%] bottom-[-10%] z-0 h-[400px] w-[400px] rounded-full md:h-[500px] md:w-[500px]"
          style={{ backgroundColor: theme.colors.primary }}
        ></div>

        <div className="relative z-10 grid h-full w-full grid-cols-1 items-center gap-8 px-4 py-8 md:px-8 md:py-16 lg:grid-cols-2 lg:gap-20 lg:px-16">
          {/* Left Content */}
          <div className="relative z-10 max-w-2xl space-y-6 md:space-y-10">
            {/* Title */}
            <EditableText
              value={data.title || "Visa Made Easy\nDreams Made\nPossible"}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="!md:text-7xl !text-6xl leading-tight font-bold text-white"
              isEditable={isEditable}
              placeholder="Visa Made Easy\nDreams Made\nPossible"
              useHeadingFont={true}
              multiline={true}
            />

            {/* Buttons Container */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center md:gap-8">
              {/* Primary Button */}
              <EditableLink
                text={primaryButton.text}
                href={primaryButton.href || "#"}
                onChange={(text, href) => {
                  handleButtonUpdate(primaryButton.id, text, href);
                }}
                isEditable={isEditable}
                siteUser={siteUser}
                className="group flex items-center gap-3 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg md:px-9 md:py-4"
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                <span>{primaryButton.text}</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </EditableLink>

              {/* Secondary Button */}
              <EditableLink
                text={secondaryButton.text}
                href={secondaryButton.href || "#"}
                onChange={(text, href) => {
                  handleButtonUpdate(secondaryButton.id, text, href);
                }}
                isEditable={isEditable}
                siteUser={siteUser}
                className="group flex cursor-pointer items-center gap-3 text-white md:gap-4"
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 shadow-lg transition-all duration-300 group-hover:shadow-lg md:h-14 md:w-14"
                  style={{ backgroundColor: theme.colors.secondary }}
                >
                  <Play
                    size={18}
                    className="ml-0.5 fill-white text-white md:ml-1"
                    style={{ color: theme.colors.secondaryForeground }}
                  />
                </div>
                <span className="text-base font-medium md:text-lg">
                  {secondaryButton.text}
                </span>
              </EditableLink>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative flex h-full w-full items-center justify-center lg:justify-end">
            <div className="relative z-10 h-full w-full max-w-md overflow-hidden rounded-2xl border-[6px] border-white/10 shadow-2xl md:border-[8px] lg:max-w-lg">
              <EditableImage
                src={getImageUrl() || imageUrl}
                alt={data.imageAlt || "Happy traveler in Paris"}
                onImageChange={handleImageUpdate}
                onAltChange={handleAltUpdate}
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
