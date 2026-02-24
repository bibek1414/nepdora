"use client";

import React, { useState } from "react";
import { CTATemplate3Data } from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CTATemplate3Props {
  ctaData: CTATemplate3Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate3Data>) => void;
}

export const CTATemplate3: React.FC<CTATemplate3Props> = ({
  ctaData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();

  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const { data: themeResponse } = useThemeQuery();

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

  const { data, setData, handleTextUpdate, handleButtonUpdate } =
    useBuilderLogic(ctaData, onUpdate);

  const handleBackgroundImageUpdate = (imageUrl: string) => {
    const update = {
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
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
        folder: "cta-backgrounds",
        resourceType: "image",
      });

      // Update background
      handleBackgroundImageUpdate(imageUrl);

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

  const getButtonClassesLocal = (variant: string) => {
    const baseClasses =
      " px-8 py-4 font-bold transition-all duration-300 min-w-[140px] text-center rounded-lg hover:shadow-lg hover:-translate-y-0.5";

    const buttonStyles = {
      backgroundColor:
        variant === "primary"
          ? theme.colors.primary
          : variant === "secondary"
            ? theme.colors.secondary
            : "transparent",
      color:
        variant === "primary"
          ? theme.colors.primaryForeground
          : variant === "secondary"
            ? theme.colors.secondaryForeground
            : theme.colors.primary,
      border:
        variant === "outline" ? `2px solid ${theme.colors.primary}` : "none",
      borderRadius: "8px",
      fontFamily: theme.fonts.body,
    };

    return { className: baseClasses, style: buttonStyles };
  };

  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      style={{
        ...(data.backgroundType === "image" && data.backgroundImageUrl
          ? {
              backgroundImage: `url(${data.backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {
              backgroundColor: data.backgroundColor || theme.colors.background,
            }),
      }}
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

      <div className="relative z-10 container mx-auto max-w-7xl">
        <div className="rounded-[32px] bg-white p-8 shadow-2xl sm:p-12 md:p-16 lg:p-20">
          <div className="flex max-w-4xl flex-col items-start text-left">
            {/* Title */}
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
              style={{ color: theme.colors.text }}
              isEditable={isEditable}
              placeholder="Enter CTA title..."
            />

            {/* Description */}
            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="mb-10 max-w-2xl text-xl leading-relaxed text-gray-600"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {/* Feature Icons */}
            {data.showFeatureIcons && data.featureIcons && (
              <div className="mb-10 flex flex-wrap gap-8">
                {data.featureIcons.map((icon, index) => (
                  <div
                    key={index}
                    className="text-3xl"
                    style={{ color: theme.colors.primary }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            {data.buttons.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {data.buttons.map(button => {
                  const buttonClass = getButtonClassesLocal(button.variant);
                  return (
                    <EditableLink
                      key={button.id}
                      text={button.text || "Button text"}
                      href={button.href || "#"}
                      onChange={(text, href) =>
                        handleButtonUpdate("buttons")(button.id, text, href)
                      }
                      isEditable={isEditable}
                      siteUser={siteUser}
                      className={buttonClass.className}
                      style={buttonClass.style}
                      textPlaceholder="Button text..."
                      hrefPlaceholder="Enter URL..."
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
