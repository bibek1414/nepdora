"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Folder,
  Sun,
  Users,
  Lightbulb,
  Briefcase,
  Target,
  Star,
  BarChart3,
  LucideIcon,
  Pin,
} from "lucide-react";

import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { AboutUs11Data } from "@/types/owner-site/components/about";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate11Props {
  aboutUsData: AboutUs11Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs11Data>) => void;
  siteUser?: string;
}

const iconRegistry: Record<string, LucideIcon> = {
  folder: Folder,
  sun: Sun,
  users: Users,
  lightbulb: Lightbulb,
  briefcase: Briefcase,
  target: Target,
  star: Star,
  chart: BarChart3,
};

const hexToRgba = (hex: string, alpha = 1) => {
  const sanitized = hex?.replace("#", "");
  if (sanitized?.length === 6) {
    const r = parseInt(sanitized.slice(0, 2), 16);
    const g = parseInt(sanitized.slice(2, 4), 16);
    const b = parseInt(sanitized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

type TextFieldKey =
  | "headline"
  | "description"
  | "featuredStatValue"
  | "featuredStatLabel"
  | "supportingTitle"
  | "supportingDescription";

export const AboutUsTemplate11: React.FC<AboutUsTemplate11Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();

  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#0F172A",
          primary: "#111827",
          primaryForeground: "#FFFFFF",
          secondary: "#F5F5F0",
          secondaryForeground: "#1F2937",
          background: "#F8F8F6",
        },
        fonts: {
          body: "Inter",
          heading: "Playfair Display",
        },
      },
    [themeResponse]
  );

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleArrayItemUpdate,
  } = useBuilderLogic(aboutUsData, onUpdate);

  const handleBulletUpdate = (id: string) => (value: string) => {
    handleArrayItemUpdate("bulletPoints", id)({ text: value });
  };

  const handleStatUpdate =
    (id: string, field: "value" | "label") => (value: string) => {
      handleArrayItemUpdate("stats", id)({ [field]: value });
    };

  const handleButtonUpdate = (text: string, href: string) => {
    onUpdate?.({
      ctaText: text,
      ctaLink: href,
    });
  };

  const getIcon = (iconKey: string): LucideIcon => {
    const normalizedKey = iconKey?.toLowerCase() || "";
    return iconRegistry[normalizedKey] || Folder;
  };

  return (
    <motion.section
      className="bg-[#f8f8f6] py-16 md:py-24"
      style={{
        backgroundColor: theme.colors.background || "#f8f8f6",
        color: theme.colors.text,
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ staggerChildren: 0.12 }}
    >
      <div className="mx-auto min-h-screen max-w-[1400px] px-6 py-14 md:px-16 lg:px-[82px]">
        <motion.div
          className="mb-20 max-w-5xl"
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <EditableText
            value={data.headline}
            onChange={handleTextUpdate("headline")}
            as="h1"
            className="text-5xl leading-[1.1] font-semibold tracking-tight text-[#111] md:text-6xl lg:text-[68px]"
            isEditable={isEditable}
            placeholder="Add your headline"
            multiline
          />
        </motion.div>

        <motion.div
          className="mb-32 flex flex-col items-start gap-8 lg:flex-row"
          variants={fadeInUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex h-full flex-col justify-between pt-2 lg:w-[22%]">
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="mb-12 text-[13px] leading-4 text-gray-600 lg:mb-[180px]"
              isEditable={isEditable}
              placeholder="Add supporting description"
              multiline
            />

            <div
              className="border-l-[3px] py-1 pl-5"
              style={{ borderColor: theme.colors.primary }}
            >
              <EditableText
                value={data.featuredStatValue}
                onChange={handleTextUpdate("featuredStatValue")}
                as="p"
                className="text-5xl font-bold tracking-tight text-[#111]"
                isEditable={isEditable}
                placeholder="150+"
              />
              <EditableText
                value={data.featuredStatLabel}
                onChange={handleTextUpdate("featuredStatLabel")}
                as="p"
                className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase"
                isEditable={isEditable}
                placeholder="Successful Projects Delivered"
              />
            </div>
          </div>

          <motion.div
            className="px-2 lg:w-[46%] lg:max-w-[520px]"
            variants={fadeInUp}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <div
              className="relative w-full overflow-hidden rounded-3xl shadow-sm"
              style={{ aspectRatio: "4 / 3.8" }}
            >
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt}
                onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                onAltChange={handleAltUpdate("imageAlt")}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={1000}
                height={700}
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 1000,
                  height: 700,
                  text: "Upload about section image",
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-6 pt-2 lg:w-[28%] lg:pl-6"
            variants={fadeInUp}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="min-h-[200px] rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              variants={fadeIn}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="mb-6">
                <Pin
                  className="h-5 w-5 rotate-45"
                  style={{ color: theme.colors.primary }}
                />
              </div>
              <div className="space-y-3.5 text-[15px] font-medium text-[#1A1A1A]">
                {data.bulletPoints.map(point => (
                  <EditableText
                    key={point.id}
                    value={point.text}
                    onChange={handleBulletUpdate(point.id)}
                    as="p"
                    className="leading-relaxed"
                    isEditable={isEditable}
                    placeholder="Add highlight"
                  />
                ))}
              </div>
            </motion.div>

            <EditableLink
              text={data.ctaText}
              href={data.ctaLink}
              onChange={handleButtonUpdate}
              className="group flex w-full items-center justify-between rounded-full py-2 pr-2 pl-6 text-[15px] font-medium text-white shadow-lg shadow-blue-900/10 transition-colors hover:opacity-90"
              style={{
                backgroundColor: theme.colors.primary,
              }}
              isEditable={isEditable}
              textPlaceholder="Book a Free Call"
              hrefPlaceholder="#"
              siteUser={siteUser}
            >
              <>
                <span>{data.ctaText || "Book a Free Call"}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight
                    className="h-5 w-5"
                    style={{ color: theme.colors.primary }}
                  />
                </span>
              </>
            </EditableLink>
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-auto mb-20 max-w-4xl text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <EditableText
            value={data.supportingTitle}
            onChange={handleTextUpdate("supportingTitle")}
            as="h2"
            className="text-4xl leading-[1.15] font-medium text-[#1A1A1A] md:text-5xl lg:text-[56px]"
            isEditable={isEditable}
            placeholder="Add supporting title"
            multiline
          />
          <EditableText
            value={data.supportingDescription}
            onChange={handleTextUpdate("supportingDescription")}
            as="p"
            className="mt-8 text-sm text-gray-500 md:text-[15px]"
            isEditable={isEditable}
            placeholder="Add a brief description"
            multiline
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={fadeIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {data.stats.map(stat => {
            const Icon = getIcon(stat.icon);
            return (
              <motion.div
                key={stat.id}
                className="flex h-full flex-col items-start gap-6 rounded-2xl border border-gray-100 bg-white p-7"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: hexToRgba(theme.colors.primary, 0.1),
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: theme.colors.primary }}
                  />
                </div>
                <div className="mt-auto">
                  <EditableText
                    value={stat.value}
                    onChange={handleStatUpdate(stat.id, "value")}
                    as="h4"
                    className="mb-3 text-[32px] font-bold text-[#111]"
                    isEditable={isEditable}
                    placeholder="Value"
                  />
                  <EditableText
                    value={stat.label}
                    onChange={handleStatUpdate(stat.id, "label")}
                    as="p"
                    className="text-[13px] text-gray-600"
                    isEditable={isEditable}
                    placeholder="Add label"
                    multiline
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};
