"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AboutUs25Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUs25Props {
  aboutUsData: AboutUs25Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs25Data>) => void;
  siteUser?: string;
}

/**
 * @beautifulMention: About Style 25
 * A premium architectural-focused about section with a floating stat badge.
 * Features a two-column layout with staggered animations and editorial typography.
 */
export const AboutUsTemplate25: React.FC<AboutUs25Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate, handleImageUpdate, handleLinkUpdate } =
    useBuilderLogic(aboutUsData, onUpdate);

  return (
    <section className="overflow-visible bg-white py-20 lg:py-28">
      <div className="container mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="group relative">
            <EditableImage
              src={data.imageUrl}
              alt={data.imageAlt}
              onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
              isEditable={isEditable}
              className="aspect-4/3 w-full rounded-lg object-cover shadow-sm"
              width={1280}
              height={960}
            />

            {/* Stat Badge */}
            <div
              className="bg-gold text-primary absolute -right-6 -bottom-6 z-20 hidden rounded-xl px-6 py-4 md:block"
              style={{
                backgroundColor: theme?.colors?.primary,
                color: theme?.colors?.primaryForeground,
              }}
            >
              <EditableText
                value={data.statValue}
                onChange={handleTextUpdate("statValue")}
                isEditable={isEditable}
                as="label"
                className="font-heading text-2xl font-medium"
                style={{ fontFamily: theme?.fonts?.heading }}
              />
              <EditableText
                value={data.statLabel}
                onChange={handleTextUpdate("statLabel")}
                isEditable={isEditable}
                as="div"
                className="font-body text-sm font-semibold"
                style={{ fontFamily: theme?.fonts?.body }}
              />
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <EditableText
            value={data.eyebrow}
            onChange={handleTextUpdate("eyebrow")}
            isEditable={isEditable}
            as="span"
            className="text-gold font-body mb-3 block text-sm font-semibold"
            style={{
              fontFamily: theme?.fonts?.body,
            }}
          />

          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="label"
            className="text-foreground mb-6 text-3xl leading-tight font-medium md:text-4xl"
            style={{ fontFamily: theme?.fonts?.heading }}
            multiline
          />

          <div className="mb-8 space-y-6">
            <EditableText
              value={data.description1}
              onChange={handleTextUpdate("description1")}
              isEditable={isEditable}
              as="p"
              className="text-muted-foreground font-body leading-relaxed"
              style={{ fontFamily: theme?.fonts?.body }}
              multiline
            />
            <EditableText
              value={data.description2}
              onChange={handleTextUpdate("description2")}
              isEditable={isEditable}
              as="p"
              className="text-muted-foreground font-body leading-relaxed"
              style={{ fontFamily: theme?.fonts?.body }}
              multiline
            />
          </div>

          <div className="relative z-30">
            <EditableLink
              text={data.ctaText}
              href={data.ctaLink}
              isEditable={isEditable}
              onChange={handleLinkUpdate("ctaText", "ctaLink")}
              siteUser={siteUser}
              className="font-body group inline-flex items-center gap-2 font-semibold transition-colors"
              style={{
                fontFamily: theme?.fonts?.body,
                color: theme?.colors?.primary,
              }}
            >
              {data.ctaText}
              <ChevronRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: "#D4AF37" }}
              />
            </EditableLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
