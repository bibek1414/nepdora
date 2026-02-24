"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AboutUs7Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { ChevronRight, Loader2 } from "lucide-react";

interface AboutUsTemplate7Props {
  aboutUsData: AboutUs7Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs7Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate7: React.FC<AboutUsTemplate7Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const { data: themeResponse } = useThemeQuery();

  const componentId = React.useId();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#111827",
      primary: "#22C55E",
      primaryForeground: "#FFFFFF",
      secondary: "#6B7280",
      secondaryForeground: "#FFFFFF",
      background: "#FFFFFF",
      darkText: "#E5E7EB",
      darkBackground: "#111827",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const { data, handleTextUpdate, handleArrayItemUpdate } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  // Handle training item updates
  const handleTrainingUpdate =
    (index: number, field: "title" | "description") => (value: string) => {
      const trainingId = data.trainings[index].id;
      handleArrayItemUpdate("trainings", trainingId)({ [field]: value });
    };

  // Handle training image updates
  const handleTrainingImageUpdate =
    (index: number) => (imageUrl: string, altText?: string) => {
      const trainingId = data.trainings[index].id;
      handleArrayItemUpdate(
        "trainings",
        trainingId
      )({
        imageUrl,
        imageAlt: altText,
      });
    };

  // Handle file upload for training images
  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
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

    setIsUploading(index);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "about-us-images",
        resourceType: "image",
      });

      handleTrainingImageUpdate(index)(
        imageUrl,
        `Training image: ${file.name}`
      );
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setIsUploading(null);
      event.target.value = "";
    }
  };

  // Handle button link updates
  const handleButtonLinkUpdate = (text: string, href: string) => {
    const update = {
      buttonText: text,
      buttonLink: href,
    };
    onUpdate?.(update);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen text-gray-800 dark:text-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <EditableText
            value={data.subtitle}
            onChange={handleTextUpdate("subtitle")}
            as="h1"
            style={{
              color: theme.colors.primary,
            }}
            isEditable={isEditable}
            placeholder="What we do"
          />
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h1"
            style={{
              color: theme.colors.secondary,
              fontFamily: theme.fonts.heading,
            }}
            isEditable={isEditable}
            placeholder="Where athletes push their limits and train with purpose."
            multiline={true}
          />
        </div>

        {/* Training Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.trainings.map((training, idx) => (
            <div
              key={training.id}
              className="group relative h-96 overflow-hidden rounded-lg bg-cover bg-center"
            >
              {/* Change Image Button - Only visible when editable */}
              {isEditable && (
                <div className="absolute top-2 right-2 z-20">
                  <label
                    htmlFor={`training-upload-${componentId}-${idx}`}
                    className={`cursor-pointer rounded border border-gray-300 bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white ${
                      isUploading === idx
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    {isUploading === idx ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="hidden sm:inline">Uploading...</span>
                      </span>
                    ) : (
                      "Change"
                    )}
                  </label>
                  <input
                    id={`training-upload-${componentId}-${idx}`}
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageFileChange(e, idx)}
                    className="hidden"
                    disabled={isUploading === idx}
                  />
                </div>
              )}

              {/* Upload Loading Overlay */}
              {isUploading === idx && (
                <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-black/50">
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8" />
                    <p className="text-xs font-medium sm:text-sm">
                      Uploading...
                    </p>
                  </div>
                </div>
              )}

              {/* Training Image */}
              <div className="h-96 w-full overflow-hidden rounded-lg bg-cover bg-center">
                <Image
                  src={training.imageUrl}
                  alt={training.imageAlt}
                  width={400}
                  height={500}
                  className="h-96 w-full object-cover"
                  priority={idx === 0}
                />
              </div>

              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-6 transition-all duration-300 group-hover:bg-black/20">
                <EditableText
                  value={training.title}
                  onChange={handleTrainingUpdate(idx, "title")}
                  as="h3"
                  className="text-white"
                  isEditable={isEditable}
                  placeholder="Training Title"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Learn More Button */}
        {data.buttonText && data.buttonLink && (
          <div className="mt-20 text-center">
            <EditableLink
              text={data.buttonText}
              href={data.buttonLink}
              onChange={handleButtonLinkUpdate}
              className="rounded-lg px-8 py-3 font-bold transition-transform duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
              isEditable={isEditable}
              textPlaceholder="Learn more"
              hrefPlaceholder="#learn-more"
              siteUser={siteUser}
            >
              {data.buttonText}
              <ChevronRight className="ml-2 h-5 w-5" />
            </EditableLink>
          </div>
        )}
      </div>
    </div>
  );
};
