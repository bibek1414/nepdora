"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  CTATemplate5Data,
  defaultCTATemplate5Data,
} from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

interface CTATemplate5Props {
  ctaData: CTATemplate5Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate5Data>) => void;
}

const normalizeCTAData = (ctaData: CTATemplate5Data): CTATemplate5Data => {
  return {
    ...defaultCTATemplate5Data,
    ...ctaData,
  };
};

export const CTATemplate5: React.FC<CTATemplate5Props> = ({
  ctaData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#ff6b4a", // Matching the snippet's look and feel somewhat
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Inter",
    },
  };

  const { data, handleTextUpdate, handleImageUpdate, handleAltUpdate } =
    useBuilderLogic(normalizeCTAData(ctaData), onUpdate);

  const [isHovered, setIsHovered] = useState(false);

  const handleButtonUpdate = (text: string, href: string) => {
    onUpdate?.({ buttonText: text, buttonHref: href });
  };

  return (
    <section className="bg-white px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative h-[600px] overflow-hidden rounded-[3rem]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <EditableImage
              src={data.imageUrl}
              alt={data.imageAlt || "Inside the firm CTA"}
              onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
              onAltChange={handleAltUpdate("imageAlt")}
              className={`h-160 w-full object-cover transition-transform duration-1000 ${
                isHovered ? "scale-105" : ""
              }`}
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
            {/* Dark gradient overlay for text readability */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>

          {/* Content Block */}
          <div className="absolute right-6 bottom-12 left-6 text-white md:right-12 md:left-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                as="h2"
                className="mb-6 font-serif text-4xl leading-tight font-medium text-white md:text-6xl"
                isEditable={isEditable}
                useHeadingFont
                multiline
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="mb-8 max-w-xl text-lg text-white/80"
                isEditable={isEditable}
                multiline
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative z-30"
            >
              <EditableLink
                text={data.buttonText}
                href={data.buttonHref || "#"}
                onChange={handleButtonUpdate}
                isEditable={isEditable}
                siteUser={siteUser}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full px-8 py-4 text-lg font-medium transition-all hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                }}
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter URL..."
              >
                {data.buttonText}
                <ChevronRight
                  className={`h-5 w-5 transition-transform ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
              </EditableLink>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
