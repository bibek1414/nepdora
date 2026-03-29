"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { HeroTemplate18Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface HeroTemplate18Props {
  heroData: HeroTemplate18Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate18Data>) => void;
  siteUser?: string;
}

export const HeroTemplate18: React.FC<HeroTemplate18Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
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

  const { data, handleTextUpdate, handleImageUpdate, handleAltUpdate } =
    useBuilderLogic(heroData, onUpdate);

  return (
    <main className="relative mx-auto w-full max-w-7xl overflow-hidden bg-white font-sans text-[#1A1A1A] selection:bg-black/10">
      {/* Decorative SVG: Map (Bottom Left) — hidden on small screens */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pointer-events-none absolute bottom-[12%] left-[4%] z-30 hidden w-28 sm:block md:w-40 lg:w-48"
      >
        <EditableImage
          src={data.mapIconUrl}
          alt={data.mapIconAlt}
          onImageChange={handleImageUpdate("mapIconUrl", "mapIconAlt")}
          onAltChange={handleAltUpdate("mapIconAlt")}
          isEditable={isEditable}
          className="h-auto w-full"
          width={200}
          height={200}
        />
      </motion.div>

      {/* Decorative SVG: Plane/Stamp (Top Right) — hidden on small screens */}
      <motion.div
        initial={{ opacity: 0, y: -50, rotate: 15 }}
        animate={{ opacity: 0.4, y: 0, rotate: 15 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="pointer-events-none absolute top-[8%] right-[10%] z-30 hidden w-20 sm:block md:w-28 lg:w-32"
      >
        <EditableImage
          src={data.airplaneIconUrl}
          alt={data.airplaneIconAlt}
          onImageChange={handleImageUpdate(
            "airplaneIconUrl",
            "airplaneIconAlt"
          )}
          onAltChange={handleAltUpdate("airplaneIconAlt")}
          isEditable={isEditable}
          className="h-auto w-full"
          width={150}
          height={150}
        />
      </motion.div>

      {/* Left Polaroid — visible on lg+ only */}
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -10 }}
        animate={{ opacity: 1, x: 0, rotate: -5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-[18%] left-[3%] z-30 hidden lg:block xl:left-[5%]"
      >
        <div className="relative -rotate-2 transform bg-white p-3 pb-10 shadow-xl shadow-black/5">
          <div
            className="pointer-events-none absolute -top-4 left-1/2 h-8 w-20 -translate-x-1/2 rotate-1 mix-blend-multiply"
            style={{ backgroundColor: `${theme.colors.primary}33` }}
          />
          <EditableImage
            src={data.polaroid1Url}
            alt={data.polaroid1Alt}
            onImageChange={handleImageUpdate("polaroid1Url", "polaroid1Alt")}
            onAltChange={handleAltUpdate("polaroid1Alt")}
            isEditable={isEditable}
            className="z-10 h-60 w-48 object-cover"
            width={400}
            height={500}
          />
        </div>
      </motion.div>

      {/* Right Polaroid — visible on lg+ only */}
      <motion.div
        initial={{ opacity: 0, x: 100, rotate: 10 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute right-[3%] bottom-[18%] z-30 hidden lg:block xl:right-[5%]"
      >
        <div className="relative rotate-1 transform bg-white p-3 pb-10 shadow-xl shadow-black/5">
          <div
            className="pointer-events-none absolute -top-4 left-1/2 z-20 h-8 w-20 -translate-x-1/2 -rotate-2 mix-blend-multiply"
            style={{ backgroundColor: `${theme.colors.primary}33` }}
          />
          <EditableImage
            src={data.polaroid2Url}
            alt={data.polaroid2Alt}
            onImageChange={handleImageUpdate("polaroid2Url", "polaroid2Alt")}
            onAltChange={handleAltUpdate("polaroid2Alt")}
            isEditable={isEditable}
            className="z-10 h-72 w-56 object-cover"
            width={400}
            height={500}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8 sm:py-24 md:py-28 lg:min-h-screen lg:py-0">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 font-serif text-sm text-[#555] italic sm:mb-6 sm:text-base md:text-lg"
        >
          <EditableText
            value={data.eyebrow}
            onChange={handleTextUpdate("eyebrow")}
            isEditable={isEditable}
            as="p"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 max-w-xs font-serif text-3xl leading-[1.15] sm:max-w-xl sm:text-4xl md:max-w-2xl md:text-5xl lg:max-w-3xl lg:text-6xl"
        >
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="h2"
            multiline
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 max-w-xs text-sm leading-relaxed text-[#666] sm:max-w-sm sm:text-base md:max-w-lg lg:max-w-xl"
        >
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            isEditable={isEditable}
            as="p"
            multiline
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-6"
        >
          <EditableLink
            text={data.primaryButtonText}
            href={data.primaryButtonHref}
            isEditable={isEditable}
            siteUser={siteUser}
            onChange={(text, href) => {
              handleTextUpdate("primaryButtonText")(text);
              handleTextUpdate("primaryButtonHref")(href);
            }}
            className="w-full cursor-pointer rounded-full px-8 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:brightness-110 active:scale-95 sm:w-auto sm:px-10 sm:py-3.5 sm:text-base"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
          />

          <EditableLink
            text={data.secondaryButtonText}
            href={data.secondaryButtonHref}
            isEditable={isEditable}
            siteUser={siteUser}
            onChange={(text, href) => {
              handleTextUpdate("secondaryButtonText")(text);
              handleTextUpdate("secondaryButtonHref")(href);
            }}
            className="group flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-200 px-6 py-3 text-sm font-medium tracking-wide transition-colors sm:w-auto sm:px-4 sm:text-base"
          >
            {data.secondaryButtonText}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-5 sm:w-5"
              style={{ color: theme.colors.primary }}
            />
          </EditableLink>
        </motion.div>
      </div>

      {/* Mobile / Tablet Polaroids — visible on screens smaller than lg */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="flex justify-center gap-4 px-6 pb-14 sm:gap-6 sm:pb-16 lg:hidden"
      >
        {/* Polaroid 1 */}
        <div className="relative w-28 flex-shrink-0 -rotate-3 bg-white p-2 pb-7 shadow-lg sm:w-36 sm:p-3 sm:pb-9">
          <EditableImage
            src={data.polaroid1Url}
            alt={data.polaroid1Alt}
            onImageChange={handleImageUpdate("polaroid1Url", "polaroid1Alt")}
            onAltChange={handleAltUpdate("polaroid1Alt")}
            isEditable={isEditable}
            className="h-28 w-full object-cover sm:h-36"
            width={300}
            height={400}
          />
        </div>

        {/* Polaroid 2 */}
        <div className="relative w-28 flex-shrink-0 rotate-3 bg-white p-2 pb-7 shadow-lg sm:w-36 sm:p-3 sm:pb-9">
          <EditableImage
            src={data.polaroid2Url}
            alt={data.polaroid2Alt}
            onImageChange={handleImageUpdate("polaroid2Url", "polaroid2Alt")}
            onAltChange={handleAltUpdate("polaroid2Alt")}
            isEditable={isEditable}
            className="h-28 w-full object-cover sm:h-36"
            width={300}
            height={400}
          />
        </div>
      </motion.div>
    </main>
  );
};
