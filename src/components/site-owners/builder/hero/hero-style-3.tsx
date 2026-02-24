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
    <section className="bg-background relative flex min-h-screen w-full items-center overflow-hidden py-16 lg:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col items-start gap-8 text-left">
            {/* Subtitle Badge */}
            {data.subtitle && (
              <Badge
                variant="secondary"
                className="w-fit rounded-full px-4 py-1.5"
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
                  className="text-sm font-medium tracking-wide uppercase"
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
              multiline={true}
            />

            {/* Description */}
            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="text-muted-foreground max-w-xl text-lg leading-relaxed sm:text-xl"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {/* Buttons with theme styling */}
            {data.buttons.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
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
                    className="flex items-center gap-2 rounded-lg px-8 py-4 text-base font-medium transition-transform hover:scale-105"
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
                    {index === 1 && <Play size={20} className="fill-current" />}
                    <span>{button.text}</span>
                  </EditableLink>
                ))}
              </div>
            )}

            {/* Users Stats */}
            <div className="border-primary mt-4 flex items-center gap-4 border-l-4 pl-6">
              <div className="flex flex-col">
                <EditableText
                  value={data.statsNumber || "12k+"}
                  onChange={handleTextUpdate("statsNumber")}
                  as="span"
                  className="text-foreground text-2xl font-bold"
                  isEditable={isEditable}
                  placeholder="Enter stats number..."
                />
                <EditableText
                  value={data.statsLabel || "Used by teams and professionals."}
                  onChange={handleTextUpdate("statsLabel")}
                  as="span"
                  className="text-muted-foreground text-sm font-medium"
                  isEditable={isEditable}
                  placeholder="Add stats description..."
                />
              </div>
            </div>
          </div>

          {/* Right Side Image/Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-lg lg:max-w-xl">
              {data.showImage && data.imageUrl ? (
                <div className="hover:shadow-3xl relative h-full w-full overflow-hidden rounded-3xl shadow-2xl transition-all">
                  <EditableImage
                    src={getImageUrl(data.imageUrl, { width: 800 })}
                    alt={data.imageAlt || "Hero image"}
                    onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                    onAltChange={handleAltUpdate("imageAlt")}
                    isEditable={isEditable}
                    className="h-full w-full transform object-cover transition-transform duration-700 hover:scale-105"
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
              ) : (
                <div className="border-muted-foreground/20 bg-muted/10 relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed">
                  <EditableImage
                    src=""
                    alt="Hero illustration"
                    onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                    onAltChange={handleAltUpdate("imageAlt")}
                    isEditable={isEditable}
                    className="h-full w-full object-cover opacity-0"
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
                  <div className="text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center">
                    Upload Image
                  </div>
                </div>
              )}
              {/* Decorative elements */}
              <div className="bg-primary/10 absolute -right-6 -bottom-6 -z-10 h-full w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
