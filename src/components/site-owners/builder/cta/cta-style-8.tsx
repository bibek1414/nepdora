"use client";

import React from "react";
import { CTATemplate8Data } from "@/types/owner-site/components/cta";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

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
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="title"
            className="mb-6 text-3xl font-medium md:text-4xl lg:text-5xl"
            style={{
              fontFamily: theme?.fonts?.heading,
              color: theme?.colors?.primaryForeground || "#FFFFFF",
            }}
            multiline
          />
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            isEditable={isEditable}
            as="p"
            className="mb-8 text-lg"
            style={{
              fontFamily: theme?.fonts?.body,
              color: theme?.colors?.primaryForeground
                ? `${theme.colors.primaryForeground}B3`
                : "rgba(255, 255, 255, 0.7)",
            }}
            multiline
          />

          <div className="flex flex-wrap justify-center gap-4">
            {/* Primary Gold Button */}
            <div className="relative z-30">
              <EditableLink
                text={data.button1Text}
                href={data.button1Href}
                onChange={handleButton1Update}
                isEditable={isEditable}
                siteUser={siteUser}
                className="inline-flex items-center justify-center rounded-sm px-8 py-3.5 font-semibold transition-colors hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: theme?.colors?.secondary, // Gold
                  color: theme?.colors?.secondaryForeground || "#000000",
                  fontFamily: theme?.fonts?.body,
                }}
              >
                {data.button1Text}
                <ChevronRight className="ml-2" />
              </EditableLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
