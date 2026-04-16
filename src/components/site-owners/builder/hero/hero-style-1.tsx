"use client";

import React, { useState, useEffect } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate1Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { toast } from "sonner";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface HeroTemplate1Props {
  heroData: HeroTemplate1Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate1Data>) => void;
}

export const HeroTemplate1: React.FC<HeroTemplate1Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
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
      body: "sans-serif",
      heading: "sans-serif",
    },
  };

  const {
    data,
    setData,
    handleTextUpdate,
    handleButtonUpdate,
    handleArrayItemUpdate,
  } = useBuilderLogic(heroData, onUpdate);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-slider effect when not editable
  useEffect(() => {
    if (!api || isEditable) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [api, isEditable]);

  // Default slides if no slider images are provided
  const defaultSlides = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      alt: "Workout attire collection",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      alt: "Fitness clothing",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      alt: "Activewear selection",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      alt: "Workout gear",
    },
  ];

  const slides =
    data.sliderImages && data.sliderImages.length > 0
      ? data.sliderImages
      : defaultSlides;

  // Handle slider image updates
  const handleSliderImageUpdate = (
    imageUrl: string,
    altText?: string,
    index?: number
  ) => {
    const updatedSliderImages = [...slides];

    if (index !== undefined && index < updatedSliderImages.length) {
      handleArrayItemUpdate(
        "sliderImages",
        updatedSliderImages[index].id
      )({
        url: imageUrl,
        alt: altText || updatedSliderImages[index].alt,
      });
    } else {
      // Add new image
      const newSlide = {
        id: `slide-${Date.now()}`,
        url: imageUrl,
        alt: altText || "Slider image",
      };
      const updatedData = {
        ...data,
        sliderImages: [...(data.sliderImages || []), newSlide],
      };
      setData(updatedData);
      onUpdate?.({ sliderImages: updatedData.sliderImages });
    }
  };

  // Handle slide addition/removal
  const addSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      alt: "New slide",
    };
    const updatedSliderImages = [...slides, newSlide];
    const updatedData = { ...data, sliderImages: updatedSliderImages };
    setData(updatedData);
    onUpdate?.({ sliderImages: updatedSliderImages });
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) {
      toast.error("At least one slide is required");
      return;
    }

    const updatedSliderImages = slides.filter((_, i) => i !== index);
    const updatedData = { ...data, sliderImages: updatedSliderImages };
    setData(updatedData);
    onUpdate?.({ sliderImages: updatedSliderImages });

    // Scroll to previous slide if current slide is removed
    if (current >= index && current > 0) {
      setTimeout(() => api?.scrollTo(current - 1), 100);
    }
  };

  return (
    <div
      className="relative h-screen min-h-[500px] w-full"
      data-component-id={componentId}
    >
      {isEditable && (
        <div className="absolute top-6 right-4 z-30 flex flex-wrap justify-end gap-2 px-4">
          <button
            onClick={addSlide}
            className="rounded-lg border border-gray-300 bg-white/90 px-3 py-1.5 text-xs font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white sm:px-4 sm:py-2 sm:text-sm"
          >
            Add Slide
          </button>
          <button
            onClick={() => removeSlide(current)}
            className="rounded-lg border border-gray-300 bg-white/90 px-3 py-1.5 text-xs font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white sm:px-4 sm:py-2 sm:text-sm"
          >
            Remove Current Slide
          </button>
        </div>
      )}

      <Carousel opts={{ loop: true }} setApi={setApi} className="h-full w-full">
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem
              key={slide.id}
              className="relative h-screen min-h-[500px] w-full"
            >
              {/* Background image */}
              <div className="absolute inset-0 h-full w-full">
                {/* Direct image background */}
                <div
                  className="group absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${slide.url})`,
                  }}
                >
                  <ImageEditOverlay
                    onImageSelect={url =>
                      handleSliderImageUpdate(url, undefined, index)
                    }
                    imageWidth={1920}
                    imageHeight={1080}
                    isEditable={isEditable && current === index}
                    label="Change Background"
                    folder="hero-slides"
                    className="absolute top-6 left-6 z-30"
                  />
                </div>

                {/* Hidden EditableImage for functionality */}
              </div>

              <div className="absolute inset-0 bg-black/50"></div>

              {/* Text content with proper container */}
              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                <div className="mx-auto w-full max-w-7xl">
                  <div className="flex items-center justify-center md:items-start md:justify-start">
                    <div className="max-w-xl space-y-4 text-center text-white sm:space-y-6 md:text-left">
                      {/* Main Title */}
                      <EditableText
                        key={`title-${componentId}`}
                        value={data.title || "Find your perfect workout attire"}
                        onChange={handleTextUpdate("title")}
                        as="h1"
                        className="text-3xl font-black tracking-wider sm:text-4xl md:text-5xl lg:text-7xl"
                        isEditable={isEditable}
                        placeholder="Enter main title..."
                        multiline={true}
                      />

                      {/* Subtitle */}
                      <EditableText
                        key={`subtitle-${componentId}`}
                        value={
                          data.subtitle ||
                          "An exclusive selection of this season's trends."
                        }
                        onChange={handleTextUpdate("subtitle")}
                        as="p"
                        className="text-base opacity-90 sm:text-lg md:text-xl"
                        isEditable={isEditable}
                        placeholder="Enter subtitle..."
                        multiline={true}
                      />

                      {/* Additional Text */}
                      <EditableText
                        key={`description-${componentId}`}
                        value={data.description || "Exclusively online!"}
                        onChange={handleTextUpdate("description")}
                        as="p"
                        className="text-sm font-medium tracking-widest uppercase opacity-80 sm:text-base"
                        isEditable={isEditable}
                        placeholder="Enter additional text..."
                        multiline={true}
                      />

                      {/* CTA Button */}
                      {data.buttons.length > 0 && (
                        <div className="flex justify-center pt-2 md:justify-start">
                          <EditableLink
                            key={`button-${componentId}`}
                            text={data.buttons[0]?.text || "SHOP COLLECTION"}
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
                            className="inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black shadow-lg transition duration-300 hover:bg-gray-200 sm:px-10 sm:py-4 sm:text-base"
                            style={{
                              backgroundColor: theme.colors.primary,
                              color: theme.colors.primaryForeground,
                            }}
                            textPlaceholder="Button text..."
                            hrefPlaceholder="Enter URL..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots navigation */}
        <div className="absolute right-10 bottom-10 z-20 flex -translate-x-1/2 justify-center space-x-2 px-4 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all sm:h-1.5 sm:w-16 md:w-20",
                current === index ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};
