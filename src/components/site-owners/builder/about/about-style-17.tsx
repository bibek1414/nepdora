"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { AboutUs17Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate17Props {
  aboutUsData: AboutUs17Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs17Data>) => void;
}

export const AboutUsTemplate17: React.FC<AboutUsTemplate17Props> = ({
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

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleArrayUpdate,
    handleMultipleUpdate,
  } = useBuilderLogic(aboutUsData, onUpdate);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-20">
      <div className="grid gap-20 md:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-full min-h-[500px] overflow-hidden rounded-3xl"
        >
          <EditableImage
            src={data.mainImage}
            alt={data.imageAlt}
            onImageChange={handleImageUpdate("mainImage", "imageAlt")}
            onAltChange={handleAltUpdate("imageAlt")}
            isEditable={isEditable}
            className="h-full w-full object-cover"
            width={800}
            height={1000}
            s3Options={{
              folder: "about-us-images",
            }}
          />
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-between py-4"
        >
          {/* Top: heading + description + CTA */}
          <div className="space-y-6">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              isEditable={isEditable}
              style={{ fontFamily: theme.fonts.heading }}
              className="text-4xl leading-[1.2] font-bold tracking-tight text-gray-900 md:text-5xl"
            />
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              isEditable={isEditable}
              className="max-w-md text-base leading-relaxed text-gray-500"
            />
            <EditableLink
              text={data.ctaText}
              href={data.ctaLink}
              isEditable={isEditable}
              onChange={(text, href) => {
                handleMultipleUpdate({ ctaText: text, ctaLink: href });
              }}
              className="flex w-fit items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
            >
              {data.ctaText} <ArrowUpRight size={18} />
            </EditableLink>
          </div>

          {/* Divider */}
          <div className="my-10 h-px w-full bg-gray-100" />

          {/* Bullet points */}
          <div className="space-y-5">
            {data.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <EditableText
                  value={item}
                  onChange={val => {
                    const newItems = [...data.items];
                    newItems[index] = val;
                    handleArrayUpdate("items")(newItems);
                  }}
                  as="p"
                  isEditable={isEditable}
                  className="text-sm! font-medium text-gray-600"
                />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-8">
            {data.stats.map((stat, index) => (
              <div key={stat.id} className="space-y-1">
                <EditableText
                  value={stat.value}
                  onChange={val => {
                    const newStats = [...data.stats];
                    newStats[index] = { ...newStats[index], value: val };
                    handleArrayUpdate("stats")(newStats);
                  }}
                  as="h2"
                  isEditable={isEditable}
                  style={{ fontFamily: theme.fonts.heading }}
                  className="text-6xl font-bold tracking-tighter text-gray-900"
                />
                <EditableText
                  value={stat.label}
                  onChange={val => {
                    const newStats = [...data.stats];
                    newStats[index] = { ...newStats[index], label: val };
                    handleArrayUpdate("stats")(newStats);
                  }}
                  as="p"
                  isEditable={isEditable}
                  className="text-base font-semibold text-gray-900"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
