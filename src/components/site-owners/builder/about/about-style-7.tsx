"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AboutUs7Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { toast } from "sonner";
import { ChevronRight, Loader2 } from "lucide-react";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

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
              {/* Training Image */}
              <div className="h-96 w-full overflow-hidden rounded-lg bg-cover bg-center">
                <EditableImage
                  src={training.imageUrl}
                  alt={training.imageAlt}
                  width={400}
                  height={500}
                  buttonPosition="top-right"
                  className="h-96 w-full object-cover"
                  priority={idx === 0}
                  isEditable={isEditable}
                  onImageChange={url => handleTrainingImageUpdate(idx)(url)}
                  s3Options={{
                    folder: "about-us-images",
                  }}
                />
              </div>

              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-6 transition-all duration-300 group-hover:bg-black/20">
                <EditableText
                  value={training.title}
                  onChange={handleTrainingUpdate(idx, "title")}
                  as="h3"
                  className="z-10 text-white"
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
