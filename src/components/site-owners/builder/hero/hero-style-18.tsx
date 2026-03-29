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
    <main className="relative mx-auto min-h-screen max-w-7xl overflow-hidden bg-white font-sans text-[#1A1A1A] selection:bg-black/10">
      {/* Decorative SVG: Map (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`absolute bottom-[15%] left-[10%] z-30 w-32 md:w-48`}
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

      {/* Decorative SVG: Plane/Stamp (Top Right) */}
      <motion.div
        initial={{ opacity: 0, y: -50, rotate: 15 }}
        animate={{ opacity: 0.4, y: 0, rotate: 15 }}
        transition={{ duration: 1, delay: 0.7 }}
        className={`absolute top-[10%] right-[15%] z-30 w-24 md:w-32`}
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

      {/* Left Polaroid */}
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -10 }}
        animate={{ opacity: 1, x: 0, rotate: -5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-[20%] left-[5%] z-30 hidden lg:block"
      >
        <div className="relative -rotate-2 transform bg-white p-3 pb-10 shadow-xl shadow-black/5">
          {/* Tape - using a colored div with opacity to simulate the travel vibe */}
          <div
            className="bg-primary/20 pointer-events-none absolute -top-4 left-1/2 h-8 w-20 -translate-x-1/2 rotate-1 mix-blend-multiply"
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

      {/* Right Polaroid */}
      <motion.div
        initial={{ opacity: 0, x: 100, rotate: 10 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute right-[5%] bottom-[20%] z-30 hidden lg:block"
      >
        <div className="relative rotate-1 transform bg-white p-3 pb-10 shadow-xl shadow-black/5">
          {/* Tape */}
          <div
            className="bg-primary/20 pointer-events-none absolute -top-4 left-1/2 z-20 h-8 w-20 -translate-x-1/2 -rotate-2 mix-blend-multiply"
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
      <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 font-serif text-base text-[#555] italic md:text-lg"
        >
          <EditableText
            value={data.eyebrow}
            onChange={handleTextUpdate("eyebrow")}
            isEditable={isEditable}
            as="p"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 max-w-3xl font-serif text-3xl leading-[1.1] md:text-5xl lg:text-6xl"
        >
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="h2"
            multiline
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 max-w-xl text-sm leading-relaxed text-[#666] md:text-base"
        >
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            isEditable={isEditable}
            as="p"
            multiline
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-8 sm:flex-row"
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
            className="cursor-pointer rounded-full px-10 py-3.5 text-base font-medium text-white shadow-lg transition-all duration-300 hover:brightness-110 active:scale-95"
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
            className="rounded-full border border-gray-200 px-4 py-2 text-base font-medium tracking-wide transition-colors"
          >
            {data.secondaryButtonText}
            <ArrowUpRight
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: theme.colors.primary }}
            />
          </EditableLink>
        </motion.div>
      </div>

      {/* Mobile Polaroid (Visible only on small screens) */}
      <div className="flex justify-center gap-4 px-6 pb-12 lg:hidden">
        <div className="relative w-32 -rotate-3 bg-white p-2 pb-6 shadow-lg">
          <EditableImage
            src={data.polaroid1Url}
            alt={data.polaroid1Alt}
            onImageChange={handleImageUpdate("polaroid1Url", "polaroid1Alt")}
            onAltChange={handleAltUpdate("polaroid1Alt")}
            isEditable={isEditable}
            className="h-32 w-full object-cover"
            width={300}
            height={400}
          />
        </div>
        <div className="relative w-32 rotate-3 bg-white p-2 pb-6 shadow-lg">
          <EditableImage
            src={data.polaroid2Url}
            alt={data.polaroid2Alt}
            onImageChange={handleImageUpdate("polaroid2Url", "polaroid2Alt")}
            onAltChange={handleAltUpdate("polaroid2Alt")}
            isEditable={isEditable}
            className="h-32 w-full object-cover"
            width={300}
            height={400}
          />
        </div>
      </div>
    </main>
  );
};
