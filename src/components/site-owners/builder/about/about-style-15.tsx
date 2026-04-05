"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { ChevronRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { AboutUs15Data } from "@/types/owner-site/components/about";

interface AboutUsTemplate15Props {
  aboutUsData: AboutUs15Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs15Data>) => void;
}

export const AboutUsTemplate15: React.FC<AboutUsTemplate15Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#010101",
      background: "#FFFFFF",
    },
    fonts: {
      heading: "Inter",
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const handleFieldUpdate = (field: keyof AboutUs15Data) => (val: string) => {
    onUpdate?.({ [field]: val });
  };

  const handleLinkUpdate = (text: string, href: string) => {
    onUpdate?.({ buttonText: text, buttonLink: href });
  };

  return (
    <motion.section
      className="relative flex min-h-[80vh] items-center overflow-hidden py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ color: theme.colors.primary }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, currentColor 50px, currentColor 51px),
                             repeating-linear-gradient(90deg, transparent, transparent 50px, currentColor 50px, currentColor 51px)`,
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Badge
            variant="outline"
            className="mb-4"
            style={{
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
            }}
          >
            <EditableText
              value={aboutUsData.badge}
              onChange={handleFieldUpdate("badge")}
              isEditable={isEditable}
              as="span"
            />
          </Badge>

          <EditableText
            as="h1"
            value={aboutUsData.title}
            onChange={handleFieldUpdate("title")}
            isEditable={isEditable}
            className="mb-6 text-4xl font-bold md:text-6xl"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.secondary,
            }}
          />

          <EditableText
            as="p"
            value={aboutUsData.description}
            onChange={handleFieldUpdate("description")}
            isEditable={isEditable}
            className="text-muted-foreground mb-8 text-lg font-medium"
            multiline={true}
          />

          <div className="flex flex-wrap gap-4">
            <EditableLink
              text={aboutUsData.buttonText}
              href={aboutUsData.buttonLink}
              isEditable={isEditable}
              onChange={handleLinkUpdate}
              className="group"
              style={{
                background: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
            >
              {aboutUsData.buttonText}
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </EditableLink>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
