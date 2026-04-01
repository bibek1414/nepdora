"use client";

import React from "react";
import { motion } from "framer-motion";
import { AboutUs16Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate16Props {
  aboutUsData: AboutUs16Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs16Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate16: React.FC<AboutUsTemplate16Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();

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

  const { data, handleTextUpdate, handleImageUpdate, handleAltUpdate } =
    useBuilderLogic(aboutUsData, onUpdate);

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 h-full w-full">
        <EditableImage
          src={data.backgroundImage}
          alt={data.imageAlt}
          onImageChange={handleImageUpdate("backgroundImage", "imageAlt")}
          onAltChange={handleAltUpdate("imageAlt")}
          isEditable={isEditable}
          className="h-full w-full object-cover brightness-75"
          width={1920}
          height={1080}
          s3Options={{
            folder: "about-us-images",
          }}
          buttonPosition="top-right"
          showAltEditor={isEditable}
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Upload background image",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl pointer-events-none flex-col justify-center px-6 md:px-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-block pointer-events-auto"
        >
          <EditableText
            value={data.badgeText}
            onChange={handleTextUpdate("badgeText")}
            as="span"
            isEditable={isEditable}
            placeholder="● About us"
            className="rounded-full bg-white/20 px-4 py-1 text-xs font-semibold text-white uppercase backdrop-blur-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pointer-events-auto"
        >
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h1"
            style={{
              fontFamily: theme.fonts.heading,
            }}
            className="max-w-2xl text-5xl font-bold text-white md:text-7xl"
            isEditable={isEditable}
            placeholder="About Care-hands"
          />
        </motion.div>
      </div>
    </section>
  );
};
