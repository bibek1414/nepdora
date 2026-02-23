"use client";

import React, { useState } from "react";
import { HeroTemplate5Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { cn } from "@/lib/utils";

interface HeroTemplate5Props {
  heroData: HeroTemplate5Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate5Data>) => void;
}

export const HeroTemplate5: React.FC<HeroTemplate5Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();

  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const { data: themeResponse } = useThemeQuery();

  const {
    data,
    setData,
    handleTextUpdate,
    handleButtonUpdate,
  } = useBuilderLogic(heroData, onUpdate);

  const handleImageUpdate = (imageUrl: string, altText?: string) => {
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
      // Upload to Cloudinary with unique public_id
      const imageUrl = await uploadToCloudinary(file, {
        folder: "hero-backgrounds",
        resourceType: "image",
      });

      // Update only this component's background
      handleImageUpdate(imageUrl, `Background image: ${file.name}`);

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

  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center font-body",
        data.backgroundType !== "image" && !data.backgroundImageUrl && "bg-background text-foreground"
      )}
      data-component-id={componentId}
      style={{
        ...(data.backgroundType === "image" && data.backgroundImageUrl
          ? {
              backgroundImage: `url(${data.backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {
              backgroundColor: data.backgroundColor, // keep if manually set, otherwise fallback to class
            }),
      }}
    >
      {/* Background Change Button - Only visible when editable */}
      {isEditable && (
        <div className="absolute top-6 right-4 z-10">
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
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Uploading background image...</p>
          </div>
        </div>
      )}

      {/* Hidden EditableImage for upload functionality only */}
      {data.backgroundType === "image" &&
        data.backgroundImageUrl &&
        isEditable && (
          <div className="hidden">
            <EditableImage
              key={`bg-edit-${componentId}`}
              src={data.backgroundImageUrl}
              alt={data.imageAlt || "Background image"}
              onImageChange={handleImageUpdate}
              isEditable={true}
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
          </div>
        )}

      {/* Overlay - Only show if image background with overlay enabled */}
      {data.backgroundType === "image" && data.showOverlay && (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${data.overlayOpacity || 0.7})`,
          }}
        />
      )}

      {/* Content - Make sure it's above the overlay */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl flex flex-col items-start text-left space-y-8">
          {/* Badge/Subtitle */}
          <div className="inline-block">
            <EditableText
              key={`subtitle-${componentId}`}
              value={data.subtitle || "Introducing the UA-01"}
              onChange={handleTextUpdate("subtitle")}
              as="h1"
              style={{
                color: "#D1D5DB", // text-gray-300 equivalent
              }}
              className="text-sm font-semibold tracking-wider uppercase border-l-2 pl-4 border-white/50 font-body"
              isEditable={isEditable}
              placeholder="Enter subtitle/badge text..."
            />
          </div>

          {/* Main Title */}
          <EditableText
            key={`title-${componentId}`}
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl text-white font-heading"
            isEditable={isEditable}
            placeholder="Enter main title..."
            multiline={true}
          />

          {/* Description */}
          <EditableText
            key={`description-${componentId}`}
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            className="text-xl text-gray-300 leading-relaxed max-w-2xl font-body"
            isEditable={isEditable}
            placeholder="Enter description..."
            multiline={true}
          />

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {data.buttons.length > 0 && (
              <EditableLink
                key={`button-1-${componentId}`}
                text={data.buttons[0]?.text || "Discover More"}
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
                className="px-8 py-4 rounded-lg font-medium transition-transform hover:scale-105 bg-primary text-primary-foreground font-body"
                textPlaceholder="Primary button text..."
                hrefPlaceholder="Enter URL..."
              />
            )}

            {data.buttons.length > 1 && (
              <EditableLink
                key={`button-2-${componentId}`}
                text={data.buttons[1]?.text || "Explore Collection"}
                href={data.buttons[1]?.href || "#"}
                onChange={(text, href) =>
                  handleButtonUpdate("buttons")(
                    data.buttons[1]?.id || "2",
                    text,
                    href
                  )
                }
                isEditable={isEditable}
                siteUser={siteUser}
                className="px-8 py-4 rounded-lg font-medium border border-white/30 hover:bg-white/10 transition-colors text-white font-body"
                textPlaceholder="Secondary button text..."
                hrefPlaceholder="Enter URL..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
