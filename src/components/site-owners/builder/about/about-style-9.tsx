"use client";

import React from "react";
import { AboutUs9Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ChevronRight } from "lucide-react";

interface AboutUsTemplate9Props {
  aboutUsData: AboutUs9Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs9Data>) => void;
}

export const AboutUsTemplate9: React.FC<AboutUsTemplate9Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
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

  const { data, setData, handleTextUpdate } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  const handleButtonUpdate = (text: string, href: string) => {
    const update = {
      buttonText: text,
      buttonLink: href,
    };
    onUpdate?.(update);
  };

  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedMedia: AboutUs9Data["media"] = {
      ...data.media,
      url: imageUrl,
      alt: altText || data.media.alt,
      type: "image",
    };
    setData({ ...data, media: updatedMedia });
    onUpdate?.({ media: updatedMedia });
  };

  const handleAltUpdate = (altText: string) => {
    const updatedMedia: AboutUs9Data["media"] = {
      ...data.media,
      alt: altText,
    };
    setData({ ...data, media: updatedMedia });
    onUpdate?.({ media: updatedMedia });
  };

  return (
    <section
      className="px-6 py-20 lg:px-20"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.body,
      }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative flex h-full items-center justify-center">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 500 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 150 50 Q 100 150 150 250"
              stroke={theme.colors.primary}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 300 350 Q 400 450 300 550"
              stroke={theme.colors.primary}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="relative rounded-[32px] border-4 border-gray-200 bg-gray-100 shadow-xl">
              <div className="relative h-72 w-64 overflow-hidden rounded-[28px]">
                <EditableImage
                  src={data.media.url}
                  alt={data.media.alt}
                  onImageChange={handleImageUpdate}
                  onAltChange={handleAltUpdate}
                  isEditable={isEditable}
                  className="h-full w-full object-cover"
                  width={256}
                  height={288}
                  cloudinaryOptions={{
                    folder: "about-us-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 256,
                    height: 288,
                    text: "Upload image",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 text-white lg:pl-8">
          <div>
            <EditableText
              value={data.eyebrow}
              onChange={handleTextUpdate("eyebrow")}
              as="h1"
              isEditable={isEditable}
              placeholder="About Funder"
            />
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="p"
              isEditable={isEditable}
              placeholder="Add a headline..."
              multiline
            />
          </div>

          <div className="space-y-5 text-base leading-relaxed">
            <EditableText
              value={data.descriptionPrimary}
              onChange={handleTextUpdate("descriptionPrimary")}
              as="p"
              isEditable={isEditable}
              placeholder="Add a description..."
              multiline
            />
            <EditableText
              value={data.descriptionSecondary}
              onChange={handleTextUpdate("descriptionSecondary")}
              as="p"
              isEditable={isEditable}
              placeholder="Add additional copy..."
              multiline
            />
          </div>

          <EditableLink
            text={data.buttonText}
            href={data.buttonLink}
            onChange={handleButtonUpdate}
            className="flex w-fit items-center gap-2 rounded-lg px-8 py-4 shadow-md transition hover:opacity-90 hover:shadow-lg"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
              fontFamily: theme.fonts.heading,
            }}
            textPlaceholder="Read More"
            hrefPlaceholder="#"
            isEditable={isEditable}
          >
            {data.buttonText}
            <ChevronRight size={16} />
          </EditableLink>
        </div>
      </div>
    </section>
  );
};
