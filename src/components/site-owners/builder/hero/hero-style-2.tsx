"use client";

import React, { useState } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate2Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { Loader2 } from "lucide-react";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

interface HeroTemplate2Props {
  heroData: HeroTemplate2Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate2Data>) => void;
}

export const HeroTemplate2: React.FC<HeroTemplate2Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();
  const defaultCollections = [
    {
      id: "women",
      title: "WOMEN'S COLLECTION",
      subtitle: "NEW COLLECTION",
      badge: "WOMEN",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      imageAlt: "Woman in yellow sportswear stretching on stairs",
      buttonText: "DISCOVER MORE",
      buttonHref: "#",
    },
    {
      id: "men",
      title: "MEN'S COLLECTION",
      subtitle: "SAVE 50% OFF",
      badge: "MEN",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      imageAlt: "Man in red t-shirt resting after a workout",
      buttonText: "DISCOVER MORE",
      buttonHref: "#",
    },
  ];

  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#FFFFFF",
      primary: "#FFFFFF",
      primaryForeground: "#000000",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#F3F4F6",
      backgroundDark: "#1F2937",
    },
    fonts: {
      body: "sans-serif",
      heading: "sans-serif",
    },
  };

  const { data, handleArrayItemUpdate } = useBuilderLogic(
    {
      ...heroData,
      collections: heroData.collections || defaultCollections,
    },
    onUpdate
  );

  const collections = data.collections || defaultCollections;

  // Handle collection updates
  const handleCollectionUpdate = (
    collectionId: string,
    field: string,
    value: string
  ) => {
    handleArrayItemUpdate(
      "collections" as any,
      collectionId
    )({
      [field]: value,
    });
  };

  // Handle collection image update
  const handleCollectionImageUpdate = (
    collectionId: string,
    imageUrl: string,
    altText?: string
  ) => {
    handleArrayItemUpdate(
      "collections" as any,
      collectionId
    )({
      imageUrl,
      imageAlt: altText,
    });
  };

  // Handle collection button update
  const handleCollectionButtonUpdate = (
    collectionId: string,
    text: string,
    href: string
  ) => {
    handleArrayItemUpdate(
      "collections" as any,
      collectionId
    )({
      buttonText: text,
      buttonHref: href,
    });
  };


  return (
    <div
      className="bg-background-light dark:bg-background-dark flex min-h-screen items-center justify-center p-4"
      data-component-id={componentId}
    >
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {collections.map((collection, index) => (
          <div
            key={collection.id}
            className="group relative h-auto w-full overflow-hidden"
          >
            {/* Collection Image */}
            <div className="relative h-full min-h-[600px] w-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${collection.imageUrl})`,
                }}
              />

              {/* Hidden EditableImage for functionality only - no hover effects */}
                <EditableImage
                  src={collection.imageUrl}
                  alt={collection.imageAlt}
                  onImageChange={(url, alt) =>
                    handleCollectionImageUpdate(collection.id, url, alt)
                  }
                  isEditable={false} // Disable hover effects
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
                  s3Options={{
                    folder: "hero-collections",
                  }}
                  placeholder={{
                    width: 800,
                    height: 600,
                    text: `Collection ${index + 1}`,
                  }}
                  disableImageChange={true}
                />

              <ImageEditOverlay
                onImageSelect={(url) => handleCollectionImageUpdate(collection.id, url)}
                imageWidth={800}
                imageHeight={600}
                isEditable={isEditable}
                label="Change Image"
                folder="hero-collections"
                className="absolute top-4 left-4 z-20"
              />
            </div>


            {/* Content Overlay */}
            <div className="bg-opacity-10 absolute inset-0 flex flex-col justify-center bg-black/40 p-8 text-white">
              {/* Content */}
              <div className="relative z-10">
                {/* Subtitle */}
                <EditableText
                  value={collection.subtitle}
                  onChange={value =>
                    handleCollectionUpdate(collection.id, "subtitle", value)
                  }
                  as="p"
                  className="mb-2 tracking-wider"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />

                {/* Main Title */}
                <EditableText
                  value={collection.title}
                  onChange={value =>
                    handleCollectionUpdate(collection.id, "title", value)
                  }
                  as="h2"
                  className="mb-4 font-bold"
                  isEditable={isEditable}
                  placeholder="Enter collection title..."
                  multiline={true}
                />

                {/* CTA Button */}
                <EditableLink
                  text={collection.buttonText}
                  href={collection.buttonHref}
                  onChange={(text, href) =>
                    handleCollectionButtonUpdate(collection.id, text, href)
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="rounded-sm bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter URL..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
