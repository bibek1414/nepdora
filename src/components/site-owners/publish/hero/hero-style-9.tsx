"use client";

import React, { useState, useEffect } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/publish/editable-link";
import { HeroTemplate9Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

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

  const [data, setData] = useState<HeroTemplate9Data>(() => {
    // Ensure we have proper sliderImages data structure
    const initialSliderImages =
      heroData.sliderImages && heroData.sliderImages.length > 0
        ? heroData.sliderImages
        : defaultCollageImages;

    return {
      ...heroData,
      buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
      sliderImages: initialSliderImages.map(img => ({ ...img })), // Ensure deep copy
    };
  });

  const { data: themeResponse } = useThemeQuery();

  useEffect(() => {
    // Update data when heroData changes, ensuring sliderImages is properly handled
    const updatedSliderImages =
      heroData.sliderImages && heroData.sliderImages.length > 0
        ? heroData.sliderImages
        : defaultCollageImages;

    setData({
      ...heroData,
      buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
      sliderImages: updatedSliderImages.map(img => ({ ...img })),
    });
  }, [heroData]);

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#1F2937",
      primary: "#14B8A6",
      primaryForeground: "#FFFFFF",
      secondary: "#FF8B7B",
      secondaryForeground: "#FFFFFF",
      background: "#F9FAFB",
    },
    fonts: {
      body: "sans-serif",
      heading: "sans-serif",
    },
  };

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

  const handleTextUpdate =
    (field: keyof HeroTemplate9Data) => (value: string) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);
      onUpdate?.({ [field]: value } as Partial<HeroTemplate9Data>);
    };

  const handleImageUpdate = (
    imageUrl: string,
    altText?: string,
    index?: number
  ) => {
    if (index === undefined || index < 0 || index >= collageImages.length) {
      console.error("Invalid image index:", index);
      return;
    }

    const updatedSliderImages = [...collageImages];
    updatedSliderImages[index] = {
      ...updatedSliderImages[index],
      url: imageUrl,
      alt: altText || updatedSliderImages[index].alt,
    };

    const updatedData = { ...data, sliderImages: updatedSliderImages };
    setData(updatedData);
    onUpdate?.({ sliderImages: updatedSliderImages });
  };

  const handleButtonUpdate = (buttonId: string, text: string, href: string) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, text, href } : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-white px-2 py-8 sm:px-4 sm:py-12 md:px-6 md:py-16 lg:px-8 lg:py-20"
      data-component-id={componentId}
    >
      <div className="relative w-full max-w-7xl">
        {/* Image collage with centered text and button */}
        <div className="relative mx-auto h-64 w-full max-w-5xl sm:h-80 md:h-96 lg:h-[500px]">
          {/* Centered Text and Button Content */}
          <div className="absolute top-[35%] left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-2 text-center sm:top-[30%] sm:px-0 md:top-[19%]">
            <EditableText
              key={`title-${componentId}`}
              value={data.title || "Innovation Meets Elegance"}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="mx-auto mb-2 text-xl leading-tight font-bold sm:mb-4 sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl xl:text-6xl"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
              }}
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
                className="mx-auto mb-4 max-w-xl text-xs leading-relaxed sm:mb-6 sm:text-sm md:mb-8 md:text-base lg:text-lg"
                style={{
                  fontFamily: theme.fonts.body,
                  color: theme.colors.text,
                }}
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {data.buttons.length > 0 && (
              <div className="mt-2 sm:mt-4 md:mt-6">
                <EditableLink
                  key={`button-${componentId}`}
                  text={data.buttons[0]?.text || "Get Started"}
                  href={data.buttons[0]?.href || "#"}
                  onChange={(text, href) =>
                    handleButtonUpdate(data.buttons[0]?.id || "1", text, href)
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="inline-block rounded-full px-4 py-2 text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:px-6 sm:py-2.5 sm:text-xs md:px-8 md:py-3 md:text-sm lg:px-10 lg:py-3.5 lg:text-base"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                    color: theme.colors.primaryForeground,
                    fontFamily: theme.fonts.body,
                  }}
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter URL..."
                />
              </div>
            )}
          </div>
          {/* Top left image */}
          <div className="absolute top-0 left-0 h-32 w-28 -rotate-6 transform overflow-hidden rounded-lg shadow-[0_10px_30px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 hover:rotate-0 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.35)] sm:h-56 sm:w-48 sm:rounded-xl sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] sm:hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.35)] md:h-72 md:w-64">
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
          <div className="absolute top-0 right-0 h-36 w-28 rotate-3 transform overflow-hidden rounded-lg shadow-[0_10px_30px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 hover:rotate-0 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.35)] sm:h-60 sm:w-48 sm:rounded-xl sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] sm:hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.35)] md:h-80 md:w-64">
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
          <div className="absolute bottom-0 left-1/4 h-28 w-24 -rotate-3 transform overflow-hidden rounded-lg shadow-[0_10px_30px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 hover:rotate-0 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.35)] sm:h-48 sm:w-40 sm:rounded-xl sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] sm:hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.35)] md:h-64 md:w-56">
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
          <div className="absolute right-1/4 bottom-0 h-32 w-28 rotate-6 transform overflow-hidden rounded-lg shadow-[0_10px_30px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 hover:rotate-0 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.35)] sm:h-56 sm:w-48 sm:rounded-xl sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] sm:hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.35)] md:h-72 md:w-64">
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
          className="pointer-events-none absolute top-4 right-0 h-20 w-20 rounded-full opacity-20 blur-3xl sm:top-10 sm:h-32 sm:w-32 md:top-20 md:h-40 md:w-40 lg:h-48 lg:w-48"
          style={{ backgroundColor: theme.colors.primary }}
          aria-hidden="true"
        ></div>
        <div
          className="pointer-events-none absolute bottom-10 left-0 h-24 w-24 rounded-full opacity-15 blur-3xl sm:bottom-20 sm:h-40 sm:w-40 md:bottom-32 md:h-52 md:w-52 lg:h-64 lg:w-64"
          style={{ backgroundColor: theme.colors.secondary }}
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );
};
