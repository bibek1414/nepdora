"use client";

import React, { useState } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate9Data } from "@/types/owner-site/components/hero";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { cn } from "@/lib/utils";

interface HeroTemplate9Props {
  heroData: HeroTemplate9Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate9Data>) => void;
}

// Default collage images - moved outside the component to avoid recreation
const defaultCollageImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1760694533407-6a10714f3b65?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Images 1",
  },
  {
    id: "2",
    url: "https://plus.unsplash.com/premium_photo-1710849581742-f2151607c745?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Images 2",
  },
  {
    id: "3",
    url: "https://plus.unsplash.com/premium_photo-1763466939715-c2efc8499f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Images 2",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1762776345918-dbc968a5fcb0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Images 3",
  },
];

export const HeroTemplate9: React.FC<HeroTemplate9Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const componentId = React.useId();

  const { data, handleTextUpdate, handleButtonUpdate, handleArrayItemUpdate } =
    useBuilderLogic(
      {
        ...heroData,
        sliderImages:
          heroData.sliderImages && heroData.sliderImages.length > 0
            ? heroData.sliderImages
            : defaultCollageImages,
      },
      onUpdate
    );

  // Get collage images - ensure we always have exactly 4 images
  const getCollageImages = () => {
    // Start with existing slider images
    const images = [...(data.sliderImages || [])];

    // Fill with default images if we don't have enough
    for (let i = images.length; i < 4; i++) {
      const defaultIndex = i % defaultCollageImages.length;
      const defaultImage = {
        ...defaultCollageImages[defaultIndex],
        id: `default-${i}`,
      };
      images.push(defaultImage);
    }

    // Return only first 4 images
    return images.slice(0, 4);
  };

  const collageImages = getCollageImages();

  const handleImageUpdate = (
    imageUrl: string,
    altText?: string,
    index?: number
  ) => {
    if (index === undefined || index < 0 || index >= collageImages.length) {
      console.error("Invalid image index:", index);
      return;
    }

    handleArrayItemUpdate(
      "sliderImages",
      collageImages[index].id
    )({
      url: imageUrl,
      alt: altText,
    });
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-white px-4 py-16 lg:py-24 font-body"
      data-component-id={componentId}
    >
      <div className="relative w-full max-w-7xl">
        {/* Image collage with centered text and button */}
        <div className="relative mx-auto h-[500px] w-full max-w-6xl sm:h-[600px] lg:h-[700px]">
          {/* Centered Text and Button Content - Now left aligned within the center block */}
          <div className="absolute top-1/2 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-6 text-left">
            <EditableText
              key={`title-${componentId}`}
              value={data.title || "Innovation Meets Elegance"}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground font-heading"
              isEditable={isEditable}
              placeholder="Enter main title..."
              multiline={true}
            />

            {/* Description */}
            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl font-body"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {data.buttons.length > 0 && (
              <div className="flex flex-wrap gap-4">
                <EditableLink
                  key={`button-${componentId}`}
                  text={data.buttons[0]?.text || "Get Started"}
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
                  className="rounded-full px-8 py-4 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl bg-primary text-primary-foreground font-body"
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter URL..."
                />
              </div>
            )}
          </div>

          {/* Top left image */}
          <div className="absolute top-0 left-0 h-40 w-32 -rotate-6 transform overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:rotate-0 hover:scale-105 sm:h-64 sm:w-56 md:h-80 md:w-72 lg:h-96 lg:w-80">
            <EditableImage
              key={`collage-${componentId}-0-${collageImages[0].url}`}
              src={collageImages[0].url}
              alt={collageImages[0].alt}
              onImageChange={(url, alt) => handleImageUpdate(url, alt, 0)}
              isEditable={isEditable}
              className="h-full w-full object-cover"
              cloudinaryOptions={{
                folder: "hero-collage",
                resourceType: "image",
              }}
              imageOptimization={{
                width: 400,
                height: 500,
                quality: "auto",
                format: "auto",
                crop: "fill",
              }}
              placeholder={{
                width: 400,
                height: 500,
                text: "Image 1",
              }}
            />
          </div>

          {/* Top right image */}
          <div className="absolute top-0 right-0 h-44 w-36 rotate-3 transform overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:rotate-0 hover:scale-105 sm:h-72 sm:w-56 md:h-88 md:w-72 lg:h-[400px] lg:w-80">
            <EditableImage
              key={`collage-${componentId}-1-${collageImages[1].url}`}
              src={collageImages[1].url}
              alt={collageImages[1].alt}
              onImageChange={(url, alt) => handleImageUpdate(url, alt, 1)}
              isEditable={isEditable}
              className="h-full w-full object-cover"
              cloudinaryOptions={{
                folder: "hero-collage",
                resourceType: "image",
              }}
              imageOptimization={{
                width: 400,
                height: 500,
                quality: "auto",
                format: "auto",
                crop: "fill",
              }}
              placeholder={{
                width: 400,
                height: 500,
                text: "Image 2",
              }}
            />
          </div>

          {/* Bottom left image */}
          <div className="absolute bottom-0 left-10 h-36 w-28 -rotate-3 transform overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:rotate-0 hover:scale-105 sm:left-20 sm:h-56 sm:w-48 md:left-32 md:h-72 md:w-64 lg:left-40 lg:h-80 lg:w-72">
            <EditableImage
              key={`collage-${componentId}-2-${collageImages[2].url}`}
              src={collageImages[2].url}
              alt={collageImages[2].alt}
              onImageChange={(url, alt) => handleImageUpdate(url, alt, 2)}
              isEditable={isEditable}
              className="h-full w-full object-cover"
              cloudinaryOptions={{
                folder: "hero-collage",
                resourceType: "image",
              }}
              imageOptimization={{
                width: 400,
                height: 500,
                quality: "auto",
                format: "auto",
                crop: "fill",
              }}
              placeholder={{
                width: 400,
                height: 500,
                text: "Image 3",
              }}
            />
          </div>

          {/* Bottom right image */}
          <div className="absolute right-10 bottom-0 h-40 w-32 rotate-6 transform overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:rotate-0 hover:scale-105 sm:right-20 sm:h-64 sm:w-56 md:right-32 md:h-80 md:w-72 lg:right-40 lg:h-96 lg:w-80">
            <EditableImage
              key={`collage-${componentId}-3-${collageImages[3].url}`}
              src={collageImages[3].url}
              alt={collageImages[3].alt}
              onImageChange={(url, alt) => handleImageUpdate(url, alt, 3)}
              isEditable={isEditable}
              className="h-full w-full object-cover"
              cloudinaryOptions={{
                folder: "hero-collage",
                resourceType: "image",
              }}
              imageOptimization={{
                width: 400,
                height: 500,
                quality: "auto",
                format: "auto",
                crop: "fill",
              }}
              placeholder={{
                width: 400,
                height: 500,
                text: "Image 4",
              }}
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div
          className="pointer-events-none absolute top-10 right-0 h-40 w-40 rounded-full opacity-20 blur-3xl lg:h-64 lg:w-64 bg-primary"
          aria-hidden="true"
        ></div>
        <div
          className="pointer-events-none absolute bottom-10 left-0 h-40 w-40 rounded-full opacity-15 blur-3xl lg:h-64 lg:w-64 bg-secondary"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );
};
