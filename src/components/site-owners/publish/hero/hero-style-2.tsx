"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { HeroData } from "@/types/owner-site/components/hero";
import {
  convertUnsplashUrl,
  optimizeCloudinaryUrl,
  uploadToCloudinary,
} from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/publish/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { toast } from "sonner";

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
  const [data, setData] = useState<HeroData>(() => ({
    ...heroData,
    buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
    sliderImages: heroData.sliderImages?.map(img => ({ ...img })) || [],
  }));
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const { data: themeResponse } = useThemeQuery();

  useEffect(() => {
    setData({
      ...heroData,
      buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
      sliderImages: heroData.sliderImages?.map(img => ({ ...img })) || [],
    });
  }, [heroData]);

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

  const componentId = React.useId();

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    // Only send the specific field that changed
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

  const handleBackgroundImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);

    // Only update the specific background fields for this component
    onUpdate?.({
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
      imageAlt: updatedData.imageAlt,
    });
  };

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Please select a valid image file (${allowedTypes.join(", ")})`
      );
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingBackground(true);

    try {
      // Create unique filename to avoid conflicts
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const uniqueFilename = `bg_${timestamp}_${randomId}_${file.name}`;

      // Upload to Cloudinary with unique public_id
      const imageUrl = await uploadToCloudinary(file, {
        folder: "hero-backgrounds",
        resourceType: "image",
      });

      // Update only this component's background
      handleBackgroundImageUpdate(imageUrl, `Background image: ${file.name}`);

      toast.success("Background image uploaded successfully!");
    } catch (error) {
      console.error("Background upload failed:", error);
      toast.error("Failed to upload background image. Please try again.");
    } finally {
      setIsUploadingBackground(false);
      // Reset file input
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
      data-component-id={componentId}
    >
      {/* Background Change Button - Only visible when editable */}
      {isEditable && (
        <div className="absolute top-6 right-6 z-10">
          <label
            htmlFor={`background-upload-${componentId}`}
            className={`mr-12 cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white ${
              isUploadingBackground ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {isUploadingBackground ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              "Change Background"
            )}
          </label>
          <input
            id={`background-upload-${componentId}`} // FIX 8: Unique input ID
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
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Uploading background image...</p>
          </div>
        </div>
      )}

      {/* FIX 9: Conditional EditableImage with unique key */}
      {data.backgroundType === "image" && data.backgroundImageUrl && (
        <EditableImage
          key={`bg-${componentId}-${data.backgroundImageUrl}`} // Unique key
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

      {/* Rest of the component remains the same... */}
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
                key={`btn-${componentId}-${btn.id}`}
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

        {/* Image Slider section with unique keys */}
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
                    <div
                      className="w-full flex-shrink-0"
                      key={`slide-${componentId}-${img.id || index}`}
                    >
                      <EditableImage
                        key={`slide-img-${componentId}-${index}-${img.url}`}
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
              {data.sliderImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 absolute top-1/2 left-2 z-10 -translate-y-1/2 backdrop-blur-sm"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 absolute top-1/2 right-2 z-10 -translate-y-1/2 backdrop-blur-sm"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Slide indicators */}
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
                    {data.sliderImages.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === currentSlide ? "bg-white" : "bg-white/50"
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </>
              )}
              {isEditable && (
                <div className="mt-6 text-center">
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
