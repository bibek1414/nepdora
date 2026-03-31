"use client";

import React, { useMemo } from "react";
import { Phone } from "lucide-react";
import { motion, Variants } from "framer-motion";

import {
  CTATemplate3Data,
  defaultCTATemplate3Data,
} from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { Button } from "@/components/ui/button";

interface CTATemplate3Props {
  ctaData: CTATemplate3Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate3Data>) => void;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const normalizeCTAData = (ctaData: CTATemplate3Data): CTATemplate3Data => {
  return {
    ...defaultCTATemplate3Data,
    ...ctaData,
    stats:
      ctaData.stats && ctaData.stats.length > 0
        ? ctaData.stats.map((stat: any, index: number) => ({
            id: stat.id || `cta-3-stat-${index + 1}`,
            value: stat.value || defaultCTATemplate3Data.stats[index % 3].value,
            label: stat.label || defaultCTATemplate3Data.stats[index % 3].label,
          }))
        : defaultCTATemplate3Data.stats,
  };
};

export const CTATemplate3: React.FC<CTATemplate3Props> = ({
  ctaData,
  siteUser,
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
    handleArrayItemUpdate,
  } = useBuilderLogic(normalizeCTAData(ctaData), onUpdate);

  const handleButton1Update = (text: string, href: string) => {
    onUpdate?.({ button1Text: text, button1Href: href });
  };

  const handleButton2Update = (text: string, href: string) => {
    onUpdate?.({ button2Text: text, button2Href: href });
  };

  const handleStatUpdate =
    (statId: string, field: "value" | "label") => (val: string) => {
      handleArrayItemUpdate("stats", statId)({ [field]: val });
    };

  return (
    <motion.section
      className="bg-background overflow-hidden py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <div className="relative">
            {/* Mobile Image - Top */}
            <div className="relative h-48 overflow-hidden rounded-t-3xl lg:hidden">
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt || "CTA image"}
                onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                onAltChange={handleAltUpdate("imageAlt")}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={800}
                height={600}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${theme.colors.primary}4D, ${theme.colors.primary})`,
                }}
              />
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-2">
              {/* Content */}
              <div
                className="p-8 md:p-12 lg:p-16"
                style={{ color: theme.colors.primaryForeground }}
              >
                <div className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                  <EditableText
                    value={data.badge}
                    onChange={handleTextUpdate("badge")}
                    isEditable={isEditable}
                    as="span"
                  />
                </div>
                <EditableText
                  value={data.title}
                  onChange={handleTextUpdate("title")}
                  as="h2"
                  className="mb-4 text-3xl leading-tight font-bold md:text-4xl"
                  isEditable={isEditable}
                  multiline
                />
                <EditableText
                  value={data.description}
                  onChange={handleTextUpdate("description")}
                  as="p"
                  className="mb-8 max-w-md text-lg opacity-80"
                  isEditable={isEditable}
                  multiline
                />
                <div className="flex flex-col gap-4 sm:flex-row">
                  <EditableLink
                    text={data.button1Text}
                    href={data.button1Href || "#"}
                    onChange={handleButton1Update}
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="hover:text-primary h-12 rounded-lg border-2 px-8 text-base font-semibold transition-all hover:bg-white active:scale-95"
                    style={{
                      borderColor: theme.colors.primaryForeground,
                      color: theme.colors.primaryForeground,
                    }}
                    textPlaceholder="Button 1 text..."
                    hrefPlaceholder="Enter URL..."
                  >
                    {data.button1Text}
                  </EditableLink>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/20 pt-8 sm:gap-6">
                  {data.stats.map((stat: any, index: number) => (
                    <React.Fragment key={stat.id}>
                      <div className="text-center sm:text-left">
                        <EditableText
                          value={stat.value}
                          onChange={handleStatUpdate(stat.id, "value")}
                          as="h5"
                          className="text-xl font-bold sm:text-2xl"
                          isEditable={isEditable}
                        />
                        <EditableText
                          value={stat.label}
                          onChange={handleStatUpdate(stat.id, "label")}
                          as="div"
                          className="text-xs opacity-70 sm:text-sm"
                          isEditable={isEditable}
                        />
                      </div>
                      {index < data.stats.length - 1 && (
                        <div className="hidden h-10 w-px bg-white/20 sm:block" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Desktop Image - Side */}
              {/* Desktop Image - Side */}
              <div className="relative hidden h-[550px] lg:block">
                <EditableImage
                  src={data.imageUrl}
                  alt={data.imageAlt || "CTA image"}
                  onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                  onAltChange={handleAltUpdate("imageAlt")}
                  isEditable={isEditable}
                  className="h-150 w-full object-cover"
                  width={800}
                  height={800}
                  priority // Optional: load immediately
                />
                <div
                  className="pointer-events-none absolute inset-0" // Add pointer-events-none so it doesn't block editing
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.primary} 0%, ${theme.colors.primary} 15%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
