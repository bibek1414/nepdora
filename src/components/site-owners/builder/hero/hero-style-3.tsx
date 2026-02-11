"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { HeroTemplate3Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface HeroTemplate3Props {
  heroData: HeroTemplate3Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate3Data>) => void;
  siteUser?: string;
}

export const HeroTemplate3: React.FC<HeroTemplate3Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
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
    handleAltUpdate,
    handleButtonUpdate,
    getImageUrl,
  } = useBuilderLogic(heroData, onUpdate);

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Subtitle Badge */}
            {data.subtitle && (
              <Badge
                variant="secondary"
                className="w-fit"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                }}
              >
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="span"
                  className="text-xs sm:text-sm"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />
              </Badge>
            )}

            {/* Title */}
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="!sm:text-4xl !md:text-5xl !lg:text-6xl !text-3xl leading-tight font-bold"
              isEditable={isEditable}
              placeholder="Enter your hero title..."
              multiline={true}
            />

            {/* Description */}
            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="max-w-lg text-base leading-relaxed opacity-90 sm:text-lg"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {/* Buttons with theme styling */}
            {data.buttons.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {data.buttons.map((button, index) => (
                  <EditableLink
                    key={button.id}
                    style={{
                      backgroundColor:
                        button.variant === "primary"
                          ? theme.colors.primary
                          : theme.colors.secondary,
                      color:
                        button.variant === "primary"
                          ? theme.colors.primaryForeground
                          : theme.colors.secondaryForeground,
                      fontFamily: theme.fonts.body,
                    }}
                    className="px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base"
                    text={button.text}
                    href={button.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(button.id, text, href)
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter button URL..."
                  >
                    {index === 1 && (
                      <Play size={16} className="sm:h-[18px] sm:w-[18px]" />
                    )}
                    <span>{button.text}</span>
                  </EditableLink>
                ))}
              </div>
            )}

            {/* Users Stats */}
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
              <EditableText
                value={data.statsNumber || "12k+"}
                onChange={handleTextUpdate("statsNumber")}
                as="span"
                className="text-base font-medium sm:text-lg"
                isEditable={isEditable}
                placeholder="Enter stats number..."
              />
              <EditableText
                value={data.statsLabel || "Used by teams and professionals."}
                onChange={handleTextUpdate("statsLabel")}
                as="span"
                className="text-sm font-normal opacity-75 sm:text-base"
                isEditable={isEditable}
                placeholder="Add stats description..."
              />
            </div>
          </div>

          {/* Right Side Image/Illustration */}
          <div className="relative flex items-center justify-center lg:order-2 lg:justify-end">
            {data.showImage && data.imageUrl ? (
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <div
                  className="rounded-2xl border shadow-xl backdrop-blur-sm"
                  style={{
                    backgroundColor: `${theme.colors.background}1a`,
                    borderColor: `${theme.colors.primary}33`,
                  }}
                >
                  <EditableImage
                    src={getImageUrl(data.imageUrl, { width: 800 })}
                    alt={data.imageAlt || "Hero image"}
                    onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                    onAltChange={handleAltUpdate("imageAlt")}
                    isEditable={isEditable}
                    className="h-64 w-full rounded-lg object-contain sm:h-80 md:h-96"
                    width={800}
                    height={800}
                    cloudinaryOptions={{
                      folder: "hero-images",
                      resourceType: "image",
                    }}
                    showAltEditor={isEditable}
                    placeholder={{
                      width: 800,
                      height: 800,
                      text: "Upload hero image",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <div
                  className="flex h-64 items-center justify-center rounded-2xl border p-4 shadow-xl backdrop-blur-sm sm:h-80 sm:p-6 md:h-96"
                  style={{
                    backgroundColor: `${theme.colors.background}1a`,
                    borderColor: `${theme.colors.primary}33`,
                  }}
                >
                  <EditableImage
                    src=""
                    alt="Hero illustration"
                    onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                    onAltChange={handleAltUpdate("imageAlt")}
                    isEditable={isEditable}
                    className="h-full w-full rounded-lg object-contain"
                    width={800}
                    height={800}
                    cloudinaryOptions={{
                      folder: "hero-images",
                      resourceType: "image",
                    }}
                    showAltEditor={isEditable}
                    placeholder={{
                      width: 800,
                      height: 800,
                      text: "Upload hero image",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
