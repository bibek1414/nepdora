"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { AboutUs23Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate23Props {
  aboutUsData: AboutUs23Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs23Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate23: React.FC<AboutUsTemplate23Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data, handleTextUpdate, handleImageUpdate, handleArrayItemUpdate } =
    useBuilderLogic(aboutUsData, onUpdate);

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: { primary: "#3B82F6", primaryForeground: "#FFFFFF" },
  };

  const primaryColor = theme.colors.primary;

  const FeatureList = ({
    items,
    section,
  }: {
    items: Array<{ id: string; text: string }>;
    section: "mission" | "vision";
  }) => (
    <ul className="mb-8 space-y-4">
      {items.map(item => (
        <li key={item.id} className="flex items-start gap-3">
          <div
            className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${primaryColor}1A`,
              color: primaryColor,
            }}
          >
            <Check size={12} />
          </div>
          <EditableText
            value={item.text}
            onChange={(val: string) => {
              handleArrayItemUpdate(
                `${section}Features` as keyof AboutUs23Data,
                item.id
              )({ text: val });
            }}
            as="span"
            className="font-medium text-gray-700"
            isEditable={isEditable}
          />
        </li>
      ))}
    </ul>
  );


  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Mission Row */}
        <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:mb-32 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-4">
              <EditableText
                value={data.missionTag}
                onChange={handleTextUpdate("missionTag")}
                as="span"
                className="text-sm font-bold tracking-wider uppercase"
                style={{ color: primaryColor }}
                isEditable={isEditable}
              />
            </div>
            <div className="mb-6">
              <EditableText
                value={data.missionTitle}
                onChange={handleTextUpdate("missionTitle")}
                as="h2"
                className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl"
                isEditable={isEditable}
              />
            </div>
            <EditableText
              value={data.missionDescription}
              onChange={handleTextUpdate("missionDescription")}
              as="p"
              className="mb-8 leading-relaxed text-gray-500"
              isEditable={isEditable}
              multiline
            />
            <FeatureList items={data.missionFeatures} section="mission" />
            <EditableLink
              text={data.missionButtonText}
              href={data.missionButtonLink}
              onChange={(text: string, href: string) => {
                handleTextUpdate("missionButtonText")(text);
                handleTextUpdate("missionButtonLink")(href);
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: primaryColor,
                color: theme.colors.primaryForeground,
              }}
              isEditable={isEditable}
              siteUser={siteUser}
            >
              <div className="flex items-center gap-2">
                <span>{data.missionButtonText}</span>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-105"
                  style={{ color: primaryColor }}
                >
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </EditableLink>
          </motion.div>
          <motion.div
            className="h-[400px] overflow-hidden rounded-3xl shadow-2xl sm:h-[500px]"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <EditableImage
              src={data.missionImage}
              alt={data.missionImageAlt}
              onImageChange={handleImageUpdate(
                "missionImage",
                "missionImageAlt"
              )}
              isEditable={isEditable}
              className="h-full w-full object-cover"
              width={1740}
              height={1000}
            />
          </motion.div>
        </div>

        {/* Vision Row */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="order-2 h-[400px] overflow-hidden rounded-3xl shadow-2xl sm:h-[500px] lg:order-1"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <EditableImage
              src={data.visionImage}
              alt={data.visionImageAlt}
              onImageChange={handleImageUpdate("visionImage", "visionImageAlt")}
              isEditable={isEditable}
              className="h-full w-full object-cover"
              width={1674}
              height={1000}
            />
          </motion.div>
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-4">
              <EditableText
                value={data.visionTag}
                onChange={handleTextUpdate("visionTag")}
                as="span"
                className="text-sm font-bold tracking-wider uppercase"
                style={{ color: primaryColor }}
                isEditable={isEditable}
              />
            </div>
            <div className="mb-6">
              <EditableText
                value={data.visionTitle}
                onChange={handleTextUpdate("visionTitle")}
                as="h2"
                className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl"
                isEditable={isEditable}
              />
            </div>
            <EditableText
              value={data.visionDescription}
              onChange={handleTextUpdate("visionDescription")}
              as="p"
              className="mb-8 leading-relaxed text-gray-500"
              isEditable={isEditable}
              multiline
            />
            <FeatureList items={data.visionFeatures} section="vision" />
            <EditableLink
              text={data.visionButtonText}
              href={data.visionButtonLink}
              onChange={(text: string, href: string) => {
                handleTextUpdate("visionButtonText")(text);
                handleTextUpdate("visionButtonLink")(href);
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: primaryColor,
                color: theme.colors.primaryForeground,
              }}
              isEditable={isEditable}
              siteUser={siteUser}
            >
              <div className="flex items-center gap-2">
                <span>{data.visionButtonText}</span>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-105"
                  style={{ color: primaryColor }}
                >
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </EditableLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
