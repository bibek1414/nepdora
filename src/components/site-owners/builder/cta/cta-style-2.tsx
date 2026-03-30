"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

import {
  CTATemplate2Data,
  defaultCTATemplate2Data,
} from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface CTATemplate2Props {
  ctaData: CTATemplate2Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate2Data>) => void;
}

const normalizeCTAData = (ctaData: CTATemplate2Data): CTATemplate2Data => {
  return {
    ...defaultCTATemplate2Data,
    ...ctaData,
  };
};

export const CTATemplate2: React.FC<CTATemplate2Props> = ({
  ctaData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#1A1A1A",
      primary: "#D67B61",
      primaryForeground: "#FFFFFF",
      secondary: "#F5F3EF",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const { data, handleTextUpdate, handleImageUpdate, handleAltUpdate } =
    useBuilderLogic(normalizeCTAData(ctaData), onUpdate);

  const handleButtonUpdate = (text: string, href: string) => {
    onUpdate?.({ buttonText: text, buttonHref: href });
  };

  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="relative z-10 mx-auto max-w-7xl px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-12 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] md:p-16 lg:flex-row lg:gap-16"
          style={{
            backgroundColor: data.backgroundColor || theme.colors.secondary,
          }}
        >
          {/* Left: Image Collage */}
          <div className="relative w-full lg:w-1/2">
            <div className="relative -rotate-2 bg-white p-1.5 shadow-xl">
              <div className="flex flex-col gap-1.5">
                {/* Top Row */}
                <div className="flex h-48 gap-1.5 md:h-64">
                  <div className="w-[65%] overflow-hidden">
                    <EditableImage
                      src={data.image1}
                      alt="Collage Image 1"
                      onImageChange={handleImageUpdate("image1")}
                      isEditable={isEditable}
                      className="h-full w-full object-cover"
                      width={800}
                      height={600}
                    />
                  </div>
                  <div className="w-[35%] overflow-hidden">
                    <EditableImage
                      src={data.image2}
                      alt="Collage Image 2"
                      onImageChange={handleImageUpdate("image2")}
                      isEditable={isEditable}
                      className="h-full w-full object-cover"
                      width={600}
                      height={600}
                    />
                  </div>
                </div>
                {/* Bottom Row */}
                <div className="h-48 overflow-hidden md:h-64">
                  <EditableImage
                    src={data.image3}
                    alt="Collage Image 3"
                    onImageChange={handleImageUpdate("image3")}
                    isEditable={isEditable}
                    className="h-full w-full object-cover"
                    width={800}
                    height={600}
                  />
                </div>
              </div>
            </div>

            {/* Decorative dotted lines */}
            <div className="absolute -top-12 -left-12 -z-10 h-40 w-40 rounded-full border border-dashed border-[#1A1A1A]/10" />
            <div className="absolute -right-12 -bottom-12 -z-10 h-60 w-60 rounded-full border border-dashed border-[#1A1A1A]/10" />
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="mb-6 block text-3xl leading-[1.1] text-[#1A1A1A] md:text-5xl"
              isEditable={isEditable}
              useHeadingFont
              multiline
            />
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="mb-8 max-w-xl text-base leading-relaxed font-light text-[#1A1A1A]/60"
              isEditable={isEditable}
              multiline
            />
            <div className="flex">
              <EditableLink
                text={data.buttonText}
                href={data.buttonHref || "#"}
                onChange={handleButtonUpdate}
                isEditable={isEditable}
                siteUser={siteUser}
                className="rounded-full px-10 py-4 font-semibold text-white shadow-lg shadow-[#D67B61]/20 transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: theme.colors.primary,
                }}
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                {data.buttonText}
              </EditableLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
