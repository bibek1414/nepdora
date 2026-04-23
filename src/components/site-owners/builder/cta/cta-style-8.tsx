"use client";

import React from "react";
import { CTATemplate8Data } from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { motion } from "framer-motion";

interface CTATemplate8Props {
  ctaData: CTATemplate8Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CTATemplate8Data>) => void;
}

/**
 * @beautifulMention: CTA Style 8
 * A high-impact architectural CTA section with a primary color background.
 * Features a two-button layout with a gold accent button and a transparent bordered button.
 */
export const CTATemplate8: React.FC<CTATemplate8Props> = ({
  ctaData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate } = useBuilderLogic(ctaData, onUpdate);

  const handleButton1Update = (text: string, href: string) => {
    onUpdate?.({ button1Text: text, button1Href: href });
  };

  const handleButton2Update = (text: string, href: string) => {
    onUpdate?.({ button2Text: text, button2Href: href });
  };

  return (
    <section 
      className="py-20 md:py-32"
      style={{ backgroundColor: theme?.colors?.primary }}
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6"
            style={{ 
              fontFamily: theme?.fonts?.heading,
              color: theme?.colors?.primaryForeground || "#FFFFFF"
            }}
            multiline
          />
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            isEditable={isEditable}
            as="p"
            className="text-lg mb-8"
            style={{ 
              fontFamily: theme?.fonts?.body,
              color: theme?.colors?.primaryForeground ? `${theme.colors.primaryForeground}B3` : "rgba(255, 255, 255, 0.7)"
            }}
            multiline
          />
          
          <div className="flex flex-wrap gap-4">
            {/* Primary Gold Button */}
            <div className="relative z-30">
              <EditableLink
                text={data.button1Text}
                href={data.button1Href}
                onChange={handleButton1Update}
                isEditable={isEditable}
                siteUser={siteUser}
                className="px-8 py-3.5 font-semibold transition-colors hover:opacity-90 active:scale-95 inline-flex items-center justify-center rounded-sm"
                style={{
                  backgroundColor: "#D4AF37", // Gold
                  color: theme?.colors?.primary || "#000000",
                  fontFamily: theme?.fonts?.body,
                }}
              >
                {data.button1Text}
              </EditableLink>
            </div>

            {/* Secondary Bordered Button */}
            <div className="relative z-30">
              <EditableLink
                text={data.button2Text}
                href={data.button2Href}
                onChange={handleButton2Update}
                isEditable={isEditable}
                siteUser={siteUser}
                className="px-8 py-3.5 border font-semibold transition-all hover:bg-white/10 active:scale-95 inline-flex items-center justify-center rounded-sm"
                style={{
                  borderColor: theme?.colors?.primaryForeground ? `${theme.colors.primaryForeground}4D` : "rgba(255, 255, 255, 0.3)",
                  color: theme?.colors?.primaryForeground || "#FFFFFF",
                  fontFamily: theme?.fonts?.body,
                }}
              >
                {data.button2Text}
              </EditableLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
