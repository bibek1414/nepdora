"use client";

import React, { useState, useEffect } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/publish/editable-link";
import { HeroData } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface HeroTemplate5Props {
  heroData: HeroData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

export const HeroTemplate5: React.FC<HeroTemplate5Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();

  const [data, setData] = useState<HeroData>(() => ({
    ...heroData,
    buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
  }));

  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const { data: themeResponse } = useThemeQuery();

  useEffect(() => {
    setData({
      ...heroData,
      buttons: heroData.buttons?.map(btn => ({ ...btn })) || [],
    });
  }, [heroData]);

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
      body: "serif",
      heading: "serif",
    },
  };

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
  };

  const handleImageUpdate = (imageUrl: string, altText?: string) => {
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

  // Handle button updates
  const handleButtonUpdate = (buttonId: string, text: string, href: string) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, text, href } : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
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
      className="relative flex min-h-screen items-center justify-center text-center text-white"
      data-component-id={componentId}
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

      {/* Background Image */}
      {data.backgroundType === "image" && data.backgroundImageUrl ? (
        <>
          {/* Direct image background */}
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${data.backgroundImageUrl})`,
            }}
          />
          <EditableImage
            key={`bg-${componentId}-${data.backgroundImageUrl}`} // Unique key
            src={data.backgroundImageUrl}
            alt={data.imageAlt || "Background image"}
            onImageChange={handleImageUpdate}
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
          {/* Overlay */}
          {data.showOverlay && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${data.overlayOpacity || 0.7})`,
              }}
            />
          )}
        </>
      ) : (
        /* Default/Color Background */
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: data.backgroundColor || theme.colors.background,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6">
        {/* Badge/Subtitle */}
        <EditableText
          key={`subtitle-${componentId}`}
          value={data.subtitle || "Introducing the UA-01"}
          onChange={handleTextUpdate("subtitle")}
          as="p"
          className="mb-4 text-sm tracking-[0.2em] uppercase"
          style={{
            color: "#D1D5DB", // text-gray-300 equivalent
            fontFamily: theme.fonts.body,
          }}
          isEditable={isEditable}
          placeholder="Enter subtitle/badge text..."
        />

        {/* Main Title */}
        <EditableText
          key={`title-${componentId}`} // Unique key
          value={data.title}
          onChange={handleTextUpdate("title")}
          as="h1"
          className="text-5xl leading-tight font-bold sm:text-6xl md:text-7xl"
          isEditable={isEditable}
          placeholder="Enter main title..."
          multiline={true}
        />

        {/* Description */}
        <EditableText
          key={`description-${componentId}`} // Unique key
          value={data.description}
          onChange={handleTextUpdate("description")}
          as="p"
          className="mt-6 text-lg"
          isEditable={isEditable}
          placeholder="Enter description..."
          multiline={true}
        />

        {/* Buttons with unique keys */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          {data.buttons.length > 0 && (
            <EditableLink
              key={`button-1-${componentId}`} // Unique key
              text={data.buttons[0]?.text || "Discover More"}
              href={data.buttons[0]?.href || "#"}
              onChange={(text, href) =>
                handleButtonUpdate(data.buttons[0]?.id || "1", text, href)
              }
              isEditable={isEditable}
              siteUser={siteUser}
              className="rounded-full px-8 py-3 font-semibold transition hover:bg-gray-200"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
                fontFamily: theme.fonts.body,
              }}
              textPlaceholder="Primary button text..."
              hrefPlaceholder="Enter URL..."
            />
          )}

          {data.buttons.length > 1 && (
            <EditableLink
              key={`button-2-${componentId}`} // Unique key
              text={data.buttons[1]?.text || "Explore Collection"}
              href={data.buttons[1]?.href || "#"}
              onChange={(text, href) =>
                handleButtonUpdate(data.buttons[1]?.id || "2", text, href)
              }
              isEditable={isEditable}
              siteUser={siteUser}
              className="rounded-full border px-8 py-3 transition hover:bg-white/10"
              style={{
                borderColor: theme.colors.text,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
              textPlaceholder="Secondary button text..."
              hrefPlaceholder="Enter URL..."
            />
          )}
        </div>
      </div>
    </div>
  );
};
