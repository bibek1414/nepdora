"use client";

import React from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate23Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface HeroTemplate23Props {
  heroData: HeroTemplate23Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate23Data>) => void;
}

export const HeroTemplate23: React.FC<HeroTemplate23Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate, handleButtonUpdate, setData } =
    useBuilderLogic(heroData, onUpdate);

  const handleStatUpdate =
    (id: string, field: "number" | "label") => (value: string) => {
      const updatedStats = data.stats.map(stat =>
        stat.id === id ? { ...stat, [field]: value } : stat
      );
      setData({ ...data, stats: updatedStats });
    };

  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden md:min-h-[700px] lg:min-h-[800px]">
        <div className="absolute inset-0">
          <EditableImage
            src={data.backgroundImageUrl}
            alt={data.imageAlt}
            onImageChange={handleTextUpdate("backgroundImageUrl")}
            isEditable={isEditable}
            className="h-full w-full object-cover object-center"
            buttonPosition="top-right"
          />
          {/* Responsive gradient overlay - different gradients for different screen sizes */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${theme?.colors?.primary || "#000"}E6, ${theme?.colors?.primary || "#000"}99, transparent)`,
            }}
          />
          {/* Additional overlay for better text readability on mobile */}
          <div className="absolute inset-0 bg-black/30 md:hidden" />
        </div>
        <div className="z-10 w-full max-w-7xl px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-full md:max-w-2xl"
          >
            <EditableText
              value={data.eyebrow}
              as="span"
              onChange={handleTextUpdate("eyebrow")}
              isEditable={isEditable}
              className="mb-3 block text-xs font-semibold text-white/70 md:mb-4 md:text-sm"
              style={{
                fontFamily: theme?.fonts?.body,
              }}
            />
            <EditableText
              value={data.title}
              as="h1"
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              className="mb-4 text-3xl leading-tight font-medium text-white md:mb-6 md:text-4xl lg:text-5xl xl:text-6xl"
              style={{ fontFamily: theme?.fonts?.heading }}
              multiline
            />
            <EditableText
              value={data.description}
              as="p"
              onChange={handleTextUpdate("description")}
              isEditable={isEditable}
              className="mb-6 max-w-lg text-base leading-relaxed text-white/80 md:mb-8 md:text-lg"
              style={{ fontFamily: theme?.fonts?.body }}
              multiline
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              {data.buttons?.map((button, index) => (
                <div
                  key={button.id || index}
                  className="relative z-10 w-full sm:w-auto"
                >
                  <EditableLink
                    text={button.text}
                    href={button.href || "#"}
                    onChange={(newText, newHref) =>
                      handleButtonUpdate("buttons")(button.id, newText, newHref)
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className={cn(
                      "inline-flex w-full cursor-pointer justify-center rounded-full px-6 py-3 text-center font-semibold transition-all duration-200 sm:w-auto sm:px-8 sm:py-3.5",
                      isEditable && "cursor-pointer"
                    )}
                    style={{
                      backgroundColor:
                        button.variant === "primary"
                          ? theme?.colors?.primary
                          : theme?.colors?.secondary,
                      color:
                        button.variant === "primary"
                          ? theme?.colors?.primaryForeground
                          : theme?.colors?.secondaryForeground,
                      fontFamily: theme?.fonts?.body,
                    }}
                  >
                    {button.text}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </EditableLink>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-12 md:py-16"
        style={{ backgroundColor: theme?.colors?.primary }}
      >
        <div className="container-page mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {data.stats.map((s, i) => (
              <motion.div
                key={s.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <EditableText
                  value={s.number}
                  as="title"
                  onChange={handleStatUpdate(s.id, "number")}
                  isEditable={isEditable}
                  className="mb-2 text-2xl font-medium text-white md:mb-2 md:text-3xl lg:text-4xl"
                  style={{
                    fontFamily: theme?.fonts?.heading,
                  }}
                />
                <EditableText
                  value={s.label}
                  as="div"
                  onChange={handleStatUpdate(s.id, "label")}
                  isEditable={isEditable}
                  className="text-xs md:text-sm"
                  style={{
                    fontFamily: theme?.fonts?.body,
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
