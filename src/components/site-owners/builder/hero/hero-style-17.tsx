"use client";

import { motion } from "framer-motion";

import React, { useId } from "react";
import { HeroTemplate17Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface HeroTemplate17Props {
  heroData: HeroTemplate17Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate17Data>) => void;
  siteUser?: string;
}

export const HeroTemplate17: React.FC<HeroTemplate17Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "hsl(var(--primary))",
    },
  };

  const { data, handleTextUpdate, handleImageUpdate, handleAltUpdate } =
    useBuilderLogic(heroData, onUpdate);

  return (
    <section className="from-rose via-accent to-beige relative flex min-h-[90vh] items-center overflow-hidden bg-linear-to-br py-20 lg:min-h-[80vh] lg:py-0">
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-peach/60 absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full blur-3xl md:h-[500px] md:w-[500px]" />
        <div className="bg-rose/40 absolute bottom-1/4 left-1/4 h-[250px] w-[250px] rounded-full blur-3xl md:h-[400px] md:w-[400px]" />
      </div>

      <div className="container-luxury relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-32">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card/80 inline-block rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm"
              >
                <EditableText
                  value={data.badge}
                  onChange={handleTextUpdate("badge")}
                  isEditable={isEditable}
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-4xl leading-[1.1] font-bold tracking-tight md:text-6xl lg:text-7xl"
              >
                <EditableText
                  value={data.title}
                  as="h1"
                  onChange={handleTextUpdate("title")}
                  isEditable={isEditable}
                  multiline
                />
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-muted-foreground mx-auto max-w-md text-lg lg:mx-0"
              >
                <EditableText
                  value={data.description}
                  onChange={handleTextUpdate("description")}
                  isEditable={isEditable}
                  multiline
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <EditableLink
                text={data.primaryButtonText}
                href={data.primaryButtonHref}
                isEditable={isEditable}
                siteUser={siteUser}
                onChange={(text, href) => {
                  handleTextUpdate("primaryButtonText")(text);
                  handleTextUpdate("primaryButtonHref")(href);
                }}
                className="group bg-primary text-primary-foreground hover:bg-primary/90 relative flex cursor-pointer items-center justify-center gap-2 rounded-lg px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: theme.colors.primary,
                }}
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter path..."
              />
              <EditableLink
                text={data.secondaryButtonText}
                href={data.secondaryButtonHref}
                isEditable={isEditable}
                siteUser={siteUser}
                onChange={(text, href) => {
                  handleTextUpdate("secondaryButtonText")(text);
                  handleTextUpdate("secondaryButtonHref")(href);
                }}
                className="border-border bg-card/50 hover:bg-card/80 flex cursor-pointer items-center justify-center rounded-lg border px-8 py-3 text-lg font-semibold shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
                textPlaceholder="Button text..."
                hrefPlaceholder="Enter path..."
              />
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-4 md:gap-8 lg:justify-start"
            >
              <div className="text-center">
                <EditableText
                  value={data.stat1Value}
                  onChange={handleTextUpdate("stat1Value")}
                  isEditable={isEditable}
                  as="h5"
                />
                <EditableText
                  as="p"
                  value={data.stat1Label}
                  onChange={handleTextUpdate("stat1Label")}
                  isEditable={isEditable}
                />
              </div>
              <div className="bg-border hidden h-10 w-px md:block" />
              <div className="text-center">
                <EditableText
                  value={data.stat2Value}
                  onChange={handleTextUpdate("stat2Value")}
                  as="h5"
                  isEditable={isEditable}
                />
                <EditableText
                  as="p"
                  value={data.stat2Label}
                  onChange={handleTextUpdate("stat2Label")}
                  isEditable={isEditable}
                />
              </div>
              <div className="bg-border hidden h-10 w-px md:block" />
              <div className="text-center">
                <EditableText
                  value={data.stat3Value}
                  onChange={handleTextUpdate("stat3Value")}
                  isEditable={isEditable}
                  as="h5"
                />
                <EditableText
                  value={data.stat3Label}
                  onChange={handleTextUpdate("stat3Label")}
                  isEditable={isEditable}
                  as="p"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square">
              {/* Main Image */}
              <div className="shadow-elevated absolute inset-0 overflow-hidden rounded-[3rem]">
                <EditableImage
                  src={data.mainImageUrl}
                  alt={data.mainImageAlt}
                  onImageChange={handleImageUpdate(
                    "mainImageUrl",
                    "mainImageAlt"
                  )}
                  onAltChange={handleAltUpdate("mainImageAlt")}
                  isEditable={isEditable}
                  className="h-full w-full object-cover"
                  width={900}
                  height={900}
                  placeholder={{
                    width: 900,
                    height: 900,
                    text: "Main Hero Image",
                  }}
                />
              </div>

              {/* Floating Product */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="shadow-elevated bg-card absolute top-1/4 -right-8 h-40 w-32 rounded-3xl p-3"
              >
                <EditableImage
                  src={data.floatingImageUrl}
                  alt={data.floatingImageAlt}
                  onImageChange={handleImageUpdate(
                    "floatingImageUrl",
                    "floatingImageAlt"
                  )}
                  onAltChange={handleAltUpdate("floatingImageAlt")}
                  isEditable={isEditable}
                  className="h-full w-full rounded-2xl object-cover"
                  width={200}
                  height={300}
                  placeholder={{
                    width: 200,
                    height: 300,
                    text: "Product",
                  }}
                />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="shadow-elevated bg-card absolute bottom-1/4 -left-4 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="">
                    <EditableText
                      value={data.floatingBadgeIcon}
                      onChange={handleTextUpdate("floatingBadgeIcon")}
                      isEditable={isEditable}
                      className="z-10"
                    />
                  </div>
                  <div>
                    <EditableText
                      value={data.floatingBadgeTitle}
                      as="p"
                      onChange={handleTextUpdate("floatingBadgeTitle")}
                      isEditable={isEditable}
                      className="z-10"
                    />
                    <EditableText
                      value={data.floatingBadgeSubtitle}
                      as="p"
                      onChange={handleTextUpdate("floatingBadgeSubtitle")}
                      isEditable={isEditable}
                      className="z-10"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
