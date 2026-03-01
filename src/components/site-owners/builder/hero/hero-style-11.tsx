"use client";

import React from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate11Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface HeroTemplate11Props {
  heroData: HeroTemplate11Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate11Data>) => void;
}

export const HeroTemplate11: React.FC<HeroTemplate11Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#1a1a2e",
      primary: "#4338ca",
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
    setData,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleButtonUpdate,
    getImageUrl,
  } = useBuilderLogic(heroData, onUpdate);

  // Ensure we have at least one button
  const button =
    data.buttons && data.buttons.length > 0
      ? data.buttons[0]
      : {
          id: "1",
          text: "Get started today",
          variant: "primary" as const,
          href: "#",
        };

  // Default image if none provided
  const defaultImageUrl = "/fallback/image-not-found.png";
  const imageUrl = data.imageUrl || defaultImageUrl;

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Stripes */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <div className="grid h-full w-full grid-cols-6 gap-0 md:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-full w-full ${
                i % 2 === 0 ? "bg-[#f8f9fc]" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex max-w-2xl flex-col space-y-8">
            {/* Subtitle with line indicator */}
            {data.subtitle && (
              <div className="flex items-center space-x-4">
                <div
                  className="h-0.5 w-12"
                  style={{ backgroundColor: theme.colors.primary }}
                ></div>
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="span"
                  className="text-lg font-bold tracking-wide"
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.body,
                  }}
                  isEditable={isEditable}
                  placeholder="Started From - 1998"
                />
              </div>
            )}

            {/* Title */}
            <EditableText
              value={data.title || "Best Solution For Your Business Strategy."}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="text-5xl leading-[1.1] font-bold tracking-tight md:text-6xl lg:text-7xl"
              style={{
                color: "#1a1a2e",
                fontFamily: theme.fonts.heading,
              }}
              isEditable={isEditable}
              placeholder="Enter your hero title..."
              useHeadingFont={true}
            />

            {/* Description */}
            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="max-w-lg text-xl text-gray-600"
                style={{
                  fontFamily: theme.fonts.body,
                }}
                isEditable={isEditable}
                placeholder="Whole-Life Business Coaching for committed entrepreneurs"
                multiline={true}
              />
            )}

            {/* Button */}
            <div className="pt-4">
              <EditableLink
                text={button.text || "Get started today"}
                href={button.href || "#"}
                onChange={(text, href) => {
                  // If button doesn't exist in data.buttons, create it
                  if (!data.buttons || data.buttons.length === 0) {
                    const newButton = {
                      id: "1",
                      text,
                      href: href || "#",
                      variant: "primary" as const,
                    };
                    const updatedData = { ...data, buttons: [newButton] };
                    setData(updatedData);
                    onUpdate?.({ buttons: [newButton] });
                  } else {
                    handleButtonUpdate("buttons")(button.id, text, href);
                  }
                }}
                isEditable={isEditable}
                siteUser={siteUser}
                className="h-auto rounded-md px-8 py-6 text-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                  fontFamily: theme.fonts.body,
                }}
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden w-full md:-mt-8 md:block lg:-mt-12">
            <EditableImage
              src={
                getImageUrl(data.imageUrl, { width: 800 }) || defaultImageUrl
              }
              alt={data.imageAlt || "Business strategy meeting"}
              onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
              onAltChange={handleAltUpdate("imageAlt")}
              isEditable={isEditable}
              className="h-auto w-full rounded-lg object-cover shadow-xl"
              width={800}
              height={600}
              cloudinaryOptions={{
                folder: "hero-images",
                resourceType: "image",
              }}
              showAltEditor={isEditable}
              placeholder={{
                width: 800,
                height: 600,
                text: "Upload hero image",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
