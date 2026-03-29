"use client";
import React, { useState, useId } from "react";
import heroImg from "@/assets/hero-workspace.jpg";
import { ArrowDown, Loader2 } from "lucide-react";
import { HeroTemplate14Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

interface HeroTemplate14Props {
  heroData: HeroTemplate14Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate14Data>) => void;
  siteUser?: string;
}

export const HeroTemplate14: React.FC<HeroTemplate14Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const componentId = useId();

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#FFFFFF",
      primary: "#3B82F6",
      background: "#000000",
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
  } = useBuilderLogic(heroData, onUpdate);

  // Helper to highlight the span word in the title
  const renderTitle = () => {
    const title = data.title;
    const spanText = data.spanText;
    if (!spanText || !title.includes(spanText)) return title;

    const parts = title.split(spanText);
    return (
      <>
        {parts[0]}
        <span className="neon-text">{spanText}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="section-padding bg-background relative flex min-h-screen items-center justify-center overflow-hidden">
      <ImageEditOverlay
        onImageSelect={url => {
          const update = { imageUrl: url };
          setData({ ...data, ...update });
          onUpdate?.(update);
        }}
        imageWidth={1920}
        imageHeight={1080}
        isEditable={isEditable}
        label="Change Background"
        folder="hero-backgrounds"
        className="absolute top-6 right-6 z-30"
      />

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <EditableImage
          src={data.imageUrl}
          alt={data.imageAlt}
          onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
          onAltChange={handleAltUpdate("imageAlt")}
          isEditable={isEditable}
          className="h-full w-full object-cover opacity-30"
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Upload hero image",
          }}
          disableImageChange={true}
        />
        <div className="from-background/60 via-background/80 to-background absolute inset-0 bg-gradient-to-b" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <EditableText
          value={data.eyebrow}
          onChange={handleTextUpdate("eyebrow")}
          as="h1"
          className="text-primary mb-6 font-mono text-sm"
          style={{ color: theme.colors.primary }}
          isEditable={isEditable}
        />

        <div className="l mb-8 text-5xl">
          <div className="space-y-4">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h1"
              isEditable={isEditable}
            />
          </div>
        </div>

        <EditableText
          value={data.description}
          onChange={handleTextUpdate("description")}
          as="p"
          isEditable={isEditable}
          multiline
        />
      </div>
    </section>
  );
};
