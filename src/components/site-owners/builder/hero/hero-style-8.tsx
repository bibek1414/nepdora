"use client";

import React, { useState } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate8Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroTemplate8Props {
  heroData: HeroTemplate8Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate8Data>) => void;
}

export const HeroTemplate8: React.FC<HeroTemplate8Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();

  // Default data - moved before useState to fix initialization order
  const defaultFeatures = [
    { id: "1", text: "Hand Knotted" },
    { id: "2", text: "Premium Quality" },
    { id: "3", text: "Authentic" },
  ];

  const defaultTrustIndicators = {
    rating: "4.9/5",
    stars: "★★★★★",
    features: ["Free Shipping", "30-Day Returns"],
    customerText: "Trusted by 1000+ customers worldwide",
  };

  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#000000",
      primary: "#8B4513",
      primaryForeground: "#FFFFFF",
      secondary: "#D2691E",
      secondaryForeground: "#FFFFFF",
      background: "#FDFAF6",
      backgroundDark: "#1F2937",
    },
    fonts: {
      body: "Poppins, sans-serif",
      heading: "Unna, serif",
    },
  };

  const {
    data,
    setData,
    handleTextUpdate,
    handleButtonUpdate,
    handleArrayItemUpdate,
  } = useBuilderLogic(
    {
      ...heroData,
      features: heroData.features || defaultFeatures,
      trustIndicators: heroData.trustIndicators || defaultTrustIndicators,
    },
    onUpdate
  );


  // Default images
  const leftImageUrl =
    data.leftImageUrl ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
  const rightImageUrl =
    data.rightImageUrl ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";

  return (
    <section
      className="relative mx-auto max-w-7xl overflow-hidden bg-white"
      data-component-id={componentId}
    >
      {/* Desktop Layout */}
      <div className="">
        <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
          {/* Desktop: Three Column Layout */}
          <div className="hidden md:grid md:h-full md:min-h-[600px] md:grid-cols-3 lg:min-h-[700px]">
            {/* Left Image Column */}
            <div className="relative h-full min-h-[600px] lg:min-h-[700px]">
              <div className="group relative h-full w-full cursor-pointer overflow-hidden">
                <ImageEditOverlay
                  onImageSelect={(url) => {
                    const updatedData = {
                      ...data,
                      leftImageUrl: url,
                    };
                    setData(updatedData);
                    onUpdate?.({
                      leftImageUrl: url,
                    });
                  }}
                  imageWidth={800}
                  imageHeight={1000}
                  isEditable={isEditable}
                  folder="hero-rugs"
                  label="Change Left Image"
                  className="absolute inset-0 z-30 flex items-center justify-center bg-black/40"
                />
                <Image
                  src={leftImageUrl}
                  alt={data.leftImageAlt || "Left image"}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            {/* Center Content Column */}
            <div className="relative flex h-full min-h-[600px] flex-col items-center justify-center px-6 py-12 lg:min-h-[700px] lg:px-8">
              {/* Main Heading */}
              <EditableText
                value={data.title || "Premium Nepali Hand Knotted Rugs"}
                onChange={handleTextUpdate("title")}
                as="h1"
                className="mb-4 w-full text-center text-3xl leading-tight font-bold md:text-4xl lg:mb-6 lg:text-5xl"
                isEditable={isEditable}
                placeholder="Enter main title..."
                multiline={true}
              />

              {/* Description */}
              <EditableText
                value={
                  data.description ||
                  "Experience the timeless beauty of authentic Nepali craftsmanship. Each rug tells a story of tradition, patience, and unparalleled artistry passed down through generations."
                }
                onChange={handleTextUpdate("description")}
                as="p"
                className="mb-8 w-full text-center text-sm leading-relaxed md:mb-10 md:text-base lg:mb-12 lg:text-lg"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                {data.buttons.length > 1 && (
                  <EditableLink
                    text={data.buttons[1]?.text || "View Menu"}
                    href={data.buttons[1]?.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(
                        data.buttons[1]?.id || "2",
                        text,
                        href
                      )
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="h-10 w-full rounded-lg border-2 bg-transparent px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gray-50 sm:w-auto sm:min-w-[140px] lg:h-12 lg:px-6 lg:text-base"
                    style={{
                      borderColor: theme.colors.primary,
                      color: theme.colors.primary,
                      fontFamily: theme.fonts.body,
                    }}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                )}

                {data.buttons.length > 0 && (
                  <EditableLink
                    text={data.buttons[0]?.text || "Order Now"}
                    href={data.buttons[0]?.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(
                        data.buttons[0]?.id || "1",
                        text,
                        href
                      )
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="h-10 w-full rounded-lg px-5 py-2.5 text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl sm:w-auto sm:min-w-[140px] lg:h-12 lg:px-6 lg:text-base"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                      fontFamily: theme.fonts.body,
                      boxShadow: `0 10px 25px ${theme.colors.primary}20`,
                    }}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                )}
              </div>
            </div>

            {/* Right Image Column */}
            <div className="relative h-full min-h-[600px] lg:min-h-[700px]">
              <div className="group relative h-full w-full cursor-pointer overflow-hidden">
                <ImageEditOverlay
                  onImageSelect={(url) => {
                    const updatedData = {
                      ...data,
                      rightImageUrl: url,
                    };
                    setData(updatedData);
                    onUpdate?.({
                      rightImageUrl: url,
                    });
                  }}
                  imageWidth={800}
                  imageHeight={1000}
                  isEditable={isEditable}
                  folder="hero-rugs"
                  label="Change Right Image"
                  className="absolute inset-0 z-30 flex items-center justify-center bg-black/40"
                />
                <Image
                  src={rightImageUrl}
                  alt={data.rightImageAlt || "Right image"}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="relative min-h-[500px] md:hidden">
            {/* Mobile Background Image */}
            {data.mobileImageUrl && (
              <div className="group absolute inset-0 cursor-pointer">
                <ImageEditOverlay
                  onImageSelect={(url) => {
                    const updatedData = {
                      ...data,
                      mobileImageUrl: url,
                    };
                    setData(updatedData);
                    onUpdate?.({
                      mobileImageUrl: url,
                    });
                  }}
                  imageWidth={600}
                  imageHeight={800}
                  isEditable={isEditable}
                  folder="hero-rugs"
                  label="Change Background"
                  className="absolute inset-0 z-30 flex items-center justify-center bg-black/40"
                />
                <Image
                  src={data.mobileImageUrl}
                  alt={data.mobileImageAlt || "Mobile background"}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              </div>
            )}

            {/* Mobile Content Overlay */}
            <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-center px-6 py-12">
              {/* Main Heading */}
              <EditableText
                value={data.title || "Premium Nepali Hand Knotted Rugs"}
                onChange={handleTextUpdate("title")}
                as="h1"
                className="mb-4 w-full text-center text-3xl leading-tight font-bold"
                isEditable={isEditable}
                placeholder="Enter main title..."
                multiline={true}
                style={{
                  fontFamily: theme.fonts.heading,
                  color: data.mobileImageUrl ? "#FFFFFF" : theme.colors.primary,
                }}
              />

              {/* Description */}
              <EditableText
                value={
                  data.description ||
                  "Experience the timeless beauty of authentic Nepali craftsmanship. Each rug tells a story of tradition, patience, and unparalleled artistry passed down through generations."
                }
                onChange={handleTextUpdate("description")}
                as="p"
                className="mb-8 w-full text-center text-sm leading-relaxed md:text-base"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
                style={{
                  fontFamily: theme.fonts.body,
                  color: data.mobileImageUrl ? "#FFFFFF" : theme.colors.text,
                }}
              />

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-4">
                {data.buttons.length > 1 && (
                  <EditableLink
                    text={data.buttons[1]?.text || "View Menu"}
                    href={data.buttons[1]?.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(
                        data.buttons[1]?.id || "2",
                        text,
                        href
                      )
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="h-10 w-full rounded-lg border-2 bg-transparent px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/10"
                    style={{
                      borderColor: data.mobileImageUrl
                        ? "#FFFFFF"
                        : theme.colors.primary,
                      color: data.mobileImageUrl
                        ? "#FFFFFF"
                        : theme.colors.primary,
                      fontFamily: theme.fonts.body,
                    }}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                )}

                {data.buttons.length > 0 && (
                  <EditableLink
                    text={data.buttons[0]?.text || "Order Now"}
                    href={data.buttons[0]?.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(
                        data.buttons[0]?.id || "1",
                        text,
                        href
                      )
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className="h-10 w-full rounded-lg px-5 py-2.5 text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                      fontFamily: theme.fonts.body,
                      boxShadow: `0 10px 25px ${theme.colors.primary}20`,
                    }}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
