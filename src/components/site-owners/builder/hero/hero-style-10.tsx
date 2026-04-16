"use client";

import React, { useState } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate10Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ChevronRight, Loader2 } from "lucide-react";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

interface HeroTemplate10Props {
  heroData: HeroTemplate10Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate10Data>) => void;
}

export const HeroTemplate10: React.FC<HeroTemplate10Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const componentId = React.useId();
  const defaultCollections = [
    {
      id: "men",
      title: "Men's\nCollection",
      subtitle: "",
      badge: "",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      imageAlt: "Men's collection",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
    {
      id: "women",
      title: "Women's\nCollection",
      subtitle: "",
      badge: "",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      imageAlt: "Women's collection",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
  ];

  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#FFFFFF",
      primary: "#000000",
      primaryForeground: "#FFFFFF",
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

  const imageWidth = 800;
  const imageHeight = 800;

  return (
    <div
      className="bg-background-light dark:bg-background-dark flex items-center justify-center py-6 sm:py-8 lg:py-12"
      data-component-id={componentId}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:gap-8 lg:px-8">
        {collections.map((collection, index) => {
          // Different backgrounds based on index to match the design (darker left, lighter right)
          const cardBgClass = index % 2 === 0 ? "bg-[#8A95A5]" : "bg-[#E6E6E6]";
          const textColorClass = index % 2 === 0 ? "text-white" : "text-white";
          const btnBorderClass =
            index % 2 === 0 ? "border-white" : "border-white";

          return (
            <div
              key={collection.id}
              className={`group relative h-[400px] w-full overflow-hidden rounded-[40px] ${cardBgClass} sm:h-[450px] lg:h-[500px]`}
            >
              {/* Product Image on the Background */}
              <div className="pointer-events-none absolute inset-0 h-full w-full">
                {/* The actual image */}
                <div
                  className="pointer-events-auto absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${collection.imageUrl})`,
                  }}
                />
              </div>

              {/* EditableImage for hover/upload overlay */}
              <div className="absolute inset-0 z-20 h-full w-full">
                <EditableImage
                  src={collection.imageUrl}
                  alt={collection.imageAlt}
                  onImageChange={(url, alt) =>
                    handleCollectionImageUpdate(collection.id, url, alt)
                  }
                  isEditable={isEditable}
                  className="absolute inset-0 h-full w-full object-cover opacity-0"
                  width={imageWidth}
                  height={imageHeight}
                  buttonPosition="top-right"
                  s3Options={{
                    folder: "hero-collections",
                  }}
                  placeholder={{
                    width: imageWidth,
                    height: imageHeight,
                    text: `Collection ${index + 1}`,
                  }}
                  disableImageChange={true}
                />
              </div>
              <ImageEditOverlay
                onImageSelect={url =>
                  handleCollectionImageUpdate(
                    collection.id,
                    url,
                    `Collection image`
                  )
                }
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                isEditable={isEditable}
                label="Change Image"
                folder="hero-collections"
                className="absolute top-6 right-6 z-20"
              />

              {/* Content on the Left */}
              <div
                className={`relative z-20 flex h-full w-full flex-col justify-center p-8 sm:p-12 lg:p-16 ${textColorClass}`}
              >
                {/* Main Title */}
                <EditableText
                  value={collection.title}
                  onChange={value =>
                    handleCollectionUpdate(collection.id, "title", value)
                  }
                  as="h2"
                  className="z-10 mb-4 text-3xl leading-tight font-black sm:mb-8 sm:text-4xl md:text-5xl"
                  isEditable={isEditable}
                  placeholder="Enter collection title..."
                  multiline={true}
                />

                {/* CTA Button */}
                <div className="mt-4">
                  <EditableLink
                    text={collection.buttonText}
                    href={collection.buttonHref}
                    onChange={(text, href) =>
                      handleCollectionButtonUpdate(collection.id, text, href)
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className={`rounded-full border border-solid px-8 py-3 text-sm font-medium transition-all hover:bg-black/5 ${btnBorderClass} ${textColorClass}`}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  >
                    <span className="mr-2">{collection.buttonText}</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </EditableLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
