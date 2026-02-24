"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { HeroTemplate2Data } from "@/types/owner-site/components/hero";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { toast } from "sonner";

interface HeroTemplate2Props {
  heroData: HeroTemplate2Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate2Data>) => void;
  siteUser?: string;
}

export const HeroTemplate2: React.FC<HeroTemplate2Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
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

  const {
    data,
    setData,
    handleTextUpdate,
    handleButtonUpdate,
    handleArrayItemUpdate,
    getImageUrl,
  } = useBuilderLogic(heroData, onUpdate);

  const componentId = React.useId();

  const handleSliderImageUpdate = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const imgId = data.sliderImages?.[index]?.id || `slide-${index}`;
    handleArrayItemUpdate(
      "sliderImages",
      imgId
    )({
      url: imageUrl,
      alt: altText || data.sliderImages?.[index]?.alt,
    });
  };

  const handleBackgroundImageUpdate = (imageUrl: string, altText?: string) => {
    const update = {
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    const updatedData = { ...data, ...update };
    setData(updatedData);
    onUpdate?.(update);
  };

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Please select a valid image file (${allowedTypes.join(", ")})`
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingBackground(true);

    try {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const uniqueFilename = `bg_${timestamp}_${randomId}_${file.name}`;

      const imageUrl = await uploadToCloudinary(file, {
        folder: "hero-backgrounds",
        resourceType: "image",
      });

      handleBackgroundImageUpdate(imageUrl, `Background image: ${file.name}`);
      toast.success("Background image uploaded successfully!");
    } catch (error) {
      console.error("Background upload failed:", error);
      toast.error("Failed to upload background image. Please try again.");
    } finally {
      setIsUploadingBackground(false);
      event.target.value = "";
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
      className="relative flex min-h-screen w-full items-center py-20 lg:py-32"
      style={{
        ...getBackgroundStyles(),
        color: textColor,
        fontFamily: theme.fonts.body,
      }}
      data-component-id={componentId}
    >
      {/* Background Change Button */}
      {isEditable && (
        <div className="absolute top-3 right-3 z-10 sm:top-4 sm:right-4 md:top-6 md:right-6">
          <label
            htmlFor={`background-upload-${componentId}`}
            className={`cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-3 py-1.5 text-xs font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white sm:px-4 sm:py-2 sm:text-sm ${
              isUploadingBackground ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {isUploadingBackground ? (
              <span className="flex items-center gap-1 sm:gap-2">
                <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Uploading...</span>
                <span className="sm:hidden">...</span>
              </span>
            ) : (
              <>
                <span className="hidden sm:inline">Change Background</span>
                <span className="sm:hidden">Change BG</span>
              </>
            )}
          </label>
          <input
            id={`background-upload-${componentId}`}
            type="file"
            accept="image/*"
            onChange={handleBackgroundFileChange}
            className="hidden"
            disabled={isUploadingBackground}
          />
        </div>
      )}

      {/* Background Upload Loading Overlay */}
      {isUploadingBackground && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-2 text-white">
            <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8" />
            <p className="px-4 text-center text-xs font-medium sm:text-sm">
              Uploading background...
            </p>
          </div>
        </div>
      )}

      {/* Background EditableImage */}
      {data.backgroundType === "image" && data.backgroundImageUrl && (
        <EditableImage
          src={data.backgroundImageUrl}
          alt={data.imageAlt || "Background image"}
          onImageChange={handleBackgroundImageUpdate}
          isEditable={isEditable}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
          priority
          cloudinaryOptions={{
            folder: "hero-backgrounds",
            resourceType: "image",
          }}
          imageOptimization={{
            width: 1920,
            height: 1080,
            quality: "auto",
            format: "auto",
            crop: "fill",
          }}
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

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text Content */}
          <div className="order-2 flex flex-col items-start gap-6 text-left lg:order-1">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl"
              isEditable={isEditable}
              placeholder="Enter your hero title..."
            />

            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              as="p"
              className="text-lg font-medium opacity-90"
              isEditable={isEditable}
              placeholder="Enter subtitle..."
            />

            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="max-w-lg text-lg leading-relaxed opacity-80"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {/* Buttons */}
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {data.buttons.map(btn => (
                <EditableLink
                  key={`btn-${componentId}-${btn.id}`}
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
                  className="rounded-lg px-8 py-3 font-medium transition-transform hover:scale-105"
                  text={btn.text}
                  href={btn.href || "#"}
                  onChange={(text, href) =>
                    handleButtonUpdate("buttons")(btn.id, text, href)
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter button URL..."
                />
              ))}
            </div>
          </div>

          {/* Image Slider */}
          {data.showSlider &&
            data.sliderImages &&
            data.sliderImages.length > 0 && (
              <div className="group relative order-1 w-full lg:order-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                  <div
                    className="flex h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {data.sliderImages.map((img, index) => (
                      <div
                        className="relative h-full w-full flex-shrink-0"
                        key={`slide-${componentId}-${img.id || index}`}
                      >
                        <EditableImage
                          key={`slide-img-${componentId}-${index}-${img.url}`}
                          src={getImageUrl(img.url, {
                            width: 800,
                            height: 600,
                            crop: "fill",
                          })}
                          alt={img.alt || `Slide ${index + 1}`}
                          onImageChange={(imageUrl, altText) =>
                            handleSliderImageUpdate(index, imageUrl, altText)
                          }
                          onAltChange={altText => {
                            const imgId =
                              data.sliderImages?.[index]?.id ||
                              `slide-${index}`;
                            handleArrayItemUpdate(
                              "sliderImages",
                              imgId
                            )({ alt: altText });
                          }}
                          isEditable={isEditable}
                          className="h-full w-full object-cover"
                          width={800}
                          height={600}
                          cloudinaryOptions={{
                            folder: "hero-slider-images",
                            resourceType: "image",
                          }}
                          showAltEditor={isEditable}
                          placeholder={{
                            width: 800,
                            height: 600,
                            text: `Upload slide ${index + 1}`,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Slider Navigation */}
                  {data.sliderImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40"
                        onClick={prevSlide}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40"
                        onClick={nextSlide}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>

                      {/* Slide indicators */}
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
                        {data.sliderImages.map((_, index) => (
                          <button
                            key={index}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                              index === currentSlide
                                ? "w-6 bg-white"
                                : "bg-white/50"
                            }`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Add New Slide Button */}
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
                    >
                      Add New Slide
                    </Button>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  );
};
