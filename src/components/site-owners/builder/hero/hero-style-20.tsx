"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HeroTemplate20Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ChevronRight } from "lucide-react";

interface HeroTemplate20Props {
  heroData: HeroTemplate20Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate20Data>) => void;
  siteUser?: string;
}

// Per-pill configuration: height (px), bottom offset (px), z-index, animation delay (s)
const pillConfig = [
  {
    height: "h-[320px] md:h-[430px]",
    marginBottom: "mb-[40px] md:mb-[60px]",
    zIndex: 1,
    delay: 0.1,
  },
  {
    height: "h-[380px] md:h-[510px]",
    marginBottom: "mb-0",
    zIndex: 2,
    delay: 0.2,
  },
  {
    height: "h-[350px] md:h-[480px]",
    marginBottom: "mb-[-15px] md:mb-[-20px]",
    zIndex: 3,
    delay: 0.3,
  },
  {
    height: "h-[300px] md:h-[400px]",
    marginBottom: "mb-[60px] md:mb-[80px]",
    zIndex: 4,
    delay: 0.4,
  },
];

export const HeroTemplate20: React.FC<HeroTemplate20Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#e8603c",
      primaryForeground: "#FFFFFF",
      secondary: "#2a1a0e",
      textSecondary: "#7a736c",
    },
    fonts: {
      heading: "'Fraunces', serif",
      body: "'DM Sans', sans-serif",
    },
  };

  const { data, handleTextUpdate, handleArrayItemUpdate } = useBuilderLogic(
    heroData,
    onUpdate
  );

  return (
    <>
      <section
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white py-20 md:py-32"
        style={{ fontFamily: theme.fonts.body }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-4 sm:px-6 lg:flex-row lg:gap-20 lg:px-8">
          {/* ── Pill Gallery ── */}
          <div className="relative flex h-[450px] w-full shrink-0 items-end justify-center md:h-[560px] lg:w-auto lg:justify-start">
            {data.pills?.slice(0, 4).map((pill, i) => (
              <motion.div
                key={pill.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: pillConfig[i].delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative w-[110px] sm:w-[150px] md:w-[190px] ${pillConfig[i].height} ${pillConfig[i].marginBottom} group -mr-6 md:-mr-8 lg:-mr-10`}
                style={{ zIndex: pillConfig[i].zIndex }}
              >
                <div className="h-full w-full overflow-hidden rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:scale-[1.03]">
                  <EditableImage
                    src={pill.image}
                    alt={pill.imageAlt}
                    onImageChange={(url: string) =>
                      handleArrayItemUpdate("pills", pill.id)({ image: url })
                    }
                    isEditable={isEditable}
                    className="h-128 w-full object-cover"
                    width={190}
                    height={510}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Text Content ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left"
          >
            <EditableText
              as="h1"
              value={data.title}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              className="mb-6 text-4xl leading-[1.08] font-black tracking-tight md:text-5xl lg:text-6xl"
              style={{
                fontFamily: theme.fonts.heading,
              }}
              multiline
            />

            <EditableText
              as="p"
              value={data.description}
              onChange={handleTextUpdate("description")}
              isEditable={isEditable}
              className="mb-10 max-w-md text-base leading-relaxed md:text-lg"
              multiline
            />

            <EditableLink
              text={data.primaryButtonText}
              href={data.primaryButtonHref || "#"}
              isEditable={isEditable}
              siteUser={siteUser}
              onChange={(text, href) => {
                handleTextUpdate("primaryButtonText")(text);
                handleTextUpdate("primaryButtonHref")(href);
              }}
              className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
                boxShadow: `0 10px 32px -4px ${theme.colors.primary}70`,
              }}
            >
              {data.primaryButtonText}
              <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </EditableLink>
          </motion.div>
        </div>
      </section>
    </>
  );
};
