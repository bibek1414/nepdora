"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AboutUs19Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { hexToRgba } from "@/lib/utils";

interface AboutUsTemplate19Props {
  aboutUsData: AboutUs19Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs19Data>) => void;
}

export const AboutUsTemplate19: React.FC<AboutUsTemplate19Props> = ({
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

  return (
    <section className="mx-auto max-w-7xl px-8 py-20 md:px-16">
      <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
        {/* ── Left Column ── */}
        <div className="flex flex-col">
          {/* Badge */}
          <div className="mb-8">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[15px] font-semibold"
              style={{
                backgroundColor: hexToRgba(theme.colors.secondary, 0.1),
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

          {/* Heading */}
          <EditableText
            as="h2"
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            style={{ fontFamily: theme.fonts.heading }}
            className="mb-14 max-w-2xl text-[44px] leading-[1.15] font-bold tracking-tight text-gray-950"
          />

          {/* Large Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="cursor-pointer overflow-hidden rounded-[40px]"
          >
            <EditableImage
              src={data.largeImage}
              alt={data.imageAlt}
              onImageChange={handleImageUpdate("largeImage", "imageAlt")}
              onAltChange={handleAltUpdate("imageAlt")}
              isEditable={isEditable}
              className="aspect-4/5 w-full object-cover"
              width={1000}
              height={1100}
            />
          </motion.div>
        </div>

        {/* ── Right Column ── */}
        <div className="flex flex-col justify-between">
          {/* Top Small Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 cursor-pointer overflow-hidden rounded-[40px]"
          >
            <EditableImage
              src={data.smallImage}
              alt={data.smallImageAlt}
              onImageChange={handleImageUpdate("smallImage", "smallImageAlt")}
              onAltChange={handleAltUpdate("smallImageAlt")}
              isEditable={isEditable}
              className="aspect-[1.8/1] w-full object-cover"
              width={1000}
              height={600}
            />
          </motion.div>

          {/* Stats Section */}
          <div className="flex flex-col">
            <div className="mb-10 divide-y divide-gray-200">
              {data.stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex cursor-pointer items-center justify-between py-8"
                >
                  <EditableText
                    as="h2"
                    value={stat.value}
                    onChange={val =>
                      handleArrayItemUpdate("stats", stat.id)({ value: val })
                    }
                    isEditable={isEditable}
                    className="leading-none font-bold tracking-tighter text-gray-950"
                  />
                  <EditableText
                    as="span"
                    value={stat.label}
                    onChange={val =>
                      handleArrayItemUpdate("stats", stat.id)({ label: val })
                    }
                    isEditable={isEditable}
                    className="text-[17px] font-semibold text-gray-950"
                  />
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-fit"
            >
              <EditableLink
                text={data.ctaText}
                href={data.ctaLink}
                isEditable={isEditable}
                onChange={(text, href) =>
                  handleMultipleUpdate({ ctaText: text, ctaLink: href })
                }
                className="flex cursor-pointer items-center gap-4 rounded-[20px] px-10 py-5 text-[17px] font-bold transition-colors"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                }}
              >
                {data.ctaText} <ArrowUpRight size={20} strokeWidth={2.5} />
              </EditableLink>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
