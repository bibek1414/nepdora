"use client";

import React, { useId, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import {
  HeroTemplate5Data,
  HeroButton,
} from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { toast } from "sonner";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface HeroTemplate5Props {
  heroData: HeroTemplate5Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate5Data>) => void;
}

const CTA_BUTTON_BASE =
  "group/cta relative inline-flex items-center justify-between rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

const CTA_ARROW_BASE =
  "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover/cta:rotate-45";

const DEFAULT_BUTTON: HeroButton = {
  id: "btn-1",
  text: "Book a Free Call",
  variant: "secondary",
  href: "#",
};

export const HeroTemplate5: React.FC<HeroTemplate5Props> = ({
  heroData,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const componentId = useId();
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
  const {
    data,
    setData,
    handleTextUpdate,
    handleButtonUpdate,
    handleAltUpdate,
    getImageUrl,
  } = useBuilderLogic(
    {
      ...heroData,
      buttons:
        heroData.buttons?.length && heroData.buttons[0]
          ? [{ ...heroData.buttons[0] }]
          : [{ ...DEFAULT_BUTTON }],
    },
    onUpdate
  );

  const handlePrimaryButtonUpdate = (text: string, href: string) => {
    const existingButton = data.buttons[0] || DEFAULT_BUTTON;
    handleButtonUpdate("buttons")(
      existingButton.id || DEFAULT_BUTTON.id,
      text,
      href
    );
  };

  const handleBackgroundUpdate = (imageUrl: string, altText?: string) => {
    const update = {
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
      imageAlt: altText || data.imageAlt || "Hero background image",
    };
    const updatedData = { ...data, ...update };
    setData(updatedData);
    onUpdate?.(update);
  };

  const getButtonVariant = (
    variant?: string
  ): "primary" | "white" | "outline" => {
    switch (variant) {
      case "outline":
        return "outline";
      case "secondary":
        return "white";
      default:
        return "primary";
    }
  };

  const getButtonStyle = (variant: "primary" | "white" | "outline") => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryForeground,
        };
      case "white":
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.secondaryForeground,
        };
      case "outline":
        return {
          border: `1px solid ${theme.colors.text}4D`,
          color: theme.colors.text,
        };
    }
  };

  const getArrowStyle = (variant: "primary" | "white" | "outline") => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: theme.colors.primaryForeground,
          color: theme.colors.primary,
        };
      case "white":
        return {
          backgroundColor: theme.colors.secondaryForeground,
          color: theme.colors.secondary,
        };
      case "outline":
        return {
          backgroundColor: theme.colors.text,
          color: theme.colors.background,
        };
    }
  };

  const titleContent =
    data.title ||
    "Navigate Business <br /> with <span class='font-serif font-normal italic'>Confidence</span>";

  const descriptionContent =
    data.description ||
    "Expert strategic consulting to drive sustainable growth, operational innovation, and lasting business transformation across industries and markets, maximizing impact.";

  const primaryButton = data.buttons[0] || DEFAULT_BUTTON;
  const buttonVariant = getButtonVariant(primaryButton.variant);
  const primaryButtonText =
    primaryButton.text ?? DEFAULT_BUTTON.text ?? "Button";
  const primaryButtonHref = primaryButton.href ?? DEFAULT_BUTTON.href ?? "#";

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.section
      className="group relative h-[880px] w-full overflow-hidden bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15 }}
    >
      {/* Background Image with Overlay */}
      <motion.div
        className="absolute inset-0"
        variants={fadeIn}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <EditableImage
          src={getImageUrl(data.backgroundImageUrl, { width: 1920 })}
          alt={data.imageAlt || "Office meeting background"}
          onImageChange={handleBackgroundUpdate}
          onAltChange={handleAltUpdate("imageAlt")}
          isEditable={isEditable}
          className="h-full w-full opacity-60"
          width={1920}
          height={1080}
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Upload hero background",
          }}
          disableImageChange={true}
        />
        <ImageEditOverlay
          onImageSelect={url => handleBackgroundUpdate(url)}
          imageWidth={1920}
          imageHeight={1080}
          isEditable={isEditable}
          label="Change Background"
          folder="hero-backgrounds"
          className="absolute top-0 right-0 z-20 flex items-center justify-center"
        />
      </motion.div>

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 md:px-6">
        <motion.div
          className="max-w-3xl"
          style={{ color: theme.colors.text }}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <EditableText
            value={titleContent}
            onChange={handleTextUpdate("title")}
            as="h1"
            className="mb-6 text-5xl leading-tight font-semibold md:text-7xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
            placeholder="Enter hero title..."
            multiline
          />

          <EditableText
            value={descriptionContent}
            onChange={handleTextUpdate("description")}
            as="p"
            className="mb-10 max-w-xl text-lg leading-relaxed opacity-90"
            style={{ fontFamily: theme.fonts.body }}
            isEditable={isEditable}
            placeholder="Enter hero description..."
            multiline
          />

          <motion.div
            className="flex flex-wrap gap-4"
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <EditableLink
              key={primaryButton.id}
              text={primaryButtonText}
              href={primaryButtonHref}
              onChange={handlePrimaryButtonUpdate}
              isEditable={isEditable}
              siteUser={siteUser}
              className={CTA_BUTTON_BASE}
              style={{
                ...getButtonStyle(buttonVariant),
                fontFamily: theme.fonts.body,
              }}
              textPlaceholder="Button text..."
              hrefPlaceholder="Enter URL..."
            >
              <>
                <span className="mr-4">{primaryButtonText}</span>
                <span
                  className={CTA_ARROW_BASE}
                  style={getArrowStyle(buttonVariant)}
                >
                  <ArrowUpRight size={16} />
                </span>
              </>
            </EditableLink>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
