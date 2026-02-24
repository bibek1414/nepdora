"use client";

import React from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate10Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ChevronRight } from "lucide-react";

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

  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#1F2937",
      primary: "#4F46E5",
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
    setData,
    handleTextUpdate,
    handleButtonUpdate,
    handleArrayItemUpdate,
    getImageUrl,
  } = useBuilderLogic(heroData, onUpdate);

  // Default grid images (7 images total)
  const defaultGridImages = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
      alt: "Product image 1",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
      alt: "Product image 2",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop",
      alt: "Product image 3",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1558769132-9c6f4cc4691b?w=400&h=600&fit=crop",
      alt: "Product image 4",
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1558769132-7c708b9b5d4a?w=400&h=600&fit=crop",
      alt: "Product image 5",
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1558769132-4b7a5c5b5e5e?w=400&h=600&fit=crop",
      alt: "Product image 6",
    },
    {
      id: "7",
      url: "https://images.unsplash.com/photo-1558769132-6b5e5e5e5e5e?w=400&h=600&fit=crop",
      alt: "Product image 7",
    },
  ];

  // Get grid images from data or use defaults
  const gridImages =
    data.sliderImages && data.sliderImages.length > 0
      ? data.sliderImages.slice(0, 7)
      : defaultGridImages;

  // Ensure we have exactly 7 images
  const finalGridImages = [...gridImages];
  while (finalGridImages.length < 7) {
    finalGridImages.push({
      id: `default-${finalGridImages.length}`,
      url: defaultGridImages[finalGridImages.length % defaultGridImages.length]
        .url,
      alt: `Product image ${finalGridImages.length + 1}`,
    });
  }

  // Handle grid image updates
  const handleGridImageUpdate = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const currentImages =
      data.sliderImages && data.sliderImages.length > 0
        ? [...data.sliderImages]
        : [...defaultGridImages];

    // Ensure we have at least index + 1 images
    while (currentImages.length <= index) {
      currentImages.push({
        id: `default-${currentImages.length}`,
        url: defaultGridImages[currentImages.length % defaultGridImages.length]
          .url,
        alt: `Product image ${currentImages.length + 1}`,
      });
    }

    if (index < currentImages.length) {
      currentImages[index] = {
        ...currentImages[index],
        url: imageUrl,
        alt: altText || currentImages[index].alt,
      };
    }

    // Ensure we have exactly 7 images
    while (currentImages.length < 7) {
      currentImages.push({
        id: `default-${currentImages.length}`,
        url: defaultGridImages[currentImages.length % defaultGridImages.length]
          .url,
        alt: `Product image ${currentImages.length + 1}`,
      });
    }

    handleArrayItemUpdate(
      "sliderImages" as any,
      currentImages[index].id
    )(currentImages[index]);
  };

  // Ensure we have at least one button for the button to always render
  const button =
    data.buttons && data.buttons.length > 0
      ? data.buttons[0]
      : {
          id: "1",
          text: "Shop Collection",
          variant: "primary" as const,
          href: "#",
        };

  return (
    <div
      className="relative overflow-hidden bg-white"
      data-component-id={componentId}
    >
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="relative z-10 sm:max-w-lg">
            <EditableText
              value={data.title || "Summer styles are finally here"}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              isEditable={isEditable}
              placeholder="Enter hero title..."
            />
            <EditableText
              value={
                data.description ||
                "This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care if you live or die."
              }
              onChange={handleTextUpdate("description")}
              as="p"
              className="mt-4 text-xl text-gray-500"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:translate-x-8 lg:-translate-y-1/2">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    {/* Column 1 - 2 images */}
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div
                        className={`h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100 ${isEditable ? "pointer-events-auto" : ""}`}
                      >
                        <EditableImage
                          key={`grid-${componentId}-0-${finalGridImages[0].url}`}
                          src={getImageUrl(finalGridImages[0].url, {
                            width: 400,
                            height: 600,
                            crop: "fill",
                          })}
                          alt={finalGridImages[0].alt}
                          onImageChange={(url, alt) =>
                            handleGridImageUpdate(0, url, alt)
                          }
                          onAltChange={altText => {
                            handleGridImageUpdate(
                              0,
                              finalGridImages[0].url,
                              altText
                            );
                          }}
                          isEditable={isEditable}
                          className="size-full object-cover"
                          width={400}
                          height={600}
                          cloudinaryOptions={{
                            folder: "hero-grid-images",
                            resourceType: "image",
                          }}
                          showAltEditor={isEditable}
                          placeholder={{
                            width: 400,
                            height: 600,
                            text: "Image 1",
                          }}
                        />
                      </div>
                      <div
                        className={`h-64 w-44 overflow-hidden rounded-lg ${isEditable ? "pointer-events-auto" : ""}`}
                      >
                        <EditableImage
                          key={`grid-${componentId}-1-${finalGridImages[1].url}`}
                          src={getImageUrl(finalGridImages[1].url, {
                            width: 400,
                            height: 600,
                            crop: "fill",
                          })}
                          alt={finalGridImages[1].alt}
                          onImageChange={(url, alt) =>
                            handleGridImageUpdate(1, url, alt)
                          }
                          onAltChange={altText => {
                            handleGridImageUpdate(
                              1,
                              finalGridImages[1].url,
                              altText
                            );
                          }}
                          isEditable={isEditable}
                          className="size-full object-cover"
                          width={400}
                          height={600}
                          cloudinaryOptions={{
                            folder: "hero-grid-images",
                            resourceType: "image",
                          }}
                          showAltEditor={isEditable}
                          placeholder={{
                            width: 400,
                            height: 600,
                            text: "Image 2",
                          }}
                        />
                      </div>
                    </div>
                    {/* Column 2 - 3 images */}
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div
                        className={`h-64 w-44 overflow-hidden rounded-lg ${isEditable ? "pointer-events-auto" : ""}`}
                      >
                        <EditableImage
                          key={`grid-${componentId}-2-${finalGridImages[2].url}`}
                          src={getImageUrl(finalGridImages[2].url, {
                            width: 400,
                            height: 600,
                            crop: "fill",
                          })}
                          alt={finalGridImages[2].alt}
                          onImageChange={(url, alt) =>
                            handleGridImageUpdate(2, url, alt)
                          }
                          onAltChange={altText => {
                            handleGridImageUpdate(
                              2,
                              finalGridImages[2].url,
                              altText
                            );
                          }}
                          isEditable={isEditable}
                          className="size-full object-cover"
                          width={400}
                          height={600}
                          cloudinaryOptions={{
                            folder: "hero-grid-images",
                            resourceType: "image",
                          }}
                          showAltEditor={isEditable}
                          placeholder={{
                            width: 400,
                            height: 600,
                            text: "Image 3",
                          }}
                        />
                      </div>
                      <div
                        className={`h-64 w-44 overflow-hidden rounded-lg ${isEditable ? "pointer-events-auto" : ""}`}
                      >
                        <EditableImage
                          key={`grid-${componentId}-3-${finalGridImages[3].url}`}
                          src={getImageUrl(finalGridImages[3].url, {
                            width: 400,
                            height: 600,
                            crop: "fill",
                          })}
                          alt={finalGridImages[3].alt}
                          onImageChange={(url, alt) =>
                            handleGridImageUpdate(3, url, alt)
                          }
                          onAltChange={altText => {
                            handleGridImageUpdate(
                              3,
                              finalGridImages[3].url,
                              altText
                            );
                          }}
                          isEditable={isEditable}
                          className="size-full object-cover"
                          width={400}
                          height={600}
                          cloudinaryOptions={{
                            folder: "hero-grid-images",
                            resourceType: "image",
                          }}
                          showAltEditor={isEditable}
                          placeholder={{
                            width: 400,
                            height: 600,
                            text: "Image 4",
                          }}
                        />
                      </div>
                      <div
                        className={`h-64 w-44 overflow-hidden rounded-lg ${isEditable ? "pointer-events-auto" : ""}`}
                      >
                        <EditableImage
                          key={`grid-${componentId}-4-${finalGridImages[4].url}`}
                          src={getImageUrl(finalGridImages[4].url, {
                            width: 400,
                            height: 600,
                            crop: "fill",
                          })}
                          alt={finalGridImages[4].alt}
                          onImageChange={(url, alt) =>
                            handleGridImageUpdate(4, url, alt)
                          }
                          onAltChange={altText => {
                            handleGridImageUpdate(
                              4,
                              finalGridImages[4].url,
                              altText
                            );
                          }}
                          isEditable={isEditable}
                          className="size-full object-cover"
                          width={400}
                          height={600}
                          cloudinaryOptions={{
                            folder: "hero-grid-images",
                            resourceType: "image",
                          }}
                          showAltEditor={isEditable}
                          placeholder={{
                            width: 400,
                            height: 600,
                            text: "Image 5",
                          }}
                        />
                      </div>
                    </div>
                    {/* Column 3 - 2 images */}
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div
                        className={`h-64 w-44 overflow-hidden rounded-lg ${isEditable ? "pointer-events-auto" : ""}`}
                      >
                        <EditableImage
                          key={`grid-${componentId}-5-${finalGridImages[5].url}`}
                          src={getImageUrl(finalGridImages[5].url, {
                            width: 400,
                            height: 600,
                            crop: "fill",
                          })}
                          alt={finalGridImages[5].alt}
                          onImageChange={(url, alt) =>
                            handleGridImageUpdate(5, url, alt)
                          }
                          onAltChange={altText => {
                            handleGridImageUpdate(
                              5,
                              finalGridImages[5].url,
                              altText
                            );
                          }}
                          isEditable={isEditable}
                          className="size-full object-cover"
                          width={400}
                          height={600}
                          cloudinaryOptions={{
                            folder: "hero-grid-images",
                            resourceType: "image",
                          }}
                          showAltEditor={isEditable}
                          placeholder={{
                            width: 400,
                            height: 600,
                            text: "Image 6",
                          }}
                        />
                      </div>
                      <div
                        className={`h-64 w-44 overflow-hidden rounded-lg ${isEditable ? "pointer-events-auto" : ""}`}
                      >
                        <EditableImage
                          key={`grid-${componentId}-6-${finalGridImages[6].url}`}
                          src={getImageUrl(finalGridImages[6].url, {
                            width: 400,
                            height: 600,
                            crop: "fill",
                          })}
                          alt={finalGridImages[6].alt}
                          onImageChange={(url, alt) =>
                            handleGridImageUpdate(6, url, alt)
                          }
                          onAltChange={altText => {
                            handleGridImageUpdate(
                              6,
                              finalGridImages[6].url,
                              altText
                            );
                          }}
                          isEditable={isEditable}
                          className="size-full object-cover"
                          width={400}
                          height={600}
                          cloudinaryOptions={{
                            folder: "hero-grid-images",
                            resourceType: "image",
                          }}
                          showAltEditor={isEditable}
                          placeholder={{
                            width: 400,
                            height: 600,
                            text: "Image 7",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <EditableLink
                text={button.text || "Shop Collection"}
                href={button.href || "#"}
                onChange={(text, href) => {
                  // If button doesn't exist in data.buttons, create it
                  if (!data.buttons || data.buttons.length === 0) {
                    const newButton = {
                      id: "1",
                      text,
                      href: href || "#",
                      variant: "primary" as const,
                    };
                    const updatedData = { ...data, buttons: [newButton] };
                    setData(updatedData);
                    onUpdate?.({ buttons: [newButton] });
                  } else {
                    handleButtonUpdate("buttons")(button.id, text, href);
                  }
                }}
                isEditable={isEditable}
                siteUser={siteUser}
                style={{
                  background: theme.colors.primary ? theme.colors.primary : "",
                  color: theme.colors.primaryForeground,
                }}
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                <span>{button.text}</span>
                <span className="ml-2">
                  <ChevronRight />
                </span>
              </EditableLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
