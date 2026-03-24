"use client";

import React, { useState } from "react";
import { CTATemplate3Data } from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToS3 } from "@/utils/s3";
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
      // Upload to S3
      const imageUrl = await uploadToS3(file, "cta-backgrounds");

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
      " px-6 py-3 font-bold transition-colors min-w-[120px] text-center rounded-lg";

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
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Background Change Button - Only visible when editable */}

      <div className="relative z-10 container mx-auto max-w-5xl">
        <div className="rounded-2xl sm:p-12 md:p-16">
          <div className="text-center">
            {/* Title */}
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl"
              isEditable={isEditable}
              placeholder="Enter CTA title..."
            />

            {/* Description */}
            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="mx-auto mb-8 max-w-2xl text-lg text-gray-600"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {/* Feature Icons */}
            {data.showFeatureIcons && data.featureIcons && (
              <div className="mb-8 flex justify-center gap-6">
                {data.featureIcons.map((icon, index) => (
                  <div
                    key={index}
                    className="text-2xl"
                    style={{ color: theme.colors.primary }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            {data.buttons.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
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
