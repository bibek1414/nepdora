"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate15Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface HeroTemplate15Props {
  heroData: HeroTemplate15Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate15Data>) => void;
}

export const HeroTemplate15: React.FC<HeroTemplate15Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const componentId = React.useId();

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#1F2937",
      primary: "#0D3B2E",
      primaryForeground: "#FFFFFF",
      secondary: "#E8621A",
      secondaryForeground: "#FFFFFF",
      background: "#FBF7F0",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const { data, handleTextUpdate, getImageUrl, setData } = useBuilderLogic(
    heroData,
    onUpdate
  );

  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1000], [0, 360]);

  const primaryColor = theme.colors.primary ?? "#0D3B2E";
  const secondaryColor = theme.colors.secondary ?? "#E8621A";

  const button =
    data.buttons && data.buttons.length > 0
      ? data.buttons[0]
      : { id: "1", text: "Order Now", variant: "primary" as const, href: "#" };

  const imageUrl = data.imageUrl || "/hero.webp";

  return (
    <section
      className="relative flex min-h-screen max-w-7xl mx-auto items-center overflow-hidden px-4 py-12 md:px-12"
      data-component-id={componentId}
    >
      {/* Background decorative shape */}
      <div
        className="absolute top-0 right-0 -z-10 h-full w-1/2 rounded-l-[200px]"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Floating decorative elements in background */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-32 left-10 h-24 w-24 opacity-20"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          style={{ fill: primaryColor }}
        >
          <path d="M50,10 Q65,30 50,50 Q35,30 50,10 M50,50 Q30,65 10,50 Q30,35 50,50 M50,50 Q65,70 50,90 Q35,70 50,50 M50,50 Q70,65 90,50 Q70,35 50,50" />
        </svg>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-1/4 bottom-24 h-16 w-16 opacity-15"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          style={{ fill: secondaryColor }}
        >
          <circle cx="30" cy="70" r="8" />
          <circle cx="50" cy="75" r="6" />
          <circle cx="70" cy="65" r="10" />
        </svg>
      </motion.div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <EditableText
            value={data.subtitle || "Savor Every Bite"}
            onChange={handleTextUpdate("subtitle")}
            as="span"
            className="text-secondary mb-6 block text-sm font-bold tracking-widest"
            style={{ color: secondaryColor }}
            isEditable={isEditable}
            placeholder="Badge text..."
          />

          <EditableText
            value={
              data.title
                ? data.title.split("<br />")[0] || "Delicious Deals"
                : "Delicious Deals"
            }
            onChange={val => {
              const currentParts = data.title
                ? data.title.split("<br />")
                : ["Delicious Deals", "In One", "Click"];
              currentParts[0] = val;
              handleTextUpdate("title")(currentParts.join("<br />"));
            }}
            as="h1"
            className="mb-8 text-5xl leading-[0.95] font-black md:text-6xl lg:text-6xl"
            isEditable={isEditable}
            placeholder="First line..."
          />
          <br />

          <EditableText
            value={
              data.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed sodales auctor orci, sit amet vulputate velit molestie."
            }
            onChange={handleTextUpdate("description")}
            as="p"
            className="mb-12 max-w-md text-lg leading-relaxed text-[#0D3B2E]/70"
            isEditable={isEditable}
            placeholder="Description..."
            multiline
          />

          <div className="flex gap-16">
            <div>
              <EditableText
                value={data.stat1Value || "23"}
                onChange={handleTextUpdate("stat1Value")}
                as="div"
                className="mb-2 text-5xl font-black"
                isEditable={isEditable}
                placeholder="Stat value..."
              />
              <EditableText
                value={data.stat1Label || "Daily Orders"}
                onChange={handleTextUpdate("stat1Label")}
                as="div"
                className="text-sm font-bold tracking-wider"
                isEditable={isEditable}
                placeholder="Stat label..."
              />
            </div>
            <div>
              <EditableText
                value={data.stat2Value || "56+"}
                onChange={handleTextUpdate("stat2Value")}
                as="div"
                className="mb-2 text-5xl font-black"
                isEditable={isEditable}
                placeholder="Stat value..."
              />
              <EditableText
                value={data.stat2Label || "Items Available"}
                onChange={handleTextUpdate("stat2Label")}
                as="div"
                className="text-sm font-bold tracking-wider"
                isEditable={isEditable}
                placeholder="Stat label..."
              />
            </div>
          </div>
        </motion.div>

        {/* Right Content - The animated Plate with Decorative Circles */}
        <div className="relative flex items-center justify-center">
          {/* Decorative Circle Rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img
              src="/hero-circle.svg"
              alt=""
              className="w-full max-w-[520px]"
            />
          </div>

          {/* Main rotating container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10"
            style={{ rotate }}
          >
            {/* Main Plate Image */}
            <div className="relative">
              <div className="h-80 w-80 overflow-hidden rounded-full border-[12px] border-white shadow-2xl md:h-[500px] md:w-[500px]">
                <EditableImage
                  key={`hero15-plate-${componentId}-${imageUrl}`}
                  src={getImageUrl(imageUrl, {
                    width: 800,
                    height: 800,
                    crop: "fill",
                  })}
                  alt={data.imageAlt || "Delicious food plate"}
                  onImageChange={(url, alt) => {
                    const updated: Partial<HeroTemplate15Data> = {
                      imageUrl: url,
                    };
                    if (alt) updated.imageAlt = alt;
                    onUpdate?.(updated);
                  }}
                  onAltChange={alt => onUpdate?.({ imageAlt: alt })}
                  isEditable={isEditable}
                  className="h-full w-full object-cover"
                  width={800}
                  height={800}
                  cloudinaryOptions={{
                    folder: "hero-15-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 800,
                    height: 800,
                    text: "Food plate image",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Floating Price Tag - should not rotate */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-1/4 left-0 z-20 flex flex-col items-center justify-center rounded-full border-4 border-white p-6 shadow-2xl md:left-8 md:p-8"
            style={{ backgroundColor: secondaryColor }}
          >
            <EditableText
              value={data.priceLabel || "Price"}
              onChange={handleTextUpdate("priceLabel")}
              as="div"
              className="text-xs font-bold tracking-wider text-white"
              isEditable={isEditable}
              placeholder="Label..."
            />
            <EditableText
              value={data.priceValue || "$ 10.03"}
              onChange={handleTextUpdate("priceValue")}
              as="div"
              className="mt-1 text-3xl leading-none font-bold text-white"
              isEditable={isEditable}
              placeholder="$ 0.00"
            />
          </motion.div>

          {/* Floating Decorative Food Items */}
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [0, 12, 0],
              x: [0, 15, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute top-8 -left-4 z-0 h-20 w-20 opacity-40"
          >
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full"
              style={{ fill: "#4A9B6F" }}
            >
              <path d="M50,10 Q30,20 25,40 Q20,60 30,75 Q40,85 50,90 Q60,85 70,75 Q80,60 75,40 Q70,20 50,10 M45,30 L55,30 L50,60 Z" />
            </svg>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -18, 0],
              x: [0, -12, 0],
            }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute right-0 bottom-12 z-0 h-16 w-16 opacity-35"
          >
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full"
              style={{ fill: secondaryColor }}
            >
              <ellipse cx="50" cy="70" rx="15" ry="25" />
              <path d="M50,45 Q40,35 35,25 Q40,15 50,10 Q60,15 65,25 Q60,35 50,45" />
            </svg>
          </motion.div>

          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 8, 0],
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute top-1/3 right-8 z-0 h-12 w-12 opacity-25"
          >
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full"
              style={{ fill: "#FF6B35" }}
            >
              <circle cx="50" cy="50" r="35" />
              <circle cx="50" cy="50" r="25" fill="#FBF7F0" opacity="0.3" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
