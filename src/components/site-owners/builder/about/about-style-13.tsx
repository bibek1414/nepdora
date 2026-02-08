"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { AboutUs13Data } from "@/types/owner-site/components/about";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate13Props {
  aboutUsData: AboutUs13Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs13Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate13: React.FC<AboutUsTemplate13Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#0F172A",
          primary: "#3C32E7",
          primaryForeground: "#FFFFFF",
          secondary: "#F59E0B",
          secondaryForeground: "#1F2937",
          background: "#F8F8F6",
        },
        fonts: {
          body: "Inter",
          heading: "Poppins",
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

  const [activeTab, setActiveTab] = useState(data.tabs?.[0]?.id ?? "tab-1");

  const handleTabTitleUpdate = (tabId: string) => (value: string) => {
    handleArrayItemUpdate("tabs", tabId)({ title: value });
  };

  const handleTabDescriptionUpdate = (tabId: string) => (value: string) => {
    handleArrayItemUpdate("tabs", tabId)({ description: value });
  };

  const handleTabImageUpdate =
    (tabId: string) => (imageUrl: string, altText?: string) => {
      handleArrayItemUpdate("tabs", tabId)({ imageUrl, imageAlt: altText });
    };

  const handleTabAltUpdate = (tabId: string) => (altText: string) => {
    handleArrayItemUpdate("tabs", tabId)({ imageAlt: altText });
  };

  const handleOverlayLinkUpdate = (text: string, href: string) => {
    onUpdate?.({
      ctaText: text,
      ctaLink: href,
    });
  };

  const activeTabData =
    data.tabs.find(tab => tab.id === activeTab) || data.tabs[0];
  const activeImageUrl = activeTabData?.imageUrl || data.imageUrl;
  const activeImageAlt = activeTabData?.imageAlt || data.imageAlt;

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
      className="py-16 md:py-24"
      style={{ backgroundColor: theme.colors.background }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15 }}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-16 lg:px-[84px]">
        <motion.div
          className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2"
          variants={fadeIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="relative h-[500px] overflow-hidden rounded-2xl shadow-lg"
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <EditableImage
              src={activeImageUrl}
              alt={activeImageAlt}
              onImageChange={
                activeTabData
                  ? handleTabImageUpdate(activeTabData.id)
                  : handleImageUpdate("imageUrl", "imageAlt")
              }
              onAltChange={
                activeTabData
                  ? handleTabAltUpdate(activeTabData.id)
                  : handleAltUpdate("imageAlt")
              }
              isEditable={isEditable}
              className="h-full w-full object-cover"
              width={800}
              height={800}
              cloudinaryOptions={{
                folder: "about-us-images",
                resourceType: "image",
              }}
              showAltEditor={isEditable}
              placeholder={{
                width: 800,
                height: 800,
                text: "Upload partnership image",
              }}
            />

            <div className="pointer-events-none absolute bottom-8 left-8 max-w-xs text-white">
              <EditableText
                value={data.cardTitle}
                onChange={handleTextUpdate("cardTitle")}
                as="h3"
                style={{
                  color: "#FFFFFF",
                  fontFamily: theme.fonts.heading,
                }}
                className="text-2xl font-bold"
                isEditable={isEditable}
                placeholder="Card title"
                multiline
              />
              <EditableText
                value={data.cardDescription}
                onChange={handleTextUpdate("cardDescription")}
                as="p"
                style={{
                  color: "#FFFFFF",
                  fontFamily: theme.fonts.body,
                }}
                className="mt-2 text-sm opacity-90"
                isEditable={isEditable}
                placeholder="Card description"
                multiline
              />
              <div className="pointer-events-auto">
                <EditableLink
                  text={data.ctaText}
                  href={data.ctaLink}
                  onChange={handleOverlayLinkUpdate}
                  style={{
                    backgroundColor: theme.colors.primaryForeground + "E6",
                    color: theme.colors.text,
                    fontFamily: theme.fonts.body,
                  }}
                  className="mt-4 inline-flex items-center rounded-full px-6 py-2 text-sm font-medium shadow-lg transition-colors hover:opacity-100"
                  textPlaceholder="Get In Touch"
                  hrefPlaceholder="#"
                  isEditable={isEditable}
                  siteUser={siteUser}
                >
                  <>
                    {data.ctaText || "Get In Touch"}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </>
                </EditableLink>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <EditableText
              value={data.heading}
              onChange={handleTextUpdate("heading")}
              as="h2"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
              }}
              className="mb-6 text-4xl leading-tight font-semibold md:text-5xl"
              isEditable={isEditable}
              placeholder="Heading"
              multiline
            />
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
              className="mb-10 opacity-80"
              isEditable={isEditable}
              placeholder="Description"
              multiline
            />

            <div
              className="mb-8 border-b"
              style={{ borderColor: theme.colors.text + "33" }}
            >
              <div className="flex gap-8 overflow-x-auto pb-4">
                {data.tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      color:
                        activeTab === tab.id
                          ? theme.colors.primary
                          : theme.colors.text + "66",
                      fontFamily: theme.fonts.body,
                    }}
                    className={`flex cursor-pointer items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id ? "" : "hover:opacity-80"
                    }`}
                  >
                    {activeTab === tab.id && (
                      <span
                        className="h-2 w-2 cursor-pointer rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    )}
                    <EditableText
                      value={tab.title}
                      onChange={handleTabTitleUpdate(tab.id)}
                      as="span"
                      className="cursor-pointer"
                      isEditable={isEditable}
                      placeholder="Tab title"
                    />
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeTabData?.id || "tab-content"}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <EditableText
                value={activeTabData?.description || ""}
                onChange={handleTabDescriptionUpdate(activeTabData?.id || "")}
                as="div"
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                }}
                className="text-sm leading-loose opacity-80"
                isEditable={isEditable}
                placeholder="Tab description"
                multiline
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
