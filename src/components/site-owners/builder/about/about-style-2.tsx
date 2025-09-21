"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AboutUs2Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate2Props {
  aboutUsData: AboutUs2Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs2Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate2: React.FC<AboutUsTemplate2Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [data, setData] = useState(aboutUsData);
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

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs2Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs2Data>);
  };

  // Handle image updates
  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      heroImageUrl: imageUrl,
      heroImageAlt: altText || data.heroImageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      heroImageUrl: imageUrl,
      heroImageAlt: updatedData.heroImageAlt,
    });
  };

  // Handle alt text updates
  const handleAltUpdate = (altText: string) => {
    const updatedData = { ...data, heroImageAlt: altText };
    setData(updatedData);
    onUpdate?.({ heroImageAlt: altText });
  };

  // Handle journey image updates
  const handleJourneyImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      journeyImageUrl: imageUrl,
      journeyImageAlt: altText || data.journeyImageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      journeyImageUrl: imageUrl,
      journeyImageAlt: updatedData.journeyImageAlt,
    });
  };

  // Handle journey alt text updates
  const handleJourneyAltUpdate = (altText: string) => {
    const updatedData = { ...data, journeyImageAlt: altText };
    setData(updatedData);
    onUpdate?.({ journeyImageAlt: altText });
  };

  // Handle link updates
  const handleLinkUpdate = (text: string, href: string) => {
    const updatedData = {
      ...data,
      ctaText: text,
      ctaLink: href,
    };
    setData(updatedData);
    onUpdate?.({
      ctaText: text,
      ctaLink: href,
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative flex h-96 items-center justify-center overflow-hidden bg-gradient-to-r from-gray-800 to-gray-600">
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Background sneaker image */}
        <div className="absolute inset-0">
          <EditableImage
            src={data.heroImageUrl}
            alt={data.heroImageAlt}
            onImageChange={handleImageUpdate}
            onAltChange={handleAltUpdate}
            isEditable={isEditable}
            className="object-cover opacity-30"
            cloudinaryOptions={{
              folder: "about-us-images",
              resourceType: "image",
            }}
            showAltEditor={isEditable}
            placeholder={{
              width: 1200,
              height: 400,
              text: "Upload hero background image",
            }}
          />
        </div>

        <div className="relative z-10 text-center text-white">
          <EditableText
            value={data.heroTitle}
            onChange={handleTextUpdate("heroTitle")}
            as="h1"
            style={{
              color: "#FFFFFF",
              fontFamily: theme.fonts.heading,
            }}
            className="mb-4 text-6xl font-bold tracking-wide"
            isEditable={isEditable}
            placeholder="Enter hero title..."
          />
        </div>
      </div>

      {/* Our Story Section */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <EditableText
          value={data.storyTitle}
          onChange={handleTextUpdate("storyTitle")}
          as="h2"
          style={{
            color: theme.colors.primary,
            fontFamily: theme.fonts.heading,
          }}
          className="mb-12 text-3xl font-bold text-gray-900"
          isEditable={isEditable}
          placeholder="Enter story title..."
        />

        {/* Our Sneaker Journey */}
        <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="transform overflow-hidden rounded-2xl bg-white shadow-xl transition-transform duration-300 hover:scale-105">
              <div className="flex h-80 items-center justify-center">
                <EditableImage
                  src={data.journeyImageUrl}
                  alt={data.journeyImageAlt}
                  onImageChange={handleJourneyImageUpdate}
                  onAltChange={handleJourneyAltUpdate}
                  isEditable={isEditable}
                  className="-rotate-12 transform rounded-xl object-cover shadow-lg transition-transform duration-500 hover:rotate-0"
                  width={400}
                  height={300}
                  cloudinaryOptions={{
                    folder: "about-us-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 400,
                    height: 300,
                    text: "Upload journey image",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <EditableText
              value={data.journeyTitle}
              onChange={handleTextUpdate("journeyTitle")}
              as="h3"
              style={{
                color: theme.colors.secondary,
                fontFamily: theme.fonts.heading,
              }}
              className="text-4xl leading-tight font-bold text-gray-900"
              isEditable={isEditable}
              placeholder="Enter journey title..."
            />

            <EditableText
              value={data.journeyDescription}
              onChange={handleTextUpdate("journeyDescription")}
              as="p"
              className="text-lg leading-relaxed text-gray-600"
              isEditable={isEditable}
              placeholder="Enter journey description..."
              multiline={true}
            />

            <EditableLink
              text={data.ctaText}
              href={data.ctaLink}
              onChange={handleLinkUpdate}
              className="flex transform items-center space-x-2 rounded-full px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.colors.primary,

                fontFamily: theme.fonts.heading,
              }}
              isEditable={isEditable}
              textPlaceholder="Button text..."
              hrefPlaceholder="Enter link URL..."
              siteUser={siteUser}
            >
              <span>{data.ctaText || "Let's Go"}</span>
              <ArrowRight className="h-5 w-5" />
            </EditableLink>
          </div>
        </div>
      </div>
    </div>
  );
};
