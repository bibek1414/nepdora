"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CTATemplate4Data,
  defaultCTATemplate4Data,
} from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

interface CTATemplate4Props {
  ctaData: CTATemplate4Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate4Data>) => void;
}

const normalizeCTAData = (ctaData: CTATemplate4Data): CTATemplate4Data => {
  return {
    ...defaultCTATemplate4Data,
    ...ctaData,
  };
};

export const CTATemplate4: React.FC<CTATemplate4Props> = ({
  ctaData,
  siteUser,
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
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="group relative aspect-4/5 w-full overflow-hidden rounded-2xl md:aspect-21/9">
          {/* Background Image */}
          <div className="absolute inset-0">
            <EditableImage
              src={data.imageUrl}
              alt={data.imageAlt || "CTA Background"}
              onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
              onAltChange={handleAltUpdate("imageAlt")}
              isEditable={isEditable}
              className="h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
              width={1600}
              height={900}
            />
            <ImageEditOverlay
              onImageSelect={url =>
                handleImageUpdate("imageUrl", "imageAlt")(
                  url,
                  data.imageAlt || ""
                )
              }
              imageWidth={1600}
              imageHeight={900}
              isEditable={isEditable}
              folder="cta-images"
              className="absolute top-6 right-6 z-30"
            />
            {/* Overlay for readability */}
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                as="h1"
                className="mb-8 font-serif text-4xl tracking-tight text-white md:text-6xl lg:text-7xl"
                isEditable={isEditable}
                useHeadingFont
                multiline
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <EditableLink
                text={data.buttonText}
                href={data.buttonHref || "#"}
                onChange={handleButtonUpdate}
                isEditable={isEditable}
                siteUser={siteUser}
                className="inline-block cursor-pointer rounded-full px-10 py-5 text-lg font-medium transition-all duration-300 hover:opacity-90 hover:shadow-xl active:scale-95"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                }}
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                {data.buttonText}
              </EditableLink>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
