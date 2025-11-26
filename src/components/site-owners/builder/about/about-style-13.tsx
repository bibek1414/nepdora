"use client";

import React, { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { AboutUs13Data } from "@/types/owner-site/components/about";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

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
  const [data, setData] = useState(aboutUsData);
  const [activeTab, setActiveTab] = useState(
    aboutUsData.tabs?.[0]?.id ?? "tab-1"
  );
  const { data: themeResponse } = useThemeQuery();

  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          primary: "#3C32E7",
        },
      },
    [themeResponse]
  );

  const updateData = (partial: Partial<AboutUs13Data>) => {
    const updated = { ...data, ...partial };
    setData(updated);
    onUpdate?.(partial);
  };

  const handleTextUpdate =
    (field: keyof AboutUs13Data) =>
    (value: string): void => {
      updateData({ [field]: value } as Partial<AboutUs13Data>);
    };

  const handleTabTitleUpdate = (tabId: string) => (value: string) => {
    const updatedTabs = data.tabs.map(tab =>
      tab.id === tabId ? { ...tab, title: value } : tab
    );
    updateData({ tabs: updatedTabs });
  };

  const handleTabDescriptionUpdate = (tabId: string) => (value: string) => {
    const updatedTabs = data.tabs.map(tab =>
      tab.id === tabId ? { ...tab, description: value } : tab
    );
    updateData({ tabs: updatedTabs });
  };

  const handleTabImageUpdate =
    (tabId: string) => (imageUrl: string, altText?: string) => {
      const updatedTabs = data.tabs.map(tab =>
        tab.id === tabId
          ? { ...tab, imageUrl, imageAlt: altText || tab.imageAlt }
          : tab
      );
      updateData({ tabs: updatedTabs });
    };

  const handleTabAltUpdate = (tabId: string) => (altText: string) => {
    const updatedTabs = data.tabs.map(tab =>
      tab.id === tabId ? { ...tab, imageAlt: altText } : tab
    );
    updateData({ tabs: updatedTabs });
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

  const handleLinkUpdate = (text: string, href: string) => {
    updateData({
      buttonText: text,
      buttonLink: href,
    });
  };

  const handleOverlayLinkUpdate = (text: string, href: string) => {
    updateData({
      ctaText: text,
      ctaLink: href,
    });
  };

  const activeTabData =
    data.tabs.find(tab => tab.id === activeTab) || data.tabs[0];
  const activeImageUrl = activeTabData?.imageUrl || data.imageUrl;
  const activeImageAlt = activeTabData?.imageAlt || data.imageAlt;

  return (
    <section className="bg-[#f8f8f6] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="relative h-[500px] overflow-hidden rounded-2xl shadow-lg">
            <EditableImage
              src={activeImageUrl}
              alt={activeImageAlt}
              onImageChange={
                activeTabData
                  ? handleTabImageUpdate(activeTabData.id)
                  : handleImageUpdate
              }
              onAltChange={
                activeTabData
                  ? handleTabAltUpdate(activeTabData.id)
                  : handleAltUpdate
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
                className="text-2xl font-bold"
                isEditable={isEditable}
                placeholder="Card title"
                multiline
              />
              <EditableText
                value={data.cardDescription}
                onChange={handleTextUpdate("cardDescription")}
                as="p"
                className="mt-2 text-sm text-white/90"
                isEditable={isEditable}
                placeholder="Card description"
                multiline
              />
              <div className="pointer-events-auto">
                <EditableLink
                  text={data.ctaText}
                  href={data.ctaLink}
                  onChange={handleOverlayLinkUpdate}
                  className="mt-4 inline-flex items-center rounded-full bg-white/90 px-6 py-2 text-sm font-medium text-gray-900 shadow-lg transition-colors hover:bg-white"
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
          </div>

          <div>
            <EditableText
              value={data.heading}
              onChange={handleTextUpdate("heading")}
              as="h2"
              className="mb-6 text-4xl leading-tight font-semibold text-gray-900 md:text-5xl"
              isEditable={isEditable}
              placeholder="Heading"
              multiline
            />
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="mb-10 text-gray-600"
              isEditable={isEditable}
              placeholder="Description"
              multiline
            />

            <div className="mb-8 border-b border-gray-200">
              <div className="flex gap-8 overflow-x-auto pb-4">
                {data.tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "text-gray-900"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {activeTab === tab.id && (
                      <span className="bg-primary h-2 w-2 rounded-full" />
                    )}
                    <EditableText
                      value={tab.title}
                      onChange={handleTabTitleUpdate(tab.id)}
                      as="span"
                      className="cursor-text"
                      isEditable={isEditable}
                      placeholder="Tab title"
                    />
                  </button>
                ))}
              </div>
            </div>

            <EditableText
              value={activeTabData?.description || ""}
              onChange={handleTabDescriptionUpdate(activeTabData?.id || "")}
              as="div"
              className="text-sm leading-loose text-gray-600"
              isEditable={isEditable}
              placeholder="Tab description"
              multiline
            />
          </div>
        </div>
      </div>
    </section>
  );
};
