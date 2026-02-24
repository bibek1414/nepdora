"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate16Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { CheckCircle } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface HeroTemplate16Props {
  heroData: HeroTemplate16Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate16Data>) => void;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  },
};

export const HeroTemplate16: React.FC<HeroTemplate16Props> = ({
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
      primary: "#10B981",
      primaryForeground: "#FFFFFF",
      secondary: "#3B82F6",
      secondaryForeground: "#FFFFFF",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const { data, handleTextUpdate, getImageUrl, handleButtonUpdate } =
    useBuilderLogic(heroData, onUpdate);

  const primaryColor = theme.colors.primary ?? "#10B981";

  const buttons = data.buttons || [];
  const features = data.features || [];

  return (
    <section
      className="relative overflow-hidden"
      data-component-id={componentId}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, currentColor 50px, currentColor 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, currentColor 50px, currentColor 51px)`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="mb-6 flex w-fit items-center gap-3 rounded-lg border border-gray-200 bg-white/80 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-[28px] w-[28px] overflow-hidden">
                  <EditableImage
                    src="/certifications/education-ministry.jpg"
                    alt={data.badge1Text || "Ministry of Education Approved"}
                    onImageChange={url => onUpdate?.({ badge1Image: url })}
                    isEditable={isEditable}
                    className="h-full w-full object-contain"
                  />
                </div>
                <EditableText
                  value={data.badge1Text || "Approved by Ministry of Education"}
                  onChange={handleTextUpdate("badge1Text")}
                  className="text-xs font-medium whitespace-nowrap text-gray-700"
                  isEditable={isEditable}
                  as="span"
                />
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="h-[28px] w-[28px] overflow-hidden">
                  <EditableImage
                    src="/certifications/titi.jpg"
                    alt={data.badge2Text || "TITI Certified"}
                    onImageChange={url => onUpdate?.({ badge2Image: url })}
                    isEditable={isEditable}
                    className="h-full w-full object-contain"
                  />
                </div>
                <EditableText
                  value={data.badge2Text || "TITI Certified Counselors"}
                  onChange={handleTextUpdate("badge2Text")}
                  className="text-xs font-medium whitespace-nowrap text-gray-700"
                  isEditable={isEditable}
                  as="span"
                />
              </div>
            </div>

            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              multiline
              as="h1"
              className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-4xl lg:text-5xl"
            />

            <EditableText
              value={
                data.description ||
                "Expert guidance for studying in USA, UK, Australia, Canada & New Zealand. From course selection to visa processing — we've got you covered."
              }
              onChange={handleTextUpdate("description")}
              as="span"
              className="max-w-xl !text-xl text-gray-500 md:text-3xl"
              isEditable={isEditable}
              multiline
            />

            <div className="mt-10 mb-10 flex flex-col gap-4 sm:flex-row">
              {buttons.map((button, index) => {
                if (index === 0) {
                  return (
                    <EditableLink
                      key={button.id}
                      text={button.text}
                      href={button.href || "#"}
                      onChange={(text, href) =>
                        handleButtonUpdate("buttons")(button.id, text, href)
                      }
                      isEditable={isEditable}
                      siteUser={siteUser}
                      className="text-primary-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center gap-2 rounded-md px-8 text-base font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                      style={{ backgroundColor: primaryColor, color: "#fff" }}
                    >
                      <span>{button.text}</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </EditableLink>
                  );
                }

                return (
                  <EditableLink
                    key={button.id}
                    text={button.text}
                    href={button.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(button.id, text, href)
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border px-8 text-base font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    <span>{button.text}</span>
                  </EditableLink>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-900">
              {features.map(feature => (
                <div key={feature.id} className="flex items-center gap-2">
                  <CheckCircle
                    className="text-primary h-4 w-4"
                    style={{ color: primaryColor }}
                  />
                  <EditableText
                    value={feature.text}
                    onChange={val => {
                      const updatedFeatures = features.map(f =>
                        f.id === feature.id ? { ...f, text: val } : f
                      );
                      onUpdate?.({ features: updatedFeatures });
                    }}
                    className="flex items-center gap-2"
                    as="span"
                    isEditable={isEditable}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative hidden lg:block"
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
          >
            <div className="mt-12 h-auto w-full overflow-hidden rounded-2xl shadow-lg">
              <EditableImage
                src="/hero-students.webp"
                alt={
                  data.imageAlt ||
                  "International students celebrating graduation with global landmarks"
                }
                onImageChange={(url, alt) => {
                  const updated: Partial<HeroTemplate16Data> = {
                    imageUrl: url,
                  };
                  if (alt) updated.imageAlt = alt;
                  onUpdate?.(updated);
                }}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={1000}
                height={600}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
