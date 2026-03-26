"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeroTemplate13Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface HeroTemplate13Props {
  heroData: HeroTemplate13Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate13Data>) => void;
}

export const HeroTemplate13: React.FC<HeroTemplate13Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleTextUpdate, handleAltUpdate, getImageUrl } =
    useBuilderLogic(heroData, onUpdate);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    onUpdate?.({
      imageUrl,
      imageAlt: altText || data.imageAlt,
    });
  };

  return (
    <motion.section
      className="relative flex h-200 w-full items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="mb-8 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl lg:h-48 lg:w-48">
            <EditableImage
              src={getImageUrl(data.imageUrl, {
                width: 400,
                height: 400,
                crop: "fill",
              })}
              alt={data.imageAlt || "Profile Image"}
              onImageChange={handleImageUpdate}
              onAltChange={handleAltUpdate("imageAlt")}
              isEditable={isEditable}
              className="h-full w-full object-cover"
              width={400}
              height={400}
              placeholder={{
                width: 400,
                height: 400,
                text: "Upload Profile",
              }}
            />
          </div>

          {/* Title */}
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h1"
            className="mx-auto mb-6 text-4xl leading-tight font-bold tracking-tight"
            style={{
              fontFamily: theme.fonts.heading,
            }}
            isEditable={isEditable}
            placeholder="Enter your name and role..."
            multiline
          />

          {/* Description */}
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            className="mx-auto max-w-2xl text-lg opacity-70 md:text-xl"
            style={{
              fontFamily: theme.fonts.body,
            }}
            isEditable={isEditable}
            placeholder="Enter a brief description..."
            multiline
          />
        </div>
      </div>
    </motion.section>
  );
};
