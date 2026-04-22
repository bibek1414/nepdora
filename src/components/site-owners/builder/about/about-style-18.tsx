"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { AboutUs18Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate18Props {
  aboutUsData: AboutUs18Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs18Data>) => void;
}

export const AboutUsTemplate18: React.FC<AboutUsTemplate18Props> = ({
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

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleArrayItemUpdate,
    handleMultipleUpdate,
  } = useBuilderLogic(aboutUsData, onUpdate);

  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-20">
      <div className="grid gap-16 md:grid-cols-2 md:items-center">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          {/* Top: badge + heading + description + CTA */}
          <div className="space-y-5">
            <div className="flex">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: `${theme.colors.secondary}15`, // 15% opacity for subtle background
                  color: theme.colors.secondaryForeground,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <EditableText
                  value={data.badge}
                  onChange={handleTextUpdate("badge")}
                  isEditable={isEditable}
                />
              </span>
            </div>
            <EditableText
              as="h2"
              value={data.title}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              style={{ fontFamily: theme.fonts.heading }}
              className="text-4xl leading-tight font-bold text-gray-950 md:text-5xl"
            />
            <EditableText
              as="p"
              value={data.description}
              onChange={handleTextUpdate("description")}
              isEditable={isEditable}
              className="text-base leading-relaxed text-gray-600"
            />
            <EditableLink
              text={data.ctaText}
              href={data.ctaLink}
              isEditable={isEditable}
              onChange={(text, href) =>
                handleMultipleUpdate({ ctaText: text, ctaLink: href })
              }
              className="flex w-fit items-center gap-2 rounded-full bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200"
            >
              {data.ctaText} <ArrowUpRight size={16} />
            </EditableLink>
          </div>

          {/* Spacer to push list to bottom - matching image's large gap */}
          <div className="mt-20" />

          {/* List with floating image */}
          <div className="relative">
            {/* Floating thumbnail - positioned at the border between hovered and next item */}
            <div
              className="pointer-events-none absolute right-12 z-10 hidden transition-all duration-300 md:block"
              style={{
                top: `${(hoveredIndex + 1) * 64 - 36}px`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredIndex}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    unoptimized
                    src={data.items[hoveredIndex]?.image}
                    alt={data.items[hoveredIndex]?.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-xl border border-white object-cover shadow-md"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {data.items.map((item, index) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(index)}
                className="group flex cursor-pointer items-center justify-between border-b border-gray-100 py-5 transition-colors first:border-t"
              >
                <div className="flex items-center gap-4">
                  {/* Mobile Preview / Desktop Editor for item image */}
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-10 md:w-10">
                    <EditableImage
                      src={item.image}
                      alt={item.title}
                      onImageChange={url =>
                        handleArrayItemUpdate("items", item.id)({ image: url })
                      }
                      isEditable={isEditable}
                      className="h-full w-full object-cover"
                      width={100}
                      height={100}
                    />
                  </div>
                  <EditableText
                    value={item.title}
                    onChange={val =>
                      handleArrayItemUpdate("items", item.id)({ title: val })
                    }
                    isEditable={isEditable}
                    className={`text-base font-semibold transition-colors ${
                      hoveredIndex === index ? "text-gray-900" : "text-gray-400"
                    }`}
                  />
                </div>

                <ChevronRight
                  size={16}
                  className={`transition-colors ${
                    hoveredIndex === index ? "text-gray-900" : "text-gray-300"
                  }`}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-[400px] overflow-hidden rounded-3xl md:h-[700px]"
        >
          <EditableImage
            src={data.mainImage}
            alt={data.imageAlt}
            onImageChange={handleImageUpdate("mainImage", "imageAlt")}
            onAltChange={handleAltUpdate("imageAlt")}
            isEditable={isEditable}
            className="h-full w-full object-cover"
            width={800}
            height={1200}
          />
        </motion.div>
      </div>
    </section>
  );
};
