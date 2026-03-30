"use client";

import React from "react";
import { motion } from "framer-motion";
import { AboutUs13Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate13Props {
  aboutUsData: AboutUs13Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs13Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate13: React.FC<AboutUsTemplate13Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(aboutUsData, onUpdate);

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: { primary: "#C97B63", secondary: "#2D4635" },
    fonts: { heading: "inherit" },
  };

  const accentColor = theme.colors.secondary || "#C97B63";
  const bgColor = theme.colors.primary || "#2D4635";
  const headingFont = theme.fonts?.heading || "inherit";

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        backgroundColor: bgColor,
        height: "700px",
      }}
    >
      {/* Decorative SVG */}
      <img
        src={data.svgUrl}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute select-none"
        style={{
          top: "-100px",
          left: "-100px",
          width: "460px",
          height: "auto",
          opacity: 0.35,
          transform: "rotate(90deg)",
        }}
        referrerPolicy="no-referrer"
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-8">
        <div className="flex w-full items-center">
          {/* Left text column */}
          <div style={{ width: "48%", flexShrink: 0 }}>
            <motion.span
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-3 block font-serif text-sm italic"
              style={{ color: accentColor }}
            >
              <EditableText
                value={data.badge}
                onChange={handleTextUpdate("badge")}
                as="span"
                isEditable={isEditable}
              />
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 leading-[1.06] text-white"
              style={{
                fontSize: "clamp(2.4rem, 3.8vw, 5rem)",
                fontWeight: 400,
                fontFamily: headingFont,
              }}
            >
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                as="h1"
                isEditable={isEditable}
              />
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                maxWidth: "400px",
              }}
            >
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                isEditable={isEditable}
                multiline
              />
            </motion.p>
          </div>

          {/* Right image column */}
          <div className="relative" style={{ flex: 1, height: "500px" }}>
            {/* Large circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute overflow-hidden rounded-full"
              style={{
                width: "420px",
                height: "420px",
                right: "0px",
                top: "34px",
                border: "3px solid white",
              }}
            >
              <EditableImage
                src={data.mainImage}
                alt="Main Travel Image"
                onImageChange={url => handleTextUpdate("mainImage")(url)}
                isEditable={isEditable}
                className="h-full w-full object-cover object-top"
                width={900}
                height={900}
              />
            </motion.div>

            {/* Small arch */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.3,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute overflow-hidden"
              style={{
                width: "170px",
                height: "250px",
                borderRadius: "999px 999px 8px 8px",
                right: "262px",
                bottom: "28px",
                border: "3px solid white",
                zIndex: 20,
              }}
            >
              <EditableImage
                src={data.secondaryImage}
                alt="Secondary Travel Image"
                onImageChange={url => handleTextUpdate("secondaryImage")(url)}
                isEditable={isEditable}
                className="h-full w-full object-cover object-center"
                width={600}
                height={800}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
