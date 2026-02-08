"use client";
import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { FaTree } from "react-icons/fa";
import { AboutUs16Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate16Props {
  aboutUsData: AboutUs16Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs16Data>) => void;
  siteUser?: string;
}

export function AboutUsTemplate16({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}: AboutUsTemplate16Props) {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#0F172A",
          primary: "#00D26A",
          primaryForeground: "#FFFFFF",
          secondary: "#F59E0B",
          secondaryForeground: "#1F2937",
          background: "#FFFFFF",
        },
        fonts: {
          body: "Inter",
          heading: "Poppins",
        },
      },
    [themeResponse]
  );

  const { data, handleTextUpdate, handleImageUpdate } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  const handleButtonLinkUpdate = (text: string, href: string) => {
    onUpdate?.({
      buttonText: text,
      buttonLink: href,
    });
  };

  // Animation Variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariant: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const containerVariant: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section className="mx-auto max-w-7xl overflow-hidden bg-white py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* LEFT SIDE: Image Composition */}
          <div className="relative">
            {/* Main Central Image */}
            <motion.div
              variants={imageVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative z-10 overflow-hidden rounded-lg"
            >
              <EditableImage
                src={data.mainImage}
                alt="Main About Image"
                onImageChange={handleImageUpdate("mainImage")}
                isEditable={isEditable}
                className="h-150 w-full rounded-lg object-cover shadow-lg"
                width={800}
                height={600}
                priority
              />
            </motion.div>

            {/* Floating Badge (Top Left) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -top-10 -left-4 z-20 max-w-[220px] rounded-lg p-6 text-white shadow-xl md:-left-10 md:p-8"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <div className="mb-2 flex items-start gap-2">
                <span className="text-5xl leading-none font-bold md:text-6xl">
                  <EditableText
                    value={data.badgeCount}
                    onChange={handleTextUpdate("badgeCount")}
                    as="span"
                    isEditable={isEditable}
                    placeholder="35"
                  />
                </span>
                <span className="mt-1 text-sm leading-tight font-medium">
                  <EditableText
                    value={data.badgeText}
                    onChange={handleTextUpdate("badgeText")}
                    as="span"
                    isEditable={isEditable}
                    multiline
                    placeholder="Years' Experience"
                  />
                </span>
              </div>
              <div className="my-3 border-t border-white/30"></div>
              <p className="mb-2 font-medium">
                <EditableText
                  value={data.badgeDescription}
                  onChange={handleTextUpdate("badgeDescription")}
                  as="span"
                  isEditable={isEditable}
                  multiline
                  placeholder="Success Stories"
                />
              </p>
              <FaTree className="text-2xl opacity-80" />
            </motion.div>

            {/* Small Top Floating Image */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -top-12 right-0 z-0 hidden h-32 w-40 overflow-hidden rounded-lg border-4 border-white shadow-lg md:-right-8 md:block"
            >
              <EditableImage
                src={data.smallImage1}
                alt="Small Image 1"
                onImageChange={handleImageUpdate("smallImage1")}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={300}
                height={200}
              />
            </motion.div>

            {/* Small Bottom Floating Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 left-0 z-20 hidden h-32 w-48 overflow-hidden rounded-lg border-4 border-white shadow-lg md:-left-12 md:block"
            >
              <EditableImage
                src={data.smallImage2}
                alt="Small Image 2"
                onImageChange={handleImageUpdate("smallImage2")}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={300}
                height={200}
              />
            </motion.div>
          </div>

          {/* RIGHT SIDE: Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariant}
            className="mt-10 lg:mt-0"
          >
            <motion.p
              variants={fadeInUp}
              className="mb-4 text-sm font-semibold tracking-widest text-gray-500 uppercase"
            >
              <EditableText
                value={data.smallTitle}
                onChange={handleTextUpdate("smallTitle")}
                as="span"
                isEditable={isEditable}
                placeholder="SMALL TITLE"
              />
            </motion.p>

            <motion.h2
              variants={fadeInUp}
              className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl"
            >
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                as="span"
                isEditable={isEditable}
                placeholder="Main Title"
              />{" "}
              <span style={{ color: theme.colors.primary }}>
                <EditableText
                  value={data.highlightedText}
                  onChange={handleTextUpdate("highlightedText")}
                  as="span"
                  isEditable={isEditable}
                  placeholder="Highlighted"
                />
              </span>
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="mb-8 text-lg leading-relaxed text-gray-600"
            >
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                isEditable={isEditable}
                multiline
                placeholder="Description text..."
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <EditableLink
                text={data.buttonText}
                href={data.buttonLink}
                onChange={handleButtonLinkUpdate}
                isEditable={isEditable}
                siteUser={siteUser}
                className="inline-block rounded px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-md transition-colors hover:opacity-90"
                style={{ backgroundColor: theme.colors.primary }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
