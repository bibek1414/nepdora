"use client";

import React, { useMemo, useState } from "react";
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
import { EditableLink } from "@/components/ui/publish/editable-link";
import { AboutUs11Data } from "@/types/owner-site/components/about";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

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
  const [data, setData] = useState(aboutUsData);
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

  const updateData = (updated: Partial<AboutUs11Data>) => {
    setData(prev => ({ ...prev, ...updated }));
    onUpdate?.(updated);
  };

  const handleTextUpdate =
    (field: TextFieldKey) =>
    (value: string): void => {
      updateData({ [field]: value } as Partial<AboutUs11Data>);
    };

  const handleBulletUpdate = (id: string) => (value: string) => {
    const updatedBullets = data.bulletPoints.map(point =>
      point.id === id ? { ...point, text: value } : point
    );
    updateData({ bulletPoints: updatedBullets });
  };

  const handleStatUpdate =
    (id: string, field: "value" | "label" | "sublabel") => (value: string) => {
      const updatedStats = data.stats.map(stat =>
        stat.id === id ? { ...stat, [field]: value } : stat
      );
      updateData({ stats: updatedStats });
    };

  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    updateData({
      imageUrl,
      imageAlt: altText || data.imageAlt,
    });
  };

  const handleAltUpdate = (altText: string) => {
    updateData({ imageAlt: altText });
  };

  const handleButtonUpdate = (text: string, href: string) => {
    updateData({
      ctaText: text,
      ctaLink: href,
    });
  };

  const getIcon = (iconKey: string): LucideIcon => {
    const normalizedKey = iconKey?.toLowerCase() || "";
    return iconRegistry[normalizedKey] || Folder;
  };

  return (
    <section
      className="bg-[#f8f8f6] py-16 md:py-24"
      style={{
        backgroundColor: theme.colors.background || "#f8f8f6",
        color: theme.colors.text,
      }}
    >
      <div className="mx-auto min-h-screen max-w-[1400px] px-6 py-16 md:px-16 lg:px-24">
        <div className="mb-20 max-w-5xl">
          <EditableText
            value={data.headline}
            onChange={handleTextUpdate("headline")}
            as="h1"
            className="text-5xl leading-[1.1] font-semibold tracking-tight text-[#111] md:text-6xl lg:text-[68px]"
            isEditable={isEditable}
            placeholder="Add your headline"
            multiline
          />
        </div>

        <div className="mb-32 flex flex-col items-start gap-8 lg:flex-row">
          <div className="flex h-full flex-col justify-between pt-2 lg:w-[22%]">
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="mb-12 text-[13px] leading-[1.6] text-gray-600 lg:mb-[180px]"
              isEditable={isEditable}
              placeholder="Add supporting description"
              multiline
            />

            <div className="border-l-[3px] border-[#3C32E7] py-1 pl-5">
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

          <div className="px-2 lg:w-[46%] lg:max-w-[520px]">
            <div
              className="relative w-full overflow-hidden rounded-3xl shadow-sm"
              style={{ aspectRatio: "4 / 3.8" }}
            >
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt}
                onImageChange={handleImageUpdate}
                onAltChange={handleAltUpdate}
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
          </div>

          <div className="flex flex-col gap-6 pt-2 lg:w-[28%] lg:pl-6">
            <div className="min-h-[200px] rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="mb-6">
                <Pin className="h-5 w-5 rotate-45 text-[#3C32E7]" />
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
            </div>

            <EditableLink
              text={data.ctaText}
              href={data.ctaLink}
              onChange={handleButtonUpdate}
              className="group flex w-full items-center justify-between rounded-full bg-[#3C32E7] py-2 pr-2 pl-6 text-[15px] font-medium text-white shadow-lg shadow-blue-900/10 transition-colors hover:bg-[#322ac4]"
              isEditable={isEditable}
              textPlaceholder="Book a Free Call"
              hrefPlaceholder="#"
              siteUser={siteUser}
            >
              <>
                <span>{data.ctaText || "Book a Free Call"}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5 text-[#3C32E7]" />
                </span>
              </>
            </EditableLink>
          </div>
        </div>

        <div className="mx-auto mb-20 max-w-4xl text-center">
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
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {data.stats.map(stat => {
            const Icon = getIcon(stat.icon);
            return (
              <div
                key={stat.id}
                className="flex h-full flex-col items-start gap-6 rounded-2xl bg-white p-7 shadow-[0_2px_15px_rgba(0,0,0,0.03)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF0FF]">
                  <Icon
                    className="h-5 w-5"
                    style={{ color: theme.colors.primary || "#3C32E7" }}
                  />
                </div>
                <div>
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
                  <EditableText
                    value={stat.sublabel}
                    onChange={handleStatUpdate(stat.id, "sublabel")}
                    as="p"
                    className="text-[13px] text-gray-500"
                    isEditable={isEditable}
                    placeholder="Add sublabel"
                    multiline
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
