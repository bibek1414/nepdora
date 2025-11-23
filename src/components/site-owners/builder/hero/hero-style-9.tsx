"use client";

import React, { useState, useEffect } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroData } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface HeroTemplate9Props {
  heroData: HeroData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

// Default collage images - moved outside the component to avoid recreation
const defaultCollageImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop",
    alt: "Community member 1",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=500&fit=crop",
    alt: "Community member 2",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=500&fit=crop",
    alt: "Community member 3",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop",
    alt: "Community member 4",
  },
];

export const HeroTemplate9: React.FC<HeroTemplate9Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const componentId = React.useId();

  const [data, setData] = useState<HeroData>(() => {
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
    console.log("Current sliderImages:", data.sliderImages);

    // Start with existing slider images
    const images = [...(data.sliderImages || [])];
    console.log("Initial images:", images.length);

    // Fill with default images if we don't have enough
    for (let i = images.length; i < 4; i++) {
      const defaultIndex = i % defaultCollageImages.length;
      const defaultImage = {
        ...defaultCollageImages[defaultIndex],
        id: `default-${i}`,
      };
      console.log(`Adding default image ${i}:`, defaultImage);
      images.push(defaultImage);
    }

    console.log("Final collage images:", images.length, images);
    // Return only first 4 images
    return images.slice(0, 4);
  };

  const collageImages = getCollageImages();

  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
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
      className="flex min-h-screen items-center justify-center p-4 sm:p-8"
      data-component-id={componentId}
    >
      <div className="relative w-full max-w-6xl">
        {/* Main content container */}
        <div className="relative z-10 mb-12 text-center sm:mb-20">
          <EditableText
            key={`title-${componentId}`}
            value={
              data.title ||
              "Uplift and empower\nthe community\none person at a time."
            }
            onChange={handleTextUpdate("title")}
            as="h1"
            className="mb-6 text-4xl leading-tight font-bold sm:text-5xl md:text-6xl"
            style={{ color: theme.colors.primary }}
            isEditable={isEditable}
            placeholder="Enter main title..."
            multiline={true}
          />

          {/* Highlight effect on "community" - inline styling */}
          <style jsx>{`
            h1 {
              white-space: pre-line;
            }
          `}</style>

          {data.buttons.length > 0 && (
            <div className="mt-8">
              <EditableLink
                key={`button-${componentId}`}
                text={data.buttons[0]?.text || "MAKE A DIFFERENCE"}
                href={data.buttons[0]?.href || "#"}
                onChange={(text, href) =>
                  handleButtonUpdate(data.buttons[0]?.id || "1", text, href)
                }
                isEditable={isEditable}
                siteUser={siteUser}
                className="inline-block transform rounded-full px-6 py-3 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:px-8 sm:py-4"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.secondaryForeground,
                }}
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              />
            </div>
          )}
        </div>

        {/* Image collage */}
        <div className="relative mb-8 h-80 w-full sm:h-96">
          {/* Top left image */}
          <div className="absolute top-0 left-0 h-56 w-48 -rotate-6 transform overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 hover:rotate-0 sm:h-72 sm:w-64">
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
          <div className="absolute top-0 right-0 h-60 w-48 rotate-3 transform overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 hover:rotate-0 sm:h-80 sm:w-64">
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
          <div className="absolute bottom-0 left-1/4 h-48 w-40 -rotate-3 transform overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 hover:rotate-0 sm:h-64 sm:w-56">
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
          <div className="absolute right-1/4 bottom-0 h-56 w-48 rotate-6 transform overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 hover:rotate-0 sm:h-72 sm:w-64">
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
          className="absolute top-20 right-10 h-16 w-16 rounded-full opacity-30 blur-xl sm:h-20 sm:w-20"
          style={{ backgroundColor: theme.colors.primary }}
        ></div>
        <div
          className="absolute bottom-40 left-10 h-24 w-24 rounded-full opacity-20 blur-2xl sm:h-32 sm:w-32"
          style={{ backgroundColor: theme.colors.secondary }}
        ></div>
      </div>
    </div>
  );
};
