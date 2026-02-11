"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { HeroTemplate1Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

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

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleButtonUpdate,
    getImageUrl,
  } = useBuilderLogic(heroData, onUpdate);

  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-4 py-12 sm:min-h-[60vh] sm:px-6 sm:py-16 md:py-20 lg:px-8">
      <div className="relative z-10 container mx-auto w-full max-w-6xl">
        <div className={`flex flex-col gap-4 sm:gap-6`}>
          {/* Hero Image */}
          {data.showImage && data.imageUrl && (
            <div className="mb-4 w-full sm:mb-6">
              <div className="mx-auto h-[300px] max-w-full overflow-hidden rounded-lg sm:max-w-md">
                <EditableImage
                  src={getImageUrl(data.imageUrl)}
                  alt={data.imageAlt || "Hero image"}
                  onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                  onAltChange={handleAltUpdate("imageAlt")}
                  isEditable={isEditable}
                  className="h-[300px] w-full object-cover"
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
                  color: theme.colors.text,
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
            className="text-center"
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
            <div className="flex items-center justify-center gap-4">
              {data.buttons[0] && (
                <EditableLink
                  key={data.buttons[0].id}
                  text={data.buttons[0].text || "Button text"}
                  href={data.buttons[0].href || "#"}
                  onChange={(text, href) =>
                    handleButtonUpdate("buttons")(
                      data.buttons[0].id,
                      text,
                      href
                    )
                  }
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                    fontFamily: theme.fonts.body,
                  }}
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="!text-white"
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter URL..."
                />
              )}
              {data.buttons[1] && (
                <EditableLink
                  key={data.buttons[1].id}
                  text={data.buttons[1].text || "Button text"}
                  href={data.buttons[1].href || "#"}
                  onChange={(text, href) =>
                    handleButtonUpdate("buttons")(
                      data.buttons[1].id,
                      text,
                      href
                    )
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="border text-center"
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter URL..."
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
