"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Leaf, HelpCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { AboutUs21Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { hexToRgba } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AboutUsTemplate21Props {
  aboutUsData: AboutUs21Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs21Data>) => void;
}

const iconMap: Record<string, any> = {
  ShieldCheck,
  Leaf,
  ArrowRight,
};

export const AboutUsTemplate21: React.FC<AboutUsTemplate21Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#2563EB",
      primaryForeground: "#FFFFFF",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  };

  const { data, handleArrayItemUpdate } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  return (
    <div className="flex flex-col bg-white">
      {data.features.map((feature, index) => {
        const IconComponent =
          iconMap[feature.badgeIcon] ||
          (LucideIcons as any)[feature.badgeIcon] ||
          HelpCircle;

        return (
          <section
            key={feature.id}
            className="px-4 py-20 sm:px-6 md:py-32 lg:px-8"
          >
            <div
              className={`mx-auto flex max-w-7xl flex-col items-center gap-12 md:flex-row md:gap-24 ${
                feature.reverse ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image Container */}
              <motion.div
                initial={{ opacity: 0, x: feature.reverse ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full md:w-1/2"
              >
                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-gray-100 bg-gray-50 shadow-sm transition-shadow duration-500 hover:shadow-md">
                  <EditableImage
                    src={feature.image}
                    alt={feature.imageAlt}
                    isEditable={isEditable}
                    onImageChange={url =>
                      handleArrayItemUpdate(
                        "features",
                        feature.id
                      )({ image: url })
                    }
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    width={800}
                    height={800}
                  />

                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    className={`absolute ${
                      feature.badgePosition === "bottom-left"
                        ? "bottom-8 left-8"
                        : "top-8 right-8"
                    } flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 px-5 py-3 shadow-md backdrop-blur-md`}
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: hexToRgba(theme.colors.primary, 0.1),
                        color: theme.colors.primary,
                      }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <EditableText
                      value={feature.badgeText}
                      onChange={val =>
                        handleArrayItemUpdate(
                          "features",
                          feature.id
                        )({ badgeText: val })
                      }
                      isEditable={isEditable}
                      className="text-sm font-semibold whitespace-nowrap text-gray-900"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Content Container */}
              <motion.div
                initial={{ opacity: 0, x: feature.reverse ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex w-full flex-col items-start md:w-1/2"
              >
                <EditableText
                  as="h2"
                  value={feature.title}
                  onChange={val =>
                    handleArrayItemUpdate(
                      "features",
                      feature.id
                    )({ title: val })
                  }
                  isEditable={isEditable}
                  className="mb-8 text-3xl leading-[1.15] font-bold tracking-tight text-gray-950 md:text-5xl lg:text-6xl"
                  style={{ fontFamily: theme.fonts.heading }}
                />

                <EditableText
                  as="p"
                  value={feature.description}
                  onChange={val =>
                    handleArrayItemUpdate(
                      "features",
                      feature.id
                    )({ description: val })
                  }
                  isEditable={isEditable}
                  className="mb-10 max-w-lg text-lg leading-relaxed text-gray-600 md:text-xl"
                  style={{ fontFamily: theme.fonts.body }}
                />

                <EditableLink
                  text={feature.buttonText}
                  href={feature.buttonLink}
                  isEditable={isEditable}
                  onChange={(text, href) =>
                    handleArrayItemUpdate(
                      "features",
                      feature.id
                    )({
                      buttonText: text,
                      buttonLink: href,
                    })
                  }
                  className="group"
                >
                  <Button
                    variant="default"
                    className="h-14 cursor-pointer rounded-full px-8 text-base font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {feature.buttonText}
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </EditableLink>
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
