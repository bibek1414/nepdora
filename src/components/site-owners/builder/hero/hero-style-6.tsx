"use client";

import React, { useState, useEffect } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate6Data } from "@/types/owner-site/components/hero";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface HeroTemplate6Props {
  heroData: HeroTemplate6Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate6Data>) => void;
}

export const HeroTemplate6: React.FC<HeroTemplate6Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);

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
      url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0",
      alt: "Workout attire collection",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1545151414-8a948e1ea54f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0",
      alt: "Fitness clothing",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0",
      alt: "Activewear selection",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0",
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
      url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0",
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

  const handleSlideUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
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
      const imageUrl = await uploadToCloudinary(file, {
        folder: "hero-slides",
        resourceType: "image",
      });

      handleSliderImageUpdate(imageUrl, `Slide image: ${file.name}`, index);
      toast.success("Slide image uploaded successfully!");
    } catch (error) {
      console.error("Slide upload failed:", error);
      toast.error("Failed to upload slide image. Please try again.");
    } finally {
      setIsUploadingBackground(false);
      event.target.value = "";
    }
  };

  return (
    <div className="relative h-screen w-full font-body" data-component-id={componentId}>
      {isEditable && (
        <div className="absolute top-6 right-4 z-30 flex gap-2">
          <button
            onClick={addSlide}
            className="rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            Add Slide
          </button>
          <button
            onClick={() => removeSlide(current)}
            className="rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            Remove Current Slide
          </button>
        </div>
      )}

      {/* Upload Loading Overlay */}
      {isUploadingBackground && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-2 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Uploading image...</p>
          </div>
        </div>
      )}

      <Carousel opts={{ loop: true }} setApi={setApi} className="h-full w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative h-screen w-full">
              {/* Background image */}
              <div className="absolute inset-0 h-full w-full">
                {/* Direct image background */}
                <div
                  className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${slide.url})`,
                  }}
                />

                {/* Hidden EditableImage for functionality */}
                <EditableImage
                  key={`slide-${componentId}-${index}-${slide.url}`}
                  src={slide.url}
                  alt={slide.alt}
                  onImageChange={(url, alt) =>
                    handleSliderImageUpdate(url, alt, index)
                  }
                  isEditable={isEditable}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
                  cloudinaryOptions={{
                    folder: "hero-slides",
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
                    text: `Slide ${index + 1}`,
                  }}
                />

                {/* Change Background Button for current slide */}
                {isEditable && current === index && (
                  <div className="absolute top-4 left-4 z-10">
                    <label
                      htmlFor={`slide-upload-${componentId}-${index}`}
                      className={`cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-3 py-1 text-xs font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white ${
                        isUploadingBackground
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      {isUploadingBackground ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        "Change Background"
                      )}
                    </label>
                    <input
                      id={`slide-upload-${componentId}-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={e => handleSlideUpload(e, index)}
                      className="hidden"
                      disabled={isUploadingBackground}
                    />
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-black/40"></div>

              {/* Text content with proper container */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                  <div className="max-w-2xl flex flex-col items-start text-left space-y-6">
                    {/* Main Title */}
                    <EditableText
                      key={`title-${componentId}`}
                      value={data.title || "Find your perfect workout attire"}
                      onChange={handleTextUpdate("title")}
                      as="h1"
                      className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight font-heading"
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
                      className="text-xl font-medium text-white/90 font-body"
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
                      className="text-lg text-white/80 font-body"
                      isEditable={isEditable}
                      placeholder="Enter additional text..."
                      multiline={true}
                    />

                    {/* CTA Button */}
                    {data.buttons.length > 0 && (
                      <div className="pt-4">
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
                          className="rounded-full bg-primary text-primary-foreground font-body px-8 py-4 text-base font-bold shadow-lg transition duration-300 hover:bg-gray-100 hover:scale-105"
                          textPlaceholder="Button text..."
                          hrefPlaceholder="Enter URL..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots navigation */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                current === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};
