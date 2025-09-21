"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, ArrowRight } from "lucide-react";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface HeroTemplate2Props {
  heroData: HeroData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
  siteUser?: string;
}

export const HeroTemplate2: React.FC<HeroTemplate2Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState(heroData);
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
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

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
  };

  // Handle button text and href updates
  const handleButtonUpdate = (
    buttonId: string,
    text: string,
    href?: string
  ) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId
        ? { ...btn, text, ...(href !== undefined && { href }) }
        : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };

  // Handle slider image updates
  const handleSliderImageUpdate = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const updatedSliderImages =
      data.sliderImages?.map((img, idx) =>
        idx === index ? { ...img, url: imageUrl, alt: altText || img.alt } : img
      ) || [];
    const updatedData = { ...data, sliderImages: updatedSliderImages };
    setData(updatedData);
    onUpdate?.({ sliderImages: updatedSliderImages });
  };

  // Handle background image updates
  const handleBackgroundImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
      imageAlt: updatedData.imageAlt,
    });
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
          const updatedData: HeroData = {
            ...data,
            backgroundType: "image" as const,
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

  const getBackgroundStyles = (): React.CSSProperties => {
    if (data.backgroundType === "image" && data.backgroundImageUrl) {
      return {
        backgroundImage: `url(${data.backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {
      backgroundColor: data.backgroundColor || theme.colors.background,
    };
  };

  const getLayoutClasses = () => {
    let classes = "flex-1 ";
    switch (data.layout) {
      case "text-left":
        classes += "text-left items-start";
        break;
      case "text-right":
        classes += "text-right items-end";
        break;
      default:
        classes += "text-center items-center";
        break;
    }
    return classes;
  };

  const getSliderImageUrl = (url: string) => {
    return optimizeCloudinaryUrl(convertUnsplashUrl(url), {
      width: 600,
      height: 400,
      quality: "auto",
      format: "auto",
      crop: "fill",
    });
  };

  const nextSlide = () => {
    if (data.sliderImages && data.sliderImages.length > 0) {
      setCurrentSlide(prev => (prev + 1) % data.sliderImages!.length);
    }
  };

  const prevSlide = () => {
    if (data.sliderImages && data.sliderImages.length > 0) {
      setCurrentSlide(prev =>
        prev === 0 ? data.sliderImages!.length - 1 : prev - 1
      );
    }
  };

  // Auto-slide effect
  React.useEffect(() => {
    if (data.showSlider && data.sliderImages && data.sliderImages.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [data.showSlider, data.sliderImages?.length]);

  const textColor =
    data.backgroundType === "image" || data.backgroundColor === "#000000"
      ? "#FFFFFF"
      : theme.colors.text;

  return (
    <section
      className="relative flex min-h-[60vh] w-full items-end p-8 md:p-16"
      style={{
        ...getBackgroundStyles(),
        color: textColor,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Background Change Button - Only visible when editable */}
      {isEditable && (
        <div className="absolute top-6 right-6 z-20">
          <label
            htmlFor="background-upload-hero2"
            className="mr-10 cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            Change Background
          </label>
          <input
            id="background-upload-hero2"
            type="file"
            accept="image/*"
            onChange={handleBackgroundFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Hidden EditableImage for background editing capabilities */}
      {data.backgroundType === "image" && data.backgroundImageUrl && (
        <EditableImage
          src={data.backgroundImageUrl}
          alt={data.imageAlt || "Background image"}
          onImageChange={handleBackgroundImageUpdate}
          isEditable={isEditable}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
          priority
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Upload background image",
          }}
        />
      )}

      {/* Overlay */}
      {data.backgroundType === "image" && data.showOverlay && (
        <div
          className="absolute inset-0 z-0 bg-black"
          style={{
            opacity: data.overlayOpacity || 0.5,
          }}
        />
      )}

      <div className="relative z-10 container mx-auto flex max-w-7xl items-end gap-8">
        {/* Content */}
        <div className={`flex flex-col gap-4 ${getLayoutClasses()}`}>
          {/* Editable text components */}
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h1"
            className="text-4xl leading-tight font-bold md:text-6xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
            placeholder="Enter your hero title..."
          />

          <EditableText
            value={data.subtitle}
            onChange={handleTextUpdate("subtitle")}
            as="p"
            className="max-w-2xl text-lg md:text-xl"
            style={{ fontFamily: theme.fonts.body }}
            isEditable={isEditable}
            placeholder="Enter subtitle..."
          />

          {data.description && (
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="text-md max-w-2xl opacity-90"
              style={{ fontFamily: theme.fonts.body }}
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          )}

          {/* Buttons with theme styling */}
          <div className="mt-4 flex flex-wrap gap-3">
            {data.buttons.map(btn => (
              <Button
                key={btn.id}
                variant={btn.variant === "primary" ? "default" : btn.variant}
                size="lg"
                style={{
                  backgroundColor:
                    btn.variant === "primary"
                      ? theme.colors.primary
                      : theme.colors.secondary,
                  color:
                    btn.variant === "primary"
                      ? theme.colors.primaryForeground
                      : theme.colors.secondaryForeground,
                  fontFamily: theme.fonts.body,
                }}
                asChild
              >
                <EditableLink
                  text={btn.text}
                  href={btn.href || "#"}
                  onChange={(text, href) =>
                    handleButtonUpdate(btn.id, text, href)
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter button URL..."
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Image Slider - Improved consistency */}
        {data.showSlider &&
          data.sliderImages &&
          data.sliderImages.length > 0 && (
            <div className="relative w-1/3 md:block">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {data.sliderImages.map((img, index) => (
                    <div className="w-full flex-shrink-0" key={img.id || index}>
                      <EditableImage
                        src={getSliderImageUrl(img.url)}
                        alt={img.alt || `Slide ${index + 1}`}
                        onImageChange={(imageUrl, altText) =>
                          handleSliderImageUpdate(index, imageUrl, altText)
                        }
                        onAltChange={altText => {
                          const updatedSliderImages =
                            data.sliderImages?.map((sliderImg, idx) =>
                              idx === index
                                ? { ...sliderImg, alt: altText }
                                : sliderImg
                            ) || [];
                          const updatedData = {
                            ...data,
                            sliderImages: updatedSliderImages,
                          };
                          setData(updatedData);
                          onUpdate?.({ sliderImages: updatedSliderImages });
                        }}
                        isEditable={isEditable}
                        className="h-80 w-full object-cover"
                        width={600}
                        height={400}
                        cloudinaryOptions={{
                          folder: "hero-slider-images",
                          resourceType: "image",
                        }}
                        showAltEditor={isEditable}
                        placeholder={{
                          width: 600,
                          height: 400,
                          text: `Upload slide ${index + 1}`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              {data.sliderImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 left-2 z-10 -translate-y-1/2 backdrop-blur-sm"
                    style={{
                      backgroundColor: `${theme.colors.background}cc`,
                      borderColor: theme.colors.primary,
                    }}
                    onClick={prevSlide}
                  >
                    <ChevronLeft
                      className="h-4 w-4"
                      style={{ color: theme.colors.primary }}
                    />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 right-2 z-10 -translate-y-1/2 backdrop-blur-sm"
                    style={{
                      backgroundColor: `${theme.colors.background}cc`,
                      borderColor: theme.colors.primary,
                    }}
                    onClick={nextSlide}
                  >
                    <ChevronRight
                      className="h-4 w-4"
                      style={{ color: theme.colors.primary }}
                    />
                  </Button>

                  {/* Slide indicators */}
                  <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform space-x-2">
                    {data.sliderImages.map((_, index) => (
                      <button
                        key={index}
                        className="h-2 w-2 rounded-full transition-colors"
                        style={{
                          backgroundColor:
                            index === currentSlide
                              ? theme.colors.primary
                              : `${theme.colors.primary}80`,
                        }}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Add new slide button - Only visible when editable */}
              {isEditable && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newSlide = {
                        id: `slide-${Date.now()}`,
                        url: "https://via.placeholder.com/600x400?text=New+Slide",
                        alt: `Slide ${(data.sliderImages?.length || 0) + 1}`,
                      };
                      const updatedSliderImages = [
                        ...(data.sliderImages || []),
                        newSlide,
                      ];
                      const updatedData = {
                        ...data,
                        sliderImages: updatedSliderImages,
                      };
                      setData(updatedData);
                      onUpdate?.({ sliderImages: updatedSliderImages });
                    }}
                    style={{
                      borderColor: theme.colors.primary,
                      color: theme.colors.primary,
                    }}
                  >
                    Add New Slide
                  </Button>
                </div>
              )}
            </div>
          )}
      </div>
    </section>
  );
};
