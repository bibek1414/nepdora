"use client";

import React, { useState } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate5Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { toast } from "sonner";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { Loader2 } from "lucide-react";

interface HeroTemplate5Props {
  heroData: HeroTemplate5Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate5Data>) => void;
}

export const HeroTemplate5: React.FC<HeroTemplate5Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();

  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#FFFFFF",
      primary: "#FFFFFF",
      primaryForeground: "#000000",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#000000",
    },
    fonts: {
      body: "serif",
      heading: "serif",
    },
  };

  const { data, setData, handleTextUpdate, handleButtonUpdate } =
    useBuilderLogic(heroData, onUpdate);

  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const update = {
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    const updatedData = { ...data, ...update };
    setData(updatedData);
    onUpdate?.(update);
  };

  return (
    <div
      className="group relative flex min-h-screen items-center justify-center text-center text-white"
      data-component-id={componentId}
      style={{
        ...(data.backgroundType === "image" && data.backgroundImageUrl
          ? {
              backgroundImage: `url(${data.backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {
              backgroundColor: data.backgroundColor || theme.colors.background,
            }),
      }}
    >
      <ImageEditOverlay
        onImageSelect={url => handleImageUpdate(url)}
        imageWidth={1920}
        imageHeight={1080}
        isEditable={isEditable}
        label="Change Background"
        folder="hero-backgrounds"
        className="absolute top-0 right-0 z-20 flex items-center justify-center"
      />

      {/* Overlay - Only show if image background with overlay enabled */}
      {data.backgroundType === "image" && data.showOverlay && (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${data.overlayOpacity || 0.7})`,
          }}
        />
      )}

      {/* Content - Make sure it's above the overlay */}
      <div className="relative z-10 max-w-3xl px-6">
        {/* Badge/Subtitle */}
        <EditableText
          key={`subtitle-${componentId}`}
          value={data.subtitle || "Introducing the UA-01"}
          onChange={handleTextUpdate("subtitle")}
          as="h1"
          style={{
            color: "#D1D5DB", // text-gray-300 equivalent
          }}
          isEditable={isEditable}
          placeholder="Enter subtitle/badge text..."
        />

        {/* Main Title */}
        <EditableText
          key={`title-${componentId}`}
          value={data.title}
          onChange={handleTextUpdate("title")}
          as="h2"
          isEditable={isEditable}
          placeholder="Enter main title..."
          multiline={true}
        />

        {/* Description */}
        <EditableText
          key={`description-${componentId}`}
          value={data.description}
          onChange={handleTextUpdate("description")}
          as="p"
          className="mt-6"
          isEditable={isEditable}
          placeholder="Enter description..."
          multiline={true}
        />

        {/* Buttons */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          {data.buttons.length > 0 && (
            <EditableLink
              key={`button-1-${componentId}`}
              text={data.buttons[0]?.text || "Discover More"}
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
              textPlaceholder="Primary button text..."
              hrefPlaceholder="Enter URL..."
            />
          )}

          {data.buttons.length > 1 && (
            <EditableLink
              key={`button-2-${componentId}`}
              text={data.buttons[1]?.text || "Explore Collection"}
              href={data.buttons[1]?.href || "#"}
              onChange={(text, href) =>
                handleButtonUpdate("buttons")(
                  data.buttons[1]?.id || "2",
                  text,
                  href
                )
              }
              isEditable={isEditable}
              siteUser={siteUser}
              className="border"
              textPlaceholder="Secondary button text..."
              hrefPlaceholder="Enter URL..."
            />
          )}
        </div>
      </div>
    </div>
  );
};
