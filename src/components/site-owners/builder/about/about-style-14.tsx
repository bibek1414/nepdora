"use client";

import React from "react";
import { motion } from "framer-motion";
import { AboutUs14Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate14Props {
  aboutUsData: AboutUs14Data;
  isEditable?: boolean;
  onUpdate: (data: Partial<AboutUs14Data>) => void;
}

export const AboutUsTemplate14: React.FC<AboutUsTemplate14Props> = ({
  aboutUsData,
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

  const { data, handleTextUpdate, handleImageUpdate } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  return (
    <section className="overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Top Section ── */}

        {/* Row 1: "Who We Are?" left — Heading right */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:pt-20"
            >
              <EditableText
                as="p"
                className="font-serif text-base text-[#1A1A1A]/55 italic"
                value={data.eyebrow}
                onChange={handleTextUpdate("eyebrow")}
                isEditable={isEditable}
                style={{ fontFamily: theme?.fonts?.heading }}
                placeholder="Who We Are?"
              />
            </motion.div>
          </div>
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <EditableText
                as="h2"
                className="font-serif leading-tight font-normal text-[#1A1A1A] md:text-right"
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                  fontFamily: theme?.fonts?.heading,
                }}
                value={data.title}
                onChange={handleTextUpdate("title")}
                isEditable={isEditable}
                placeholder="Our Commitment, Vision, Mission, And Values"
              />
            </motion.div>
          </div>
        </div>

        {/* Row 2: Images left — Body text right */}
        <div className="mb-16 grid grid-cols-1 gap-10 md:mb-28 md:grid-cols-12">
          {/* Left: stacked overlapping images */}
          <div className="relative h-[300px] md:col-span-5 md:h-[340px]">
            {/* Main large image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="absolute overflow-hidden"
              style={{
                width: "78%",
                height: "100%",
                maxHeight: "280px",
                top: 0,
                left: 0,
              }}
            >
              <EditableImage
                src={data.mainImage1}
                alt="Main Commitment Image"
                className="h-full w-full object-cover"
                onImageChange={handleImageUpdate("mainImage1")}
                isEditable={isEditable}
                width={600}
                height={400}
              />
            </motion.div>

            {/* Overlapping smaller image — bottom-right */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute overflow-hidden shadow-xl"
              style={{
                width: "45%",
                height: "100%",
                maxHeight: "200px",
                bottom: 0,
                right: 0,
                zIndex: 10,
              }}
            >
              <EditableImage
                src={data.mainImage2}
                alt="Overlapping Experience Image"
                className="h-full w-full object-cover"
                onImageChange={handleImageUpdate("mainImage2")}
                isEditable={isEditable}
                width={400}
                height={300}
              />
            </motion.div>
          </div>

          {/* Right: body text */}
          <div className="flex items-center md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <EditableText
                as="p"
                className="text-base leading-relaxed text-[#1A1A1A]/65"
                value={data.description}
                onChange={handleTextUpdate("description")}
                isEditable={isEditable}
                style={{ fontFamily: theme?.fonts?.body }}
                multiline={true}
                placeholder="Enter description..."
              />
            </motion.div>
          </div>
        </div>

        {/* ── Bottom Section: Our Vision ── */}
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12">
          {/* Left: heading + text */}
          <div className="md:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <EditableText
                as="h2"
                className="mb-6 font-serif font-normal text-[#1A1A1A]"
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                  fontFamily: theme?.fonts?.heading,
                }}
                value={data.visionTitle}
                onChange={handleTextUpdate("visionTitle")}
                isEditable={isEditable}
                placeholder="Our Vision"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <EditableText
                as="p"
                className="text-base leading-relaxed text-[#1A1A1A]/65"
                value={data.visionDescription}
                onChange={handleTextUpdate("visionDescription")}
                isEditable={isEditable}
                style={{ fontFamily: theme?.fonts?.body }}
                multiline={true}
                placeholder="Enter vision description..."
              />
            </motion.div>
          </div>

          {/* Right: tall image */}
          <div className="md:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="h-[300px] w-full overflow-hidden md:h-[400px]"
            >
              <EditableImage
                src={data.visionImage}
                alt={data.visionTitle}
                className="h-full w-full object-cover"
                onImageChange={handleImageUpdate("visionImage")}
                isEditable={isEditable}
                width={800}
                height={600}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
