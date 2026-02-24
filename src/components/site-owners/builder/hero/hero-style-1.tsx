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
    <section className="bg-background relative overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid items-center gap-12 lg:gap-16 ${data.showImage ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
        >
          {/* Content Column */}
          <div
            className={`order-2 flex flex-col items-start gap-6 text-left lg:order-1 ${!data.showImage ? "max-w-4xl" : ""}`}
          >
            {/* Subtitle Badge */}
            {data.subtitle && (
              <Badge
                variant="secondary"
                className="w-fit rounded-full px-3 py-1 text-xs font-medium sm:text-sm"
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
            )}

            {/* Title */}
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="text-foreground text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl"
              isEditable={isEditable}
              placeholder="Enter your hero title..."
            />

            {/* Description */}
            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="text-muted-foreground max-w-lg text-lg leading-relaxed sm:text-xl"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {/* Buttons */}
            {data.buttons.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-4">
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
                    className="rounded-lg px-8 py-3 font-medium !text-white transition-transform hover:scale-105"
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
                    className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg border px-8 py-3 font-medium transition-colors"
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                )}
              </div>
            )}
          </div>

          {/* Image Column */}
          {data.showImage && (
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              {data.imageUrl ? (
                <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl lg:max-w-xl">
                  <EditableImage
                    src={getImageUrl(data.imageUrl)}
                    alt={data.imageAlt || "Hero image"}
                    onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                    onAltChange={handleAltUpdate("imageAlt")}
                    isEditable={isEditable}
                    className="h-full w-full object-cover"
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
              ) : (
                <div className="bg-muted border-muted-foreground/25 relative flex aspect-[4/3] w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed lg:max-w-xl">
                  <EditableImage
                    src=""
                    alt="Hero placeholder"
                    onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                    onAltChange={handleAltUpdate("imageAlt")}
                    isEditable={isEditable}
                    className="h-full w-full object-cover opacity-0"
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
                  <div className="text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center">
                    Upload Image
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
