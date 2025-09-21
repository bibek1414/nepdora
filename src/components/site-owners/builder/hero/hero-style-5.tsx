"use client";

import React, { useState } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroData } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface HeroTemplate5Props {
  heroData: HeroData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

export const HeroTemplate5: React.FC<HeroTemplate5Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(heroData);
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with updated structure, fallback to defaults if not available
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

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
  };

  // Handle main image updates
  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      backgroundImageUrl: imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      backgroundImageUrl: imageUrl,
      imageAlt: updatedData.imageAlt,
    });
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

  // Handle file input for background change
  const handleBackgroundFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const imageUrl = e.target?.result as string;
        if (imageUrl) {
          // Ensure we're using image background type with proper typing
          const updatedData: HeroData = {
            ...data,
            backgroundType: "image" as const, // Type assertion to ensure correct literal type
            backgroundImageUrl: imageUrl,
            imageAlt: `Background image: ${file.name}`,
          };
          setData(updatedData);
          onUpdate?.({
            backgroundType: "image" as const,
            backgroundImageUrl: imageUrl,
            imageAlt: updatedData.imageAlt,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center text-center">
      {/* Background Change Button - Only visible when editable */}
      {isEditable && (
        <div className="absolute top-6 right-4 z-10">
          <label
            htmlFor="background-upload"
            className="mr-12 cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            Change Background
          </label>
          <input
            id="background-upload"
            type="file"
            accept="image/*"
            onChange={handleBackgroundFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Background Image */}
      {data.backgroundType === "image" && data.backgroundImageUrl ? (
        <>
          {/* Direct image background */}
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${data.backgroundImageUrl})`,
            }}
          />
          {/* EditableImage for additional editing capabilities */}
          <EditableImage
            src={data.backgroundImageUrl}
            alt={data.imageAlt || "Background image"}
            onImageChange={handleImageUpdate}
            isEditable={isEditable}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
            priority
            placeholder={{
              width: 1920,
              height: 1080,
              text: "Upload background image",
            }}
          />
          {/* Overlay */}
          {data.showOverlay && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${data.overlayOpacity || 0.7})`,
              }}
            />
          )}
        </>
      ) : (
        /* Default/Color Background */
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: data.backgroundColor || theme.colors.background,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6">
        {/* Badge/Subtitle */}
        <EditableText
          value={data.subtitle || "Introducing the UA-01"}
          onChange={handleTextUpdate("subtitle")}
          as="p"
          className="mb-4 text-sm tracking-[0.2em] uppercase"
          style={{
            color: "#D1D5DB", // text-gray-300 equivalent
            fontFamily: theme.fonts.body,
          }}
          isEditable={isEditable}
          placeholder="Enter subtitle/badge text..."
        />

        {/* Main Title */}
        <EditableText
          value={data.title}
          onChange={handleTextUpdate("title")}
          as="h1"
          className="text-5xl leading-tight font-bold sm:text-6xl md:text-7xl"
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
          }}
          isEditable={isEditable}
          placeholder="Enter main title..."
          multiline={true}
        />

        {/* Description */}
        <EditableText
          value={data.description}
          onChange={handleTextUpdate("description")}
          as="p"
          className="mt-6 text-lg"
          style={{
            color: "#D1D5DB", // text-gray-200 equivalent
            fontFamily: theme.fonts.body,
          }}
          isEditable={isEditable}
          placeholder="Enter description..."
          multiline={true}
        />

        {/* Buttons */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          {data.buttons.length > 0 && (
            <EditableLink
              text={data.buttons[0]?.text || "Discover More"}
              href={data.buttons[0]?.href || "#"}
              onChange={(text, href) =>
                handleButtonUpdate(data.buttons[0]?.id || "1", text, href)
              }
              isEditable={isEditable}
              siteUser={siteUser}
              className="rounded-full px-8 py-3 font-semibold transition hover:bg-gray-200"
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
              text={data.buttons[1]?.text || "Explore Collection"}
              href={data.buttons[1]?.href || "#"}
              onChange={(text, href) =>
                handleButtonUpdate(data.buttons[1]?.id || "2", text, href)
              }
              isEditable={isEditable}
              siteUser={siteUser}
              className="rounded-full border px-8 py-3 transition hover:bg-white/10"
              style={{
                borderColor: theme.colors.text,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
              textPlaceholder="Secondary button text..."
              hrefPlaceholder="Enter URL..."
            />
          )}
        </div>
      </div>
    </div>
  );
};
